import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-02「蓝量见底之前」
 * 空间锚点 dungeon / 出场 月见 · 晨曦 · 小星（STORY-BIBLE §5.3）
 *   ＋烈风（PRD §5.5「隔空和解」要求把**烈风导师期**的语句拖进**月见成熟期**的信件，
 *     而 §5.3 的 cast 表里没有烈风——以 PRD 的机制要求为准，见汇报中的冲突条目）。
 *
 * 结构：五档分级判定，S 档必须同时满足共存关系（最难，但可达）。
 * **共存关系**：`L05-02.rel.liefeng-mentor-into-yuejian-mature`
 *   —— 烈风导师期那句「你这个logs比我当年好看多了」被拖进月见的成熟期，
 *     它原本就是对"一个快撑不住的奶妈"说的，跨过去正好落在蓝量见底的这一夜。
 *
 * 这一封与 L05-08「倾听本身就是陪伴」是**同一封信的两个版本**（R18 的"平行"关系）：
 * 月见与铃兰永远不同处一封信，她们的和解只能隔空发生。
 */

const B1 = 'L05-02.b1-yuejian-carry'
const B2 = 'L05-02.b2-yuejian-ask'
const B3 = 'L05-02.b3-liefeng-logs'
const B4 = 'L05-02.b4-chenxi-firstweek'
const B5 = 'L05-02.b5-xiaoxing-again'

const R1 = 'L05-02.rel.liefeng-mentor-into-yuejian-mature'
const R2 = 'L05-02.rel.yuejian-asks-first'
const R3 = 'L05-02.rel.xiaoxing-says-again'
const R4 = 'L05-02.rel.liefeng-recognizes-her'
const R5 = 'L05-02.rel.xiaoxing-after-her'

