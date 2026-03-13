import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'

export default defineConfig({
  name: 'Framer Icons',
  tokens: ['./tokens/platforms/framer/icon.json'],
  outDir: './src/styles/icons/',
  plugins: [
    css({
      filename: 'styles/framer.scss',
      baseSelector: ':root[data-theme="framer"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
