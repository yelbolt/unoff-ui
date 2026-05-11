---
name: figma-doc
description: Generate a Figma component description from existing source files (TSX props, Storybook stories, MDX docs, .figma.tsx mapping). Use when documenting a component directly in Figma without Code Connect — produces a paste-ready description covering purpose, variants, behaviours, code props, and Figma variants.
---

# Skill: Generate Figma Component Documentation

You are helping write a **Figma component description** for a component in the **unoff-ui** design system. The goal is to produce a self-contained, design-tool-ready description that a designer can read directly in the Figma component's description panel.

The description must be clear, concise, and structured so it is useful to both designers using the Figma component and developers consuming the code.

> **Figma formatting:** always pass the description via the `descriptionMarkdown` parameter of `figma_set_description` — this enables rich text rendering. Supported formatting:
>
> - `#` for H1 section titles
> - `---` for horizontal separators between sections
> - `1.` numbered lists for all enumerated items (variants, props, states)
> - `` `backticks` `` for prop names, prop signatures, and variant values
> - Plain prose for descriptions

---

## Step 1 — Identify the component

The user will provide a **Figma URL** pointing to the component node (e.g. `https://www.figma.com/design/RDBmy7x5HfkZHpafVqHNWQ/Unoff-v0.1?node-id=3521-3846`). Extract the `node-id` from the URL.

### 1a — Fetch Figma variants via figma-console MCP

Use the **Figma Desktop Bridge plugin** (figma-console MCP) to retrieve the real component properties and variants directly from Figma:

1. Call `figma_get_component` with the `nodeId` extracted from the URL and the file URL.
2. From the response, extract: component properties (enum, boolean, text), variant values, and any existing description.
3. Use these as the authoritative source for the **Variants (Figma)** section of the output.

> **Prerequisite:** the Figma Desktop Bridge plugin must be running in Figma (Right-click → Plugins → Development → Figma Desktop Bridge). If `figma_get_component` fails, use `figma_execute` with `figma.getNodeByIdAsync(nodeId)` to fetch the node directly. If both fail, fall back to inferring variants from the `.figma.tsx` file or Storybook args.

### 1b — Read the source files

Then read the following three source files:

1. **Component TSX** — `src/components/{category}/{kebab-name}/{ComponentName}.tsx`
   - Props interface (types, defaults, JSDoc comments)
   - Rendered variants and conditional logic

2. **Storybook story** — `src/stories/{category}/{ComponentName}.stories.ts(x)`
   - Story exports = documented variants
   - Args per story = representative prop values

3. **Category MDX doc** — `src/stories/{category}/{CategoryTitle}.mdx`
   - Usage guidance already written for that component section
   - Accessibility notes

Also check whether `{ComponentName}.figma.tsx` exists in the component folder — if it does, read it to cross-reference the Figma prop mapping with what was fetched from the MCP.

---

## Step 2 — Synthesise and write the description

Produce a rich-text document using the format below. **Adapt the content** to the component; the button example in Step 3 is the reference for format and level of detail.

---

### Output format

```text
{One-sentence summary of the component's purpose and key capabilities.}

---

# {Behaviour / feature section title}

{prose description with prop names inline}

---

# {Another behaviour section if needed}

1. {VARIANT_NAME} — {one-line description}
2. {VARIANT_NAME} — {one-line description}

---

# Props (code)

1. `{propName}: {type}` — {description, including default if non-obvious}
2. `{propName}: {type}` — {description}

---

# Variants (Figma)

1. `{propName}` — `{VALUE_1}`, `{VALUE_2}`, ...
2. `{propName}` — text property (default: `"{default}"`)
```

---

### Rules for each section

**Summary line**

- One sentence only. State the purpose and the most important capabilities (variants, sizes, states).
- Do not start with "The {ComponentName} component is…" — start with the function directly.

**Behaviour sections**

- Each notable prop or compound feature gets its own `#` section.
- Name the section after what the feature does, not the prop name.
- Mention prop names inline with backticks.
- Keep to 1–3 sentences. Use a numbered list when enumerating values (e.g. states, badge types).

**Props (code)**

