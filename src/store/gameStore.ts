import { create } from 'zustand'
import { lettersById, statementsById } from '../content'
import { setSoundEnabled } from '../game/audio'
import { initialState, resolvePlay, toTendencyEvents } from '../game/play'
import {
  AUTOSAVE_SLOT,
  buildSave,
  emptySlotId,
  restore,
  setActiveSlot,
  writeSave,
} from '../game/save'
import type {
  BlockId,
  EndingId,
  LetterId,
  LetterResolution,
  Rating,
  RelationId,
  SandboxExperiment,
  SaveGame,
  SpaceTime,
  TendencyEvent,
} from '../engine/types'

/** 一封已结算信件在终章计算中需要的最小信息。 */
export interface SettledLetter {
  letterId: LetterId
  endingId: EndingId
  rating: Rating
  /** 该次结算满足的关键关系 —— 共存结局检测靠它 */
  satisfiedRelationIds: RelationId[]
  /** 参与这封信的角色，用于判定带外结局（X / 回响）落到了谁头上 */
  involvedCharacterIds: string[]
}

export interface GameState {
  letterId: string
  arrangement: BlockId[]
  /** 从别的时空借来的块 → 其放置坐标 */
  borrowed: Record<BlockId, SpaceTime>
  /** 已提交的结算结果；null 表示尚未结算 */
  settled: LetterResolution | null
  tendencyEvents: TendencyEvent[]
  /**
   * 全部已结算信件。**这是终章计算的输入之一**：
   * 角色倾向只能算出一个初步评级，而共存结局与带外结局要看
   * "这封信满足了哪些关键关系"——那信息只在结算那一刻存在，必须存下来。
   */
  settledLetters: Record<LetterId, SettledLetter>
  /** 玩家查看过的黑话 */
  learnedTermIds: string[]
  fullAnnotation: boolean

  reorder: (activeId: BlockId, overId: BlockId) => void
  settle: () => void
  retry: () => void
  /** 切换到另一封信。会重置该信的编排状态，但**不动**已结算记录与倾向事件。 */
  openLetter: (letterId: LetterId) => void
  /**
   * 把一个块**放到另一个时空去读** —— 本作的核心机制。
   *
   * 块本身没有移动，移动的是"这句话是在什么年纪、什么场合说出口的"。
   * 引擎据此重算语义（`buildContexts`），可能整体改变该句的 carries，
   * 这也是"语义质变"的实现方式。
   */
  setBorrowed: (blockId: BlockId, target: SpaceTime) => void
  clearBorrowed: (blockId: BlockId) => void
  learnTerm: (id: string) => void
  setFullAnnotation: (on: boolean) => void
  sound: boolean
  setSound: (on: boolean) => void

  // ---- 时空沙盘 ----
  /**
   * 沙盘模式：可以打开任何一封信（含未解锁与隐藏信）自由试验，
   * **不写入主线进度**。PRD §4.4 把它列为通关后的自由模式，
   * 但实际上本作没有"完美解"，玩家从第一章起就会想试别的可能——
   * 所以沙盘从开局即可用。
   */
  sandbox: boolean
  toggleSandbox: () => void
  experiments: SandboxExperiment[]
  clearExperiments: () => void

  // ---- 存档 ----
  slotId: string
  label: string
  createdAt: number
  /** 从存档还原（读档 / 切换存档槽） */
  restoreFrom: (save: SaveGame) => void
  /** 开新档：清空一切进度，回到第一封信 */
  startNewGame: (label: string) => void
}

const firstLetter = lettersById.get('L01-01')
if (!firstLetter) throw new Error('内容缺失：L01-01')

const initial = initialState(firstLetter)

