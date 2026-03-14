import React from 'react'
import { doClassnames } from '@unoff/utils'
import DraggableItem from '../draggable-item/DraggableItem'
import './sortable-list.scss'

interface SelectedColor {
  id: string | undefined
  position: number
}

interface DefaultData {
  id: string
}

interface HoveredColor extends SelectedColor {
  hasGuideAbove: boolean
  hasGuideBelow: boolean
}

export interface SortableListProps<T = DefaultData> {
  /**
   * Array of data items
   */
  data: Array<T>
  /**
   * Array of primary content nodes
   */
  primarySlot: Array<React.ReactNode>
  /**
   * Array of secondary content configurations
   */
  secondarySlot?: Array<{
    /** Title for the secondary content */
    title: string
    /** Content node */
    node: React.ReactNode
  }>
  /**
   * Array of action button nodes
   */
  actionsSlot?: Array<React.ReactNode>
  /**
   * Content to display when list is empty
   */
  emptySlot?: React.ReactNode
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
   * Whether the list is scrollable
   * @default false
   */
  isScrollable?: boolean
  /**
   * Whether to show a top border on scroll
   * @default false
   */
  isTopBorderEnabled?: boolean
  /**
   * Whether the list can be empty
   * @default true
   */
  canBeEmpty?: boolean
  /**
   * Whether the list is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Change handler when list is reordered
   */
  onChangeSortableList: (data: Array<T>) => void
  /**
   * Remove item handler
   */
  onRemoveItem: React.MouseEventHandler<Element> &
    React.KeyboardEventHandler<Element>
  /**
   * Refold options handler
   */
  onRefoldOptions: () => void
}

export interface SortableListState {
  selectedElement: SelectedColor
  hoveredElement: HoveredColor
  hasTopBorder: boolean
}

export default class SortableList<
  T extends DefaultData,
