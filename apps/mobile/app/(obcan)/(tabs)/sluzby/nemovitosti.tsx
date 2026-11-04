import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko, Pole } from '@/ui'

interface ObecniByt {
  id: string
  adresa: string
  dispozice: string
  plocha: number
  najem: number
  stav: 'volny' | 'obsazen' | 'rekonstrukce'
  popis: string
  urceni: string
}

interface Parcela {
  id: string
  cisloParcely: string
  lokalita: string
  plocha: number
  cenaZaM2: number
  zasitovani: string
  stav: 'volna' | 'rezervovano'
  popis: string
}

const BYTY: ObecniByt[] = [
  {
    id: 'byt-1',
    adresa: 'Dům služeb, Náves 14 (1. patro)',
    dispozice: '2+kk',
    plocha: 52,
    najem: 5200,
    stav: 'volny',
    popis: 'Světlý byt po celkové rekonstrukci, nová kuchyňská linka, podlahové topení napojené na obecní tepelné čerpadlo.',
    urceni: 'Startovací byt pro mladé rodiny do 35 let',
  },
  {
    id: 'byt-2',
    adresa: 'Bytový dům Podjavoří 3',
    dispozice: '1+kk',
    plocha: 34,
    najem: 3400,
    stav: 'rekonstrukce',
    popis: 'Probíhá výměna oken a zateplení fasády. Předpokládaný termín dokončení únor 2027.',
    urceni: 'Malometrážní byt pro seniory a jednotlivce',
  },
  {
    id: 'byt-3',
    adresa: 'Dům služeb, Náves 14 (podkroví)',
    dispozice: '3+1',
    plocha: 78,
    najem: 7800,
    stav: 'obsazen',
    popis: 'Dlouhodobý nájemní vztah s obecním učitelem ZŠ.',
    urceni: 'Podpora klíčových profesí v obci',
  },
]

const PARCELY: Parcela[] = [
  {
    id: 'parcela-1',
    cisloParcely: 'parc. č. 142/5',
    lokalita: 'Nové Podjavoří (jižní svah)',
    plocha: 860,
    cenaZaM2: 1250,
    zasitovani: 'Elektřina, obecní vodovod, tlaková kanalizace, optický internet',
    stav: 'volna',
    popis: 'Slunné stavební místo určené pro rodinný dům vesnického typu se sedlovou střechou.',
  },
  {
    id: 'parcela-2',
    cisloParcely: 'parc. č. 142/6',
    lokalita: 'Nové Podjavoří (jižní svah)',
    plocha: 920,
    cenaZaM2: 1250,
    zasitovani: 'Elektřina, obecní vodovod, tlaková kanalizace, optický internet',
    stav: 'rezervovano',
    popis: 'Rezervováno pro místního žadatele po schválení záměru zastupitelstvem.',
  },
]

