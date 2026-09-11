import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AUTOSAVE_SLOT, getActiveSlot, readSave } from './game/save'
import { installAutoSave, useGameStore } from './store/gameStore'
import { App } from './ui/App'
import './styles.css'

const container = document.getElementById('root')
if (!container) throw new Error('缺少 #root 挂载点')

// 先读档再挂载：否则第一帧会闪一下"全新进度"，然后才跳回玩家上次的位置。
try {
  // 没有显式选过槽位时，默认回到自动存档。
  // （之前这里只读 getActiveSlot()，而它只在"读档"路径里才被写入——
  //   结果第一次玩完之后刷新，进度就没了。）
  const slotId = getActiveSlot() ?? AUTOSAVE_SLOT
  const save = readSave(slotId)
  if (save) useGameStore.getState().restoreFrom(save)
} catch {
  // LocalStorage 不可用（隐私模式 / 配额满）时静默降级为不存档，游戏照常能玩
}

installAutoSave()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
