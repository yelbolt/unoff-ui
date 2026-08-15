import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import SimpleSlider, {
  SimpleSliderGradientStop,
} from '@components/inputs/simple-slider/SimpleSlider'

const buildHueSweepStops = (
  steps: number,
  baseHue = 0
): SimpleSliderGradientStop[] =>
  Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1)
    const hue = Math.round((baseHue + t * 360) % 360)

    return { offset: t, color: `hsl(${hue}, 70%, 55%)` }
  })

const buildChromaSweepWithGamutStops = (
  steps: number
): SimpleSliderGradientStop[] =>
  Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1)
    const saturation = Math.round(t * 100)
    const lightness = 55

    return {
      offset: t,
      color: `hsl(210, ${saturation}%, ${lightness}%)`,
      outOfGamut: t > 0.7,
    }
  })

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
  args: {
    onBlock: fn(),
  },
  argTypes: {
    onBlock: { control: false },
  },
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

export const GradientTrack: Story = {
  args: {
    id: 'hue-shift',
    label: 'Hue shift',
    value: 0,
    min: -180,
    max: 180,
    step: 1,
    colors: undefined,
    gradient: {
      tracks: [buildHueSweepStops(12)],
    },
    hasProgressBar: false,
    hasPadding: true,
    feature: 'SHIFT_HUE',
    isBlocked: false,
    isDisabled: false,
    isNew: false,
    onChange: fn(),
  },
  argTypes: {
    feature: { control: false },
    gradient: { control: false },
  },
  render: AgeSelect.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const slider = canvas.getByRole('slider')
    await expect(slider).toBeInTheDocument()
  },
}

export const GradientWithOutOfGamut: Story = {
  args: {
    ...GradientTrack.args,
    id: 'chroma-shift',
    label: 'Chroma shift',
    value: 100,
    min: 0,
    max: 200,
    feature: 'SHIFT_CHROMA',
    gradient: {
      tracks: [buildChromaSweepWithGamutStops(12)],
    },
  },
  argTypes: {
    ...GradientTrack.argTypes,
  },
  render: AgeSelect.render,
  play: GradientTrack.play,
}

export const StackedGradientTracks: Story = {
  args: {
    ...GradientTrack.args,
    id: 'palette-hue-shift',
    label: 'Hue shift (multiple source colors)',
    gradient: {
      tracks: [
        buildHueSweepStops(10, 0),
        buildHueSweepStops(10, 140),
        buildHueSweepStops(10, 260),
      ],
    },
  },
  argTypes: {
    ...GradientTrack.argTypes,
  },
  render: AgeSelect.render,
  play: GradientTrack.play,
}
