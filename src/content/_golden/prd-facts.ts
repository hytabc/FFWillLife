/**
 * 黄金契约 —— 从 docs/PRD.md 逐条转录的事实。
 *
 * 这个文件不是"又一份数据"，而是**护栏**：它把 PRD 里已经裁定过的
 * 角色结局名、牵制边、章节结构、隐藏信件冻结成代码常量，
 * 让 28 封信的内容生产无法悄悄偏离设计。
 *
 * 校验器会拿 content/ 下的真实内容与本文件逐一比对，任何漂移都会失败。
 * **修改本文件等同于修改 PRD —— 需要同步更新 docs/PRD.md。**
 */

import type { ChapterId, CharacterId, LetterId, TimePhase } from '../../engine/types'

// ============================================================================
// 角色（PRD §6）
// ============================================================================

export interface GoldenCharacter {
  id: CharacterId
  name: string
  role: string
  /** 结局名按评级索引。已应用 PRD 裁定 #1~#4。 */
  endingNames: { rating: 'S' | 'A' | 'B' | 'C' | 'D'; name: string; id: string }[]
  /** 该角色是否另有带外结局（X / 回响） */
  outOfBand?: { rating: 'X' | 'echo'; name: string; id: string }
  /** 四阶段的代表语句（黑话版本），用于防止语气漂移 */
  signatureLines: Record<TimePhase, string>
}

