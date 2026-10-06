import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import KeyboardShortcutItem from '@components/lists/keyboard-shortcut-item/KeyboardShortcutItem'

const meta = {
  title: 'Components/Lists/Keyboard Shortcut Item',
  component: KeyboardShortcutItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    shortcuts: { control: 'object' },
  },
  render: (args) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <KeyboardShortcutItem {...args} />
    </ul>
  ),
} satisfies Meta<typeof KeyboardShortcutItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Save',
    shortcuts: [['↩ Enter']],
    separator: '',
  },
  argTypes: {
    separator: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(args.label)).toBeInTheDocument()
    await expect(canvas.getByText('↩ Enter')).toBeInTheDocument()
  },
}

export const Combo: Story = {
  args: {
    label: 'Select previous',
    shortcuts: [['⇧', '⇥ Tab']],
    separator: '',
  },
  argTypes: {
    separator: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(args.label)).toBeInTheDocument()
    await expect(canvas.getByText('⇧')).toBeInTheDocument()
    await expect(canvas.getByText('⇥ Tab')).toBeInTheDocument()
  },
}

export const MultipleCombos: Story = {
  args: {
    label: 'Select previous',
    shortcuts: [['⇧', '⇥ Tab'], ['⇥ Tab']],
    separator: 'or',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(args.label)).toBeInTheDocument()
    await expect(canvas.getByText('or')).toBeInTheDocument()
    await expect(canvas.getAllByText('⇥ Tab')).toHaveLength(2)
    await expect(canvas.getByText('⇧')).toBeInTheDocument()
  },
}
