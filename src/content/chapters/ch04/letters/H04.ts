import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * H04「面具与真名」—— 第四章隐藏信，回响结局（PRD：跨空间 + 跨时间组合）。
 * 空间锚点 rp-venue / 阶段 成熟期（见 STORY-BIBLE §5.3）。出场：夜语 · 铃兰 · 小星。
 *
 * 机制：本信**必须**同时用到两处 `high`（跨阶段 + 跨空间）——
 * 小星豆芽期那句「零式是什么，我这种新人可以去吗？」和铃兰豆芽期那句「认识一下吧？我带你进通讯贝。」
 * 都是从很久以前、另一个地方被拖进这家店的。
 *
 * 回响的触发条件是**唯一一个排列**：
 *   小星的问题 → 铃兰的邀请 → 夜语的自白（B3 → B4 → B2）
 * 两条 `high` 全部落地，且那句「分不清角色内和角色外了」被排在最后——
 * 先问的人还没进来，拉人的人还不知道自己会留下什么，而那个已经分不清的人最后才开口。
 * 这时玩家看见的不是三个人的故事，是同一个人的三个时点。
 *
 * 排列与分档（已逐排列验证：{1,2,3,5,3,3}）：
 *   B3 B4 B2 → 5 = echo  唯一
 *   B3 B2 B4 → 3 = S  /  B4 B2 B3 → 3 = S  /  B4 B3 B2 → 3 = S
 *   B2 B4 B3 → 2 = A  两条时点都对，但顺序反着
 *   B2 B3 B4 → 1 = B  什么都没动：信被原样读完
 * 最低档 minSatisfied=1 覆盖全部排列，兜底永不触发。
 */

const B2 = 'H04.b2-yeyu-confess'
const B3 = 'H04.b3-xiaoxing-ask'
const B4 = 'H04.b4-linglan-invite'

const relations: KeyRelation[] = [
  // 那个还没进来的人的问题被拖到了这里（跨时间 + 跨空间）
  { id: 'H04.rel.question-carried-across', kind: 'displacedInto', subject: B3, tier: 'high' },
  // 那句很多年前的邀请也被拖到了这里（跨时间 + 跨空间）
  { id: 'H04.rel.invite-carried-across', kind: 'displacedInto', subject: B4, tier: 'high' },
  // 提问在最前：先有那个站在门口不敢进来的人
  { id: 'H04.rel.question-before-invite', kind: 'precedes', subject: B3, object: B4 },
  // 邀请在自白之前：有人先递了手，那个分不清的人才敢开口
  { id: 'H04.rel.invite-before-confess', kind: 'precedes', subject: B4, object: B2 },
  // 顺序的最后一项：自白排在最后，它才是答案而不是开场白
  { id: 'H04.rel.question-before-confess', kind: 'precedes', subject: B3, object: B2 },
]

const ALL = [
  'H04.rel.question-carried-across',
  'H04.rel.invite-carried-across',
  'H04.rel.question-before-invite',
  'H04.rel.invite-before-confess',
  'H04.rel.question-before-confess',
]

