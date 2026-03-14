import { resolve, join, basename } from 'node:path'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

/**
 * tokens-studio-compat
 *
 * Provides compatibility between Tokens Studio legacy formats and DTCG 2025.10.
 *
 * Three exports:
 *
 *   preprocessTokens(paths) — call BEFORE defineConfig in your terrazzo config.
 *     Reads token JSON files, remaps all Tokens Studio legacy $type values to
 *     their DTCG equivalents in-memory, writes results to .terrazzo-tmp/, and
 *     returns absolute paths to those temp files. Pass the returned array as
 *     the `tokens` option in defineConfig so Terrazzo's parser never sees the
 *     legacy type names (parser:init alias cross-type errors happen during
 *     parse, before any plugin hook can fire).
 *
 *     Usage:
 *       import tokensStudioCompat, { cssTransform, preprocessTokens }
 *         from '../plugins/tokens-studio-compat.js'
 *       const tokens = preprocessTokens(['./tokens/foo.json', …])
 *       export default defineConfig({ tokens, plugins: [tokensStudioCompat(), …] })
 *
 *   default (tokensStudioCompat) — Terrazzo plugin, enforce: "pre".
 *     Renames any remaining Tokens Studio legacy $type values to DTCG
 *     equivalents at the transform stage (post-parse). Handles tokens whose
 *     $value is a plain (non-alias) literal that Terrazzo never validated against
 *     another token's type. Pair with preprocessTokens for full coverage.
 *
 *   cssTransform — pass directly to css({ transform: cssTransform }).
 *     Handles Tokens Studio quirks at CSS-generation time, using the
 *     per-permutation `tokensSet` so resolver modes (light/dark) work correctly:
 *
 *     - dimension  "$value": "4px"      (string) → returned as-is as CSS
 *     - shadow / boxShadow (aliasOf set) → var(--alias-token) reference, so
 *                  component tokens that alias an elevation token emit e.g.
 *                  var(--elevation-300-tooltip) rather than inlined layers.
 *     - shadow / boxShadow (no alias)   → full CSS box-shadow string, with
 *                  layer.offsetX/x        aliases resolved via tokensSet
 *                  layer.inset / type: "dropShadow" / "innerShadow"
 *
 *   wrapFallbacks(prepare) — wraps a permutation prepare function so that every
 *     CSS custom property ending in `-default` is rewritten with a var() bridge,
 *     stripping the `-default` suffix from the referenced variable name:
 *       --foo-bar-default: rgb(…)  →  --foo-bar-default: var(--foo-bar, rgb(…))
 *     This bridges two environments simultaneously:
 *       - Storybook: --foo-bar is not set → the raw fallback value is used
 *       - Figma plugin (when figma-plugin.scss is loaded): Figma injects --foo-bar
 *         natively → the var() picks it up
 *     This is NOT a cyclic reference — the two property names are different.
 *     Non-default tokens keep their raw values as-is (no passthrough, no cycle).
 *
 *     Usage:
 *       import tokensStudioCompat, { cssTransform, wrapFallbacks }
 *         from '../plugins/tokens-studio-compat.js'
 *       prepare: wrapFallbacks(css => `[data-mode="figma-light"] {\n  ${css}\n}`)
 *
 *   wrapPassthrough(selector) — produce a lightweight stylesheet for plugin
 *     contexts where a platform (e.g. Figma) already injects its own CSS
 *     custom properties. Scans the token CSS for `-default` properties and
 *     emits ONLY those, stripping the suffix from the referenced name and
 *     using no fallback value:
 *       --foo-bar-default: rgb(…)  →  --foo-bar-default: var(--foo-bar)
 *     Non-default tokens are omitted entirely — they share the exact same name
 *     as the platform's native variables, so the platform's injected `:root`
 *     values are picked up directly without any declaration needed.
 *     Load the resulting file INSTEAD of figma-colors.scss in the plugin so
 *     the platform's colors apply for all products (FigJam, Slides, Buzz…)
 *     regardless of data-mode.
 *
 *     Usage:
 *       import tokensStudioCompat, { cssTransform, wrapPassthrough }
 *         from '../plugins/tokens-studio-compat.js'
 *       prepare: wrapPassthrough(':root')
 *
 * TYPE_MAP (shared by all three exports):
 *   fontFamilies → fontFamily  (DTCG)
 *   fontWeights  → fontWeight  (DTCG)
 *   fontSizes    → dimension   (DTCG — font size is a dimension)
 *   lineHeights  → number      (DTCG — unitless ratio)
 *   letterSpacing → dimension  (DTCG — letter spacing is a dimension)
 *   text / link / none → string
 *   boxShadow    → shadow
 */

