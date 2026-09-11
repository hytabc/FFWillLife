import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L03-05「副本没变」—— 第三章第五封。
 * 空间锚点 dungeon / 阶段 成熟期 / 出场 远山·铁壁·夜语·铃兰（见 STORY-BIBLE §5.3）。
 *
 * 标题取自远山导师期那句「回来就好，副本没变」——**但这封信里谁都不许说出它**：
 * 导师期的语句超出了本章锚点，而且这句话的价值正在于"还没说出口"。
 *
 * 夜语那两句（B3/B5）是这一晚的背景音：她只说自己的事——店里的灯是暖的、
 * 那个几乎没有声音的频道开着就够了。它们留在她自己的时空里（成长期·角色扮演场地），
 * 玩家搬不动它们，只能看它们落在这一晚的哪个位置，信里也不许把它们说成"被搬过来的"。
 * 玩家能挪动的是另外四句：铁壁的两句、铃兰那句等待，以及远山自己那句战报。
 *
 * 判定轴：他什么时候把当年那句搬出来。先玩完这一晚、再提当年（B4 排到最后），
 * 那句话就变成一句"我确实来过"；一开场就提，整趟就变成一场追悼会——
 * 铁壁会累（`tiebi.C` 疲惫的埋线），铃兰会安静下去。
 */

const B1 = 'L03-05.b1-tiebi-loot'
const B2 = 'L03-05.b2-linglan-waiting'
const B3 = 'L03-05.b3-yeyu-warm-light'
const B4 = 'L03-05.b4-yuanshan-firstkill'
const B5 = 'L03-05.b5-yeyu-quiet-channel'
const B6 = 'L03-05.b6-tiebi-room'

/** 六条正向关系：满足越多，这趟越像"一起玩"，越不像"追悼"。 */
const relations: KeyRelation[] = [
  // 他成长期那句战报被拖进今夜：跨阶段同空间 → transform
  { id: 'L03-05.rel.firstkill-again', kind: 'displacedInto', subject: B4, tier: 'transform' },
  // 铃兰那句「我留着频道等着」也被拖进今夜：当年她等的是别人，今夜等的是他们
  { id: 'L03-05.rel.waiting-again', kind: 'displacedInto', subject: B2, tier: 'transform' },
  // 先知道有人在等着，他才敢提当年
  { id: 'L03-05.rel.waiting-before-firstkill', kind: 'precedes', subject: B2, object: B4 },
  // 当年那句留到最后：先把这一晚玩完，再回头去看那座山
  { id: 'L03-05.rel.firstkill-last', kind: 'last', subject: B4 },
  // 先听见铁壁说"这件我不急"，他才敢提当年——队里还有人不在意这些东西
  { id: 'L03-05.rel.loot-before-firstkill', kind: 'precedes', subject: B1, object: B4 },
  // 铁壁那句"位置一直留着"也是被他带进副本的：同阶段跨空间 → microshift
  { id: 'L03-05.rel.room-carried-in', kind: 'displacedInto', subject: B6, tier: 'microshift' },
]

const ALL = [
  'L03-05.rel.firstkill-again',
  'L03-05.rel.waiting-again',
  'L03-05.rel.waiting-before-firstkill',
  'L03-05.rel.firstkill-last',
  'L03-05.rel.loot-before-firstkill',
  'L03-05.rel.room-carried-in',
]

