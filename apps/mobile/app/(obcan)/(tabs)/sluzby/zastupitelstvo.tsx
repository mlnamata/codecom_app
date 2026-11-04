import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko } from '@/ui'

interface Material {
  id: string
  bodJednani: string
  nazev: string
  zpracovatel: string
  duvernost: 'neverejne' | 'vyhrazene'
  anotace: string
  prilohy: string[]
}

const MATERIALY: Material[] = [
  {
    id: 'mat-1',
    bodJednani: 'Bod 4/12',
    nazev: 'Návrh rozpočtu obce Javoří Lhota na rok 2027 (pracovní verze)',
    zpracovatel: 'Jana Malá (účetní obce)',
    duvernost: 'neverejne',
    anotace: 'Předběžná bilance daňových příjmů a investičních priorit (dokončení chodníku Podjavoří, oprava hasičské stříkačky).',
    prilohy: ['Rozpocet-2027-navrh-v2.pdf (1.2 MB)', 'Investice-prehled-2027.xlsx (420 KB)'],
  },
  {
    id: 'mat-2',
    bodJednani: 'Bod 7/12',
    nazev: 'Projektová dokumentace a výběr zhotovitele: Rekonstrukce mostku u rybníka',
    zpracovatel: 'Ing. Petr Kos (místostarosta)',
    duvernost: 'vyhrazene',
    anotace: 'Vyhodnocení nabídek ze zjednodušeného podlimitního řízení. Nabídky tří stavebních firem včetně cenového porovnání.',
    prilohy: ['Zprava-hodnotici-komise.pdf (890 KB)', 'Staticke-posouzeni-mostku.pdf (3.4 MB)'],
  },
  {
    id: 'mat-3',
    bodJednani: 'Bod 9/12',
    nazev: 'Žádost o prodej části pozemku parc. č. 45/2 v k. ú. Javoří Lhota',
    zpracovatel: 'Marie Šťastná (starostka)',
    duvernost: 'neverejne',
    anotace: 'Geometrický plán na oddělení 45 m² pro narovnání hranice sousedského oplocení.',
    prilohy: ['Geometricky-plan-oddělení.pdf (780 KB)'],
  },
]

