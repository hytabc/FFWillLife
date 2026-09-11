import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L03-01「好友列表全灰了」—— 第三章第一封。
 * 空间锚点 city / 阶段 成熟期 / 出场 远山·铁壁（见 STORY-BIBLE §5.3）。
 *
 * 采用**分级判定（band grading）**：五条互相独立的正向关系，按命中条数分档。
 *
 * 本章首次允许 `transform`：B5 是远山豆芽期的一句「总有一天我要站在零式之巅」，
 * 它和这封信同一个空间（city）、却隔着两个阶段——被拖进今夜，就是"同一句话，
 * 换个年纪说，含义完全质变"。所以 `displacedInto(B5, 'transform')` 既是判定条件，
 * 也是这封信的主题：他到底能不能不把当年的自己当成笑话。
 *
 * 因果逻辑：那晚在场的其实是三句话——铁壁的两句、湖边的一句，
 * 以及被他自己翻出来的、很多年以前的那一句。谁先被说出口，决定了这一夜的温度。
 */

const B2 = 'L03-01.b2-tiebi-afk-seat'
const B3 = 'L03-01.b3-yuanshan-lakeside'
const B4 = 'L03-01.b4-tiebi-our-house'
const B5 = 'L03-01.b5-yuanshan-someday'

/** 五条正向关系：满足越多，这一夜越留得住人。 */
const relations: KeyRelation[] = [
  // 当年那句话被从豆芽期拖进了今夜的成熟期：跨阶段同空间 → transform
  { id: 'L03-01.rel.someday-comes-back', kind: 'displacedInto', subject: B5, tier: 'transform' },
  // 「房子也是大家的」本来是在那间房子里说的，不是在主城的夜里
  { id: 'L03-01.rel.house-said-inside', kind: 'displacedInto', subject: B4, tier: 'microshift' },
  // 湖边那句话也是：它属于一个没有人催他开本的下午，不属于今晚
  { id: 'L03-01.rel.lakeside-elsewhere', kind: 'displacedInto', subject: B3, tier: 'microshift' },
  // 先有人告诉他「房子是大家的」，他才敢把当年那句翻出来
  { id: 'L03-01.rel.house-before-someday', kind: 'precedes', subject: B4, object: B5 },
  // 先有人告诉他「位置给你留着」，他才敢把当年那句翻出来
  { id: 'L03-01.rel.seat-before-someday', kind: 'precedes', subject: B2, object: B5 },
]

const ALL = [
  'L03-01.rel.someday-comes-back',
  'L03-01.rel.house-said-inside',
  'L03-01.rel.lakeside-elsewhere',
  'L03-01.rel.house-before-someday',
  'L03-01.rel.seat-before-someday',
]

const endings: LetterEnding[] = [
  {
    id: 'L03-01.E.s',
    rating: 'S',
    title: '有人先说了「位置给你留着」',
    body:
      '铁壁先把那句话说了出来：「部队房重新装修过了，AFK 的人也给留着位置。」\n\n' +
      '然后才轮到别的。湖边那个没有人催他开本的下午，房子是谁的房子，最后才是很多年以前他自己说的那句「总有一天我要站在零式之巅」。\n\n' +
      '那句话被从豆芽期拖到今夜，读起来完全不是当年那个意思了——当年是一个什么都不懂的人在大声许愿，今夜是一个什么都失去了的人在确认：那个人还在，还认得路。\n\n' +
      '他没有关掉名单。他去把最后几个还亮着的名字一个个点开，挨个发了一句：「我回来了。」\n\n' +
      '有人回得很快。有人到现在也没回。但那天晚上他睡着了。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yuanshan', delta: 2, reason: '他把当年那句大话放回了它该在的位置，没有把它当成笑话' },
      { characterId: 'tiebi', delta: 2, reason: '他先说了「位置给你留着」，远山才敢回来' },
    ],
  },
  {
    id: 'L03-01.E.a',
    rating: 'A',
    title: '那句话被说出口了，但没人接住',
    body:
      '话都说了，只是顺序差了一点。当年那句许愿被翻出来的时候，铁壁还没来得及说「位置给你留着」——于是那句大话悬在半空里，像一句自嘲。\n\n' +
      '铁壁愣了一下，还是把话接了下去。两个人在主城的夜里站了很久，谁都没有提房子的事。\n\n' +
      '他回家以后又把名单翻了一遍。这次他没有关掉它。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 1, reason: '他说出了当年那句，只是说得早了一点' },
      { characterId: 'tiebi', delta: 1, reason: '他接住了，只是慢了一拍' },
    ],
  },
  {
    id: 'L03-01.E.b',
    rating: 'B',
    title: '两个人只是站着说了会儿话',
    body:
      '话题没有落到房子上，也没有落到很多年以前。两个人站在主城的路口，说了一些天气一样的东西：最近怎么样，还有在玩吗，哦，那挺好的。\n\n' +
      '分开的时候铁壁说「有空来找我」。远山说「好」。\n\n' +
      '两个人都知道这句话多半不会兑现，但也都知道对方不是在客套。\n\n' +
      '那天晚上他还是把名单翻到了底。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他什么都说了一点，什么也都没说' },
      { characterId: 'tiebi', delta: 0, reason: '他留了一句「有空来找我」，但没有把位置说出来' },
    ],
  },
  {
    id: 'L03-01.E.c',
    rating: 'C',
    title: '最先出口的是当年那句大话',
    body:
      '「总有一天我要站在零式之巅。」\n\n' +
      '这句话被摆在最前面。今夜听来，它不像许愿，像一份账单——一张写满了、却没有人来收的账单。\n\n' +
      '铁壁想说什么，看了看他的脸，又把话咽了回去。他们很快散了。\n\n' +
      '回家的路上他一直在想：当年那个说这句话的人，凭什么那么确定自己会有以后。\n\n' +
      '他把名单关掉了。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'yuanshan', delta: -2, reason: '当年那句许愿最先出口，被今夜读成了自嘲' },
      { characterId: 'tiebi', delta: -1, reason: '他想说的话被咽了回去，位置最终没有说出口' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L03-01.E.fallback',
  rating: 'C',
  title: '没有排出来的那一夜',
  body: '那天晚上他们说的话最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L03_01: Letter = {
  id: 'L03-01',
  chapterId: 'ch03',
  title: '好友列表全灰了',
  anchor: { phase: 'mature', space: 'city' },
  preamble:
    '倾听者：\n\n' +
    '回来的第一个晚上，我把名单从最上面翻到最下面，翻了两遍。亮着的名字只剩下几个，我一个都不认识。\n\n' +
    '房子也没了。那个我们一起搬过家具的地方，现在住着别人。\n\n' +
    '那天晚上站在路灯底下的只有两个人。我把我们说过的话抄在这里，也把一句很多年以前的话抄在了最后——\n\n' +
    '那句话我一直没舍得删。你可以试着把它拖到今夜来读一次。',
  signature: '——远山',
  blocks: [
    { id: 'L03-01.b1-yuanshan-gray-list', statementId: 'yuanshan.mature.01', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'tiebi.mature.02', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yuanshan.mature.03', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'tiebi.mature.01', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'yuanshan.sprout.01', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  // 承接第二章末（H02 是隐藏信，主线链条走 L02-05）
  unlock: { kind: 'complete', letterIds: ['L02-05'] },
}
