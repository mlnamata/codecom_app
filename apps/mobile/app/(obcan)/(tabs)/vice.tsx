import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Modal,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { useOznameni } from '@/stav/oznameni'
import { Karta, Tlacitko } from '@/ui'

export default function ViceScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { vymazatRelaci } = useRelace()
  const { nastaveni, zmenitNastaveni } = useOznameni()

  // Modální okna pro potvrzení a texty
  const [zobrazitPotvrzeniKrize, setZobrazitPotvrzeniKrize] = useState(false)
  const [modalTextu, setModalTextu] = useState<{ titulek: string; obsah: string } | null>(null)

  const prepnoutKrizi = (novaHodnota: boolean) => {
    if (!novaHodnota) {
      // Vypnutí vyžaduje potvrzení
      setZobrazitPotvrzeniKrize(true)
    } else {
      zmenitNastaveni('krize', true)
    }
  }

  const potvrditVypnutiKrize = () => {
    zmenitNastaveni('krize', false)
    setZobrazitPotvrzeniKrize(false)
  }

  const otevritPristupnost = () => {
    setModalTextu({
      titulek: 'Prohlášení o přístupnosti',
      obsah:
        'Obec Javoří Lhota se zavazuje ke zpřístupnění své mobilní a webové aplikace v souladu se zákonem č. 99/2019 Sb., o přístupnosti internetových stránek a mobilních aplikací.\n\n' +
        'Toto prohlášení o přístupnosti se vztahuje na aplikaci CodeKom.\n\n' +
        'Stav souladu: Tato aplikace je plně v souladu s normou EN 301 549 V3.2.1 a standardem WCAG 2.2 na úrovni AA.\n\n' +
        'Vypracování prohlášení: Prohlášení bylo vypracováno dne 4. listopadu 2026. Přístupnost byla posouzena automatizovaným auditem axe-core i manuálním testováním se čtečkami obrazovky.\n\n' +
        'Zpětná vazba a kontaktní údaje: Případné náměty či připomínky k přístupnosti můžete zaslat na e-mail obecního úřadu nebo telefonicky na +420 379 000 111.',
    })
  }

  const otevritSoukromi = () => {
    setModalTextu({
      titulek: 'Zásady ochrany osobních údajů',
      obsah:
        'Zásady ochrany osobních údajů v aplikaci obce Javoří Lhota podle nařízení GDPR a zákona č. 110/2019 Sb.\n\n' +
        'Správce osobních údajů: Obec Javoří Lhota, Náves 1, 342 01 Javoří Lhota, IČO: [IČO].\n\n' +
        'Pověřenec pro ochranu osobních údajů: [POVĚŘENEC], kontakt: [E-MAIL].\n\n' +
        'Rozsah zpracování: V této ukázkové verzi se nezpracovávají žádné reálné osobní údaje. Hlášení závad a rezervace v ukázce jsou uloženy pouze lokálně v prohlížeči nebo v paměti ukázkového serveru bez trvalého ukládání osobních dat.\n\n' +
        'Aplikace nepoužívá žádné sledovací soubory cookies, analytické nástroje třetích stran ani reklamní systémy podle § 89 odst. 3 zákona č. 127/2005 Sb.',
    })
  }

  const zmenitRoli = async () => {
    await vymazatRelaci()
    router.replace('/(uvod)/role')
  }

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
        O obci a nastavení
      </Text>

      {/* Informace o obci */}
      <Karta style={styles.sekceKarta}>
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
          Obec Javoří Lhota
        </Text>
        <Text style={[styles.obecPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Okres Klatovy • Plzeňský kraj{'\n'}
          684 obyvatel • Náves 1, 342 01 Javoří Lhota{'\n'}
          Části obce: Javoří Lhota (412), Podjavoří (138), Hájek (86), Na Rovném (48)
        </Text>
        <View style={styles.oddelovac} />
        <Text style={[styles.kontaktyNadpis, { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}>
          Úřední hodiny a kontakt
        </Text>
        <Text style={[styles.kontaktyText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Pondělí a středa: 8:00–17:00{'\n'}
          Úterý a čtvrtek: 8:00–12:00{'\n'}
          Telefon úřadu: +420 379 000 111{'\n'}
          Starostka: Marie Šťastná
        </Text>
      </Karta>

      {/* Nastavení simulovaných oznámení */}
      <Karta style={styles.sekceKarta}>
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
          Nastavení oznámení (ukázka)
        </Text>
        <Text style={[styles.sekcePodtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          V prototypu se oznámení zobrazují v horním pruhu aplikace. Zvolte kategorie, které vás
          zajímají.
        </Text>

        <View style={styles.prepinacRadek}>
          <View style={styles.prepinacPopis}>
            <Text
              style={[
                styles.prepinacNazev,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Krize a výstrahy
            </Text>
            <Text style={[styles.prepinacSub, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Doporučeno ponechat zapnuto.
            </Text>
          </View>
          <Switch
            trackColor={{ false: barvy.line, true: barvy.primary }}
            thumbColor={barvy.surface}
            value={nastaveni.krize}
            onValueChange={prepnoutKrizi}
            accessibilityLabel="Přepínač oznámení: Krize a výstrahy"
          />
        </View>

        <View style={styles.prepinacRadek}>
          <View style={styles.prepinacPopis}>
            <Text
              style={[
                styles.prepinacNazev,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Informace obce a rozhlas
            </Text>
            <Text style={[styles.prepinacSub, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Odstávky vody, svoz odpadu a hlášení.
            </Text>
          </View>
          <Switch
            trackColor={{ false: barvy.line, true: barvy.primary }}
            thumbColor={barvy.surface}
            value={nastaveni.informace}
            onValueChange={(v) => zmenitNastaveni('informace', v)}
            accessibilityLabel="Přepínač oznámení: Informace obce a rozhlas"
          />
        </View>

        <View style={styles.prepinacRadek}>
          <View style={styles.prepinacPopis}>
            <Text
              style={[
                styles.prepinacNazev,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Aktuality a akce
            </Text>
            <Text style={[styles.prepinacSub, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Kulturní akce, spolkový život a zprávy.
            </Text>
          </View>
          <Switch
            trackColor={{ false: barvy.line, true: barvy.primary }}
            thumbColor={barvy.surface}
            value={nastaveni.aktuality}
            onValueChange={(v) => zmenitNastaveni('aktuality', v)}
            accessibilityLabel="Přepínač oznámení: Aktuality a akce"
          />
        </View>

        <View style={styles.prepinacRadek}>
          <View style={styles.prepinacPopis}>
            <Text
              style={[
                styles.prepinacNazev,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Úřední deska
            </Text>
            <Text style={[styles.prepinacSub, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Nová vyvěšení a oznámení záměrů.
            </Text>
          </View>
          <Switch
            trackColor={{ false: barvy.line, true: barvy.primary }}
            thumbColor={barvy.surface}
            value={nastaveni.deska}
            onValueChange={(v) => zmenitNastaveni('deska', v)}
            accessibilityLabel="Přepínač oznámení: Úřední deska"
          />
        </View>

        <View style={styles.prepinacRadek}>
          <View style={styles.prepinacPopis}>
            <Text
              style={[
                styles.prepinacNazev,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Moje hlášení
            </Text>
            <Text style={[styles.prepinacSub, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Změny stavu a vyřízení vašich závad.
            </Text>
          </View>
          <Switch
            trackColor={{ false: barvy.line, true: barvy.primary }}
            thumbColor={barvy.surface}
            value={nastaveni.mojeHlaseni}
            onValueChange={(v) => zmenitNastaveni('mojeHlaseni', v)}
            accessibilityLabel="Přepínač oznámení: Moje hlášení závad"
          />
        </View>

        <View style={styles.prepinacRadek}>
          <View style={styles.prepinacPopis}>
            <Text
              style={[
                styles.prepinacNazev,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Tichý režim
            </Text>
            <Text style={[styles.prepinacSub, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Potlačí běžná oznámení (krizová situace se zobrazí vždy).
            </Text>
          </View>
          <Switch
            trackColor={{ false: barvy.line, true: barvy.primary }}
            thumbColor={barvy.surface}
            value={nastaveni.tichyRezim}
            onValueChange={(v) => zmenitNastaveni('tichyRezim', v)}
            accessibilityLabel="Přepínač tichého režimu"
          />
        </View>
      </Karta>

      {/* Odkazy a právní informace */}
      <View style={styles.odkazySekce}>
        <Tlacitko
          nazev="Prohlášení o přístupnosti"
          varianta="secondary"
          onPress={otevritPristupnost}
          style={styles.odkazTlacitko}
        />
        <Tlacitko
          nazev="Zásady ochrany osobních údajů"
          varianta="secondary"
          onPress={otevritSoukromi}
          style={styles.odkazTlacitko}
        />
      </View>

      {/* Přepnutí role a verze */}
      <View style={styles.spodniSekce}>
        <Tlacitko
          nazev="Změnit roli v ukázce (Občan / Úřad)"
          varianta="ghost"
          onPress={() => void zmenitRoli()}
          style={styles.zmenitRoliTlacitko}
        />
        <Text style={[styles.verzeText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          CodeKom Ukázková aplikace • verze 1.0.0
        </Text>
      </View>

      {/* Dialog potvrzení vypnutí krizových hlášení */}
      <Modal
        visible={zobrazitPotvrzeniKrize}
        transparent
        animationType="fade"
        onRequestClose={() => setZobrazitPotvrzeniKrize(false)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Vypnout krizová oznámení?
            </Text>
            <Text style={[styles.modalText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Doporučujeme ponechat krizová hlášení zapnutá pro včasné varování před nebezpečím
              (např. bleskové povodně, požár, výpadek pitné vody).{'\n\n'}
              Upozornění: Krizová situace (nejvyšší stupeň nebezpečí) se z bezpečnostních důvodů
              zobrazí v aplikaci vždy, i při vypnutých oznámeních.
            </Text>
            <View style={styles.modalTlacitka}>
              <Tlacitko
                nazev="Ponechat zapnuto"
                onPress={() => setZobrazitPotvrzeniKrize(false)}
              />
              <Tlacitko
                nazev="Přesto vypnout"
                varianta="ghost"
                onPress={potvrditVypnutiKrize}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Dialog pro zobrazení právních textů */}
      <Modal
        visible={modalTextu !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalTextu(null)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              {modalTextu?.titulek}
            </Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={[styles.modalText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {modalTextu?.obsah}
              </Text>
            </ScrollView>
            <Tlacitko nazev="Zavřít" onPress={() => setModalTextu(null)} style={{ marginTop: 12 }} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 40,
  },
  titulek: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 16,
  },
  sekceKarta: {
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  sekceNadpis: {
    fontSize: 17,
  },
  sekcePodtitul: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  obecPopis: {
    fontSize: 14,
    lineHeight: 22,
  },
  oddelovac: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  kontaktyNadpis: {
    fontSize: 15,
  },
  kontaktyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  prepinacRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  prepinacPopis: {
    flex: 1,
    gap: 2,
  },
  prepinacNazev: {
    fontSize: 15,
  },
  prepinacSub: {
    fontSize: 13,
  },
  odkazySekce: {
    gap: 8,
    marginBottom: 20,
  },
  odkazTlacitko: {
    minHeight: 44,
  },
  spodniSekce: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  zmenitRoliTlacitko: {
    width: '100%',
    minHeight: 44,
  },
  verzeText: {
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
    gap: 12,
    maxHeight: '80%',
  },
  modalNadpis: {
    fontSize: 18,
    marginBottom: 4,
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
  },
  modalTlacitka: {
    gap: 8,
    marginTop: 8,
  },
})
