import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, fireEvent } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import SegmentedControl from '@components/actions/segmented-control/SegmentedControl'

const meta = {
  title: 'Components/Actions/Segmented Control',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
  },
  args: {
    action: fn(),
    isBlocked: false,
    isNew: false,
  },
  argTypes: {
    action: { control: false },
    items: { control: 'object' },
    active: { control: 'select' },
  },
  // Keeps `active` in sync with the clicked segment, like a consumer would.
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{ active: string }>()

    const onChange = (e: React.MouseEvent & React.KeyboardEvent) => {
      updateArgs({
        active: (e.currentTarget as HTMLElement).dataset.feature,
      })
      args.action(e)
    }

    return (
      <SegmentedControl
        {...args}
        active={argsState.active}
        action={onChange}
      />
    )
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      {
        id: 'LIST',
        icon: { type: 'PICTO', name: 'list' },
        helper: { label: 'List', pin: 'BOTTOM' },
      },
      {
        id: 'TILE',
        icon: { type: 'PICTO', name: 'list-tile' },
        helper: { label: 'Tile', pin: 'BOTTOM' },
      },
    ],
    active: 'LIST',
  },
  argTypes: {
    active: { options: ['LIST', 'TILE'] },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('tab')

    await expect(items).toHaveLength(2)

    fireEvent.mouseDown(items[1])
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const ManyItems: Story = {
  args: {
    items: [
      {
        id: 'ALIGN_LEFT',
        icon: { type: 'PICTO', name: 'layout-align-left' },
        helper: { label: 'Left', pin: 'BOTTOM' },
      },
      {
        id: 'ALIGN_H_CENTER',
        icon: { type: 'PICTO', name: 'layout-align-horizontal-centers' },
        helper: { label: 'Center H', pin: 'BOTTOM' },
      },
      {
        id: 'ALIGN_RIGHT',
        icon: { type: 'PICTO', name: 'layout-align-right' },
        helper: { label: 'Right', pin: 'BOTTOM' },
      },
      {
        id: 'ALIGN_TOP',
        icon: { type: 'PICTO', name: 'layout-align-top' },
        helper: { label: 'Top', pin: 'BOTTOM' },
      },
      {
        id: 'ALIGN_V_CENTER',
        icon: { type: 'PICTO', name: 'layout-align-vertical-centers' },
        helper: { label: 'Center V', pin: 'BOTTOM' },
        isDisabled: true,
      },
    ],
    active: 'ALIGN_LEFT',
  },
  argTypes: {
    active: {
      options: [
        'ALIGN_LEFT',
        'ALIGN_H_CENTER',
        'ALIGN_RIGHT',
        'ALIGN_TOP',
        'ALIGN_V_CENTER',
      ],
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('tab')

    await expect(items).toHaveLength(5)
    await expect(items[4]).toHaveAttribute('aria-disabled', 'true')

    fireEvent.mouseDown(items[3])
    await expect(args.action).toHaveBeenCalledTimes(1)

    fireEvent.mouseDown(items[4])
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}
