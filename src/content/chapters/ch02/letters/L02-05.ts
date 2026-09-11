import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L02-05「不踢AFK」
 * 空间锚点 fc-house / 阶段 成长期（见 STORY-BIBLE §5.3）。
 * 出场：铁壁 · 小星 · 烈风 · 铃兰（一人一块，见判据 E）。
 *
 * 本章的教学重点在这封信里最完整：**同一句话，在通讯贝里被读到、和在部队房里被听到，
 * 是两回事。** 铃兰与烈风那两块的原坐标都在通讯贝（linkshell），信件锚点在部队房——
 * 把它们搬进屋子，两条关系同时落到 `microshift` 档上：
 *   铃兰那句从「一个新频道」变成「一间永远留着灯的房间」；
 *   烈风那句从「一条招募标准」变成「当着所有人的面羞辱人」。
 *
 * 固定块 B1 是小星在豆芽期写在频道里的那句话（更早的阶段＝回忆，钉在首位不会错位）：
 * 整封信就是围着「别不要我」这句话展开的。
 *
 * 排列覆盖（6 种，零兜底）：
 *   B4,B3,B2 → 2 条 → B      B4,B2,B3 → 4 条 → S
 *   B2,B4,B3 → 2 条 → B      B2,B3,B4 → 1 条 → C（＝初始排列）
 *   B3,B4,B2 → 3 条 → A      B3,B2,B4 → 2 条 → B
 */

const B1 = 'L02-05.b1-xiaoxing-plea'
const B2 = 'L02-05.b2-linglan-channel'
const B3 = 'L02-05.b3-liefeng-standard'
const B4 = 'L02-05.b4-tiebi-rule'

const relations: KeyRelation[] = [
  // 铃兰那句「跨服通讯贝建好了，随时来聊天」被从频道里搬进了屋子
  { id: 'L02-05.rel.linglan-said-in-the-room', kind: 'displacedInto', subject: B2, tier: 'microshift' },
  // 烈风那句「炒股炒不明白就别来零式，我可不陪谁渡劫」也被搬进了屋子
  { id: 'L02-05.rel.liefeng-said-in-the-room', kind: 'displacedInto', subject: B3, tier: 'microshift' },
  // 先有人说「这里随时来聊天」，那句难听的标准落下来才不至于把人赶走
  { id: 'L02-05.rel.linglan-before-liefeng', kind: 'precedes', subject: B2, object: B3 },
  // 规矩要说在欢迎之前——先有「一个都不赶」，屋里那盏灯才算数
  { id: 'L02-05.rel.rule-before-linglan', kind: 'precedes', subject: B4, object: B2 },
]

const ALL = [
  'L02-05.rel.linglan-said-in-the-room',
  'L02-05.rel.liefeng-said-in-the-room',
  'L02-05.rel.linglan-before-liefeng',
  'L02-05.rel.rule-before-linglan',
]

