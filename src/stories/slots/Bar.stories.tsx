import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { doClassnames } from '@unoff/utils'
import texts from '@styles/texts/texts.module.scss'
import Bar from '@components/slots/bar/Bar'

const part = (content: string, isTruncated = false) => (
  <div
    className={doClassnames([
      texts.type,
      isTruncated && texts['type--truncated'],
    ])}
  >
    {content}
  </div>
)

const meta = {
  title: 'Patterns/Slots/Bar',
  component: Bar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    border: ['BOTTOM'],
    isVertical: false,
  },
  argTypes: {
    leftPartSlot: { control: false },
    soloPartSlot: { control: false },
    rightPartSlot: { control: false },
  },
} satisfies Meta<typeof Bar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    leftPartSlot: part('Left Part'),
    rightPartSlot: part('Right Part'),
  },
  argTypes: {
    clip: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Left Part')).toBeInTheDocument()
    await expect(canvas.getByText('Right Part')).toBeInTheDocument()
  },
}

export const Truncated: Story = {
  args: {
    leftPartSlot: part('Left: long text — should be truncated.', true),
    rightPartSlot: part(
      'Right: another long text — should be truncated.',
      true
    ),
    clip: ['LEFT', 'RIGHT'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(/^Left: long text/)).toBeInTheDocument()
    await expect(canvas.getByText(/^Right: another/)).toBeInTheDocument()
  },
}
