import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, fireEvent, waitFor } from 'storybook/test'
import { useEffect, useState } from 'react'
import { iconList } from '@tps/icon.types'
import Input from '@components/inputs/input/Input'
import Button from '@components/actions/button/Button'
import Accordion from '@components/actions/accordion/Accordion'

const meta = {
  title: 'Components/Actions/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Section title',
    indicator: 7,
    helper: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: 'plus',
    isExpanded: false,
    isBlocked: false,
    isNew: false,
    children: (
      <Input
        type="TEXT"
        value="Some content"
        feature="EDIT_CONTENT"
      />
    ),
    onAdd: fn(),
    onEmpty: fn(),
    onBlock: fn(),
  },
  argTypes: {
    icon: { control: 'select', options: iconList },
    collapseIcon: { control: 'select', options: iconList },
    indicator: { control: 'text' },
    children: { control: false },
    onAdd: { control: false },
    onEmpty: { control: false },
    onBlock: { control: false },
  },
  // Toggles `isExpanded` the way a consumer would from onAdd / onEmpty, while
  // still following the `isExpanded` control.
  render: (args) => {
    const [isExpanded, setExpanded] = useState(args.isExpanded)

    useEffect(() => setExpanded(args.isExpanded), [args.isExpanded])

    const onToggle = (
      e: Parameters<typeof args.onAdd>[0] & Parameters<typeof args.onEmpty>[0]
    ) => {
      setExpanded(!isExpanded)
      if (isExpanded) args.onEmpty(e)
      else args.onAdd(e)
    }

    return (
      <Accordion
        {...args}
        isExpanded={isExpanded}
        onAdd={onToggle}
        onEmpty={onToggle}
      />
    )
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  argTypes: {
    actions: { control: false },
    collapseIcon: { control: false },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('region')).not.toBeInTheDocument()

    fireEvent.mouseDown(canvas.getByRole('button'))
    await waitFor(() => expect(canvas.getByRole('region')).toBeInTheDocument())
    await expect(args.onAdd).toHaveBeenCalledTimes(1)

    fireEvent.mouseDown(canvas.getAllByRole('button')[0])
    await waitFor(() =>
      expect(canvas.queryByRole('region')).not.toBeInTheDocument()
    )
    await expect(args.onEmpty).toHaveBeenCalledTimes(1)
  },
}

export const WithActions: Story = {
  args: {
    label: 'Accordion with actions',
    collapseIcon: 'caret-up',
    isExpanded: true,
    actions: (
      <>
        <Button
          type="icon"
          icon="copy"
          helper={{ label: 'Duplicate' }}
          action={fn()}
        />
        <Button
          type="icon"
          icon="trash"
          helper={{ label: 'Delete' }}
          action={fn()}
        />
      </>
    ),
  },
  argTypes: {
    actions: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Toggle + the two action buttons
    await expect(canvas.getAllByRole('button')).toHaveLength(3)
    await expect(
      canvas.getByRole('button', { name: 'Duplicate' })
    ).toBeInTheDocument()
  },
}
