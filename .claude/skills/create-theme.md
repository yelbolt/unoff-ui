---
name: create-theme
description: Create and configure a new brand theme for unoff-ui. Use when adding a platform (e.g. Canva, Notion, Linear) — runs the generator script, guides token customisation in tokens/platforms/{theme}/, builds the SCSS variables, and registers the theme in Storybook.
---

# Skill: Create Theme

You are helping create and configure a new brand theme for the **unoff-ui** design system. Themes are isolated sets of design tokens (colors, typography, spacing, radii, etc.) that give the component library the visual identity of a specific platform or brand. Currently supported themes: `figma`, `penpot`, `sketch`, `framer`.

---

## Step 1 — Gather requirements

Ask the user for (if not already provided):

1. **Theme name** — lowercase, no spaces or special characters (e.g. `canva`, `notion`, `linear`)
2. **Brand context** — primary brand color(s), font family if known, any links to brand guidelines

---

## Step 2 — Run the generator script

Run the interactive theme generator from the project root. The script will ask for the theme name interactively:

```bash
npm run create:theme
```

> This runs `node scripts/create-theme.js` — see [`scripts/create-theme.js`](scripts/create-theme.js) and [`docs/theme-generator.md`](docs/theme-generator.md) for implementation details.

When prompted, enter the theme name. The script will:

- Create `tokens/platforms/{theme}/` — JSON token files copied from the `figma` theme
- Create `terrazzo/{theme}/` — Terrazzo build configuration files
- Create `src/icons/{theme}/` — SVG icons copied from the `figma` theme
- Add `@import` statements for the new theme to all relevant SCSS files
- Register the theme in `.storybook/preview.tsx` (toolbar + background colors)
- Create SCSS module files at `src/styles/tokens/modules/{theme}-colors.module.scss` and `{theme}-types.module.scss`
- Add imports to `.storybook/theme-styles.scss`

After the script finishes, confirm with the user that it completed without errors before continuing.

---

## Step 3 — Customize the token files

The generated token files in `tokens/platforms/{theme}/` are direct copies of the `figma` theme. The user now needs to adapt them to the new brand.

### Token file structure

```
tokens/platforms/{theme}/
  color.json        — All color values (primitive palette)
  text.json         — Typography: font families, sizes, weights, line heights
  icon.json         — Icon file paths (already updated by the script)
  spacing.json      — Spacing scale
  radius.json       — Border radii
  ...
```

### Editing workflow

For each file, help the user:

1. **Identify** which values need to change to match the brand
2. **Update** the values using the DTCG token format already present in each file. The format is:
   ```json
   {
     "color": {
       "brand": {
         "500": { "$value": "#0d99ff", "$type": "color" }
       }
     }
   }
   ```
3. **Preserve** the token structure and key names — only change `$value` entries

Focus first on the **color palette** (`color.json`) as it has the most visual impact. Then typography (`text.json`) if the brand uses a different font.

### Common brand customizations

| File          | What to change                                                                 |
| ------------- | ------------------------------------------------------------------------------ |
| `color.json`  | Brand primary, secondary, neutral, semantic (error, warning, success) palettes |
| `text.json`   | Font family (update Google Fonts URL in SCSS module after changing)            |
| `radius.json` | Border radii (e.g. a rounder brand might use `8px` base instead of `4px`)      |

---

## Step 4 — Build the SCSS tokens

After editing the token JSON files, compile them to SCSS variables:

```bash
npm run scss:build theme={theme}
```

This regenerates the SCSS variable files in `src/styles/tokens/` for the new theme. Verify the build completes without errors.

---

## Step 5 — Update the font import (if font changed)

If the brand uses a different font family from Inter, update the `@import url(...)` in the generated types module:

```
src/styles/tokens/modules/{theme}-types.module.scss
```

Replace the Google Fonts URL with the correct family. Example:

```scss
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
```

---

## Step 6 — Preview in Storybook

Launch Storybook and switch to the new theme using the theme toolbar:

```bash
npm run storybook
```

The theme selector in the toolbar should show the new theme name. Verify:

- Light and dark modes work correctly
- Component colors and typography match the brand

---

## Step 7 — Token editing guidance (detailed)

### Color token conventions

Color tokens follow a semantic naming hierarchy:

```
color.{semantic-role}.{scale-step}
```

Common semantic roles: `brand`, `neutral`, `error`, `warning`, `success`, `accent`

Scale steps: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`

When adapting for a brand:

- Map the brand's primary color to `color.brand.500`
- Derive lighter steps (`100`–`400`) by reducing saturation/increasing lightness
- Derive darker steps (`600`–`900`) by increasing darkness/saturation
- Preserve neutral grays if the brand doesn't specify its own

### Typography token conventions

```
text.{family|size|weight|lineHeight}.{scale}
```

If the brand has a system font, use:

```json
{
  "$value": "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  "$type": "fontFamily"
}
```

---

## Reference files

- Generator script: `scripts/create-theme.js`
- Generator documentation: `docs/theme-generator.md`
- Source theme tokens (to compare against): `tokens/platforms/figma/`
- Terrazzo config example: `terrazzo/figma/`
- Storybook preview config: `.storybook/preview.tsx`
- SCSS module example: `src/styles/tokens/modules/figma-colors.module.scss`
