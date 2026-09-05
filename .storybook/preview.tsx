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
        'yelbolt-isb-light': '#fffec3',
        'yelbolt-isb-dark': '#160700',
        'yelbolt-ntl-light': '#ffffe8',
        'yelbolt-ntl-dark': '#0d0c00',
        'yelbolt-tcn-light': '#ffe3fa',
        'yelbolt-tcn-dark': '#260008',
        'yelbolt-uicp-light': '#caffff',
        'yelbolt-uicp-dark': '#001119',
        'yelbolt-uics-light': '#c8ffd1',
        'yelbolt-uics-dark': '#001500',
        'yelbolt-uno-light': '#f6f5ff',
        'yelbolt-uno-dark': '#0d0035',
        'yelbolt-ylb-light': '#ffff8c',
        'yelbolt-ylb-dark': '#140900',
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
          'yelbolt-isb-light',
          'yelbolt-isb-dark',
          'yelbolt-ntl-light',
          'yelbolt-ntl-dark',
          'yelbolt-tcn-light',
          'yelbolt-tcn-dark',
          'yelbolt-uicp-light',
          'yelbolt-uicp-dark',
          'yelbolt-uics-light',
          'yelbolt-uics-dark',
          'yelbolt-uno-light',
          'yelbolt-uno-dark',
          'yelbolt-ylb-light',
          'yelbolt-ylb-dark',
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
