import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { lettersById, statementsById } from '../content'
import {
  MISPLACEMENT_LABEL,
  SPACE_TAG_LABEL,
  TIME_PHASE_LABEL,
  type BlockId,
  type Letter,
  type MisplacementKind,
  type SpaceTime,
  type StatementBlock,
} from '../engine/types'
import { playDrop, playPickup } from '../game/audio'
import { allowedTiersForLetter, hasAlternateSpaceTime, previewDisplacement } from '../game/play'
import { useGameStore } from '../store/gameStore'
import { AnnotatedText, ContextBadge } from './AnnotatedText'
import { SpaceTimePicker } from './SpaceTimePicker'

const MISPLACEMENT_CLASS: Record<MisplacementKind, string> = {
  none: '',
  reorder: '',
  microshift: 'block--microshift',
  transform: 'block--transform',
  high: 'block--high',
}

interface BlockShellProps {
  block: StatementBlock
  index: number
  interactive: boolean
  /** 该块当前被放到的时空；缺省表示还在信件锚点 */
  borrowed?: SpaceTime | undefined
  onPickTime?: (() => void) | undefined
  /** 本章是否已解锁跨时空（没解锁就不显示"换时空"按钮） */
  canTimeTravel: boolean
  /** 已结算后不再允许改变时空 */
  locked: boolean
}

/**
 * 语句块的内容。可拖动与只读两种状态共用它，
 * 保证"锁定的样子"和"能拖的样子"是同一套视觉。
 */
