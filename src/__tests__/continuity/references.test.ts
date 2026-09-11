import { describe, expect, it } from 'vitest'
import {
  chapters,
  characters,
  charactersById,
  charactersUsingTerm,
  coexistConditions,
  constraintEdges,
  glossaryEntries,
  glossaryById,
  letters,
  lettersById,
  statementsById,
} from '../../content'
import {
  GOLDEN_CHARACTER_CHAPTER_ANCHORS,
  GOLDEN_CHARACTER_IDS,
} from '../../content/_golden/prd-facts'
import { TIME_PHASES } from '../../engine/types'

/**
 * 校验器 1~3：引用完整性。
 *
 * 这些断言看起来琐碎，但 28 封信 × 上百个 id 的体量下，
 * 一个拼错的 id 会让一整类结局**永远无法触发**且没有任何报错——
 * 玩家只会觉得"这个游戏好像有个结局打不出来"。
 */

describe('校验器 1 · 引用完整性', () => {
  it('每封信的 chapterId 都指向真实章节', () => {
    const chapterIds = new Set(chapters.map((c) => c.id))
    for (const letter of letters) {
      expect(chapterIds, `信件 ${letter.id} 的章节 ${letter.chapterId} 不存在`).toContain(
        letter.chapterId,
      )
    }
  })

  it('章节声明的 letterIds 与信件库一致', () => {
    for (const chapter of chapters) {
      for (const id of chapter.letterIds) {
        const letter = lettersById.get(id)
        expect(letter, `章节 ${chapter.id} 引用了不存在的信件 ${id}`).toBeDefined()
        expect(letter?.chapterId, `信件 ${id} 归属章节与 ${chapter.id} 不符`).toBe(chapter.id)
      }
    }
  })

  it('每个语句块都指向真实语句，且语句属于该块的时空', () => {
    for (const letter of letters) {
      for (const block of letter.blocks) {
        const statement = statementsById.get(block.statementId)
        expect(statement, `信件 ${letter.id} 的块 ${block.id} 引用了不存在的语句`).toBeDefined()
      }
    }
  })

  it('关键关系的 subject/object 都指向本信内真实存在的块', () => {
    for (const letter of letters) {
      const blockIds = new Set(letter.blocks.map((b) => b.id))
      for (const rel of letter.relations) {
        const refs: string[] = []
        if ('subject' in rel) refs.push(rel.subject)
        if ('object' in rel) refs.push(rel.object)
        if (rel.kind === 'carryPresent' && rel.block !== undefined) refs.push(rel.block)
        for (const ref of refs) {
          expect(blockIds, `信件 ${letter.id} 的关系 ${rel.id} 引用了不存在的块 ${ref}`).toContain(ref)
        }
      }
    }
  })

  it('结局的 requires/forbids 都指向本信内真实存在的关系', () => {
    for (const letter of letters) {
      const relIds = new Set(letter.relations.map((r) => r.id))
      const allEndings = [...letter.endings, letter.fallbackEnding]
      for (const ending of allEndings) {
        for (const ref of [...ending.requires, ...(ending.forbids ?? [])]) {
          expect(relIds, `信件 ${letter.id} 的结局 ${ending.id} 引用了不存在的关系 ${ref}`).toContain(
            ref,
          )
        }
      }
    }
  })

  it('结局的 tendency 指向真实角色', () => {
    for (const letter of letters) {
      for (const ending of [...letter.endings, letter.fallbackEnding]) {
        for (const t of ending.tendency) {
          expect(
            charactersById.has(t.characterId),
            `${ending.id} 的倾向事件指向不存在的角色 ${t.characterId}`,
          ).toBe(true)
          expect(t.reason.trim(), `${ending.id} 的倾向事件缺少 reason（UI 要显示它）`).not.toBe('')
        }
      }
    }
  })

  it('语句的 terms 都在词典中存在', () => {
    for (const character of characters) {
      for (const statement of character.statements) {
        for (const termId of statement.terms) {
          expect(
            glossaryById.has(termId),
            `语句 ${statement.id} 标注了词典中不存在的术语 ${termId}`,
          ).toBe(true)
        }
      }
    }
  })

  it('语句的时空标签合法', () => {
    for (const character of characters) {
      for (const statement of character.statements) {
        expect(TIME_PHASES).toContain(statement.phase)
        expect(statement.carries.length, `语句 ${statement.id} 没有任何语义标签`).toBeGreaterThan(0)
      }
    }
  })

  it('牵制边的两端都是真实角色，且 id 唯一', () => {
    const seen = new Set<string>()
    for (const edge of constraintEdges) {
      expect(seen.has(edge.id), `牵制边 id 重复: ${edge.id}`).toBe(false)
      seen.add(edge.id)
      expect(charactersById.has(edge.from), `牵制边 ${edge.id} 的 from 不存在`).toBe(true)
      expect(charactersById.has(edge.to), `牵制边 ${edge.id} 的 to 不存在`).toBe(true)
      expect(edge.rationale.trim(), `牵制边 ${edge.id} 缺少叙事理由`).not.toBe('')
    }
  })

  it('角色的 prerequisiteLetterIds 都指向真实信件', () => {
    for (const character of characters) {
      for (const ending of character.endings) {
        for (const id of ending.prerequisiteLetterIds) {
          expect(
            lettersById.has(id),
            `角色 ${character.id} 的结局 ${ending.id} 铺垫信件 ${id} 不存在`,
          ).toBe(true)
        }
      }
    }
  })

  it('共存结局的豁免边与授予角色都存在', () => {
    const edgeIds = new Set(constraintEdges.map((e) => e.id))
    for (const coexist of coexistConditions) {
      for (const id of coexist.exempts) {
        expect(edgeIds, `共存结局 ${coexist.id} 豁免了不存在的牵制边 ${id}`).toContain(id)
      }
      for (const grant of coexist.grants) {
        expect(
          charactersById.has(grant.characterId),
          `共存结局 ${coexist.id} 授予了不存在的角色 ${grant.characterId}`,
        ).toBe(true)
      }
    }
  })

  it('词典的交叉引用有效', () => {
    for (const entry of glossaryEntries) {
      for (const id of entry.relatedTermIds) {
        expect(glossaryById.has(id), `术语 ${entry.id} 关联了不存在的术语 ${id}`).toBe(true)
      }
      for (const id of entry.linkedCharacterIds) {
        expect(charactersById.has(id), `术语 ${entry.id} 关联了不存在的角色 ${id}`).toBe(true)
      }
    }
  })
})

