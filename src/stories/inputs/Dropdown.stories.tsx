import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, waitFor, fireEvent } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import figma from '@figma/code-connect'
import Dropdown from '@components/inputs/dropdown/Dropdown'

type Options = React.ComponentProps<typeof Dropdown>['options']
type Handler = (
  e:
    | React.MouseEvent<HTMLLIElement, MouseEvent>
    | React.KeyboardEvent<HTMLLIElement>
) => void

const option = (n: number | string, action: Handler = fn()) => ({
  label: `Option ${n}`,
  value: `OPTION_${n}`,
  type: 'OPTION' as const,
  action,
})

const buildOptions = (action: Handler = fn()): Options => [
  option(1, action),
  {
    label: 'Option 2',
    value: 'OPTION_2',
    type: 'GROUP',
    children: [option('2.1', action), option('2.2', action)],
  },
  option(3, action),
  { type: 'SEPARATOR' },
  { label: 'Title', type: 'TITLE' },
  option(4, action),
]

const buildManyOptions = (action: Handler = fn()): Options => [
  option(1, action),
  option(2, action),
  option(3, action),
  { type: 'SEPARATOR' },
  { label: 'Title', type: 'TITLE' },
  option(4, action),
  option(5, action),
  option(6, action),
  option(7, action),
  { type: 'SEPARATOR' },
  { label: 'Title', type: 'TITLE' },
  option(8, action),
  option(9, action),
]

const buildFruits = (action: Handler = fn()): Options =>
  ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'].map((label) => ({
    label,
    value: label.toUpperCase(),
    type: 'OPTION' as const,
    action,
  }))

const buildMultipleOptions = (action: Handler = fn()): Options => [
  { label: 'Any', value: 'ANY', type: 'OPTION', action },
  option(1, action),
  option(2, action),
  option(3, action),
  option(4, action),
]

// Keeps `selected` in sync with the chosen option, like a consumer would.
const renderWithSelection =
  (build: (action: Handler) => Options): Story['render'] =>
  (args) => {
    const [argsState, updateArgs] = useArgs<{ selected: string }>()

    const onChange: Handler = (e) => {
      updateArgs({
        selected: (e.target as HTMLElement).dataset.value,
      })
    }

    return (
      <Dropdown
        {...args}
        options={build(onChange)}
        selected={argsState.selected}
      />
    )
  }

const openDropdown = async (canvasElement: HTMLElement) => {
  const dropdownButton = within(canvasElement).getByRole('combobox')

  await expect(dropdownButton).toHaveAttribute('aria-expanded', 'false')
  fireEvent.mouseDown(dropdownButton)

  await waitFor(
    () => expect(dropdownButton).toHaveAttribute('aria-expanded', 'true'),
    { timeout: 1000 }
  )
  await waitFor(
    () =>
      expect(document.querySelector('.select-menu__menu')).toBeInTheDocument(),
    { timeout: 2000 }
  )
}

const meta = {
  title: 'Components/Inputs/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    design: {
      url: 'https://www.figma.com/design/QlBdsfEcaUsGBzqA20xbNi/Unoff?node-id=393-795',
      props: {
        alignment: figma.enum('Type', {
          HUG: 'LEFT',
          STRETCH: 'LEFT',
        }),
        isFill: figma.enum('Type', {
          STRETCH: true,
        }),
      },
    },
  },
  args: {
    id: 'dropdown',
    alignment: 'LEFT',
    pin: 'NONE',
    isNew: false,
    isBlocked: false,
    isDisabled: false,
    onBlock: fn(),
  },
  argTypes: {
    options: { control: 'object' },
    containerId: { control: false },
    onBlock: { control: false },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: buildOptions(),
    selected: 'OPTION_1',
    helper: { label: 'Select an option' },
  },
  render: renderWithSelection(buildOptions),
  play: async ({ canvasElement }) => {
    await openDropdown(canvasElement)
  },
}

export const ManyOptions: Story = {
  decorators: [
    (Story) => (
      <div
        id="dropdown-container"
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
    options: buildManyOptions(),
    selected: 'OPTION_1',
    helper: { label: 'Select an option' },
    containerId: 'dropdown-container',
  },
  render: renderWithSelection(buildManyOptions),
  play: async ({ canvasElement }) => {
    await openDropdown(canvasElement)
  },
}

export const Searchable: Story = {
  args: {
    id: 'searchable-dropdown',
    options: buildFruits(),
    selected: 'APPLE',
    canBeSearched: true,
    searchLabel: 'Search fruits…',
  },
  argTypes: {
    helper: { control: false },
  },
  render: renderWithSelection(buildFruits),
  play: async ({ canvasElement }) => {
    await openDropdown(canvasElement)

    const searchInput = document.querySelector(
      '.select-menu__search .input__field'
    ) as HTMLInputElement
    await expect(searchInput).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'ban' } })

    await waitFor(() =>
      expect(
        document.querySelector('[data-value="BANANA"]')
      ).toBeInTheDocument()
    )
  },
}

export const Multiple: Story = {
  args: {
    options: buildMultipleOptions(),
    selected: 'ANY',
    helper: { label: 'Select several options' },
  },
  argTypes: {
    isBlocked: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{ selected: string }>()
    // The selection lives in the `selected` arg, so it stays editable from the
    // Controls panel (and no framework hook is needed next to useArgs).
    const picked = argsState.selected.split(', ')

    const onChange: Handler = (e) => {
      const value = (e.target as HTMLElement).dataset.value ?? ''
      let next: Array<string>

      if (value === 'ANY') next = ['ANY']
      else if (picked.includes(value)) next = picked.filter((v) => v !== value)
      else next = [...picked.filter((v) => v !== 'ANY'), value]

      if (next.length === 0) next = ['ANY']

      updateArgs({ selected: next.join(', ') })
    }

    return (
      <Dropdown
        {...args}
        options={buildMultipleOptions(onChange)}
        selected={argsState.selected}
      />
    )
  },
  play: async ({ canvasElement }) => {
    await openDropdown(canvasElement)
  },
}
