import { line, curveBumpX } from 'd3-shape'
import { useMemo } from 'react'
import { chapters, characters } from '../content'
import { computeFinale } from '../game/finale'
import { isRated } from '../engine/types'
import { useGameStore } from '../store/gameStore'
import { RATING_COLOR, ratingLabel } from './rating'

const ROW_H = 42
const HEAD_H = 30
const CH_W = 128
/** 左侧留给角色名的宽度。名字是 2~3 个汉字且右对齐，留窄了会被裁掉。 */
const NAME_W = 96
const LEFT = NAME_W + 46
/** 右侧留给牵制弧线的宽度。 */
const GUTTER = 190

/**
 * 因果树 —— 把"结局相互牵制"这件事画出来。
 *
 * 三样东西同屏：
 *  · **竖线**：每位角色的成长阶段（第几章时他活到了哪一步）
 *  · **节点**：已结算的信件，颜色是它打出的评级
 *  · **红线**：牵制引擎实际生效的边 —— 谁的高评级把谁拉了下来
 *
 * 没有这一屏，"不存在全员 S"就只是一句设定；有了它，玩家能亲眼看见
 * 自己成全的那个人，正是把另一个人推下去的原因。
 */
export function CausalityTree({ onClose }: { onClose: () => void }) {
  const tendencyEvents = useGameStore((s) => s.tendencyEvents)
  const settledLetters = useGameStore((s) => s.settledLetters)

  const finale = computeFinale(tendencyEvents, settledLetters)
  const orderedChapters = useMemo(
    () => [...chapters].sort((a, b) => a.index - b.index),
    [],
  )

  const width = LEFT + orderedChapters.length * CH_W + GUTTER
  const height = HEAD_H + characters.length * ROW_H + 20

  const x = (chapterIndex: number) => LEFT + (chapterIndex - 1) * CH_W + CH_W / 2
  const y = (characterId: string) =>
    HEAD_H + characters.findIndex((c) => c.id === characterId) * ROW_H + ROW_H / 2

  // 每封信的节点：放在它的主角（第一个出场角色）那一行
  const nodes = Object.values(settledLetters).flatMap((settled) => {
    const chapter = chapters.find((c) =>
      c.letterIds.includes(settled.letterId),
    )
    const characterId = settled.involvedCharacterIds[0]
    if (!chapter || !characterId) return []
    return [
      {
        id: settled.letterId,
        cx: x(chapter.index),
        cy: y(characterId),
        rating: settled.rating,
      },
    ]
  })

  const linkGen = line<{ x: number; y: number }>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveBumpX)

  return (
    <div className="tree" role="dialog" aria-label="因果树">
      <header className="tree__head">
        <h2>因果树</h2>
        <div className="tree__legend">
          <span>
            <i className="tree__swatch tree__swatch--node" />
            已结算信件（颜色为评级）
          </span>
          <span>
            <i className="tree__swatch tree__swatch--arrow" />
            牵制：高评级压低了谁
          </span>
        </div>
        <button type="button" className="tree__close" onClick={onClose}>
          ✕
        </button>
      </header>

      <div className="tree__scroll">
        <svg width={width} height={height} role="img" aria-label="角色因果图">
          {/* 章节竖线 */}
          {orderedChapters.map((c) => (
            <g key={c.id}>
              <line
                x1={x(c.index)}
                y1={HEAD_H - 8}
                x2={x(c.index)}
                y2={height - 14}
                className="tree__grid"
              />
              <text x={x(c.index)} y={18} className="tree__chapter">
                第{c.index}章 · {c.title}
              </text>
            </g>
          ))}

          {/* 角色行 */}
          {characters.map((character) => {
            const outcome = finale.outcomes[character.id]
            return (
              <g key={character.id}>
                <line
                  x1={LEFT - 26}
                  y1={y(character.id)}
                  x2={width - GUTTER + 20}
                  y2={y(character.id)}
                  className="tree__lane"
                />
                <circle cx={LEFT - 34} cy={y(character.id)} r={4} fill={character.themeColor} />
                <text x={LEFT - 44} y={y(character.id) + 4} className="tree__name" textAnchor="end">
                  {character.name}
                </text>
                {outcome && (
                  <text
                    x={width - GUTTER + 26}
                    y={y(character.id) + 4}
                    className="tree__rating"
                    fill={RATING_COLOR[outcome.finalRating]}
                  >
                    {ratingLabel(outcome.finalRating)}
                  </text>
                )}
              </g>
            )
          })}

          {/* 已结算信件节点 */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isRated(node.rating) ? 6 : 7}
                fill={RATING_COLOR[node.rating]}
                className="tree__node"
              />
              <title>
                {node.id} · {ratingLabel(node.rating)}
              </title>
            </g>
          ))}

          {/* 牵制边 */}
          {finale.trace.applied.map((app, i) => {
            const fromY = y(app.from)
            const toY = y(app.to)
            if (fromY === undefined || toY === undefined) return null
            const x0 = width - GUTTER + 46
            const x1 = width - GUTTER + 148
            return (
              <g key={`${app.edgeId}-${i}`} className="tree__arrow">
                <path d={linkGen([{ x: x0, y: fromY }, { x: x1, y: toY }]) ?? ''} />
                <title>{app.rationale}</title>
              </g>
            )
          })}
        </svg>
      </div>

      {finale.trace.applied.length === 0 && (
        <p className="tree__empty">
          还没有任何牵制生效 —— 目前没有人因为别人的高评级而被拉下来。
        </p>
      )}
    </div>
  )
}
