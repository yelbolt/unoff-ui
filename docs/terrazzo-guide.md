# Terrazzo SCSS Building Guide for unoff-ui

This guide explains how to use the SCSS building scripts to generate CSS files from design tokens in the unoff-ui project.

## What is Terrazzo?

Terrazzo is a tool that converts design tokens (stored in JSON files) into CSS variables usable in the project. These tokens define colors, spacing, typography, and other visual properties of the interface.

> **⚠️ Beta version**: The project currently uses **Terrazzo 2.0.0-rc.0** (`@terrazzo/cli` and `@terrazzo/plugin-css`), installed locally from a cloned repository. Token files follow the **DTCG 2025.10** specification, where dimension values must use the `{ value, unit }` object format rather than plain strings like `"4px"`.

## Terrazzo Files Structure

In the unoff-ui project, Terrazzo files are organized as follows:

```
terrazzo/
  ├── terrazzo.commons.js       # Cross-platform common tokens (spacing, typography, shadows)
  ├── components.manifest.js    # Single registry of all 43 components (name, category, include
  │                              # globs) shared by every theme's terrazzo.components.js
  ├── plugins/
  │   ├── tokens-studio-compat.js   # Compatibility plugin (required by all configs)
  │   └── component-config.js       # defineComponentsConfig() — builds the one config that emits
  │                                  # every component stylesheet for a given theme from the manifest
  ├── figma/                    # Configuration for Figma theme
  │   ├── terrazzo.components.js    # Emits styles/figma.scss for all 43 components (manifest-driven)
  │   ├── terrazzo.mode.js          # Mode variables generation (color, plus dimension/motion on themes that carry them)
  │   ├── terrazzo.icon.js          # Icon variables generation
  │   └── terrazzo.text.js          # Text variables generation
  ├── framer/                  # Configuration for Framer theme (same 4-file shape as figma/)
  ├── penpot/                  # Configuration for Penpot theme (same 4-file shape as figma/)
  ├── sketch/                  # Configuration for Sketch theme (same 4-file shape as figma/)
  └── yelbolt/                 # Configuration for Yelbolt theme
      ├── terrazzo.color.js       # Primitive color ramps only (yelbolt-colors.scss) — yelbolt is the
      │                           # only theme with its own primitive palette (colors.tokens.json), so it is
      │                           # the only one with a standalone `color` build alongside `mode`
      ├── terrazzo.components.js  # Emits styles/yelbolt.scss for all 43 components (manifest-driven)
      ├── terrazzo.mode.js        # Semantic mode layer (color, dimension, motion), 14 family × light/dark permutations
      └── terrazzo.text.js
```

Every theme's `terrazzo.components.js` is a thin call to `defineComponentsConfig()` (in
`terrazzo/plugins/component-config.js`) passing only `platform`, its mode list, and its color
excludes — one Terrazzo config emits all 43 component stylesheets for that theme by iterating
`COMPONENTS` from `components.manifest.js`. There are no more per-component config files; adding a
component means adding one entry to the manifest (see "Adding a New Component" below), not a
new file per theme.

## Token Files Structure

Token source files live in `tokens/` and follow two different patterns depending on whether the config supports modes (light/dark variants):

### Resolver-based configs (mode tokens, commons)

Configs that need light/dark permutations reference a **resolver JSON file** as their `tokens` entry. The resolver declares the resolution order and per-mode source files:

```
tokens/
  ├── commons.resolver.json          # Common tokens (spacing, typography, border-radius, shadows)
  ├── figma-modes.resolver.json      # Figma mode layer (color, per light/dark/figjam)
  ├── framer-modes.resolver.json
  ├── penpot-modes.resolver.json
  ├── sketch-modes.resolver.json
  ├── yelbolt-modes.resolver.json    # Shared by terrazzo.color.js (primitives) and terrazzo.mode.js (semantic layer)
  ├── commons/
  │   ├── commons.tokens.json        # Base common tokens
  │   └── modes/
  │       ├── commons.effect-light.tokens.json
  │       └── commons.effect-dark.tokens.json
  └── platforms/
      ├── figma/
      │   ├── text.tokens.json
      │   ├── modes/
      │   │   ├── figma-light.tokens.json
      │   │   ├── figma-dark.tokens.json
      │   │   └── figjam.tokens.json
      │   └── components/
      │       └── …
      ├── framer/  …
      ├── penpot/  …
      ├── sketch/  …
      └── yelbolt/
          ├── colors.tokens.json   # Primitive brand ramps (YLB.*, NTL.*, …) — built by terrazzo.color.js only
          ├── text.tokens.json
          ├── modes/                # 14 brand × light/dark mode files (color + dimension + motion)
          └── components/
              └── …
```

### `preprocessTokens` configs (text, component tokens)

Configs for text styles and component tokens list raw JSON paths and run them through `preprocessTokens()` before passing them to `defineConfig`. This handles Tokens Studio legacy `$type` names (e.g. `fontSizes`, `boxShadow`) that Terrazzo 2.0 no longer accepts, by rewriting them to DTCG equivalents in a temporary directory before parse time.

## The `tokens-studio-compat` Plugin

All Terrazzo configs import from `terrazzo/plugins/tokens-studio-compat.js`. It provides three exports:

