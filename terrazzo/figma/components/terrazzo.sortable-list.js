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
  './tokens/platforms/figma/modes/figma-light.tokens.json',
  './tokens/platforms/figma/modes/figma-dark.tokens.json',
  './tokens/platforms/figma/modes/figjam.tokens.json',
  './tokens/platforms/figma/text.json',
  './tokens/platforms/figma/icon.json',
  './tokens/platforms/figma/components/sortable-list.json',
]

export default defineConfig({
  name: 'Figma Sortable List',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/components/lists/sortable-list/',
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
        'text.**',
        'icon.**',
      ],
      baseSelector: ':root[data-theme="figma"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
