import React from 'react'
import { doClassnames } from '@unoff/utils'
import Tooltip from '@components/tags/tooltip/Tooltip'
import IconChip from '@components/tags/icon-chip/IconChip'
import Chip from '@components/tags/chip/Chip'
import Icon from '@components/assets/icon/Icon'
import Button from '@components/actions/button/Button'
import type { IconList } from '@tps/icon.types'
import './input.scss'

export interface InputProps {
  /**
   * HTML id attribute
   */
  id?: string
  /**
   * Type of input
   */
  type: 'NUMBER' | 'COLOR' | 'TEXT' | 'LONG_TEXT' | 'CODE'
  /**
   * Icon configuration to display in the input
   */
  icon?: { type: 'LETTER' | 'PICTO'; value: IconList }
  /**
   * Unit suffix to display (% or °)
   */
  unit?: '%' | '°'
  /**
   * Visual state of the input
   * @default 'DEFAULT'
   */
  state?: 'DEFAULT' | 'ERROR'
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Current value of the input
   */
  value: string
  /**
   * Maximum number of characters allowed
   */
  charactersLimit?: number
  /**
   * Minimum value (for NUMBER type)
   */
  min?: string
  /**
   * Maximum value (for NUMBER type)
   */
  max?: string
  /**
   * Step value (for NUMBER type)
   */
  step?: string
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
   * Whether to blur the input after interaction
   */
  shouldBlur?: boolean
  /**
   * Whether to auto-focus on mount
   */
  isAutoFocus?: boolean
  /**
   * Whether the textarea should grow with content
   */
  isGrowing?: boolean
  /**
   * Whether to use flex layout
   */
  isFlex?: boolean
  /**
   * Whether to show a clear button
   */
  isClearable?: boolean
  /**
   * Whether to show a frame border
   */
  isFramed?: boolean
  /**
   * Whether the input can be empty
   */
  canBeEmpty?: boolean
  /**
   * Whether the input is blocked
   */
  isBlocked?: boolean
  /**
   * Whether the input is disabled
   */
  isDisabled?: boolean
  /**
   * Whether to show a "New" badge
   */
  isNew?: boolean
  /**
   * Change event handler
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Focus event handler
   */
  onFocus?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Blur event handler
   */
  onBlur?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Keyboard shift handler
   */
  onShift?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Clear button handler
   */
  onClear?: (value: string) => void
  /**
   * Slider change handler (for NUMBER type)
   */
  onSlide?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Validation handler
   */
  onValid?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Color picker handler (for COLOR type)
   */
  onPick?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Handler called when unblock is clicked
   */
  onUnblock?: React.MouseEventHandler & React.KeyboardEventHandler
}

export interface InputState {
  inputValue: string
  lastValidValue: string
  lastValidColorValue: string
  colorValue: string
  isTooltipVisible: boolean
}

export default class Input extends React.Component<InputProps, InputState> {
  inputRef: React.RefObject<HTMLInputElement>
  textareaRef: React.RefObject<HTMLTextAreaElement>
  wrapperRef: React.RefObject<HTMLDivElement>

  static defaultProps: Partial<InputProps> = {
    icon: undefined,
    state: 'DEFAULT',
    step: '1',
    shouldBlur: false,
    isClearable: false,
    isFramed: true,
    canBeEmpty: true,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
    isAutoFocus: false,
    isGrowing: false,
    isFlex: false,
  }

  constructor(props: InputProps) {
    super(props)
    this.state = {
      inputValue: props.value,
      lastValidValue: props.value,
      colorValue: props.value,
      lastValidColorValue: props.value,
      isTooltipVisible: false,
    }
    this.inputRef = React.createRef()
    this.textareaRef = React.createRef()
    this.wrapperRef = React.createRef()
  }

  // Lifecycle
  componentDidMount(): void {
    const { isGrowing } = this.props

    if (this.textareaRef.current) {
      this.textareaRef.current.style.height = 'auto'
      if (isGrowing)
        this.textareaRef.current.style.height = `${this.textareaRef.current.scrollHeight + 2}px`
    }
    const { isAutoFocus } = this.props
    if (isAutoFocus)
      setTimeout(() => {
        if (this.inputRef.current) this.inputRef.current.focus()
        else if (this.textareaRef.current) this.textareaRef.current.focus()
      }, 1)
  }

