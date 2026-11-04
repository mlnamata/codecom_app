import React from 'react'

/**
 * Náhrada `react-native-svg` pro testy v jsdom. Knihovna se v Node nedá
 * načíst a ikony i logo jsou dekorativní, testy je proto nevykreslují.
 */
function Prazdny({ children }: { children?: React.ReactNode }) {
  return <>{children ?? null}</>
}

export default Prazdny
export const Svg = Prazdny
export const Path = Prazdny
export const Rect = Prazdny
export const Circle = Prazdny
export const Defs = Prazdny
export const LinearGradient = Prazdny
export const Stop = Prazdny
export const G = Prazdny
export const Line = Prazdny
