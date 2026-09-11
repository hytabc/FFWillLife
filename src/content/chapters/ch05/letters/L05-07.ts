import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-07「你的RP角色也是你」
 * 空间锚点 rp-venue / 出场 夜语 · 铃兰 · 小星（STORY-BIBLE §5.3）。
 *
 * **共存关系（PRD §5.5「时间之外」）**：`L05-07.rel.swap-mentor-lines`
 *   —— 夜语与铃兰的**导师期语句互换**。这条关系 id 覆盖的是"互换"里
 *   铃兰那一侧（「陪着一个人，本身就是在听」被拖进这封信，Δt = 1、Δs = 1 → `high`）；
 *   夜语那一侧由 `L05-07.rel.yeyu-mentor-into-mature`（transform）承担。
 *   顶档要求两侧同时成立——单边的错位不是互换。
 *
 * 小星在这封信里是夜语的镜子：小星在游戏里长成了另一个人，而那个人就是她本人；
 * 夜语长成了另一个人，然后不确定那是不是自己。两个人说的每一句话，
 * 都是同一句话的两种答案。
 */

const B1 = 'L05-07.b1-xiaoxing-mentor-badge'
const B2 = 'L05-07.b2-yeyu-character-is-you'
const B3 = 'L05-07.b3-linglan-listening'
const B4 = 'L05-07.b4-linglan-gpose'
const B5 = 'L05-07.b5-xiaoxing-again'

const R1 = 'L05-07.rel.swap-mentor-lines'
const R2 = 'L05-07.rel.yeyu-mentor-into-mature'
const R3 = 'L05-07.rel.xiaoxing-again-placed'
const R4 = 'L05-07.rel.listening-before-character'
const R5 = 'L05-07.rel.gpose-placed'

