import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
} from '../plugins/tokens-studio-compat.js'

export default defineConfig({
  name: 'Penpot Colors',
  tokens: ['./tokens/penpot-colors.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'penpot-colors.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'penpotLight' },
          prepare: (css) => `[data-mode="penpot-light"] {\n  ${css}\n}`,
        },
        {
          input: { mode: 'penpotDark' },
          prepare: (css) => `[data-mode="penpot-dark"] {\n  ${css}\n}`,
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
