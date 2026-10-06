import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, fireEvent } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import Tabs from '@components/lists/tabs/Tabs'

const meta = {
  title: 'Components/Lists/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  args: {
    direction: 'HORIZONTAL',
    isFlex: false,
    action: fn(),
  },
  argTypes: {
    tabs: {
      control: 'object',
    },
    action: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      active: string
    }>()

    const onChange = (e: React.MouseEvent & React.KeyboardEvent) => {
      updateArgs({
        active: (e.currentTarget as HTMLElement).dataset.feature,
      })
      args.action(e)
    }

    return (
      <Tabs
        {...args}
        active={argsState.active}
        action={onChange}
      />
    )
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      {
        label: 'Section 1',
        id: 'SECTION_1',
        isUpdated: false,
      },
      {
        label: 'Section 2',
        id: 'SECTION_2',
        isUpdated: false,
      },
      {
        label: 'Section 3',
        id: 'SECTION_3',
        isUpdated: false,
      },
    ],
    active: 'SECTION_1',
    maxVisibleTabs: 2,
  },
  argTypes: {
    active: {
      control: 'select',
      options: ['SECTION_1', 'SECTION_2', 'SECTION_3'],
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const tab1 = canvas.getByText('Section 1')
    await expect(tab1).toBeInTheDocument()

    const tab2 = canvas.getByText('Section 2')
    fireEvent.mouseDown(tab2)

    await expect(args.action).toHaveBeenCalled()

    const tab3 = canvas.getByText('Section 3')
    fireEvent.mouseDown(tab3)
    await expect(args.action).toHaveBeenCalledTimes(2)
  },
}

export const ManyTabs: Story = {
  args: {
    tabs: [
      {
        label: 'Section 1',
        id: 'SECTION_1',
        icon: {
          type: 'PICTO',
          name: 'adjust',
        },
        isUpdated: false,
      },
      {
        label: 'Section 2',
        id: 'SECTION_2',
        icon: {
          type: 'LETTER',
          name: 'A',
        },
        isUpdated: true,
      },
      {
        label: 'Section 3',
        id: 'SECTION_3',
        isUpdated: false,
        isNew: true,
      },
      {
        label: 'Section 4',
        id: 'SECTION_4',
        isUpdated: false,
      },
      {
        label: 'Section 5',
        id: 'SECTION_5',
        isUpdated: false,
      },
    ],
    active: 'SECTION_1',
    maxVisibleTabs: 3,
  },
  argTypes: {
    active: {
      control: 'select',
      options: [
        'SECTION_1',
        'SECTION_2',
        'SECTION_3',
        'SECTION_4',
        'SECTION_5',
      ],
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const tab1 = canvas.getByText('Section 1')
    await expect(tab1).toBeInTheDocument()

    const tab2 = canvas.getByText('Section 2')
    fireEvent.mouseDown(tab2)
    await expect(args.action).toHaveBeenCalled()

    const tab3 = canvas.getByText('Section 3')
    fireEvent.mouseDown(tab3)
    await expect(args.action).toHaveBeenCalledTimes(2)

    const icons = canvas.getAllByRole('img', { hidden: true })
    await expect(icons.length).toBeGreaterThan(0)
  },
}
