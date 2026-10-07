import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import { iconList } from '@tps/icon.types'
import Button from '@components/actions/button/Button'

const icons = [...iconList]

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 'default',
    isAutofocus: false,
    isLoading: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
    action: fn(),
    onBlock: fn(),
  },
  argTypes: {
    action: { control: false },
    onBlock: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    type: 'primary',
    label: 'Primary action button',
    feature: 'PRIMARY_ACTION',
    hasMultipleActions: false,
    preview: {
      image: 'https://placehold.co/96x96',
      text: 'Shown on the chip when the button is blocked.',
    },
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    state: { control: false },
    isLink: { control: false },
    url: { control: false },
    iconClassName: { control: false },
    customIcon: { control: false },
    helper: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: /Primary action button/i,
    })

    await expect(button).toBeInTheDocument()
    await userEvent.click(button)
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const Secondary: Story = {
  args: {
    type: 'secondary',
    label: 'Secondary action button',
    feature: 'SECONDARY_ACTION',
    hasMultipleActions: false,
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    state: { control: false },
    isLink: { control: false },
    url: { control: false },
    iconClassName: { control: false },
    customIcon: { control: false },
    helper: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: /Secondary action button/i,
    })

    await expect(button).toBeInTheDocument()
    await userEvent.click(button)
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const Tertiary: Story = {
  args: {
    type: 'tertiary',
    label: 'Tertiary action button',
    feature: 'TERTIARY_ACTION',
    isLink: false,
    url: 'https://example.com',
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    state: { control: false },
    hasMultipleActions: { control: false },
    iconClassName: { control: false },
    customIcon: { control: false },
    helper: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: /Tertiary action button/i,
    })

    await expect(button).toBeInTheDocument()
    await userEvent.click(button)
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const Destructive: Story = {
  args: {
    type: 'destructive',
    label: 'Destructive action button',
    feature: 'DESTRUCTIVE_ACTION',
    hasMultipleActions: false,
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    state: { control: false },
    isLink: { control: false },
    url: { control: false },
    iconClassName: { control: false },
    customIcon: { control: false },
    helper: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: /Destructive action button/i,
    })

    await expect(button).toBeInTheDocument()
    await userEvent.click(button)
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const Alternative: Story = {
  args: {
    type: 'alternative',
    icon: 'lock-on',
    label: 'Compact action button',
    feature: 'ALTERNATIVE_ACTION',
  },
  argTypes: {
    type: { control: false },
    icon: { control: 'select', options: icons },
    state: { control: false },
    hasMultipleActions: { control: false },
    isLoading: { control: false },
    isLink: { control: false },
    url: { control: false },
    helper: { control: false },
    iconClassName: { control: false },
    customIcon: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: /Compact action button/i,
    })

    await expect(button).toBeInTheDocument()
    await expect(canvas.getByRole('img', { hidden: true })).toBeInTheDocument()
    await userEvent.click(button)
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}

export const Icon: Story = {
  args: {
    type: 'icon',
    state: 'default',
    icon: 'adjust',
    helper: { label: 'Adjust the parameters' },
    feature: 'ICON_ACTION',
  },
  argTypes: {
    type: { control: false },
    icon: { control: 'select', options: icons },
    label: { control: false },
    hasMultipleActions: { control: false },
    isLink: { control: false },
    url: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: /Adjust the parameters/i,
    })

    await expect(button).toBeInTheDocument()
    await expect(canvas.getByRole('img', { hidden: true })).toBeInTheDocument()

    await userEvent.hover(button)
    await expect(
      within(document.body).getByText('Adjust the parameters')
    ).toBeInTheDocument()

    await userEvent.unhover(button)
    await userEvent.click(button)
    await expect(args.action).toHaveBeenCalledTimes(1)
  },
}
