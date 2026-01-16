import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'

export default defineConfig({
  name: 'Figma text styles',
  tokens: [
    './tokens/commons/commons.tokens.json',
    './tokens/platforms/figma/modes/figma-light.tokens.json',
    './tokens/platforms/figma/modes/figma-dark.tokens.json',
    './tokens/platforms/figma/modes/figjam.tokens.json',
    './tokens/platforms/figma/text.json',
  ],
  outDir: './src/styles/texts/',
  plugins: [
    css({
      filename: 'styles/figma.scss',
      exclude: [
        'figma.color.*',
        'font.*',
        'size.*',
        'shadow.*',
        'border.*',
        'grey.*',
        'alpha.*',
        'elevation.*',
      ],
      baseSelector: ':root[data-theme="figma"]',
    }),
  ],
  lint: {
    rules: {
      // my lint rules
    },
  },
})
