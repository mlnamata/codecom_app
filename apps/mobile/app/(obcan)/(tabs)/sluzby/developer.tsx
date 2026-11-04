import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Karta, Tlacitko, Pole } from '@/ui'

interface ApiEndpoint {
  metoda: 'GET' | 'POST'
  cesta: string
  popis: string
  prikladOdpovedi: string
}

const ENDPOINTY: ApiEndpoint[] = [
  {
    metoda: 'GET',
    cesta: '/api/krize/aktivni',
    popis: 'Vrací nejzávažnější aktivní krizové hlášení v obci pro integraci do systémů chytrých domácností (Home Assistant, Loxone) nebo rozhlasových ústředen.',
    prikladOdpovedi: '{\n  "hlavni": {\n    "id": "krize-1",\n    "uroven": "warning",\n    "titulek": "Silný vítr a popadané stromy",\n    "text": "Nevstupujte do lesa..."\n  },\n  "dalsich": 0\n}',
  },
  {
    metoda: 'GET',
    cesta: '/api/iot/senzory',
    popis: 'Reálná data z enviromentálních čidel: hladina Mlýnského potoka, teplota vozovky a kvalita ovzduší AQI.',
    prikladOdpovedi: '{\n  "potokHladinaCm": 42,\n  "teplotaVozovkyC": 1.2,\n  "aqi": 24,\n  "mereno": "2026-11-04T14:32:00Z"\n}',
  },
  {
    metoda: 'GET',
    cesta: '/api/doprava/odjezdy',
    popis: 'Živá odjezdová tabule z obecních zastávek včetně reálného zpoždění spojů od dopravců.',
    prikladOdpovedi: '{\n  "zastavka": "Javoří Lhota, náves",\n  "odjezdy": [\n    { "linka": "432", "smer": "Klatovy", "odjezd": "14:45", "zpozdeniMin": 2 }\n  ]\n}',
  },
  {
    metoda: 'GET',
    cesta: '/api/deska',
    popis: 'Strojově čitelný seznam vyvěšených dokumentů úřední desky ve formátu Open Data / OFN.',
    prikladOdpovedi: '[\n  {\n    "id": "deska-1",\n    "cisloJednaci": "MS-01/2026",\n    "nazev": "Záměr směny pozemků...",\n    "vyveseno": "2026-10-28"\n  }\n]',
  },
]

export default function DeveloperScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()

  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookPotvrzen, setWebhookPotvrzen] = useState<string | null>(null)

  const ulozitWebhook = () => {
    if (!webhookUrl.trim()) return
    setWebhookPotvrzen(
      `Webhook pro adresu „${webhookUrl.trim()}“ byl aktivován. Testovací ping události krizového hlášení byl odeslán.`,
    )
    setWebhookUrl('')
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
        Developer portál a otevřená data
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Rozhraní REST API obce Javoří Lhota a webhooky pro vývojáře, integrace do Home Assistant a
        otevřený katalog.
      </Text>

      {/* Webhook registrace */}
      <Karta style={styles.webhookKarta}>
        <Text
          style={[
            styles.webhookNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Nastavení Webhooku (Příjem událostí v reálném čase)
        </Text>
        <Text style={[styles.webhookPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Při vydání krizového hlášení, změně stavu hladiny potoka nebo vyvěšení nového dokumentu
          odešle obec okamžitý POST požadavek na vaši adresu.
        </Text>

        <Pole
          popisek="Cílová URL adresa vašeho webhooku (HTTPS)"
          value={webhookUrl}
          onChangeText={setWebhookUrl}
          placeholder="https://muj-server.cz/webhook/obec"
        />

        <Tlacitko nazev="Aktivovat webhook" onPress={ulozitWebhook} style={{ marginTop: 4 }} />

        {webhookPotvrzen && (
          <View style={styles.potvrzeniBox}>
            <Text style={[styles.potvrzeniText, { color: '#166534', fontFamily: pismo.rodina }]}>
              {webhookPotvrzen}
            </Text>
          </View>
        )}
      </Karta>

      {/* Seznam API endpointů */}
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
        Dostupná REST API rozhraní
      </Text>

      <View style={styles.seznam}>
        {ENDPOINTY.map((ep) => (
          <Karta key={ep.cesta} style={styles.epKarta}>
            <View style={styles.epHlavicka}>
              <View
                style={[
                  styles.metodaStitek,
                  {
                    backgroundColor: ep.metoda === 'GET' ? '#DCFCE7' : '#FEF6D8',
                    borderColor: ep.metoda === 'GET' ? '#22C55E' : '#CA8504',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.metodaText,
                    {
                      color: ep.metoda === 'GET' ? '#166534' : '#2A1B00',
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {ep.metoda}
                </Text>
              </View>
              <Text
                style={[
                  styles.epCesta,
                  { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                {ep.cesta}
              </Text>
            </View>

            <Text style={[styles.epPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {ep.popis}
            </Text>

            <View style={styles.kodRamec}>
              <Text style={styles.kodText}>{ep.prikladOdpovedi}</Text>
            </View>
          </Karta>
        ))}
      </View>

      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Otevřená data podle zákona č. 106/1999 Sb.
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Všechna data v rozhraní API jsou poskytována pod otevřenou licencí Creative Commons CC0 /
          CC-BY 4.0. API je veřejné bez nutnosti registrace API klíče s limitem 60 požadavků za
          minutu na IP adresu.
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
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  webhookKarta: {
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  webhookNadpis: {
    fontSize: 16,
  },
  webhookPopis: {
    fontSize: 13,
    lineHeight: 18,
  },
  potvrzeniBox: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#22C55E',
    marginTop: 6,
  },
  potvrzeniText: {
    fontSize: 13,
  },
  sekceNadpis: {
    fontSize: 17,
    marginBottom: 12,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  epKarta: {
    padding: 14,
    gap: 8,
  },
  epHlavicka: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metodaStitek: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  metodaText: {
    fontSize: 12,
  },
  epCesta: {
    fontSize: 15,
  },
  epPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  kodRamec: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    marginTop: 4,
  },
  kodText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 18,
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
