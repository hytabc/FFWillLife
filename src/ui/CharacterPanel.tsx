import { memo } from 'react'
import { characters, constraintEdges } from '../content'
import { GOLDEN_CHARACTERS } from '../content/_golden/prd-facts'
import { TENDENCY_BANDS } from '../content/_shared/endings'
import { computeTendency } from '../engine/characterTracker'
import { useGameStore } from '../store/gameStore'
import { RATING_COLOR, ratingLabel } from './rating'

/**
 * 名字查表要**先查已实装角色，再退回黄金契约**。
 * 只查已实装角色的话，牵制关系里指向尚未登场的角色时会直接把 id 渲染出来，
 * 玩家会看到「他的高评级会压住：yuanshan」。
 */
export function characterNameOf(id: string): string {
  return (
    characters.find((c) => c.id === id)?.name ??
    GOLDEN_CHARACTERS.find((c) => c.id === id)?.name ??
    id
  )
}

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
 * 这本身就是一种叙事承诺。显示的评级是**未经牵制调整**的初步值，
 * 牵制要到终章结算才生效，所以这里用文字预告"这个 S 会压住谁"。
 */
export const CharacterPanel = memo(function CharacterPanel() {
  const tendencyEvents = useGameStore((s) => s.tendencyEvents)
  const authoredIds = new Set(characters.map((c) => c.id))

  return (
    <section className="roster">
      {GOLDEN_CHARACTERS.map((golden) => {
        const character = characters.find((c) => c.id === golden.id)
        const hasAppeared = authoredIds.has(golden.id)
        const tendency = hasAppeared ? computeTendency(tendencyEvents, golden.id) : 0
        const rating = bandOf(tendency)
        const pressures = constraintEdges.filter((e) => e.from === golden.id)
        const pressuredBy = constraintEdges.filter((e) => e.to === golden.id)

        return (
          <article
            key={golden.id}
            className={`roster__card${hasAppeared ? '' : ' roster__card--absent'}`}
          >
            <header>
              <span className="roster__dot" style={{ background: character?.themeColor ?? '#4a5261' }} />
              <span className="roster__name">{golden.name}</span>
              {hasAppeared ? (
                <span
                  className="roster__rating"
                  style={{ color: RATING_COLOR[rating] }}
                  title={`倾向值 ${tendency}`}
                >
                  {ratingLabel(rating)}
                </span>
              ) : (
                <span className="roster__absent-tag">尚未登场</span>
              )}
            </header>
            <p className="roster__role">{character?.role ?? golden.role}</p>

            {hasAppeared && (
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

            {pressures.length > 0 && (
              <p className="roster__pressure">
                他的高评级会压住：
                {pressures.map((e) => (
                  <em key={e.id}>{characterNameOf(e.to)}</em>
                ))}
              </p>
            )}
            {pressuredBy.length > 0 && (
              <p className="roster__pressure roster__pressure--in">
                会被压住，如果：
                {pressuredBy.map((e) => (
                  <em key={e.id}>{characterNameOf(e.from)}</em>
                ))}
              </p>
            )}
          </article>
        )
      })}
    </section>
  )
})
