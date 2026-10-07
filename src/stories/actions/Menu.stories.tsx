import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within, waitFor, screen } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import { iconList } from '@tps/icon.types'
import Menu from '@components/actions/menu/Menu'

type Options = React.ComponentProps<typeof Menu>['options']

const icons = [...iconList]

const buildOptions = (action: () => void = fn()): Options => [
  { label: 'Option 1', value: 'OPTION_1', type: 'OPTION', action },
  {
    label: 'Option 2',
    value: 'OPTION_2',
    type: 'GROUP',
    children: [
      { label: 'Option 2.1', value: 'OPTION_2.1', type: 'OPTION', action },
      { label: 'Option 2.2', value: 'OPTION_2.2', type: 'OPTION', action },
    ],
  },
  { label: 'Option 3', value: 'OPTION_3', type: 'OPTION', action },
  { type: 'SEPARATOR' },
  { label: 'Title', type: 'TITLE' },
  { label: 'Option 4', value: 'OPTION_4', type: 'OPTION', action },
]

const fruits: Options = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
].map((label) => ({
  label,
  value: label.toUpperCase(),
  type: 'OPTION' as const,
  action: fn(),
}))

const openMenu = async (button: HTMLElement) => {
  button.focus()
  await userEvent.keyboard('{Enter}')
}

const meta = {
  title: 'Components/Actions/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  args: {
    id: 'menu',
    state: 'DEFAULT',
    alignment: 'BOTTOM_LEFT',
    isBlocked: false,
    isNew: false,
    onBlock: fn(),
  },
  argTypes: {
    onBlock: { control: false },
    customIcon: { control: false },
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Icon: Story = {
  args: {
    type: 'ICON',
    icon: 'adjust',
    helper: { label: 'Run actions' },
    options: buildOptions(),
    selected: 'OPTION_1',
  },
  argTypes: {
    type: { control: false },
    label: { control: false },
    icon: { control: 'select', options: icons },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{ selected: string }>()

    const onChange = (
      e:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>
    ) => {
      updateArgs({
        selected: (e.target as HTMLElement).dataset.value,
      })
    }

    return (
      <Menu
        {...args}
        options={buildOptions(onChange as () => void)}
        selected={argsState.selected}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await openMenu(canvas.getByRole('button'))

    await waitFor(
      async () => {
        await expect(screen.getByText('Option 1')).toBeInTheDocument()
        await expect(screen.getByText('Option 4')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
  },
}

export const Primary: Story = {
  args: {
    type: 'PRIMARY',
    label: 'Run',
    options: buildOptions(),
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    selected: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await openMenu(canvas.getByRole('button', { name: /Run/i }))

    await waitFor(
      async () => {
        await expect(screen.getByText('Option 1')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
  },
}

export const Searchable: Story = {
  args: {
    type: 'ICON',
    icon: 'adjust',
    options: fruits,
    canBeSearched: true,
    searchLabel: 'Search fruits…',
    noResultsLabel: 'No fruit found',
  },
  argTypes: {
    type: { control: false },
    label: { control: false },
    selected: { control: false },
    icon: { control: 'select', options: icons },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await openMenu(canvas.getByRole('button'))

    const searchInput = await screen.findByPlaceholderText('Search fruits…')
    await userEvent.type(searchInput, 'ban')

    await waitFor(async () => {
      await expect(screen.getByText('Banana')).toBeInTheDocument()
      await expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
    })
  },
}
