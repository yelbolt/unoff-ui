import React from 'react'
import { doClassnames, doMap } from '@unoff/utils'
import IconChip from '@components/tags/icon-chip/IconChip'
import Chip from '@components/tags/chip/Chip'
import Knob from '@components/actions/knob/Knob'
import './simple-slider.scss'

export interface SimpleSliderProps {
  /**
   * Unique identifier for the slider
   */
  id: string
  /**
   * Label text for the slider
   */
  label: string
  /**
   * Current value
   */
  value: number
  /**
   * Minimum allowed value
   */
  min: number
  /**
   * Maximum allowed value
   */
  max: number
  /**
   * Step increment
   * @default 1
   */
  step?: number
  /**
   * Colors for gradient display
   */
  colors?: {
    /** Start color */
    min: string
    /** End color */
    max: string
  }
  /**
   * Whether to show a progress bar from the start to the current value
   * @default false
   */
  hasProgressBar?: boolean
  /**
   * Whether to apply horizontal padding
   * @default true
   */
  hasPadding?: boolean
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
  feature: string
  /**
   * Whether the slider is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether the slider is disabled
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Change handler
   */
  onChange: (feature: string, state: string, value: number) => void
  /**
   * Handler called instead of slider interaction when isBlocked is true
   */
  onBlock?: React.MouseEventHandler & React.KeyboardEventHandler
}

export interface SimpleSliderState {
  isTooltipDisplay: boolean
}

export default class SimpleSlider extends React.Component<
  SimpleSliderProps,
  SimpleSliderState
