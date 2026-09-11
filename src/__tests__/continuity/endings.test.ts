import { describe, expect, it } from 'vitest'
import {
  chapters,
  characters,
  coexistConditions,
  constraintEdges,
  letters,
  lettersById,
} from '../../content'
import { GOLDEN_CONSTRAINTS, GOLDEN_HIDDEN_LETTERS, MAX_DRAGGABLE_BLOCKS } from '../../content/_golden/prd-facts'
import { TENDENCY_BANDS } from '../../content/_shared/endings'
import { detectCoexist, exemptedEdgeIds, grantedRatings } from '../../engine/coexist'
import { resolveConstraints } from '../../engine/constraints'
import { enumerateReorders } from '../../game/play'
import { RANKED_RATINGS, type CharacterId, type RatedRating } from '../../engine/types'

/**
 * 校验器 4~7：结局完备性。
 *
 * 这是"故事细节经得起推敲"最硬的那部分——它把 PRD 的设计承诺
 * 从"我们打算这样"变成"代码证明如此"。
 */

describe('校验器 4 · 每个可达排列都必须有手写结局', () => {
  for (const letter of letters) {
    it(`${letter.id}「${letter.title}」的全部排列都有结局，且不落到兜底`, () => {
      const results = enumerateReorders(letter)
      expect(results.length).toBeGreaterThan(1)

      const fellBack = results.filter((r) => r.resolution.usedFallback)
      expect(
        fellBack.length,
        `${letter.id} 有 ${fellBack.length} 种排列落到了 fallbackEnding —— ` +
          `这些排列下玩家会读到一句没为该组合写过的话：\n` +
          fellBack.map((r) => `  排列 ${r.arrangement.join(' → ')}`).join('\n'),
      ).toBe(0)
    })
  }
})

describe('校验器 5 · 不存在不可达结局', () => {
  for (const letter of letters) {
    it(`${letter.id} 的每个已写结局都能被至少一种排列触发`, () => {
      const reachable = new Set(enumerateReorders(letter).map((r) => r.resolution.ending.id))
      const orphans = letter.endings.filter((e) => !reachable.has(e.id))
      expect(
        orphans.map((e) => `${e.id}（${e.rating}「${e.title}」）`),
        `${letter.id} 存在永远无法触发的结局——写了但玩家打不出来`,
      ).toEqual([])
    })
  }

  it('结局 id 全局唯一', () => {
    const seen = new Map<string, string>()
    for (const letter of letters) {
      for (const ending of [...letter.endings, letter.fallbackEnding]) {
        const prev = seen.get(ending.id)
        expect(prev, `结局 id ${ending.id} 重复出现于 ${prev} 与 ${letter.id}`).toBeUndefined()
        seen.set(ending.id, letter.id)
      }
    }
  })

  it('同封信内结局优先级唯一，保证判定结果确定', () => {
    for (const letter of letters) {
      const priorities = letter.endings.map((e) => e.priority)
      expect(new Set(priorities).size, `${letter.id} 存在重复的结局优先级`).toBe(priorities.length)
    }
  })

  it('可拖动块数不超过硬约束 M ≤ 4（穷举完备性依赖它）', () => {
    for (const letter of letters) {
      const draggable = letter.blocks.filter((b) => b.draggable).length
      expect(draggable, `${letter.id} 有 ${draggable} 个可拖动块，超过上限`).toBeLessThanOrEqual(
        MAX_DRAGGABLE_BLOCKS,
      )
      expect(draggable, `${letter.id} 没有任何可拖动块，玩家无事可做`).toBeGreaterThan(0)
    }
  })
})

describe('校验器 6 · 不存在"全员 S"的常规解', () => {
  it('即使把全员都推到 S，牵制引擎也必然把至少一个人拉下来', () => {
    // 这是 PRD 核心设计哲学的代码化证明：
    // 「每个人的幸福并不总是兼容的」不能只是一句设定，必须真的成立。
    const allS: Record<CharacterId, RatedRating> = {}
    for (const edge of constraintEdges) {
      allS[edge.from] = 'S'
      allS[edge.to] = 'S'
    }

    const { finalRatings, trace } = resolveConstraints({
      preliminary: allS,
      edges: constraintEdges,
    })

    expect(trace.changed, '牵制引擎在全员 S 的输入下没有产生任何降级——它失效了').toBe(true)

    const dropped = Object.entries(finalRatings).filter(([, r]) => r !== 'S')
    expect(
      dropped.length,
      '全员 S 输入下没有任何角色被降级：本作承诺的"没有完美解"不成立',
    ).toBeGreaterThan(0)
  })

  it('牵制边覆盖了黄金契约声明的全部 6 条', () => {
    const actual = new Set(constraintEdges.map((e) => e.id))
    for (const golden of GOLDEN_CONSTRAINTS) {
      expect(actual, `黄金契约声明的牵制边 ${golden.id} 在内容中缺失`).toContain(golden.id)
    }
  })

  it('每条牵制边都指向黄金契约声明的角色对', () => {
    for (const golden of GOLDEN_CONSTRAINTS) {
      const edge = constraintEdges.find((e) => e.id === golden.id)
      expect(edge, `缺少牵制边 ${golden.id}`).toBeDefined()
      expect(`${edge!.from}→${edge!.to}`, `牵制边 ${golden.id} 的指向与 PRD 不符`).toBe(
        `${golden.from}→${golden.to}`,
      )
      expect(edge!.delta, `牵制边 ${golden.id} 的降级幅度与 PRD 不符`).toBe(golden.delta)
    }
  })
})

