import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within } from 'storybook/test'
import SimpleItem from '@components/slots/simple-item/SimpleItem'
import Input from '@components/inputs/input/Input'
import Button from '@components/actions/button/Button'

const meta = {
  title: 'Patterns/Slots/Simple Item',
  component: SimpleItem,
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
  argTypes: {
    id: { control: false },
    leftPartSlot: { control: false },
    rightPartSlot: { control: false },
  },
} satisfies Meta<typeof SimpleItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: '000000',
    leftPartSlot: (
      <div className="draggable-item__param">
        <Input
          type="COLOR"
          value="#FF0000"
        />
      </div>
    ),
    rightPartSlot: (
      <Button
        type="icon"
        icon="visible"
        helper={{ label: 'Toggle visibility' }}
        action={fn()}
      />
    ),
    isListItem: false,
    alignment: 'CENTER',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByLabelText('Hex color code')).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: /Toggle visibility/i })
    ).toBeInTheDocument()
  },
}
