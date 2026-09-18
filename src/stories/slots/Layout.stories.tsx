import type { Meta, StoryObj } from '@storybook/react-vite'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import { expect, waitFor, within } from 'storybook/test'
import { useEffect, useState } from 'react'
import texts from '@styles/texts/texts.module.scss'
import Chip from '@components/tags/chip/Chip'
import SimpleItem from '@components/slots/simple-item/SimpleItem'
import Section from '@components/slots/section/Section'
import Layout, { LayoutProps } from '@components/slots/layout/Layout'
import { DrawerProps } from '@components/slots/drawer/Drawer'
import Tabs from '@components/lists/tabs/Tabs'
import Input from '@components/inputs/input/Input'
import SectionTitle from '@components/assets/section-title/SectionTitle'
import Button from '@components/actions/button/Button'

const meta = {
  title: 'Patterns/Slots/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Layout component provides flexible multi-column layouts with responsive behavior. At 460px and below, it automatically switches from horizontal to vertical (column) layout.',
      },
    },
  },
} satisfies Meta<typeof Layout>

export default meta
type Story = StoryObj<typeof meta>

const SamplePanel = ({
  title,
  content,
}: {
  title: string
  content: string
}) => (
  <Section
    title={
      <SimpleItem
        leftPartSlot={<SectionTitle label={title} />}
        isListItem={false}
      />
    }
    body={[
      {
        node: (
          <SimpleItem
            leftPartSlot={<div className={texts.type}>{content}</div>}
            isListItem={false}
          />
        ),
      },
    ]}
  />
)

const SampleForm = () => (
  <Section
    title={
      <SimpleItem
        leftPartSlot={<SectionTitle label="Settings" />}
        rightPartSlot={<Chip>New</Chip>}
        isListItem={false}
      />
    }
    body={[
      {
        node: (
          <SimpleItem
            leftPartSlot={
              <Input
                id="sample-input"
                type="TEXT"
                placeholder="Enter your name"
              />
            }
            isListItem={false}
          />
        ),
      },
      {
        node: (
          <SimpleItem
            leftPartSlot={
              <Button
                type="primary"
                label="Save Changes"
              />
            }
            isListItem={false}
          />
        ),
      },
    ]}
  />
)

const SampleNavigation = () => (
  <Section
    title={
      <SimpleItem
        leftPartSlot={<SectionTitle label="Navigation" />}
        isListItem={false}
      />
    }
    body={[
      {
        node: (
          <SimpleItem
            leftPartSlot={
              <Tabs
                tabs={[
                  { label: 'Home', id: 'home', isUpdated: false },
                  { label: 'Settings', id: 'settings', isUpdated: true },
                  { label: 'Help', id: 'help', isUpdated: false, isNew: true },
                ]}
                active="settings"
                action={() => {}}
              />
            }
            isListItem={false}
          />
        ),
      },
    ]}
  />
)
const REFLOW_BREAKPOINT = '(max-width: 460px)'

const useIsReflowed = () => {
  const [isReflowed, setIsReflowed] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(REFLOW_BREAKPOINT)
    const sync = (event: MediaQueryListEvent) => setIsReflowed(event.matches)

    setIsReflowed(query.matches)
    query.addEventListener('change', sync)

    return () => query.removeEventListener('change', sync)
  }, [])

  return isReflowed
}

const DrawerLayout = (args: LayoutProps) => {
  const isReflowed = useIsReflowed()

  const drawerOptions: DrawerProps = isReflowed
    ? {
        id: 'reflow-drawer',
        direction: 'VERTICAL',
        pin: 'TOP',
        border: ['BOTTOM'],
        defaultSize: { value: 160, unit: 'PIXEL' },
        minSize: { value: 48, unit: 'PIXEL' },
        maxSize: { value: 320, unit: 'PIXEL' },
        isScrolling: true,
      }
    : {
        id: 'reflow-drawer',
        direction: 'HORIZONTAL',
        pin: 'LEFT',
        border: ['RIGHT'],
        defaultSize: { value: 240, unit: 'PIXEL' },
        minSize: { value: 80, unit: 'PIXEL' },
        maxSize: { value: 420, unit: 'PIXEL' },
        isScrolling: true,
      }

  return (
    <Layout
      key={isReflowed ? 'vertical' : 'horizontal'}
      {...args}
      column={[
        {
          node: (
            <SamplePanel
              title={isReflowed ? 'Top drawer' : 'Side drawer'}
              content={
                isReflowed
                  ? 'Reflowed: VERTICAL / pin TOP. Drag the knob along its bottom edge — the inline height drives the size because the drawer is excluded from the blanket `flex: 1`.'
                  : 'Wide: HORIZONTAL / pin LEFT. Drag the knob along its right edge. Narrow the viewport under 460px to watch it flip.'
              }
            />
          ),
          typeModifier: 'DRAWER',
          drawerOptions,
        },
        ...args.column,
      ]}
    />
  )
}

