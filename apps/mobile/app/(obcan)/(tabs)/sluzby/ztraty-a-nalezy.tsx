import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko, Pole } from '@/ui'

interface Nalez {
  id: string
  typ: 'zvire' | 'vec'
  nazev: string
  popis: string
  misto: string
  datum: string
  stav: 'u_starosty' | 'utulek' | 'na_urade' | 'vraceno'
  kontakt: string
  fotoPopis?: string
}

const NALEZY: Nalez[] = [
  {
    id: 'nalez-1',
    typ: 'zvire',
    nazev: 'Zlatý retrívr (pes, slyší na jméno Blesk)',
    popis: 'Mladý pes, červený obojek se známkou, velmi přátelský. Nalezen pobíhající na silnici mezi Javoří Lhotou a Hájkem.',
    misto: 'Silnice III/1872 u odbočky na Hájek (GPS 49.3952, 13.2980)',
    datum: 'Dnes v 11:30',
    stav: 'u_starosty',
    kontakt: 'Dočasně u starostky Marie Šťastné (tel. +420 379 000 111)',
    fotoPopis: '[Fotografie psa s červeným obojkem]',
  },
  {
    id: 'nalez-2',
    typ: 'zvire',
    nazev: 'Mourovaté kotě (cca 3 měsíce)',
    popis: 'Drobná mourovatá kočička s bílými tlapkami, odchycena u kontejnerů na bioodpad.',
    misto: 'Náves u obchodu',
    datum: 'Včera v 16:00',
    stav: 'utulek',
    kontakt: 'Předáno smluvnímu útulku Klatovy – Šumavské tlapky (tel. 777 555 444)',
    fotoPopis: '[Fotografie kotěte]',
  },
  {
    id: 'nalez-3',
    typ: 'vec',
    nazev: 'Svazek 4 klíčů s červeným přívěskem Fab',
    popis: 'Dva klasické klíče od bytu, jeden malý od schránky a plastový čip ke vchodu.',
    misto: 'Dětské hřiště pod lípou na návsi',
    datum: 'Před 2 dny',
    stav: 'na_urade',
    kontakt: 'Uloženo v kanceláři matriky OÚ Javoří Lhota',
  },
]

