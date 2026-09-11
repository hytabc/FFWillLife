import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L02-04「错误的机制，正确的人」
 * 空间锚点 dungeon / 阶段 豆芽期（见 STORY-BIBLE §5.3）。出场：小星 · 铁壁 · 月见。
 *
 * 主题：机制弄错了，人没有错。那天小队里最好用的那个机制，是有人愿意先说「我不懂」。
 * B2 的原始空间是通讯贝，信件锚点在副本：搬动它，那句不懂就是从「打在频道里、
 * 可以装作没问」变成了「当着面问出口」——microshift 档。
 *
 * 排列覆盖（6 种，零兜底）：
 *   B1,B2,B3 → 2 条 → B      B1,B3,B2 → 2 条 → B
 *   B2,B1,B3 → 4 条 → S      B2,B3,B1 → 3 条 → A
 *   B3,B2,B1 → 1 条 → C      B3,B1,B2 → 1 条 → C
 */

const B1 = 'L02-04.b1-yuejian-takes-it'
const B2 = 'L02-04.b2-xiaoxing-noclue'
const B3 = 'L02-04.b3-tiebi-quiet-ok'

const relations: KeyRelation[] = [
  // 她先把「不懂」说出口，那口锅才有人认——认错的顺序是从最不懂的人开始往前排
  { id: 'L02-04.rel.noclue-before-takes-it', kind: 'precedes', subject: B2, object: B1 },
  // 她先承认了自己没听懂，铁壁那句「我能跟在你们后面吗」才是在回答她
  { id: 'L02-04.rel.noclue-before-quiet-ok', kind: 'precedes', subject: B2, object: B3 },
  // 先把账认下来，才有人敢说「我不说话也行」——否则那句话像是在求人收留
  { id: 'L02-04.rel.takes-it-before-quiet-ok', kind: 'precedes', subject: B1, object: B3 },
  // 那句「我到现在也没弄明白」不是在频道里打出来的，是当着面问的
  { id: 'L02-04.rel.asked-face-to-face', kind: 'displacedInto', subject: B2, tier: 'microshift' },
]

const ALL = [
  'L02-04.rel.noclue-before-takes-it',
  'L02-04.rel.noclue-before-quiet-ok',
  'L02-04.rel.takes-it-before-quiet-ok',
  'L02-04.rel.asked-face-to-face',
]

const endings: LetterEnding[] = [
  {
    id: 'L02-04.E.s',
    rating: 'S',
    title: '有人先说了「我不懂」',
    body:
      '她把那句「你们刚说的那个词，我到现在也没弄明白」当着所有人的面问了出来，而不是先偷偷记下来、回去自己查。\n\n' +
      '然后是月见。她说对不起，是她没奶上——这口锅她认得很快，快得像练过。这一句认下来，队里那根绷着的弦就松了。最后是铁壁，他说他也可以跟着，不说话也行。\n\n' +
      '那天没有人被责怪。很久以后她才明白：一个队伍里最好用的机制，是有人愿意先说「我不懂」。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'xiaoxing', delta: 2, reason: '她当着所有人的面承认了自己没听懂' },
      { characterId: 'yuejian', delta: 1, reason: '她把那口锅先认了下来，让紧绷的那根弦松了' },
      { characterId: 'tiebi', delta: 1, reason: '他说自己可以闭嘴跟着，把位置让给了新人' },
    ],
  },
  {
    id: 'L02-04.E.a',
    rating: 'A',
    title: '认账认晚了一步',
    body:
      '她当着面把「我到现在也没弄明白」问出了口。铁壁接着说，他可以跟着，不说话也行——这句话落在了月见的道歉前面。\n\n' +
      '等月见说「是我没奶上」的时候，那句道歉听起来像收尾的场面话，不像一次真的认账。机制最后还是弄明白了，只是谁都没有被安慰到。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'xiaoxing', delta: 1, reason: '她问出口了，可答案来得不是地方' },
      { characterId: 'yuejian', delta: 0, reason: '她的道歉排在了别人后面，听起来像客套' },
      { characterId: 'tiebi', delta: 0, reason: '他先把自己缩到了最小的位置' },
    ],
  },
  {
    id: 'L02-04.E.b',
    rating: 'B',
    title: '道歉成了一次流程',
    body:
      '月见先说了对不起。她说得很轻，像每一次那样熟练，于是那句话变成了一次流程——等她说完，别人就没有什么可说的了。\n\n' +
      '铁壁照旧说自己可以跟着，不说话也行。那天没有人被责怪，也没有人被安慰。机制最后是被谁弄错的，没有人再提。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yuejian', delta: 0, reason: '她的道歉太快，快成了一次流程' },
      { characterId: 'xiaoxing', delta: 0, reason: '她想问的那句话没有排上位置' },
      { characterId: 'tiebi', delta: 0, reason: '他照旧把自己缩到了最小' },
    ],
  },
  {
    id: 'L02-04.E.c',
    rating: 'C',
    title: '那样最好用的机制，那天没有出现',
    body:
      '铁壁那句「我能跟在你们后面吗？保证不出声」最先出口。一个坦克先说自己可以不出声，队里那股要认错的气就散了。\n\n' +
      '月见最后没有认那口锅，她只是说了一句「大家辛苦了」。小星也没有把那句不懂问出口——她把它记在纸上，回去自己查了很久。\n\n' +
      '那把副本打完了。那个机制她后来学会了，只是再想起来的时候，她记不清那天是谁跟她一起打的。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'xiaoxing', delta: -2, reason: '她把不懂留给了自己，一个人查了很久' },
      { characterId: 'tiebi', delta: -1, reason: '他先把自己缩到了最小，让别人无处可退' },
      { characterId: 'yuejian', delta: -1, reason: '她那天没有认账，也没有接住那句道歉的机会' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L02-04.E.fallback',
  rating: 'C',
  title: '散掉的队伍',
  body: '那把副本最后没有打完，队伍散了。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L02_04: Letter = {
  id: 'L02-04',
  chapterId: 'ch02',
  title: '错误的机制，正确的人',
  anchor: { phase: 'sprout', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '那天的队伍是铃兰组的局，我和铁壁是第二次一起打本。\n\n' +
    '打到一半，有人把一个机制弄错了，灭了。我坐在屏幕前等着有人先开口，结果谁都没有说话。\n\n' +
    '最后是我先说的对不起。这句话我很熟，熟得有点丢人——我刚玩的时候就是这么学会它的：先把错认下来，别人就不会怪你了。\n\n' +
    '我把那天前后说过的几句抄在这里。我想知道，如果最先说出口的不是抱歉，那天会不会不一样。',
  signature: '——月见',
  blocks: [
    { id: B1, statementId: 'yuejian.sprout.01', draggable: true, homeIndex: 0 },
    { id: B2, statementId: 'xiaoxing.sprout.05b', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'tiebi.sprout.03b', draggable: true, homeIndex: 2 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L02-03'] },
}
