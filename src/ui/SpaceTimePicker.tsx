import { useState } from 'react'
import { playDisplace } from '../game/audio'
import { previewDisplacement } from '../game/play'
import {
  MISPLACEMENT_LABEL,
  SPACE_TAGS,
  SPACE_TAG_LABEL,
  TIME_PHASES,
  TIME_PHASE_LABEL,
  type BlockId,
  type MisplacementKind,
  type SpaceTime,
  type Statement,
} from '../engine/types'
import { useGameStore } from '../store/gameStore'

/** 档位 → 主题色，与语句块光晕一致。 */
const TIER_COLOR: Record<MisplacementKind, string> = {
  none: 'var(--ink-faint)',
  reorder: 'var(--ink-dim)',
  microshift: '#7fb2e5',
  transform: '#a97fd1',
  high: '#6fd0d0',
}

interface Props {
  blockId: BlockId
  statement: Statement
  /** 该语句的原始时空（棋盘上的"家"） */
  origin: SpaceTime
  /** 当前位置；缺省即信件锚点 */
  current?: SpaceTime | undefined
  /** 本章允许的错位档位 —— 未解锁的格子会被禁用（PRD §6.1 渐进式教学） */
  allowed: MisplacementKind[]
  onClose: () => void
}

/**
 * 时空锚点选择器 —— 把一句话放到另一个年纪、另一个场合去读。
 *
 * 这是本作的核心操作界面（PRD §4.3「时间轴视图」）：
 * 纵向是成长阶段，横向是场合。选一格，那句话就换了一个时空被说出来。
 *
 * 它同时承担教学职责——每一格都实时显示**这一放会产生哪种错位**，
 * 以及**这句话在那边会被读成什么**。玩家不需要先读说明书。
 */
export function SpaceTimePicker({ blockId, statement, origin, current, allowed, onClose }: Props) {
  const setBorrowed = useGameStore((s) => s.setBorrowed)
  const clearBorrowed = useGameStore((s) => s.clearBorrowed)
  const [hover, setHover] = useState<SpaceTime | null>(null)

  const allowedSet = new Set(allowed)
  const preview = hover ?? current ?? origin
  const result = hover || current ? previewDisplacement(statement, preview) : null

  return (
    <div className="picker" role="dialog" aria-label="把这句话放到别的时空">
      <header className="picker__head">
        <div>
          <strong>把这句话放到别的时空</strong>
          <p className="picker__origin">
            它本来是
            <em>
              {TIME_PHASE_LABEL[origin.phase]} · {SPACE_TAG_LABEL[origin.space]}
            </em>
            说的
          </p>
        </div>
        <button type="button" className="picker__close" onClick={onClose}>
          ✕
        </button>
      </header>

      <div className="picker__grid-wrap">
        <table className="picker__grid">
          <thead>
            <tr>
              <th />
              {SPACE_TAGS.map((s) => (
                <th key={s}>{SPACE_TAG_LABEL[s]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_PHASES.map((p) => (
              <tr key={p}>
                <th scope="row">{TIME_PHASE_LABEL[p]}</th>
                {SPACE_TAGS.map((s) => {
                  const cell: SpaceTime = { phase: p, space: s }
                  const isOrigin = p === origin.phase && s === origin.space
                  const isCurrent = current?.phase === p && current?.space === s
                  const cellResult = previewDisplacement(statement, cell)
                  const tier = cellResult?.kind ?? (isOrigin ? 'none' : 'reorder')
                  const locked = !isOrigin && !allowedSet.has(tier)
                  return (
                    <td key={s}>
                      <button
                        type="button"
                        className={[
                          'picker__cell',
                          isOrigin ? 'picker__cell--origin' : '',
                          isCurrent ? 'picker__cell--current' : '',
                          locked ? 'picker__cell--locked' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ ['--tier' as string]: TIER_COLOR[tier] }}
                        onMouseEnter={() => setHover(cell)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(cell)}
                        onBlur={() => setHover(null)}
                        onClick={() => {
                          if (locked) return
                          if (isOrigin) clearBorrowed(blockId)
                          else setBorrowed(blockId, cell)
                          playDisplace(tier)
                          onClose()
                        }}
                        title={
                          locked
                            ? `${MISPLACEMENT_LABEL[tier]} —— 本章还没有解锁这种错位`
                            : `${MISPLACEMENT_LABEL[tier]}${isOrigin ? '（原位）' : ''}`
                        }
                      >
                        {isOrigin ? '◉' : locked ? '·' : cellResult ? '◆' : '·'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="picker__preview">
        {result ? (
          <>
            <span className="picker__tier" style={{ color: TIER_COLOR[result.kind] }}>
              {MISPLACEMENT_LABEL[result.kind]}
            </span>
            <p className="picker__text">{result.text}</p>
          </>
        ) : (
          <p className="picker__hint">
            ◆ 表示这句话在那一格会被**重新解读**。把鼠标移上去看看它会变成什么。
            <br />
            <span className="picker__hint-dim">
              ◉ 是它原来的位置。点它就是把这句话放回去。
            </span>
          </p>
        )}
      </footer>
    </div>
  )
}
