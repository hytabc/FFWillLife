import type {
  Chapter,
  Character,
  CoexistCondition,
  ConstraintEdge,
  GlossaryEntry,
  Letter,
  Statement,
} from '../engine/types'

import { chenxi } from './characters/chenxi'
import { liefeng } from './characters/liefeng'
import { yuejian } from './characters/yuejian'
import { linglan } from './characters/linglan'
import { tiebi } from './characters/tiebi'
import { xiaoxing } from './characters/xiaoxing'
import { yeyu } from './characters/yeyu'
import { yuanshan } from './characters/yuanshan'

import { ch01, ch01Letters } from './chapters/ch01'
import { ch02, ch02Letters } from './chapters/ch02'
import { ch03, ch03Letters } from './chapters/ch03'
import { ch04, ch04Letters } from './chapters/ch04'
import { ch05, ch05Letters } from './chapters/ch05'
import { glossary } from './glossary'

// ============================================================================
// 聚合出口 —— 引擎与 UI 只通过这里取内容
// ============================================================================

export const characters: Character[] = [
  chenxi,
  yuejian,
  liefeng,
  tiebi,
  xiaoxing,
  yuanshan,
  yeyu,
  linglan,
]

export const chapters: Chapter[] = [ch01, ch02, ch03, ch04, ch05]

export const letters: Letter[] = [
  ...ch01Letters,
  ...ch02Letters,
  ...ch03Letters,
  ...ch04Letters,
  ...ch05Letters,
]

export const glossaryEntries: GlossaryEntry[] = glossary

/** 牵制边（PRD §7）。声明序 authoring 时显式给出，是消解算法的排序键之一。 */
export const constraintEdges: ConstraintEdge[] = [
  {
    id: 'C1',
    from: 'xiaoxing',
    fromMinRating: 'S',
    to: 'tiebi',
    delta: -1,
    rationale: '小星成为导师意味着她离开了铁壁的部队，铁壁失去了最看好的继承人。',
    declarationIndex: 0,
  },
  {
    id: 'C2',
    from: 'liefeng',
    fromMinRating: 'S',
    to: 'yuejian',
    delta: -1,
    rationale: '烈风追求极限输出需要治疗承受巨大的压力，月见在长期消耗中逐渐失去热情。',
    declarationIndex: 1,
  },
  {
    id: 'C3',
    from: 'chenxi',
    fromMinRating: 'S',
    to: 'yuanshan',
    delta: -1,
    rationale: '晨曦把队长之位传下去，远山作为回归老兵再次感到自己被时代抛下。',
    declarationIndex: 2,
  },
  {
    id: 'C4',
    from: 'yuejian',
    fromMinRating: 'S',
    to: 'chenxi',
    delta: -1,
    rationale: '月见学会照顾自己，意味着她不再无条件迁就晨曦，两人之间产生了微妙的距离。',
    declarationIndex: 3,
  },
  {
    id: 'C5',
    from: 'linglan',
    fromMinRating: 'S',
    to: 'yeyu',
    delta: -1,
    rationale: '铃兰学会不再过度介入他人，夜语失去了最重要的倾听者。',
    declarationIndex: 4,
  },
  {
    id: 'C6',
    from: 'tiebi',
    fromMinRating: 'S',
    to: 'xiaoxing',
    delta: -1,
    rationale: '铁壁培养出继承人，反而让小星有了去更广阔天地的底气。',
    declarationIndex: 5,
  },
]

/**
 * 共存结局（PRD §5.5）。
 *
 * `requires` 引用的是**跨信件的关键关系 id** —— 这些关系必须在终章（ch05）
 * 的具体信件中被真实定义，否则共存结局永远无法触发。校验器 7 会穷举验证
 * 三个共存结局在数据上确实可达，不接受人肉断言。
 */
export const coexistConditions: CoexistCondition[] = [
  {
    id: 'coexist:bidirectional',
    name: '双向奔赴',
    involved: ['xiaoxing', 'tiebi'],
    // 终章：把导师期的小星线拖进铁壁的豆芽期信件
    requires: ['L05-04.rel.xiaoxing-mentor-into-tiebi-sprout'],
    exempts: ['C1', 'C6'],
    grants: [
      { characterId: 'xiaoxing', rating: 'S' },
      { characterId: 'tiebi', rating: 'S' },
    ],
    description: '未来的继承人回应过去的引路人——她和小星之间，隔着一整个成长的距离。',
  },
  {
    id: 'coexist:across-the-void',
    name: '隔空和解',
    involved: ['liefeng', 'yuejian'],
    // 终章：把烈风的导师期语句拖进月见的成熟期信件
    requires: ['L05-02.rel.liefeng-mentor-into-yuejian-mature'],
    exempts: ['C2'],
    grants: [
      { characterId: 'liefeng', rating: 'S' },
      { characterId: 'yuejian', rating: 'S' },
    ],
    description: '烈风以过来人的身份理解月见的疲惫——他们终于站在了同一边。',
  },
  {
    id: 'coexist:beyond-time',
    name: '时间之外',
    involved: ['yeyu', 'linglan'],
    // 终章：两人的导师期语句互换，形成"你教我的，我教给了未来的你"
    requires: ['L05-07.rel.swap-mentor-lines'],
    exempts: ['C5'],
    grants: [
      { characterId: 'yeyu', rating: 'S' },
      { characterId: 'linglan', rating: 'S' },
    ],
    description: '你教我的，我教给了未来的你——因果在此闭合成一个环。',
  },
]

// ============================================================================
// 查表（引擎内部用，避免各处重复 filter）
// ============================================================================

export const lettersById: Map<string, Letter> = new Map(letters.map((l) => [l.id, l]))
export const charactersById: Map<string, Character> = new Map(characters.map((c) => [c.id, c]))
export const chaptersById: Map<string, Chapter> = new Map(chapters.map((c) => [c.id, c]))
export const glossaryById: Map<string, GlossaryEntry> = new Map(glossary.map((g) => [g.id, g]))

export const statementsById: Map<string, Statement> = new Map(
  characters.flatMap((c) => c.statements.map((s) => [s.id, s] as const)),
)

export const statementsByCharacter: Map<string, Statement[]> = new Map(
  characters.map((c) => [c.id, c.statements]),
)

/**
 * 术语 → 真正在台词里用过它的角色。
 *
 * **派生而非手写**：`GlossaryEntry.linkedCharacterIds` 是编辑注记，会随内容漂移；
 * 这里的事实来源永远是 `statement.terms`。词典界面显示的是这一份。
 */
export const charactersUsingTerm = (): Map<string, string[]> => {
  const out = new Map<string, string[]>()
  for (const character of characters) {
    for (const statement of character.statements) {
      for (const termId of statement.terms) {
        const list = out.get(termId)
        if (list) {
          if (!list.includes(character.id)) list.push(character.id)
        } else {
          out.set(termId, [character.id])
        }
      }
    }
  }
  return out
}
