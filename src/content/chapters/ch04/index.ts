import type { Chapter } from '../../../engine/types'
import { H04 } from './letters/H04'
import { L04_01 } from './letters/L04-01'
import { L04_02 } from './letters/L04-02'
import { L04_03 } from './letters/L04-03'
import { L04_04 } from './letters/L04-04'
import { L04_05 } from './letters/L04-05'

export const ch04: Chapter = {
  id: 'ch04',
  index: 4,
  title: '虚拟与真实',
  subtitle: '扮演与自我认同',
  coreCharacterIds: ['yeyu', 'linglan'],
  // 第四章解锁**跨时空组合拖动**：一句话可以同时跨过阶段与空间。
  // 本章的信里因此出现了 `high` 档的 displacedInto——它们写的是**隐藏剧情**
  // （把一句本不属于这里的话放对位置，于是看见了不该看见的东西），
  // 而不是"跨得太远所以坏掉了"：距离本身不决定结局好坏（PRD 裁定 #8）。
  unlocks: ['reorder', 'microshift', 'transform', 'high'],
  letterIds: [L04_01.id, L04_02.id, L04_03.id, L04_04.id, L04_05.id, H04.id],
}

export const ch04Letters = [L04_01, L04_02, L04_03, L04_04, L04_05, H04]
