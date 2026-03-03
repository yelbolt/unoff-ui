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
   * Horizontal alignment of the dropdown
   * @default 'LEFT'
   */
  alignment?: 'RIGHT' | 'LEFT' | 'FILL'
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
   * Handler called when unblock is clicked
   */
  onUnblock?: React.MouseEventHandler & React.KeyboardEventHandler
}

export interface DropdownState {
  isMenuOpen: boolean
  isMenuVisible: boolean
  listShouldScroll: boolean
  isTooltipVisible: boolean
  documentWidth: number
}

export default class Dropdown extends React.Component<DropdownProps, DropdownState> {
  private selectMenuRef: React.RefObject<HTMLDivElement>
  private buttonRef: React.RefObject<HTMLButtonElement>
  private listRef: React.RefObject<HTMLDivElement>
  private actionsListRef: React.RefObject<ActionsList>
  private menuRef: React.RefObject<HTMLUListElement>
  private subMenuRef: React.RefObject<HTMLUListElement>

  static defaultProps: Partial<DropdownProps> = {
    alignment: 'LEFT',
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
    const { containerId } = this.props
    const { isMenuOpen } = this.state

    this.setState({
      isMenuOpen: !isMenuOpen,
    })

    setTimeout(() => {
      if (this.listRef.current != null) {
        const menuRect = this.listRef.current.getBoundingClientRect()
        const buttonRect = this.buttonRef.current?.getBoundingClientRect()

        let adjustedTop = 0
        let adjustedLeft = 0
        let shouldTransformY = false
        let shouldTransformX = false

        if (menuRect.bottom > window.innerHeight) {
          adjustedTop = window.innerHeight - menuRect.height - 8
          shouldTransformY = true
        }
        if (menuRect.top < 0) {
          adjustedTop = 8
          shouldTransformY = true
        }

        if (menuRect.right > window.innerWidth) {
          adjustedLeft = window.innerWidth - menuRect.width - 8
          shouldTransformX = true
        }
        if (menuRect.left < 0) {
          adjustedLeft = 8
          shouldTransformX = true
        }

        if (shouldTransformY) {
          if (buttonRect)
            this.listRef.current.style.top = `${adjustedTop - buttonRect.top}px`
          this.listRef.current.style.transform = shouldTransformX
            ? `translate(${adjustedLeft - menuRect.left}px, 0)`
            : 'none'
        }

        if (shouldTransformX && !shouldTransformY)
          this.listRef.current.style.transform = `translateX(${adjustedLeft - menuRect.left}px)`

        if (containerId !== undefined) {
          const containerElement = document.getElementById(containerId)
          if (containerElement) {
            const container = containerElement.getBoundingClientRect()
            const button = this.buttonRef.current?.getBoundingClientRect()

            const diffTop =
              this.listRef.current.getBoundingClientRect().top - container.top
            const diffBottom =
              this.listRef.current.getBoundingClientRect().bottom -
              container.bottom

            if (diffTop < -16 && button) {
              this.listRef.current.style.top = `${container.top - button.top + 16}px`
              this.setState({
                listShouldScroll: true,
              })

              const diffBottomV2 =
                this.listRef.current.getBoundingClientRect().bottom -
                container.bottom

              if (diffBottomV2 < -16)
                this.listRef.current.style.bottom = `${
                  button.bottom - container.bottom + 16
                }px`
            }

            if (diffBottom > -16 && button) {
              this.listRef.current.style.bottom = `${
                button.bottom - container.bottom + 16
              }px`
              this.setState({
                listShouldScroll: true,
              })

              const diffTopV2 =
                this.listRef.current.getBoundingClientRect().top - container.top

              if (diffTopV2 > -16)
                this.listRef.current.style.top = `${container.top - button.top + 16}px`
            }

            this.listRef.current.style.visibility = 'visible'
          }
        }

        // Rendre le menu visible après positionnement
        this.setState({ isMenuVisible: true })
      }
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
        this.menuRef.current?.contains(target))
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
    const { warning, preview, isBlocked, isNew, onUnblock } = this.props

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
              action={isBlocked ? onUnblock : undefined}
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
    } = this.props

    const newAlignment = []

    if (pin === 'TOP' || pin === 'NONE') newAlignment.push('BOTTOM')
    else newAlignment.push('TOP')

    if (alignment === 'LEFT' || alignment === 'FILL') newAlignment.push('LEFT')
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
      />
    )
  }

  DropdownButton = () => {
    const {
      id,
      alignment,
      options,
      selected,
      helper,
      containerId,
      isDisabled,
      isBlocked,
    } = this.props
    const { isMenuOpen, listShouldScroll, isTooltipVisible } = this.state

    return (
      <div
        id={id}
        className={doClassnames([
          'select-menu',
          (() => {
            if (alignment === 'LEFT') return 'select-menu--left'
            if (alignment === 'RIGHT') return 'select-menu--right'
            return 'select-menu--fill'
          })(),
          (isDisabled || isBlocked) && 'select-menu--disabled',
        ])}
        ref={this.selectMenuRef}
      >
        <button
          role="combobox"
          className={doClassnames([
            'select-menu__button',
            isMenuOpen && 'select-menu__button--active',
          ])}
          disabled={isDisabled || isBlocked}
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          {...(isMenuOpen &&
            (containerId === undefined ? this.state.isMenuVisible : true) && {
              'aria-controls': `${id}-menu`,
            })}
          aria-label={`Select option: ${this.findSelectedOption(options)}`}
          aria-haspopup="menu"
          onKeyDown={(e) => {
            if (
              e.key === ' ' ||
              (e.key === 'Enter' && !(isDisabled || isBlocked))
            ) {
              this.onOpenMenu()
              setTimeout(
                () => this.actionsListRef.current?.focusFirstMenuItem(),
                0
              )
            }
            if (e.key === 'Escape') return (e.target as HTMLElement).blur()
            return null
          }}
          onMouseDown={!(isDisabled || isBlocked) ? this.onOpenMenu : undefined}
          onMouseEnter={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
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
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {helper?.label}
            </Tooltip>
          )}
        </button>
        {this.Status()}
        {(() => {
          const { pin } = this.props

          if (isMenuOpen)
            return (
              <div
                className="floating-menu"
                id={`${id}-menu`}
                style={{
                  position: 'absolute',
                  zIndex: 99,
                  top:
                    pin === 'TOP'
                      ? '-4px'
                      : pin === 'BOTTOM'
                        ? 'auto'
                        : this.setPosition(),
                  bottom: pin === 'BOTTOM' ? '-4px' : 'auto',
                  right: alignment === 'RIGHT' ? 0 : 'auto',
                  left: alignment === 'LEFT' ? 0 : 'auto',
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
                  direction={alignment?.includes('LEFT') ? 'RIGHT' : 'LEFT'}
                  shouldScroll={listShouldScroll}
                  containerId={containerId}
                  onCancellation={() => this.setState({ isMenuOpen: false })}
                  ref={this.actionsListRef}
                  menuRef={this.menuRef}
                  subMenuRef={this.subMenuRef}
                />
              </div>
            )
          return null
        })()}
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
