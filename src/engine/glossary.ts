import type { GlossaryEntry, TermId } from './types'

export interface GlossaryIndex {
  byId: Map<TermId, GlossaryEntry>
  byTerm: Map<string, GlossaryEntry>
}

export function buildGlossaryIndex(entries: readonly GlossaryEntry[]): GlossaryIndex {
  const byId = new Map<TermId, GlossaryEntry>()
  const byTerm = new Map<string, GlossaryEntry>()
  for (const e of entries) {
    byId.set(e.id, e)
    byTerm.set(e.term, e)
  }
  return { byId, byTerm }
}

/** 全文检索：匹配术语、拼音、简释、详细说明。 */
export function searchGlossary(entries: readonly GlossaryEntry[], query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return [...entries]
  return entries.filter(
    (e) =>
      e.term.toLowerCase().includes(q) ||
      e.pinyin.toLowerCase().includes(q) ||
      e.brief.toLowerCase().includes(q) ||
      e.detail.toLowerCase().includes(q),
  )
}

export interface TextSegment {
  text: string
  /** 命中术语时非空 —— UI 据此加下划线并挂 tooltip */
  termId?: TermId
  entry?: GlossaryEntry
}

/**
 * 把信件文本切成「普通文本 / 术语」交替的片段，用于渲染下划线黑话。
 *
 * 这是**数据驱动**的标注：术语命中来自 Statement.terms 显式声明的 id，
 * 而不是正则扫描全文 —— 这样"哪些词是黑话"由内容作者决定，
 * 也才能被校验器 2 断言（标注的词必须在词典里存在）。
 */
export function segmentText(text: string, terms: readonly GlossaryEntry[]): TextSegment[] {
  if (terms.length === 0) return [{ text }]

  // 长词优先，避免「零式」抢先匹配掉「零式之巅」这类更长的术语
  const candidates = [...terms].sort((a, b) => b.term.length - a.term.length)

  const segments: TextSegment[] = []
  let cursor = 0

  while (cursor < text.length) {
    let matched: GlossaryEntry | undefined
    let matchedAt = -1

    for (const entry of candidates) {
      const at = text.indexOf(entry.term, cursor)
      if (at === -1) continue
      if (matchedAt === -1 || at < matchedAt || (at === matchedAt && entry.term.length > (matched?.term.length ?? 0))) {
        matchedAt = at
        matched = entry
      }
    }

    if (!matched || matchedAt === -1) {
      segments.push({ text: text.slice(cursor) })
      break
    }

    if (matchedAt > cursor) segments.push({ text: text.slice(cursor, matchedAt) })
    segments.push({ text: matched.term, termId: matched.id, entry: matched })
    cursor = matchedAt + matched.term.length
  }

  return segments
}

/** 按分类分组，用于词典页的左侧导航。 */
export function groupByCategory(
  entries: readonly GlossaryEntry[],
): Map<GlossaryEntry['category'], GlossaryEntry[]> {
  const out = new Map<GlossaryEntry['category'], GlossaryEntry[]>()
  for (const e of entries) {
    const list = out.get(e.category)
    if (list) list.push(e)
    else out.set(e.category, [e])
  }
  for (const list of out.values()) list.sort((a, b) => a.term.localeCompare(b.term, 'zh'))
  return out
}
