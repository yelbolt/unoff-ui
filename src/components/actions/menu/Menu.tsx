import React from 'react'
import { doClassnames } from '@unoff/utils'
import ActionsList from '@components/lists/actions-list/ActionsList'
import type { DropdownOption } from '@tps/list.types'
import type { IconList } from '@tps/icon.types'
import Button from '../button/Button'
import './menu.scss'

export interface MenuProps {
  /**
   * Unique identifier for the menu
   */
  id: string
  /**
   * Visual type of the menu button
   * @default 'ICON'
   */
  type: 'ICON' | 'PRIMARY'
  /**
   * Text label for the menu button
   */
  label?: string
  /**
   * Icon name to display in the button
   */
  icon?: IconList
  /**
   * Custom icon element
   */
  customIcon?: React.ReactElement
  /**
   * List of menu options
   * @default []
   */
  options: Array<DropdownOption>
  /**
   * ID of the currently selected option
   */
  selected?: string
  /**
   * ID of the container element for portal rendering
   */
  containerId?: string
  /**
   * State of the menu button
   * @default 'DEFAULT'
   */
  state?: 'DEFAULT' | 'DISABLED' | 'LOADING'
  /**
   * Position of the menu relative to the button
   * @default 'BOTTOM_LEFT'
   */
  alignment?: 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
  /**
   * Helper tooltip configuration
   */
  helper?: {
    /** Tooltip content */
    label: string | React.ReactNode
    /** Tooltip position */
    pin?: 'TOP' | 'BOTTOM'
    /** Whether to use single line display */
    isSingleLine?: boolean
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
   * Whether the menu is blocked
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
}

export interface MenuState {
  isMenuOpen: boolean
  isMenuVisible: boolean
  alignment: 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  private selectMenuRef: React.RefObject<HTMLDivElement>
  buttonRef: React.RefObject<Button>
  private listRef: React.RefObject<HTMLDivElement>
  private actionsListRef: React.RefObject<ActionsList>
  private menuRef: React.RefObject<HTMLUListElement>
  private subMenuRef: React.RefObject<HTMLUListElement>

  static defaultProps: Partial<MenuProps> = {
    type: 'ICON',
    options: [],
    state: 'DEFAULT',
    alignment: 'BOTTOM_LEFT',
    isBlocked: false,
    isNew: false,
  }

  constructor(props: MenuProps) {
    super(props)
    this.state = {
      isMenuOpen: false,
      isMenuVisible: false,
      alignment: props.alignment ?? 'BOTTOM_LEFT',
    }
    this.selectMenuRef = React.createRef()
    this.buttonRef = React.createRef()
    this.listRef = React.createRef()
    this.actionsListRef = React.createRef()
    this.menuRef = React.createRef()
    this.subMenuRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount = () =>
    document.addEventListener('mousedown', this.handleClickOutside)

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  // Direct Actions
  handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement
    const { isMenuOpen } = this.state

    if (
      (this.buttonRef.current?.buttonRef.current?.contains(target) &&
        isMenuOpen) ||
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
      })
  }

  onOpenMenu = (
    e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => {
    const { containerId, alignment } = this.props
    const { isMenuOpen } = this.state

    this.setState({
      isMenuOpen: !isMenuOpen,
    })

    setTimeout(() => {
      if (this.listRef.current != null) {
        const menuRect = this.listRef.current.getBoundingClientRect()
        const buttonRect =
          this.buttonRef.current?.buttonRef.current?.getBoundingClientRect()

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
          const isTopAlignment = alignment?.includes('TOP')
          const baseTransform = isTopAlignment ? 'translateY(-100%)' : 'none'

          if (buttonRect) {
            const originalTop = isTopAlignment ? -menuRect.height : 0
            const adjustment = adjustedTop - buttonRect.top - originalTop
            this.listRef.current.style.top = `${adjustment}px`
          }

          this.listRef.current.style.transform = shouldTransformX
            ? `${baseTransform !== 'none' ? baseTransform + ' ' : ''}translateX(${adjustedLeft - menuRect.left}px)`
            : baseTransform
        }

        if (shouldTransformX && !shouldTransformY) {
          const isTopAlignment = alignment?.includes('TOP')
          const baseTransform = isTopAlignment ? 'translateY(-100%)' : 'none'

          this.listRef.current.style.transform =
            baseTransform === 'none'
              ? `translateX(${adjustedLeft - menuRect.left}px)`
              : `${baseTransform} translateX(${adjustedLeft - menuRect.left}px)`
        }

        if (containerId !== undefined) {
          const containerElement = document.getElementById(containerId)
          if (containerElement) {
            const container = containerElement.getBoundingClientRect()
            const button =
              this.buttonRef.current?.buttonRef.current?.getBoundingClientRect()

            const diffTop =
              this.listRef.current.getBoundingClientRect().top - container.top
            const diffBottom =
              this.listRef.current.getBoundingClientRect().bottom -
              container.bottom

            if (diffTop < -16 && button)
              this.listRef.current.style.top = `${container.top - button.top + 16}px`

            if (diffBottom > -16 && button)
              this.listRef.current.style.bottom = `${
                button.bottom - container.bottom + 16
              }px`

            this.listRef.current.style.visibility = 'visible'
          }
        }

        // Rendre le menu visible après positionnement
        this.setState({ isMenuVisible: true })
      }
    }, 0)

    if (e.type === 'keydown')
      setTimeout(() => this.actionsListRef.current?.focusFirstMenuItem(), 0)
  }

