import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L04-03「通讯贝999+」
 * 空间锚点 linkshell / 阶段 成熟期（见 STORY-BIBLE §5.3）。出场：铃兰 · 夜语 · 小星 · 铁壁。
 *
 * 本章的第一封群像信：一个满是人的频道里，谁都没有被谁听见。
 * 四个人的四句话，只有排成一个特定的先后，那句"999+"才不再是孤独的证据。
 *
 * 错位档位：铁壁那句「我想建一个不踢AFK成员的部队」是从部队房、成长期
 * 被拖进这个频道的——跨时间 + 跨空间，`high`。写成**隐藏剧情**而非崩坏：
 * 一个很早就有人说过要留位置，只是这句话不在这个时间点上。
 *
 * 因果逻辑：
 *   B2 铃兰数着数字 · B3 小星怕被丢下 · B4 铁壁说要给人留位置（被拖来的）
 *
 * 排列与分档（已逐排列验证：{1,1,2,4,2,3}，1~4 全部可达，无兜底）：
 *   B3 B4 B2 → 4 = S  怕被丢下的人先说，有人答"不会踢人"，最后数字被听见
 *   B4 B3 B2 → 3 = A  承诺先说，然后是那份害怕，数字落在最后
 *   B3 B2 B4 → 2 = B  害怕说完，数字紧跟，承诺来晚了
 *   B4 B2 B3 → 2 = B  承诺最早，数字在中间，怕被丢下的人排在最后
 *   B2 B3 B4 → 1 = C  什么都没动：数字、害怕、承诺，各说各的
 *   B2 B4 B3 → 1 = C  数字最先，承诺跟上，那份害怕排在最后没有人接
 */

const B2 = 'L04-03.b2-linglan-count'
const B3 = 'L04-03.b3-xiaoxing-afraid'
const B4 = 'L04-03.b4-tiebi-promise'

const relations: KeyRelation[] = [
  // 怕被丢下的人先开口，铁壁那句承诺才像是回答
  { id: 'L04-03.rel.afraid-before-promise', kind: 'precedes', subject: B3, object: B4 },
  // 有人说了"不会踢人"，铃兰数的那个数字才有着落
  { id: 'L04-03.rel.promise-before-count', kind: 'precedes', subject: B4, object: B2 },
  // 顺序的最后一项：数字落在最后，才被听见
  { id: 'L04-03.rel.afraid-before-count', kind: 'precedes', subject: B3, object: B2 },
  // 那句承诺是从部队房、从很多年前被拖进这个频道的
  { id: 'L04-03.rel.promise-carried-across', kind: 'displacedInto', subject: B4, tier: 'high' },
]

const ALL = [
  'L04-03.rel.afraid-before-promise',
  'L04-03.rel.promise-before-count',
  'L04-03.rel.afraid-before-count',
  'L04-03.rel.promise-carried-across',
]

