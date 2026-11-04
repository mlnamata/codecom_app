import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '../../src/tema'
import { useRelace } from '../../src/stav/relace'
import { useZdroj } from '../../src/zdroj'
import { Karta, Tlacitko } from '../../src/ui'
import type { ObecVerejna } from '@codekom/typy'

export default function ObecScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace, nastavObec } = useRelace()
  const { zdroj } = useZdroj()

  const [obce, setObce] = useState<ObecVerejna[]>([])
  const [nacitaSe, setNacitaSe] = useState(true)
  const [vybrana, setVybrana] = useState<string>('javori-lhota')

  useEffect(() => {
    let aktivni = true
    async function nactiObce() {
      try {
        const seznam = await zdroj.obce()
        if (aktivni) {
          setObce(seznam)
          if (seznam[0]) setVybrana(seznam[0].slug)
        }
      } catch (err) {
        console.warn('Nepodařilo se načíst seznam obcí:', err)
      } finally {
        if (aktivni) setNacitaSe(false)
      }
    }
    void nactiObce()
    return () => {
      aktivni = false
    }
  }, [zdroj])

  const potvrditVyber = async () => {
    await nastavObec(vybrana)
    router.push('/(uvod)/prihlaseni')
  }

  const pokracovatBezUctu = async () => {
    await nastavObec(vybrana)
    router.push('/(obcan)/(tabs)/prehled')
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.obsah}>
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
          Zvolte obec
        </Text>
        <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Pro tuto ukázku je připravena vzorová obec Javoří Lhota.
        </Text>

        {nacitaSe ? (
          <ActivityIndicator
            size="large"
            color={barvy.primary}
            style={styles.nacitac}
            accessibilityLabel="Načítání obcí"
          />
        ) : (
          <View style={styles.seznam}>
            {obce.map((obec) => (
              <Karta
                key={obec.slug}
                vybrano={vybrana === obec.slug}
                onPress={() => setVybrana(obec.slug)}
                popisekProCtecku={`Vybrat obec ${obec.nazev}, okres ${obec.okres}`}
                style={styles.kartaObce}
              >
                <Text
                  style={[
                    styles.nazevObce,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {obec.nazev}
                </Text>
                <Text style={[styles.okresObce, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Okres {obec.okres}
                </Text>
                {obec.castiObce.length > 0 && (
                  <Text style={[styles.castiObce, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Části: {obec.castiObce.map((c) => c.nazev).join(', ')}
                  </Text>
                )}
              </Karta>
            ))}
          </View>
        )}

        <View style={styles.tlacitka}>
          <Tlacitko
            nazev="Pokračovat k přihlášení"
            onPress={() => void potvrditVyber()}
            zakazano={nacitaSe || !vybrana}
          />

          {relace.role === 'obcan' && (
            <Tlacitko
              nazev="Pokračovat bez účtu"
              varianta="outline"
              onPress={() => void pokracovatBezUctu()}
              popisekProCtecku="Pokračovat do aplikace bez přihlášení"
            />
          )}

          <Tlacitko
            nazev="Zpět na výběr role"
            varianta="ghost"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  obsah: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  titulek: {
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 8,
    textAlign: 'center',
  },
  podtitul: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  nacitac: {
    marginVertical: 32,
  },
  seznam: {
    marginVertical: 12,
  },
  kartaObce: {
    padding: 16,
    marginVertical: 6,
  },
  nazevObce: {
    fontSize: 18,
    marginBottom: 4,
  },
  okresObce: {
    fontSize: 14,
    marginBottom: 2,
  },
  castiObce: {
    fontSize: 12,
  },
  tlacitka: {
    marginTop: 20,
  },
})
