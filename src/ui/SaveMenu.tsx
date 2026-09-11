import { useState } from 'react'
import { lettersById } from '../content'
import { AUTOSAVE_SLOT, deleteSave, emptySlotId, listSaves, writeSave } from '../game/save'
import type { SaveGame } from '../engine/types'
import { snapshot, useGameStore } from '../store/gameStore'

const stamp = (ms: number) =>
  new Date(ms).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

function describe(save: SaveGame): string {
  const done = Object.keys(save.letterResults).length
  return `${done} 封信 · ${save.tendencyEvents.length} 条因果记录`
}

/**
 * 存档槽管理。
 *
 * 多存档槽不只是便利功能——本作的核心乐趣是"试另一种因果"，
 * 玩家需要能开一个干净的周目去验证"如果当初我成全的是另一个人会怎样"，
 * 而不必先把当前周目删掉。
 */
export function SaveMenu() {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(0)

  const slotId = useGameStore((s) => s.slotId)
  const label = useGameStore((s) => s.label)
  const restoreFrom = useGameStore((s) => s.restoreFrom)
  const startNewGame = useGameStore((s) => s.startNewGame)

  // 只把自动存档槽作为"当前进度"持续覆写；其余槽位在保存时才写入
  const saves = open ? listSaves() : []

  /** 把当前进度复制到一个**新槽位**，不打断正在进行的周目。 */
  const saveCurrentAs = () => {
    const name = window.prompt('给这个存档起个名字', `周目 ${listSaves().length + 1}`)
    if (!name) return

    const current = snapshot(useGameStore.getState())
    const copy: SaveGame = {
      ...current,
      slotId: emptySlotId(),
      label: name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    writeSave(copy)
    setTick((t) => t + 1)
  }

  const totalLetters = lettersById.size

  return (
    <>
      <button type="button" className="save-fab" onClick={() => setOpen((v) => !v)} title="存档">
        存档
        <span>{label}</span>
      </button>

      {open && (
        <div className="save-menu" role="dialog" aria-label="存档槽">
          <header className="save-menu__head">
            <h2>存档</h2>
            <button type="button" className="save-menu__close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </header>

          <p className="save-menu__note">
            自动存档会持续记录当前周目。想试另一种因果时，可以先另存一份再开新档——
            本作没有"完美解"，值得多试几次。
          </p>

          <ul className="save-menu__list">
            {saves.map((save) => (
              <li key={save.slotId} className={save.slotId === slotId ? 'active' : ''}>
                <div>
                  <strong>{save.label}</strong>
                  <span className="save-menu__meta">
                    {describe(save)} · {stamp(save.updatedAt)}
                  </span>
                </div>
                <div className="save-menu__actions">
                  <button
                    type="button"
                    onClick={() => {
                      restoreFrom(save)
                      setOpen(false)
                    }}
                  >
                    读取
                  </button>
                  {save.slotId !== AUTOSAVE_SLOT && (
                    <button
                      type="button"
                      onClick={() => {
                        deleteSave(save.slotId)
                        setTick((t) => t + 1)
                      }}
                    >
                      删除
                    </button>
                  )}
                </div>
              </li>
            ))}
            {saves.length === 0 && <li className="save-menu__empty">还没有任何存档。</li>}
          </ul>

          <div className="save-menu__foot">
            <button type="button" onClick={saveCurrentAs}>
              另存为…
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => {
                if (!window.confirm('开新档会清空当前进度（已另存的槽位不受影响）。确定吗？')) return
                startNewGame(`周目 ${listSaves().length + 1}`)
                setOpen(false)
              }}
            >
              开新档
            </button>
            <span className="save-menu__total">{totalLetters} 封信</span>
          </div>
          <span hidden>{tick}</span>
        </div>
      )}
    </>
  )
}
