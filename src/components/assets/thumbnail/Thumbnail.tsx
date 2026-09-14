import { useEffect, useState } from 'react'
import Icon from '../icon/Icon'
import './thumbnail.scss'

interface ThumbnailSharedProps {
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

interface ThumbnailImageProps extends ThumbnailSharedProps {
  /**
   * Image source URL to display
   */
  src: string
  /**
   * Alt text for the image
   * @default 'Image thumbnail'
   */
  alt?: string
  children?: never
}

interface ThumbnailFragmentProps extends ThumbnailSharedProps {
  src?: never
  alt?: never
  /**
   * Custom content to display instead of an image (an icon, initials, a color swatch, etc.)
   */
  children: React.ReactNode
}

export type ThumbnailProps = ThumbnailImageProps | ThumbnailFragmentProps

const Thumbnail = (props: ThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const { src, width = '100%', height = '100%', children } = props
  const alt = 'alt' in props ? (props.alt ?? 'Image thumbnail') : undefined

  useEffect(() => {
    if (!src) return
    setIsLoading(true)
    setIsError(false)
    const img = new Image()
    img.src = src
    img.onload = () => setIsLoading(false)
    img.onerror = () => setIsError(true)
  }, [src])

  if (!src)
    return (
      <div
        className="thumbnail"
        style={{
          width: width,
          height: height,
        }}
      >
        <div className="thumbnail__fragment">{children}</div>
      </div>
    )

  if (isError)
    return (
      <div
        className="thumbnail"
        style={{
          width: width,
          height: height,
        }}
      >
        <Icon
          type="PICTO"
          iconName="warning"
          customClassName="thumbnail__error"
          aria-hidden="true"
        />
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
