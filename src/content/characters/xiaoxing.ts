import type { Character, Statement } from '../../engine/types'
import { makeCharacterEndings, makeSpecialEnding } from '../_shared/endings'
import { SPECIAL_CONDITION_IDS } from '../../engine/coexist'

/**
 * 小星 —— 豆芽 → 导师（战斗系指导者）。
 * 语义弧光：同一条「零式是什么，我能来吗？」从**请求许可**变成**授予许可**。
 * 她是唯一在全部 5 章出场的角色，也是时空错位机制的情感载体——
 * 她的每一条语句都按"它会被拖到别的阶段"来写（见 STORY-BIBLE §3.5）。
 * 黑话频率：豆芽期 1/5 → 成长期 2/5 → 成熟期 3/5 → 导师期 4/5；
 * 她用的每个术语都必须"来自她之前听别人说过的词"（§7.4）。
 */

const statements: Statement[] = [
  // ---- 豆芽期：怯懦的请求、怕被嫌烦 ----
  {
    id: 'xiaoxing.sprout.01',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'city',
    text: '绝本是什么？豆芽能进吗？',
    carries: ['confide'],
    terms: ['jueben', 'douya'],
    isDisplaceable: false,
  },
  {
    id: 'xiaoxing.sprout.02',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'city',
    text: '零式是什么，我能来吗？',
    carries: ['confide', 'invite'],
    terms: ['lingshi'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText: '她已经会了。这句话从她嘴里再说出来，只会被当成装嫩——她笑了笑，把后半句咽了回去。',
        carries: ['withdraw', 'confide'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '她拿它开自己的玩笑——笑完，把它原样递给下一个站在门口不敢进来的人。',
        carries: ['encourage', 'reassure'],
      },
      {
        kind: 'high',
        reinterpretedText:
          '两个时点被压在同一句话上：问的人还没有被回答，答的人已经忘了自己问过。这句话落地时，两端的时间都缺了一角。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'xiaoxing.sprout.03',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '那个……跨服通讯贝里的人说要打本，我可以跟着吗？',
    carries: ['confide', 'invite'],
    terms: ['cwls'],
    isDisplaceable: false,
  },

  {
    id: 'xiaoxing.sprout.04',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '有人在吗？我不敢一个人排本。',
    carries: ['confide'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'xiaoxing.sprout.05',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '你们说的那个词，我查了半天也没查懂。',
    carries: ['confide', 'apology'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '多年以后她终于听懂了那个词，却发现当年没人愿意花十秒钟解释给她。',
        carries: ['grieve', 'encourage'],
      },
    ],
  },
  {
    id: 'xiaoxing.sprout.06',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '我会努力的，别不要我。',
    carries: ['apology', 'confide'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '她终于可以对当年的自己说：不会的。他们不会不要你，而且——就算真的不要，你也还在。',
        carries: ['encourage', 'boundary'],
      },
    ],
  },

  // ---- 成长期：急于证明自己有用 ----
  {
    id: 'xiaoxing.growth.01',
    characterId: 'xiaoxing',
    phase: 'growth',
    space: 'dungeon',
    text: '这个机制我熟，我来标A点。',
    carries: ['persist', 'reassure'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'sprout',
        reinterpretedText:
          '被拖回豆芽期，这句话是虚张声势——那时的她还分不清机制的名字，说了只会被当成笑话。',
        carries: ['confide'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '她已经不需要抢着说「我来」了——这句话里的那个位置，她终于学会了让给别人。',
        carries: ['encourage', 'boundary'],
      },
    ],
  },
  {
    id: 'xiaoxing.growth.02',
    characterId: 'xiaoxing',
    phase: 'growth',
    space: 'linkshell',
    text: '固定队要是缺人，就喊我，我练熟了！',
    carries: ['persist', 'invite'],
    terms: ['gudingdui'],
    isDisplaceable: false,
  },
  {
    id: 'xiaoxing.growth.03',
    characterId: 'xiaoxing',
    phase: 'growth',
    space: 'fc-house',
    text: '部队的通讯贝里有人教我了，我全记在本子上。',
    carries: ['confide', 'persist'],
    terms: ['budui', 'tongxunbei'],
    isDisplaceable: false,
  },

  // ---- 成熟期：开始理解当年的不耐烦，并选择不复制它 ----
  {
    id: 'xiaoxing.mature.01',
    characterId: 'xiaoxing',
    phase: 'mature',
    space: 'dungeon',
    text: '狂暴了没关系，再渡一次劫。',
    carries: ['reassure', 'encourage'],
    terms: ['kuangbao'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText:
          '被拖回成长期，这句话会被当成不上进——那时的她还在拼命证明自己配得上这支队伍。',
        carries: ['persist', 'confide'],
      },
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '在导师期，它不再是对队友的安慰，而是对新人的承诺：时间还够，你慢慢来。',
        carries: ['encourage', 'recruit'],
      },
    ],
  },
  {
    id: 'xiaoxing.mature.02',
    characterId: 'xiaoxing',
    phase: 'mature',
    space: 'city',
    text: '我也想挂上导师标，然后不凶任何人。',
    carries: ['persist', 'encourage'],
    terms: ['daoshi'],
    isDisplaceable: false,
  },
  {
    id: 'xiaoxing.mature.03',
    characterId: 'xiaoxing',
    phase: 'mature',
    space: 'dungeon',
    text: '渡劫失败了也没关系，我们又不赶，再试一次。',
    carries: ['reassure', 'encourage'],
    terms: ['dujie'],
    isDisplaceable: false,
  },

  // ---- 导师期：把当年收到的善意递给下一个人 ----
  {
    id: 'xiaoxing.mentor.01',
    characterId: 'xiaoxing',
    phase: 'mentor',
    space: 'dungeon',
    text: '豆芽慢慢来，我当初也是被人拖过本的。',
    carries: ['encourage', 'recruit'],
    terms: ['douya'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在成熟期，她说不出「被人拖过本」这种话——那听起来像是她欠了谁。',
        carries: ['persist', 'confide'],
      },
      {
        kind: 'high',
        reinterpretedText:
          '这句话被送回她第一次进本的那个晚上：说的人和听的人是同一个，中间隔着的那些年一起消失了。',
        carries: ['confide', 'reminisce'],
      },
    ],
  },
  {
    id: 'xiaoxing.mentor.02',
    characterId: 'xiaoxing',
    phase: 'mentor',
    space: 'field',
    text: '你问绝本是什么的样子，跟我当初一模一样。',
    carries: ['encourage', 'reminisce'],
    terms: ['jueben'],
    isDisplaceable: false,
  },
  {
    id: 'xiaoxing.mentor.03',
    characterId: 'xiaoxing',
    phase: 'mentor',
    space: 'linkshell',
    text: '装备不急，低保慢慢攒。哪天我挂着放浪神加护走了，位置也给你留着。',
    carries: ['reassure', 'invite'],
    terms: ['dibao', 'fuqiang'],
    isDisplaceable: false,
  },

  // ---- 同一句话不再跨信重复：以下为各信专用版本，carries 与原句一致 ----
  {
    id: 'xiaoxing.sprout.02b',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'city',
    text: '零式是什么样子的？我这种能去吗？',
    carries: ['confide', 'invite'],
    terms: ['lingshi'],
    isDisplaceable: true,
  },
  {
    id: 'xiaoxing.sprout.02c',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'city',
    text: '零式是干什么的？我这样的人也能去吗？',
    carries: ['confide', 'invite'],
    terms: ['lingshi'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText: '她已经会了。这句话从她嘴里再说出来，只会被当成装嫩——她笑了笑，把后半句咽了回去。',
        carries: ['withdraw', 'confide'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '她拿它开自己的玩笑——笑完，把它原样递给下一个站在门口不敢进来的人。',
        carries: ['encourage', 'reassure'],
      },
      {
        kind: 'high',
        reinterpretedText: '两个时点被压在同一句话上：问的人还没有被回答，答的人已经忘了自己问过。这句话落地时，两端的时间都缺了一角。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'xiaoxing.sprout.02d',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'city',
    text: '零式是什么，我这种新人可以去吗？',
    carries: ['confide', 'invite'],
    terms: ['lingshi'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText: '她已经会了。这句话从她嘴里再说出来，只会被当成装嫩——她笑了笑，把后半句咽了回去。',
        carries: ['withdraw', 'confide'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '她拿它开自己的玩笑——笑完，把它原样递给下一个站在门口不敢进来的人。',
        carries: ['encourage', 'reassure'],
      },
      {
        kind: 'high',
        reinterpretedText: '两个时点被压在同一句话上：问的人还没有被回答，答的人已经忘了自己问过。这句话落地时，两端的时间都缺了一角。',
        carries: ['grieve', 'confide'],
      },
    ],
  },
  {
    id: 'xiaoxing.sprout.03b',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '那个……跨服通讯贝里说要去打本，能带我一个吗？',
    carries: ['confide', 'invite'],
    terms: ['cwls'],
    isDisplaceable: false,
  },
  {
    id: 'xiaoxing.sprout.04b',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '有谁在线吗？一个人排本我有点怕。',
    carries: ['confide'],
    terms: [],
    isDisplaceable: false,
  },
  {
    id: 'xiaoxing.sprout.05b',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '你们刚说的那个词，我到现在也没弄明白。',
    carries: ['confide', 'apology'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '多年以后她终于听懂了那个词，却发现当年没人愿意花十秒钟解释给她。',
        carries: ['grieve', 'encourage'],
      },
    ],
  },
  {
    id: 'xiaoxing.sprout.06b',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '我会学快一点的，你们别丢下我。',
    carries: ['apology', 'confide'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '她终于可以对当年的自己说：不会的。他们不会不要你，而且——就算真的不要，你也还在。',
        carries: ['encourage', 'boundary'],
      },
    ],
  },
  {
    id: 'xiaoxing.sprout.06c',
    characterId: 'xiaoxing',
    phase: 'sprout',
    space: 'linkshell',
    text: '我会好好学的，别把我一个人留下。',
    carries: ['apology', 'confide'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '她终于可以对当年的自己说：不会的。他们不会不要你，而且——就算真的不要，你也还在。',
        carries: ['encourage', 'boundary'],
      },
    ],
  },
  {
    id: 'xiaoxing.growth.01b',
    characterId: 'xiaoxing',
    phase: 'growth',
    space: 'dungeon',
    text: '这个机制我会，我来标点吧。',
    carries: ['persist', 'reassure'],
    terms: [],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'sprout',
        reinterpretedText:
          '被拖回豆芽期，这句话是虚张声势——那时的她还分不清机制的名字，说了只会被当成笑话。',
        carries: ['confide'],
      },
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '她已经不需要抢着说「我来」了——这句话里的那个位置，她终于学会了让给别人。',
        carries: ['encourage', 'boundary'],
      },
    ],
  },
  {
    id: 'xiaoxing.mature.01b',
    characterId: 'xiaoxing',
    phase: 'mature',
    space: 'dungeon',
    text: '狂暴了也没事，我们再来一把。',
    carries: ['reassure', 'encourage'],
    terms: ['kuangbao'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'growth',
        reinterpretedText:
          '被拖回成长期，这句话会被当成不上进——那时的她还在拼命证明自己配得上这支队伍。',
        carries: ['persist', 'confide'],
      },
      {
        kind: 'transform',
        targetPhase: 'mentor',
        reinterpretedText: '在导师期，它不再是对队友的安慰，而是对新人的承诺：时间还够，你慢慢来。',
        carries: ['encourage', 'recruit'],
      },
    ],
  },
  {
    id: 'xiaoxing.mentor.01b',
    characterId: 'xiaoxing',
    phase: 'mentor',
    space: 'dungeon',
    text: '豆芽别怕，我也是被人一路带过来的。',
    carries: ['encourage', 'recruit'],
    terms: ['douya'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在成熟期，她说不出「被人拖过本」这种话——那听起来像是她欠了谁。',
        carries: ['persist', 'confide'],
      },
      {
        kind: 'high',
        reinterpretedText:
          '这句话被送回她第一次进本的那个晚上：说的人和听的人是同一个，中间隔着的那些年一起消失了。',
        carries: ['confide', 'reminisce'],
      },
    ],
  },
  {
    id: 'xiaoxing.mentor.01c',
    characterId: 'xiaoxing',
    phase: 'mentor',
    space: 'dungeon',
    text: '豆芽慢慢来，我也是被人拉进本的。',
    carries: ['encourage', 'recruit'],
    terms: ['douya'],
    isDisplaceable: true,
    variants: [
      {
        kind: 'transform',
        targetPhase: 'mature',
        reinterpretedText: '在成熟期，她说不出「被人拖过本」这种话——那听起来像是她欠了谁。',
        carries: ['persist', 'confide'],
      },
      {
        kind: 'high',
        reinterpretedText:
          '这句话被送回她第一次进本的那个晚上：说的人和听的人是同一个，中间隔着的那些年一起消失了。',
        carries: ['confide', 'reminisce'],
      },
    ],
  },
]

