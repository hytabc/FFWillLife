import type { Chapter } from '../../../engine/types'
import { H05 } from './letters/H05'
import { L05_01 } from './letters/L05-01'
import { L05_02 } from './letters/L05-02'
import { L05_03 } from './letters/L05-03'
import { L05_04 } from './letters/L05-04'
import { L05_05 } from './letters/L05-05'
import { L05_06 } from './letters/L05-06'
import { L05_07 } from './letters/L05-07'
import { L05_08 } from './letters/L05-08'

export const ch05: Chapter = {
  id: 'ch05',
  index: 5,
  title: '因果交织',
  subtitle: '所有人命运交汇',
  // 终章：八位角色全部到场。每一封信都是一次"谁被留下、谁被接住"的裁决，
  // 而三个共存结局只有在把两个人各自的信**都**排对时才会同时亮起。
  coreCharacterIds: [
    'chenxi',
    'yuejian',
    'liefeng',
    'tiebi',
    'xiaoxing',
    'yuanshan',
    'yeyu',
    'linglan',
  ],
  // 终章解锁全部错位能力（PRD §8）：
  // reorder（同阶段同空间重排）/ microshift（跨空间）/ transform（跨阶段）/ high（跨阶段跨空间）
  unlocks: ['reorder', 'microshift', 'transform', 'high'],
  letterIds: [
    L05_01.id,
    L05_02.id,
    L05_03.id,
    L05_04.id,
    L05_05.id,
    L05_06.id,
    L05_07.id,
    L05_08.id,
    H05.id,
  ],
}

export const ch05Letters = [
  L05_01,
  L05_02,
  L05_03,
  L05_04,
  L05_05,
  L05_06,
  L05_07,
  L05_08,
  H05,
]
