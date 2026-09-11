import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L01-03「零式的门票」
 * 空间锚点 city / 阶段 成长期（见 STORY-BIBLE §5.3）。出场：晨曦 · 烈风。
 *
 * 因果逻辑：名单要定了，队里有个水平还不够的人。谁先开口，决定这件事怎么收场。
 *   B2 烈风在木桩前等  ·  B3 烈风嫌人  ·  B4 队长怕散
 *
 * 关系之间必须**互相独立**——若两条关系互斥（如同时写 precedes(A,B) 与 precedes(B,A)），
 * 最高档就永远无法满足，S 结局会变成打不出来的摆设。校验器 5 会抓到这种错误。
 */

const B2 = 'L01-03.b2-liefeng-waiting'
const B3 = 'L01-03.b3-liefeng-impatient'
const B4 = 'L01-03.b4-chenxi-dontgo'

const relations: KeyRelation[] = [
  // 他愿意等——这句话说在队长挽留之前，队里就还有余地
  { id: 'L01-03.rel.waiting-before-dontgo', kind: 'precedes', subject: B2, object: B4 },
  // 他先等，再抱怨；顺序反过来就只是抱怨
  { id: 'L01-03.rel.waiting-before-impatient', kind: 'precedes', subject: B2, object: B3 },
  // 等待紧挨着挽留，两句话连在一起，才像一次真正的商量
  { id: 'L01-03.rel.waiting-then-dontgo', kind: 'adjacent', subject: B2, object: B4 },
]

const ALL = [
  'L01-03.rel.waiting-before-dontgo',
  'L01-03.rel.waiting-before-impatient',
  'L01-03.rel.waiting-then-dontgo',
]

const endings: LetterEnding[] = [
  {
    id: 'L01-03.E.s',
    rating: 'S',
    title: '他在木桩前等着，没有先开口',
    body: '烈风什么也没说，只是在木桩前站着等他们打完。队长说「你们要是哪天不打了，记得跟我说一声」——他没有接话，但也没有走。那天名单定下来，两个人都去了。',
    requires: ALL,
    minSatisfied: 3,
    priority: 10,
    tendency: [
      { characterId: 'liefeng', delta: 2, reason: '他等了一次，没有用标准去量别人' },
      { characterId: 'chenxi', delta: 2, reason: '他把「别走」说出了口，而不是藏在心里' },
      { characterId: 'yuejian', delta: 1, reason: '那一晚不需要她调和' },
    ],
  },
  {
    id: 'L01-03.E.a',
    rating: 'A',
    title: '他等过，才开口',
    body: '烈风先等了一会儿，然后还是说了那句「不想打就说」。语气不好听，但顺序对了——听的人知道他不是在赶人走。名单定下来了，那个水平不够的人也去了。',
    requires: ALL,
    minSatisfied: 2,
    priority: 20,
    tendency: [
      { characterId: 'liefeng', delta: 1, reason: '他先等了，虽然最后还是没忍住' },
      { characterId: 'chenxi', delta: 1, reason: '他把话说得比上次软' },
      { characterId: 'yuejian', delta: 0, reason: '她不在场' },
    ],
  },
  {
    id: 'L01-03.E.b',
    rating: 'B',
    title: '队长先说了「别走」',
    body: '队长那句「你们要是哪天不打了，记得跟我说一声」说得太早，听起来像是在求人。烈风当时没说什么，但那句话让整件事变成了一次施舍。名单还是定了。',
    requires: ALL,
    minSatisfied: 1,
    priority: 30,
    tendency: [
      { characterId: 'chenxi', delta: -1, reason: '他把挽留说成了哀求' },
      { characterId: 'liefeng', delta: 0, reason: '他没说什么，但心里记了一笔' },
      { characterId: 'yuejian', delta: 0, reason: '她不在场' },
    ],
  },
  {
    id: 'L01-03.E.c',
    rating: 'C',
    title: '他先说了「别浪费我的时间」',
    body: '烈风最先开的口，说的是「不想打就说，别浪费我的时间」。这句话一出来，队长的挽留就再也说不出口了——它听起来像是在替一个不配的人求情。名单定下来的时候，少了一个人。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'liefeng', delta: -2, reason: '他用一句话把别人关在了门外' },
      { characterId: 'chenxi', delta: -1, reason: '他的话被堵了回去' },
      { characterId: 'yuejian', delta: 0, reason: '她不在场' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L01-03.E.fallback',
  rating: 'C',
  title: '没定下来的名单',
  body: '那份名单最后没有定下来。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L01_03: Letter = {
  id: 'L01-03',
  chapterId: 'ch01',
  title: '零式的门票',
  anchor: { phase: 'growth', space: 'city' },
  preamble:
    '倾听者：\n\n' +
    '我们终于凑齐了进本的资格。那天晚上我在主城排名单，排到一个位置的时候停了一下。\n\n' +
    '队里有个人的水平确实还差一点，而另一个人已经练了很久。\n\n' +
    '我想知道，那天如果我们说话的顺序换一换，那个差一点的人，会不会还有机会。',
  signature: '——晨曦',
  blocks: [
    { id: 'L01-03.b1-chenxi', statementId: 'chenxi.growth.05b', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'liefeng.growth.05', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'liefeng.growth.06', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'chenxi.growth.06', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L01-02'] },
}