export const xiaoxing: Character = {
  id: 'xiaoxing',
  name: '小星',
  role: '豆芽 → 导师',
  themeColor: '#6ECB8B',
  arc: '从「零式是什么，我能来吗？」，到「豆芽慢慢来」。同一句话在她身上走了四个阶段——它从一次怯懦的请求，长成了一次授予的许可。',
  statements,
  endings: [
    ...makeCharacterEndings(
      'xiaoxing',
      [
        {
          rating: 'S',
          id: 'xiaoxing.S',
          name: '薪火·远行',
          summary:
            '她挂上导师标的那天，把当年别人对她说的那个「能」字原样说了出去，有人因为这句话留了下来。而她自己也已经准备好往更远的地方走——火被她带走了，没有留在原地。',
        },
        {
          rating: 'A',
          id: 'xiaoxing.A',
          name: '同行',
          summary:
            '她哪儿也没去。固定队的名单上一直有她的名字，新人进进出出，她都在，谁卡了机制她就陪着再打一遍。有人问她为什么不去更大的队，她说这里够好。',
        },
        {
          rating: 'B',
          id: 'xiaoxing.B',
          name: '远行',
          summary:
            '她转去了别的服务器，走之前没有告别。偶尔有人在本服看见她，名字亮了一下又暗下去——她只是回来看看那间部队房，没有进去。',
        },
        {
          rating: 'C',
          id: 'xiaoxing.C',
          name: '褪色',
          summary:
            '她还在好友列表里，只是名字慢慢变成了灰色。没有人记得她最后一次上线是哪一天，也没有人删掉她——那个位置就一直空着。',
        },
        {
          rating: 'D',
          id: 'xiaoxing.D',
          name: '碎裂',
          summary:
            '一次说不清谁对谁错的争吵之后，她把所有频道都退了，角色停在了那个版本。很久以后有人在别服见过一个很像她的名字，没有上去问。',
        },
      ],
      {
        S: ['L02-01', 'L05-05', 'H05'],
        A: ['L05-01', 'L03-04'],
        B: ['H02', 'L05-04'],
        C: ['L05-02'],
        D: ['L02-04'],
      },
    ),
    // 带外结局：不参与倾向值区间映射（PRD 裁定 #4 / #6）。
    // UI 必须标注「结局名 ≠ 评级名」——「回响」是评级，不是这个名字。
    makeSpecialEnding(
      'xiaoxing',
      'X',
      'xiaoxing.X',
      '回响·闭环',
      '她在一次时空错位里听见了未来的自己回答当年那个问题——回答的人是她，提问的人也是她。闭环没有出口：从那以后，她说的每一句「你能来」，都是当年的她终于等到的那个答复。',
      SPECIAL_CONDITION_IDS.XIAOXING_ECHO,
      ['L02-01', 'H02', 'L05-05'],
    ),
  ],
}