  componentDidUpdate(prevProps: InputProps) {
    const { value, isGrowing } = this.props

    if (prevProps.value !== value)
      this.setState({
        inputValue: value,
        colorValue: value,
      })

    if (prevProps.type === 'CODE' && this.textareaRef.current !== null)
      this.textareaRef.current.scrollTop = 0
    if (this.textareaRef.current) {
      this.textareaRef.current.style.height = 'auto'
      if (isGrowing)
        this.textareaRef.current.style.height = `${this.textareaRef.current.scrollHeight + 2}px`
    }
  }

  // Handlers
  onPickColorValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onPick } = this.props
    const value = e.target.value

    this.setState({
      inputValue: value,
      colorValue: value,
    })

    if (onPick) onPick(e)
  }

  onChangeColorValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onChange } = this.props

    this.setState({
      inputValue: e.target.value,
    })
    if (onChange) onChange(e)
  }

  onChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onChange } = this.props

    this.setState({
      inputValue: e.target.value,
    })
    if (onChange) onChange(e)
  }

  onChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onChange } = this.props

    this.setState({
      inputValue: e.target.value,
    })
    if (onChange) onChange(e)
  }

  onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, onFocus, canBeEmpty, type } = this.props

    const shouldPreventEvent =
      (type === 'TEXT' || type === 'LONG_TEXT') &&
      !canBeEmpty &&
      value.trim() === ''

    if (onFocus && !shouldPreventEvent) onFocus(e)
  }

  onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { shouldBlur, onBlur, canBeEmpty, type, min, max } = this.props
    const { inputValue, lastValidValue, lastValidColorValue } = this.state

    if (type === 'NUMBER') {
      const isEmpty = inputValue.trim() === ''
      let transformedValue

      if (parseFloat(inputValue) < parseFloat(min ?? '0'))
        transformedValue = min ?? '0'
      else if (parseFloat(inputValue) > parseFloat(max ?? '100'))
        transformedValue = max ?? '100'
      else if (isEmpty) {
        transformedValue = lastValidValue
        this.setState({
          inputValue: transformedValue,
        })
      } else transformedValue = inputValue

      this.setState({
        inputValue: transformedValue ?? inputValue,
        lastValidValue: transformedValue ?? inputValue,
      })

      if (
        (transformedValue !== lastValidValue && onBlur) ||
        (shouldBlur && onBlur)
      ) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: transformedValue,
            closest: e.target.closest?.bind(e.target),
            getAttribute: e.target.getAttribute?.bind(e.target),
            querySelector: e.target.querySelector?.bind(e.target),
            querySelectorAll: e.target.querySelectorAll?.bind(e.target),
            matches: e.target.matches?.bind(e.target),
            contains: e.target.contains?.bind(e.target),
            classList: e.target.classList,
            dataset: e.target.dataset,
          },
          currentTarget: {
            ...e.currentTarget,
            value: transformedValue,
            closest: e.currentTarget.closest?.bind(e.currentTarget),
            getAttribute: e.currentTarget.getAttribute?.bind(e.currentTarget),
            querySelector: e.currentTarget.querySelector?.bind(e.currentTarget),
            querySelectorAll: e.currentTarget.querySelectorAll?.bind(
              e.currentTarget
            ),
            matches: e.currentTarget.matches?.bind(e.currentTarget),
            contains: e.currentTarget.contains?.bind(e.currentTarget),
            classList: e.currentTarget.classList,
            dataset: e.currentTarget.dataset,
          },
        }

        onBlur(
          syntheticEvent as React.FocusEvent<
            HTMLInputElement | HTMLTextAreaElement
          >
        )

        return
      }
    }

    if (type === 'COLOR') {
      const transformedValue = this.transformColorCode(e.target.value)

      this.setState({
        inputValue: transformedValue,
        colorValue: transformedValue,
        lastValidColorValue: transformedValue,
      })

      if (
        transformedValue.toLowerCase() !== lastValidColorValue.toLowerCase() &&
        onBlur !== undefined
      ) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: transformedValue,
            closest: e.target.closest?.bind(e.target),
            getAttribute: e.target.getAttribute?.bind(e.target),
            querySelector: e.target.querySelector?.bind(e.target),
            querySelectorAll: e.target.querySelectorAll?.bind(e.target),
            matches: e.target.matches?.bind(e.target),
            contains: e.target.contains?.bind(e.target),
            classList: e.target.classList,
            dataset: e.target.dataset,
          },
          currentTarget: {
            ...e.currentTarget,
            value: transformedValue,
            closest: e.currentTarget.closest?.bind(e.currentTarget),
            getAttribute: e.currentTarget.getAttribute?.bind(e.currentTarget),
            querySelector: e.currentTarget.querySelector?.bind(e.currentTarget),
            querySelectorAll: e.currentTarget.querySelectorAll?.bind(
              e.currentTarget
            ),
            matches: e.currentTarget.matches?.bind(e.currentTarget),
            contains: e.currentTarget.contains?.bind(e.currentTarget),
            classList: e.currentTarget.classList,
            dataset: e.currentTarget.dataset,
          },
        }

        onBlur(
          syntheticEvent as React.FocusEvent<
            HTMLInputElement | HTMLTextAreaElement
          >
        )

        return
      }
    }

    if (type === 'TEXT' || type === 'LONG_TEXT') {
      const isEmpty = inputValue.trim() === ''
      const shouldPreventEvent =
        (type === 'TEXT' || type === 'LONG_TEXT') && !canBeEmpty && isEmpty

      if (shouldPreventEvent) {
        this.setState({
          inputValue: lastValidValue,
        })
        return
      }

      this.setState({
        lastValidValue: inputValue,
      })

      if ((inputValue !== lastValidValue && onBlur) || (shouldBlur && onBlur)) {
        onBlur(e)

        return
      }
    }
  }

  // Direct Actions
  onValidText = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onValid } = this.props
    const target = e.target as HTMLInputElement

    if (e.key === 'Enter') {
      if (onValid !== undefined) onValid(e)
      target.blur()
    } else if (e.key === 'Escape') target.blur()
  }

  onValidLongText = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onValid } = this.props
    const target = e.target as HTMLInputElement

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (onValid !== undefined) onValid(e)
      target.blur()
    } else if (e.key === 'Escape') target.blur()
  }

  onValidNumber = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { min, max, step, onShift } = this.props
    const { inputValue } = this.state
    const target = e.target as HTMLInputElement

    let nudge = 0

    if (e.key === 'ArrowUp') {
      if (e.shiftKey) nudge = 9
      const v =
        parseFloat(inputValue) + nudge < parseFloat(max ?? '100')
          ? (
              parseFloat(inputValue) +
              nudge * parseFloat(step === undefined ? '1' : step)
            ).toString()
          : (max ?? '100')

      this.setState({
        inputValue: v,
        lastValidValue: v,
      })
      if (parseFloat(inputValue) + nudge < parseFloat(max ?? '100'))
        onShift?.(e)
    } else if (e.key === 'ArrowDown') {
      if (e.shiftKey) nudge = 9
      const v =
        parseFloat(inputValue) - nudge > parseFloat(min ?? '0')
          ? (
              parseFloat(inputValue) -
              nudge * parseFloat(step === undefined ? '1' : step)
            ).toString()
          : (min ?? '0')
      this.setState({
        inputValue: v,
        lastValidValue: v,
      })
      if (parseFloat(inputValue) - nudge > parseFloat(min ?? '0')) onShift?.(e)
    } else if (e.key === 'Enter' || e.key === 'Escape') {
      if (parseFloat(inputValue) < parseFloat(min ?? '0'))
        this.setState({
          inputValue: min ?? '0',
        })
      else if (parseFloat(inputValue) > parseFloat(max ?? '100'))
        this.setState({
          inputValue: max ?? '100',
        })

      target.blur()
    }
  }

  onValidColor = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onValid } = this.props
    const target = e.target as HTMLInputElement

    if (e.key === 'Enter') {
      if (onValid !== undefined) onValid(e)
      target.blur()
    } else if (e.key === 'Escape') target.blur()
  }

  doClear = () => this.setState({ inputValue: '' })

  onGrab = () => {
    if (this.inputRef.current) this.inputRef.current.focus()
    document.addEventListener('mousemove', this.onDrag)
  }

  onDrag = (e: MouseEvent) => {
    if (this.inputRef.current) this.inputRef.current.focus()
    const { min, max, onSlide } = this.props
    const { inputValue } = this.state

    const nMin = parseFloat(min ?? '0')
    const nMax = parseFloat(max ?? '100')
    const nValue = parseFloat(inputValue)
    const delta = nValue + e.movementX

    if (delta >= nMin && delta <= nMax) {
      this.setState({
        inputValue: delta.toString(),
      })
      if (this.inputRef.current) {
        const event = new Event('input', { bubbles: true })
        Object.defineProperty(event, 'target', {
          value: this.inputRef.current,
          enumerable: true,
        })
        Object.defineProperty(event, 'currentTarget', {
          value: this.inputRef.current,
          enumerable: true,
        })
        onSlide?.(event as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    }

    document.body.style.setProperty('cursor', 'ew-resize', 'important')
    this.inputRef.current?.style.setProperty('cursor', 'ew-resize', 'important')
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.onDrag)
      document.body.style.cursor = ''
      if (this.inputRef.current) this.inputRef.current.style.cursor = ''
    })
  }

  transformColorCode = (colorCode: string): string => {
    const { lastValidColorValue } = this.state

    const inputWithoutHash = colorCode.startsWith('#')
      ? colorCode.substring(1)
      : colorCode

    const validChars = inputWithoutHash
      .toLowerCase()
      .split('')
      .filter((char) => /[0-9a-f]/i.test(char))

    if (validChars.length === 0) return lastValidColorValue

    if (validChars.length >= 6) return `#${validChars.slice(0, 6).join('')}`

    let result = ''

    switch (validChars.length) {
      case 1:
        result = validChars[0].repeat(6)
        break

      case 2:
        result = `${validChars.join('')}`.repeat(3)
        break

      case 3:
        result = `${validChars[0]}${validChars[0]}${validChars[1]}${validChars[1]}${validChars[2]}${validChars[2]}`
        break

      case 4:
        result = `${validChars[0]}${validChars[0]}${validChars[1]}${validChars[1]}${validChars[2]}${validChars[2]}`
        break

      case 5:
        result = `${validChars[0]}${validChars[0]}${validChars[1]}${validChars[1]}${validChars[2]}${validChars[2]}`
        break

      default:
        result = validChars.slice(0, 6).join('')
    }

    result.indexOf('#') !== 0 && (result = `#${result}`)

    return result.toLowerCase()
  }

  // Templates
  Status = () => {
    const { warning, preview, isBlocked, isNew, onUnblock } = this.props

    if (warning || isBlocked || isNew)
      return (
        <div className="input__status">
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

  Color = () => {
    const { id, feature, helper, isBlocked, isDisabled } = this.props
    const { inputValue, colorValue, isTooltipVisible } = this.state

    return (
      <div
        className={doClassnames([
          'input',
          'input--color',
          'input--with-color',
          isBlocked && 'input--blocked',
        ])}
        role="group"
      >
        <div
          className="input__wrapper"
          ref={this.wrapperRef}
          onMouseEnter={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
        >
          <input
            id={id}
            data-feature={feature}
            type="color"
            className="input__color"
            value={colorValue}
            disabled={isDisabled || isBlocked}
            aria-label="Color picker"
            aria-disabled={isDisabled || isBlocked}
            onChange={
              !(isDisabled || isBlocked) ? this.onPickColorValue : undefined
            }
            onBlur={(e) => {
              if (!(isDisabled || isBlocked)) this.onBlur(e)
            }}
            ref={this.inputRef}
          />
          <input
            role="textbox"
            id={id}
            data-feature={feature}
            type="text"
            className="input__field"
            value={inputValue.toUpperCase().replace('#', '')}
            maxLength={7}
            disabled={isDisabled || isBlocked}
            aria-label="Hex color code"
            aria-disabled={isDisabled || isBlocked}
            onChange={
              !(isDisabled || isBlocked) ? this.onChangeColorValue : undefined
            }
            onFocus={(e) => {
              e.target.select()
              if (helper !== undefined)
                this.setState({ isTooltipVisible: true })
              this.onFocus(e)
            }}
            onKeyDown={
              !(isDisabled || isBlocked) ? this.onValidColor : undefined
            }
            onBlur={(e) => {
              if (helper !== undefined)
                this.setState({ isTooltipVisible: false })
              if (!(isDisabled || isBlocked)) this.onBlur(e)
            }}
            ref={this.inputRef}
          />
          {isTooltipVisible && helper !== undefined && (
            <Tooltip
              anchor={this.wrapperRef}
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {helper?.label}
            </Tooltip>
          )}
        </div>
        {this.Status()}
      </div>
    )
  }

  Number = () => {
    const {
      id,
      icon,
      unit,
      min,
      max,
      step,
      helper,
      feature,
      isBlocked,
      isDisabled,
      isFlex,
      onSlide,
    } = this.props
    const { inputValue, isTooltipVisible } = this.state

    return (
      <div
        className={doClassnames([
          'input',
          'input--number',
          icon !== undefined && 'input--with-icon',
          isFlex && 'input--flex',
          isBlocked && 'input--blocked',
        ])}
        role="group"
      >
        <div
          className="input__wrapper"
          ref={this.wrapperRef}
          onMouseEnter={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
        >
          {icon !== undefined && (
            <div
              className="input__icon"
              style={{
                cursor:
                  typeof onSlide === 'function' && !(isDisabled || isBlocked)
                    ? 'ew-resize'
                    : 'default',
              }}
              onMouseDown={() => {
                if (typeof onSlide === 'function' && !(isDisabled || isBlocked))
                  this.onGrab()
              }}
            >
              <Icon
                type={icon?.type}
                iconName={icon?.value}
                iconLetter={icon?.value}
              />
            </div>
          )}
          <input
            role="spinbutton"
            id={id}
            data-feature={feature}
            type="number"
            className={doClassnames([
              'input__field',
              isFlex && 'input__field--flex',
              unit !== undefined && 'input__field--unit',
            ])}
            value={inputValue}
            min={min}
            max={max}
            step={step}
            disabled={isDisabled || isBlocked}
            aria-label={`Number input${unit ? ` in ${unit}` : ''}${icon ? ` with ${icon.value} icon` : ''}`}
            aria-valuemin={min ? parseFloat(min) : undefined}
            aria-valuemax={max ? parseFloat(max) : undefined}
            aria-valuenow={parseFloat(inputValue)}
            aria-disabled={isDisabled || isBlocked}
            onKeyDown={
              !(isDisabled || isBlocked) ? this.onValidNumber : undefined
            }
            onChange={
              !(isDisabled || isBlocked) ? this.onChangeNumber : undefined
            }
            onFocus={(e) => {
              e.target.select()
              if (helper !== undefined) this.setState({ isTooltipVisible: true })
              if (!(isDisabled || isBlocked)) this.onFocus(e)
            }}
            onBlur={(e) => {
              if (helper !== undefined) this.setState({ isTooltipVisible: false })
              if (!(isDisabled || isBlocked)) this.onBlur(e)
            }}
            ref={this.inputRef}
          />
          {unit !== undefined && (
            <div className="input__unit">
              <Icon
                type={'LETTER'}
                iconLetter={unit}
              />
            </div>
          )}
          {isTooltipVisible && helper !== undefined && (
            <Tooltip
              anchor={this.wrapperRef}
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {helper?.label}
            </Tooltip>
          )}
        </div>
        {this.Status()}
      </div>
    )
  }

  Text = () => {
    const {
      id,
      icon,
      state,
      placeholder,
      charactersLimit,
      helper,
      feature,
      isClearable,
      isFlex,
      isFramed,
      isBlocked,
      isDisabled,
      onClear,
    } = this.props
    const { inputValue, isTooltipVisible } = this.state

    return (
      <div
        className={doClassnames([
          'input',
          'input--short-text',
          icon !== undefined && 'input--with-icon',
          isFlex && 'input__field--flex',
          isBlocked && 'input--blocked',
        ])}
        role="group"
      >
        <div
          className="input__wrapper"
          ref={this.wrapperRef}
          onMouseEnter={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
        >
          {icon !== undefined && (
            <div className="input__icon">
              <Icon
                type={icon?.type}
                iconName={icon?.value}
                iconLetter={icon?.value}
              />
            </div>
          )}
          <input
            role="textbox"
            id={id}
            data-feature={feature}
            type="text"
            className={doClassnames([
              'input__field',
              !isFramed && 'input__field--no-frame',
              isClearable && inputValue.length > 0 && 'input__field--clearable',
              state === 'ERROR' && 'input__field--error',
            ])}
            placeholder={placeholder}
            value={inputValue}
            maxLength={charactersLimit}
            disabled={isDisabled || isBlocked}
            aria-label={placeholder || 'Text input'}
            aria-invalid={state === 'ERROR'}
            aria-disabled={isDisabled || isBlocked}
            onKeyDown={
              !(isDisabled || isBlocked) ? this.onValidText : undefined
            }
            onChange={
              !(isDisabled || isBlocked) ? this.onChangeText : undefined
            }
            onFocus={(e) => {
              if (helper !== undefined) this.setState({ isTooltipVisible: true })
              if (!(isDisabled || isBlocked)) this.onFocus(e)
            }}
            onBlur={(e) => {
              if (helper !== undefined) this.setState({ isTooltipVisible: false })
              if (!(isDisabled || isBlocked)) this.onBlur(e)
            }}
            ref={this.inputRef}
          ></input>
          {isClearable &&
            inputValue.length > 0 &&
            !(isDisabled || isBlocked) && (
              <div className="input__clear">
                <Button
                  type="icon"
                  size="small"
                  icon="close"
                  action={() => {
                    this.setState({ inputValue: '' })
                    if (onClear !== undefined) onClear('')
                  }}
                />
              </div>
            )}
          {isTooltipVisible && helper !== undefined && (
            <Tooltip
              anchor={this.wrapperRef}
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {helper?.label}
            </Tooltip>
          )}
        </div>
        {this.Status()}
      </div>
    )
  }

  LongText = () => {
    const { id, state, placeholder, helper, feature, isBlocked, isDisabled } =
      this.props
    const { inputValue, isTooltipVisible } = this.state

    return (
      <div
        className={doClassnames([
          'input',
          'input--long-text',
          isBlocked && 'input--blocked',
        ])}
        role="group"
      >
        <div
          className="input__wrapper"
          ref={this.wrapperRef}
          onMouseEnter={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
        >
          <textarea
            role="textbox"
            id={id}
            data-feature={feature}
            className={doClassnames([
              'textarea',
              'input__field',
              state === 'ERROR' && 'input__field--error',
            ])}
            rows={1}
            placeholder={placeholder}
            value={inputValue}
            disabled={isDisabled || isBlocked}
            aria-label={placeholder || 'Long text input'}
            aria-invalid={state === 'ERROR'}
            aria-disabled={isDisabled || isBlocked}
            onKeyDown={
              !(isDisabled || isBlocked) ? this.onValidLongText : undefined
            }
            onChange={
              !(isDisabled || isBlocked) ? this.onChangeText : undefined
            }
            onFocus={(e) => {
              if (helper !== undefined) this.setState({ isTooltipVisible: true })
              if (!(isDisabled || isBlocked)) this.onFocus(e)
            }}
            onBlur={(e) => {
              if (helper !== undefined) this.setState({ isTooltipVisible: false })
              if (!(isDisabled || isBlocked)) this.onBlur(e)
            }}
            ref={this.textareaRef}
          />
          {isTooltipVisible && helper !== undefined && (
            <Tooltip
              anchor={this.wrapperRef}
              pin={helper?.pin || 'BOTTOM'}
              type={helper?.type || 'SINGLE_LINE'}
            >
              {helper?.label}
            </Tooltip>
          )}
        </div>
        {this.Status()}
      </div>
    )
  }

  CodeSnippet = () => {
    const { id, value, helper, feature, isBlocked, isDisabled } = this.props

    return (
      <div
        className={doClassnames([
          'input',
          'input--code',
          isBlocked && 'input--blocked',
        ])}
        role="group"
      >
        <div
          className="input__wrapper"
          onMouseEnter={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: true })
          }}
          onMouseLeave={() => {
            if (helper !== undefined) this.setState({ isTooltipVisible: false })
          }}
        >
          <textarea
            role="textbox"
            id={id}
            data-feature={feature}
            className={doClassnames([
              'textarea',
              'input__field',
              'textarea--monospace',
            ])}
            value={value}
            disabled={isDisabled || isBlocked}
            aria-label={'Code snippet'}
            aria-disabled={isDisabled || isBlocked}
            onChange={
              !(isDisabled || isBlocked) ? this.onChangeText : undefined
            }
            onFocus={(e) => e.target.select()}
            onBlur={() => window.getSelection()?.removeAllRanges()}
            readOnly
            ref={this.textareaRef}
          />
        </div>
        {this.Status()}
      </div>
    )
  }

  // Render
  render() {
    const { type } = this.props

    if (type === 'NUMBER') return this.Number()
    if (type === 'COLOR') return this.Color()
    if (type === 'LONG_TEXT') return this.LongText()
    if (type === 'CODE') return this.CodeSnippet()
    return this.Text()
  }
}
