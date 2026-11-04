import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko, Pole } from '@/ui'

export default function EnergetikaScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [modalRegistrace, setModalRegistrace] = useState(false)
  const [ean, setEan] = useState('')
  const [jmeno, setJmeno] = useState('')
  const [potvrzeno, setPotvrzeno] = useState<string | null>(null)

  const registrovatDoKomunity = () => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    setPotvrzeno(
      'Děkujeme za registraci! Vaše odběrné místo (EAN: ' +
        (ean || '859182400012345678') +
        ') bylo zařazeno do energetické komunity obce Javoří Lhota přes Elektroenergetické datové centrum (EDC). Přebytečná zelená elektřina ze školy vám bude započítávána se slevou.',
    )
    setModalRegistrace(false)
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
            Komunitní energetika obce
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Živý monitoring obecních solárních elektráren a sdílení levné elektřiny s občany přes EDC.
          </Text>
        </View>
        <Tlacitko
          nazev="Odebírat přebytky"
          onPress={() => setModalRegistrace(true)}
          style={styles.akceTlacitko}
        />
      </View>

      {potvrzeno && (
        <Karta style={styles.potvrzeniBox}>
          <Text
            style={[
              styles.potvrzeniNadpis,
              { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Registrace do energetické komunity
          </Text>
          <Text style={[styles.potvrzeniText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {potvrzeno}
          </Text>
          <Tlacitko
            nazev="Zavřít"
            varianta="ghost"
            onPress={() => setPotvrzeno(null)}
            style={{ marginTop: 6 }}
          />
        </Karta>
      )}

      {/* Hlavní bilance */}
      <Karta style={styles.bilanceKarta}>
        <Text style={[styles.bilanceNadpis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Celkový okamžitý výkon obecních FVE
        </Text>
        <View style={styles.vykonRadek}>
          <Text
            style={[
              styles.vykonCislo,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            29,6 kW
          </Text>
          <View
            style={[
              styles.stavOdznak,
              { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
            ]}
          >
            <Text style={[styles.stavOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
              Slunečno • 68 % zelené energie
            </Text>
          </View>
        </View>

        <View style={styles.tokyMrizka}>
          <View style={styles.tokPolozka}>
            <Text style={[styles.tokPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Vlastní spotřeba budov
            </Text>
            <Text
              style={[
                styles.tokHodnota,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              14,1 kW
            </Text>
          </View>
          <View style={styles.tokPolozka}>
            <Text style={[styles.tokPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Přetok do komunity (občanům)
            </Text>
            <Text
              style={[
                styles.tokHodnota,
                { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              15,5 kW
            </Text>
          </View>
        </View>
      </Karta>

      {/* Jednotlivé výrobní zdroje */}
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
        Obecní solární elektrárny v provozu
      </Text>

      <View style={styles.seznam}>
        <Karta style={styles.fveKarta}>
          <View style={styles.fveHlavicka}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.fveNazev,
                  { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                FVE Základní a mateřská škola
              </Text>
              <Text style={[styles.fvePodtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Instalovaný výkon: 28 kWp • Bateriové úložiště: 44 kWh (stav 92 %)
              </Text>
            </View>
            <Text
              style={[
                styles.fveVyroba,
                { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              18,4 kW
            </Text>
          </View>
          <Text style={[styles.fveDetaily, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Školní jídelna a tepelné čerpadlo běží plně ze slunce. Přebytek 8,2 kW putuje do
            sdílené sítě obce.
          </Text>
        </Karta>

        <Karta style={styles.fveKarta}>
          <View style={styles.fveHlavicka}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.fveNazev,
                  { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                FVE Budova obecního úřadu a hasičárna
              </Text>
              <Text style={[styles.fvePodtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Instalovaný výkon: 15 kWp • Bateriové úložiště: 20 kWh (stav 88 %)
              </Text>
            </View>
            <Text
              style={[
                styles.fveVyroba,
                { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              11,2 kW
            </Text>
          </View>
          <Text style={[styles.fveDetaily, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Pokrývá provoz serverovny, IoT brány a zbrojnice. Přebytek 7,3 kW sdílen registrovaným
            domácnostem.
          </Text>
        </Karta>
      </View>

      {/* Modální okno registrace */}
      <Modal
        visible={modalRegistrace}
        transparent
        animationType="fade"
        onRequestClose={() => setModalRegistrace(false)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Odběr sdílené elektřiny
            </Text>
            <Text style={[styles.modalPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Zadejte 18místný EAN kód vašeho elektroměru (najdete na faktuře za elektřinu). Obec vás
              bezplatně zaregistruje do skupiny sdílení u EDC.
            </Text>

            <Pole
              popisek="Jméno odběratele"
              value={jmeno}
              onChangeText={setJmeno}
              placeholder="Jan Novák"
            />
            <Pole
              popisek="EAN kód elektroměru (18 číslic)"
              value={ean}
              onChangeText={setEan}
              keyboardType="numeric"
              placeholder="8591824..."
            />

            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Zaregistrovat k odběru" onPress={registrovatDoKomunity} />
              <Tlacitko nazev="Zpět" varianta="ghost" onPress={() => setModalRegistrace(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Jak funguje komunitní sdílení?
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Při výrobě obecních elektráren se přebytky v 15minutových intervalech odečítají z vaší
          spotřeby. Fyzicky proud teče distribuční sítí, administrativní vyúčtování zajišťuje EDC ve
          spolupráci s vaším dodavatelem.
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
    marginBottom: 16,
  },
  titulek: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
  },
  akceTlacitko: {
    minHeight: 44,
  },
  potvrzeniBox: {
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  potvrzeniNadpis: {
    fontSize: 15,
    marginBottom: 2,
  },
  potvrzeniText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bilanceKarta: {
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  bilanceNadpis: {
    fontSize: 13,
  },
  vykonRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vykonCislo: {
    fontSize: 28,
  },
  stavOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stavOdznakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tokyMrizka: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  tokPolozka: {
    flex: 1,
    gap: 2,
  },
  tokPopis: {
    fontSize: 12,
  },
  tokHodnota: {
    fontSize: 18,
  },
  sekceNadpis: {
    fontSize: 17,
    marginBottom: 12,
  },
  seznam: {
    gap: 12,
    marginBottom: 20,
  },
  fveKarta: {
    padding: 14,
    gap: 8,
  },
  fveHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  fveNazev: {
    fontSize: 16,
    lineHeight: 22,
  },
  fvePodtitul: {
    fontSize: 12,
    marginTop: 2,
  },
  fveVyroba: {
    fontSize: 18,
  },
  fveDetaily: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalZatemneni: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalObsah: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  modalNadpis: {
    fontSize: 18,
    marginBottom: 4,
  },
  modalPopis: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalTlacitka: {
    gap: 8,
    marginTop: 8,
  },
  uradFallback: {
    padding: 16,
    borderRadius: 8,
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
