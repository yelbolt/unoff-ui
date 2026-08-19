import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from '../plugins/tokens-studio-compat.js'

const tokenPaths = [
  './tokens/commons/commons.tokens.json',
  './tokens/platforms/yelbolt/modes/yelbolt-light.tokens.json',
  './tokens/platforms/yelbolt/modes/yelbolt-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/figjam.tokens.json',
  './tokens/platforms/yelbolt/text.json',
]

export default defineConfig({
  name: 'Yelbolt Text Styles',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/styles/texts/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'styles/yelbolt.scss',
      transform: cssTransform,
      exclude: [
        'yelbolt.color.*',
        'font.**',
        'size.**',
        'shadow.**',
        'border.**',
        'grey.**',
        'alpha.**',
        'elevation.**',
      ],
      baseSelector: ':root[data-theme="yelbolt"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
