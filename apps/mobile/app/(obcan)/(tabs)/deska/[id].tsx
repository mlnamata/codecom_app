import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { Tlacitko, Karta } from '@/ui'
import type { DokumentDesky } from '@codekom/typy'

export default function DeskaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [dokument, setDokument] = useState<DokumentDesky | null>(null)
  const [nacitaSe, setNacitaSe] = useState(true)

  useEffect(() => {
    let aktivni = true
    async function nacti() {
      if (!id) return
      try {
        const slug = relace.obec || 'javori-lhota'
        const d = await zdroj.dokument(slug, id)
        if (aktivni) setDokument(d)
      } catch (err) {
        console.warn('Chyba při načítání detailu dokumentu:', err)
      } finally {
        if (aktivni) setNacitaSe(false)
      }
    }
    void nacti()
    return () => {
      aktivni = false
    }
  }, [zdroj, relace.obec, id])

  if (nacitaSe) {
    return (
      <View style={[styles.stred, { backgroundColor: barvy.bg }]}>
        <ActivityIndicator size="large" color={barvy.primary} accessibilityLabel="Načítání dokumentu" />
      </View>
    )
  }

  if (!dokument) {
    return (
      <View style={[styles.stred, { backgroundColor: barvy.bg }]}>
        <Text style={[styles.chybaText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Dokument nebyl nalezen.
        </Text>
        <Tlacitko nazev="Zpět na úřední desku" onPress={() => router.back()} />
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <Tlacitko
        nazev="← Zpět na seznam"
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
        {dokument.nazev}
      </Text>

      <Karta style={styles.kartaDetail}>
        <View style={styles.polozka}>
          <Text style={[styles.stitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Číslo jednací:
          </Text>
          <Text style={[styles.hodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {dokument.cisloJednaci}
          </Text>
        </View>

        <View style={styles.polozka}>
          <Text style={[styles.stitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Kategorie:
          </Text>
          <Text style={[styles.hodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {dokument.kategorie}
          </Text>
        </View>

        <View style={styles.polozka}>
          <Text style={[styles.stitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Vyvěšeno od:
          </Text>
          <Text style={[styles.hodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {dokument.vyvesenoOd}
          </Text>
        </View>

        <View style={styles.polozka}>
          <Text style={[styles.stitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Vyvěšeno do:
          </Text>
          <Text style={[styles.hodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {dokument.vyvesenoDo ?? 'Do odvolání'}
          </Text>
        </View>
      </Karta>

      {/* Příloha dokumentu */}
      <View
        style={[
          styles.prilohaBox,
          {
            backgroundColor: barvy.surface,
            borderColor: barvy.line,
          },
        ]}
      >
        <Text
          role="heading"
          aria-level={2}
          accessibilityRole="header"
          style={[
            styles.podnadpis,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Přílohy dokumentu
        </Text>
        <Text style={[styles.prilohaInfo, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Příloha je v ostré verzi dostupná k náhledu a stažení v PDF s elektronickým podpisem.
        </Text>
      </View>

      <Text style={[styles.zakonneUpozorneni, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Zveřejněno v souladu se zákonem č. 128/2000 Sb., o obcích. Dokument, který již byl na desce
        vyvěšen, nelze z aplikace odstranit.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 40,
  },
  stred: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chybaText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  zpetTlacitko: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  titulek: {
    fontSize: 22,
    marginBottom: 16,
    lineHeight: 28,
  },
  kartaDetail: {
    padding: 16,
    marginBottom: 16,
  },
  polozka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stitek: {
    fontSize: 14,
  },
  hodnota: {
    fontSize: 14,
    fontWeight: '500',
  },
  prilohaBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  podnadpis: {
    fontSize: 16,
    marginBottom: 6,
  },
  prilohaInfo: {
    fontSize: 13,
    lineHeight: 18,
  },
  zakonneUpozorneni: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
})
