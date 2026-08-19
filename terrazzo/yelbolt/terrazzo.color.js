import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  wrapFallbacks,
  wrapPassthrough,
} from '../plugins/tokens-studio-compat.js'

export default defineConfig({
  name: 'Yelbolt Colors',
  tokens: ['./tokens/yelbolt-colors.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'yelbolt-colors.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'figmaLight' },
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'figmaDark' },
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'figjam' },
          prepare: wrapFallbacks(
            (css) => `[data-mode="figjam"] {\n  ${css}\n}`
          ),
        },
      ],
    }),
    css({
      filename: 'yelbolt-plugin.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'figmaLight' },
          prepare: wrapPassthrough(':root'),
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