describe('校验器 2 · 黑话标注闭环', () => {
  it('信件正文（旁白）不得使用需要注释的黑话 —— 语言分层铁律', () => {
    // 旁白与系统描述必须保持通用语言；黑话只出现在玩家之间的对话里。
    // 标记为 transparent 的词（固定队、挂机、公寓…）对零 FF14 知识的读者
    // 也能从字面读懂，不构成门槛，因此豁免。
    for (const letter of letters) {
      for (const entry of glossaryEntries) {
        if (entry.transparent) continue
        // 只有长度 >= 2 的词才检查，避免误伤单字
        if (entry.term.length < 2) continue
        expect(
          letter.preamble.includes(entry.term),
          `信件 ${letter.id} 的旁白里出现了黑话「${entry.term}」——请把它挪进语句块，` +
            `或在词典中将其标记为 transparent（若字面即可读懂）`,
        ).toBe(false)
      }
    }
  })
})

describe('校验器 3 · 词典关联角色不得虚报', () => {
  it('词典声称使用某术语的角色，必须真的说过这个词', () => {
    const actualUsers = new Map<string, Set<string>>()
    for (const character of characters) {
      for (const statement of character.statements) {
        for (const termId of statement.terms) {
          const set = actualUsers.get(termId) ?? new Set<string>()
          set.add(character.id)
          actualUsers.set(termId, set)
        }
      }
    }

    for (const entry of glossaryEntries) {
      const users = actualUsers.get(entry.id) ?? new Set<string>()
      for (const claimed of entry.linkedCharacterIds) {
        expect(
          users.has(claimed),
          `词典「${entry.term}」声称 ${claimed} 会用它，但该角色的语句里找不到这个词`,
        ).toBe(true)
      }
    }
  })

  it('每个被使用的术语都能在词典中查到（反向）', () => {
    for (const character of characters) {
      for (const statement of character.statements) {
        for (const termId of statement.terms) {
          expect(glossaryById.get(termId), `术语 ${termId} 不存在`).toBeDefined()
        }
      }
    }
  })

  /**
   * 这里**刻意不再**要求「被使用的术语必须在词典里声明使用角色」。
   *
   * 那条规则试过一轮，结论是它是错的：它让词典成了内容的**守门人**——
   * 只要某个词条的 linkedCharacterIds 是空的，任何角色都不能再说这个词，
   * 哪怕台词写得完全合理。结果是梗类术语（苍穹保安队、天地万象皆随我意）
   * 全书无人敢用，而它们恰恰是 PRD 最看重的社区语言。
   *
   * 正确的分工是：`linkedCharacterIds` 只作为**编辑注记**（3a 保证它不虚报），
   * 而「谁真的用这个词」由台词数据派生（见 content/index.ts 的 charactersUsingTerm）。
   * 派生数据不可能过期，也不需要一个字段来同步 27 封信。
   */
  it('派生出的使用角色与词条注记一致（注记必须是实际使用的子集）', () => {
    const derived = charactersUsingTerm()
    for (const entry of glossaryEntries) {
      for (const claimed of entry.linkedCharacterIds) {
        expect(
          derived.get(entry.id)?.includes(claimed) ?? false,
          `词典「${entry.term}」注记了 ${claimed}，但该角色的台词里没有这个词`,
        ).toBe(true)
      }
    }
  })
})

