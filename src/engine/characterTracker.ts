import {
  type Character,
  type CharacterEnding,
  type CharacterId,
  type CharacterOutcome,
  type Rating,
  type TendencyEvent,
  ratedIndex,
} from './types'

export interface TrackInput {
  characters: Character[]
  /** 存档中的唯一真相源 */
  events: TendencyEvent[]
  /** 由 special 触发器命中的 conditionId 集合（X / 回响走这里） */
  specialHits?: ReadonlySet<string>
}

/** 倾向值 = 该角色全部事件的 delta 之和。纯函数，不缓存。 */
export function computeTendency(events: TendencyEvent[], characterId: CharacterId): number {
  return events.reduce((sum, e) => (e.characterId === characterId ? sum + e.delta : sum), 0)
}

function matchingEnding(
  endings: CharacterEnding[],
  tendency: number,
  specialHits: ReadonlySet<string>,
): CharacterEnding | undefined {
  // 1) special 优先：X / 回响 是"故事脱离常轨"，压过常规区间映射。
  const special = endings
    .filter((e) => e.trigger.kind === 'special' && specialHits.has(e.trigger.conditionId))
    .sort((a, b) => a.id.localeCompare(b.id))[0]
  if (special) return special

  // 2) 倾向值区间映射。区间应互不相交（校验器断言），
  //    若内容出错则取 min 最高的那条，保证结果仍然确定。
  const ranged = endings
    .filter((e): e is CharacterEnding & { trigger: { kind: 'tendency'; min: number; max?: number } } =>
      e.trigger.kind === 'tendency',
    )
    .filter((e) => tendency >= e.trigger.min && (e.trigger.max === undefined || tendency <= e.trigger.max))
    .sort((a, b) => {
      const byMin = b.trigger.min - a.trigger.min
      if (byMin !== 0) return byMin
      return a.id.localeCompare(b.id)
    })

  return ranged[0]
}

/**
 * 角色结局追踪（PRD §5.3）。
 *
 * 注意：X（因果崩坏）与 echo（回响）**只能**通过 special 触发器获得，
 * 从不参与倾向值区间映射 —— 这是 PRD 裁定 #6 的落地，
 * 使得追踪引擎无需为小星（唯一拥有 X 结局的角色）做任何特例分支。
 */
export function resolveCharacterOutcomes(input: TrackInput): Record<CharacterId, CharacterOutcome> {
  const specialHits = input.specialHits ?? new Set<string>()
  const out: Record<CharacterId, CharacterOutcome> = {}

  for (const character of input.characters) {
    const tendency = computeTendency(input.events, character.id)
    const ending = matchingEnding(character.endings, tendency, specialHits)

    const preliminaryRating: Rating = ending?.rating ?? 'D'

    out[character.id] = {
      characterId: character.id,
      tendency,
      preliminaryRating,
      // 最终评级先置为初步值，由 resolveConstraints 覆写
      finalRating: preliminaryRating,
      endingId: ending?.id ?? null,
      keyChoices: input.events
        .filter((e) => e.characterId === character.id)
        .map((e) => ({ letterId: e.letterId, reason: e.reason, delta: e.delta })),
    }
  }

  return out
}

/** 把牵制引擎的输出回写到角色结局上，并重新绑定 endingId。 */
export function applyFinalRatings(
  outcomes: Record<CharacterId, CharacterOutcome>,
  characters: Character[],
  finalRatings: Record<CharacterId, Rating>,
  specialHits: ReadonlySet<string> = new Set(),
): Record<CharacterId, CharacterOutcome> {
  const next: Record<CharacterId, CharacterOutcome> = {}

  for (const character of characters) {
    const outcome = outcomes[character.id]
    if (!outcome) continue

    const finalRating = finalRatings[character.id] ?? outcome.preliminaryRating
    // 最终评级可能已被牵制降档 —— 若降了，重新挑选对应的结局
    const rebound: CharacterEnding | undefined =
      finalRating === outcome.preliminaryRating
        ? character.endings.find((e) => e.id === outcome.endingId)
        : pickByRating(character.endings, finalRating, specialHits)

    next[character.id] = {
      ...outcome,
      finalRating,
      endingId: rebound?.id ?? outcome.endingId,
    }
  }

  return next
}

function pickByRating(
  endings: CharacterEnding[],
  rating: Rating,
  specialHits: ReadonlySet<string>,
): CharacterEnding | undefined {
  const special = endings
    .filter(
      (e) =>
        e.rating === rating &&
        e.trigger.kind === 'special' &&
        specialHits.has(e.trigger.conditionId),
    )
    .sort((a, b) => a.id.localeCompare(b.id))[0]
  if (special) return special

  return endings.filter((e) => e.rating === rating).sort((a, b) => a.id.localeCompare(b.id))[0]
}

/** 统计各评级的角色数，供全局结局维度计算。 */
export function countByRating(outcomes: Record<CharacterId, CharacterOutcome>): {
  fulfillment: number
  sacrifice: number
} {
  let fulfillment = 0
  let sacrifice = 0
  for (const o of Object.values(outcomes)) {
    const idx = ratedIndex(o.finalRating)
    if (idx === null) continue // X / echo 不计入成全或牺牲
    if (idx <= 1) fulfillment++ // S / A
    if (idx >= 3) sacrifice++ // C / D
  }
  return { fulfillment, sacrifice }
}
