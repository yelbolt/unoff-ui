import { defineComponentsConfig } from '../plugins/component-config.js'

export default defineComponentsConfig({
  platform: 'sketch',
  modes: ['sketch-light', 'sketch-dark'],
  colorExcludes: ['sketch.color.**'],
})
