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
  | 'lupa'
  | 'blesk'
  | 'srdce'
  | 'auto'
  | 'taska'
  | 'klic'
  | 'hvezda'
  | 'lide'
  | 'kod'
  | 'sipka'
  | 'stit'
  | 'kriz'
  | 'ruka'
  | 'video'
  | 'kos'
  | 'trava'
  | 'strom'
  | 'lavicka'
  | 'znacka'
  | 'vlocka'
  | 'kanal'
  | 'sprej'
  | 'tlapka'
  | 'zarovka'
  | 'dlazba'
  | 'pytel'
  | 'plus'

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
    <Svg width={velikost} height={velikost} viewBox="0 0 24 24" aria-hidden>
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
    case 'lupa':
      return (
        <>
          <Circle cx="11" cy="11" r="6.5" {...s} />
          <Path d="M16 16l4.5 4.5" {...s} />
        </>
      )
    case 'blesk':
      return <Path d="M13 2L4 14h7l-1 8 9-12h-7z" {...s} />
    case 'srdce':
      return (
        <>
          <Path
            d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z"
            {...s}
          />
          <Path d="M7 12h3l1-2 2 4 1-2h3" {...s} />
        </>
      )
    case 'auto':
      return (
        <>
          <Path d="M5 16V11l2-5h10l2 5v5z" {...s} />
          <Path d="M3 16h18M5 11h14" {...s} />
          <Circle cx="7.5" cy="18.5" r="1.5" {...s} />
          <Circle cx="16.5" cy="18.5" r="1.5" {...s} />
        </>
      )
    case 'taska':
      return (
        <>
          <Path d="M5 8h14l-1 13H6z" {...s} />
          <Path d="M9 8V6a3 3 0 0 1 6 0v2" {...s} />
        </>
      )
    case 'klic':
      return (
        <>
          <Circle cx="8" cy="15" r="4" {...s} />
          <Path d="M11 12l9-9M17 6l2 2M15 8l2 2" {...s} />
        </>
      )
    case 'hvezda':
      return (
        <Path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" {...s} />
      )
    case 'lide':
      return (
        <>
          <Circle cx="9" cy="8" r="3.5" {...s} />
          <Path d="M2.5 20a6.5 6.5 0 0 1 13 0" {...s} />
          <Path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" {...s} />
        </>
      )
    case 'kod':
      return <Path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" {...s} />
    case 'sipka':
      return <Path d="M9 5l7 7-7 7" {...s} />
    case 'stit':
      return (
        <>
          <Path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" {...s} />
          <Path d="M9 12l2 2 4-4" {...s} />
        </>
      )
    case 'kriz':
      return <Path d="M12 3v18M7 8h10" {...s} />
    case 'ruka':
      return (
        <>
          <Path d="M3 14h4l4 3h4a2 2 0 0 0 0-4h-3" {...s} />
          <Path d="M7 14l3-3h5l5 4v4l-5 1-8-2" {...s} />
        </>
      )
    case 'kos':
      return (
        <>
          <Path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" {...s} />
          <Path d="M10 11v6M14 11v6" {...s} />
        </>
      )
    case 'trava':
      return (
        <>
          <Path d="M3 21h18" {...s} />
          <Path
            d="M6 21c0-5-2-8-3-10M9 21c0-6 1-10 3-13M15 21c0-6-1-10-3-13M18 21c0-5 2-8 3-10"
            {...s}
          />
        </>
      )
    case 'strom':
      return (
        <>
          <Path d="M12 3a6 6 0 0 0-6 6 5 5 0 0 0 2 9h8a5 5 0 0 0 2-9 6 6 0 0 0-6-6z" {...s} />
          <Path d="M12 12v9" {...s} />
        </>
      )
    case 'lavicka':
      return (
        <>
          <Path d="M3 10h18M3 14h18M5 14v6M19 14v6M6 10V6h12v4" {...s} />
        </>
      )
    case 'znacka':
      return (
        <>
          <Path d="M12 2l9 9-9 9-9-9z" {...s} />
          <Path d="M12 20v2M12 8v4M12 14.5v.5" {...s} />
        </>
      )
    case 'vlocka':
      return (
        <>
          <Path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" {...s} />
          <Path d="M9 4l3 2 3-2M9 20l3-2 3 2" {...s} />
        </>
      )
    case 'kanal':
      return (
        <>
          <Circle cx="12" cy="12" r="8.5" {...s} />
          <Path d="M7 9h10M6 12h12M7 15h10" {...s} />
        </>
      )
    case 'sprej':
      return (
        <>
          <Rect x="6" y="9" width="8" height="12" rx="2" {...s} />
          <Path d="M8 9V6h4v3M12 4h1M16 4v.01M18 6v.01M16 8v.01M19 9v.01" {...s} />
        </>
      )
    case 'tlapka':
      return (
        <>
          <Path d="M12 13c-3 0-6 3-6 5.5S8 21 12 21s6-.5 6-2.5S15 13 12 13z" {...s} />
          <Circle cx="5.5" cy="10" r="1.8" {...s} />
          <Circle cx="9.5" cy="5.5" r="1.8" {...s} />
          <Circle cx="14.5" cy="5.5" r="1.8" {...s} />
          <Circle cx="18.5" cy="10" r="1.8" {...s} />
        </>
      )
    case 'zarovka':
      return (
        <>
          <Path d="M9 18h6M10 21h4" {...s} />
          <Path
            d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"
            {...s}
          />
        </>
      )
    case 'dlazba':
      return (
        <>
          <Rect x="3" y="4" width="18" height="16" rx="2" {...s} />
          <Path d="M3 12h18M10 4v8M14 12v8" {...s} />
        </>
      )
    case 'pytel':
      return (
        <>
          <Path d="M8 7c-3 3-4 7-3 11 .5 2 2 3 7 3s6.5-1 7-3c1-4 0-8-3-11" {...s} />
          <Path d="M8 7h8M10 3l2 4 2-4" {...s} />
        </>
      )
    case 'plus':
      return <Path d="M12 5v14M5 12h14" {...s} />
    case 'video':
      return (
        <>
          <Rect x="3" y="6" width="13" height="12" rx="2" {...s} />
          <Path d="M16 10l5-3v10l-5-3" {...s} />
        </>
      )
  }
}
