import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  wrapFallbacks,
  wrapPassthrough,
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
  name: 'Figma Modes',
  tokens: ['./tokens/figma-modes.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'figma-modes.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'figmaLight' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="figma-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'figmaDark' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="figma-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'figjam' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="figjam"] {\n  ${css}\n}`
          ),
        },
      ],
    }),
    css({
      filename: 'figma-plugin.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'figmaLight' },
          exclude: COMMONS_TOKENS,
          prepare: wrapPassthrough(':root', { keep: [] }),
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
