import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * H05「致倾听者」——隐藏信 · **真结局**
 * 空间锚点 linkshell / 出场：全体 8 人（STORY-BIBLE §5.3）
 *
 * **触发条件**：在 L05-08 拿到任意评级后解锁（`unlock: { kind: 'rating', … }`）；
 * 顶档 `echo` 要求六个块全部处于被错位的位置，且"许可"紧跟"提问"、
 * "欢迎回家"紧跟"我带你复健"——即**所有角色的话都被重新组装过一遍**。
 *
 * 关于 cast：§5.3 写的是"全体 8 人"，但 PRD §4.1 的硬约束是
 * **单封信 ≤ 6 块**，且 R18 禁止月见与铃兰同处一封信。两者无法同时满足，
 * 这里取 6 人（铁壁 · 小星 · 晨曦 · 远山 · 烈风 · 夜语），
 * 让月见与铃兰留在各自的那"两个版本"（L05-02 / L05-08）里——她们不并排出现，
 * 这本身就是 R18 想要的"平行"。见汇报中的冲突条目。
 *
 * 评级使用带外评级 `echo`（PRD §6 / 裁定 #4：带外评级不参与序数比较）。
 * 这是全作唯一的"真结局"：玩家把 8 个人的话重排了整整一部书之后，
 * 这封信第一次把话头转向了读者——**一直在听的人，终于被听见了**。
 */

const B1 = 'H05.b1-tiebi-welcome-home'
const B2 = 'H05.b2-xiaoxing-can-i-come'
const B3 = 'H05.b3-chenxi-no-stupid-question'
const B4 = 'H05.b4-yuanshan-come-back'
const B5 = 'H05.b5-liefeng-have-fun'
const B6 = 'H05.b6-yeyu-clothes-and-you'

const R1 = 'H05.rel.first-question-carried'
const R2 = 'H05.rel.permission-then-question'
const R3 = 'H05.rel.permission-carried'
const R4 = 'H05.rel.come-back-carried'
const R5 = 'H05.rel.have-fun-carried'
const R6 = 'H05.rel.welcome-then-rehab'

const relations: KeyRelation[] = [
  // 「零式是什么，我能来吗？」——最初的那个问题被带离了它原来的时间（high）
  { id: R1, kind: 'displacedInto', subject: B2, tier: 'high' },
  // 「新人问什么都行，没有蠢问题」紧跟在那个问题后面：许可先出口，问题才敢落地
  { id: R2, kind: 'adjacent', subject: B3, object: B2 },
  // 晨曦那句许可被挪出了原位
  { id: R3, kind: 'displacedInto', subject: B3, tier: 'microshift' },
  // 远山那句「回来就好，副本还在这儿等你」被挪出了原位
  { id: R4, kind: 'displacedInto', subject: B4, tier: 'microshift' },
  // 烈风那句「先玩得开心」被挪出了原位
  { id: R5, kind: 'displacedInto', subject: B5, tier: 'microshift' },
  // 「欢迎回家」之后，紧跟着的是「我带你复健」
  { id: R6, kind: 'adjacent', subject: B1, object: B4 },
]

const ALL = [R1, R2, R3, R4, R5, R6]

