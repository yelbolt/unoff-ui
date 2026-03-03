import React from 'react'
import { doClassnames } from '@unoff/utils'
import layouts from '@styles/layouts.module.scss'
import Tooltip from '@components/tags/tooltip/Tooltip'
import IconChip from '@components/tags/icon-chip/IconChip'
import Chip from '@components/tags/chip/Chip'
import './select.scss'

export interface SelectProps {
  /**
   * Unique identifier for the select input
   */
  id: string
  /**
   * Type of selection control
   */
  type: 'CHECK_BOX' | 'RADIO_BUTTON' | 'SWITCH_BUTTON'
  /**
   * Label text
   */
  label?: string
  /**
   * Name attribute for form submission
   */
  name?: string
  /**
   * Value attribute
   */
  value?: string
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
   * Whether to reflow on small screens
   * @default false
   */
  shouldReflow?: boolean
  /**
   * Whether the control is checked
   * @default false
   */
  isChecked?: boolean
  /**
   * Whether the control is disabled
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether the control is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Change event handler
   */
  action: React.ChangeEventHandler<HTMLInputElement>
  /**
   * Handler called when unblock is clicked
   */
  onUnblock?: React.MouseEventHandler & React.KeyboardEventHandler
}

export interface SelectState {
  isTooltipVisible: boolean
  documentWidth: number
}

export default class Select extends React.Component<SelectProps, SelectState> {
  private inputRef: React.RefObject<HTMLInputElement> = React.createRef()

  static defaultProps: Partial<SelectProps> = {
    shouldReflow: false,
    isChecked: false,
    isDisabled: false,
    isBlocked: false,
    isNew: false,
  }

  constructor(props: SelectProps) {
    super(props)
    this.state = {
      isTooltipVisible: false,
      documentWidth: document.documentElement.clientWidth,
    }
  }

