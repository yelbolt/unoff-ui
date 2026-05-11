import React from 'react'
import { doClassnames } from '@unoff/utils'
import layouts from '@styles/layouts.module.scss'
import Tooltip from '@components/tags/tooltip/Tooltip'
import IconChip from '@components/tags/icon-chip/IconChip'
import Chip from '@components/tags/chip/Chip'
import Icon from '@components/assets/icon/Icon'
import type { IconList } from '@tps/icon.types'
import './button.scss'

export interface ButtonProps {
  /**
   * Visual style of the button
   */
  type:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'destructive'
    | 'alternative'
    | 'icon'
  /**
   * Size of the button
   * @default 'default'
   */
  size?: 'small' | 'default' | 'large'
  /**
   * Icon name to display in the button
   */
  icon?: IconList
  /**
   * Custom CSS class for the icon
   */
  iconClassName?: string
  /**
   * Custom icon element to replace the default icon
   */
  customIcon?: React.ReactElement
  /**
   * Text label of the button
   */
  label?: string
  /**
   * Visual state of the button
   * @default 'default'
   */
  state?: 'default' | 'selected'
  /**
   * URL for link buttons
   */
  url?: string
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
   * Feature identifier for tracking
   */
  feature?: string
  /**
   * Whether the button has multiple actions
   * @default false
   */
  hasMultipleActions?: boolean
  /**
   * Whether the button should render as a link
   * @default false
   */
  isLink?: boolean
  /**
   * Whether the button should auto-focus on mount
   * @default false
   */
  isAutofocus?: boolean
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
   * Whether the button is in loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Whether the button is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Click handler for the button
   */
  action?: React.MouseEventHandler & React.KeyboardEventHandler
  /**
   * Handler called instead of action when isBlocked is true
   */
  onBlock?: React.MouseEventHandler & React.KeyboardEventHandler
}

interface ButtonState {
  isTooltipVisible: boolean
  documentWidth: number
}

export default class Button extends React.Component<ButtonProps, ButtonState> {
  buttonRef: React.RefObject<HTMLButtonElement> = React.createRef()

  static defaultProps: Partial<ButtonProps> = {
    size: 'default',
    state: 'default',
    hasMultipleActions: false,
    isLink: false,
    shouldReflow: { isEnabled: false, icon: 'adjust' },
    isAutofocus: false,
    isLoading: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  }

  constructor(props: ButtonProps) {
    super(props)
    this.state = {
      isTooltipVisible: false,
      documentWidth: document.documentElement.clientWidth,
    }
  }

  // Lifecycle
  componentDidMount = () => {
    const { isAutofocus } = this.props

    if (isAutofocus)
      setTimeout(() => {
        if (this.buttonRef.current) this.buttonRef.current.focus()
      }, 1)

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  }

  // Handlers
  handleResize = () => {
    this.setState({ documentWidth: document.documentElement.clientWidth })
  }

