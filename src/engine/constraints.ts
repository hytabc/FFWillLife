import {
  RANKED_RATINGS,
  type CharacterId,
  type ConstraintEdge,
  type ConstraintEdgeId,
  type RatedRating,
  type Rating,
  type ResolutionTrace,
  coerceToRated,
  ratedIndex,
} from './types'

export interface ConstraintInput {
  /** 出自 characterTracker 的初步评级 */
  preliminary: Record<CharacterId, Rating>
  edges: ConstraintEdge[]
  /** 被共存结局豁免的边 */
  exemptedEdgeIds?: ReadonlySet<ConstraintEdgeId>
}

export interface ConstraintResult {
  finalRatings: Record<CharacterId, Rating>
  trace: ResolutionTrace
}

/** 把评级按 |delta| 步降级，不低于 floorRating。 */
function demote(rating: RatedRating, steps: number, floorRating?: RatedRating): RatedRating {
  const from = ratedIndex(rating)
  // floorRating 一定是 RatedRating，因此 ratedIndex 不会返回 null；
  // 兜底到最差档只是为了让类型收窄，不改变语义。
  const floor =
    floorRating !== undefined
      ? (ratedIndex(floorRating) ?? RANKED_RATINGS.length - 1)
      : RANKED_RATINGS.length - 1
  if (from === null) return rating
  const target = Math.min(from + steps, RANKED_RATINGS.length - 1, floor)
  // 只降不升
  return RANKED_RATINGS[Math.max(from, target)] as RatedRating
}

/**
 * 结局牵制引擎（PRD §5.4）。
 *
 * 确定性 / 终止性 / 可解释性：
 *  - **终止**：评级单调不升。边 e 的触发条件 `from >= fromMinRating` 在评级下降后
 *    只会更难满足，处理某条边绝不会让新边变为可触发，故单趟处理即收敛，无震荡。
 *  - **确定**：排序键 (|delta| 降序, declarationIndex 升序) 是全序（声明序唯一），
 *    故结果与遍历顺序无关。
 *  - **可解释**：ResolutionTrace 逐条记录"哪条边、把谁从什么降到了什么、为什么"。
 */
export function resolveConstraints(input: ConstraintInput): ConstraintResult {
  const exempted = input.exemptedEdgeIds ?? new Set<ConstraintEdgeId>()

  const finalRatings: Record<CharacterId, Rating> = { ...input.preliminary }
  const trace: ResolutionTrace = {
    applied: [],
    exemptedEdgeIds: [...exempted],
    coexistsHit: [],
    changed: false,
  }

  const active = input.edges
    .filter((e) => !exempted.has(e.id))
    .sort((a, b) => {
      const bySeverity = Math.abs(b.delta) - Math.abs(a.delta)
      if (bySeverity !== 0) return bySeverity
      return a.declarationIndex - b.declarationIndex
    })

  for (const edge of active) {
    const source = finalRatings[edge.from]
    const target = finalRatings[edge.to]
    if (source === undefined || target === undefined) continue

    const sourceRated = coerceToRated(source)
    const threshold = ratedIndex(edge.fromMinRating)
    if (threshold === null) continue
    // 评级越高（索引越小）越容易满足门槛
    if (ratedIndex(sourceRated)! > threshold) continue

    const before = target
    const targetRated = coerceToRated(target)
    const after = demote(targetRated, Math.abs(edge.delta), edge.ratingsFloor)

    // 评级索引越大越差（S=0 … D=4）。因此：
    //   afterIdx <  beforeIdx → 这条边试图"提升"对方，是内容错误，忽略
    //   afterIdx == beforeIdx → 已经到底了，无事发生
    //   afterIdx >  beforeIdx → 有效降级，落账
    const beforeIdx = ratedIndex(targetRated)!
    const afterIdx = ratedIndex(after)!
    if (afterIdx <= beforeIdx) continue

    finalRatings[edge.to] = after
    trace.applied.push({
      edgeId: edge.id,
      from: edge.from,
      to: edge.to,
      fromRating: source,
      before,
      after,
      rationale: edge.rationale,
    })
    trace.changed = true
  }

  return { finalRatings, trace }
}
