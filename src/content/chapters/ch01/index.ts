import type { Chapter } from '../../../engine/types'
import { H01 } from './letters/H01'
import { L01_01 } from './letters/L01-01'
import { L01_02 } from './letters/L01-02'
import { L01_03 } from './letters/L01-03'
import { L01_04 } from './letters/L01-04'
import { L01_05 } from './letters/L01-05'

export const ch01: Chapter = {
  id: 'ch01',
  index: 1,
  title: '初次组队',
  subtitle: '固定队的诞生',
  coreCharacterIds: ['chenxi', 'yuejian', 'liefeng'],
  // 第一章只解锁同阶段重排。校验器 14 会断言：
  // 本章信件的语句块**阶段与空间都必须与信件锚点一致**——
  // 否则一次普通的顺序调换就会被判成错位，破坏本章的教学意图。
  unlocks: ['reorder'],
  letterIds: [L01_01.id, L01_02.id, L01_03.id, L01_04.id, L01_05.id, H01.id],
}

export const ch01Letters = [L01_01, L01_02, L01_03, L01_04, L01_05, H01]
