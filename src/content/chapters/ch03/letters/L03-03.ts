import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L03-03「老队友的名字」—— 第三章第三封。
 * 空间锚点 rp-venue / 阶段 成熟期 / 出场 远山·铁壁·晨曦·夜语（见 STORY-BIBLE §5.3）。
 *
 * 本信没有固定块：四句都是那天晚上在场的话，四句都可以被拖。
 *
 * `transform` 落在 B4 上：夜语豆芽期的「我可以扮演任何人。」被拖到今夜，
 * 从一个新人对表演的雀跃，变成一件很残忍的事——因为今夜确实有一个人，
 * 顶着他死去的友谊的名字，活得好好的。
 *
 * **写作规则（STORY-BIBLE R15 / §3 钩子）**：那个名字的巧合，
 * 两个角色都不许当场意识到。它只能由倾听者旁白点出，写在各档结局的正文里。
 * 铁壁、晨曦、夜语都不许说破，远山也不许说破。
 */

const B1 = 'L03-03.b1-yuanshan-gray-list'
const B2 = 'L03-03.b2-tiebi-our-house'
const B3 = 'L03-03.b3-chenxi-together'
const B4 = 'L03-03.b4-yeyu-anyone'

/** 五条正向关系：满足越多，他在散场时越接近说出那个名字。 */
const relations: KeyRelation[] = [
  // 表演者的那句话被拖到他如今的年纪：跨阶段同空间 → transform
  { id: 'L03-03.rel.anyone-comes-of-age', kind: 'displacedInto', subject: B4, tier: 'transform' },
  // 他自己那句是在别的地方说的：它属于主城的路口，不属于这家店
  { id: 'L03-03.rel.gray-list-elsewhere', kind: 'displacedInto', subject: B1, tier: 'microshift' },
  // 铁壁那句本来是在那栋房子里说的
  { id: 'L03-03.rel.house-elsewhere', kind: 'displacedInto', subject: B2, tier: 'microshift' },
  // 晨曦那句是在频道里说的，不是在灯下面说的
  { id: 'L03-03.rel.together-elsewhere', kind: 'displacedInto', subject: B3, tier: 'microshift' },
  // 他把自己那句留到了最后：先把别人的话听完，才承认自己什么都没剩下
  { id: 'L03-03.rel.gray-list-last', kind: 'last', subject: B1 },
]

const ALL = [
  'L03-03.rel.anyone-comes-of-age',
  'L03-03.rel.gray-list-elsewhere',
  'L03-03.rel.house-elsewhere',
  'L03-03.rel.together-elsewhere',
  'L03-03.rel.gray-list-last',
]

