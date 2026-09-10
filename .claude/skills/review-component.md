---
name: review-component
description: Review an existing unoff-ui component for convention compliance, and bring its Storybook MDX prop docs and Figma design-system description back in sync with the code. Use when a component's props/variants changed, after create-component scaffolding, or whenever asked to audit a component's documentation.
---

# Skill: Review Component

You are auditing an existing component in the **unoff-ui** design system for two things at once: (1) whether it still follows the library's structural conventions, and (2) whether its two documentation surfaces — the Storybook MDX prop docs and the Figma design-system description — are still in sync with the code. The second part is **mandatory on every run**, whether or not the caller asked for it explicitly.

---

## Step 1 — Determine scope

- If the user named a component, use it directly.
- Otherwise, scope from the current diff:
  ```bash
  git diff --name-only HEAD -- src/components src/stories
  ```
  Map changed files back to their component (category + kebab-name).
- If nothing is in scope and no component was named, ask which component to review — do not guess.

---

## Step 2 — Run the review

Delegate to the **`component-reviewer`** agent, once per component in scope (parallel/background is fine when reviewing several at once). Pass it:

- the component name and category
- whether this is a post-creation check (just scaffolded via `/create-component`) or a standing audit (existing component someone edited)

The agent always performs, unconditionally, regardless of what triggered the review:

1. Structural convention checks (TSX class pattern, SCSS token usage, exports, story `play` coverage)
2. **Storybook MDX prop-doc sync** — reads the component's props against its MDX section in `src/stories/{category}/{CategoryTitle}.mdx` and edits it back into sync if it drifted
3. **Figma design-system description sync** — reads the live description from the design-system file (fileKey `RDBmy7x5HfkZHpafVqHNWQ`, "Unoff v0.1"), regenerates it from current source following the `/figma-doc` format, and pushes it via the Figma Desktop Bridge if connected to that file — or hands you the ready-to-paste markdown if it isn't

---

## Step 3 — Report back

Summarize the agent's findings to the user:

- Blocking / should-fix / nit issues found in the structural review (if any)
- What was edited in the MDX doc, or confirmation it was already in sync
- Whether the Figma description was pushed, was already in sync, or is blocked on a Desktop Bridge reconnect (in which case, surface the ready markdown so the user can paste it manually if they don't want to reconnect)

---

## Reference files

- Review checklist source: `.claude/agents/component-reviewer.md`
- Figma doc format and rules: `.claude/skills/figma-doc.md`
- Convention source of truth: `.claude/skills/create-component.md`
