import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
} from '../plugins/tokens-studio-compat.js'

export default defineConfig({
  name: 'Sketch Colors',
  tokens: ['./tokens/sketch-colors.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'sketch-colors.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'sketchLight' },
          prepare: (css) => `[data-mode="sketch-light"] {\n  ${css}\n}`,
        },
        {
          input: { mode: 'sketchDark' },
          prepare: (css) => `[data-mode="sketch-dark"] {\n  ${css}\n}`,
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