export const GOLDEN_CHARACTERS: readonly GoldenCharacter[] = [
  {
    id: 'chenxi',
    name: '晨曦',
    role: '坦克 / 固定队队长',
    endingNames: [
      { rating: 'S', name: '传承', id: 'chenxi.S' },
      { rating: 'A', name: '坚守', id: 'chenxi.A' },
      { rating: 'B', name: '缺口', id: 'chenxi.B' },
      { rating: 'C', name: '独行', id: 'chenxi.C' },
      { rating: 'D', name: '熄灭', id: 'chenxi.D' },
    ],
    signatureLines: {
      sprout: '我能当MT吗？我怕仇恨拉不稳。',
      growth: '钢铁月环我来吃，你们放心输出。',
      mature: '首周过不了没关系，别把亲友打散了。',
      mentor: '豆芽慢慢来，我当初也是躺尸过来的。',
    },
  },
  {
    id: 'yuejian',
    name: '月见',
    role: '治疗 / 社交粘合剂',
    endingNames: [
      { rating: 'S', name: '觉悟', id: 'yuejian.S' },
      { rating: 'A', name: '调和', id: 'yuejian.A' },
      { rating: 'B', name: '隐忍', id: 'yuejian.B' },
      { rating: 'C', name: '疲惫', id: 'yuejian.C' },
      { rating: 'D', name: '断裂', id: 'yuejian.D' },
    ],
    signatureLines: {
      sprout: '对不起，是我没奶上，锅我背。',
      growth: '大家辛苦了，这把灭了先休息吧。',
      mature: '我也有奶不动的时候，别什么都指望H1。',
      mentor: '奶妈也要记得给自己留蓝，别把复活全交出去。',
    },
  },
  {
    id: 'liefeng',
    name: '烈风',
    role: '龙骑士 / 极限输出',
    endingNames: [
      { rating: 'S', name: '巅峰', id: 'liefeng.S' },
      { rating: 'A', name: '和解', id: 'liefeng.A' },
      { rating: 'B', name: '独行', id: 'liefeng.B' },
      { rating: 'C', name: '沉默', id: 'liefeng.C' },
      { rating: 'D', name: '退场', id: 'liefeng.D' },
    ],
    signatureLines: {
      sprout: '这个循环我在木桩前练了三十遍。',
      growth: '炒不到80+就别来零式了。',
      mature: '狂暴就狂暴了，再开一把。',
      mentor: '你这个logs比我当年好看多了。',
    },
  },
  {
    id: 'tiebi',
    name: '铁壁',
    role: '部队长',
    endingNames: [
      // 裁定 #3：与「小星 S 薪火·远行」区分
      { rating: 'S', name: '薪火·守夜', id: 'tiebi.S' },
      { rating: 'A', name: '放手', id: 'tiebi.A' },
      // 裁定 #1：以角色结局线为准，B = 缺口
      { rating: 'B', name: '缺口', id: 'tiebi.B' },
      { rating: 'C', name: '疲惫', id: 'tiebi.C' },
      { rating: 'D', name: '解散', id: 'tiebi.D' },
    ],
    signatureLines: {
      sprout: '有人能带我打日随吗？豆芽求带。',
      growth: '我想建一个不踢AFK成员的部队。',
      mature: 'FC不是我一个人的，房子也是大家的。',
      mentor: '欢迎回部队，房屋永远给你留了位置。',
    },
  },
  {
    id: 'xiaoxing',
    name: '小星',
    role: '豆芽 → 导师',
    endingNames: [
      // 裁定 #3：与「铁壁 S 薪火·守夜」区分
      { rating: 'S', name: '薪火·远行', id: 'xiaoxing.S' },
      { rating: 'A', name: '同行', id: 'xiaoxing.A' },
      { rating: 'B', name: '远行', id: 'xiaoxing.B' },
      { rating: 'C', name: '褪色', id: 'xiaoxing.C' },
      { rating: 'D', name: '碎裂', id: 'xiaoxing.D' },
    ],
    // 裁定 #4：X 级结局正式命名为「回响·闭环」，避免与评级「回响」混淆
    outOfBand: { rating: 'X', name: '回响·闭环', id: 'xiaoxing.X' },
    signatureLines: {
      sprout: '绝本是什么？豆芽能进吗？',
      growth: '这个机制我熟，我来标A点。',
      mature: '狂暴了没关系，再渡一次劫。',
      mentor: '豆芽慢慢来，我当初也是被人拖过本的。',
    },
  },
  {
    id: 'yuanshan',
    name: '远山',
    role: 'AFK 回归老兵',
    endingNames: [
      { rating: 'S', name: '重生', id: 'yuanshan.S' },
      { rating: 'A', name: '接纳', id: 'yuanshan.A' },
      { rating: 'B', name: '遗憾', id: 'yuanshan.B' },
      { rating: 'C', name: '疏离', id: 'yuanshan.C' },
      { rating: 'D', name: '永别', id: 'yuanshan.D' },
    ],
    signatureLines: {
      sprout: '总有一天我要首周过绝本。',
      growth: '首杀拿到了，logs全金。',
      mature: '好友列表全灰了，FC房子也被回收了。',
      mentor: '回来就好，副本没变，我带你复健。',
    },
  },
  {
    id: 'yeyu',
    name: '夜语',
    role: 'RP 玩家',
    endingNames: [
      { rating: 'S', name: '整合', id: 'yeyu.S' },
      { rating: 'A', name: '和解', id: 'yeyu.A' },
      { rating: 'B', name: '边界', id: 'yeyu.B' },
      { rating: 'C', name: '迷失', id: 'yeyu.C' },
      { rating: 'D', name: '崩塌', id: 'yeyu.D' },
    ],
    signatureLines: {
      sprout: '我想开个RP号，扮演一个不存在的自己。',
      growth: '在RP店里，我比在现实里更像自己。',
      mature: 'RP标挂久了，分不清IC和OOC了。',
      mentor: '你的RP角色，也是你光之战士的一部分。',
    },
  },
  {
    id: 'linglan',
    name: '铃兰',
    role: '通讯贝管理员',
    endingNames: [
      { rating: 'S', name: '倾听', id: 'linglan.S' },
      { rating: 'A', name: '守望', id: 'linglan.A' },
      { rating: 'B', name: '静默', id: 'linglan.B' },
      { rating: 'C', name: '孤立', id: 'linglan.C' },
      { rating: 'D', name: '断线', id: 'linglan.D' },
    ],
    signatureLines: {
      sprout: '加个好友吧？我拉你进通讯贝。',
      growth: 'CWLS建好了，随时来聊天。',
      mature: '通讯贝消息999+，但没人私聊我。',
      mentor: '不用一直说话，挂机在一起也是一种陪伴。',
    },
  },
] as const

export const GOLDEN_CHARACTER_IDS: readonly CharacterId[] = GOLDEN_CHARACTERS.map((c) => c.id)

// ============================================================================
// 牵制边（PRD §7）—— 已应用裁定 #1 / #2
// ============================================================================

export interface GoldenConstraint {
  id: string
  from: CharacterId
  to: CharacterId
  delta: -1 | -2
  /** 人的可读表述，用于校验"边确实指向 PRD 声明的那个结局降级" */
  narrative: string
}

