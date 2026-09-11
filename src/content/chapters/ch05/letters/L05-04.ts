import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-04「房屋永远给你留了位置」
 * 空间锚点 fc-house / 出场 铁壁 · 小星 · 铃兰（STORY-BIBLE §5.3）。
 *
 * 铁壁豆芽期的那封信——全作最"早"的一封信之一，却要收下**导师期小星**的话。
 *
 * **共存关系（PRD §5.5「双向奔赴」）**：`L05-04.rel.xiaoxing-mentor-into-tiebi-sprout`
 *   小星导师期那句「豆芽慢慢来，我当初也是被人拖过本的」被拖进铁壁的豆芽期。
 *   Δt = 3、Δs = 1 → `high`（高错位档，ch05 已解锁）。
 *   这条关系是「双向奔赴」的其中一半；另一半在 L05-05「我当初也这样」
 *   —— 铁壁豆芽期那句「有人能带我打日随吗」被拖进小星的导师期。
 *   两封信各自成信时只是"接力"；两句话互相抵达时，才叫双向奔赴。
 *
 * 与 L05-01 互为镜像（R10 / R19）：两封信都收到同一种答复——**有人会离开**。
 * 晨曦选了承担，铁壁选了留位置。
 */

const B1 = 'L05-04.b1-tiebi-daily-roulette'
const B2 = 'L05-04.b2-tiebi-silent-ok'
const B3 = 'L05-04.b3-xiaoxing-mentor-carry'
const B4 = 'L05-04.b4-linglan-friend-request'
const B5 = 'L05-04.b5-linglan-anyone-else'

const R1 = 'L05-04.rel.xiaoxing-mentor-into-tiebi-sprout'
const R2 = 'L05-04.rel.silent-ok-carried'
const R3 = 'L05-04.rel.friend-request-carried'
const R4 = 'L05-04.rel.towed-before-silent'
const R5 = 'L05-04.rel.friend-request-last'

