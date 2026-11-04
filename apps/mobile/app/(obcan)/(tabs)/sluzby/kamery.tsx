import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Karta, Tlacitko } from '@/ui'

interface Webkamera {
  id: string
  nazev: string
  lokalita: string
  ucel: string
  aktualizace: string
  snimekPopis: string
}

const KAMERY: Webkamera[] = [
  {
    id: 'kamera-naves',
    nazev: 'Webkamera – Náves a pohled na lípu',
    lokalita: 'Umístěno na štítu obecního úřadu (Náves 1)',
    ucel: 'Přehled počasí, sněhové pokrývky a stavu obecní zeleně.',
    aktualizace: 'Před 20 sekundami',
    snimekPopis: '[Snímek návsi: klidná obecní náves, lípa malolistá, kostel v pozadí, suchá vozovka, teplota +2,8 °C]',
  },
  {
    id: 'kamera-potok',
    nazev: 'Webkamera – Hladinoměr Mlýnský rybník',
    lokalita: 'Umístěno na bezpečnostním přepadu rybníka',
    ucel: 'Vizuální kontrola průtoku vody a čistoty česlí při vydatných deštích.',
    aktualizace: 'Před 45 sekundami',
    snimekPopis: '[Snímek toku: hladina 42 cm, česle čisté bez naplavenin, klidný tok]',
  },
  {
    id: 'kamera-javornik',
    nazev: 'Webkamera – Meteostanice Javorník',
    lokalita: 'Vyhlídka nad osadou Podjavoří (620 m n. m.)',
    ucel: 'Sledování inverze, mlhy a větru na šumavském předhůří.',
    aktualizace: 'Před 1 minutou',
    snimekPopis: '[Panoramatický snímek: polojasno, dohlednost 25 km směrem na Klatovy]',
  },
]

export default function KameryScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const [obnoveno, setObnoveno] = useState('14:40')

  const obnovitSnimky = () => {
    const d = new Date()
    setObnoveno(d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }

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

      <View style={styles.hlavicka}>
        <View style={{ flex: 1 }}>
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
            Veřejné webkamery obce
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Aktuální pohled na počasí, sněhové podmínky na návsi a stav vody na Mlýnském rybníku.
          </Text>
        </View>
        <Tlacitko
          nazev="Obnovit snímky"
          varianta="secondary"
          onPress={obnovitSnimky}
          style={styles.obnovitTlacitko}
        />
      </View>

      <Text style={[styles.casRazitko, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Snímky aktualizovány v: {obnoveno}
      </Text>

      <View style={styles.seznam}>
        {KAMERY.map((kamera) => (
          <Karta key={kamera.id} style={styles.kameraKarta}>
            <View style={styles.kameraHlavicka}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.kameraNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {kamera.nazev}
                </Text>
                <Text style={[styles.kameraLokalita, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {kamera.lokalita}
                </Text>
              </View>
              <View
                style={[
                  styles.ziveOdznak,
                  { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
                ]}
              >
                <Text style={[styles.ziveOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
                  ● Živě
                </Text>
              </View>
            </View>

            {/* Náhled snímku */}
            <View
              style={[
                styles.obrazRamec,
                { backgroundColor: barvy.surface, borderColor: barvy.line },
              ]}
              accessibilityLabel={kamera.snimekPopis}
            >
              <Text style={[styles.obrazText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {kamera.snimekPopis}
              </Text>
              <Text style={[styles.obrazCas, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Obnovení každých 30 sekund • {kamera.aktualizace}
              </Text>
            </View>

            <Text style={[styles.ucelText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Účel monitoringu: {kamera.ucel}
            </Text>
          </Karta>
        ))}
      </View>

      {/* Soulad s GDPR */}
      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Ochrana soukromí a GDPR
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Veřejné webkamery snímají výhradně celkový přehled prostranství a hladiny toku v rozlišení,
          které neumožňuje identifikaci obličejů ani registračních značek vozidel. Záběry se
          neukládají do archivních záznamů a slouží pro povodňovou ochranu a sledování sjízdnosti.
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
  hlavicka: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
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
  },
  obnovitTlacitko: {
    minHeight: 44,
  },
  casRazitko: {
    fontSize: 13,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  seznam: {
    gap: 16,
    marginBottom: 20,
  },
  kameraKarta: {
    padding: 14,
    gap: 10,
  },
  kameraHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  kameraNazev: {
    fontSize: 16,
    lineHeight: 22,
  },
  kameraLokalita: {
    fontSize: 12,
    marginTop: 2,
  },
  ziveOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  ziveOdznakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  obrazRamec: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  obrazText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  obrazCas: {
    fontSize: 11,
  },
  ucelText: {
    fontSize: 13,
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
