import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import Knob from '@components/actions/knob/Knob'

const meta = {
  title: 'Components/Actions/Knob',
  component: Knob,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: '320px',
          height: '64px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    id: 'knob-1',
    shortId: 'A',
    value: 50,
    offset: 50,
    min: '0',
    max: '100',
    helper: { label: 'Drag to change the value', type: 'SINGLE_LINE' },
    canBeTyped: true,
    isDisplayed: false,
    isBlocked: false,
    isDisabled: false,
    onMouseDown: fn(),
    onBlock: fn(),
    onShiftRight: fn(),
    onShiftLeft: fn(),
    onDelete: fn(),
    onValidStopValue: fn(),
  },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    offset: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    style: { control: false },
    onMouseDown: { control: false },
    onBlock: { control: false },
    onShiftRight: { control: false },
    onShiftLeft: { control: false },
    onDelete: { control: false },
    onValidStopValue: { control: false },
  },
} satisfies Meta<typeof Knob>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  argTypes: {
    id: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const knob = canvas.getByRole('slider')

    await expect(knob).toHaveAttribute('aria-valuenow', '50')

    await userEvent.pointer({ keys: '[MouseLeft>]', target: knob })
    await expect(args.onMouseDown).toHaveBeenCalledTimes(1)

    knob.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowLeft}{Backspace}')
    await expect(args.onShiftRight).toHaveBeenCalledTimes(1)
    await expect(args.onShiftLeft).toHaveBeenCalledTimes(1)
    await expect(args.onDelete).toHaveBeenCalledTimes(1)

    await userEvent.dblClick(knob)
    await expect(canvas.getByRole('spinbutton')).toBeInTheDocument()
  },
}
