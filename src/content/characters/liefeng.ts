import type { Character, Statement } from '../../engine/types'
import { makeCharacterEndings } from '../_shared/endings'

/**
 * 烈风 —— 龙骑士 / 极限输出。
 * 语义弧光：从「炒不到80+就别来」，到「你这个logs比我当年好看多了」。
 * 他的成长不是变强，而是终于承认"强"不是唯一值得尊重的东西。
 * 黑话频率：全书最高，豆芽期 3/5 → 成长期 5/5 → 导师期 4/5（他连道歉都用黑话）。
 */

const statements: Statement[] = [
  // ---- 豆芽期：执拗、认真 ----
  {
    id: 'liefeng.sprout.01',
    characterId: 'liefeng',
    phase: 'sprout',
    space: 'city',
    text: '这个循环我在木桩前练了三十遍。',
    carries: ['persist'],
    terms: ['muzhuang'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '他把这句话讲给一个新人的时候，语气里没有炫耀，只有"我懂你现在的笨拙"。',
        carries: ['encourage', 'reminisce'],
      },
    ],
  },
  {
    id: 'liefeng.sprout.02',
    characterId: 'liefeng',
    phase: 'sprout',
    space: 'dungeon',
    text: '我还差得远。',
    carries: ['confide', 'persist'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'liefeng.sprout.03',
    characterId: 'liefeng',
    phase: 'sprout',
    space: 'dungeon',
    text: '再来一把吧，这把我能打高点。',
    carries: ['persist'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成长期：苛刻、锋芒 ----
  {
    id: 'liefeng.growth.01',
    characterId: 'liefeng',
    phase: 'growth',
    space: 'linkshell',
    text: '炒不到80+就别来零式了，我炒股不是陪你们渡劫的。',
    carries: ['reproach'],
    terms: ['chaogu', 'lingshi', 'dujie'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '一个已经不再看重日志分数的人，重读自己当年这句话，只留下沉默。',
        carries: ['reminisce', 'grieve'],
      },
      {
        kind: 'microshift',
        targetSpace: 'fc-house',
        reinterpretedText: '同样的话，在部队房里当着所有人的面说出来——那就不只是苛刻，是羞辱。',
        carries: ['reproach'],
      },
    ],
  },
  {
    id: 'liefeng.growth.02',
    characterId: 'liefeng',
    phase: 'growth',
    space: 'dungeon',
    text: '这把我炒股了，输出没打满。',
    carries: ['confide'],
    terms: ['chaogu'],
    isDisplaceable: false,
  },
  {
    id: 'liefeng.growth.03',
    characterId: 'liefeng',
    phase: 'growth',
    space: 'dungeon',
    text: '你们别拖我后腿。',
    carries: ['reproach'],
    terms: [],
    isDisplaceable: false,
  },

  {
    id: 'liefeng.growth.04',
    characterId: 'liefeng',
    phase: 'growth',
    space: 'linkshell',
    text: '这把我循环没断，logs应该能看。',
    carries: ['persist', 'boast'],
    terms: ['logs'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '他把这句话说给一个刚被骂哭的新人听——只不过这一次，后半句是「你也做得到」。',
        carries: ['encourage', 'reminisce'],
      },
    ],
  },
  {
    id: 'liefeng.growth.05',
    characterId: 'liefeng',
    phase: 'growth',
    space: 'city',
    text: '我在木桩前站着，等你们打完。',
    carries: ['withdraw', 'persist'],
    terms: ['muzhuang'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在成熟期，这不是赌气——他真的只是想在旁边看着他们打完，然后说一句「进步了」。',
        carries: ['reassure', 'encourage'],
      },
    ],
  },
  {
    id: 'liefeng.growth.06',
    characterId: 'liefeng',
    phase: 'growth',
    space: 'city',
    text: '不想打就说，别浪费我的时间。',
    carries: ['reproach'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成熟期：从容、释然 ----
  {
    id: 'liefeng.mature.01',
    characterId: 'liefeng',
    phase: 'mature',
    space: 'dungeon',
    text: '狂暴就狂暴了，再开一把。',
    carries: ['reassure'],
    terms: ['kuangbao'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText: '在还输不起的年纪听到这句话，他只会觉得对方不上进。',
        carries: ['reproach'],
      },
    ],
  },
  {
    id: 'liefeng.mature.02',
    characterId: 'liefeng',
    phase: 'mature',
    space: 'dungeon',
    text: '灭就灭了，下一把。',
    carries: ['reassure'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'liefeng.mature.03',
    characterId: 'liefeng',
    phase: 'mature',
    space: 'linkshell',
    text: '我现在只和自己比。',
    carries: ['persist', 'boundary'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 导师期：认可、和解 ----
  {
    id: 'liefeng.mentor.01',
    characterId: 'liefeng',
    phase: 'mentor',
    space: 'dungeon',
    text: '你这个logs比我当年好看多了。',
    carries: ['encourage'],
    terms: ['logs'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '他把这句话说给一个正被疲惫压垮的治疗听——那是在说"你已经做得够好了"。',
        carries: ['encourage', 'reassure'],
      },
    ],
  },
  {
    id: 'liefeng.mentor.02',
    characterId: 'liefeng',
    phase: 'mentor',
    space: 'city',
    text: '打得不好没关系，先玩得开心。',
    carries: ['encourage'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'liefeng.mentor.03',
    characterId: 'liefeng',
    phase: 'mentor',
    space: 'linkshell',
    text: '我以前太较真了。',
    carries: ['reminisce', 'confide'],
    terms: [],
    isDisplaceable: false,
  },
]

export const liefeng: Character = {
  id: 'liefeng',
  name: '烈风',
  role: '龙骑士 / 极限输出',
  themeColor: '#e5876a',
  arc: '从「炒不到80+就别来」，到「你这个logs比我当年好看多了」。他的成长不是变得更强，而是终于承认：强，不是唯一值得被尊重的东西。',
  statements,
  endings: makeCharacterEndings(
    'liefeng',
    [
      {
        rating: 'S',
        id: 'liefeng.S',
        name: '巅峰',
        summary: '烈风在追求极限的路上找到了志同道合的队友，同时学会了尊重不同的选择——他不再要求所有人都站在同一个高度。',
      },
      {
        rating: 'A',
        id: 'liefeng.A',
        name: '和解',
        summary: '烈风不再强求所有人达到同一标准，但他自己的极限追求也因此有所妥协。他偶尔会在深夜想起那个差一点的分数。',
      },
      {
        rating: 'B',
        id: 'liefeng.B',
        name: '独行',
        summary: '烈风离开了固定队，加入了更硬核的团队。他打出了想要的数字，但原本的朋友留在了原地。',
      },
      {
        rating: 'C',
        id: 'liefeng.C',
        name: '沉默',
        summary: '烈风不再在通讯贝里发言，只是默默地打本。没有人知道他还在不在。',
      },
      {
        rating: 'D',
        id: 'liefeng.D',
        name: '退场',
        summary: '一次严重的输出争执之后，烈风被踢出了固定队。他从此不再参与任何团队活动。',
      },
    ],
    {
      S: ['L01-02', 'L05-03'],
      A: ['L01-02'],
      B: ['L01-03'],
      C: ['L02-03'],
      D: ['L01-04'],
    },
  ),
}