const TYPE_MAP = {
  fontWeights: 'fontWeight',
  fontFamilies: 'fontFamily',
  fontSizes: 'dimension',
  lineHeights: 'number',
  letterSpacing: 'dimension',
  text: 'string',
  link: 'string',
  none: 'string',
  boxShadow: 'shadow',
}

/**
 * Parse a dimension string like "11px" or "0" into a DTCG {value, unit} object.
 * Leaves aliases ("{token.path}") and non-dimension strings unchanged.
 */
const parseDimensionValue = (str) => {
  if (typeof str !== 'string' || str.startsWith('{')) return str
  const m = str.match(/^(-?[\d.]+)([a-z%]*)$/i)
  if (!m) return str
  return { value: parseFloat(m[1]), unit: m[2] || 'px' }
}

/**
 * Deep-walk a parsed token JSON object, remapping legacy $type values and
 * converting dimension string $values to DTCG {value, unit} objects so that
 * Terrazzo generates var() references instead of inlining raw strings.
 *
 * @param {*} obj - Current node.
 * @param {string|null} inheritedType - Effective $type from a parent group.
 */
const remapTypes = (obj, inheritedType = null) => {
  if (Array.isArray(obj)) return obj.map((v) => remapTypes(v, inheritedType))
  if (obj && typeof obj === 'object') {
    const out = {}

    let effectiveType = inheritedType
    if ('$type' in obj && typeof obj.$type === 'string') {
      effectiveType = TYPE_MAP[obj.$type] ?? obj.$type
      out.$type = effectiveType
    }

    for (const [k, v] of Object.entries(obj)) {
      if (k === '$type') continue // already handled above
      if (k === '$value' && effectiveType === 'dimension')
        out.$value = parseDimensionValue(v)
      else if (!k.startsWith('$')) out[k] = remapTypes(v, effectiveType)
      else out[k] = v
    }
    return out
  }
  return obj
}

/**
 * Preprocess token JSON files before Terrazzo parses them.
 *
 * Resolves each path relative to process.cwd() (same convention as the
 * `tokens` array in defineConfig), transforms $type values in-memory, and
 * writes results to <cwd>/.terrazzo-tmp/. Returns absolute paths to use as
 * the `tokens` array in defineConfig.
 *
 * @param {string[]} tokenPaths - Same relative paths you'd pass to defineConfig.
 * @returns {string[]} Absolute paths to the preprocessed temp files.
 */
export const preprocessTokens = (tokenPaths) => {
  // eslint-disable-next-line no-undef
  const cwd = process.cwd()
  const tmpDir = resolve(cwd, '.terrazzo-tmp')
  mkdirSync(tmpDir, { recursive: true })

  return tokenPaths.map((p) => {
    const abs = resolve(cwd, p)
    const raw = JSON.parse(readFileSync(abs, 'utf-8'))
    const transformed = remapTypes(raw)
    const safeKey = p.replace(/[^a-zA-Z0-9]/g, '_')
    const tmp = join(tmpDir, `${safeKey}__${basename(abs)}`)
    writeFileSync(tmp, JSON.stringify(transformed, null, 2))
    return tmp
  })
}

const dimToCSS = (raw, tokensSet) => {
  if (typeof raw === 'number') return `${raw}px`
  if (raw && typeof raw === 'object' && 'value' in raw)
    return `${raw.value}${raw.unit ?? ''}`
  if (typeof raw === 'string') {
    if (raw.startsWith('{')) {
      const refId = raw.slice(1, -1)
      const ref = tokensSet[refId]
      if (ref) return dimToCSS(ref.$value, tokensSet)
      return '0'
    }
    return raw
  }
  return '0'
}

