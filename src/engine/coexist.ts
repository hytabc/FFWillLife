import type {
  CharacterId,
  CoexistCondition,
  ConstraintEdgeId,
  Rating,
  RelationId,
} from './types'

/**
 * 共存结局检测（PRD §5.5）。
 *
 * 共存结局是"让两个看似矛盾的结局同时成立"的隐藏解，
 * **优先于牵制引擎执行** —— 命中后豁免指定的牵制边，并直接授予指定评级。
 */

/** 引擎与内容共享的特殊条件 id 常量表。内容侧只允许引用这些 id。 */
export const SPECIAL_CONDITION_IDS = {
  /** 小星 X「回响·闭环」 */
  XIAOXING_ECHO: 'special:xiaoxing-echo',
  /** H01「给未来的自己」回响 */
  H01_ECHO: 'special:h01-echo',
  /** H03「首杀那天的语音」因果崩坏 */
  H03_COLLAPSE: 'special:h03-collapse',
  /** H04「面具与真名」回响 */
  H04_ECHO: 'special:h04-echo',
  /** H05「致倾听者」真结局 */
  H05_TRUE: 'special:h05-true',
} as const

export type SpecialConditionId = (typeof SPECIAL_CONDITION_IDS)[keyof typeof SPECIAL_CONDITION_IDS]

export interface CoexistInput {
  conditions: CoexistCondition[]
  /** 跨全部已结算信件累积满足的关系 id 集合 */
  satisfiedRelationIds: ReadonlySet<RelationId>
}

/** 返回全部命中的共存条件。空数组表示没有共存结局成立。 */
export function detectCoexist(input: CoexistInput): CoexistCondition[] {
  return input.conditions
    .filter((c) => c.requires.every((r) => input.satisfiedRelationIds.has(r)))
    .sort((a, b) => a.id.localeCompare(b.id)) // 确定性
}

/** 被共存结局豁免的牵制边。 */
export function exemptedEdgeIds(hits: CoexistCondition[]): Set<ConstraintEdgeId> {
  const out = new Set<ConstraintEdgeId>()
  for (const h of hits) for (const id of h.exempts) out.add(id)
  return out
}

/**
 * 共存结局直接授予的评级。多个共存结局同时命中同一角色时，
 * 取其中**最好**的评级（索引最小），并保持确定性。
 */
export function grantedRatings(hits: CoexistCondition[]): Record<CharacterId, Rating> {
  const out: Record<CharacterId, Rating> = {}
  const best: Record<CharacterId, number> = {}
  const RANK_ORDER = ['S', 'A', 'B', 'C', 'D'] as const

  for (const h of [...hits].sort((a, b) => a.id.localeCompare(b.id))) {
    for (const g of h.grants) {
      const idx = (RANK_ORDER as readonly string[]).indexOf(g.rating)
      const rank = idx === -1 ? Number.POSITIVE_INFINITY : idx
      const current = best[g.characterId]
      if (current === undefined || rank < current) {
        best[g.characterId] = rank
        out[g.characterId] = g.rating
      }
    }
  }

  return out
}

/** 供 characterTracker 用的 special 命中集合：共存结局各自也是一个 special 条件。 */
export function coexistSpecialHits(hits: CoexistCondition[]): Set<string> {
  return new Set(hits.map((h) => h.id))
}
