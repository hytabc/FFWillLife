import { useEffect, useRef } from 'react'
import { charactersById } from '../content'
import { playPickup, playSettle } from '../game/audio'
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
 * 拖动时显示**实时预览**（评级会怎么变）。点下「让这件事发生」后，
 * 先进入约一秒的「世界线改写」演出——期间编排被锁住、按钮不可再点，
 * 然后才揭晓正文与这封信改变了谁。这一秒的留白是有意的：
 * 它让"我的改动真的落到了世界线上"变成一个能被感知的动作，
 * 而不是一次瞬间的状态切换。
 */
export function EndingPanel({ live }: Props) {
  const settled = useGameStore((s) => s.settled)
  const settling = useGameStore((s) => s.settling)
  const beginSettle = useGameStore((s) => s.beginSettle)
  const settle = useGameStore((s) => s.settle)
  const retry = useGameStore((s) => s.retry)
  const settledLetters = useGameStore((s) => s.settledLetters)
  const openLetter = useGameStore((s) => s.openLetter)
  const upcoming = nextLetter(settledLetters)
  const timer = useRef<number | undefined>(undefined)

  // 演出结束前若组件卸载，清掉定时器，避免对已卸载的界面写状态
  useEffect(
    () => () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current)
    },
    [],
  )

  const commit = () => {
    if (settled || settling) return
    beginSettle()
    playPickup() // 世界线开始颤动
    timer.current = window.setTimeout(() => {
      // 结果以**落定瞬间**的状态为准，而不是按下按钮时的预览
      const final = resolvePlay(useGameStore.getState())
      settle()
      playSettle(final.ending.rating)
      timer.current = undefined
    }, 1000)
  }

  const shown = settled ?? live
  const color = RATING_COLOR[shown.ending.rating]
  const displaced = shown.misplacements.filter((m) => m.kind !== 'none' && m.kind !== 'reorder')

  return (
    <aside
      className={`panel${settling ? ' panel--settling' : ''}`}
      style={{ ['--rating-color' as string]: color }}
      aria-busy={settling}
    >
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
      ) : settling ? (
        <div className="panel__settling" role="status" aria-live="polite">
          <span className="panel__settling-orb" aria-hidden="true" />
          <p className="panel__settling-text">因果线正在改写……</p>
          <p className="panel__settling-sub">你改动的那几句话，正落向这条世界线。</p>
        </div>
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
