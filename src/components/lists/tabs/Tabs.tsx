import './tabs.scss'
import { useState, useRef, useEffect } from 'react'
import { doClassnames } from '@unoff/utils'
import { IconList } from '@tps/icon.types'
import texts from '@styles/texts/texts.module.scss'
import Chip from '@components/tags/chip/Chip'
import Icon from '@components/assets/icon/Icon'
import Menu from '@components/actions/menu/Menu'

export interface TabsProps {
  /**
   * Array of tab configurations
   */
  tabs: Array<{
    /** Tab label */
    label: string
    /** Unique tab ID */
    id: string
    /** Optional icon */
    icon?: {
      type: 'PICTO' | 'LETTER'
      name: IconList
    }
    /** Whether tab has been updated */
    isUpdated: boolean
    /** Whether to show a "New" badge */
    isNew?: boolean
  }>
  /**
   * ID of the active tab
   */
  active: string
  /**
   * Layout direction
   * @default 'HORIZONTAL'
   */
  direction?: 'HORIZONTAL' | 'VERTICAL'
  /**
   * Whether tabs should use flex layout
   * @default false
   */
  isFlex?: boolean
  /**
   * Maximum number of tabs to display before collapsing into menu
   * @default 3
   */
  maxVisibleTabs?: number
  /**
   * Click handler
   */
  action: React.MouseEventHandler & React.KeyboardEventHandler
}

const Tabs = (props: TabsProps) => {
  const {
    tabs,
    active,
    direction = 'HORIZONTAL',
    isFlex = false,
    maxVisibleTabs = 3,
    action,
  } = props

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const menuContainerId = useRef(
    `tabs-menu-${Math.random().toString(36).substr(2, 9)}`
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (tabs.length > 1) {
    const effectiveDirection = windowWidth <= 460 ? 'HORIZONTAL' : direction

    if (windowWidth > 460)
      return (
        <div
          className={doClassnames([
            'tabs',
            effectiveDirection === 'VERTICAL' && 'tabs--vertical',
          ])}
          role="tablist"
          aria-orientation={
            effectiveDirection === 'VERTICAL' ? 'vertical' : 'horizontal'
          }
        >
          {tabs.map((tab) => (
            <div
              role="tab"
              key={tab.label.toLowerCase()}
              className={doClassnames([
                'tabs__tab',
                active === tab.id && 'tabs__tab--active',
                tab.isUpdated && 'tabs__tab--updated',
                tab.icon !== undefined && 'tabs__tab--with-icon',
                isFlex &&
                  effectiveDirection !== 'VERTICAL' &&
                  'tabs__tab--flex',
              ])}
              data-feature={tab.id}
              tabIndex={active === tab.id ? -1 : 0}
              onMouseDown={action}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') action(e)
                if (e.key === 'Escape') (e.target as HTMLElement).blur()
              }}
            >
              {tab.icon !== undefined && (
                <Icon
                  type={tab.icon.type}
                  iconName={
                    tab.icon.type === 'PICTO' ? tab.icon.name : undefined
                  }
                  iconLetter={
                    tab.icon.type === 'LETTER' ? tab.icon.name : undefined
                  }
                  aria-hidden="true"
                />
              )}
              <span
                className={doClassnames([texts.type, texts['type--truncated']])}
              >
                {tab.label}
              </span>
              {tab.isNew && <Chip>New</Chip>}
            </div>
          ))}
        </div>
      )

    const responsiveVisibleTabs = tabs.slice(0, maxVisibleTabs - 1)
    const responsiveOverflowTabs = tabs.slice(maxVisibleTabs - 1)

    const activeInOverflow = responsiveOverflowTabs.some(
      (tab) => tab.id === active
    )

    return (
      <div
        id={menuContainerId.current}
        className={doClassnames([
          'tabs',
          effectiveDirection === 'VERTICAL' && 'tabs--vertical',
        ])}
        role="tablist"
        aria-orientation={
          effectiveDirection === 'VERTICAL' ? 'vertical' : 'horizontal'
        }
      >
        {responsiveVisibleTabs.map((tab) => (
          <div
            role="tab"
            key={tab.label.toLowerCase()}
            className={doClassnames([
              'tabs__tab',
              active === tab.id && 'tabs__tab--active',
              tab.isUpdated && 'tabs__tab--updated',
              tab.icon !== undefined && 'tabs__tab--with-icon',
              isFlex && effectiveDirection !== 'VERTICAL' && 'tabs__tab--flex',
            ])}
            data-feature={tab.id}
            tabIndex={active === tab.id ? -1 : 0}
            onMouseDown={action}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') action(e)
              if (e.key === 'Escape') (e.target as HTMLElement).blur()
            }}
          >
            {tab.icon !== undefined && (
              <Icon
                type={tab.icon.type}
                iconName={tab.icon.type === 'PICTO' ? tab.icon.name : undefined}
                iconLetter={
                  tab.icon.type === 'LETTER' ? tab.icon.name : undefined
                }
                aria-hidden="true"
              />
            )}
            <span
              className={doClassnames([texts.type, texts['type--truncated']])}
            >
              {tab.label}
            </span>
            {tab.isNew && <Chip>New</Chip>}
          </div>
        ))}

        {responsiveOverflowTabs.length > 0 && (
          <Menu
            id="tabs-overflow-menu"
            type="ICON"
            icon="ellipses"
            options={responsiveOverflowTabs.map((tab) => ({
              label: tab.label,
              value: tab.id,
              type: 'OPTION',
              isNew: tab.isNew,
              action: (e: React.MouseEvent | React.KeyboardEvent) => {
                const mockTarget = {
                  dataset: { feature: tab.id },
                }

                const mockEvent = {
                  ...e,
                  target: mockTarget,
                  currentTarget: mockTarget,
                } as unknown as React.MouseEvent & React.KeyboardEvent

                action(mockEvent)
              },
            }))}
            selected={activeInOverflow ? active : undefined}
            alignment="BOTTOM_LEFT"
            isNew={activeInOverflow}
            isAlwaysExpanded
          />
        )}
      </div>
    )
  }

  return null
}

export default Tabs
