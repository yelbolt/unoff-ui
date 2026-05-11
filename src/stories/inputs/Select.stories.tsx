import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within, waitFor } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import { ChangeEvent, useState } from 'react'
import Select from '@components/inputs/select/Select'

const meta: Meta<typeof Select> = {
  title: 'Components/Inputs/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  args: { action: fn(), onBlock: fn() },
  argTypes: {
    onBlock: { control: false },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const CheckBox: Story = {
  args: {
    id: 'check-input',
    type: 'CHECK_BOX',
    label: 'Action label',
    name: 'check-input',
    feature: 'CHECK_INPUT',
    isChecked: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    type: { control: false },
    value: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      isChecked: boolean
    }>()

    const action = (e: ChangeEvent<HTMLInputElement>) => {
      updateArgs({
        isChecked: !argsState.isChecked,
      })
      args.action(e)
    }

    return (
      <Select
        {...args}
        isChecked={argsState.isChecked}
        action={action}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const checkbox = canvas.getByRole('checkbox', { name: /Action label/i })
    await expect(checkbox).toBeInTheDocument()
    await expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    await expect(args.action).toHaveBeenCalled()
  },
}

export const RadioButton: Story = {
  args: {
    id: 'radio-input',
    type: 'RADIO_BUTTON',
    label: 'Action label',
    name: 'radio-input',
    feature: 'RADIO_INPUT',
    isChecked: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    type: { control: false },
    value: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      isChecked: boolean
    }>()

    const action = (e: ChangeEvent<HTMLInputElement>) => {
      updateArgs({
        isChecked: !argsState.isChecked,
      })
      args.action(e)
    }

    return (
      <Select
        {...args}
        isChecked={argsState.isChecked}
        action={action}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const radio = canvas.getByRole('radio', { name: /Action label/i })
    await expect(radio).toBeInTheDocument()
    await expect(radio).not.toBeChecked()

    await userEvent.click(radio)
    await expect(args.action).toHaveBeenCalled()
  },
}

export const SwitchButton: Story = {
  args: {
    id: 'switch-input',
    type: 'SWITCH_BUTTON',
    label: 'Action label',
    name: 'switch-input',
    feature: 'SWITCH_INPUT',
    isChecked: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    type: { control: false },
    value: { control: false },
  },
  render: (args) => {
    const [isChecked, setIsChecked] = useState(args.isChecked ?? false)

    const action = (e: ChangeEvent<HTMLInputElement>) => {
      setIsChecked(!isChecked)
      args.action(e)
    }

    return (
      <Select
        {...args}
        isChecked={isChecked}
        action={action}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const switchButton = canvas.getByRole('switch', { name: /Action label/i })
    await expect(switchButton).toBeInTheDocument()
    await expect(switchButton).not.toBeChecked()

    await userEvent.click(switchButton)
    await expect(args.action).toHaveBeenCalled()
    await waitFor(() => expect(switchButton).toBeChecked())
  },
}

export const MultipleChoices: Story = {
  args: {
    id: 'check-input',
    type: 'CHECK_BOX',
    name: 'check-input',
    feature: 'CHECK_INPUT',
    helper: { label: 'Many options to select' },
    isChecked: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    id: { control: false },
    label: { control: false },
    feature: { control: false },
    name: { control: false },
    type: { control: false },
    value: { control: false },
    isChecked: { control: false },
    isBlocked: { control: false },
    isDisabled: { control: false },
    isNew: { control: false },
    action: { control: false },
  },
  render: (args) => {
    const [optionA, setOptionA] = useState(false)
    const [optionB, setOptionB] = useState(false)
    const [optionC, setOptionC] = useState(false)

    const action = (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      if (target.name === 'option-1') setOptionA(!optionA)
      if (target.name === 'option-2') setOptionB(!optionB)
      if (target.name === 'option-3') setOptionC(!optionC)

      args.action(e)
    }

    return (
      <>
        <Select
          {...args}
          id="option-1"
          label="Option 1"
          name="option-1"
          isChecked={optionA}
          action={action}
        />
        <Select
          {...args}
          id="option-2"
          label="Option 2"
          name="option-2"
          isChecked={optionB}
          action={action}
        />
        <Select
          {...args}
          id="option-3"
          label="Option 3"
          name="option-3"
          isChecked={optionC}
          action={action}
        />
      </>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const option1 = canvas.getByRole('checkbox', { name: /Option 1/i })
    const option2 = canvas.getByRole('checkbox', { name: /Option 2/i })
    const option3 = canvas.getByRole('checkbox', { name: /Option 3/i })

    await expect(option1).toBeInTheDocument()
    await expect(option2).toBeInTheDocument()
    await expect(option3).toBeInTheDocument()

    await expect(option1).not.toBeChecked()
    await expect(option2).not.toBeChecked()
    await expect(option3).not.toBeChecked()

    await userEvent.click(option1)
    await userEvent.click(option3)

    await expect(args.action).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(option1).toBeChecked()
      expect(option2).not.toBeChecked()
      expect(option3).toBeChecked()
    })
  },
}

export const SingleChoice: Story = {
  args: {
    id: 'radio-input',
    type: 'RADIO_BUTTON',
    name: 'radio-input',
    value: 'option-1',
    feature: 'RADIO_INPUT',
    helper: { label: 'Only one option to select' },
    isChecked: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    id: { control: false },
    label: { control: false },
    feature: { control: false },
    name: { control: false },
    type: { control: false },
    value: { control: false },
    isChecked: { control: false },
    isBlocked: { control: false },
    isDisabled: { control: false },
    isNew: { control: false },
    action: { control: false },
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 'option-1')

    const action = (e: ChangeEvent<HTMLInputElement>) => {
      setValue((e.target as HTMLInputElement).value)
      args.action(e)
    }

    return (
      <>
        <Select
          {...args}
          id="option-1"
          label="Option 1"
          name="radio-input"
          value="option-1"
          isChecked={value === 'option-1'}
          action={action}
        />
        <Select
          {...args}
          id="option-2"
          label="Option 2"
          name="option-2"
          value="option-2"
          isChecked={value === 'option-2'}
          action={action}
        />
        <Select
          {...args}
          id="option-3"
          label="Option 3"
          name="radio-input"
          value="option-3"
          isChecked={value === 'option-3'}
          action={action}
        />
      </>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const option1 = canvas.getByRole('radio', { name: /Option 1/i })
    const option2 = canvas.getByRole('radio', { name: /Option 2/i })
    const option3 = canvas.getByRole('radio', { name: /Option 3/i })

    await expect(option1).toBeInTheDocument()
    await expect(option2).toBeInTheDocument()
    await expect(option3).toBeInTheDocument()

    await expect(option1).toBeChecked()
    await expect(option2).not.toBeChecked()
    await expect(option3).not.toBeChecked()

    await userEvent.click(option2)
    await expect(args.action).toHaveBeenCalled()
    await waitFor(() => {
      expect(option1).not.toBeChecked()
      expect(option2).toBeChecked()
      expect(option3).not.toBeChecked()
    })

    await userEvent.click(option3)
    await waitFor(() => {
      expect(option1).not.toBeChecked()
      expect(option2).not.toBeChecked()
      expect(option3).toBeChecked()
    })
  },
}
