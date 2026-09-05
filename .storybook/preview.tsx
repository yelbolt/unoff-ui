import type { Preview } from '@storybook/react'
import {
  globalTypes as themeGlobalTypes,
  decorators as themeDecorators,
} from './addons/theme-switcher/preview'

import './theme-styles.scss'

const preview: Preview = {
  globalTypes: themeGlobalTypes,
  decorators: themeDecorators,
  parameters: {
    options: {
      storySort: {
        order: ['Getting Started', 'Foundations', 'Components', 'Patterns'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    test: {
      autoplay: false,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
      autoplay: false,
      test: 'todo',
    },
  },
  tags: ['autodocs'],
}

export default preview
