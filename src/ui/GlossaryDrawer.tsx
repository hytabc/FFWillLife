import { useMemo, useState } from 'react'
import { characters, glossaryEntries, letters } from '../content'
import { groupByCategory, searchGlossary } from '../engine/glossary'
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_CATEGORY_LABEL,
  TIME_PHASES,
  TIME_PHASE_LABEL,
  isRated,
  type GlossaryCategory,
  type RatedRating,
} from '../engine/types'
import { computeFinale } from '../game/finale'
import { useGameStore } from '../store/gameStore'
import { RATING_COLOR, ratingLabel } from './rating'

type Tab = 'glossary' | 'characters' | 'endings'

const TIER_BANDS: RatedRating[] = ['S', 'A', 'B', 'C', 'D']

/**
 * 收藏图鉴 —— 三本册子合订：
 *  · **术语**：FF14 黑话，非玩家靠它读懂故事
 *  · **角色**：八个人的语义弧光与结局收集度
 *  · **结局**：全部信件结局，已打出来的会亮起来
 *
 * 第三本册子的意义不在于"全收集"，而在于让玩家看见
 * **自己这一周目错过了什么**——那是本作想让人反复重开的原因。
 */
export function GlossaryDrawer() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('glossary')

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<GlossaryCategory | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const learned = useGameStore((s) => s.learnedTermIds)
  const learnTerm = useGameStore((s) => s.learnTerm)
  const settledLetters = useGameStore((s) => s.settledLetters)

  const grouped = useMemo(() => groupByCategory(glossaryEntries), [])
  const results = useMemo(() => {
    const base = query.trim() ? searchGlossary(glossaryEntries, query) : glossaryEntries
    return category === 'all' ? base : base.filter((e) => e.category === category)
  }, [query, category])

  const selected = results.find((e) => e.id === selectedId) ?? results[0] ?? null

  const achievedEndingIds = new Set(Object.values(settledLetters).map((s) => s.endingId))
  const totalEndings = letters.reduce((n, l) => n + l.endings.length, 0)
  const seenEndings = [...achievedEndingIds].length

  // 角色结局要到终章结算才成立，所以它的"已达成"必须走终章那条链路，
  // 不能拿信件结局的 id 去比对（两者根本不在一个命名空间里）。
  const tendencyEvents = useGameStore((s) => s.tendencyEvents)
  const finale = useMemo(
    () => computeFinale(tendencyEvents, settledLetters),
    [tendencyEvents, settledLetters],
  )

  return (
    <>
      <button type="button" className="glossary-fab" onClick={() => setOpen((v) => !v)}>
        图鉴
        <span className="glossary-fab__count">
          {learned.length}/{glossaryEntries.length} · 结局 {seenEndings}/{totalEndings}
        </span>
      </button>

      {open && (
        <div className="glossary" role="dialog" aria-label="收藏图鉴">
          <header className="glossary__head">
            <nav className="glossary__tabs">
              {(
                [
                  ['glossary', '术语'],
                  ['characters', '角色'],
                  ['endings', '结局'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={tab === id ? 'active' : ''}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </nav>
            {tab === 'glossary' && (
              <input
                type="search"
                placeholder="搜索术语、拼音或释义……"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
            <button type="button" className="glossary__close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </header>

          {tab === 'glossary' && (
            <div className="glossary__body">
              <nav className="glossary__nav">
                <button
                  type="button"
                  className={category === 'all' ? 'active' : ''}
                  onClick={() => setCategory('all')}
                >
                  全部
                  <span>{glossaryEntries.length}</span>
                </button>
                {GLOSSARY_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={category === c ? 'active' : ''}
                    onClick={() => setCategory(c)}
                  >
                    {GLOSSARY_CATEGORY_LABEL[c]}
                    <span>{grouped.get(c)?.length ?? 0}</span>
                  </button>
                ))}
              </nav>

              <ul className="glossary__list">
                {results.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className={[
                        selected?.id === entry.id ? 'active' : '',
                        learned.includes(entry.id) ? 'learned' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => {
                        setSelectedId(entry.id)
                        learnTerm(entry.id)
                      }}
                    >
                      <span className="glossary__term">{entry.term}</span>
                      <span className="glossary__brief">{entry.brief}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <article className="glossary__detail">
                {selected ? (
                  <>
                    <h3>{selected.term}</h3>
                    <p className="glossary__pinyin">
                      {selected.pinyin} · {GLOSSARY_CATEGORY_LABEL[selected.category]}
                    </p>
                    <p className="glossary__detail-text">{selected.detail}</p>
                    <blockquote>{selected.example}</blockquote>
                    {selected.memeRef && <p className="glossary__meme">关联梗：{selected.memeRef}</p>}
                  </>
                ) : (
                  <p className="glossary__empty">没有匹配的术语。</p>
                )}
              </article>
            </div>
          )}

          {tab === 'characters' && (
            <div className="codex">
              {characters.map((character) => {
                const currentEndingId = finale.outcomes[character.id]?.endingId ?? null
                const achieved = character.endings.filter((e) => e.id === currentEndingId)
                return (
                  <article key={character.id} className="codex__char">
                    <header>
                      <span className="roster__dot" style={{ background: character.themeColor }} />
                      <h3>{character.name}</h3>
                      <span className="codex__role">{character.role}</span>
                      <span className="codex__count">
                        {achieved.length > 0
                          ? `本周目 → ${achieved[0]!.name}`
                          : `0/${character.endings.length}`}
                      </span>
                    </header>
                    <p className="codex__arc">{character.arc}</p>
                    <ul className="codex__endings">
                      {[...character.endings]
                        .sort(
                          (a, b) =>
                            TIER_BANDS.indexOf(a.rating as RatedRating) -
                            TIER_BANDS.indexOf(b.rating as RatedRating),
                        )
                        .map((ending) => {
                          const got = achievedEndingIds.has(ending.id)
                          return (
                            <li key={ending.id} className={got ? 'got' : ''}>
                              <span
                                className="codex__rating"
                                style={{ color: RATING_COLOR[ending.rating] }}
                              >
                                {ratingLabel(ending.rating)}
                              </span>
                              <span className="codex__ending-name">
                                {got ? ending.name : '？？？'}
                              </span>
                              <span className="codex__ending-sum">{got ? ending.summary : '尚未抵达'}</span>
                            </li>
                          )
                        })}
                    </ul>
                  </article>
                )
              })}
            </div>
          )}

          {tab === 'endings' && (
            <div className="codex codex--endings">
              {letters.map((letter) => (
                <article key={letter.id} className="codex__letter">
                  <header>
                    <h3>
                      {letter.hidden ? '◆ ' : ''}
                      {letter.title}
                    </h3>
                    <span className="codex__count">
                      {letter.endings.filter((e) => achievedEndingIds.has(e.id)).length}/
                      {letter.endings.length}
                    </span>
                  </header>
                  <ul className="codex__endings">
                    {[...letter.endings]
                      .sort((a, b) => a.priority - b.priority)
                      .map((ending) => {
                        const got = achievedEndingIds.has(ending.id)
                        return (
                          <li key={ending.id} className={got ? 'got' : ''}>
                            <span
                              className="codex__rating"
                              style={{ color: RATING_COLOR[ending.rating] }}
                            >
                              {ratingLabel(ending.rating)}
                            </span>
                            <span className="codex__ending-name">
                              {got ? ending.title : '？？？'}
                            </span>
                            {got && isRated(ending.rating) && (
                              <span className="codex__ending-sum">
                                {ending.body.slice(0, 46)}…
                              </span>
                            )}
                          </li>
                        )
                      })}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

/** 供角色档案页显示的"该角色四个阶段说过什么"。 */
export function CharacterPhaseLines({ characterId }: { characterId: string }) {
  const character = characters.find((c) => c.id === characterId)
  if (!character) return null
  return (
    <ul>
      {TIME_PHASES.map((p) => {
        const line = character.statements.find((s) => s.phase === p)
        return (
          <li key={p}>
            <strong>{TIME_PHASE_LABEL[p]}</strong>
            {line ? `「${line.text}」` : '——'}
          </li>
        )
      })}
    </ul>
  )
}
