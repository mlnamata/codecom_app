/**
 * První písmeno velké. Titulky krizí jsou v obsahu malým písmenem, protože
 * na webu navazují za označení úrovně; v aplikaci stojí samostatně.
 */
export function zacinaVelkym(text: string): string {
  return text.charAt(0).toLocaleUpperCase('cs-CZ') + text.slice(1)
}
