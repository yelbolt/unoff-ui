import type { Meta, StoryObj } from '@storybook/react-vite'
import Text from '@components/assets/text/Text'

const meta = {
  title: 'Foundations/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const AllStyles: Story = {
  args: {
    children: 'Default text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text>Default text</Text>
      <Text size="small">Small text</Text>
      <Text size="large">Large text</Text>
      <Text size="xlarge">Extra large text</Text>
      <Text weight="medium">Medium text</Text>
      <Text weight="bold">Bold text</Text>
      <Text color="secondary">Secondary text</Text>
      <Text color="tertiary">Tertiary text</Text>
      <div
        style={{
          background: 'var(--color-text-primary-default)',
          padding: '8px',
        }}
      >
        <Text color="inverse">Inverse text</Text>
      </div>
      <div style={{ width: '200px' }}>
        <Text truncate>
          This text is very long and will be truncated with an ellipsis at the
          end
        </Text>
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  args: {
    children: 'Demo text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text size="small">Small text (small): {getSizeInfo('small')}</Text>
      <Text>Default text (default): {getSizeInfo('default')}</Text>
      <Text size="large">Large text (large): {getSizeInfo('large')}</Text>
      <Text size="xlarge">
        Extra large text (xlarge): {getSizeInfo('xlarge')}
      </Text>
    </div>
  ),
}

export const AllWeights: Story = {
  args: {
    children: 'Demo text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text>Normal text (default): 400</Text>
      <Text weight="medium">Medium text: 500</Text>
      <Text weight="bold">Bold text: 600</Text>
    </div>
  ),
}

export const AllColors: Story = {
  args: {
    children: 'Demo text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text>Primary text (primary)</Text>
      <Text color="secondary">Secondary text (secondary)</Text>
      <Text color="tertiary">Tertiary text (tertiary)</Text>
      <Text color="success">Success text (success)</Text>
      <Text color="warning">Warning text (warning)</Text>
      <Text color="alert">Alert text (alert)</Text>
      <Text color="link">Link text (link)</Text>
      <div
        style={{
          background: 'var(--color-text-primary-default)',
          padding: '8px',
        }}
      >
        <Text color="inverse">Inverse text (inverse)</Text>
      </div>
    </div>
  ),
}

function getSizeInfo(size: string) {
  switch (size) {
    case 'small':
      return '11px'
    case 'default':
      return '12px'
    case 'large':
      return '13px'
    case 'xlarge':
      return '14px'
    default:
      return '12px'
  }
}
