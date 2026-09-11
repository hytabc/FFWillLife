import type { Character, Statement } from '../../engine/types'
import { makeCharacterEndings } from '../_shared/endings'

/**
 * 铃兰 —— 通讯贝管理员 / 休闲内容玩家。
 * 语义弧光：从「加个好友吧？」，到「倾听本身就是一种陪伴」。
 * 她把所有人连在一起，然后站在连接点外面；她要学的是：连接是自由的。
 * 黑话频率：豆芽期 1/5 → 成长期 2/5 → 成熟期 2/5 → 导师期 3/5。
 *   她的术语全部围绕社交系统（通讯贝 / CWLS / 挂机 / 频道），
 *   且**从不谈副本**——这不是她不会，是她不在那里。
 */

const statements: Statement[] = [
  // ---- 豆芽期（回忆块，Ch2 起可用）：用加好友换一个位置 ----
  {
    id: 'linglan.sprout.01',
    characterId: 'linglan',
    phase: 'sprout',
    space: 'city',
    text: '加个好友吧？我拉你进通讯贝。',
    carries: ['invite'],
    terms: ['tongxunbei'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText: '同一个问句，这一次她是站在门里的那个人：门开着，位置留着，来不来都可以。',
        carries: ['invite', 'encourage'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '说出口的时候，她其实是在等有人这样问她——但所有听见的人，都只当成了一份邀请。',
        carries: ['confide', 'grieve'],
      },
    ],
  },
  {
    id: 'linglan.sprout.02',
    characterId: 'linglan',
    phase: 'sprout',
    space: 'city',
    text: '以后上线我喊你，好不好？',
    carries: ['invite', 'persist'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'linglan.sprout.03',
    characterId: 'linglan',
    phase: 'sprout',
    space: 'linkshell',
    text: '还有谁没进来？要不要我拉你？',
    carries: ['invite', 'persist'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成长期（Ch2–Ch3）：把「在」当成付出 ----
  {
    id: 'linglan.growth.01',
    characterId: 'linglan',
    phase: 'growth',
    space: 'linkshell',
    text: 'CWLS建好了，随时来聊天。',
    carries: ['invite', 'reassure'],
    terms: ['cwls'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'microshift',
        targetSpace: 'fc-house',
        reinterpretedText: '把这句话说在部队房里，它就不只是一个频道，而是一间永远留着灯的房间。',
        carries: ['reassure', 'invite'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '很久以后她重读这一句，才发现频道一直开着——只是里面的名字一个接一个灰了下去。',
        carries: ['grieve', 'withdraw'],
      },
    ],
  },
  {
    id: 'linglan.growth.02',
    characterId: 'linglan',
    phase: 'growth',
    space: 'linkshell',
    text: '我在通讯贝里等你们。',
    carries: ['reassure', 'persist'],
    terms: ['tongxunbei'],
    isDisplaceable: false,
  },
  {
    id: 'linglan.growth.03',
    characterId: 'linglan',
    phase: 'growth',
    space: 'dungeon',
    text: '你们忙你们的，我留在频道里等着。',
    carries: ['reassure', 'persist'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成熟期（Ch4）：用数字包装孤独 ----
  {
    id: 'linglan.mature.01',
    characterId: 'linglan',
    phase: 'mature',
    space: 'linkshell',
    text: '通讯贝的消息999+，但没有人私聊我。',
    carries: ['confide', 'grieve'],
    terms: ['tongxunbei'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '很久以后她才读得懂这一句：它从来不是控诉，只是一个人在数自己手里还剩多少东西。',
        carries: ['boundary', 'reassure'],
      },
      {
        kind: 'high',
        reinterpretedText: '在一个不属于这个时空的频道里，这一行会被所有人看见——那是她唯一一次没有把孤独藏进数字里。',
        carries: ['confide', 'grieve'],
      },
    ],
  },
  {
    id: 'linglan.mature.02',
    characterId: 'linglan',
    phase: 'mature',
    space: 'rp-venue',
    text: '里面的人在RP，我在门口数还剩几个位置。……那我呢？',
    carries: ['withdraw', 'confide'],
    terms: ['rp'],
    isDisplaceable: false,
  },
  {
    id: 'linglan.mature.03',
    characterId: 'linglan',
    phase: 'mature',
    space: 'rp-venue',
    text: '那家RP店是我张罗起来的。散场以后，没有人问过我叫什么。',
    carries: ['withdraw', 'grieve'],
    terms: ['rp-dian'],
    isDisplaceable: false,
  },

  // ---- 导师期（Ch5）：倾听本身就是一种陪伴 ----
  {
    id: 'linglan.mentor.01',
    characterId: 'linglan',
    phase: 'mentor',
    space: 'linkshell',
    text: '倾听本身就是一种陪伴。',
    carries: ['reassure', 'boundary'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText: '在还靠热闹确认自己被需要的时候读到它，她只当是一句安慰——那时她还做不到，但她把它记了下来。',
        carries: ['confide', 'persist'],
      },
      {
        kind: 'high',
        reinterpretedText: '在一个和「我是谁」互换过的时空里，这句话照样成立：它回答的不是「我是谁」，而是「我在不在」。',
        carries: ['reassure', 'encourage'],
      },
    ],
  },
  {
    id: 'linglan.mentor.02',
    characterId: 'linglan',
    phase: 'mentor',
    space: 'linkshell',
    text: '不用一直说话，在通讯贝里挂机也是一种陪伴。',
    carries: ['reassure', 'boundary'],
    terms: ['tongxunbei', 'guaji'],
    isDisplaceable: false,
  },
  {
    id: 'linglan.mentor.03',
    characterId: 'linglan',
    phase: 'mentor',
    space: 'rp-venue',
    text: '散场之前，我们gpose一张吧。不用笑也行。',
    carries: ['invite', 'reassure'],
    terms: ['gpose'],
    isDisplaceable: false,
  },
]

export const linglan: Character = {
  id: 'linglan',
  name: '铃兰',
  role: '通讯贝管理员 / 休闲内容玩家',
  themeColor: '#a8d5ba',
  arc: '从「加个好友吧？」，到「倾听本身就是一种陪伴」。她把所有人连在一起，然后站在连接点外面——她要学的不是怎么留住人，而是允许有人离开。',
  statements,
  endings: makeCharacterEndings(
    'linglan',
    [
      {
        rating: 'S',
        id: 'linglan.S',
        name: '倾听',
        summary:
          '她开始把频道交给别人打理，自己只留在最里面那一层。有人问她为什么不再一个个拉人，她说：想来的人自然会来。',
      },
      {
        rating: 'A',
        id: 'linglan.A',
        name: '守望',
        summary:
          '她继续开着那些频道，只是不再每天数里面有多少人。有人上线她就应一声；没有人说话，她也睡得着。',
      },
      {
        rating: 'B',
        id: 'linglan.B',
        name: '静默',
        summary:
          '她关掉了大部分频道，只留下最早建的那一个。里面只有六七个人，都认识很多年了，谁也不用说话。',
      },
      {
        rating: 'C',
        id: 'linglan.C',
        name: '孤立',
        summary:
          '她的名字出现在所有人的好友列表里。她翻了一遍自己的列表，想找一个人说说话，最后谁也没有点开。',
      },
      {
        rating: 'D',
        id: 'linglan.D',
        name: '断线',
        summary:
          '一天夜里，她把那些频道一个一个关掉了。第二天她的名字再也没有亮起来，也没有人知道该去哪里找她。',
      },
    ],
    {
      S: ['L04-03', 'L05-07', 'L05-08'],
      A: ['L04-05', 'L03-05'],
      B: ['L04-01'],
      C: ['L03-02', 'H04'],
      D: ['L05-04'],
    },
  ),
}
