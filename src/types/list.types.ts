import React from 'react'

export interface DropdownOption {
  /**
   * Item kind — controls how the option is rendered
   * - `OPTION` — selectable item
   * - `TITLE` — non-interactive section label
   * - `SEPARATOR` — visual divider
   * - `GROUP` — expandable item with a `children` submenu
   */
  type: 'OPTION' | 'TITLE' | 'SEPARATOR' | 'GROUP'
  /**
   * Display text
   */
  label?: string
  /**
   * Identifier matched against `selected` to highlight the active option
   */
  value?: string
  /**
   * Keyboard shortcut label displayed on the trailing edge of the item
   */
  shortcut?: string
  /**
   * Passed through as `data-feature` on the list item element
   */
  feature?: string
  /**
   * Submenu items — only meaningful when `type="GROUP"`
   */
  children?: Array<DropdownOption> | []
  /**
   * Click / keydown handler called when the option is selected
   */
  action?: (
    event:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>
  ) => void
  /**
   * Hides the item from the list when `false`
   * @default true
   */
  isActive?: boolean
  /**
   * Renders the item locked with a Pro badge and prevents selection
   * @default false
   */
  isBlocked?: boolean
  /**
   * Shows a New badge instead of Pro
   * @default false
   */
  isNew?: boolean
}
