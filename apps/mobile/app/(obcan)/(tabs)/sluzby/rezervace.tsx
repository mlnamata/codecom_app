import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { Pole, Tlacitko, Karta } from '@/ui'
import type { Prostor, Rezervace } from '@codekom/typy'

export default function RezervaceScreen() {
  const router = useRouter()
  const { barvy, krize, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [prostory, setProstory] = useState<Prostor[]>([])
  const [rezervace, setRezervace] = useState<Rezervace[]>([])
  const [nacitaSe, setNacitaSe] = useState(true)

  // Formulář
  const [vybranyProstorId, setVybranyProstorId] = useState<string>('')
  const [vybranyDen, setVybranyDen] = useState<string>('2026-11-20')
  const [vybranyBlokId, setVybranyBlokId] = useState<string>('')
  const [ucel, setUcel] = useState('')
  const [jmeno, setJmeno] = useState(relace.prihlasen ? 'Jan Novák' : '')
  const [email, setEmail] = useState(relace.prihlasen ? 'jan.novak@example.cz' : '')
  const [telefon, setTelefon] = useState(relace.prihlasen ? '+420 777 123 456' : '')

  const [odesilaSe, setOdesilaSe] = useState(false)
  const [chyba, setChyba] = useState<string | null>(null)
  const [dokonceno, setDokonceno] = useState<Rezervace | null>(null)

  useEffect(() => {
    let aktivni = true
    const nacti = async () => {
      try {
        const slug = relace.obec || 'javori-lhota'
        const sluzbyData = await zdroj.sluzby(slug)
        if (aktivni) {
          setProstory(sluzbyData.prostory)
          setRezervace(sluzbyData.rezervace)
          if (sluzbyData.prostory.length > 0 && !vybranyProstorId && sluzbyData.prostory[0]) {
            setVybranyProstorId(sluzbyData.prostory[0].id)
          }
        }
      } catch (err) {
        if (aktivni) {
          console.warn('Chyba při načítání prostorů:', err)
          setChyba('Nepodařilo se načíst obecní prostory.')
        }
      } finally {
        if (aktivni) {
          setNacitaSe(false)
        }
      }
    }
    void nacti()
    return () => {
      aktivni = false
    }
  }, [zdroj, relace.obec, vybranyProstorId])

  const aktivniProstor = useMemo(() => {
    return prostory.find((p) => p.id === vybranyProstorId) || prostory[0]
  }, [prostory, vybranyProstorId])

  const aktivniBlok = useMemo(() => {
    if (!aktivniProstor) return null
    return aktivniProstor.bloky.find((b) => b.id === vybranyBlokId) || null
  }, [aktivniProstor, vybranyBlokId])

  // Zjisti zda je blok obsazen
  const jeBlokObsazen = (prostorId: string, den: string, casOd: string, casDo: string) => {
    return rezervace.some(
      (r) =>
        r.prostor === prostorId &&
        r.den === den &&
        r.od === casOd &&
        r.do === casDo &&
        r.stav !== 'zamitnuto',
    )
  }

  const odeslatZadost = async () => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }

    if (!aktivniProstor) {
      setChyba('Vyberte prosím prostor k rezervaci.')
      return
    }

    if (!aktivniBlok) {
      setChyba('Vyberte prosím volný časový blok.')
      return
    }
    if (!ucel.trim()) {
      setChyba('Vyplňte prosím účel rezervace (např. Oslava narozenin).')
      return
    }
    if (!jmeno.trim() || !email.trim() || !telefon.trim()) {
      setChyba('Vyplňte prosím své kontaktní údaje.')
      return
    }

    setChyba(null)
    setOdesilaSe(true)

    try {
      const slug = relace.obec || 'javori-lhota'
      const novaRezervace = await zdroj.zadatRezervaci(slug, {
        prostorId: aktivniProstor.id,
        den: vybranyDen,
        casOd: aktivniBlok.od,
        casDo: aktivniBlok.do,
        ucel: ucel.trim(),
        jmeno: jmeno.trim(),
        email: email.trim(),
        telefon: telefon.trim(),
      })
      setDokonceno(novaRezervace)
    } catch (err) {
      console.warn('Chyba při odesílání rezervace:', err)
      setChyba('Nepodařilo se odeslat rezervaci. Zkuste to prosím znovu.')
    } finally {
      setOdesilaSe(false)
    }
  }

  if (dokonceno) {
    return (
      <ScrollView
        contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
        keyboardShouldPersistTaps="handled"
      >
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
          Rezervace byla zaznamenána
        </Text>

        <Karta style={styles.potvrzeniKarta}>
          <View
            style={[styles.stavOdznak, { backgroundColor: '#FEF6D8', borderColor: '#CA8504' }]}
            role="status"
          >
            <Text
              style={[
                styles.stavOdznakText,
                { color: '#2A1B00', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Žádost čeká na schválení obcí
            </Text>
          </View>

          <Text style={[styles.potvrzeniPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Vaše žádost o pronájem prostoru „{aktivniProstor?.nazev}“ na den {vybranyDen} (
            {aktivniBlok?.od}–{aktivniBlok?.do}) byla uložena a předána k posouzení obecnímu úřadu.
          </Text>

          <Text style={[styles.potvrzeniPoznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            V této ukázce se nevytváří PIN ke vstupním dveřím ani platební předpis. Schválení
            rezervace provádí správce obce ve webové administraci.
          </Text>
        </Karta>

        <View style={styles.tlacitka}>
          <Tlacitko
            nazev="Zpět na služby"
            onPress={() => router.replace('/(obcan)/(tabs)/sluzby')}
          />
        </View>
      </ScrollView>
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
        Rezervace obecních prostor
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Pronájem společenského sálu nebo hasičárny pro oslavy, spolková setkání a schůze.
      </Text>

      {nacitaSe ? (
        <Text style={[styles.stavZprava, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Načítám prostory…
        </Text>
      ) : (
        <View style={styles.formular}>
          {/* Výběr prostoru */}
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
            1. Vyberte prostor:
          </Text>
          <View style={styles.prostorySeznam}>
            {prostory.map((prostor) => {
              const vybrana = vybranyProstorId === prostor.id
              return (
                <Pressable
                  key={prostor.id}
                  onPress={() => {
                    setVybranyProstorId(prostor.id)
                    setVybranyBlokId('')
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: vybrana }}
                  accessibilityLabel={`${prostor.nazev}, kapacita ${prostor.kapacita} osob, cena ${prostor.cenaZaBlok} Kč za blok.`}
                  style={({ pressed }) => [
                    styles.prostorKarta,
                    {
                      backgroundColor: vybrana ? barvy.surface : barvy.bg,
                      borderColor: vybrana ? barvy.primary : barvy.line,
                      borderWidth: vybrana ? 2 : 1,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.prostorNazev,
                      {
                        color: barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {prostor.nazev}
                  </Text>
                  <Text
                    style={[styles.prostorPodrobnosti, { color: barvy.muted, fontFamily: pismo.rodina }]}
                  >
                    Kapacita {prostor.kapacita} osob • {prostor.cenaZaBlok} Kč/blok (kauce{' '}
                    {prostor.kauce} Kč)
                  </Text>
                  <Text
                    style={[styles.prostorPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}
                  >
                    {prostor.popis}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Výběr termínu */}
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
            2. Zvolte datum:
          </Text>
          <View style={styles.dnySeznam}>
            {['2026-11-20', '2026-11-21', '2026-11-25', '2026-11-28'].map((den) => {
              const vybrany = vybranyDen === den
              return (
                <Pressable
                  key={den}
                  onPress={() => {
                    setVybranyDen(den)
                    setVybranyBlokId('')
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Den ${den}`}
                  style={({ pressed }) => [
                    styles.denTlacitko,
                    {
                      backgroundColor: vybrany ? barvy.primary : barvy.surface,
                      borderColor: vybrany ? barvy.primary : barvy.line,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.denText,
                      {
                        color: vybrany ? barvy.onPrimary : barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {den}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Výběr časového bloku */}
          {aktivniProstor && (
            <>
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
                3. Vyberte časový blok:
              </Text>
              <View style={styles.blokySeznam}>
                {aktivniProstor.bloky.map((blok) => {
                  const obsazeno = jeBlokObsazen(
                    aktivniProstor.id,
                    vybranyDen,
                    blok.od,
                    blok.do,
                  )
                  const vybrany = vybranyBlokId === blok.id

                  return (
                    <Pressable
                      key={blok.id}
                      disabled={obsazeno}
                      onPress={() => setVybranyBlokId(blok.id)}
                      accessibilityRole="radio"
                      accessibilityState={{
                        selected: vybrany,
                        disabled: obsazeno,
                      }}
                      accessibilityLabel={`${blok.od} až ${blok.do}${obsazeno ? ', obsazeno' : ', volno'}`}
                      style={({ pressed }) => [
                        styles.blokKarta,
                        {
                          backgroundColor: obsazeno
                            ? '#F1F5F9'
                            : vybrany
                              ? barvy.surface
                              : barvy.bg,
                          borderColor: obsazeno
                            ? '#CBD5E1'
                            : vybrany
                              ? barvy.primary
                              : barvy.line,
                          borderWidth: vybrany ? 2 : 1,
                          opacity: obsazeno ? 0.6 : pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <View style={styles.blokRadek}>
                        <Text
                          style={[
                            styles.blokCas,
                            {
                              color: obsazeno ? barvy.muted : barvy.ink,
                              fontFamily: pismo.rodina,
                              fontWeight: pismo.vahy.polotucne,
                            },
                          ]}
                        >
                          {blok.od} – {blok.do}
                        </Text>
                        {obsazeno ? (
                          <View
                            style={[
                              styles.stavStitek,
                              { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
                            ]}
                          >
                            <Text style={[styles.obsazenoText, { fontFamily: pismo.rodina }]}>
                              obsazeno
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.stavStitek,
                              { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
                            ]}
                          >
                            <Text style={[styles.volnoText, { fontFamily: pismo.rodina }]}>
                              volno
                            </Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            </>
          )}

          {/* Údaje žadatele */}
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
            4. Účel a kontaktní údaje:
          </Text>

          {!relace.prihlasen ? (
            <Karta style={styles.prihlaseniVyzva}>
              <Text
                style={[
                  styles.prihlaseniText,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                K odeslání rezervace je nutné přihlášení
              </Text>
              <Text
                style={[styles.prihlaseniPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}
              >
                Rezervace prostor je vázána na identitu občana. Přihlaste se prosím ukázkovým
                účtem.
              </Text>
              <Tlacitko
                nazev="Přihlásit se"
                onPress={() => router.push('/(uvod)/prihlaseni')}
                style={styles.prihlasitTlacitko}
              />
            </Karta>
          ) : (
            <View style={styles.formularPole}>
              <Pole
                popisek="Účel rezervace"
                value={ucel}
                onChangeText={setUcel}
                placeholder="Např. Oslava 50. narozenin, spolková schůze"
                napoveda="Uveďte stručně, pro jaký účel prostor poptáváte."
              />
              <Pole
                popisek="Jméno a příjmení"
                value={jmeno}
                onChangeText={setJmeno}
                placeholder="Jan Novák"
              />
              <Pole
                popisek="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="jan.novak@example.cz"
                keyboardType="email-address"
              />
              <Pole
                popisek="Telefon"
                value={telefon}
                onChangeText={setTelefon}
                placeholder="+420 777 123 456"
                keyboardType="phone-pad"
              />

              {/* Shrnutí a odeslání */}
              {aktivniProstor && aktivniBlok && (
                <Karta style={styles.shrnutiKarta}>
                  <Text
                    style={[
                      styles.shrnutiNadpis,
                      {
                        color: barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    Shrnutí rezervace
                  </Text>
                  <Text
                    style={[styles.shrnutiPolozka, { color: barvy.ink, fontFamily: pismo.rodina }]}
                  >
                    Prostor: {aktivniProstor.nazev} ({aktivniProstor.adresa})
                  </Text>
                  <Text
                    style={[styles.shrnutiPolozka, { color: barvy.ink, fontFamily: pismo.rodina }]}
                  >
                    Termín: {vybranyDen}, {aktivniBlok.od}–{aktivniBlok.do}
                  </Text>
                  <Text
                    style={[styles.shrnutiPolozka, { color: barvy.ink, fontFamily: pismo.rodina }]}
                  >
                    Cena: {aktivniProstor.cenaZaBlok} Kč (vratná kauce {aktivniProstor.kauce} Kč)
                  </Text>
                </Karta>
              )}

              {chyba && (
                <Text
                  style={[styles.chybovaZprava, { color: krize.warning.ink, fontFamily: pismo.rodina }]}
                >
                  {chyba}
                </Text>
              )}

              <Tlacitko
                nazev={odesilaSe ? 'Odesílám…' : 'Požádat o rezervaci'}
                onPress={() => void odeslatZadost()}
                zakazano={odesilaSe || !aktivniBlok}
                style={styles.odeslatTlacitko}
              />
            </View>
          )}
        </View>
      )}

      {/* Fallback úřadu podle pravidla 6 */}
      <View
        style={[
          styles.uradFallback,
          {
            backgroundColor: barvy.surface,
            borderColor: barvy.line,
          },
        ]}
      >
        <Text
          style={[
            styles.uradNadpis,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Domluva na obecním úřadě
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Termín rezervace sálu i hasičárny můžete dohodnout také osobně v úředních hodinách nebo
          telefonicky.{'\n\n'}
          Telefon: +420 379 000 111{'\n'}
          Úřední hodiny: Po, St 8:00–17:00, Út, Čt 8:00–12:00
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
    marginBottom: 8,
  },
  podtitul: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  stavZprava: {
    fontSize: 15,
    marginVertical: 16,
  },
  formular: {
    gap: 16,
    marginBottom: 20,
  },
  sekceNadpis: {
    fontSize: 16,
    marginTop: 8,
  },
  prostorySeznam: {
    gap: 12,
  },
  prostorKarta: {
    padding: 14,
    borderRadius: 14,
    gap: 6,
    minHeight: 44,
  },
  prostorNazev: {
    fontSize: 16,
  },
  prostorPodrobnosti: {
    fontSize: 13,
  },
  prostorPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  dnySeznam: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  denTlacitko: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  denText: {
    fontSize: 14,
  },
  blokySeznam: {
    gap: 8,
  },
  blokKarta: {
    padding: 12,
    borderRadius: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
  blokRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blokCas: {
    fontSize: 15,
  },
  stavStitek: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  obsazenoText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
  },
  volnoText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  prihlaseniVyzva: {
    padding: 16,
    gap: 10,
  },
  prihlaseniText: {
    fontSize: 16,
  },
  prihlaseniPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  prihlasitTlacitko: {
    marginTop: 6,
  },
  formularPole: {
    gap: 12,
  },
  shrnutiKarta: {
    padding: 14,
    gap: 6,
    marginTop: 8,
  },
  shrnutiNadpis: {
    fontSize: 15,
    marginBottom: 4,
  },
  shrnutiPolozka: {
    fontSize: 14,
    lineHeight: 20,
  },
  chybovaZprava: {
    fontSize: 14,
  },
  odeslatTlacitko: {
    marginTop: 8,
  },
  potvrzeniKarta: {
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  stavOdznak: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  stavOdznakText: {
    fontSize: 14,
  },
  potvrzeniPopis: {
    fontSize: 15,
    lineHeight: 22,
  },
  potvrzeniPoznamka: {
    fontSize: 13,
    lineHeight: 18,
  },
  tlacitka: {
    gap: 12,
    marginBottom: 20,
  },
  uradFallback: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
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
