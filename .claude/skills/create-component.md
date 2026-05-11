---
name: create-component
description: Create a new UI component for unoff-ui. Use when adding a component from scratch — generates the TSX file, SCSS token bindings, Storybook story, MDX documentation section, and the src/index.ts export entry.
---

# Skill: Create Component

You are helping create a new UI component for the **unoff-ui** design system library. Follow all existing conventions exactly — do not deviate from the patterns already established in the codebase.

---

## Step 1 — Gather requirements

Before writing any file, ask the user for (if not already provided):

1. **Component name** — PascalCase (e.g. `TagInput`)
2. **Category** — one of: `actions`, `assets`, `dialogs`, `inputs`, `lists`, `slots`, `tags`
3. **Brief description** — what the component does
4. **Props** — list of props with types, defaults, and JSDoc descriptions
5. **Variants / states** — the visual variants and interactive states the component needs (e.g. `type: 'primary' | 'ghost'`, states: `default`, `hover`, `focus`, `pressed`, `disabled`)

---

## Step 2 — Create the folder and files

Component files go in:

```
src/components/{category}/{kebab-case-name}/
  {ComponentName}.tsx
  {component-name}.scss
```

### 2a — TSX component

Follow the class-based React pattern used throughout the library:

```tsx
import React from 'react'
import { doClassnames } from '@unoff/utils'
// Import other components as needed
import './{component-name}.scss'

export interface {ComponentName}Props {
  // Props with JSDoc comments
}

export default class {ComponentName} extends React.Component<{ComponentName}Props> {
  static defaultProps: Partial<{ComponentName}Props> = {
    // defaults
  }

  render() {
    // ...
  }
}
```

Rules:

- Always use `@unoff/utils` `doClassnames` helper for conditional class names.
- Use `@components/...`, `@styles/...`, `@tps/...` path aliases — never relative paths across directories.
- Import the component's own SCSS file directly: `import './{component-name}.scss'`
- Export the props interface as a named export.
- Use `aria-*` attributes matching the component's role (see existing components for reference).

### 2b — SCSS file

The SCSS file **must**:

1. Import all platform theme files at the top:
   ```scss
   @import 'styles/penpot';
   @import 'styles/sketch';
   @import 'styles/figma';
   @import 'styles/framer';
   ```
2. Use CSS custom properties (variables) for **all** themeable values. Variable naming convention:
   ```
   --{component-kebab}-{variant}-{property}-{state}
   ```
   Examples:
   - `--my-comp-primary-background-color-default`
   - `--my-comp-primary-background-color-hover`
   - `--my-comp-base-border-radius`
3. Override base variables per variant and per state using the pattern from `button.scss`:

   ```scss
   .my-comp {
     background-color: var(--my-comp-base-background-color);

     &--primary {
       --my-comp-base-background-color: var(
         --my-comp-primary-background-color-default
       );

       &:enabled:hover {
         --my-comp-base-background-color: var(
           --my-comp-primary-background-color-hover
         );
       }
       // focus, active, disabled...
     }
   }
   ```

4. Do **not** hardcode any color, spacing, radius, or typography value. All values must come from CSS variables defined in the token system.

### 2c — Component token set (JSON)

Create the design token file for **each of the four platform themes**:

```
tokens/platforms/{figma|penpot|sketch|framer}/components/{component-name}.json
```

The file must mirror the same values across all themes (start by copying one and adapting the semantic references per theme). Token structure follows DTCG format with nested objects mapping to the CSS variable naming convention:

