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
  './tokens/platforms/sketch/modes/sketch-light.tokens.json',
  './tokens/platforms/sketch/modes/sketch-dark.tokens.json',
  './tokens/platforms/sketch/text.json',
  './tokens/platforms/sketch/components/actions-item.json',
]

export default defineConfig({
  name: 'Sketch Actions Item',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/components/lists/actions-item/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'styles/sketch.scss',
      transform: cssTransform,
      exclude: [
        'sketch.color.**',
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
      baseSelector: ':root[data-theme="sketch"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
