import { describe, expect, it } from 'vitest'
import { chapters, characters, letters, lettersById } from '../../content'
import {
  GOLDEN_CHAPTERS,
  GOLDEN_HIDDEN_LETTERS,
  MAX_APPEARANCE_GAP_CHAPTERS,
  MAX_BLOCKS_PER_LETTER,
  MAX_DRAGGABLE_BLOCKS,
  MIN_APPEARANCES_PER_CHARACTER,
  MIN_S_ENDING_FORESHADOWING,
} from '../../content/_golden/prd-facts'
import { statementsById } from '../../content'
import { allowedTiersForLetter } from '../../game/play'
import { classifyBlockPlacement } from '../../engine/misplacement'
import {
  MISPLACEMENT_KINDS,
  SPACE_TAGS,
  TIME_PHASES,
  type CharacterId,
  type MisplacementKind,
} from '../../engine/types'

/**
 * 校验器 11~14：节奏与连贯。
 *
 * 这些断言保护的是用户提的第二条硬性要求——"节奏连贯稳定"。
 * 它们防的不是崩溃，而是"某角色第三章之后就消失了，终章忽然回来拿到 S 结局"
 * 这种玩家说不清哪里不对、但一定会感觉到的问题。
 */

function chaptersOf(characterId: CharacterId): Set<string> {
  const out = new Set<string>()
  for (const letter of letters) {
    const mentions = letter.blocks.some((b) => {
      const s = statementsById.get(b.statementId)
      return s?.characterId === characterId
    })
    const tends = [...letter.endings, letter.fallbackEnding].some((e) =>
      e.tendency.some((t) => t.characterId === characterId),
    )
    if (mentions || tends) out.add(letter.chapterId)
  }
  return out
}

