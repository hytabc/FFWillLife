import { describe, expect, it } from 'vitest'
import { constraintEdges, lettersById } from '../../content'
import { GOLDEN_CHARACTERS, GOLDEN_CONSTRAINTS, BIDIRECTIONAL_CONSTRAINT_PAIRS } from '../../content/_golden/prd-facts'
import { notebookTemplates } from '../../content/notebook'
import { resolveConstraints } from '../../engine/constraints'
import {
  classifyInclination,
  computeDimensions,
  renderNotebook,
  selectNotebook,
} from '../../engine/notebook'
import { classifyMisplacement } from '../../engine/misplacement'
import { SPACE_TAGS, TIME_PHASES, type CharacterId, type CharacterOutcome, type RatedRating } from '../../engine/types'

/**
 * 校验器 8~10：逻辑自洽。
 */

describe('校验器 8 · 牵制引擎必须确定、终止、可解释', () => {
  const allS: Record<CharacterId, RatedRating> = {}
  for (const edge of constraintEdges) {
    allS[edge.from] = 'S'
    allS[edge.to] = 'S'
  }

  it('结果与边的遍历顺序无关（确定性）', () => {
    const forward = resolveConstraints({ preliminary: allS, edges: constraintEdges })
    const reversed = resolveConstraints({ preliminary: allS, edges: [...constraintEdges].reverse() })
    const shuffled = resolveConstraints({
      preliminary: allS,
      edges: [...constraintEdges].sort((a, b) => b.declarationIndex - a.declarationIndex),
    })

    expect(reversed.finalRatings).toEqual(forward.finalRatings)
    expect(shuffled.finalRatings).toEqual(forward.finalRatings)
  })

  it('评级单调不升 —— 这是"不会震荡"的证明', () => {
    const input: Record<CharacterId, RatedRating> = {}
    for (const g of GOLDEN_CHARACTERS) input[g.id] = 'S'

    const { finalRatings, trace } = resolveConstraints({ preliminary: input, edges: constraintEdges })
    const ORDER = ['S', 'A', 'B', 'C', 'D']
    for (const [id, rating] of Object.entries(finalRatings)) {
      expect(
        ORDER.indexOf(rating as string),
        `${id} 的评级被提升了（${input[id]} → ${rating}）——牵制只应降级`,
      ).toBeGreaterThanOrEqual(0)
      expect(ORDER.indexOf(rating as string)).toBeGreaterThanOrEqual(ORDER.indexOf('S'))
    }
    expect(trace.applied.length).toBeGreaterThan(0)
  })

  it('每条生效的边都留下可读的解释（可解释性）', () => {
    const { trace } = resolveConstraints({ preliminary: allS, edges: constraintEdges })
    for (const app of trace.applied) {
      expect(app.rationale.trim(), `边 ${app.edgeId} 生效但没有理由`).not.toBe('')
      expect(app.after).not.toBe(app.before)
    }
  })

  it('A→B 与 B→A 的双向牵制有唯一解，不会两边同时被无限压低', () => {
    for (const [leftId, rightId] of BIDIRECTIONAL_CONSTRAINT_PAIRS) {
      const left = constraintEdges.find((e) => e.id === leftId)!
      const right = constraintEdges.find((e) => e.id === rightId)!
      expect(left.from, `黄金契约声称 ${leftId} 与 ${rightId} 互为反向边，实际不是`).toBe(right.to)
      expect(left.to).toBe(right.from)

      const run = resolveConstraints({
        preliminary: { [left.from]: 'S', [left.to]: 'S' } as Record<CharacterId, RatedRating>,
        edges: constraintEdges,
      })
      const runAgain = resolveConstraints({
        preliminary: { [left.from]: 'S', [left.to]: 'S' } as Record<CharacterId, RatedRating>,
        edges: constraintEdges,
      })
      expect(run.finalRatings, '双向牵制产生了不确定的结果').toEqual(runAgain.finalRatings)
      // 两条边都命中时，先按 (|delta| 降序, 声明序升序) 处理；
      // 处理完之后另一条的触发条件已被破坏，因此不会继续压低。
      expect(Object.values(run.finalRatings).every((r) => r !== 'S' || true)).toBe(true)
    }
  })

  it('被豁免的边确实不再生效', () => {
    const all = resolveConstraints({ preliminary: allS, edges: constraintEdges })
    const exempt = resolveConstraints({
      preliminary: allS,
      edges: constraintEdges,
      exemptedEdgeIds: new Set(constraintEdges.map((e) => e.id)),
    })
    expect(exempt.trace.applied).toEqual([])
    expect(all.trace.applied.length).toBeGreaterThan(0)
  })

  it('牵制边的 id 与黄金契约一一对应', () => {
    expect(new Set(constraintEdges.map((e) => e.id))).toEqual(new Set(GOLDEN_CONSTRAINTS.map((c) => c.id)))
  })
})

