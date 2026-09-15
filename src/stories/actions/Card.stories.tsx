import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import React from 'react'
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
} as Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Example of a placeholder image for the demo
const demoImage = 'https://placehold.co/400x184'

export const Default: Story = {
  args: {
    src: demoImage,
    tag: 'New layout',
    title: 'Card title',
    subtitle: 'Subtitle',
    richText: (
      <span className={texts.type}>This is an example text for the card</span>
    ),
    shouldFill: false,
    action: fn(),
    actions: (
      <>
        <Button
          type="icon"
          icon="star-on"
          size="small"
          state="default"
          action={(
            e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
          ) => {
            e.stopPropagation()
            fn()
          }}
        />
        <Button
          type="icon"
          icon="search"
          size="small"
          state="default"
          action={(
            e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
          ) => {
            e.stopPropagation()
            fn()
          }}
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
  },
}

export const WithoutActions: Story = {
  args: {
    src: demoImage,
    title: 'Card without actions',
    subtitle: 'Informative subtitle',
    richText: (
      <span className={texts.type}>
        This card does not display action buttons on hover
      </span>
    ),
    shouldFill: false,
    action: fn(),
    actions: null,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const title = canvas.getByText('Card without actions')
    await expect(title).toBeInTheDocument()

    const subtitle = canvas.getByText('Informative subtitle')
    await expect(subtitle).toBeInTheDocument()

    const image = canvas.getByRole('img')
    await expect(image).toBeInTheDocument()

    const card = canvas.getByRole('article')
    await userEvent.click(card)
    await expect(args.action).toHaveBeenCalled()

    // Verify no action buttons are present
    const buttons = canvas.queryAllByRole('button')
    await expect(buttons.length).toBe(0)
  },
}

export const WithoutTitle: Story = {
  args: {
    src: demoImage,
    tag: 'New layout',
    subtitle: 'Card without main title',
    richText: (
      <span className={texts.type}>
        This card has no title, only a subtitle and text
      </span>
    ),
    shouldFill: false,
    action: fn(),
    actions: (
      <Button
        type="icon"
        icon="settings"
        size="small"
        state="default"
        action={(
          e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
        ) => {
          e.stopPropagation()
          fn()
        }}
      />
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const subtitle = canvas.getByText('Card without main title')
    await expect(subtitle).toBeInTheDocument()

    const image = canvas.getByRole('img')
    await expect(image).toBeInTheDocument()

    const card = canvas.getByRole('article')
    await userEvent.click(card)
    await expect(args.action).toHaveBeenCalled()
  },
}

export const Filled: Story = {
  args: {
    src: demoImage,
    tag: 'New layout',
    title: 'Card in fill mode',
    subtitle: 'With shouldFill set to true',
    richText: (
      <span className={texts.type}>
        This card uses the shouldFill option to occupy all available space
      </span>
    ),
    shouldFill: true,
    action: fn(),
    actions: (
      <>
        <Button
          type="icon"
          icon="styles"
          size="small"
          state="default"
          action={(
            e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
          ) => {
            e.stopPropagation()
            fn()
          }}
        />
        <Button
          type="icon"
          icon="trash"
          size="small"
          state="default"
          action={(
            e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
          ) => {
            e.stopPropagation()
            fn()
          }}
        />
      </>
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const title = canvas.getByText('Card in fill mode')
    await expect(title).toBeInTheDocument()

    const subtitle = canvas.getByText('With shouldFill set to true')
    await expect(subtitle).toBeInTheDocument()

    const image = canvas.getByRole('img')
    await expect(image).toBeInTheDocument()

    const card = canvas.getByRole('article')
    await userEvent.click(card)
    await expect(args.action).toHaveBeenCalled()
  },
}

export const WithInsert: Story = {
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
    shouldFill: false,
    action: fn(),
    actions: (
      <Button
        type="icon"
        icon="trash"
        size="small"
        state="default"
        action={(
          e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
        ) => {
          e.stopPropagation()
          fn()
        }}
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
    await expect(await canvas.findByRole('button')).toBeInTheDocument()

    await userEvent.click(card)
    await expect(args.action).toHaveBeenCalled()
  },
}
