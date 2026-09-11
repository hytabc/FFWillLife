import type { CharacterEnding, CharacterId, LetterId } from '../../engine/types'

/**
 * 角色倾向值 → 评级的标准区间。
 *
 * 区间**互不相交且完整覆盖整数轴**，这让"每个倾向值都有唯一结局"成为结构性事实，
 * 而不是靠内容作者逐条检查。校验器会断言所有角色都用同一套区间。
 */
export const TENDENCY_BANDS = {
  S: { min: 6, max: Number.POSITIVE_INFINITY },
  A: { min: 3, max: 5 },
  B: { min: 0, max: 2 },
  C: { min: -4, max: -1 },
  D: { min: Number.NEGATIVE_INFINITY, max: -5 },
} as const

export type BandKey = keyof typeof TENDENCY_BANDS

export interface EndingSpec {
  rating: BandKey
  id: string
  name: string
  summary: string
}

/**
 * 由结局名表生成 CharacterEnding[]。
 *
 * `foreshadowedBy` 是该结局被铺垫过的信件 —— S 级必须 ≥ 2 封（校验器 12），
 * 防止终章出现"从未铺垫过的角色归宿"。
 */
export function makeCharacterEndings(
  characterId: CharacterId,
  specs: readonly EndingSpec[],
  foreshadowedBy: Partial<Record<BandKey, readonly LetterId[]>> = {},
): CharacterEnding[] {
  return specs.map((spec) => {
    const band = TENDENCY_BANDS[spec.rating]
    return {
      id: spec.id,
      characterId,
      rating: spec.rating,
      name: spec.name,
      summary: spec.summary,
      trigger: { kind: 'tendency', min: band.min, max: band.max },
      prerequisiteLetterIds: [...(foreshadowedBy[spec.rating] ?? [])],
    }
  })
}

/** 为带外结局（X / 回响）生成 special 触发的 CharacterEnding。 */
export function makeSpecialEnding(
  characterId: CharacterId,
  rating: 'X' | 'echo',
  id: string,
  name: string,
  summary: string,
  conditionId: string,
  prerequisiteLetterIds: readonly LetterId[],
): CharacterEnding {
  return {
    id,
    characterId,
    rating,
    name,
    summary,
    trigger: { kind: 'special', conditionId },
    prerequisiteLetterIds: [...prerequisiteLetterIds],
  }
}
