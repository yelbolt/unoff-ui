import css from '@terrazzo/plugin-css'
import { defineConfig } from '@terrazzo/cli'
import { COMPONENTS, PRIMITIVE_EXCLUDES } from '../components.manifest.js'
import tokensStudioCompat, {
  cssTransform,
  preprocessTokens,
} from './tokens-studio-compat.js'

const COMMONS = [
  './tokens/commons/commons.tokens.json',
  './tokens/commons/modes/commons.effect-dark.tokens.json',
  './tokens/commons/modes/commons.effect-light.tokens.json',
]

/**
 * Build the single Terrazzo config that emits every component stylesheet for
 * one platform.
 *
 * Terrazzo resolves `filename` against `outDir` as a URL and creates missing
 * directories, so one config can write into all 43 component folders. Each
 * output is scoped by the manifest's `include`; `exclude` then re-states the
 * invariant that no primitive or semantic family may land in a component
 * stylesheet, where it would be emitted at a selector that outranks the mode
 * block and silently kill all modulation.
 *
 * @param {object}   options
 * @param {string}   options.platform      Theme name, also the emitted filename.
 * @param {string[]} options.modes         Mode file basenames, in cascade order.
 * @param {string[]} [options.extraTokens] Extra paths (yelbolt's color ramps).
 * @param {string[]} options.colorExcludes Color families owned by this platform.
 *
 * Set the TZ_COMPONENT env var to emit a single component instead of all 43 —
 * this is what `npm run scss:build -- --build component=button` drives, now
 * that a component is an entry in the manifest rather than a config file.
 */
export function defineComponentsConfig({
  platform,
  modes,
  extraTokens = [],
  colorExcludes,
}) {
  // eslint-disable-next-line no-undef
  const only = process.env.TZ_COMPONENT
  const components = only
    ? COMPONENTS.filter((c) => c.name === only)
    : COMPONENTS

  if (only && !components.length)
    throw new Error(
      `Unknown component "${only}". Known: ${COMPONENTS.map((c) => c.name).join(', ')}`
    )

  const tokenPaths = [
    ...COMMONS,
    ...modes.map(
      (m) => `./tokens/platforms/${platform}/modes/${m}.tokens.json`
    ),
    ...extraTokens,
    `./tokens/platforms/${platform}/text.json`,
    `./tokens/platforms/${platform}/icon.json`,
    ...COMPONENTS.map(
      (c) => `./tokens/platforms/${platform}/components/${c.name}.json`
    ),
  ]

  return defineConfig({
    name: `${platform} Components`,
    tokens: preprocessTokens(tokenPaths),
    outDir: './src/components/',
    plugins: [
      tokensStudioCompat(),
      ...components.map(({ name, category, include }) =>
        css({
          filename: `${category}/${name}/styles/${platform}.scss`,
          transform: cssTransform,
          include,
          exclude: [...colorExcludes, ...PRIMITIVE_EXCLUDES],
          baseSelector: `:root[data-theme="${platform}"]`,
        })
      ),
    ],
    lint: { rules: {} },
  })
}
