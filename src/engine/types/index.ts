/**
 * 《艾欧泽亚因果信笺》数据模型 —— content 与 engine 的唯一契约。
 *
 * 设计原则（见 docs/PRD.md §5.1）：
 *  1. 一切派生状态（角色评级、全局结局、因果树）一律不存储，由纯函数重算。
 *  2. `RankedRating` 与 `OutOfBandRating` 在类型层分离：X / echo 不参与序数比较。
 *  3. 错位判定按 (Δt, Δs) 二元组分类，标量 offset 只用于显示与崩坏门限。
 *
 * 本文件不得 import React —— 引擎必须能脱离 DOM 被单测与离线校验。
 */

// ============================================================================
// 标识符
// ============================================================================

export type CharacterId = string
export type LetterId = string
export type ChapterId = string
export type BlockId = string
export type StatementId = string
export type RelationId = string
export type EndingId = string
export type TermId = string
export type ConstraintEdgeId = string

// ============================================================================
// 时空坐标系（PRD §3）
// ============================================================================

/** 成长阶段。数组顺序即时间序，索引差即 Δt。 */
export const TIME_PHASES = ['sprout', 'growth', 'mature', 'mentor'] as const
export type TimePhase = (typeof TIME_PHASES)[number]

/** 空间标签。数组顺序即 Δs 的计算依据。 */
export const SPACE_TAGS = ['city', 'field', 'dungeon', 'fc-house', 'rp-venue', 'linkshell'] as const
export type SpaceTag = (typeof SPACE_TAGS)[number]

export interface SpaceTime {
  phase: TimePhase
  space: SpaceTag
}

export const TIME_PHASE_LABEL: Record<TimePhase, string> = {
  sprout: '豆芽期',
  growth: '成长期',
  mature: '成熟期',
  mentor: '导师期',
}

export const SPACE_TAG_LABEL: Record<SpaceTag, string> = {
  city: '主城',
  field: '野外',
  dungeon: '副本',
  'fc-house': '部队房',
  'rp-venue': 'RP场所',
  linkshell: '通讯贝',
}

export const timePhaseIndex = (p: TimePhase): number => TIME_PHASES.indexOf(p)
export const spaceTagIndex = (s: SpaceTag): number => SPACE_TAGS.indexOf(s)

// ============================================================================
// 错位分类（PRD §4.3）
// ============================================================================

/**
 * 错位分类。**按 (Δt, Δs) 二元组决定，不由标量 offset 决定**（PRD 裁定 #7）。
 *
 * 这四种分类与源 PRD §2.2 的规则表**一一对应**：
 *   同阶段同空间 → reorder ／ 跨空间同阶段 → microshift
 *   跨阶段同空间 → transform ／ 跨阶段跨空间 → high
 *
 * 注意：**没有"自动崩坏"档位**（PRD 裁定 #8）。源 PRD 的公式 `offset >= 3 → 高错位/崩坏`
 * 与它自己的旗舰示例冲突——「把豆芽期的提问拖进导师期的庆功宴」Δt=3、Δs=0，
 * 按规则表属「跨阶段同空间 = 语义质变 = 成长/回忆/传承类结局」，而非崩坏。
 * 因此 `high` 档位的结果是"隐藏剧情**或**因果崩坏"，由各封信自行编排；
 * 「因果崩坏」是信件可选择的**结局**（rating `X`），不是坐标自动推导出的状态。
 */
export const MISPLACEMENT_KINDS = [
  'none', // 块未被移动
  'reorder', // 同阶段同空间：常规重排
  'microshift', // 跨空间同阶段：语义微调
  'transform', // 跨阶段同空间：语义质变
  'high', // 跨阶段跨空间：高错位（隐藏剧情或崩坏，由信件编排决定）
] as const
export type MisplacementKind = (typeof MISPLACEMENT_KINDS)[number]

export const MISPLACEMENT_LABEL: Record<MisplacementKind, string> = {
  none: '未移动',
  reorder: '常规重排',
  microshift: '语义微调',
  transform: '语义质变',
  high: '高错位',
}

// ============================================================================
// 语义标签（Statement 携带，KeyRelation 判定）
// ============================================================================

/**
 * 语句的语义承载。这是"叙事"被结构化的最小单位——
 * 判定引擎看的是 carries，不是 text。文本可以重写，语义契约不变。
 */
