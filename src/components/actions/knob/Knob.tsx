import React from 'react'
import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import Tooltip from '@components/tags/tooltip/Tooltip'
import Input from '@components/inputs/input/Input'
import './knob.scss'

export interface KnobProps {
  /**
   * Unique identifier for the knob
   */
  id: string
  /**
   * Short identifier for the knob
   */
  shortId: string
  /**
   * Current value of the knob
   */
  value: string | number
  /**
   * Offset position for the knob display
   */
  offset: number
  /**
   * Minimum allowed value
   */
  min?: string
  /**
   * Maximum allowed value
   */
  max?: string
  /**
   * Helper tooltip configuration
   */
  helper?: {
    /** Tooltip content */
    label: string | React.ReactNode
    /** Tooltip display type */
    type: 'MULTI_LINE' | 'SINGLE_LINE' | 'WITH_IMAGE'
  }
  /**
   * Whether the value can be edited by typing
   */
  canBeTyped: boolean
  /**
   * Whether the knob is visible
   */
  isDisplayed: boolean
  /**
   * Whether the knob is blocked
   * @default false
   */
  isBlocked: boolean
  /**
   * Whether the knob is disabled
   * @default false
   */
  isDisabled: boolean
  /**
   * Custom inline styles
   */
  style?: React.CSSProperties
  /**
   * Handler for right arrow key
   */
  onShiftRight?: React.KeyboardEventHandler<HTMLInputElement>
  /**
   * Handler for left arrow key
   */
  onShiftLeft?: React.KeyboardEventHandler<HTMLInputElement>
  /**
   * Handler for delete key
   */
  onDelete?: React.KeyboardEventHandler<HTMLInputElement>
  /**
   * Mouse down handler for dragging
   */
  onMouseDown: React.MouseEventHandler<HTMLDivElement>
  /**
   * Handler called instead of onMouseDown when isBlocked is true
   */
  onBlock?: React.MouseEventHandler<HTMLDivElement>
  /**
   * Callback when value is validated
   */
  onValidStopValue?: (
    stopId: string,
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void
}

export interface KnobState {
  isStopInputOpen: boolean
  isTooltipOpen: boolean
  stopInputValue: string | number
}

export default class Knob extends React.Component<KnobProps, KnobState> {
  static defaultProps: Partial<KnobProps> = {
    isBlocked: false,
    isDisabled: false,
  }

  knobRef: React.RefObject<HTMLDivElement> = React.createRef()

  constructor(props: KnobProps) {
    super(props)
    this.state = {
      isStopInputOpen: false,
      isTooltipOpen: false,
      stopInputValue: props.value,
    }
  }

  // Handlers
  keyboardHandler = (
    action: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const {
      value,
      canBeTyped,
      isBlocked,
      onShiftRight,
      onShiftLeft,
      onDelete,
      onBlock,
    } = this.props

    if (isBlocked)
      return onBlock?.(
        e as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>
      )

    const actions = {
      ArrowRight: () => {
        if (onShiftRight !== undefined) onShiftRight(e)
      },
      ArrowLeft: () => {
        if (onShiftLeft !== undefined) onShiftLeft(e)
      },
      Enter: () => {
        if (canBeTyped)
          this.setState({
            isStopInputOpen: true,
            isTooltipOpen: false,
            stopInputValue: value,
          })
      },
      Escape: () => {
        (e.target as HTMLElement).blur()
        this.setState({ isStopInputOpen: false })
      },
      Backspace: () => {
        if (onDelete !== undefined) onDelete(e)
      },
    }

    if (e.currentTarget === e.target)
      return actions[
        action as 'ArrowRight' | 'ArrowLeft' | 'Enter' | 'Escape' | 'Backspace'
      ]?.()
  }

  clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const { canBeTyped, value, isBlocked, onBlock } = this.props

    if (isBlocked) return onBlock?.(e)

    if (e.detail === 2 && canBeTyped)
      this.setState({
        isStopInputOpen: true,
        isTooltipOpen: false,
        stopInputValue: value,
      })
  }

