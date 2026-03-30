import { doClassnames } from '@unoff/utils'
import Drawer, { DrawerProps } from '../drawer/Drawer'
import './layout.scss'

export type LayoutProps = {
  /**
   * HTML id attribute
   */
  id?: string
  /**
   * Array of column configurations
   */
  column: Array<{
    /** Content node */
    node?: React.ReactElement
    /** Type modifier for styling */
    typeModifier?:
      | 'LIST'
      | 'DISTRIBUTED'
      | 'CENTERED'
      | 'BLANK'
      | 'DRAWER'
      | 'FIXED'
      | Array<
          'LIST' | 'DISTRIBUTED' | 'CENTERED' | 'BLANK' | 'DRAWER' | 'FIXED'
        >
    /** Fixed width value */
    fixedWidth?: string
    /** Drawer configuration (when typeModifier is DRAWER) */
    drawerOptions?: DrawerProps
  }>
  /**
   * Whether to use full width
   * @default false
   */
  isFullWidth?: boolean
  /**
   * Whether to use full height
   * @default false
   */
  isFullHeight?: boolean
  /**
   * Whether to reflow on small screens
   * @default false
   */
  shouldReflow?: boolean
}

const Layout = (props: LayoutProps) => {
  const {
    id,
    column,
    isFullWidth = false,
    isFullHeight = false,
    shouldReflow = false,
  } = props

  return (
    <div
      id={id}
      className={doClassnames([
        'layout',
        isFullWidth && 'layout--full-width',
        isFullHeight && 'layout--full-height',
        shouldReflow && 'layout--reflow',
      ])}
      role="main"
    >
      {column.map(
        (item, index) =>
          item.node !== undefined &&
          (item.typeModifier === 'DRAWER' &&
          item.drawerOptions !== undefined ? (
            <Drawer {...item.drawerOptions}>{item.node}</Drawer>
          ) : (
            <div
              key={index}
              className={doClassnames([
                'layout__block',
                item.typeModifier?.includes('LIST') && 'layout__block--list',
                item.typeModifier?.includes('DISTRIBUTED') &&
                  'layout__block--distributed',
                item.typeModifier?.includes('CENTERED') &&
                  'layout__block--centered',
                item.typeModifier?.includes('BLANK') && 'layout__block--blank',
                item.typeModifier?.includes('FIXED') && 'layout__block--fixed',
              ])}
              style={{
                width:
                  item.fixedWidth !== undefined ? item.fixedWidth : undefined,
              }}
              role="region"
              aria-label={`Content section ${index + 1}`}
            >
              {item.node}
            </div>
          ))
      )}
    </div>
  )
}

export default Layout
