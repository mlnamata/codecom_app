import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko } from '@/ui'

interface Odmena {
  id: string
  nazev: string
  popis: string
  body: number
  platnost: string
}

const ODMENY: Odmena[] = [
  {
    id: 'odmena-koupaliste',
    nazev: 'Celodenní vstup na koupaliště Javoří Lhota',
    popis: 'Platí pro 1 dospělou osobu nebo rodinu s dětmi v letní sezóně 2027.',
    body: 300,
    platnost: 'Do 31. 8. 2027',
  },
  {
    id: 'odmena-pes',
    nazev: 'Sleva 50 % na místní poplatek ze psů',
    popis: 'Jednorázový slevový kupon na poplatek za 1 psa na příští kalendářní rok.',
    body: 400,
    platnost: 'Do 31. 5. 2027',
  },
  {
    id: 'odmena-ples',
    nazev: 'Vstupenka na tradiční Hasičský ples',
    popis: 'Místenka ke stolu a vstupenka na ples SDH Javoří Lhota ve společenském sále.',
    body: 500,
    platnost: 'Ples v lednu 2027',
  },
  {
    id: 'odmena-pujcovna',
    nazev: '1 den výpůjčky zahradní techniky zdarma',
    popis: 'Bezplatné zapůjčení štípačky na dřevo nebo křovinořezu z obecní půjčovny.',
    body: 250,
    platnost: 'Celoročně',
  },
]

export default function ObcanskeBodyScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [mojeBody, setMojeBody] = useState(650)
  const [vycerpaneOdmeny, setVycerpaneOdmeny] = useState<string[]>([])
  const [zprava, setZprava] = useState<string | null>(null)

  const uplatnitOdmenu = (odmena: Odmena) => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    if (mojeBody < odmena.body) return

    setMojeBody(mojeBody - odmena.body)
    setVycerpaneOdmeny([...vycerpaneOdmeny, odmena.id])
    setZprava(
      `Gratulujeme! Odměna „${odmena.nazev}“ byla uplatněna. Kód voucheru: JAV-${Math.floor(1000 + Math.random() * 9000)}. Ukažte jej při vstupu nebo na pokladně úřadu.`,
    )
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
        Občanské body a gamifikace
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Odměňujeme aktivní občany. Získávejte kredity za hlášení závad, účast na brigádách a včasné
        platby.
      </Text>

      {/* Stav konta */}
      <Karta style={styles.kontoKarta}>
        <View style={styles.kontoHlavicka}>
          <Text style={[styles.kontoStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Stav vašeho občanského konta:
          </Text>
          <View
            style={[
              styles.urovenOdznak,
              { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
            ]}
          >
            <Text style={[styles.urovenText, { color: '#166534', fontFamily: pismo.rodina }]}>
              Aktivní občan (úroveň 2)
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.bodyCislo,
            { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          {mojeBody} bodů
        </Text>

        <Text style={[styles.historieNadpis, { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}>
          Nedávná aktivita:
        </Text>
        <View style={styles.historieSeznam}>
          <Text style={[styles.historieRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            + 200 bodů • Účast na brigádě: sázení stromků v aleji
          </Text>
          <Text style={[styles.historieRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            + 150 bodů • Nahlášení výmolu v ulici K Lesu (vyřízeno)
          </Text>
          <Text style={[styles.historieRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            + 100 bodů • Včasná bezhotovostní platba poplatku za odpad
          </Text>
          <Text style={[styles.historieRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            + 200 bodů • Založení profilu v aplikaci obce
          </Text>
        </View>
      </Karta>

      {zprava && (
        <Karta style={styles.zpravaBox}>
          <Text
            style={[
              styles.zpravaNadpis,
              { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Voucher vygenerován
          </Text>
          <Text style={[styles.zpravaText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {zprava}
          </Text>
          <Tlacitko
            nazev="Zavřít"
            varianta="ghost"
            onPress={() => setZprava(null)}
            style={{ marginTop: 6 }}
          />
        </Karta>
      )}

      {/* Katalog odměn */}
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
        Dostupné odměny k uplatnění
      </Text>

      <View style={styles.seznam}>
        {ODMENY.map((odmena) => {
          const uzUplatneno = vycerpaneOdmeny.includes(odmena.id)
          const lzeUplatnit = mojeBody >= odmena.body && !uzUplatneno

          return (
            <Karta key={odmena.id} style={styles.odmenaKarta}>
              <View style={styles.odmenaHlavicka}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.odmenaNazev,
                      {
                        color: barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {odmena.nazev}
                  </Text>
                  <Text style={[styles.platnost, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Platnost nabídky: {odmena.platnost}
                  </Text>
                </View>
                <View
                  style={[
                    styles.bodyCenaOdznak,
                    {
                      backgroundColor: barvy.surface,
                      borderColor: barvy.line,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bodyCenaText,
                      {
                        color: barvy.primary,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {odmena.body} bodů
                  </Text>
                </View>
              </View>

              <Text style={[styles.odmenaPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {odmena.popis}
              </Text>

              <Tlacitko
                nazev={uzUplatneno ? '✓ Uplatněno' : 'Vyměnit za body'}
                varianta={uzUplatneno ? 'ghost' : 'secondary'}
                zakazano={!lzeUplatnit}
                onPress={() => uplatnitOdmenu(odmena)}
                style={styles.uplatnitTlacitko}
              />
            </Karta>
          )
        })}
      </View>

      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Pravidla občanských bodů
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Body jsou nepřenosné a slouží k motivaci občanů k péči o obecní prostranství a komunitní
          život. Schválení bodů za brigády probíhá automaticky po prezenční listině.
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
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  kontoKarta: {
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  kontoHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kontoStitek: {
    fontSize: 13,
  },
  urovenOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  urovenText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bodyCislo: {
    fontSize: 32,
    marginVertical: 2,
  },
  historieNadpis: {
    fontSize: 14,
    marginTop: 4,
  },
  historieSeznam: {
    gap: 4,
  },
  historieRadek: {
    fontSize: 13,
    lineHeight: 18,
  },
  zpravaBox: {
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  zpravaNadpis: {
    fontSize: 15,
    marginBottom: 2,
  },
  zpravaText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sekceNadpis: {
    fontSize: 17,
    marginBottom: 12,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  odmenaKarta: {
    padding: 14,
    gap: 8,
  },
  odmenaHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  odmenaNazev: {
    fontSize: 16,
    lineHeight: 22,
  },
  platnost: {
    fontSize: 12,
    marginTop: 2,
  },
  bodyCenaOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  bodyCenaText: {
    fontSize: 13,
  },
  odmenaPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  uplatnitTlacitko: {
    minHeight: 44,
    marginTop: 4,
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