const relations: KeyRelation[] = [
  // ★ 共存关系：烈风导师期的话，落进了月见成熟期的那一夜（transform）
  { id: R1, kind: 'displacedInto', subject: B3, tier: 'transform' },
  // 她把「我也需要有人问一句累不累」挪出了原位——先说的人是她自己
  { id: R2, kind: 'displacedInto', subject: B2, tier: 'microshift' },
  // 小星把「再渡一次劫」重新摆了一遍
  { id: R3, kind: 'displacedInto', subject: B5, tier: 'reorder' },
  // 先认得出她的累，她才敢把话说出口
  { id: R4, kind: 'precedes', subject: B3, object: B2 },
  // 她把话说完了，小星才开口说下一把还打
  { id: R5, kind: 'precedes', subject: B5, object: B2 },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-02.E.s',
    rating: 'S',
    title: '隔空和解',
    body:
      '烈风那句话落进来的时候，月见愣住了——那不是一个导师对新人说的，那是一个打过很久的人，对着一个快撑不住的治疗说的。\n\n' +
      '「你这个logs比我当年好看多了。」\n\n' +
      '她先认出了这句话里的分量，才敢承认自己也累；她先把自己的累说出口，小星才说下一把还打。那天晚上没有人换人，没有人硬撑，副本在第四次过了。\n\n' +
      '很久以后烈风才知道，那句他以为说给新人听的话，曾经替一个成熟期的治疗挡下了一次退队。他和她始终没有在同一天上线，但这封信的两端，两个人都松了手。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yuejian', delta: 2, reason: '她终于先说了自己累，而不是先道歉' },
      { characterId: 'liefeng', delta: 2, reason: '他那句"比我当年好看"，跨了时空落到了一个需要它的人身上' },
      { characterId: 'xiaoxing', delta: 1, reason: '她听懂了"再渡一次劫"不是给队友的，是给月见的' },
    ],
  },
  {
    id: 'L05-02.E.a',
    rating: 'A',
    title: '有人说了一句累不累',
    body:
      '那句话还是落进来了，只是落在别的地方——月见没有先认出它，而是被它撞了一下。她后来把那句话抄在纸上读了好几遍，才明白有人在很久以前就替她说过了。\n\n' +
      '那天晚上她到底还是把话说出了口，只是慢了一拍。小星没听见，晨曦听见了，什么也没说，把下个cd的排表往后挪了一天。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'yuejian', delta: 1, reason: '她把话说出了口，只是慢了一拍' },
      { characterId: 'liefeng', delta: 1, reason: '那句话落对了地方，只是没能被立刻认出来' },
      { characterId: 'chenxi', delta: 1, reason: '他把排表往后挪了一天，什么也没问' },
    ],
  },
  {
    id: 'L05-02.E.b',
    rating: 'B',
    title: '她先说了一半',
    body:
      '她把自己那句话摆在了前面，可是没有人接。小星在打字，晨曦在算蓝量，谁也没抬头。\n\n' +
      '月见等了一会儿，把那句「我也需要有人问一句累不累」删掉了，重新打了「没事，我蓝还够」。那天晚上他们还是过了本，只是她下线之后，在城里坐了很久。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'yuejian', delta: -1, reason: '她把那句真话删掉，换成了"我蓝还够"' },
      { characterId: 'xiaoxing', delta: 0, reason: '她还在打字，没接住那句话' },
      { characterId: 'chenxi', delta: 0, reason: '他在算蓝量，没算到人' },
    ],
  },
  {
    id: 'L05-02.E.c',
    rating: 'C',
    title: '蓝量见底之前',
    body:
      '那天所有人的注意力都在机制上。月见的蓝条在第三次灭团之后见底了，她把最后一个复活交了出去，然后在语音里说了一句「我出去一下」。\n\n' +
      '没有人问她去了哪里。她其实哪儿也没去，就在门口站着，等自己不想哭了再进去。',
    requires: ALL,
    minSatisfied: 1,
    priority: 40,
    tendency: [
      { characterId: 'yuejian', delta: -2, reason: '她把最后一个复活交了出去，没有给自己留' },
      { characterId: 'liefeng', delta: 0, reason: '那句话还在很久以前，没能赶过来' },
      { characterId: 'xiaoxing', delta: -1, reason: '她以为再渡一次劫就够了' },
    ],
  },
  {
    id: 'L05-02.E.d',
    rating: 'D',
    title: '没有人抬头',
    body:
      '这是一封没有被人读完的信。月见写下它的时候，队里正在为进度吵架，没有人注意到她已经连续三个晚上最后一个下线。\n\n' +
      '她把信收进了仓库，第二天照常上线、照常进本、照常把复活交给别人。有些消耗是不会被看见的，直到有一天她不再上线。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'yuejian', delta: -2, reason: '她写了这封信，然后收进了仓库' },
      { characterId: 'chenxi', delta: -1, reason: '他在吵架里，没看见最后一个下线的人' },
      { characterId: 'xiaoxing', delta: -1, reason: '她当时只想着怎么过本' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-02.E.fallback',
  rating: 'D',
  title: '没有排出来的那一封',
  body: '这一夜的话最终没有排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_02: Letter = {
  id: 'L05-02',
  chapterId: 'ch05',
  title: '蓝量见底之前',
  anchor: { phase: 'mature', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '今晚我把最后一个复活交出去的时候，手是抖的。\n\n' +
    '我知道有人会说我小题大做——治疗这个位置，本来就是要先看别人的血条。我做了很多年，做得很好，好到没有人再问我还剩多少。\n\n' +
    '我记得很久以前有人对我说过一句话，说的是他自己当年。那时我以为那是在夸我。现在我才明白，那是他在告诉我：撑不住的时候可以不撑。\n\n' +
    '这封信我想寄给所有还在替别人数血条的人。如果顺序换一下——如果我先把那句话说出来，今晚会不会不一样。',
  signature: '——月见',
  blocks: [
    { id: B1, statementId: 'yuejian.mature.01', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yuejian.mature.03', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'liefeng.mentor.01', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'chenxi.mature.01', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'xiaoxing.mature.01', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L05-01'] },
}
