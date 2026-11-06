# Mobilní a webová aplikace CodeKom (`apps/mobile`)

Interaktivní prototyp mobilní aplikace obce pro **Občana** a **Úřad** postavený na Expo Routeru a React Native Web (zadání 08 + rozšířené moduly chytré obce).

> **Upozornění:** Tento balíček slouží jako veřejná interaktivní ukázka (prototyp). Neobsahuje žádné tajné klíče, neodesílá skutečné platby a ukládá změny pouze do úložiště prohlížeče (`AsyncStorage` / `localStorage`) nebo do paměti ukázkového serveru.

---

## Jak spustit aplikaci v prohlížeči

### 1. Předpoklady a instalace
- **Node.js** >= 22
- **pnpm** >= 10

V kořeni monorepa nainstalujte závislosti:
```bash
pnpm install
```

### 2. Vývojové spuštění
Pro spuštění v prohlížeči (na adrese `http://localhost:8081`):
```bash
pnpm --filter mobile web
```
Případně přímo z kořene repozitáře:
```bash
pnpm demo
```
Na obrazovkách širších než telefon se aplikace zobrazí v centrovaném rámu šířky max. 430 px s horním pruhem **„Ukázka CodeKom“**, na mobilním rozlišení vyplní celou šířku.

### 3. Režimy zdroje dat (`vestavene` vs. `api`)
Aplikace podporuje dva režimy, mezi kterými automaticky přepíná:
1. **Offline ukázka (`vestavene`)** – výchozí stav, pokud není nastavena proměnná `EXPO_PUBLIC_API_URL` (pak se API vůbec nezkouší) nebo pokud server neodpovídá do 2,5 s. Veškerá data se načítají z `@codekom/demo-data` (obec Javoří Lhota) a změny (nové závady, vydané krize, rezervace) se ukládají do `AsyncStorage` v prohlížeči. Tlačítko **„Obnovit ukázku“** v horním pruhu vrátí stav do výchozího semínka.
2. **Připojeno k ukázkovému serveru (`api`)** – pokud v `.env` nastavíte:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```
   Aplikace ověří dostupnost přes `GET /api/obce`. Při výpadku spojení nebo chybě CORS se bez pádu přepne na vestavěná data a zobrazí tlačítko **„Zkusit znovu“**.

### 4. CORS a propojení s webem (zadání 07)
Při běhu proti lokálnímu serveru `apps/web` (port 3000) povolte původ mobilní aplikace (`http://localhost:8081` nebo port statického serveru) v konfiguraci webu a povolte hlavičky `Content-Type` a `X-Ukazka-Role`.

### 5. Statický export a kontrola produkčního sestavení
Aplikace je nakonfigurována s `web.output: "static"`. Statický export vygeneruje HTML soubory pro každou trasu do adresáře `apps/mobile/dist`:
```bash
pnpm --filter mobile export:web
pnpm --filter mobile serve:web
```
`serve:web` vrací pro každou cestu stránku, kterou pro ni Expo vygenerovalo (`deska.html`, `deska/index.html`, dynamické `deska/[id].html`), a neznámé cesty jako 404. Hosting zveřejněné ukázky musí cesty překládat stejně, jinak React hlásí chybu hydratace #418.

### 6. Celková kontrola MVP
Před předáním nebo nasazením spusťte z kořene repozitáře:
```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm --filter mobile export:web
pnpm --filter mobile kontrola:web
```
`kontrola:web` (`scripts/kontrola-web.cjs`) projde statický export v Chromiu na 390 × 844 v 39 krocích: úvod a volbu role, všechny obrazovky občana a služeb, filtry a detail desky, nahlášení závady se sledovacím kódem a dohledáním stavu, tlačítko „+“, přihlášení úřadu kódem, obnovení stránky v roli úřadu, vydání krize (a že ji občan vidí), změnu stavu závady a omezení redaktora a českou stránku pro neznámou adresu. Na každé obrazovce hlídá pády, chyby v konzoli, rozbité texty („undefined“, „NaN“) a vodorovné přetečení. Potřebuje Playwright s Chromiem.

### 7. Vzhled
Černá a limetková na světle šedém pozadí, bílé karty se zaoblením 24 px, písmo Inter Tight (na webu z Google Fonts), plovoucí tmavá spodní lišta s aktivní záložkou v limetkovém kruhu. Barvy jsou v `src/tema/tema.tsx` (kontrasty WCAG AA hlídá test `tema.test.ts`), ikony v `src/ui/Ikony.tsx`, logo v `src/ui/Logo.tsx`. Snímky obrazovek jsou ve složce `snimky-ukazka/` v kořeni repozitáře.

---

## Přehled obrazovek a modulů

