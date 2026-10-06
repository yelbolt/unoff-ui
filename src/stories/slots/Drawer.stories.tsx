import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within } from 'storybook/test'
import { useArgs, useRef } from 'storybook/preview-api'
import Drawer from '@components/slots/drawer/Drawer'
import Button from '@components/actions/button/Button'

const meta = {
  title: 'Patterns/Slots/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    id: 'simple-drawer',
    direction: 'VERTICAL',
    pin: 'BOTTOM',
    border: ['TOP'],
    defaultSize: { value: 100, unit: 'PIXEL' },
    maxSize: { value: 300, unit: 'PIXEL' },
    minSize: { value: 40, unit: 'PIXEL' },
    isScrolling: false,
    onExpand: fn(),
    onCollapse: fn(),
  },
  argTypes: {
    children: { control: false },
    border: { control: false },
    onExpand: { control: false },
    onCollapse: { control: false },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const drawerRef = useRef<Drawer | null>(null)
    const [argsState, updateArgs] = useArgs<{ isCollapsed: boolean }>()

    const toggleDrawer = () => {
      if (argsState.isCollapsed) drawerRef.current?.expandDrawer()
      else drawerRef.current?.collapseDrawer()
    }

    const borderBySide = { TOP: 'BOTTOM', RIGHT: 'LEFT' } as const

    return (
      <div
        style={{
          height: '100vh',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: args.direction === 'VERTICAL' ? 'column' : 'row',
          justifyContent:
            args.pin === 'TOP' || args.pin === 'LEFT' ? 'start' : 'end',
        }}
      >
        <Drawer
          ref={drawerRef}
          {...args}
          border={[
            borderBySide[args.pin as keyof typeof borderBySide] ?? args.pin,
          ]}
          onExpand={() => {
            updateArgs({ isCollapsed: false })
            args.onExpand?.()
          }}
          onCollapse={() => {
            updateArgs({ isCollapsed: true })
            args.onCollapse?.()
          }}
        >
          <Button
            type="icon"
            icon={argsState.isCollapsed ? 'upward' : 'downward'}
            helper={{ label: 'Toggle the drawer' }}
            action={toggleDrawer}
          />
        </Drawer>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('separator')).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: /Toggle the drawer/i })
    ).toBeInTheDocument()
  },
}
