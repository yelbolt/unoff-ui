import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import SimpleSlider from '@components/inputs/simple-slider/SimpleSlider'

const meta: Meta<typeof SimpleSlider> = {
  title: 'Components/Inputs/Simple Slider',
  component: SimpleSlider,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        id="dropdown-container"
        style={{
          width: '400px',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SimpleSlider>

export default meta
type Story = StoryObj<typeof meta>

export const AgeSelect: Story = {
  args: {
    id: 'age',
    label: 'Age',
    value: 25,
    min: 10,
    max: 90,
    step: 1,
    hasProgressBar: true,
    hasPadding: true,
    feature: 'PICK_AGE',
    isBlocked: false,
    isDisabled: false,
    isNew: false,
    onChange: fn(),
  },
  argTypes: {
    feature: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      value: number
    }>()

    const onChange = (_feature: string, _state: string, value: number) => {
      updateArgs({
        value: value,
      })
      args.onChange?.(_feature, _state, value)
    }

    return (
      <SimpleSlider
        {...args}
        value={argsState.value}
        onChange={onChange}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const slider = canvas.getByRole('slider')
    await expect(slider).toBeInTheDocument()
    await expect(slider).toHaveAttribute('aria-valuenow', '25')
    await expect(slider).toHaveAttribute('aria-valuemin', '10')
    await expect(slider).toHaveAttribute('aria-valuemax', '90')

    const label = canvas.getByText('Age')
    await expect(label).toBeInTheDocument()

    slider.focus()
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{ArrowRight}')

    await expect(args.onChange).toHaveBeenCalled()
  },
}
