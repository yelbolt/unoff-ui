import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from '../plugins/tokens-studio-compat.js'

const tokenPaths = [
  './tokens/commons/commons.tokens.json',
  './tokens/platforms/sketch/modes/sketch-light.tokens.json',
  './tokens/platforms/sketch/modes/sketch-dark.tokens.json',
  './tokens/platforms/sketch/text.json',
]

export default defineConfig({
  name: 'Sketch Text Styles',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/styles/texts/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'styles/sketch.scss',
      transform: cssTransform,
      exclude: [
        'sketch.color.**',
        'font.**',
        'control.**',
        'radius.**',
        'space.**',
        'stroke.**',
        'type.**',
        'size.**',
        'shadow.**',
        'border.**',
        'grey.**',
        'alpha.**',
        'elevation.**',
        'motion.**',
        'duration.**',
        'easing.**',
        'transform.**',
      ],
      baseSelector: ':root[data-theme="sketch"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