export default function NemovitostiScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [modalZadost, setModalZadost] = useState(false)
  const [jmeno, setJmeno] = useState('')
  const [telefon, setTelefon] = useState('')
  const [duvod, setDuvod] = useState('')
  const [potvrzeno, setPotvrzeno] = useState<string | null>(null)

  const podatZadost = () => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    setPotvrzeno(
      'Vaše žádost o zařazení do pořadníku na obecní byt byla zaznamenána a předána sociální a bytové komisi obce Javoří Lhota.',
    )
    setModalZadost(false)
    setDuvod('')
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
            Obecní nemovitosti a byty
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Agenda bydlení, pořadníky na obecní a startovací byty, nabídka stavebních parcel.
          </Text>
        </View>
        <Tlacitko
          nazev="Pořadník na byt"
          onPress={() => setModalZadost(true)}
          style={styles.poradnikTlacitko}
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
            Žádost podána
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

      {/* Sekce bytů */}
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
        Obecní a startovací byty
      </Text>

      <View style={styles.seznam}>
        {BYTY.map((byt) => (
          <Karta key={byt.id} style={styles.karta}>
            <View style={styles.kartaHlavicka}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.adresa, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {byt.adresa}
                </Text>
                <Text
                  style={[
                    styles.bytNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  Byt {byt.dispozice} • {byt.plocha} m²
                </Text>
              </View>
              <View
                style={[
                  styles.stavOdznak,
                  {
                    backgroundColor:
                      byt.stav === 'volny'
                        ? '#DCFCE7'
                        : byt.stav === 'rekonstrukce'
                          ? '#FEF6D8'
                          : '#F1F5F9',
                    borderColor:
                      byt.stav === 'volny'
                        ? '#22C55E'
                        : byt.stav === 'rekonstrukce'
                          ? '#CA8504'
                          : '#CBD5E1',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stavOdznakText,
                    {
                      color:
                        byt.stav === 'volny'
                          ? '#166534'
                          : byt.stav === 'rekonstrukce'
                            ? '#2A1B00'
                            : barvy.muted,
                      fontFamily: pismo.rodina,
                    },
                  ]}
                >
                  {byt.stav === 'volny'
                    ? 'K nastěhování'
                    : byt.stav === 'rekonstrukce'
                      ? 'Rekonstrukce'
                      : 'Obsazen'}
                </Text>
              </View>
            </View>

            <Text style={[styles.urceniText, { color: barvy.primary, fontFamily: pismo.rodina }]}>
              Určení: {byt.urceni}
            </Text>

            <Text style={[styles.popisText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {byt.popis}
            </Text>

            <View style={styles.kartaPaticka}>
              <Text
                style={[
                  styles.najemText,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                Základní nájemné: {byt.najem} Kč / měsíc (+ energie)
              </Text>
            </View>
          </Karta>
        ))}
      </View>

      {/* Sekce parcel */}
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
        Zasíťované stavební parcely k prodeji
      </Text>

      <View style={styles.seznam}>
        {PARCELY.map((parcela) => (
          <Karta key={parcela.id} style={styles.karta}>
            <View style={styles.kartaHlavicka}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.adresa, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {parcela.lokalita}
                </Text>
                <Text
                  style={[
                    styles.bytNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {parcela.cisloParcely} • {parcela.plocha} m²
                </Text>
              </View>
              <View
                style={[
                  styles.stavOdznak,
                  {
                    backgroundColor: parcela.stav === 'volna' ? '#DCFCE7' : '#FEF6D8',
                    borderColor: parcela.stav === 'volna' ? '#22C55E' : '#CA8504',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stavOdznakText,
                    {
                      color: parcela.stav === 'volna' ? '#166534' : '#2A1B00',
                      fontFamily: pismo.rodina,
                    },
                  ]}
                >
                  {parcela.stav === 'volna' ? 'K prodeji' : 'V jednání'}
                </Text>
              </View>
            </View>

            <Text style={[styles.popisText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {parcela.popis}
            </Text>

            <Text style={[styles.zasitovaniText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Inženýrské sítě: {parcela.zasitovani}
            </Text>

            <View style={styles.kartaPaticka}>
              <Text
                style={[
                  styles.najemText,
                  {
                    color: barvy.primary,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                Cena: {parcela.cenaZaM2} Kč / m² (celkem{' '}
                {(parcela.plocha * parcela.cenaZaM2).toLocaleString('cs-CZ')} Kč)
              </Text>
            </View>
          </Karta>
        ))}
      </View>

      {/* Modální okno pro podání žádosti o byt */}
      <Modal
        visible={modalZadost}
        transparent
        animationType="fade"
        onRequestClose={() => setModalZadost(false)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Žádost o obecní byt (pořadník)
            </Text>

            <Pole
              popisek="Jméno a příjmení žadatele"
              value={jmeno}
              onChangeText={setJmeno}
              placeholder="Jan Novák"
            />
            <Pole
              popisek="Telefonní kontakt"
              value={telefon}
              onChangeText={setTelefon}
              keyboardType="phone-pad"
              placeholder="+420 777 123 456"
            />
            <Pole
              popisek="Důvod žádosti a současná bytová situace"
              value={duvod}
              onChangeText={setDuvod}
              placeholder="Počet členů domácnosti, vazba na obec Javoří Lhota..."
            />

            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Odeslat žádost" onPress={podatZadost} />
              <Tlacitko nazev="Zpět" varianta="ghost" onPress={() => setModalZadost(false)} />
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
          Pravidla přidělování obecních bytů
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Přidělování se řídí Zásadami pro hospodaření s byty obce Javoří Lhota. Žádosti posuzuje
          starostka a schvaluje rada/zastupitelstvo obce.
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
  poradnikTlacitko: {
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
  sekceNadpis: {
    fontSize: 17,
    marginTop: 8,
    marginBottom: 12,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  karta: {
    padding: 14,
    gap: 8,
  },
  kartaHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  adresa: {
    fontSize: 12,
  },
  bytNazev: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
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
  urceniText: {
    fontSize: 13,
  },
  popisText: {
    fontSize: 14,
    lineHeight: 20,
  },
  zasitovaniText: {
    fontSize: 13,
  },
  kartaPaticka: {
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  najemText: {
    fontSize: 15,
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
