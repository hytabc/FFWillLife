import {
  type MisplacementKind,
  type SpaceTime,
  spaceTagIndex,
  timePhaseIndex,
} from './types'

export interface MisplacementResult {
  kind: MisplacementKind
  /** |Δt|，时间阶段索引差 */
  deltaTime: number
  /** |Δs|，空间枚举序差 */
  deltaSpace: number
  /**
   * Δt + Δs。**仅用于 UI 显示与"错位幅度"排序，不用于语义分类**（裁定 #7）。
   * 它不参与任何自动判定——距离多远本身不决定结局好坏。
   */
  offset: number
}

/**
 * 错位分类。**按 (Δt, Δs) 二元组决定。**
 *
 * 源 PRD 给出的公式 `offset = |Δt| + |Δs|` 与其自身的规则表矛盾：
 * 「跨空间同阶段」(Δt=0, Δs=1) 与「跨阶段同空间」(Δt=1, Δs=0) 的 offset 都是 1，
 * 但规则表要求前者是"语义微调"、后者是"语义质变"。同一 offset 不可能映射到两种效果。
 * 因此本实现弃用标量 offset 做分类（PRD 裁定 #7）。
 */
export function classifyMisplacement(origin: SpaceTime, target: SpaceTime): MisplacementResult {
  const deltaTime = Math.abs(timePhaseIndex(origin.phase) - timePhaseIndex(target.phase))
  const deltaSpace = Math.abs(spaceTagIndex(origin.space) - spaceTagIndex(target.space))
  const offset = deltaTime + deltaSpace

  return { kind: classifyTuple(deltaTime, deltaSpace), deltaTime, deltaSpace, offset }
}

function classifyTuple(deltaTime: number, deltaSpace: number): MisplacementKind {
  if (deltaTime === 0 && deltaSpace === 0) return 'reorder'
  if (deltaTime === 0) return 'microshift'
  if (deltaSpace === 0) return 'transform'
  // 跨阶段 + 跨空间。**无论距离多远都是 'high'，不会自动变成崩坏**（裁定 #8）。
  // 「豆芽期→导师期」(Δt=3, Δs=0) 因此落回 transform，正是旗舰示例所要求的。
  return 'high'
}

/**
 * 块级放置分类。与 classifyMisplacement 的区别在于它知道该块**是否被移动过**——
 * 未被移动的块不参与错位判定，直接是 'none'。
 */
export function classifyBlockPlacement(
  origin: SpaceTime,
  target: SpaceTime,
  moved: boolean,
): MisplacementResult {
  if (!moved) return { kind: 'none', deltaTime: 0, deltaSpace: 0, offset: 0 }
  return classifyMisplacement(origin, target)
}

/** 该错位档位是否属于"跨了时空"（用于 UI 是否播放涟漪特效）。 */
export function isDisplaced(kind: MisplacementKind): boolean {
  return kind === 'microshift' || kind === 'transform' || kind === 'high'
}

/**
 * 错位幅度分级，**仅用于 UI 呈现**（涟漪强度、音高、虚线粗细）。
 * 它不是判定输入——请勿用它决定结局。
 */
export function displacementIntensity(offset: number): 0 | 1 | 2 | 3 {
  if (offset <= 0) return 0
  if (offset === 1) return 1
  if (offset === 2) return 2
  return 3
}
