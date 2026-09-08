export interface FamilyItem {
  value: string
  title: string
  fixedDataMode?: string
  isBaseline?: boolean
}

export interface ThemeEntry {
  title: string
  families?: FamilyItem[]
}

export const THEMES: Record<string, ThemeEntry> = {
  figma: {
    title: 'Figma',
    families: [
      { value: 'design', title: 'Design', isBaseline: true },
      { value: 'figjam', title: 'FigJam', fixedDataMode: 'figjam' },
    ],
  },
  penpot: { title: 'Penpot' },
  sketch: { title: 'Sketch' },
  framer: { title: 'Framer' },
  yelbolt: {
    title: 'Yelbolt',
    families: [
      { value: 'ylb', title: 'YLB' },
      { value: 'ntl', title: 'NTL' },
      { value: 'isb', title: 'ISB' },
      { value: 'uicp', title: 'UICP' },
      { value: 'uics', title: 'UICS' },
      { value: 'tcn', title: 'TCN' },
      { value: 'uno', title: 'UNO' },
    ],
  },
}

export const THEME_ITEMS = Object.keys(THEMES)

export const MODE_ITEMS = [
  { value: 'light', title: 'Light' },
  { value: 'dark', title: 'Dark' },
]

export function defaultFamilyFor(
  theme: string | undefined
): string | undefined {
  return theme ? THEMES[theme]?.families?.[0]?.value : undefined
}

export function needsModeStep(
  theme: string,
  family: string | undefined
): boolean {
  const familyItem = THEMES[theme]?.families?.find((f) => f.value === family)
  return !familyItem?.fixedDataMode
}

export function buildDataMode(
  theme: string,
  family: string | undefined,
  mode: string
): string {
  const familyItem = THEMES[theme]?.families?.find((f) => f.value === family)

  if (familyItem?.fixedDataMode) {
    return familyItem.fixedDataMode
  }
  if (familyItem && !familyItem.isBaseline) {
    return `${theme}-${familyItem.value}-${mode}`
  }
  return `${theme}-${mode}`
}

export const BACKGROUND_MAP: Record<string, string> = {
  'figma-light': '#ffffff',
  'figma-dark': '#2c2c2c',
  figjam: '#ffffff',
  'penpot-light': '#ffffff',
  'penpot-dark': '#000000',
  'sketch-light': '#ffffff',
  'sketch-dark': '#202022',
  'framer-light': '#ffffff',
  'framer-dark': '#111111',
  'yelbolt-isb-light': '#fffec3',
  'yelbolt-isb-dark': '#493200',
  'yelbolt-ntl-light': '#ffffe8',
  'yelbolt-ntl-dark': '#39381e',
  'yelbolt-tcn-light': '#ffe3fa',
  'yelbolt-tcn-dark': '#670331',
  'yelbolt-uicp-light': '#caffff',
  'yelbolt-uicp-dark': '#00424d',
  'yelbolt-uics-light': '#c8ffd1',
  'yelbolt-uics-dark': '#004800',
  'yelbolt-uno-light': '#f6f5ff',
  'yelbolt-uno-dark': '#33207d',
  'yelbolt-ylb-light': '#ffff8c',
  'yelbolt-ylb-dark': '#443600',
}