- List every prop from the `{ComponentName}Props` interface as a numbered list.
- Format each item as: `` `propName: type` — description ``
- Include the default only when non-obvious.
- Use `|`-separated values for union types.
- For object props: `` `helper: { label, pin?, type? }` — tooltip config ``
- Order: required props first, then optional props alphabetically.

**Variants (Figma)**

- Preferred source: data from `figma_get_component` / `figma_execute` — use exact property names and values from Figma.
- Fallback: `.figma.tsx` mapping file → Storybook argTypes → MDX notes.
- List as numbered list. Wrap both prop name and each value in backticks.
- For boolean props: `` `hasProp` — `TRUE`, `FALSE` ``
- For text props: `` `label` — text property (default: `"Action label"`) ``

---

## Step 3 — Example output (Button)

Use this as a calibration reference for length and style:

```text
The primary interactive element for triggering actions, navigating, or submitting. Supports six visual types, three sizes, and multiple interactive states.

---

# Six types

1. PRIMARY — Main call to action; one per distinct task
2. SECONDARY — Supporting action with moderate visual weight
3. TERTIARY — Low-emphasis action; can also render as an external link
4. DESTRUCTIVE — Irreversible actions (delete, remove) — pair with a confirmation step
5. ALTERNATIVE — Out-of-hierarchy action needing prominence without primary weight
6. ICON — Compact toolbar action; always provide a helper label

---

# Responsive reflow

`shouldReflow` swaps the label for an icon when the viewport drops below 460 px, keeping toolbars usable on small screens without a separate mobile variant.

---

# Status badges

A `warning`, `isBlocked`, or `isNew` flag appends a status indicator next to the button:

1. warning — shows an IconChip with a caution tooltip
2. isBlocked — shows a Pro badge; `onUnblock` callback lets the user upgrade
3. isNew — shows a New badge

---

# Props (code)

1. `type: "primary" | "secondary" | "tertiary" | "destructive" | "alternative" | "icon"` — visual style
2. `size: "small" | "default" | "large"` — button size (default: "default")
3. `label: string` — text label
4. `icon: IconList` — icon name to display alongside the label
5. `state: "default" | "selected"` — visual state for icon-type buttons (default: "default")
6. `helper: { label, pin?, type? }` — tooltip shown on hover / focus
7. `warning: { label, pin?, type? }` — warning badge with tooltip
8. `preview: { image, text, pin? }` — rich preview tooltip with image
9. `shouldReflow: { isEnabled, icon }` — responsive icon swap below 460 px
10. `isLoading: boolean` — shows a spinner and sets aria-busy (default: false)
11. `isBlocked: boolean` — disables the button and shows a Pro badge (default: false)
12. `isDisabled: boolean` — disables the button (default: false)
13. `isNew: boolean` — shows a New badge (default: false)
14. `isLink: boolean` — renders an <a> tag styled as a button (default: false)
15. `url: string` — href for link buttons
16. `action: MouseEventHandler & KeyboardEventHandler` — click / key handler
17. `onUnblock: MouseEventHandler & KeyboardEventHandler` — called when the Pro badge is clicked

---

# Variants (Figma)

1. `type` — `PRIMARY`, `SECONDARY`, `TERTIARY`, `DESTRUCTIVE`, `ALTERNATIVE`, `ICON`
2. `state` — `DEFAULT`, `HOVER`, `PRESSED`, `FOCUS`, `DISABLED`
3. `size` — `SMALL`, `DEFAULT`, `LARGE`
4. `hasIcon` — `TRUE`, `FALSE`
5. `hasMultipleActions` — `TRUE`, `FALSE`
6. `label` — text property (default: `"Action label"`)
```

---

## Step 4 — Write the description to Figma

Once the description is finalised, call `figma_set_description` with **both** parameters:

- `description`: plain-text fallback (summary sentence only)
- `descriptionMarkdown`: the full rich-text document

Also present the final `descriptionMarkdown` content in a fenced code block so the user can review it. Note any props or Figma variants that could not be confirmed (e.g. MCP unavailable, missing `.figma.tsx`) so the user can fill gaps manually.

---

## Reference files (for context)

- TSX pattern: `src/components/actions/button/Button.tsx`
- Story pattern: `src/stories/actions/Button.stories.ts`
- MDX pattern: `src/stories/actions/Actions.mdx`
- Figma mapping pattern: `src/components/actions/button/Button.figma.tsx`