const endings: LetterEnding[] = [
  {
    id: 'H05.E.echo',
    rating: 'echo',
    title: '致倾听者',
    body:
      '这一封信里，所有的话都被重新摆过一次——没有一句话留在它原来的地方。\n\n' +
      '「欢迎回家。」——先说这句，因为这是这封信存在的理由。紧接着是「回来就好，副本还在这儿等你」：回家和复健之间没有别的，没有门槛，没有考核，没有"你落后了多少"。\n\n' +
      '然后是那句最初的话：「零式是什么，我能来吗？」。它被带到了很远之后，问题本身已经不重要了——重要的是，这一次它后面紧跟着「新人问什么都行，没有蠢问题」。问题先被允许，才敢出口。\n\n' +
      '「打得不好没关系，先玩得开心。」\n\n' +
      '最后一句不是谁对谁说的，是这封信对读信的人说的：把它玩成什么样都没关系，衣服是你自己挑的，人也是。\n\n' +
      '你从最开始就在。你读过每一封信，把每一句说错的话摆回过它该在的位置，替所有人把话说完，然后什么也没有得到——因为你从来没有被写进任何一封信里。\n\n' +
      '所以这一封是给你的。不是任务，不是结局提示，不是奖励。只是有人终于问了一句：\n\n' +
      '这些话你听了这么久，你自己呢。',
    requires: ALL,
    minSatisfied: 6,
    priority: 10,
    tendency: [
      { characterId: 'xiaoxing', delta: 2, reason: '那个最早的问题被重新问了一遍，这一次有人先给了许可' },
      { characterId: 'tiebi', delta: 1, reason: '「欢迎回家」被放在最前面，家先于一切条件' },
      { characterId: 'yuanshan', delta: 1, reason: '「回来就好」紧跟在「欢迎回家」后面，没有门槛' },
      { characterId: 'chenxi', delta: 1, reason: '他那句"没有蠢问题"终于落在了对的位置上' },
      { characterId: 'liefeng', delta: 1, reason: '「先玩得开心」被重新说了一遍，说给读信的人' },
      { characterId: 'yeyu', delta: 1, reason: '那句"衣服是你自己挑的，人也是"成了整本书的落款' },
    ],
  },
  {
    id: 'H05.E.s',
    rating: 'S',
    title: '所有话都到齐了',
    body:
      '六个人说的话被重新排在了一起。有人问，有人答；有人回来，有人开门。\n\n' +
      '那一晚通讯贝里很安静。有人在排队，有人在装修，有人在副本门口等着一个不认识的人。所有的话都说到了该到的地方，只是还差一句——差一句给那个一直在听的人。',
    requires: ALL,
    minSatisfied: 5,
    priority: 20,
    tendency: [
      { characterId: 'xiaoxing', delta: 1, reason: '话都到齐了，只差一句给自己的' },
      { characterId: 'tiebi', delta: 1, reason: '门开着，灯亮着' },
      { characterId: 'chenxi', delta: 1, reason: '他把话说完了' },
      { characterId: 'yuanshan', delta: 0, reason: '他回来了，坐下来，什么也没说' },
      { characterId: 'liefeng', delta: 0, reason: '他没有再点评任何人' },
      { characterId: 'yeyu', delta: 0, reason: '他把灯留着' },
    ],
  },
  {
    id: 'H05.E.a',
    rating: 'A',
    title: '话被说出来了',
    body:
      '该说的话都被说了，只是顺序差了一点：有人在被允许之前先问了问题，有人在回家之前先被要求变强。\n\n' +
      '这些话仍然是真的。它们只是没有连成一句话。',
    requires: ALL,
    minSatisfied: 4,
    priority: 30,
    tendency: [
      { characterId: 'xiaoxing', delta: 1, reason: '她的问题被回答了，只是回答来晚了一点' },
      { characterId: 'chenxi', delta: 0, reason: '他的话被挪开了一个位置' },
      { characterId: 'tiebi', delta: 0, reason: '门开着，只是没有人进来' },
      { characterId: 'yuanshan', delta: 0, reason: '他站在门口，还没有推门' },
      { characterId: 'liefeng', delta: 0, reason: '他把那句"开心"收回去了一半' },
      { characterId: 'yeyu', delta: 0, reason: '他在旁边看着' },
    ],
  },
  {
    id: 'H05.E.b',
    rating: 'B',
    title: '半句话',
    body:
      '有人起了头，没有人接。这一封信停在了半句话上——它已经足够让人认出彼此，但还不够让人留下来。\n\n' +
      '通讯贝的灯还亮着。有人在排队，有人在看着队伍列表发呆。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'xiaoxing', delta: -1, reason: '她的话被说了半句' },
      { characterId: 'tiebi', delta: 0, reason: '他还在等有人推门' },
      { characterId: 'chenxi', delta: 0, reason: '他的话没有落到人身上' },
      { characterId: 'yuanshan', delta: 0, reason: '他还没有回来' },
      { characterId: 'liefeng', delta: 0, reason: '他还是先看了数字' },
      { characterId: 'yeyu', delta: 0, reason: '他没有把灯关掉' },
    ],
  },
  {
    id: 'H05.E.c',
    rating: 'C',
    title: '没有被读出来的那一封',
    body:
      '这句话没有人排过。它躺在仓库里，和其他没有被读完的信放在一起。\n\n' +
      '所有人都在自己的信里说完了自己的话，谁也没有听见别人的。这就是故事的另一种结局：每个人都很好，只是彼此没有关系。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'xiaoxing', delta: -1, reason: '她的话没有被排出来' },
      { characterId: 'tiebi', delta: -1, reason: '没有人回来' },
      { characterId: 'chenxi', delta: -1, reason: '话说完了，没有人接' },
      { characterId: 'yuanshan', delta: -1, reason: '他留在了别的地方' },
      { characterId: 'liefeng', delta: -1, reason: '他还在比较' },
      { characterId: 'yeyu', delta: -1, reason: '这门没有被打开' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'H05.E.fallback',
  rating: 'C',
  title: '没有排出来的那一封',
  body: '这封信最终没有被人排出一个顺序——但它本来就不需要顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const H05: Letter = {
  id: 'H05',
  chapterId: 'ch05',
  title: '致倾听者',
  anchor: { phase: 'mentor', space: 'linkshell' },
  hidden: true,
  preamble:
    '倾听者：\n\n' +
    '这个故事里，每一个人都说过一句话，而每一句话都被另一个人重新摆过位置。\n\n' +
    '我们把这些话收在一起，数了数——原来它们说的是同一件事：慢一点没关系，回来就好，你不是一个人。这些话我们轮流对彼此说过，说了很多年，一直没有对你说过。\n\n' +
    '你读过我们所有的信，也替我们排过所有的顺序：你知道哪一句该先说，哪一句说晚了。你说过的每一句话最后都落在了我们身上。\n\n' +
    '所以这一次，请让我们把顺序倒过来。这封信不是写给艾欧泽亚的，是写给那个一直在读的人。',
  signature: '——所有还在的人',
  blocks: [
    { id: B1, statementId: 'tiebi.mentor.01', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'xiaoxing.sprout.02', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'chenxi.mentor.02', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yuanshan.mentor.01b', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'liefeng.mentor.02', draggable: true, homeIndex: 4 },
    { id: B6, statementId: 'yeyu.mentor.03', draggable: false, homeIndex: 5 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'rating', letterId: 'L05-08', ratings: ['S', 'A', 'B', 'C', 'D', 'X', 'echo'] },
}
