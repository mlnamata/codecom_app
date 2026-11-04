import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '../../src/tema'
import { useRelace } from '../../src/stav/relace'
import { Pole, Tlacitko } from '../../src/ui'

export default function KodScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace, prihlasit } = useRelace()

  const [kod, setKod] = useState('123456')
  const [chyba, setChyba] = useState('')

  const handlePotvrdit = async () => {
    if (kod.trim().length !== 6) {
      setChyba('Zadejte 6-místný kód.')
      return
    }
    setChyba('')
    await prihlasit()

    if (relace.role === 'urad') {
      router.replace('/(urad)/(tabs)/prehled')
    } else {
      router.replace('/(obcan)/(tabs)/prehled')
    }
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
          Ověření kódu
        </Text>

        <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Ukázkové přihlášení, žádný e-mail se neposílá.
        </Text>

        <View
          style={[
            styles.ramecekKodu,
            {
              backgroundColor: barvy.surface,
              borderColor: barvy.line,
            },
          ]}
        >
          <Text style={[styles.stitekKodu, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Váš ukázkový kód:
          </Text>
          <Text
            style={[
              styles.velkyKod,
              {
                color: barvy.primary,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            123 456
          </Text>
        </View>

        <Pole
          popisek="Šestimístný kód"
          value={kod}
          onChangeText={setKod}
          keyboardType="number-pad"
          maxLength={6}
          chyba={chyba}
        />

        <View style={styles.tlacitka}>
          <Tlacitko nazev="Potvrdit a vstoupit" onPress={() => void handlePotvrdit()} />
          <Tlacitko nazev="Zpět" varianta="ghost" onPress={() => router.back()} />
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
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  podtitul: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  ramecekKodu: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  stitekKodu: {
    fontSize: 13,
    marginBottom: 4,
  },
  velkyKod: {
    fontSize: 28,
    letterSpacing: 4,
  },
  tlacitka: {
    marginTop: 16,
  },
})
