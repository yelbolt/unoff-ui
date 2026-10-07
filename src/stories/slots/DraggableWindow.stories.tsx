import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, waitFor, within } from 'storybook/test'
import { useEffect, useRef, useState } from 'react'
import texts from '@styles/texts/texts.module.scss'
import DraggableWindow from '@components/slots/draggable-window/DraggableWindow'
import Button from '@components/actions/button/Button'

const meta = {
  title: 'Patterns/Slots/Draggable Window',
  component: DraggableWindow,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Options',
    children: (
      <div style={{ padding: 'var(--scale-pos-xxsmall)' }}>
        <p className={texts.type}>
          Drag the window by its header. It opens next to its trigger.
        </p>
      </div>
    ),
    triggerRef: { current: null },
    onClose: fn(),
  },
  argTypes: {
    children: { control: false },
    triggerRef: { control: false },
    onClose: { control: false },
  },
  render: (args) => {
    const triggerRef = useRef<Button>(null)
    const [isTriggerMounted, setIsTriggerMounted] = useState(false)

    useEffect(() => setIsTriggerMounted(true), [])

    return (
      <div style={{ paddingLeft: '320px' }}>
        <Button
          ref={triggerRef}
          type="icon"
          icon="adjust"
          helper={{ label: 'Open the options' }}
        />
        {isTriggerMounted && (
          <DraggableWindow
            {...args}
            triggerRef={triggerRef}
          />
        )}
      </div>
    )
  },
} satisfies Meta<typeof DraggableWindow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const body = within(document.body)

    await waitFor(() => expect(body.getByRole('dialog')).toBeVisible())
    await expect(body.getByText('Options')).toBeInTheDocument()
  },
}
