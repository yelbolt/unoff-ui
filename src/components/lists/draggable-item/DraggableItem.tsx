import React from 'react'
import { doClassnames, doMap } from '@unoff/utils'
import DraggableWindow from '@components/slots/draggable-window/DraggableWindow'
import Button from '@components/actions/button/Button'
import './draggable-item.scss'

export interface DraggableItemProps {
  /**
   * Unique identifier for the item
   */
  id: string
  /**
   * Index position in the list
   */
  index: number
  /**
   * Whether the item can be removed
   * @default true
   */
  canBeRemoved?: boolean
  /**
   * Primary content slot
   */
  primarySlot: React.ReactNode
  /**
   * Secondary content configuration
   */
  secondarySlot?: {
    /** Title for the secondary content */
    title: string
    /** Content node */
    node: React.ReactNode
  }
  /**
   * Action buttons slot
   */
  actionsSlot?: React.ReactNode
  /**
   * Whether the item is selected
   * @default false
   */
  selected?: boolean
  /**
   * Title for the options panel
   */
  optionsTitle?: string
  /**
   * Helper texts for buttons
   */
  helpers?: {
    /** Helper for remove button */
    remove?: string
    /** Helper for more options button */
    more?: string
  }
  /**
   * Whether to show drop guide above
   * @default false
   */
  guideAbove?: boolean
  /**
   * Whether to show drop guide below
   * @default false
   */
  guideBelow?: boolean
  /**
   * Whether the item is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Selection change handler
   */
  onChangeSelection: React.MouseEventHandler<HTMLLIElement>
  /**
   * Cancel selection handler
   */
  onCancelSelection: React.MouseEventHandler<Element> &
    React.FocusEventHandler<HTMLInputElement>
  /**
   * Refold options handler
   */
  onRefoldOptions?: () => void
  /**
   * Drag state change handler
   */
  onDragChange: (
    id: string | undefined,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => void
  /**
   * Drop outside handler
   */
  onDropOutside: (e: React.DragEvent<HTMLLIElement>) => void
  /**
   * Order change handler
   */
  onChangeOrder: (e: React.DragEvent<HTMLLIElement>) => void
  /**
   * Remove item handler
   */
  onRemove: React.MouseEventHandler<Element> &
    React.KeyboardEventHandler<Element>
}

export interface DraggableItemState {
  isDragged: boolean
  hasMoreOptions: boolean
}

export default class DraggableItem extends React.Component<
  DraggableItemProps,
  DraggableItemState
> {
  private moreButtonRef: React.RefObject<Button>

  static defaultProps: Partial<DraggableItemProps> = {
    canBeRemoved: true,
    selected: false,
    guideAbove: false,
    guideBelow: false,
    isBlocked: false,
  }

  constructor(props: DraggableItemProps) {
    super(props)
    this.state = {
      isDragged: false,
      hasMoreOptions: false,
    }
    this.moreButtonRef = React.createRef()
  }

  // Direct Actions
  onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    const clone = e.currentTarget.cloneNode(true)

    this.setState({ isDragged: true })
    ;(clone as HTMLElement).style.opacity = '0'
    ;(clone as HTMLElement).style.position = 'absolute'
    ;(clone as HTMLElement).id = 'ghost'
    ;(clone as HTMLElement).style.pointerEvents = 'none'
    document.body.appendChild(clone)
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(clone as Element, 0, 0)
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    const { onDropOutside, onDragChange } = this.props

    this.setState({ isDragged: false })
    onDragChange('', false, false, 0)
    onDropOutside(e)
    document.querySelector('#ghost')?.remove()
  }

  onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    const { onDragChange } = this.props

    e.preventDefault()
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const height: number = target.clientHeight
    const y: number = e.clientY - rect.top
    const refY: number = doMap(y, 0, height, 0, height)

    if (refY >= -1 && refY <= height / 2)
      onDragChange(
        target.dataset.id,
        true,
        false,
        parseFloat(target.dataset.position ?? '0')
      )
    else if (refY > height / 2 && refY <= height)
      onDragChange(
        target.dataset.id,
        false,
        true,
        parseFloat(target.dataset.position ?? '0')
      )
  }

  onDrop = (e: React.DragEvent<HTMLLIElement>) => {
    const { onChangeOrder } = this.props

    e.preventDefault()
    onChangeOrder(e)
  }

  // Render
  render() {
    const {
      id,
      index,
      canBeRemoved,
      primarySlot,
      secondarySlot,
      actionsSlot,
      selected,
      optionsTitle,
      helpers,
      guideAbove,
      guideBelow,
      isBlocked,
      onRemove,
      onChangeSelection,
      onCancelSelection,
      onRefoldOptions,
    } = this.props

    const { isDragged, hasMoreOptions } = this.state

    return (
      <li
        data-id={id}
        data-position={index}
        className={doClassnames([
          'draggable-item',
          isDragged && 'draggable-item--dragged',
          guideAbove && 'draggable-item--above',
          guideBelow && 'draggable-item--below',
        ])}
        draggable={!hasMoreOptions && !isBlocked ? selected : false}
        aria-grabbed={isDragged}
        aria-current={selected ? 'true' : undefined}
        onMouseDown={(e) => {
          if (!hasMoreOptions && !isBlocked) onChangeSelection(e)
        }}
        onDragStart={(e) => {
          if (!hasMoreOptions && !isBlocked) this.onDragStart(e)
        }}
        onDragEnd={(e) => {
          if (!hasMoreOptions && !isBlocked) this.onDragEnd(e)
        }}
        onDragOver={(e) => {
          if (!hasMoreOptions && !isBlocked) this.onDragOver(e)
        }}
        onDrop={(e) => {
          if (!hasMoreOptions && !isBlocked) this.onDrop(e)
        }}
      >
        <div
          className="draggable-item__primary"
          role="group"
        >
          <div
            className="draggable-item__left"
            role="presentation"
          >
            {primarySlot}
          </div>
          <div
            className="draggable-item__right"
            role="group"
          >
            {secondarySlot !== undefined && (
              <Button
                ref={this.moreButtonRef}
                type="icon"
                icon="ellipses"
                state={hasMoreOptions ? 'selected' : undefined}
                helper={
                  helpers?.more !== undefined
                    ? {
                        label: helpers.more,
                      }
                    : undefined
                }
                action={() => {
                  onCancelSelection
                  onRefoldOptions
                  this.setState({ hasMoreOptions: !hasMoreOptions })
                }}
              />
            )}
            {actionsSlot !== undefined && actionsSlot}
            <Button
              type="icon"
              icon="minus"
              helper={
                helpers?.remove !== undefined
                  ? {
                      label: helpers.remove,
                    }
                  : undefined
              }
              feature="REMOVE_ITEM"
              isDisabled={!canBeRemoved}
              action={canBeRemoved ? onRemove : () => null}
            />
          </div>
        </div>
        {hasMoreOptions && secondarySlot !== undefined && (
          <DraggableWindow
            title={
              secondarySlot.title !== undefined
                ? secondarySlot.title
                : optionsTitle
            }
            onClose={() =>
              this.setState({
                hasMoreOptions: false,
              })
            }
            triggerRef={this.moreButtonRef}
          >
            {secondarySlot.node}
          </DraggableWindow>
        )}
      </li>
    )
  }
}
