# Unoff UI Theme Generator

## Overview

The Unoff UI Theme Generator is a tool that allows you to easily create new themes for the Unoff design system. It automates the creation and configuration of all necessary files to define a new theme, based on the existing Figma theme structure.

## Features

The theme generator offers the following features:

- Creation of a complete folder structure for the new theme
- Duplication and customization of JSON tokens from the Sketch theme
- Configuration of Terrazzo files for the new theme
- Setup of light and dark modes
- Support for Terrazzo components
- Automatic update of SCSS imports in all relevant files
- Automatic configuration of Storybook to support the new theme

## Usage

To create a new theme, run the following command at the project root:

```bash
npm run create:theme
```

The script will guide you through the process with the following steps:

1. **Theme name input**: Enter the name of the new theme when prompted.
2. **File generation**: The script automatically generates all necessary files.
3. **Terrazzo configuration**: Terrazzo configuration files are created and configured.
4. **Storybook configuration**: The theme is automatically configured to be visible and usable in Storybook.

## Generated File Structure

For a theme named `mytheme`, the script creates:

- `tokens/platforms/mytheme/`: Contains theme-specific JSON tokens
- `terrazzo/mytheme/`: Contains Terrazzo configuration files
- `terrazzo/mytheme/components/`: Contains component-specific configurations

## Post-Generation Customization

After generating the theme, you can:

1. Modify JSON tokens in `tokens/platforms/mytheme/`
2. Customize the Terrazzo configuration in `terrazzo/mytheme/`
3. Generate SCSS files from tokens using the command `npm run scss:build:theme theme=mytheme`
4. Preview your theme in Storybook with `npm run storybook`

## CSS Selectors

The generator automatically configures:

- The main selector `:root[data-theme="mytheme"]`
- Mode selectors for light and dark themes
- Background color variants in Storybook

## Storybook Integration

The script automatically configures Storybook to display the new theme in:

- The theme selector in the toolbar
- Light and dark modes
- Appropriate background colors for each mode

## Technical Details

The script:

- Copies and adapts tokens from the Figma theme
- Updates all necessary SCSS imports
- Handles references to icons and other assets
- Configures CSS selectors to ensure proper theme isolation

## Troubleshooting Tips

If you encounter issues:

- Make sure the Figma theme exists and is properly configured
- Check write permissions in the destination folders
- Review log files for any possible errors

## Future Development

Areas for improvement for the theme generator:

- Support for other source themes besides Figma
- More advanced customization options during generation
- Automatic validation of generated tokens
