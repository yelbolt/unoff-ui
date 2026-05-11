import React from 'react'
import { doClassnames } from '@unoff/utils'
import { DropdownOption } from '@tps/list.types'
import texts from '@styles/texts/texts.module.scss'
import Chip from '@components/tags/chip/Chip'
import Input from '@components/inputs/input/Input'
import Icon from '@components/assets/icon/Icon.tsx'
import './actions-list.scss'

export interface ActionsListProps {
  /**
   * List of options to display — each item is a `DropdownOption` with
   * `type`, `label`, `value`, `action`, `children`, and visibility / status flags
   */
  options: Array<DropdownOption>
  /**
   * ID of the currently selected option
   */
  selected?: string
  /**
   * Direction for submenu expansion
   * @default 'RIGHT'
   */
  direction?: 'LEFT' | 'RIGHT'
  /**
   * Whether the list should be scrollable
   * @default false
   */
  shouldScroll?: boolean
  /**
   * ID of the container element
   */
  containerId?: string
  /**
   * Preview tooltip configuration
   */
  preview?: {
    /** Preview image URL */
    image: string
    /** Preview text */
    text: string | React.ReactNode
    /** Preview position */
    pin?: 'TOP' | 'BOTTOM'
  }
  /**
   * Callback when the list is cancelled
   * @default () => null
   */
  onCancellation?: () => void
  /**
   * Ref to the menu element
   */
  menuRef?: React.RefObject<HTMLUListElement>
  /**
   * Ref to the submenu element
   */
  subMenuRef?: React.RefObject<HTMLUListElement>
  /**
   * Whether the list can be filtered by a search input
   * @default false
   */
  canBeSearched?: boolean
  /**
   * Placeholder label for the search input
   */
  searchLabel?: string
  /**
   * Label shown when no options match the search query
   */
  noResultsLabel?: string
}

export interface ActionsListState {
  openedGroup: string
  listScrollOffset: number
  listScrollAmount: number
  listClientHeight?: number
  shift: number
  isVisible: boolean
  searchQuery: string
}

export default class ActionsList extends React.Component<
  ActionsListProps,
  ActionsListState
