# 信件撰写规范

> 给撰写第二章～终章信件的作者（人或 AI）。**先读 `docs/STORY-BIBLE.md` §5.3**，
> 那里规定了每封信的 ID、标题、空间锚点、出场角色与可用阶段，是唯一事实来源。

---

## 一、文件位置与命名

```
src/content/chapters/ch02/letters/L02-01.ts   → export const L02_01: Letter
src/content/chapters/ch02/letters/H02.ts      → export const H02: Letter
src/content/chapters/ch02/index.ts            → export const ch02 / ch02Letters
```

`L02-01` → 变量名 `L02_01`（连字符换下划线）。章节 index 参照 `src/content/chapters/ch01/index.ts`。

**不要修改 `src/content/index.ts`** —— 聚合由主工程统一接线，多人并行时改它会冲突。

---

## 二、硬性结构约束（校验器会逐条检查）

| 约束 | 校验器 |
|---|---|
| 可拖动块 **1 ≤ M ≤ 4**，总块数 **≤ 6** | 校验器 5d / 13a |
| 同一封信内结局 `priority` **唯一** | 校验器 5c |
| 结局 id **全局唯一**（含其他信件） | 校验器 5b |
| `fallbackEnding` **必填** | 类型系统 |
| **没有任何排列会落到 fallback** | 校验器 4 |
| **每个已写结局都能被至少一种排列触发** | 校验器 5 |
| 所有 `requires`/`forbids` 引用本信内真实存在的 relation id | 校验器 1e |
| 所有 relation 的 `subject`/`object` 引用本信内真实存在的 block id | 校验器 1d |
| `tendency[].characterId` 是真实角色，`reason` 非空 | 校验器 1f |
| 语句阶段 **≤ 该角色在该章的锚点**（STORY-BIBLE §5.2） | 校验器 10 |
| 使用的错位档位 **⊆ 本章 unlocks** | 校验器 14a |

---

## 三、两种判定写法

### 写法 A：逐个排列手写（用于可拖块 ≤ 3 且想精雕的信）

见 `ch01/letters/L01-01.ts`。3 个可拖块 = 6 种排列，每种一个独立结局，零兜底。
成本高但质感最好，适合章首、章末与隐藏信。

### 写法 B：分级判定 band grading（**默认用法**）

见 `ch01/letters/L01-02.ts`。定义 N 条**互相独立**的"正向"关系，
结局按"满足了几条"分档：

```ts
const ALL = ['X.rel.a', 'X.rel.b', 'X.rel.c']

// 满足越多评级越高；priority 小的先判，所以高档必须 priority 更小
{ rating: 'S', requires: ALL, minSatisfied: 3, priority: 10, ... }
{ rating: 'A', requires: ALL, minSatisfied: 2, priority: 20, ... }
{ rating: 'B', requires: ALL, minSatisfied: 1, priority: 30, ... }
{ rating: 'C', requires: ALL, minSatisfied: 0, priority: 40, ... }  // 最低档 minSatisfied 0 覆盖全部排列
```

### ⚠️ 两条最容易犯的错，都会让 S 档变成打不出来的摆设

1. **关系之间必须互相独立。** 同时写 `precedes(A,B)` 与 `precedes(B,A)` 会让两条互斥，
   最高档永远无法满足。校验器 5 会报 "S 结局不可达"。
2. **有固定块时慎用 `first`。** `allReorderArrangements` 把固定块钉在它的 `homeIndex` 上；
   若固定块在索引 0，可拖块**永远无法满足 `first`**。需要"排在最前"的语义时改用 `adjacent` 或 `precedes`。
   （反过来，固定块在首位时 `last` 是可满足的——末尾索引恒由可拖块占据。）

**写完必须验证**：

```bash
cd /Users/hytabc/PythonProject/ffwilllife
npx tsc --noEmit
npx vitest run src/__tests__/continuity/endings.test.ts
```

后一条会明确告诉你哪个结局不可达、哪个排列落到了兜底。**跑到全绿为止。**

---

## 四、写作要求

### 语言分层（来自 STORY-BIBLE §2 铁律）

- `preamble`（信件旁白）**不得使用需要注释的黑话** —— 校验器 2 会扫。通用语言。
- 黑话只出现在**语句块的台词**里，且必须在该块所属 `Statement` 的 `terms` 字段中标注。
- **不要新增 Statement** —— 台词全部从 `src/content/characters/*.ts` 里挑，用 `statementId` 引用。
  同一个 Statement 可以被多封信引用（这本来就是本作的题眼：同一句话在不同信里被重新排列）。

### 挑台词的规则

- 阶段：`statement.phase` 的索引必须 **≤ 该角色在该章的锚点**（STORY-BIBLE §5.2）。
  更早的阶段是允许的——那是**回忆**。
- 空间：**第一章**要求 `statement.space === letter.anchor.space`（否则重排会被判成跨空间错位，
  破坏"只教重排"的教学意图，校验器 14c 会报）。
  **第二章起不限制** —— 跨空间本身就是那时解锁的机制。

### 叙事

- 每封信的 `preamble` 要是一个**具体的人在具体晚上写下的信**，有细节，不要写成设定说明。
- 结局正文（`body`）要写出**这一种排列下真正发生了什么**，而不是给玩家打分。
  读起来应该像"事情就是这样发生的"，不是"你获得了 A 级评价"。
- `tendency[].reason` 是显示在角色故事线面板上的"关键选择记录"，要具体、
  能让人回想起那封信里的那一刻。

---

## 五、各章的错位能力（决定你能用哪些 `displacedInto`）

| 章 | unlocks | 可用的 displacedInto tier |
|---|---|---|
| ch01 | `['reorder']` | 无（只能用 `none` / `reorder`，且它们有基线豁免） |
| ch02 | `['reorder','microshift']` | `microshift` |
| ch03 | `['reorder','microshift','transform']` | 加 `transform` |
| ch04 | `+ 'high'` | 加 `high` |
| ch05 | 全部 | 全部 |

**`displacedInto` 是用来表达"这句话被拖到了另一个时空"的。**
章节解锁得越晚，能表达的错位越强：
- `microshift` = 跨空间同阶段 → 同一句话换个场合说
- `transform` = 跨阶段同空间 → 同一句话换个年纪说（这是本作最好的机制）
- `high` = 跨阶段跨空间 → 触发隐藏剧情，**或**因果崩坏

**注意：「因果崩坏」不是坐标自动推导出的状态。** 没有任何 (Δt, Δs) 组合会自动变成崩坏
（见 PRD 裁定 #8）。崩坏是某封信**主动选择的结局**（rating `X`），
例如 H03「首杀那天的语音」。