  // Lifecycle
  componentDidMount = () => {
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
  Status = (type: 'checkbox' | 'radio' | 'switch') => {
    const { warning, preview, isBlocked, isNew, onUnblock } = this.props

    if (warning || isBlocked || isNew)
      return (
        <div className={`${type}__status`}>
          {warning !== undefined && (
            <div
              style={{
                position: 'relative',
                pointerEvents: 'auto',
              }}
            >
              <IconChip
                iconType="PICTO"
                iconName="warning"
                text={warning.label}
                pin={warning.pin}
                type={warning.type}
              />
            </div>
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

  CheckBox = () => {
    const {
      id,
      label,
      name,
      helper,
      feature,
      shouldReflow,
      isChecked,
      isDisabled,
      isBlocked,
      action,
    } = this.props
    const { isTooltipVisible, documentWidth } = this.state

    const isReflowActive = shouldReflow && documentWidth <= 460

    const getSelectLabel = () => (isReflowActive ? undefined : label)
    const getTooltipLabel = () => (isReflowActive ? label : helper?.label)
    const hasTooltipContent = () =>
      isReflowActive ? label !== undefined : helper !== undefined

    return (
      <div className={layouts['snackbar--medium']}>
        <div
          className={doClassnames([
            'checkbox',
            isBlocked && 'checkbox--blocked',
          ])}
          onMouseEnter={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
          }}
          onFocus={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
          }}
          onBlur={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
          }}
        >
          <div className="checkbox__slot">
            <input
              data-feature={feature}
              id={id}
              className="checkbox__box"
              type="checkbox"
              name={name}
              checked={isChecked}
              disabled={isDisabled || isBlocked}
              onChange={action}
              tabIndex={0}
              ref={this.inputRef}
              aria-label={label}
            />
            <div className="checkbox__box__background" />
            <div className="checkbox__box__tick" />
          </div>
          {getSelectLabel() !== undefined && (
            <label
              className={doClassnames([
                'checkbox__label',
                (isDisabled || isBlocked) && 'checkbox__label--disabled',
              ])}
              htmlFor={!(isDisabled || isBlocked) ? id : undefined}
            >
              {getSelectLabel()}
            </label>
          )}
          {isTooltipVisible && hasTooltipContent() && (
            <Tooltip
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {getTooltipLabel()}
            </Tooltip>
          )}
        </div>
        {this.Status('checkbox')}
      </div>
    )
  }

  RadioButton = () => {
    const {
      id,
      label,
      name,
      value,
      helper,
      feature,
      shouldReflow,
      isChecked,
      isDisabled,
      isBlocked,
      action,
    } = this.props
    const { isTooltipVisible, documentWidth } = this.state

    const isReflowActive = shouldReflow && documentWidth <= 460

    const getSelectLabel = () => (isReflowActive ? undefined : label)
    const getTooltipLabel = () => (isReflowActive ? label : helper?.label)
    const hasTooltipContent = () =>
      isReflowActive ? label !== undefined : helper !== undefined

    return (
      <div className={layouts['snackbar--medium']}>
        <div
          className={doClassnames(['radio', isBlocked && 'radio--blocked'])}
          onMouseEnter={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
          }}
          onFocus={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
          }}
          onBlur={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
          }}
        >
          <div className="radio__slot">
            <input
              data-feature={feature}
              id={id}
              className="radio__button"
              type="radio"
              name={name}
              value={value}
              checked={isChecked}
              disabled={isDisabled || isBlocked}
              onChange={action}
              tabIndex={0}
              ref={this.inputRef}
              aria-label={label}
            />
            <div className="radio__button__background" />
            <div className="radio__button__inner" />
          </div>
          {getSelectLabel() !== undefined && (
            <label
              className={doClassnames([
                'radio__label',
                (isDisabled || isBlocked) && 'radio__label--disabled',
              ])}
              htmlFor={!(isDisabled || isBlocked) ? id : undefined}
            >
              {getSelectLabel()}
            </label>
          )}

          {isTooltipVisible && hasTooltipContent() && (
            <Tooltip
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {getTooltipLabel()}
            </Tooltip>
          )}
        </div>
        {this.Status('radio')}
      </div>
    )
  }

  SwitchButton = () => {
    const {
      id,
      label,
      name,
      helper,
      feature,
      shouldReflow,
      isChecked,
      isDisabled,
      isBlocked,
      action,
    } = this.props
    const { isTooltipVisible, documentWidth } = this.state

    const isReflowActive = shouldReflow && documentWidth <= 460

    const getSelectLabel = () => (isReflowActive ? undefined : label)
    const getTooltipLabel = () => (isReflowActive ? label : helper?.label)
    const hasTooltipContent = () =>
      isReflowActive ? label !== undefined : helper !== undefined

    return (
      <div className={layouts['snackbar--medium']}>
        <div
          className={doClassnames(['switch', isBlocked && 'switch--blocked'])}
          onMouseEnter={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
          }}
          onFocus={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: true })
          }}
          onBlur={() => {
            if (hasTooltipContent()) this.setState({ isTooltipVisible: false })
          }}
        >
          <div className="switch__slot">
            <input
              data-feature={feature}
              id={id}
              className="switch__toggle"
              type="checkbox"
              role="switch"
              name={name}
              checked={isChecked}
              disabled={isDisabled || isBlocked}
              onChange={action}
              tabIndex={0}
              ref={this.inputRef}
              aria-label={label}
            />
            <div className="switch__toggle__background" />
            <div className="switch__toggle__knob" />
          </div>
          {getSelectLabel() !== undefined && (
            <label
              className={doClassnames([
                'switch__label',
                (isDisabled || isBlocked) && 'switch__label--disabled',
              ])}
              htmlFor={!(isDisabled || isBlocked) ? id : undefined}
            >
              {getSelectLabel()}
            </label>
          )}

          {isTooltipVisible && hasTooltipContent() && (
            <Tooltip
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {getTooltipLabel()}
            </Tooltip>
          )}
        </div>
        {this.Status('switch')}
      </div>
    )
  }

  // Render
  render() {
    const { type } = this.props

    if (type === 'RADIO_BUTTON') return this.RadioButton()
    if (type === 'SWITCH_BUTTON') return this.SwitchButton()
    return this.CheckBox()
  }
}
