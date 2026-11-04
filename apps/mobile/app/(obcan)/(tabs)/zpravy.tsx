import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { Karta } from '@/ui'
import type { Aktualita, Akce } from '@codekom/typy'
import { formatDay } from '@codekom/typy/pravidla'

export default function ZpravyScreen() {
  const { barvy, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [zalozka, setZalozka] = useState<'aktuality' | 'akce'>('aktuality')
  const [aktualityList, setAktualityList] = useState<Aktualita[]>([])
  const [akceList, setAkceList] = useState<Akce[]>([])
  const [nacitaSe, setNacitaSe] = useState(true)

  useEffect(() => {
    let aktivni = true
    async function nacti() {
      try {
        const slug = relace.obec || 'javori-lhota'
        const [akt, akc] = await Promise.all([zdroj.aktuality(slug), zdroj.akce(slug)])
        if (aktivni) {
          setAktualityList(akt)
          setAkceList(akc)
        }
      } catch (err) {
        console.warn('Chyba při načítání zpráv:', err)
      } finally {
        if (aktivni) setNacitaSe(false)
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
        Zprávy a události
      </Text>

      {/* Přepínač Aktuality / Akce */}
      <View
        style={[styles.prepinar, { backgroundColor: barvy.surface, borderColor: barvy.line }]}
        role="tablist"
      >
        <Pressable
          role="tab"
          accessibilityRole="tab"
          accessibilityLabel="Aktuality z obce"
          accessibilityState={{ selected: zalozka === 'aktuality' }}
          onPress={() => setZalozka('aktuality')}
          style={[
            styles.prepinarTlacitko,
            zalozka === 'aktuality' && { backgroundColor: barvy.primary },
          ]}
        >
          <Text
            style={[
              styles.prepinarText,
              {
                color: zalozka === 'aktuality' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Aktuality
          </Text>
        </Pressable>

        <Pressable
          role="tab"
          accessibilityRole="tab"
          accessibilityLabel="Kalendář akcí v obci"
          accessibilityState={{ selected: zalozka === 'akce' }}
          onPress={() => setZalozka('akce')}
          style={[
            styles.prepinarTlacitko,
            zalozka === 'akce' && { backgroundColor: barvy.primary },
          ]}
        >
          <Text
            style={[
              styles.prepinarText,
              {
                color: zalozka === 'akce' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Plánované akce
          </Text>
        </Pressable>
      </View>

      {nacitaSe ? (
        <ActivityIndicator
          size="large"
          color={barvy.primary}
          style={styles.nacitac}
          accessibilityLabel="Načítání zpráv"
        />
      ) : zalozka === 'aktuality' ? (
        <View style={styles.seznam}>
          {aktualityList.map((akt) => (
            <Karta key={akt.id} popisekProCtecku={`Aktualita: ${akt.titulek}`}>
              <Text
                style={[
                  styles.polozkaTitulek,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                {akt.titulek}
              </Text>
              <Text style={[styles.polozkaPerex, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {akt.perex}
              </Text>
              <Text style={[styles.polozkaDatum, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                {new Date(akt.publikovano).toLocaleDateString('cs-CZ')}
              </Text>
            </Karta>
          ))}
        </View>
      ) : (
        <View style={styles.seznam}>
          {akceList.map((akce) => (
            <Karta key={akce.id} popisekProCtecku={`Akce: ${akce.nazev}, datum: ${formatDay(akce.den)}`}>
              <Text
                style={[
                  styles.polozkaTitulek,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                {akce.nazev}
              </Text>
              <Text style={[styles.akceMisto, { color: barvy.primary, fontFamily: pismo.rodina }]}>
                {akce.misto} · {akce.od ?? ''} {akce.do ? `– ${akce.do}` : ''}
              </Text>
              {akce.popis && (
                <Text style={[styles.polozkaPerex, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  {akce.popis}
                </Text>
              )}
              <Text style={[styles.polozkaDatum, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Den konání: {formatDay(akce.den)}
              </Text>
            </Karta>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 40,
  },
  titulek: {
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 16,
  },
  prepinar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 2,
    marginBottom: 16,
  },
  prepinarTlacitko: {
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  prepinarText: {
    fontSize: 14,
  },
  nacitac: {
    marginVertical: 40,
  },
  seznam: {},
  polozkaTitulek: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 21,
  },
  akceMisto: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  polozkaPerex: {
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 6,
  },
  polozkaDatum: {
    fontSize: 12,
  },
})
