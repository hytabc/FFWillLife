import type {
  BlockId,
  CarryTag,
  KeyRelation,
  Letter,
  LetterEnding,
  LetterResolution,
  MisplacementKind,
  RelationId,
} from './types'

/** 解析一封信时，每个块在**当前放置下**的时空上下文。 */
export interface BlockContext {
  blockId: BlockId
  /** 当前时空下的语义（错位后可能已整体改变，不再等于 Statement 的原始 carries） */
  carries: CarryTag[]
  misplacement: MisplacementKind
  /** Δt + Δs，用于 UI 展示与崩坏门限 */
  offset: number
}

export interface ResolveInput {
  letter: Letter
  /** 当前块的顺序 */
  arrangement: BlockId[]
  contexts: Record<BlockId, BlockContext>
}

/** 把关系判定所需的索引查表预先建好，避免在循环里反复 indexOf。 */
function indexMap(arrangement: BlockId[]): Map<BlockId, number> {
  const m = new Map<BlockId, number>()
  arrangement.forEach((id, i) => m.set(id, i))
  return m
}

/**
 * 判定单条关键位置关系（PRD §5.2）。
 * 这是全部结局判定的原子 —— 引擎只看结构化语义（carries / misplacement），
 * 从不解析 text。
 */
export function evaluateRelation(
  rel: KeyRelation,
  arrangement: BlockId[],
  contexts: Record<BlockId, BlockContext>,
  index: Map<BlockId, number> = indexMap(arrangement),
): boolean {
  switch (rel.kind) {
    case 'precedes': {
      const a = index.get(rel.subject)
      const b = index.get(rel.object)
      return a !== undefined && b !== undefined && a < b
    }
    case 'adjacent': {
      const a = index.get(rel.subject)
      const b = index.get(rel.object)
      return a !== undefined && b !== undefined && b === a + 1
    }
    case 'first':
      return index.get(rel.subject) === 0
    case 'last':
      return index.get(rel.subject) === arrangement.length - 1
    case 'separatedBy': {
      const a = index.get(rel.subject)
      const b = index.get(rel.object)
      if (a === undefined || b === undefined) return false
      return Math.abs(a - b) - 1 >= rel.minGap
    }
    case 'displacedInto':
      return contexts[rel.subject]?.misplacement === rel.tier
    case 'carryPresent': {
      if (rel.block !== undefined) {
        return contexts[rel.block]?.carries.includes(rel.carry) ?? false
      }
      return arrangement.some((b) => contexts[b]?.carries.includes(rel.carry) ?? false)
    }
    default: {
      // 穷尽性检查：KeyRelation 若新增 kind 而此处未处理，会在编译期报错，
      // 而不是在运行时静默返回 false（那会让一整类结局永远无法触发）。
      const exhaustive: never = rel
      throw new Error(`未处理的关键关系类型: ${JSON.stringify(exhaustive)}`)
    }
  }
}

/** 计算当前排列满足的关键关系全集。 */
export function satisfiedRelations(input: ResolveInput): Set<RelationId> {
  const index = indexMap(input.arrangement)
  const out = new Set<RelationId>()
  for (const rel of input.letter.relations) {
    if (evaluateRelation(rel, input.arrangement, input.contexts, index)) out.add(rel.id)
  }
  return out
}

function endingMatches(ending: LetterEnding, satisfied: Set<RelationId>): boolean {
  for (const r of ending.requires) {
    if (!satisfied.has(r)) {
      // 未满足，但如果允许部分满足则继续计数
      if (ending.minSatisfied === undefined) return false
    }
  }
  const met = ending.requires.filter((r) => satisfied.has(r)).length

  if (ending.minSatisfied !== undefined) {
    if (met < ending.minSatisfied) return false
  } else if (met < ending.requires.length) {
    return false
  }

  for (const r of ending.forbids ?? []) {
    if (satisfied.has(r)) return false
  }
  return true
}

/**
 * 信件结局判定（关键节点判定法 / PRD §5.2）。
 *
 * **不可返回 null**：`Letter.fallbackEnding` 在类型定义中必填，
 * 因此"所有排列组合都有结局"由类型系统保证，而非靠内容作者自觉。
 * 校验器 4 进一步断言没有任何可达排列真的会落到 fallback。
 */
export function resolveLetterEnding(input: ResolveInput): LetterResolution {
  const satisfied = satisfiedRelations(input)

  const ordered = [...input.letter.endings].sort((a, b) => a.priority - b.priority)
  for (const ending of ordered) {
    if (endingMatches(ending, satisfied)) {
      return {
        letterId: input.letter.id,
        ending,
        satisfiedRelationIds: [...satisfied],
        misplacements: input.arrangement.map((blockId) => {
          const ctx = input.contexts[blockId]
          return {
            blockId,
            kind: ctx?.misplacement ?? 'none',
            offset: ctx?.offset ?? 0,
          }
        }),
        usedFallback: false,
      }
    }
  }

  return {
    letterId: input.letter.id,
    ending: input.letter.fallbackEnding,
    satisfiedRelationIds: [...satisfied],
    misplacements: input.arrangement.map((blockId) => {
      const ctx = input.contexts[blockId]
      return { blockId, kind: ctx?.misplacement ?? 'none', offset: ctx?.offset ?? 0 }
    }),
    usedFallback: true,
  }
}

// ============================================================================
// 排列穷举 —— 供校验器 4/5/6/7 做完备性证明
// ============================================================================

/** 生成给定块的全部排列。M ≤ 4 的硬约束保证最多 24 种。 */
export function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [[...items]]
  const out: T[][] = []
  for (let i = 0; i < items.length; i++) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)]
    for (const p of permutations(rest)) out.push([items[i] as T, ...p])
  }
  return out
}

/** 穷举一封信在**未发生错位**时（即同信内重排）的全部可达排列。 */
export function allReorderArrangements(letter: Letter): BlockId[][] {
  const draggable = letter.blocks.filter((b) => b.draggable).map((b) => b.id)
  if (draggable.length > 8) {
    throw new Error(
      `信件 ${letter.id} 有 ${draggable.length} 个可拖动块，超过穷举上限。PRD §4.1 要求 M ≤ 4。`,
    )
  }
  const draggableSet = new Set(draggable)
  const frame = letter.blocks
    .filter((b) => !draggableSet.has(b.id))
    .sort((a, b) => a.homeIndex - b.homeIndex)
    .map((b) => b.id)

  return permutations(draggable).map((perm) => {
    // 可拖动块占据的位置 = 原可拖动块的槽位，固定块保持原位
    const slots = letter.blocks
      .filter((b) => draggableSet.has(b.id))
      .sort((a, b) => a.homeIndex - b.homeIndex)
      .map((b) => b.homeIndex)
    const merged: BlockId[] = [...frame]
    slots.forEach((slot, i) => {
      merged.splice(slot, 0, perm[i] as BlockId)
    })
    return merged
  })
}
