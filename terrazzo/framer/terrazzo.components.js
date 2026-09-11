import { defineComponentsConfig } from '../plugins/component-config.js'

export default defineComponentsConfig({
  platform: 'framer',
  modes: ['framer-light', 'framer-dark'],
  colorExcludes: ['framer.color.**'],
})
