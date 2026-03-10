import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    {
      name: '@chromatic-com/storybook',
      options: {
        configFile: 'chromatic.config.json',
      },
    },
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
  ],
  staticDirs: ['../src/styles', './'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, '../src/components'),
      '@stories': path.resolve(__dirname, '../src/stories'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@tps': path.resolve(__dirname, '../src/types'),
    }
    return config
  },
}
export default config