export const CARRY_KINDS = [
  'apology', // 道歉 / 自责
  'reassure', // 安抚 / 体贴
  'boundary', // 设立边界
  'invite', // 邀请 / 拉人
  'reproach', // 指责 / 苛责
  'encourage', // 鼓励 / 认可
  'withdraw', // 退缩 / 抽离
  'confide', // 倾诉 / 示弱
  'boast', // 骄傲 / 炫耀
  'reminisce', // 回忆
  'recruit', // 招募 / 传承
  'grieve', // 失落 / 怀念
  'persist', // 执着 / 较真
] as const
export type CarryTag = (typeof CARRY_KINDS)[number]

export const CARRY_LABEL: Record<CarryTag, string> = {
  apology: '道歉',
  reassure: '安抚',
  boundary: '边界',
  invite: '邀请',
  reproach: '苛责',
  encourage: '认可',
  withdraw: '抽离',
  confide: '示弱',
  boast: '骄傲',
  reminisce: '回忆',
  recruit: '传承',
  grieve: '失落',
  persist: '执着',
}

// ============================================================================
// 语义库：Statement
// ============================================================================

/** 错位之后的重新解读。同一句话在不同时空下，carries 可能整体改变。 */
export interface InterpretationVariant {
  /** 命中的错位分类 */
  kind: MisplacementKind
  /** 限定目标阶段；缺省表示适用于该 kind 下的任意阶段 */
  targetPhase?: TimePhase
  /** 限定目标空间；缺省表示任意 */
  targetSpace?: SpaceTag
  /** UI 预览文案：「在导师期，这句话可能被解读为……」 */
  reinterpretedText: string
  /** 在该时空下的语义——可以与原始 carries 完全不同，这正是"语义质变" */
  carries: CarryTag[]
}

export interface Statement {
  id: StatementId
  characterId: CharacterId
  /** 原始时空坐标 */
  phase: TimePhase
  space: SpaceTag
  /** 台词正文 */
  text: string
  /** 结构化语义。判定引擎只看这个，不看 text。 */
  carries: CarryTag[]
  /** 句中标注的黑话术语（必须能在词典中找到，见校验器 2） */
  terms: TermId[]
  /** 是否允许被拖到别的时空。仅约 40/128 条语句可错位。 */
  isDisplaceable: boolean
  /** 错位后的解读变体。可错位语句必须有，且覆盖其允许的错位档位。 */
  variants?: InterpretationVariant[]
}

// ============================================================================
// 信件
// ============================================================================

/** 信件中的一个语句块实例。同一个 Statement 可被多封信引用。 */
export interface StatementBlock {
  id: BlockId
  statementId: StatementId
  /** 是否可被玩家拖动。M ≤ 4 是硬约束（PRD §4.1）。 */
  draggable: boolean
  /** 原始位置索引，用于判定 'none'（未被移动） */
  homeIndex: number
}

/**
 * 关键位置关系 —— 全部判定的原子（PRD §5.2）。
 * 用可辨识联合，让"缺 minGap"这类错误在类型层就暴露。
 */
export type KeyRelation =
  | { id: RelationId; kind: 'precedes'; subject: BlockId; object: BlockId }
  | { id: RelationId; kind: 'adjacent'; subject: BlockId; object: BlockId }
  | { id: RelationId; kind: 'first'; subject: BlockId }
  | { id: RelationId; kind: 'last'; subject: BlockId }
  | { id: RelationId; kind: 'separatedBy'; subject: BlockId; object: BlockId; minGap: number }
  | { id: RelationId; kind: 'displacedInto'; subject: BlockId; tier: MisplacementKind }
  | { id: RelationId; kind: 'carryPresent'; carry: CarryTag; block?: BlockId }

export type KeyRelationKind = KeyRelation['kind']

export interface TendencyDelta {
  characterId: CharacterId
  delta: number
  /** 人类可读的解释，直接显示在角色故事线面板的"关键选择记录"里 */
  reason: string
}

