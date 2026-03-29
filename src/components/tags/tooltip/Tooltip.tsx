import { createPortal } from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import './tooltip.scss'

export interface TooltipProps {
  /**
   * Tooltip content
   */
  children: React.ReactNode
  /**
   * Position relative to the parent
   * @default 'BOTTOM'
   */
  pin?: 'TOP' | 'BOTTOM'
  /**
   * Display type
   * @default 'SINGLE_LINE'
   */
  type?: 'MULTI_LINE' | 'SINGLE_LINE' | 'WITH_IMAGE'
  /**
   * Image URL (when type is WITH_IMAGE)
   */
  image?: string
  /**
   * Ref to the anchor element. When provided, the tooltip renders via a portal
   * at document.body level, escaping any overflow:hidden ancestor.
   * Position is calculated from the anchor's bounding rect using position:fixed.
   */
  anchor?: React.RefObject<HTMLElement>
}

const Tooltip = (props: TooltipProps) => {
  const { children, pin = 'BOTTOM', type = 'SINGLE_LINE', image, anchor } = props
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [shift, setShift] = React.useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [fixedPos, setFixedPos] = useState<{ top: number; left: number; arrowLeft: number } | null>(
    null
  )
  const prevFixedPos = useRef<{ top: number; left: number } | null>(null)
  const hasShownRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(false)
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [])

  useEffect(() => {
    const tooltipEl = tooltipRef.current
    if (!tooltipEl) return

    if (anchor?.current) {
      let rafId: number

      const updatePosition = () => {
        if (!tooltipRef.current || !anchor.current) return

        const anchorRect = anchor.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        const arrowOffset =
          parseFloat(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--tooltip-arrow-size')
              .trim()
          ) || 0

        const anchorCenterX = anchorRect.left + anchorRect.width / 2
        let left = anchorCenterX - tooltipRect.width / 2
        const top =
          pin === 'TOP'
            ? anchorRect.top - tooltipRect.height - arrowOffset
            : anchorRect.bottom + arrowOffset

        if (left < 8) left = 8
        if (left + tooltipRect.width > window.innerWidth - 8)
          left = window.innerWidth - tooltipRect.width - 8

        const arrowLeft = anchorCenterX - left

        if (prevFixedPos.current?.top !== top || prevFixedPos.current?.left !== left) {
          prevFixedPos.current = { top, left }
          setFixedPos({ top, left, arrowLeft })
        }

        if (!hasShownRef.current) {
          hasShownRef.current = true
          setIsVisible(true)
        }

        rafId = requestAnimationFrame(updatePosition)
      }

      rafId = requestAnimationFrame(updatePosition)
      return () => cancelAnimationFrame(rafId)
    } else {
      const rect = tooltipEl.getBoundingClientRect()
      if (rect.x < 0) setShift(-rect.x + 8)
      if (rect.x + rect.width > window.innerWidth)
        setShift(window.innerWidth - rect.x - rect.width - 8)

      setIsVisible(true)
    }
  }, [anchor, pin])

  const content = (
    <div
      className={doClassnames([
        'tooltip',
        anchor !== undefined && 'tooltip--portal',
        type === 'SINGLE_LINE' && 'tooltip--singleline',
        type === 'WITH_IMAGE' && 'tooltip--withimage',
        pin === 'TOP' && 'tooltip--top',
        pin === 'BOTTOM' && 'tooltip--bottom',
      ])}
      role="tooltip"
      ref={tooltipRef}
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        ...(fixedPos !== null && {
          top: fixedPos.top,
          left: fixedPos.left,
          '--_arrow-left': `${fixedPos.arrowLeft}px`,
        }),
      } as React.CSSProperties}
      aria-hidden={!isVisible}
    >
      <div
        className="tooltip__block"
        style={{
          transform: `translateX(${shift}px)`,
        }}
        role="presentation"
      >
        <div
          className="tooltip__snack"
          role="presentation"
        >
          {image !== undefined && (
            <img
              src={image}
              className="tooltip__image"
              role="img"
              alt="Decorative image"
            />
          )}
          <div
            className={doClassnames(['tooltip__text', texts.type])}
            role="presentation"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  if (anchor !== undefined) return createPortal(content, document.body)
  return content
}

export default Tooltip
