import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, waitFor, fireEvent } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import * as ListStories from '@stories/lists/ActionsList.stories'
import figma from '@figma/code-connect'
import Dropdown from '@components/inputs/dropdown/Dropdown'

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
    onBlock: fn(),
  },
  argTypes: {
    onBlock: { control: false },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

const selectedOptions: Array<string> = ['ANY']

export const SingleSelection: Story = {
  args: {
    id: 'dropdown-button',
    options: { ...ListStories.FourOptionsList.args.options },
    selected: 'OPTION_1',
    alignment: 'LEFT',
    pin: 'NONE',
    helper: {
      label: 'Select an option',
    },
    isNew: false,
    isBlocked: false,
    isDisabled: false,
  },
  argTypes: {
    containerId: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      selected: string
    }>()

    const onChange = (
      e:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>
    ) => {
      updateArgs({
        selected: (e.target as HTMLInputElement).dataset.value,
      })
    }

    return (
      <Dropdown
        {...args}
        options={[
          {
            label: 'Option 1',
            value: 'OPTION_1',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 2',
            value: 'OPTION_2',
            type: 'GROUP',
            children: [
              {
                label: 'Option 2.1',
                value: 'OPTION_2.1',
                type: 'OPTION',
                action: onChange,
              },
              {
                label: 'Option 2.2',
                value: 'OPTION_2.2',
                type: 'OPTION',
                action: onChange,
              },
            ],
          },
          {
            label: 'Option 3',
            value: 'OPTION_3',
            type: 'OPTION',
            action: onChange,
          },
          {
            type: 'SEPARATOR',
          },
          {
            label: 'Title',
            type: 'TITLE',
          },
          {
            label: 'Option 4',
            value: 'OPTION_4',
            type: 'OPTION',
            action: onChange,
          },
        ]}
        selected={argsState.selected}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownButton = canvas.getByRole('combobox')
    await expect(dropdownButton).toBeInTheDocument()
    await expect(dropdownButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.mouseDown(dropdownButton)

    await waitFor(
      () => {
        expect(dropdownButton).toHaveAttribute('aria-expanded', 'true')
      },
      { timeout: 1000 }
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    await waitFor(
      async () => {
        const menu = document.querySelector('.select-menu__menu')
        await expect(menu).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  },
}

export const ManyOptionsSelection: Story = {
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
    id: 'dropdown-button',
    options: { ...ListStories.FourOptionsList.args.options },
    selected: 'OPTION_1',
    alignment: 'LEFT',
    pin: 'NONE',
    helper: {
      label: 'Select an option',
    },
    isNew: false,
    isBlocked: false,
    isDisabled: false,
    containerId: 'dropdown-container',
  },
  argTypes: {
    containerId: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      selected: string
    }>()

    const onChange = (
      e:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>
    ) => {
      updateArgs({
        selected: (e.target as HTMLInputElement).dataset.value,
      })
    }

    return (
      <Dropdown
        {...args}
        options={[
          {
            label: 'Option 1',
            value: 'OPTION_1',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 2',
            value: 'OPTION_2',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 3',
            value: 'OPTION_3',
            type: 'OPTION',
            action: onChange,
          },
          {
            type: 'SEPARATOR',
          },
          {
            label: 'Title',
            type: 'TITLE',
          },
          {
            label: 'Option 4',
            value: 'OPTION_4',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 5',
            value: 'OPTION_5',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 6',
            value: 'OPTION_6',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 7',
            value: 'OPTION_7',
            type: 'OPTION',
            action: onChange,
          },
          {
            type: 'SEPARATOR',
          },
          {
            label: 'Title',
            type: 'TITLE',
          },
          {
            label: 'Option 8',
            value: 'OPTION_8',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 9',
            value: 'OPTION_9',
            type: 'OPTION',
            action: onChange,
          },
        ]}
        selected={argsState.selected}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownButton = canvas.getByRole('combobox')
    await expect(dropdownButton).toBeInTheDocument()
    await expect(dropdownButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.mouseDown(dropdownButton)

    await waitFor(
      () => {
        expect(dropdownButton).toHaveAttribute('aria-expanded', 'true')
      },
      { timeout: 1000 }
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    await waitFor(
      async () => {
        const menu = document.querySelector('.select-menu__menu')
        await expect(menu).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  },
}

export const SearchableDropdown: Story = {
  args: {
    id: 'searchable-dropdown',
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
    selected: 'APPLE',
    alignment: 'LEFT',
    pin: 'NONE',
    canBeSearched: true,
    searchLabel: 'Search fruits…',
    isNew: false,
    isBlocked: false,
    isDisabled: false,
  },
  argTypes: {
    containerId: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      selected: string
    }>()

    const onChange = (
      e:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>
    ) => {
      updateArgs({
        selected: (e.target as HTMLInputElement).dataset.value,
      })
    }

    return (
      <Dropdown
        {...args}
        options={[
          {
            label: 'Apple',
            value: 'APPLE',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Banana',
            value: 'BANANA',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Cherry',
            value: 'CHERRY',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Date',
            value: 'DATE',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Elderberry',
            value: 'ELDERBERRY',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Fig',
            value: 'FIG',
            type: 'OPTION',
            action: onChange,
          },
        ]}
        selected={argsState.selected}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownButton = canvas.getByRole('combobox')
    await expect(dropdownButton).toBeInTheDocument()

    fireEvent.mouseDown(dropdownButton)

    await waitFor(
      () => {
        expect(dropdownButton).toHaveAttribute('aria-expanded', 'true')
      },
      { timeout: 1000 }
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    await waitFor(
      async () => {
        const searchInput = document.querySelector(
          '.select-menu__search .input__field'
        ) as HTMLInputElement
        await expect(searchInput).toBeInTheDocument()

        fireEvent.change(searchInput, { target: { value: 'a' } })

        const banana = document.querySelector('[data-value="BANANA"]')
        await expect(banana).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  },
}

export const MultipleSelection: Story = {
  args: {
    id: 'dropdown-button',
    options: { ...ListStories.FourOptionsList.args.options },
    selected: 'ANY',
    alignment: 'LEFT',
    pin: 'NONE',
    helper: {
      label: 'Select several options',
    },
    isNew: false,
    isDisabled: false,
  },
  argTypes: {
    containerId: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      selected: string
    }>()

    const onChange = (
      e:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>
    ) => {
      const value = (e.target as HTMLInputElement).dataset.value ?? ''

      if (value === 'ANY') {
        selectedOptions.length = 0
        selectedOptions.push(value ?? '')
      }
      if (selectedOptions.includes(value))
        selectedOptions.splice(selectedOptions.indexOf(value), 1)
      else {
        if (selectedOptions.includes('ANY'))
          selectedOptions.splice(selectedOptions.indexOf('ANY'), 1)
        selectedOptions.push(value ?? '')
      }

      if (selectedOptions.length === 0) selectedOptions.push('ANY')

      updateArgs({
        selected: selectedOptions.join(', '),
      })
    }

    return (
      <Dropdown
        {...args}
        options={[
          {
            label: 'Any',
            value: 'ANY',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 1',
            value: 'OPTION_1',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 2',
            value: 'OPTION_2',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 3',
            value: 'OPTION_3',
            type: 'OPTION',
            action: onChange,
          },
          {
            label: 'Option 4',
            value: 'OPTION_4',
            type: 'OPTION',
            action: onChange,
          },
        ]}
        selected={argsState.selected}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownButton = canvas.getByRole('combobox')
    await expect(dropdownButton).toBeInTheDocument()
    await expect(dropdownButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.mouseDown(dropdownButton)

    await waitFor(
      () => {
        expect(dropdownButton).toHaveAttribute('aria-expanded', 'true')
      },
      { timeout: 1000 }
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    await waitFor(
      async () => {
        const menu = document.querySelector('.select-menu__menu')
        await expect(menu).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  },
}
