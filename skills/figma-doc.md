---
name: figma-doc
description: Generate a Figma component description from existing source files (TSX props, Storybook stories, MDX docs, .figma.tsx mapping). Use when documenting a component directly in Figma without Code Connect — produces a paste-ready description covering purpose, variants, behaviours, code props, and Figma variants.
---

# Skill: Generate Figma Component Documentation

You are helping write a **Figma component description** for a component in the **unoff-ui** design system. The goal is to produce a self-contained, design-tool-ready description that a designer can paste directly into the Figma component's description field — with no reliance on Code Connect or external tooling.

The description must be clear, concise, and structured so it is useful to both designers using the Figma component and developers consuming the code.

---

## Step 1 — Identify the component

Ask the user which component to document (if not already specified). Then read the following three source files:

1. **Component TSX** — `src/components/{category}/{kebab-name}/{ComponentName}.tsx`
   - Props interface (types, defaults, JSDoc comments)
   - Rendered variants and conditional logic

2. **Storybook story** — `src/stories/{category}/{ComponentName}.stories.ts(x)`
   - Story exports = documented variants
   - Args per story = representative prop values

3. **Category MDX doc** — `src/stories/{category}/{CategoryTitle}.mdx`
   - Usage guidance already written for that component section
   - Accessibility notes

Also check whether `{ComponentName}.figma.tsx` exists in the component folder — if it does, read it to extract the Figma prop mapping (enum mappings, boolean mappings, string props).

---

## Step 2 — Synthesise and write the description

Produce a single Markdown document structured as follows. **Adapt the content** to the component; the button example below is only a reference for the format and level of detail.

---

### Output format

```
{One-sentence summary of the component's purpose and key capabilities.}

---

{Variant group title (e.g. "Six types", "Three sizes")}

{VARIANT_NAME} — {one-line description of when and why to use this variant}
{VARIANT_NAME} — {one-line description}
...

---

{Behaviour / feature section title (e.g. "Responsive reflow", "Status badges")}

{prose description of the behaviour, including relevant prop names}

---

{Another behaviour section if needed}

...

---

Props (code)

{propName}: {type union} — {description, including default if any}
{propName}: {type union} — {description}
...

---

Variants (Figma)

{FigmaPropName} — {VALUE_1}, {VALUE_2}, ...
{FigmaPropName} — {value} (text property, default: "{default}")
```

---

### Rules for each section

**Summary line**
- One sentence only. State the purpose and the most important capabilities (variants, sizes, states).
- Do not start with "The {ComponentName} component is…" — start with the function directly.

**Variant sections**
- Group variants by the prop they come from (e.g. `type`, `size`).
- Use ALL_CAPS for the Figma variant name, camelCase for the code prop value.
- One dash-separated line per variant: `VARIANT_NAME — usage guidance`
- Do not repeat the prop name in the description.

**Behaviour sections**
- Each notable boolean prop or compound feature gets its own titled section.
- Name the section after what the feature does, not the prop name.
- Mention the prop(s) involved inline with backtick notation.
- Keep to 1–3 sentences.

**Props (code)**
- List every prop from the `{ComponentName}Props` interface.
- Format: `propName: type — description (default: value)` — include the default only when it is non-obvious.
- Use `|`-separated values for union types.
- For object props, describe the shape inline: `helper: { label, pin?, type? } — tooltip config`
- Order: required props first, then optional props alphabetically.

**Variants (Figma)**
- Source from the `.figma.tsx` mapping file if it exists; otherwise infer from the component's Storybook argTypes and the Figma-specific props noted in the MDX.
- Use ALL_CAPS for Figma enum values.
- For boolean Figma props, write: `hasIcon — TRUE, FALSE`
- For text/string Figma props, write: `label — text property (default: "Action label")`

---

## Step 3 — Example output (Button)

Use this as a calibration reference for length and style:

```
The primary interactive element for triggering actions, navigating, or submitting. Supports six visual types, three sizes, and multiple interactive states.

---

Six types

PRIMARY — Main call to action; one per distinct task
SECONDARY — Supporting action with moderate visual weight
TERTIARY — Low-emphasis action; can also render as an external link
DESTRUCTIVE — Irreversible actions (delete, remove) — pair with a confirmation step
ALTERNATIVE — Out-of-hierarchy action needing prominence without primary weight
ICON — Compact toolbar action; always provide a helper label

---

Responsive reflow

`shouldReflow` swaps the label for an icon when the viewport drops below 460 px, keeping toolbars usable on small screens without a separate mobile variant.

---

Status badges

A `warning`, `isBlocked`, or `isNew` flag appends a status indicator next to the button:

warning — shows an IconChip with a caution tooltip
isBlocked — shows a Pro badge; `onUnblock` callback lets the user upgrade
isNew — shows a New badge

---

Props (code)

type: "primary" | "secondary" | "tertiary" | "destructive" | "alternative" | "icon" — visual style
size: "small" | "default" | "large" — button size (default: "default")
label: string — text label
icon: IconList — icon name to display alongside the label
state: "default" | "selected" — visual state for icon-type buttons (default: "default")
helper: { label, pin?, type? } — tooltip shown on hover / focus
warning: { label, pin?, type? } — warning badge with tooltip
preview: { image, text, pin? } — rich preview tooltip with image
shouldReflow: { isEnabled, icon } — responsive icon swap below 460 px
isLoading: boolean — shows a spinner and sets aria-busy (default: false)
isBlocked: boolean — disables the button and shows a Pro badge (default: false)
isDisabled: boolean — disables the button (default: false)
isNew: boolean — shows a New badge (default: false)
isLink: boolean — renders an <a> tag styled as a button (default: false)
url: string — href for link buttons
action: MouseEventHandler & KeyboardEventHandler — click / key handler
onUnblock: MouseEventHandler & KeyboardEventHandler — called when the Pro badge is clicked

---

Variants (Figma)

type — PRIMARY, SECONDARY, TERTIARY, DESTRUCTIVE, ALTERNATIVE, ICON
state — DEFAULT, HOVER, PRESSED, FOCUS, DISABLED
size — SMALL, DEFAULT, LARGE
hasIcon — TRUE, FALSE
hasMultipleActions — TRUE, FALSE
label — text property (default: "Action label")
```

---

## Step 4 — Deliver the output

Present the final description in a fenced code block so the user can copy it directly. Then briefly note any props or Figma variants you could not infer (e.g. missing `.figma.tsx` file, undocumented Figma props) so the user can fill in those gaps manually.

---

## Reference files (for context)

- TSX pattern: `src/components/actions/button/Button.tsx`
- Story pattern: `src/stories/actions/Button.stories.ts`
- MDX pattern: `src/stories/actions/Actions.mdx`
- Figma mapping pattern: `src/components/actions/button/Button.figma.tsx`