export default function ZastupitelstvoScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [otevrenaPriloha, setOtevrenaPriloha] = useState<string | null>(null)

  const jeZastupitel = relace.role === 'urad' || relace.prihlasen

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
            Zastupitelský extranet
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Chráněný portál pro členy zastupitelstva a rady obce Javoří Lhota s interními podklady.
          </Text>
        </View>
        <View
          style={[
            styles.roleOdznak,
            { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
          ]}
        >
          <Text style={[styles.roleOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
            {relace.roleUradu === 'spravce' ? 'Role: Správce' : 'Role: Zastupitel'}
          </Text>
        </View>
      </View>

      {!jeZastupitel ? (
        <Karta style={styles.zamcenoKarta}>
          <Text
            style={[
              styles.zamcenoNadpis,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Sekce přístupná pouze členům zastupitelstva
          </Text>
          <Text style={[styles.zamcenoText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Pro zobrazení neveřejných pracovních materiálů na zasedání se přihlaste s rolí
            zastupitele nebo úřadu.
          </Text>
          <Tlacitko
            nazev="Přihlásit se jako úřad / zastupitel"
            onPress={() => router.push('/(uvod)/prihlaseni')}
            style={{ marginTop: 8 }}
          />
        </Karta>
      ) : (
        <>
          {/* Upozornění na nejbližší zasedání */}
          <Karta style={styles.zasedaniKarta}>
            <Text
              style={[
                styles.zasedaniNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Nejbližší zasedání Zastupitelstva obce č. 8/2026
            </Text>
            <Text style={[styles.zasedaniTermin, { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}>
              Pondělí 9. listopadu 2026 v 18:00 • Zasedací místnost OÚ
            </Text>
            <Text style={[styles.zasedaniPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Materiály byly rozeslány v zákonné lhůtě. Připomínky k návrhům usnesení můžete vkládat
              do neděle 8. 11. do 12:00.
            </Text>
          </Karta>

          {otevrenaPriloha && (
            <Karta style={styles.stazeniKarta}>
              <Text
                style={[
                  styles.stazeniText,
                  { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                Dokument „{otevrenaPriloha}“ byl otevřen v bezpečném prohlížeči materiálů.
              </Text>
              <Tlacitko
                nazev="Zavřít náhled"
                varianta="ghost"
                onPress={() => setOtevrenaPriloha(null)}
                style={{ marginTop: 4 }}
              />
            </Karta>
          )}

          {/* Seznam pracovních materiálů */}
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
            Pracovní materiály k projednání
          </Text>

          <View style={styles.seznam}>
            {MATERIALY.map((m) => (
              <Karta key={m.id} style={styles.materialKarta}>
                <View style={styles.materialHlavicka}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bodJednani, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                      {m.bodJednani} • Zpracoval: {m.zpracovatel}
                    </Text>
                    <Text
                      style={[
                        styles.materialNazev,
                        {
                          color: barvy.ink,
                          fontFamily: pismo.rodina,
                          fontWeight: pismo.vahy.polotucne,
                        },
                      ]}
                    >
                      {m.nazev}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.duvernostOdznak,
                      {
                        backgroundColor: m.duvernost === 'vyhrazene' ? '#FEF6D8' : '#F1F5F9',
                        borderColor: m.duvernost === 'vyhrazene' ? '#CA8504' : '#CBD5E1',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.duvernostText,
                        {
                          color: m.duvernost === 'vyhrazene' ? '#2A1B00' : barvy.ink,
                          fontFamily: pismo.rodina,
                        },
                      ]}
                    >
                      {m.duvernost === 'vyhrazene' ? 'Vyhrazeno' : 'Pracovní návrh'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.anotaceText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  {m.anotace}
                </Text>

                <View style={styles.prilohySekce}>
                  <Text
                    style={[
                      styles.prilohyNadpis,
                      { color: barvy.muted, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                    ]}
                  >
                    Přílohy ke stažení:
                  </Text>
                  {m.prilohy.map((p) => (
                    <Tlacitko
                      key={p}
                      nazev={`📄 ${p}`}
                      varianta="ghost"
                      onPress={() => setOtevrenaPriloha(p)}
                      style={styles.prilohaTlacitko}
                    />
                  ))}
                </View>
              </Karta>
            ))}
          </View>
        </>
      )}

      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Ochrana informací v zastupitelském extranetu
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Pracovní materiály podléhají ochraně obchodního tajemství a osobních údajů třetích osob dle
          zákona o obcích č. 128/2000 Sb. Finální usnesení jsou po schválení zveřejňována na úřední
          desce.
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
  roleOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  roleOdznakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  zamcenoKarta: {
    padding: 16,
    gap: 8,
    marginBottom: 20,
  },
  zamcenoNadpis: {
    fontSize: 16,
  },
  zamcenoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  zasedaniKarta: {
    padding: 16,
    gap: 6,
    marginBottom: 16,
    borderColor: '#22C55E',
  },
  zasedaniNadpis: {
    fontSize: 16,
  },
  zasedaniTermin: {
    fontSize: 14,
  },
  zasedaniPopis: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  stazeniKarta: {
    padding: 12,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
    marginBottom: 16,
  },
  stazeniText: {
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
  materialKarta: {
    padding: 14,
    gap: 8,
  },
  materialHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  bodJednani: {
    fontSize: 12,
  },
  materialNazev: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  duvernostOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  duvernostText: {
    fontSize: 11,
    fontWeight: '600',
  },
  anotaceText: {
    fontSize: 14,
    lineHeight: 20,
  },
  prilohySekce: {
    gap: 4,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  prilohyNadpis: {
    fontSize: 12,
    marginBottom: 2,
  },
  prilohaTlacitko: {
    minHeight: 40,
    justifyContent: 'flex-start',
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
