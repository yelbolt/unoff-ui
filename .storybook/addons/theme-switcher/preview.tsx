import type { Decorator } from '@storybook/react'
import type { GlobalTypes } from 'storybook/internal/csf'
import React from 'react'
import { buildDataMode, BACKGROUND_MAP } from './theme-config'

const withTheme: Decorator = (Story, context) => {
  React.useEffect(() => {
    const { themes, family, mode } = context.globals

    if (!themes || !mode) {
      return
    }

    document.documentElement.setAttribute('data-theme', themes)

    const dataMode = buildDataMode(themes, family, mode)
    document.documentElement.setAttribute('data-mode', dataMode)

    const bgValue = BACKGROUND_MAP[dataMode]
    document.documentElement.style.backgroundColor = bgValue

    if (context.globals.backgrounds) {
      context.globals.backgrounds.value = bgValue
    }
  }, [context.globals.themes, context.globals.family, context.globals.mode])

  return <Story />
}

export const globalTypes: GlobalTypes = {
  themes: {
    defaultValue: 'figma',
  },
  family: {
    defaultValue: 'design',
  },
  mode: {
    defaultValue: 'dark',
  },
}

export const decorators: Decorator[] = [withTheme]
