import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import SimpleItem from '@components/slots/simple-item/SimpleItem'
import Section from '@components/slots/section/Section'
import Input from '@components/inputs/input/Input'
import SectionTitle from '@components/assets/section-title/SectionTitle'

const colors = ['#FF0000', '#00FF00', '#0000FF', '#000000', '#FFFFFF']

const meta = {
  title: 'Patterns/Slots/Section',
  component: Section,
  decorators: [
    (Story) => (
      <div style={{ width: '296px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: false },
    body: { control: false },
  },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: (
      <SimpleItem
        leftPartSlot={
          <SectionTitle
            label="Selected colors"
            indicator="5"
          />
        }
        isListItem={false}
      />
    ),
    body: colors.map((color) => ({
      node: (
        <SimpleItem
          leftPartSlot={
            <div className="draggable-item__param">
              <Input
                type="COLOR"
                value={color}
              />
            </div>
          }
          isListItem={false}
          alignment="CENTER"
        />
      ),
      spacingModifier: 'NONE' as const,
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Selected colors')).toBeInTheDocument()
    await expect(canvas.getAllByLabelText('Hex color code')).toHaveLength(5)
  },
}