### Role Občan
- **Přehled a Krizový banner:** Nejzávažnější aktivní hlášení nahoře (krizovou situaci nelze skrýt), hlášení obecního rozhlasu, aktuality, nejbližší akce a úřední deska.
- **Úřední deska:** Seznam vyvěšených dokumentů, vyhledávání, filtry kategorií, detail dokumentu a archiv sejmutých dokumentů (respektuje příznak *Po sejmutí nezveřejňovat*).
- **Zprávy a akce:** Aktuality obce a kalendář kulturních či spolkových akcí.
- **Služby – Základní agenda:**
  - **Nahlásit závadu:** Hlavní funkce aplikace. Otevírá se tlačítkem „+“ uprostřed spodní lišty, velkou kartou „Vidíte nepořádek nebo závadu?“ na přehledu (se zkratkami nejčastějších kategorií) i ze Služeb. Formulář nabízí 16 kategorií jako dlaždice s ikonou (nevyvezený koš, nepořádek u koše, odpadky, černá skládka, vysoká tráva, stromy a keře, výmol, chodník, lampa, lavička či hřiště, dopravní značka, kanál, sníh a náledí, graffiti, psí exkrementy, jiné), fotku, polohu a okamžitě vygeneruje osmimístný sledovací kód (Crockford Base32). Kategorie jsou v `obsah/javori-lhota/hlaseni-zavad.json`, ikony a barvy v `src/zdroj/kategorieZavad.ts`.
  - **Sledovat stav závady:** Dohledání stavu a veřejné odpovědi úřadu podle kódu.
  - **Poplatky a QR platba:** Přehled poplatků s generováním SPD řetězce a výrazným štítkem *„Ukázka, neplaťte“*.
  - **Rezervace prostor:** Rezervace obecního sálu a klubovny.
- **Služby – Rozšířené moduly chytré obce:**
  1. **Senzorika, IoT a Chytrá obec (`senzory`):** Enviromentální čidla (hladina potoka s varováním, kvalita ovzduší AQI, teplota vozovky, vlhkost půdy), GPS poloha komunální techniky a protažených ulic, chytré parkování a nabíječky EV, živá odjezdová tabule autobusů a vlaků.
  2. **Komunitní sdílení a lokální ekonomika:**
     - **Obecní půjčovna (`pujcovna`):** Rezervace techniky, party stanů a pivních setů.
     - **Sousedský bazar a darovna (`bazar`):** Přebytky ze zahrady, stavebniny a věci za odvoz.
     - **Sousedská spolujízda (`spolujizda`):** Nabídky a poptávky pravidelného dojíždění.
     - **Burza dobrovolnictví a brigád (`dobrovolnictvi`):** Zapojení do obecních a spolkových akcí.
  3. **Pokročilá správa majetku a infrastruktury:**
     - **Obecní nemovitosti a byty (`nemovitosti`):** Startovací byty, pořadník žadatelů a zasíťované stavební parcely.
     - **Komunitní energetika (`energetika`):** Živý dashboard obecních FVE (škola, úřad, čistička) a registrace k odběru sdílené elektřiny (EDC).
     - **Hřbitov 2.0 (`hrbitov`):** Kontrola platnosti nájemní smlouvy hrobového místa a zapálení virtuální svíčky u osobností obce.
  4. **Bezpečnost a krizové situace:**
     - **Ztráty a nálezy 2.0 (`ztraty-a-nalezy`):** Registr nalezených a zaběhnutých zvířat s GPS odchytu, napojením na útulek a evidencí předmětů.
     - **AED a první pomoc (`aed`):** Mapa defibrilátorů s dostupností a stručným postupem resuscitace.
     - **Veřejné kamery (`kamery`):** Náhledy obecních kamer v souladu s GDPR.
  5. **Zákulisní portály a Gamifikace:**
     - **Občanské body a odměny (`body`):** Gamifikace za hlášení závad a brigády se směnou za odměny.
     - **Zastupitelský extranet (`zastupitelstvo`):** Podklady pro jednání, návrh rozpočtu a historie hlasování zastupitelstva.
     - **Developer portál (`developer`):** Dokumentace otevřeného REST API a registrace webhooků.

### Role Úřad
Obrazovky úřadu mají vlastní adresy `/urad/prehled`, `/urad/krize`, `/urad/zavady` a `/urad/budovy`, aby se nepletly s obrazovkami občana (`/prehled`).

- **Přehled úřadu (`prehled`):** Přepínač podrole **Správce** / **Redaktor**, souhrn nových závad, čekajících rezervací, aktivní krize a stavu budov.
- **Krize a rozhlas (`krize`):** Editor krizového hlášení a rozhlasu s živým náhledem občanského banneru, počítadlem znaků slovem a kontrolou bezpečných odkazů. **Správce** může hlášení vydat a ukončit jeho platnost; **Redaktor** může pouze uložit koncept. Žádné krizové hlášení nelze smazat.
- **Závady (`zavady`):** Správa hlášení od občanů, filtrování podle stavu a uložení veřejné odpovědi při vyřízení nebo zamítnutí.
- **Budovy (`budovy`):** Přehled obecních objektů, teplot v místnostech, oken, dveří a časového plánu vytápění. V souladu s pravidlem 5 je správa v prototypu **výhradně ke čtení** (bez tlačítek pro odemčení či změnu režimu).

---

## Omezení ukázky a návaznost na další milníky
- **Hlavička `X-Ukazka-Role`:** Slouží výhradně k simulaci oprávnění mezi správcem a redaktorem v prototypu. Není to bezpečnostní prvek.
- **Ostrá aplikace (zadání 02):** Nahradí ukázkové přihlášení skutečnou autentizací s tokeny na serveru, napojí ostré API a nativní push notifikace (APNs / FCM).
- **IoT brána a ovládání budov (zadání 04):** Doplní do obrazovky Budov ověřené ovládání dveří a vytápění s oprávněním `dvere`, povinným uvedením důvodu a zápisem do auditního logu.
