import { lettersById, statementsById } from '../content'
import {
  SAVE_VERSION,
  type LetterId,
  type SaveGame,
  type TendencyEvent,
} from '../engine/types'
import type { SettledLetter } from '../store/gameStore'

/**
 * 存档。
 *
 * 存在 LocalStorage 里的只有**原始数据**：倾向事件、每封信的结算结果、
 * 已解锁/已学/实验日志。角色评级、因果树、倾听者手记这些派生状态一律不存 ——
 * 读档时用同一批纯函数重算，因此不可能出现"存档里的结局和界面算出来的不一样"。
 */

const KEY = 'ffwilllife.saves.v1'
const ACTIVE_KEY = 'ffwilllife.active-slot.v1'
export const AUTOSAVE_SLOT = 'autosave'

export interface SaveSnapshotInput {
  slotId: string
  label: string
  tendencyEvents: TendencyEvent[]
  settledLetters: Record<LetterId, SettledLetter>
  learnedTermIds: string[]
  fullAnnotation: boolean
  createdAt?: number
}

export function buildSave(input: SaveSnapshotInput): SaveGame {
  const now = Date.now()
  return {
    version: SAVE_VERSION,
    slotId: input.slotId,
    label: input.label,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
    tendencyEvents: input.tendencyEvents,
    // LetterResult 是与引擎解耦的持久化形态：只存"玩家排成了什么、得到什么"，
    // 不存 LetterResolution 对象（那里面含整个 ending 定义，改内容后会失真）。
    letterResults: Object.fromEntries(
      Object.values(input.settledLetters).map((s) => [
        s.letterId,
        {
          letterId: s.letterId,
          endingId: s.endingId,
          rating: s.rating,
          arrangement: [],
          borrowedPlacements: {},
          satisfiedRelationIds: s.satisfiedRelationIds,
          completedAt: now,
        },
      ]),
    ),
    unlockedLetterIds: Object.keys(input.settledLetters),
    signedLetterIds: [],
    learnedTermIds: input.learnedTermIds,
    experiments: [],
    settings: { fullAnnotation: input.fullAnnotation, sound: true },
  }
}

// ============================================================================
// LocalStorage 读写
// ============================================================================

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function listSaves(): SaveGame[] {
  const all = safeParse<SaveGame[]>(localStorage.getItem(KEY)) ?? []
  return all.sort((a, b) => b.updatedAt - a.updatedAt)
}

export function readSave(slotId: string): SaveGame | undefined {
  return listSaves().find((s) => s.slotId === slotId)
}

export function writeSave(save: SaveGame): void {
  const others = listSaves().filter((s) => s.slotId !== save.slotId)
  localStorage.setItem(KEY, JSON.stringify([save, ...others]))
}

export function deleteSave(slotId: string): void {
  const rest = listSaves().filter((s) => s.slotId !== slotId)
  localStorage.setItem(KEY, JSON.stringify(rest))
  if (getActiveSlot() === slotId) localStorage.removeItem(ACTIVE_KEY)
}

export function getActiveSlot(): string | null {
  return localStorage.getItem(ACTIVE_KEY)
}

export function setActiveSlot(slotId: string): void {
  localStorage.setItem(ACTIVE_KEY, slotId)
}

// ============================================================================
// 还原
// ============================================================================

export interface RestoredState {
  tendencyEvents: TendencyEvent[]
  settledLetters: Record<LetterId, SettledLetter>
  learnedTermIds: string[]
  fullAnnotation: boolean
}

/**
 * 从存档还原出运行态。
 *
 * `satisfiedRelationIds` 在存档里没有保留（它依赖当时的内容版本），
 * 因此还原时按 endingId 重新查一遍该结局的 `requires`——
 * 只要内容没改过这两者，结果与当初一致。
 */
export function restore(save: SaveGame): RestoredState {
  const settledLetters: Record<LetterId, SettledLetter> = {}

  for (const result of Object.values(save.letterResults)) {
    const letter = lettersById.get(result.letterId)
    if (!letter) continue
    const ending =
      letter.endings.find((e) => e.id === result.endingId) ??
      (letter.fallbackEnding.id === result.endingId ? letter.fallbackEnding : undefined)
    if (!ending) continue

    const involved = new Set<string>()
    for (const block of letter.blocks) {
      const s = statementsById.get(block.statementId)
      if (s) involved.add(s.characterId)
    }
    for (const t of ending.tendency) involved.add(t.characterId)

    settledLetters[result.letterId] = {
      letterId: result.letterId,
      endingId: ending.id,
      rating: ending.rating,
      // 优先用存档里记下的真实满足集；旧存档没有这个字段时退回 requires，
      // 这是唯一的降级路径，且只影响共存结局的判定精度，不会崩。
      satisfiedRelationIds:
        result.satisfiedRelationIds.length > 0 ? result.satisfiedRelationIds : ending.requires,
      involvedCharacterIds: [...involved],
    }
  }

  return {
    tendencyEvents: save.tendencyEvents,
    settledLetters,
    learnedTermIds: save.learnedTermIds,
    fullAnnotation: save.settings.fullAnnotation,
  }
}

export function emptySlotId(): string {
  return `slot-${Math.random().toString(36).slice(2, 9)}`
}
