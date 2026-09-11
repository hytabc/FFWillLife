import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L01-04「语音频道里的沉默」
 * 空间锚点 linkshell / 阶段 成长期（见 STORY-BIBLE §5.3）。出场：月见 · 晨曦 · 烈风。
 *
 * 第一章最安静的一封信：灭团之后，频道里没有人说话。
 * 月见先开口，还是先去做事——看起来差别很小，其实决定了这一晚是不是白过的。
 *
 *   B2 烈风回头看自己  ·  B3 月见提议收工  ·  B4 月见默默去做事
 */

const B2 = 'L01-04.b2-liefeng-selfcheck'
const B3 = 'L01-04.b3-yuejian-callit'
const B4 = 'L01-04.b4-yuejian-errand'

/** 三条正向关系：都是"月见先动，别人才跟上"。 */
const relations: KeyRelation[] = [
  // 她先开口，烈风才有机会回头去看自己
  { id: 'L01-04.rel.callit-before-selfcheck', kind: 'precedes', subject: B3, object: B2 },
  // 她先提议收工，再去做事——顺序对了，收工就不是逃避
  { id: 'L01-04.rel.callit-before-errand', kind: 'precedes', subject: B3, object: B4 },
  // 她默默去做事，做在烈风开口之前，那才是体贴
  { id: 'L01-04.rel.errand-before-selfcheck', kind: 'precedes', subject: B4, object: B2 },
]

const ALL = [
  'L01-04.rel.callit-before-selfcheck',
  'L01-04.rel.callit-before-errand',
  'L01-04.rel.errand-before-selfcheck',
]

const endings: LetterEnding[] = [
  {
    id: 'L01-04.E.s',
    rating: 'S',
    title: '她先说了「今晚到这儿」',
    body: '月见先开了口，然后是沉默，然后烈风翻出了自己的战斗记录看了很久。她又说，你们先聊，我去把部队的修理费交了。没有人觉得她在逃。那天晚上频道里的话不多，但没有一句是白说的。',
    requires: ALL,
    minSatisfied: 3,
    priority: 10,
    tendency: [
      { characterId: 'yuejian', delta: 2, reason: '她先开口，把沉默变成了休息而不是冷场' },
      { characterId: 'liefeng', delta: 2, reason: '他第一次在灭团之后去看自己的记录' },
      { characterId: 'chenxi', delta: 1, reason: '他没有硬撑着说「再来一把」' },
    ],
  },
  {
    id: 'L01-04.E.a',
    rating: 'A',
    title: '她先开了口',
    body: '月见先说了收工。烈风没接话，但也没有反驳，只是安静地退了语音。过了一会儿，频道里出现一行字：明天继续。那一晚就这样过去了，比想象中好一点。',
    requires: ALL,
    minSatisfied: 2,
    priority: 20,
    tendency: [
      { characterId: 'yuejian', delta: 1, reason: '她替所有人按下了暂停' },
      { characterId: 'liefeng', delta: 1, reason: '他接受了这次收工' },
      { characterId: 'chenxi', delta: 0, reason: '他什么也没说' },
    ],
  },
  {
    id: 'L01-04.E.b',
    rating: 'B',
    title: '她去做事了',
    body: '月见什么也没说，只是去把部队的修理费交了。等她回来的时候，频道里的人已经散了。没有人知道她刚才那句话本来是想说的。',
    requires: ALL,
    minSatisfied: 1,
    priority: 30,
    tendency: [
      { characterId: 'yuejian', delta: -1, reason: '她用做事代替了说话，又一次' },
      { characterId: 'liefeng', delta: 0, reason: '他没注意到她离开' },
      { characterId: 'chenxi', delta: 0, reason: '他以为大家都还好' },
    ],
  },
  {
    id: 'L01-04.E.c',
    rating: 'C',
    title: '没有人先开口',
    body: '灭团之后，三个人都没说话。月见在等别人先开口，烈风在等别人先认错，队长在想要不要说那句「再来一把」。等有人终于打字的时候，语音频道只剩一个人了。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'yuejian', delta: -2, reason: '她又在等别人先开口' },
      { characterId: 'liefeng', delta: -1, reason: '他把沉默当成了默认' },
      { characterId: 'chenxi', delta: -1, reason: '他那句「再来一把」最终没有说出口' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L01-04.E.fallback',
  rating: 'C',
  title: '没有打破的沉默',
  body: '那天的沉默一直持续到所有人下线。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L01_04: Letter = {
  id: 'L01-04',
  chapterId: 'ch01',
  title: '语音频道里的沉默',
  anchor: { phase: 'growth', space: 'linkshell' },
  preamble:
    '倾听者：\n\n' +
    '那天灭得很难看，比第一次还难看。语音频道里安静了很久，久到我能听见自己的风扇声。\n\n' +
    '每个人都在打字，又都删掉了。我记得最后有人先开了口——但我不确定那是谁。\n\n' +
    '现在想想，那是我们第一次一起经历不太好的一天。我想知道那天有没有一种说法，能让我们靠得更近一点。',
  signature: '——月见',
  blocks: [
    { id: 'L01-04.b1-chenxi', statementId: 'chenxi.growth.04c', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'liefeng.growth.04b', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yuejian.growth.03b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yuejian.growth.04', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L01-03'] },
}