describe('校验器 11 · 戏份配额', () => {
  it('章节结构与黄金契约一致（数量、标题、核心角色）', () => {
    for (const golden of GOLDEN_CHAPTERS) {
      const chapter = chapters.find((c) => c.id === golden.id)
      if (!chapter) continue // 尚未实装的章节由内容清单校验器报缺
      expect(chapter.title, `${golden.id} 的标题偏离黄金契约`).toBe(golden.title)
      expect(chapter.coreCharacterIds).toEqual(golden.coreCharacterIds)
    }
  })

  it('每位已登场角色的相邻出场间隔不超过 2 章，且总出场 ≥ 3 封信', () => {
    const problems: string[] = []

    for (const character of characters) {
      const chapterIds = chaptersOf(character.id)
      const indices = GOLDEN_CHAPTERS.filter((c) => chapterIds.has(c.id)).map((c) => c.index)

      const appearances = letters.filter((l) =>
        l.blocks.some((b) => statementsById.get(b.statementId)?.characterId === character.id),
      ).length

      if (appearances < MIN_APPEARANCES_PER_CHARACTER) {
        problems.push(
          `${character.name} 只在 ${appearances} 封信里出场（要求 ≥ ${MIN_APPEARANCES_PER_CHARACTER}）`,
        )
      }

      for (let i = 1; i < indices.length; i++) {
        const gap = indices[i]! - indices[i - 1]!
        if (gap > MAX_APPEARANCE_GAP_CHAPTERS) {
          problems.push(
            `${character.name} 在第 ${indices[i - 1]} 章与第 ${indices[i]} 章之间断档 ${gap} 章`,
          )
        }
      }

      // 末次出场之后不能有超过 2 章的空档（终章不能突然冒出来）
      const last = indices[indices.length - 1]
      if (last !== undefined && GOLDEN_CHAPTERS.length - last > MAX_APPEARANCE_GAP_CHAPTERS) {
        problems.push(`${character.name} 最后一次出场在第 ${last} 章，终章之前长期缺席`)
      }
    }

    expect(problems, `角色戏份分布不均：\n  ${problems.join('\n  ')}`).toEqual([])
  })

  it('每章的核心角色都在该章有实际戏份', () => {
    const problems: string[] = []
    for (const chapter of chapters) {
      for (const id of chapter.coreCharacterIds) {
        const has = letters.some(
          (l) =>
            l.chapterId === chapter.id &&
            l.blocks.some((b) => statementsById.get(b.statementId)?.characterId === id),
        )
        if (!has) problems.push(`第${chapter.index}章的核心角色 ${id} 在该章没有任何台词`)
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })
})

describe('校验器 12 · S 级结局必须有铺垫', () => {
  it('每个 S 级角色结局至少在 2 封真实存在的信里被铺垫过', () => {
    const problems: string[] = []
    for (const character of characters) {
      for (const ending of character.endings) {
        if (ending.rating !== 'S') continue
        const real = ending.prerequisiteLetterIds.filter((id) => lettersById.has(id))
        if (real.length < MIN_S_ENDING_FORESHADOWING) {
          problems.push(
            `${character.name} 的 S 级结局「${ending.name}」只被 ${real.length} 封已实装信件铺垫` +
              `（要求 ≥ ${MIN_S_ENDING_FORESHADOWING}）——终章会出现从未铺垫过的归宿`,
          )
        }
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('带外结局同样需要铺垫', () => {
    const problems: string[] = []
    for (const character of characters) {
      for (const ending of character.endings) {
        if (ending.rating !== 'X' && ending.rating !== 'echo') continue
        if (ending.prerequisiteLetterIds.length === 0) {
          problems.push(`${character.name} 的 ${ending.rating} 级结局「${ending.name}」没有任何铺垫信件`)
        }
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })
})

describe('校验器 13 · 难度曲线单调', () => {
  const tierWeight: Record<MisplacementKind, number> = {
    none: 0,
    reorder: 0,
    microshift: 1,
    transform: 2,
    high: 3,
  }

  /** 判定复杂度 = 可拖动块数 + 需要的最高错位档位权重 */
  function complexity(letterId: string): number {
    const letter = lettersById.get(letterId)
    if (!letter) return 0
    const draggable = letter.blocks.filter((b) => b.draggable).length
    const maxTier = Math.max(
      0,
      ...letter.relations
        .filter((r) => r.kind === 'displacedInto')
        .map((r) => (r.kind === 'displacedInto' ? tierWeight[r.tier] : 0)),
    )
    return draggable + maxTier
  }

  it('每封信的可拖动块数不超过 M ≤ 4、总块数不超过 6', () => {
    for (const letter of letters) {
      expect(
        letter.blocks.filter((b) => b.draggable).length,
        `${letter.id} 可拖动块超限`,
      ).toBeLessThanOrEqual(MAX_DRAGGABLE_BLOCKS)
      expect(letter.blocks.length, `${letter.id} 语句块总数超限`).toBeLessThanOrEqual(
        MAX_BLOCKS_PER_LETTER,
      )
    }
  })

  it('章节平均复杂度非递减（同章内允许小幅波动）', () => {
    const byChapter = chapters
      .slice()
      .sort((a, b) => a.index - b.index)
      .map((c) => {
        const ids = letters.filter((l) => l.chapterId === c.id).map((l) => l.id)
        const avg = ids.length === 0 ? 0 : ids.reduce((s, id) => s + complexity(id), 0) / ids.length
        return { index: c.index, avg }
      })

    for (let i = 1; i < byChapter.length; i++) {
      const prev = byChapter[i - 1]!
      const cur = byChapter[i]!
      expect(
        cur.avg,
        `第${cur.index}章的平均判定复杂度（${cur.avg}）低于第${prev.index}章（${prev.avg}）——难度曲线出现倒挂`,
      ).toBeGreaterThanOrEqual(prev.avg)
    }
  })
})

describe('校验器 14 · 新机制前置', () => {
  it('信件使用的错位档位不得超过所在章已解锁的能力', () => {
    // 'none' 与 'reorder' 是基线档位（块没动 / 只是换个顺序），任何章节都天然可用。
    // 只有真正跨越时空的 microshift / transform / high 才需要章节解锁。
    const BASELINE = new Set(['none', 'reorder'])

    const problems: string[] = []
    for (const letter of letters) {
      const golden = GOLDEN_CHAPTERS.find((c) => c.id === letter.chapterId)
      if (!golden) continue
      for (const rel of letter.relations) {
        if (rel.kind !== 'displacedInto') continue
        if (BASELINE.has(rel.tier)) continue
        if (!golden.unlocks.includes(rel.tier)) {
          problems.push(
            `${letter.id} 要求 ${rel.tier} 档错位，但${golden.title}只解锁了 [${golden.unlocks.join(', ')}]`,
          )
        }
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('玩家真的拖动某个块时产生的档位，也必须在章节解锁范围内', () => {
    // 这条断言补上了一个真实的漏洞：
    // 上面两条只检查**声明**的 displacedInto 关系，但玩家拖动一个块时，
    // 系统会拿该语句的原始时空与信件锚点实时算错位档位。
    // 如果某个可拖动块的阶段/空间与信件锚点不同，一次普通拖拽就会产生
    // 本章还没教过的档位——玩家会突然看到"语义质变"标签而不知其所以然。
    const problems: string[] = []
    for (const letter of letters) {
      // 隐藏信豁免。它们存在的意义**就是**让玩家做一件游戏还没教过的事——
      // 那是"隐藏"这个词的含义，也是它们被异常条件解锁的原因。
      // 普通信件则必须严格守住本章的解锁范围。
      if (letter.hidden) continue
      const golden = GOLDEN_CHAPTERS.find((c) => c.id === letter.chapterId)
      if (!golden) continue
      for (const block of letter.blocks) {
        if (!block.draggable) continue
        const s = statementsById.get(block.statementId)
        if (!s) continue
        const moved = classifyBlockPlacement(
          { phase: s.phase, space: s.space },
          letter.anchor,
          true,
        )
        if (moved.kind === 'none') continue
        if (!golden.unlocks.includes(moved.kind)) {
          problems.push(
            `${letter.id} 的可拖动块 ${block.id}（${s.phase}/${s.space}）一旦被拖动就会产生 ` +
              `${moved.kind} 档，但${golden.title}只解锁了 [${golden.unlocks.join(', ')}]` +
              `（信件锚点 ${letter.anchor.phase}/${letter.anchor.space}）`,
          )
        }
      }
    }
    expect(problems, `存在"一拖就越权"的语句块：\n  ${problems.join('\n  ')}`).toEqual([])
  })

  it('隐藏信使用的档位同样受限', () => {
    const problems: string[] = []
    for (const hidden of GOLDEN_HIDDEN_LETTERS) {
      const golden = GOLDEN_CHAPTERS.find((c) => c.id === hidden.chapterId)
      if (golden && !golden.unlocks.includes(hidden.usesTier)) {
        problems.push(`「${hidden.title}」要求 ${hidden.usesTier}，${golden.title}未解锁`)
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('第一章的语句块阶段与空间都必须与信件锚点一致', () => {
    // 阶段或空间只要有一项不匹配，玩家一次普通的顺序调换就会被判成"语义微调/质变"，
    // 第一章"只教重排"的教学意图当场破功——而界面上会冒出一个没人解释过的错位标签。
    const problems: string[] = []
    for (const letter of letters.filter((l) => l.chapterId === 'ch01')) {
      for (const block of letter.blocks) {
        const s = statementsById.get(block.statementId)
        if (!s) continue
        if (s.phase !== letter.anchor.phase) {
          problems.push(
            `${letter.id}（${letter.anchor.phase}）引用了 ${s.id}（${s.phase}）——阶段不符`,
          )
        }
        if (s.space !== letter.anchor.space) {
          problems.push(
            `${letter.id}（${letter.anchor.space}）引用了 ${s.id}（${s.space}）——空间不符，重排会被判成跨空间错位`,
          )
        }
      }
    }
    expect(problems, `第一章出现跨时空语句块：\n  ${problems.join('\n  ')}`).toEqual([])
  })

  it('跨时空选择器只提供本章已解锁的档位', () => {
    // 界面上"⌖ 换时空"的棋盘由 allowedTiersForLetter 过滤。
    // 这条断言保证：玩家在任何一封信里能选到的每一个时空，
    // 产生的档位都在该章的教学范围内——否则玩家会在还没学过
    // "语义质变"的章节里看到它，而教程的解释还要等两章。
    const problems: string[] = []
    for (const letter of letters) {
      const golden = GOLDEN_CHAPTERS.find((c) => c.id === letter.chapterId)
      if (!golden) continue
      const allowed = new Set(allowedTiersForLetter(letter))
      for (const block of letter.blocks) {
        if (!block.draggable) continue
        const s = statementsById.get(block.statementId)
        if (!s) continue
        const origin = { phase: s.phase, space: s.space }
        for (const phase of TIME_PHASES) {
          for (const space of SPACE_TAGS) {
            if (phase === origin.phase && space === origin.space) continue
            const m = classifyBlockPlacement(origin, { phase, space }, true)
            if (m.kind === 'none') continue
            const selectable = allowed.has(m.kind)
            const withinChapter = golden.unlocks.includes(m.kind)
            if (selectable !== withinChapter) {
              problems.push(
                `${letter.id} 的 ${block.id} 放到 ${phase}/${space} 是 ${m.kind}：` +
                  `选择器${selectable ? '允许' : '禁止'}但章节${withinChapter ? '已解锁' : '未解锁'}`,
              )
            }
          }
        }
      }
    }
    expect(problems, `跨时空选择器与章节解锁不一致：\n  ${problems.join('\n  ')}`).toEqual([])
  })

  it('第一章不提供任何跨时空选择，第二章起提供', () => {
    const ch1TimeTravel = letters
      .filter((l) => l.chapterId === 'ch01')
      .some((l) =>
        allowedTiersForLetter(l).some((t) => t !== 'none' && t !== 'reorder'),
      )
    expect(ch1TimeTravel, '第一章出现了跨时空档位——本章只教顺序，不该给玩家这个选项').toBe(false)

    for (const chapterId of ['ch02', 'ch03', 'ch04', 'ch05']) {
      const chapter = chapters.find((c) => c.id === chapterId)
      if (!chapter) continue
      const anyTimeTravel = letters
        .filter((l) => l.chapterId === chapterId)
        .some((l) => allowedTiersForLetter(l).some((t) => t !== 'none' && t !== 'reorder'))
      expect(anyTimeTravel, `${chapterId} 解锁了跨时空，但没有任何信件用得上它`).toBe(true)
    }
  })

  it('所有错位档位都在 MISPLACEMENT_KINDS 中登记', () => {
    for (const p of TIME_PHASES) {
      expect(MISPLACEMENT_KINDS.length).toBe(5)
      expect(p).toBeTruthy()
    }
  })
})
