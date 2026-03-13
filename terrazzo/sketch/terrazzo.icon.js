import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'

export default defineConfig({
  name: 'Sketch Icons',
  tokens: ['./tokens/platforms/sketch/icon.json'],
  outDir: './src/styles/icons/',
  plugins: [
    css({
      filename: 'styles/sketch.scss',
      baseSelector: ':root[data-theme="sketch"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
