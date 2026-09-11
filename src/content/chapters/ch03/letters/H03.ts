import type { KeyRelation, Letter, LetterEnding } from '../../../../engine/types'

/**
 * H03「首杀那天的语音」—— 第三章隐藏信。**全书唯一一封走向崩坏（rating: X）的信。**
 * 空间锚点 linkshell / 阶段 成长期 / 出场 远山·铁壁（见 STORY-BIBLE §5.3）。
 *
 * 机制：本信四句全部可拖，且被拖动的每一句都会改变含义——
 *
 *  - B1 铁壁豆芽期那句「我可以跟着你们吗？我不说话也行。」（sprout/linkshell）
 *    与信件锚点同空间、差一个阶段 → 拖动即 `transform`（本章解锁档位）。
 *  - B2 远山成长期那句战报（growth/dungeon）→ 拖动即 `microshift`。
 *  - B3 远山成长期那句「开荒那阵子，低保每周都拿满。」→ 同空间同阶段，重排。
 *  - B4 远山成熟期那句「至少我的公寓还在。」（mature/city）——
 *    它是**从未来漏进来的那句话**。跨阶段跨空间，本章未解锁该档位，
 *    因此它不写进任何 displacedInto；崩塌靠的是**时序**：
 *    只要它先于那句战报出口（`precedes`），今晚就完了。
 *
 * 崩坏不是坐标推出来的（PRD 裁定 #8），是这封信主动选择的结局：
 * 未来的自己把那句话放回了首杀的那一夜——那一夜他第一次赢，
 * 而他听见自己说「至少……还在」。**「至少」意味着别的都已经不在了。**
 */

const B1 = 'H03.b1-tiebi-let-me-listen'
const B2 = 'H03.b2-yuanshan-firstkill'
const B3 = 'H03.b3-yuanshan-farming'
const B4 = 'H03.b4-yuanshan-apartment'

const relations: KeyRelation[] = [
  // 未来的那句话先出口：它一旦先于那一刻被听见，这一夜就永远回不去了
  { id: 'H03.rel.future-before-firstkill', kind: 'precedes', subject: B4, object: B2 },
  // 同上，先于另一句：他还没来得及清点自己赢到了什么，就先听见了自己剩下什么
  { id: 'H03.rel.future-before-farming', kind: 'precedes', subject: B4, object: B3 },
  // 铁壁那句求着旁听的话被拉近了一个阶段：同一句话，换个年纪说，含义完全质变
  { id: 'H03.rel.let-me-listen-comes-of-age', kind: 'displacedInto', subject: B1, tier: 'transform' },
  // 那句战报被搬离了副本，落进频道的笑声里
  { id: 'H03.rel.firstkill-elsewhere', kind: 'displacedInto', subject: B2, tier: 'microshift' },
  // 未来的那句话留在了它自己的年份里：录音原封不动，这一夜还是完整的
  { id: 'H03.rel.future-left-alone', kind: 'displacedInto', subject: B4, tier: 'none' },
]

const ALL = [
  'H03.rel.future-before-firstkill',
  'H03.rel.future-before-farming',
  'H03.rel.let-me-listen-comes-of-age',
  'H03.rel.firstkill-elsewhere',
  'H03.rel.future-left-alone',
]

