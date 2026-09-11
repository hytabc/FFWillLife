import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L04-02「IC与OOC」
 * 空间锚点 rp-venue / 阶段 成熟期（见 STORY-BIBLE §5.3）。出场：夜语 · 铃兰。
 *
 * 一封信里只有两个人：一个把面具戴成了脸，一个从来不用面具。
 * 三条顺序关系构成"先自白、再给证据、最后才让话落地"的完整链条，
 * 第四条是跨时空错位（tier `high`）——铃兰那句邀请是从很久以前、另一个空间被拖到这一刻的。
 * `high` 档在本信写成**隐藏剧情**：你会看见那句话本来不是对着这个人说的。
 *
 * 因果逻辑：
 *   B2 夜语承认自己分不清了 · B3 铃兰的邀请（被拖来的旧话） · B4 夜语说出让他分不清的那个瞬间
 *
 * 排列与分档（已逐排列验证：{2,4,2,1,3,1}，1~4 全部可达，无兜底）：
 *   B2 B4 B3 → 4 = S  先自白，再给证据，最后邀请落地
 *   B4 B2 B3 → 3 = A  先说那个瞬间，再承认，邀请也到了
 *   B2 B3 B4 → 2 = B  自白说完就被邀请接住，可那个具体瞬间始终没有说出来
 *   B3 B2 B4 → 2 = B  邀请先到，自白跟在后面，像在给自己找台阶
 *   B3 B4 B2 → 1 = C  自白排在最末，成了散场前的自言自语
 *   B4 B3 B2 → 1 = C  先说瞬间，邀请插在中间，自白留在最后没有人应
 */

const B2 = 'L04-02.b2-yeyu-confess'
const B3 = 'L04-02.b3-linglan-invite'
const B4 = 'L04-02.b4-yeyu-reflex'

const relations: KeyRelation[] = [
  // 他先承认自己分不清，才说得出口那个让他发现的瞬间
  { id: 'L04-02.rel.confess-before-reflex', kind: 'precedes', subject: B2, object: B4 },
  // 那个瞬间说完了，铃兰的话才落到地上
  { id: 'L04-02.rel.reflex-before-invite', kind: 'precedes', subject: B4, object: B3 },
  // 顺序的最后一项：邀请必须在自白之后，才不是一句客套
  { id: 'L04-02.rel.confess-before-invite', kind: 'precedes', subject: B2, object: B3 },
  // 那句邀请是从很久以前、另一个空间被拖进来的——它当年不是对这个男人说的
  { id: 'L04-02.rel.invite-carried-across', kind: 'displacedInto', subject: B3, tier: 'high' },
]

const ALL = [
  'L04-02.rel.confess-before-reflex',
  'L04-02.rel.reflex-before-invite',
  'L04-02.rel.confess-before-invite',
  'L04-02.rel.invite-carried-across',
]

const endings: LetterEnding[] = [
  {
    id: 'L04-02.E.s',
    rating: 'S',
    title: '他把面具摘下来放在桌上',
    body:
      '夜语先说：他分不清哪一句是自己的了。说完他自己愣了一下，像没料到这句话真的出了口。\n\n' +
      '然后他才说出那个让他发现的瞬间——有人叫角色的名字，他下意识回了头。应得太快了，快过他的判断。\n\n' +
      '最后是铃兰。她把一句很久以前说过的话放在这里：频道建好了，随时来聊天。那句话当年不是对他说的，可现在它落在了一个刚摘下面具的人面前，正好。\n\n' +
      '那天晚上店里只有两个人。夜语走的时候，第一次没有用角色的语气说再见。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'yeyu', delta: 2, reason: '他先承认了分不清，然后才敢说回头的那个瞬间' },
      { characterId: 'linglan', delta: 2, reason: '她把旧邀请用在了对的地方，而不是用来活跃气氛' },
      { characterId: 'yuejian', delta: 0, reason: '她那天不在店里，所以没有人替夜语打圆场' },
    ],
  },
  {
    id: 'L04-02.E.a',
    rating: 'A',
    title: '他先说回了头的事',
    body:
      '夜语先讲了那个瞬间：有人叫他角色的名字，他下意识回了头——讲到一半他才补上一句，说自己其实分不清了。\n\n' +
      '铃兰的邀请到得很及时，可他已经在用角色的语气笑了。那句话被接住了，接住的是那个角色。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'yeyu', delta: 1, reason: '他说了那个瞬间，可自白排在后面，像一句补白' },
      { characterId: 'linglan', delta: 2, reason: '她听出了那句话里的两个人' },
      { characterId: 'yuejian', delta: 0, reason: '她那天不在店里' },
    ],
  },
  {
    id: 'L04-02.E.b',
    rating: 'B',
    title: '话落地了，人没有',
    body:
      '夜语的自白被铃兰的邀请接住了——她接得很快，快到那句自白还没来得及长出重量。\n\n' +
      '至于那个让他分不清的瞬间，他始终没有说。它留在他自己那里，和所有别的句子一样，被收进了一整面墙的衣服里。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yeyu', delta: 0, reason: '他说了分不清，但把具体的那件事留给了自己' },
      { characterId: 'linglan', delta: 1, reason: '她接住了那句话，只是接得太快' },
      { characterId: 'yuejian', delta: 0, reason: '她那天不在店里' },
    ],
  },
  {
    id: 'L04-02.E.c',
    rating: 'C',
    title: '散场前的那句话',
    body:
      '铃兰把邀请说了出来，夜语讲了那个回头的瞬间，最后才轮到他那句「分不清」。\n\n' +
      '它说出口的时候，铃兰已经在穿外套了。她听见了，回头看了他一眼，说了一句明天见。\n\n' +
      '夜语点点头。那句自白就这样悬在两个人之间，谁也没有再碰它。',
    requires: ALL,
    minSatisfied: 1,
    priority: 40,
    tendency: [
      { characterId: 'yeyu', delta: -2, reason: '他把最重要的一句话排在了散场前' },
      { characterId: 'linglan', delta: -1, reason: '她听见了，但她已经站在门口了' },
      { characterId: 'yuejian', delta: 0, reason: '她那天不在店里，店里没有人懂这行的规矩' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=1 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L04-02.E.fallback',
  rating: 'C',
  title: '没有说出口的那句话',
  body: '那天晚上那句话最终没有排到一个能落地的位置。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L04_02: Letter = {
  id: 'L04-02',
  chapterId: 'ch04',
  title: 'IC与OOC',
  anchor: { phase: 'mature', space: 'rp-venue' },
  preamble:
    '倾听者：\n\n' +
    '那天晚上快到一点了，店里只剩下我们两个。铃兰在收桌子，我在等她一起走。\n\n' +
    '她忽然问我，现实里我是个什么样的人。我说不上来。我有一整个柜子的衣服，每一件都有一个说法；可脱下它们之后，我连一句完整的话都拼不出来。\n\n' +
    '我以前以为，只要扮演得够久，那个人就会变成我。现在我开始怀疑，是那个人在里面待得太久，出不来了。',
  signature: '——夜语',
  blocks: [
    { id: 'L04-02.b1-linglan-wait', statementId: 'linglan.growth.02', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yeyu.mature.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'linglan.growth.01', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yeyu.mature.02', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L04-01'] },
}
