import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from '../../plugins/tokens-studio-compat.js'

const tokenPaths = [
  './tokens/commons/commons.tokens.json',
  './tokens/platforms/yelbolt/modes/isb-light.tokens.json',
  './tokens/platforms/yelbolt/modes/isb-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/ntl-light.tokens.json',
  './tokens/platforms/yelbolt/modes/ntl-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/tcn-light.tokens.json',
  './tokens/platforms/yelbolt/modes/tcn-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/uicp-light.tokens.json',
  './tokens/platforms/yelbolt/modes/uicp-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/uics-light.tokens.json',
  './tokens/platforms/yelbolt/modes/uics-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/uno-light.tokens.json',
  './tokens/platforms/yelbolt/modes/uno-dark.tokens.json',
  './tokens/platforms/yelbolt/modes/ylb-light.tokens.json',
  './tokens/platforms/yelbolt/modes/ylb-dark.tokens.json',
  './tokens/platforms/yelbolt/colors.json',
  './tokens/platforms/yelbolt/text.json',
  './tokens/platforms/yelbolt/icon.json',
  './tokens/platforms/yelbolt/components/input.json',
]

export default defineConfig({
  name: 'Yelbolt Input',
  tokens: preprocessTokens(tokenPaths),
  outDir: './src/components/inputs/input/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'styles/yelbolt.scss',
      transform: cssTransform,
      exclude: [
        'color.**',
        'ISB.**',
        'NTL.**',
        'TCN.**',
        'UICP.**',
        'UICS.**',
        'UNO.**',
        'YLB.**',
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
