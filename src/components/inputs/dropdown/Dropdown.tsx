import { createPortal } from 'react-dom'
import React from 'react'
import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import Tooltip from '@components/tags/tooltip/Tooltip'
import IconChip from '@components/tags/icon-chip/IconChip'
import Chip from '@components/tags/chip/Chip'
import ActionsList from '@components/lists/actions-list/ActionsList'
import Icon from '@components/assets/icon/Icon'
import Menu, { MenuProps } from '@components/actions/menu/Menu'
import type { DropdownOption } from '@tps/list.types'
import type { IconList } from '@tps/icon.types'
import './dropdown.scss'

export interface DropdownProps {
  /**
   * Unique identifier for the dropdown
   */
  id: string
  /**
   * List of options to display in the dropdown
   */
  options: Array<DropdownOption>
  /**
   * ID of the currently selected option
   */
  selected: string
  /**
   * ID of the container element for portal rendering
   */
  containerId?: string
  /**
   * Horizontal alignment of the dropdown list
   * @default 'LEFT'
   */
  alignment?: 'RIGHT' | 'LEFT'
  /**
   * Whether the trigger button stretches to fill its container
   * @default false
   */
  isFill?: boolean
  /**
   * Vertical position of helper tooltips
   * @default 'NONE'
   */
  pin?: 'NONE' | 'TOP' | 'BOTTOM'
  /**
   * Helper tooltip configuration
   */
  helper?: {
    /** Tooltip content */
    label: string | React.ReactNode
    /** Tooltip position */
    pin?: 'TOP' | 'BOTTOM'
    /** Tooltip display type */
    type?: 'MULTI_LINE' | 'SINGLE_LINE'
  }
  /**
   * Preview tooltip configuration with image
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
   * Warning tooltip configuration
   */
  warning?: {
    /** Warning message */
    label: string | React.ReactNode
    /** Warning position */
    pin?: 'TOP' | 'BOTTOM'
    /** Warning display type */
    type?: 'MULTI_LINE' | 'SINGLE_LINE'
  }
  /**
   * Reflow configuration for responsive behavior
   * @default { isEnabled: false, icon: 'adjust' }
   */
  shouldReflow?: {
    /** Whether reflow is enabled */
    isEnabled: boolean
    /** Icon to show when reflowed */
    icon: IconList
  }
  /**
   * Whether the dropdown is disabled
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether the dropdown is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Whether the option list can be filtered by a search input
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
/**
 * Handler called instead of opening the dropdown when isBlocked is true
 */
onBlock?: React.MouseEventHandler & React.KeyboardEventHandler
}

export interface DropdownState {
  isMenuOpen: boolean
  isMenuVisible: boolean
  listShouldScroll: boolean
  isTooltipVisible: boolean
  documentWidth: number
}

export default class Dropdown extends React.Component<
  DropdownProps,
  DropdownState
