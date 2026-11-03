import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, fireEvent, waitFor, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import ColorPicker from '@components/inputs/color-picker/ColorPicker'

const meta = {
  title: 'Components/Inputs/Color Picker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: '#87ebe7',
    onChange: fn(),
    onChangeEnd: fn(),
  },
  argTypes: {
    value: { control: 'color' },
    onChange: { control: false },
    onChangeEnd: { control: false },
  },
  render: (args) => {
    const [, updateArgs] = useArgs<{ value: string }>()

    return (
      <ColorPicker
        {...args}
        onChange={(value) => {
          updateArgs({ value })
          args.onChange?.(value)
        }}
      />
    )
  },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const picker = canvas.getByRole('group', { name: 'Color picker' })
    await expect(picker).toBeInTheDocument()

    const sliders = canvas.getAllByRole('slider')
    await expect(sliders).toHaveLength(2)

    // Hue slider: arrow keys nudge the hue and emit a new hex code
    sliders[1].focus()
    await expect(sliders[1]).toHaveFocus()
    // react-colorful reads the legacy keyCode, which user-event leaves at 0
    fireEvent.keyDown(sliders[1], { key: 'ArrowRight', keyCode: 39 })

    // react-colorful reports changes from an effect, hence the waitFor
    await waitFor(() => expect(args.onChange).toHaveBeenCalled())
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.stringMatching(/^#[0-9a-f]{6}$/)
    )
  },
}

export const Fluid: Story = {
  args: {
    isFlex: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const picker = canvas.getByRole('group', { name: 'Color picker' })
    await expect(picker).toHaveClass('color-picker--flex')
  },
}
