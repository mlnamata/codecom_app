import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UROVNE, type Uroven } from '@codekom/tokeny'
import {
  lzeSkryt,
  klicSkryti,
  bezpecnyOdkaz,
} from '@codekom/typy/pravidla'
import type { KrizoveHlaseni } from '@codekom/typy'
import { useTema } from '../tema'

export interface KrizovyBannerProps {
  hlavni: KrizoveHlaseni | null
  dalsich?: number
  onZobrazitDalsi?: () => void
}

export function KrizovyBanner({
  hlavni,
  dalsich = 0,
  onZobrazitDalsi,
}: KrizovyBannerProps) {
  const { pismo } = useTema()
  const [skryto, setSkryto] = useState(false)

  // Kontrola, zda již uživatel toto konkrétní hlášení (konkrétní revizi) neskryl
  useEffect(() => {
    let aktivni = true
    async function overitSkryti() {
      if (!hlavni || !lzeSkryt(hlavni)) {
        if (aktivni) setSkryto(false)
        return
      }

      try {
        if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
          const klic = klicSkryti(hlavni)
          const byloSkryto = await AsyncStorage.getItem(klic)
          if (aktivni) setSkryto(byloSkryto === '1')
        }
      } catch (err) {
        console.warn('Chyba při čtení skrytí banneru:', err)
      }
    }

    void overitSkryti()
    return () => {
      aktivni = false
    }
  }, [hlavni])

  if (!hlavni || skryto) {
    return null
  }

  const uroven = hlavni.uroven as Uroven
  const info = UROVNE[uroven] ?? UROVNE.info
  const odkaz = bezpecnyOdkaz(hlavni.odkazUrl)
  const muzeBytSkryt = lzeSkryt(hlavni)

  const handleSkryt = async () => {
    setSkryto(true)
    try {
      if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
        const klic = klicSkryti(hlavni)
        await AsyncStorage.setItem(klic, '1')
      }
    } catch (err) {
      console.warn('Chyba při ukládání skrytí banneru:', err)
    }
  }

  const handleOdkaz = () => {
    if (odkaz) {
      void Linking.openURL(odkaz)
    }
  }

  return (
    <View
      role="alert"
      accessibilityRole="alert"
      accessibilityLiveRegion={uroven === 'emergency' ? 'assertive' : 'polite'}
      style={[
        styles.banner,
        {
          backgroundColor: info.bg,
          borderColor: info.edge,
        },
      ]}
    >
      <View style={styles.hlavicka}>
        <View style={styles.urovenStitek}>
          <Text
            style={[
              styles.urovenText,
              {
                color: info.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            {info.nazev}
          </Text>
        </View>

        {muzeBytSkryt && (
          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Skrýt toto hlášení"
            onPress={() => void handleSkryt()}
            style={({ pressed }) => [
              styles.zavritTlacitko,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.zavritKrizek, { color: info.ink, fontFamily: pismo.rodina }]}>
              ✕
            </Text>
          </Pressable>
        )}
      </View>

      <Text
        style={[
          styles.titulek,
          {
            color: info.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        {hlavni.titulek}
      </Text>

      <Text
        style={[
          styles.text,
          {
            color: info.ink,
            fontFamily: pismo.rodina,
          },
        ]}
      >
        {hlavni.text}
      </Text>

      {odkaz && (
        <Pressable
          role="link"
          accessibilityRole="link"
          accessibilityLabel={hlavni.odkazText || 'Otevřít odkaz k hlášení'}
          onPress={handleOdkaz}
          style={styles.odkazKontejner}
        >
          <Text
            style={[
              styles.odkaz,
              {
                color: info.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.stredni,
              },
            ]}
          >
            {hlavni.odkazText || 'Více informací'} →
          </Text>
        </Pressable>
      )}

      {dalsich > 0 && onZobrazitDalsi && (
        <Pressable
          role="button"
          accessibilityRole="button"
          accessibilityLabel={`Zobrazit dalších ${dalsich} aktivních hlášení`}
          onPress={onZobrazitDalsi}
          style={styles.dalsiKontejner}
        >
          <Text
            style={[
              styles.dalsiText,
              {
                color: info.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.stredni,
              },
            ]}
          >
            Další aktivní hlášení: {dalsich}
          </Text>
        </Pressable>
      )}

      <Text
        style={[
          styles.izsUpozorneni,
          {
            color: info.ink,
            fontFamily: pismo.rodina,
          },
        ]}
      >
        Hlášení nenahrazuje varovný systém IZS.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
    width: '100%',
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  urovenStitek: {
    paddingVertical: 2,
  },
  urovenText: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  zavritTlacitko: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    marginRight: -8,
  },
  zavritKrizek: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  titulek: {
    fontSize: 17,
    marginBottom: 4,
    lineHeight: 22,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  odkazKontejner: {
    paddingVertical: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  odkaz: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  dalsiKontejner: {
    paddingVertical: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  dalsiText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  izsUpozorneni: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.85,
  },
})
