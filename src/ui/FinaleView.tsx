import { characters } from '../content'
import { computeFinale, describePressure } from '../game/finale'
import type { CharacterOutcome } from '../engine/types'
import { useGameStore } from '../store/gameStore'
import { RATING_COLOR, ratingLabel } from './rating'

/**
 * 终章界面：倾听者手记 + 牵制结算。
 *
 * 这一屏存在的意义是让"结局相互牵制"这件事**看得见**——
 * PRD 的核心承诺是"不存在全员 S 的完美解"，
 * 如果玩家永远看不到是谁把谁压下去了，那句承诺就只是一句设定。
 */

function OutcomeRow({ outcome }: { outcome: CharacterOutcome }) {
  const character = characters.find((c) => c.id === outcome.characterId)
  const ending = character?.endings.find((e) => e.id === outcome.endingId)
  const changed = outcome.preliminaryRating !== outcome.finalRating

  return (
    <li className="outcome">
      <span className="outcome__dot" style={{ background: character?.themeColor ?? '#666' }} />
      <span className="outcome__name">{character?.name ?? outcome.characterId}</span>
      <span className="outcome__ending">{ending ? ending.name : '—'}</span>
      <span className="outcome__rating">
        {changed && (
          <>
            <span className="outcome__before" style={{ color: RATING_COLOR[outcome.preliminaryRating] }}>
              {ratingLabel(outcome.preliminaryRating)}
            </span>
            <span className="outcome__arrow">→</span>
          </>
        )}
        <span className="outcome__after" style={{ color: RATING_COLOR[outcome.finalRating] }}>
          {ratingLabel(outcome.finalRating)}
        </span>
      </span>
    </li>
  )
}

export function FinaleView({ onClose }: { onClose: () => void }) {
  const tendencyEvents = useGameStore((s) => s.tendencyEvents)
  const settledLetters = useGameStore((s) => s.settledLetters)

  const finale = computeFinale(tendencyEvents, settledLetters)
  const pressures = describePressure(finale.trace)
  const ordered = characters
    .map((c) => finale.outcomes[c.id])
    .filter((o): o is CharacterOutcome => o !== undefined)

  return (
    <div className="finale" role="dialog" aria-label="倾听者手记">
      <header className="finale__head">
        <h2>倾听者手记</h2>
        <button type="button" className="finale__close" onClick={onClose}>
          ✕
        </button>
      </header>

      <div className="finale__body">
        <section className="finale__notebook">
          {finale.notebook.split('\n').map((line, i) =>
            line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>,
          )}
        </section>

        <aside className="finale__stats">
          <h3>这一周目的因果</h3>
          <dl>
            <div>
              <dt>已结算信件</dt>
              <dd>{finale.settledCount}</dd>
            </div>
            <div>
              <dt>成全指数</dt>
              <dd>{finale.dimensions.fulfillment} 人获得 S/A</dd>
            </div>
            <div>
              <dt>牺牲指数</dt>
              <dd>{finale.dimensions.sacrifice} 人跌至 C/D</dd>
            </div>
            <div>
              <dt>平衡指数</dt>
              <dd>{finale.dimensions.balance} / 3</dd>
            </div>
            <div>
              <dt>因果倾向</dt>
              <dd>
                {finale.dimensions.inclination === 'self-sacrifice'
                  ? '为某一边付了代价'
                  : finale.dimensions.inclination === 'let-them-choose'
                    ? '让每个人各自承担'
                    : '两者之间'}
              </dd>
            </div>
          </dl>

          {finale.coexistHits.length > 0 && (
            <div className="finale__coexist">
              <h3>你让两个矛盾的结局同时成立了</h3>
              <ul>
                {finale.coexistHits.map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong>
                    <p>{c.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <section className="finale__outcomes">
        <h3>角色结局</h3>
        <ul>
          {ordered.map((o) => (
            <OutcomeRow key={o.characterId} outcome={o} />
          ))}
        </ul>

        {pressures.length > 0 ? (
          <div className="finale__pressure">
            <h3>谁压住了谁</h3>
            <ul>
              {pressures.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="finale__nopressure">
            这一周目里，没有人因为别人的高评级而被拉下来。
          </p>
        )}
      </section>
    </div>
  )
}
