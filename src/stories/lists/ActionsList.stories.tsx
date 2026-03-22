import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, userEvent, waitFor } from 'storybook/test'
import ActionsList from '@components/lists/actions-list/ActionsList'

const meta = {
  title: 'Components/Lists/Actions List',
  component: ActionsList,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActionsList>

export default meta
type Story = StoryObj<typeof meta>

export const FourOptionsList: Story = {
  args: {
    options: [
      {
        label: 'Option 1',
        shortcut: '⌘K',
        value: 'OPTION_1',
        type: 'OPTION',
        isBlocked: true,
        action: fn(),
      },
      {
        label: 'Option 2',
        shortcut: '⌘L',
        value: 'OPTION_2',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 3',
        shortcut: '⌘⇥M',
        value: 'OPTION_3',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 4',
        shortcut: '⌘⇧N',
        value: 'OPTION_4',
        type: 'OPTION',
        action: fn(),
      },
    ],
    selected: 'OPTION_1',
  },
  argTypes: {
    direction: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const option1 = canvas.getByText('Option 1')
    await expect(option1).toBeInTheDocument()

    const option2 = canvas.getByText('Option 2')
    await expect(option2).toBeInTheDocument()

    const option3 = canvas.getByText('Option 3')
    await expect(option3).toBeInTheDocument()

    const option4 = canvas.getByText('Option 4')
    await expect(option4).toBeInTheDocument()

    // Verify all options are present
    const allOptions = canvas.getAllByText(/Option \d/)
    await expect(allOptions.length).toBe(4)
  },
}

export const FourOptionsListWithSeparator: Story = {
  args: {
    options: [
      {
        label: 'Group 1',
        type: 'TITLE',
      },
      {
        label: 'Option 1',
        value: 'OPTION_1',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 2',
        value: 'OPTION_1',
        type: 'OPTION',
        action: fn(),
      },
      {
        type: 'SEPARATOR',
      },
      {
        label: 'Group 2',
        type: 'TITLE',
        action: fn(),
      },
      {
        label: 'Option 3',
        value: 'OPTION_3',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 4',
        value: 'OPTION_4',
        type: 'OPTION',
        action: fn(),
      },
    ],
  },
  argTypes: {
    direction: { control: false },
    selected: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const group1 = canvas.getByText('Group 1')
    await expect(group1).toBeInTheDocument()

    const group2 = canvas.getByText('Group 2')
    await expect(group2).toBeInTheDocument()

    const option1 = canvas.getByText('Option 1')
    await expect(option1).toBeInTheDocument()

    const option4 = canvas.getByText('Option 4')
    await expect(option4).toBeInTheDocument()

    // Verify separator is present
    const separator = canvas.getByRole('separator', { hidden: true })
    await expect(separator).toBeInTheDocument()
  },
}

export const FourOptionsListInGroups: Story = {
  args: {
    options: [
      {
        label: 'Group 1',
        value: 'GROUP_1',
        type: 'GROUP',
        children: [
          {
            label: 'Option 1',
            value: 'OPTION_A_1',
            type: 'OPTION',
            action: fn(),
          },
          {
            label: 'Option 2',
            value: 'OPTION_A_2',
            type: 'OPTION',
            action: fn(),
          },
          {
            label: 'Option 3',
            value: 'OPTION_A_3',
            type: 'OPTION',
            action: fn(),
          },
          {
            label: 'Option 4',
            value: 'OPTION_A_4',
            type: 'OPTION',
            action: fn(),
          },
        ],
      },
      {
        label: 'Group 2',
        value: 'GROUP_2',
        type: 'GROUP',
        children: [
          {
            label: 'Option 1',
            value: 'OPTION_B_1',
            type: 'OPTION',
            action: fn(),
          },
          {
            label: 'Option 2',
            value: 'OPTION_B_2',
            type: 'OPTION',
            action: fn(),
          },
          {
            label: 'Option 3',
            value: 'OPTION_B_3',
            type: 'OPTION',
            action: fn(),
          },
          {
            label: 'Option 4',
            value: 'OPTION_B_4',
            type: 'OPTION',
            action: fn(),
          },
        ],
      },
    ],
  },
  argTypes: {
    direction: { control: false },
    selected: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const group1 = canvas.getByText('Group 1')
    await expect(group1).toBeInTheDocument()

    const group2 = canvas.getByText('Group 2')
    await expect(group2).toBeInTheDocument()
  },
}

export const SearchableList: Story = {
  args: {
    options: [
      {
        label: 'Apple',
        value: 'APPLE',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Banana',
        value: 'BANANA',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Cherry',
        value: 'CHERRY',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Date',
        value: 'DATE',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Elderberry',
        value: 'ELDERBERRY',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Fig',
        value: 'FIG',
        type: 'OPTION',
        action: fn(),
      },
    ],
    canBeSearched: true,
    searchLabel: 'Search fruits…',
  },
  argTypes: {
    direction: { control: false },
    selected: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const searchInput = canvas.getByPlaceholderText('Search fruits…')
    await expect(searchInput).toBeInTheDocument()

    await userEvent.type(searchInput, 'a')

    await waitFor(async () => {
      const banana = canvas.getByText('Banana')
      await expect(banana).toBeInTheDocument()
    })

    const cherry = canvas.queryByText('Cherry')
    await expect(cherry).not.toBeInTheDocument()
  },
}

export const LongListWithScroll: Story = {
  decorators: [
    (Story) => (
      <div
        id="list-container"
        style={{
          width: '224px',
          height: '224px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    options: [
      {
        label: 'Option 1',
        value: 'OPTION_1',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 2',
        value: 'OPTION_2',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 3',
        value: 'OPTION_3',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 4',
        value: 'OPTION_4',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 5',
        value: 'OPTION_5',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 6',
        value: 'OPTION_6',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 7',
        value: 'OPTION_7',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 8',
        value: 'OPTION_8',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 9',
        value: 'OPTION_9',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 10',
        value: 'OPTION_10',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 11',
        value: 'OPTION_11',
        type: 'OPTION',
        action: fn(),
      },
      {
        label: 'Option 12',
        value: 'OPTION_12',
        type: 'OPTION',
        action: fn(),
      },
    ],
    selected: 'OPTION_1',
    canBeSearched: false,
    shouldScroll: true,
    containerId: 'list-container',
  },
  argTypes: {
    direction: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const option1 = canvas.getByText('Option 1')
    await expect(option1).toBeInTheDocument()

    const allOptions = canvas.getAllByText(/Option \d+/)
    await expect(allOptions.length).toBe(12)
  },
}
