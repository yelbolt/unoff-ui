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
       --my-comp-base-background-color: var(--my-comp-primary-background-color-default);

       &:enabled:hover {
         --my-comp-base-background-color: var(--my-comp-primary-background-color-hover);
       }
       // focus, active, disabled...
     }
   }
   ```
4. Do **not** hardcode any color, spacing, radius, or typography value. All values must come from CSS variables defined in the token system.

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
- [ ] `src/index.ts` has the new export in the right category block
- [ ] Story file exists with at least one `play` test per exported story
- [ ] MDX documentation section added to the category doc

---

## Reference files

- Component example: `src/components/actions/button/Button.tsx`
- SCSS token pattern: `src/components/actions/button/button.scss`
- Story example: `src/stories/actions/Button.stories.ts`
- MDX doc example: `src/stories/actions/Actions.mdx`
- Main export: `src/index.ts`
