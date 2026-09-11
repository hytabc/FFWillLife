import { memo } from 'react'
import { characters } from '../content'
import { GOLDEN_CHARACTERS } from '../content/_golden/prd-facts'
import { TENDENCY_BANDS } from '../content/_shared/endings'
import { computeTendency } from '../engine/characterTracker'
import { isFlowComplete } from '../game/progress'
import { useGameStore } from '../store/gameStore'
import { RATING_COLOR, ratingLabel } from './rating'

/** 倾向值落在哪个评级区间。与角色结局判定用的是同一套区间常量。 */
function bandOf(tendency: number): keyof typeof TENDENCY_BANDS {
  if (tendency >= TENDENCY_BANDS.S.min) return 'S'
  if (tendency >= TENDENCY_BANDS.A.min) return 'A'
  if (tendency >= TENDENCY_BANDS.B.min) return 'B'
  if (tendency >= TENDENCY_BANDS.C.min) return 'C'
  return 'D'
}

/**
 * 底部角色故事线面板 —— 始终展示全部 8 席。
 *
 * 尚未登场的角色也占一个位置：玩家从第一章就能看见"还有谁的故事没开始"，
 * 这本身就是一种叙事承诺。
 *
 * 但**评级在通关前是锁住的**：这里只显示"未知"，不显示 S/A/B/C/D，
 * 也不预告"谁的高评级会压住谁"。角色之间的牵制关系要玩家自己在信件里摸索，
 * 等全部可见信件结算完毕后，才解锁真实评级。
 */
export const CharacterPanel = memo(function CharacterPanel() {
  const tendencyEvents = useGameStore((s) => s.tendencyEvents)
  const settledLetters = useGameStore((s) => s.settledLetters)
  const unlocked = isFlowComplete(settledLetters)
  const authoredIds = new Set(characters.map((c) => c.id))

  return (
    <section className="roster">
      {GOLDEN_CHARACTERS.map((golden) => {
        const character = characters.find((c) => c.id === golden.id)
        const hasAppeared = authoredIds.has(golden.id)
        const tendency = hasAppeared ? computeTendency(tendencyEvents, golden.id) : 0
        const rating = bandOf(tendency)

        return (
          <article
            key={golden.id}
            className={`roster__card${hasAppeared ? '' : ' roster__card--absent'}`}
          >
            <header>
              <span className="roster__dot" style={{ background: character?.themeColor ?? '#4a5261' }} />
              <span className="roster__name">{golden.name}</span>
              {!hasAppeared ? (
                <span className="roster__absent-tag">尚未登场</span>
              ) : unlocked ? (
                <span
                  className="roster__rating"
                  style={{ color: RATING_COLOR[rating] }}
                  title={`倾向值 ${tendency}`}
                >
                  {ratingLabel(rating)}
                </span>
              ) : (
                <span className="roster__rating roster__rating--locked" title="通关后解锁真实评级">
                  未知
                </span>
              )}
            </header>
            <p className="roster__role">{character?.role ?? golden.role}</p>

            {hasAppeared && unlocked && (
              <div className="roster__bar">
                <span
                  className="roster__bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((tendency + 10) / 20) * 100))}%`,
                    background: RATING_COLOR[rating],
                  }}
                />
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
})
