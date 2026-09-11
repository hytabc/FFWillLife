import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * H01「给未来的自己」—— 第一章隐藏信，回响结局。
 * 空间锚点 linkshell / 阶段 豆芽期 / 出场 小星（见 STORY-BIBLE §5.3）。
 *
 * 机制（对应 PRD 裁定 #9）：本信**不使用跨时空拖动**，而是把「回响」的含义
 * 落在"把一句话放回原位"上——源 PRD 对回响的定义本就是
 * 「特定语句块回到原始时空，却因玩家经历过错位而有了新的解读」。
 * 回到原位不需要跨越时空，只需要你**已经看过它摆在别处是什么样子**。
 *
 * 判定：让 B3 回到原位，同时**别的块确实被挪动过**。
 * 什么都不做（初始排列）反而只能拿到 B —— 这一点是本信的关键设计，
 * 也是它区别于"随便点点就通关"的地方。
 */

const B1 = 'H01.b1-xiaoxing-ask'
const B2 = 'H01.b2-xiaoxing-alone'
const B3 = 'H01.b3-xiaoxing-noclue'
const B4 = 'H01.b4-xiaoxing-please'

const relations: KeyRelation[] = [
  // 这句话回到了它本来的位置
  { id: 'H01.rel.line-returns', kind: 'displacedInto', subject: B3, tier: 'none' },
  // 但别的话必须真的被挪动过——否则你只是什么都没做
  { id: 'H01.rel.something-moved', kind: 'displacedInto', subject: B2, tier: 'reorder' },
]

const ALL = ['H01.rel.line-returns', 'H01.rel.something-moved']

const endings: LetterEnding[] = [
  {
    id: 'H01.E.echo',
    rating: 'echo',
    title: '回响 · 那句话回到了原来的位置',
    body:
      '「你们说的那个词，我查了半天也没查懂。」\n\n' +
      '你把它放回了它本来就在的地方。可是现在你再读这句话，和你第一次读它的时候，已经不是同一句了——\n\n' +
      '因为你已经知道，它还可以被放在别处：可以被放在所有提问的后面，像一句迟到的自嘲；也可以被放在最前面，像一次没有人接住的求救。\n\n' +
      '一句话的意思，从来不是它自己决定的，是它在什么位置上被说出来的。\n\n' +
      '你现在懂了。这就是回响。',
    requires: ALL,
    minSatisfied: 2,
    priority: 10,
    tendency: [
      { characterId: 'xiaoxing', delta: 2, reason: '你替她试过了所有位置，最后把她放回了她自己' },
      { characterId: 'chenxi', delta: 1, reason: '你明白了有些话放回原处才是最好的' },
      { characterId: 'yuejian', delta: 1, reason: '你没有替任何人重新安排他们的人生' },
    ],
  },
  {
    id: 'H01.E.b',
    rating: 'B',
    title: '什么都没有动',
    body:
      '你把这封信原原本本地读完了，一句话都没有挪。\n\n' +
      '有些故事确实不需要被改变。但你也因此永远不会知道，那句「我查了半天也没查懂」如果换个位置，会变成什么样子。\n\n' +
      '也许有一天你会想试试。',
    requires: ALL,
    minSatisfied: 1,
    priority: 20,
    tendency: [
      { characterId: 'xiaoxing', delta: 0, reason: '她的话没有被挪动过' },
      { characterId: 'chenxi', delta: 0, reason: '你没有介入' },
      { characterId: 'yuejian', delta: 0, reason: '你没有介入' },
    ],
  },
  {
    id: 'H01.E.c',
    rating: 'C',
    title: '你把她的话挪走了',
    body:
      '「你们说的那个词，我查了半天也没查懂。」这句话被放在了别的地方。\n\n' +
      '放到别处之后，它听起来像是装可怜，像是在讨要耐心，像是一句不肯自己用功的推脱。\n\n' +
      '但它原本只是一个刚进游戏的人，第一次发现自己听不懂大家在说什么。',
    requires: ALL,
    minSatisfied: 0,
    priority: 30,
    tendency: [
      { characterId: 'xiaoxing', delta: -1, reason: '她的困惑被放在了会被人误解的位置上' },
      { characterId: 'chenxi', delta: 0, reason: '他读到了不一样的意思' },
      { characterId: 'yuejian', delta: 0, reason: '她读到了不一样的意思' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'H01.E.fallback',
  rating: 'C',
  title: '未完成的重排',
  body: '这封信没有被排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const H01: Letter = {
  id: 'H01',
  chapterId: 'ch01',
  title: '给未来的自己',
  anchor: { phase: 'sprout', space: 'linkshell' },
  hidden: true,
  preamble:
    '倾听者：\n\n' +
    '这是一封没有收信人的信。写下它的时候，我刚学会怎么在频道里说话。\n\n' +
    '我把几句话抄在这里，都是我自己说过的。\n\n' +
    '你可以把它们挪来挪去。但如果你最后把某一句放回了它原来的位置——你会发现，它已经不一样了。',
  signature: '——未来的你',
  blocks: [
    { id: B1, statementId: 'xiaoxing.sprout.03', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'xiaoxing.sprout.04', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'xiaoxing.sprout.05', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'xiaoxing.sprout.06', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  // 隐藏信：通关第一章后解锁
  unlock: { kind: 'rating', letterId: 'L01-05', ratings: ['S', 'A', 'B', 'C', 'D', 'X', 'echo'] },
}
