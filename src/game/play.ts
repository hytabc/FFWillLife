import {
  chaptersById,
  charactersById,
  glossaryById,
  lettersById,
  statementsById,
} from '../content'
import { classifyBlockPlacement } from '../engine/misplacement'
import {
  type BlockContext,
  allReorderArrangements,
  resolveLetterEnding,
} from '../engine/letterEnding'
import {
  MISPLACEMENT_KINDS,
  SPACE_TAGS,
  TIME_PHASES,
  type BlockId,
  type InterpretationVariant,
  type Letter,
  type LetterResolution,
  type MisplacementKind,
  type SpaceTime,
  type Statement,
  type TendencyEvent,
} from '../engine/types'

/**
 * 组合层：把纯引擎（engine/）与内容数据（content/）接起来。
 * 引擎本身不 import content，因此可以被单测；这里负责查表与装配。
 */

/** 玩家当前的编排状态。 */
export interface PlayState {
  letterId: string
  /** 当前信内的块顺序 */
  arrangement: BlockId[]
  /**
   * 从别的信件/时空借来的块 → 它被放置时所属的时空坐标。
   * 未出现的块表示仍在原位。
   */
  borrowed: Record<BlockId, SpaceTime>
}

export function initialState(letter: Letter): PlayState {
  return {
    letterId: letter.id,
    arrangement: [...letter.blocks].sort((a, b) => a.homeIndex - b.homeIndex).map((b) => b.id),
    borrowed: {},
  }
}

/**
 * 找出该语句在目标时空下生效的解读变体。
 * 优先匹配同时限定了 targetPhase 与 targetSpace 的变体，其次只限 phase 的，最后是不限定的。
 */
export function findVariant(
  statement: Statement,
  kind: MisplacementKind,
  target: SpaceTime,
): InterpretationVariant | undefined {
  const candidates = (statement.variants ?? []).filter((v) => v.kind === kind)
  const exact = candidates.find(
    (v) => v.targetPhase === target.phase && v.targetSpace === target.space,
  )
  if (exact) return exact
  const byPhase = candidates.find(
    (v) => v.targetPhase === target.phase && v.targetSpace === undefined,
  )
  if (byPhase) return byPhase
  return candidates.find((v) => v.targetPhase === undefined && v.targetSpace === undefined)
}

/**
 * 计算每个块在当前放置下的时空上下文。
 * 错位后的 carries 可能整体改变 —— 这正是"语义质变"的实现方式。
 */
export function buildContexts(state: PlayState): Record<BlockId, BlockContext> {
  const letter = lettersById.get(state.letterId)
  if (!letter) throw new Error(`未知信件: ${state.letterId}`)

  const out: Record<BlockId, BlockContext> = {}

  state.arrangement.forEach((blockId, index) => {
    const block = letter.blocks.find((b) => b.id === blockId)
    if (!block) throw new Error(`信件 ${letter.id} 中不存在块 ${blockId}`)
    const statement = statementsById.get(block.statementId)
    if (!statement) throw new Error(`未知语句: ${block.statementId}`)

    const origin: SpaceTime = { phase: statement.phase, space: statement.space }
    const borrowed = state.borrowed[blockId]
    const target: SpaceTime = borrowed ?? letter.anchor
    const moved = borrowed !== undefined || index !== block.homeIndex

    const m = classifyBlockPlacement(origin, target, moved)
    const variant = findVariant(statement, m.kind, target)

    out[blockId] = {
      blockId,
      carries: variant ? variant.carries : statement.carries,
      misplacement: m.kind,
      offset: m.offset,
    }
  })

  return out
}

/** 结算一封信 —— UI 与校验器共用同一个入口，保证"玩到的"和"验到的"是同一套逻辑。 */
export function resolvePlay(state: PlayState): LetterResolution {
  const letter = lettersById.get(state.letterId)
  if (!letter) throw new Error(`未知信件: ${state.letterId}`)
  return resolveLetterEnding({
    letter,
    arrangement: state.arrangement,
    contexts: buildContexts(state),
  })
}

/**
 * 拖动预览：「在导师期，这句话可能被解读为……」
 * 返回 null 表示该语句在目标时空下没有专门的重解读（语义不变）。
 */
export function previewDisplacement(
  statement: Statement,
  target: SpaceTime,
): { kind: MisplacementKind; text: string; carries: Statement['carries'] } | null {
  const origin: SpaceTime = { phase: statement.phase, space: statement.space }
  const m = classifyBlockPlacement(origin, target, true)
  if (m.kind === 'none' || m.kind === 'reorder') return null
  const variant = findVariant(statement, m.kind, target)
  if (!variant) return null
  return { kind: m.kind, text: variant.reinterpretedText, carries: variant.carries }
}

/**
 * 这封信允许玩家把语句放到哪些时空。
 *
 * 由**章节的解锁能力**决定（PRD §6.1 的渐进式教学）：
 * 第一章只教顺序，所以任何跨时空的选择都不该出现；
 * 第二章解锁跨空间，第三、四章依次解锁跨阶段与组合。
 *
 * 返回的是"可选的错位档位"，UI 用它来禁用/隐藏格子。
 */
export function allowedTiersForLetter(letter: Letter): MisplacementKind[] {
  const chapter = chaptersById.get(letter.chapterId)
  if (!chapter) return ['none', 'reorder']
  const allowed = new Set(chapter.unlocks)
  allowed.add('none')
  allowed.add('reorder')
  return MISPLACEMENT_KINDS.filter((k) => allowed.has(k))
}

/** 该块是否存在"可以放过去的别的时空"。没有就不显示换时空按钮。 */
export function hasAlternateSpaceTime(letter: Letter, statement: Statement): boolean {
  const allowed = new Set(allowedTiersForLetter(letter))
  const origin: SpaceTime = { phase: statement.phase, space: statement.space }
  for (const phase of TIME_PHASES) {
    for (const space of SPACE_TAGS) {
      if (phase === origin.phase && space === origin.space) continue
      const m = classifyBlockPlacement(origin, { phase, space }, true)
      if (allowed.has(m.kind)) return true
    }
  }
  return false
}

/** 把一次结算转成倾向事件。order 由调用方给，保证写入序可复现。 */
export function toTendencyEvents(
  resolution: LetterResolution,
  nextOrder: number,
): TendencyEvent[] {
  return resolution.ending.tendency.map((t, i) => ({
    letterId: resolution.letterId,
    characterId: t.characterId,
    delta: t.delta,
    reason: t.reason,
    order: nextOrder + i,
  }))
}

/**
 * 穷举一封信在**同信内重排**下的全部可达结局。
 * 校验器 4/5 的求解器，也是"这封信是否每个排列都有独立结局"的体检工具。
 */
export function enumerateReorders(letter: Letter): {
  arrangement: BlockId[]
  resolution: LetterResolution
}[] {
  return allReorderArrangements(letter).map((arrangement) => ({
    arrangement,
    resolution: resolvePlay({ letterId: letter.id, arrangement, borrowed: {} }),
  }))
}

// ============================================================================
// 便于 UI/校验器把 id 翻译成人话
// ============================================================================

export function characterName(id: string): string {
  return charactersById.get(id)?.name ?? id
}

export function termById(id: string) {
  return glossaryById.get(id)
}
