import { HexColorPicker } from 'react-colorful'
import React from 'react'
import { doClassnames } from '@unoff/utils'
import './color-picker.scss'

export interface ColorPickerProps {
  /**
   * Unique identifier for the picker panel
   */
  id?: string
  /**
   * Current color as a hex code (`#rrggbb` or `#rgb`)
   */
  value: string
  /**
   * Accessible name of the picker panel
   * @default 'Color picker'
   */
  label?: string
  /**
   * Whether the panel should size itself to its container instead of using
   * the fixed token width
   * @default false
   */
  isFlex?: boolean
  /**
   * Called continuously while the color is being dragged or nudged, with a
   * lowercase `#rrggbb` hex code
   */
  onChange?: (value: string) => void
  /**
   * Called once an interaction is over (pointer released or key released),
   * with a lowercase `#rrggbb` hex code
   */
  onChangeEnd?: (value: string) => void
}

export default class ColorPicker extends React.Component<ColorPickerProps> {
  static defaultProps: Partial<ColorPickerProps> = {
    label: 'Color picker',
    isFlex: false,
  }

  render() {
    const { id, value, label, isFlex, onChange, onChangeEnd } = this.props

    return (
      <div
        id={id}
        className={doClassnames([
          'color-picker',
          isFlex && 'color-picker--flex',
        ])}
        role="group"
        aria-label={label}
      >
        <HexColorPicker
          color={value}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
        />
      </div>
    )
  }
}
