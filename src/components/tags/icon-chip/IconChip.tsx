import React from 'react'
import { doClassnames } from '@unoff/utils'
import { IconList } from '@tps/icon.types'
import Icon from '@components/assets/icon/Icon'
import Tooltip from '../tooltip/Tooltip'
import './icon-chip.scss'

interface IconChipProps {
  /**
   * Type of icon
   */
  iconType: 'PICTO' | 'LETTER'
  /**
   * Icon name (when type is PICTO)
   * @default 'adjust'
   */
  iconName?: IconList
  /**
   * Letter to display (when type is LETTER)
   */
  iconLetter?: string
  /**
   * Tooltip text content
   */
  text: string | React.ReactNode
  /**
   * Tooltip position
   * @default 'BOTTOM'
   */
  pin?: 'TOP' | 'BOTTOM'
  /**
   * Tooltip display type
   * @default 'SINGLE_LINE'
   */
  type?: 'MULTI_LINE' | 'SINGLE_LINE' | 'WITH_IMAGE'
}

interface IconChipState {
  isTooltipVisible: boolean
}

export default class IconChip extends React.Component<IconChipProps, IconChipState> {
  static defaultProps: Partial<IconChipProps> = {
    pin: 'BOTTOM',
    type: 'SINGLE_LINE',
    iconName: 'adjust',
  }

  constructor(props: IconChipProps) {
    super(props)
    this.state = {
      isTooltipVisible: false,
    }
  }

  render() {
    const { iconType, iconName, iconLetter, text, pin, type } = this.props
    const { isTooltipVisible } = this.state

    return (
      <div
        className={doClassnames(['icon-chip'])}
        onMouseEnter={() => {
          this.setState({ isTooltipVisible: true })
        }}
        onMouseLeave={() => this.setState({ isTooltipVisible: false })}
        role="contentinfo"
      >
        <Icon
          type={iconType}
          iconName={iconName}
          iconLetter={iconLetter}
        />
        {isTooltipVisible && (
          <Tooltip
            pin={pin}
            type={type}
          >
            {text}
          </Tooltip>
        )}
      </div>
    )
  }
}
