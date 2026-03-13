import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
} from '../plugins/tokens-studio-compat.js'

export default defineConfig({
  name: 'Figma Colors',
  tokens: ['./tokens/figma-colors.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'figma-colors.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'figmaLight' },
          prepare: (css) => `[data-mode="figma-light"] {\n  ${css}\n}`,
        },
        {
          input: { mode: 'figmaDark' },
          prepare: (css) => `[data-mode="figma-dark"] {\n  ${css}\n}`,
        },
        {
          input: { mode: 'figjam' },
          prepare: (css) => `[data-mode="figjam"] {\n  ${css}\n}`,
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
