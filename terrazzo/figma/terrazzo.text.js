import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from '../plugins/tokens-studio-compat.js'

const tokenPaths = [
  './tokens/commons/commons.tokens.json',
  './tokens/platforms/figma/modes/figma-light.tokens.json',
  './tokens/platforms/figma/modes/figma-dark.tokens.json',
  './tokens/platforms/figma/modes/figjam.tokens.json',
  './tokens/platforms/figma/text.json',
]

export default defineConfig({
  name: 'Figma Text Styles',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/styles/texts/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'styles/figma.scss',
      transform: cssTransform,
      exclude: [
        'figma.color.**',
        'font.**',
        'size.**',
        'shadow.**',
        'border.**',
        'grey.**',
        'alpha.**',
        'elevation.**',
      ],
      baseSelector: ':root[data-theme="figma"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