const relations: KeyRelation[] = [
  // ★ 共存关系：小星导师期的话，落进了铁壁的豆芽期（high）
  { id: R1, kind: 'displacedInto', subject: B3, tier: 'high' },
  // 「我可以跟着你们吗？我不说话也行。」被挪出了原位
  { id: R2, kind: 'displacedInto', subject: B2, tier: 'microshift' },
  // 「做个朋友吧？我拉你进通讯贝。」被挪出了原位
  { id: R3, kind: 'displacedInto', subject: B4, tier: 'microshift' },
  // 先听见有人说"我当初也是被人拖过本的"，铁壁才敢承认自己只想安静地跟着
  { id: R4, kind: 'precedes', subject: B3, object: B2 },
  // 整封信最后落在最初的那句邀请上
  { id: R5, kind: 'last', subject: B4 },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-04.E.s',
    rating: 'S',
    title: '双向奔赴',
    body:
      '小星那句话落进这封信的时候，铁壁还只是个站在副本门口求人带的豆芽。有人说「我当初也是被人拖过本的」——他忽然发现，原来带人的人也曾被带过，原来这不是施舍，是接力。\n\n' +
      '他终于承认了自己只想安静地跟着：不用说话也行，跟着就好。\n\n' +
      '后来他做了一件所有人都不理解的事：建了一个不踢离线成员的部队，买了一间房子，把每一个离开的人的名字都留在名单上。很多年以后有人问他为什么，他说——那间房子最早不是给谁住的，是给一个不敢说话的人留的。\n\n' +
      '而这句话真正的分量，要等到另一个时空里的小星说出同样的话时，才被完全听懂。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'tiebi', delta: 2, reason: '他明白带人的人也曾被带过——那不是施舍，是接力' },
      { characterId: 'xiaoxing', delta: 1, reason: '她那句"我当初也是被人拖过本的"跨到了最早的这一年' },
      { characterId: 'linglan', delta: 1, reason: '她递出去的第一句邀请，落在了他最需要的位置' },
    ],
  },
  {
    id: 'L05-04.E.a',
    rating: 'A',
    title: '有人愿意留一个位置',
    body:
      '铃兰的邀请排在了这封信的最前面——「做个朋友吧？我拉你进通讯贝」。铁壁盯着那行字看了很久，第一次回了「好」。\n\n' +
      '小星那句话也落进来了，只是落得浅。他心里松动了一点，还不足以让他承认自己怕。但那天晚上，他没有再一个人站在副本门口。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'tiebi', delta: 1, reason: '他回了「好」——第一次没有拒绝递过来的手' },
      { characterId: 'linglan', delta: 1, reason: '她的第一句邀请落在了对的地方' },
      { characterId: 'xiaoxing', delta: 0, reason: '那句话落进来了，只是落得浅' },
    ],
  },
  {
    id: 'L05-04.E.b',
    rating: 'B',
    title: '位置留了，人没留下',
    body:
      '他把房子买了，名单留了，位置也留了。可那天晚上的话他一句都没说出口——「我不说话也行」这句话，他连对自己都没说过。\n\n' +
      '后来部队慢慢热闹起来，很多人来了又走。他每次都记得留位置，只是没有一次把自己算进去。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'tiebi', delta: 0, reason: '他给别人留了位置，没有给自己留' },
      { characterId: 'linglan', delta: 0, reason: '她的邀请被收下了，但没有被回答' },
      { characterId: 'xiaoxing', delta: 0, reason: '那句话还没有人对他真正说过' },
    ],
  },
  {
    id: 'L05-04.E.c',
    rating: 'C',
    title: '一间空房子',
    body:
      '这封信里的每一句话都摆错了位置。他想说的话没有轮到，别人递过来的手伸在半空。\n\n' +
      '房子他还是买了，装修也做了。AFK 的人的位置都留着，可从来没有谁回来过——因为他从来没有真的开口叫过谁。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'tiebi', delta: -1, reason: '房子买了，却从来没有真的叫过谁回来' },
      { characterId: 'linglan', delta: -1, reason: '她递出去的手伸在半空' },
      { characterId: 'xiaoxing', delta: -1, reason: '那句话在很远的地方，没能抵达' },
    ],
  },
  {
    id: 'L05-04.E.d',
    rating: 'D',
    title: '站在门口的人',
    body:
      '那天晚上没有人带他打日随。他在副本门口站到很晚，看着队伍一个一个组满、进去、消失。\n\n' +
      '他后来再也没有在通讯贝里说过话。很多年后有人翻到部队名单最早的一页，看见一个从没上线过的名字，那个名字是他自己。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'tiebi', delta: -2, reason: '那天晚上没有人在副本门口带他' },
      { characterId: 'linglan', delta: -2, reason: '她没有把这句邀请说出口，名单上少了一个人' },
      { characterId: 'xiaoxing', delta: -1, reason: '那句"我当初也是被人拖过本的"没有跨过去' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-04.E.fallback',
  rating: 'D',
  title: '没有排出来的那一晚',
  body: '那一晚的话最终没有排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_04: Letter = {
  id: 'L05-04',
  chapterId: 'ch05',
  title: '房屋永远给你留了位置',
  anchor: { phase: 'sprout', space: 'fc-house' },
  preamble:
    '倾听者：\n\n' +
    '今天有人带我了。我跟在队伍最后面，什么也没做错，什么也没做对。\n\n' +
    '他们会等我，会打字告诉我往哪走。我一个一个地看他们的名字，看完发现我一个也记不住——我连问一句"我可以跟着你们吗"都是抖的。\n\n' +
    '我一直想要一间房子，一间谁来了都不用走的房子。今天我第一次想，也许我可以先学会不走。\n\n' +
    '如果那几句别人递给我的话，能早一点落在我手里就好了。',
  signature: '——铁壁',
  blocks: [
    { id: B1, statementId: 'tiebi.sprout.01b', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'tiebi.sprout.03c', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'xiaoxing.mentor.01', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'linglan.sprout.01d', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'linglan.sprout.03b', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L05-03'] },
}