> {
  private value: number

  static defaultProps: Partial<SimpleSliderProps> = {
    hasProgressBar: false,
    hasPadding: true,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
    step: 1,
  }

  constructor(props: SimpleSliderProps) {
    super(props)
    this.state = {
      isTooltipDisplay: false,
    }
    this.value = props.value
  }

  componentDidUpdate = (previousProps: Readonly<SimpleSliderProps>) => {
    const { value } = this.props

    if (previousProps.value !== value) this.value = value
  }

  // Handlers
  validHandler = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { min, max, feature, onChange, step = 1 } = this.props
    const target = e.target as HTMLInputElement
    if (target.value !== '') {
      const parsedValue = parseFloat(target.value)
      if (parsedValue < min) onChange(feature, 'TYPED', min)
      else if (parsedValue > max) onChange(feature, 'TYPED', max)
      else {
        const roundedValue = this.roundToStep(parsedValue, step)
        onChange(feature, 'TYPED', roundedValue)
      }
    }
  }

  // Direct Actions
  onGrab = (e: React.MouseEvent<HTMLElement>) => {
    const stop = e.currentTarget as HTMLElement,
      range = stop.parentElement as HTMLElement,
      shift =
        e.clientX -
        stop.getBoundingClientRect().left -
        stop.getBoundingClientRect().width / 2,
      rangeRect = range.getBoundingClientRect(),
      rangeWidth = rangeRect.width as number,
      slider = range.parentElement as HTMLElement

    stop.style.zIndex = '2'

    document.onmousemove = (e) =>
      this.onSlide(e, slider, stop, shift, rangeWidth, rangeRect)

    document.onmouseup = () => this.onRelease(stop)
  }

  roundToStep = (value: number, step: number): number => {
    return Math.round(value / step) * step
  }

  onSlide = (
    e: MouseEvent,
    _: HTMLElement,
    stop: HTMLElement,
    shift: number,
    rangeWidth: number,
    rangeRect: DOMRect
  ) => {
    const { min, max, feature, onChange, step = 1 } = this.props
    let offset = e.clientX - rangeRect.left - shift

    const limitMin = 0
    const limitMax = rangeWidth

    if (offset <= limitMin) offset = limitMin
    else if (offset >= limitMax) offset = limitMax

    const rawValue = doMap(offset, 0, rangeWidth, min, max)

    if (step >= 1) {
      const newValue = this.roundToStep(rawValue, step)
      const clampedValue = Math.max(min, Math.min(max, newValue))

      if (this.value !== clampedValue) {
        this.value = clampedValue

        const snappedPosition = doMap(this.value, min, max, 0, 100)
        stop.style.left = snappedPosition.toFixed(1) + '%'

        this.setState({
          isTooltipDisplay: true,
        })

        onChange(feature, 'UPDATING', this.value)
      }
    } else {
      this.value = rawValue

      if (this.value < min) this.value = min
      if (this.value > max) this.value = max

      stop.style.left = doMap(offset, 0, rangeWidth, 0, 100).toFixed(1) + '%'

      this.setState({
        isTooltipDisplay: true,
      })

      onChange(feature, 'UPDATING', this.value)
    }

    document.body.style.cursor = 'ew-resize'
  }

  onRelease = (stop: HTMLElement) => {
    const { feature, onChange, step = 1 } = this.props

    document.onmousemove = null
    document.onmouseup = null
    stop.onmouseup = null
    stop.style.zIndex = '1'

    this.value = this.roundToStep(this.value, step)

    this.setState({
      isTooltipDisplay: false,
    })

    onChange(feature, 'RELEASED', this.value)
    document.body.style.cursor = ''
  }

  // Templates
  Progress = () => {
    const { value, min, max, hasProgressBar } = this.props

    if (!hasProgressBar) return null

    return (
      <div
        className="simple-slider__progress"
        style={{ width: `${doMap(value, min, max, 0, 100)}%` }}
      />
    )
  }

  Status = () => {
    const { warning, isBlocked, isNew } = this.props

    if (warning || isBlocked || isNew)
      return (
        <div className="simple-slider__status">
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
            <Chip isSolo>
              {isNew ? 'New' : 'Pro'}
            </Chip>
          )}
        </div>
      )
  }

  // Render
  render() {
    const {
      id,
      label,
      value,
      min,
      max,
      colors,
      feature,
      hasPadding,
      isBlocked,
      isDisabled,
      onChange,
      onBlock,
    } = this.props
    const { isTooltipDisplay } = this.state

    return (
      <div
        className={doClassnames([
          'simple-slider',
          !hasPadding && 'simple-slider--no-padding',
        ])}
        role="group"
        aria-label={label}
      >
        <div
          className="simple-slider__range"
          role="presentation"
          style={{
            background:
              colors !== undefined
                ? `linear-gradient(90deg, ${colors.min}, ${colors.max})`
                : undefined,
          }}
          onMouseDown={undefined}
        >
          <this.Progress />
          <Knob
            id={id}
            shortId={label}
            value={value}
            offset={doMap(value, min, max, 0, 100)}
            min={min.toString()}
            max={max.toString()}
            canBeTyped={true}
            isDisplayed={isTooltipDisplay}
            isBlocked={isBlocked}
            isDisabled={isDisabled}
            onBlock={onBlock}
            onShiftRight={(e) => {
              const { step = 1 } = this.props
              if (e.shiftKey) {
                const newValue = this.roundToStep(value + step * 10, step)
                onChange(feature, 'SHIFTED', newValue > max ? max : newValue)
              } else {
                const newValue = this.roundToStep(value + step, step)
                onChange(feature, 'SHIFTED', newValue > max ? max : newValue)
              }
            }}
            onShiftLeft={(e) => {
              const { step = 1 } = this.props
              if (e.shiftKey) {
                const newValue = this.roundToStep(value - step * 10, step)
                onChange(feature, 'SHIFTED', newValue < min ? min : newValue)
              } else {
                const newValue = this.roundToStep(value - step, step)
                onChange(feature, 'SHIFTED', newValue < min ? min : newValue)
              }
            }}
            onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
              this.onGrab(e)
              ;(e.target as HTMLElement).focus()
            }}
            onValidStopValue={(_stopId, e) => this.validHandler(e)}
          />
        </div>
        {this.Status()}
      </div>
    )
  }
}
