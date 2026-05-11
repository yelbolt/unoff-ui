import React from 'react'
import { doClassnames, doMap, Easing } from '@unoff/utils'
import { doScale } from '@unoff/utils'
import IconChip from '@components/tags/icon-chip/IconChip'
import Chip from '@components/tags/chip/Chip'
import Knob from '@components/actions/knob/Knob'
import shiftRightStop from './actions/shiftRightStop'
import shiftLeftStop from './actions/shiftLeftStop'
import deleteStop from './actions/deleteStop'
import addStop from './actions/addStop'
import './multiple-slider.scss'

type UpdateEvent = 'TYPED' | 'UPDATING' | 'RELEASED' | 'SHIFTED'

interface SliderProps {
  /**
   * Type of slider interaction
   */
  type: 'EDIT' | 'FULLY_EDIT'
  /**
   * Scale mapping stop positions to values
   */
  scale: Record<string, number>
  /**
   * Easing function for distribution
   */
  distributionEasing: Easing
  /**
   * Stops configuration
   */
  stops: {
    /** List of stop positions */
    list: Array<number>
    /** Minimum allowed stop value */
    min?: number
    /** Maximum allowed stop value */
    max?: number
  }
  /**
   * Range constraints for values
   */
  range: {
    /** Minimum value */
    min: number
    /** Maximum value */
    max: number
    /** Step increment */
    step?: number
  }
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
   * Whether to show a progress bar between the first and last stop
   */
  hasProgressBar?: boolean
  /**
   * Whether to apply horizontal padding
   * @default true
   */
  hasPadding?: boolean
  /**
   * Tooltip configuration
   */
  tips: {
    /** Tooltip text for min/max values */
    minMax: string
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
   * Whether the slider is blocked
   */
  isBlocked?: boolean
  /**
   * Whether to show a "New" badge
   */
  isNew?: boolean
  /**
   * Change handler
   */
  onChange: (
    state: UpdateEvent,
    results: {
      scale: Record<string, number>
      stops?: Array<number>
      min?: number
      max?: number
    },
    feature?: string
  ) => void
  /**
   * Handler called instead of slider interaction when isBlocked is true
   */
  onBlock?: React.MouseEventHandler & React.KeyboardEventHandler
}

interface SliderState {
  isTooltipDisplay: Array<boolean>
  activeKnobId: string | null
}

export default class Slider extends React.Component<SliderProps, SliderState> {
  static defaultProps = {
    scale: {},
    stops: {
      list: [],
      min: 0,
      max: 100,
    },
    hasProgressBar: false,
    hasPadding: true,
    isBlocked: false,
    isNew: false,
  }

  constructor(props: SliderProps) {
    super(props)
    this.state = {
      isTooltipDisplay: Array(props.stops.list.length).fill(false),
      activeKnobId: null,
    }
  }

  // Handlers
  validHandler = (
    stopId: string,
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { scale, onChange, range } = this.props
    const step = range.step || 0.1

    const newScale = scale ?? {}
    const target = e.target as HTMLInputElement

    if (target.value !== '') {
      let value = parseFloat(target.value)

      value = Math.round(value / step) * step

      if (value > parseFloat(target.max)) value = parseFloat(target.max)
      else if (value < parseFloat(target.min)) value = parseFloat(target.min)

      const precision = step.toString().split('.')[1]?.length || 0
      newScale[stopId] = parseFloat(value.toFixed(precision))

      onChange('TYPED', {
        scale: newScale,
      })
    }
  }

  // Direct Actions
  onGrab = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    const stop = e.currentTarget as HTMLElement,
      range = stop.parentElement as HTMLElement,
      shift =
        e.clientX -
        (e.currentTarget as HTMLElement).getBoundingClientRect().left -
        (e.currentTarget as HTMLElement).getBoundingClientRect().width / 2,
      rangeRect = range.getBoundingClientRect(),
      rangeWidth = rangeRect.width as number,
      slider = range.parentElement as HTMLElement,
      stops = Array.from(
        range.children as HTMLCollectionOf<HTMLElement>
      ).filter((el) => el.dataset.id !== undefined)

    this.setState({
      activeKnobId: stop.dataset.id || null,
    })

