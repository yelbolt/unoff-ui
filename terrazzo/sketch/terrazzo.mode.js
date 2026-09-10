import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  wrapFallbacks,
} from '../plugins/tokens-studio-compat.js'

const COMMONS_TOKENS = [
  'scale.**',
  'font.**',
  'border.**',
  'grey.**',
  'alpha.**',
  'shadow.**',
  'elevation.**',
  'duration.**',
  'easing.**',
  'transform.**',
]

export default defineConfig({
  name: 'Sketch Modes',
  tokens: ['./tokens/sketch-modes.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'sketch-modes.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'sketchLight' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="sketch-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'sketchDark' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="sketch-dark"] {\n  ${css}\n}`
          ),
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
