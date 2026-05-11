# unoff-ui — Skills index

Available skills for this project. Invoke with `/skill-name`.

---

## `/create-component`

Full scaffold for a new UI component.

Generates in order: the TSX file (class-based), SCSS with token bindings, token JSON files for all 4 themes, Terrazzo configs, the export in `src/index.ts`, a Storybook story with a `play` function, and the MDX section in the category doc.

**Inputs required:** name (PascalCase), category, description, props, variants/states.

---

## `/create-theme`

Add and configure a new brand theme (e.g. Canva, Notion, Linear).

Runs `npm run create:theme`, guides token customisation in `tokens/platforms/{theme}/` (colors, typography, radii), compiles SCSS via Terrazzo, and verifies the result in Storybook.

**Inputs required:** theme name (lowercase), primary color(s), font family if known.

---

## `/figma-doc`

Generate a component description directly in Figma.

Reads variants from the figma-console MCP, then synthesises TSX props, Storybook stories, and MDX notes into a formatted document (Figma markdown) written via `figma_set_description`.

**Inputs required:** Figma URL of the component node.