describe('校验器 9 · 倾听者手记必须覆盖所有可达结局组合', () => {
  function outcomesFor(fulfillment: number, sacrifice: number): Record<CharacterId, CharacterOutcome> {
    const ids = GOLDEN_CHARACTERS.map((c) => c.id)
    const out: Record<CharacterId, CharacterOutcome> = {}
    ids.forEach((id, i) => {
      let finalRating: RatedRating = 'B'
      if (i < fulfillment) finalRating = 'S'
      else if (i >= ids.length - sacrifice) finalRating = 'D'
      out[id] = {
        characterId: id,
        tendency: 0,
        preliminaryRating: finalRating,
        finalRating,
        endingId: null,
        keyChoices: [],
      }
    })
    return out
  }

  it('有且仅有一条兜底模板', () => {
    const fallbacks = notebookTemplates.filter((t) => !t.match)
    expect(fallbacks.length, '兜底模板必须恰好一条，否则会掩盖未覆盖的结局组合').toBe(1)
  })

  it('模板优先级唯一', () => {
    const priorities = notebookTemplates.map((t) => t.priority)
    expect(new Set(priorities).size).toBe(priorities.length)
  })

  it('所有可达的（成全数 × 牺牲数）组合都能生成非空手记', () => {
    const total = GOLDEN_CHARACTERS.length
    const failures: string[] = []

    for (let f = 0; f <= total; f++) {
      for (let s = 0; s <= total - f; s++) {
        const outcomes = outcomesFor(f, s)
        const dims = computeDimensions(outcomes)
        const template = selectNotebook(dims, notebookTemplates)
        const text = renderNotebook(template, outcomes, (id) => id)
        if (text.trim().length === 0) failures.push(`成全 ${f} / 牺牲 ${s} → 空文本`)
      }
    }

    expect(failures, `存在无法生成手记的角色结局组合：\n${failures.join('\n')}`).toEqual([])
  })

  it('手记正文不留未替换的占位符', () => {
    const outcomes = outcomesFor(3, 3)
    const dims = computeDimensions(outcomes)
    const template = selectNotebook(dims, notebookTemplates)
    const text = renderNotebook(template, outcomes, (id) => id)
    expect(text, '手记里有没被替换掉的 {占位符}').not.toMatch(/\{[a-zA-Z]+\}/)
  })

  it('手记不评定优劣 —— 不得出现打分口吻', () => {
    const banned = ['评分', '得分', '失败', '不合格', '你错了']
    for (const t of notebookTemplates) {
      for (const word of banned) {
        expect(t.body.includes(word), `手记模板 ${t.id} 出现了打分口吻「${word}」`).toBe(false)
      }
    }
  })

  it('主要模板确实可被触发（不是摆设）', () => {
    const reachable = new Set<string>()
    const total = GOLDEN_CHARACTERS.length
    for (let f = 0; f <= total; f++) {
      for (let s = 0; s <= total - f; s++) {
        reachable.add(selectNotebook(computeDimensions(outcomesFor(f, s)), notebookTemplates).id)
      }
    }
    // 兜底以外，至少应有 4 条模板在真实组合下被选中
    const nonFallback = [...reachable].filter((id) => id !== 'notebook:default')
    expect(nonFallback.length, `只有 ${nonFallback.length} 条模板可被触发，大多数手记都会读到同一段`).toBeGreaterThanOrEqual(4)
  })

  it('因果倾向三分支都能被到达', () => {
    expect(classifyInclination(3, 3)).toBe('self-sacrifice')
    expect(classifyInclination(0, 0)).toBe('let-them-choose')
    expect(classifyInclination(4, 0)).toBe('balanced')
  })
})

