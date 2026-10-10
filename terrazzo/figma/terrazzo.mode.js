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

const PLUGIN_EXCLUDE = COMMONS_TOKENS

const PLUGIN_NATIVE = ['--figma-color-']

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
          exclude: PLUGIN_EXCLUDE,
          prepare: wrapPassthrough(':root, [data-mode="figma-light"]', {
            native: PLUGIN_NATIVE,
          }),
        },
        {
          input: { mode: 'figmaDark' },
          exclude: PLUGIN_EXCLUDE,
          prepare: wrapPassthrough('[data-mode="figma-dark"]', {
            native: PLUGIN_NATIVE,
          }),
        },
        {
          input: { mode: 'figjam' },
          exclude: PLUGIN_EXCLUDE,
          prepare: wrapPassthrough('[data-mode="figjam"]', {
            native: PLUGIN_NATIVE,
          }),
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
