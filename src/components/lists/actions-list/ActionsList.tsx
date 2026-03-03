import React from 'react'
import { doClassnames } from '@unoff/utils'
import { DropdownOption } from '@tps/list.types'
import texts from '@styles/texts/texts.module.scss'
import Chip from '@components/tags/chip/Chip'
import Icon from '@components/assets/icon/Icon.tsx'
import './actions-list.scss'

export interface ActionsListProps {
  /**
   * List of options to display
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
}

export interface ActionsListState {
  openedGroup: string
  listScrollOffset: number
  listScrollAmount: number
  listClientHeight?: number
  shift: number
  isVisible: boolean
}

export default class ActionsList extends React.Component<ActionsListProps, ActionsListState> {
  private scrollInterval: number | null
  private subMenuContainerRef: React.RefObject<HTMLDivElement>

  static defaultProps: Partial<ActionsListProps> = {
    direction: 'RIGHT',
    shouldScroll: false,
    onCancellation: () => null,
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
    }
    this.scrollInterval = null
    this.subMenuContainerRef = React.createRef<HTMLDivElement>()
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

  // Direct Actions
  focusFirstMenuItem = () => {
    const { menuRef } = this.props

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

  // Template
  SubMenu = (options: Array<DropdownOption> | undefined) => {
    const { subMenuRef } = this.props
    const { shift, isVisible } = this.state

    return (
      <div
        className="select-menu__submenu"
        role="menu"
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
          option.isBlocked && 'select-menu__item--blocked',
        ])}
        data-value={option.value}
        data-is-blocked={option.isBlocked}
        data-feature={option.feature}
        data-role={'OPTION'}
        tabIndex={option.isBlocked ? -1 : 0}
        aria-current={
          selected?.split(', ').filter((value) => value === option.value)
            .length === 1
            ? 'true'
            : undefined
        }
        aria-disabled={option.isBlocked}
        onKeyDown={(e) => {
          e.stopPropagation()
          if ((e.key === ' ' || e.key === 'Enter') && !option.isBlocked) {
            option.action && option.action(e)
            onCancellation?.()
          }
          if (e.key === 'Escape') onCancellation?.()

          return null
        }}
        onMouseDown={(e) => {
          !option.isBlocked ? option.action?.(e) : undefined
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
        className={doClassnames([
          'select-menu__item',
          option.isBlocked && ' select-menu__item--blocked',
        ])}
        style={{
          zIndex: openedGroup === option.value ? 2 : 'auto',
        }}
        data-is-blocked={option.isBlocked}
        data-role={'GROUP'}
        tabIndex={option.isBlocked ? -1 : 0}
        aria-disabled={option.isBlocked}
        aria-haspopup="true"
        onKeyDown={(e) => {
          e.stopPropagation()
          if ((e.key === ' ' || e.key === 'Enter') && !option.isBlocked)
            return this.setState({ openedGroup: option.value ?? 'EMPTY' }, () =>
              this.focusFirstSubMenuItem()
            )
          if (e.key === 'Escape') onCancellation?.()

          return null
        }}
        onMouseEnter={() =>
          this.setState({ openedGroup: option.value ?? 'EMPTY' })
        }
        onMouseLeave={() => this.setState({ openedGroup: 'EMPTY' })}
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
          option.isBlocked && 'select-menu__item--blocked',
        ])}
        data-value={option.value}
        data-is-blocked={option.isBlocked}
        data-feature={option.feature}
        data-role={'OPTION'}
        tabIndex={option.isBlocked ? -1 : 0}
        aria-current={
          selected?.split(', ').filter((value) => value === option.value)
            .length === 1
            ? 'true'
            : undefined
        }
        aria-disabled={option.isBlocked}
        onKeyDown={(e) => {
          e.stopPropagation()
          if ((e.key === ' ' || e.key === 'Enter') && !option.isBlocked) {
            option.action && option.action(e)
            onCancellation?.()
          }
          if (e.key === 'Escape')
            this.setState({ openedGroup: 'EMPTY' }, () =>
              this.focusFirstMenuItem()
            )

          return null
        }}
        onMouseDown={!option.isBlocked ? option.action : undefined}
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
        {(option.isBlocked || option.isNew) && (
          <Chip preview={preview}>{option.isNew ? 'New' : 'Pro'}</Chip>
        )}
      </li>
    )
  }

  render() {
    const { options, direction, shouldScroll, menuRef } = this.props
    const { listScrollOffset, listScrollAmount } = this.state

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
          ])}
          onScroll={this.onScroll}
          ref={menuRef}
        >
          {options?.map((option, index) => {
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
