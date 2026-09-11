import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L02-03「部队招募板」
 * 空间锚点 city / 阶段 成长期（见 STORY-BIBLE §5.3）。出场：小星 · 铁壁 · 晨曦。
 *
 * 主题：招募板前面，谁先把自己的名字押上去。铁壁的原则是「来的人一个都不赶」，
 * 晨曦的承诺是「我是最不会走的那个」——这两句话落地的先后，决定它们听起来是
 * 承诺还是客套。而晨曦那句写在频道里的通知，只有当着面说出来，才会从
 * 「一条公告」变成「我们明天还在」。
 *
 * 固定块 B1 是小星在豆芽期问出口的那句话（更早的阶段＝回忆，钉在首位不会产生错位）。
 * 可拖块的原始空间与锚点：B3／B4 在主城（搬动＝reorder），B2 在通讯贝（搬动＝microshift）。
 *
 * 排列覆盖（6 种，零兜底）：
 *   B3,B2,B4 → 2 条 → B      B3,B4,B2 → 2 条 → B
 *   B2,B3,B4 → 4 条 → S      B2,B4,B3 → 3 条 → A
 *   B4,B3,B2 → 1 条 → C      B4,B2,B3 → 1 条 → C
 */

const B1 = 'L02-03.b1-xiaoxing-question'
const B2 = 'L02-03.b2-chenxi-recruit-post'
const B3 = 'L02-03.b3-tiebi-never-kick'
const B4 = 'L02-03.b4-chenxi-never-leave'

const relations: KeyRelation[] = [
  // 先把话说在明面上（一份谁都看得见的招募），铁壁那句「一个都不赶」才有对象
  { id: 'L02-03.rel.recruit-before-never-kick', kind: 'precedes', subject: B2, object: B3 },
  // 先有一份写给陌生人的招募，晨曦那句「我最不会走」才不是自我感动，而是回应
  { id: 'L02-03.rel.recruit-before-never-leave', kind: 'precedes', subject: B2, object: B4 },
  // 铁壁先说不赶人，晨曦才敢说自己是最不会走的那个
  { id: 'L02-03.rel.never-kick-before-never-leave', kind: 'precedes', subject: B3, object: B4 },
  // 那行字本来只写在频道里，搬到招募板前面说，它就不再是一条通知
  { id: 'L02-03.rel.post-said-out-loud', kind: 'displacedInto', subject: B2, tier: 'microshift' },
]

const ALL = [
  'L02-03.rel.recruit-before-never-kick',
  'L02-03.rel.recruit-before-never-leave',
  'L02-03.rel.never-kick-before-never-leave',
  'L02-03.rel.post-said-out-loud',
]

const endings: LetterEnding[] = [
  {
    id: 'L02-03.E.s',
    rating: 'S',
    title: '那句话是在招募板前面说的',
    body:
      '晨曦把他写在频道里的那行字搬到了招募板前面，当着等在那里的几个人说了出来：「招募我写好了，明天继续。灭一次不算什么。」\n\n' +
      '同样一行字，写在频道里只是一条通知，谁都可以当作没看见；当着面说出来，它就变成了一句「我们明天还在」。接着铁壁说，他发招募，来的人一个都不赶。最后晨曦说，他不是最厉害的那个，但他是最不会走的那个。\n\n' +
      '小星站在旁边听着。她手里那张写满了陌生名字的纸，被她攥得紧了一点。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'chenxi', delta: 2, reason: '他把写在频道里的通知，搬到了招募板前面说出口' },
      { characterId: 'tiebi', delta: 2, reason: '他把「一个都不赶」说在了别人押注之前' },
      { characterId: 'xiaoxing', delta: 1, reason: '她的问题第一次被人当成正经问题回答' },
    ],
  },
  {
    id: 'L02-03.E.a',
    rating: 'A',
    title: '先有一份招募，才有承诺',
    body:
      '晨曦的那行字到底还是当着面说了出来，铁壁也说了他不赶人。只是晨曦那句「我是最不会走的那个」说得早了一些——它落在铁壁的原则前面，听起来像他自己给自己壮胆。\n\n' +
      '招募板上多了一个名字。那天晚上没有人退队。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'chenxi', delta: 1, reason: '他说了那句话，只是说早了' },
      { characterId: 'tiebi', delta: 1, reason: '他说了他不赶人' },
      { characterId: 'xiaoxing', delta: 1, reason: '她站在旁边，把话都听完了' },
    ],
  },
  {
    id: 'L02-03.E.b',
    rating: 'B',
    title: '都说了，只是各说各的',
    body:
      '铁壁在招募板上写了「来的人我一个都不赶」，晨曦在频道里写了「招募我写好了，明天继续」，而那个新人的问题，最后是写在一张纸上递过去的。\n\n' +
      '三句话都写在纸上、发在频道里，唯独没有一句是当面说的。招募板前面那盏灯亮了一整晚，没有派上什么用场。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'tiebi', delta: 0, reason: '他把原则写在了板上，没有说出口' },
      { characterId: 'chenxi', delta: 0, reason: '他的通知留在了频道里' },
      { characterId: 'xiaoxing', delta: 0, reason: '她还是没有把问题问出声' },
    ],
  },
  {
    id: 'L02-03.E.c',
    rating: 'C',
    title: '招募板前面没有说出口的话',
    body:
      '晨曦那句「我不是最厉害的那个，但我是最不会走的那个」先出了口。它落在铁壁的原则前面，听起来像是在替自己求一个位置。铁壁当时没有接话，后来也没有再提那天的事。\n\n' +
      '招募板上的名字换了又换。那个新人的问题，一直没有人回答。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'chenxi', delta: -2, reason: '他把一句承诺说成了求职' },
      { characterId: 'tiebi', delta: -1, reason: '他没有接住那句话' },
      { characterId: 'xiaoxing', delta: -1, reason: '她的问题一直挂在那里，没有人回答' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L02-03.E.fallback',
  rating: 'C',
  title: '空着的招募板',
  body: '那块招募板最后什么也没有贴上去。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L02_03: Letter = {
  id: 'L02-03',
  chapterId: 'ch02',
  title: '部队招募板',
  anchor: { phase: 'growth', space: 'city' },
  preamble:
    '倾听者：\n\n' +
    '招募板前面那盏灯，一到晚上就特别亮。那天我把新写的一行字贴上去，旁边站着两个人：一个是铃兰从别的圈子里领过来、已经跟我们打过两次本的老手，一个是刚进部队没几天、连副本名字都还认不全的新人。\n\n' +
    '新人问了一句话。我到现在还记得，她问得有多小声。\n\n' +
    '我把那几天说过的几句抄在这里。我想知道，换一个顺序说，那个问题会不会不那么难问出口。',
  signature: '——铁壁',
  blocks: [
    { id: B1, statementId: 'xiaoxing.sprout.02', draggable: false, homeIndex: 0 },
    { id: B3, statementId: 'tiebi.growth.02', draggable: true, homeIndex: 1 },
    { id: B2, statementId: 'chenxi.growth.04', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'chenxi.growth.05', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L02-02'] },
}
