import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'

export default defineConfig({
  name: 'Penpot Icons',
  tokens: ['./tokens/platforms/penpot/icon.json'],
  outDir: './src/styles/icons/',
  plugins: [
    css({
      filename: 'styles/penpot.scss',
      baseSelector: ':root[data-theme="penpot"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
