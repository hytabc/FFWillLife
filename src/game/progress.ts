import { chapters, lettersById } from '../content'
import type { Chapter, Letter, LetterId } from '../engine/types'
import type { SettledLetter } from '../store/gameStore'

/**
 * 进度与解锁 —— 纯派生，不存储。
 *
 * 一个信件是否解锁，完全由"已经结算过哪些信、打出了什么评级"决定，
 * 因此读档后重算的结果必然一致，不会出现"存档里显示已解锁但点不开"这种状态。
 */

export function isUnlocked(
  letter: Letter,
  settled: Record<LetterId, SettledLetter>,
  signatureCount = 0,
): boolean {
  const u = letter.unlock
  switch (u.kind) {
    case 'always':
      return true
    case 'complete':
      return u.letterIds.every((id) => settled[id] !== undefined)
    case 'rating': {
      const r = settled[u.letterId]?.rating
      return r !== undefined && u.ratings.includes(r)
    }
    case 'signatures':
      return signatureCount >= u.count
    case 'cwls':
      return u.prerequisiteLetterIds.every((id) => settled[id] !== undefined)
  }
}

export interface LetterNode {
  letter: Letter
  unlocked: boolean
  settled: SettledLetter | undefined
}

export interface ChapterNode {
  chapter: Chapter
  letters: LetterNode[]
  /** 本章是否已经全部解锁（用于侧栏折叠显示） */
  allUnlocked: boolean
  settledCount: number
}

/**
 * 构建侧栏用的章节 → 信件树。
 *
 * 隐藏信只有在解锁后才出现在列表里 —— 提前把它显示成一个灰条，
 * 等于告诉玩家"这里有个秘密"，那就不叫隐藏了。
 */
export function buildProgressTree(
  settled: Record<LetterId, SettledLetter>,
  signatureCount = 0,
  /** 沙盘模式：全部信件可见可选，用于自由试验 */
  sandbox = false,
): ChapterNode[] {
  return chapters
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((chapter) => {
      const nodes: LetterNode[] = chapter.letterIds
        .map((id) => lettersById.get(id))
        .filter((l): l is Letter => l !== undefined)
        // 隐藏信只有在解锁后才现身——提前显示一个灰条，等于告诉玩家"这里有个秘密"
        .filter(
          (letter) =>
            sandbox ||
            !letter.hidden ||
            settled[letter.id] !== undefined ||
            isUnlocked(letter, settled, signatureCount),
        )
        .map((letter) => ({
          letter,
          unlocked: sandbox || isUnlocked(letter, settled, signatureCount),
          settled: settled[letter.id],
        }))

      return {
        chapter,
        letters: nodes,
        allUnlocked: nodes.every((n) => n.unlocked),
        settledCount: nodes.filter((n) => n.settled !== undefined).length,
      }
    })
}

/** 下一封该玩的信：第一个已解锁但尚未结算的。 */
export function nextLetter(
  settled: Record<LetterId, SettledLetter>,
  signatureCount = 0,
): Letter | undefined {
  for (const node of buildProgressTree(settled, signatureCount)) {
    for (const item of node.letters) {
      if (item.unlocked && !item.settled) return item.letter
    }
  }
  return undefined
}

/** 全局进度，用于顶栏显示。 */
export function progressSummary(settled: Record<LetterId, SettledLetter>): {
  done: number
  total: number
  visible: number
} {
  const all = [...lettersById.values()]
  const visible = all.filter(
    (l) => !l.hidden || settled[l.id] !== undefined || isUnlocked(l, settled),
  ).length
  return {
    done: Object.keys(settled).length,
    total: all.length,
    visible,
  }
}
