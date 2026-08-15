export interface GradientTrackStop {
  /** Position along the track, from 0 to 1 */
  offset: number
  /** The color at this position */
  color: string
  /** Marks this position as unreachable in the sRGB gamut; rendered as hachures */
  outOfGamut?: boolean
}

export const buildGradientBackground = (
  stops: GradientTrackStop[]
): string | undefined => {
  if (stops.length === 0) return undefined

  const sorted = [...stops].sort((a, b) => a.offset - b.offset)

  if (sorted.length === 1) return sorted[0].color

  return `linear-gradient(90deg, ${sorted
    .map((stop) => `${stop.color} ${(stop.offset * 100).toFixed(2)}%`)
    .join(', ')})`
}

export const buildGamutOverlayMask = (
  stops: GradientTrackStop[]
): string | undefined => {
  if (stops.length < 2) return undefined

  const sorted = [...stops].sort((a, b) => a.offset - b.offset)
  if (!sorted.some((stop) => stop.outOfGamut)) return undefined

  const segments: string[] = []
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const from = sorted[i]
    const to = sorted[i + 1]
    const isWarning = from.outOfGamut || to.outOfGamut
    const color = isWarning ? 'black' : 'transparent'
    const fromPct = (from.offset * 100).toFixed(2)
    const toPct = (to.offset * 100).toFixed(2)

    segments.push(`${color} ${fromPct}%`, `${color} ${toPct}%`)
  }

  return `linear-gradient(90deg, ${segments.join(', ')})`
}
