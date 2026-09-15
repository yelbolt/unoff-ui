import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import './keyboard-shortcut-item.scss'

export type KeyboardShortcutItemProps = {
  /**
   * Label describing the action
   */
  label: string
  /**
   * Array of keyboard shortcut combinations
   */
  shortcuts: Array<Array<string>>
  /**
   * Separator between multiple shortcuts
   * @default ''
   */
  separator?: string
}

const KeyboardShortcutItem = (props: KeyboardShortcutItemProps) => {
  const { label, shortcuts = [], separator = '' } = props

  return (
    <li className="keyboard-shortcut-item">
      <div
        className="keyboard-shortcut-item__label"
        role="presentation"
      >
        <span
          className={doClassnames([texts.type, texts['type--tertiary']])}
          role="presentation"
        >
          {label}
        </span>
      </div>
      <div
        className="keyboard-shortcut-item__keys"
        role="group"
      >
        <>
          {shortcuts[0].map((shortcut, index) => (
            <span
              className={doClassnames([
                'keyboard-shortcut-item__key',
                texts.type,
              ])}
              key={index}
              role="presentation"
            >
              {shortcut}
            </span>
          ))}
          {shortcuts[1] !== undefined && (
            <>
              <span
                className={doClassnames([
                  'keyboard-shortcut-item__separator',
                  texts.type,
                ])}
                role="presentation"
                aria-hidden="true"
              >
                {separator}
              </span>
              {shortcuts[1].map((shortcut, index) => (
                <span
                  className={doClassnames([
                    'keyboard-shortcut-item__key',
                    texts.type,
                  ])}
                  key={index}
                  role="presentation"
                >
                  {shortcut}
                </span>
              ))}
            </>
          )}
        </>
      </div>
    </li>
  )
}

export default KeyboardShortcutItem
