import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import texts from '@styles/texts/texts.module.scss'
import FormItem from '@components/slots/form-item/FormItem'
import Select from '@components/inputs/select/Select'
import Input from '@components/inputs/input/Input'
import Dropdown from '@components/inputs/dropdown/Dropdown'

const ID = 'form-item-content'

const CONTENTS = {
  Text: (
    <span className={texts.type}>
      This is a simple text content inside the form item
    </span>
  ),
  Input: (
    <Input
      id={ID}
      type="TEXT"
      value=""
      placeholder="Type your name"
    />
  ),
  LongText: (
    <Input
      id={ID}
      type="LONG_TEXT"
      value=""
      placeholder="Type a longer text"
    />
  ),
  Number: (
    <Input
      id={ID}
      type="NUMBER"
      value="10"
      min="0"
      max="100"
    />
  ),
  Switch: (
    <Select
      id={ID}
      type="SWITCH_BUTTON"
      label="Enable option"
      isChecked={false}
      action={() => undefined}
    />
  ),
  Dropdown: (
    <Dropdown
      id={ID}
      selected="a"
      options={[
        { type: 'OPTION', label: 'Option A', value: 'a' },
        { type: 'OPTION', label: 'Option B', value: 'b' },
      ]}
    />
  ),
}

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
    id: ID,
    label: 'Label',
    children: 'Input' as unknown as React.ReactNode,
  },
  argTypes: {
    children: {
      control: 'select',
      options: Object.keys(CONTENTS),
      mapping: CONTENTS,
    },
  },
} satisfies Meta<typeof FormItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Information',
    helper: {
      type: 'INFO',
      message: 'This is a read-only information field',
    },
    isBaseline: true,
    children: 'Text' as unknown as React.ReactNode,
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
    label: 'Type your name',
    helper: {
      type: 'INFO',
      message: 'First name followed by your last name',
    },
    children: 'Input' as unknown as React.ReactNode,
  },
  argTypes: {
    isBaseline: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByPlaceholderText('Type your name')).toBeVisible()
  },
}
