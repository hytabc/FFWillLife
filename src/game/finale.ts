import { characters, coexistConditions, constraintEdges } from '../content'
import { notebookTemplates } from '../content/notebook'
import { computeTendency, resolveCharacterOutcomes, applyFinalRatings } from '../engine/characterTracker'
import { detectCoexist, exemptedEdgeIds, grantedRatings } from '../engine/coexist'
import { resolveConstraints } from '../engine/constraints'
import { computeDimensions, renderNotebook, selectNotebook } from '../engine/notebook'
import type {
  CharacterId,
  CharacterOutcome,
  CoexistCondition,
  GlobalEndingDimensions,
  NotebookTemplate,
  Rating,
  ResolutionTrace,
  TendencyEvent,
} from '../engine/types'
import type { SettledLetter } from '../store/gameStore'

/**
 * 终章结算 —— 把一周目的所有选择收敛成"倾听者手记"。
 *
 * 这是 PRD 三层结局结构的第三层，也是整个设计的收口：
 *
 *   倾向事件（唯一真相源）
 *     → 初步角色评级
 *     → 共存结局检测（豁免部分牵制边）
 *     → 牵制引擎（确定性消解）
 *     → 最终评级 + 手记
 *
 * **全过程纯函数、无缓存**：任何一步都不存储派生状态，
 * 因此读档后重算的结果必然与当初一致。
 */

export interface FinaleResult {
  /** 牵制调整**之前**的评级 */
  preliminary: Record<CharacterId, CharacterOutcome>
  /** 牵制调整**之后**的最终评级 */
  outcomes: Record<CharacterId, CharacterOutcome>
  coexistHits: CoexistCondition[]
  trace: ResolutionTrace
  dimensions: GlobalEndingDimensions
  notebook: string
  notebookTemplate: NotebookTemplate
  /** 有多少封信被结算过 */
  settledCount: number
}

/** 带外结局（X / 回响）的 special 条件 id 约定。 */
export function outOfBandConditionId(characterId: CharacterId, rating: 'X' | 'echo'): string {
  return `special:${characterId}-${rating === 'X' ? 'x' : 'echo'}`
}

/**
 * 从已结算信件推导 special 命中集合。
 *
 * 规则：一封信打出了 `echo`（回响）→ 该信涉及的角色，其回响级角色结局成立；
 * 打出 `X`（因果崩坏）→ 同理。这让 X / 回响**始终由玩家真实达成的行为触发**，
 * 而不是由倾向值区间意外落进去（PRD 裁定 #6）。
 */
export function deriveSpecialHits(
  settledLetters: Record<string, SettledLetter>,
  coexist: CoexistCondition[],
): Set<string> {
  const hits = new Set<string>(coexist.map((c) => c.id))

  for (const settled of Object.values(settledLetters)) {
    if (settled.rating !== 'X' && settled.rating !== 'echo') continue
    for (const characterId of settled.involvedCharacterIds) {
      hits.add(outOfBandConditionId(characterId, settled.rating))
    }
  }

  return hits
}

export function computeFinale(
  events: TendencyEvent[],
  settledLetters: Record<string, SettledLetter>,
): FinaleResult {
  // 1) 共存检测优先于牵制引擎（PRD §5.5）。
  //    它看的是"全局满足过哪些关键关系"，因此要跨所有已结算信件汇总。
  const allSatisfied = new Set<string>()
  for (const settled of Object.values(settledLetters)) {
    for (const relId of settled.satisfiedRelationIds) allSatisfied.add(relId)
  }
  const coexistHits = detectCoexist({
    conditions: coexistConditions,
    satisfiedRelationIds: allSatisfied,
  })

  // 2) 初步评级（倾向值区间映射 + special 触发）
  const specialHits = deriveSpecialHits(settledLetters, coexistHits)
  const preliminary = resolveCharacterOutcomes({ characters, events, specialHits })

  // 3) 牵制引擎：被共存结局豁免的边不生效
  const { finalRatings, trace } = resolveConstraints({
    preliminary: Object.fromEntries(
      Object.entries(preliminary).map(([id, o]) => [id, o.preliminaryRating]),
    ),
    edges: constraintEdges,
    exemptedEdgeIds: exemptedEdgeIds(coexistHits),
  })

  // 4) 共存结局直接授予的评级覆盖牵制结果
  const granted = grantedRatings(coexistHits)
  const merged: Record<CharacterId, Rating> = { ...finalRatings, ...granted }

  const outcomes = applyFinalRatings(preliminary, characters, merged, specialHits)

  // 5) 全局结局
  const dimensions = computeDimensions(outcomes)
  const notebookTemplate = selectNotebook(dimensions, notebookTemplates)
  const notebook = renderNotebook(notebookTemplate, outcomes, (id) => {
    return characters.find((c) => c.id === id)?.name ?? id
  })

  return {
    preliminary,
    outcomes,
    coexistHits,
    trace,
    dimensions,
    notebook,
    notebookTemplate,
    settledCount: Object.keys(settledLetters).length,
  }
}

/** 供 UI 显示的"谁把谁压下去了"。 */
export function describePressure(trace: ResolutionTrace): string[] {
  return trace.applied.map((a) => {
    return `${nameOf(a.from)} 的高评级压住了 ${nameOf(a.to)}：${a.before} → ${a.after}。${a.rationale}`
  })
}

function nameOf(id: string): string {
  return characters.find((c) => c.id === id)?.name ?? id
}

export { computeTendency }
