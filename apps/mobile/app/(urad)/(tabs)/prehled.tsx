import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { useZdroj } from '@/zdroj'
import { Karta, Tlacitko } from '@/ui'
import type { PrehledUradu, Rezervace, RoleUradu } from '@codekom/typy'
import { formatDay } from '@codekom/typy/pravidla'

export default function UradPrehledScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace, nastavRoleUradu, vymazatRelaci } = useRelace()
  const { zdroj } = useZdroj()

  const [data, setData] = useState<PrehledUradu | null>(null)
  const [rezervaceList, setRezervaceList] = useState<Rezervace[]>([])
  const [nacitaSe, setNacitaSe] = useState(true)

  useEffect(() => {
    let aktivni = true
    const nacti = async () => {
      try {
        const slug = relace.obec || 'javori-lhota'
        const [uData, sData] = await Promise.all([
          zdroj.urad.prehled(slug),
          zdroj.sluzby(slug),
        ])
        if (aktivni) {
          setData(uData)
          setRezervaceList(sData.rezervace.filter((r) => r.stav === 'ceka'))
        }
      } catch (err) {
        console.warn('Chyba při načítání přehledu úřadu:', err)
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
  }, [zdroj, relace.obec])

  const prepnoutRoli = async (novaRole: RoleUradu) => {
    await nastavRoleUradu(novaRole)
  }

  const odhlasitNaVyberRole = async () => {
    await vymazatRelaci()
    router.replace('/(uvod)/role')
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
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
            Administrace úřadu
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Obec Javoří Lhota • Rychlý přehled pro vedení obce a redaktory
          </Text>
        </View>
        <Tlacitko
          nazev="Role: Občan"
          varianta="ghost"
          onPress={() => void odhlasitNaVyberRole()}
          style={styles.zmenaRoleTlacitko}
        />
      </View>

      {/* Přepínač role Správce / Redaktor */}
      <Karta style={styles.rolePrepinacKarta}>
        <Text
          style={[
            styles.rolePrepinacNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Pracovní role v ukázce:
        </Text>
        <Text style={[styles.rolePrepinacPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          {relace.roleUradu === 'spravce'
            ? 'Správce obce: Má plná oprávnění vydávat krizová hlášení i schvalovat koncepty.'
            : 'Redaktor: Může připravovat koncepty hlášení a spravovat hlášení závad.'}
        </Text>

        <View style={styles.radioSkupina} role="radiogroup" aria-label="Role v ukázce">
          <Pressable
            onPress={() => void prepnoutRoli('spravce')}
            accessibilityRole="radio"
            accessibilityState={{ selected: relace.roleUradu === 'spravce' }}
            accessibilityLabel="Role v ukázce: Správce (plná práva)"
            style={({ pressed }) => [
              styles.radioTlacitko,
              {
                backgroundColor: relace.roleUradu === 'spravce' ? barvy.primary : barvy.surface,
                borderColor: relace.roleUradu === 'spravce' ? barvy.primary : barvy.line,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.radioText,
                {
                  color: relace.roleUradu === 'spravce' ? barvy.onPrimary : barvy.ink,
                  fontFamily: pismo.rodina,
                  fontWeight: pismo.vahy.polotucne,
                },
              ]}
            >
              Správce (starosta)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => void prepnoutRoli('redaktor')}
            accessibilityRole="radio"
            accessibilityState={{ selected: relace.roleUradu === 'redaktor' }}
            accessibilityLabel="Role v ukázce: Redaktor (příprava konceptů)"
            style={({ pressed }) => [
              styles.radioTlacitko,
              {
                backgroundColor: relace.roleUradu === 'redaktor' ? barvy.primary : barvy.surface,
                borderColor: relace.roleUradu === 'redaktor' ? barvy.primary : barvy.line,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.radioText,
                {
                  color: relace.roleUradu === 'redaktor' ? barvy.onPrimary : barvy.ink,
                  fontFamily: pismo.rodina,
                  fontWeight: pismo.vahy.polotucne,
                },
              ]}
            >
              Redaktor
            </Text>
          </Pressable>
        </View>
      </Karta>

      {/* Přehledové karty */}
      <View style={styles.kartyMrizka}>
        {/* Nová hlášení závad */}
        <Karta
          onPress={() => router.push('/(urad)/(tabs)/zavady')}
          popisekProCtecku={`Nová hlášení závad od občanů: celkem ${data?.novaHlaseniZavad ?? 0}.`}
          style={styles.prehledKarta}
        >
          <Text style={[styles.kartaStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Nová hlášení závad
          </Text>
          <Text
            style={[
              styles.kartaCislo,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            {nacitaSe ? '…' : data?.novaHlaseniZavad ?? 0}
          </Text>
          <Text style={[styles.kartaPodtitul, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Čeká na posouzení a vyřízení →
          </Text>
        </Karta>

        {/* Stav obecních budov */}
        <Karta
          onPress={() => router.push('/(urad)/(tabs)/budovy')}
          popisekProCtecku={`Stav obecních budov: ${data?.budovSVyhradou ?? 0} s výhradou.`}
          style={styles.prehledKarta}
        >
          <Text style={[styles.kartaStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Stav budov (IoT)
          </Text>
          <View style={styles.radekCisla}>
            <Text
              style={[
                styles.kartaCislo,
                {
                  color: (data?.budovSVyhradou ?? 0) > 0 ? '#CA8504' : '#166534',
                  fontFamily: pismo.rodina,
                  fontWeight: pismo.vahy.polotucne,
                },
              ]}
            >
              {nacitaSe ? (
                '…'
              ) : (data?.budovSVyhradou ?? 0) > 0 ? (
                <>
                  {data?.budovSVyhradou}
                  <Text style={{ fontSize: 16, fontWeight: '600' }}> upozornění</Text>
                </>
              ) : (
                'V pořádku'
              )}
            </Text>
          </View>
          <Text style={[styles.kartaPodtitul, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Celkem {data?.celkemBudov ?? 5} sledovaných objektů →
          </Text>
        </Karta>
      </View>

      {/* Aktivní krizové hlášení */}
      <Karta
        onPress={() => router.push('/(urad)/(tabs)/krize')}
        style={styles.krizeStavKarta}
        popisekProCtecku="Správa krizových hlášení a rozhlasu."
      >
        <Text
          style={[
            styles.sekceNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Aktivní krizové hlášení
        </Text>
        {data?.aktivniKrize ? (
          <View style={styles.krizeObsah}>
            <View style={styles.krizeRadek}>
              <View
                style={[
                  styles.urovenOdznak,
                  {
                    backgroundColor:
                      data.aktivniKrize.uroven === 'emergency'
                        ? '#FEE2E2'
                        : data.aktivniKrize.uroven === 'warning'
                          ? '#FEF6D8'
                          : '#DCFCE7',
                    borderColor:
                      data.aktivniKrize.uroven === 'emergency'
                        ? '#EF4444'
                        : data.aktivniKrize.uroven === 'warning'
                          ? '#CA8504'
                          : '#22C55E',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.urovenText,
                    {
                      color:
                        data.aktivniKrize.uroven === 'emergency'
                          ? '#991B1B'
                          : data.aktivniKrize.uroven === 'warning'
                            ? '#2A1B00'
                            : '#166534',
                      fontFamily: pismo.rodina,
                    },
                  ]}
                >
                  {data.aktivniKrize.uroven === 'emergency'
                    ? 'Krizová situace'
                    : data.aktivniKrize.uroven === 'warning'
                      ? 'Výstraha'
                      : 'Informace obce'}
                </Text>
              </View>
              <Text style={[styles.platnostText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Aktivní na Přehledu občana
              </Text>
            </View>
            <Text
              style={[
                styles.krizeTitulek,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              {data.aktivniKrize.titulek}
            </Text>
            <Text style={[styles.krizePopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {data.aktivniKrize.text}
            </Text>
          </View>
        ) : (
          <Text style={[styles.bezKrizeText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            V obci není vydáno žádné aktivní krizové hlášení.
          </Text>
        )}
        <Tlacitko
          nazev="Spravovat krizová hlášení"
          varianta="secondary"
          onPress={() => router.push('/(urad)/(tabs)/krize')}
          style={{ marginTop: 8 }}
        />
      </Karta>

      {/* Rezervace čekající na schválení */}
      <Karta style={styles.rezervaceKarta}>
        <View style={styles.rezervaceHlavicka}>
          <Text
            style={[
              styles.sekceNadpis,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Rezervace prostor ke schválení
          </Text>
          <View
            style={[
              styles.pocetOdznak,
              { backgroundColor: barvy.surface, borderColor: barvy.line },
            ]}
          >
            <Text
              style={[
                styles.pocetText,
                { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              {rezervaceList.length}
            </Text>
          </View>
        </View>

        <Text style={[styles.rezervacePoznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Schvalování a generování kódů probíhá ve webové administraci.
        </Text>

        {rezervaceList.length > 0 ? (
          <View style={styles.rezervaceSeznam}>
            {rezervaceList.map((rez) => (
              <View
                key={rez.id}
                style={[styles.rezervacePolozka, { borderColor: barvy.line, backgroundColor: barvy.bg }]}
              >
                <Text
                  style={[
                    styles.rezervaceProstor,
                    { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                  ]}
                >
                  {rez.prostor === 'sal-uradu' ? 'Sál obecního úřadu' : 'Sál v hasičárně'} • {formatDay(rez.den)}
                </Text>
                <Text style={[styles.rezervaceCas, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Čas: {rez.od}–{rez.do} • Účel: {rez.ucel}
                </Text>
                <Text style={[styles.rezervaceZadatel, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  Žadatel: {rez.zadatel.jmeno} ({rez.zadatel.kontakt})
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.bezRezervaci, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Žádné nové žádosti o rezervaci prostor nečekají na schválení.
          </Text>
        )}
      </Karta>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 40,
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  zmenaRoleTlacitko: {
    minHeight: 44,
  },
  rolePrepinacKarta: {
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  rolePrepinacNadpis: {
    fontSize: 15,
  },
  rolePrepinacPopis: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  radioSkupina: {
    flexDirection: 'row',
    gap: 8,
  },
  radioTlacitko: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  radioText: {
    fontSize: 14,
  },
  kartyMrizka: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  prehledKarta: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  kartaStitek: {
    fontSize: 13,
  },
  kartaCislo: {
    fontSize: 26,
    marginVertical: 2,
  },
  radekCisla: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kartaPodtitul: {
    fontSize: 12,
    marginTop: 4,
  },
  krizeStavKarta: {
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  sekceNadpis: {
    fontSize: 16,
  },
  krizeObsah: {
    gap: 6,
  },
  krizeRadek: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urovenOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  urovenText: {
    fontSize: 12,
    fontWeight: '600',
  },
  platnostText: {
    fontSize: 12,
  },
  krizeTitulek: {
    fontSize: 16,
    marginTop: 2,
  },
  krizePopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  bezKrizeText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  rezervaceKarta: {
    padding: 16,
    gap: 8,
  },
  rezervaceHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pocetOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  pocetText: {
    fontSize: 13,
  },
  rezervacePoznamka: {
    fontSize: 13,
    marginBottom: 4,
  },
  rezervaceSeznam: {
    gap: 8,
  },
  rezervacePolozka: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    gap: 2,
  },
  rezervaceProstor: {
    fontSize: 14,
  },
  rezervaceCas: {
    fontSize: 12,
  },
  rezervaceZadatel: {
    fontSize: 12,
  },
  bezRezervaci: {
    fontSize: 14,
    fontStyle: 'italic',
  },
})
