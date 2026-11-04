import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko, Pole } from '@/ui'

interface Inzerat {
  id: string
  kategorie: 'Prebytky' | 'Daruji za odvoz' | 'Material' | 'Poptavka'
  titulek: string
  popis: string
  cena: string
  lokalita: string
  kontakt: string
  datum: string
}

const VYCHOZI_INZERATY: Inzerat[] = [
  {
    id: 'bazar-1',
    kategorie: 'Prebytky',
    titulek: 'Jablka ze starého sadu (odrůda Matčino a Boskoopské)',
    popis: 'Máme dvě bedny navíc, vhodné na uskladnění nebo moštování. Čisté, nepadané.',
    cena: 'Zdarma za odvoz',
    lokalita: 'Podjavoří č. p. 14',
    kontakt: 'František Kovář (tel. 721 112 233)',
    datum: 'Dnes',
  },
  {
    id: 'bazar-2',
    kategorie: 'Material',
    titulek: 'Cihly plné pálené cca 350 ks po rekonstrukci stodoly',
    popis: 'Očištěné staré zvonivky, uloženo na suché paletě. Pomůžeme s naložením na vozík.',
    cena: '5 Kč / kus nebo výměna za dřevo',
    lokalita: 'Javoří Lhota, Na Rovném',
    kontakt: 'Jiří Novotný (tel. 608 445 566)',
    datum: 'Včera',
  },
  {
    id: 'bazar-3',
    kategorie: 'Daruji za odvoz',
    titulek: 'Dětská dřevěná jídelní židlička Ikea',
    popis: 'Zachovalá, funkční popruhy, bílý nátěr. Děti už vyrostly.',
    cena: 'Za odvoz',
    lokalita: 'Náves (byt nad poštou)',
    kontakt: 'Lucie Dvořáková (tel. 777 889 900)',
    datum: 'Před 2 dny',
  },
  {
    id: 'bazar-4',
    kategorie: 'Prebytky',
    titulek: 'Domácí kvasný jablečný ocet a sušené houby',
    popis: 'Pravý nepasterovaný jablečný ocet ve sklenicích 0,5 l a směs hřibů a křemenáčů z lesa pod Javorníkem.',
    cena: '70 Kč / sklenice',
    lokalita: 'Hájek č. p. 3',
    kontakt: 'Věra Horáková',
    datum: 'Před 3 dny',
  },
]

