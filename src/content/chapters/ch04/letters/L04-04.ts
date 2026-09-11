import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L04-04「面具的名字」
 * 空间锚点 rp-venue / 阶段 成熟期（见 STORY-BIBLE §5.3）。出场：夜语 · 铃兰 · 月见。
 *
 * 本信的题眼是"没有一句是本人说的"：月见在店里说团本里的话，
 * 夜语对一个不是自己的名字回了头，而铃兰——那个把整家店张罗起来的人——
 * 散场以后没有被任何人问过名字（这句是固定块，永远排在信的最上面）。
 *
 * 因果逻辑：
 *   B2 月见用做事离席（从通讯贝拖进店里，`high`） · B3 月见用团本的口气照顾人 · B4 夜语的回头
 *
 * 排列与分档（已逐排列验证：{1,0,3,4,2,3}，0~4 全部可达，无兜底）：
 *   B3 B4 B2 → 4 = S  照顾的话、回头的瞬间、然后她转身去付账
 *   B3 B2 B4 → 3 = A  照顾的话、离席、回头排在最末没有人看见
 *   B4 B3 B2 → 3 = A  回头最先，然后是照顾和离席——顺序都在，只是他自己先醒
 *   B4 B2 B3 → 2 = B  回头和离席在前，照顾的话变成了收场
 *   B2 B3 B4 → 1 = C  离席提前，照顾的话落在中间，回头留在最后
 *   B2 B4 B3 → 0 = D  什么都没动：离席、回头、照顾各归各位，没有人被认出来
 */

const B2 = 'L04-04.b2-yuejian-errand'
const B3 = 'L04-04.b3-yuejian-rest'
const B4 = 'L04-04.b4-yeyu-reflex'

const relations: KeyRelation[] = [
  // 她先说"大家辛苦了"，那句照顾人的话才不至于变成离席的借口
  { id: 'L04-04.rel.rest-before-reflex', kind: 'precedes', subject: B3, object: B4 },
  // 回头看向那个名字之后，她才转身去做事——这时她的离开才被看见
  { id: 'L04-04.rel.reflex-before-errand', kind: 'precedes', subject: B4, object: B2 },
  // 顺序的最后一项：照顾的话说在离席之前
  { id: 'L04-04.rel.rest-before-errand', kind: 'precedes', subject: B3, object: B2 },
  // 那句离席的话是从另一个空间被拖进来的——这里其实没有她的部队
  { id: 'L04-04.rel.errand-carried-across', kind: 'displacedInto', subject: B2, tier: 'high' },
]

const ALL = [
  'L04-04.rel.rest-before-reflex',
  'L04-04.rel.reflex-before-errand',
  'L04-04.rel.rest-before-errand',
  'L04-04.rel.errand-carried-across',
]

