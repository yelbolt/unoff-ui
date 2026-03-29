import { useRef, useState } from 'react'
import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import Tooltip from '../tooltip/Tooltip'
import './chip.scss'

export interface ChipProps {
  /**
   * Visual state of the chip
   * @default 'ACTIVE'
   */
  state?: 'ACTIVE' | 'INACTIVE' | 'ON_BACKGROUND'
  /**
   * Content for the left slot
   */
  leftSlot?: React.ReactElement
  /**
   * Content for the right slot
   */
  rightSlot?: React.ReactElement
  /**
   * Text content of the chip
   */
  children?: React.ReactNode
  /**
   * Whether the chip is displayed alone (adds padding)
   * @default false
   */
  isSolo?: boolean
  /**
   * Preview tooltip configuration
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
   * Click handler
   */
  action?: React.MouseEventHandler & React.KeyboardEventHandler<HTMLDivElement>
}

const Chip = (props: ChipProps) => {
  const { children, state = 'ACTIVE', isSolo = false, preview, action } = props
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const chipRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={chipRef}
      className={doClassnames([
        'chip',
        state === 'INACTIVE' && 'chip--inactive',
        state === 'ON_BACKGROUND' && 'chip--on-background',
        isSolo && 'chip--solo',
        (action !== undefined || preview !== undefined) && 'chip--interactive',
      ])}
      onMouseDown={(e) => {
        if (action) action(e)
        else return undefined
      }}
      onMouseEnter={() => {
        if (preview !== undefined) setIsPreviewVisible(true)
      }}
      onMouseLeave={() => {
        if (preview !== undefined) setIsPreviewVisible(false)
      }}
      onKeyDown={(e) => {
        if (action && (e.key === 'Enter' || e.key === ' ')) action(e)
        else return undefined
      }}
      onFocus={() => {
        if (preview !== undefined) setIsPreviewVisible(true)
      }}
      onBlur={() => {
        if (preview !== undefined) setIsPreviewVisible(false)
      }}
      tabIndex={action !== undefined || preview !== undefined ? 0 : -1}
      role={
        action !== undefined || preview !== undefined ? 'button' : undefined
      }
      aria-pressed={action !== undefined ? state === 'ACTIVE' : undefined}
      aria-disabled={state === 'INACTIVE' ? true : undefined}
    >
      {props.leftSlot && (
        <div
          className="chip__left-slot"
          role="presentation"
        >
          {props.leftSlot}
        </div>
      )}
      {children !== undefined && (
        <div
          className={doClassnames([
            'chip__text',
            texts.type,
            texts['type--truncated'],
          ])}
          role="presentation"
        >
          {children}
        </div>
      )}
      {props.rightSlot && (
        <div
          className="chip__right-slot"
          role="presentation"
        >
          {props.rightSlot}
        </div>
      )}
      {isPreviewVisible && (
        <Tooltip
          anchor={chipRef}
          pin={preview?.pin || 'BOTTOM'}
          type="WITH_IMAGE"
          image={preview?.image}
        >
          {preview?.text}
        </Tooltip>
      )}
    </div>
  )
}

export default Chip
