import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import texts from '@styles/texts/texts.module.scss'
import Icon from '@components/assets/icon/Icon'
import Card from '@components/actions/card/Card'
import Button from '@components/actions/button/Button'

const meta = {
  title: 'Components/Actions/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  args: {
    action: fn(),
    shouldFill: false,
  },
  argTypes: {
    action: { control: false },
    actions: { control: false },
    richText: { control: false },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const demoImage = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="184"><rect width="400" height="184" fill="#cfd4dc"/></svg>'
)}`

export const Default: Story = {
  argTypes: {
    insert: { control: false },
  },
  args: {
    src: demoImage,
    tag: 'New layout',
    title: 'Card title',
    subtitle: 'Subtitle',
    richText: (
      <span className={texts.type}>This is an example text for the card</span>
    ),
    actions: (
      <>
        <Button
          type="icon"
          icon="star-on"
          size="small"
          state="default"
          action={fn()}
        />
        <Button
          type="icon"
          icon="search"
          size="small"
          state="default"
          action={fn()}
        />
      </>
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const title = canvas.getByText('Card title')
    await expect(title).toBeInTheDocument()

    const subtitle = canvas.getByText('Subtitle')
    await expect(subtitle).toBeInTheDocument()

    const image = canvas.getByRole('img')
    await expect(image).toBeInTheDocument()

    const card = canvas.getByRole('article')
    await userEvent.click(card)
    await expect(args.action).toHaveBeenCalled()

    const callsBeforeActionClick = (args.action as ReturnType<typeof fn>).mock
      .calls.length
    await userEvent.hover(card)
    const [firstAction] = await canvas.findAllByRole('button')
    await userEvent.click(firstAction)
    await expect(args.action).toHaveBeenCalledTimes(callsBeforeActionClick)

    card.focus()
    const overlay = canvasElement.querySelector('.card__actions') as HTMLElement
    const overlayRect = overlay.getBoundingClientRect()
    const emptySpot = document.elementFromPoint(
      Math.round(overlayRect.left + 4),
      Math.round(overlayRect.top + 4)
    ) as HTMLElement
    const callsBeforeEmptySpaceClick = (args.action as ReturnType<typeof fn>)
      .mock.calls.length
    emptySpot.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await expect(args.action).toHaveBeenCalledTimes(
      callsBeforeEmptySpaceClick + 1
    )
  },
}

export const WithInsert: Story = {
  argTypes: {
    src: { control: false },
  },
  args: {
    insert: (
      <Icon
        type="PICTO"
        iconName="library"
      />
    ),
    tag: 'No preview',
    title: 'Card with a fragment',
    subtitle: 'No image, an insert instead',
    richText: (
      <span className={texts.type}>
        This card fills its asset slot with a fragment and still exposes hover
        actions
      </span>
    ),
    actions: (
      <Button
        type="icon"
        icon="trash"
        size="small"
        state="default"
        action={fn()}
      />
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const title = canvas.getByText('Card with a fragment')
    await expect(title).toBeInTheDocument()

    // No image is fetched, yet the asset slot and its actions exist
    await expect(canvasElement.querySelector('img')).toBeNull()
    await expect(canvas.getByLabelText('library')).toBeInTheDocument()

    const card = canvas.getByRole('article')
    // Actions overlay is revealed on focus, over the fragment slot
    card.focus()
    const actionButton = await canvas.findByRole('button')
    await expect(actionButton).toBeInTheDocument()

    await userEvent.click(card)
    await expect(args.action).toHaveBeenCalled()

    // Clicking the action button itself must not also trigger the card
    const callsBeforeActionClick = (args.action as ReturnType<typeof fn>).mock
      .calls.length
    await userEvent.click(actionButton)
    await expect(args.action).toHaveBeenCalledTimes(callsBeforeActionClick)
  },
}
