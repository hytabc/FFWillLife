import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L04-05「挂机也是一种陪伴」
 * 空间锚点 linkshell / 阶段 成熟期（见 STORY-BIBLE §5.3）。出场：铃兰 · 夜语 · 远山。
 *
 * 本章唯一一封"安静"的信：没有冲突，只有三个人各自留下的痕迹。
 * 夜语那句「我几乎不说话，知道它开着就够了」被钉在信的最上面，作为全文的前提；
 * 下面三句话分别是三种"证明自己存在过"的方式——装扮、战绩、数字。
 *
 * 错位档位：夜语那句关于幻化的话从 RP 店、成长期被拖进这个频道（`high`）。
 * 写成**隐藏剧情**：玩家会发现，这个把一晚上花在一身衣服上的人，
 * 和那个数着 999+ 的人，说的是同一件事。
 *
 * 因果逻辑：
 *   B2 铃兰的那行数字 · B3 夜语的一身衣服（被拖来的） · B4 远山的战绩
 *
 * 排列与分档（已逐排列验证：{1,1,3,4,2,2}，1~4 全部可达，无兜底）：
 *   B3 B4 B2 → 4 = S  装扮、战绩、数字——三种证明自己存在过的方式，最后落在数字上
 *   B3 B2 B4 → 3 = A  先说自己怎么活，再数数字，最后才轮到战绩
 *   B4 B2 B3 → 2 = B  战绩最先，数字在中间，装扮排在最后
 *   B4 B3 B2 → 2 = B  战绩最先，装扮跟上，数字排在最后
 *   B2 B3 B4 → 1 = C  什么都没动：数字、装扮、战绩，各归各位
 *   B2 B4 B3 → 1 = C  数字最先，战绩跟上，装扮落在最后没有人接
 */

const B2 = 'L04-05.b2-linglan-count'
const B3 = 'L04-05.b3-yeyu-costume'
const B4 = 'L04-05.b4-yuanshan-logs'

const relations: KeyRelation[] = [
  // 先看见那身衣服，再看见那串战绩——两种"我存在过"
  { id: 'L04-05.rel.costume-before-logs', kind: 'precedes', subject: B3, object: B4 },
  // 战绩说完了，那行数字才不是抱怨，而是同一个问题的第三种答案
  { id: 'L04-05.rel.logs-before-count', kind: 'precedes', subject: B4, object: B2 },
  // 顺序的最后一项：数字放在最后
  { id: 'L04-05.rel.costume-before-count', kind: 'precedes', subject: B3, object: B2 },
  // 那身衣服是从 RP 店、从成长期被拖进这个频道的
  { id: 'L04-05.rel.costume-carried-across', kind: 'displacedInto', subject: B3, tier: 'high' },
]

const ALL = [
  'L04-05.rel.costume-before-logs',
  'L04-05.rel.logs-before-count',
  'L04-05.rel.costume-before-count',
  'L04-05.rel.costume-carried-across',
]

const endings: LetterEnding[] = [
  {
    id: 'L04-05.E.s',
    rating: 'S',
    title: '频道一直开着',
    body:
      '最上面那句话没有动过：那个跨服频道里，我几乎不说话，知道它开着就够了。\n\n' +
      '下面是夜语从别处带来的一句话——这套幻化我搭了一整晚，穿上它，我连走路的样子都变了。他说的是一个把自己穿成另一个人的人。\n\n' +
      '再下面是远山的：那年首杀是我们的，榜单上一排全金。他说的是另一个时期的自己，那时候他相信只要赢下来，就不会有人离开。\n\n' +
      '最后是铃兰的那行字：一屏消息九百多条，没有一条是找我的。\n\n' +
      '三句话排在一起，说的其实是同一件事——他们都曾用某种方式证明自己值得被留下来。而最上面那句话说的恰好相反：不用证明，开着就够了。\n\n' +
      '那天晚上频道里一个人也没有说话。铃兰把它挂在旁边，去做别的事。回来的时候，有一个人的名字还亮着。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'linglan', delta: 2, reason: '她把那行数字和别人的两句话放在一起，第一次觉得它不是控诉' },
      { characterId: 'yeyu', delta: 2, reason: '他承认了那身衣服对他的用处，而不是把它当成消遣' },
      { characterId: 'yuanshan', delta: 1, reason: '他把那段战绩拿出来的时候，用的是怀念的口气' },
    ],
  },
  {
    id: 'L04-05.E.a',
    rating: 'A',
    title: '先活过，再数数字',
    body:
      '夜语先讲了他那身衣服，然后铃兰数了她的数字，远山那句战绩落在最后。\n\n' +
      '顺序大体是对的，只是远山那句话来晚了——等它出口，频道里已经没有人在听"首杀"是什么意思了。他自己也笑了一下，说那会儿真好啊。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'linglan', delta: 1, reason: '她数数字的时候，旁边有人在说自己怎么活' },
      { characterId: 'yeyu', delta: 1, reason: '他把那身衣服的事说了出来' },
      { characterId: 'yuanshan', delta: 0, reason: '他的战绩成了没人接得住的一句感慨' },
    ],
  },
  {
    id: 'L04-05.E.b',
    rating: 'B',
    title: '各说各的存在',
    body:
      '远山先说首杀和记录，夜语接着说那身衣服，铃兰的数字排在最后。\n\n' +
      '三句话都是真的，也都没有落到别人身上。频道里安静了一会儿，然后有人发了一个表情。夜语没有接。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他把最风光的那件事拿出来，没有人在意' },
      { characterId: 'yeyu', delta: 0, reason: '他说了那身衣服，随后自己收回了话题' },
      { characterId: 'linglan', delta: -1, reason: '她的数字排在最后，像一句抱怨' },
    ],
  },
  {
    id: 'L04-05.E.c',
    rating: 'C',
    title: '安静得像一间空屋',
    body:
      '铃兰的数字最先被说出来，其余的话各归各位。\n\n' +
      '那天晚上频道里一个人都没有说话。她把频道挂在旁边去做别的事，回来的时候，发现自己的名字还亮着——只有她一个。\n\n' +
      '最上面那句话还是那句话：知道它开着就够了。这一次它读起来，像一句她没能说出口的辩解。',
    requires: ALL,
    minSatisfied: 1,
    priority: 40,
    tendency: [
      { characterId: 'linglan', delta: -2, reason: '她把数字说了出来，然后发现自己是在跟自己说话' },
      { characterId: 'yeyu', delta: -1, reason: '他那句话成了没有人需要的安慰' },
      { characterId: 'yuanshan', delta: -1, reason: '他的战绩没有人记得' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=1 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L04-05.E.fallback',
  rating: 'C',
  title: '挂到天亮',
  body: '那天晚上频道一直挂着，谁也没有说话。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L04_05: Letter = {
  id: 'L04-05',
  chapterId: 'ch04',
  title: '挂机也是一种陪伴',
  anchor: { phase: 'mature', space: 'linkshell' },
  preamble:
    '倾听者：\n\n' +
    '今天频道里一个人都没有。不是没人上线——名字都亮着，没有一个人说话。\n\n' +
    '我把频道挂在旁边，去做别的事。回来的时候，发现有一个人一直没下线。他没有说话，也没有走。\n\n' +
    '我忽然觉得，这样也算是一种陪着我。我以前不这么想。',
  signature: '——铃兰',
  blocks: [
    { id: 'L04-05.b1-yeyu-quiet', statementId: 'yeyu.growth.03', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'linglan.mature.01b', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yeyu.growth.02', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yuanshan.growth.01d', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L04-04'] },
}
