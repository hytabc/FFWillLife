import { charactersById } from '../content'
import { playSettle } from '../game/audio'
import { resolvePlay } from '../game/play'
import { MISPLACEMENT_LABEL, type LetterResolution } from '../engine/types'
import { nextLetter } from '../game/progress'
import { useGameStore } from '../store/gameStore'
import { RATING_COLOR, RATING_MEANING, ratingLabel } from './rating'

interface Props {
  live: LetterResolution
}

/**
 * 右侧结算面板。
 *
 * 拖动时显示**实时预览**（评级会怎么变），提交后显示**结算正文**。
 * 这是《Will》体验的核心：玩家在松手前就能看见因果的走向。
 */
export function EndingPanel({ live }: Props) {
  const settled = useGameStore((s) => s.settled)
  const settle = useGameStore((s) => s.settle)
  const retry = useGameStore((s) => s.retry)
  const settledLetters = useGameStore((s) => s.settledLetters)
  const openLetter = useGameStore((s) => s.openLetter)
  const upcoming = nextLetter(settledLetters)

  const commit = () => {
    // 先算出结果再发声：音效要按**最终评级**给和弦，而不是按下按钮时的预览
    const preview = resolvePlay(useGameStore.getState())
    settle()
    playSettle(preview.ending.rating)
  }

  const shown = settled ?? live
  const color = RATING_COLOR[shown.ending.rating]
  const displaced = shown.misplacements.filter((m) => m.kind !== 'none' && m.kind !== 'reorder')

  return (
    <aside className="panel" style={{ ['--rating-color' as string]: color }}>
      <div className="panel__rating">
        <span className="panel__rating-mark">{ratingLabel(shown.ending.rating)}</span>
        <span className="panel__rating-word">{shown.ending.title}</span>
      </div>

      <p className="panel__meaning">{RATING_MEANING[shown.ending.rating]}</p>

      {displaced.length > 0 && (
        <div className="panel__displacement">
          {displaced.map((m) => (
            <span key={m.blockId} className="chip">
              {MISPLACEMENT_LABEL[m.kind]} · 偏移 {m.offset}
            </span>
          ))}
        </div>
      )}

      {settled ? (
        <>
          <div className="panel__body">
            {settled.ending.body.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {settled.ending.tendency.length > 0 && (
            <div className="panel__tendency">
              <h4>这一封信改变了谁</h4>
              <ul>
                {settled.ending.tendency.map((t) => {
                  const c = charactersById.get(t.characterId)
                  return (
                    <li key={t.characterId}>
                      <span className="tendency__name" style={{ color: c?.themeColor }}>
                        {c?.name ?? t.characterId}
                      </span>
                      <span className={`tendency__delta ${t.delta > 0 ? 'up' : t.delta < 0 ? 'down' : 'flat'}`}>
                        {t.delta > 0 ? `+${t.delta}` : t.delta}
                      </span>
                      <span className="tendency__reason">{t.reason}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className="panel__actions">
            <button type="button" onClick={retry}>
              重新排列
            </button>
            {upcoming && upcoming.id !== settled.letterId && (
              <button type="button" className="primary" onClick={() => openLetter(upcoming.id)}>
                读下一封 →
              </button>
            )}
          </div>

          {upcoming && upcoming.id !== settled.letterId && (
            <p className="panel__next">下一封：{upcoming.title}</p>
          )}
        </>
      ) : (
        <>
          <p className="panel__pending">
            这是你目前排列出的因果。松手之前，它还没有发生。
          </p>
          <div className="panel__actions">
            <button type="button" className="primary" onClick={commit}>
              让这件事发生
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