const colorToCSS = (raw, tokensSet) => {
  if (raw === undefined || raw === null) return 'transparent'
  if (typeof raw === 'string' && raw.startsWith('{')) {
    const refId = raw.slice(1, -1)
    const ref = tokensSet[refId]
    if (ref) return colorToCSS(ref.$value, tokensSet)
    return 'transparent'
  }
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const ch = raw.channels ?? raw.components
    if (ch) {
      const [r, g, b] = ch
      const a = raw.alpha ?? 1
      return `color(${raw.colorSpace || 'srgb'} ${r} ${g} ${b} / ${a})`
    }
    if (raw.hex) return raw.hex
  }
  return 'transparent'
}

export const cssTransform = (token, { tokensSet, transformAlias }) => {
  if (token.$type === 'dimension') {
    if (token.aliasChain?.[0])
      return transformAlias(tokensSet[token.aliasChain[0]])
    const v = token.$value
    if (typeof v === 'string') return v
    if (v && typeof v === 'object' && 'value' in v)
      return v.value === 0 ? '0' : `${v.value}${v.unit ?? ''}`
  }
  if (token.$type === 'shadow' || token.$type === 'boxShadow') {
    if (token.aliasOf) {
      const aliasToken = tokensSet[token.aliasOf]
      if (aliasToken && transformAlias) return transformAlias(aliasToken)
    }

    const layers = Array.isArray(token.$value) ? token.$value : [token.$value]
    return layers
      .map((layer) => {
        const parts = [
          dimToCSS(layer.offsetX ?? layer.x ?? 0, tokensSet),
          dimToCSS(layer.offsetY ?? layer.y ?? 0, tokensSet),
          dimToCSS(layer.blur ?? 0, tokensSet),
          dimToCSS(layer.spread ?? 0, tokensSet),
          colorToCSS(layer.color, tokensSet),
        ]
        if (layer.inset === true || layer.type === 'innerShadow')
          parts.unshift('inset')
        return parts.join(' ')
      })
      .join(', ')
  }
}

/**
 * Wraps a permutation prepare function so that every CSS custom property is
 * rewritten to use a var() with the raw value as fallback:
 *   --foo-bar-hover: red    →  --foo-bar-hover: var(--foo-bar-hover, red)
 *   --foo-bar-default: red  →  --foo-bar-default: var(--foo-bar, red)
 *
 * For tokens ending in -default the suffix is stripped from the var() name,
 * so consumers can override the default by setting the shorter alias.
 * All other tokens keep the full var() name.
 *
 * @param {(css: string) => string} prepare - The original prepare function.
 * @returns {(css: string) => string}
 */
export const wrapFallbacks = (prepare) => (css) => {
  const patched = css.replace(
    /(--[\w][\w-]*)-default: ([^;]+);/g,
    '$1-default: var($1, $2);',
  )
  return prepare(patched)
}

/**
 * Produce a passthrough stylesheet for plugin contexts where the platform
 * (e.g. Figma) already injects its own CSS custom properties at :root.
 * Only emits -default tokens mapped to var(--base-name) with no fallback.
 * Non-default tokens are omitted — they share the platform's native names.
 *
 * @param {string} selector - The CSS selector to wrap the block in (e.g. ':root').
 * @returns {(css: string) => string}
 */
export const wrapPassthrough = (selector) => (css) => {
  const lines = []
  for (const [, base] of css.matchAll(/(--[\w][\w-]*)-default: [^;]+;/g)) {
    lines.push(`  ${base}-default: var(${base});`)
  }
  return `${selector} {\n${lines.join('\n')}\n}\n`
}

export default function tokensStudioCompat() {
  return {
    name: 'tokens-studio-compat',
    enforce: 'pre',

    async transform({ tokens }) {
      for (const token of Object.values(tokens)) {
        const mapped = TYPE_MAP[token.$type]
        if (mapped) token.$type = mapped
      }
    },
  }
}
