import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Karta, Tlacitko, Pole } from '@/ui'

interface Osobnost {
  id: string
  jmeno: string
  roky: string
  popis: string
  hrobCislo: string
  svicky: number
}

interface Hrob {
  cisloHrobu: string
  sektor: string
  najemce: string
  platnostNajmuDo: string
  stav: 'v_poradku' | 'konci_platnost'
}

const OSOBNOSTI: Osobnost[] = [
  {
    id: 'osobnost-1',
    jmeno: 'Josef Šťastný',
    roky: '1872–1945',
    popis: 'Zakladatel Sboru dobrovolných hasičů v Javoří Lhotě (1898), starosta obce a budovatel obecní školy.',
    hrobCislo: 'Sektor A, hrob č. 12',
    svicky: 48,
  },
  {
    id: 'osobnost-2',
    jmeno: 'František Kříž',
    roky: '1890–1968',
    popis: 'Dlouholetý řídící učitel obecné školy, kronikář obce a sběratel šumavských pověstí.',
    hrobCislo: 'Sektor B, hrob č. 34',
    svicky: 31,
  },
  {
    id: 'osobnost-3',
    jmeno: 'MUDr. Anna Veselá',
    roky: '1905–1984',
    popis: 'Obvodní lékařka, která obětavě pečovala o obyvatele Javoří Lhoty a okolních osad po více než 40 let.',
    hrobCislo: 'Sektor A, hrob č. 5',
    svicky: 62,
  },
]

const VZOROVE_HROBY: Hrob[] = [
  {
    cisloHrobu: 'A-12',
    sektor: 'Sektor A (u kostela)',
    najemce: 'Rodina Šťastných',
    platnostNajmuDo: '2034-12-31',
    stav: 'v_poradku',
  },
  {
    cisloHrobu: 'B-08',
    sektor: 'Sektor B (střední část)',
    najemce: 'Karel Novák',
    platnostNajmuDo: '2026-12-31',
    stav: 'konci_platnost',
  },
]

