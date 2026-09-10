# unoff-ui — Skills index

Available skills for this project. Invoke with `/skill-name`.

---

## `/create-component`

Full scaffold for a new UI component.

Generates in order: the TSX file (class-based), SCSS with token bindings, token JSON files for all 4 themes, Terrazzo configs, the export in `src/index.ts`, a Storybook story with a `play` function, and the MDX section in the category doc. Finishes by invoking the `component-reviewer` agent (mandatory Step 7) to confirm the MDX doc matches the final props and to push the description to the Figma design-system file.

**Inputs required:** name (PascalCase), category, description, props, variants/states.

---

## `/review-component`

Audit an existing component for convention compliance and bring its documentation back in sync.

Delegates to the `component-reviewer` agent (`.claude/agents/component-reviewer.md`), which always — regardless of what changed — re-checks the Storybook MDX prop docs against the current `Props` interface (fixing drift directly) and re-syncs the Figma design-system description (fileKey `RDBmy7x5HfkZHpafVqHNWQ`, "Unoff v0.1"), pushing it when the Desktop Bridge is connected or handing back ready-to-paste markdown when it isn't.

**Inputs required:** component name/category, or nothing (falls back to the current diff).

---

## `/create-theme`

Add and configure a new brand theme (e.g. Canva, Notion, Linear).

Runs `npm run create:theme`, guides token customisation in `tokens/platforms/{theme}/` (colors, typography, radii), compiles SCSS via Terrazzo, and verifies the result in Storybook.

**Inputs required:** theme name (lowercase), primary color(s), font family if known.

---

## `/figma-doc`

Generate or resync a component description directly in Figma.

Defaults to the design-system file (fileKey `RDBmy7x5HfkZHpafVqHNWQ`, "Unoff v0.1") — a bare component name is enough. Reads the current live description via REST first (no Desktop connection needed), synthesises a fresh one from TSX props, Storybook stories, and MDX notes, and writes it via `figma_set_description` when the Desktop Bridge is connected to that file (falls back to handing over ready-to-paste markdown otherwise).

**Inputs required:** component name, or a Figma URL to target a specific node.
