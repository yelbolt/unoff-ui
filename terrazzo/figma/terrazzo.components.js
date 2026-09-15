import { defineComponentsConfig } from '../plugins/component-config.js'

export default defineComponentsConfig({
  platform: 'figma',
  modes: ['figma-light', 'figma-dark', 'figjam'],
  colorExcludes: ['figma.color.**'],
})
