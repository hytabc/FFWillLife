import type { Rating } from '../engine/types'
import { OUT_OF_BAND_LABEL, isRated } from '../engine/types'

/** 评级 → 主题色。S 金 / A 翠 / B 蓝 / C 橙 / D 绯 / X 紫 / 回响 青。 */
export const RATING_COLOR: Record<Rating, string> = {
  S: '#e8c46a',
  A: '#7fc9a0',
  B: '#7fb2e5',
  C: '#e0a35c',
  D: '#d9636b',
  X: '#a97fd1',
  echo: '#6fd0d0',
}

/** 评级的一句话解说，用于结算界面与图鉴。 */
export const RATING_MEANING: Record<Rating, string> = {
  S: '完美结局 —— 这封信里所有人都在最好的位置上',
  A: '良好结局 —— 主线角色满意，支线略有遗憾',
  B: '普通结局 —— 故事推进了，但留下了遗憾',
  C: '遗憾结局 —— 部分关系出现了裂痕',
  D: '坏结局 —— 关系彻底崩溃',
  X: '因果崩坏 —— 错位过度，故事逻辑崩解。但你解锁了一段本不该存在的档案',
  echo: '回响结局 —— 语句回到了原来的位置，可你已经不是原来的你了',
}

export function ratingLabel(r: Rating): string {
  return isRated(r) ? r : OUT_OF_BAND_LABEL[r]
}