describe('校验器 10 · 阶段可达性', () => {
  it('角色不得引用尚未存在的成长阶段语句', () => {
    for (const character of characters) {
      const allowed = new Set(TIME_PHASES)
      for (const statement of character.statements) {
        expect(allowed, `${statement.id} 的阶段非法`).toContain(statement.phase)
      }
    }
  })

  it('每封信引用的角色阶段不得晚于该角色在这一章的锚点', () => {
    // 规则来自 docs/STORY-BIBLE.md §5.2：单向上界。
    // 用更早的阶段是允许的（那是回忆），晚于锚点则是"未来的人说了现在的话"。
    const problems: string[] = []

    for (const letter of letters) {
      const chapter = chapters.find((c) => c.id === letter.chapterId)
      if (!chapter) continue
      const chIdx = chapter.index - 1

      for (const block of letter.blocks) {
        const statement = statementsById.get(block.statementId)
        if (!statement) continue
        const anchors = GOLDEN_CHARACTER_CHAPTER_ANCHORS[statement.characterId]
        if (!anchors) continue
        const anchor = anchors[chIdx]
        if (!anchor) {
          problems.push(
            `${letter.id} 引用了 ${statement.characterId} 的台词，` +
              `但该角色在第${chapter.index}章尚未登场（锚点为空）`,
          )
          continue
        }
        if (TIME_PHASES.indexOf(statement.phase) > TIME_PHASES.indexOf(anchor)) {
          problems.push(
            `${letter.id} 使用了 ${statement.id}（${statement.phase}），` +
              `但 ${statement.characterId} 在第${chapter.index}章只活到「${anchor}」`,
          )
        }
      }
    }

    expect(problems, `出现了时间线穿越的语句块：\n  ${problems.join('\n  ')}`).toEqual([])
  })
})

describe('内容清单 · 目前覆盖到的角色', () => {
  it('角色 id 必须在黄金契约中登记', () => {
    for (const character of characters) {
      expect(
        GOLDEN_CHARACTER_IDS,
        `角色 ${character.id} 未在 prd-facts 中登记——若是有意新增，请同步 docs/PRD.md`,
      ).toContain(character.id)
    }
  })
})
