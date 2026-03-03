import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { iconList } from '@tps/icon.types'
import texts from '@styles/texts/texts.module.scss'
import Icon from '@components/assets/icon/Icon'

const width = 960

const icons = [...iconList]

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          maxWidth: `${width}px`,
          flexWrap: 'wrap',
          gap: `${width / 80}px`,
          alignItems: 'baseline',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Pictogram: Story = {
  args: {
    type: 'PICTO',
    iconLetter: undefined,
  },
  argTypes: {
    type: { control: false },
    iconName: { control: false },
    iconLetter: { control: false },
  },
  render: (args) => {
    return (
      <>
        {icons.map((icon) => (
          <div
            key={icon}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${width / 80}px`,
              alignItems: 'center',
              justifyContent: 'center',
              width: `${width / 8}px`,
            }}
          >
            <Icon
              type={args.type}
              iconName={icon}
            />
            <span
              className={texts.type}
              style={{ textAlign: 'center' }}
            >
              {icon}
            </span>
          </div>
        ))}
      </>
    )
  },
}

export const Letter: Story = {
  args: {
    type: 'LETTER',
    iconName: undefined,
    iconLetter: 'L',
  },
  argTypes: {
    type: { control: false },
    iconName: { control: false },
  },
  render: (args) => {
    return (
      <Icon
        type={args.type}
        iconLetter={args.iconLetter}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const letter = canvas.getByText(args.iconLetter ?? 'L')
    await expect(letter).toBeInTheDocument()
  },
}
