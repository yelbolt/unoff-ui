import { useEffect, useState } from 'react'
import Icon from '../icon/Icon'
import './thumbnail.scss'

export interface ThumbnailProps {
  /**
   * Image source URL to display
   */
  src?: string
  /**
   * Alt text for the image
   * @default 'Image thumbnail'
   */
  alt?: string
  /**
   * Custom content to display in the same slot (an icon, initials, a color swatch, etc.).
   * Used when no `src` is provided, and as the fallback when the image fails to load
   */
  insert?: React.ReactNode
  /**
   * Width of the thumbnail
   * @default '100%'
   */
  width?: string
  /**
   * Height of the thumbnail
   * @default '100%'
   */
  height?: string
}

const Thumbnail = (props: ThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const {
    src,
    alt = 'Image thumbnail',
    insert,
    width = '100%',
    height = '100%',
  } = props
  const hasInsert = insert !== undefined && insert !== null

  useEffect(() => {
    if (!src) return
    setIsLoading(true)
    setIsError(false)
    const img = new Image()
    img.src = src
    img.onload = () => setIsLoading(false)
    img.onerror = () => setIsError(true)
  }, [src])

  if (!src || isError)
    return (
      <div
        className="thumbnail"
        style={{
          width: width,
          height: height,
        }}
      >
        {hasInsert ? (
          <div className="thumbnail__fragment">{insert}</div>
        ) : (
          isError && (
            <Icon
              type="PICTO"
              iconName="warning"
              customClassName="thumbnail__error"
              aria-hidden="true"
            />
          )
        )}
      </div>
    )

  return (
    <div
      className="thumbnail"
      style={{
        width: width,
        height: height,
      }}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <Icon
          type="PICTO"
          iconName="spinner"
          customClassName="thumbnail__loader"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <img
          className="thumbnail__image"
          src={src}
          loading="lazy"
          alt={alt}
          role="img"
        />
      )}
    </div>
  )
}

export default Thumbnail
