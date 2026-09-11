import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L01-02「关于那个渡劫失败就退队的D2」
 * 空间锚点 linkshell / 阶段 成长期（见 STORY-BIBLE §5.3）。
 *
 * 采用**分级判定（band grading）**：定义若干"正向"关系，
 * 结局按"满足了几条"分档。相比逐个排列手写结局，这种方式在组合更多时
 * 仍然可控，且校验器 4/5 依然保证「没有排列落到兜底」「没有写了却打不出来的结局」。
 *
 * 因果逻辑：那个输出位退队的那晚，谁的话先说出口。
 *   B2 烈风的苛责  ·  B3 月见的调和  ·  B4 烈风回头看自己
 */

const B2 = 'L01-02.b2-liefeng-demand'
const B3 = 'L01-02.b3-yuejian-callit'
const B4 = 'L01-02.b4-liefeng-selfcheck'

/** 三条正向关系：满足越多，这支队伍越稳。 */
const relations: KeyRelation[] = [
  // 月见先把场面兜住，烈风才发难
  { id: 'L01-02.rel.callit-before-demand', kind: 'precedes', subject: B3, object: B2 },
  // 月见先安抚，烈风才回头去看自己的问题
  { id: 'L01-02.rel.callit-before-selfcheck', kind: 'precedes', subject: B3, object: B4 },
  // 烈风先认自己的账，再开口要求别人
  { id: 'L01-02.rel.selfcheck-before-demand', kind: 'precedes', subject: B4, object: B2 },
]

const ALL = [
  'L01-02.rel.callit-before-demand',
  'L01-02.rel.callit-before-selfcheck',
  'L01-02.rel.selfcheck-before-demand',
]

const endings: LetterEnding[] = [
  {
    id: 'L01-02.E.s',
    rating: 'S',
    title: '有人先兜住了场面',
    body: '月见先说了「今晚先到这儿」，然后烈风才回头看自己的记录，最后才轮到那句苛责——等它出口的时候，已经没有人需要被它推着走了。那个输出位第二天照常上线，谁也没提退队的事。',
    requires: ALL,
    minSatisfied: 3,
    priority: 10,
    tendency: [
      { characterId: 'yuejian', delta: 2, reason: '她先兜住了场面，替所有人留了台阶' },
      { characterId: 'liefeng', delta: 2, reason: '他先看了自己的问题，再开口要求别人' },
      { characterId: 'chenxi', delta: 1, reason: '他把招募写好，等于告诉所有人明天还在' },
    ],
  },
  {
    id: 'L01-02.E.a',
    rating: 'A',
    title: '有人先把话说软了',
    body: '月见先开了口，语气很轻。烈风还是把那句难听的说出了口，只是说完之后，他自己也愣了一下，翻出记录看了很久。那晚没有人退队。',
    requires: ALL,
    minSatisfied: 2,
    priority: 20,
    tendency: [
      { characterId: 'yuejian', delta: 1, reason: '她把话说软了，只是没能拦住全部' },
      { characterId: 'liefeng', delta: 1, reason: '他发难之后，难得地回头看了自己一眼' },
      { characterId: 'chenxi', delta: 0, reason: '他写完了招募，但没有多说一句' },
    ],
  },
  {
    id: 'L01-02.E.b',
    rating: 'B',
    title: '话都说出口了',
    body: '烈风的苛责和月见的调和撞在一起，谁也听不进去谁。事情最后是压下去了，但压下去的东西不会消失——它只会在下一次灭团时再浮上来。',
    requires: ALL,
    minSatisfied: 1,
    priority: 30,
    tendency: [
      { characterId: 'liefeng', delta: -1, reason: '他先看见了别人的问题，而不是自己的' },
      { characterId: 'yuejian', delta: 0, reason: '她打了圆场，但没人在听' },
      { characterId: 'chenxi', delta: 0, reason: '他把话咽了回去' },
    ],
  },
  {
    id: 'L01-02.E.c',
    rating: 'C',
    title: '名单上少了一个人',
    body: '最伤人的那句最先出口。月见想调和的时候，听起来已经像是在替水平不够的人开脱。那个输出位退了队，也退了通讯贝，没有再说过一句话。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'liefeng', delta: -2, reason: '那句话是他说的，他后来一直记得' },
      { characterId: 'yuejian', delta: -1, reason: '她的调和来晚了，反而像偏袒' },
      { characterId: 'chenxi', delta: -1, reason: '他写了招募，却没能留住人' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L01-02.E.fallback',
  rating: 'C',
  title: '没有排出来的那一晚',
  body: '那天的话最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L01_02: Letter = {
  id: 'L01-02',
  chapterId: 'ch01',
  title: '关于那个渡劫失败就退队的D2',
  anchor: { phase: 'growth', space: 'linkshell' },
  preamble:
    '倾听者：\n\n' +
    '我们队的第二个高难周，一个输出位在最后百分之三灭团之后退了队。\n\n' +
    '他退得很安静，没有吵，也没有说再见。第二天我看见他的位置空着，才反应过来发生了什么。\n\n' +
    '我一直在想，那天晚上我们说的话，如果换一个顺序说，他会不会还在这里。',
  signature: '——晨曦',
  blocks: [
    { id: 'L01-02.b1-chenxi', statementId: 'chenxi.growth.04b', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'liefeng.growth.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yuejian.growth.03', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'liefeng.growth.04', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L01-01'] },
}
