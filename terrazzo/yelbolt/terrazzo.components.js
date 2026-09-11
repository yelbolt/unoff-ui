import { defineComponentsConfig } from '../plugins/component-config.js'

const FAMILIES = ['isb', 'ntl', 'tcn', 'uicp', 'uics', 'uno', 'ylb']

export default defineComponentsConfig({
  platform: 'yelbolt',
  modes: FAMILIES.flatMap((f) => [`${f}-light`, `${f}-dark`]),
  extraTokens: ['./tokens/platforms/yelbolt/colors.json'],
  colorExcludes: [
    'color.**',
    ...FAMILIES.map((f) => `${f.toUpperCase()}.**`),
  ],
})
