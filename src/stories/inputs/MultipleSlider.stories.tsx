import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, waitFor, fireEvent } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import MultipleSlider from '@components/inputs/multiple-slider/MultipleSlider'

const meta: Meta<typeof MultipleSlider> = {
  title: 'Components/Inputs/Multiple Slider',
  component: MultipleSlider,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
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
}

export default meta
type Story = StoryObj<typeof MultipleSlider>

export const TripleValues: Story = {
  args: {
    type: 'EDIT',
    scale: {
      '0': 0,
      '1': 50,
      '2': 100,
    },
    distributionEasing: 'LINEAR',
    stops: {
      list: [0, 1, 2],
      min: 3,
      max: 3,
    },
    range: {
      min: 0,
      max: 100,
      step: 0.1,
    },
    colors: {
      min: '#FF0000',
      max: '#0000FF',
    },
    hasPadding: true,
    tips: {
      minMax: 'Shift: distribute\nCmd/Ctrl: link',
    },
    isBlocked: false,
    isNew: false,
    onChange: fn(),
  },
  argTypes: {
    type: { control: false },
    distributionEasing: {
      control: 'select',
      options: [
        'LINEAR',
        'EASEIN_SINE',
        'EASEOUT_SINE',
        'EASEINOUT_SINE',
        'EASEIN_QUAD',
        'EASEOUT_QUAD',
        'EASEINOUT_QUAD',
        'EASEIN_CUBIC',
        'EASEOUT_CUBIC',
        'EASEINOUT_CUBIC',
      ],
    },
  },
  render: (args) => {
    const [{ scale, stops }, updateArgs] = useArgs()

    const onChange = (
      state: 'TYPED' | 'UPDATING' | 'RELEASED' | 'SHIFTED',
      results: { scale: Record<string, number>; stops?: Array<number> },
      feature?: string
    ) => {
      updateArgs({ scale: results.scale })

      if (results.stops)
        updateArgs({
          stops: {
            ...stops,
            list: results.stops,
          },
        })

      args.onChange?.(state, results, feature)
    }

    return (
      <MultipleSlider
        {...args}
        scale={scale}
        stops={stops}
        onChange={onChange}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const sliders = canvas.getAllByRole('slider')
    await expect(sliders.length).toBeGreaterThan(0)

    const firstKnob = sliders[0]
    await expect(firstKnob).toBeInTheDocument()
    await expect(firstKnob).toHaveAttribute('aria-valuenow', '0')

    const knobRect = firstKnob.getBoundingClientRect()
    const startX = knobRect.left + knobRect.width / 2
    const startY = knobRect.top + knobRect.height / 2

    fireEvent.mouseDown(firstKnob, {
      clientX: startX,
      clientY: startY,
      bubbles: true,
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    fireEvent(
      document,
      new MouseEvent('mousemove', {
        clientX: startX + 50,
        clientY: startY,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    fireEvent(
      document,
      new MouseEvent('mouseup', {
        clientX: startX + 50,
        clientY: startY,
        bubbles: true,
        cancelable: true,
      })
    )

    await waitFor(
      () => {
        expect(args.onChange).toHaveBeenCalled()
      },
      { timeout: 2000 }
    )
  },
}

export const EditingValues: Story = {
  args: {
    ...TripleValues.args,
    type: 'FULLY_EDIT',
    scale: {
      '10': 0,
      '20': 25,
      '30': 50,
      '40': 75,
      '50': 100,
    },
    stops: {
      list: [0, 1, 2, 3, 4],
      min: 2,
      max: 7,
    },
  },
  argTypes: {
    ...TripleValues.argTypes,
  },
  render: TripleValues.render,
  play: TripleValues.play,
}

export const Progressive: Story = {
  args: {
    ...TripleValues.args,
    type: 'FULLY_EDIT',
    hasProgressBar: true,
    scale: {
      '10': 25,
      '20': 50,
      '30': 75,
    },
    stops: {
      list: [0, 1, 2],
      min: 2,
      max: 8,
    },
    colors: undefined,
  },
  argTypes: {
    ...TripleValues.argTypes,
  },
  render: TripleValues.render,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const sliders = canvas.getAllByRole('slider')
    await expect(sliders.length).toBeGreaterThan(0)

    const firstKnob = sliders[0]
    await expect(firstKnob).toBeInTheDocument()
    await expect(firstKnob).toHaveAttribute('aria-valuenow', '25')

    const knobRect = firstKnob.getBoundingClientRect()
    const startX = knobRect.left + knobRect.width / 2
    const startY = knobRect.top + knobRect.height / 2

    fireEvent.mouseDown(firstKnob, {
      clientX: startX,
      clientY: startY,
      bubbles: true,
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    fireEvent(
      document,
      new MouseEvent('mousemove', {
        clientX: startX + 50,
        clientY: startY,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    fireEvent(
      document,
      new MouseEvent('mouseup', {
        clientX: startX + 50,
        clientY: startY,
        bubbles: true,
        cancelable: true,
      })
    )

    await waitFor(
      () => {
        expect(args.onChange).toHaveBeenCalled()
      },
      { timeout: 2000 }
    )
  },
}
