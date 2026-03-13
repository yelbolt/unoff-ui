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
  './tokens/platforms/penpot/modes/penpot-light.tokens.json',
  './tokens/platforms/penpot/modes/penpot-dark.tokens.json',
  './tokens/platforms/penpot/text.json',
  './tokens/platforms/penpot/icon.json',
  './tokens/platforms/penpot/components/color-chip.json',
]

export default defineConfig({
  name: 'Penpot Color Chip',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/components/tags/color-chip/',
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
        'text.**',
        'icon.**',
      ],
      baseSelector: ':root[data-theme="penpot"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
