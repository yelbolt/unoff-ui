import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from '../../plugins/tokens-studio-compat.js'

const tokenPaths = [
  './tokens/commons/commons.tokens.json',
  './tokens/commons/modes/commons.effect-dark.tokens.json',
  './tokens/commons/modes/commons.effect-light.tokens.json',
  './tokens/platforms/framer/modes/framer-light.tokens.json',
  './tokens/platforms/framer/modes/framer-dark.tokens.json',
  './tokens/platforms/framer/text.json',
  './tokens/platforms/framer/components/actions-item.json',
]

export default defineConfig({
  name: 'Framer Actions Item',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/components/lists/actions-item/',
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
        'text.**',
        'icon.**',
      ],
      baseSelector: ':root[data-theme="framer"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
