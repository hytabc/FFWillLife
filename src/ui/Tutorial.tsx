import { useEffect, useState, type ReactNode } from 'react'

interface Step {
  title: string
  body: ReactNode
}

/**
 * 游玩教程。
 *
 * 首次进入网站时自动弹出一次；之后任何时候都可以从顶部的「游玩教程」
 * 按钮再次唤出。它只讲"哪个按钮是干什么的"，不剧透任何剧情——
 * 因果要怎么排、结局是什么，仍然要玩家自己动手才知道。
 */
const STEPS: Step[] = [
  {
    title: '通讯贝 · 你的信箱',
    body: (
      <ul className="tutorial__list">
        <li>
          <b>通讯贝</b>按章节列出全部信件：灰色的带锁，表示尚未解锁；打过的信会标出评级，
          随时可以重打。
        </li>
        <li>点信名即可打开那封信。栏顶的箭头可以<b>折叠</b>它，把屏幕让给信纸。</li>
        <li>窄屏上它排在正文之前，折叠起来最省地方。</li>
      </ul>
    ),
  },
  {
    title: '信纸 · 重排语句，改变因果',
    body: (
      <ul className="tutorial__list">
        <li>金色的段落可以<b>拖动</b>，改变它们说话的先后顺序。</li>
        <li>
          触屏或不想拖时：<b>点一下选中</b>一句话，再点另一句，它就会移到那个位置。
        </li>
        <li>灰底的段落是固定的，不参与重排。</li>
      </ul>
    ),
  },
  {
    title: '换时空 · 同一句话，换个地方说',
    body: (
      <ul className="tutorial__list">
        <li>
          点段落里的「<b>⌖ 换时空</b>」，可以把这句话放到另一个年纪、另一个场合去读。
        </li>
        <li>放过去之后，块会当场显示它在新时空里的含义——同一句话，换个地方说，就是另一句话。</li>
        <li>可选的时空档位会随章节逐步解锁。</li>
      </ul>
    ),
  },
  {
    title: '结算 · 让因果落定',
    body: (
      <ul className="tutorial__list">
        <li>拖动时右侧面板<b>不会剧透</b>——在你让改动落定之前，评级与结局都是未知的。</li>
        <li>
          点「<b>让这件事发生</b>」后，有一段约一秒的「世界线改写」，然后才揭晓结果，
          以及这封信<b>改变了谁</b>。
        </li>
        <li>
          顶部还有：全注释模式、音效、时空沙盘、倾听者手记、因果树；右下角是图鉴与存档。
        </li>
      </ul>
    ),
  },
]

interface Props {
  onClose: () => void
}

export function Tutorial({ onClose }: Props) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]!
  const last = step === STEPS.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="tutorial" role="dialog" aria-modal="true" aria-label="游玩教程">
      <div className="tutorial__card">
        <header className="tutorial__head">
          <span className="tutorial__eyebrow">
            游玩教程 · {step + 1}/{STEPS.length}
          </span>
          <h2>{current.title}</h2>
          <button type="button" className="tutorial__close" onClick={onClose} aria-label="关闭教程">
            ✕
          </button>
        </header>

        <div className="tutorial__body">{current.body}</div>

        <footer className="tutorial__foot">
          <div className="tutorial__dots" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span key={s.title} className={i === step ? 'on' : ''} />
            ))}
          </div>
          <div className="tutorial__nav">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)}>
                上一步
              </button>
            )}
            {last ? (
              <button type="button" className="primary" onClick={onClose}>
                开始游戏
              </button>
            ) : (
              <button type="button" className="primary" onClick={() => setStep((s) => s + 1)}>
                下一步
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
