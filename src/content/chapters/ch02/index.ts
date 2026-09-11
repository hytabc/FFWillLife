import type { Chapter } from '../../../engine/types'
import { H02 } from './letters/H02'
import { L02_01 } from './letters/L02-01'
import { L02_02 } from './letters/L02-02'
import { L02_03 } from './letters/L02-03'
import { L02_04 } from './letters/L02-04'
import { L02_05 } from './letters/L02-05'

export const ch02: Chapter = {
  id: 'ch02',
  index: 2,
  title: '豆芽的困惑',
  subtitle: '新人融入',
  coreCharacterIds: ['xiaoxing', 'tiebi'],
  // 第二章解锁**跨空间拖动**：同一句话，在部队房说和在通讯贝里说，是两回事。
  // 本章的 displacedInto 只允许落在 `microshift` 档（跨空间、同阶段，＝语义微调）；
  // 跨阶段是第三章才教的事，本章不碰时间轴——校验器 14a 会逐封断言。
  unlocks: ['reorder', 'microshift'],
  letterIds: [L02_01.id, L02_02.id, L02_03.id, L02_04.id, L02_05.id, H02.id],
}

export const ch02Letters = [L02_01, L02_02, L02_03, L02_04, L02_05, H02]
