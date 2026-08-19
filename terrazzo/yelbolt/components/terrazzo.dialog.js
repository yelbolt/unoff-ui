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
  './tokens/platforms/yelbolt/modes/yelbolt-light.tokens.json',
  './tokens/platforms/yelbolt/modes/yelbolt-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/figjam.tokens.json',
  './tokens/platforms/yelbolt/text.json',
  './tokens/platforms/yelbolt/icon.json',
  './tokens/platforms/yelbolt/components/dialog.json',
]

export default defineConfig({
  name: 'Yelbolt Dialog',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/components/dialogs/dialog/',
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
        'text.**',
        'icon.**',
      ],
      baseSelector: ':root[data-theme="yelbolt"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