  // Templates
  Status = () => {
    const { warning, preview, isBlocked, isNew } = this.props

    if (warning || isBlocked || isNew)
      return (
        <div className="button__status">
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

  Button = () => {
    const {
      type,
      icon,
      size,
      helper,
      feature,
      hasMultipleActions,
      isLoading,
      isDisabled,
      isBlocked,
      action,
      onBlock,
      label,
      shouldReflow,
    } = this.props
    const { isTooltipVisible, documentWidth } = this.state

    const isReflowActive = shouldReflow?.isEnabled && documentWidth <= 460

    const getButtonLabel = () => (isReflowActive ? undefined : label)
    const getTooltipLabel = () => (isReflowActive ? label : helper?.label)
    const hasTooltipContent = () =>
      isReflowActive ? label !== undefined : helper !== undefined
    const getIconName = () =>
      isReflowActive && shouldReflow?.icon !== undefined
        ? shouldReflow.icon
        : icon

    return (
      <div
        className={layouts['snackbar--medium']}
        onMouseEnter={() => {
          if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
        }}
        onMouseLeave={() => {
          if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
        }}
      >
        <button
          role="button"
          className={doClassnames([
            'button',
            `button--${type}`,
            `button--${size}`,
            isLoading && 'button--loading',
          ])}
          data-feature={feature}
          disabled={isDisabled}
          aria-label={
            typeof (getButtonLabel() || helper?.label) === 'string'
              ? ((getButtonLabel() || helper?.label) as string)
              : undefined
          }
          aria-disabled={isDisabled}
          aria-busy={isLoading}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isDisabled)
              (isBlocked ? onBlock : action)?.(e)
            if (e.key === 'Escape') (e.target as HTMLElement).blur()
          }}
          onMouseDown={!isDisabled ? (isBlocked ? onBlock : action) : undefined}
          onFocus={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
          }}
          onBlur={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
          }}
          tabIndex={0}
          ref={this.buttonRef}
        >
          {getIconName() !== undefined && (
            <span
              className="button__icon"
              aria-hidden="true"
            >
              <Icon
                type="PICTO"
                iconName={getIconName()}
              />
            </span>
          )}
          {getButtonLabel() !== undefined && (
            <span className="button__label">{getButtonLabel()}</span>
          )}
          {isLoading && (
            <div
              className="button__loader"
              aria-hidden="true"
            >
              <Icon
                type="PICTO"
                iconName="spinner"
                customClassName="button__spinner"
              />
            </div>
          )}
          {hasMultipleActions && (
            <span
              className="button__caret"
              aria-hidden="true"
            >
              <Icon
                type="PICTO"
                iconName="chevron-down"
              />
            </span>
          )}
          {isTooltipVisible && hasTooltipContent() && (
            <Tooltip
              anchor={this.buttonRef}
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {getTooltipLabel()}
            </Tooltip>
          )}
        </button>
        {this.Status()}
      </div>
    )
  }

  LinkButton = () => {
    const { type, size, feature, label, url } = this.props

    return (
      <button
        role="link"
        className={doClassnames([
          'button',
          `button--${type}`,
          `button--${size}`,
        ])}
        data-feature={feature}
        ref={this.buttonRef}
        aria-label={label}
        tabIndex={0}
      >
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="button__label"
          aria-label={label}
        >
          {label}
        </a>
      </button>
    )
  }

  Icon = () => {
    const {
      size,
      icon,
      iconClassName,
      customIcon,
      feature,
      state,
      helper,
      isLoading,
      isDisabled,
      isBlocked,
      isNew,
      action,
      onBlock,
    } = this.props
    const { isTooltipVisible } = this.state

    return (
      <div
        className={layouts['snackbar--medium']}
        onMouseEnter={() => {
          if (helper !== undefined) this.setState({ isTooltipVisible: true })
        }}
        onMouseLeave={() => {
          if (helper !== undefined) this.setState({ isTooltipVisible: false })
        }}
      >
        <button
          role="button"
          data-feature={feature}
          className={doClassnames([
            'icon-button',
            `icon-button--${size}`,
            state === 'selected' && 'icon-button--selected',
            isNew && 'icon-button--new',
            isLoading && 'button--loading',
          ])}
          disabled={isDisabled}
          aria-label={typeof helper?.label === 'string' ? helper.label : icon}
          aria-disabled={isDisabled}
          aria-pressed={state === 'selected'}
          aria-busy={isLoading}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isDisabled)
              (isBlocked ? onBlock : action)?.(e)
            if (e.key === 'Escape') (e.target as HTMLElement).blur()
          }}
          onMouseDown={!isDisabled ? (isBlocked ? onBlock : action) : undefined}
          onFocus={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onBlur={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
          tabIndex={0}
          ref={this.buttonRef}
        >
          {customIcon === undefined ? (
            <Icon
              type="PICTO"
              iconName={isLoading ? 'spinner' : icon}
              customClassName={
                iconClassName !== undefined ? iconClassName : undefined
              }
            />
          ) : (
            <div
              style={{
                opacity: isDisabled ? 0.5 : 1,
                pointerEvents: 'none',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {customIcon}
            </div>
          )}
          {isTooltipVisible && helper !== undefined && state !== 'selected' && (
            <Tooltip
              anchor={this.buttonRef}
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {helper?.label}
            </Tooltip>
          )}
        </button>
        {!isNew && this.Status()}
      </div>
    )
  }

  // Render
  render() {
    const { type, isLink } = this.props

    if (type !== 'icon') return isLink ? this.LinkButton() : this.Button()
    return this.Icon()
  }
}
