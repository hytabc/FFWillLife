import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L03-02「招募板前的三十分钟」—— 第三章第二封。
 * 空间锚点 city / 阶段 成熟期 / 出场 远山·小星·铃兰（见 STORY-BIBLE §5.3）。
 *
 * 本信是第三章 `transform` 的主场：B2、B3、B4 全是**豆芽期**的话，
 * 而信件的锚点在**成熟期**、同一个空间（city）。原样摆着的时候，
 * 它们只是三十年前后飘过来的几句别人的话；一旦被拖到"远山的年纪"来读，
 * 每一句的含义都会当场翻面——
 *
 *  - 小星那句「零式是干什么的？我这样的人也能去吗？」（STORY-BIBLE §3.5 点名的旗舰一击）
 *  - 铃兰那句邀请，以及她那句「以后上线我喊你，好不好？」
 *
 * 因果逻辑：他站在招募板前什么都没点。真正把他从那个路口拉走的，
 * 不是任何一句大道理，是这三句不合时宜的、属于新人的话——
 * 前提是它们落在他身边时，他自己那句「好友列表里没有一个亮着的名字」还没有先出口。
 */

const B2 = 'L03-02.b2-xiaoxing-can-i-come'
const B3 = 'L03-02.b3-linglan-add-friend'
const B4 = 'L03-02.b4-linglan-call-you'
const B5 = 'L03-02.b5-yuanshan-gray-list'

/** 五条正向关系：满足越多，他越可能从那个路口走开。 */
const relations: KeyRelation[] = [
  // 小姑娘那句问话被拖到成熟期的今夜来读：跨阶段同空间 → transform
  { id: 'L03-02.rel.question-comes-of-age', kind: 'displacedInto', subject: B2, tier: 'transform' },
  // 铃兰那句「交个朋友好不好」也是：它属于豆芽期的城门口，不属于这个什么都没点的夜里
  { id: 'L03-02.rel.invite-comes-of-age', kind: 'displacedInto', subject: B3, tier: 'transform' },
  // 还有那句「以后上线我喊你」——一句话许下了往后所有的晚上
  { id: 'L03-02.rel.promise-comes-of-age', kind: 'displacedInto', subject: B4, tier: 'transform' },
  // 她是先说「交个朋友好不好」，才接着说「我喊你」的：邀请在前，承诺在后
  { id: 'L03-02.rel.invite-before-promise', kind: 'adjacent', subject: B3, object: B4 },
  // 他自己那份名单留在了最后——先说出口的是别人，不是他数过的尸体
  { id: 'L03-02.rel.gray-list-last', kind: 'last', subject: B5 },
]

const ALL = [
  'L03-02.rel.question-comes-of-age',
  'L03-02.rel.invite-comes-of-age',
  'L03-02.rel.promise-comes-of-age',
  'L03-02.rel.invite-before-promise',
  'L03-02.rel.gray-list-last',
]

