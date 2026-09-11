import type { Character, Statement } from '../../engine/types'
import { makeCharacterEndings } from '../_shared/endings'

/**
 * 月见 —— 治疗 / 社交粘合剂。
 * 语义弧光：从「对不起是我没奶上」，到「我也有奶不动的时候」，再到「奶妈也要记得给自己留蓝」。
 * 黑话频率：豆芽期 0/5 → 导师期 3/5。她从不用黑话掩饰情绪，只会用黑话掩饰疲惫。
 */

const statements: Statement[] = [
  // ---- 豆芽期：自责、讨好 ----
  {
    id: 'yuejian.sprout.01',
    characterId: 'yuejian',
    phase: 'sprout',
    space: 'dungeon',
    text: '对不起，是我没奶上，锅我背。',
    carries: ['apology'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '多年以后她才发现，自己一直在为不属于自己的失误道歉——而这一次，她终于没有说出口。',
        carries: ['boundary', 'reminisce'],
      },
    ],
  },
  {
    id: 'yuejian.sprout.02',
    characterId: 'yuejian',
    phase: 'sprout',
    space: 'dungeon',
    text: '我是不是太慢了？',
    carries: ['apology', 'confide'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'yuejian.sprout.03',
    characterId: 'yuejian',
    phase: 'sprout',
    space: 'linkshell',
    text: '你们别吵了，都是小事。',
    carries: ['reassure'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成长期：调和、体贴 ----
  {
    id: 'yuejian.growth.01',
    characterId: 'yuejian',
    phase: 'growth',
    space: 'dungeon',
    text: '大家辛苦了，这把灭了先休息吧。',
    carries: ['reassure'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '当年那句"先休息吧"是说给别人听的；现在她说给自己听。',
        carries: ['boundary'],
      },
    ],
  },
  {
    id: 'yuejian.growth.02',
    characterId: 'yuejian',
    phase: 'growth',
    space: 'dungeon',
    text: '没事，我蓝还够。',
    carries: ['reassure'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'yuejian.growth.03',
    characterId: 'yuejian',
    phase: 'growth',
    space: 'linkshell',
    text: '要不今晚就到这儿？',
    carries: ['reassure'],
    terms: [],
    isDisplaceable: false,
  },

  {
    id: 'yuejian.growth.04',
    characterId: 'yuejian',
    phase: 'growth',
    space: 'linkshell',
    text: '你们先聊，我去把部队的修理费交了。',
    carries: ['reassure'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '她终于发现，有些人习惯用「我去做点事」来代替「我不想说话」。而她自己就是其中之一。',
        carries: ['boundary', 'reminisce'],
      },
    ],
  },

  // ---- 成熟期：坦诚、脆弱 ----
  {
    id: 'yuejian.mature.01',
    characterId: 'yuejian',
    phase: 'mature',
    space: 'dungeon',
    text: '我也有奶不动的时候，别什么都指望H1。',
    carries: ['boundary', 'confide'],
    terms: ['h1'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'sprout',
        reinterpretedText: '一个刚学会加血的新人，把这句话读成了"原来拒绝是可以的"。',
        carries: ['encourage'],
      },
      {
        kind: 'high',
        reinterpretedText: '在庆功宴上说这句话，所有人都安静了——原来她一直在硬撑。',
        carries: ['confide', 'grieve'],
      },
    ],
  },
  {
    id: 'yuejian.mature.02',
    characterId: 'yuejian',
    phase: 'mature',
    space: 'linkshell',
    text: '我今天不想打本，就想挂会儿机。',
    carries: ['boundary'],
    terms: ['guaji'],
    isDisplaceable: false,
  },
  {
    id: 'yuejian.mature.03',
    characterId: 'yuejian',
    phase: 'mature',
    space: 'linkshell',
    text: '你们有没有想过，我也需要有人问一句累不累。',
    carries: ['confide', 'boundary'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 导师期：觉悟、边界 ----
  {
    id: 'yuejian.mentor.01',
    characterId: 'yuejian',
    phase: 'mentor',
    space: 'dungeon',
    text: '奶妈也要记得给自己留蓝，别把复活全交出去。',
    carries: ['boundary', 'encourage'],
    terms: ['liulan', 'fuhuo'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '这是她第一次把"照顾自己"说出口，而听的人正处在最需要这句话的位置。',
        carries: ['encourage', 'reassure'],
      },
    ],
  },
  {
    id: 'yuejian.mentor.02',
    characterId: 'yuejian',
    phase: 'mentor',
    space: 'linkshell',
    text: '照顾别人之前，先照顾好自己。',
    carries: ['boundary', 'encourage'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'sprout',
        reinterpretedText: '这句话来得太早了。那时的她只会觉得：说这话的人一定没试过被人需要。',
        carries: ['confide'],
      },
    ],
  },
  {
    id: 'yuejian.mentor.03',
    characterId: 'yuejian',
    phase: 'mentor',
    space: 'city',
    text: '你也可以说不。',
    carries: ['encourage', 'boundary'],
    terms: [],
    isDisplaceable: false,
  },
]

export const yuejian: Character = {
  id: 'yuejian',
  name: '月见',
  role: '治疗 / 社交粘合剂',
  themeColor: '#c9a6e0',
  arc: '从「对不起，是我没奶上」，到「我也有奶不动的时候」。她最终要学会的不是把所有人照顾好，而是允许自己被照顾。',
  statements,
  endings: makeCharacterEndings(
    'yuejian',
    [
      {
        rating: 'S',
        id: 'yuejian.S',
        name: '觉悟',
        summary: '月见学会了设立边界，不再无条件迁就他人——反而因此赢得了更真诚的关系。她依然温柔，但不再是免费的。',
      },
      {
        rating: 'A',
        id: 'yuejian.A',
        name: '调和',
        summary: '月见继续担任团队的粘合剂，但她开始有意识地保留属于自己的空间。',
      },
      {
        rating: 'B',
        id: 'yuejian.B',
        name: '隐忍',
        summary: '月见持续承受压力。表面上一切和谐，内心却在一点一点被消耗。',
      },
      {
        rating: 'C',
        id: 'yuejian.C',
        name: '疲惫',
        summary: '月见在长期消耗中失去了热情，上线的次数越来越少。通讯贝里偶尔还能看到她的名字，但没有人真的去找她说话。',
      },
      {
        rating: 'D',
        id: 'yuejian.D',
        name: '断裂',
        summary: '月见与最重要的人爆发了严重的冲突。她说出了所有忍了很久的话，然后退出了所有的通讯贝。',
      },
    ],
    {
      S: ['L01-04', 'L05-02'],
      A: ['L01-03'],
      B: ['L01-02'],
      C: ['L03-04'],
      D: ['L04-03'],
    },
  ),
}
