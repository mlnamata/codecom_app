import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '../../src/tema'
import { useRelace } from '../../src/stav/relace'
import { Pole, Tlacitko } from '../../src/ui'
import type { RoleUradu } from '@codekom/typy'

export default function PrihlaseniScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace, nastavRoleUradu } = useRelace()

  const jeUrad = relace.role === 'urad'
  const vychoziEmail = jeUrad ? 'starosta@javorilhota.cz' : 'obcan@javorilhota.cz'

  const [email, setEmail] = useState(vychoziEmail)
  const [vybranaRoleUradu, setVybranaRoleUradu] = useState<RoleUradu>(relace.roleUradu || 'spravce')
  const [chybaEmailu, setChybaEmailu] = useState('')

  const handlePoslatKod = async () => {
    if (!email.trim() || !email.includes('@')) {
      setChybaEmailu('Zadejte platný e-mail.')
      return
    }
    setChybaEmailu('')

    if (jeUrad) {
      await nastavRoleUradu(vybranaRoleUradu)
    }

    router.push({
      pathname: '/(uvod)/kod',
      params: { email },
    })
  }

  const handleBezUctu = () => {
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
          {jeUrad ? 'Přihlášení do úřadu' : 'Přihlášení občana'}
        </Text>

        <Text style={[styles.upozorneni, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Ukázkové přihlášení, žádný e-mail se neposílá.
        </Text>

        {jeUrad && (
          <View style={styles.sekceRoleUradu}>
            <Text
              style={[
                styles.podnadpis,
                {
                  color: barvy.ink,
                  fontFamily: pismo.rodina,
                  fontWeight: pismo.vahy.polotucne,
                },
              ]}
            >
              Role v ukázce úřadu:
            </Text>

            <View style={styles.prepinarRoli} role="radiogroup" accessibilityLabel="Role v ukázce">
              <Pressable
                role="radio"
                accessibilityRole="radio"
                accessibilityLabel="Správce (plná práva, může vydávat krizová hlášení)"
                accessibilityState={{ checked: vybranaRoleUradu === 'spravce' }}
                onPress={() => setVybranaRoleUradu('spravce')}
                style={({ pressed }) => [
                  styles.volbaRadio,
                  {
                    backgroundColor: barvy.surface,
                    borderColor: vybranaRoleUradu === 'spravce' ? barvy.primary : barvy.line,
                    borderWidth: vybranaRoleUradu === 'spravce' ? 2 : 1,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.radioNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  Správce obce
                </Text>
                <Text style={[styles.radioPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Může vydávat a ukončovat krizová hlášení, hlášení rozhlasu a vyřizovat závady.
                </Text>
              </Pressable>

              <Pressable
                role="radio"
                accessibilityRole="radio"
                accessibilityLabel="Redaktor (omezená práva, krize ukládá jen jako koncept)"
                accessibilityState={{ checked: vybranaRoleUradu === 'redaktor' }}
                onPress={() => setVybranaRoleUradu('redaktor')}
                style={({ pressed }) => [
                  styles.volbaRadio,
                  {
                    backgroundColor: barvy.surface,
                    borderColor: vybranaRoleUradu === 'redaktor' ? barvy.primary : barvy.line,
                    borderWidth: vybranaRoleUradu === 'redaktor' ? 2 : 1,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.radioNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  Redaktor
                </Text>
                <Text style={[styles.radioPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Může vyřizovat závady, ale krizová hlášení může ukládat pouze jako koncept.
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <Pole
          popisek="E-mailová adresa"
          napoveda="Zadejte ukázkový e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          chyba={chybaEmailu}
        />

        <View style={styles.tlacitka}>
          <Tlacitko nazev="Poslat kód" onPress={() => void handlePoslatKod()} />

          {!jeUrad && (
            <Tlacitko
              nazev="Pokračovat bez účtu"
              varianta="outline"
              onPress={handleBezUctu}
              popisekProCtecku="Pokračovat do aplikace bez přihlášení"
            />
          )}

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
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 8,
    textAlign: 'center',
  },
  upozorneni: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  sekceRoleUradu: {
    marginBottom: 16,
  },
  podnadpis: {
    fontSize: 15,
    marginBottom: 8,
  },
  prepinarRoli: {
    gap: 8,
  },
  volbaRadio: {
    padding: 12,
    borderRadius: 14,
  },
  radioNazev: {
    fontSize: 15,
    marginBottom: 4,
  },
  radioPopis: {
    fontSize: 13,
    lineHeight: 17,
  },
  tlacitka: {
    marginTop: 16,
  },
})