const relations: KeyRelation[] = [
  // ★ 共存关系：铃兰导师期那句「陪着一个人，本身就是在听」被拖进这封信（high）
  { id: R1, kind: 'displacedInto', subject: B3, tier: 'high' },
  // 互换的另一侧：夜语导师期那句「你的RP角色，也是你光之战士的一部分」被拖进成熟期（transform）
  { id: R2, kind: 'displacedInto', subject: B2, tier: 'transform' },
  // 小星那句「再渡一次劫」被重新摆了一遍
  { id: R3, kind: 'displacedInto', subject: B5, tier: 'microshift' },
  // 先有人说出"倾听也是一种陪伴"，夜语才敢承认扮演的那个人也是自己
  { id: R4, kind: 'precedes', subject: B3, object: B2 },
  // 铃兰那句「散场之前，我们gpose一张吧」被挪出了原位
  { id: R5, kind: 'displacedInto', subject: B4, tier: 'transform' },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-07.E.s',
    rating: 'S',
    title: '时间之外',
    body:
      '两个人说的话在这一晚互换了位置。\n\n' +
      '铃兰先说：陪着一个人，本身就是在听。这句话被放到这里，听起来不像安慰，像是一个人对另一个人说"我一直在"。夜语于是接住了自己那句话：你的角色，也是你的一部分——他本来就打算用这句话去接住别人，结果先被接住的是他自己。\n\n' +
      '小星在旁边看着，忽然懂了：她在游戏里长成了另一个人，而那个人就是她本人；夜语在游戏里长成了另一个人，然后花了很久才敢承认那也是他。\n\n' +
      '散场之前他们拍了一张合照。没有人笑，照片里三个人的影子都在同一个方向。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yeyu', delta: 2, reason: '他先被接住了，才敢承认那个人也是自己' },
      { characterId: 'linglan', delta: 2, reason: '她那句"陪伴"跨过时空，落在了需要它的那个人身上' },
      { characterId: 'xiaoxing', delta: 1, reason: '她看见了自己那句话的另一种答案' },
    ],
  },
  {
    id: 'L05-07.E.a',
    rating: 'A',
    title: '有人叫对了名字',
    body:
      '夜语把那句话说了出来，说的是别人，眼睛看的却是自己。铃兰听见了，没有拆穿，只是往前坐了一点。\n\n' +
      '散场以后，铃兰问他要不要一起把店门口的灯留着。他说好。那天晚上没有人纠正他该用哪个名字——两个名字他都可以是。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'yeyu', delta: 1, reason: '他把那句话说了出来，没有岔开话题' },
      { characterId: 'linglan', delta: 1, reason: '她没有拆穿他，只是往前坐了一点' },
      { characterId: 'xiaoxing', delta: 0, reason: '她那天不在店里' },
    ],
  },
  {
    id: 'L05-07.E.b',
    rating: 'B',
    title: '两个名字都没叫出口',
    body:
      '话说了一半。夜语想说自己其实分不清，铃兰想问一句你累不累，两句话在门口撞了一下，各自退了回去。\n\n' +
      '那天店里很热闹，散场的时候灯是关着的。夜语在门口站了一会儿，用角色的名字跟自己道了晚安。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'yeyu', delta: 0, reason: '他用角色的名字跟自己道了晚安' },
      { characterId: 'linglan', delta: 0, reason: '她那句"你累不累"没有问出口' },
      { characterId: 'xiaoxing', delta: 0, reason: '她在打本，没能来' },
    ],
  },
  {
    id: 'L05-07.E.c',
    rating: 'C',
    title: '门口的位置',
    body:
      '店里的人在扮演，夜语也在扮演。没有人注意到他一直没有摘下角色，也没有人注意到铃兰一直在数还剩几个位置。\n\n' +
      '散场之后两个人各自回家。夜语在公寓里开着灯坐了很久，铃兰在通讯贝里挂到天亮——他们都在等一句没有人说的话。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'yeyu', delta: -1, reason: '他一直没有摘下那个角色' },
      { characterId: 'linglan', delta: -1, reason: '她数了一晚的位置，没有数到自己' },
      { characterId: 'xiaoxing', delta: 0, reason: '她不在这一晚里' },
    ],
  },
  {
    id: 'L05-07.E.d',
    rating: 'D',
    title: '摘不下来的面具',
    body:
      '这一晚的话全摆错了。夜语被叫的是角色的名字，他下意识回了头，没有人觉得不对。铃兰张罗了整场，散场时灯灭了，没有人问过她叫什么。\n\n' +
      '两个人都笑着说了再见。回去的路上，谁也想不起来自己刚才用的是哪个名字。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'yeyu', delta: -2, reason: '他下意识回了头，没有人觉得不对' },
      { characterId: 'linglan', delta: -2, reason: '散场以后，没有人问过她叫什么' },
      { characterId: 'xiaoxing', delta: -1, reason: '她错过了这一晚' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-07.E.fallback',
  rating: 'D',
  title: '没有排出来的那一晚',
  body: '那一晚的话最终没有排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_07: Letter = {
  id: 'L05-07',
  chapterId: 'ch05',
  title: '你的RP角色也是你',
  anchor: { phase: 'mature', space: 'rp-venue' },
  preamble:
    '倾听者：\n\n' +
    '今天有个客人问我：如果你扮演的那个人比你本人更受欢迎，你会不会难过。\n\n' +
    '我说我不会。说完我就知道我在骗他，也在骗自己。\n\n' +
    '我在这家店里待了很多年。我给别人起名字、写背景、教他们怎么说话。有人在这里第一次被人喜欢，有人在这里把自己藏起来。我以为我是在帮别人，其实我一直在找一件事：那个被记住的人，能不能也算我。\n\n' +
    '这封信写给我自己。也给所有在这里坐过一晚、然后带着另一个名字回家的人。',
  signature: '——夜语',
  blocks: [
    { id: B1, statementId: 'xiaoxing.mature.02', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yeyu.mentor.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'linglan.mentor.01b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'linglan.mentor.03', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'xiaoxing.mature.01b', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L05-06'] },
}
