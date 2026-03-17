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
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

const renderWithState = (
  args: React.ComponentProps<typeof SegmentedControl>
) => {
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
}

export const TwoItems: Story = {
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
  render: renderWithState,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const items = canvas.getAllByRole('tab')
    await expect(items).toHaveLength(2)
    await expect(items[0]).toBeInTheDocument()

    fireEvent.mouseDown(items[1])
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const ThreeItems: Story = {
  args: {
    items: [
      {
        id: 'GRID_COLUMNS',
        icon: { type: 'PICTO', name: 'layout-grid-columns' },
        helper: { label: 'Columns', pin: 'BOTTOM' },
      },
      {
        id: 'GRID_ROWS',
        icon: { type: 'PICTO', name: 'layout-grid-rows' },
        helper: { label: 'Rows', pin: 'BOTTOM' },
      },
      {
        id: 'GRID_UNIFORM',
        icon: { type: 'PICTO', name: 'layout-grid-uniform' },
        helper: { label: 'Uniform', pin: 'BOTTOM' },
      },
    ],
    active: 'GRID_COLUMNS',
  },
  argTypes: {
    active: { options: ['GRID_COLUMNS', 'GRID_ROWS', 'GRID_UNIFORM'] },
  },
  render: renderWithState,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const items = canvas.getAllByRole('tab')
    await expect(items).toHaveLength(3)
    await expect(items[0]).toBeInTheDocument()

    fireEvent.mouseDown(items[1])
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const FourItems: Story = {
  args: {
    items: [
      {
        id: 'ALIGN_LEFT',
        icon: { type: 'PICTO', name: 'layout-align-left' },
        helper: { label: 'Left', pin: 'BOTTOM' },
      },
      {
        id: 'ALIGN_CENTER',
        icon: { type: 'PICTO', name: 'layout-align-horizontal-centers' },
        helper: { label: 'Center', pin: 'BOTTOM' },
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
    ],
    active: 'ALIGN_LEFT',
  },
  argTypes: {
    active: {
      options: ['ALIGN_LEFT', 'ALIGN_CENTER', 'ALIGN_RIGHT', 'ALIGN_TOP'],
    },
  },
  render: renderWithState,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const items = canvas.getAllByRole('tab')
    await expect(items).toHaveLength(4)
    await expect(items[0]).toBeInTheDocument()

    fireEvent.mouseDown(items[2])
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const FiveItems: Story = {
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
  render: renderWithState,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const items = canvas.getAllByRole('tab')
    await expect(items).toHaveLength(5)
    await expect(items[0]).toBeInTheDocument()

    fireEvent.mouseDown(items[3])
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}
