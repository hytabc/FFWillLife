import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L02-01「豆芽的第一封信」
 * 空间锚点 city / 阶段 豆芽期（见 STORY-BIBLE §5.3）。出场：小星 · 铁壁 · 铃兰。
 *
 * 第二章解锁**跨空间拖动**：同一句话，打在频道里和当面说出来，是两回事。
 * 本信的可拖动块里，B2 的原始空间是通讯贝（linkshell），而信件锚点在主城（city）——
 * 玩家一旦把它从原位搬开，它就落在 `microshift` 档上：那句话被当着面说出了口。
 *
 * 判定用分级（band grading）：三条互相独立的位置关系 + 一条跨空间关系，
 * 四者全中才是 S 档——也就是说，最高档**必须**把那句话从频道里搬出来。
 *
 * 排列覆盖（6 种，全部有档可落，零兜底）：
 *   （B1 铁壁 · B2 小星 · B3 铃兰；homeIndex B2=1、B1=0、B3=2）
 *   B1,B2,B3 → 2 条 → B      B1,B3,B2 → 2 条 → B
 *   B2,B1,B3 → 4 条 → S      B2,B3,B1 → 3 条 → A
 *   B3,B2,B1 → 1 条 → C      B3,B1,B2 → 1 条 → C
 *   初始排列是 B1,B2,B3（B 档）——什么都不做拿不到 S，必须动手。
 */

const B1 = 'L02-01.b1-tiebi-once-sprout'
const B2 = 'L02-01.b2-xiaoxing-alone'
const B3 = 'L02-01.b3-linglan-friend'

const relations: KeyRelation[] = [
  // 她先开了口，铁壁那句「我当年也这样」才有落点
  { id: 'L02-01.rel.her-word-before-his', kind: 'precedes', subject: B2, object: B1 },
  // 她那句话在先，铃兰的邀请才不是凭空来的
  { id: 'L02-01.rel.her-word-before-invite', kind: 'precedes', subject: B2, object: B3 },
  // 铁壁先认了自己当年，铃兰的拉人才像是这支部队的规矩，而不是一次好心
  { id: 'L02-01.rel.his-word-before-invite', kind: 'precedes', subject: B1, object: B3 },
  // 那句「有人在吗」不是在频道里打的，是当着面说出来的
  { id: 'L02-01.rel.said-out-loud', kind: 'displacedInto', subject: B2, tier: 'microshift' },
]

const ALL = [
  'L02-01.rel.her-word-before-his',
  'L02-01.rel.her-word-before-invite',
  'L02-01.rel.his-word-before-invite',
  'L02-01.rel.said-out-loud',
]

const endings: LetterEnding[] = [
  {
    id: 'L02-01.E.s',
    rating: 'S',
    title: '她把那句话说了出来',
    body:
      '「有人在吗？我不敢一个人排本。」\n\n' +
      '这句话她最后一次也没有打在频道里。广场上人不多，她站在那几个人面前，把它说出了口。铁壁听完笑了一下，说这句话他当年也说过，只不过他当年是打在频道里的，然后等了一整晚。铃兰随手就点了加好友，把她拉进了频道。\n\n' +
      '那天没有人觉得她麻烦。她后来才明白：同一句话打在频道里，会被埋在别人的聊天记录下面；说出口，才会有人回答。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'xiaoxing', delta: 2, reason: '她第一次把害怕说出了口，而不是打成一行字' },
      { characterId: 'tiebi', delta: 2, reason: '他先认了自己当年也是这样开始的' },
      { characterId: 'linglan', delta: 1, reason: '她没有让新来的人一个人站在广场边上' },
    ],
  },
  {
    id: 'L02-01.E.a',
    rating: 'A',
    title: '先开口的人',
    body:
      '她先开的口，铁壁也接住了——他把自己当年求带的原话翻出来给她看，说他也这么等过。\n\n' +
      '只是这一次，铃兰的邀请来得晚了一些，散场之后才追上来问她要不要进频道。\n\n' +
      '事情最后还是办成了。中间空掉的那一段没有人看见，只有她自己记得。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'xiaoxing', delta: 1, reason: '她把那句话当面说了出来' },
      { characterId: 'tiebi', delta: 1, reason: '他接住了她，也认了自己的当年' },
      { characterId: 'linglan', delta: 0, reason: '她的邀请迟了一步' },
    ],
  },
  {
    id: 'L02-01.E.b',
    rating: 'B',
    title: '接住了，只是顺序乱了',
    body:
      '那三句话都在，只是排在各自的位置上：铁壁先讲了他当年求带的事，铃兰也加了她好友，而那句「有人在吗？我不敢一个人排本」是她回宿舍以后才补发在频道里的。\n\n' +
      '那天晚上广场上其实一直有人。只是没有人知道，她一个人在那里站了多久。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'xiaoxing', delta: 0, reason: '她的话留到了最后才说' },
      { characterId: 'tiebi', delta: 0, reason: '他讲了自己的当年，但没有人接着往下说' },
      { characterId: 'linglan', delta: 0, reason: '她的邀请没有落在最好的位置上' },
    ],
  },
  {
    id: 'L02-01.E.c',
    rating: 'C',
    title: '打在频道里的那句话',
    body:
      '那句话最后是打字发出去的，发在一个没有人说话的频道里。她盯着屏幕看了一会儿，然后把游戏关了。\n\n' +
      '第二天也没有人问起。那行字还在那里——只是没有人回答。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'xiaoxing', delta: -2, reason: '她的话打进了没有人看的频道' },
      { characterId: 'tiebi', delta: -1, reason: '他的回应来得太迟' },
      { characterId: 'linglan', delta: -1, reason: '她在名单上加了人，却没有听见那句话' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L02-01.E.fallback',
  rating: 'C',
  title: '没有寄出的第一封信',
  body: '这封信没有被排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L02_01: Letter = {
  id: 'L02-01',
  chapterId: 'ch02',
  title: '豆芽的第一封信',
  anchor: { phase: 'sprout', space: 'city' },
  preamble:
    '倾听者：\n\n' +
    '这是我写下的第一封信。那天晚上我在主城的广场上站了很久，背包里是别人塞给我的几件旧装备。\n\n' +
    '我不敢说话。我把那天听到的几句话抄在这里，一共三句，只有一句是我自己的。\n\n' +
    '我一直在想：如果我先开口，而不是等人来问我，那天会不会不一样。',
  signature: '——小星',
  blocks: [
    { id: B1, statementId: 'tiebi.sprout.01', draggable: true, homeIndex: 0 },
    { id: B2, statementId: 'xiaoxing.sprout.04', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'linglan.sprout.01', draggable: true, homeIndex: 2 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L01-05'] },
}
