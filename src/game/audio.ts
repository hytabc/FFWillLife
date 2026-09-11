import type { MisplacementKind, Rating } from '../engine/types'

/**
 * 音效 —— 全部用 Web Audio 实时合成，不落地任何音频文件。
 *
 * 为什么不放素材：一是仓库里没有、也不该有音频版权资源；二是**合成反而更贴合主题**——
 * 「水晶回响」的音高可以随错位档位变化，越远的时空听起来越陌生。
 * 固定素材做不到这件事。
 *
 * 一切都在用户第一次交互后惰性创建 AudioContext（浏览器自动播放策略要求）。
 */

let ctx: AudioContext | null = null
let enabled = true

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setSoundEnabled(on: boolean): void {
  enabled = on
}

/** 一颗水晶：正弦 + 五度泛音，指数衰减。 */
function crystal(freq: number, duration = 1.1, gain = 0.09): void {
  const ac = context()
  if (!ac || !enabled) return

  const now = ac.currentTime
  const master = ac.createGain()
  master.gain.setValueAtTime(0, now)
  master.gain.linearRampToValueAtTime(gain, now + 0.012)
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  master.connect(ac.destination)

  for (const [mult, level] of [
    [1, 1],
    [1.5, 0.34],
    [2.01, 0.16],
  ] as const) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq * mult, now)
    g.gain.setValueAtTime(level, now)
    osc.connect(g)
    g.connect(master)
    osc.start(now)
    osc.stop(now + duration)
  }
}

/** 错位档位 → 音高。越远的时空，听感越低沉、越陌生。 */
const TIER_FREQ: Record<MisplacementKind, number> = {
  none: 784, // G5 —— 原位，最明亮
  reorder: 784,
  microshift: 623, // Eb5
  transform: 523, // C5
  high: 392, // G4 —— 跨得最远
}

export function playPickup(): void {
  crystal(1046, 0.4, 0.05)
}

export function playDrop(tier: MisplacementKind): void {
  crystal(TIER_FREQ[tier], tier === 'none' || tier === 'reorder' ? 0.7 : 1.4)
}

/** 跨时空时叠一层上方五度，制造"涟漪"感。 */
export function playDisplace(tier: MisplacementKind): void {
  if (tier === 'none' || tier === 'reorder') {
    playDrop(tier)
    return
  }
  crystal(TIER_FREQ[tier], 1.6, 0.08)
  window.setTimeout(() => crystal(TIER_FREQ[tier] * 1.5, 1.3, 0.045), 90)
}

/** 结算：按评级给一个三音和弦。S 是大三和弦，D 是小二度。 */
const RATING_CHORD: Record<Rating, number[]> = {
  S: [523, 659, 784, 1046],
  A: [523, 659, 784],
  B: [523, 622, 784],
  C: [494, 587, 698],
  D: [440, 466, 554],
  X: [392, 415, 622],
  echo: [523, 784, 1046, 1318],
}

export function playSettle(rating: Rating): void {
  const notes = RATING_CHORD[rating]
  notes.forEach((f, i) => {
    window.setTimeout(() => crystal(f, 1.8, 0.055), i * 110)
  })
}

/** 悬停/查看黑话时的一声轻响。 */
export function playTick(): void {
  crystal(1318, 0.16, 0.03)
}