export const GOLDEN_CONSTRAINTS: readonly GoldenConstraint[] = [
  { id: 'C1', from: 'xiaoxing', to: 'tiebi', delta: -1, narrative: '小星 S 使铁壁降至 B（缺口）' },
  { id: 'C2', from: 'liefeng', to: 'yuejian', delta: -1, narrative: '烈风 S 使月见降至 C（疲惫）' },
  { id: 'C3', from: 'chenxi', to: 'yuanshan', delta: -1, narrative: '晨曦 S 使远山降至 B（遗憾）' },
  { id: 'C4', from: 'yuejian', to: 'chenxi', delta: -1, narrative: '月见 S 使晨曦降至 A（坚守）' },
  { id: 'C5', from: 'linglan', to: 'yeyu', delta: -1, narrative: '铃兰 S 使夜语降至 C（迷失）' },
  { id: 'C6', from: 'tiebi', to: 'xiaoxing', delta: -1, narrative: '铁壁 S 使小星降至 B（远行）' },
] as const

/**
 * C1 与 C6 互为反向边（PRD 裁定 #5）。
 * 二者同时可触发时由 resolveConstraints 的 (|delta| 降序, 声明序升序) 全序消解。
 */
export const BIDIRECTIONAL_CONSTRAINT_PAIRS: readonly [string, string][] = [['C1', 'C6']] as const

// ============================================================================
// 共存结局（PRD §5.5）
// ============================================================================

export const GOLDEN_COEXISTS = [
  { id: 'coexist:bidirectional', name: '双向奔赴', involved: ['xiaoxing', 'tiebi'] },
  { id: 'coexist:across-the-void', name: '隔空和解', involved: ['liefeng', 'yuejian'] },
  { id: 'coexist:beyond-time', name: '时间之外', involved: ['yeyu', 'linglan'] },
] as const

// ============================================================================
// 章节结构（PRD §8）
// ============================================================================

export interface GoldenChapter {
  id: ChapterId
  index: number
  title: string
  subtitle: string
  coreCharacterIds: CharacterId[]
  /** 截至本章**累计**可用的错位档位（校验器 14 据此断言信件未越权） */
  unlocks: string[]
  expectedLetterCount: number
  expectedHiddenCount: number
}

export const GOLDEN_CHAPTERS: readonly GoldenChapter[] = [
  {
    id: 'ch01',
    index: 1,
    title: '初次组队',
    subtitle: '固定队的诞生',
    coreCharacterIds: ['chenxi', 'yuejian', 'liefeng'],
    unlocks: ['reorder'],
    expectedLetterCount: 5,
    expectedHiddenCount: 1,
  },
  {
    id: 'ch02',
    index: 2,
    title: '豆芽的困惑',
    subtitle: '新人融入',
    coreCharacterIds: ['xiaoxing', 'tiebi'],
    unlocks: ['reorder', 'microshift'],
    expectedLetterCount: 5,
    expectedHiddenCount: 1,
  },
  {
    id: 'ch03',
    index: 3,
    title: '旧友重逢',
    subtitle: '回归与离别',
    coreCharacterIds: ['yuanshan', 'tiebi'],
    unlocks: ['reorder', 'microshift', 'transform'],
    expectedLetterCount: 5,
    expectedHiddenCount: 1,
  },
  {
    id: 'ch04',
    index: 4,
    title: '虚拟与真实',
    subtitle: 'RP 与自我认同',
    coreCharacterIds: ['yeyu', 'linglan'],
    unlocks: ['reorder', 'microshift', 'transform', 'high'],
    expectedLetterCount: 5,
    expectedHiddenCount: 1,
  },
  {
    id: 'ch05',
    index: 5,
    title: '因果交织',
    subtitle: '所有人命运交汇',
    coreCharacterIds: [...GOLDEN_CHARACTER_IDS],
    unlocks: ['reorder', 'microshift', 'transform', 'high'],
    expectedLetterCount: 8,
    expectedHiddenCount: 1,
  },
] as const

// ============================================================================
// 隐藏信件（PRD §8，已应用裁定 #9）
// ============================================================================

/**
 * **每封隐藏信只能使用它所在章节已解锁的错位档位。**
 *
 * 源 PRD 把 H01/H02 放在只解锁「同阶段重排」/「跨空间」的第一、二章，
 * 却要求"跨时间拖动"——字面执行会让玩家在能力尚未解锁时面对一封无解的信，
 * 也会让校验器 14 失败。此处按机制重新分配，保留全部 5 个标题
 * 与"每章一封隐藏信"的结构。
 */