const endings: LetterEnding[] = [
  {
    id: 'L03-03.E.s',
    rating: 'S',
    title: '他把那个名字带回了家',
    body:
      '那家店的灯是暖的。铁壁在那栋房子里说过「房子也是大家的」，晨曦在频道里说过「我是想大家还能一起玩」——这两句话被搬到灯下面来听，忽然都不像安慰，像证据：证明他确实有过那样的日子。\n\n' +
      '然后是台上那位表演者的回答：「我可以扮演任何人。」\n\n' +
      '这句话本来是一个新人第一次发现表演有多好玩时说的。被拖到这个晚上，它变成了另一件事——今夜真的有一个人，顶着他死去的友谊的名字，活得好好的。\n\n' +
      '倾听者，只有你注意到了这件事：散场报名字的时候，那个名字和远山很多年前说出过的那个名字一模一样。\n\n' +
      '夜语不知道。她只是在演她自己写的角色。远山也没有说破——他只是把那个名字在心里念了一遍，回家以后，翻出旧名单，把一直没敢点开的那一栏点开了。\n\n' +
      '名单还是灰的。但他终于知道，那个名字还可以被活着的人用。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yuanshan', delta: 2, reason: '他在散场时把那个名字念了一遍，然后回家点开了旧名单' },
      { characterId: 'yeyu', delta: 2, reason: '她的角色顶着一个旧名字活在灯下——这是她自己都不知道的温柔' },
      { characterId: 'tiebi', delta: 1, reason: '他说的那句话被搬到灯下，变成了证据' },
    ],
  },
  {
    id: 'L03-03.E.a',
    rating: 'A',
    title: '他听完了，什么都没说',
    body:
      '他把别人的话都听完了，自己也说了一句。就到此为止。\n\n' +
      '表演者那句「我可以扮演任何人」落在耳朵里，他只当是一句职业性的漂亮话——倾听者，只有你看见了那行报名字的字，和远山很多年前说出过的那个名字一模一样。\n\n' +
      '他没有注意到。或者说，他注意到了，选择了不去看。\n\n' +
      '散场以后他在门口站了会儿，然后回家了。那一晚他已经很久没睡得这么好。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 1, reason: '他在店里坐到了散场，但没有把那个名字说出口' },
      { characterId: 'yeyu', delta: 1, reason: '她照常演完了她的角色' },
      { characterId: 'tiebi', delta: 0, reason: '他的那句话被搬动了，但没有改变什么' },
    ],
  },
  {
    id: 'L03-03.E.b',
    rating: 'B',
    title: '他在灯下坐了一晚上',
    body:
      '那家店的灯是暖的，他在角落里坐了一晚上。有人上去演，有人报名字，有人笑。他一句都没接。\n\n' +
      '「我可以扮演任何人。」——这话他听见了，没往心里去。扮演任何人，也就意味着谁都不是。\n\n' +
      '倾听者，只有你知道那天晚上发生了什么：报名字的时候，那行字里有一个名字，和远山旧名单上的一个名字一模一样。\n\n' +
      '巧合而已。可是世上的巧合，只有被放在心上的人撞见才算数。他那天晚上没有撞见。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他在那家店里坐了一晚上，什么也没有带走' },
      { characterId: 'yeyu', delta: 0, reason: '她不知道自己的角色名字对某个人意味着什么' },
      { characterId: 'tiebi', delta: 0, reason: '那句话始终没有被搬到灯下面' },
    ],
  },
  {
    id: 'L03-03.E.c',
    rating: 'C',
    title: '他先说了自己那份名单',
    body:
      '「好友列表全灰了……连部队的房子也被回收了。」\n\n' +
      '在自己的话出口之后，那家店里的一切都变成了表演：铁壁说房子是大家的——可他连房子都没有了；晨曦说想大家还能一起玩——可没有大家了；台上那位说「我可以扮演任何人」——多好，谁都行，就不是自己。\n\n' +
      '他把这一整晚读成了一场戏，而他是唯一没有角色的人。\n\n' +
      '倾听者，只有你看见了：散场报名字的时候，那行字里有一个名字，和远山旧名单上的一个名字一模一样。他低头走出去了，没有看见。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'yuanshan', delta: -2, reason: '他先说了自己那份名单，于是那一整晚都变成了别人的表演' },
      { characterId: 'yeyu', delta: -1, reason: '她的表演被当成了嘲讽' },
      { characterId: 'tiebi', delta: -1, reason: '他说的话被读成了风凉话' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L03-03.E.fallback',
  rating: 'C',
  title: '没有排出来的那一晚',
  body: '那家店里的这一晚最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L03_03: Letter = {
  id: 'L03-03',
  chapterId: 'ch03',
  title: '老队友的名字',
  anchor: { phase: 'mature', space: 'rp-venue' },
  preamble:
    '倾听者：\n\n' +
    '那家店是铃兰告诉我的。她说那里的人都在演别人，演得比本人还起劲，一个晚上能认识十几个名字。\n\n' +
    '我本来只是想找个地方坐着。\n\n' +
    '那天晚上店里有一场戏，演完了大家一个个报名字。轮到台上那个人报的时候，我愣了一下。\n\n' +
    '我没有上去问。那一整晚，我都没有跟那个人说一句话。\n\n' +
    '那几句从店里飘过来的话我都抄下来了。你可以把它们拖来拖去——反正那家店里，谁都在演别人。',
  signature: '——远山',
  blocks: [
    { id: B1, statementId: 'yuanshan.mature.01', draggable: true, homeIndex: 0 },
    { id: B2, statementId: 'tiebi.mature.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'chenxi.mature.03', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yeyu.sprout.01', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L03-02'] },
}
