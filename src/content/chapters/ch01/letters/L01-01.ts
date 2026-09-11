import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L01-01「初见灭团」—— 垂直切片信件。
 *
 * 结构：4 个语句块 / 3 个可拖动 → 6 种排列，**每种都有手写结局，零兜底**。
 * 这封信是全书的质量标准样板：后 32 封信都应当以"每个排列都有独立结局"为底线。
 *
 * 因果逻辑：那天的话谁先说，决定了这支固定队之后所有的走向。
 *   B2 烈风的自责  ·  B3 月见的安抚  ·  B4 烈风的指责
 *
 * 六种排列与结局的映射（关系 id 见下）：
 *   B2 B3 B4 → S  自责开了头，安抚接住，指责最后出口时已经没了杀伤力
 *   B3 B4 B2 → A  安抚在前，指责紧随其后，自责回到了自己身上
 *   B4 B2 B3 → B  指责先出口，但自责与安抚把它拉了回来
 *   B3 B2 B4 → B  安抚被自责岔开，指责失去了落地的地方
 *   B2 B4 B3 → C  自责之后是火上浇油，安抚来得太晚
 *   B4 B3 B2 → D  指责开场，安抚被当成和稀泥，自责变成自我否定
 */

const BLOCK_CHENXI = 'L01-01.b1-chenxi'
const BLOCK_LIEFENG_CONFESS = 'L01-01.b2-liefeng-confess'
const BLOCK_YUEJIAN = 'L01-01.b3-yuejian'
const BLOCK_LIEFENG_BLAME = 'L01-01.b4-liefeng-blame'

const relations: KeyRelation[] = [
  {
    id: 'L01-01.rel.soothe-before-blame',
    kind: 'precedes',
    subject: BLOCK_YUEJIAN,
    object: BLOCK_LIEFENG_BLAME,
  },
  {
    id: 'L01-01.rel.blame-before-soothe',
    kind: 'precedes',
    subject: BLOCK_LIEFENG_BLAME,
    object: BLOCK_YUEJIAN,
  },
  {
    id: 'L01-01.rel.confess-before-soothe',
    kind: 'precedes',
    subject: BLOCK_LIEFENG_CONFESS,
    object: BLOCK_YUEJIAN,
  },
  {
    id: 'L01-01.rel.confess-then-soothe',
    kind: 'adjacent',
    subject: BLOCK_LIEFENG_CONFESS,
    object: BLOCK_YUEJIAN,
  },
  {
    id: 'L01-01.rel.soothe-then-blame',
    kind: 'adjacent',
    subject: BLOCK_YUEJIAN,
    object: BLOCK_LIEFENG_BLAME,
  },
]

