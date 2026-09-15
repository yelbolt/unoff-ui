import { useState } from 'react'
import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import Chip from '@components/tags/chip/Chip'
import Thumbnail from '@components/assets/thumbnail/Thumbnail'
import './card.scss'

interface CardProps {
  /**
   * Image source URL for the card thumbnail
   */
  src?: string
  /**
   * Custom content to display in the card thumbnail slot (an icon, initials, a
   * color swatch, etc.) instead of — or as a fallback for — an image
   */
  insert?: React.ReactNode
  /**
   * Tag label of the card
   */
  tag?: string
  /**
   * Main title of the card
   */
  title?: string
  /**
   * Subtitle text of the card
   */
  subtitle?: string
  /**
   * Rich text content to display in the card
   */
  richText?: React.ReactNode
  /**
   * Action buttons to display on hover
   */
  actions?: React.ReactNode
  /**
   * Whether the card should fill available space
   * @default false
   */
  shouldFill?: boolean
  /**
   * Click handler for the card
   */
  action: (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => void
}

const Card = (props: CardProps) => {
  const [isActionsVisible, setActionsVisible] = useState<boolean>(false)
  const {
    src,
    insert,
    tag,
    title,
    subtitle,
    richText,
    actions,
    shouldFill = false,
    action,
  } = props
  const hasAsset = Boolean(src) || (insert !== undefined && insert !== null)

  const isFromActions = (target: EventTarget | null) =>
    target instanceof HTMLElement && target.closest('.card__actions') !== null

  return (
    <div
      className={doClassnames(['card', shouldFill && 'card--fill'])}
      role="article"
      onMouseEnter={() => setActionsVisible(true)}
      onMouseLeave={() => setActionsVisible(false)}
      onFocus={() => setActionsVisible(true)}
      onBlur={() => setActionsVisible(false)}
      onKeyDown={(e) => {
        if (isFromActions(e.target)) return
        if (e.key === 'Enter' || e.key === ' ') action(e)
        if (e.key === 'Escape') (e.target as HTMLElement).blur()
      }}
      onMouseDown={(e) => {
        if (isFromActions(e.target)) return
        action(e)
      }}
      tabIndex={0}
    >
      {tag !== undefined && (
        <div
          className="card__tags"
          role="group"
        >
          <Chip isSolo>{tag}</Chip>
        </div>
      )}
      {hasAsset && (
        <div
          className="card__asset"
          role="group"
        >
          <Thumbnail
            src={src}
            insert={insert}
          />
          {actions && (
            <div
              className={'card__actions'}
              role="group"
              aria-hidden={!isActionsVisible}
            >
              {isActionsVisible && actions}
            </div>
          )}
        </div>
      )}
      <div
        className="card__text"
        role="contentinfo"
      >
        {title && (
          <span
            className={doClassnames([
              texts.type,
              texts['type--xlarge'],
              texts['type--bold'],
            ])}
            role="heading"
            aria-level={3}
          >
            {title}
          </span>
        )}
        {subtitle && (
          <span
            className={doClassnames([texts.type, texts['type--large']])}
            role="note"
          >
            {subtitle}
          </span>
        )}

        {richText && <>{richText}</>}
      </div>
    </div>
  )
}

export default Card
