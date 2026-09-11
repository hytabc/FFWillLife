import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * L03-04「复健」—— 第三章第四封。
 * 空间锚点 dungeon / 阶段 成熟期 / 出场 远山·小星·烈风（见 STORY-BIBLE §5.3）。
 *
 * 这是全章最疼的一封：远山走进副本想"复健"，可他的嘴还停在成长期。
 * B2、B4 都是他成长期在副本里说过的话，隔着一个阶段、同一个空间——
 * 一旦被拖到今夜来读，它们不再是战报，而是墓志铭。
 *
 * 小星一进门就把话说在了最前面（B1）：「固定队要是缺人，就喊我，我练熟了！」
 * 她如今是别人的队友了，这句话因此只能在信的开头出现一次——它是这一晚的底，
 * 不能被挪走，所以 B1 不可拖动。
 * 能被玩家挪动的，是她那句报机制的话，以及烈风和他自己的话。
 *
 * 判定轴：那晚他是先听别人说话，还是先自己开口。
 * 烈风那句「灭就灭了，下一把」必须先落地——它是一张"允许失败"的通行证。
 * 小星那句「这个机制我熟，我来标A点」也得先落地——她本来可以只当一个客人，
 * 却还是把这一场接了过去。
 *
 * 低档结局为 `yuanshan.D`（永别）与 `liefeng` 的疲惫埋线。
 */

const B2 = 'L03-04.b2-yuanshan-firstkill'
const B3 = 'L03-04.b3-liefeng-next-pull'
const B4 = 'L03-04.b4-yuanshan-farm'
const B5 = 'L03-04.b5-xiaoxing-mechanic'

/** 五条正向关系：满足越多，这趟复健越像"重新开始"，越不像"追悼"。 */
const relations: KeyRelation[] = [
  // 他成长期那句战报被拖进今夜：跨阶段同空间 → transform
  { id: 'L03-04.rel.firstkill-again', kind: 'displacedInto', subject: B2, tier: 'transform' },
  // 还有那句"之后全是伐木"——它属于当年那个不需要解释的夜晚
  { id: 'L03-04.rel.farm-again', kind: 'displacedInto', subject: B4, tier: 'transform' },
  // 先有人说了「灭就灭了」，他才敢提当年
  { id: 'L03-04.rel.next-pull-before-firstkill', kind: 'precedes', subject: B3, object: B2 },
  // 先有人说了「灭就灭了」，那句"当年怎么怎么样"才不至于变成炫耀
  { id: 'L03-04.rel.next-pull-before-farm', kind: 'precedes', subject: B3, object: B4 },
  // 先看见她把这一场接过去，他才敢提当年
  { id: 'L03-04.rel.mechanic-before-firstkill', kind: 'precedes', subject: B5, object: B2 },
]

const ALL = [
  'L03-04.rel.firstkill-again',
  'L03-04.rel.farm-again',
  'L03-04.rel.next-pull-before-firstkill',
  'L03-04.rel.next-pull-before-farm',
  'L03-04.rel.mechanic-before-firstkill',
]

