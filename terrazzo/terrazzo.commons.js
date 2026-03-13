import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
} from './plugins/tokens-studio-compat.js'

export default defineConfig({
  name: 'Commons Tokens',
  tokens: ['./tokens/commons.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'commons.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'light' },
          prepare: (css) => `:root {\n  ${css}\n}`,
        },
        {
          input: { mode: 'light' },
          include: ['elevation.**', 'shadow.hud', 'shadow.floatingWindow'],
          prepare: (css) => `[data-mode*="light"] {\n  ${css}\n}`,
        },
        {
          input: { mode: 'dark' },
          include: ['elevation.**', 'shadow.hud', 'shadow.floatingWindow'],
          prepare: (css) => `[data-mode*="dark"] {\n  ${css}\n}`,
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