| Export                             | Usage                                  | Purpose                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` (`tokensStudioCompat()`) | `plugins: [tokensStudioCompat(), …]`   | Terrazzo plugin (enforce: `"pre"`) — remaps remaining legacy `$type` values at transform stage                                                                                                                                                                                                                                                                                                 |
| `preprocessTokens(paths)`          | `tokens: preprocessTokens(tokenPaths)` | Preprocesses token files to `.terrazzo-tmp/` before Terrazzo parses them — required when token files contain Tokens Studio-style `$type` names                                                                                                                                                                                                                                                 |
| `cssTransform`                     | `css({ transform: cssTransform })`     | Custom CSS transform — handles dimension string values (`"4px"`) and resolves shadow aliases to `var()` references                                                                                                                                                                                                                                                                             |
| `wrapFallbacks(prepare)`           | `prepare: wrapFallbacks(css => \`…\`)` | For every `-default` token, rewrites the value as `var(--base-name, raw-value)`. Bridges Storybook (no `--base-name` set → raw fallback used) and Figma plugin loading `figma-modes.scss` (Figma injects `--base-name` natively → picked up). Non-default tokens keep their raw value unchanged.                                                                                               |
| `wrapPassthrough(selector)`        | `prepare: wrapPassthrough(':root')`    | Generates a lightweight plugin-only stylesheet (`figma-plugin.scss`). Emits only `-default` tokens mapped to `var(--base-name)` with no fallback. Non-default tokens are omitted — they share the platform's native variable names directly. Load this file **instead of** `figma-modes.scss` in the plugin to support all Figma products (FigJam, Slides, Buzz…) without setting `data-mode`. |

### Two-file strategy for Figma

The Figma theme generates two output files with different purposes:

| File                | Load in      | How it works                                                                                                                                                                                                                                                                             |
| ------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-modes.scss`  | Storybook    | Scoped `[data-mode]` blocks with hardcoded fallback values. Set `data-mode` on `<html>` to activate the right theme. `-default` tokens use `var(--figma-color-x, rgb(…))` so they also pick up Figma native vars if loaded in the plugin.                                                |
| `figma-plugin.scss` | Figma plugin | Unscoped `:root` block. Maps only `-default` tokens to `var(--figma-color-x)` (no fallback). Non-default tokens like `--figma-color-bg-secondary` are already Figma's native variable names — no declaration needed. Works for all products (Figma, FigJam, Slides, Buzz) automatically. |

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
- `yelbolt`

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

You can build specific types of design tokens (text, icon, mode) instead of entire themes or components:

#### Build a Token Type for All Themes

```bash
# Build text tokens for all themes
npm run scss:build text

# Build mode tokens for all themes
npm run scss:build mode

# Build icon tokens for all themes
npm run scss:build icon
```

#### Build a Token Type for a Specific Theme

```bash
# Build text tokens for sketch theme only
npm run scss:build theme=sketch text

# Build mode tokens for penpot theme only
npm run scss:build theme=penpot mode

# Build icon tokens for figma theme only
npm run scss:build theme=figma icon
```

Available token types are:

- `text` - Text styling tokens (font sizes, weights, colors)
- `mode` - The mode layer (color, plus dimension/motion on themes that carry them)
- `icon` - Icon-related tokens

## Common Use Cases

### Update a Component After Modifying Tokens

1. Modify the JSON file corresponding to the component (e.g., `tokens/platforms/sketch/components/button.tokens.json`)
2. Run the command to regenerate the component's CSS files:

```bash
npm run scss:build theme=sketch component=button
```

### Update Base Tokens After Modifications

1. Modify a base token file (e.g., `tokens/platforms/penpot/text.tokens.json`)
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

### Update Mode Tokens Across All Themes

```bash
npm run scss:build mode
```

## Adding a New Component

Components no longer get their own Terrazzo config file. Add one entry to `terrazzo/components.manifest.js`:

```js
{ name: 'my-comp', category: 'actions', include: ['myComp.**'] }
```

`include` is the glob(s) matched against the component's token root key(s) across the resolved
token set — it scopes what gets emitted into that component's stylesheet, it does not affect token
resolution (all tokens are resolved for every component; `include`/`exclude` only filter the
output). Every theme's `terrazzo.components.js` reads this same manifest, so one entry produces the
`styles/{theme}.scss` output for all five themes automatically — create the component's token JSON
(`tokens/platforms/{theme}/components/{name}.json`) for each theme first, then run
`npm run scss:build -- --build component={name}` to generate all five stylesheets at once.

## Adding a New Terrazzo Config

A new _theme-level_ config (not a component) — e.g. adding a `mode`, `text`, `icon`, or `color`
build for a new platform — must:

1. Import `tokensStudioCompat` (default), `cssTransform`, and optionally `preprocessTokens` from `../plugins/tokens-studio-compat.js`
2. Pass `tokensStudioCompat()` as the first entry in `plugins`
3. Pass `cssTransform` to the `css()` plugin via `transform: cssTransform`
4. Use `preprocessTokens(tokenPaths)` as the `tokens` value when the source files may contain Tokens Studio `$type` names

A new theme's `terrazzo.components.js` should instead call `defineComponentsConfig()` from
`terrazzo/plugins/component-config.js` (see `terrazzo/figma/terrazzo.components.js` for the
minimal shape) rather than being written by hand.

## Important Notes

- Generated files are automatically saved in the directories specified in the Terrazzo configuration.
- Do not directly modify generated CSS files, as your changes will be overwritten during the next generation.
- If you add a new component, register it once in `terrazzo/components.manifest.js` — every theme picks it up automatically, no per-theme config file needed.
- Terrazzo 2.0.0-rc.0 is currently installed locally. Once a stable release is published, the dependency should be updated in `package.json`.
- The `.terrazzo-tmp/` directory is created automatically by `preprocessTokens` and should be added to `.gitignore`.
