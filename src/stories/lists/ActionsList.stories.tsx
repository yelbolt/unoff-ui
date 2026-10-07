import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, userEvent, waitFor } from 'storybook/test'
import { useRef } from 'react'
import ColorChip from '@components/tags/color-chip/ColorChip'
import ActionsList from '@components/lists/actions-list/ActionsList'
import Icon from '@components/assets/icon/Icon'

type Options = React.ComponentProps<typeof ActionsList>['options']

const option = (label: string, value: string) => ({
  label,
  value,
  type: 'OPTION' as const,
  action: fn(),
})

const numberedOptions = (count: number): Options =>
  Array.from({ length: count }, (_, index) =>
    option(`Option ${index + 1}`, `OPTION_${index + 1}`)
  )

const meta = {
  title: 'Components/Lists/Actions List',
  component: ActionsList,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    options: { control: 'object' },
    direction: { control: false },
    menuRef: { control: false },
    subMenuRef: { control: false },
    onCancellation: { control: false },
  },
} satisfies Meta<typeof ActionsList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: [
      {
        ...option('Option 1', 'OPTION_1'),
        shortcut: '⌘K',
        isBlocked: true,
        onBlock: fn(),
      },
      { ...option('Option 2', 'OPTION_2'), shortcut: '⌘L' },
      { ...option('Option 3', 'OPTION_3'), shortcut: '⌘⇥M' },
      { ...option('Option 4', 'OPTION_4'), shortcut: '⌘⇧N' },
    ],
    selected: 'OPTION_1',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText(/Option \d/)).toHaveLength(4)
    await expect(canvas.getByText('⌘K')).toBeInTheDocument()
  },
}

export const WithSeparator: Story = {
  args: {
    options: [
      { label: 'Group 1', type: 'TITLE' },
      option('Option 1', 'OPTION_1'),
      option('Option 2', 'OPTION_2'),
      { type: 'SEPARATOR' },
      { label: 'Group 2', type: 'TITLE' },
      option('Option 3', 'OPTION_3'),
      option('Option 4', 'OPTION_4'),
    ],
  },
  argTypes: {
    selected: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Group 1')).toBeInTheDocument()
    await expect(canvas.getByText('Group 2')).toBeInTheDocument()
    await expect(
      canvas.getByRole('separator', { hidden: true })
    ).toBeInTheDocument()
  },
}

export const WithGroups: Story = {
  args: {
    options: ['A', 'B'].map((group, index) => ({
      label: `Group ${index + 1}`,
      value: `GROUP_${group}`,
      type: 'GROUP' as const,
      children: [1, 2, 3, 4].map((n) =>
        option(`Option ${n}`, `OPTION_${group}_${n}`)
      ),
    })),
  },
  argTypes: {
    selected: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Group 1')).toBeInTheDocument()
    await expect(canvas.getByText('Group 2')).toBeInTheDocument()
  },
}

export const WithStartSlot: Story = {
  args: {
    options: [
      {
        ...option('Grid view', 'GRID'),
        startSlot: (
          <Icon
            type="PICTO"
            iconName="tidy-up-grid"
          />
        ),
      },
      {
        ...option('List view', 'LIST'),
        startSlot: (
          <Icon
            type="PICTO"
            iconName="list-detailed"
          />
        ),
      },
      { type: 'SEPARATOR' },
      {
        ...option('Ocean blue', 'OCEAN_BLUE'),
        startSlot: (
          <ColorChip
            color="#1E6FD9"
            isRounded
          />
        ),
      },
      {
        ...option('Sunset orange', 'SUNSET_ORANGE'),
        startSlot: (
          <ColorChip
            color="#E8622C"
            isRounded
          />
        ),
      },
    ],
    selected: 'OCEAN_BLUE',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Grid view')).toBeInTheDocument()
    await expect(
      canvasElement.querySelectorAll('.select-menu__item__start')
    ).toHaveLength(4)
  },
}

export const Searchable: Story = {
  args: {
    options: numberedOptions(20),
    selected: 'OPTION_10',
    canBeSearched: true,
    searchLabel: 'Search options…',
    noResultsLabel: 'No option found',
  },
  render: (args) => {
    const menuRef = useRef<HTMLUListElement>(null)

    return (
      <ActionsList
        {...args}
        menuRef={menuRef}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const menu = canvasElement.querySelector(
      '.select-menu__menu--searchable'
    ) as HTMLElement

    await expect(menu).toBeInTheDocument()

    await waitFor(() => expect(menu.scrollTop).toBeGreaterThan(0))
    const menuRect = menu.getBoundingClientRect()
    const optionRect = canvasElement
      .querySelector('[data-value="OPTION_10"]')!
      .getBoundingClientRect()
    await expect(optionRect.top).toBeGreaterThanOrEqual(menuRect.top)
    await expect(optionRect.bottom).toBeLessThanOrEqual(menuRect.bottom)

    await userEvent.type(canvas.getByPlaceholderText('Search options…'), '20')
    await waitFor(async () => {
      await expect(canvas.getByText('Option 20')).toBeInTheDocument()
      await expect(canvas.queryByText('Option 3')).not.toBeInTheDocument()
    })
  },
}

export const Scrollable: Story = {
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
    options: numberedOptions(12),
    selected: 'OPTION_1',
    shouldScroll: true,
    containerId: 'list-container',
  },
  argTypes: {
    containerId: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText(/Option \d+/)).toHaveLength(12)
  },
}
