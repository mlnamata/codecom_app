import React from 'react'
import Svg, { Path, Rect, Circle } from 'react-native-svg'

export type NazevIkony =
  | 'domu'
  | 'deska'
  | 'zpravy'
  | 'sluzby'
  | 'vice'
  | 'krize'
  | 'zavada'
  | 'budovy'
  | 'platby'
  | 'rezervace'
  | 'mapa'
  | 'zvon'
  | 'kalendar'
  | 'fotoaparat'
  | 'kapka'

export interface IkonaProps {
  nazev: NazevIkony
  velikost?: number
  barva: string
}

/**
 * Čárové ikony na mřížce 24 × 24, tloušťka tahu 2. Jsou dekorativní:
 * význam nese vedlejší popisek, proto je `aria-hidden`.
 */
export function Ikona({ nazev, velikost = 24, barva }: IkonaProps) {
  const spolecne = {
    stroke: barva,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  }

  return (
    <Svg
      width={velikost}
      height={velikost}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no"
      aria-hidden
    >
      {vykresli(nazev, spolecne)}
    </Svg>
  )
}

function vykresli(nazev: NazevIkony, s: Record<string, unknown>): React.ReactNode {
  switch (nazev) {
    case 'domu':
      return (
        <>
          <Path d="M3 11l9-7 9 7" {...s} />
          <Path d="M5 10v10h14V10" {...s} />
        </>
      )
    case 'deska':
      return (
        <>
          <Rect x="3" y="4" width="18" height="16" rx="2" {...s} />
          <Path d="M7 9h10M7 13h10M7 17h6" {...s} />
        </>
      )
    case 'zpravy':
      return (
        <>
          <Path d="M4 5h14v14H6a2 2 0 0 1-2-2z" {...s} />
          <Path d="M18 9h2v8a2 2 0 0 1-2 2" {...s} />
          <Path d="M8 9h6M8 13h6" {...s} />
        </>
      )
    case 'sluzby':
      return (
        <>
          <Rect x="3" y="3" width="7" height="7" rx="1.5" {...s} />
          <Rect x="14" y="3" width="7" height="7" rx="1.5" {...s} />
          <Rect x="3" y="14" width="7" height="7" rx="1.5" {...s} />
          <Rect x="14" y="14" width="7" height="7" rx="1.5" {...s} />
        </>
      )
    case 'vice':
      return (
        <>
          <Circle cx="5" cy="12" r="1.5" {...s} />
          <Circle cx="12" cy="12" r="1.5" {...s} />
          <Circle cx="19" cy="12" r="1.5" {...s} />
        </>
      )
    case 'krize':
      return (
        <>
          <Path d="M12 3l10 18H2z" {...s} />
          <Path d="M12 10v4M12 17.5v.5" {...s} />
        </>
      )
    case 'zavada':
      return (
        <>
          <Path d="M4 8h3l2-3h6l2 3h3v11H4z" {...s} />
          <Circle cx="12" cy="13" r="3.5" {...s} />
        </>
      )
    case 'budovy':
      return (
        <>
          <Path d="M4 21V5l8-2v18" {...s} />
          <Path d="M12 9h8v12" {...s} />
          <Path d="M8 8v.01M8 12v.01M8 16v.01M16 13v.01M16 17v.01" {...s} />
        </>
      )
    case 'platby':
      return (
        <>
          <Rect x="3" y="6" width="18" height="12" rx="2" {...s} />
          <Path d="M3 10h18M7 15h3" {...s} />
        </>
      )
    case 'rezervace':
      return (
        <>
          <Rect x="3" y="5" width="18" height="16" rx="2" {...s} />
          <Path d="M8 3v4M16 3v4M3 10h18" {...s} />
        </>
      )
    case 'mapa':
      return (
        <>
          <Path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" {...s} />
          <Circle cx="12" cy="9" r="2.5" {...s} />
        </>
      )
    case 'zvon':
      return (
        <>
          <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...s} />
          <Path d="M10 21h4" {...s} />
        </>
      )
    case 'kalendar':
      return (
        <>
          <Rect x="3" y="5" width="18" height="16" rx="2" {...s} />
          <Path d="M3 10h18M8 3v4M16 3v4" {...s} />
        </>
      )
    case 'fotoaparat':
      return (
        <>
          <Path d="M4 8h3l2-3h6l2 3h3v11H4z" {...s} />
          <Circle cx="12" cy="13" r="3.5" {...s} />
        </>
      )
    case 'kapka':
      return <Path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" {...s} />
  }
}
