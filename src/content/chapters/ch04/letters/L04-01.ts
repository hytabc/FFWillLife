import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L04-01「RP店的第一夜」
 * 空间锚点 rp-venue / 阶段 成熟期（见 STORY-BIBLE §5.3）。出场：夜语 · 铃兰 · 月见。
 *
 * 采用**分级判定（band grading）**：四条关系里三条构成一个完整顺序，
 * 第四条是跨时空错位（tier `high`）——那句话是从别的时间、别的空间被拖进这一夜的。
 * 它不表达"跨得太远所以坏掉了"：`high` 档的结局由本信自己编排，
 * 这里写成**隐藏剧情**——玩家把一句本不属于这里的话放对了位置，于是看见了不该看见的东西。
 *
 * 因果逻辑：那家店的第一夜，谁先把自己从角色里摘出来。
 *   B2 铃兰的邀请（从频道里被拖进店里）· B3 月见第一次说「我也有奶不动的时候」·
 *   B4 夜语承认自己分不清了
 *
 * 月见在第四章的锚点是**成熟期**（§3.2），她那句"服务于自己"的术语
 * 按 §7.3 全作只允许出现两次（Ch4 与 Ch5 各一次）——本信是第四章的那一次。
 *
 * 排列与分档（已逐排列验证：{1,0,3,4,2,3}，0~4 全部可达，无兜底）：
 *   B3 B4 B2 → 4 = S  先有人说了句人话，再有人承认自己分不清，邀请最后落地
 *   B3 B2 B4 → 3 = A  人话在先，邀请插了进来，夜语的承认留在最末
 *   B4 B3 B2 → 3 = A  承认排在最前，人话跟上，邀请却没能排到最后
 *   B4 B2 B3 → 2 = B  承认、邀请、然后是那句人话——它变成了收场
 *   B2 B3 B4 → 1 = C  邀请最早，人话夹在中间，承认留在最后没有人接
 *   B2 B4 B3 → 0 = D  邀请、承认、人话各归各位，谁也没有被接住
 */

const B2 = 'L04-01.b2-linglan-invite'
const B3 = 'L04-01.b3-yuejian-boundary'
const B4 = 'L04-01.b4-yeyu-admit'

const relations: KeyRelation[] = [
  // 有人先承认自己也会奶不动，夜语才敢承认自己分不清了
  { id: 'L04-01.rel.boundary-before-admit', kind: 'precedes', subject: B3, object: B4 },
  // 夜语先承认，铃兰那句邀请才不是对着一个还在演的人说的
  { id: 'L04-01.rel.admit-before-invite', kind: 'precedes', subject: B4, object: B2 },
  // 顺序的最后一项：邀请落在最后，这一夜才算被接住
  { id: 'L04-01.rel.boundary-before-invite', kind: 'precedes', subject: B3, object: B2 },
  // 那句话是从别的时间、别的空间被拖进来的——它此刻不属于任何一桌人
  { id: 'L04-01.rel.invite-carried-across', kind: 'displacedInto', subject: B2, tier: 'high' },
]

const ALL = [
  'L04-01.rel.boundary-before-admit',
  'L04-01.rel.admit-before-invite',
  'L04-01.rel.boundary-before-invite',
  'L04-01.rel.invite-carried-across',
]

