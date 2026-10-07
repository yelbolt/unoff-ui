import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import figma from '@figma/code-connect'
import Input from '@components/inputs/input/Input'

const meta = {
  title: 'Components/Inputs/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    design: {
      url: 'https://www.figma.com/design/QlBdsfEcaUsGBzqA20xbNi/Unoff?node-id=1-4618',
      props: {
        type: figma.enum('type', {
          TEXT_INPUT: 'TEXT',
          TEXT_AREA: 'LONG_TEXT',
          NUMBER: 'NUMBER',
          COLOR_INPUT: 'COLOR',
        }),
        hasBorder: figma.boolean('isFramed'),
        state: figma.enum('state', {
          DEFAULT: 'DEFAULT',
          ERROR: 'ERROR',
        }),
      },
    },
  },
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onShift: fn(),
    onValid: fn(),
  },
  argTypes: {
    onChange: { control: false },
    onFocus: { control: false },
    onBlur: { control: false },
    onShift: { control: false },
    onValid: { control: false },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Color: Story = {
  args: {
    id: 'specific-color-selection',
    type: 'COLOR',
    value: '#87ebe7',
    feature: 'PICK_COLOR',
    helper: {
      label: 'Pick a color',
    },
    isAutoFocus: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    type: { control: false },
    value: { control: 'color' },
    icon: { control: false },
    unit: { control: false },
    state: { control: false },
    placeholder: { control: false },
    charactersLimit: { control: false },
    min: { control: false },
    max: { control: false },
    step: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      value: string
    }>()

    const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateArgs({
        value: e?.target.value,
      })
      args.onBlur?.(e)
    }

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateArgs({
        value: e?.target.value,
      })
      args.onPick?.(e)
    }

    return (
      <Input
        {...args}
        value={argsState.value}
        onBlur={onBlur}
        onPick={onPick}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const colorInput = canvas.getByLabelText('Color picker')
    await expect(colorInput).toBeInTheDocument()
    await expect(colorInput).toHaveValue('#87ebe7')

    const hexInput = canvas.getByLabelText('Hex color code')
    await expect(hexInput).toBeInTheDocument()
    await expect(hexInput).toHaveValue('87EBE7')

    await userEvent.clear(hexInput)
    await userEvent.type(hexInput, 'FF5733')
    await userEvent.tab()

    await expect(args.onBlur).toHaveBeenCalled()
  },
}

export const Number: Story = {
  args: {
    id: 'specific-number-selection',
    type: 'NUMBER',
    icon: {
      type: 'LETTER',
      value: 'H',
    },
    value: '20',
    min: '0',
    max: '100',
    step: '1',
    feature: 'ADJUST_NUMBER',
    state: 'DEFAULT',
    helper: {
      label: 'Adjust the number',
    },
    isAutoFocus: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
    isFlex: false,
  },
  argTypes: {
    type: { control: false },
    placeholder: { control: false },
    state: { control: 'select', options: ['DEFAULT', 'ERROR'] },
    charactersLimit: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      value: string
    }>()

    const onBlur = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      updateArgs({
        value: e?.target.value,
      })
      args.onBlur?.(e)
    }

    const onSlide = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      updateArgs({
        value: e?.target.value,
      })
      args.onSlide?.(e)
    }

    return (
      <Input
        {...args}
        value={argsState.value}
        onBlur={onBlur}
        onSlide={onSlide}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('spinbutton')

    await expect(input).toBeInTheDocument()
    await expect(input).toHaveValue(20)

    await userEvent.clear(input)
    await userEvent.type(input, '50')
    await userEvent.tab()

    await expect(args.onBlur).toHaveBeenCalled()
  },
}

export const Text: Story = {
  args: {
    id: 'short-text-typing',
    type: 'TEXT',
    placeholder: 'Type something (64 characters max.)…',
    value: '',
    charactersLimit: 64,
    feature: 'TYPE_SHORT_TEXT',
    state: 'DEFAULT',
    helper: {
      label: 'You can type up to 64 characters',
    },
    isAutoFocus: false,
    isClearable: false,
    isFramed: true,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    unit: { control: false },
    state: { control: 'select', options: ['DEFAULT', 'ERROR'] },
    charactersLimit: { control: 'number' },
    min: { control: false },
    max: { control: false },
    step: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      value: string
    }>()

    const onBlur = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      updateArgs({
        value: e?.target.value,
      })
      args.onBlur?.(e)
    }

    return (
      <Input
        {...args}
        value={argsState.value}
        onBlur={onBlur}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/Type something/)

    await expect(input).toBeInTheDocument()

    await userEvent.type(input, 'Hello Unoff UI!')
    await userEvent.tab()

    await expect(args.onBlur).toHaveBeenCalled()
  },
}

export const LongText: Story = {
  args: {
    id: 'long-text-typing',
    type: 'LONG_TEXT',
    placeholder: 'Type something',
    value: '',
    feature: 'TYPE_SHORT_TEXT',
    state: 'DEFAULT',
    helper: {
      label: 'You can type up to 500 characters',
    },
    isGrowing: false,
    isAutoFocus: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    unit: { control: false },
    state: { control: 'select', options: ['DEFAULT', 'ERROR'] },
    charactersLimit: { control: false },
    min: { control: false },
    max: { control: false },
    step: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      value: string
    }>()

    const onBlur = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      updateArgs({
        value: e?.target.value,
      })
      args.onBlur?.(e)
    }

    return (
      <Input
        {...args}
        value={argsState.value}
        onBlur={onBlur}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const textarea = canvas.getByRole('textbox') as HTMLTextAreaElement
    await expect(textarea).toBeInTheDocument()
    await expect(textarea).toHaveValue('')

    await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')
    await userEvent.tab()

    await expect(args.onBlur).toHaveBeenCalled()
    await expect(textarea.value).toContain('Line 1')
    await expect(textarea.value).toContain('Line 2')
    await expect(textarea.value).toContain('Line 3')
  },
}

export const Code: Story = {
  args: {
    id: 'code-snippet-dragging',
    type: 'CODE',
    value: `:root {\n  /* Rectangle 1 */\n  --rectangle-1-source: rgb(217,217,217);\n  --rectangle-1-900: rgb(57,57,57);\n}`,
    feature: 'SELECT_CODE_SNIPPET',
    isAutoFocus: false,
    isBlocked: false,
    isDisabled: false,
    isNew: false,
  },
  argTypes: {
    type: { control: false },
    icon: { control: false },
    unit: { control: false },
    placeholder: { control: false },
    state: { control: false },
    charactersLimit: { control: false },
    min: { control: false },
    max: { control: false },
    step: { control: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const codeTextarea = canvas.getByRole('textbox')
    await expect(codeTextarea).toBeInTheDocument()

    await expect(codeTextarea).toHaveAttribute('readonly')
  },
}
