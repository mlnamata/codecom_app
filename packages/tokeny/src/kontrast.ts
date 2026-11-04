/** Relativní jas podle WCAG 2.x (stejný vzorec jako palettes.py). */
export function jas(hex: string): number {
  const h = hex.replace('#', '')
  const kanal = (i: number): number => {
    const v = Number.parseInt(h.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * kanal(0) + 0.7152 * kanal(2) + 0.0722 * kanal(4)
}

/** Kontrastní poměr dvou barev, například 4.5 pro 4,5 : 1. */
export function kontrast(a: string, b: string): number {
  const x = jas(a)
  const y = jas(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