export default function ZtratyNalezyScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [nalezy, setNalezy] = useState<Nalez[]>(NALEZY)
  const [filtr, setFiltr] = useState<'vse' | 'zvire' | 'vec'>('vse')
  const [modalNovy, setModalNovy] = useState(false)

  // Formulář
  const [nazev, setNazev] = useState('')
  const [popis, setPopis] = useState('')
  const [misto, setMisto] = useState('')
  const [kontakt, setKontakt] = useState('')
  const [typ, setTyp] = useState<'zvire' | 'vec'>('zvire')

  const filtrovane = nalezy.filter((n) => {
    if (filtr === 'vse') return true
    return n.typ === filtr
  })

  const nahlasitNalez = () => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    if (!nazev.trim() || !popis.trim()) return

    const novy: Nalez = {
      id: `nalez-${Date.now()}`,
      typ,
      nazev: nazev.trim(),
      popis: popis.trim(),
      misto: misto.trim() || 'Javoří Lhota',
      datum: 'Právě teď',
      stav: typ === 'zvire' ? 'u_starosty' : 'na_urade',
      kontakt: kontakt.trim() || 'Obecní úřad (+420 379 000 111)',
    }
    setNalezy([novy, ...nalezy])
    setModalNovy(false)
    setNazev('')
    setPopis('')
    setMisto('')
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
            Ztráty a nálezy 2.0
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Registr nalezených věcí a zvířat v obci s GPS polohou odchytu a kontaktem na útulek.
          </Text>
        </View>
        <Tlacitko
          nazev="+ Nahlásit nález"
          onPress={() => setModalNovy(true)}
          style={styles.nahlasitTlacitko}
        />
      </View>

      {/* Filtry */}
      <View style={styles.filtrySeznam}>
        <Pressable
          onPress={() => setFiltr('vse')}
          style={[
            styles.filtrCip,
            {
              backgroundColor: filtr === 'vse' ? barvy.primary : barvy.surface,
              borderColor: filtr === 'vse' ? barvy.primary : barvy.line,
            },
          ]}
        >
          <Text
            style={[
              styles.filtrText,
              {
                color: filtr === 'vse' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Všechny nálezy
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFiltr('zvire')}
          style={[
            styles.filtrCip,
            {
              backgroundColor: filtr === 'zvire' ? barvy.primary : barvy.surface,
              borderColor: filtr === 'zvire' ? barvy.primary : barvy.line,
            },
          ]}
        >
          <Text
            style={[
              styles.filtrText,
              {
                color: filtr === 'zvire' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Nalezená zvířata
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFiltr('vec')}
          style={[
            styles.filtrCip,
            {
              backgroundColor: filtr === 'vec' ? barvy.primary : barvy.surface,
              borderColor: filtr === 'vec' ? barvy.primary : barvy.line,
            },
          ]}
        >
          <Text
            style={[
              styles.filtrText,
              {
                color: filtr === 'vec' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Ztracené věci
          </Text>
        </Pressable>
      </View>

      <View style={styles.seznam}>
        {filtrovane.map((nalez) => (
          <Karta key={nalez.id} style={styles.nalezKarta}>
            <View style={styles.nalezHlavicka}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.typStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {nalez.typ === 'zvire' ? 'Zaběhnuté zvíře' : 'Nalezená věc'} • {nalez.datum}
                </Text>
                <Text
                  style={[
                    styles.nalezNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {nalez.nazev}
                </Text>
              </View>
              <View
                style={[
                  styles.stavOdznak,
                  {
                    backgroundColor:
                      nalez.stav === 'utulek'
                        ? '#FEF6D8'
                        : nalez.stav === 'u_starosty'
                          ? '#DCFCE7'
                          : barvy.surface,
                    borderColor:
                      nalez.stav === 'utulek'
                        ? '#CA8504'
                        : nalez.stav === 'u_starosty'
                          ? '#22C55E'
                          : barvy.line,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stavOdznakText,
                    {
                      color:
                        nalez.stav === 'utulek'
                          ? '#2A1B00'
                          : nalez.stav === 'u_starosty'
                            ? '#166534'
                            : barvy.ink,
                      fontFamily: pismo.rodina,
                    },
                  ]}
                >
                  {nalez.stav === 'utulek'
                    ? 'V útulku'
                    : nalez.stav === 'u_starosty'
                      ? 'Dočasně u nálezce'
                      : 'Na úřadě'}
                </Text>
              </View>
            </View>

            {nalez.fotoPopis && (
              <View style={[styles.fotoRamec, { borderColor: barvy.line, backgroundColor: barvy.surface }]}>
                <Text style={[styles.fotoText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {nalez.fotoPopis} (fotodokumentace nálezu)
                </Text>
              </View>
            )}

            <Text style={[styles.nalezPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {nalez.popis}
            </Text>

            <View style={styles.detaily}>
              <Text style={[styles.detailRadek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Místo odchytu/nálezu: {nalez.misto}
              </Text>
              <Text
                style={[
                  styles.detailRadek,
                  { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                Kde vyzvednout: {nalez.kontakt}
              </Text>
            </View>
          </Karta>
        ))}
      </View>

      {/* Modální okno pro nahlášení */}
      <Modal
        visible={modalNovy}
        transparent
        animationType="fade"
        onRequestClose={() => setModalNovy(false)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Nahlásit nalezené zvíře nebo věc
            </Text>

            <View style={styles.typVyber}>
              <Pressable
                onPress={() => setTyp('zvire')}
                style={[
                  styles.typTlacitko,
                  {
                    backgroundColor: typ === 'zvire' ? barvy.primary : barvy.bg,
                    borderColor: typ === 'zvire' ? barvy.primary : barvy.line,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typText,
                    {
                      color: typ === 'zvire' ? barvy.onPrimary : barvy.ink,
                      fontWeight: '600',
                    },
                  ]}
                >
                  Zvíře (pes, kočka)
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setTyp('vec')}
                style={[
                  styles.typTlacitko,
                  {
                    backgroundColor: typ === 'vec' ? barvy.primary : barvy.bg,
                    borderColor: typ === 'vec' ? barvy.primary : barvy.line,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typText,
                    {
                      color: typ === 'vec' ? barvy.onPrimary : barvy.ink,
                      fontWeight: '600',
                    },
                  ]}
                >
                  Věc (klíče, peněženka)
                </Text>
              </Pressable>
            </View>

            <Pole
              popisek="Co jste našli?"
              value={nazev}
              onChangeText={setNazev}
              placeholder="Např. Černý kříženec s obojkem"
            />
            <Pole
              popisek="Popis zvířete/předmětu a zdravotní stav"
              value={popis}
              onChangeText={setPopis}
              placeholder="Plemeno, barva, čip, zranění, zvláštní znaky..."
            />
            <Pole
              popisek="Kde byl nález učiněn (ulice, orientační bod)"
              value={misto}
              onChangeText={setMisto}
              placeholder="U rybníka, polní cesta..."
            />
            <Pole
              popisek="Kontakt na nálezce a kde je zvíře teď"
              value={kontakt}
              onChangeText={setKontakt}
              placeholder="Vaše jméno a telefon"
            />

            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Zveřejnit nález" onPress={nahlasitNalez} />
              <Tlacitko nazev="Zrušit" varianta="ghost" onPress={() => setModalNovy(false)} />
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
          Spolupráce se smluvním útulkem
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Obec Javoří Lhota má uzavřenou smlouvu s útulkem v Klatovech. Odchycení psi jsou v evidenci
          čipů a po 24 hodinách jsou bezpečně převezeni do smluvní péče.
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
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
  },
  nahlasitTlacitko: {
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
    borderRadius: 14,
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
  nalezKarta: {
    padding: 14,
    gap: 10,
  },
  nalezHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  typStitek: {
    fontSize: 12,
  },
  nalezNazev: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  stavOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  stavOdznakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fotoRamec: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  fotoText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  nalezPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  detaily: {
    gap: 3,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  detailRadek: {
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  modalNadpis: {
    fontSize: 18,
    marginBottom: 4,
  },
  typVyber: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  typTlacitko: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  typText: {
    fontSize: 13,
  },
  modalTlacitka: {
    gap: 8,
    marginTop: 8,
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