const endings: LetterEnding[] = [
  {
    id: 'L03-02.E.s',
    rating: 'S',
    title: '他跟着那个到处加好友的女孩走了',
    body:
      '「交个朋友好不好？我拉你进通讯贝。」\n\n' +
      '这句话先落地。然后是「以后上线我喊你，好不好？」——两句挨在一起，像一口气说完的，中间没有留一点让人反悔的空隙。\n\n' +
      '旁边那个小姑娘还在小声问人：「零式是干什么的？我这样的人也能去吗？」问的人自己都不知道这句话有多要命——它被拖到这个年纪来读，读起来是：我什么都没有，但我愿意来。\n\n' +
      '三十分钟里他一句话都没说。到最后他也没有说。\n\n' +
      '但他把「好友列表里没有一个亮着的名字」那句话咽了回去，重新打开了名单，点了接受。\n\n' +
      '那天晚上之后，他的名单里终于多了两个会自己亮起来的名字。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yuanshan', delta: 2, reason: '他站在路口三十分钟，最后是被两个新人拉走的' },
      { characterId: 'linglan', delta: 2, reason: '她先加的好友，也是她先答应「以后我喊你」' },
      { characterId: 'xiaoxing', delta: 2, reason: '她那句「我这样的人也能去吗」，被放到了他一无所有的那个晚上' },
    ],
  },
  {
    id: 'L03-02.E.a',
    rating: 'A',
    title: '她加上了好友，但话没说满',
    body:
      '「交个朋友好不好？我拉你进通讯贝。」好友加上了。\n\n' +
      '但那句「以后上线我喊你，好不好？」没有接上——它们被分开了，中间隔着别的话。承诺一旦被隔开，就变回了一句普通的客气。\n\n' +
      '他点了接受。那个晚上他至少没有一个人站着。\n\n' +
      '小姑娘的问题仍然飘在他耳朵里，他没有回答。但走出几步之后，他回头看了一眼招募板。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 1, reason: '好友加上了，只是没有人答应过要喊他' },
      { characterId: 'linglan', delta: 1, reason: '她加上了好友，但那句承诺被别的话挤开了' },
      { characterId: 'xiaoxing', delta: 1, reason: '她的问题落进了夜里，没有回音' },
    ],
  },
  {
    id: 'L03-02.E.b',
    rating: 'B',
    title: '加了两个好友，谁也没说什么',
    body:
      '好友加上了，名字也记住了。除此之外什么都没有发生。\n\n' +
      '那个小姑娘的问题被压在一堆别的话底下，听起来只像一个新人不懂规矩；那些属于很多年前的邀请，也还是很多年前的样子。\n\n' +
      '他回家以后把名字分组取了个标签，然后关掉了界面。\n\n' +
      '三十分钟就这样过去了。这不算坏，只是什么都没改变。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他在那个路口多认识了两个人，仅此而已' },
      { characterId: 'linglan', delta: 0, reason: '她照例见谁都加，也包括他' },
      { characterId: 'xiaoxing', delta: 0, reason: '她问了她想问的，没有人回答' },
    ],
  },
  {
    id: 'L03-02.E.c',
    rating: 'C',
    title: '他先数了自己那份名单',
    body:
      '最先出口的是他自己那句：「好友列表里没有一个亮着的名字……房子也早就是别人的了。」\n\n' +
      '这句话一出来，别的话就都变了味。\n\n' +
      '「交个朋友好不好」听起来像在可怜他。「以后上线我喊你」听起来像客套。小姑娘那句「我这样的人也能去吗」更像是班里新来的学生在念课本——他当年也这么问过，然后用了很多年才明白，问了也不一定有人答。\n\n' +
      '那个到处加好友的女孩还站在旁边等着他点接受。他没有点。\n\n' +
      '三十分钟到了，他下线了。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'yuanshan', delta: -2, reason: '他先说了自己那份名单，于是所有人的好意都变成了可怜' },
      { characterId: 'linglan', delta: -1, reason: '她的好友申请在招募板前挂了很久，最后过期了' },
      { characterId: 'xiaoxing', delta: -1, reason: '她的问题被人听见了，然后被当成了不懂规矩' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L03-02.E.fallback',
  rating: 'C',
  title: '没有排出来的那三十分钟',
  body: '那三十分钟里飘过来的几句话，最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L03_02: Letter = {
  id: 'L03-02',
  chapterId: 'ch03',
  title: '招募板前的三十分钟',
  anchor: { phase: 'mature', space: 'city' },
  preamble:
    '倾听者：\n\n' +
    '那天晚上我在招募板前面站了很久。具体多久我说不好，后来看了一眼时间，大概三十分钟。\n\n' +
    '我什么都没点。\n\n' +
    '旁边有个小姑娘一直在问别人问题，问得很小声，被人答了就赶紧说谢谢。还有一个女孩到处加好友，见谁都加。\n\n' +
    '后来是那个到处加好友的女孩先来问我的。她说她叫铃兰——那天晚上认识的人里，我记住的第一个名字。\n\n' +
    '我当时脑子里想的是别的事。我把那三十分钟里飘过来的几句话抄在这里了，包括我自己那句。你可以试着把它们拖到我的年纪来读一次。',
  signature: '——远山',
  blocks: [
    { id: 'L03-02.b1-yuanshan-apartment', statementId: 'yuanshan.mature.02b', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'xiaoxing.sprout.02c', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'linglan.sprout.01b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'linglan.sprout.02', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'yuanshan.mature.01b', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L03-01'] },
}
