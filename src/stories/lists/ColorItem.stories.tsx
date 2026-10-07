import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within } from 'storybook/test'
import ColorItem from '@components/lists/color-item/ColorItem'

const meta = {
  title: 'Components/Lists/Color Item',
  component: ColorItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    onRemoveColor: fn(),
  },
  argTypes: {
    onRemoveColor: { control: false },
  },
} satisfies Meta<typeof ColorItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Primary',
    hex: '#87ebe7',
    id: '29f6b9bd-d6c7-4c1f-87fa-ea5bcf7a074c',
    canBeRemoved: false,
  },
  argTypes: {
    hex: { control: 'color' },
  },
  render: (args) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <ColorItem {...args} />
    </ul>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const colorName = canvas.getByText(args.name)
    await expect(colorName).toBeInTheDocument()
    const colorHex = canvas.getByText(args.hex.toUpperCase())
    await expect(colorHex).toBeInTheDocument()
  },
}
