import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-05「我当初也这样」
 * 空间锚点 city / 出场 小星 · 晨曦 · 铁壁（STORY-BIBLE §5.3）。
 *
 * 小星的收束信：她开始用当年别人对她的说法，去接住下一个站在门口的人。
 * 晨曦的那句话是她全部语言的来源——她终于可以把它原样递出去了。
 *
 * **「双向奔赴」的另一半**：铁壁豆芽期那句「有人能带我打日随吗」被拖进
 * 小星的导师期（L05-04 里是小星导师期的话落进铁壁的豆芽期）。
 * 两封信的这两条关系同时成立时，两句话在时间里互相抵达。
 *
 * 她的 X 级带外结局「回响·闭环」由 `special:xiaoxing-echo` 触发（见小星角色档案），
 * 与本信顶档正交。
 */

const B1 = 'L05-05.b1-chenxi-lie-down'
const B2 = 'L05-05.b2-tiebi-daily-roulette'
const B3 = 'L05-05.b3-tiebi-useless'
const B4 = 'L05-05.b4-xiaoxing-towed'
const B5 = 'L05-05.b5-xiaoxing-jueben'

const R1 = 'L05-05.rel.tiebi-sprout-into-xiaoxing-mentor'
const R2 = 'L05-05.rel.tiebi-doubt-carried'
const R3 = 'L05-05.rel.towed-line-placed'
const R4 = 'L05-05.rel.jueben-line-placed'
const R5 = 'L05-05.rel.towed-before-asking'

const relations: KeyRelation[] = [
  // 铁壁豆芽期那句「有人能带我打日随吗」被拖进小星的导师期（transform，Δt = 3）
  { id: R1, kind: 'displacedInto', subject: B2, tier: 'transform' },
  // 「对不起，我又倒下了……我是不是很没用？」被拖进同一封信（high）
  { id: R2, kind: 'displacedInto', subject: B3, tier: 'high' },
  // 「我也是被人拉进本的」被重新摆了一遍
  { id: R3, kind: 'displacedInto', subject: B4, tier: 'microshift' },
  // 「你问绝本是什么的样子」被重新摆了一遍
  { id: R4, kind: 'displacedInto', subject: B5, tier: 'microshift' },
  // 先说出"我也是被人拉进本的"，才有人敢承认自己还在求人
  { id: R5, kind: 'precedes', subject: B4, object: B2 },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-05.E.s',
    rating: 'S',
    title: '薪火·远行',
    body:
      '她先说了自己也是被人拉进本的——那句话从她嘴里说出来的时候，已经不是安慰，是履历。\n\n' +
      '然后她才问：是谁在副本门口等？是谁连一句"我能来吗"都要打好几遍？她把这句问话记了下来，一个字都没有改，因为那就是多年前的她。\n\n' +
      '她没有留下那个人，也没有让对方留下。她只是把当年别人给她的那个「能」字原样递了出去——然后自己收拾东西，往更远的地方走了。\n\n' +
      '火被她带走了。她没有留在原地，可被她点过的人，会接着点下一个人。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'xiaoxing', delta: 2, reason: '她把当年收到的那个「能」字原样递了出去' },
      { characterId: 'tiebi', delta: 1, reason: '他那句在门口求人的话，跨到了多年以后被人认真回答' },
      { characterId: 'chenxi', delta: 1, reason: '她用的正是他当年的说法——他教的东西走出去了' },
    ],
  },
  {
    id: 'L05-05.E.a',
    rating: 'A',
    title: '同行',
    body:
      '她把话说出来了，也把人留下了。那个人后来成了她带过最久的一个新人，两个人一起打了很多个版本。\n\n' +
      '她哪儿也没去。有人问她为什么不去更大的队伍，她说这里够好。她说的"这里"，是当年有人回头等她的那个地方。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'xiaoxing', delta: 1, reason: '她把话说出来了，也把人留下了' },
      { characterId: 'tiebi', delta: 1, reason: '他留在了有人等他的地方' },
      { characterId: 'chenxi', delta: 1, reason: '他看着那句话被传下去，没有插手' },
    ],
  },
  {
    id: 'L05-05.E.b',
    rating: 'B',
    title: '两句话错开了',
    body:
      '她说了自己也是被人拉进本的，对方也说了自己是不是很没用——两句话都出口了，只是中间隔着一整晚。\n\n' +
      '那个新人在副本门口等到了很晚，最后还是自己排了进去。小星第二天才知道这件事。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'xiaoxing', delta: 0, reason: '她那句话说出口了，只是慢了半晚' },
      { characterId: 'tiebi', delta: 0, reason: '他等到了很晚，然后自己排了进去' },
      { characterId: 'chenxi', delta: 0, reason: '他那天没有上线' },
    ],
  },
  {
    id: 'L05-05.E.c',
    rating: 'C',
    title: '又一个人站在门口',
    body:
      '这封信里的句子都摆错了位置。她忙着讲自己当年多难，新人低着头听完，什么也没敢问。\n\n' +
      '那天晚上副本门口站着一个没有队伍的人。她在频道里说了一句"慢慢来"，然后就下线了——她不知道那句话有没有传到对面。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'xiaoxing', delta: -1, reason: '她讲了太多自己，没有听完对方' },
      { characterId: 'tiebi', delta: -1, reason: '他站在门口，没有开口' },
      { characterId: 'chenxi', delta: 0, reason: '这段话他没有读到' },
    ],
  },
  {
    id: 'L05-05.E.d',
    rating: 'D',
    title: '名字变成了灰色',
    body:
      '这封信最终没有人读完。那个在门口求人的名字，过了几天就不再亮起来了。\n\n' +
      '小星后来翻好友列表的时候看见过那个灰色的名字。她没有删——跟自己当年一样，她还留着一个位置，等一个不会再上线的人。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'xiaoxing', delta: -2, reason: '她留着一个位置，等一个不会再上线的人' },
      { characterId: 'tiebi', delta: -2, reason: '他的名字变成了灰色' },
      { characterId: 'chenxi', delta: -1, reason: '他当年那句话，最终没有传到该到的人手里' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-05.E.fallback',
  rating: 'D',
  title: '没有排出来的那一晚',
  body: '那一晚的话最终没有排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_05: Letter = {
  id: 'L05-05',
  chapterId: 'ch05',
  title: '我当初也这样',
  anchor: { phase: 'mentor', space: 'city' },
  preamble:
    '倾听者：\n\n' +
    '今天在城里，有人问我一个问题。他问的时候一直在看地面，像怕问错了会被赶走。\n\n' +
    '我说"我当初也这样"——这句话不是我想出来的，是很多年前有人对我说过的。我照着说了，一个字都没改。\n\n' +
    '说完我忽然很想哭。不是因为感动，是因为我忽然发现，我等这句话等了很久，等到自己已经长成了说这句话的人。\n\n' +
    '这封信我想写给那个站在城里、看着我、还没敢抬头的自己。如果你也曾经问过同样的问题，请收下这句：我当初也这样。',
  signature: '——小星',
  blocks: [
    { id: B1, statementId: 'chenxi.mentor.01b', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'tiebi.sprout.01c', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'tiebi.sprout.02b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'xiaoxing.mentor.01c', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'xiaoxing.mentor.02', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L05-04'] },
}
