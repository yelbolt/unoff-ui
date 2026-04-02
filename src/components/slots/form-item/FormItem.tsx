import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import Chip from '@components/tags/chip/Chip'
import Message from '@components/dialogs/message/Message'
import './form-item.scss'

export interface FormItemProps {
  /**
   * HTML id attribute
   */
  id?: string
  /**
   * Label text for the form item
   */
  label?: string
  /**
   * Helper or error message configuration
   */
  helper?: {
    /** Type of message */
    type: 'INFO' | 'ERROR'
    /** Message text */
    message: string
  }
  /**
   * Whether to fill available width
   * @default true
   */
  shouldFill?: boolean
  /**
   * Whether to align content to baseline
   * @default false
   */
  isBaseline?: boolean
  /**
   * Whether to use multi-line layout
   * @default false
   */
  isMultiLine?: boolean
  /**
   * Whether the item is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Form input element
   */
  children: React.ReactNode
}

const FormItem = (props: FormItemProps) => {
  const {
    id,
    label,
    helper,
    shouldFill = true,
    isBaseline = false,
    isMultiLine = false,
    isBlocked = false,
    isNew = false,
    children,
  } = props

  return (
    <div
      className={doClassnames([
        'form-item',
        shouldFill && 'form-item--fill',
        isBaseline && 'form-item--baseline',
        isMultiLine && 'form-item--multiline',
        isBlocked && 'form-item--blocked',
      ])}
      role="group"
      aria-describedby={helper ? `${id}-helper` : undefined}
    >
      <div
        className="form-item__row"
        role="presentation"
      >
        {label !== undefined && (
          <label
            className={doClassnames([
              texts.type,
              texts['type--secondary'],
              'form-item__label',
            ])}
            htmlFor={id}
            id={`${id}-label`}
          >
            {label}
          </label>
        )}
        <div
          className="form-item__input"
          role="presentation"
        >
          {children}
        </div>
        {isNew && (
          <div
            className="form-item__chip"
            role="presentation"
          >
            <Chip>New</Chip>
          </div>
        )}
      </div>
      {helper !== undefined && (
        <div
          className="form-item__helper"
          id={`${id}-helper`}
          role="alert"
          aria-live="polite"
        >
          <Message
            icon={helper.type === 'INFO' ? 'info' : 'warning'}
            messages={[helper.message]}
          />
        </div>
      )}
    </div>
  )
}

export default FormItem
