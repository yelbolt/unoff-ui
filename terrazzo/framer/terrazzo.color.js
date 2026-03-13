import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import tokensStudioCompat, {
  cssTransform,
} from '../plugins/tokens-studio-compat.js'

export default defineConfig({
  name: 'Framer Colors',
  tokens: ['./tokens/framer-colors.resolver.json'],
  outDir: './src/styles/tokens/',
  plugins: [
    tokensStudioCompat(),
    css({
      filename: 'framer-colors.scss',
      transform: cssTransform,
      permutations: [
        {
          input: { mode: 'framerLight' },
          prepare: (css) => `[data-mode="framer-light"] {\n  ${css}\n}`,
        },
        {
          input: { mode: 'framerDark' },
          prepare: (css) => `[data-mode="framer-dark"] {\n  ${css}\n}`,
        },
      ],
    }),
  ],
  lint: {
    rules: {},
  },
})