export interface LetterEnding {
  id: EndingId
  rating: Rating
  title: string
  /** 结算文本。**旁白文本不得使用黑话**（PRD §10 语言分层） */
  body: string
  /** 必须全部满足 */
  requires: RelationId[]
  /** 必须全部不满足 */
  forbids?: RelationId[]
  /**
   * 至少满足 requires 中的几条。缺省 = 全部满足。
   * 用于"满足越多评级越高"的渐进式结局。
   */
  minSatisfied?: number
  /** 判定顺序，小的先判。必须唯一，保证结果确定。 */
  priority: number
  /** 对角色倾向值的影响 */
  tendency: TendencyDelta[]
}

// ============================================================================
// 评级（PRD §5.1）
// ============================================================================

/** 可序数比较的评级。 */
export const RANKED_RATINGS = ['S', 'A', 'B', 'C', 'D'] as const
export type RatedRating = (typeof RANKED_RATINGS)[number]

/** 带外评级：不是"更高"或"更低"，不参与序数比较。 */
export const OUT_OF_BAND_RATINGS = ['X', 'echo'] as const
export type OutOfBandRating = (typeof OUT_OF_BAND_RATINGS)[number]

export type Rating = RatedRating | OutOfBandRating

export const OUT_OF_BAND_LABEL: Record<OutOfBandRating, string> = {
  X: '因果崩坏',
  echo: '回响',
}

/** 评级 → 序号，0 = S 最高。带外评级返回 null，强制调用方显式处理。 */
export function ratedIndex(r: Rating): number | null {
  const i = (RANKED_RATINGS as readonly string[]).indexOf(r)
  return i === -1 ? null : i
}

export function isRated(r: Rating): r is RatedRating {
  return (RANKED_RATINGS as readonly string[]).includes(r)
}

/** 把带外评级归一为最接近的可比评级，仅供牵制引擎处理降级时使用。 */
export function coerceToRated(r: Rating): RatedRating {
  if (isRated(r)) return r
  // X / echo 是"故事已脱离常轨"，在牵制力学中按最低档处理。
  return 'D'
}

// ============================================================================
// 信件解锁
// ============================================================================

export type UnlockCondition =
  | { kind: 'always' }
  /** 完成指定信件（不限定评级） */
  | { kind: 'complete'; letterIds: LetterId[] }
  /** 达成指定评级（用于"需要打出非 S 评级才能解锁后续"的设计） */
  | { kind: 'rating'; letterId: LetterId; ratings: Rating[] }
  /** 集齐部队成员署名 */
  | { kind: 'signatures'; count: number }
  /** 需要先访问跨服通讯贝 */
  | { kind: 'cwls'; prerequisiteLetterIds: LetterId[] }

export interface Letter {
  id: LetterId
  chapterId: ChapterId
  title: string
  /** 信件自身的时空锚点——跨时空拖动的目标坐标 */
  anchor: SpaceTime
  /** 信件的不可拖动正文（旁白/署名）。通用语言，不含黑话。 */
  preamble: string
  /** 署名，如「——晨曦」 */
  signature: string
  blocks: StatementBlock[]
  relations: KeyRelation[]
  endings: LetterEnding[]
  /**
   * 兜底结局。**必填**——这让 resolveLetterEnding 在类型上不可能返回 null，
   * 即"所有排列组合都有结局"由类型系统保证（PRD §5.2）。
   * 校验器 4 进一步断言：没有任何可达排列真的会落到这里。
   */
  fallbackEnding: LetterEnding
  unlock: UnlockCondition
  /** 隐藏信件 */
  hidden?: boolean
  /** 该信必须打出的评级才能进入下一步；缺省表示任意评级均可推进 */
  requiredRatingToAdvance?: Rating[]
}

/** 玩家对一封信的当前操作状态（存于存档） */
export interface LetterResult {
  letterId: LetterId
  endingId: EndingId
  rating: Rating
  /** 玩家最终的块顺序 */
  arrangement: BlockId[]
  /** 跨信件拖入的块：blockId -> 它被拖入时所借用的时空坐标 */
  borrowedPlacements: Record<BlockId, SpaceTime>
  /**
   * 结算那一刻**实际满足**的关键关系。
   *
   * 必须持久化：共存结局检测依赖它，而它不等于 `ending.requires`——
   * 分级判定下同一个结局对应多种排列，各自满足的关系子集不同。
   * 若读档时用 `requires` 反推，共存结局的判定结果会与当初不一致。
   */
  satisfiedRelationIds: RelationId[]
  completedAt: number
}