export const WithDrawer: Story = {
  args: {
    id: 'drawer-layout',
    isFullWidth: true,
    isFullHeight: true,
    shouldReflow: true,
    column: [
      {
        node: (
          <SamplePanel
            title="Main Content"
            content="Flexible block. It shares the remaining space with its siblings — horizontally above 460px, vertically below."
          />
        ),
      },
      {
        node: <SampleForm />,
        typeModifier: 'FIXED',
        fixedWidth: '260px',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <DrawerLayout {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'A resizable Drawer sitting next to flexible and fixed blocks. Resize the preview across 460px: the Layout flips to a column in CSS, and the story flips the Drawer from HORIZONTAL/LEFT to VERTICAL/TOP so it keeps resizing along the layout axis.',
      },
    },
  },
}

export const WithDrawerReflowed: Story = {
  ...WithDrawer,
  globals: {
    viewport: { value: 'iphone5', isRotated: false },
  },
  parameters: {
    viewport: { options: INITIAL_VIEWPORTS },
    docs: {
      description: {
        story:
          'The same story locked to a 320px viewport, so the reflow rules are always active. It guards the contract between `layout.scss` and Drawer: the drawer keeps its own main-axis size while the blocks distribute the rest, and no child overflows the cross axis.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const layout = canvasElement.querySelector<HTMLElement>('#drawer-layout')
    const drawer = canvasElement.querySelector<HTMLElement>('#reflow-drawer')

    await waitFor(() => {
      expect(layout).toBeInTheDocument()
      expect(drawer).toBeInTheDocument()
    })
    if (!layout || !drawer) throw new Error('Layout or drawer did not render')

    const separator = canvas.getByRole('separator')
    await waitFor(() =>
      expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    )

    expect(getComputedStyle(drawer).flexGrow).toBe('0')
    expect(drawer.style.height).toBe('160px')

    const drawerBox = drawer.getBoundingClientRect()
    expect(drawerBox.height).toBeGreaterThanOrEqual(160)
    expect(drawerBox.height).toBeLessThan(200)

    const block = canvasElement.querySelector<HTMLElement>('.layout__block')
    expect(block).toBeInTheDocument()
    if (block) expect(getComputedStyle(block).flexGrow).toBe('1')

    const layoutWidth = layout.getBoundingClientRect().width

    canvasElement
      .querySelectorAll<HTMLElement>('.layout__block, .drawer')
      .forEach((child) =>
        expect(child.getBoundingClientRect().width).toBeLessThanOrEqual(
          layoutWidth
        )
      )
  },
}

export const TwoColumns: Story = {
  args: {
    id: 'two-column-layout',
    isFullWidth: true,
    isFullHeight: true,
    column: [
      {
        node: (
          <SamplePanel
            title="Navigation"
            content="This is the left sidebar with navigation elements. In responsive mode (≤460px), this becomes the top section with a bottom border."
          />
        ),
        typeModifier: 'FIXED',
        fixedWidth: '280px',
      },
      {
        node: (
          <SamplePanel
            title="Main Content"
            content="This is the main content area that takes up the remaining space. It adapts automatically to different screen sizes."
          />
        ),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'A typical two-column layout with a fixed sidebar and flexible main content. The layout becomes vertical on small screens (≤460px).',
      },
    },
  },
}

export const ThreeColumns: Story = {
  args: {
    id: 'three-column-layout',
    isFullWidth: true,
    isFullHeight: true,
    column: [
      {
        node: <SampleNavigation />,
        typeModifier: 'FIXED',
        fixedWidth: '200px',
      },
      {
        node: (
          <SamplePanel
            title="Content"
            content="Main content area with flexible width that adapts to available space."
          />
        ),
      },
      {
        node: <SampleForm />,
        typeModifier: 'FIXED',
        fixedWidth: '300px',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'A three-column layout with two fixed sidebars and a flexible center content area. Notice how borders adapt in responsive mode.',
      },
    },
  },
}
