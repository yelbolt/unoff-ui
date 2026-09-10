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
  name: 'Penpot Modes',
  tokens: ['./tokens/penpot-modes.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'penpot-modes.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'penpotLight' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="penpot-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'penpotDark' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="penpot-dark"] {\n  ${css}\n}`
          ),
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
