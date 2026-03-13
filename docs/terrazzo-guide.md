# Terrazzo SCSS Building Guide for unoff-ui

This guide explains how to use the SCSS building scripts to generate CSS files from design tokens in the unoff-ui project.

## What is Terrazzo?

Terrazzo is a tool that converts design tokens (stored in JSON files) into CSS variables usable in the project. These tokens define colors, spacing, typography, and other visual properties of the interface.

> **⚠️ Beta version**: The project currently uses **Terrazzo 2.0.0-rc.0** (`@terrazzo/cli` and `@terrazzo/plugin-css`), installed locally from a cloned repository. Token files follow the **DTCG 2025.10** specification, where dimension values must use the `{ value, unit }` object format rather than plain strings like `"4px"`.

## Terrazzo Files Structure

In the unoff-ui project, Terrazzo files are organized as follows:

```
terrazzo/
  ├── terrazzo.commons.js      # Cross-platform common tokens (spacing, typography, shadows)
  ├── plugins/
  │   └── tokens-studio-compat.js  # Compatibility plugin (required by all configs)
  ├── figma/                   # Configuration for Figma theme
  │   ├── terrazzo.color.js    # Color variables generation
  │   ├── terrazzo.icon.js     # Icon variables generation
  │   ├── terrazzo.text.js     # Text variables generation
  │   └── components/          # Component configurations
  │       ├── terrazzo.accordion.js
  │       ├── terrazzo.button.js
  │       ├── terrazzo.select.js
  │       └── ...
  ├── framer/                  # Configuration for Framer theme
  ├── penpot/                  # Configuration for Penpot theme
  └── sketch/                  # Configuration for Sketch theme
```

## Token Files Structure

Token source files live in `tokens/` and follow two different patterns depending on whether the config supports modes (light/dark variants):

### Resolver-based configs (color tokens, commons)

Configs that need light/dark permutations reference a **resolver JSON file** as their `tokens` entry. The resolver declares the resolution order and per-mode source files:

```
tokens/
  ├── commons.resolver.json          # Common tokens (spacing, typography, border-radius, shadows)
  ├── figma-colors.resolver.json     # Figma color palette with light/dark/figjam modes
  ├── framer-colors.resolver.json
  ├── penpot-colors.resolver.json
  ├── sketch-colors.resolver.json
  ├── commons/
  │   ├── commons.tokens.json        # Base common tokens
  │   └── modes/
  │       ├── commons.effect-light.tokens.json
  │       └── commons.effect-dark.tokens.json
  └── platforms/
      ├── figma/
      │   ├── text.json
      │   ├── modes/
      │   │   ├── figma-light.tokens.json
      │   │   ├── figma-dark.tokens.json
      │   │   └── figjam.tokens.json
      │   └── components/
      │       └── …
      ├── framer/  …
      ├── penpot/  …
      └── sketch/  …
```

### `preprocessTokens` configs (text, component tokens)

Configs for text styles and component tokens list raw JSON paths and run them through `preprocessTokens()` before passing them to `defineConfig`. This handles Tokens Studio legacy `$type` names (e.g. `fontSizes`, `boxShadow`) that Terrazzo 2.0 no longer accepts, by rewriting them to DTCG equivalents in a temporary directory before parse time.

## The `tokens-studio-compat` Plugin

All Terrazzo configs import from `terrazzo/plugins/tokens-studio-compat.js`. It provides three exports:

