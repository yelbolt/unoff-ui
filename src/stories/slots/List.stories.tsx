import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within } from 'storybook/test'
import List from '@components/slots/list/List'
import ActionsItem from '@components/lists/actions-item/ActionsItem'
import SemanticMessage from '@components/dialogs/semantic-message/SemanticMessage'
import Button from '@components/actions/button/Button'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#cfd4dc"/></svg>'
)}`

const meta = {
  title: 'Patterns/Slots/List',
  component: List,
  decorators: [
    (Story) => (
      <div style={{ width: '296px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: [1, 2, 3].map((n) => (
      <ActionsItem
        key={n}
        id={`Action item ${n}`}
        name={`Action item ${n}`}
        description={`Description of the action item ${n}`}
        subdescription={`Subdescription of the action item ${n}`}
        user={{ avatar, name: 'John Doe' }}
        actionsSlot={
          <Button
            type="icon"
            icon="plus"
            helper={{ label: `Add item ${n}` }}
            action={fn()}
          />
        }
      />
    )),
    isTopBorderEnabled: true,
  },
  argTypes: {
    padding: { control: false },
    isLoading: { control: false },
    isMessage: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText(/^Action item \d$/)).toHaveLength(3)
  },
}

export const Message: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '296px', height: '296px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    children: (
      <li>
        <SemanticMessage
          type="ERROR"
          message="This is an error message"
        />
      </li>
    ),
    isMessage: true,
  },
  argTypes: {
    padding: { control: false },
    isTopBorderEnabled: { control: false },
    isLoading: { control: false },
    isMessage: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('This is an error message')).toBeVisible()
  },
}

export const Loading: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '296px', height: '296px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    isLoading: true,
  },
  argTypes: {
    children: { control: false },
    padding: { control: false },
    isTopBorderEnabled: { control: false },
    isLoading: { control: false },
    isMessage: { control: false },
  },
}
