import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Karta, Tlacitko } from '@/ui'

export default function SenzoryScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const [obnovenoCas, setObnovenoCas] = useState('14:32')

  const obnovitData = () => {
    const d = new Date()
    setObnovenoCas(d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }))
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
            Chytrá obec a živá data
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Senzory LoRaWAN v obci, hladinoměr, údržba silnic, parkování a odjezdy spojů.
          </Text>
        </View>
        <Tlacitko
          nazev="Obnovit"
          varianta="secondary"
          onPress={obnovitData}
          style={styles.obnovitTlacitko}
        />
      </View>

      <Text style={[styles.casRazitko, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Poslední odečet čidel: dnes v {obnovenoCas} (přenos přes NB-IoT / LoRaWAN)
      </Text>

      {/* 1. Enviromentální senzory */}
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
        Enviromentální senzory a toky
      </Text>

      <View style={styles.mrizka}>
        {/* Hladina potoka */}
        <Karta style={styles.kartaSenzoru}>
          <Text style={[styles.senzorStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Hladina Mlýnského potoka
          </Text>
          <View style={styles.hodnotaRadek}>
            <Text
              style={[
                styles.hodnotaCislo,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              42 cm
            </Text>
            <View
              style={[
                styles.stavOdznak,
                { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
              ]}
            >
              <Text style={[styles.stavOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
                Normál
              </Text>
            </View>
          </View>
          <Text style={[styles.senzorPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            1. stupeň povodňové aktivity: od 80 cm. Hladina klesá (-2 cm/3h).
          </Text>
        </Karta>

        {/* Kvalita ovzduší */}
        <Karta style={styles.kartaSenzoru}>
          <Text style={[styles.senzorStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Kvalita ovzduší (čidlo Náves)
          </Text>
          <View style={styles.hodnotaRadek}>
            <Text
              style={[
                styles.hodnotaCislo,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              AQI 24
            </Text>
            <View
              style={[
                styles.stavOdznak,
                { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
              ]}
            >
              <Text style={[styles.stavOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
                Velmi dobrá
              </Text>
            </View>
          </View>
          <Text style={[styles.senzorPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            PM2.5: 8 µg/m³ • PM10: 14 µg/m³ • NO₂ v normě.
          </Text>
        </Karta>

        {/* Teplota vozovky */}
        <Karta style={styles.kartaSenzoru}>
          <Text style={[styles.senzorStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Teplota vozovky (stoupání Javorník)
          </Text>
          <View style={styles.hodnotaRadek}>
            <Text
              style={[
                styles.hodnotaCislo,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              +1,2 °C
            </Text>
            <View
              style={[
                styles.stavOdznak,
                { backgroundColor: '#FEF6D8', borderColor: '#CA8504' },
              ]}
            >
              <Text style={[styles.stavOdznakText, { color: '#2A1B00', fontFamily: pismo.rodina }]}>
                Bez námrazy
              </Text>
            </View>
          </View>
          <Text style={[styles.senzorPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Vzduch: +2,8 °C • Stav povrchu: vlhko, bez rizika ledu.
          </Text>
        </Karta>

        {/* Vlhkost půdy */}
        <Karta style={styles.kartaSenzoru}>
          <Text style={[styles.senzorStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Vlhkost půdy (obecní sad)
          </Text>
          <View style={styles.hodnotaRadek}>
            <Text
              style={[
                styles.hodnotaCislo,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              38 %
            </Text>
            <View
              style={[
                styles.stavOdznak,
                { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
              ]}
            >
              <Text style={[styles.stavOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
                Optimální
              </Text>
            </View>
          </View>
          <Text style={[styles.senzorPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Hloubka 20 cm. Závlaha není vyžadována.
          </Text>
        </Karta>
      </View>

      {/* 2. Sledování techniky a údržby silnic */}
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
        Zimní údržba a obecní technika (GPS trasy)
      </Text>

      <Karta style={styles.kartaVozu}>
        <View style={styles.vuzHlavicka}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.vuzNazev,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Traktor Zetor 7245 (radlice a sypač)
            </Text>
            <Text style={[styles.vuzPodtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Řidič: p. Václav Beran • Režim: Prohrnování a posyp solí
            </Text>
          </View>
          <View
            style={[
              styles.stavOdznak,
              { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
            ]}
          >
            <Text style={[styles.stavOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
              V terénu
            </Text>
          </View>
        </View>

        <Text style={[styles.prohrnuteUliceNadpis, { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}>
          Stav prohrnutí ulic dnes:
        </Text>
        <View style={styles.uliceSeznam}>
          <Text style={[styles.uliceRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            ✓ Náves a hlavní tah (II/187) – protaženo v 06:15
          </Text>
          <Text style={[styles.uliceRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            ✓ Cesta k lesu a mateřské škole – protaženo v 07:10
          </Text>
          <Text style={[styles.uliceRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            ✓ Osada Podjavoří – protaženo v 07:45
          </Text>
          <Text style={[styles.uliceRadek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            ⏳ Hájek a Na Rovném – plánovaný příjezd do 40 min
          </Text>
        </View>
      </Karta>

      {/* 3. Parkování a dobíjení elektromobilů */}
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
        Chytré parkování a nabíjení EV
      </Text>

      <View style={styles.parkovaniMrizka}>
        <Karta style={styles.parkovaniKarta}>
          <Text
            style={[
              styles.parkovaniNazev,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Parkoviště Náves (obchod)
          </Text>
          <Text
            style={[
              styles.parkovaniPocet,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            14 / 20
          </Text>
          <Text style={[styles.parkovaniPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            volných míst (70 % volno)
          </Text>
        </Karta>

        <Karta style={styles.parkovaniKarta}>
          <Text
            style={[
              styles.parkovaniNazev,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Parkoviště Hasičárna
          </Text>
          <Text
            style={[
              styles.parkovaniPocet,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            8 / 10
          </Text>
          <Text style={[styles.parkovaniPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            volných míst (80 % volno)
          </Text>
        </Karta>
      </View>

      <Karta style={styles.evKarta}>
        <Text
          style={[
            styles.evNazev,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Obecní AC nabíjecí stanice (22 kW) – Náves
        </Text>
        <View style={styles.evStojany}>
          <View style={[styles.evStojan, { borderColor: barvy.line, backgroundColor: barvy.surface }]}>
            <Text style={[styles.stojanTitulek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Konektor 1 (Typ 2)
            </Text>
            <Text style={[styles.stojanStavVolno, { fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}>
              VOLNO
            </Text>
          </View>
          <View style={[styles.evStojan, { borderColor: barvy.line, backgroundColor: barvy.surface }]}>
            <Text style={[styles.stojanTitulek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Konektor 2 (Typ 2)
            </Text>
            <Text style={[styles.stojanStavObsazeno, { fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}>
              OBSAZENO (nabíjí)
            </Text>
          </View>
        </View>
      </Karta>

      {/* 4. Živé odjezdy spojů */}
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
        Živé odjezdy spojů (zastávka Náves)
      </Text>

      <Karta style={styles.odjezdyKarta}>
        <View style={styles.odjezdRadek}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.odjezdLinka,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Autobus 432 → Klatovy, aut. nádr.
            </Text>
            <Text style={[styles.odjezdDetaily, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Nízkopodlažní vůz • Arriva
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.odjezdCas,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              14:45
            </Text>
            <Text style={[styles.odjezdZpozdeni, { color: '#CA8504', fontFamily: pismo.rodina }]}>
              +2 min zpoždění
            </Text>
          </View>
        </View>

        <View style={styles.oddelovac} />

        <View style={styles.odjezdRadek}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.odjezdLinka,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Autobus 432 → Sušice, žel. st.
            </Text>
            <Text style={[styles.odjezdDetaily, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Standardní linka
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.odjezdCas,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              15:18
            </Text>
            <Text style={[styles.odjezdVcas, { color: '#166534', fontFamily: pismo.rodina }]}>
              Na čase (0 min)
            </Text>
          </View>
        </View>

        <View style={styles.oddelovac} />

        <View style={styles.odjezdRadek}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.odjezdLinka,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Vlak Os 7512 → Plzeň hl. n.
            </Text>
            <Text style={[styles.odjezdDetaily, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              ČD RegioShark • Zastávka Javoří Lhota
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.odjezdCas,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              15:42
            </Text>
            <Text style={[styles.odjezdVcas, { color: '#166534', fontFamily: pismo.rodina }]}>
              Na čase (0 min)
            </Text>
          </View>
        </View>
      </Karta>
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
    fontSize: 24,
    lineHeight: 30,
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
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sekceNadpis: {
    fontSize: 17,
    marginTop: 12,
    marginBottom: 10,
  },
  mrizka: {
    gap: 12,
    marginBottom: 16,
  },
  kartaSenzoru: {
    padding: 14,
    gap: 6,
  },
  senzorStitek: {
    fontSize: 13,
  },
  hodnotaRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hodnotaCislo: {
    fontSize: 22,
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
  senzorPopis: {
    fontSize: 13,
    lineHeight: 18,
  },
  kartaVozu: {
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  vuzHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  vuzNazev: {
    fontSize: 16,
  },
  vuzPodtitul: {
    fontSize: 13,
    marginTop: 2,
  },
  prohrnuteUliceNadpis: {
    fontSize: 14,
    marginTop: 4,
  },
  uliceSeznam: {
    gap: 4,
  },
  uliceRadek: {
    fontSize: 13,
    lineHeight: 18,
  },
  parkovaniMrizka: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  parkovaniKarta: {
    flex: 1,
    padding: 14,
    gap: 4,
    alignItems: 'center',
  },
  parkovaniNazev: {
    fontSize: 13,
    textAlign: 'center',
  },
  parkovaniPocet: {
    fontSize: 24,
    marginVertical: 4,
  },
  parkovaniPopis: {
    fontSize: 12,
    textAlign: 'center',
  },
  evKarta: {
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  evNazev: {
    fontSize: 15,
  },
  evStojany: {
    flexDirection: 'row',
    gap: 8,
  },
  evStojan: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  stojanTitulek: {
    fontSize: 12,
  },
  stojanStavVolno: {
    fontSize: 13,
    color: '#166534',
  },
  stojanStavObsazeno: {
    fontSize: 13,
    color: '#991B1B',
  },
  odjezdyKarta: {
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  odjezdRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  odjezdLinka: {
    fontSize: 15,
  },
  odjezdDetaily: {
    fontSize: 13,
    marginTop: 2,
  },
  odjezdCas: {
    fontSize: 16,
  },
  odjezdZpozdeni: {
    fontSize: 12,
    fontWeight: '600',
  },
  odjezdVcas: {
    fontSize: 12,
    fontWeight: '600',
  },
  oddelovac: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
  },
})
