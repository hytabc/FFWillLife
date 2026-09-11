import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L02-02「日随偶遇」
 * 空间锚点 dungeon / 阶段 豆芽期（见 STORY-BIBLE §5.3）。出场：小星 · 铁壁 · 铃兰。
 *
 * 主题：她一个人排了日常，排到一个陌生人。同一句话——「我可以跟着吗？」——
 * 打在频道里是一次无人应答的试探，当着面问出口才是真的把脚迈进去。
 * B2 的原始空间是通讯贝，信件锚点在副本，搬动它即落 `microshift` 档。
 *
 * 排列覆盖（6 种，零兜底）：
 *   B1,B2,B3 → 2 条 → B      B1,B3,B2 → 2 条 → B
 *   B2,B1,B3 → 4 条 → S      B2,B3,B1 → 3 条 → A
 *   B3,B2,B1 → 1 条 → C      B3,B1,B2 → 1 条 → C
 */

const B1 = 'L02-02.b1-tiebi-falldown'
const B2 = 'L02-02.b2-xiaoxing-join'
const B3 = 'L02-02.b3-linglan-anyone-left'

const relations: KeyRelation[] = [
  // 她先把那句问出了口，认账的那句话才接得上
  { id: 'L02-02.rel.ask-before-apology', kind: 'precedes', subject: B2, object: B1 },
  // 她那句问在前，铃兰的「还有谁没进来」才是在回答她，而不是在点人
  { id: 'L02-02.rel.ask-before-counting', kind: 'precedes', subject: B2, object: B3 },
  // 先有人认了自己的账，铃兰清点人数才不像是在挑人
  { id: 'L02-02.rel.apology-before-counting', kind: 'precedes', subject: B1, object: B3 },
  // 那句话不是在频道里打的，是在副本里当着面问的
  { id: 'L02-02.rel.asked-face-to-face', kind: 'displacedInto', subject: B2, tier: 'microshift' },
]

const ALL = [
  'L02-02.rel.ask-before-apology',
  'L02-02.rel.ask-before-counting',
  'L02-02.rel.apology-before-counting',
  'L02-02.rel.asked-face-to-face',
]

const endings: LetterEnding[] = [
  {
    id: 'L02-02.E.s',
    rating: 'S',
    title: '她当面问出了那句话',
    body:
      '进本之前，她在队伍前面把那句「那个……我可以跟着吗」问出了口。没有人笑她。\n\n' +
      '打着打着，那个不认识的坦克倒下了，爬起来的第一句话是道歉——道歉得比她还熟练。她忽然就不那么怕了。出本之前，铃兰在队伍里数了一遍人，问还有谁没进来。\n\n' +
      '那天她没有被落下。唯一不同的是：这一次她不是在频道里等着被谁看见，是她自己走上前去问的。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'xiaoxing', delta: 2, reason: '她当面问出了那句话，而不是先打在频道里' },
      { characterId: 'tiebi', delta: 1, reason: '他倒下之后先认了自己的账，让她不再怕' },
      { characterId: 'linglan', delta: 2, reason: '她数了一遍人，没有让新来的被落下' },
    ],
  },
  {
    id: 'L02-02.E.a',
    rating: 'A',
    title: '问出口了，只是慢了一拍',
    body:
      '她最后还是在队伍里问出了口，坦克也照旧倒下、照旧道歉——只是铃兰那句「还有谁没进来」来得晚了些，是在出本之后才问的。\n\n' +
      '她答了「我」。那一声答得有点小声，但确实是自己答的。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'xiaoxing', delta: 1, reason: '她到底还是自己开的口' },
      { characterId: 'tiebi', delta: 1, reason: '他的道歉让她觉得犯错是可以的' },
      { characterId: 'linglan', delta: 0, reason: '她的清点迟了一点' },
    ],
  },
  {
    id: 'L02-02.E.b',
    rating: 'B',
    title: '三句话都在，只是各说各的',
    body:
      '坦克倒下了，爬起来道了歉；铃兰在队伍里数了一遍人；她那句「我可以跟着吗」是在频道里打出来的，等有人看见的时候，副本已经打完了。\n\n' +
      '三句话都发生过。只是它们没有挨在一起，所以谁也没有接住谁。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'xiaoxing', delta: 0, reason: '她的那句话没有赶上时间' },
      { characterId: 'tiebi', delta: 0, reason: '他照旧先认了自己的账' },
      { characterId: 'linglan', delta: 0, reason: '她数了人，但没有听见回答' },
    ],
  },
  {
    id: 'L02-02.E.c',
    rating: 'C',
    title: '一个人打完的那把日常',
    body:
      '铃兰先数了一遍人，坦克接着倒下了——那句「我可以跟着吗」始终打在频道里，没有人回。\n\n' +
      '那天她还是跟着打完了。出本的时候队伍解散得很快，快到她连一句谢谢都没来得及打出来。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'xiaoxing', delta: -2, reason: '她始终没有把那句话问出口' },
      { characterId: 'tiebi', delta: -1, reason: '他的道歉来得比她的勇气更早' },
      { characterId: 'linglan', delta: -1, reason: '她先点了人头，最后才想起问' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L02-02.E.fallback',
  rating: 'C',
  title: '没有排进去的那一晚',
  body: '这把日常最后没有排成。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L02_02: Letter = {
  id: 'L02-02',
  chapterId: 'ch02',
  title: '日随偶遇',
  anchor: { phase: 'sprout', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '那天我一个人在门口排了日常，排到一个不认识的人。他倒下之后一直在道歉，道歉得比我还熟练。\n\n' +
    '我把那天的几句话记在这里。它们不是在同一时间说的，可我总觉得，它们应该挨在一起看。\n\n' +
    '很久以后我才知道，那个一直在说对不起的人是谁。',
  signature: '——小星',
  blocks: [
    { id: B1, statementId: 'tiebi.sprout.02', draggable: true, homeIndex: 0 },
    { id: B2, statementId: 'xiaoxing.sprout.03', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'linglan.sprout.03', draggable: true, homeIndex: 2 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L02-01'] },
}