    const update = (event: UpdateEvent) => {
      const { range, onChange } = this.props
      const scale: Record<string, number> = {}

      stops.forEach(
        (stop) =>
          (scale[stop.dataset.id as string] = parseFloat(
            doMap(
              parseFloat(stop.style.left.replace('%', '')),
              0,
              100,
              range.min,
              range.max
            ).toFixed(1)
          ))
      )
      onChange(event, {
        scale: scale,
      })
    }

    stop.style.zIndex = '2'

    document.onmousemove = (e) =>
      this.onSlide(
        e,
        slider,
        range,
        stops,
        stop,
        shift,
        rangeWidth,
        rangeRect,
        (event: UpdateEvent) => update(event)
      )

    document.onmouseup = () =>
      this.onRelease(stops, stop, (event: UpdateEvent) => update(event))
  }

  onSlide = (
    e: MouseEvent,
    _: HTMLElement,
    range: HTMLElement,
    stops: Array<HTMLElement>,
    stop: HTMLElement,
    shift: number,
    rangeWidth: number,
    rangeRect: DOMRect,
    update: (e: UpdateEvent) => void
  ) => {
    const { min, max, step = 0.1 } = this.props.range
    let offset = e.clientX - rangeRect.left - shift

    if (offset <= 0) offset = 0
    else if (offset >= rangeWidth) offset = rangeWidth

    // Distribute stops horizontal spacing
    if (stop === range.firstChild && e.shiftKey)
      return this.distributeStops(
        'MIN',
        parseFloat(doMap(offset, 0, rangeWidth, min, max).toFixed(1)),
        stops
      )
    else if (stop === range.lastChild && e.shiftKey)
      return this.distributeStops(
        'MAX',
        parseFloat(doMap(offset, 0, rangeWidth, min, max).toFixed(1)),
        stops
      )

    // Link every stop
    if (e.ctrlKey || e.metaKey)
      if (
        offset <
          stop.offsetLeft - (range.firstChild as HTMLElement).offsetLeft ||
        offset >
          rangeWidth -
            (range.lastChild as HTMLElement).offsetLeft +
            stop.offsetLeft
      )
        offset = stop.offsetLeft
      else
        return this.linkStops(
          parseFloat(doMap(offset, 0, rangeWidth, min, max).toFixed(1)),
          stop,
          stops
        )

    if (e.ctrlKey === false && e.metaKey === false && e.shiftKey === false)
      this.setState({
        isTooltipDisplay: Array(stops.length).fill(false),
      })

    const rawValue = doMap(offset, 0, rangeWidth, min, max)
    const steppedValue = Math.round(rawValue / step) * step
    const precision = step.toString().split('.')[1]?.length || 0

    if (step >= 1) {
      const currentValue = parseFloat(
        doMap(
          parseFloat(stop.style.left.replace('%', '')),
          0,
          100,
          min,
          max
        ).toFixed(precision)
      )
      const newValue = parseFloat(steppedValue.toFixed(precision))

      if (currentValue !== newValue) {
        const newPosition = doMap(steppedValue, min, max, 0, 100)
        stop.style.left = newPosition.toFixed(precision) + '%'

        requestAnimationFrame(() => {
          stop.focus()
        })

        update('UPDATING')
      }
    } else {
      const newPosition = doMap(steppedValue, min, max, 0, 100)
      stop.style.left = newPosition.toFixed(precision) + '%'

      requestAnimationFrame(() => {
        stop.focus()
      })

      update('UPDATING')
    }

    document.body.style.cursor = 'ew-resize'
  }

  onRelease = (
    stops: Array<HTMLElement>,
    stop: HTMLElement,
    update: (e: UpdateEvent) => void
  ) => {
    document.onmousemove = null
    document.onmouseup = null
    stop.onmouseup = null
    stop.style.zIndex = '1'

    this.setState({
      activeKnobId: null,
    })

    requestAnimationFrame(() => {
      stop.focus()
    })

    this.setState({
      isTooltipDisplay: Array(stops.length).fill(false),
    })

    update('RELEASED')
    document.body.style.cursor = ''
  }

  onAdd = (e: React.MouseEvent<HTMLDivElement>) => {
    const { scale, onChange } = this.props
    const { min, max } = this.props.range

    const results = addStop(e.nativeEvent, scale, min, max)
    onChange('SHIFTED', results, 'ADD_STOP')
  }

  onDelete = (knob: HTMLElement) => {
    const { scale, onChange } = this.props

    const results = deleteStop(scale, knob)
    onChange('SHIFTED', results, 'DELETE_STOP')
  }