const endings: LetterEnding[] = [
  {
    id: 'L03-04.E.s',
    rating: 'S',
    title: '他们把他一起等上来了',
    body:
      '那天晚上灭了三次。\n\n' +
      '小星是第一个开口的。她一进门就把话说得很干脆：「固定队要是缺人，就喊我，我练熟了！」——她如今是别人的队友了，这句话说出来的时候，她谁都没有看。\n\n' +
      '第一次灭完，是烈风接的话：「灭就灭了，下一把。」——没有谁被数落，没有人为自己的手生道歉。\n\n' +
      '她还站在标点的位置上：「这个机制我熟，我来标A点。」她把标点一个一个标出来，标得比这一趟需要的还细——那是一个人在替别人留出犯错的余地。\n\n' +
      '到这时候，远山才敢把当年的话拿出来说：「那把首杀是我们拿的，记录全金。」他说这句的时候，声音里没有得意——那是一个人在确认自己曾经真的活过那一段。他还说了「那会儿首周我们就过了，之后全是伐木」——这句话原本是战报，今夜读起来是：后来那些一起伐木的人，一个都不在了。\n\n' +
      '三个人在副本门口站了很久。\n\n' +
      '复健的结果不是他找回了当年的手速。是他终于肯走在队伍的最后面，等一个走得慢的人。',
    requires: ALL,
    minSatisfied: 5,
    priority: 10,
    tendency: [
      { characterId: 'yuanshan', delta: 2, reason: '他在灭团之后才敢提当年，说的是确认，不是炫耀' },
      { characterId: 'xiaoxing', delta: 2, reason: '她在开头就替他留了位置，又先把机制接了过去' },
      { characterId: 'liefeng', delta: 1, reason: '「灭就灭了，下一把」是他给的通行证' },
    ],
  },
  {
    id: 'L03-04.E.a',
    rating: 'A',
    title: '打完了，也说话了',
    body:
      '灭团之后烈风说了「灭就灭了，下一把」，场面没有僵住。\n\n' +
      '远山也提了几句当年，提得稍微早了一点，听起来有点像在给自己找台阶。小星报机制的那句「这个机制我熟，我来标A点」和他说的话错开了半步——她本来是想把这个场子接住的，只是没接上。\n\n' +
      '三个人打完，散了。他在副本门口站了一会儿才走。\n\n' +
      '这趟复健算不上舒服，但他第二天又上线了。',
    requires: ALL,
    minSatisfied: 4,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 1, reason: '他提当年提得早了一点，但队伍没散' },
      { characterId: 'xiaoxing', delta: 1, reason: '她陪着打完了这一趟，只是没有把话说满' },
      { characterId: 'liefeng', delta: 0, reason: '他说了「下一把」，但没有多说什么' },
    ],
  },
  {
    id: 'L03-04.E.b',
    rating: 'B',
    title: '把机制走完了而已',
    body:
      '灭了一次，第二次过了。没有人提当年，也没有人提以后。\n\n' +
      '远山的手确实生了不少，他自己知道，别人也知道——只是谁都没有说。小星报机制报得很稳，稳得像在带一个不熟的人。\n\n' +
      '那几句他当年说过的话，全程都没有出口。\n\n' +
      '副本门口散场的时候，三个人互相说了「辛苦了」。这是一句很安全的话，安全到让人听不出多少温度。',
    requires: ALL,
    minSatisfied: 3,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他把这一趟打完了，仅此而已' },
      { characterId: 'xiaoxing', delta: 0, reason: '她负责标点，也负责不让人难堪' },
      { characterId: 'liefeng', delta: 0, reason: '他没有多说一个字' },
    ],
  },
  {
    id: 'L03-04.E.c',
    rating: 'C',
    title: '他先说了当年',
    body:
      '最先出口的是他自己那句：「那会儿首周我们就过了，之后全是伐木。」\n\n' +
      '这句话在灭团之后落下来，效果和它该有的完全相反——它听起来像是在说：你们现在这样，是因为你们不够好。\n\n' +
      '小星那句「这个机制我熟，我来标A点」说出来的时候，他已经把当年讲完了——那句话本来是要接住这一场的，等它落地，场子已经凉了。烈风那句「灭就灭了」也没有接上，他后来只是平静地把队伍解散了，一句多余的话都没有。\n\n' +
      '远山一个人在副本门口站着。他知道刚才那句话错了，但他不知道错在哪里。',
    requires: ALL,
    minSatisfied: 2,
    priority: 40,
    tendency: [
      { characterId: 'yuanshan', delta: -1, reason: '他先说了当年，把复健变成了一场比较' },
      { characterId: 'xiaoxing', delta: -1, reason: '她那句「我来标A点」喊晚了半步，善意没有落到地上' },
      { characterId: 'liefeng', delta: -1, reason: '他的「下一把」被咽了回去' },
    ],
  },
  {
    id: 'L03-04.E.d',
    rating: 'D',
    title: '他在墓前做了一次复健',
    body:
      '那两句当年的话，他一句都没有挪，就这么摆在了这一晚的最前面。\n\n' +
      '「那把首杀是我们拿的，记录全金。」——话落在最前面，等于告诉在场的人：你们的这一晚，不配和我当年比。\n\n' +
      '小星报完机制的手还停在半空里。她小声问了一句「要不要再来一把」，他没有听见。\n\n' +
      '烈风什么都没说。他后来下线得很安静，安静得连「辛苦了」都没有回。那种疲惫不是生气，是比生气更难修的东西——他见过太多把队伍当成纪念堂的人了。\n\n' +
      '远山那天晚上在副本门口站到天快亮。他终于明白，他回不去的不是副本。\n\n' +
      '他回不去的是那个有人愿意等他手生的队伍。而那个队伍，是他自己刚刚亲手赶走的。\n\n' +
      '倾听者，这一晚影响的不只是在场那三个人。烈风带着这种疲惫回去以后，会慢慢变成另外一个人——而队里那个总替所有人打圆场、总是笑着把话接住的人，从这之后上线的时间会越来越短。她从来没有听说过远山的名字。她只是发现，有人回来了之后，大家反而更累了。',
    requires: ALL,
    minSatisfied: 0,
    priority: 50,
    tendency: [
      { characterId: 'yuanshan', delta: -2, reason: '他先摆出了当年的战绩，把这一晚变成了比较——他从此没有再上线' },
      { characterId: 'xiaoxing', delta: -1, reason: '她报完机制，又小声问了一句还要不要来一把，他没有听见' },
      { characterId: 'liefeng', delta: -1, reason: '他安静地下线了，连「辛苦了」都没有回' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'L03-04.E.fallback',
  rating: 'D',
  title: '没有排出来的那一晚',
  body: '那一晚的复健最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const L03_04: Letter = {
  id: 'L03-04',
  chapterId: 'ch03',
  title: '复健',
  anchor: { phase: 'mature', space: 'dungeon' },
  preamble:
    '倾听者：\n\n' +
    '我决定去副本里走一趟。说是复健，其实就是想看看自己还剩多少。\n\n' +
    '来的人不多：一个是我刚认识不久的小姑娘，她现在已经能给别人报机制了；还有一个比我更快就不耐烦的年轻人。\n\n' +
    '那天晚上灭了三次。我把我说过的话抄在这里了，包括几句很久以前我在副本里说过的话——它们现在听起来，我自己都觉得陌生。\n\n' +
    '你可以把它们拖到今晚来读一次。反正手生了这件事，瞒不过副本。',
  signature: '——远山',
  blocks: [
    { id: 'L03-04.b1-xiaoxing-call-me', statementId: 'xiaoxing.growth.02', draggable: false, homeIndex: 0 },
    { id: B2, statementId: 'yuanshan.growth.01b', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'liefeng.mature.02', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yuanshan.growth.02', draggable: true, homeIndex: 3 },
    { id: B5, statementId: 'xiaoxing.growth.01', draggable: true, homeIndex: 4 },
  ],
  relations,
  endings,
  fallbackEnding,
  unlock: { kind: 'complete', letterIds: ['L03-03'] },
}