const endings: LetterEnding[] = [
  {
    id: 'H03.E.x',
    rating: 'X',
    title: '那一天塌了',
    body:
      '「至少我的公寓还在。」\n\n' +
      '这句话落在了那声欢呼之前。\n\n' +
      '频道里全是他熟悉的声音，有人在喊，有人破了音，有人笑到说不出话。然后他听见了自己——同一个人的声音，同一个音色，只是老了很多年——在自己赢下一切的那一秒之前，先说了一句：至少我的公寓还在。\n\n' +
      '「至少」。\n\n' +
      '他是在说这句话的时候才明白「至少」是什么意思的：它的意思是，别的东西都已经不在了。房子没了，队伍没了，名单全灰了，只剩下那一间可以锁上门的屋子——所以他才说「至少」。\n\n' +
      '而这句话，是他站在赢得一切的那一刻之前，从自己嘴里听见的。\n\n' +
      '那一晚的欢呼没有停。它继续了整整两分钟，录音里所有的人都在笑，包括他自己。只有他知道，那两分钟里的每一次笑，都已经是在为一个还没有输掉的结局提前道别。\n\n' +
      '铁壁当时也在频道里。他后来花了很多年去回想，那天晚上到底哪里不对——他想不起来，他只知道从那一晚开始，他就再也做不到把人踢出队伍了。\n\n' +
      '你听懂了最难受的那部分了吗，倾听者。\n\n' +
      '崩坏从来不像崩坏。它看起来是一个很暖的晚上，一群人刚刚赢了，一个年轻人正在放声大笑。只是从那一秒起，他再也没有办法完整地回忆起自己最高兴的那一天了——因为那个句子的前半截，永远先到。',
    requires: ['H03.rel.future-before-firstkill', 'H03.rel.future-before-farming'],
    minSatisfied: 1,
    priority: 10,
    tendency: [
      { characterId: 'yuanshan', delta: -2, reason: '他听见未来的自己在那晚之前先开了口——他最高兴的那一天从此有了裂缝' },
      { characterId: 'tiebi', delta: -1, reason: '那一晚他也在频道里，他后来一直在想哪里不对' },
    ],
  },
  {
    id: 'H03.E.b',
    rating: 'B',
    title: '录音原封不动',
    body:
      '你把那句话留在了它自己的年份里。\n\n' +
      '录音里只有那一晚该有的东西：机制报点、灭团之后的骂声、最后那一声欢呼，还有铁壁在频道角落里很小声地说「我可以跟着你们吗？我不说话也行」——他没有被谁批准，他就那样一直在。\n\n' +
      '这一晚是完整的。他没有提前知道任何事。\n\n' +
      '很多年以后他重新听这卷录音，听到的全是当年的自己。那是一个还不知道「至少」是什么意思的人。\n\n' +
      '倾听者，这是最好的结果了。\n\n' +
      '但那句话还在那里。它只是还没有被送到那个晚上。',
    requires: ['H03.rel.future-left-alone'],
    minSatisfied: 1,
    priority: 20,
    tendency: [
      { characterId: 'yuanshan', delta: 0, reason: '他把那句话留在了它自己的年份里，那一晚得以完整' },
      { characterId: 'tiebi', delta: 0, reason: '录音里他还是那个不被批准也一直留着的人' },
    ],
  },
  {
    id: 'H03.E.c',
    rating: 'C',
    title: '它被夹在了中间',
    body:
      '那句话没有先出口，所以那一晚的欢呼还是干净的；它也没有留在自己的年份里，所以它仍然在录音中。\n\n' +
      '它被夹在中间。听起来像一句玩笑，像一句喝多了以后的胡话，像是谁把麦克风忘在了另一个房间里。\n\n' +
      '播到这里的时候，很多人会笑。\n\n' +
      '只有他会沉默一下，然后继续往下听。\n\n' +
      '倾听者，这是最接近「什么都没发生」的一种结果。也是最能让人一直听下去的一种结果——因为每一次重听，他都想知道，那句话会不会有一次是先出口的。',
    requires: ALL,
    minSatisfied: 0,
    priority: 30,
    tendency: [
      { characterId: 'yuanshan', delta: -1, reason: '那句话被夹在了中间，他从此一遍遍地重听这卷录音' },
      { characterId: 'tiebi', delta: 0, reason: '他听不出那里面有什么不对' },
    ],
  },
]

/** 类型层安全网。最低档 minSatisfied=0 覆盖全部排列，此处永不触发。 */
const fallbackEnding: LetterEnding = {
  id: 'H03.E.fallback',
  rating: 'C',
  title: '没有排出来的那一晚',
  body: '那卷录音最终没有排出一个结果。',
  requires: [],
  priority: 999,
  tendency: [],
}

export const H03: Letter = {
  id: 'H03',
  chapterId: 'ch03',
  title: '首杀那天的语音',
  anchor: { phase: 'growth', space: 'linkshell' },
  hidden: true,
  preamble:
    '倾听者：\n\n' +
    '这封信里没有正文。我抄下来的是一卷录音的字幕。\n\n' +
    '很多年前的一个晚上，我们打赢了一场很难的仗。那天晚上频道里全是笑声，有人喊得破了音，有人在背景里唱跑了调。\n\n' +
    '后来大家都在那里，包括一个求着要旁听、说自己不说话也行的小家伙。\n\n' +
    '我一直留着这卷录音。前几天我又听了一遍，听到了一个不该在里面的句子。\n\n' +
    '你可以把那几句话拖到那个晚上去，也可以把它留在它自己的年份里。我只是想知道，那句话到底是从哪儿来的。',
  signature: '——很多年以后重听这卷录音的远山',
  blocks: [
    { id: B1, statementId: 'tiebi.sprout.03', draggable: true, homeIndex: 0 },
    { id: B2, statementId: 'yuanshan.growth.01', draggable: true, homeIndex: 1 },
    { id: B3, statementId: 'yuanshan.growth.03', draggable: true, homeIndex: 2 },
    { id: B4, statementId: 'yuanshan.mature.02', draggable: true, homeIndex: 3 },
  ],
  relations,
  endings,
  fallbackEnding,
  // 隐藏信：通关第三章后解锁
  unlock: { kind: 'rating', letterId: 'L03-05', ratings: ['S', 'A', 'B', 'C', 'D', 'X', 'echo'] },
}
