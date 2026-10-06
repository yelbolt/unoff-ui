import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import texts from '@styles/texts/texts.module.scss'
import FormItem from '@components/slots/form-item/FormItem'
import Input from '@components/inputs/input/Input'

const meta = {
  title: 'Patterns/Slots/Form Item',
  component: FormItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    shouldFill: false,
    isMultiLine: false,
    isBlocked: false,
    isNew: false,
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof FormItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'simple-text-item',
    label: 'Information',
    helper: {
      type: 'INFO',
      message: 'This is a read-only information field',
    },
    isBaseline: true,
    children: (
      <span className={texts.type}>
        This is a simple text content inside the form item
      </span>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Information')).toBeInTheDocument()
    await expect(
      canvas.getByText('This is a simple text content inside the form item')
    ).toBeInTheDocument()
  },
}

export const WithInput: Story = {
  args: {
    id: 'text-input-item',
    label: 'Type your name',
    helper: {
      type: 'INFO',
      message: 'First name followed by your last name',
    },
    children: (
      <Input
        id="text-input-item"
        type="TEXT"
        value=""
        placeholder="Type your name"
      />
    ),
  },
  argTypes: {
    isBaseline: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByPlaceholderText('Type your name')).toBeVisible()
  },
}
