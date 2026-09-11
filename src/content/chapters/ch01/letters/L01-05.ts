import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L01-05「第一张全家福」—— 第一章收束。
 * 空间锚点 dungeon / 阶段 成长期（见 STORY-BIBLE §5.3）。出场：晨曦 · 月见 · 烈风。
 *
 * 主题：进度重要，还是人重要？谁先松口，决定了这张合影是真心还是摆拍。
 *
 * 注意 `last` 用在可拖块上是**可以满足的**——本信的固定块在首位（索引 0），
 * 末尾索引 3 始终由可拖块占据。这与固定块在中间或末尾的信件不同。
 *
 *   B2 月见提议休息  ·  B3 烈风认自己的账  ·  B4 烈风嫌人拖后腿
 */

const B2 = 'L01-05.b2-yuejian-rest'
const B3 = 'L01-05.b3-liefeng-selfblame'
const B4 = 'L01-05.b4-liefeng-blame'

const relations: KeyRelation[] = [
  // 烈风先认自己的账，再去说别人
  { id: 'L01-05.rel.selfblame-before-blame', kind: 'precedes', subject: B3, object: B4 },
  // 月见先提议休息，烈风才可能松口
  { id: 'L01-05.rel.rest-before-blame', kind: 'precedes', subject: B2, object: B4 },
  // 月见的休息提议说在烈风认账之前
  { id: 'L01-05.rel.rest-before-selfblame', kind: 'precedes', subject: B2, object: B3 },
  // 烈风最后一个松口——他攥得最紧，所以他的松口最值钱
  { id: 'L01-05.rel.selfblame-last', kind: 'last', subject: B3 },
  // 认账紧挨着指责：他刚认完自己的错，紧接着说别人，力道就轻了
  { id: 'L01-05.rel.selfblame-then-blame', kind: 'adjacent', subject: B3, object: B4 },
]

const ALL = [
  'L01-05.rel.selfblame-before-blame',
  'L01-05.rel.rest-before-blame',
  'L01-05.rel.rest-before-selfblame',
  'L01-05.rel.selfblame-last',
  'L01-05.rel.selfblame-then-blame',
]

const endings: LetterEnding[] = [
  {
    id: 'L01-05.E.s',
    rating: 'S',
    title: '这张照片是真的',
    body: '月见先说她这把打不动了，想歇会儿。然后是烈风——他翻出自己的记录，认了那句「输出没打满」，最后才轮到那句难听的，而它已经伤不到谁了。他最后一个松口，也是松得最彻底的。快门按下去的时候，四个人都在笑。',
    requires: ALL,
    minSatisfied: 4,
    priority: 10,
    tendency: [
      { characterId: 'liefeng', delta: 2, reason: '他最后一个松口，也最彻底' },
      { characterId: 'yuejian', delta: 2, reason: '她先承认了自己想歇一歇' },
      { characterId: 'chenxi', delta: 1, reason: '他先说了「灭了算我的」，把责任揽了下来' },
    ],
  },
  {
    id: 'L01-05.E.a',
    rating: 'A',
    title: '他先认了账',
    body: '烈风翻出记录，说了句「这把我炒股了，输出没打满」——这句话排在最后，等它出口的时候，那句难听的已经说完了。可他到底还是回头看了自己一眼。照片留下了，他的表情还有点僵，但至少是站在人群里的。',
    requires: ALL,
    minSatisfied: 3,
    priority: 20,
    tendency: [
      { characterId: 'liefeng', delta: 2, reason: '他最后还是认了自己的账' },
      { characterId: 'yuejian', delta: 1, reason: '她的提议让这一晚有了台阶' },
      { characterId: 'chenxi', delta: 0, reason: '他没有多说什么' },
    ],
  },
  {
    id: 'L01-05.E.b',
    rating: 'B',
    title: '话都说了，谁也没接住谁',
    body: '月见提议休息，烈风认了自己的账，那句难听的也落在了别人身上——三句话都在，只是各说各的。照片最后是拍了，四个人都在，只是没有人看镜头。',
    requires: ALL,
    minSatisfied: 2,
    priority: 30,
    tendency: [
      { characterId: 'liefeng', delta: 0, reason: '他认了账，但话还是说重了' },
      { characterId: 'yuejian', delta: 0, reason: '她的提议被当成了客套' },
      { characterId: 'chenxi', delta: 0, reason: '他维持住了队伍的体面' },
    ],
  },
  {
    id: 'L01-05.E.c',
    rating: 'C',
    title: '没拍成的那张合影',
    body: '烈风那句「你们别拖我后腿」最先出口，然后才轮到认账，最后是月见收拾场面。等大家想起来要合影的时候，已经很晚了，没有人再提。很久以后月见翻截图文件夹，发现第一章里一张合照都没有——不是没拍，是没有人想起来要拍。',
    requires: ALL,
    minSatisfied: 0,
    priority: 40,
    tendency: [
      { characterId: 'liefeng', delta: -2, reason: '他先划了界限，把别人挡在外面' },
      { characterId: 'chenxi', delta: -2, reason: '他没能把队伍拢在一起' },
      { characterId: 'yuejian', delta: -1, reason: '她又成了那个收拾场面的人' },
    ],
  },
]

const fallbackEnding: LetterEnding = {
  id: 'L01-05.E.fallback',
  rating: 'C',
  title: '没有留下的那一晚',
  body: '那一晚没有留下任何东西。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L01_05: Letter = {
  id: 'L01-05',
  chapterId: 'ch01',
  title: '第一张全家福',
  anchor: { phase: 'growth', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '我们第一次合影，是在一起打完第一个高难周之后。\n\n' +
    '那天有人提议拍一张，然后就冷场了。大家都不太想说第一句话。\n\n' +
    '我后来常常看那张照片。我想知道，那天如果换一个顺序把话说开，照片里的我们会不会更像我们。',
  signature: '——晨曦',
  blocks: [
    { id: 'L01-05.b1-chenxi', statementId: 'chenxi.growth.03', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yuejian.growth.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'liefeng.growth.02', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'liefeng.growth.03', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L01-04'] },
}
