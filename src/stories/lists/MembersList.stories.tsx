import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import MembersList from '@components/lists/members-list/MembersList'

const avatar = (color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${color}"/></svg>`
  )}`

const members = [
  { avatar: avatar('#e07a5f'), fullName: 'John Doe' },
  { avatar: avatar('#3d405b'), fullName: 'Jane Smith' },
  { avatar: avatar('#81b29a'), fullName: 'Bob Johnson' },
  { avatar: avatar('#f2cc8f'), fullName: 'Alice Williams' },
  { avatar: avatar('#8d99ae'), fullName: 'Charlie Brown' },
]

const meta = {
  title: 'Components/Lists/Members List',
  component: MembersList,
  parameters: {
    layout: 'centered',
  },
  args: {
    members,
    numberOfAvatarsDisplayed: 3,
    isInverted: false,
  },
  argTypes: {
    members: { control: 'object' },
    numberOfAvatarsDisplayed: {
      control: { type: 'range', min: 1, max: members.length, step: 1 },
    },
  },
} satisfies Meta<typeof MembersList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const list = canvas.getAllByRole('list')[0]

    await expect(within(list).getAllByRole('listitem').length).toBeGreaterThan(
      args.numberOfAvatarsDisplayed
    )
    await expect(canvas.getByText(/\+2/)).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: {
    members: [],
  },
  argTypes: {
    numberOfAvatarsDisplayed: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
  },
}