describe('校验器 7 · 共存结局必须真实可达', () => {
  it('每个共存结局引用的关键关系都真实存在于某封信中', () => {
    const allRelationIds = new Set(letters.flatMap((l) => l.relations.map((r) => r.id)))
    for (const coexist of coexistConditions) {
      for (const relId of coexist.requires) {
        expect(
          allRelationIds,
          `共存结局「${coexist.name}」要求关系 ${relId}，但没有任何信件定义它——` +
            `这个结局永远无法触发`,
        ).toContain(relId)
      }
    }
  })

  it('共存结局确实豁免了它该豁免的牵制边，且豁免后双边都能拿到 S', () => {
    for (const coexist of coexistConditions) {
      const exempted = exemptedEdgeIds([coexist])
      expect(exempted.size, `共存结局「${coexist.name}」没有豁免任何牵制边`).toBeGreaterThan(0)

      const granted = grantedRatings([coexist])
      for (const g of coexist.grants) {
        expect(granted[g.characterId], `共存结局「${coexist.name}」没有真的授予 ${g.characterId} 评级`).toBe(
          g.rating,
        )
      }

      // 反向验证：若不豁免，这些角色会被互相压制（这正是"看似矛盾"的来源）
      const withoutExemption = resolveConstraints({
        preliminary: Object.fromEntries(coexist.grants.map((g) => [g.characterId, g.rating])),
        edges: constraintEdges,
      })
      expect(
        withoutExemption.trace.changed,
        `共存结局「${coexist.name}」涉及的角色之间本来就不会互相压制，` +
          `那它就不该被称为"看似矛盾的结局"`,
      ).toBe(true)
    }
  })

  it('共存检测是确定性的：输入集合相同则结果相同', () => {
    const relIds = new Set(letters.flatMap((l) => l.relations.map((r) => r.id)))
    const a = detectCoexist({ conditions: coexistConditions, satisfiedRelationIds: relIds })
    const b = detectCoexist({ conditions: coexistConditions, satisfiedRelationIds: relIds })
    expect(a.map((c) => c.id)).toEqual(b.map((c) => c.id))
  })
})

describe('角色结局 · 倾向区间必须无重叠且完整覆盖', () => {
  it('每位角色的区间互不相交', () => {
    for (const character of characters) {
      const ranged = character.endings
        .filter((e) => e.trigger.kind === 'tendency')
        .map((e) => ({
          id: e.id,
          rating: e.rating,
          min: (e.trigger as { kind: 'tendency'; min: number; max?: number }).min,
          max: (e.trigger as { kind: 'tendency'; min: number; max?: number }).max ?? Infinity,
        }))

      for (let i = 0; i < ranged.length; i++) {
        for (let j = i + 1; j < ranged.length; j++) {
          const a = ranged[i]!
          const b = ranged[j]!
          const overlaps = a.min <= b.max && b.min <= a.max
          expect(overlaps, `${a.id} 与 ${b.id} 的倾向区间重叠——同一个倾向值会映射到两个结局`).toBe(
            false,
          )
        }
      }
    }
  })

  it('每一位角色都有一套完整的 S/A/B/C/D 常规结局', () => {
    for (const character of characters) {
      const ratings = new Set(character.endings.map((e) => e.rating))
      for (const r of RANKED_RATINGS) {
        expect(ratings, `角色 ${character.id} 缺少 ${r} 级结局`).toContain(r)
      }
    }
  })

  it('区间使用统一的 TENDENCY_BANDS，不允许各角色自定义阈值', () => {
    for (const character of characters) {
      for (const ending of character.endings) {
        if (ending.trigger.kind !== 'tendency') continue
        const band = TENDENCY_BANDS[ending.rating as keyof typeof TENDENCY_BANDS]
        if (!band) continue // X / echo 走 special，不参与
        expect(ending.trigger.min, `${ending.id} 的 min 偏离标准区间`).toBe(band.min)
      }
    }
  })

  it('带外结局（X / 回响）只能由 special 触发，不参与序数比较', () => {
    for (const character of characters) {
      for (const ending of character.endings) {
        if (ending.rating === 'X' || ending.rating === 'echo') {
          expect(
            ending.trigger.kind,
            `${ending.id} 是带外评级，却用了倾向值区间映射——它会被当成"等级高低"参与比较`,
          ).toBe('special')
        }
      }
    }
  })
})

describe('隐藏信件 · 必须与所在章的解锁能力相容', () => {
  it('每封隐藏信使用的错位档位都在其章节的解锁范围内（PRD 裁定 #9）', () => {
    for (const hidden of GOLDEN_HIDDEN_LETTERS) {
      const chapter = chapters.find((c) => c.id === hidden.chapterId)
      if (!chapter) continue // 章节尚未实装，由内容清单校验器负责报缺
      expect(
        chapter.unlocks,
        `隐藏信「${hidden.title}」要求 ${hidden.usesTier} 档，` +
          `但 ${chapter.title} 只解锁了 [${chapter.unlocks.join(', ')}]——` +
          `玩家会遇到一封无解的信`,
      ).toContain(hidden.usesTier)
    }
  })

  it('已实装的隐藏信确实被标记为 hidden', () => {
    for (const hidden of GOLDEN_HIDDEN_LETTERS) {
      const letter = lettersById.get(hidden.id)
      if (!letter) continue
      expect(letter.hidden, `${letter.id} 应在数据中标记为隐藏信`).toBe(true)
    }
  })
})
