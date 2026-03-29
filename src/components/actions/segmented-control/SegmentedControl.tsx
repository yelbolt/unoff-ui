import './segmented-control.scss'
import React from 'react'
import { doClassnames } from '@unoff/utils'
import { IconList } from '@tps/icon.types'
import layouts from '@styles/layouts.module.scss'
import Tooltip from '@components/tags/tooltip/Tooltip'
import IconChip from '@components/tags/icon-chip/IconChip'
import Chip from '@components/tags/chip/Chip'
import Icon from '@components/assets/icon/Icon'

export interface SegmentedControlProps {
  /**
   * Array of tab configurations
   */
  items: Array<{
    /** Unique tab ID */
    id: string
    /** Optional icon */
    icon: {
      type: 'PICTO' | 'LETTER'
      name: IconList
    }
    /** Helper text */
    helper: {
      label: string
      pin?: 'TOP' | 'BOTTOM'
    }
    /** Optional disabled state */
    isDisabled?: boolean
  }>
  /**
   * ID of the active control
   */
  active: string
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
   * Whether the segmented control is blocked
   * @default false
   */
  isBlocked?: boolean
  /**
   * Whether to show a "New" badge
   * @default false
   */
  isNew?: boolean
  /**
   * Click handler
   */
  action: React.MouseEventHandler & React.KeyboardEventHandler
  /**
   * Handler called when unblock is clicked
   */
  onUnblock?: React.MouseEventHandler & React.KeyboardEventHandler
}

interface SegmentedControlState {
  activeTooltipId: string | null
}


export default class SegmentedControl extends React.Component<
  SegmentedControlProps,
  SegmentedControlState
> {
  static defaultProps: Partial<SegmentedControlProps> = {
    isBlocked: false,
    isNew: false,
  }

  private itemRefs: Map<string, HTMLDivElement | null> = new Map()

  constructor(props: SegmentedControlProps) {
    super(props)
    this.state = {
      activeTooltipId: null,
    }
  }

  // Templates
  Status = () => {
    const { warning, preview, isBlocked, isNew, onUnblock } = this.props

    if (warning || isBlocked || isNew)
      return (
        <div className="segmented-control__status">
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

  // Render
  render() {
    const { items, active, isBlocked, action } = this.props
    const { activeTooltipId } = this.state

    return (
      <div className={layouts['snackbar--medium']}>
        <div
          className={doClassnames([
            'segmented-control',
            isBlocked && 'segmented-control--blocked',
          ])}
          role="tablist"
        >
          {items.map((item) => (
            <div
              role="tab"
              key={item.helper.label.toLowerCase()}
              ref={(el) => this.itemRefs.set(item.id, el)}
              className={doClassnames([
                'segmented-control__item',
                active === item.id && 'segmented-control__item--active',
                (item.isDisabled || isBlocked) &&
                  'segmented-control__item--disabled',
              ])}
              data-feature={item.id}
              tabIndex={active === item.id ? -1 : 0}
              aria-disabled={item.isDisabled || isBlocked}
              onMouseDown={action}
              onMouseEnter={() => this.setState({ activeTooltipId: item.id })}
              onMouseLeave={() => this.setState({ activeTooltipId: null })}
              onFocus={() => this.setState({ activeTooltipId: item.id })}
              onBlur={() => this.setState({ activeTooltipId: null })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') action(e)
                if (e.key === 'Escape') (e.target as HTMLElement).blur()
              }}
            >
              <Icon
                type={item.icon.type}
                iconName={
                  item.icon.type === 'PICTO' ? item.icon.name : undefined
                }
                iconLetter={
                  item.icon.type === 'LETTER' ? item.icon.name : undefined
                }
                aria-hidden="true"
              />
              {activeTooltipId === item.id && (
                <Tooltip
                  anchor={{ current: this.itemRefs.get(item.id) ?? null }}
                  pin={item.helper.pin ?? 'BOTTOM'}
                  type="SINGLE_LINE"
                >
                  {item.helper.label}
                </Tooltip>
              )}
            </div>
          ))}
        </div>
        {this.Status()}
      </div>
    )
  }
}