| Export                             | Usage                                  | Purpose                                                                                                                                        |
| ---------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` (`tokensStudioCompat()`) | `plugins: [tokensStudioCompat(), …]`   | Terrazzo plugin (enforce: `"pre"`) — remaps remaining legacy `$type` values at transform stage                                                 |
| `preprocessTokens(paths)`          | `tokens: preprocessTokens(tokenPaths)` | Preprocesses token files to `.terrazzo-tmp/` before Terrazzo parses them — required when token files contain Tokens Studio-style `$type` names |
| `cssTransform`                     | `css({ transform: cssTransform })`     | Custom CSS transform — handles dimension string values (`"4px"`) and resolves shadow aliases to `var()` references                             |

`cssTransform` must always be passed to the `css()` plugin. Without it, dimension tokens output `undefinedundefined` and shadow tokens that alias commons elevation tokens get incorrectly inlined.

## The Unified `build-scss.js` Script

We use a single script `scripts/build-scss.js` that both lists available Terrazzo files and builds them. The script provides a simple and intuitive syntax for managing design tokens.

## Available Commands

### List All Terrazzo Files

To see all Terrazzo files available in the project:

```bash
npm run scss:list
```

### Build All Terrazzo Files

To generate CSS files from all tokens (including commons):

```bash
npm run scss:build
```

### Build Common Tokens

Common tokens (spacing, border-radius, typography scales, elevation shadows) are theme-independent and live in `terrazzo/terrazzo.commons.js`. They are built automatically with `npm run scss:build`, or directly with:

```bash
npx terrazzo build -c terrazzo/terrazzo.commons.js
```

Output: `src/styles/tokens/commons.scss`

### Build Files for a Specific Theme

To generate CSS files for a specific theme:

```bash
npm run scss:build theme=sketch
```

Available themes are:

- `figma`
- `framer`
- `penpot`
- `sketch`

### Build a Specific Component for a Theme

To generate CSS files for a specific component within a theme:

```bash
npm run scss:build theme=sketch component=button
```

### Build a Specific Component for All Themes

To generate CSS files for a specific component across all available themes:

```bash
npm run scss:build component=button
```

This will build the specified component for every theme that contains it.

### Build Specific Token Types

You can build specific types of design tokens (text, icon, color) instead of entire themes or components:

#### Build a Token Type for All Themes

```bash
# Build text tokens for all themes
npm run scss:build text

# Build color tokens for all themes
npm run scss:build color

# Build icon tokens for all themes
npm run scss:build icon
```

#### Build a Token Type for a Specific Theme

```bash
# Build text tokens for sketch theme only
npm run scss:build theme=sketch text

# Build color tokens for penpot theme only
npm run scss:build theme=penpot color

# Build icon tokens for figma theme only
npm run scss:build theme=figma icon
```

Available token types are:

- `text` - Text styling tokens (font sizes, weights, colors)
- `color` - Color palette tokens
- `icon` - Icon-related tokens

## Common Use Cases

### Update a Component After Modifying Tokens

1. Modify the JSON file corresponding to the component (e.g., `tokens/platforms/sketch/components/button.json`)
2. Run the command to regenerate the component's CSS files:

```bash
npm run scss:build theme=sketch component=button
```

### Update Base Tokens After Modifications

1. Modify a base token file (e.g., `tokens/platforms/penpot/text.json`)
2. Run the command to regenerate the token's CSS files:

```bash
# Update text tokens for penpot theme only
npm run scss:build theme=penpot text

# Or update text tokens for all themes
npm run scss:build text
```

### Update Common Tokens (spacing, typography, shadows)

1. Modify `tokens/commons/commons.tokens.json` or the mode files under `tokens/commons/modes/`
2. Rebuild:

```bash
npm run scss:build
# or directly:
npx terrazzo build -c terrazzo/terrazzo.commons.js
```

### Update All Components for a Theme

```bash
npm run scss:build theme=sketch
```

### Update All Themes

```bash
npm run scss:build
```

### Update Color Tokens Across All Themes

```bash
npm run scss:build color
```

## Adding a New Terrazzo Config

All Terrazzo configs must:

1. Import `tokensStudioCompat` (default), `cssTransform`, and optionally `preprocessTokens` from `../plugins/tokens-studio-compat.js`
2. Pass `tokensStudioCompat()` as the first entry in `plugins`
3. Pass `cssTransform` to the `css()` plugin via `transform: cssTransform`
4. Use `preprocessTokens(tokenPaths)` as the `tokens` value when the source files may contain Tokens Studio `$type` names

## Important Notes

- Generated files are automatically saved in the directories specified in the Terrazzo configuration.
- Do not directly modify generated CSS files, as your changes will be overwritten during the next generation.
- If you add a new component, don't forget to create the corresponding Terrazzo configuration file.
- Terrazzo 2.0.0-rc.0 is currently installed locally. Once a stable release is published, the dependency should be updated in `package.json`.
- The `.terrazzo-tmp/` directory is created automatically by `preprocessTokens` and should be added to `.gitignore`.