export interface GoldenHiddenLetter {
  id: LetterId
  chapterId: ChapterId
  title: string
  /** 要求的错位条件描述 */
  requirement: string
  /** 该隐藏信使用的错位档位，必须 ⊆ 所在章的 unlocks */
  usesTier: string
  /** 应达成的评级 */
  expectedRating: 'X' | 'echo' | 'S' | 'special'
}

export const GOLDEN_HIDDEN_LETTERS: readonly GoldenHiddenLetter[] = [
  {
    id: 'H01',
    chapterId: 'ch01',
    title: '给未来的自己',
    requirement: '把一句话放回它原来的位置——但因为你已经见过后面的事，它的意思变了',
    usesTier: 'reorder',
    expectedRating: 'echo',
  },
  {
    id: 'H02',
    chapterId: 'ch02',
    title: '部队的第一次合影',
    requirement: '同一句话，在部队房被听到和在通讯贝被读到，是两回事',
    usesTier: 'microshift',
    expectedRating: 'S',
  },
  {
    id: 'H03',
    chapterId: 'ch03',
    title: '首杀那天的语音',
    requirement: '将成熟期语句拖入成长期——那时的他还输不起',
    usesTier: 'transform',
    expectedRating: 'X',
  },
  {
    id: 'H04',
    chapterId: 'ch04',
    title: '面具与真名',
    requirement: '跨空间 + 跨时间组合',
    usesTier: 'high',
    expectedRating: 'echo',
  },
  {
    id: 'H05',
    chapterId: 'ch05',
    title: '致倾听者',
    requirement: '全角色语句跨时空重组',
    usesTier: 'high',
    expectedRating: 'special',
  },
] as const

// ============================================================================
// 角色 × 章节 的阶段锚点（转录自 docs/STORY-BIBLE.md §5.2）
// ============================================================================

/**
 * 角色在第 N 章「活到哪一步了」。
 *
 * 校验器 10 用它断言：第 N 章的一封信里，角色 C 的语句块**原始阶段**
 * 不得晚于 `anchorStage(C, N)`。这是防止"未来的人才说的话"出现在过去的关键。
 *
 * 规则是**单向上界**：一句台词的原始阶段索引必须 **≤** `anchorStage(C, N)`。
 * 用更早的阶段是允许的——那是**回忆**，不是未来。
 * 例如远山 Ch3 首次登场即成熟，他豆芽期的块从 Ch3 起就可以出现。
 *
 * `null` 表示该角色在这一章尚未登场。
 */
export const GOLDEN_CHARACTER_CHAPTER_ANCHORS: Record<
  CharacterId,
  readonly (TimePhase | null)[]
> = {
  //                                Ch1      Ch2      Ch3      Ch4       Ch5
  chenxi: ['growth', 'growth', 'mature', null, 'mentor'],
  yuejian: ['growth', 'growth', null, 'mature', 'mentor'],
  liefeng: ['growth', 'growth', 'mature', null, 'mentor'],
  tiebi: [null, 'growth', 'mature', 'mature', 'mentor'],
  xiaoxing: ['sprout', 'sprout', 'growth', 'mature', 'mentor'],
  yuanshan: [null, null, 'mature', 'mature', 'mentor'],
  yeyu: [null, null, 'growth', 'mature', 'mentor'],
  linglan: [null, 'growth', 'growth', 'mature', 'mentor'],
}

// ============================================================================
// 内容规模约束
// ============================================================================

/** PRD §4.1 硬约束：单封信可拖动块数上限。穷举完备性依赖于它。 */
export const MAX_DRAGGABLE_BLOCKS = 4

/** PRD §4.1 硬约束：单封信语句块总数上限。 */
export const MAX_BLOCKS_PER_LETTER = 6

/** 校验器 11：任一角色相邻两次出场间隔不得超过此值（章）。 */
export const MAX_APPEARANCE_GAP_CHAPTERS = 2

/** 校验器 11：每位角色在全书中的最少出场信件数。 */
export const MIN_APPEARANCES_PER_CHARACTER = 3

/** 校验器 12：S 级角色结局至少需要被铺垫的信件数。 */
export const MIN_S_ENDING_FORESHADOWING = 2
