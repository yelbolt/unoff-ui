# Dimension System

> **Status: proof of concept, `yelbolt` only.** The other four themes (`figma`,
> `penpot`, `sketch`, `framer`) still reference commons primitives directly from
> their component tokens. Nothing in this document applies to them yet.

## Why it exists

Colors have always had three layers. Dimensions had two.

| Layer         | Colors                                              | Dimensions (before)                          |
| ------------- | --------------------------------------------------- | -------------------------------------------- |
| **Primitive** | `platforms/yelbolt/colors.json` → `YLB.1…8`         | `commons/commons.tokens.json` → `scale.pos.*` |
| **System**    | `platforms/yelbolt/modes/*.tokens.json` → `color.*` | — _missing_                                  |
| **Component** | `platforms/yelbolt/components/*.json`               | `platforms/yelbolt/components/*.json`        |

Because the middle layer was missing, a component token reached straight into
the primitive scale: `button.base.height` was literally `{scale.pos.small}`. That
made every dimension global and immutable — a mode could restyle every colour in
the library but could not widen a single letter-space.

The dimension system fills that gap. It lives **inside the mode layer**, next to
the colors, so one mode set now carries both.

## Shape

Each of the 14 mode files in `tokens/platforms/yelbolt/modes/` carries a
`dimension` block alongside its `color` block:

```jsonc
{
  "color":     { "background": { … }, "border": { … }, "text": { … }, "icon": { … } },
  "dimension": { "space": { … }, "control": { … }, "border": { … }, "radius": { … }, "text": { … } }
}
```

Five families, split by **role** rather than by value — the whole point of the
layer is that the same primitive means different things in different places, and
a mode may want to move one without moving the other:

| Family              | Covers                                  | Rungs                                                           |
| ------------------- | --------------------------------------- | --------------------------------------------------------------- |
| `dimension.space`   | padding, gap, margin, positional nudges | `none`, `pos.{unit…large}` (10), `neg.{unit,xxxsmall,xxsmall}`  |
| `dimension.control` | heights, widths, min/max, icon boxes    | `none`, `pos.{unit…huge}` (14)                                  |
| `dimension.border`  | stroke weight and focus-ring offset     | `width.{none,thin,thick}`, `offset.{none,thin,thick}`           |
| `dimension.radius`  | corner radii                            | `null`, `small`, `medium`, `large`, `xlarge`, `xxlarge`, `full` |
| `dimension.text`    | type metrics                            | `scale.*`, `leading.*`, `tracking.*`, `weight.*`                 |

`space` and `control` share a rung vocabulary with commons on purpose: the
migration stays auditable (`{scale.pos.small}` → `{dimension.control.pos.small}`),
and the value added is the **role split**, not a new size language.

`dimension.text` exposes four parallel ladders rather than composed style
bundles. Components pair sizes and tracking in combinations a bundle would
flatten — `select` uses `lineHeight.default` with `letterSpacing.medium` — and
`text.json` already owns the notion of a composed text style.

## What a mode can modulate

This is the payoff. Dark modes shift every tracking rung up one notch, because
light glyphs bloom optically against a dark ground:

```scss
/* [data-mode="yelbolt-ylb-light"] */
--dimension-text-tracking-large: var(
  --font-letter-spacing-pos-large
); /* 0.08px */

/* [data-mode="yelbolt-ylb-dark"] */
--dimension-text-tracking-large: var(
  --font-letter-spacing-pos-xlarge
); /* 0.16px */
```

Every component that asked for `tracking.large` widens in dark, with no
component token touched. The same lever is available for `space` (an airier dark
theme), `control` (a denser brand), or `radius` — edit the rung in that mode's
`dimension` block.

The tracking ladder is defined per mode in the mode file itself; light modes map
each rung to its like-named primitive, dark modes shift up one, and `xlarge` is
the ceiling in both.

## Resolution chain

Three hops, mirroring how colors already resolve:

