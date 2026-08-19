import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'

export default defineConfig({
  name: 'Yelbolt Icons',
  tokens: ['./tokens/platforms/yelbolt/icon.json'],
  outDir: './src/styles/icons/',
  plugins: [
    css({
      filename: 'styles/yelbolt.scss',
      baseSelector: ':root[data-theme="yelbolt"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