const endings: LetterEnding[] = [
  {
    id: 'L04-04.E.s',
    rating: 'S',
    title: '三句话里没有一句是自己的名字',
    body:
      '月见先开口。她说，大家辛苦了，这把灭了先休息吧——她说得很自然，自然到没有人想起来，这家店里根本没有人在打副本。\n\n' +
      '然后是夜语。有人叫了一声他角色的名字，他下意识回了头。那个动作快过他自己，快到桌上的人都以为他是在应自己的名字。\n\n' +
      '最后月见站了起来：「你们先聊，我去把账结了。」她走出门口的时候，夜语才反应过来——这家店里根本没有她要去结的账。\n\n' +
      '三句话排在一起，说的是同一件事——在这个店里，没有一个人用自己真正的名字活着。\n\n' +
      '散场以后铃兰照旧在门口数位置。她数到最后一个人的时候，谁也没有问过她叫什么。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'yuejian', delta: 2, reason: '她的照顾和她的离席连着说，第一次被人看出了其中的代价' },
      { characterId: 'yeyu', delta: 1, reason: '他回头的那一下，被放在了能被人看见的位置' },
      { characterId: 'linglan', delta: 2, reason: '她张罗的这家店，终于有人读出了"没有人问过她名字"这件事' },
    ],
  },
  {
    id: 'L04-04.E.a',
    rating: 'A',
    title: '他先醒的那一下',
    body:
      '夜语回头那一下排在最前面。有人叫角色的名字，他应了，然后他自己先愣住。\n\n' +
      '月见的照顾和离席跟在后头，顺序都对，只是没有人接着他那个愣神往下问一句。\n\n' +
      '那天晚上大家走得都比平时早。夜语在门口站了一会儿，最后什么也没说。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'yeyu', delta: 2, reason: '他意识到自己应了那个名字，但没有人问他' },
      { characterId: 'yuejian', delta: 1, reason: '她说照顾的话时，用的是别人家的规矩' },
      { characterId: 'linglan', delta: 0, reason: '她在门口数位置，没有人问她名字' },
    ],
  },
  {
    id: 'L04-04.E.b',
    rating: 'B',
    title: '照顾的话变成了收场',
    body:
      '夜语回了头，月见转身去付账，等这一切都过去了，那句"大家辛苦了，这把灭了先休息吧"才说出口。\n\n' +
      '它听起来像是在给这一夜收尾——店里没有人在打副本，所以它是说给谁听的，没有人追问。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yuejian', delta: -1, reason: '她照顾人的那句话，被当成了散场时的客气' },
      { characterId: 'yeyu', delta: 0, reason: '他回了头，随后把这件事放下了' },
      { characterId: 'linglan', delta: -1, reason: '她操办了整场，散场后没有人记得问她名字' },
    ],
  },
  {
    id: 'L04-04.E.c',
    rating: 'C',
    title: '各归各位',
    body:
      '月见先去把账结了，回来才说了那句辛苦，夜语最后才回头。\n\n' +
      '顺序散着，三句话各自成立，也都各自没有被人接住。散场的时候灯还亮着，铃兰把最后一把椅子摆回了原位。',
    requires: ALL,
    minSatisfied: 1,
    priority: 40,
    tendency: [
      { characterId: 'yuejian', delta: -2, reason: '她又一次用做事代替了说心里的话' },
      { characterId: 'yeyu', delta: -1, reason: '他的回头落在了没有人看的方向' },
      { characterId: 'linglan', delta: 0, reason: '她把椅子摆回去，像每一天一样' },
    ],
  },
  {
    id: 'L04-04.E.d',
    rating: 'D',
    title: '没有人被认出来',
    body:
      '什么都没有动。月见去把账结了，夜语对一个不是自己的名字回了头，然后有人说了句"辛苦了"。\n\n' +
      '店里的灯是暖的，谁也没有说错话。散场之后铃兰照旧数了数还剩几个位置，然后关了灯。\n\n' +
      '第二天那家店还会开。没有人再提起过那一夜的三句话。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'yeyu', delta: -2, reason: '他连自己应了谁的名字都没有细想' },
      { characterId: 'yuejian', delta: -2, reason: '她照顾了所有人，也照旧没有留下自己' },
      { characterId: 'linglan', delta: -2, reason: '她张罗的那家店，散场以后没有人问过她叫什么' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L04-04.E.fallback',
  rating: 'D',
  title: '没有名字的那一夜',
  body: '那天晚上没有一个人的名字被说出来。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L04_04: Letter = {
  id: 'L04-04',
  chapterId: 'ch04',
  title: '面具的名字',
  anchor: { phase: 'mature', space: 'rp-venue' },
  preamble:
    '倾听者：\n\n' +
    '那家店不是我的。铃兰把我叫去的时候说，你来坐一会儿就行，不用说话。\n\n' +
    '我坐在靠门那桌。中间有人推门进来，浑身都是外面那种冷气，坐下以后换了一副嗓子说话。散场以后他在门口站了很久，像是在等自己走回来。\n\n' +
    '我把那晚听到的三句话记在这里。我想知道，如果换一个顺序说，那家店里会不会有一个人用到自己真正的名字。',
  signature: '——月见',
  blocks: [
    { id: 'L04-04.b1-linglan-host', statementId: 'linglan.mature.03', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yuejian.growth.04b', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yuejian.growth.01', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yeyu.mature.02c', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L04-03'] },
}
