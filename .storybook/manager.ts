import { addons, types } from 'storybook/manager-api'
import Unoff from './unoff'
import { ThemeTool } from './addons/theme-switcher/ThemeTool'

addons.setConfig({
  theme: Unoff,
})

addons.register('unoff/theme-switcher', () => {
  addons.add('unoff/theme-switcher/theme-tool', {
    type: types.TOOL,
    title: 'Theme',
    match: ({ viewMode }) => !!viewMode && /^(story|docs)$/.test(viewMode),
    render: ThemeTool,
  })
})