```json
{
  "{camelCaseName}": {
    "base": {
      "height": { "$value": "{size.pos.small}", "$type": "dimension" },
      "gap": { "$value": "{size.pos.xxxsmall}", "$type": "dimension" },
      "radius": { "$value": "{border.radius.medium}", "$type": "dimension" },
      "padding": {
        "top": { "$value": "{size.null}", "$type": "dimension" },
        "right": { "$value": "{size.pos.xxsmall}", "$type": "dimension" },
        "bottom": { "$value": "{size.null}", "$type": "dimension" },
        "left": { "$value": "{size.pos.xxsmall}", "$type": "dimension" }
      },
      "background": {
        "color": { "$value": "transparent", "$type": "string" }
      },
      "border": {
        "color": { "$value": "transparent", "$type": "string" },
        "width": { "$value": "{size.null}", "$type": "dimension" },
        "offset": { "$value": "{size.null}", "$type": "dimension" }
      },
      "text": {
        "color": { "$value": "{figma.color.text}", "$type": "color" }
      },
      "icon": {
        "color": { "$value": "{figma.color.icon}", "$type": "color" }
      }
    },
    "{variantName}": {
      "background": {
        "color": {
          "default": { "$value": "{figma.color.bg.brand}", "$type": "color" },
          "hover": { "$value": "{figma.color.bg.brand}", "$type": "color" },
          "pressed": {
            "$value": "{figma.color.bg.brand.pressed}",
            "$type": "color"
          },
          "focus": { "$value": "{figma.color.bg.brand}", "$type": "color" },
          "disabled": {
            "$value": "{figma.color.bg.disabled}",
            "$type": "color"
          }
        }
      },
      "border": {
        "width": {
          "default": { "$value": "{size.null}", "$type": "dimension" },
          "hover": { "$value": "{size.null}", "$type": "dimension" },
          "pressed": { "$value": "{size.null}", "$type": "dimension" },
          "focus": { "$value": "{size.pos.unit}", "$type": "dimension" },
          "disabled": { "$value": "{size.null}", "$type": "dimension" }
        },
        "color": {
          "default": { "$value": "transparent", "$type": "string" },
          "focus": {
            "$value": "{figma.color.border.onbrand.strong}",
            "$type": "color"
          },
          "disabled": { "$value": "none", "$type": "string" }
        }
      },
      "text": {
        "color": {
          "default": {
            "$value": "{figma.color.text.onbrand}",
            "$type": "color"
          },
          "disabled": {
            "$value": "{figma.color.text.ondisabled}",
            "$type": "color"
          }
        }
      },
      "icon": {
        "color": {
          "default": {
            "$value": "{figma.color.icon.onbrand}",
            "$type": "color"
          },
          "disabled": {
            "$value": "{figma.color.icon.ondisabled}",
            "$type": "color"
          }
        }
      }
    }
  }
}
```

Rules:

- The root key uses **camelCase** (e.g. `myComp`, `iconButton`).
- Nesting depth maps directly to the CSS variable name segments: `{root}.{variant}.{property}.{subproperty}.{state}` → `--root-variant-property-subproperty-state`.
- Use semantic token references from the platform namespace (e.g. `{figma.color.bg.brand}`) — never raw hex values.
- All five interaction states must be present for every color property: `default`, `hover`, `pressed`, `focus`, `disabled`.
- Non-colour properties (dimensions, strings) only need a single value unless they change per state.
- Reference files: `tokens/platforms/figma/components/button.json`, `tokens/platforms/figma/components/chip.json`

### 2d — Terrazzo configuration

Create one Terrazzo config per platform theme in:

```
terrazzo/{figma|penpot|sketch|framer}/components/terrazzo.{component-name}.js
```

Each file follows exactly the same structure — only the theme name and component path change:

```js
import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'

export default defineConfig({
  name: 'global',
  tokens: [
    './tokens/globals/color.json',
    './tokens/globals/typography.json',
    './tokens/globals/spacing.json',
    './tokens/globals/effect.json',
    './tokens/globals/radius.json',
    './tokens/platforms/{theme}/color.json',
    './tokens/platforms/{theme}/typography.json',
    './tokens/platforms/{theme}/icon.json',
    './tokens/platforms/{theme}/components/{component-name}.json',
  ],
  outDir: './src/components/{category}/{kebab-name}/',
  plugins: [
    css({
      filename: 'styles/{theme}.scss',
      exclude: [
        '{theme}.color.*',
        'font.*',
        'size.*',
        'shadow.*',
        'border.*',
        'grey.*',
        'elevation.*',
        'icon.*',
      ],
      baseSelector: ':root[data-theme="{theme}"]',
    }),
  ],
  lint: {
    rules: {},
  },
})
```

