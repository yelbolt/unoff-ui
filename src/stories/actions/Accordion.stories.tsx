import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, fireEvent } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import * as InputStory from '@stories/inputs/Input.stories'
import * as TitleStory from '@stories/assets/SectionTitle.stories'
import Input from '@components/inputs/input/Input'
import Accordion from '@components/actions/accordion/Accordion'

const mock = fn()

const meta = {
  title: 'Components/Actions/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const ExpandCollapseInput: Story = {
  args: {
    ...TitleStory.TitleWithHelper.args,
    helper:
      typeof TitleStory.TitleWithHelper.args?.helper === 'string'
        ? TitleStory.TitleWithHelper.args.helper
        : undefined,
    icon: 'plus',
    isExpanded: false,
    isBlocked: false,
    isNew: false,
    children: (
      <Input
        {...InputStory.ShortText.args}
        isAutoFocus={true}
      />
    ),
    onAdd: mock,
    onEmpty: mock,
    onBlock: fn(),
  },
  argTypes: {
    ...TitleStory.TitleWithHelper.argTypes,
    children: { control: false },
    onAdd: { control: false },
    onEmpty: { control: false },
    onBlock: { control: false },
  },
  render: (args) => {
    const [argsState, updateArgs] = useArgs<{
      isExpanded: boolean
    }>()

    const onChange = () => {
      updateArgs({
        isExpanded: !argsState.isExpanded,
      })
    }

    return (
      <Accordion
        {...args}
        isExpanded={argsState.isExpanded}
        onAdd={onChange}
        onEmpty={onChange}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const accordionButton = canvas.getByRole('button')
    await expect(accordionButton).toBeInTheDocument()

    fireEvent.mouseDown(accordionButton)

    await new Promise((resolve) => setTimeout(resolve, 300))

    fireEvent.mouseDown(accordionButton)
  },
}
