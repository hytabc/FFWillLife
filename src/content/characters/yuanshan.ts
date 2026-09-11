import type { Character, Statement } from '../../engine/types'
import { makeCharacterEndings } from '../_shared/endings'

/**
 * 远山 —— 前零式首杀选手 / 回归老兵。
 * 语义弧光：从「总有一天我要站在零式之巅」，到「回来就好，副本没变」。
 * 他要学的不是重新登顶，而是接受那座山已经不需要他再爬一次。
 * 黑话频率：豆芽期 2/5 → 成长期 5/5（全作峰值，他当年是靠一串缩写活着的）
 *          → 成熟期 3/5（他不再需要用黑话确认自己是谁）→ 导师期 4/5。
 * 硬规则：他的骄傲只通过「物」（旧武器、被回收的房子、还亮着的公寓）表达，
 *        从不主动报出当年的成绩数字。
 */

const statements: Statement[] = [
  // ---- 豆芽期（回忆块，Ch3 起可用）：总有一天 ----
  {
    id: 'yuanshan.sprout.01',
    characterId: 'yuanshan',
    phase: 'sprout',
    space: 'city',
    text: '总有一天我要站在零式之巅。',
    carries: ['persist', 'boast'],
    terms: ['lingshi'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '一个已经从山顶下来过的人，把同一句话递给刚入坑的人——这一次它不是目标，是出发的理由。',
        carries: ['encourage', 'recruit'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在好友列表全灰的那些夜里，这句话变成了对自己的审问：山还在，只是没有人再和他一起爬。',
        carries: ['grieve', 'reminisce'],
      },
    ],
  },
  {
    id: 'yuanshan.sprout.02',
    characterId: 'yuanshan',
    phase: 'sprout',
    space: 'city',
    text: '总有一天我要首周过绝本。',
    carries: ['persist', 'boast'],
    terms: ['shouzhou', 'jueben'],
    isDisplaceable: false,
  },
  {
    id: 'yuanshan.sprout.03',
    characterId: 'yuanshan',
    phase: 'sprout',
    space: 'field',
    text: '那时候我就想好了，总有一天我要让所有人记住我的名字。',
    carries: ['persist', 'confide'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成长期（回忆块）：报数式、不带情绪、黑话全开 ----
  {
    id: 'yuanshan.growth.01',
    characterId: 'yuanshan',
    phase: 'growth',
    space: 'dungeon',
    text: '首杀是我们的，logs全金。',
    carries: ['boast', 'persist'],
    terms: ['logs'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '很多年后他把「我们」这两个字交了出去——交给一支还不认识他、也不用认识他的新队伍。',
        carries: ['recruit', 'encourage'],
      },
      {
        kind: 'high',
        reinterpretedText: '它落进一封还停在豆芽期的信里，被一个正在求带的人读成「你也可以试试」——没有人告诉他那座山有多高。',
        carries: ['recruit', 'encourage'],
      },
    ],
  },
  {
    id: 'yuanshan.growth.02',
    characterId: 'yuanshan',
    phase: 'growth',
    space: 'dungeon',
    text: '那会儿首周我们就过了，之后全是伐木。',
    carries: ['boast'],
    terms: ['shouzhou', 'famu'],
    isDisplaceable: false,
  },
  {
    id: 'yuanshan.growth.03',
    characterId: 'yuanshan',
    phase: 'growth',
    space: 'linkshell',
    text: '开荒那阵子，低保每周都拿满。',
    carries: ['boast', 'persist'],
    terms: ['kaifang', 'dibao'],
    isDisplaceable: false,
  },

  // ---- 成熟期（Ch3–Ch4）：名词性短句、省略号、黑话转向社交与房屋 ----
  {
    id: 'yuanshan.mature.01',
    characterId: 'yuanshan',
    phase: 'mature',
    space: 'city',
    text: '好友列表全灰了……连部队的房子都被回收了。',
    carries: ['grieve', 'withdraw'],
    terms: ['budui'],
    isDisplaceable: false,
  },
  {
    id: 'yuanshan.mature.02',
    characterId: 'yuanshan',
    phase: 'mature',
    space: 'city',
    text: '至少我的公寓还在。',
    carries: ['persist', 'reminisce'],
    terms: ['gongyu'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'microshift',
        targetSpace: 'fc-house',
        reinterpretedText: '同样一句「还在」，在别人家的部队房里说出来，就成了一句告别——他确认自己只保得住那一小块地方。',
        carries: ['withdraw', 'grieve'],
      },
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '一个准备把这里当成教室的人说这句话——「还在」是他唯一想传下去的东西，比任何纪录都重要。',
        carries: ['encourage', 'recruit'],
      },
    ],
  },
  {
    id: 'yuanshan.mature.03',
    characterId: 'yuanshan',
    phase: 'mature',
    space: 'field',
    text: '在湖边坐了一下午，鱼王没上钩，但也没人催我开本。',
    carries: ['withdraw', 'persist'],
    terms: ['yuwang'],
    isDisplaceable: false,
  },

  // ---- 导师期（Ch5）：接纳式短句、给具体动作、只谈现在 ----
  {
    id: 'yuanshan.mentor.01',
    characterId: 'yuanshan',
    phase: 'mentor',
    space: 'dungeon',
    text: '回来就好，副本没变，我带你复健。',
    carries: ['reassure', 'encourage'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '对一个刚回来发现所有人都走了的人来说，「没变」既是安慰，也是刺——变的一直不是副本。',
        carries: ['grieve', 'reassure'],
      },
      {
        kind: 'microshift',
        targetSpace: 'linkshell',
        reinterpretedText: '把这句话发进一个只剩灰名字的频道，它更像是对着一间空屋子说的。',
        carries: ['grieve', 'withdraw'],
      },
    ],
  },
  {
    id: 'yuanshan.mentor.02',
    characterId: 'yuanshan',
    phase: 'mentor',
    space: 'dungeon',
    text: '豆芽别急，低保先拿满，伐木有的是时间。',
    carries: ['encourage', 'recruit'],
    terms: ['douya', 'dibao', 'famu'],
    isDisplaceable: false,
  },
  {
    id: 'yuanshan.mentor.03',
    characterId: 'yuanshan',
    phase: 'mentor',
    space: 'linkshell',
    text: '挂上导师标不代表什么都懂。我也还在学。',
    carries: ['encourage', 'confide'],
    terms: ['daoshi'],
    isDisplaceable: false,
  },
]

