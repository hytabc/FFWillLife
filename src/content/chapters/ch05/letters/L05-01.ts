import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L05-01「队长的最后一封信」
 * 空间锚点 linkshell / 出场 晨曦 · 小星 · 远山（STORY-BIBLE §5.3）。
 *
 * 结构：分级判定（写法 B）+ 顶档与次档互斥（`forbids`）。
 * 本信是终章的第一封，也是全作"接力"主题的正面：
 *   晨曦把队长的位置交出去，小星接住了，而**远山在那一刻确认自己被越过**。
 *
 * 两条路互斥：
 *   S —— 晨曦放下身段（说自己也被人带过）、小星接过火并说出谢谢，
 *        代价是远山那句"好友列表全灰了"被留在门外（r4 被 forbids）。
 *   A —— 远山的话被带进来，并且紧跟在队长开口之后（他被听见了），
 *        代价是晨曦没能把位置交出去（他自己停在原地）。
 *
 * 与 L05-06「副本没变」互为镜像（R9 / R20）：
 * 这一封里远山是那个被留下的人；下一封里，轮到别人看着他重新站起来。
 */

const B1 = 'L05-01.b1-chenxi-walk-through'
const B2 = 'L05-01.b2-chenxi-lie-down'
const B3 = 'L05-01.b3-xiaoxing-leaving'
const B4 = 'L05-01.b4-xiaoxing-towed'
const B5 = 'L05-01.b5-yuanshan-grey'

const R1 = 'L05-01.rel.chenxi-lowers-himself'
const R2 = 'L05-01.rel.xiaoxing-owns-the-fire'
const R3 = 'L05-01.rel.thanks-before-farewell'
const R4 = 'L05-01.rel.yuanshan-grief-carried'
const R5 = 'L05-01.rel.yuanshan-heard-first'

const relations: KeyRelation[] = [
  // 晨曦把自己那句「我当初也是躺尸过来的」从副本里挪进了这封信——他不再是队长，是先来的那个人
  { id: R1, kind: 'displacedInto', subject: B2, tier: 'microshift' },
  // 小星把那句「我当初也是被人拖过本的」说了出来——她终于站到了被需要的那一侧
  { id: R2, kind: 'displacedInto', subject: B4, tier: 'microshift' },
  // 先谢过当年被带的日子，再说自己要走
  { id: R3, kind: 'precedes', subject: B4, object: B3 },
  // 远山那句「好友列表全灰了」被带进这封信
  { id: R4, kind: 'displacedInto', subject: B5, tier: 'high' },
  // 队长的第一句之后，紧跟着的是远山——他被第一个听见
  { id: R5, kind: 'adjacent', subject: B1, object: B5 },
]

const ALL = [R1, R2, R3, R4, R5]

const endings: LetterEnding[] = [
  {
    id: 'L05-01.E.s',
    rating: 'S',
    title: '火交出去的那一夜',
    body:
      '晨曦先把自己放低了一格——他说当年也是被人一路拖过来的，话说得很难听，可他一直记得有人回头等他。\n\n' +
      '小星先谢了当年那些把她拉进本里的人，然后才说自己想去别的地方看看。她没有告别，她只是把话说在了前面：她是从这里出去的。\n\n' +
      '那一晚没有人提起谁被留下了。远山在频道里待到最后，什么也没说——他听懂了那场交接，也听懂了里面没有他的位置。\n\n' +
      '第二天，队长那一栏换了名字。名单上少了一个人，但他走得很轻，像怕吵到谁。',
    requires: [R1, R2, R3],
    minSatisfied: 3,
    forbids: [R4],
    priority: 10,
    tendency: [
      { characterId: 'chenxi', delta: 2, reason: '他先把自己放低了，才把位置交得出去' },
      // 小星的归宿在 L05-05 / H05 才被决定，这里只给一个小幅正向（她的 A 级铺垫信）
      { characterId: 'xiaoxing', delta: 1, reason: '她先谢了被带的日子，才说自己要走' },
      { characterId: 'yuanshan', delta: -2, reason: '那场交接里没有他的位置，他听懂了' },
    ],
  },
  {
    id: 'L05-01.E.a',
    rating: 'A',
    title: '先被听见的那个人',
    body:
      '队长刚开口，远山那句「好友列表全灰了」就跟在后面。没有人接话，频道静了很久。\n\n' +
      '于是那一晚谈的不再是交棒，而是谁还记得当初的人。晨曦把那封信收了起来，第二天照常点名、照常排本——队长那一栏还是他的名字。\n\n' +
      '远山后来上线得勤了一些。他还是不怎么说话，但每次都会进频道挂着。',
    requires: [R4, R5],
    minSatisfied: 2,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 2, reason: '他的话被放在了队长的第一句后面' },
      { characterId: 'chenxi', delta: 1, reason: '他把那封信收了起来，继续站在队长的位置上' },
      { characterId: 'xiaoxing', delta: 1, reason: '她留下了，成了名单上最稳的那个名字' },
    ],
  },
  {
    id: 'L05-01.E.b',
    rating: 'B',
    title: '话都说了，位置没动',
    body:
      '每个人都说了一点，谁也没说完整。晨曦放低了一半又端了回去，小星想道别又没说明白，远山那两句话掉在中间，谁也没有把它捡起来。\n\n' +
      '那封信最后就那么放下了。没有人退队，也没有人接棒——名单和上个月一模一样。',
    requires: ALL,
    minSatisfied: 1,
    priority: 30,
    tendency: [
      { characterId: 'chenxi', delta: 0, reason: '他说了一半，又收了回去' },
      { characterId: 'xiaoxing', delta: 0, reason: '她把要走的话咽了回去' },
      { characterId: 'yuanshan', delta: 0, reason: '他的话掉在中间，没有人接' },
    ],
  },
  {
    id: 'L05-01.E.c',
    rating: 'C',
    title: '一封没有人回的信',
    body:
      '这句话谁也没有先开口。三个人都读完了这封信，然后各自去做了别的事。\n\n' +
      '队长的位置一直空着——不是没人愿意坐，是没有人被正式地请上去。远山还是每天上线，看一眼名单，下线。\n\n' +
      '有些夜晚就是这样过去的，什么也没有发生，什么也没有被解决。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'chenxi', delta: -1, reason: '他把信写完，却没有把那句话说出口' },
      { characterId: 'xiaoxing', delta: -1, reason: '她没有说自己要去哪里' },
      { characterId: 'yuanshan', delta: -1, reason: '没有人问过他，还想不想再进去一次' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L05-01.E.fallback',
  rating: 'C',
  title: '没有排出来的那一封',
  body: '这封信最终没有被排出一个顺序。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L05_01: Letter = {
  id: 'L05-01',
  chapterId: 'ch05',
  title: '队长的最后一封信',
  anchor: { phase: 'mentor', space: 'linkshell' },
  preamble:
    '倾听者：\n\n' +
    '这是我最后一次以队长的身份写东西。\n\n' +
    '队伍的事我已经交代完了。名单我抄了一份，放在老地方；谁哪天想回来，位置都还在。\n\n' +
    '我一直以为，一个队长的本事是能把人留住。这几天我才发现，有些人不是被什么留住的，他们只是还没想好要去哪儿。\n\n' +
    '我把这几句话又读了一遍——有我自己说的，也有别人对我说的。要是顺序换一换，也许我就不用写这封信了。',
  signature: '——晨曦',
  blocks: [
    { id: B1, statementId: 'chenxi.mentor.03', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'chenxi.mentor.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'xiaoxing.mentor.03', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'xiaoxing.mentor.01', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'yuanshan.mature.01', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L04-05'] },
}