function BlockShell({
  block,
  index,
  interactive,
  borrowed,
  onPickTime,
  canTimeTravel,
  locked,
}: BlockShellProps) {
  const statement = statementsById.get(block.statementId)
  if (!statement) return null

  const displaced = borrowed !== undefined
  const preview = displaced ? previewDisplacement(statement, borrowed) : null

  return (
    <>
      <span className="block__handle" aria-hidden="true">
        {interactive && block.draggable ? '⠿' : '·'}
      </span>
      <div className="block__body">
        <div className="block__meta">
          <ContextBadge characterId={statement.characterId} phase={statement.phase} />
          {interactive && block.draggable && canTimeTravel && (
            <button
              type="button"
              className={`block__timetravel${displaced ? ' block__timetravel--on' : ''}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                playPickup()
                onPickTime?.()
              }}
              disabled={locked}
              title="把这句话放到另一个时空去读"
            >
              {displaced
                ? `→ ${TIME_PHASE_LABEL[borrowed.phase]}·${SPACE_TAG_LABEL[borrowed.space]}`
                : '⌖ 换时空'}
            </button>
          )}
        </div>

        <p className="block__text">
          「
          <AnnotatedText text={statement.text} termIds={statement.terms} />
          」
        </p>

        {preview && (
          <div className="block__echo">
            <span className="block__echo-tier">{MISPLACEMENT_LABEL[preview.kind]}</span>
            <p>{preview.text}</p>
          </div>
        )}
      </div>
      <span className="block__index" title={TIME_PHASE_LABEL[statement.phase]}>
        {index + 1}
      </span>
    </>
  )
}

interface LetterBlockProps {
  block: StatementBlock
  index: number
  misplacement: MisplacementKind
  borrowed?: SpaceTime | undefined
  onPickTime?: (() => void) | undefined
  canTimeTravel: boolean
  locked: boolean
  /** 点选式重排：当前被选中的块（触屏备选操作） */
  selected?: boolean
  onTap?: (() => void) | undefined
}

function SortableBlock(props: LetterBlockProps) {
  const sortable = useSortable({ id: props.block.id, disabled: !props.block.draggable || props.locked })
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable
  const dragged = props.misplacement !== 'none' && props.misplacement !== 'reorder'

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        'block',
        props.block.draggable && !props.locked ? 'block--draggable' : 'block--fixed',
        isDragging ? 'block--dragging' : '',
        dragged ? 'block--ripple' : '',
        props.selected ? 'block--selected' : '',
        MISPLACEMENT_CLASS[props.misplacement],
      ]
        .filter(Boolean)
        .join(' ')}
      {...attributes}
      {...(props.block.draggable && !props.locked ? listeners : {})}
      onClick={() => {
        if (!props.locked && props.block.draggable) props.onTap?.()
      }}
    >
      <BlockShell
        block={props.block}
        index={props.index}
        interactive
        borrowed={props.borrowed}
        onPickTime={props.onPickTime}
        canTimeTravel={props.canTimeTravel}
        locked={props.locked}
      />
    </li>
  )
}

function StaticBlock(props: LetterBlockProps) {
  return (
    <li
      className={['block', 'block--fixed', MISPLACEMENT_CLASS[props.misplacement]]
        .filter(Boolean)
        .join(' ')}
    >
      <BlockShell
        block={props.block}
        index={props.index}
        interactive={false}
        borrowed={props.borrowed}
        canTimeTravel={false}
        locked
      />
    </li>
  )
}

interface Props {
  letter: Letter
  misplacementByBlock: Record<BlockId, MisplacementKind>
}

export function LetterView({ letter, misplacementByBlock }: Props) {
  const arrangement = useGameStore((s) => s.arrangement)
  const borrowed = useGameStore((s) => s.borrowed)
  const reorder = useGameStore((s) => s.reorder)
  const settled = useGameStore((s) => s.settled)
  const settling = useGameStore((s) => s.settling)
  const [picking, setPicking] = useState<BlockId | null>(null)
  /**
   * 点选式重排（PRD §7.2 的移动端备选操作）。
   *
   * 触屏上拖拽需要长按 + 精确移动，体验很差；改成"点第一块选中，
   * 点第二块把它移过去"，两下点击即可完成，且在任何设备上都能用。
   */
  const [selected, setSelected] = useState<BlockId | null>(null)

  const handleTap = (id: BlockId) => {
    if (settling) return // 结算演出中，编排已锁定
    if (selected === null) {
      setSelected(id)
      playPickup()
      return
    }
    if (selected === id) {
      setSelected(null)
      return
    }
    reorder(selected, id)
    const tier = misplacementByBlock[selected] ?? 'reorder'
    playDrop(tier)
    setSelected(null)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const id = String(active.id)
    reorder(id, String(over.id))
    playDrop(misplacementByBlock[id] ?? 'reorder')
  }

  const blocksById = new Map(letter.blocks.map((b) => [b.id, b]))
  const timeTravelUnlocked = allowedTiersForLetter(letter).some(
    (t) => t !== 'none' && t !== 'reorder',
  )
  const list = arrangement.flatMap((id, index) => {
    const block = blocksById.get(id)
    if (!block) return []
    const statement = statementsById.get(block.statementId)
    return [
      {
        block,
        index,
        misplacement: misplacementByBlock[id] ?? ('none' as MisplacementKind),
        canTimeTravel:
          statement !== undefined &&
          timeTravelUnlocked &&
          hasAlternateSpaceTime(letter, statement),
      },
    ]
  })

  const pickingBlock = picking ? blocksById.get(picking) : undefined
  const pickingStatement = pickingBlock ? statementsById.get(pickingBlock.statementId) : undefined

  return (
    <article className={`letter${settling ? ' letter--settling' : ''}`}>
      <header className="letter__head">
        <h2 className="letter__title">{letter.title}</h2>
        <p className="letter__anchor">
          {TIME_PHASE_LABEL[letter.anchor.phase]} · {SPACE_TAG_LABEL[letter.anchor.space]}
        </p>
      </header>

      <p className="letter__preamble">
        {letter.preamble.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>

      {settled ? (
        <ol className="letter__blocks">
          {list.map((item) => (
            <StaticBlock
              key={item.block.id}
              {...item}
              borrowed={borrowed[item.block.id]}
              locked
            />
          ))}
        </ol>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={arrangement} strategy={verticalListSortingStrategy}>
            <ol className="letter__blocks">
              {list.map((item) => (
                <SortableBlock
                  key={item.block.id}
                  {...item}
                  borrowed={borrowed[item.block.id]}
                  onPickTime={() => setPicking(item.block.id)}
                  locked={settling}
                  selected={selected === item.block.id}
                  onTap={() => handleTap(item.block.id)}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      {pickingBlock && pickingStatement && (
        <SpaceTimePicker
          blockId={pickingBlock.id}
          statement={pickingStatement}
          origin={{ phase: pickingStatement.phase, space: pickingStatement.space }}
          current={borrowed[pickingBlock.id]}
          allowed={allowedTiersForLetter(letter)}
          onClose={() => setPicking(null)}
        />
      )}

      <p className="letter__signature">{letter.signature}</p>

      {settling ? (
        <p className="letter__hint letter__hint--active">这几句话正在落向世界线……</p>
      ) : selected !== null ? (
        <p className="letter__hint letter__hint--active">
          已选中一句话。再点另一句，它就移到那个位置。
        </p>
      ) : (
        <p className="letter__hint">
          金色的段落可以拖动，改变说话的先后顺序；也可以点一下选中、再点另一句换位。
          <br />
          点「⌖ 换时空」，可以把一句话放到另一个年纪、另一个场合去说——
          同一句话，换个地方说，是另一句话。
        </p>
      )}
    </article>
  )
}

/** 便捷取信。 */
export function useLetter(letterId: string): Letter {
  const letter = lettersById.get(letterId)
  if (!letter) throw new Error(`未知信件 ${letterId}`)
  return letter
}