const endings: LetterEnding[] = [
  {
    id: 'L04-01.E.s',
    rating: 'S',
    title: '那天晚上有人先说了句人话',
    body:
      '月见先开了口。她说，我也有奶不动的时候，别什么都指望我。\n\n' +
      '那句话说得一点都不重，桌上却安静了下来——在这家店里，谁也没想到第一个从角色里走出来的是她。\n\n' +
      '然后夜语才承认：他分不清哪一句是自己的了。他说得很轻，像在说一件很小的事，小到不需要别人安慰。\n\n' +
      '最后是铃兰。她把一句很久以前在频道里说过的话又说了一遍——跨服通讯贝我建好了，你们随时来。这一次它是说给一个刚从角色里走出来的人听的。\n\n' +
      '那天夜里没有人拆穿谁，也没有人从店里跑出去。有人在门口站了一会儿，又走回来坐下。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'yeyu', delta: 2, reason: '面具还戴得最稳的时候，他先把那句「分不清」说出了口' },
      { characterId: 'linglan', delta: 2, reason: '她最后说的不是「你们怎么都不说话」，而是那句旧邀请' },
      { characterId: 'yuejian', delta: 2, reason: '她把「我也有奶不动的时候」说出了口，而且没有替任何人圆回去' },
    ],
  },
  {
    id: 'L04-01.E.a',
    rating: 'A',
    title: '有人先说了一句真话',
    body:
      '夜语先承认了自己分不清，铃兰的邀请也到了——只是月见那句话落在了后面，等它出口，桌子那头已经没有人需要被豁免了。\n\n' +
      '散场的时候三个人还是一起走的。没有人再提起那三句话，但也没有人假装它们没有出现过。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'yeyu', delta: 2, reason: '他终于把那句说不清的话说了出来' },
      { characterId: 'linglan', delta: 1, reason: '她的邀请到了，只是晚了一点点' },
      { characterId: 'yuejian', delta: 0, reason: '她说了那句话，只是没有人接住它' },
    ],
  },
  {
    id: 'L04-01.E.b',
    rating: 'B',
    title: '话都说了一半',
    body:
      '月见说了她也有奶不动的时候，夜语也承认了自己分不清——可是铃兰那句邀请没有落下来。\n\n' +
      '她在门口数了数还剩几个人，把话咽了回去。这一夜过得还算平静，只是没有人真的被接住。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'linglan', delta: -1, reason: '她数了人数，然后把那句邀请咽了回去' },
      { characterId: 'yeyu', delta: 1, reason: '他说了实话，但没有人在听' },
      { characterId: 'yuejian', delta: 0, reason: '她第一次把疲惫说出了口，随即自己收了回来' },
    ],
  },
  {
    id: 'L04-01.E.c',
    rating: 'C',
    title: '各说各的',
    body:
      '话都说出口了，但没有一句排在能让它落地的地方。\n\n' +
      '月见说她也有奶不动的时候，那时夜语正低头看桌子；铃兰开口的时候，夜语已经站起来穿外套了。那家店的第一夜就这样散了，谁也没有做错什么。',
    requires: ALL,
    minSatisfied: 1,
    priority: 40,
    tendency: [
      { characterId: 'yeyu', delta: -1, reason: '他把那句话留在了没有人的时候' },
      { characterId: 'linglan', delta: -1, reason: '她的邀请撞上了别人穿外套的动作' },
      { characterId: 'yuejian', delta: -1, reason: '她试着说了一句真话，结果没有人听见' },
    ],
  },
  {
    id: 'L04-01.E.d',
    rating: 'D',
    title: '灯关得很早',
    body:
      '什么也没有发生。有人叫了一声角色的名字，他回了头，然后又转了回去。\n\n' +
      '月见终究没有把那句话说出来，铃兰在门口数了数还剩几个人。那家店的灯那天晚上关得很早。第二天它还会开，只是没有人再提起过第一夜。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'yeyu', delta: -2, reason: '他回了头，却连自己为什么回头都没有问出口' },
      { characterId: 'linglan', delta: -2, reason: '她操办了整场，散场后只是把门关上了' },
      { characterId: 'yuejian', delta: -1, reason: '她又一次把那句话咽了回去' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L04-01.E.fallback',
  rating: 'D',
  title: '没有排出来的那一夜',
  body: '那天晚上的话最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L04_01: Letter = {
  id: 'L04-01',
  chapterId: 'ch04',
  title: 'RP店的第一夜',
  anchor: { phase: 'mature', space: 'rp-venue' },
  preamble:
    '倾听者：\n\n' +
    '那家有暖灯的店，第一夜是铃兰把我拉过去的。场地是她张罗的，人也是她一个个叫来的，她说人多一点才像样。\n\n' +
    '我坐在最里面那张桌子。有人走过来，叫我那个角色的名字。我应了——应得很快，快过我想清楚那是不是我。\n\n' +
    '那天晚上最先说了句人话的是月见。她把杯子放下，说了一句谁也没接住的话。散场以后我在门口站了一会儿，铃兰在点数。我在想，如果那三句话换一个顺序说出来，我会不会早一点知道应声的是谁。',
  signature: '——夜语',
  blocks: [
    { id: 'L04-01.b1-yeyu-turn', statementId: 'yeyu.mature.02', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'linglan.growth.01b', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yuejian.mature.01b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yeyu.mature.01b', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L03-05'] },
}