```
:root[data-theme="yelbolt"]        --button-base-height: var(--dimension-control-pos-small)
[data-mode="yelbolt-ylb-light"]    --dimension-control-pos-small: var(--size-pos-small)
:root                              --size-pos-small: 24px
```

### Specificity matters

Component tokens are emitted once at `:root[data-theme="yelbolt"]`
(specificity `0,2,0`); the mode layer is emitted at `[data-mode="…"]`
(`0,1,0`). If `dimension.**` were ever emitted into a component stylesheet it
would **outrank the mode block and silently kill the modulation**.

That is why every yelbolt terrazzo config except `terrazzo.mode.js` carries
`'dimension.**'` in its `exclude` list. `terrazzo.mode.js` is the single place
the dimension system is emitted — once per mode.

## Build wiring

`tokens/yelbolt-modes.resolver.json` loads commons into its `primitives` set,
so the mode files can resolve `{scale.pos.*}` and friends:

```jsonc
"sets": {
  "primitives": {
    "sources": [
      { "$ref": "./commons/commons.tokens.json" },
      { "$ref": "./platforms/yelbolt/colors.json" }
    ]
  }
}
```

`terrazzo/yelbolt/terrazzo.mode.js` then excludes those primitives from
per-mode emission via `PRIMITIVE_TOKENS` — the commons scale is already declared
once at `:root` by `commons.scss`, and the brand ramps (`YLB.*`, `NTL.*`, …) are
declared once at `:root` by `terrazzo.color.js` → `yelbolt-colors.scss`, so
re-emitting either inside all 14 mode blocks would bloat the output for no gain.

`yelbolt` is the only theme with a standalone `terrazzo.color.js` — it is the
one theme with its own primitive color palette (`platforms/yelbolt/colors.json`)
that needs emitting as reusable `:root` variables. `figma`, `penpot`, `sketch`
and `framer` resolve their colors directly into the mode layer at build time,
so they have no separate primitive layer to name `color` and stay pure `mode`.

Rebuild with:

```bash
npm run scss:build -- --build theme=yelbolt
```

## Invariants worth checking after a change

The ladder is sized exactly to what components consume — no dangling refs, no
dead rungs. To re-verify:

```bash
# every --dimension-* a component references
grep -rho 'var(--dimension-[a-z0-9-]*)' \
  src/components/*/*/styles/yelbolt.scss src/styles/texts/styles/yelbolt.scss \
  | sed 's/var(\(.*\))/\1/' | sort -u > /tmp/used.txt

# every --dimension-* the mode layer declares
grep -o '^\s*--dimension-[a-z0-9-]*' src/styles/tokens/yelbolt-modes.scss \
  | tr -d ' ' | sort -u > /tmp/declared.txt

comm -23 /tmp/used.txt /tmp/declared.txt   # used but undeclared → breaks at runtime
comm -13 /tmp/used.txt /tmp/declared.txt   # declared but unused → dead rung
```

Both must be empty.

## Out of scope

`boxShadow` layer geometry (`x`, `y`, `blur`, `spread` inside a shadow `$value`)
still references `{scale.*}` directly. Shadows are already mode-aware through the
commons light/dark effect sets, so they belong to the elevation system rather
than this one.

## Extending to another theme

1. Add a `dimension` block to each mode file in
   `tokens/platforms/{theme}/modes/`.
2. Add commons to that theme's colors resolver `primitives` set.
3. Extend `PRIMITIVE_TOKENS` in `terrazzo/{theme}/terrazzo.mode.js` with
   `scale.**`, `font.**`, `border.**`, `grey.**`, `alpha.**`, `shadow.**`,
   `elevation.**`.
4. Add `'dimension.**'` to the `exclude` list of every **other** terrazzo config
   for that theme.
5. Re-point the theme's component tokens and `text.json` off the primitives.
6. Rebuild and run the invariant check above.

Note that themes without a `modes/` folder have no mode layer to host the
dimension system; they would need one first.