export default function HrbitovScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()

  const [osobnosti, setOsobnosti] = useState<Osobnost[]>(OSOBNOSTI)
  const [hledanyHrob, setHledanyHrob] = useState('')
  const [zapaleneMoje, setZapaleneMoje] = useState<string[]>([])

  const zapalitSvicku = (id: string) => {
    if (zapaleneMoje.includes(id)) return
    setZapaleneMoje([...zapaleneMoje, id])
    setOsobnosti(
      osobnosti.map((o) => (o.id === id ? { ...o, svicky: o.svicky + 1 } : o)),
    )
  }

  const filtrovaneHroby = VZOROVE_HROBY.filter(
    (h) =>
      h.cisloHrobu.toLowerCase().includes(hledanyHrob.toLowerCase()) ||
      h.najemce.toLowerCase().includes(hledanyHrob.toLowerCase()),
  )

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <Tlacitko
        nazev="← Zpět na služby"
        varianta="ghost"
        onPress={() => router.back()}
        style={styles.zpetTlacitko}
      />

      <Text
        role="heading"
        aria-level={1}
        accessibilityRole="header"
        style={[
          styles.titulek,
          {
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        Hřbitov 2.0 a digitální pasport
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Evidence hrobových míst, kontrola platnosti nájemních smluv a uctění památky osobností obce.
      </Text>

      {/* Virtuální svíčky a osobnosti */}
      <Text
        style={[
          styles.sekceNadpis,
          {
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        Významné osobnosti obce (Virtuální svíčka)
      </Text>

      <View style={styles.seznam}>
        {osobnosti.map((osobnost) => {
          const uzZapalil = zapaleneMoje.includes(osobnost.id)
          return (
            <Karta key={osobnost.id} style={styles.osobnostKarta}>
              <View style={styles.osobnostHlavicka}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.osobnostJmeno,
                      {
                        color: barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {osobnost.jmeno} ({osobnost.roky})
                  </Text>
                  <Text style={[styles.hrobMisto, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    {osobnost.hrobCislo}
                  </Text>
                </View>
                <View
                  style={[
                    styles.svickyPocitadlo,
                    {
                      backgroundColor: barvy.surface,
                      borderColor: barvy.line,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.svickyPocet,
                      {
                        color: barvy.primary,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {osobnost.svicky} svíček
                  </Text>
                </View>
              </View>

              <Text style={[styles.osobnostPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {osobnost.popis}
              </Text>

              <Tlacitko
                nazev={uzZapalil ? '✓ Svíčka hoří' : 'Zapálit virtuální svíčku'}
                varianta={uzZapalil ? 'secondary' : 'primary'}
                zakazano={uzZapalil}
                onPress={() => zapalitSvicku(osobnost.id)}
                style={styles.svickaTlacitko}
              />
            </Karta>
          )
        })}
      </View>

      {/* Kontrola nájemních smluv */}
      <Text
        style={[
          styles.sekceNadpis,
          {
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        Vyhledávání hrobového místa a stav nájmu
      </Text>

      <Pole
        popisek="Hledat podle čísla hrobu nebo jména nájemce"
        value={hledanyHrob}
        onChangeText={setHledanyHrob}
        placeholder="Např. A-12 nebo Novák"
      />

      <View style={styles.seznam}>
        {filtrovaneHroby.map((hrob) => {
          const varovani = hrob.stav === 'konci_platnost'
          return (
            <Karta key={hrob.cisloHrobu} style={styles.hrobKarta}>
              <View style={styles.hrobRadek}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cisloHrobu,
                      {
                        color: barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    Hrobové místo {hrob.cisloHrobu}
                  </Text>
                  <Text style={[styles.hrobSektor, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    {hrob.sektor} • Nájemce: {hrob.najemce}
                  </Text>
                </View>
                <View
                  style={[
                    styles.stavOdznak,
                    {
                      backgroundColor: varovani ? '#FEF6D8' : '#DCFCE7',
                      borderColor: varovani ? '#CA8504' : '#22C55E',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stavOdznakText,
                      { color: varovani ? '#2A1B00' : '#166534', fontFamily: pismo.rodina },
                    ]}
                  >
                    {varovani ? 'Končí smlouva' : 'Platná smlouva'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.platnostText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                Smlouva o nájmu platná do: <Text style={{ fontWeight: '600' }}>{hrob.platnostNajmuDo}</Text>
              </Text>

              {varovani && (
                <View
                  style={[
                    styles.varovaniBox,
                    { backgroundColor: '#FEF6D8', borderColor: '#CA8504' },
                  ]}
                >
                  <Text style={[styles.varovaniText, { color: '#2A1B00', fontFamily: pismo.rodina }]}>
                    Upozornění: Nájemní smlouva na toto hrobové místo končí letos. Prodloužení na
                    dalších 10 let můžete vyřídit na obecním úřadě (poplatek 100 Kč/rok).
                  </Text>
                </View>
              )}
            </Karta>
          )
        })}
      </View>

      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Správa obecního hřbitova
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Obecní hřbitov se nachází u kostela sv. Václava. Prodloužení nájemních smluv, uložení uren
          a souhlasy s kamenickými pracemi vyřizuje matrika obecního úřadu.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 40,
  },
  zpetTlacitko: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    minHeight: 44,
  },
  titulek: {
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sekceNadpis: {
    fontSize: 17,
    marginTop: 8,
    marginBottom: 12,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  osobnostKarta: {
    padding: 14,
    gap: 10,
  },
  osobnostHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  osobnostJmeno: {
    fontSize: 16,
    lineHeight: 22,
  },
  hrobMisto: {
    fontSize: 12,
    marginTop: 2,
  },
  svickyPocitadlo: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  svickyPocet: {
    fontSize: 12,
  },
  osobnostPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  svickaTlacitko: {
    minHeight: 44,
  },
  hrobKarta: {
    padding: 14,
    gap: 8,
  },
  hrobRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cisloHrobu: {
    fontSize: 16,
  },
  hrobSektor: {
    fontSize: 12,
    marginTop: 2,
  },
  stavOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  stavOdznakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  platnostText: {
    fontSize: 14,
  },
  varovaniBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  varovaniText: {
    fontSize: 13,
    lineHeight: 18,
  },
  uradFallback: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  uradNadpis: {
    fontSize: 15,
  },
  uradText: {
    fontSize: 14,
    lineHeight: 22,
  },
})