export const useGameStore = create<GameState>((set, get) => ({
  letterId: initial.letterId,
  arrangement: initial.arrangement,
  borrowed: initial.borrowed,
  settled: null,
  tendencyEvents: [],
  settledLetters: {},
  learnedTermIds: [],
  fullAnnotation: false,

  reorder: (activeId, overId) => {
    const { arrangement, settled } = get()
    if (settled) return // 已结算，需先「重新排列」
    const from = arrangement.indexOf(activeId)
    const to = arrangement.indexOf(overId)
    if (from === -1 || to === -1 || from === to) return

    const next = [...arrangement]
    next.splice(from, 1)
    next.splice(to, 0, activeId)
    set({ arrangement: next })
  },

  settle: () => {
    const { letterId, arrangement, borrowed, tendencyEvents, settledLetters, sandbox, experiments } =
      get()
    const resolution = resolvePlay({ letterId, arrangement, borrowed })
    const base = tendencyEvents.length

    // 沙盘里结算只是"看看会怎样"：记录实验日志，然后就此打住。
    // 倾向事件与已结算记录一律不动——否则玩家随手试一下就会改写主线结局。
    if (sandbox) {
      set({
        settled: resolution,
        experiments: [
          ...experiments,
          {
            id: `exp-${experiments.length + 1}`,
            letterId,
            arrangement: [...arrangement],
            endingId: resolution.ending.id,
            rating: resolution.ending.rating,
            createdAt: Date.now(),
          },
        ],
      })
      return
    }

    const letter = lettersById.get(letterId)
    const involved = new Set<string>()
    for (const block of letter?.blocks ?? []) {
      const s = statementsById.get(block.statementId)
      if (s) involved.add(s.characterId)
    }
    for (const t of resolution.ending.tendency) involved.add(t.characterId)

    set({
      settled: resolution,
      tendencyEvents: [...tendencyEvents, ...toTendencyEvents(resolution, base)],
      settledLetters: {
        ...settledLetters,
        [letterId]: {
          letterId,
          endingId: resolution.ending.id,
          rating: resolution.ending.rating,
          satisfiedRelationIds: resolution.satisfiedRelationIds,
          involvedCharacterIds: [...involved],
        },
      },
    })
  },

  retry: () => {
    const letter = lettersById.get(get().letterId)
    if (!letter) return
    const fresh = initialState(letter)
    set({ arrangement: fresh.arrangement, borrowed: fresh.borrowed, settled: null })
  },

  openLetter: (letterId) => {
    const letter = lettersById.get(letterId)
    if (!letter) return
    const fresh = initialState(letter)
    set({
      letterId,
      arrangement: fresh.arrangement,
      borrowed: fresh.borrowed,
      settled: null,
    })
  },

  setBorrowed: (blockId, target) => {
    const { borrowed, settled } = get()
    if (settled) return
    set({ borrowed: { ...borrowed, [blockId]: target } })
  },

  clearBorrowed: (blockId) => {
    const { borrowed, settled } = get()
    if (settled) return
    const next = { ...borrowed }
    delete next[blockId]
    set({ borrowed: next })
  },

  learnTerm: (id) => {
    const { learnedTermIds } = get()
    if (learnedTermIds.includes(id)) return
    set({ learnedTermIds: [...learnedTermIds, id] })
  },

  setFullAnnotation: (on) => set({ fullAnnotation: on }),

  sound: true,
  setSound: (on) => {
    setSoundEnabled(on)
    set({ sound: on })
  },

  sandbox: false,
  experiments: [],

  toggleSandbox: () =>
    set((s) => ({ sandbox: !s.sandbox, settled: null, experiments: s.sandbox ? s.experiments : [] })),

  clearExperiments: () => set({ experiments: [] }),

  slotId: AUTOSAVE_SLOT,
  label: '自动存档',
  createdAt: Date.now(),

  restoreFrom: (save) => {
    const restored = restore(save)
    const letter = lettersById.get('L01-01')
    const fresh = letter ? initialState(letter) : { arrangement: [], borrowed: {} }
    set({
      slotId: save.slotId,
      label: save.label,
      createdAt: save.createdAt,
      tendencyEvents: restored.tendencyEvents,
      settledLetters: restored.settledLetters,
      learnedTermIds: restored.learnedTermIds,
      fullAnnotation: restored.fullAnnotation,
      letterId: letter?.id ?? 'L01-01',
      arrangement: fresh.arrangement,
      borrowed: fresh.borrowed,
      settled: null,
    })
    setActiveSlot(save.slotId)
  },

  startNewGame: (label) => {
    const letter = lettersById.get('L01-01')
    const fresh = letter ? initialState(letter) : { arrangement: [], borrowed: {} }
    set({
      slotId: emptySlotId(),
      label,
      createdAt: Date.now(),
      tendencyEvents: [],
      settledLetters: {},
      learnedTermIds: [],
      letterId: letter?.id ?? 'L01-01',
      arrangement: fresh.arrangement,
      borrowed: fresh.borrowed,
      settled: null,
    })
  },
}))

/** 把当前状态压成一份可持久化的存档。 */
export function snapshot(state: GameState): SaveGame {
  return buildSave({
    slotId: state.slotId,
    label: state.label,
    tendencyEvents: state.tendencyEvents,
    settledLetters: state.settledLetters,
    learnedTermIds: state.learnedTermIds,
    fullAnnotation: state.fullAnnotation,
    createdAt: state.createdAt,
  })
}

/**
 * 自动存档：状态一变就写回当前槽位（做了防抖）。
 *
 * 只在"真正影响进度的字段"变化时写盘 —— 拖动语句块、切换信件
 * 这类瞬时状态不值得每次落盘，既慢又会让"最后游玩时间"变得没有意义。
 */
export function installAutoSave(delayMs = 800): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  let prev = progressSignature(useGameStore.getState())

  return useGameStore.subscribe((state) => {
    const next = progressSignature(state)
    if (next === prev) return
    prev = next
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      const state = useGameStore.getState()
      writeSave(snapshot(state))
      // 记下"当前在玩哪个槽"，刷新后才能回到这里
      setActiveSlot(state.slotId)
    }, delayMs)
  })
}

function progressSignature(state: GameState): string {
  return [
    Object.keys(state.settledLetters).sort().join(','),
    state.tendencyEvents.length,
    state.learnedTermIds.length,
    state.slotId,
  ].join('|')
}

/**
 * 实时结算预览 —— 每次拖动都重算，但**不写入**倾向事件。
 * 这样玩家可以在提交前看到"当前排列会走向哪个结局"，与《Will》的体验一致。
 */
export function useLiveResolution(): LetterResolution {
  const letterId = useGameStore((s) => s.letterId)
  const arrangement = useGameStore((s) => s.arrangement)
  const borrowed = useGameStore((s) => s.borrowed)
  return resolvePlay({ letterId, arrangement, borrowed })
}
