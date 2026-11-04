import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { Tlacitko, Karta, QrPlatba } from '@/ui'
import type { Poplatek } from '@codekom/typy'

export default function PoplatkyScreen() {
  const router = useRouter()
  const { barvy, krize, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [poplatky, setPoplatky] = useState<Poplatek[]>([])
  const [nacitaSe, setNacitaSe] = useState(true)
  const [chyba, setChyba] = useState<string | null>(null)

  useEffect(() => {
    let aktivni = true
    const nacti = async () => {
      try {
        const slug = relace.obec || 'javori-lhota'
        const sluzbyData = await zdroj.sluzby(slug)
        if (aktivni) {
          setPoplatky(sluzbyData.poplatky)
        }
      } catch (err) {
        if (aktivni) {
          console.warn('Chyba při načítání poplatků:', err)
          setChyba('Nepodařilo se načíst seznam poplatků.')
        }
      } finally {
        if (aktivni) {
          setNacitaSe(false)
        }
      }
    }
    void nacti()
    return () => {
      aktivni = false
    }
  }, [zdroj, relace.obec])

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
        Místní poplatky
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Sazby místních poplatků v obci Javoří Lhota, termíny splatnosti a platební údaje.
      </Text>

      {nacitaSe && (
        <Text style={[styles.stavText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Načítám poplatky…
        </Text>
      )}

      {chyba && (
        <Text style={[styles.stavText, { color: krize.warning.ink, fontFamily: pismo.rodina }]}>
          {chyba}
        </Text>
      )}

      {!nacitaSe && !chyba && (
        <View style={styles.seznam}>
          {poplatky.map((poplatek) => (
            <Karta key={poplatek.id} style={styles.kartaPoplatku}>
              <View style={styles.hlavickaKarty}>
                <Text
                  style={[
                    styles.poplatekNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {poplatek.nazev}
                </Text>
                <View
                  style={[
                    styles.cenaStitek,
                    {
                      backgroundColor: barvy.surface,
                      borderColor: barvy.line,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cenaText,
                      {
                        color: barvy.primary,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {poplatek.castka} Kč
                  </Text>
                </View>
              </View>

              <Text style={[styles.poplatekJednotka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                {poplatek.jednotka} • Splatnost {poplatek.splatnostText}
              </Text>

              <View style={styles.parametry}>
                <Text style={[styles.parametrRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Kdo platí: </Text>
                  {poplatek.kdoPlati}
                </Text>

                {poplatek.ulevy && (
                  <Text style={[styles.parametrRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                    <Text style={{ fontWeight: '600' }}>Úlevy: </Text>
                    {poplatek.ulevy}
                  </Text>
                )}

                <Text style={[styles.parametrRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Způsob úhrady: </Text>
                  {poplatek.uradCesta}
                </Text>
              </View>

              {/* QR platba a platební údaje */}
              <View style={styles.platbaSekce}>
                <QrPlatba
                  iban="[ČÍSLO ÚČTU]"
                  castka={poplatek.castka}
                  variabilniSymbol={`134${poplatek.poradiVs}001`}
                  zprava={`${poplatek.nazev} - Javoří Lhota`}
                  nazevPoplatku={poplatek.nazev}
                />
              </View>
            </Karta>
          ))}
        </View>
      )}

      {/* Fallback úřadu podle pravidla 6 */}
      <View
        style={[
          styles.uradFallback,
          {
            backgroundColor: barvy.surface,
            borderColor: barvy.line,
          },
        ]}
      >
        <Text
          style={[
            styles.uradNadpis,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Platba na pokladně úřadu
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Poplatky lze zaplatit i v hotovosti nebo platební kartou v pokladně obecního úřadu.{'\n\n'}
          Obecní úřad Javoří Lhota, Náves 1{'\n'}
          Úřední hodiny: Po, St 8:00–17:00, Út, Čt 8:00–12:00{'\n'}
          Telefon: +420 379 000 111 (účetní Jana Malá)
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
    marginBottom: 8,
  },
  podtitul: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  stavText: {
    fontSize: 15,
    marginVertical: 12,
  },
  seznam: {
    gap: 16,
    marginBottom: 24,
  },
  kartaPoplatku: {
    padding: 16,
    gap: 12,
  },
  hlavickaKarty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  poplatekNazev: {
    fontSize: 17,
    flex: 1,
    lineHeight: 22,
  },
  cenaStitek: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  cenaText: {
    fontSize: 15,
  },
  poplatekJednotka: {
    fontSize: 14,
  },
  parametry: {
    gap: 6,
    paddingVertical: 4,
  },
  parametrRadek: {
    fontSize: 14,
    lineHeight: 20,
  },
  platbaSekce: {
    marginTop: 8,
  },
  uradFallback: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
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
