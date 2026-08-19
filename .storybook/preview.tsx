import type { Preview, Decorator } from '@storybook/react'
import React from 'react'

import './theme-styles.scss'

const withTheme: Decorator = (Story, context) => {
  React.useEffect(() => {
    const { themes, modes } = context.globals

    if (themes) {
      document.documentElement.setAttribute('data-theme', themes)
    }

    if (modes) {
      document.documentElement.setAttribute('data-mode', modes)

      const backgroundMap = {
        'figma-light': '#ffffff',
        'figma-dark': '#2c2c2c',
        figjam: '#ffffff',
        'penpot-light': '#ffffff',
        'penpot-dark': '#000000',
        'sketch-light': '#ffffff',
        'sketch-dark': '#202022',
        'framer-light': '#ffffff',
        'framer-dark': '#111111',
        'yelbolt-light': '#ffffff',
        'yelbolt-dark': '#202022',
      }

      const bgValue = backgroundMap[modes as keyof typeof backgroundMap]
      document.documentElement.style.backgroundColor = bgValue

      if (context.globals.backgrounds) {
        context.globals.backgrounds.value = bgValue
      }
    }
  }, [context.globals.themes, context.globals.modes])

  return <Story />
}

const preview: Preview = {
  globalTypes: {
    themes: {
      defaultValue: 'figma',
      description: 'Select the UI theme',
      toolbar: {
        title: 'UI Theme',
        icon: 'paintbrush',
        items: ['figma', 'penpot', 'sketch', 'framer', 'yelbolt'],
        dynamicTitle: true,
      },
    },
    modes: {
      defaultValue: 'figma-dark',
      description: 'Select the mode',
      toolbar: {
        title: 'Color Mode',
        icon: 'photo',
        items: [
          'figma-light',
          'figma-dark',
          'figjam',
          'penpot-light',
          'penpot-dark',
          'sketch-light',
          'sketch-dark',
          'framer-light',
          'framer-dark',
          'yelbolt-light',
          'yelbolt-dark',
        ],
        dynamicTitle: true,
      },
    },
  },
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
  decorators: [withTheme],
  tags: ['autodocs'],
}

export default preview