  onShiftRight = (knob: HTMLElement, isShift: boolean) => {
    const { scale, onChange } = this.props
    const { min, max, step = 1 } = this.props.range

    const results = shiftRightStop(scale, knob, isShift, min, max, step)

    onChange('SHIFTED', results)

    requestAnimationFrame(() => {
      const sliderRange = knob.closest('.multiple-slider__range')
      if (sliderRange) {
        const updatedKnob = sliderRange.querySelector(
          `[data-id="${knob.dataset.id}"]`
        )
        if (updatedKnob instanceof HTMLElement) updatedKnob.focus()
      }
    })
  }

  onShiftLeft = (knob: HTMLElement, isShift: boolean) => {
    const { scale, onChange } = this.props
    const { min, max, step = 1 } = this.props.range

    const results = shiftLeftStop(scale, knob, isShift, min, max, step)

    onChange('SHIFTED', results)

    requestAnimationFrame(() => {
      const sliderRange = knob.closest('.multiple-slider__range')
      if (sliderRange) {
        const updatedKnob = sliderRange.querySelector(
          `[data-id="${knob.dataset.id}"]`
        )
        if (updatedKnob instanceof HTMLElement) updatedKnob.focus()
      }
    })
  }

  distributeStops = (
    type: string,
    value: number,
    stops: Array<HTMLElement>
  ) => {
    const { scale, distributionEasing, onChange, range } = this.props
    const { min, max, step = 0.1 } = range

    const steppedValue = Math.round(value / step) * step
    const precision = step.toString().split('.')[1]?.length || 0

    if (type === 'MIN')
      onChange('UPDATING', {
        scale: doScale(
          Object.entries(scale)
            .sort((a, b) => b[1] - a[1])
            .map((entry) => parseFloat(entry[0])),
          parseFloat(steppedValue.toFixed(precision)),
          Math.max(...Object.values(scale)) ?? max,
          distributionEasing
        ),
      })
    else if (type === 'MAX')
      onChange('UPDATING', {
        scale: doScale(
          Object.entries(scale)
            .sort((a, b) => b[1] - a[1])
            .map((entry) => parseFloat(entry[0])),
          Math.min(...Object.values(scale)) ?? min,
          parseFloat(steppedValue.toFixed(precision)),
          distributionEasing
        ),
      })

    this.setState({
      isTooltipDisplay: Array(stops.length).fill(true),
    })

    document.body.style.cursor = 'ew-resize'
  }

  linkStops = (value: number, src: HTMLElement, stops: Array<HTMLElement>) => {
    const { scale, onChange, range } = this.props
    const { step = 0.1 } = range
    const newScale: Record<string, number> = scale

    const steppedValue = Math.round(value / step) * step
    const precision = step.toString().split('.')[1]?.length || 0

    stops
      .filter((stop) => stop !== src)
      .forEach((stop) => {
        const delta =
          newScale[stop.dataset.id as string] -
          newScale[src.dataset.id as string] +
          steppedValue

        const steppedDelta = Math.round(delta / step) * step
        newScale[stop.dataset.id as string] = parseFloat(
          steppedDelta.toFixed(precision)
        )
      })

    newScale[src.dataset.id as string] = parseFloat(
      steppedValue.toFixed(precision)
    )

    this.setState({
      isTooltipDisplay: Array(stops.length).fill(true),
    })

    onChange('UPDATING', {
      scale: newScale,
    })
    document.body.style.cursor = 'ew-resize'
  }

  // Templates
  Progress = () => {
    const { scale, range, hasProgressBar } = this.props

    if (!hasProgressBar) return null

    const values = Object.values(scale).sort((a, b) => a - b)

    if (values.length < 2) return null

    const left = doMap(values[0], range.min, range.max, 0, 100)
    const right = doMap(values[values.length - 1], range.min, range.max, 0, 100)

    return (
      <div
        className="multiple-slider__progress"
        style={{ left: `${left}%`, width: `${right - left}%` }}
      />
    )
  }

