import type { Chapter } from '../../../engine/types'
import { H03 } from './letters/H03'
import { L03_01 } from './letters/L03-01'
import { L03_02 } from './letters/L03-02'
import { L03_03 } from './letters/L03-03'
import { L03_04 } from './letters/L03-04'
import { L03_05 } from './letters/L03-05'

export const ch03: Chapter = {
  id: 'ch03',
  index: 3,
  title: '旧友重逢',
  subtitle: '回归与离别',
  coreCharacterIds: ['yuanshan', 'tiebi'],
  // 第三章解锁**跨时间拖动**：同一句话，换个年纪说，含义完全质变。
  // 因此本章信件的语句块大量跨阶段（transform），第二阶段起空间也不再受限。
  unlocks: ['reorder', 'microshift', 'transform'],
  letterIds: [L03_01.id, L03_02.id, L03_03.id, L03_04.id, L03_05.id, H03.id],
}

export const ch03Letters = [L03_01, L03_02, L03_03, L03_04, L03_05, H03]