export const yuanshan: Character = {
  id: 'yuanshan',
  name: '远山',
  role: '前零式首杀选手 / 回归老兵',
  themeColor: '#6e8291',
  arc: '从「总有一天我要站在零式之巅」，到「回来就好，副本没变」。他要学的不是重新登顶，而是接受那座山已经不需要他再爬一次——然后把路指给还在爬的人。',
  statements,
  endings: makeCharacterEndings(
    'yuanshan',
    [
      {
        rating: 'S',
        id: 'yuanshan.S',
        name: '重生',
        summary:
          '他把仓库里那把旧武器翻了出来，跟着一支新队伍重新走进副本。这一次他不再走在最前面，而是走在最后，把走得慢的人一个一个等上来。',
      },
      {
        rating: 'A',
        id: 'yuanshan.A',
        name: '接纳',
        summary:
          '他不再守着那些再也不会亮起来的名字。每天傍晚他坐在湖边钓鱼，偶尔有路过的新人问路，他就把人一直带到路口。',
      },
      {
        rating: 'B',
        id: 'yuanshan.B',
        name: '遗憾',
        summary:
          '他习惯了在招募板前站够三十分钟，然后什么都不点，直接关掉游戏。好友列表里那几个灰着的名字，他没有删，也没有再点开过。',
      },
      {
        rating: 'C',
        id: 'yuanshan.C',
        name: '疏离',
        summary:
          '他在人群里站了很久，发现没有人需要听他讲当年的故事。后来他只在深夜上线，在曾经的部队房门口站一会儿，看两眼就下线。',
      },
      {
        rating: 'D',
        id: 'yuanshan.D',
        name: '永别',
        summary:
          '某一天他照常上线，照常站在主城最高的地方看了一会儿，然后关闭了游戏。这一次他没有和谁说再见，也没有人发现他已经很久没来。',
      },
    ],
    {
      S: ['L03-01', 'H03', 'L05-06'],
      A: ['L03-05', 'L04-05'],
      B: ['L03-02'],
      C: ['L05-01'],
      D: ['L03-04'],
    },
  ),
}
