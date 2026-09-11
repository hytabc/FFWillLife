import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-08「倾听本身就是陪伴」
 * 空间锚点 linkshell / 出场 铃兰 · 夜语 · 月见（STORY-BIBLE §5.3）。
 *
 * 与 L05-02「蓝量见底之前」是**同一封信的两个版本**（R18 的"平行"关系）：
 * 月见与铃兰永远是同一枚硬币的两面——两个都连接了所有人，都没有被人连接。
 * R18 要求她们**不得同处一封信**，而 §5.3 的 cast 表把月见放在了这一封里。
 * 此处按 §5.3 的 cast 落地，并把 R18 的语义**机制化**：
 *   `L05-08.rel.mirrors-never-adjacent` 要求铃兰与月见的话之间至少隔着两个块，
 *   她们在同一封信里，却永远不并排——"平行"而不是"相遇"。
 *
 * 铃兰的收束：一个一直替所有人留位置的人，终于替自己要了一次。
 */

const B1 = 'L05-08.b1-linglan-listening'
const B2 = 'L05-08.b2-linglan-idle'
const B3 = 'L05-08.b3-yeyu-character-is-you'
const B4 = 'L05-08.b4-yuejian-idle'
const B5 = 'L05-08.b5-yuejian-ask-me'

const R1 = 'L05-08.rel.mirrors-never-adjacent'
const R2 = 'L05-08.rel.yuejian-idle-carried'
const R3 = 'L05-08.rel.yuejian-ask-me-carried'
const R4 = 'L05-08.rel.idle-together-placed'
const R5 = 'L05-08.rel.yeyu-line-carried'

