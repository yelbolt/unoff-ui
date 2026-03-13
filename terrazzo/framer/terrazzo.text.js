import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from '../plugins/tokens-studio-compat.js'

const tokenPaths = [
  './tokens/commons/commons.tokens.json',
  './tokens/platforms/framer/modes/framer-light.tokens.json',
  './tokens/platforms/framer/modes/framer-dark.tokens.json',
  './tokens/platforms/framer/text.json',
]

export default defineConfig({
  name: 'Framer Text Styles',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/styles/texts/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'styles/framer.scss',
      transform: cssTransform,
      exclude: [
        'framer.color.**',
        'font.**',
        'size.**',
        'shadow.**',
        'border.**',
        'grey.**',
        'alpha.**',
        'elevation.**',
      ],
      baseSelector: ':root[data-theme="framer"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
