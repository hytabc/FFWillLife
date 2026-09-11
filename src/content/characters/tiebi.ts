import type { Character, Statement } from '../../engine/types'
import { makeCharacterEndings } from '../_shared/endings'

/**
 * 铁壁 —— 坦克（战士系）/ 部队长。
 * 语义弧光：同一条「我想建一个谁都不会被丢下的部队」——豆芽期是梦话，成长期是宣言，
 * 成熟期是检讨（必带悔意），导师期是结论（必带代价）。见 STORY-BIBLE §3.4。
 * 黑话频率：豆芽期 2/5 → 成长期 3/5 → 成熟期 3/5 → 导师期 4/5；
 * 他的术语永远指向"人"或"地方"（部队、房子、位置），从不指向"数据"——
 * 全作不得使用 炒股 / logs / 进度欺诈。
 * 注意：Ch3 之前他只能称远山为「当年带我的那个人」。
 */

const statements: Statement[] = [
  // ---- 豆芽期：怕没人要，用"求带"换一个位置 ----
  {
    id: 'tiebi.sprout.01',
    characterId: 'tiebi',
    phase: 'sprout',
    space: 'city',
    text: '有人能带我打日随吗？豆芽求带。',
    carries: ['confide', 'invite'],
    terms: ['douya'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText:
          '这句话被拖到他建起部队之后——他终于不必再求人，却还是会想起当年没人回他的那几分钟。',
        carries: ['reminisce', 'grieve'],
      },
      {
        kind: 'high',
        reinterpretedText:
          '两个时间被折在一起：求带的人已经在带人了，而带人的那个人还在求。这句话此刻不属于任何一个时间。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'tiebi.sprout.02',
    characterId: 'tiebi',
    phase: 'sprout',
    space: 'dungeon',
    text: '对不起，我又倒下了……我是不是很没用？',
    carries: ['apology', 'confide'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'tiebi.sprout.03',
    characterId: 'tiebi',
    phase: 'sprout',
    space: 'linkshell',
    text: '我可以跟着你们吗？我不说话也行。',
    carries: ['confide', 'invite'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成长期：宣言、热气腾腾、不切实际 ----
  {
    id: 'tiebi.growth.01',
    characterId: 'tiebi',
    phase: 'growth',
    space: 'fc-house',
    text: '我想建一个不踢AFK成员的部队。',
    carries: ['recruit', 'persist', 'invite'],
    terms: ['budui'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'microshift',
        targetSpace: 'linkshell',
        reinterpretedText:
          '同一句话放到公开频道里，就成了一句招牌——从那天起，他每天都要把它兑现一遍。',
        carries: ['persist', 'reassure'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText:
          '在成熟期，这句话变成了一次检讨——他已经知道自己做不到「谁都不会被丢下」，但他没有改口。',
        carries: ['grieve', 'persist'],
      },
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText:
          '他终于算清「不丢下任何人」的代价是多少，然后决定继续付。这句话不再许愿，它只是结论。',
        carries: ['persist', 'recruit'],
      },
    ],
  },
  {
    id: 'tiebi.growth.02',
    characterId: 'tiebi',
    phase: 'growth',
    space: 'city',
    text: '我在通讯贝里发了招募，来的人我一个都不赶。',
    carries: ['recruit', 'reassure'],
    terms: ['tongxunbei'],
    isDisplaceable: false,
  },
  {
    id: 'tiebi.growth.03',
    characterId: 'tiebi',
    phase: 'growth',
    space: 'field',
    text: '总有一天，谁都不用再站在副本门口求人！',
    carries: ['persist', 'recruit'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成熟期：让渡、用具体资产表达感情 ----
  {
    id: 'tiebi.mature.01',
    characterId: 'tiebi',
    phase: 'mature',
    space: 'fc-house',
    text: 'FC不是我一个人的，房子也是大家的。',
    carries: ['boundary', 'reassure'],
    terms: ['budui'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText:
          '被拖回成长期，这句话像一次过早的放手——那时的他其实还想把每一个人都攥在手里。',
        carries: ['persist'],
      },
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText:
          '在导师期它不再是谦让，而是一句承诺：这个地方永远有你的位置，哪怕你不再回来。',
        carries: ['reassure', 'recruit'],
      },
    ],
  },
  {
    id: 'tiebi.mature.02',
    characterId: 'tiebi',
    phase: 'mature',
    space: 'fc-house',
    text: '部队房重新装修过了，AFK 的人也给留着位置。',
    carries: ['reassure', 'invite'],
    terms: ['zhuangxiu'],
    isDisplaceable: false,
  },
  {
    id: 'tiebi.mature.03',
    characterId: 'tiebi',
    phase: 'mature',
    space: 'dungeon',
    text: '低保谁缺谁拿，我不急这一件。',
    carries: ['reassure', 'boundary'],
    terms: ['dibao'],
    isDisplaceable: false,
  },

  // ---- 导师期：最短句，句号落地，不解释 ----
  {
    id: 'tiebi.mentor.01',
    characterId: 'tiebi',
    phase: 'mentor',
    space: 'fc-house',
    text: '欢迎回家。',
    carries: ['reassure', 'recruit'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText:
          '在成熟期，这句话还说不出口——他嘴上说着欢迎，手还搭在门闩上，没打算真的松开。',
        carries: ['persist', 'withdraw'],
      },
      {
        kind: 'high',
        reinterpretedText:
          '这句话被送回他还在求带的那些年：那时的他没有门，也没有一个可以让谁回来的地方。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'tiebi.mentor.02',
    characterId: 'tiebi',
    phase: 'mentor',
    space: 'fc-house',
    text: '欢迎回部队，房屋永远给你留了位置。',
    carries: ['reassure', 'invite'],
    terms: ['budui'],
    isDisplaceable: false,
  },
  {
    id: 'tiebi.mentor.03',
    characterId: 'tiebi',
    phase: 'mentor',
    space: 'linkshell',
    text: '哪天你挂着放浪神加护回来，在 CWLS 里喊一声就行。位置一直空着。',
    carries: ['reassure', 'invite'],
    terms: ['fuqiang', 'cwls'],
    isDisplaceable: false,
  },
]

export const tiebi: Character = {
  id: 'tiebi',
  name: '铁壁',
  role: '部队长',
  themeColor: '#3F7FBF',
  arc: '从「有人能带我打日随吗」，到「欢迎回家」。他建了一个谁都不会被丢下的地方，把所有人都留住了——最后要学会的，是把自己也放进那个地方。',
  statements,
  endings: makeCharacterEndings(
    'tiebi',
    [
      {
        rating: 'S',
        id: 'tiebi.S',
        name: '薪火·守夜',
        summary:
          '他等到了那个愿意接手的人。部队的灯还亮着，门环还是当年那个，新人推门进来的时候有人在——他没有走，他只是终于肯坐下来，让别人去开门。',
      },
      {
        rating: 'A',
        id: 'tiebi.A',
        name: '放手',
        summary:
          '他把钥匙和权限交了出去，不再事事亲力亲为。部队缩了一圈，留下的人反而比以前靠得更近。他还是每天上线，只是不再点名。',
      },
      {
        rating: 'B',
        id: 'tiebi.B',
        name: '缺口',
        summary:
          '他最看好的那个人离开了部队。那天晚上他在部队房里坐到很晚，把位置原样留了出来，一句挽留的话也没说——他知道说了就变味了。',
      },
      {
        rating: 'C',
        id: 'tiebi.C',
        name: '疲惫',
        summary:
          '部队活动越办越少，公告板上的日期停在了上个月。他还在续着部队房的租金，只是不再问谁什么时候上线。',
      },
      {
        rating: 'D',
        id: 'tiebi.D',
        name: '解散',
        summary:
          '一次内部争执之后，他把部队解散了。退租那天他一个人站在空房子里，把成员名单从头看到尾，最后关灯走了。',
      },
    ],
    {
      S: ['L02-05', 'L03-01', 'L05-04'],
      A: ['L03-01', 'L05-06'],
      B: ['L02-05', 'L05-04'],
      C: ['L03-05'],
      D: ['L02-03'],
    },
  ),
}