// ============================================================================
// 角色（PRD §6）
// ============================================================================

export type EndingTrigger =
  | { kind: 'tendency'; min: number; max?: number }
  /** X / echo 只能走这里 —— 追踪引擎不为任何角色做特例（PRD 裁定 #6） */
  | { kind: 'special'; conditionId: string }

export interface CharacterEnding {
  id: EndingId
  characterId: CharacterId
  rating: Rating
  name: string
  summary: string
  trigger: EndingTrigger
  /**
   * 该结局被铺垫过的信件。S 级必须 ≥ 2 封（校验器 12），
   * 防止终章出现"从未铺垫过的角色归宿"。
   */
  prerequisiteLetterIds: LetterId[]
}

export interface Character {
  id: CharacterId
  name: string
  /** 职业 / 身份，如「坦克 / 固定队队长」 */
  role: string
  /** 主题色，用于 UI 与 SVG 纹章 */
  themeColor: string
  /** 语义弧光的凝练表述：同一条语句从豆芽期到导师期如何质变 */
  arc: string
  statements: Statement[]
  endings: CharacterEnding[]
}

// ============================================================================
// 结局牵制（PRD §5.4 / §7）
// ============================================================================

/**
 * 牵制边。**只存 delta，永不存目标评级**（PRD 裁定 #2）——
 * 写死目标评级会在内容调整时产生悬空引用。
 */
export interface ConstraintEdge {
  id: ConstraintEdgeId
  from: CharacterId
  /** 源角色评级达到此档或更高时触发 */
  fromMinRating: RatedRating
  to: CharacterId
  delta: -1 | -2
  /**
   * 该角色**可被降至的最差评级**（S 最好、D 最差）。
   * 用于避免多条边同时命中同一角色时被"击穿"到底。
   * 例：ratingsFloor='C' 表示最多降到 C，不会被压到 D。
   */
  ratingsFloor?: RatedRating
  rationale: string
  /** 声明序。排序键的一部分，保证消解结果确定。 */
  declarationIndex: number
}

export interface ConstraintApplication {
  edgeId: ConstraintEdgeId
  from: CharacterId
  to: CharacterId
  fromRating: Rating
  before: Rating
  after: Rating
  rationale: string
}

export interface ResolutionTrace {
  applied: ConstraintApplication[]
  exemptedEdgeIds: ConstraintEdgeId[]
  coexistsHit: string[]
  /** 是否发生了降级 */
  changed: boolean
}

// ============================================================================
// 共存结局（PRD §5.5）
// ============================================================================

export interface CoexistCondition {
  id: string
  name: string
  involved: CharacterId[]
  /** 必须满足的关键关系（跨信件错位条件在此编码） */
  requires: RelationId[]
  /** 豁免哪些牵制边 */
  exempts: ConstraintEdgeId[]
  grants: { characterId: CharacterId; rating: Rating }[]
  description: string
}

// ============================================================================
// 术语词典（PRD §10）
// ============================================================================

export const GLOSSARY_CATEGORIES = [
  'raid', // 高难副本
  'mechanic', // 战斗机制
  'job', // 职业与角色梗
  'social', // 社交系统
  'craft', // 生产采集
  'housing', // 房屋与幻化
  'rp', // RP 与社区
  'meme', // 游戏梗
] as const
export type GlossaryCategory = (typeof GLOSSARY_CATEGORIES)[number]

export const GLOSSARY_CATEGORY_LABEL: Record<GlossaryCategory, string> = {
  raid: '高难副本术语',
  mechanic: '战斗机制术语',
  job: '职业与角色术语',
  social: '社交系统术语',
  craft: '生产采集术语',
  housing: '房屋与幻化术语',
  rp: 'RP与社区术语',
  meme: '游戏梗与名场面',
}