const relations: KeyRelation[] = [
  // 铃兰与月见的话之间至少隔着两个块——镜子永不相邻（R18 的机制化）
  { id: R1, kind: 'separatedBy', subject: B2, object: B4, minGap: 2 },
  // 月见那句「我今天不想打本，就想挂会儿机」被拖进这封信（transform）
  { id: R2, kind: 'displacedInto', subject: B4, tier: 'transform' },
  // 月见那句「我也需要有人问一句累不累」被拖进这封信（transform）
  { id: R3, kind: 'displacedInto', subject: B5, tier: 'transform' },
  // 铃兰把「挂机也是一种陪伴」重新摆了一遍——这次是替自己说的
  { id: R4, kind: 'displacedInto', subject: B2, tier: 'reorder' },
  // 夜语那句「你演的那个人，也是你自己的一部分」被带进这封信（microshift）
  { id: R5, kind: 'displacedInto', subject: B3, tier: 'microshift' },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-08.E.s',
    rating: 'S',
    title: '倾听本身就是陪伴',
    body:
      '月见的两句话被放进了这封信，一前一后，却永远不挨着铃兰那一句——她们在同一封信里，隔着两个块，谁也没有碰到谁。\n\n' +
      '「我今天不想打本，就想挂会儿机。」\n' +
      '「你们有没有想过，我也需要有人问一句累不累。」\n\n' +
      '铃兰读到这里的时候愣了很久。她一直以为自己是唯一一个数着位置的人。她把这句"挂机也是一种陪伴"重新摆了一遍——这一次不是替别人说的，是替自己。\n\n' +
      '夜语那句话被摆在了她们中间，谁也挨不着谁：你演的那个人，也是你自己的一部分。她把它抄在通讯贝的公告栏上。有人问她为什么，她说因为这句话不是在说别人。\n\n' +
      '那天她没有关频道。她只是把状态改成了"在线"，然后什么也没做——第一次有人看见她也在。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'linglan', delta: 2, reason: '她终于替自己要了一次，而不是替别人留位置' },
      { characterId: 'yuejian', delta: 1, reason: '她那两句"我也累"跨过来，被另一个数位置的人读到了' },
      { characterId: 'yeyu', delta: 1, reason: '他那句话被抄在了公告栏上，说的不是别人' },
    ],
  },
  {
    id: 'L05-08.E.a',
    rating: 'A',
    title: '在线',
    body:
      '月见那句话还是被摆进来了，铃兰读完，没有说什么，把频道的公告栏改了一行字：这里不需要你说话。\n\n' +
      '第二天有人在公告栏下面回了一句「那我挂着」。铃兰看了很久，才明白自己这些年做的事，原来真的有人收到了。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'linglan', delta: 1, reason: '她把公告栏改成"这里不需要你说话"' },
      { characterId: 'yuejian', delta: 1, reason: '她那句话被摆进来了，只是没有被完全读懂' },
      { characterId: 'yeyu', delta: 0, reason: '他那句话没有摆到该在的位置' },
    ],
  },
  {
    id: 'L05-08.E.b',
    rating: 'B',
    title: '位置都留着',
    body:
      '铃兰把这封信写完了，也把每个人的位置都安排好了。谁先开口，谁后开口，谁不用开口——她写得清清楚楚，只有她自己那一行空着。\n\n' +
      '通讯贝里还是很热闹。散场以后她数了数在线人数，还是少一个。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'linglan', delta: 0, reason: '她给每个人都安排了位置，只有自己那一行空着' },
      { characterId: 'yuejian', delta: 0, reason: '她的话没有被放到能被听见的地方' },
      { characterId: 'yeyu', delta: 0, reason: '他路过，什么也没留下' },
    ],
  },
  {
    id: 'L05-08.E.c',
    rating: 'C',
    title: '999+ 与 0',
    body:
      '这封信里的话互相挡着。月见和铃兰该说的话被摆到了同一个角落，谁也没有看见谁。\n\n' +
      '通讯贝的消息是 999+，铃兰一条一条往下翻，翻到底，没有一条是私聊她的。她关掉窗口，把自己挂在了频道里——和往常一样，和没有人注意到的时候一样。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'linglan', delta: -1, reason: '999+ 的消息里，没有一条是私聊她的' },
      { characterId: 'yuejian', delta: -1, reason: '她的话被摆到了没人看的角落' },
      { characterId: 'yeyu', delta: -1, reason: '他也没有私聊过她' },
    ],
  },
  {
    id: 'L05-08.E.d',
    rating: 'D',
    title: '散场以后',
    body:
      '这一晚的每一句话都落在了错的地方。月见说了自己累，没有人接；夜语那句"你演的那个人，也是你自己的一部分"被摆在角落里，像是在说别人；铃兰张罗了一整场，散场以后一个人把灯关掉。\n\n' +
      '门口的位置牌还插着。第二天早上有人路过，看见那家店的门开着，里面没有人。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'linglan', delta: -2, reason: '散场以后她一个人把灯关掉' },
      { characterId: 'yuejian', delta: -1, reason: '她说了自己累，没有人接' },
      { characterId: 'yeyu', delta: -2, reason: '他那句"角色也是你"，被摆成了一句对别人说的话' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-08.E.fallback',
  rating: 'D',
  title: '没有排出来的那一晚',
  body: '那一晚的话最终没有排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_08: Letter = {
  id: 'L05-08',
  chapterId: 'ch05',
  title: '倾听本身就是陪伴',
  anchor: { phase: 'mentor', space: 'linkshell' },
  preamble:
    '倾听者：\n\n' +
    '今天那家店散场的时候，我在门口数了一下还剩几个位置。数完了才发现，我每次都在数别人。\n\n' +
    '我拉过很多人进频道。有人在这儿找到了第一支队伍，有人在这儿学会了怎么开口。他们的名字我都记得。可我自己的名字，从来没有被人叫出来过。\n\n' +
    '我不怪任何人。因为是我先把自己放在了门口——我以为站在门口的人不算在里面。\n\n' +
    '这封信写给我自己：倾听本身就是一种陪伴，只是这句话，我也想听别人对我说一次。',
  signature: '——铃兰',
  blocks: [
    { id: B1, statementId: 'linglan.mentor.01', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'linglan.mentor.02', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yeyu.mentor.01b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yuejian.mature.02', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'yuejian.mature.03', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L05-07'] },
}
