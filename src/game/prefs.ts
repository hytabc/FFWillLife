/**
 * 界面偏好 —— 与存档无关、只存在浏览器里的轻量开关。
 *
 * 游玩教程是否看过、通讯贝是否折叠，这类东西不该写进游戏存档：
 * 换存档槽、开新档都不应该把它们重置；换浏览器则本就该重新看一遍教程。
 * LocalStorage 不可用（隐私模式/配额满）时一律退回默认值，不影响游玩。
 */

const PREFIX = 'ffwilllife.prefs.v1.'

export const PREF_TUTORIAL_SEEN = 'tutorial-seen'
export const PREF_CHANNELS_OPEN = 'channels-open'

export function readPref(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}

export function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value)
  } catch {
    // 存不下就退回默认，静默降级
  }
}