const endings: LetterEnding[] = [
  {
    id: 'L01-01.E.s',
    rating: 'S',
    title: '那天没有人被打散',
    body: '烈风先认了自己的账，月见接住了这句话，等那些锋利的字眼再出口时，已经伤不到任何人了。那天夜里没有人退队。很久以后他们才明白，第一个开口认账的人，替所有人挡下了后面所有的话。',
    requires: [
      'L01-01.rel.soothe-before-blame',
      'L01-01.rel.confess-before-soothe',
      'L01-01.rel.confess-then-soothe',
      'L01-01.rel.soothe-then-blame',
    ],
    priority: 10,
    tendency: [
      { characterId: 'chenxi', delta: 2, reason: '在不需要他开口的时候，他先说了「算我的」' },
      { characterId: 'yuejian', delta: 2, reason: '她的安抚在指责之前，接住了所有人' },
      { characterId: 'liefeng', delta: 1, reason: '他第一次先认自己的账，而不是先看别人的' },
    ],
  },
  {
    id: 'L01-01.E.a',
    rating: 'A',
    title: '有人先低头，也有人接住了',
    body: '月见把话头接了过去，烈风的火气没有地方可以烧，最后只烧到了自己身上。那天散场时还有些尴尬，但第二天，所有人都照常上线了。',
    requires: ['L01-01.rel.soothe-before-blame', 'L01-01.rel.soothe-then-blame'],
    priority: 20,
    tendency: [
      { characterId: 'chenxi', delta: 1, reason: '他什么也没说，但也没有走' },
      { characterId: 'yuejian', delta: 1, reason: '她又一次把场面兜住了' },
      { characterId: 'liefeng', delta: 0, reason: '他把话咽了回去，但只是咽了回去' },
    ],
  },
  {
    id: 'L01-01.E.b-blame-first',
    rating: 'B',
    title: '吵完了，但还在一起',
    body: '烈风的话很难听，可他自己先低了头。月见在中间把两边都拉了一把。那天晚上他们吵得很凶，但是到最后，没有一个人点退出。',
    requires: [
      'L01-01.rel.blame-before-soothe',
      'L01-01.rel.confess-before-soothe',
      'L01-01.rel.confess-then-soothe',
    ],
    priority: 30,
    tendency: [
      { characterId: 'liefeng', delta: 1, reason: '他说了难听的话，但也认了自己的错' },
      { characterId: 'chenxi', delta: 1, reason: '他没有让这场争吵失控' },
      { characterId: 'yuejian', delta: 0, reason: '她尽力了，但这次没能完全兜住' },
    ],
  },
  {
    id: 'L01-01.E.b-soothe-first',
    rating: 'B',
    title: '沉默被盖住了',
    body: '月见先开了口，烈风的自责把话题岔到了别处，那句指责最终没有落在任何具体的人身上。事情算是过去了——只是没有人真的说清楚过。',
    requires: ['L01-01.rel.soothe-before-blame'],
    priority: 40,
    tendency: [
      { characterId: 'chenxi', delta: 1, reason: '他维持住了队伍的体面' },
      { characterId: 'yuejian', delta: -1, reason: '她的话被岔开了，没有人回应她' },
      { characterId: 'liefeng', delta: 0, reason: '他绕开了自己的问题' },
    ],
  },
  {
    id: 'L01-01.E.c',
    rating: 'C',
    title: '话赶话',
    body: '烈风认了错，紧接着又把火撒到了别人身上；月见想打圆场的时候，两边都已经不想听了。那天散场得很安静，安静得不太对劲。',
    requires: ['L01-01.rel.blame-before-soothe', 'L01-01.rel.confess-before-soothe'],
    priority: 50,
    tendency: [
      { characterId: 'liefeng', delta: -1, reason: '他的自责只持续了一句话的时间' },
      { characterId: 'yuejian', delta: -1, reason: '她想调和的时候，已经太晚了' },
      { characterId: 'chenxi', delta: 0, reason: '他在犹豫要不要开口，然后错过了' },
    ],
  },
  {
    id: 'L01-01.E.d',
    rating: 'D',
    title: '有人先开了口，没人接',
    body: '最伤人的那句话最先出口。等月见想说点什么的时候，安慰听起来已经像是在替对方开脱。烈风再没说过一句话。第二周，固定队的名单少了一个人。',
    requires: ['L01-01.rel.blame-before-soothe'],
    priority: 60,
    tendency: [
      { characterId: 'liefeng', delta: -2, reason: '他先开了口，然后把自己也一起推远了' },
      { characterId: 'yuejian', delta: -1, reason: '她的安抚来晚了，反而像偏袒' },
      { characterId: 'chenxi', delta: -1, reason: '他没有在第一时间拦下那句话' },
    ],
  },
]

/** 类型层安全网，**永远不该被触发** —— 六个排列全部有手写结局。校验器 4 会盯着这一点。 */
const fallbackEnding: LetterEnding = {
  id: 'L01-01.E.fallback',
  rating: 'C',
  title: '无解的那一夜',
  body: '那天的话没有排出一个结果。后来他们谁也没有再提起过那一晚。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L01_01: Letter = {
  id: 'L01-01',
  chapterId: 'ch01',
  title: '初见灭团',
  anchor: { phase: 'growth', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '我们固定队成立之后的第一个高难周，第一次灭在了最后百分之三。\n\n' +
    '那天语音频道里很安静。后来大家说的话，我记不太清顺序了——只记得说出口的先后，好像把之后所有的事都定了下来。\n\n' +
    '我想知道，如果那天那些话换个顺序说，我们会不会不一样。',
  signature: '——月见',
  blocks: [
    { id: BLOCK_CHENXI, statementId: 'chenxi.growth.03', draggable: false, homeIndex: 0 },
    { id: BLOCK_LIEFENG_CONFESS, statementId: 'liefeng.growth.02b', draggable: true, homeIndex: 1 },
    { id: BLOCK_YUEJIAN, statementId: 'yuejian.growth.01b', draggable: true, homeIndex: 2 },
    { id: BLOCK_LIEFENG_BLAME, statementId: 'liefeng.growth.03b', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'always' },
}