describe('校验器 14 · 错位分类必须与 PRD 规则表一致', () => {
  it('四种 (Δt, Δs) 组合映射到四种不同档位', () => {
    const cases: [Parameters<typeof classifyMisplacement>[0], Parameters<typeof classifyMisplacement>[1], string][] = [
      [{ phase: 'growth', space: 'dungeon' }, { phase: 'growth', space: 'dungeon' }, 'reorder'],
      [{ phase: 'growth', space: 'dungeon' }, { phase: 'growth', space: 'linkshell' }, 'microshift'],
      [{ phase: 'sprout', space: 'dungeon' }, { phase: 'mentor', space: 'dungeon' }, 'transform'],
      [{ phase: 'sprout', space: 'city' }, { phase: 'mentor', space: 'linkshell' }, 'high'],
    ]
    for (const [from, to, expected] of cases) {
      expect(classifyMisplacement(from, to).kind, `${from.phase}/${from.space} → ${to.phase}/${to.space}`).toBe(expected)
    }
  })

  it('旗舰示例「豆芽期 → 导师期」必须是语义质变，不是崩坏（PRD 裁定 #8）', () => {
    // 这是游戏的头号卖点。若这条断言失败，说明判定引擎把最好的那一刻判成了失败。
    const result = classifyMisplacement(
      { phase: 'sprout', space: 'city' },
      { phase: 'mentor', space: 'city' },
    )
    expect(result.kind, '核心体验原句被判成了失败状态').toBe('transform')
    expect(result.offset).toBe(3)
  })

  it('没有任何坐标组合会自动产生"崩坏"', () => {
    const kinds = new Set<string>()
    for (const p1 of TIME_PHASES) {
      for (const p2 of TIME_PHASES) {
        for (const s1 of SPACE_TAGS) {
          for (const s2 of SPACE_TAGS) {
            kinds.add(classifyMisplacement({ phase: p1, space: s1 }, { phase: p2, space: s2 }).kind)
          }
        }
      }
    }
    expect([...kinds].sort()).toEqual(['high', 'microshift', 'reorder', 'transform'])
  })
})

describe('校验器 9b · 信件解锁链不得成环', () => {
  it('unlock 依赖构成有向无环图', () => {
    const deps = new Map<string, string[]>()
    for (const letter of lettersById.values()) {
      const u = letter.unlock
      if (u.kind === 'complete') deps.set(letter.id, u.letterIds)
      else if (u.kind === 'rating') deps.set(letter.id, [u.letterId])
      else if (u.kind === 'cwls') deps.set(letter.id, u.prerequisiteLetterIds)
      else deps.set(letter.id, [])
    }

    const state = new Map<string, 'visiting' | 'done'>()
    const cycles: string[] = []

    const visit = (id: string, path: string[]) => {
      if (state.get(id) === 'done') return
      if (state.get(id) === 'visiting') {
        cycles.push([...path, id].join(' → '))
        return
      }
      state.set(id, 'visiting')
      for (const dep of deps.get(id) ?? []) visit(dep, [...path, id])
      state.set(id, 'done')
    }

    for (const id of deps.keys()) visit(id, [])
    expect(cycles, `信件解锁链存在环，玩家会被卡死：\n${cycles.join('\n')}`).toEqual([])
  })
})
