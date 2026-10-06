import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within } from 'storybook/test'
import InputsBar from '@components/inputs/inputs-bar/InputsBar'
import Input from '@components/inputs/input/Input'

const Inputs = () => (
  <>
    <Input
      type="NUMBER"
      value="134"
      min="0"
      max="360"
      feature="UPDATE_HUE"
      onFocus={fn()}
      onBlur={fn()}
      onShift={fn()}
    />
    <Input
      type="NUMBER"
      value="34"
      min="0"
      max="100"
      feature="UPDATE_LIGHTNESS"
      onFocus={fn()}
      onBlur={fn()}
      onShift={fn()}
    />
    <Input
      type="NUMBER"
      value="45"
      min="0"
      max="100"
      feature="UPDATE_CHROMA"
      onFocus={fn()}
      onBlur={fn()}
      onShift={fn()}
    />
  </>
)

const meta = {
  title: 'Components/Inputs/Inputs Bar',
  component: InputsBar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InputsBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'HSL',
    children: Inputs(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    if (args.label) {
      const label = canvas.getByText(args.label)
      await expect(label).toBeInTheDocument()
    }
    const inputs = canvas.getAllByRole('spinbutton')
    await expect(inputs.length).toBe(3)
  },
}
