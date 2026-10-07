import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within } from 'storybook/test'
import FormItem from '@components/slots/form-item/FormItem'
import DraggableItem from '@components/lists/draggable-item/DraggableItem'
import Input from '@components/inputs/input/Input'
import Button from '@components/actions/button/Button'

const meta = {
  title: 'Components/Lists/Draggable Item',
  component: DraggableItem,
  decorators: [
    (Story) => (
      <div style={{ width: '296px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  args: {
    id: '000000',
    index: 0,
    primarySlot: (
      <div className="draggable-item__param">
        <Input
          type="COLOR"
          value="#FF0000"
        />
      </div>
    ),
    selected: false,
    guideAbove: false,
    guideBelow: false,
    onCancelSelection: fn(),
    onChangeOrder: fn(),
    onRemove: fn(),
    onChangeSelection: fn(),
    onDragChange: fn(),
    onDropOutside: fn(),
  },
  argTypes: {
    id: { control: false },
    index: { control: false },
    primarySlot: { control: false },
    secondarySlot: { control: false },
    actionsSlot: { control: false },
    onCancelSelection: { control: false },
    onChangeOrder: { control: false },
    onRemove: { control: false },
    onChangeSelection: { control: false },
    onDragChange: { control: false },
    onDropOutside: { control: false },
  },
  render: (args) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <DraggableItem {...args} />
    </ul>
  ),
} satisfies Meta<typeof DraggableItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    actionsSlot: (
      <Button
        type="icon"
        icon="visible"
        helper={{ label: 'Toggle visibility' }}
        action={fn()}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByLabelText('Hex color code')).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: /Toggle visibility/i })
    ).toBeInTheDocument()
  },
}

export const Rich: Story = {
  args: {
    secondarySlot: {
      title: 'More options',
      node: (
        <FormItem
          label="Description"
          id="type-description"
        >
          <Input
            id="type-description"
            type="LONG_TEXT"
            placeholder="Type something"
          />
        </FormItem>
      ),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByLabelText('Hex color code')).toBeInTheDocument()
  },
}