> {
  private scrollInterval: number | null
  private subMenuContainerRef: React.RefObject<HTMLDivElement>
  private movementXHistory: number[]
  private submenuChangeTimeout: ReturnType<typeof setTimeout> | null

  static defaultProps: Partial<ActionsListProps> = {
    direction: 'RIGHT',
    shouldScroll: false,
    onCancellation: () => null,
    canBeSearched: false,
  }

  constructor(props: ActionsListProps) {
    super(props)
    this.state = {
      openedGroup: 'EMPTY',
      listScrollOffset: 0,
      listScrollAmount: 1,
      listClientHeight: 1,
      shift: 0,
      isVisible: true,
      searchQuery: '',
    }
    this.scrollInterval = null
    this.subMenuContainerRef = React.createRef<HTMLDivElement>()
    this.movementXHistory = []
    this.submenuChangeTimeout = null
  }

  componentDidUpdate(
    prevProps: Readonly<ActionsListProps>,
    prevState: Readonly<ActionsListState>
  ) {
    const { shouldScroll } = this.props
    const { openedGroup } = this.state
    const list = document.getElementsByClassName(
      'select-menu__menu'
    )[0] as HTMLElement

    if (prevProps.shouldScroll !== shouldScroll)
      this.setState({
        listScrollOffset: list.scrollTop,
        listScrollAmount: list.scrollHeight - list.clientHeight,
        listClientHeight: list.clientHeight,
      })

    if (prevState.openedGroup !== openedGroup) {
      const subMenuElement = this.subMenuContainerRef.current
      if (subMenuElement) {
        const rect = subMenuElement.getBoundingClientRect()
        if (rect.x < 0) this.setState({ shift: -rect.x + 8 })
        if (rect.x + rect.width > window.innerWidth)
          this.setState({
            shift: window.innerWidth - rect.x - rect.width - 8,
          })
        this.setState({ isVisible: true })
      }
    }
  }

  // Lifecycle
  componentDidMount = () =>
    document.addEventListener('mousemove', this.handleMouseMove)

  componentWillUnmount = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)
    this.clearSubmenuTimeout()
  }

  handleMouseMove = (e: MouseEvent) => {
    this.movementXHistory.push(e.movementX)
    if (this.movementXHistory.length > 5) this.movementXHistory.shift()
  }

  clearSubmenuTimeout = () => {
    if (this.submenuChangeTimeout) {
      clearTimeout(this.submenuChangeTimeout)
      this.submenuChangeTimeout = null
    }
  }

  isMovingTowardsSubmenu = (): boolean => {
    const { direction } = this.props
    if (this.movementXHistory.length === 0) return false
    const avg =
      this.movementXHistory.reduce((a, b) => a + b, 0) /
      this.movementXHistory.length
    return direction === 'RIGHT' ? avg > 0 : avg < 0
  }

  onMouseEnterGroup = (value: string) => {
    const { openedGroup } = this.state

    this.clearSubmenuTimeout()

    if (openedGroup === 'EMPTY' || openedGroup === value) {
      this.setState({ openedGroup: value })
      return
    }

    if (this.isMovingTowardsSubmenu())
      this.submenuChangeTimeout = setTimeout(() => {
        this.setState({ openedGroup: value })
        this.submenuChangeTimeout = null
      }, 350)
    else this.setState({ openedGroup: value })
  }

  onMouseLeaveGroup = () => {
    if (this.isMovingTowardsSubmenu()) {
      this.clearSubmenuTimeout()
      this.submenuChangeTimeout = setTimeout(() => {
        this.setState({ openedGroup: 'EMPTY' })
        this.submenuChangeTimeout = null
      }, 350)
    } else {
      this.clearSubmenuTimeout()
      this.setState({ openedGroup: 'EMPTY' })
    }
  }

  onMouseEnterSubmenu = () => this.clearSubmenuTimeout()

  // Direct Actions
  focusFirstMenuItem = () => {
    const { menuRef, canBeSearched } = this.props

    if (canBeSearched) return

    setTimeout(() => {
      const menuElement = menuRef?.current
      if (menuElement) {
        const firstItem = menuElement.querySelector(
          'li[tabindex="0"]:not([data-is-blocked="true"])'
        ) as HTMLElement
        if (firstItem) firstItem.focus()
      }
    }, 0)
  }

  focusFirstSubMenuItem = () => {
    const { subMenuRef } = this.props

    setTimeout(() => {
      const subMenuElement = subMenuRef?.current
      if (subMenuElement) {
        const firstItem = subMenuElement.querySelector(
          'li[tabindex="0"]:not([data-is-blocked="true"])'
        ) as HTMLElement
        if (firstItem) firstItem.focus()
      }
    }, 0)
  }

  onScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement
    this.setState({
      listScrollOffset: target.scrollTop,
      listScrollAmount: target.scrollHeight - target.clientHeight,
    })

    if (target.scrollTop === 0) this.stopScrolling()
    if (target.scrollTop === target.scrollHeight - target.clientHeight)
      this.stopScrolling()
  }

  startScrolling = (direction: 'UP' | 'DOWN') => {
    const list = document.getElementsByClassName('select-menu__menu')[0]

    const scroll = () => {
      if (list) {
        if (direction === 'UP' && list.scrollTop > 0) list.scrollTop -= 4
        else if (
          direction === 'DOWN' &&
          list.scrollTop < list.scrollHeight - list.clientHeight
        )
          list.scrollTop += 4

        this.scrollInterval = requestAnimationFrame(scroll)
      }
    }

    this.scrollInterval = requestAnimationFrame(scroll)
  }

  stopScrolling = () => {
    if (this.scrollInterval) {
      cancelAnimationFrame(this.scrollInterval)
      this.scrollInterval = null
    }
  }

  // Helpers
  filterOptions = (
    options: Array<DropdownOption>,
    query: string
  ): Array<DropdownOption> => {
    const q = query.toLowerCase()
    const filtered: Array<DropdownOption> = []

    for (const option of options) {
      if (option.type === 'SEPARATOR' || option.type === 'TITLE') continue
      if (option.type === 'OPTION') {
        if (option.label?.toLowerCase().includes(q)) filtered.push(option)
      } else if (option.type === 'GROUP' && option.children) {
        const matchingChildren = option.children.filter((c) =>
          c.label?.toLowerCase().includes(q)
        )
        if (matchingChildren.length > 0)
          filtered.push({ ...option, children: matchingChildren })
      }
    }

    return filtered
  }

  // Template
  SearchInput = () => {
    const { searchLabel, onCancellation } = this.props
    const { searchQuery } = this.state

    return (
      <>
        <li
          className="select-menu__search"
          data-role="SEARCH"
          onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              this.setState({ searchQuery: '' })
              onCancellation?.()
            }
          }}
        >
          <Input
            type="TEXT"
            value={searchQuery}
            placeholder={searchLabel ?? 'Search…'}
            icon={{
              type: 'PICTO',
              value: 'search',
            }}
            isAutoFocus
            isClearable
            onChange={(e) => this.setState({ searchQuery: e.target.value })}
            onClear={() => this.setState({ searchQuery: '' })}
          />
        </li>
        <li data-role={'SEPARATOR'}>
          <hr />
        </li>
      </>
    )
  }

  // Template
  SubMenu = (options: Array<DropdownOption> | undefined) => {
    const { subMenuRef } = this.props
    const { shift, isVisible } = this.state

    return (
      <div
        className="select-menu__submenu"
        role="menu"
        onMouseEnter={this.onMouseEnterSubmenu}
        style={{
          visibility: isVisible ? 'visible' : 'hidden',
        }}
        aria-hidden={!isVisible}
        ref={this.subMenuContainerRef}
      >
        <ul
          className="select-menu__menu select-menu__menu--active"
          ref={subMenuRef}
          role="menu"
          style={{
            transform: `translateX(${shift}px)`,
          }}
        >
          {options?.map((option, index) => {
            const isActive =
                option.isActive !== undefined ? option.isActive : true,
              isBlocked =
                option.isBlocked !== undefined ? option.isBlocked : false,
              isNew = option.isNew !== undefined ? option.isNew : false,
              children = option.children !== undefined ? option.children : []

            const activeChildren = children.filter(
              (child) => child.isActive !== false
            )

            if (isActive && activeChildren.length > 0)
              return this.MenuGroup(
                { ...option, isActive, isBlocked, isNew, children },
                index
              )
            else if (isActive && activeChildren.length === 0)
              return this.MenuSubOption(
                { ...option, isActive, isBlocked, isNew, children },
                index
              )
          })}
        </ul>
      </div>
    )
  }

  MenuTitle = (option: DropdownOption, index: number) => {
    return (
      <li
        key={`menu-option-${index}`}
        data-role={'TITLE'}
        className={doClassnames([
          'select-menu__item',
          'select-menu__item--disabled',
        ])}
        aria-disabled="true"
      >
        <span
          className={doClassnames([texts.type, 'select-menu__item__label'])}
          aria-hidden="true"
        >
          {option.label}
        </span>
      </li>
    )
  }

  MenuSeparator = (index: number) => {
    return (
      <li
        key={`menu-separator-${index}`}
        data-role={'SEPARATOR'}
      >
        <hr />
      </li>
    )
  }

  MenuOption = (option: DropdownOption, index: number) => {
    const { selected, preview, onCancellation } = this.props

    return (
      <li
        key={`menu-option-${index}`}
        className={doClassnames([
          'select-menu__item',
          selected?.split(', ').filter((value) => value === option.value)
            .length === 1 && 'select-menu__item--selected',
        ])}
        data-value={option.value}
        data-is-blocked={option.isBlocked}
        data-feature={option.feature}
        data-role={'OPTION'}
        tabIndex={0}
        aria-current={
          selected?.split(', ').filter((value) => value === option.value)
            .length === 1
            ? 'true'
            : undefined
        }
        aria-disabled={option.isBlocked}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === ' ' || e.key === 'Enter') {
            const handler = option.isBlocked ? option.onBlock : option.action
            handler && handler(e)
            onCancellation?.()
          }
          if (e.key === 'Escape') onCancellation?.()

          return null
        }}
        onMouseDown={(e) => {
          const handler = option.isBlocked ? option.onBlock : option.action
          handler?.(e)
          onCancellation?.()
        }}
        onFocus={() => null}
        onBlur={() => null}
      >
        {selected?.split(', ').filter((value) => value === option.value)
          .length === 1 && (
          <span className="select-menu__item__tick">
            <Icon
              type="PICTO"
              iconName="check"
            />
          </span>
        )}

        <span
          className={doClassnames([texts.type, 'select-menu__item__label'])}
        >
          {option.label}
        </span>
        {option.shortcut !== undefined && (
          <span
            className={doClassnames([
              texts.type,
              'select-menu__item__shortcut',
            ])}
          >
            {option.shortcut}
          </span>
        )}
        {(option.isBlocked || option.isNew) && (
          <Chip preview={preview}>{option.isNew ? 'New' : 'Pro'}</Chip>
        )}
      </li>
    )
  }

  MenuGroup = (option: DropdownOption, index: number) => {
    const { preview, onCancellation } = this.props
    const { openedGroup } = this.state

    return (
      <li
        key={`menu-group-${index}`}
        className={doClassnames(['select-menu__item'])}
        style={{
          zIndex: openedGroup === option.value ? 2 : 'auto',
        }}
        data-is-blocked={option.isBlocked}
        data-role={'GROUP'}
        tabIndex={0}
        aria-disabled={option.isBlocked}
        aria-haspopup="true"
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === ' ' || e.key === 'Enter') {
            if (option.isBlocked) {
              option.onBlock?.(e)
              return null
            }
            return this.setState({ openedGroup: option.value ?? 'EMPTY' }, () =>
              this.focusFirstSubMenuItem()
            )
          }
          if (e.key === 'Escape') onCancellation?.()

          return null
        }}
        onMouseDown={option.isBlocked ? (e) => option.onBlock?.(e) : undefined}
        onMouseEnter={() => this.onMouseEnterGroup(option.value ?? 'EMPTY')}
        onMouseLeave={this.onMouseLeaveGroup}
        onFocus={() => null}
        onBlur={() => null}
      >
        <span
          className={doClassnames([texts.type, 'select-menu__item__label'])}
        >
          {option.label}
        </span>
        {(option.isBlocked || option.isNew) && (
          <Chip preview={preview}>{option.isNew ? 'New' : 'Pro'}</Chip>
        )}
        <span className="select-menu__item__caret">
          <Icon
            type="PICTO"
            iconName="caret-right"
          />
        </span>
        {openedGroup === option.value && this.SubMenu(option.children)}
      </li>
    )
  }

  MenuSubOption = (option: DropdownOption, index: number) => {
    const { selected, preview, onCancellation } = this.props

    return (
      <li
        key={`menu-suboption-${index}`}
        className={doClassnames([
          'select-menu__item',
          selected?.split(', ').filter((value) => value === option.value)
            .length === 1 && 'select-menu__item--selected',
        ])}
        data-value={option.value}
        data-is-blocked={option.isBlocked}
        data-feature={option.feature}
        data-role={'OPTION'}
        tabIndex={0}
        aria-current={
          selected?.split(', ').filter((value) => value === option.value)
            .length === 1
            ? 'true'
            : undefined
        }
        aria-disabled={option.isBlocked}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === ' ' || e.key === 'Enter') {
            const handler = option.isBlocked ? option.onBlock : option.action
            handler && handler(e)
            onCancellation?.()
          }
          if (e.key === 'Escape')
            this.setState({ openedGroup: 'EMPTY' }, () =>
              this.focusFirstMenuItem()
            )

          return null
        }}
        onMouseDown={(e) => {
          const handler = option.isBlocked ? option.onBlock : option.action
          handler?.(e)
          onCancellation?.()
        }}
      >
        {selected?.split(', ').filter((value) => value === option.value)
          .length === 1 && (
          <span className="select-menu__item__tick">
            <Icon
              type="PICTO"
              iconName="check"
            />
          </span>
        )}
        <span
          className={doClassnames([
            texts['type--small'],
            texts.type,
            'select-menu__item__label',
          ])}
        >
          {option.label}
        </span>
        {option.shortcut !== undefined && (
          <span
            className={doClassnames([
              texts.type,
              'select-menu__item__shortcut',
            ])}
          >
            {option.shortcut}
          </span>
        )}
        {(option.isBlocked || option.isNew) && (
          <Chip preview={preview}>{option.isNew ? 'New' : 'Pro'}</Chip>
        )}
      </li>
    )
  }

  // Render
  render() {
    const { options, direction, shouldScroll, menuRef, canBeSearched } =
      this.props
    const { listScrollOffset, listScrollAmount, searchQuery } = this.state

    const displayedOptions =
      canBeSearched && searchQuery
        ? this.filterOptions(options, searchQuery)
        : options

    return (
      <div
        className="select-menu"
        style={{
          height: shouldScroll ? '100%' : 'auto',
        }}
      >
        {shouldScroll && listScrollOffset !== 0 && listScrollAmount !== 0 && (
          <div
            className="select-menu__spot select-menu__spot--top"
            onMouseEnter={() => this.startScrolling('UP')}
            onMouseLeave={this.stopScrolling}
          >
            <Icon
              type="PICTO"
              iconName="chevron-up"
            />
          </div>
        )}
        <ul
          className={doClassnames([
            'select-menu__menu',
            'select-menu__menu--active',
            direction === 'RIGHT'
              ? 'select-menu__menu--right'
              : 'select-menu__menu--left',
            shouldScroll && 'select-menu__menu--scrolling',
            canBeSearched && 'select-menu__menu--searchable',
          ])}
          onScroll={this.onScroll}
          ref={menuRef}
        >
          {canBeSearched && this.SearchInput()}
          {canBeSearched && searchQuery && displayedOptions.length === 0 && (
            <li
              className={doClassnames([
                'select-menu__item',
                'select-menu__item--disabled',
              ])}
              aria-disabled="true"
            >
              <span
                className={doClassnames([
                  texts.type,
                  'select-menu__item__label',
                ])}
              >
                {this.props.noResultsLabel ?? 'No results'}
              </span>
            </li>
          )}
          {displayedOptions?.map((option, index) => {
            const isActive =
                option.isActive !== undefined ? option.isActive : true,
              isBlocked =
                option.isBlocked !== undefined ? option.isBlocked : false,
              isNew = option.isNew !== undefined ? option.isNew : false,
              children = option.children !== undefined ? option.children : []

            if (isActive && option.type === 'SEPARATOR')
              return this.MenuSeparator(index)
            if (isActive && option.type === 'TITLE')
              return this.MenuTitle(option, index)
            if (isActive && option.type === 'OPTION')
              return this.MenuOption(
                { ...option, isActive, isBlocked, isNew, children },
                index
              )
            if (isActive && option.type === 'GROUP' && children) {
              const activeChildren = children.filter(
                (child) => child.isActive !== false
              )

              if (activeChildren.length > 1)
                return this.MenuGroup(
                  { ...option, isActive, isBlocked, isNew, children },
                  index
                )
              else if (activeChildren.length === 1)
                return this.MenuOption(
                  {
                    ...activeChildren[0],
                    isActive: activeChildren[0].isActive,
                    isBlocked: activeChildren[0].isBlocked,
                    isNew: activeChildren[0].isNew,
                  },
                  index
                )
              else return null
            }
            return null
          })}
        </ul>
        {shouldScroll &&
          listScrollAmount !== listScrollOffset &&
          listScrollAmount !== 0 && (
            <div
              className="select-menu__spot select-menu__spot--bottom"
              onMouseEnter={() => this.startScrolling('DOWN')}
              onMouseLeave={this.stopScrolling}
            >
              <Icon
                type="PICTO"
                iconName="chevron-down"
              />
            </div>
          )}
      </div>
    )
  }
}