export default function BazarScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [inzeraty, setInzeraty] = useState<Inzerat[]>(VYCHOZI_INZERATY)
  const [aktivniFiltr, setAktivniFiltr] = useState<string>('Vše')
  const [novyInzeratModal, setNovyInzeratModal] = useState(false)

  // Formulář
  const [titulek, setTitulek] = useState('')
  const [popis, setPopis] = useState('')
  const [cena, setCena] = useState('Za odvoz')
  const [lokalita, setLokalita] = useState('Javoří Lhota')
  const [kontakt, setKontakt] = useState('')

  const filtrovane = inzeraty.filter((i) => {
    if (aktivniFiltr === 'Vše') return true
    if (aktivniFiltr === 'Přebytky') return i.kategorie === 'Prebytky'
    if (aktivniFiltr === 'Za odvoz') return i.kategorie === 'Daruji za odvoz'
    if (aktivniFiltr === 'Materiál') return i.kategorie === 'Material'
    return true
  })

  const pridatInzerat = () => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    if (!titulek.trim() || !popis.trim() || !kontakt.trim()) return

    const novy: Inzerat = {
      id: `bazar-${Date.now()}`,
      kategorie: cena.toLowerCase().includes('odvoz') ? 'Daruji za odvoz' : 'Prebytky',
      titulek: titulek.trim(),
      popis: popis.trim(),
      cena: cena.trim(),
      lokalita: lokalita.trim(),
      kontakt: kontakt.trim(),
      datum: 'Právě teď',
    }
    setInzeraty([novy, ...inzeraty])
    setNovyInzeratModal(false)
    setTitulek('')
    setPopis('')
    setKontakt('')
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
            Sousedský bazar a darovna
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Sdílení přebytků ze zahrad, stavebního materiálu a věcí za odvoz mezi sousedy.
          </Text>
        </View>
        <Tlacitko
          nazev="+ Přidat nabídku"
          onPress={() => setNovyInzeratModal(true)}
          style={styles.pridatTlacitko}
        />
      </View>

      {/* Filtry */}
      <View style={styles.filtrySeznam}>
        {['Vše', 'Přebytky', 'Za odvoz', 'Materiál'].map((f) => {
          const vybrany = aktivniFiltr === f
          return (
            <Pressable
              key={f}
              onPress={() => setAktivniFiltr(f)}
              accessibilityRole="button"
              accessibilityLabel={`Filtrovat: ${f}`}
              style={({ pressed }) => [
                styles.filtrCip,
                {
                  backgroundColor: vybrany ? barvy.primary : barvy.surface,
                  borderColor: vybrany ? barvy.primary : barvy.line,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filtrText,
                  {
                    color: vybrany ? barvy.onPrimary : barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          )
        })}
      </View>

      <View style={styles.seznam}>
        {filtrovane.map((inzerat) => (
          <Karta key={inzerat.id} style={styles.inzeratKarta}>
            <View style={styles.inzeratHlavicka}>
              <View style={{ flex: 1 }}>
                <View style={styles.stitekRadek}>
                  <Text style={[styles.kategorie, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    {inzerat.kategorie === 'Prebytky'
                      ? 'Přebytky ze zahrady'
                      : inzerat.kategorie === 'Daruji za odvoz'
                        ? 'Daruji za odvoz'
                        : 'Materiál'}
                  </Text>
                  <Text style={[styles.datum, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    • {inzerat.datum}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.inzeratTitulek,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {inzerat.titulek}
                </Text>
              </View>

              <View
                style={[
                  styles.cenaOdznak,
                  {
                    backgroundColor: barvy.surface,
                    borderColor: barvy.line,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cenaText,
                    {
                      color: barvy.primary,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {inzerat.cena}
                </Text>
              </View>
            </View>

            <Text style={[styles.inzeratPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {inzerat.popis}
            </Text>

            <View style={styles.inzeratPaticka}>
              <Text style={[styles.lokalita, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Místo: {inzerat.lokalita}
              </Text>
              <Text
                style={[
                  styles.kontakt,
                  { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                Kontakt: {inzerat.kontakt}
              </Text>
            </View>
          </Karta>
        ))}
      </View>

      {/* Modální okno pro nový inzerát */}
      <Modal
        visible={novyInzeratModal}
        transparent
        animationType="fade"
        onRequestClose={() => setNovyInzeratModal(false)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Nová sousedská nabídka
            </Text>

            <Pole
              popisek="Co nabízíte?"
              value={titulek}
              onChangeText={setTitulek}
              placeholder="Např. Přebytek dýní Hokkaidó"
            />
            <Pole
              popisek="Podrobnější popis"
              value={popis}
              onChangeText={setPopis}
              placeholder="Množství, stav, termín vyzvednutí..."
            />
            <Pole
              popisek="Cena / Za odvoz"
              value={cena}
              onChangeText={setCena}
              placeholder="Za odvoz nebo 30 Kč/kg"
            />
            <Pole
              popisek="Část obce / Ulice"
              value={lokalita}
              onChangeText={setLokalita}
              placeholder="Náves č. p. 12"
            />
            <Pole
              popisek="Kontakt na vás (jméno a telefon)"
              value={kontakt}
              onChangeText={setKontakt}
              placeholder="Jan Novák, tel. 777 111 222"
            />

            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Zveřejnit v bazaru" onPress={pridatInzerat} />
              <Tlacitko nazev="Zavřít" varianta="ghost" onPress={() => setNovyInzeratModal(false)} />
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
          Sousedská etika
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Bazar slouží výhradně pro nekomerční sousedskou výměnu a vzájemnou pomoc obyvatel obce.
          Inzeráty jsou bezplatné.
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
    marginBottom: 12,
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
  pridatTlacitko: {
    minHeight: 44,
  },
  filtrySeznam: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filtrCip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtrText: {
    fontSize: 13,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  inzeratKarta: {
    padding: 14,
    gap: 10,
  },
  inzeratHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  stitekRadek: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kategorie: {
    fontSize: 12,
  },
  datum: {
    fontSize: 12,
  },
  inzeratTitulek: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  cenaOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  cenaText: {
    fontSize: 13,
  },
  inzeratPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  inzeratPaticka: {
    gap: 2,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  lokalita: {
    fontSize: 13,
  },
  kontakt: {
    fontSize: 13,
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
