import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { KrizovyBanner, Karta, Tlacitko, Logo } from '@/ui'
import { Ikona, type NazevIkony } from '@/ui/Ikony'
import { nazevKategorieZavady, vzhledKategorieZavady } from '@/zdroj/kategorieZavad'
import type { Prehled, KrizoveHlaseni } from '@codekom/typy'
import { formatDay } from '@codekom/typy/pravidla'
import { zacinaVelkym } from '@/text'
import { DEMO_DNES } from '@codekom/demo-data'

interface RychlaAkce {
  nazev: string
  cil: string
  ikona: NazevIkony
  /** Barva ikony a tónované pozadí (kontrast ikony ≥ 3 : 1). */
  barva: string
  pozadi: string
}

const RYCHLE_AKCE: RychlaAkce[] = [
  {
    nazev: 'Poplatky',
    cil: '/(obcan)/(tabs)/sluzby/poplatky',
    ikona: 'platby',
    barva: '#1D4ED8',
    pozadi: '#E8EFFE',
  },
  {
    nazev: 'Rezervace',
    cil: '/(obcan)/(tabs)/sluzby/rezervace',
    ikona: 'rezervace',
    barva: '#6D28D9',
    pozadi: '#F1EAFE',
  },
  {
    nazev: 'Úřední deska',
    cil: '/(obcan)/(tabs)/deska',
    ikona: 'deska',
    barva: '#3D6B00',
    pozadi: '#EEF8C6',
  },
]

/** Nejčastější drobnosti, které lze nahlásit jedním klepnutím z přehledu. */
const ZKRATKY_ZAVAD = ['kos-nevyvezeny', 'neporadek', 'vysoka-trava', 'vymol', 'osvetleni', 'jine']

