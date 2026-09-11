import { defineComponentsConfig } from '../plugins/component-config.js'

export default defineComponentsConfig({
  platform: 'penpot',
  modes: ['penpot-light', 'penpot-dark'],
  colorExcludes: ['penpot.color.**'],
})
