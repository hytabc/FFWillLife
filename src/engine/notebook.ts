import {
  type CharacterId,
  type CharacterOutcome,
  type GlobalEndingDimensions,
  type NotebookTemplate,
  ratedIndex,
} from './types'

/**
 * 倾听者手记（PRD §5.6）。
 *
 * 手记**不评定优劣**，只记录"这一周目中，你选择了怎样的因果"。
 * 它由角色结局组合纯函数推导 —— 不存储，因为它是派生状态。
 */

export function computeDimensions(
  outcomes: Record<CharacterId, CharacterOutcome>,
): GlobalEndingDimensions {
  let fulfillment = 0
  let sacrifice = 0

  for (const o of Object.values(outcomes)) {
    const idx = ratedIndex(o.finalRating)
    if (idx === null) continue // X / 回响 不计入成全或牺牲
    if (idx <= 1) fulfillment++ // S / A
    if (idx >= 3) sacrifice++ // C / D
  }

  // 平衡指数：成全与牺牲越接近越高（0~3）。
  const imbalance = Math.min(3, Math.abs(fulfillment - sacrifice))
  const balance = 3 - imbalance

  return { fulfillment, sacrifice, balance, inclination: classifyInclination(fulfillment, sacrifice) }
}

/**
 * 因果倾向。
 *
 * 判据是**结局的离散程度**，而不是玩家的主观意图：
 *  - 同时有人被成全、有人被辜负 → 玩家在为某一边付代价（self-sacrifice）
 *  - 所有人都停在中间           → 玩家让每个人各自承担选择的后果（let-them-choose）
 */
export function classifyInclination(
  fulfillment: number,
  sacrifice: number,
): GlobalEndingDimensions['inclination'] {
  if (fulfillment >= 2 && sacrifice >= 2) return 'self-sacrifice'
  if (fulfillment <= 1 && sacrifice <= 1) return 'let-them-choose'
  return 'balanced'
}

function templateMatches(t: NotebookTemplate, d: GlobalEndingDimensions): boolean {
  const m = t.match
  if (!m) return true // 兜底模板
  if (m.inclination && !m.inclination.includes(d.inclination)) return false
  if (m.fulfillment && !m.fulfillment.includes(d.fulfillment)) return false
  if (m.sacrifice && !m.sacrifice.includes(d.sacrifice)) return false
  if (m.balance && !m.balance.includes(d.balance)) return false
  return true
}

/**
 * 选手记模板。按 priority 升序取第一个命中的；
 * 必须有且仅有一条无 `match` 的兜底模板（校验器 9 断言）。
 */
export function selectNotebook(
  dimensions: GlobalEndingDimensions,
  templates: readonly NotebookTemplate[],
): NotebookTemplate {
  const ordered = [...templates].sort((a, b) => a.priority - b.priority)
  const hit = ordered.find((t) => templateMatches(t, dimensions))
  if (hit) return hit

  const fallback = ordered.find((t) => !t.match)
  if (!fallback) {
    throw new Error('倾听者手记缺少兜底模板——存在无法生成手记的角色结局组合')
  }
  return fallback
}

/** 把占位符替换成具体角色名。 */
export function renderNotebook(
  template: NotebookTemplate,
  outcomes: Record<CharacterId, CharacterOutcome>,
  nameOf: (id: CharacterId) => string,
): string {
  const entries = Object.values(outcomes)
  const fulfilled = entries.filter((o) => {
    const i = ratedIndex(o.finalRating)
    return i !== null && i <= 1
  })
  const sacrificed = entries.filter((o) => {
    const i = ratedIndex(o.finalRating)
    return i !== null && i >= 3
  })

  const join = (list: typeof entries) =>
    list.length === 0 ? '没有人' : list.map((o) => nameOf(o.characterId)).join('、')

  return template.body
    .replaceAll('{fulfilled}', join(fulfilled))
    .replaceAll('{sacrificed}', join(sacrificed))
    .replaceAll('{fulfilledCount}', String(fulfilled.length))
    .replaceAll('{sacrificedCount}', String(sacrificed.length))
}
