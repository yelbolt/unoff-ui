import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  wrapFallbacks,
} from '../plugins/tokens-studio-compat.js'

const COMMONS_TOKENS = [
  'size.**',
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
  name: 'Framer Colors',
  tokens: ['./tokens/framer-colors.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'framer-colors.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'framerLight' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="framer-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'framerDark' },
          exclude: COMMONS_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="framer-dark"] {\n  ${css}\n}`
          ),
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