  render() {
    const {
      id,
      type,
      label,
      state,
      icon,
      helper,
      warning,
      customIcon,
      options,
      selected,
      alignment,
      isBlocked,
      isNew,
      containerId,
      canBeSearched,
      searchLabel,
      noResultsLabel,
    } = this.props
    const { isMenuOpen } = this.state

    const flattenOptions = (options: DropdownOption[]): DropdownOption[] => {
      const flat: DropdownOption[] = []
      options.forEach((option) => {
        flat.push(option)
        if (Array.isArray(option.children) && option.children.length > 0)
          flat.push(...flattenOptions(option.children))
      })
      return flat
    }

    const activeOptions = flattenOptions(options).filter(
      (option) => option.isActive !== false
    )

    if (activeOptions.length === 0) return null
    if (activeOptions.length === 1 && activeOptions[0].children === undefined) {
      const option = activeOptions[0]
      return (
        <Button
          type={type === 'ICON' ? 'secondary' : 'primary'}
          label={option.label}
          isLoading={state === 'LOADING'}
          isDisabled={state === 'DISABLED' || isBlocked}
          isBlocked={option.isBlocked}
          isNew={option.isNew}
          action={
            !(state === 'DISABLED' || isBlocked)
              ? (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>) =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  option.action?.(e as any)
              : undefined
          }
        />
      )
    }

    return (
      <div
        id={id}
        className={doClassnames([
          'menu',
          'recharged',
          `menu--${alignment?.toLocaleLowerCase().replace('_', '-')}`,
        ])}
        ref={this.selectMenuRef}
      >
        {type === 'ICON' ? (
          <Button
            type="icon"
            icon={icon === undefined ? undefined : icon}
            customIcon={customIcon === undefined ? undefined : customIcon}
            state={isMenuOpen ? 'selected' : undefined}
            helper={helper === undefined ? undefined : helper}
            warning={warning === undefined ? undefined : warning}
            isLoading={state === 'LOADING'}
            isDisabled={state === 'DISABLED' || isBlocked}
            isNew={isNew}
            ref={this.buttonRef}
            action={(e) =>
              !(state === 'DISABLED' || isBlocked)
                ? this.onOpenMenu(e)
                : undefined
            }
            aria-label={label}
            aria-haspopup="true"
            aria-controls={`menu-${id}`}
            aria-expanded={isMenuOpen}
          />
        ) : (
          <Button
            type="primary"
            label={label}
            hasMultipleActions
            helper={helper === undefined ? undefined : helper}
            warning={warning === undefined ? undefined : warning}
            isLoading={state === 'LOADING'}
            isDisabled={state === 'DISABLED' || isBlocked}
            isNew={isNew}
            ref={this.buttonRef}
            action={(e) =>
              !(state === 'DISABLED' || isBlocked)
                ? this.onOpenMenu(e)
                : undefined
            }
            aria-label={label}
            aria-haspopup="true"
            aria-controls={`menu-${id}`}
            aria-expanded={isMenuOpen}
          />
        )}
        {(() => {
          if (isMenuOpen)
            return (
              <div
                id={`menu-${id}`}
                className="floating-menu"
                style={{
                  position: 'absolute',
                  zIndex: 99,
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
            )
          return null
        })()}
      </div>
    )
  }
}
