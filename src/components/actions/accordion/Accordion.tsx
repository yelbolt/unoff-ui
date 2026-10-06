import { useState } from 'react'
import { doClassnames } from '@unoff/utils'
import { IconList } from '@tps/icon.types'
import Chip from '@components/tags/chip/Chip'
import SectionTitle from '@components/assets/section-title/SectionTitle'
import Button from '../button/Button'
import './accordion.scss'
import { layouts } from '../../..'

export interface AccordionProps {
  /**
   * Title label of the accordion
   */
  label: string
  /**
   * Optional indicator (number or text) displayed next to the label
   */
  indicator?: string | number
  /**
   * Icon to display in the add button
   * @default 'plus'
   */
  icon?: IconList
  /**
   * Icon to display in the collapse button
   * @default 'minus'
   */
  collapseIcon?: IconList
  /**
   * Slot for extra action buttons, displayed before the collapse button.
   * Revealed on hover / keyboard focus, and always visible when expanded
   */
  actions?: React.ReactNode
  /**
   * Helper text displayed near the title
   */
  helper?: string
  /**
   * Helper texts for the action buttons
   */
  helpers?: {
    /** Helper text for the add button */
    add?: string
    /** Helper text for the empty button */
    empty?: string
  }
  /**
   * Whether the accordion is expanded
   */
  isExpanded: boolean
  /**
   * Whether the accordion is blocked (disabled)
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Content to display when accordion is expanded
   */
  children?: React.ReactNode
  /**
   * Callback fired when the add button is clicked
   */
  onAdd: (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => void
  /**
   * Callback fired when the empty button is clicked
   */
  onEmpty: (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => void
  /**
   * Handler called instead of onAdd when isBlocked is true
   */
  onBlock?: (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => void
}

const Accordion = (props: AccordionProps) => {
  const [isActionsVisible, setActionsVisible] = useState<boolean>(false)
  const {
    label,
    indicator,
    icon = 'plus',
    collapseIcon = 'minus',
    actions,
    helper,
    helpers,
    isExpanded,
    isBlocked = false,
    isNew = false,
    children,
    onAdd,
    onEmpty,
    onBlock,
  } = props

  const areActionsShown = isExpanded || isActionsVisible

  const handleAdd = (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => {
    event.stopPropagation()
    onAdd(event)
  }

  const handleEmpty = (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => {
    event.stopPropagation()
    onEmpty(event)
  }

  return (
    <div
      className={doClassnames([
        'accordion',
        isExpanded && 'accordion--expanded',
      ])}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).dataset.feature !== undefined) return
        if (isBlocked) {
          onBlock?.(e as React.MouseEvent<HTMLDivElement, MouseEvent>)
          return
        }
        if (!isExpanded)
          onAdd(e as React.MouseEvent<HTMLDivElement, MouseEvent>)
      }}
    >
      <div
        className="accordion__row"
        onMouseEnter={() => setActionsVisible(true)}
        onMouseLeave={() => setActionsVisible(false)}
        onFocus={() => setActionsVisible(true)}
        onBlur={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return
          setActionsVisible(false)
        }}
      >
        <div
          className="accordion__row__left"
          role="presentation"
        >
          <SectionTitle
            label={label}
            indicator={indicator}
            helper={helper}
          />
        </div>
        <div
          className="accordion__row__right"
          role="group"
        >
          <div className={layouts['snackbar--medium']}>
            {actions && (
              <div
                className="accordion__row__actions"
                role="group"
                aria-hidden={!areActionsShown}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {areActionsShown && actions}
              </div>
            )}
            {isExpanded ? (
              <Button
                type="icon"
                icon={collapseIcon}
                iconClassName="accordion__row__icon"
                helper={
                  helpers?.empty !== undefined
                    ? {
                        label: helpers.empty,
                      }
                    : undefined
                }
                action={(e) => handleEmpty(e)}
              />
            ) : (
              <Button
                type="icon"
                icon={icon}
                iconClassName="accordion__row__icon"
                helper={
                  helpers?.add !== undefined
                    ? {
                        label: helpers.add,
                      }
                    : undefined
                }
                isBlocked={isBlocked}
                action={(e) => handleAdd(e)}
              />
            )}
            {isNew && <Chip>{'New'}</Chip>}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div
          id={`accordion-content-${label}`}
          role="region"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default Accordion
