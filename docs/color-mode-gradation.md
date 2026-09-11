# Color Mode Gradation

> **Scope: `yelbolt` only.** The other four themes (`figma`, `penpot`, `sketch`,
> `framer`) don't have the multi-family mode system described here.

## The seven families

`tokens/platforms/yelbolt/colors.json` defines seven color families, each an
8-step shade/tint ramp (`1` = lightest, `8` = darkest) around one hue:

| Family | Hue                 |
| ------ | ------------------- |
| `YLB`  | yellow (brand)      |
| `NTL`  | neutral (near-gray) |
| `UICP` | cyan                |
| `UNO`  | purple              |
| `TCN`  | pink / red          |
| `UICS` | green               |
| `ISB`  | gold / amber        |

Each family also has its own mode file pair —
`tokens/platforms/yelbolt/modes/{family}-{dark,light}.tokens.json` (14 files
total) — which is what gets activated at runtime via
`data-mode="yelbolt-{family}-{dark,light}"`. Every mode file carries the same
`color.{background,border,text,icon}` shape, each with the same nine
variants: `brand`, `primary`, `secondary`, `tertiary`, `danger`, `success`,
`warning`, `selected`, `inverse` (plus `onX` contrast tokens for text/icon,
which sit outside this system — see below).

## The rule

Within one mode file, every property (`background`, `border`, `text`, `icon`)
follows the same two independent gradients, built from that mode's **own**
family:

**Neutral gradient** — `primary` / `secondary` / `tertiary` rank by distance
from the page, using the family's own shade/tint scale:

- **Dark**: `primary` is the darkest, `secondary` less dark, `tertiary` the
  least dark of the three (closest to `brand`).
- **Light**: `primary` is the lightest, `secondary` less light, `tertiary`
  the least light of the three (closest to `brand`).

**Brand pivot** — `brand` sits apart from that gradient, at the family's most
vivid step (dark) or a deliberately muted step (light — "less saturated", not
just lighter).

**Semantic colors** — `danger`, `success`, `warning` don't use the mode's own
family at all. They borrow the fixed semantic families, at **the same
step-for-step pattern as `brand`** (own family swapped out, same states):

| Variant   | Family always used |
| --------- | ------------------ |
| `danger`  | `TCN`              |
| `success` | `UICS`             |
| `warning` | `ISB`              |

This is why, e.g., the `uics` mode's own `success` token still resolves to
`UICS` (self-reference — a no-op on the family, but its step still moves to
match `brand`'s tier, not the old `secondary`/`tertiary` tier).

**`selected`** sits between `brand` and `secondary`: take `secondary`'s steps
and shift them one step toward `brand` (same family, no swap).

**`inverse`** — `background`/`border` only (see below for `text`/`icon`) —
flips the mode's own polarity using that mode's own family: it rests near the
end of the ramp opposite the mode's dominant tone, then punches all the way
to the _other_ end on `strong` for maximum contrast/amplitude. `focus`
mirrors `default` as usual; `disabled` sits one step in from the resting end.

| State               | Dark   | Light  |
| ------------------- | ------ | ------ |
| `default` / `focus` | step 1 | step 8 |
| `hover`             | step 2 | step 7 |
| `pressed`           | step 3 | step 6 |
| `disabled`          | step 2 | step 7 |
| `strong`            | step 8 | step 1 |

`text.inverse` / `icon.inverse` don't get this graduated treatment — they're
a straight copy of that mode's `onInverse` (see below), since "inverse text"
and "content placed on an inverse surface" are the same requirement.

Per the "Known overlap" rule below, `inverse`'s steps can and do land on the
same raw color as other variants (e.g. dark `inverse.pressed` = step 3 =
`brand.default`) — that's expected, not a bug to fix.

**`disabled`** is excluded from all of the above. It's a flat, family-constant
muted tone already shared by every variant in a given mode/property — moving
`danger`/`success`/`warning` to another family does not touch their
`disabled` value, so a disabled danger control still reads as "generic
disabled", not tinted red.

## Known overlap

Because `selected`'s midpoint and the neutral gradient's `tertiary` slot can
land on the same step number (e.g. dark `background`: `brand=3`,
`tertiary=4`, `selected=4`), the two can resolve to the identical color within
one mode. They're driven by independent rules on purpose — if a future mode
needs them visually distinct, nudge `selected`'s shift (currently ±1 step) or
give it its own family, rather than re-deriving the whole gradient.

## What this does not touch

`onBrand`, `onPrimary`, `onSecondary`, `onTertiary`, `onDanger`, `onSuccess`,
`onWarning`, `onSelected`, `onInverse` (text/icon contrast tokens) are a
separate concern — the color placed _on top of_ a variant's surface — and
keep whatever family/step they already had.