const endings: LetterEnding[] = [
  {
    id: 'L03-05.E.s',
    rating: 'S',
    title: '他们把这一晚玩完了，才回头去看那座山',
    body:
      '铁壁把话说得很轻松：「低保谁缺谁拿，我不急这一件。」\n\n' +
      '他还说过一句：「那间屋子我重新收拾过了，离线的名字还钉在墙上。」——这句话本来是说在部队房里的，那天晚上被他带进了副本，听起来像是对远山说的。\n\n' +
      '铃兰在频道里留着：「你们忙你们的，我留在频道里等着。」——她不进去打，她只是等着，这让远山想起很多年前有人也是这么等他的。\n\n' +
      '夜语那天说了两句。一句是那家店的灯是暖的，一句是那个跨服通讯贝里他从不吭声、知道它亮着就行。她说完就坐回自己的位置上去了——那两句留在这个晚上，像是替这一晚点了一盏灯。\n\n' +
      '他们打完了一晚上。灭了两把，也过了两把。\n\n' +
      '到最后，远山才把当年那句搬出来：「首杀是我们打的，那天的记录到现在还没人破。」——这句话他憋了很久，现在说出口，不像战报，倒像把一样很重的东西放回架子上。\n\n' +
      '副本确实没变。变的是他终于可以不站在最前面，也能把这一晚过完。',
    requires: ALL,
    minSatisfied: 6,
    priority: 10,
    tendency: [
      { characterId: 'yuanshan', delta: 2, reason: '他先陪大家玩完了一晚，最后才提当年——那座山终于只是山了' },
      { characterId: 'linglan', delta: 2, reason: '她留在频道里等着，等到了他愿意把话说出来' },
      { characterId: 'tiebi', delta: 1, reason: '他那句"我不急这一件"，让所有人都松了一口气' },
      { characterId: 'yeyu', delta: 1, reason: '她第一次在副本门口说起了自己那个没有人说话的频道' },
    ],
  },
  {
    id: 'L03-05.E.a',
    rating: 'A',
    title: '有人等着，他玩得下去',
    body:
      '铃兰在频道里等着，铁壁对那件装备不在意。有这两件事垫底，远山今晚玩得下去。\n\n' +
      '只是铃兰那句「你们忙你们的，我留在频道里等着」，还是照它原来的样子落在那里——她没有等到一个回应，而她等的到底是谁，他一直没有问过。\n\n' +
      '当年那句他留到了最后才提，提起来的时候，气氛还接得住。\n\n' +
      '散场的时候他走在最后。他发现自己并不急着下线。',
    requires: ALL,
    minSatisfied: 5,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 1, reason: '他玩得下去，提当年的时候还接得住' },
      { characterId: 'linglan', delta: 1, reason: '她等在频道里，等到的只有一个晚上' },
      { characterId: 'tiebi', delta: 0, reason: '他把那件装备让了出去，没有说什么' },
    ],
  },
  {
    id: 'L03-05.E.b',
    rating: 'B',
    title: '一趟普通的副本',
    body:
      '没有人多说什么，机制走完，装备分完，散场。\n\n' +
      '铁壁那句「位置一直留着」到底没有被搬进这个副本；夜语那两句关于灯和频道的话，也始终留在她自己的地方——她那天晚上在副本门口很安静。\n\n' +
      '当年那句战报，他没能留到最后再提。他提得不太是时候，也没有人接。\n\n' +
      '走出副本的时候，他想了想，觉得今天其实还行。只是还行。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他打完了一趟普通的副本' },
      { characterId: 'linglan', delta: 0, reason: '她在频道里等着，没有等到什么' },
      { characterId: 'tiebi', delta: 0, reason: '他照常把这一晚安排得井井有条' },
    ],
  },
  {
    id: 'L03-05.E.c',
    rating: 'C',
    title: '他在开场就提了当年',
    body:
      '进本之前，远山就把那句搬了出来：「首杀是我们打的，那天的记录到现在还没人破。」\n\n' +
      '这句话一出来，这趟副本就变成了另一件事。铁壁还是照常分装备、照常报机制，只是他说话的间隔变长了。他这些年做的其实就是"不踢 AFK 的人"这一件事——现在那个 AFK 的人回来了，站在他面前，说着他已经听不懂的话。\n\n' +
      '铃兰在频道里待了一会儿就安静了。她本来是那个到处加好友、到处喊人的女孩。\n\n' +
      '那一晚结束以后，他们把队伍解散了。铁壁说「辛苦了」。他说这三个字的时候，声音里有一种很难被指认的累。\n\n' +
      '副本确实没变。变的是他们站在同一个副本里，却已经不在同一个年代了。\n\n' +
      '倾听者，这份累不会只留在铁壁一个人身上。它会在很久以后传到另一个人手里——那个把所有人聚在一起、总说「进度可以慢一点」的人。他从没见过远山。他只是在某一天发现，自己无论如何也留不住任何一支队伍了。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'yuanshan', delta: -2, reason: '他开场就提当年，让这趟副本变成了一场追悼' },
      { characterId: 'tiebi', delta: -2, reason: '他这些年只做了一件事——不踢走 AFK 的人；而那个人回来时已经不在同一个年代了' },
      { characterId: 'linglan', delta: -1, reason: '她在频道里安静了下去' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L03-05.E.fallback',
  rating: 'C',
  title: '没有排出来的那一晚',
  body: '那一晚的副本最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L03_05: Letter = {
  id: 'L03-05',
  chapterId: 'ch03',
  title: '副本没变',
  anchor: { phase: 'mature', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '我们四个进了一趟副本。灭了两把，过了两把，分了一件谁都不太想要的装备。\n\n' +
    '这一晚其实很普通。铁壁还是那个最会安排的人——那件装备他一句话就让了，临走还说，部队房重新装修过了，位置一直给我们留着。有个小姑娘在频道里等着我们打完，还有一个平时不太说话的人在副本门口讲了几句自己的事。\n\n' +
    '我自己只说了一句，是很久以前说的。\n\n' +
    '你可以把这些话挪一挪。我想知道，那句话要是留到最后再说，这一晚会不会轻一点。',
  signature: '——远山',
  blocks: [
    { id: B1, statementId: 'tiebi.mature.03', draggable: true, homeIndex: 0 },
    { id: B4, statementId: 'yuanshan.growth.01c', draggable: true, homeIndex: 1 },
    { id: B2, statementId: 'linglan.growth.03', draggable: true, homeIndex: 2 },
    { id: B3, statementId: 'yeyu.growth.01', draggable: false, homeIndex: 3 },
    { id: B5, statementId: 'yeyu.growth.03b', draggable: false, homeIndex: 4 },
    { id: B6, statementId: 'tiebi.mature.02b', draggable: true, homeIndex: 5 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L03-04'] },
}