  transformStopValue = (value: string | number) => {
    let newValue = value
    if (typeof newValue !== 'string') newValue = newValue.toFixed(1)
    if (newValue.includes('.0')) return (newValue = newValue.replace('.0', ''))
    return newValue
  }

  // Render
  render() {
    const {
      id,
      shortId,
      value,
      min,
      max,
      offset,
      helper,
      style,
      isDisplayed,
      isBlocked,
      isDisabled,
      onMouseDown,
      onBlock,
      onValidStopValue,
    } = this.props
    const { isTooltipOpen, isStopInputOpen, stopInputValue } = this.state

    return (
      <div
        className={doClassnames([
          'knob',
          isStopInputOpen && 'knob--editing',
          isDisabled && 'knob--disabled',
        ])}
        ref={this.knobRef}
        style={{
          left: `${offset}%`,
          zIndex: isTooltipOpen ? '2' : '1',
          ...style,
        }}
        data-id={id}
        data-value={value}
        role="slider"
        aria-label={`${shortId} knob, value ${this.transformStopValue(value)}`}
        aria-valuemin={min ? parseFloat(min) : undefined}
        aria-valuemax={max ? parseFloat(max) : undefined}
        aria-valuenow={typeof value === 'number' ? value : parseFloat(value)}
        aria-valuetext={this.transformStopValue(value).toString()}
        aria-disabled={isDisabled || isBlocked}
        tabIndex={!(isBlocked || isDisabled) ? 0 : -1}
        onKeyDown={(e) =>
          !isDisabled
            ? this.keyboardHandler(
                e.key,
                e as React.KeyboardEvent<HTMLInputElement>
              )
            : undefined
        }
        onMouseDown={
          !isDisabled ? (isBlocked ? onBlock : onMouseDown) : undefined
        }
        onMouseEnter={() =>
          !(isDisabled || isStopInputOpen)
            ? this.setState({ isTooltipOpen: true })
            : undefined
        }
        onMouseLeave={(e) => {
          const isFocused = document.activeElement === e.target
          if (isFocused && !isDisabled) this.setState({ isTooltipOpen: true })
          else this.setState({ isTooltipOpen: false })
        }}
        onFocus={() =>
          !isDisabled ? this.setState({ isTooltipOpen: true }) : undefined
        }
        onBlur={() =>
          !isDisabled ? this.setState({ isTooltipOpen: false }) : undefined
        }
        onClick={(e) => (!isDisabled ? this.clickHandler(e) : undefined)}
      >
        {(isDisplayed || isTooltipOpen) && (
          <div
            className={doClassnames(['knob__tooltip'])}
            role="status"
          >
            <span
              className={doClassnames([texts.type, texts['type--inverse']])}
            >
              {this.transformStopValue(value)}
            </span>
          </div>
        )}
        {isStopInputOpen && (
          <div
            className="knob__input"
            role="group"
          >
            <Input
              type="NUMBER"
              value={(stopInputValue as number).toFixed(1) ?? '0'}
              min={min}
              max={max}
              step="0.1"
              feature="TYPE_STOP_VALUE"
              shouldBlur={true}
              isAutoFocus={true}
              isFlex={true}
              onFocus={() =>
                this.setState({
                  stopInputValue: value,
                })
              }
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                if ((e.target as HTMLInputElement)?.value !== value)
                  onValidStopValue?.(shortId, e)
                this.setState({ isStopInputOpen: false })
              }}
            />
          </div>
        )}
        <div
          className={doClassnames(['knob__label'])}
          role="presentation"
          aria-hidden="true"
        >
          <span className={doClassnames([texts.type])}>{shortId}</span>
        </div>
        <div
          className="knob__graduation"
          role="presentation"
          aria-hidden="true"
        ></div>
        {helper !== undefined && isTooltipOpen && (
          <Tooltip
            anchor={this.knobRef}
            type={helper.type}
          >
            {helper.label}
          </Tooltip>
        )}
      </div>
    )
  }
}
