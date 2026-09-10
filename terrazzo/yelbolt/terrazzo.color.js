import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, { cssTransform } from '../plugins/tokens-studio-compat.js'

const BRAND_RAMPS = [
  'ISB.**',
  'NTL.**',
  'TCN.**',
  'UICP.**',
  'UICS.**',
  'UNO.**',
  'YLB.**',
]

export default defineConfig({
  name: 'Yelbolt Colors',
  tokens: ['./tokens/yelbolt-modes.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'yelbolt-colors.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'ylbLight' },
          include: BRAND_RAMPS,
          prepare: (css) => `:root {\n  ${css}\n}`,
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
