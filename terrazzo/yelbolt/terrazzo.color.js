import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
  wrapFallbacks,
} from '../plugins/tokens-studio-compat.js'

const BRAND_RAMPS = [
  'ISB.**',
  'NTL.**',
  'TCN.**',
  'UICP.**',
  'UICS.**',
  'UNO.**',
  'YLB.**',
]

const COMMONS_TOKENS = [
  'size.**',
  'font.**',
  'border.**',
  'grey.**',
  'alpha.**',
  'shadow.**',
  'elevation.**',
  'duration.**',
  'easing.**',
  'transform.**',
]

const PRIMITIVE_TOKENS = [...BRAND_RAMPS, ...COMMONS_TOKENS]

export default defineConfig({
  name: 'Yelbolt Colors',
  tokens: ['./tokens/yelbolt-colors.resolver.json'],
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
        {
          input: { mode: 'isbLight' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-isb-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'isbDark' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-isb-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'ntlLight' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-ntl-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'ntlDark' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-ntl-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'tcnLight' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-tcn-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'tcnDark' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-tcn-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'uicpLight' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-uicp-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'uicpDark' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-uicp-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'uicsLight' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-uics-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'uicsDark' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-uics-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'unoLight' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-uno-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'unoDark' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-uno-dark"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'ylbLight' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-ylb-light"] {\n  ${css}\n}`
          ),
        },
        {
          input: { mode: 'ylbDark' },
          exclude: PRIMITIVE_TOKENS,
          prepare: wrapFallbacks(
            (css) => `[data-mode="yelbolt-ylb-dark"] {\n  ${css}\n}`
          ),
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
