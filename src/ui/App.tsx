import { useMemo, useState } from 'react'
import { chapters, glossaryEntries } from '../content'
import { SPACE_TAG_LABEL, TIME_PHASE_LABEL, type BlockId, type MisplacementKind } from '../engine/types'
import { buildContexts } from '../game/play'
import { buildProgressTree, progressSummary } from '../game/progress'
import { useGameStore, useLiveResolution } from '../store/gameStore'
import { Suspense, lazy } from 'react'
import { CharacterPanel } from './CharacterPanel'
import { EndingPanel } from './EndingPanel'
import { FinaleView } from './FinaleView'
import { GlossaryDrawer } from './GlossaryDrawer'
import { LetterView, useLetter } from './LetterView'
import { RATING_COLOR, ratingLabel } from './rating'
import { SaveMenu } from './SaveMenu'

/**
 * 因果树单独打包：它依赖 d3-shape，而绝大多数会话根本不会打开它。
 * 拆出去之后首屏 chunk 不会被可视化库拖大。
 */
const CausalityTree = lazy(() =>
  import('./CausalityTree').then((m) => ({ default: m.CausalityTree })),
)

export function App() {
  const letterId = useGameStore((s) => s.letterId)
  const arrangement = useGameStore((s) => s.arrangement)
  const borrowed = useGameStore((s) => s.borrowed)
  const fullAnnotation = useGameStore((s) => s.fullAnnotation)
  const setFullAnnotation = useGameStore((s) => s.setFullAnnotation)
  const settledCount = useGameStore((s) => Object.keys(s.settledLetters).length)
  const settledLetters = useGameStore((s) => s.settledLetters)
  const openLetter = useGameStore((s) => s.openLetter)
  const [showFinale, setShowFinale] = useState(false)
  const [showTree, setShowTree] = useState(false)

  const sandbox = useGameStore((s) => s.sandbox)
  const toggleSandbox = useGameStore((s) => s.toggleSandbox)
  const experiments = useGameStore((s) => s.experiments)
  const sound = useGameStore((s) => s.sound)
  const setSound = useGameStore((s) => s.setSound)

  const tree = useMemo(
    () => buildProgressTree(settledLetters, 0, sandbox),
    [settledLetters, sandbox],
  )
  const progress = progressSummary(settledLetters)

  const letter = useLetter(letterId)
  const live = useLiveResolution()

  const misplacementByBlock = useMemo(() => {
    const ctx = buildContexts({ letterId, arrangement, borrowed })
    const out: Record<BlockId, MisplacementKind> = {}
    for (const [id, c] of Object.entries(ctx)) out[id] = c.misplacement
    return out
  }, [letterId, arrangement, borrowed])

  const chapter = chapters.find((c) => c.id === letter.chapterId)

  return (
    <div className={`app${sandbox ? ' app--sandbox' : ''}`}>
      <header className="topbar">
        <div className="topbar__brand">
          <h1>艾欧泽亚因果信笺</h1>
          <p>
            {chapter ? `第${chapter.index}章 · ${chapter.title} — ${chapter.subtitle}` : '—'}
          </p>
        </div>
        <div className="topbar__tools">
          <label className="toggle">
            <input
              type="checkbox"
              checked={fullAnnotation}
              onChange={(e) => setFullAnnotation(e.target.checked)}
            />
            全注释模式
          </label>
          <label className="toggle" title="水晶回响音效（实时合成，无音频文件）">
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
            音效
          </label>
          <span className="topbar__glossary-count">
            进度 {progress.done}/{progress.visible} · 术语图鉴 {glossaryEntries.length} 条
          </span>
          {experiments.length > 0 && (
            <span className="topbar__experiments">实验日志 {experiments.length} 条</span>
          )}
          <button
            type="button"
            className={`topbar__sandbox${sandbox ? ' topbar__sandbox--on' : ''}`}
            onClick={toggleSandbox}
            title={
              sandbox
                ? '沙盘模式：任意试验，不写入主线进度。点击回到主线的当前周目'
                : '沙盘模式：打开任何一封信自由试验，结果只记进实验日志，不影响主线'
            }
          >
            {sandbox ? '沙盘 · 开' : '时空沙盘'}
          </button>
          <button
            type="button"
            className="topbar__finale"
            disabled={settledCount === 0}
            title={settledCount === 0 ? '先结算至少一封信' : '看看这一周目你选出了怎样的因果'}
            onClick={() => setShowFinale(true)}
          >
            倾听者手记
            <span>{settledCount > 0 ? `${settledCount} 封` : '—'}</span>
          </button>
        </div>
      </header>

      <main className="layout">
        <nav className="channels">
          <h2>通讯贝</h2>
          {tree.map((node) => (
            <section key={node.chapter.id} className="channel-group">
              <header className="channel-group__head">
                <span className="channel__dot" />
                第{node.chapter.index}章 · {node.chapter.title}
                <span className="channel__count">
                  {node.settledCount}/{node.letters.length}
                </span>
              </header>
              <ul>
                {node.letters.map((item) => {
                  const state = !item.unlocked
                    ? 'locked'
                    : item.settled
                      ? 'done'
                      : 'open'
                  return (
                    <li key={item.letter.id}>
                      <button
                        type="button"
                        className={`letter-link letter-link--${state}${
                          item.letter.id === letterId ? ' letter-link--active' : ''
                        }`}
                        disabled={!item.unlocked}
                        onClick={() => openLetter(item.letter.id)}
                        title={
                          item.settled
                            ? `${item.settled.rating} · 已完成，可重打`
                            : item.unlocked
                              ? '未结算'
                              : '尚未解锁'
                        }
                      >
                        <span className="letter-link__title">
                          {item.letter.hidden ? '◆ ' : ''}
                          {item.letter.title}
                        </span>
                        <span className="letter-link__state">
                          {item.settled ? (
                            <em style={{ color: RATING_COLOR[item.settled.rating] }}>
                              {ratingLabel(item.settled.rating)}
                            </em>
                          ) : item.unlocked ? (
                            '可阅读'
                          ) : (
                            '锁'
                          )}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </nav>

        <section className="stage">
          <div className="stage__anchor">
            <span className="anchor-chip anchor-chip--phase">
              {TIME_PHASE_LABEL[letter.anchor.phase]}
            </span>
            <span className="anchor-chip anchor-chip--space">
              {SPACE_TAG_LABEL[letter.anchor.space]}
            </span>
          </div>
          <LetterView letter={letter} misplacementByBlock={misplacementByBlock} />
        </section>

        <EndingPanel live={live} />
      </main>

      <CharacterPanel />
      <GlossaryDrawer />
      <SaveMenu />
      <button
        type="button"
        className="tree-fab"
        disabled={settledCount === 0}
        onClick={() => setShowTree(true)}
        title={settledCount === 0 ? '先结算至少一封信' : '看看这一周目的因果交织'}
      >
        因果树
      </button>
      {showTree && (
        <Suspense fallback={<div className="tree tree--loading">正在展开因果……</div>}>
          <CausalityTree onClose={() => setShowTree(false)} />
        </Suspense>
      )}
      {showFinale && <FinaleView onClose={() => setShowFinale(false)} />}
    </div>
  )
}
