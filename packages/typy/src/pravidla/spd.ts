/**
 * Generování řetězce Short Payment Descriptor (SPD) pro české QR platby.
 * Formát podle standardu České bankovní asociace (ČBA).
 */

export interface ParametryPlatby {
  iban: string
  castka: number
  mena?: string
  variabilniSymbol?: string
  zprava?: string
}

/**
 * Jednoduché ověření formátu českého IBAN (CZ + 2 kontrolní číslice + 20 číslic).
 */
export function jePlatnyIban(iban: string): boolean {
  const cisty = iban.replace(/\s+/g, '').toUpperCase()
  if (!/^CZ\d{22}$/.test(cisty)) {
    return false
  }

  // Mod-97 kontrola
  const preusporadane = cisty.slice(4) + '1235' + cisty.slice(2, 4)
  let zbytek = 0
  for (let i = 0; i < preusporadane.length; i++) {
    zbytek = (zbytek * 10 + Number(preusporadane[i])) % 97
  }
  return zbytek === 1
}

/**
 * Sestaví řetězec SPD, např. SPD*1.0*ACC:CZ...*AM:900.00*CC:CZK*X-VS:123456*
 * Pokud je IBAN neplatný, vrací null.
 */
export function sestavSpd(p: ParametryPlatby): string | null {
  const cistyIban = p.iban.replace(/\s+/g, '').toUpperCase()
  if (!jePlatnyIban(cistyIban)) {
    return null
  }

  const casti: string[] = ['SPD*1.0', `ACC:${cistyIban}`, `AM:${p.castka.toFixed(2)}`, `CC:${p.mena || 'CZK'}`]

  if (p.variabilniSymbol) {
    casti.push(`X-VS:${p.variabilniSymbol.trim()}`)
  }

  if (p.zprava) {
    // Nahrazení hvězdiček mezerou (hvězdička je oddělovač SPD)
    const bezpecnaZprava = p.zprava.replace(/\*/g, ' ').slice(0, 60)
    casti.push(`MSG:${bezpecnaZprava}`)
  }

  return casti.join('*') + '*'
}
