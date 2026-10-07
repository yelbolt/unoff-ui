import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within } from 'storybook/test'
import ActionsItem from '@components/lists/actions-item/ActionsItem'
import Button from '@components/actions/button/Button'

const thumbnail = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#cfd4dc"/></svg>'
)}`

const meta = {
  title: 'Components/Lists/Actions Item',
  component: ActionsItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    id: '000000',
    name: 'Action name',
    indicator: {
      label: 'New',
      status: 'ACTIVE',
    },
    description:
      'Lorem ipsum odor amet, consectetuer adipiscing elit. Justo aenean aptent nostra arcu sit sagittis ipsum gravida.',
    subdescription:
      'Justo aenean aptent nostra arcu sit sagittis ipsum gravida.',
    isInteractive: false,
    action: fn(),
  },
  argTypes: {
    action: { control: false },
    actionsSlot: { control: false },
    complementSlot: { control: false },
  },
  render: (args) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <ActionsItem {...args} />
    </ul>
  ),
} satisfies Meta<typeof ActionsItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: thumbnail,
    user: {
      avatar: thumbnail,
      name: 'John Doe',
    },
    actionsSlot: (
      <Button
        type="icon"
        icon="adjust"
        helper={{ label: 'Adjust' }}
      />
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(args.name)).toBeInTheDocument()
    await expect(canvas.getByText(args.description!)).toBeInTheDocument()
    await expect(canvas.getByText('John Doe')).toBeInTheDocument()
    await expect(canvas.getAllByRole('button')).toHaveLength(1)
  },
}

export const WithActions: Story = {
  args: {
    src: thumbnail,
    user: {
      avatar: thumbnail,
      name: 'John Doe',
    },
    actionsSlot: (
      <>
        <Button
          type="icon"
          icon="adjust"
          helper={{ label: 'Adjust' }}
        />
        <Button
          type="secondary"
          label="Add to file"
        />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('button')).toHaveLength(2)
    await expect(
      canvas.getByRole('button', { name: /Add to file/i })
    ).toBeInTheDocument()
  },
}

export const Minimal: Story = {
  args: {
    complementSlot: (
      <div style={{ display: 'flex', gap: 'var(--scale-pos-xxsmall)' }}>
        {['yellow', 'red'].map((color) => (
          <div
            key={color}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '2px',
              outline: '1px solid rgba(0, 0, 0, 0.1)',
              outlineOffset: '-1px',
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    ),
  },
  argTypes: {
    src: { control: false },
    user: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(args.name)).toBeInTheDocument()
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
    await expect(canvas.queryAllByRole('button')).toHaveLength(0)
    await expect(canvas.getByRole('complementary')).toBeInTheDocument()
  },
}
