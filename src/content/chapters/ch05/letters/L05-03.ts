import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-03「80+之上」
 * 空间锚点 dungeon / 出场 烈风 · 小星 · 月见（STORY-BIBLE §5.3）。
 *
 * 烈风的收束信：一个把尺子架在所有人脖子上的人，终于把尺子转过来对着自己。
 * 小星是他当年的模样（抢着说"我来"），月见是他从来没算进循环里的那个人（血条后面的人）。
 *
 * 与 L05-06「副本没变」共享同一种价值观（R20）：**尺子要收回自己身上**
 *   —— 这里是他把尺子放下，那边是他承认自己也要重新学。
 */

const B1 = 'L05-03.b1-liefeng-too-serious'
const B2 = 'L05-03.b2-liefeng-have-fun'
const B3 = 'L05-03.b3-liefeng-logs'
const B4 = 'L05-03.b4-xiaoxing-mark-a'
const B5 = 'L05-03.b5-yuejian-cant-heal'

const R1 = 'L05-03.rel.xiaoxing-eager-carry'
const R2 = 'L05-03.rel.yuejian-tired-carry'
const R3 = 'L05-03.rel.eager-before-lenient'
const R4 = 'L05-03.rel.tired-before-lenient'
const R5 = 'L05-03.rel.own-record-resaid'

const relations: KeyRelation[] = [
  // 小星抢着说「这个机制我熟，我来标点吧」——成长期的那声「我来」被拖进了导师期
  { id: R1, kind: 'displacedInto', subject: B4, tier: 'transform' },
  // 月见那句「我也有奶不动的时候」被拖到同一个晚上
  { id: R2, kind: 'displacedInto', subject: B5, tier: 'transform' },
  // 先看见那个抢着扛的人，烈风才说得出「别把输赢看得太重」
  { id: R3, kind: 'precedes', subject: B4, object: B2 },
  // 先听见那个撑不住的人，烈风才不再较真
  { id: R4, kind: 'precedes', subject: B5, object: B2 },
  // 他把「你这个logs比我当年好看多了」重新摆了一遍——这次是对着自己说的
  { id: R5, kind: 'displacedInto', subject: B3, tier: 'reorder' },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-03.E.s',
    rating: 'S',
    title: '尺子收回来了',
    body:
      '小星抢着说「我来标点吧」的时候，烈风看了她很久——他认得那个眼神，那是几年前的自己，急着证明自己配得上这支队伍。\n\n' +
      '随后是月见。她说她也有奶不动的时候，说完就低下头，像是道歉。烈风忽然想起自己从来没有在循环里算过她。\n\n' +
      '于是那句「别把输赢看得太重」出口的时候，不是在安慰谁，是他真的这么想了。他把那句话重新说了一遍，说给自己听：我以前太较真了。\n\n' +
      '那天之后他不再看别人的记录，只看自己的。他的输出降了一点，队却再也没散过。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'liefeng', delta: 2, reason: '他把尺子从别人身上收回了自己这里' },
      { characterId: 'xiaoxing', delta: 1, reason: '她抢着扛的样子让他认出了当年的自己' },
      { characterId: 'yuejian', delta: 1, reason: '她说了自己奶不动，这次有人听见了' },
    ],
  },
  {
    id: 'L05-03.E.a',
    rating: 'A',
    title: '别把输赢看得太重',
    body:
      '他先说了「别把输赢看得太重」，然后才看见小星抢着要标点、才听见月见说自己也会奶不动。话说反了，但意思还是到了。\n\n' +
      '小星把那句话记进了本子，月见笑了一下，没说话。烈风后来又补了一句「你们别多想」，越描越黑，队里第一次有人当着他的面笑出声。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'liefeng', delta: 1, reason: '他把话说反了，但第一次先说了软的那句' },
      { characterId: 'xiaoxing', delta: 1, reason: '她把"别把输赢看得太重"记进了本子' },
      { characterId: 'yuejian', delta: 1, reason: '她笑了一下——很久没在语音里笑过' },
    ],
  },
  {
    id: 'L05-03.E.b',
    rating: 'B',
    title: '那句话来晚了一格',
    body:
      '他确实软了下来，只是软在了别的地方。小星还在抢着扛，月见还在说自己没事，他的那句「我以前太较真了」掉在两个人中间，没有人接。\n\n' +
      '那晚过得还算顺利。顺利的意思是——没有人吵架，也没有人说真话。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'liefeng', delta: 0, reason: '他认了错，但那句话没有落在人身上' },
      { characterId: 'xiaoxing', delta: 0, reason: '她还在抢着证明自己' },
      { characterId: 'yuejian', delta: 0, reason: '她第三次说了"没事"' },
    ],
  },
  {
    id: 'L05-03.E.c',
    rating: 'C',
    title: '80+之上',
    body:
      '这一晚的语音里只有数字。谁差了多少，谁的循环断了，谁的记录还能再高三点。\n\n' +
      '小星把「我来标点吧」打出来又删掉了。月见没说自己蓝量不够。烈风在木桩前站到很晚，把同一个循环练了三十遍——他赢了那场比较，赢了之后，频道里只剩他一个人。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'liefeng', delta: -1, reason: '他赢了那场比较，然后频道里只剩他一个人' },
      { characterId: 'xiaoxing', delta: -1, reason: '她把"我来"两个字删掉了' },
      { characterId: 'yuejian', delta: -1, reason: '她没说自己的蓝不够' },
    ],
  },
  {
    id: 'L05-03.E.d',
    rating: 'D',
    title: '频道里只剩下数字',
    body:
      '这封信他没有寄出去。那天晚上队里的人走了一个，走之前说了一句「你从来没看过我们」。\n\n' +
      '烈风在空频道里坐了很久，翻自己的记录，一条一条往前翻——他打得最好的那几把，队里已经没有人记得了。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'liefeng', delta: -2, reason: '有人说"你从来没看过我们"，他没有反驳' },
      { characterId: 'xiaoxing', delta: -1, reason: '她那天没有说"我来"' },
      { characterId: 'yuejian', delta: -1, reason: '她那天没有上线' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-03.E.fallback',
  rating: 'D',
  title: '没有排出来的那一晚',
  body: '那一晚的话最终没有排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_03: Letter = {
  id: 'L05-03',
  chapterId: 'ch05',
  title: '80+之上',
  anchor: { phase: 'mentor', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '我带过的人里，有一个后来打到了比我更高的地方。她跟我说谢谢的时候，我忽然很想跟她说对不起。\n\n' +
    '很多年前我以为，把人带出来的办法是把尺子架在所有人脖子上。谁差一点我就说谁，说完我就走，去把自己的数字再往上抬一格。那时候我觉得这叫认真。\n\n' +
    '后来我数了数，那些被我量过的人，一个都没有留下来。\n\n' +
    '这封信我写给还在用数字看人的自己。顺序如果换一换——先看见人，再看见数字——我大概会早几年学会一件事：尺子最该量的地方，是自己这里。',
  signature: '——烈风',
  blocks: [
    { id: B1, statementId: 'liefeng.mentor.03', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'liefeng.mentor.02b', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'liefeng.mentor.01b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'xiaoxing.growth.01b', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'yuejian.mature.01c', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L05-02'] },
}
