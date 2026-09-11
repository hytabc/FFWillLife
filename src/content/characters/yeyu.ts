import type { Character, Statement } from '../../engine/types'
import { makeCharacterEndings } from '../_shared/endings'

/**
 * 夜语 —— RP 玩家 / RP 场所的常驻角色。
 * 语义弧光：从「我可以扮演任何人」，到「你扮演的角色，也是你的一部分」。
 * 他最后要学的不是演谁，是谁在演。
 * 黑话频率：1/5 → 2/5 → 3/5 → 2/5 —— 全作唯一**不随成长上升**的角色。
 *   他的术语是诊断工具，不是身份认同：成长期为止他只用"世界内语言"，
 *   直到成熟期才第一次需要用游戏外的词来描述自己的困境（RP / 角色内 / 角色外）。
 */

const statements: Statement[] = [
  // ---- 豆芽期（零散回忆块，Ch3 起可用）：先造一个别人 ----
  {
    id: 'yeyu.sprout.01',
    characterId: 'yeyu',
    phase: 'sprout',
    space: 'rp-venue',
    text: '我可以扮演任何人。',
    carries: ['withdraw', 'confide'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '很多年以后，他把这句话原样递了出去——「你可以演任何人」。那时它不再是逃跑的借口，而是一张许可。',
        carries: ['encourage', 'recruit'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在分不清自己是谁的那些夜里，同一句话翻了个面：我可以扮演任何人，除了我自己。',
        carries: ['grieve', 'withdraw'],
      },
    ],
  },
  {
    id: 'yeyu.sprout.02',
    characterId: 'yeyu',
    phase: 'sprout',
    space: 'city',
    text: '我在公寓里留了一盏灯，给那个不是我的人。',
    carries: ['withdraw', 'confide'],
    terms: ['gongyu'],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.sprout.03',
    characterId: 'yeyu',
    phase: 'sprout',
    space: 'city',
    text: '如果明天醒来，被记得的是那个人……好像也不错。',
    carries: ['withdraw', 'confide'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 成长期（Ch3）：虚拟比现实舒适，并为此窃喜 ----
  {
    id: 'yeyu.growth.01',
    characterId: 'yeyu',
    phase: 'growth',
    space: 'rp-venue',
    text: '那家店的灯是暖的。我在里面的时候，比在外面更像个活人。',
    carries: ['confide', 'withdraw'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.growth.02',
    characterId: 'yeyu',
    phase: 'growth',
    space: 'rp-venue',
    text: '这套幻化我搭了一整晚。穿上它，我连走路的样子都变了。',
    carries: ['persist', 'withdraw'],
    terms: ['huanhua'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'microshift',
        targetSpace: 'city',
        reinterpretedText: '同样一身衣服走到主城的人群里，没有人多看他一眼——那正是他想要的效果。',
        carries: ['withdraw'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在一个已经分不清自己是谁的夜里，他不敢再穿上它：穿上就脱不下来了。',
        carries: ['grieve', 'withdraw'],
      },
    ],
  },
  {
    id: 'yeyu.growth.03',
    characterId: 'yeyu',
    phase: 'growth',
    space: 'rp-venue',
    text: '那个跨服通讯贝里，我几乎不说话。知道它开着就够了。',
    carries: ['withdraw', 'reassure'],
    terms: ['cwls'],
    isDisplaceable: false,
  },

  // ---- 成熟期（Ch4）：第一次需要用游戏外的词描述自己的困境 ----
  {
    id: 'yeyu.mature.01',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'rp-venue',
    text: 'RP标挂久了，分不清角色内和角色外了。',
    carries: ['confide', 'grieve'],
    terms: ['rp', 'ic-ooc'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '「分不清」这三个字，后来成了他坐在新人对面的底气——因为他就是从那里一步一步走出来的。',
        carries: ['encourage', 'reassure'],
      },
      {
        kind: 'high',
        reinterpretedText: '它落进一封很早以前的信里，被一个还没戴上面具的人读到——那个人还没学会逃，就先读到了摘不下来的样子。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'yeyu.mature.02',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'rp-venue',
    text: '在那家RP店里，有人叫我角色的名字，我下意识回了头。',
    carries: ['confide', 'grieve'],
    terms: ['rp-dian'],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.mature.03',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'linkshell',
    text: '有人问我现实里是什么样的人。我答不上来，就把话题岔开了。',
    carries: ['withdraw', 'confide'],
    terms: [],
    isDisplaceable: false,
  },

  // ---- 导师期（Ch5）：整合，第二人称，不否定任何一面 ----
  {
    id: 'yeyu.mentor.01',
    characterId: 'yeyu',
    phase: 'mentor',
    space: 'rp-venue',
    text: '你的RP角色，也是你光之战士的一部分。',
    carries: ['encourage', 'recruit'],
    terms: ['rp'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在还分不清自己是谁的时候读到这句话，它像是一句辩护：两副嗓子都是你的，不必挑一个。',
        carries: ['reassure', 'confide'],
      },
      {
        kind: 'high',
        reinterpretedText: '在一个不属于这个时空的信件里，这句话被另一个人读到——它替那个人说出了他一直说不出口的那个词：整合。',
        carries: ['encourage', 'recruit'],
      },
    ],
  },
  {
    id: 'yeyu.mentor.02',
    characterId: 'yeyu',
    phase: 'mentor',
    space: 'rp-venue',
    text: '那家店的门一直开着。你什么时候来、坐多久，都可以。',
    carries: ['invite', 'boundary'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.mentor.03',
    characterId: 'yeyu',
    phase: 'mentor',
    space: 'linkshell',
    text: '把它玩成暖暖也没关系。衣服是你自己挑的，人也是。',
    carries: ['encourage', 'boundary'],
    terms: ['nuannuan'],
    isDisplaceable: false,
  },

  // ---- 同一句话不再跨信重复：以下为各信专用版本，carries 与原句一致 ----
  {
    id: 'yeyu.growth.03b',
    characterId: 'yeyu',
    phase: 'growth',
    space: 'rp-venue',
    text: '那个跨服通讯贝里我从不吭声，知道它亮着就行。',
    carries: ['withdraw', 'reassure'],
    terms: ['cwls'],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.growth.03c',
    characterId: 'yeyu',
    phase: 'growth',
    space: 'rp-venue',
    text: '那个跨服通讯贝里我一句话也不说，看着就够了。',
    carries: ['withdraw', 'reassure'],
    terms: ['cwls'],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.mature.01b',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'rp-venue',
    text: '角色内和角色外，我已经分不清了。',
    carries: ['confide', 'grieve'],
    terms: ['rp', 'ic-ooc'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '「分不清」这三个字，后来成了他坐在新人对面的底气——因为他就是从那里一步一步走出来的。',
        carries: ['encourage', 'reassure'],
      },
      {
        kind: 'high',
        reinterpretedText: '它落进一封很早以前的信里，被一个还没戴上面具的人读到——那个人还没学会逃，就先读到了摘不下来的样子。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'yeyu.mature.01c',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'rp-venue',
    text: '挂着角色的名字太久，我快忘了自己本来叫什么。',
    carries: ['confide', 'grieve'],
    terms: ['rp', 'ic-ooc'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '「分不清」这三个字，后来成了他坐在新人对面的底气——因为他就是从那里一步一步走出来的。',
        carries: ['encourage', 'reassure'],
      },
      {
        kind: 'high',
        reinterpretedText: '它落进一封很早以前的信里，被一个还没戴上面具的人读到——那个人还没学会逃，就先读到了摘不下来的样子。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'yeyu.mature.02b',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'rp-venue',
    text: '那家店里有人喊了一声我角色的名字，我回头了。',
    carries: ['confide', 'grieve'],
    terms: ['rp-dian'],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.mature.02c',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'rp-venue',
    text: '灯下面有人叫那个名字，我下意识就应了。',
    carries: ['confide', 'grieve'],
    terms: ['rp-dian'],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.mature.02d',
    characterId: 'yeyu',
    phase: 'mature',
    space: 'rp-venue',
    text: '有人用角色的名字叫我，我应得太快了。',
    carries: ['confide', 'grieve'],
    terms: ['rp-dian'],
    isDisplaceable: false,
  },
  {
    id: 'yeyu.mentor.01b',
    characterId: 'yeyu',
    phase: 'mentor',
    space: 'rp-venue',
    text: '你演的那个人，也是你自己的一部分。',
    carries: ['encourage', 'recruit'],
    terms: ['rp'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在还分不清自己是谁的时候读到这句话，它像是一句辩护：两副嗓子都是你的，不必挑一个。',
        carries: ['reassure', 'confide'],
      },
      {
        kind: 'high',
        reinterpretedText: '在一个不属于这个时空的信件里，这句话被另一个人读到——它替那个人说出了他一直说不出口的那个词：整合。',
        carries: ['encourage', 'recruit'],
      },
    ],
  },
]

export const yeyu: Character = {
  id: 'yeyu',
  name: '夜语',
  role: '法系 / RP 玩家',
  themeColor: '#7b6cf6',
  arc: '从「我可以扮演任何人」，到「你扮演的角色，也是你的一部分」。他最后要学会的不是演谁，而是谁在演。',
  statements,
  endings: makeCharacterEndings(
    'yeyu',
    [
      {
        rating: 'S',
        id: 'yeyu.S',
        name: '整合',
        summary:
          '他开始用同一个声音说话，不再区分哪一句是角色的、哪一句是自己的。新来的扮演者问他「我到底是谁」，他只回了一句：都是你。',
      },
      {
        rating: 'A',
        id: 'yeyu.A',
        name: '和解',
        summary:
          '他不再追问面具下面是谁。散场之后他会把那个人留在店里，自己走出来——但走得不再像在逃跑。',
      },
      {
        rating: 'B',
        id: 'yeyu.B',
        name: '边界',
        summary:
          '他给自己定了一条规矩：进了那家店就是那个人，出了门就是自己。这条线让他安全，也让他偶尔在门口多站一会儿。',
      },
      {
        rating: 'C',
        id: 'yeyu.C',
        name: '迷失',
        summary:
          '他醒着的时候在店里，睡着的时候梦见店里。上线的时间越来越长，有一天他发现频道里已经没有人再喊他真正的名字。',
      },
      {
        rating: 'D',
        id: 'yeyu.D',
        name: '崩塌',
        summary:
          '有人在店里当众拆穿了他：那个被所有人喜欢的角色，和他本人没有一点关系。他退掉了所有频道，那家店的门也再没有进去过。',
      },
    ],
    {
      S: ['L04-03', 'H04', 'L05-07'],
      A: ['L04-04'],
      B: ['L04-02'],
      C: ['L04-01'],
      D: ['L05-08'],
    },
  ),
}
