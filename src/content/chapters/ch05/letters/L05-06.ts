import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-06「副本没变」
 * 空间锚点 dungeon / 出场 远山 · 烈风 · 铁壁（STORY-BIBLE §5.3）。
 *
 * 与 L05-01「队长的最后一封信」**互为镜像**（R9 / R20）：
 *   L05-01 —— 晨曦交棒的那一刻，正是远山确认自己被越过的时刻；那封信里他是被留下的人。
 *   L05-06 —— 同一句「回来就好，副本没变」由他自己说出口；这封信里他看着别人重新站起来。
 *
 * 与 L05-03 说同一种价值观（R20）：**尺子要收回自己身上**。
 *   烈风在那边说「我以前太较真了」，在这边说「我现在只和自己比」；
 *   远山说「挂上导师标不代表什么都懂，我也还在学」。
 */

const B1 = 'L05-06.b1-yuanshan-come-back'
const B2 = 'L05-06.b2-yuanshan-still-learning'
const B3 = 'L05-06.b3-liefeng-compare-self'
const B4 = 'L05-06.b4-tiebi-welcome-home'
const B5 = 'L05-06.b5-liefeng-again'

const R1 = 'L05-06.rel.compare-self-carried'
const R2 = 'L05-06.rel.one-more-run-carried'
const R3 = 'L05-06.rel.compare-self-before-learning'
const R4 = 'L05-06.rel.still-learning-carried'
const R5 = 'L05-06.rel.welcome-home-last'

const relations: KeyRelation[] = [
  // 烈风成熟期那句「我现在只和自己比」被拖进导师期的复健之夜（high）
  { id: R1, kind: 'displacedInto', subject: B3, tier: 'high' },
  // 「狂暴就狂暴了，再开一把」被拖进同一个晚上（transform）
  { id: R2, kind: 'displacedInto', subject: B5, tier: 'transform' },
  // 先听见有人把尺子收回自己身上，远山才承认自己也还在学
  { id: R3, kind: 'precedes', subject: B3, object: B2 },
  // 「我也还在学」被挪出了原位
  { id: R4, kind: 'displacedInto', subject: B2, tier: 'microshift' },
  // 整封信最后落在「回来吧，门没锁」
  { id: R5, kind: 'last', subject: B4 },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-06.E.s',
    rating: 'S',
    title: '副本没变',
    body:
      '烈风先说了那句话：我现在只和自己比。说完他自己也笑了——这句话五年前的他听不进去，现在说出来，倒像是替所有人松了绑。\n\n' +
      '远山跟着承认：挂上导师标不代表什么都懂，我也还在学。他说这话的时候正在带一个比他当年更慌的新人，说到一半停住了，因为他想起来的不是机制，是很多年前自己站在同一个位置上的样子。\n\n' +
      '那天结束的时候，铁壁只说了一句「回来吧，门没锁」。远山在部队房里站了很久，把每一个房间都走了一遍——房子重新装修过，离线的名字还留在名单上。\n\n' +
      '他终于也变成了那个说「回来就好」的人。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yuanshan', delta: 2, reason: '他终于变成那个说「回来就好」的人' },
      { characterId: 'liefeng', delta: 1, reason: '他把尺子收回自己身上，替所有人松了绑' },
      { characterId: 'tiebi', delta: 1, reason: '他只说了「回来吧，门没锁」，位置一直空着' },
    ],
  },
  {
    id: 'L05-06.E.a',
    rating: 'A',
    title: '回来就好',
    body:
      '铁壁的那句「回来吧，门没锁」落在了最后，像是给整晚盖了个章。远山没说什么大道理，只是把队伍重新组起来，带着那个新人打了一遍。\n\n' +
      '他带得不算好。中间灭了两次，第三次过的时候，频道里没有人说话，只有人开始鼓掌——那是他第一次觉得，被需要和被记住是两件事，而后者更难，也更值得。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 1, reason: '他重新组了队，带新人打了一遍' },
      { characterId: 'tiebi', delta: 1, reason: '他把「回来吧，门没锁」说在了最后' },
      { characterId: 'liefeng', delta: 0, reason: '他那天只是路过，没有多说' },
    ],
  },
  {
    id: 'L05-06.E.b',
    rating: 'B',
    title: '复健的第一晚',
    body:
      '四个人进了本，三个人的心思都不在机制上。远山手法生疏得厉害，烈风很想说点什么，最后忍住了。\n\n' +
      '他们打到很晚，没有过本。但下线之前，有人问了一句「明天还来吗」，三个人都打了「来」。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他手法生疏，但答应了明天还来' },
      { characterId: 'liefeng', delta: 0, reason: '他忍住了那句点评' },
      { characterId: 'tiebi', delta: 0, reason: '他把房间的灯留着' },
    ],
  },
  {
    id: 'L05-06.E.c',
    rating: 'C',
    title: '灭在同一个地方',
    body:
      '远山灭了两次，第三次有人忍不住开口说了一句「这机制我熟，我来标点」。他愣了一下，把位置让了出去。\n\n' +
      '那晚过本了，没有人不开心。只是散场之后，他一个人回到湖边坐了很久——他想起自己当年也是这么把话抢过去的。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'yuanshan', delta: -1, reason: '他把位置让了出去，然后一个人在湖边坐了很久' },
      { characterId: 'liefeng', delta: -1, reason: '他那句点评还是出了口，只是换了个人说' },
      { characterId: 'tiebi', delta: 0, reason: '房子的灯还亮着，人已经不在了' },
    ],
  },
  {
    id: 'L05-06.E.d',
    rating: 'D',
    title: '好友列表还是灰的',
    body:
      '这封信最终没人回。远山在副本门口站到很晚，最后还是点开任务搜索器，一个人排了进去。\n\n' +
      '他打完了，什么也没发生。出来的时候他看了一眼好友列表——还是灰的。他忽然明白，回来和有人等你回来，是两件事。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'yuanshan', delta: -2, reason: '他一个人排完了本，出来时好友列表还是灰的' },
      { characterId: 'liefeng', delta: -1, reason: '他没有回头看一眼那个站在门口的人' },
      { characterId: 'tiebi', delta: -1, reason: '名单上留了位置，却没有人回来' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-06.E.fallback',
  rating: 'D',
  title: '没有排出来的那一晚',
  body: '那一晚的话最终没有排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_06: Letter = {
  id: 'L05-06',
  chapterId: 'ch05',
  title: '副本没变',
  anchor: { phase: 'mentor', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '今天有人对我说"回来就好，副本没变"。我听完站在那里，很久没有动。\n\n' +
    '我离开的那几年，房子被回收了，好友列表一个接一个地暗下去。我曾经是那个让所有人记住名字的人，后来我连自己是谁都不太确定了。\n\n' +
    '现在有人告诉我，副本没变。机制还是那些机制，门口还是那些队伍。\n\n' +
    '我一直在想：当年如果我先开口说一句"我回来"，是不是就不用等到现在。这封信我想写给那个站在门口、还不敢点进队的人。',
  signature: '——远山',
  blocks: [
    { id: B1, statementId: 'yuanshan.mentor.01', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yuanshan.mentor.03', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'liefeng.mature.03', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'tiebi.mentor.01b', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'liefeng.mature.01', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L05-05'] },
}