Rules:

- Create **four files** (figma, penpot, sketch, framer) — one per theme.
- `outDir` points to the component's source folder (where Terrazzo writes the generated `styles/{theme}.scss`).
- `filename` in the CSS plugin is always `styles/{theme}.scss` — this is what the component's SCSS imports with `@import 'styles/{theme}'`.
- The `exclude` list always contains `'{theme}.color.*'` (using the actual theme name), plus the standard global namespaces.
- Reference files: `terrazzo/figma/components/terrazzo.button.js`, `terrazzo/figma/components/terrazzo.chip.js`

---

## Step 3 — Add to the main export

Open `src/index.ts` and add the export in the correct category block, maintaining alphabetical order within the block:

```ts
// {Category}
export { default as {ComponentName} } from '@components/{category}/{kebab-name}/{ComponentName}'
```

If the props interface needs to be publicly exported, add it as a named type export at the bottom of the `// Types` section.

---

## Step 4 — Create the Storybook story

Story files go in:

```
src/stories/{category}/{ComponentName}.stories.ts(x)
```

Use `.tsx` if the story renders JSX directly (e.g. children slots), otherwise `.ts`.

Story template:

```ts
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'
import {ComponentName} from '@components/{category}/{kebab-name}/{ComponentName}'

const meta: Meta<typeof {ComponentName}> = {
  title: 'Components/{Category}/{ComponentName}',
  component: {ComponentName},
  parameters: {
    layout: 'centered',
  },
  args: { action: fn() },
  argTypes: {
    action: { control: false },
  },
} satisfies Meta<typeof {ComponentName}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Provide representative args for the default variant
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // At minimum: verify the component renders and main interaction works
    const el = canvas.getByRole('...')
    await expect(el).toBeInTheDocument()
  },
}
```

Add one exported story per meaningful variant (matching the component's `type` or primary prop values).

Each `play` function must:

- Verify the element is in the DOM
- Test at least the primary interaction (click, hover, keyboard)
- Assert on `args.action` call count where applicable

---

## Step 5 — Add to the category MDX doc

Open (or create) `src/stories/{category}/{CategoryTitle}.mdx` and add a section for the new component following this template:

```mdx
---

## {ComponentName}

{One-sentence description of what the component does and when to use it.}

<DocTabs>
<Tab label="Usage">

- Use `propA` to ...
- Use `propB` to ...
- Prefer `variantX` when ...

</Tab>
<Tab label="Accessibility (WCAG 2.2)">

- The component uses `role="..."` — ensure ... (SC 4.1.2).
- Keyboard: `Enter` / `Space` triggers ...; `Escape` blurs (SC 2.1.1).
- Provide `aria-label` via the `helper` prop whenever there is no visible label (SC 2.4.6).

</Tab>
</DocTabs>
```

---

## Step 6 — Final checklist

Before finishing, verify:

- [ ] `{ComponentName}.tsx` exports a `default` class and a named `{ComponentName}Props` interface
- [ ] `{component-name}.scss` uses only CSS variables for themeable values and imports all four platform theme files
- [ ] Token JSON created in `tokens/platforms/{figma|penpot|sketch|framer}/components/{component-name}.json` for all four themes
- [ ] Terrazzo config created in `terrazzo/{figma|penpot|sketch|framer}/components/terrazzo.{component-name}.js` for all four themes
- [ ] `src/index.ts` has the new export in the right category block
- [ ] Story file exists with at least one `play` test per exported story
- [ ] MDX documentation section added to the category doc

---

## Reference files

- Component example: `src/components/actions/button/Button.tsx`
- SCSS token pattern: `src/components/actions/button/button.scss`
- Component token JSON example: `tokens/platforms/figma/components/button.json`
- Terrazzo config example: `terrazzo/figma/components/terrazzo.button.js`
- Story example: `src/stories/actions/Button.stories.ts`
- MDX doc example: `src/stories/actions/Actions.mdx`
- Main export: `src/index.ts`
