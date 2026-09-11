import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * H02「部队的第一次合影」—— 第二章隐藏信。
 * 空间锚点 fc-house / 阶段 成长期（见 STORY-BIBLE §5.3）。出场：铁壁 · 小星 · 晨曦。
 *
 * 隐藏信的主题（STORY-BIBLE 附录 B2）：**同一句话，在这间屋子里被听到、
 * 和在频道里被读到，是两回事。** 冲突来自空间而不是时间——所以本信只用
 * `microshift`（跨空间、同阶段）这一个档位，不碰时间轴。
 *
 * B2 的原始坐标在通讯贝（linkshell）：它被搬进屋子里之后，
 * 那句写在频道里的公告，才第一次变成了「我们明天还在」。
 * S 档要求它必须被搬动过——什么都不排（初始排列）只能拿到 B。
 *
 * 排列覆盖（6 种，零兜底）：
 *   B3,B2,B4 → 2 条 → B      B3,B4,B2 → 2 条 → B
 *   B2,B3,B4 → 4 条 → S      B2,B4,B3 → 3 条 → A
 *   B4,B3,B2 → 1 条 → C      B4,B2,B3 → 1 条 → C
 */

const B1 = 'H02.b1-xiaoxing-question'
const B2 = 'H02.b2-chenxi-post'
const B3 = 'H02.b3-tiebi-rule'
const B4 = 'H02.b4-chenxi-stay'

const relations: KeyRelation[] = [
  // 那句写在频道里的话先被搬进了屋子，铁壁的规矩才是在回答它
  { id: 'H02.rel.post-before-rule', kind: 'precedes', subject: B2, object: B3 },
  // 先有人把公告搬到明面上说，那句「我最不会走」才不是表忠心
  { id: 'H02.rel.post-before-stay', kind: 'precedes', subject: B2, object: B4 },
  // 先立了「一个都不赶」的规矩，才有人敢说自己是最不会走的那个
  { id: 'H02.rel.rule-before-stay', kind: 'precedes', subject: B3, object: B4 },
  // 那句话本来只在频道里被读到；搬进屋子，它才被人听见
  { id: 'H02.rel.heard-in-the-room', kind: 'displacedInto', subject: B2, tier: 'microshift' },
]

const ALL = [
  'H02.rel.post-before-rule',
  'H02.rel.post-before-stay',
  'H02.rel.rule-before-stay',
  'H02.rel.heard-in-the-room',
]

const endings: LetterEnding[] = [
  {
    id: 'H02.E.s',
    rating: 'S',
    title: '一句话，两个地方',
    body:
      '晨曦先开的口。他把自己写在频道里的那行字从屏幕上摘了下来，当着屋子里所有人的面说了一遍：「零式的招募我写好了，明天继续。灭一次不算什么。」\n\n' +
      '在频道里读到它，它只是一条公告——谁都可以当作没看见，谁都不必回应；在这间屋子里听见它，它是一句「我们明天还在」。\n\n' +
      '铁壁接着说，这支部队不踢挂机的人，来的人他一个都不赶。最后晨曦说，他不是最厉害的那个，但他是最不会走的那个。\n\n' +
      '有人提议拍一张照。快门按下去的时候，小星还站在最边上，手里捏着一张写满了陌生名字的纸。那张照片后来在墙上挂了很多年——上面的人一个都没有少。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'chenxi', delta: 2, reason: '他把只写在频道里的那句话，搬进屋子当面说了一遍' },
      { characterId: 'tiebi', delta: 2, reason: '他把「一个都不赶」说在了合影之前' },
      { characterId: 'xiaoxing', delta: 2, reason: '那张合影里没有少掉她' },
    ],
  },
  {
    id: 'H02.E.a',
    rating: 'A',
    title: '听见了，只是晚了一步',
    body:
      '晨曦那两句话都是当着面说的。第二句「我不是最厉害的那个，但我是最不会走的那个」落在了铁壁的规矩前面——等铁壁说「不踢挂机的人」的时候，那句话听起来像是在回答他，而不像是在立给所有人看。\n\n' +
      '照片还是拍了。快门按下之前，有人喊了一声「都往前站一点」，大家才想起来挤一挤。照片上的人都站得不太整齐，但一个都没有少。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'chenxi', delta: 1, reason: '他把话都说了出口，只是顺序反了' },
      { characterId: 'tiebi', delta: 1, reason: '他的规矩被当成了一句回应' },
      { characterId: 'xiaoxing', delta: 1, reason: '她被喊进了照片里' },
    ],
  },
  {
    id: 'H02.E.b',
    rating: 'B',
    title: '没有人听见那句公告落地',
    body:
      '铁壁先把规矩说了。晨曦那两句其实都在，只是第一句还留在频道里——他是在屏幕后面打完那行字才抬起头的，屋子里没有人听见它落地。\n\n' +
      '后来有人架好了相机，所有人都站了进去。散场以后有人翻记录，才发现那条公告早就发过了，只是当天在屋子里的人，一个都没有读到。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'tiebi', delta: 0, reason: '规矩说在了最前面，却不知道在回应谁' },
      { characterId: 'chenxi', delta: 0, reason: '他那句话没有当着面说' },
      { characterId: 'xiaoxing', delta: 0, reason: '她站进了照片，但什么也没有说' },
    ],
  },
  {
    id: 'H02.E.c',
    rating: 'C',
    title: '那张照片里她看着自己的鞋',
    body:
      '那句话留在了频道里。屋子里的人听见的是另一句：「我不是最厉害的那个，但我是最不会走的那个」——它落在铁壁的规矩前面，听起来像一次表忠心。\n\n' +
      '没有人提议拍照。最后是铁壁自己把相机架好的，他站进队伍里的时候，小星往旁边让了半步。\n\n' +
      '那张照片里所有人都看着镜头，只有她看着自己的鞋。照片后来也留下来了——挂在墙上，最边上那个人的脸，是模糊的。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'chenxi', delta: -1, reason: '他把承诺说得像表忠心' },
      { characterId: 'tiebi', delta: -1, reason: '他的规矩排在了所有承诺的最后' },
      { characterId: 'xiaoxing', delta: -2, reason: '合影里她让开了半步，脸是模糊的' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'H02.E.fallback',
  rating: 'C',
  title: '没有洗出来的那张照片',
  body: '那张照片最后没有洗出来。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const H02: Letter = {
  id: 'H02',
  chapterId: 'ch02',
  title: '部队的第一次合影',
  anchor: { phase: 'growth', space: 'fc-house' },
  hidden: true,
  preamble:
    '倾听者：\n\n' +
    '第一次合影那天，屋子里的椅子不够，有人坐在了地上。\n\n' +
    '拍照之前，有人把一句只写在频道里的话搬进了屋子，当着所有人的面说了一遍。同一句话，我在频道里读过很多次，那天是第一次听见它落地。\n\n' +
    '我留了一张照片。照片上的人都站得不太整齐，但一个都没有少。',
  signature: '——晨曦',
  blocks: [
    { id: B1, statementId: 'xiaoxing.sprout.01', draggable: false, homeIndex: 0 },
    { id: B3, statementId: 'tiebi.growth.01', draggable: true, homeIndex: 1 },
    { id: B2, statementId: 'chenxi.growth.04', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'chenxi.growth.05', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  // 隐藏信：通关第二章之后解锁
  unlock: { kind: 'rating', letterId: 'L02-05', ratings: ['S', 'A', 'B', 'C', 'D', 'echo'] },
}