> {
  private selectMenuRef: React.RefObject<HTMLDivElement>
  private buttonRef: React.RefObject<HTMLButtonElement>
  private listRef: React.RefObject<HTMLDivElement>
  private actionsListRef: React.RefObject<ActionsList>
  private menuRef: React.RefObject<HTMLUListElement>
  private subMenuRef: React.RefObject<HTMLUListElement>

  static defaultProps: Partial<DropdownProps> = {
    alignment: 'LEFT',
    isFill: false,
    pin: 'NONE',
    shouldReflow: { isEnabled: false, icon: 'adjust' },
    isNew: false,
    isBlocked: false,
    isDisabled: false,
  }

  constructor(props: DropdownProps) {
    super(props)
    this.state = {
      isMenuOpen: false,
      isMenuVisible: false,
      listShouldScroll: false,
      isTooltipVisible: false,
      documentWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    }
    this.selectMenuRef = React.createRef()
    this.buttonRef = React.createRef()
    this.listRef = React.createRef()
    this.actionsListRef = React.createRef()
    this.menuRef = React.createRef()
    this.subMenuRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  // Lifecycle
  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside)
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside)
    window.removeEventListener('resize', this.handleResize)
  }

  // Handlers
  handleResize = () => {
    this.setState({ documentWidth: window.innerWidth })
  }

  // Direct Actions
  onOpenMenu = () => {
    const { containerId, pin, alignment } = this.props
    const { isMenuOpen } = this.state

    this.setState({ isMenuOpen: !isMenuOpen })

    setTimeout(() => {
      if (this.listRef.current == null) return

      const menuRect = this.listRef.current.getBoundingClientRect()
      const containerRect = this.selectMenuRef.current?.getBoundingClientRect()

      if (!containerRect) return

      let top: number
      if (pin === 'TOP') top = containerRect.top - 4
      else if (pin === 'BOTTOM')
        top = containerRect.bottom + 4 - menuRect.height
      else top = containerRect.top + parseInt(this.setPosition() || '0')

      let left: number
      if (alignment === 'RIGHT') left = containerRect.right - menuRect.width
      else left = containerRect.left

      if (top + menuRect.height > window.innerHeight - 8)
        top = window.innerHeight - menuRect.height - 8
      if (top < 8) top = 8
      if (left + menuRect.width > window.innerWidth - 8)
        left = window.innerWidth - menuRect.width - 8
      if (left < 8) left = 8

      this.listRef.current.style.top = `${top}px`
      this.listRef.current.style.left = `${left}px`

      if (containerId !== undefined) {
        const containerElement = document.getElementById(containerId)
        if (containerElement) {
          const container = containerElement.getBoundingClientRect()
          const updatedMenuRect = this.listRef.current.getBoundingClientRect()

          const diffTop = updatedMenuRect.top - container.top
          const diffBottom = updatedMenuRect.bottom - container.bottom

          if (diffTop < -16) {
            this.listRef.current.style.top = `${container.top + 16}px`
            this.setState({ listShouldScroll: true })
            const diffBottomV2 =
              this.listRef.current.getBoundingClientRect().bottom -
              container.bottom
            if (diffBottomV2 < -16)
              this.listRef.current.style.bottom = `${
                window.innerHeight - container.bottom + 16
              }px`
          }

          if (diffBottom > -16) {
            this.listRef.current.style.bottom = `${
              window.innerHeight - container.bottom + 16
            }px`
            this.setState({ listShouldScroll: true })
            const diffTopV2 =
              this.listRef.current.getBoundingClientRect().top - container.top
            if (diffTopV2 > -16)
              this.listRef.current.style.top = `${container.top + 16}px`
          }

          this.listRef.current.style.visibility = 'visible'
        }
      }

      this.setState({ isMenuVisible: true })
    }, 1)
  }

  setPosition = () => {
    const { options, selected } = this.props
    if (!this.selectMenuRef.current || !this.listRef.current) return '0px'

    const listComputedStyle = getComputedStyle(this.listRef.current)
    const itemHeight = parseInt(
      listComputedStyle.getPropertyValue('--actions-list-item-height') || '32',
      10
    )
    const dividerHeight = parseInt(
      listComputedStyle.getPropertyValue('--actions-list-divider-height') ||
        '1',
      10
    )
    const dividerMarginTop = parseInt(
      listComputedStyle.getPropertyValue('--actions-list-divider-margin-top') ||
        '11',
      10
    )
    const dividerMarginBottom = parseInt(
      listComputedStyle.getPropertyValue(
        '--actions-list-divider-margin-bottom'
      ) || '8',
      10
    )

    const menuPaddingTop = parseInt(
      listComputedStyle.getPropertyValue('--actions-list-padding-top') || '4',
      10
    )

    let totalHeight = menuPaddingTop

    for (let i = 0; i < options.length; i++) {
      const option = options[i]

      if (
        option.value === selected ||
        option.children?.find((child) => child.value === selected) !== undefined
      )
        break

      if (option.type === 'SEPARATOR')
        totalHeight += dividerHeight + dividerMarginTop + dividerMarginBottom
      else if (
        option.type === 'TITLE' ||
        option.type === 'OPTION' ||
        option.type === 'GROUP'
      )
        totalHeight += itemHeight
    }

    return `-${totalHeight}px`
  }

  handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement
    if (
      target === this.buttonRef.current ||
      target === this.menuRef.current ||
      target === this.subMenuRef.current ||
      (target.tagName === 'HR' && this.menuRef.current?.contains(target)) ||
      (target.dataset.role === 'GROUP' &&
        this.menuRef.current?.contains(target)) ||
      this.listRef.current?.contains(target)
    )
      this.setState({
        isMenuOpen: true,
      })
    else
      this.setState({
        isMenuOpen: false,
        isMenuVisible: false,
        listShouldScroll: false,
      })
  }

  findSelectedOption = (options: Array<DropdownOption>): string => {
    const { selected } = this.props
    const label: Array<string> = []

    selected.split(', ').forEach((value) => {
      options.forEach((option) => {
        if (option.value === value) label.push(option.label ?? '')
        if (
          option.children?.find((child) => child.value === value) !== undefined
        )
          label.push(
            option.children?.find((child) => child.value === value)?.label ?? ''
          )
      })
    })
    return label.join(', ')
  }

  // Template
  Status = () => {
    const { warning, preview, isBlocked, isNew } = this.props

    if (warning || isBlocked || isNew)
      return (
        <div className="select-menu__status">
          {warning !== undefined && (
            <IconChip
              iconType="PICTO"
              iconName="warning"
              text={warning.label}
              pin={warning.pin}
              type={warning.type}
            />
          )}
          {(isBlocked || isNew) && (
            <Chip
              preview={preview}
              isSolo
            >
              {isNew ? 'New' : 'Pro'}
            </Chip>
          )}
        </div>
      )
  }

  // Templates
  MenuButton = () => {
    const {
      id,
      helper,
      warning,
      options,
      selected,
      pin,
      alignment,
      shouldReflow,
      isBlocked,
      canBeSearched,
      searchLabel,
      noResultsLabel,
    } = this.props

    const newAlignment = []

    if (pin === 'TOP' || pin === 'NONE') newAlignment.push('BOTTOM')
    else newAlignment.push('TOP')

    if (alignment === 'LEFT') newAlignment.push('LEFT')
    else newAlignment.push('RIGHT')

    return (
      <Menu
        id={id}
        options={options}
        selected={selected}
        alignment={`${newAlignment.join('_')}` as MenuProps['alignment']}
        icon={shouldReflow?.icon}
        helper={helper}
        warning={warning}
        isBlocked={isBlocked}
        canBeSearched={canBeSearched}
        searchLabel={searchLabel}
        noResultsLabel={noResultsLabel}
      />
    )
  }

  DropdownButton = () => {
    const {
      id,
      alignment,
      isFill,
      options,
      selected,
      helper,
      containerId,
      isDisabled,
      isBlocked,
      onBlock,
      canBeSearched,
      searchLabel,
      noResultsLabel,
    } = this.props
    const { isMenuOpen, listShouldScroll, isTooltipVisible } = this.state

    return (
      <div
        id={id}
        className={doClassnames([
          'select-menu',
          isFill
            ? 'select-menu--fill'
            : alignment === 'RIGHT'
              ? 'select-menu--right'
              : 'select-menu--left',
          isDisabled && 'select-menu--disabled',
        ])}
        onMouseEnter={() => {
          if (helper !== undefined) this.setState({ isTooltipVisible: true })
        }}
        onMouseLeave={() => {
          if (helper !== undefined) this.setState({ isTooltipVisible: false })
        }}
        ref={this.selectMenuRef}
      >
        <button
          role="combobox"
          className={doClassnames([
            'select-menu__button',
            isMenuOpen && 'select-menu__button--active',
          ])}
          disabled={isDisabled}
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          {...(isMenuOpen &&
            (containerId === undefined ? this.state.isMenuVisible : true) && {
              'aria-controls': `${id}-menu`,
            })}
          aria-label={`Select option: ${this.findSelectedOption(options)}`}
          aria-haspopup="menu"
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isDisabled) {
              if (isBlocked) {
                onBlock?.(e)
              } else {
                this.onOpenMenu()
                setTimeout(
                  () => this.actionsListRef.current?.focusFirstMenuItem(),
                  0
                )
              }
            }
            if (e.key === 'Escape') return (e.target as HTMLElement).blur()
            return null
          }}
          onMouseDown={!isDisabled ? (isBlocked ? onBlock : this.onOpenMenu) : undefined}
          onFocus={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onBlur={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
          tabIndex={0}
          ref={this.buttonRef}
        >
          <span
            className={doClassnames([
              texts['type--truncated'],
              texts.type,
              'select-menu__label',
            ])}
          >
            {this.findSelectedOption(options)}
          </span>
          <span className="select-menu__caret">
            <Icon
              type="PICTO"
              iconName="caret-down"
            />
          </span>
          {isTooltipVisible && helper !== undefined && (
            <Tooltip
              anchor={this.buttonRef}
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {helper?.label}
            </Tooltip>
          )}
        </button>
        {this.Status()}
        {isMenuOpen &&
          createPortal(
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                aria-hidden="true"
              />
              <div
                className="floating-menu"
                id={`${id}-menu`}
                style={{
                  position: 'fixed',
                  zIndex: 99,
                  top: 0,
                  left: 0,
                  visibility:
                    containerId === undefined && this.state.isMenuVisible
                      ? 'visible'
                      : 'hidden',
                }}
                ref={this.listRef}
              >
                <ActionsList
                  options={options}
                  selected={selected}
                  direction={alignment === 'LEFT' ? 'RIGHT' : 'LEFT'}
                  shouldScroll={listShouldScroll}
                  containerId={containerId}
                  onCancellation={() => this.setState({ isMenuOpen: false })}
                  ref={this.actionsListRef}
                  menuRef={this.menuRef}
                  subMenuRef={this.subMenuRef}
                  canBeSearched={canBeSearched}
                  searchLabel={searchLabel}
                  noResultsLabel={noResultsLabel}
                />
              </div>
            </>,
            document.body
          )}
      </div>
    )
  }

  // Render
  render() {
    const { shouldReflow } = this.props
    const { documentWidth } = this.state

    const isReflowActive = shouldReflow?.isEnabled && documentWidth <= 460

    if (isReflowActive) return this.MenuButton()
    return this.DropdownButton()
  }
}