const endings: LetterEnding[] = [
  {
    id: 'L04-03.E.s',
    rating: 'S',
    title: '数字被听见了',
    body:
      '夜语那句话一直挂在最上面，像一个前提：我不说话，知道它开着就够了。\n\n' +
      '然后是小星——「我会努力的，别不要我。」她打这句话的时候，频道里正刷过几十条招募。\n\n' +
      '接着有人接住了它。那句话来自很多年前、来自一间堆着家具的屋子：「我想建一个不踢AFK成员的部队。」它不是对这个女孩说的，可它答的正是她的问题。\n\n' +
      '最后铃兰才把自己那行数字读出来：999+，没有一条是私聊。这一次她读的时候，前面站着一个承诺，和一个终于被接住的人。\n\n' +
      '数字还是那个数字。它第一次不像是她一个人的事了。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'linglan', delta: 2, reason: '她没有把数字咽回去，而是读到了最后' },
      { characterId: 'tiebi', delta: 2, reason: '他那句关于留位置的旧话，第一次真的派上了用场' },
      { characterId: 'xiaoxing', delta: 2, reason: '她把自己最怕的那句话说给了整个频道' },
      { characterId: 'yeyu', delta: 1, reason: '他那句"知道它开着就够了"成了这一夜的地基' },
      { characterId: 'yuejian', delta: -1, reason: '她不在这个频道里——人多的地方，她只会去结账' },
    ],
  },
  {
    id: 'L04-03.E.a',
    rating: 'A',
    title: '承诺来得早了一点',
    body:
      '先被翻出来的是那句「我想建一个不踢AFK成员的部队」——它进这个频道的时候，还没有人需要它。\n\n' +
      '然后小星才说怕被丢下，铃兰才报出那行数字。承诺在，害怕也在，可它们中间隔了几十条别人的招募。\n\n' +
      '铃兰看完之后把频道设置改了：不再折叠消息。她说不清为什么要改。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'tiebi', delta: 2, reason: '他那句承诺排在需要它的人前面' },
      { characterId: 'linglan', delta: 1, reason: '她把这行数字读完了，没有中途关掉' },
      { characterId: 'xiaoxing', delta: 1, reason: '她还是把那句害怕说出来了' },
      { characterId: 'yeyu', delta: 0, reason: '他依旧只是让频道开着' },
      { characterId: 'yuejian', delta: 0, reason: '她不在这个频道里' },
    ],
  },
  {
    id: 'L04-03.E.b',
    rating: 'B',
    title: '各说各的，频道照旧',
    body:
      '小星说了害怕，铃兰数了数字，铁壁那句承诺排在最后——它到得太晚，像所有迟到的好意一样，被当成了别人家的热闹。\n\n' +
      '第二天频道里的消息还是999+。铃兰没有改设置。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'linglan', delta: 0, reason: '她数了数字，但没有说出口' },
      { characterId: 'tiebi', delta: 0, reason: '他的承诺被当成了别人的故事' },
      { characterId: 'xiaoxing', delta: 0, reason: '她的害怕混在招募消息里，很快就沉了' },
      { characterId: 'yeyu', delta: 0, reason: '他只是让频道开着' },
      { characterId: 'yuejian', delta: -1, reason: '她不在这个频道里' },
    ],
  },
  {
    id: 'L04-03.E.c',
    rating: 'C',
    title: '999+ 还是 999+',
    body:
      '什么也没有被排到一起。铃兰那行数字、小星那句话、铁壁那句承诺，各自待在各自的位置上。\n\n' +
      '夜语那句话仍然是全篇最上面的一句，可它这一次听起来不像安慰，像一句解释——解释为什么这里的人都学会了不说话。\n\n' +
      '铃兰把那行数字截了图，存在文件夹里，然后关掉了频道提醒。',
    requires: ALL,
    minSatisfied: 1,
    priority: 40,
    tendency: [
      { characterId: 'linglan', delta: -2, reason: '她把自己那行数字截图存了起来，然后关掉了提醒' },
      { characterId: 'xiaoxing', delta: -1, reason: '没有人回答她的害怕' },
      { characterId: 'tiebi', delta: 0, reason: '他的承诺没有翻出来' },
      { characterId: 'yeyu', delta: 0, reason: '他把沉默当成了陪伴，这一次没有成立' },
      { characterId: 'yuejian', delta: -1, reason: '她不在这个频道里——她从来不进这种地方' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=1 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L04-03.E.fallback',
  rating: 'C',
  title: '翻不完的那一屏',
  body: '那屏消息最终没有被翻到底。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L04_03: Letter = {
  id: 'L04-03',
  chapterId: 'ch04',
  title: '通讯贝999+',
  anchor: { phase: 'mature', space: 'linkshell' },
  preamble:
    '倾听者：\n\n' +
    '今天我把那个跨服频道从头翻到尾。九百多条，没有一条是找我的。\n\n' +
    '里面的人我都认识。有人在约本，有人在贴新搭的衣服，有人在问一个我刚进来时也问过的问题——那句话刷得太快，五秒钟就被顶下去了，没有人回答。\n\n' +
    '我盯着那句话看了很久。我想，如果这一屏话能排出另一个顺序，我是不是就不必一个人数这些数字。',
  signature: '——铃兰',
  blocks: [
    { id: 'L04-03.b1-yeyu-open', statementId: 'yeyu.growth.03', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'linglan.mature.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'xiaoxing.sprout.06', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'tiebi.growth.01', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L04-02'] },
}
