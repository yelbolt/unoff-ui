# Figma Code Connect

This project uses [Figma Code Connect](https://github.com/figma/code-connect) to link Figma components to React components.

## ✅ Current Status

✅ **Code Connect Files Created**: 6 connected components  
✅ **Validation**: All files pass validation  
⚠️ **Figma Publication**: Token requires proper scopes

### Figma Token

The current token only has the "File Read" scope. To publish, you need to regenerate the token with:

- **File Read** (read files)
- **Code Connect Write** (write Code Connect connections)

1. Go to https://www.figma.com/developers/api#access-tokens
2. Generate a new token with both scopes above
3. Replace `FIGMA_ACCESS_TOKEN` in `.env`
4. Run `npm run figma:publish`

## Configuration

Code Connect files are located next to each component with the `.figma.tsx` extension.

Example: `Button.figma.tsx` for the `Button.tsx` component

## Connected Components

The following components have been connected with Code Connect:

### Actions

- **Button** (`src/components/actions/button/Button.figma.tsx`)
  - Variants: PRIMARY, SECONDARY, TERTIARY, DESTRUCTIVE, ALTERNATIVE, ICON

### Assets

- **Icon** (`src/components/assets/icon/Icon.figma.tsx`)
  - Type: PICTO (example with 'info' icon)

### Inputs

- **Input** (`src/components/inputs/input/Input.figma.tsx`)
  - Types: TEXT, LONG_TEXT, NUMBER, COLOR
- **Dropdown** (`src/components/inputs/dropdown/Dropdown.figma.tsx`)
  - Alignments: LEFT (HUG), FILL (STRETCH)

### Lists

- **Tabs** (`src/components/lists/tabs/Tabs.figma.tsx`)
  - Directions: HORIZONTAL, VERTICAL
  - Modes: Normal, Flex

### Tags

- **Chip** (`src/components/tags/chip/Chip.figma.tsx`)
  - State: ACTIVE, INACTIVE, ON_BACKGROUND

## Publishing to Figma

To publish Code Connect to Figma, you must:

1. Obtain a Figma access token from https://www.figma.com/developers/api#access-tokens
2. Set the environment variable:
   ```bash
   export FIGMA_ACCESS_TOKEN=your_token_here
   ```
3. Publish the Code Connect files:
   ```bash
   npm run figma:publish
   ```

## NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "figma:publish": "figma connect publish",
    "figma:unpublish": "figma connect unpublish",
```

    "figma:parse": "figma connect parse"

}
}

````

## File Structure

Each `.figma.tsx` file follows this structure:

```tsx
import { figma } from '@figma/code-connect'
import ComponentName from './ComponentName'

figma.connect(
  ComponentName,
  'https://www.figma.com/design/QlBdsfEcaUsGBzqA20xbNi/Unoff?node-id=X:XXXX',
  {
    props: {
      // Mapping Figma props to React
    },
    example: (props) => <ComponentName {...props} />
  }
)
````

## Next Steps

To complete Code Connect coverage, consider adding:

- Dialog components (Dialog, Message, Consent)
- Slot components (Bar, FormItem, Section)
- Additional list components (ColorItem, ActionsItem, etc.)
- Additional variants for existing components

## Resources

- [Figma Code Connect Documentation](https://github.com/figma/code-connect)
- [API Reference](https://github.com/figma/code-connect#api-reference)
- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode)