export default function ObcanPrehledScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [data, setData] = useState<Prehled | null>(null)
  const [aktivniKrize, setAktivniKrize] = useState<{
    hlavni: KrizoveHlaseni | null
    dalsich: number
  }>({ hlavni: null, dalsich: 0 })
  const [nacitaSe, setNacitaSe] = useState(true)
  const [chyba, setChyba] = useState<string | null>(null)

  const nactiPrehled = useCallback(async () => {
    const slug = relace.obec || 'javori-lhota'
    setChyba(null)
    try {
      const [prehledData, krizeData] = await Promise.all([
        zdroj.prehled(slug),
        zdroj.krizeAktivni(slug),
      ])
      setData(prehledData)
      setAktivniKrize(krizeData)
    } catch (err) {
      console.warn('Chyba při načítání přehledu:', err)
      setChyba('Nepodařilo se načíst přehled obce.')
    } finally {
      setNacitaSe(false)
    }
  }, [zdroj, relace.obec])

  useEffect(() => {
    void nactiPrehled()
    // Obnovování dat každých 10 sekund pro aktualizaci krizí a rozhlasu
    const timer = setInterval(() => void nactiPrehled(), 10_000)
    return () => clearInterval(timer)
  }, [nactiPrehled])

  if (nacitaSe && !data) {
    return (
      <View style={[styles.stred, { backgroundColor: barvy.bg }]}>
        <ActivityIndicator
          size="large"
          color={barvy.primary}
          accessibilityLabel="Načítání přehledu"
        />
      </View>
    )
  }

  if (chyba && !data) {
    return (
      <View style={[styles.stred, { backgroundColor: barvy.bg }]}>
        <Text style={[styles.chybaText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          {chyba}
        </Text>
        <Tlacitko nazev="Zkusit znovu" onPress={() => void nactiPrehled()} />
      </View>
    )
  }

  const nejnovejsiRozhlas = data?.rozhlas?.[0]

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Krizový banner je první prvek pro čtečku */}
      <KrizovyBanner
        hlavni={aktivniKrize.hlavni}
        dalsich={aktivniKrize.dalsich}
        onZobrazitDalsi={() => router.push('/(obcan)/(tabs)/zpravy')}
      />

      <View style={styles.zahlavi}>
        <Logo velikost={48} />
        <View style={styles.zahlaviText}>
          <Text style={[styles.zahlaviDatum, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            {/* Den ukázky, ne skutečné dnešní datum: data ukázky platí k DEMO_DNES
                a pevná hodnota se stejně vykreslí při exportu i v prohlížeči. */}
            {zacinaVelkym(
              new Date(DEMO_DNES).toLocaleDateString('cs-CZ', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                timeZone: 'Europe/Prague',
              }),
            )}
          </Text>
          <Text
            role="heading"
            aria-level={1}
            accessibilityRole="header"
            style={[styles.zahlaviNadpis, { color: barvy.ink, fontFamily: pismo.rodina }]}
          >
            {data?.obec.nazev ?? 'Přehled obce'}
          </Text>
        </View>
      </View>

      {/* Hlavní výzva: nahlášení závady */}
      <View style={[styles.hero, { backgroundColor: barvy.tmava }]}>
        <Text style={[styles.heroStitek, { color: barvy.accent, fontFamily: pismo.rodina }]}>
          Pomozte obci
        </Text>
        <Text
          role="heading"
          aria-level={2}
          style={[styles.heroNadpis, { color: barvy.naTmave, fontFamily: pismo.rodina }]}
        >
          Vidíte nepořádek nebo závadu?
        </Text>
        <Text style={[styles.heroText, { color: barvy.naTmaveTlumene, fontFamily: pismo.rodina }]}>
          Vyfoťte, označte místo a odešlete. Obec vám odpoví ke sledovacímu kódu.
        </Text>
        <View style={styles.heroZkratky}>
          {ZKRATKY_ZAVAD.map((id) => {
            const vzhled = vzhledKategorieZavady(id)
            const nazev = nazevKategorieZavady(id)
            return (
              <Pressable
                key={id}
                role="button"
                accessibilityRole="button"
                accessibilityLabel={`Nahlásit: ${nazev}`}
                onPress={() =>
                  router.push({
                    pathname: '/(obcan)/(tabs)/sluzby/zavada',
                    params: { kategorie: id },
                  })
                }
                style={({ pressed }) => [
                  styles.heroZkratka,
                  { backgroundColor: barvy.tmavaPlocha, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <View style={[styles.heroZkratkaIkona, { backgroundColor: vzhled.pozadi }]}>
                  <Ikona nazev={vzhled.ikona} barva={vzhled.barva} velikost={18} />
                </View>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.heroZkratkaText,
                    { color: barvy.naTmave, fontFamily: pismo.rodina },
                  ]}
                >
                  {nazev}
                </Text>
              </Pressable>
            )
          })}
        </View>
        <Pressable
          role="button"
          accessibilityRole="button"
          accessibilityLabel="Nahlásit závadu v obci"
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/zavada')}
          style={({ pressed }) => [
            styles.heroTlacitko,
            { backgroundColor: barvy.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ikona nazev="fotoaparat" barva={barvy.onAccent} velikost={22} />
          <Text
            style={[styles.heroTlacitkoText, { color: barvy.onAccent, fontFamily: pismo.rodina }]}
          >
            Nahlásit závadu
          </Text>
        </Pressable>
        <Pressable
          role="link"
          accessibilityRole="link"
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/sledovani')}
          style={styles.heroOdkaz}
        >
          <Text style={[styles.heroOdkazText, { color: barvy.naTmave, fontFamily: pismo.rodina }]}>
            Sledovat stav mého hlášení →
          </Text>
        </Pressable>
      </View>

      {/* Rychlé akce */}
      <View style={styles.rychleAkce} accessibilityRole="menu">
        {RYCHLE_AKCE.map((akce) => (
          <Pressable
            key={akce.cil}
            role="menuitem"
            accessibilityRole="button"
            accessibilityLabel={akce.nazev}
            onPress={() => router.push(akce.cil)}
            style={({ pressed }) => [
              styles.rychlaAkce,
              {
                backgroundColor: barvy.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View style={[styles.rychlaIkona, { backgroundColor: akce.pozadi }]}>
              <Ikona nazev={akce.ikona} barva={akce.barva} velikost={24} />
            </View>
            <Text
              style={[styles.rychlaNazev, { color: barvy.ink, fontFamily: pismo.rodina }]}
              numberOfLines={2}
            >
              {akce.nazev}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Hlášení rozhlasu */}
      {nejnovejsiRozhlas && (
        <View
          style={[
            styles.rozhlasBox,
            {
              backgroundColor: barvy.surface,
              borderColor: barvy.line,
            },
          ]}
          role="region"
          aria-label="Hlášení rozhlasu"
        >
          <View style={styles.rozhlasHlavicka}>
            <Text
              style={[
                styles.rozhlasStitek,
                {
                  color: barvy.primary,
                  fontFamily: pismo.rodina,
                  fontWeight: pismo.vahy.polotucne,
                },
              ]}
            >
              Hlášení rozhlasu
            </Text>
            <Text style={[styles.rozhlasCas, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              {new Date(nejnovejsiRozhlas.cas).toLocaleTimeString('cs-CZ', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <Text
            style={[
              styles.rozhlasTitulek,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            {nejnovejsiRozhlas.titulek}
          </Text>
          <Text style={[styles.rozhlasText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {nejnovejsiRozhlas.text}
          </Text>
        </View>
      )}

      {/* Aktuality */}
      <View style={styles.sekce}>
        <View style={styles.radekSekce}>
          <Text
            role="heading"
            aria-level={2}
            accessibilityRole="header"
            style={[
              styles.nadpisSekce,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Aktuality
          </Text>
          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Zobrazit všechny aktuality"
            onPress={() => router.push('/(obcan)/(tabs)/zpravy')}
            style={styles.odkazSekce}
          >
            <Text style={[styles.odkazSekceText, { color: barvy.link, fontFamily: pismo.rodina }]}>
              Všechny aktuality →
            </Text>
          </Pressable>
        </View>

        {data?.aktuality && data.aktuality.length > 0 ? (
          data.aktuality.map((a) => (
            <Karta
              key={a.id}
              onPress={() => router.push('/(obcan)/(tabs)/zpravy')}
              popisekProCtecku={`Aktualita: ${a.titulek}`}
            >
              <Text
                style={[
                  styles.kartaTitulek,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                {a.titulek}
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.kartaPerex, { color: barvy.muted, fontFamily: pismo.rodina }]}
              >
                {a.perex}
              </Text>
              <Text style={[styles.kartaDatum, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                {new Date(a.publikovano).toLocaleDateString('cs-CZ')}
              </Text>
            </Karta>
          ))
        ) : (
          <Text style={[styles.prazdnoText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Žádné nové aktuality.
          </Text>
        )}
      </View>

      {/* Úřední deska */}
      <View style={styles.sekce}>
        <View style={styles.radekSekce}>
          <Text
            role="heading"
            aria-level={2}
            accessibilityRole="header"
            style={[
              styles.nadpisSekce,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Úřední deska
          </Text>
          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Zobrazit celou úřední desku"
            onPress={() => router.push('/(obcan)/(tabs)/deska')}
            style={styles.odkazSekce}
          >
            <Text style={[styles.odkazSekceText, { color: barvy.link, fontFamily: pismo.rodina }]}>
              Celá deska →
            </Text>
          </Pressable>
        </View>

        {data?.deska && data.deska.length > 0 ? (
          data.deska.map((d) => (
            <Karta
              key={d.id}
              onPress={() => router.push(`/(obcan)/(tabs)/deska/${d.id}`)}
              popisekProCtecku={`Dokument desky: ${d.nazev}`}
            >
              <Text
                style={[
                  styles.kartaTitulek,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                {d.nazev}
              </Text>
              <View style={styles.radekDokumentu}>
                <Text
                  style={[
                    styles.kategorieStitek,
                    { color: barvy.primary, fontFamily: pismo.rodina },
                  ]}
                >
                  {d.kategorie}
                </Text>
                <Text style={[styles.kartaDatum, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Vyvěšeno {formatDay(d.vyvesenoOd)}
                </Text>
              </View>
            </Karta>
          ))
        ) : (
          <Text style={[styles.prazdnoText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Na desce právě nevisí žádný dokument.
          </Text>
        )}
      </View>

      {/* Zařídit přes úřad */}
      <View
        style={[
          styles.uradBox,
          {
            backgroundColor: barvy.surface,
            borderColor: barvy.line,
          },
        ]}
      >
        <Text
          role="heading"
          aria-level={2}
          accessibilityRole="header"
          style={[
            styles.nadpisSekce,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Kontakt na obecní úřad
        </Text>
        <Text style={[styles.kontaktText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Obecní úřad Javoří Lhota, Náves 1
        </Text>
        <Text style={[styles.kontaktText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Telefon: [TELEFON] · E-mail: [E-MAIL]
        </Text>
        <Text style={[styles.kontaktHodiny, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Úřední hodiny: pondělí a středa 8:00 – 17:00, úterý a čtvrtek 8:00 – 12:00
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
  stred: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chybaText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  zahlavi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  zahlaviText: {
    flex: 1,
    gap: 2,
  },
  zahlaviDatum: {
    fontSize: 14,
    fontWeight: '500',
  },
  zahlaviNadpis: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  hero: {
    borderRadius: 28,
    padding: 22,
    marginTop: 18,
    gap: 8,
  },
  heroStitek: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroNadpis: {
    fontSize: 30,
    lineHeight: 33,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 21,
  },
  heroZkratky: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  heroZkratka: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    borderRadius: 16,
    minHeight: 48,
  },
  heroZkratkaIkona: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroZkratkaText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
  },
  heroTlacitko: {
    marginTop: 10,
    minHeight: 56,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  heroTlacitkoText: {
    fontSize: 17,
    fontWeight: '800',
  },
  heroOdkaz: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  heroOdkazText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  rychleAkce: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 8,
  },
  rychlaAkce: {
    flex: 1,
    minHeight: 104,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 6,
    gap: 10,
    alignItems: 'center',
    shadowColor: '#0F1B16',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rychlaIkona: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rychlaNazev: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 17,
  },
  rozhlasBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  rozhlasHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rozhlasStitek: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rozhlasCas: {
    fontSize: 12,
  },
  rozhlasTitulek: {
    fontSize: 15,
    marginBottom: 4,
  },
  rozhlasText: {
    fontSize: 14,
    lineHeight: 19,
  },
  sekce: {
    marginTop: 20,
  },
  radekSekce: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nadpisSekce: {
    fontSize: 18,
  },
  odkazSekce: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  odkazSekceText: {
    fontSize: 14,
  },
  kartaTitulek: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 21,
  },
  kartaPerex: {
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 6,
  },
  kartaDatum: {
    fontSize: 12,
  },
  radekDokumentu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  kategorieStitek: {
    fontSize: 12,
    fontWeight: '600',
  },
  prazdnoText: {
    fontSize: 14,
    paddingVertical: 12,
  },
  uradBox: {
    marginTop: 28,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  kontaktText: {
    fontSize: 14,
    marginTop: 4,
  },
  kontaktHodiny: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
})
