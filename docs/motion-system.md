# Motion System

> **Status: shipped on all five themes.** Unlike the dimension system, motion is
> layered identically everywhere — `yelbolt`, `figma`, `penpot`, `sketch` and
> `framer` all carry the same semantic block. Only the values differ.

## Why it exists

Before this, motion was a single hardcoded island: `select.toggle` carried a
literal `200ms` / `cubic-bezier(0.37, 0, 0.63, 1)` transition, repeated verbatim
in all five platform token files. Nothing else in the library moved, and nothing
could be retimed without editing five files by hand.

Motion now has the same three layers colors have always had:

| Layer         | Colors                                        | Motion                                              |
| ------------- | --------------------------------------------- | --------------------------------------------------- |
| **Primitive** | `commons.tokens.json` → `grey.*`              | `commons.tokens.json` → `duration/easing/transform` |
| **System**    | `platforms/*/modes/*.tokens.json` → `color.*` | `platforms/*/modes/*.tokens.json` → `motion.*`      |
| **Component** | `platforms/*/components/*.json`               | `platforms/*/components/*.json`                     |

## Primitives

Three families in `tokens/commons/commons.tokens.json`, shared by every theme:

| Family      | `$type`       | Rungs                                                                                      |
| ----------- | ------------- | ------------------------------------------------------------------------------------------ |
| `duration`  | `duration`    | `null` (0ms), `xsmall` (80), `small` (120), `medium` (200), `large` (280), `xlarge` (400)  |
| `easing`    | `cubicBezier` | `linear`, `standard`, `decelerate`, `accelerate`, `emphasized`, `overshoot`                |
| `transform` | `string`      | `none`, `scale.{down,up}.{small,medium,large}`, `translate.{up,down}.{small,medium,large}` |

`duration.medium` and `easing.standard` are not invented values — they are the
house values **recovered** from the pre-existing `select.toggle` transition, so
that migration preserved its behaviour byte for byte.

`transform` is authored as complete CSS transform functions (`"scale(0.98)"`)
because DTCG has no transform type. Durations are authored in DTCG object form
(`{ "value": 200, "unit": "ms" }`) — Terrazzo's `transformDuration` reads
`$value.value` / `$value.unit` and would throw on a `"200ms"` string.

## The semantic layer

Every one of the 23 mode files carries a `motion` block at its **root** — not
nested under the platform namespace the way `figma.color.*` is. That is
deliberate: because the name is identical everywhere, one component token file
is valid on all five platforms, and only the mode values diverge.

```jsonc
{
  "figma":  { "color": { … } },   // platform-namespaced, as before
  "motion": {                     // root-level, identical shape on every theme
    "duration":  { "instant": …, "fast": …, "base": …, "slow": …, "control": … },
    "easing":    { "standard": …, "entrance": …, "exit": …, "emphasis": … },
    "transform": { "none": …, "raise": …, "sink": …, "grow": …, "shrink": … }
  }
}
```

### Two duration lanes

The split matters, and it is the one place where the four platform themes are
not fully inert:

| Lane                              | Means                                                               | figma / penpot / sketch / framer             |
| --------------------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| `instant`, `fast`, `base`, `slow` | **Interaction feedback** — the user hovers, presses, focuses        | `0ms` — these platforms do not expose motion |
| `control`                         | **A control's own state travel** — a switch knob crossing its track | `200ms` — alive everywhere                   |

`control` exists because the switch knob's movement is functional, not
decorative: it is what tells the user the toggle flipped. Silencing it on Figma
would have been a behavioural regression, not a style choice. `select.toggle`
is currently its only consumer.

`easing` stays real on all five themes — with a `0ms` duration the curve is
moot, and `control` needs a genuine one.

`transform` resolves to `transform.none` on the four platform themes, so every
interaction transform is a no-op there.

### No `-default` in a lane name

The semantic easing lane is `standard`, not `default`. Any custom property
ending in `-default` is rewritten by `wrapFallbacks` into a
`var(--foo-bar, …)` bridge — a colour-state convention that has no business
applying to a timing curve. Naming a motion lane `default` silently grafts a
phantom `--motion-easing` override hook onto it. Do not reintroduce one.

## The component contract

Two tokens per interactive component, on `base` where the root has one
(`button`, `iconButton`) and at the component root otherwise:

```jsonc
"transition": {
  "$type": "transition",
  "$value": {
    "duration": "{motion.duration.fast}",
    "delay": "{motion.duration.instant}",
    "timingFunction": "{motion.easing.standard}"
  }
},
"transform": {
  "default": "{motion.transform.none}",
  "hover": "{motion.transform.none}",
  "pressed": "{motion.transform.sink}",
  "focus": "{motion.transform.none}",
  "disabled": "{motion.transform.none}"
}
```

The DTCG composite emits a single shorthand carrying its three aliases:

```css
--button-base-transition: var(--motion-duration-fast)
  var(--motion-duration-instant) var(--motion-easing-standard);
```

which is consumed with the property list supplied at the use site:

```scss
transition:
  background-color var(--button-base-transition),
  outline-color var(--button-base-transition),
  transform var(--button-base-transition);
```

The order is `duration delay timing-function`, which the CSS `transition`
shorthand reads correctly (first `<time>` is duration, second is delay).

**The property list stays in SCSS, not in a token.** Which CSS properties a
component happens to have is an implementation fact; whether and how fast it
moves is the design decision. A mode kills a component's motion through
`duration: 0ms`, not through `transition-property: none`.

Transform is attached per state but **not per variant** — `primary`,
`destructive` and `alternative` buttons all sink by the same amount. Variants
differ in colour, not in physics.

## Resolution chain

Three hops, mirroring colors:

```
:root[data-theme="yelbolt"]        --button-base-transition: var(--motion-duration-fast) …
[data-mode="yelbolt-ylb-light"]    --motion-duration-fast: var(--duration-small)
:root                              --duration-small: 120ms
```

### Specificity matters

Component tokens are emitted at `:root[data-theme="…"]` (specificity `0,2,0`);
the semantic layer at `[data-mode="…"]` (`0,1,0`). If `motion.**` were ever
emitted into a component stylesheet it would **outrank the mode block and
silently kill the modulation** — exactly the trap `dimension.**` carries.

That is why every one of the 65 component terrazzo configs excludes
`motion.**`, alongside the three primitive families `duration.**`, `easing.**`
and `transform.**`. The mode-level `terrazzo.color.js` of each theme is the
single place the motion system is emitted.

## Build wiring

The four platform color resolvers previously sourced only their own mode files.
They now load commons into a `primitives` set — mirroring
`yelbolt-colors.resolver.json` — so `{duration.*}` and friends resolve, with
`COMMONS_TOKENS` excluded from each permutation so no primitive is re-emitted:

```jsonc
"resolutionOrder": [{ "$ref": "#/sets/primitives" }, { "$ref": "#/modifiers/mode" }],
"sets": {
  "primitives": { "sources": [{ "$ref": "./commons/commons.tokens.json" }] }
}
```

### The Figma plugin passthrough

`figma-plugin.scss` is loaded **instead of** `figma-colors.scss` inside the
Figma plugin, and `wrapPassthrough` deliberately emits only `-default`
properties — every other token shares a name with a variable Figma injects
natively. Motion has no such counterpart, so it must survive verbatim:

```js
prepare: wrapPassthrough(':root', { keep: ['--motion-'] })
```

Without that, every `--<component>-transition` shorthand would reference an
undefined var and the whole `transition` declaration would be invalid at
computed-value time. The emitted values are `var(--duration-*)` references, so
the plugin must also load `commons.scss`.

## Reduced motion

Each component stylesheet ends with a guard that re-points the **semantic
lanes** on that component's own subtree:

```scss
@media (prefers-reduced-motion: reduce) {
  .text-button,
  .icon-button {
    --motion-duration-fast: 0ms;
    /* … every lane, and every transform … */
  }
}
```

Acting on the lanes rather than on the component's resolved variables means the
guard keeps working if a mode later re-points that component to a different
lane. There is no specificity contest: the mode block declares these on `:root`,
the guard declares them on the component element itself, and the closest
declaration wins by inheritance.

## What a mode can modulate

This is the payoff, and it is unused so far by design — `yelbolt` ships one
simple transition across all 14 of its modes, so that divergence is a deliberate
later act rather than an accident of the migration. A mode can:

- **retime** the whole library — move `motion.duration.fast` to
  `{duration.xsmall}` for a snappier brand;
- **recharacterise** it — point `motion.easing.standard` at `{easing.overshoot}`;
- **immobilise** it — resolve every lane to `{duration.null}` / `{transform.none}`,
  which is exactly what the four platform themes do;
- **amplify** a single gesture — `motion.transform.sink` from
  `{transform.scale.down.small}` to `.medium`.

No component token is touched in any of those cases.

## Covered components

`button` (and `iconButton`), `actions-list`, `card`, `segmented-control`,
`actions-item`, `simple-item`, `dropdown`, `input`, `inputs-bar`, `knob`,
`select`, `tabs`, `chip`.

Two carry a wiring caveat worth knowing:

- **`knob`** — `.knob` already carries a positioning
  `translateX(-50%) translateY(-50%)`. Composing a `none`-valued token into a
  transform list is invalid CSS, so the knob's interaction transform rides on
  `.knob__label` instead.
- **`select`** — the toggle background keeps its `control`-lane
  `background-color` transition and gains the interaction lane for
  outline/box-shadow/transform in the same declaration.