const endings: LetterEnding[] = [
  {
    id: 'L02-05.E.s',
    rating: 'S',
    title: '这间屋子的灯是亮着的',
    body:
      '铁壁先把规矩说在了前面：他想建一个不踢挂机的人的部队，来的人他一个都不赶。\n\n' +
      '然后是铃兰。她把自己打在频道里的那句话搬进了屋子说——「跨服通讯贝建好了，随时来聊天。」在频道里，它只是又多了一个可以静音的频道；在这间屋子里，它是一间永远留着灯的房间。\n\n' +
      '最后是烈风。他也把那句最狠的标准从频道里搬了出来，当着所有人的面说：「炒股炒不明白就别来零式，我可不陪谁渡劫。」在频道里读它，它只是一条要求；在屋子里当着人的面说出来，它本该是一次羞辱——但规矩和那盏灯都已经排在前面了，所有人听见的是另一件事：他只是不想再看见有人因为打不好就自己走掉。\n\n' +
      '那天没有人退队，也没有人被赶走。挂在频道最上面的那句「我会努力的，别不要我」，第一次有人认真回了一整晚。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'tiebi', delta: 2, reason: '他把规矩说在了欢迎之前，「一个都不赶」才落了地' },
      { characterId: 'linglan', delta: 2, reason: '她把频道里的那句话搬进屋子，让它变成了一盏灯' },
      { characterId: 'liefeng', delta: 1, reason: '他当着所有人的面说了那句狠话，却被前面的两句话接住了' },
      { characterId: 'xiaoxing', delta: 2, reason: '她那句「别不要我」第一次有人认真回了' },
    ],
  },
  {
    id: 'L02-05.E.a',
    rating: 'A',
    title: '狠话说在了规矩前面',
    body:
      '烈风那句话先进了屋子。当着所有人的面，它像一次羞辱，屋里安静了一下。\n\n' +
      '接着铁壁才说他的规矩：来的人一个都不赶。这句话把刚才那句接住了，但接得晚了一步。最后铃兰也把她那句话搬进了屋子说——灯是亮着的，只是有人已经在那一小段安静里，把手里的事情放下了。\n\n' +
      '那天没有人退队。只是小星后来承认，她当时把那句「我会努力的，别不要我」删掉过一半。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'liefeng', delta: 0, reason: '他的标准当着人说了出口，次序却排在规矩前面' },
      { characterId: 'tiebi', delta: 1, reason: '他接住了那句话，只是晚了一句' },
      { characterId: 'linglan', delta: 1, reason: '她还是把那盏灯点亮了' },
      { characterId: 'xiaoxing', delta: 0, reason: '她删掉了一半，又打了回去' },
    ],
  },
  {
    id: 'L02-05.E.b',
    rating: 'B',
    title: '规矩立住了，但没有人听见代价',
    body:
      '铁壁把规矩说在了前面，铃兰也把那句「跨服通讯贝建好了，随时来聊天」从频道里搬进了屋子。\n\n' +
      '只有烈风那句话还留在频道里。那天晚上没有人当着面听见它，也就没有人需要为它低头。规矩立住了，屋子里的灯也亮着——只是没有人知道，下一次那句话写进频道的时候，它会不会正好被某个刚进来的人读到。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'tiebi', delta: 1, reason: '规矩说在了前面' },
      { characterId: 'linglan', delta: 1, reason: '她把灯点亮了' },
      { characterId: 'liefeng', delta: 0, reason: '他那句话留在了频道里，谁也没有当面听见' },
      { characterId: 'xiaoxing', delta: 0, reason: '她那天没有说话' },
    ],
  },
  {
    id: 'L02-05.E.c',
    rating: 'C',
    title: '两句话都留在了频道里',
    body:
      '那天晚上，铃兰和烈风的两句话都留在了频道里。一个在频道里说「跨服通讯贝建好了，随时来聊天」，一个在频道里说「炒股炒不明白就别来零式，我可不陪谁渡劫」。一样是打字，谁都能当作没看见，谁都不必抬头。\n\n' +
      '铁壁的规矩是最后才说的。他说的时候，屋里已经散得差不多了，只有小星还在。\n\n' +
      '那句「我会努力的，别不要我」一直挂在频道最上面。那天没有人回它——不是不想回，是那句话本来就写在没有人看的地方。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'linglan', delta: -1, reason: '她的邀请留在了频道里，没有变成那间屋子的灯' },
      { characterId: 'liefeng', delta: -2, reason: '他把标准写在频道里，谁都可以当作没看见' },
      { characterId: 'tiebi', delta: -1, reason: '他的规矩说晚了，屋里已经没有几个人' },
      { characterId: 'xiaoxing', delta: -2, reason: '那句话挂在最上面，没有人回' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L02-05.E.fallback',
  rating: 'C',
  title: '没有挂牌子的那间屋子',
  body: '那块牌子最后没有挂上去。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L02_05: Letter = {
  id: 'L02-05',
  chapterId: 'ch02',
  title: '不踢AFK',
  anchor: { phase: 'growth', space: 'fc-house' },
  preamble:
    '倾听者：\n\n' +
    '部队的房子是我一个人挑的，地方不大，桌子够坐。我在门口挂了一块牌子，上面只有一条规矩：谁挂机了，也不踢。\n\n' +
    '写这条规矩的时候，我想的是很多年前那个一直在副本门口站着的人。那个人是我。\n\n' +
    '第一次在这间屋子里把规矩说出口的那天晚上，有人先开了口，有人后开口。我想知道，如果顺序换一换，这间屋子会不会还是现在这样。',
  signature: '——铁壁',
  blocks: [
    { id: B1, statementId: 'xiaoxing.sprout.06', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'linglan.growth.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'liefeng.growth.01b', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'tiebi.growth.01b', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L02-04'] },
}
