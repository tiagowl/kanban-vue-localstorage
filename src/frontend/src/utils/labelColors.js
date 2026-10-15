/**
 * Paleta de etiquetas (design-system §2.3)
 * @type {Record<string, {bg: string, fg: string, dot: string}>}
 */
export const LABEL_COLORS = {
  rose: { bg: '#FFE4E6', fg: '#BE123C', dot: '#F43F5E' },
  orange: { bg: '#FFEDD5', fg: '#C2410C', dot: '#F97316' },
  amber: { bg: '#FEF3C7', fg: '#B45309', dot: '#F59E0B' },
  emerald: { bg: '#D1FAE5', fg: '#047857', dot: '#10B981' },
  teal: { bg: '#CCFBF1', fg: '#0F766E', dot: '#14B8A6' },
  sky: { bg: '#E0F2FE', fg: '#0369A1', dot: '#0EA5E9' },
  violet: { bg: '#EDE9FE', fg: '#6D28D9', dot: '#8B5CF6' },
  purple: { bg: '#F3E8FF', fg: '#7E22CE', dot: '#A855F7' }
}

export const LABEL_COLOR_KEYS = Object.keys(LABEL_COLORS)

export function getLabelColor(key) {
  return LABEL_COLORS[key] || LABEL_COLORS.violet
}