const endings: LetterEnding[] = [
  {
    id: 'H04.E.echo',
    rating: 'echo',
    title: '回响 · 面具后面的那个人一直在',
    body:
      '「零式是什么，我这种新人可以去吗？」\n\n' +
      '——问这句话的人，那时候连这个名字都念不利索。她还站在门口，还没有进来。\n\n' +
      '「认识一下吧？我带你进通讯贝。」\n\n' +
      '——说这句话的人，那时候以为自己只是在收集人。她不知道很多年以后，会有一个人的话靠这句话活着。\n\n' +
      '「分不清哪一句是自己的了。」\n\n' +
      '——说这句话的人最后才开口。他戴着面具走了太久，久到忘了自己是从哪一步开始的。\n\n' +
      '现在你把这三句话排在一起，它们中间隔着一整个成长的距离，却被放在了同一个晚上。\n\n' +
      '你看清了：那个站在门口的人、那个递出邀请的人、那个已经分不清的人——\n' +
      '不是三种人。是同一个人，在不同的时间里，被同一件事难住。\n\n' +
      '面具的名字是他自己的名字。他从来都只是没敢应声。\n\n' +
      '这就是回响：你没有改动任何人的命运，只是终于看见了他们本来就是同一个人。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yeyu', delta: 2, reason: '你把他的自白排在最后，让它成了一句话的答案，而不是开场白' },
      { characterId: 'xiaoxing', delta: 2, reason: '你让那个还站在门口的人，成了整封信的第一句' },
      { characterId: 'linglan', delta: 2, reason: '她那句随手的邀请，被你放在了它真正起了作用的位置' },
    ],
  },
  {
    id: 'H04.E.s',
    rating: 'S',
    title: '有一个人先递了手',
    body:
      '三句话都在，顺序大体也对，只有一处错位。\n\n' +
      '也许是小星的问题没有排在最前，也许是铃兰那句邀请落在了别处——结果就是，夜语那句话成了一个还没被问到就开始回答的答案。\n\n' +
      '他说的仍然是真话。只是那句话摔在地上，没有人接。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'yeyu', delta: 1, reason: '他的自白说在了被问之前' },
      { characterId: 'linglan', delta: 1, reason: '她的邀请放到了一边' },
      { characterId: 'xiaoxing', delta: 1, reason: '她的问题被夹在了中间' },
    ],
  },
  {
    id: 'H04.E.a',
    rating: 'A',
    title: '两端的时间都对上了',
    body:
      '两个很久以前的声音都被拖到了这一个晚上，这让这家店同时站着好几个人。\n\n' +
      '只是它们的顺序反了——递手的人排在了被递手的人前面，而那句自白插在中间，像一句插科打诨。\n\n' +
      '夜语说完之后自己先笑了。他说，这话我好像说过。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'yeyu', delta: 0, reason: '他听见自己说了一句重复过的话' },
      { characterId: 'linglan', delta: 1, reason: '她的手递得早了一点' },
      { characterId: 'xiaoxing', delta: 0, reason: '她还没有准备好接' },
    ],
  },
  {
    id: 'H04.E.b',
    rating: 'B',
    title: '你把这封信原样读完了',
    body:
      '三句话各归各位，谁也没有被拖到别人的时间里。\n\n' +
      '这是一封很整齐的信。夜语回头，小星提问，铃兰邀请——每一句都待在自己该待的地方，隔着一整个成长的距离，互不相干。\n\n' +
      '你要是愿意，可以把它们挪一挪。有些东西只有错开位置才看得见。',
    requires: ALL,
    minSatisfied: 1,
    priority: 40,
    tendency: [
      { characterId: 'yeyu', delta: 0, reason: '他没有分不清' },
      { characterId: 'linglan', delta: 0, reason: '她只是又拉了一个人进来' },
      { characterId: 'xiaoxing', delta: 0, reason: '她还是那个站在门口的人' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=1 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'H04.E.fallback',
  rating: 'B',
  title: '没有落地的回响',
  body: '这封信没有被排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const H04: Letter = {
  id: 'H04',
  chapterId: 'ch04',
  title: '面具与真名',
  anchor: { phase: 'mature', space: 'rp-venue' },
  hidden: true,
  preamble:
    '倾听者：\n\n' +
    '这封信不是我写下的。是有人把它放在那家店的桌上——两张纸，字迹不一样，一张很旧，一张是新的。\n\n' +
    '旧的那张上，是一个刚进来的人问的一句话。新的那张上，是一句「认识一下吧」。\n\n' +
    '我把它们和我的那句话放在了一起。你要是愿意，替我排一排：一个还在外面的人、一个把别人拉进来的人、一个不知道自己算哪一种的人——他们的话谁先说，会决定什么。',
  signature: '——夜语',
  blocks: [
    { id: 'H04.b1-yeyu-turn', statementId: 'yeyu.mature.02d', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yeyu.mature.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'xiaoxing.sprout.02d', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'linglan.sprout.01c', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  // 隐藏信：通关第四章后解锁
  unlock: { kind: 'rating', letterId: 'L04-05', ratings: ['S', 'A', 'B', 'C', 'D', 'X', 'echo'] },
}