> extends React.Component<SortableListProps<T>, SortableListState> {
  private listRef: React.RefObject<HTMLUListElement>

  static defaultProps: Partial<SortableListProps> = {
    isScrollable: false,
    isTopBorderEnabled: false,
    canBeEmpty: true,
    isBlocked: false,
  }

  constructor(props: SortableListProps<T>) {
    super(props)
    this.state = {
      selectedElement: {
        id: undefined,
        position: 0,
      },
      hoveredElement: {
        id: undefined,
        hasGuideAbove: false,
        hasGuideBelow: false,
        position: 0,
      },
      hasTopBorder: false,
    }
    this.listRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  // Lifecycle
  componentDidMount = () =>
    document.addEventListener('mousedown', this.handleClickOutside)

  componentWillUnmount = () =>
    document.removeEventListener('mousedown', this.handleClickOutside)

  handleClickOutside = (e: Event) => {
    if (this.listRef.current !== null)
      if (
        !this.listRef.current.contains(e.target as HTMLElement) ||
        e.target === this.listRef.current
      )
        this.setState({
          selectedElement: {
            id: undefined,
            position: 0,
          },
        })
  }

  // Handlers
  orderHandler = () => {
    const { onChangeSortableList, data } = this.props
    const { selectedElement, hoveredElement } = this.state

    const source: SelectedColor = selectedElement,
      target: HoveredColor = hoveredElement,
      duplicatedData = data.map((el) => el)

    let position: number
    const sourceIndex = duplicatedData.findIndex(
      (item) => item.id === source.id
    )

    const [removedElement] = duplicatedData.splice(sourceIndex, 1)

    if (target.hasGuideAbove && target.position > source.position)
      position = target.position - 1
    else if (target.hasGuideBelow && target.position > source.position)
      position = target.position
    else if (target.hasGuideAbove && target.position < source.position)
      position = target.position
    else if (target.hasGuideBelow && target.position < source.position)
      position = target.position + 1
    else position = target.position

    duplicatedData.splice(position, 0, removedElement)

    onChangeSortableList(duplicatedData)
  }

  selectionHandler: React.MouseEventHandler<HTMLLIElement> &
    React.MouseEventHandler<Element> &
    React.FocusEventHandler<HTMLInputElement> = (e) => {
    const item = e.currentTarget as HTMLElement
    const target = e.target as HTMLElement

    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'TEXTAREA'
    )
      return this.setState({
        selectedElement: {
          id: undefined,
          position: 0,
        },
      })

    return this.setState({
      selectedElement: {
        id: item.dataset.id,
        position: parseFloat(item.dataset.position ?? '0'),
      },
    })
  }

  dragHandler = (
    id: string | undefined,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => {
    this.setState({
      hoveredElement: {
        id: id,
        hasGuideAbove: hasGuideAbove,
        hasGuideBelow: hasGuideBelow,
        position: position,
      },
    })
  }

  dropOutsideHandler = (e: React.DragEvent<HTMLLIElement>) => {
    const target = e.target,
      parent: ParentNode =
        (target as HTMLElement).parentNode ?? (target as HTMLElement),
      scrollY: number = (parent.parentNode?.parentNode as HTMLElement)
        .scrollTop,
      parentRefTop: number = (parent as HTMLElement).offsetTop,
      parentRefBottom: number =
        parentRefTop + (parent as HTMLElement).clientHeight

    if (e.pageY + scrollY < parentRefTop) this.orderHandler()
    else if (e.pageY + scrollY > parentRefBottom) this.orderHandler()
  }

  removeHandler = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    const { onChangeSortableList, data } = this.props
    const duplicatedData = data.map((el) => el)
    let id: string | null
    const element: HTMLElement | null = (
      e.currentTarget as HTMLElement
    ).closest('.draggable-item')

    element !== null ? (id = element.getAttribute('data-id')) : (id = null)

    onChangeSortableList(duplicatedData.filter((item) => item.id !== id))
  }

  // Direct Actions
  onScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { isTopBorderEnabled } = this.props

    e.preventDefault()
    if (e.currentTarget.scrollTop > 0 && isTopBorderEnabled)
      this.setState({ hasTopBorder: true })
    else this.setState({ hasTopBorder: false })
  }

  // Render
  render() {
    const {
      data,
      canBeEmpty,
      isBlocked,
      primarySlot,
      secondarySlot,
      actionsSlot,
      emptySlot,
      helpers,
      isScrollable,
      onRemoveItem,
      onRefoldOptions,
    } = this.props
    const { selectedElement, hoveredElement, hasTopBorder } = this.state

    if (data.length === 0 && canBeEmpty)
      return <div className="sortable-list">{emptySlot}</div>
    return (
      <ul
        className={doClassnames([
          'sortable-list',
          isScrollable && 'sortable-list--scrollable',
          hasTopBorder && 'sortable-list--top-border',
        ])}
        onScroll={this.onScroll}
        ref={this.listRef}
      >
        {data.map((item, index) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            index={index}
            canBeRemoved={
              (data.length > 1 && !isBlocked) || (canBeEmpty && !isBlocked)
            }
            primarySlot={primarySlot[index]}
            secondarySlot={secondarySlot ? secondarySlot[index] : undefined}
            actionsSlot={actionsSlot ? actionsSlot[index] : undefined}
            selected={selectedElement.id === item.id}
            helpers={{
              remove: helpers?.remove,
              more: helpers?.more,
            }}
            guideAbove={
              hoveredElement.id === item.id
                ? hoveredElement.hasGuideAbove
                : false
            }
            guideBelow={
              hoveredElement.id === item.id
                ? hoveredElement.hasGuideBelow
                : false
            }
            isBlocked={isBlocked}
            onCancelSelection={this.selectionHandler}
            onRefoldOptions={onRefoldOptions}
            onChangeOrder={this.orderHandler}
            onRemove={onRemoveItem}
            onChangeSelection={this.selectionHandler}
            onDragChange={this.dragHandler}
            onDropOutside={this.orderHandler}
            aria-selected={selectedElement.id === item.id}
          />
        ))}
      </ul>
    )
  }
}