  Status = () => {
    const { warning, isBlocked, isNew } = this.props

    if (warning || isBlocked || isNew)
      return (
        <div className="multiple-slider__status">
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

  Edit = () => {
    const { scale, range, colors, tips, isBlocked, onBlock } = this.props
    const { isTooltipDisplay } = this.state

    return (
      <div
        className={doClassnames([
          'multiple-slider__range',
        ])}
        style={{
          background:
            colors !== undefined
              ? `linear-gradient(90deg, ${colors.min}, ${colors.max})`
              : undefined,
        }}
        role="presentation"
        onMouseDown={undefined}
      >
        <this.Progress />
        {Object.entries(scale)
          .sort((a, b) => a[1] - b[1])
          .map((item, index, original) => (
            <Knob
              key={item[0]}
              id={item[0]}
              shortId={item[0]}
              value={item[1]}
              offset={doMap(item[1], range.min, range.max, 0, 100)}
              min={range.min.toString()}
              max={range.max.toString()}
              helper={
                index === 0 || index === original.length - 1
                  ? {
                      label: tips.minMax,
                      type: 'MULTI_LINE',
                    }
                  : undefined
              }
              canBeTyped
              isDisplayed={isTooltipDisplay[index]}
              isBlocked={isBlocked}
              onBlock={onBlock}
              style={{
                pointerEvents:
                  this.state.activeKnobId &&
                  this.state.activeKnobId !== item[0]
                    ? 'none'
                    : 'auto',
              }}
              onShiftRight={(e: React.KeyboardEvent<HTMLInputElement>) => {
                this.onShiftRight(e.target as HTMLElement, e.shiftKey)
              }}
              onShiftLeft={(e: React.KeyboardEvent<HTMLInputElement>) => {
                this.onShiftLeft(e.target as HTMLElement, e.shiftKey)
              }}
              onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
                this.onGrab(e)
                ;(e.target as HTMLElement).focus()
              }}
              onValidStopValue={(stopId, e) => this.validHandler(stopId, e)}
              aria-valuenow={item[1]}
            />
          ))}
      </div>
    )
  }

  FullyEdit = () => {
    const { scale, stops, range, colors, tips, isBlocked, onBlock } = this.props
    const { isTooltipDisplay } = this.state

    return (
      <div
        className={doClassnames([
          'multiple-slider__range',
          stops.list.length < (stops.max ?? Infinity) &&
            'multiple-slider__range--add',
          stops.list.length === (stops.max ?? Infinity) &&
            'multiple-slider__range--not-allowed',
        ])}
        style={{
          background:
            colors !== undefined
              ? `linear-gradient(90deg, ${colors.min}, ${colors.max})`
              : undefined,
        }}
        onMouseDown={(e) => {
          if (stops.list.length < (stops.max ?? Infinity)) this.onAdd(e)
        }}
      >
        <this.Progress />
        {Object.entries(scale)
          .sort((a, b) => a[1] - b[1])
          .map((item, index, original) => (
            <Knob
              key={item[0]}
              id={item[0]}
              shortId={item[0]}
              value={item[1]}
              offset={doMap(item[1], range.min, range.max, 0, 100)}
              min={range.min.toString()}
              max={range.max.toString()}
              helper={
                index === 0 || index === original.length - 1
                  ? {
                      label: tips.minMax,
                      type: 'MULTI_LINE',
                    }
                  : undefined
              }
              canBeTyped
              isDisplayed={isTooltipDisplay[index]}
              isBlocked={isBlocked}
              onBlock={onBlock}
              style={{
                pointerEvents:
                  this.state.activeKnobId &&
                  this.state.activeKnobId !== item[0]
                    ? 'none'
                    : 'auto',
              }}
              onShiftRight={(e: React.KeyboardEvent<HTMLInputElement>) => {
                this.onShiftRight(e.target as HTMLElement, e.shiftKey)
              }}
              onShiftLeft={(e: React.KeyboardEvent<HTMLInputElement>) => {
                this.onShiftLeft(e.target as HTMLElement, e.shiftKey)
              }}
              onDelete={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (stops.list.length > (stops.min ?? Infinity))
                  this.onDelete(e.target as HTMLElement)
              }}
              onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
                this.onGrab(e)
                ;(e.target as HTMLElement).focus()
              }}
              onValidStopValue={(stopId, e) => this.validHandler(stopId, e)}
              aria-valuenow={item[1]}
            />
          ))}
      </div>
    )
  }

  // Render
  render() {
    const { type, hasPadding } = this.props

    return (
      <div
        className={doClassnames([
          'multiple-slider',
          !hasPadding && 'multiple-slider--no-padding',
        ])}
      >
        {type === 'EDIT' && <this.Edit />}
        {type === 'FULLY_EDIT' && <this.FullyEdit />}
        {this.Status()}
      </div>
    )
  }
}