export interface GlossaryEntry {
  id: TermId
  term: string
  /** 拼音，便于检索 */
  pinyin: string
  category: GlossaryCategory
  /**
   * 词义对**零 FF14 知识的读者**也一目了然，不构成阅读门槛。
   *
   * 这类词（固定队、挂机、公寓…）可以出现在信件旁白里；
   * 其余术语受语言分层铁律约束，只能出现在玩家之间的对话中。
   * 判据是"能否从字面直接读懂"，不是"是不是游戏概念"——
   * 例如「留蓝」不透明（蓝＝法力是玩家黑话），「复活」透明。
   */
  transparent?: boolean
  /** 简要释义（1~2 句，用于悬停 tooltip） */
  brief: string
  /** 详细说明（用于点击展开的词典页） */
  detail: string
  /** 信件中的实际用法 */
  example: string
  /** 常使用此术语的角色。**必须在正文中真的被使用过**（校验器 3） */
  linkedCharacterIds: CharacterId[]
  relatedTermIds: TermId[]
  /** 是否关联特定游戏梗 */
  memeRef?: string
}

// ============================================================================
// 章节（PRD §8）
// ============================================================================

export interface Chapter {
  id: ChapterId
  index: number
  title: string
  subtitle: string
  coreCharacterIds: CharacterId[]
  /** 本章解锁的错位能力。校验器 14 断言信件未使用本章之外的档位。 */
  unlocks: MisplacementKind[]
  letterIds: LetterId[]
}

// ============================================================================
// 因果追踪（PRD §5.3）
// ============================================================================

/**
 * 倾向事件 —— **存档中的唯一真相源**（PRD §5.1）。
 * 角色评级、全局结局、因果树全部由它重算，绝不另存派生状态。
 */
export interface TendencyEvent {
  letterId: LetterId
  characterId: CharacterId
  delta: number
  reason: string
  /** 写入序，保证既排序稳定又可复现 */
  order: number
}

export interface CharacterOutcome {
  characterId: CharacterId
  /** 倾向原始值 */
  tendency: number
  /** 由 tendency 映射出的初步评级（尚未过牵制引擎） */
  preliminaryRating: Rating
  /** 牵制引擎调整后的最终评级 */
  finalRating: Rating
  endingId: EndingId | null
  /** 关键选择记录，展示在角色故事线面板 */
  keyChoices: { letterId: LetterId; reason: string; delta: number }[]
}

// ============================================================================
// 全局结局：倾听者手记（PRD §5.6）
// ============================================================================

export interface GlobalEndingDimensions {
  /** 成全指数：获得 S/A 的角色数 */
  fulfillment: number
  /** 牺牲指数：因他人高评级而被降至 C/D 的角色数 */
  sacrifice: number
  /** 平衡指数：S/A 与 C/D 的数量是否接近 */
  balance: number
  /** 因果倾向 */
  inclination: 'self-sacrifice' | 'let-them-choose' | 'balanced'
}

export interface NotebookTemplate {
  id: string
  /** 命中的维度条件；缺省为兜底模板 */
  match?: Partial<{
    fulfillment: number[]
    sacrifice: number[]
    balance: number[]
    inclination: GlobalEndingDimensions['inclination'][]
  }>
  /** 手记正文，可用 {characters} 等占位符 */
  body: string
  priority: number
}

// ============================================================================
// 存档
// ============================================================================

export const SAVE_VERSION = 1

export interface SandboxExperiment {
  id: string
  letterId: LetterId
  arrangement: BlockId[]
  endingId: EndingId
  rating: Rating
  createdAt: number
}

export interface SaveGame {
  version: number
  slotId: string
  label: string
  createdAt: number
  updatedAt: number
  /** 唯一真相源 */
  tendencyEvents: TendencyEvent[]
  letterResults: Record<LetterId, LetterResult>
  unlockedLetterIds: LetterId[]
  signedLetterIds: LetterId[]
  learnedTermIds: TermId[]
  experiments: SandboxExperiment[]
  settings: {
    /** 全注释模式：所有黑话自动展开释义 */
    fullAnnotation: boolean
    /** 音效开关 */
    sound: boolean
  }
}

// ============================================================================
// 引擎输出
// ============================================================================

/** 一次排列的完整解析结果，用于结算界面与因果树。 */
export interface LetterResolution {
  letterId: LetterId
  ending: LetterEnding
  /** 命中的关键关系，用于 UI 高亮"你触发了什么" */
  satisfiedRelationIds: RelationId[]
  /** 每个块的错位分类，用于绘制错位虚线 */
  misplacements: { blockId: BlockId; kind: MisplacementKind; offset: number }[]
  /** 是否落到了 fallback（正常内容下恒为 false） */
  usedFallback: boolean
}
