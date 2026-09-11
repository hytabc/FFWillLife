import { useMemo } from 'react'
import { charactersById, glossaryById } from '../content'
import { segmentText } from '../engine/glossary'
import type { GlossaryEntry } from '../engine/types'
import { TIME_PHASE_LABEL } from '../engine/types'
import { useGameStore } from '../store/gameStore'

interface Props {
  text: string
  /** 该句显式声明的黑话 id */
  termIds: readonly string[]
}

/**
 * 黑话标注渲染。
 *
 * 下划线来自内容作者显式声明的 `terms`（数据驱动），而不是正则扫全文——
 * 这样"哪些词是黑话"由作者决定，也才能被校验器 2 断言。
 */
export function AnnotatedText({ text, termIds }: Props) {
  const fullAnnotation = useGameStore((s) => s.fullAnnotation)
  const learnTerm = useGameStore((s) => s.learnTerm)
  const learned = useGameStore((s) => s.learnedTermIds)

  const segments = useMemo(() => {
    const entries = termIds
      .map((id) => glossaryById.get(id))
      .filter((e): e is GlossaryEntry => e !== undefined)
    return segmentText(text, entries)
  }, [text, termIds])

  return (
    <>
      {segments.map((seg, i) => {
        if (!seg.entry) return <span key={i}>{seg.text}</span>
        const entry = seg.entry
        const isLearned = learned.includes(entry.id)
        return (
          <span
            key={i}
            className={`term${isLearned ? ' term--learned' : ''}`}
            title={`${entry.term} · ${entry.brief}`}
            onClick={() => learnTerm(entry.id)}
            role="button"
            tabIndex={0}
            // 阻止指针事件冒泡到 dnd-kit 的拖拽容器，否则点黑话会被当成开始拖拽。
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                learnTerm(entry.id)
              }
            }}
          >
            {seg.text}
            {fullAnnotation && <span className="term__inline">（{entry.brief}）</span>}
          </span>
        )
      })}
    </>
  )
}

interface ContextBadgeProps {
  characterId: string
  phase: keyof typeof TIME_PHASE_LABEL
}

/** 语句块左上角的角色 + 成长阶段标签。 */
export function ContextBadge({ characterId, phase }: ContextBadgeProps) {
  const character = charactersById.get(characterId)
  return (
    <span className="badge">
      <span className="badge__name" style={{ color: character?.themeColor ?? '#ccc' }}>
        {character?.name ?? characterId}
      </span>
      <span className={`badge__phase badge__phase--${phase}`}>{TIME_PHASE_LABEL[phase]}</span>
    </span>
  )
}
