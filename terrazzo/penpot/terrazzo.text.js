import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from '../plugins/tokens-studio-compat.js'

const tokenPaths = [
  './tokens/commons/commons.tokens.json',
  './tokens/platforms/penpot/modes/penpot-light.tokens.json',
  './tokens/platforms/penpot/modes/penpot-dark.tokens.json',
  './tokens/platforms/penpot/text.json',
]

export default defineConfig({
  name: 'Penpot Text Styles',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/styles/texts/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'styles/penpot.scss',
      transform: cssTransform,
      exclude: [
        'penpot.color.**',
        'font.**',
        'size.**',
        'shadow.**',
        'border.**',
        'grey.**',
        'alpha.**',
        'elevation.**',
      ],
      baseSelector: ':root[data-theme="penpot"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
