# Prompt: Funkční prototyp aplikace v prohlížeči

Vlož celý do Claude Code v kořeni repozitáře `codecom`, nebo napiš: Proveď zadání v `prompty/08-prototyp-aplikace.md`.
Závisí na: 07 (balíčky tokeny, typy, demo-data a endpointy ukázky; bez běžícího 07 aplikace přejde na vestavěná data). Pokud 07 ještě neproběhl, založ z jeho sekce o monorepu a balíčcích jen minimum (popiš co).

<kontext>
CodeKom je platforma pro české obce (pilot do 2 000 obyvatel, Plzeňský kraj); společný kontext, pravidla domény a design jsou v `CLAUDE.md`, neopakuj je. Tento prompt staví prototyp mobilní aplikace, který běží v prohlížeči. Má ukázat starostovi, jak aplikace vypadá a funguje, dřív než vznikne kompletní systém. Pracuje nad ukázkovou obcí Javoří Lhota, má dvě role (Občan a Úřad) a viditelně se tváří jako ukázka.

Prototyp navazuje na ostatní části takto:
- Prompt 07 (prototyp webu) staví datovou vrstvu, ukázkové úložiště v paměti serveru a endpointy, které aplikace volá. Prototyp aplikace je jejich klient.
- Prompt 02 (ostrá mobilní aplikace) později doplní skutečné přihlášení, push, cache pro offline provoz, fotoaparát s polohou, nativní buildy a obchody. Prototyp proto drží strukturu obrazovek a navigaci z promptu 02 tam, kde se s tímto zadáním neliší, a kód píše tak, aby šel převzít (viz <architektura>, rozhraní `zdroj`).
- Prompt 04 (IoT) později přidá ovládání budov. Prototyp budovy jen čte.

Podklady, ze kterých se bere obsah a vzhled (nic nevymýšlej, obsah nepiš):
- `obsah/javori-lhota/*.json` přes balíček `@codekom/demo-data` (obec, aktuality, akce, uredni-deska, krizova-hlaseni, rozhlas, sluzby, prostory, hlaseni-zavad, budovy; popis polí v `obsah/javori-lhota/README.md`). Soubor `asistent-ukazka.json` prototyp nepoužije, AI asistent je mimo rozsah.
- Klikací návrhy `design/prototypy/App-Obcan.dc.html`, `App-Urad.dc.html` a `IoT-Dashboard.dc.html`: vodítko rozvržení a toků (stavy hlášení, výběr dne a času u rezervace, přehled budovy s místnostmi). Obsahují obec Horní Vzorov a prvky mimo rozsah (platba kartou a Apple Pay, odemykání dveří, SMS). Používej Javoří Lhotu a to, co zadání výslovně staví.
- Tokeny z `@codekom/tokeny`: 12 tokenů palety (`bg`, `surface`, `ink`, `muted`, `line`, `primary`, `onPrimary`, `link`, `accent`, `onAccent`, `deep`, `onDeep`), funkce `paleta(klic, index)` a `sablona(klic)`, krizové úrovně a jejich barvy z `krize.ts`.
- Zdroj hotových pravidel: `apps/web/src/lib/deska.ts`, `krize.ts`, `datum.ts` (po promptu 07 jejich čisté funkce v `packages/typy/src/pravidla/`).
</kontext>

<cil>
Na konci příkaz `pnpm --filter mobile web` otevře v prohlížeči aplikaci CodeKom, která se na desktopu vykreslí v rámu šířky telefonu (nejvýš 430 px, uprostřed) a na telefonu zabere celou šířku. Uživatel zvolí roli a obec, projde ukázkovým přihlášením a v roli Občan vidí přehled s krizovým hlášením, úřední desku, zprávy, služby (nahlášení závady, sledování stavu, poplatky s QR platbou, rezervace) a nabídku Více. V roli Úřad vidí přehled úřadu, vydá krizové hlášení (smí-li to správce), vyřídí hlášení závady a prohlédne si stav budov. Pokud běží prototyp webu 07, aplikace čte a zapisuje přes jeho API a změna z jedné role je vidět v druhé; pokud neběží, sama přejde na vestavěná data s viditelnou poznámkou „Offline ukázka“. `pnpm --filter mobile export:web` vytvoří statický export, který jde otevřít z libovolného statického serveru. Nic v prototypu neposílá e-maily ani push, nevybírá peníze a neukládá osobní údaje mimo prohlížeč.
</cil>

<vychozi_stav>
- Repozitář je v době psaní bez `apps/mobile`, `packages/*` a `obsah/`; `apps/web` je Next.js 16 + Payload 3 s npm. Pokud už proběhl prompt 07, existují pnpm workspace, `turbo.json`, `tsconfig.base.json`, `packages/tokeny`, `packages/typy`, `packages/demo-data`, `obsah/javori-lhota/` a v `apps/web` datová vrstva `src/lib/data/` s `demo-pamet.ts` a endpointy. V tom případě je jen použij a nic z toho nepřepisuj.
- Kontrola na začátku (M0): zjisti, co z toho existuje. Chybějící minimum založ, nic navíc, a do `docs/rozhodnuti.md` zapiš, co a proč jsi založil:
  - kořenový `package.json` (private, `packageManager` podle `npm view pnpm version`, `engines.node >=22`, skripty přes `turbo run`), `pnpm-workspace.yaml` (`apps/*`, `packages/*`), `turbo.json`, `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`, `moduleResolution: bundler`);
  - `packages/tokeny` generovaný skriptem `design/generator/tokeny.py` (načte `PAL`, `K` z `palettes.py` a `T` z `tpls.py`, zapíše `src/sablony.ts`) plus ručně `src/krize.ts` a `src/index.ts`;
  - `packages/typy` se zod schématy podle sdílených rozhraní a s čistými funkcemi úřední desky a banneru přesunutými z `apps/web/src/lib` (webové re-exporty, existující testy musí projít beze změny očekávání);
  - `packages/demo-data`, který jen importuje a validuje `obsah/javori-lhota/*.json` a exportuje `DEMO_DNES`. Když JSON chybí, nevymýšlej obsah: zastav se, napiš, které soubory chybí, a po doplnění pokračuj.
  - Převod `apps/web` z npm na pnpm (smazat `package-lock.json`) patří do 07; nedělej ho, jen ověř, že workspace `apps/web` neruší.
- Rozhodnutí 2 až 5 z `docs/rozhodnuti.md` a briefu platí: ovládání budov přidá prompt 04, krizové hlášení publikuje jen správce a redaktor smí jen koncept, `GET /api/obce` je veřejný seznam obcí.
</vychozi_stav>

<rozsah>
Postav:
1. `apps/mobile`: Expo (verzi SDK 58 ověř podle <overit>), Expo Router, TanStack Query, react-native-web, TypeScript strict s `noUncheckedIndexedAccess`, skripty `web`, `export:web`, `serve:web`, `typecheck`, `lint`, `test`, `e2e`, `a11y`.
2. Rám telefonu na webu (komponenta `Ramec`) a pruh ukázky.
3. Úvod ukázky: role, obec, ukázkové přihlášení.
4. Zdroj dat `zdroj` se dvěma implementacemi (`api`, `vestavene`) a automatickým přepnutím.
5. Role Občan: Přehled, Deska, Zprávy, Služby, Více.
6. Role Úřad: Přehled úřadu, Krize a oznámení, Závady, Budovy ke čtení; v roli přepínač správce a redaktor.
7. Simulovaná oznámení uvnitř aplikace.
8. Testy, kontrola přístupnosti, statický export, README.
9. Minimální doplnění `apps/web` o endpointy, které aplikace potřebuje a 07 je neposkytuje (viz <architektura>), označené komentářem `// MINIMUM z promptu 08`.

Mimo rozsah (nedělej; zapiš do `docs/rozhodnuti.md`, že se v prototypu neřešilo):
- nativní buildy, EAS, obchody, Expo Go a development build, ale kód nesmí používat nic jen webového bez náhrady: webové varianty jdou do souborů `*.web.tsx`, nativní varianta nebo bezpečná náhrada existuje vedle nich;
- push oznámení (jen simulace uvnitř aplikace), skutečné přihlášení a jednorázové kódy, odesílání e-mailů;
- platby a rezervační platby (QR platba je jen zobrazená a označená „Ukázka, neplaťte“), schvalování rezervací;
- AI asistent, tedy žádné volání modelu a žádná záložka Asistent;
- ovládání budov (topení, dveře, režimy), potvrzování alarmů;
- offline cache a perzistentní fronta pro provoz bez signálu podle promptu 02. „Offline ukázka“ je jiná věc: náhradní zdroj dat, když neběží API.
</rozsah>

<architektura>
**Struktura `apps/mobile`** (názvy tras česky bez diakritiky):

```
app/_layout.tsx             kořen: Ramec, poskytovatele (dotazy, relace, tema, zdroj), PruhUkazky, PruhOznameni
app/index.tsx               přesměrování podle relace
app/(uvod)/                 role.tsx, obec.tsx, prihlaseni.tsx, kod.tsx
app/(obcan)/(tabs)/         prehled, deska/index + deska/[id], zpravy, sluzby/..., vice/...
app/(urad)/(tabs)/          prehled, krize, zavady/index + zavady/[id], budovy
src/zdroj/                  typy.ts (rozhraní), api.ts, vestavene.ts, uloziste.ts, pripojeni.ts, index.ts
src/stav/                   relace.tsx (role, obec, role úřadu), oznameni.ts
src/tema/                   tema.ts (z tokenů), kontrast.ts, pismo.ts
src/ui/                     Ramec, PruhUkazky, KrizovyBanner, Tlacitko, Pole, Seznam, Karta, Stitek, QrPlatba, MapaPolohy(.web)
src/pravidla/               tenké adaptéry nad packages/typy/src/pravidla
e2e/                        Playwright specifikace a konfigurace
README.md, .env.example, app.config.ts
```

**Rozhraní `zdroj`** (jediné místo, odkud obrazovky berou data; obrazovky nikdy nevolají `fetch` ani `demo-data` přímo):

```ts
export type RezimZdroje = 'api' | 'vestavene';

export interface ZdrojAplikace {
  rezim: RezimZdroje;
  obce(): Promise<ObecVerejna[]>;                       // {slug, nazev, okres, znakUrl, castiObce[]}
  prehled(obec: string): Promise<Prehled>;              // krize, 5 aktualit, 5 dokumentů, rozhlas
  krizeAktivni(obec: string): Promise<{ hlavni: KrizoveHlaseni | null; dalsich: number }>;
  deska(obec: string, filtr?: FiltrDesky): Promise<DokumentDesky[]>;
  dokument(obec: string, id: string): Promise<DokumentDesky | null>;
  aktuality(obec: string): Promise<Aktualita[]>;
  akce(obec: string): Promise<Akce[]>;
  sluzby(obec: string): Promise<{ poplatky: Poplatek[]; prostory: Prostor[]; rezervace: Rezervace[] }>;
  odeslatZavadu(obec: string, v: VstupZavady): Promise<{ cislo: string; sledovaciKod: string }>;
  stavZavady(obec: string, kod: string): Promise<StavZavadyVerejny | null>;
  zadatRezervaci(obec: string, v: VstupRezervace): Promise<Rezervace>;
  urad: {
    prehled(obec: string): Promise<PrehledUradu>;
    zavady(obec: string, stav?: StavZavady): Promise<HlaseniZavady[]>;
    zmenitStavZavady(obec: string, id: string, v: { stav: StavZavady; verejnaOdpoved?: string }): Promise<HlaseniZavady>;
    vydatKrizi(obec: string, v: VstupKrize, role: RoleUradu): Promise<KrizoveHlaseni>;
    ukoncitKrizi(obec: string, id: string, role: RoleUradu): Promise<KrizoveHlaseni>;
    vydatRozhlas(obec: string, v: VstupRozhlasu, role: RoleUradu): Promise<HlaseniRozhlasu>;
    budovy(obec: string): Promise<Budova[]>;
  };
  obnovitUkazku(): Promise<void>;
}
```

Typy `ObecVerejna`, `Prehled`, `FiltrDesky` a vstupní typy patří do `packages/typy` (zod schémata); ostatní typy už tam jsou ze 07. Odpovědi API se parsují zod schématy; nevalidní odpověď je chyba spojení (vede k přepnutí na vestavěná data), ne pád.

**Implementace `api`.** Základ adresy z `process.env.EXPO_PUBLIC_API_URL` (výchozí v `.env.example`: `http://localhost:3000`). Volá endpointy 07:

| Endpoint | Použití |
|---|---|
| `GET /api/obce` | úvod, výběr obce |
| `GET /api/obce/<slug>/prehled` | Přehled občana |
| `GET /api/krize/aktivni?obec=<slug>` | banner, obnovuje se každých 10 s a při návratu do popředí |
| `POST /api/hlaseni-zavad` | nahlášení závady, odpověď `{cislo, sledovaciKod}` |

**Implementace `vestavene`.** Čte přímo `@codekom/demo-data` a změny drží v `uloziste.ts` (kopie semínka v paměti, zrcadlená do `AsyncStorage` pod klíčem `codekom.ukazka.uloziste`, aby přežila obnovení stránky). Logiku desky a krize bere z `packages/typy/src/pravidla/` (stejné funkce jako web), „dnes“ je `DEMO_DNES`. `obnovitUkazku()` vrátí semínko.

**Doplňky v `apps/web` (jen když chybí; nejdřív prohlédni `apps/web/src/app/api` a použij, co 07 pod jinými cestami nabízí, rozdíl zapiš do `docs/rozhodnuti.md`).** Aplikace potřebuje víc, než čtyři sdílené endpointy dávají: úplné seznamy, sledování stavu, zápisy úřadu. Přidej je minimálně, jako route handlery nad rozhraním `ZdrojDat` a ukázkovým úložištěm, se stejným CORS jako sdílené endpointy:

| Endpoint | Účel |
|---|---|
| `GET /api/ukazka/obce/<slug>/deska`, `.../deska/<id>` | seznam (filtr kategorie, hledání) a detail |
| `GET /api/ukazka/obce/<slug>/aktuality`, `.../akce` | Zprávy |
| `GET /api/ukazka/obce/<slug>/sluzby` | poplatky, prostory, obsazené termíny |
| `POST /api/ukazka/obce/<slug>/rezervace` | žádost o rezervaci (stav čeká na schválení) |
| `GET /api/ukazka/obce/<slug>/hlaseni-zavad/<kod>` | veřejný stav podle sledovacího kódu: číslo, kategorie, stav, veřejná odpověď, datum; nic dalšího |
| `GET /api/ukazka/urad/<slug>/prehled`, `.../hlaseni-zavad`, `.../budovy` | role Úřad, čtení |
| `PATCH /api/ukazka/urad/<slug>/hlaseni-zavad/<id>` | změna stavu a veřejná odpověď |
| `POST /api/ukazka/urad/<slug>/krize`, `.../krize/<id>/ukoncit`, `.../rozhlas` | vydání a ukončení |
| `POST /api/ukazka/obnovit` | obnoví semínko |

Role úřadu přijde v hlavičce `X-Ukazka-Role: spravce|redaktor`. Server vydání krize od redaktora odmítne stavem 403 s českou zprávou. Je to jen ochrana pravidla v ukázce, ne zabezpečení; napiš to do komentáře i do `docs/rozhodnuti.md`. Veřejné stránky ani handlery neimportují Payload. Vlastní route handlery mají přednost před catch-all Payloadu `[...slug]` [OVĚŘIT testem].

**CORS.** Aplikace běží na jiném původu než web (vývoj `http://localhost:8081`, export podle zvoleného statického serveru). Web povoluje jen původ z proměnné, kterou pro to zavedl 07 (název zjisti v `apps/web/.env.example`; chybí-li, zaveď `CODEKOM_APP_ORIGIN` a zapiš). Do `apps/mobile/README.md` napiš, jakou hodnotu nastavit pro vývoj i pro export. Předletový požadavek (OPTIONS) a hlavičky `Content-Type` a `X-Ukazka-Role` musí projít.

**Automatické přepnutí.** `pripojeni.ts` při startu a při každém návratu do popředí zavolá `GET {API}/api/obce` s časovým limitem 2,5 s a validuje odpověď. Úspěch znamená režim `api`, neúspěch (síť, CORS, 5xx, nevalidní tělo, chybí `EXPO_PUBLIC_API_URL`) režim `vestavene`. Za běhu v režimu `api` přepne selhání čtení nebo zápisu na vestavěný režim jen jednou a ohlásí to; zápis se přitom neztratí (provede se ve vestavěném úložišti a stav „jen lokálně“ je viditelný). Režim `vestavene` zkusí API znovu každých 30 s a na tlačítko „Zkusit znovu připojit“ v pruhu ukázky. Při návratu na API se lokální změny nepřenášejí a pruh to řekne.

**Relace v ukázce** (`relace.tsx`): `{role: 'obcan' | 'urad', obec, roleUradu: 'spravce' | 'redaktor', prihlasen}` v `AsyncStorage` pod `codekom.ukazka.relace`. Žádné tokeny, žádné osobní údaje. Cesty `(urad)` bez relace s rolí Úřad přesměruj na úvod.

**Tema.** `tema.ts` vezme z `obec.sablona` a `obec.paleta` objekt `paleta(klic, index)` z `@codekom/tokeny` a vystaví `barvy` (`bg`, `surface`, `ink`, `muted`, `line`, `primary`, `onPrimary`, `link`) a `krize` (z `krize.ts`). Jediná akcentová barva je `primary`; tokeny `accent`, `deep` a `extra` aplikace nepoužívá. Písmo je systémové (na webu `system-ui`): písma šablon obce jsou součástí webu a v aplikaci by znamenala stahování písem, což zapiš do `docs/rozhodnuti.md`. Světlý režim podle palety; paleta typu Noc je tmavá a aplikace ji prostě použije.
</architektura>

<datovy_model>
Prototyp nemá databázi ani migrace. Datový model je dán typy v `packages/typy` (Obec, Aktualita, Akce, DokumentDesky, KrizoveHlaseni, HlaseniRozhlasu, Poplatek, Sluzba, Prostor, Rezervace, HlaseniZavad, Budova, PrvekBudovy) a JSON v `obsah/javori-lhota/`. Názvy polí drž podle nich a nepřejmenovávej.

Do `packages/typy` přidej jen tyto věci (každá se zod schématem):
- `ObecVerejna`: `{slug, nazev, okres, znakUrl, castiObce[{nazev, slug}]}` (shodně se sdíleným rozhraním `GET /api/obce`).
- `Prehled`: `{obec, krize: {hlavni, dalsich}, aktuality[5], deska[5], rozhlas}` podle `GET /api/obce/<slug>/prehled`; liší-li se skutečná odpověď 07, uprav schéma podle ní a rozdíl zapiš.
- `StavZavadyVerejny`: `{cislo, kategorie, stav, verejnaOdpoved|null, vytvoreno}`; stavy `nove`, `prijato`, `v_reseni`, `vyrizeno`, `zamitnuto` podle 07 (prompty 02 a 03 používají u jednoho stavu jiný zápis; v kódu drž tvar z `packages/typy`, v textu aplikace nesmí být vidět technický klíč).
- `VstupZavady` (`kategorie`, `popis` do 1 000 znaků, `poloha?`, `popisMista?`, `cast?`, `pocetFotek`), `VstupRezervace`, `VstupKrize` (`uroven`, `titulek` do 90, `text` do 300, `odkazText?`, `odkazUrl?`, `casti[]`, `platiDo?`), `VstupRozhlasu`, `PrehledUradu`.
- `RoleUradu = 'spravce' | 'redaktor'`.

Místní koncepty redaktora (`Koncept`: druh, vstup, vytvoreno) žijí jen v `uloziste.ts` vestavěného režimu a v paměti aplikace; nejdou na server (07 pro ně endpoint nemá) a obrazovka je označí „Koncept uložen jen v tomto prohlížeči“.
</datovy_model>

<funkce>
Obecně: každá obrazovka s daty má stav načítání (kostra s textovým popiskem pro čtečku), prázdný stav větou a možností, co dál, a chybový stav s tlačítkem „Zkusit znovu“. Zápisy mají stav odesílání, úspěch a chybu. Data se zobrazují česky, datum a čas v Europe/Prague (`Intl.DateTimeFormat` s `timeZone`), kalendářní dny podle `datum.ts`. Každá online služba ukazuje i cestu přes úřad: telefon, úřední hodiny a adresa z `obec` (pravidlo 6 z `CLAUDE.md`).

**Pruh ukázky** (nad obsahem, uvnitř rámu, vizuálně oddělený neutrální šedou linkou): text „Ukázka CodeKom“, režim zdroje („Připojeno k ukázkovému webu“ nebo „Offline ukázka“), tlačítka „Zkusit znovu připojit“ (jen v offline), „Obnovit ukázku“ (volá `obnovitUkazku()` a vyprázdní místní stav) a „Změnit roli“. V režimu Offline ukázka text říká: „Ukázkový web neběží, aplikace používá vestavěná data. Změny zůstanou jen v tomto prohlížeči.“

**Rám telefonu.** Na webu při šířce okna nad 480 px vykresli kontejner šířky 430 px a výšky `min(100dvh, 932px)`, uprostřed, s tenkou linkou, bez stínu a záře, na neutrálním pozadí. Obsah uvnitř rámu se posouvá, záložková lišta je dole v rámu. Na užším okně rám zmizí a aplikace zabere celé okno. Rám je jen na webu (`Ramec.web.tsx`), nativní varianta je průchozí.

**Úvod ukázky.**
1. Role: dvě velké volby „Občan“ a „Úřad“ s jednou větou vysvětlení; pod nimi odkaz „Co je to ukázka“ (rozbalení: data jsou ukázková, nic se neposílá).
2. Obec: seznam z `zdroj.obce()` (v ukázce Javoří Lhota s okresem), volba jedné obce.
3. Přihlášení: pole e-mailu s předvyplněným ukázkovým e-mailem `[DOPLNIT: ukázkový e-mail]`, tlačítko „Poslat kód“. Pro roli Úřad navíc výběr role v ukázce (správce, redaktor). Obrazovka kódu zobrazí šestimístný kód výrazně označený „ukázkový kód“ a předvyplní ho; potvrzení pustí dál. Viditelná věta: „Ukázkové přihlášení, žádný e-mail se neposílá.“ Občan může pokračovat i bez přihlášení („Pokračovat bez účtu“). Přihlášení v ukázce odemyká jen nahlášení závady a rezervaci; bez něj obě obrazovky nabídnou přihlášení a po něm se vrátí.

**Občan, záložky Přehled, Deska, Zprávy, Služby, Více.**

*Přehled.* Nahoře krizový banner: jedno, nejzávažnější hlášení z `vyberBanner`, úroveň napsaná slovem (Krizová situace, Výstraha, Informace obce), barvy z `krize.ts`, text, případný odkaz přes `bezpecnyOdkaz`, řádek „Další hlášení: N“ vede na seznam hlášení. Krizovou situaci nejde skrýt, Výstrahu a Informaci ano (`lzeSkryt`, `klicSkryti`, takže po úpravě hlášení se banner vrátí). Hlášení s částmi obce vidí ten, kdo sleduje danou část nebo celou obec (výchozí je celá obec). Pod bannerem: hlášení rozhlasu, 5 aktualit, 5 dokumentů desky, nejbližší akce, kontakt a úřední hodiny. Věta „Hlášení nenahrazuje varovný systém IZS“ je pod bannerem při každé krizi.

*Deska.* Seznam vyvěšených dokumentů s filtrem kategorie a hledáním, detail s původcem, číslem jednacím, daty od a do a přílohou (v ukázce odkaz na ukázkový soubor, pokud ho data mají, jinak věta, že příloha je v ostré verzi). Odkaz „Archiv“ ukáže dokumenty po sejmutí, které nejsou označené „Po sejmutí nezveřejňovat“. Dokument, který už visel, nelze v aplikaci smazat a aplikace nenabízí mazání.

*Zprávy.* Přepínač Aktuality a Akce. Aktuality jako seznam s detailem, akce seřazené podle data s datem, časem a místem.

*Služby.* Rozcestník čtyř služeb a pod ním oddíl „Zařídit přes úřad“ s telefonem, hodinami a adresou.
- Nahlásit závadu: kategorie (z dat `hlaseni-zavad.json`, jinak výchozí Výmol, Osvětlení, Odpad, Zeleň, Jiné), popis, fotka z galerie volitelná (`expo-image-picker` s `exif: false`, pak `expo-image-manipulator`: delší strana 1 600 px, JPEG 0,7; před výběrem upozornění, že se nemají fotit lidé ani SPZ), poloha volitelná: tlačítko „Použít moji polohu“ (dotaz až po klepnutí, jen jednou, souřadnice zaokrouhlené na čtyři desetinná místa) a pole „Popis místa“. Mapa se špendlíkem je jen ve webové variantě `MapaPolohy.web.tsx` a nabídne se pouze, když obec má souřadnice; dlaždice třetí strany se načtou až po klepnutí na „Zobrazit mapu“ s větou, že tím se IP adresa sdělí poskytovateli dlaždic `[DOPLNIT: poskytovatel dlaždic]` (§ 89 odst. 3 zákona č. 127/2005 Sb.). Nativní varianta mapy je textová náhrada. Nouze: věta „Nouzi nehlaste, volejte 112, 150, 155 nebo 158“. Po odeslání obrazovka ukáže číslo hlášení, sledovací kód a počáteční stav. Fotka se pošle na server, jen když ji endpoint 07 podle svého zod schématu přijímá; jinak se pošle `pocetFotek` a obrazovka řekne „Ukázka: fotka se na server neukládá“.
- Sledovat stav: pole sledovacího kódu, výsledek ukáže číslo, kategorii, stav slovem (Přijato, Převzato, Řeší se, Vyřízeno, Zamítnuto) a veřejnou odpověď. Kódy odeslané v tomto prohlížeči se nabídnou jako seznam „Moje hlášení“. Změna stavu úřadem se do 10 s projeví a ohlásí simulovaným oznámením.
- Poplatky: seznam poplatků z `sluzby.json` (odpad 900 Kč, pes 200 Kč a další z dat) a detail s údaji k platbě a QR platbou SPD s variabilním symbolem (čisté sestavení řetězce SPD patří do `packages/typy/src/pravidla/spd.ts`; existuje-li už v `apps/web`, přesuň ho). Účet obce je v datech ukázkový: je-li neplatný, QR se nevykreslí a obrazovka ukáže „Ukázkový účet, QR platba se v ukázce nevytváří“. Vždy viditelně „Ukázka, neplaťte“ vedle QR i v jeho popisku pro čtečku. Peníze jdou v ostré verzi přímo na účet obce; žádné tlačítko „Zaplatit“ nic neoznačí jako zaplacené.
- Rezervace: výběr prostoru (sál, hasičárna), dne a časového bloku z dat `prostory.json`, obsazené termíny nevybratelné a označené slovem „obsazeno“, shrnutí a „Požádat o rezervaci“ (vyžaduje přihlášení). Výsledek: „Žádost čeká na schválení obcí“, bez PINu a bez platby.

*Více.* Obec (název, okres, kraj, počet obyvatel, části obce, znak), úřední hodiny a kontakty z `obec`, nastavení oznámení jen jako ukázka (přepínače kategorií Krize a výstrahy, Informace obce, Aktuality, Úřední deska, Moje hlášení a tichý režim; vypnutí Krize a výstrahy ukáže potvrzení s doporučením ponechat zapnuto a řekne, že Krizová situace se zobrazí vždy), prohlášení o přístupnosti a ochrana osobních údajů (krátké stránky v aplikaci, text ze `zasady-osobnich-udaju.md` a `pristupnost.md` neobsahují nic, co by prototyp slibovat nesměl; chybí-li, `[DOPLNIT: text]`), verze a odkaz „Změnit roli“.

**Simulovaná oznámení.** `PruhOznameni` je pruh nad obsahem s `role="alert"` pro Krizovou situaci a `role="status"` pro ostatní. Spouští ho: nové krizové hlášení nebo rozhlas (zjištěné obnovením `krizeAktivni` a přehledu každých 10 s), změna stavu mého hlášení, odeslání hlášení. Text začíná slovy „Simulované oznámení“, úroveň je slovem, pruh jde zavřít (u Krizové situace se jen sbalí a banner na Přehledu zůstane). Oznámení respektuje přepínače v Více. Žádné `Notification` API prohlížeče, žádný service worker, žádné push.

**Úřad, záložky Přehled, Krize, Závady, Budovy.**

*Přepínač role* nahoře v Přehledu: „Správce“ a „Redaktor“ (`accessibilityRole="radio"`, popisek „Role v ukázce“). Zobrazuje rozdíl práv a mění se okamžitě.

*Přehled úřadu.* Karty s počty a seznamy: nová hlášení závad (nejstarší nahoře, klepnutí otevře detail), rezervace ke schválení (jen seznam, schvalování je ve webové administraci), aktivní krizové hlášení (název, úroveň slovem, platnost) a stav budov (počet s upozorněním).

*Krize a oznámení.* Formulář s druhem (Krizové hlášení, Oznámení rozhlasu). Krizové hlášení: úroveň slovem (Informace obce, Výstraha, Krizová situace), titulek do 90 znaků, text do 300, volitelný text a adresa odkazu (jen `https` nebo cesta webu obce, kontrola `bezpecnyOdkaz`), části obce (výchozí celá obec), konec platnosti volitelný. Počítadla znaků jsou slovem („Zbývá 12 znaků“). Náhled ukáže banner tak, jak ho uvidí občan. Správce: tlačítko „Vydat“ otevře dialog se shrnutím a potvrzením; po potvrzení se hlášení zapíše přes `vydatKrizi` (při běžícím 07 přes `POST`, jinak lokálně s popiskem „Jen lokálně v tomto prohlížeči“), banner v roli Občan se změní a vzniká simulované oznámení. Redaktor: místo „Vydat“ jen „Uložit koncept“ s větou „Krizové hlášení vydává správce obce“; koncept se uloží do seznamu konceptů, který správce vidí a může z něj vydat. Seznam vydaných hlášení s tlačítkem „Ukončit platnost“ (správce, s potvrzením); hlášení nejde smazat a aplikace mazání nenabízí. Oznámení rozhlasu je totéž s jedním textem do 300 znaků a stejným pravidlem rolí.

*Závady.* Seznam s filtrem stavu (Nové, Převzato, Řeší se, Vyřízeno, Zamítnuto), detail s popisem, kategorií, počtem fotek, polohou nebo popisem místa a sledovacím kódem. Změna stavu výběrem a pole „Veřejná odpověď občanovi“ (povinná při Vyřízeno a Zamítnuto, do 500 znaků). Uložení změní stav i veřejnou odpověď; občan je uvidí po sledování kódem. Správce i redaktor smějí vyřizovat.

*Budovy, jen ke čtení,* podle `IoT-Dashboard.dc.html` a dat `budovy.json`: seznam budov se stavem slovem (V pořádku, Varování, Alarm), teplotou a upozorněním; detail budovy s místnostmi (teplota, cílová teplota, okno, baterie), režimem topení (zobrazen, nepřepíná se), stavem zámku slovem (Zamčeno, Odemčeno) s časem posledního vstupu a upozorněními. Pod detailem věta „Ovládání budov přibude v další verzi a bude vyžadovat zvláštní oprávnění“. Žádné tlačítko Odemknout, žádný přepínač režimu, žádné převzetí alarmu. Alarm mrazu je podle pravidla 5 z `CLAUDE.md` v ukázce popsán tak, že ochrana proti mrazu běží v bráně nezávisle na cloudu (věta v detailu, pokud ji data mají; jinak se neuvádí).
</funkce>

<pravidla>
- Krizová hlášení (`CLAUDE.md`, pravidlo 2): vždy jen jedno, nejzávažnější; úroveň slovem, barva doplněk; Krizovou situaci nejde zavřít ani skrýt; hlášení nenahrazuje varovný systém IZS. Banner čte stejné funkce jako web (`vyberBanner`, `lzeSkryt`, `klicSkryti`), nepřepisuj je.
- Vydat krizové hlášení smí jen správce (a superadmin, který v prototypu není), redaktor jen koncept, na všech úrovních editoru (rozhodnutí 4. 11. 2026).
- Úřední deska (pravidlo 1): jen vyvěšené dokumenty od prvního dne; po posledním dni archiv, nebo zmizí z aplikace, je-li označeno „Po sejmutí nezveřejňovat“; nic se nemaže.
- Peníze (pravidlo 3): CodeKom je nedrží. QR platba míří na účet obce, je označená „Ukázka, neplaťte“, prototyp žádnou platbu neprovádí ani nepotvrzuje.
- Budovy (pravidlo 5): v prototypu jen čtení. Ovládání s právem `dvere`, důvodem a auditem staví prompt 04, prototyp na to nelže jiným tlačítkem.
- Úřad jako fallback (pravidlo 6): u Služeb, Rezervace a Hlášení závad viditelný telefon, hodiny a adresa.
- Soukromí: bez souhlasu žádná analytika a třetí strany (§ 89 odst. 3 zákona č. 127/2005 Sb.). Aplikace nenačítá písma ani skripty od třetích stran, mapové dlaždice jen po výslovném kliknutí. Nepoužívá analytiku, hlášení pádů ani sledovací pixely.
- Označení ukázky: pruh „Ukázka CodeKom“ je vidět na každé obrazovce; ukázková data a kódy jsou označeny slovem „ukázkový“. Fotografie obce, pokud je aplikace zobrazí, nesou poznámku „Ilustrační fotografie vytvořená umělou inteligencí“. Zda to vyžaduje čl. 50 odst. 4 AI Actu, je [OVĚŘIT]; označujeme vždy.
- Přístupnost: povinným subjektem je obec, cíl EN 301 549 V3.2.1 (WCAG 2.1 AA), stavíme podle WCAG 2.2 AA (zákon č. 99/2019 Sb.).
- Údaje, které neznáš (IČO obce, telefon, e-mail, číslo účtu), nevymýšlej; zobrazí se tak, jak je mají data (`[IČO]` a podobně), případně `[DOPLNIT: …]`.
</pravidla>

<design_a_pristupnost>
Vzhled podle `design/prototypy/App-Obcan.dc.html` a `App-Urad.dc.html`, pravidla unslop z `CLAUDE.md` (řezy písma nejvýš 600, věty s velkým písmenem bez vykřičníků, krátké popisky bez tečky, jedna akcentová barva, žádné přechody, záře a emoji, mřížka po 4 px, tenké linky, žádné kartičky jako ze SaaS šablony). Role Úřad má stejný vzhled jako Občan a odliší se popiskem v záhlaví, ne jinou barvou.

Konkrétně:
- Text 17 px (`tema.pismo.zaklad`), s respektováním velikosti písma systému (`allowFontScaling` výchozí, na webu jednotky `rem` nebo přepočet z `PixelRatio.getFontScale()`); výšky prvků nejsou pevné. Záložková lišta má `maxFontSizeMultiplier` nejvýš 1,5 a popisek se při větším písmu zalamuje.
- Cíle dotyku nejméně 44 × 44 px (komponenta `Tlacitko` to vynutí `minHeight` a `minWidth`), mezera mezi sousedními nejméně 8 px.
- Kontrast textu aspoň 4,5 : 1 a ovládacích prvků a ikon aspoň 3 : 1. `kontrast.ts` počítá poměr podle WCAG a testy ho ověřují pro dvojice `ink` na `bg` a `surface`, `muted` na `bg` a `surface`, `onPrimary` na `primary`, `link` na `bg` u všech tří palet šablony obce. Selže-li dvojice, nic neobcházej: zapiš do `docs/rozhodnuti.md`, která, a v aplikaci tu dvojici nahraď `ink` na `bg`.
- Úroveň krize, stav závady, režim a stav budovy jsou vždy slovem; barva je doplněk. Žádná informace jen barvou.
- Každý interaktivní prvek má `accessibilityRole`, srozumitelný `accessibilityLabel`, `accessibilityState` (vybráno, rozbaleno, zakázáno) a tam, kde výsledek není zřejmý, `accessibilityHint`. Záložky mají roli `tab` a `selected`, přepínače rolí `radio`. Dekorativní obrázky jsou skryté, ostatní mají popis. Nadpisy mají `accessibilityRole="header"`; jedna úroveň 1 na obrazovce.
- Na webu je fokus vždy viditelný (obrys aspoň 2 px, kontrast 3 : 1 vůči okolí, nikdy `outline: none` bez náhrady), pořadí fokusu odpovídá vizuálnímu, klávesnicí jde ovládat vše, dialogy fokus zachytí a po zavření vrátí.
- Krizový banner je první prvek Přehledu pro čtečku; jeho změna za běhu se ohlásí živou oblastí (`accessibilityLiveRegion`), u Krizové situace asertivně.
- Chyby formulářů jsou slovem u pole a shrnuty nahoře, pole je označí `aria-invalid` (na webu) a popisek chyby je s polem svázaný.
- Respektuj `prefers-reduced-motion` (`AccessibilityInfo.isReduceMotionEnabled`), žádné blikání ani automaticky se pohybující prvky.
- Jazyk dokumentu `lang="cs"` v exportu (`app/+html.tsx`), titulek stránky odpovídá obrazovce (`<title>` přes Expo Router `Head`).
- Šířka 375 px (a rám 430 px): bez vodorovného posunu, nic se neořízne při písmu 200 %.
</design_a_pristupnost>

<bezpecnost_a_soukromi>
- Prototyp neobsahuje tajné klíče. Do `EXPO_PUBLIC_*` patří jen veřejné hodnoty (adresa API). `.env.example` popisuje proměnné: `EXPO_PUBLIC_API_URL` (adresa prototypu webu 07; prázdná znamená vestavěný režim) a případně `EXPO_PUBLIC_DEMO_DNES` (předává se do konfigurace `@codekom/demo-data`, jen pokud ji balíček podporuje; jinak platí `DEMO_DNES`) [OVĚŘIT, protože `CODEKOM_DEMO_DNES` bez předpony Expo do prohlížeče nevloží].
- Relace, ukázkový kód a koncepty jsou jen v `AsyncStorage` prohlížeče a obsahují jen ukázková data. Žádné reálné osobní údaje; formulář hlášení závady na to upozorní („V ukázce nepište skutečné osobní údaje“).
- Validace: zod na všech odpovědích API, na vstupech formulářů (délky, výčty, formát souřadnic), odkazy jen přes `bezpecnyOdkaz`, žádné vykreslování HTML z dat. Sledovací kód a čísla hlášení se neposílají v URL cestě mimo `GET .../hlaseni-zavad/<kod>` ukázkového API.
- Zápisy do ukázkového API vyžadují původ z povolené proměnné; veřejné čtení nevrací osobní údaje (sledování podle kódu vrací jen pole `StavZavadyVerejny`).
- Fotka se před případným odesláním zmenší a zbaví metadat (`exif: false` a překódování); souřadnice se zaokrouhlí.
- Statický export je veřejná sada souborů: neobsahuje nic, co by nemělo být veřejné, a README říká, že je to ukázka, ne produkce.
- Role správce a redaktor v ukázce nejsou zabezpečení; hlavička `X-Ukazka-Role` je jen simulace pravidla. Zapiš to, aby ji později nikdo nepřevzal do ostré verze (tu řeší prompt 02 s tokeny a rolemi na serveru).
</bezpecnost_a_soukromi>

<testy>
Ověřují se pravidla a toky, ne pokrytí řádků. Žádný test se nepřeskakuje ani neupravuje, aby prošel.

| Co | Nástroj |
|---|---|
| Zdroj `vestavene`: filtr desky a archiv podle `DEMO_DNES`, dokument „Po sejmutí nezveřejňovat“ není v archivu, čísla a sledovací kódy hlášení jsou jedinečné, `obnovitUkazku()` vrátí semínko | Vitest |
| Zdroj `api`: parsování odpovědí zod schématy, nevalidní tělo vede k chybě spojení, hlavička role, časový limit | Vitest s MSW |
| Automatické přepnutí: úspěch je `api`, výpadek, chyba CORS a nevalidní tělo jsou `vestavene`, opakovaný pokus vrátí `api`, zápis při výpadku se neztratí | Vitest, Testing Library |
| Banner: nejzávažnější vyhrává, Krizovou situaci nejde skrýt, skrytí se po úpravě vrací, filtr částí obce, platnost od a do v Europe/Prague | Vitest (sdílené testy v `packages/typy`, aplikace jen ověří napojení) |
| Práva: redaktor nemá tlačítko Vydat a vydání krize od redaktora vrací 403; správce vydává; krizi nejde smazat | Vitest, Testing Library, test route handleru |
| Komponenty: `Tlacitko` má nejméně 44 × 44, každé interaktivní prvky mají roli a popisek, stavy načítání, prázdný a chybový | Vitest, Testing Library nad `react-native-web` v jsdom [OVĚŘIT; nefunguje-li aliasování, použij `jest-expo` a rozhodnutí zapiš] |
| Kontrast: všechny dvojice tokenů tří palet šablony obce splňují 4,5 : 1 (text) a 3 : 1 (ovládací prvky) | Vitest |
| QR platba: řetězec SPD má variabilní symbol, částku a měnu, u neplatného účtu se QR nevykreslí, text „Ukázka, neplaťte“ je vždy vedle | Vitest |
| E2E nad webovým exportem na 390 × 844: výběr role a obce, přihlášení kódem; Přehled s krizí nahoře, krizi nejde zavřít; nahlášení závady se sledovacím kódem a dohledání stavu; úřad vydá krizi a občan ji vidí (s běžícím 07, nastaveným původem a `EXPO_PUBLIC_API_URL`); offline ukázka bez 07 (stejné toky ve vestavěném režimu s pruhem „Offline ukázka“); redaktor jen koncept | Playwright |
| Přístupnost: axe-core (WCAG 2.0 až 2.2 A a AA a best-practice) s 0 chybami na hlavních obrazovkách obou rolí (úvod, Přehled, Deska, detail dokumentu, Zprávy, Služby, formulář závady, Poplatky, Rezervace, Více, Přehled úřadu, Krize, Závady, Budovy) ve vestavěném i API režimu, v rámu 430 px a v šířce 375 px | `@axe-core/playwright` |
| Typy, styl | `tsc --noEmit`, ESLint s pravidly přístupnosti (`eslint-plugin-react-native-a11y`; pro web také `jsx-a11y`) jako chyby |

Playwright spouští statický export na zvoleném portu. Projekt s API se definuje jen tehdy, když existuje `apps/web/src/lib/data/demo-pamet.ts` (07 proběhl); v takovém případě testovací konfigurace spustí `apps/web` s povoleným původem exportu. Pokud 07 chybí, napiš to v závěru jako neověřené a nic nepřeskakuj.
</testy>

<postup>
Na začátku přečti zadání celé, prohlédni dotčené soubory a sepiš plán do `docs/progress.json` jako seznam úkolů, který průběžně odškrtáváš. Milníky jdou za sebou; každý končí spuštěním kontrol dotčených balíčků (`pnpm --filter mobile typecheck`, `lint`, `test`, u dotčených částí i `e2e` a `a11y`) a commitem česky v rozkazovacím způsobu, například „Založ aplikaci v prohlížeči“. Při dvou neúspěšných opravách téže chyby zastav, zapiš příčinu do `docs/rozhodnuti.md` a změň postup. Nepředstírej hotovou práci a neupravuj test, aby prošel.

M0. Založení `apps/mobile`. Splň položky z <overit>, které blokují volbu (verze Expo SDK 58 podle `npm view expo version`, kompatibilní `react-native-web`, Expo Router a react-native, TanStack Query), výsledky zapiš do `docs/verification-log.md`. Zkontroluj a případně založ minimum monorepa podle <vychozi_stav>. Vytvoř `apps/mobile` (Expo, Expo Router, TanStack Query, react-native-web, `@expo/metro-runtime`, TypeScript strict, ESLint s pravidly přístupnosti, Vitest), `app.config.ts` s `web.output: "static"`, `metro.config.js` pro monorepo (sledování `packages/*` a `obsah/`), `.env.example`, skripty. Postav `Ramec` (rám šířky telefonu na desktopu, celá šířka na telefonu), `tema` z `@codekom/tokeny`, `Tlacitko` a kořenový layout s prázdnou obrazovkou. `pnpm --filter mobile web` ukáže rám s tématem Javoří Lhoty.

M1. Zdroj dat `api` a `vestavene` s automatickým přepnutím. Rozhraní `ZdrojAplikace`, zod schémata do `packages/typy`, `vestavene` s `uloziste.ts`, `api` nad endpointy 07, `pripojeni.ts` s testem dostupnosti, `PruhUkazky` s režimem a tlačítky. Doplň `apps/web` o chybějící endpointy z <architektura> (komentář `// MINIMUM z promptu 08`) a CORS; ověř test route handlerů a že přednost před catch-all Payloadu funguje. Testy zdroje a přepnutí.

M2. Úvod ukázky: role, obec (ze `zdroj.obce()`), ukázkové přihlášení a kód, relace, přesměrování. Testy a E2E úvodu ve vestavěném režimu.

M3. Občan, Přehled a Deska. Krizový banner nad sdílenými pravidly, rozhlas, aktuality, dokumenty, kontakt a hodiny, Deska se seznamem, filtrem, hledáním, detailem a archivem, simulované oznámení o změně krize (`PruhOznameni`, obnovování po 10 s). Testy pravidel banneru a desky, E2E „krize nahoře a nejde zavřít“.

M4. Občan, Zprávy, Služby a Více. Aktuality a akce, nahlášení závady se zmenšením fotky a volitelnou polohou, sledování stavu, poplatky s QR platbou a štítkem „Ukázka, neplaťte“, rezervace, nastavení oznámení, přístupnost a ochrana údajů. E2E nahlášení se sledovacím kódem.

M5. Úřad. Přehled úřadu s přepínačem správce a redaktor, formulář krize a oznámení s náhledem a potvrzením, koncepty redaktora, ukončení platnosti, vyřízení závady se změnou stavu a veřejnou odpovědí, Budovy jen ke čtení. Testy práv, E2E „úřad vydá krizi a občan ji vidí“ (s 07) a „redaktor jen koncept“.

M6. Dokončení. Axe nad všemi hlavními obrazovkami obou rolí a obou režimů, E2E offline ukázky bez 07, statický export (`export:web`, `serve:web`), kontrola exportu (bez požadavků na třetí strany, `lang="cs"`, funkční obnovení stránky na hluboké trase), `apps/mobile/README.md` s kapitolou „Jak spustit aplikaci v prohlížeči“ (předpoklady, instalace, `pnpm --filter mobile web`, připojení k webu 07, proměnné a původy CORS, export, omezení ukázky, co přidají prompty 02 a 04), doplnění `pnpm demo` v kořeni o aplikaci, pokud to 07 neudělal, zápisy do `docs/rozhodnuti.md` a `docs/verification-log.md`, závěrečná zpráva.
</postup>

<hotovo_kdyz>
Příkazy (všechny bez chyb, bez přeskočených testů; kde 07 chybí, napiš v závěru, co nešlo ověřit):
- `pnpm --filter mobile web` spustí aplikaci; na `http://localhost:8081` je v okně 1280 px aplikace v rámu nejvýš 430 px uprostřed a v okně 390 px na celou šířku.
- `pnpm --filter mobile export:web` vytvoří statický výstup; po `pnpm --filter mobile serve:web` se aplikace načte, hluboká trasa po obnovení stránky funguje a v síťovém provozu nejsou požadavky na třetí strany.
- `pnpm --filter mobile typecheck`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`.
- `pnpm --filter mobile e2e` (Playwright, 390 × 844) včetně scénářů s API 07 a bez něj.
- `pnpm --filter mobile a11y` (axe-core, WCAG 2.0 až 2.2 A a AA a best-practice) s 0 chybami na hlavních obrazovkách obou rolí.
- `pnpm --filter web typecheck` a `pnpm --filter web test` stále projdou, pokud jsi sahal na `apps/web`.

Chování, které jde ukázat:
- Výběr role a obce, ukázkové přihlášení s kódem označeným „ukázkový kód“, nic se neposílá.
- Přehled ukazuje jen jedno, nejzávažnější krizové hlášení s úrovní slovem; Krizovou situaci nejde zavřít.
- Bez běžícího 07 se v pruhu objeví „Offline ukázka“ a všechny toky Občana i Úřadu fungují; s běžícím 07 pruh říká, že je aplikace připojená, a hlášení vydané v roli Úřad se do 10 s ukáže jako banner a simulované oznámení v roli Občan (i v druhém okně prohlížeče).
- Nahlášení závady (s fotkou i bez ní) vrátí číslo a sledovací kód, stav jde dohledat; vyřízení v roli Úřad se zobrazí u občana.
- Poplatky ukazují QR platbu (nebo vysvětlení u ukázkového účtu) a vždy „Ukázka, neplaťte“; nic nelze označit jako zaplacené.
- Správce vydá krizové hlášení přes náhled a potvrzení; redaktor může uložit jen koncept a vydání je mu odepřeno i na serveru (403).
- Budovy v roli Úřad jsou jen ke čtení, bez tlačítek pro odemčení, režim nebo převzetí alarmu.
- Žádné push, žádný e-mail, žádný požadavek na třetí stranu bez kliknutí na mapu.
- README obsahuje kapitolu „Jak spustit aplikaci v prohlížeči“ a `docs/rozhodnuti.md` zapisuje všechny odchylky a doplněné endpointy.
</hotovo_kdyz>

<overit>
Vše zapiš do `docs/verification-log.md` (zdroj, datum, závěr), nebo v kódu nech `[OVĚŘIT]`. Čísla z rešerše ani z tohoto zadání nepoužívej jako fakt.

| Bod | Jak ověřit |
|---|---|
| Aktuální verze Expo SDK 58 a poslední patch; verze `react-native`, `react-native-web` a `expo-router`, které SDK 58 očekává; kompatibilita s React 19.3 | `npm view expo version`, `npx expo install --fix`, `npx expo-doctor`, `https://expo.dev/changelog/sdk-58.md`, `npm view react-native-web version`, README Expo Routeru; návrat na nižší SDK jen s písemným zdůvodněním |
| Chování `expo export --platform web` se `web.output: "static"` (statické HTML pro každou trasu, výchozí adresář výstupu, základní cesta `experiments.baseUrl` při umístění do podadresáře, vložení `EXPO_PUBLIC_*` v době exportu, funkčnost hlubokých tras na prostém statickém serveru) | `docs.expo.dev/router/reference/static-rendering`, zkušební export, `npx serve` |
| Vykreslování v Node při exportu: knihovny a `AsyncStorage`, `window` a `navigator` použité při importu musí být chráněné; chyba exportu znamená přesunout kód do `*.web.tsx` nebo `useEffect` | zkušební export |
| CORS proti 07: název proměnné s povoleným původem, předletový požadavek, hlavičky `Content-Type` a `X-Ukazka-Role`, přednost route handlerů před catch-all Payloadu `[...slug]` | `apps/web/.env.example`, test route handleru, `curl -i -X OPTIONS` |
| Tvar odpovědí `GET /api/obce`, `/prehled`, `/krize/aktivni` a `POST /api/hlaseni-zavad` (včetně toho, zda přijímá multipart a jaká pole) v implementaci 07 | zod schémata v `packages/typy`, kód route handlerů |
| Vitest s `react-native-web` v jsdom (alias `react-native`) a Testing Library; `@axe-core/playwright` nad exportem | dokumentace nástrojů, zkušební test |
| Metro a monorepo: sledování `packages/*` a `obsah/` mimo `apps/mobile`, import JSON z `@codekom/demo-data` | `docs.expo.dev/guides/monorepos`, zkušební export |
| `CODEKOM_DEMO_DNES` v prohlížeči (vložení proměnných s předponou `EXPO_PUBLIC_`) | kód `@codekom/demo-data`, zkušební běh |
| Mapa ve webové variantě: knihovna, poskytovatel dlaždic, licence a podmínky, zda obec v datech má souřadnice | dokumentace poskytovatele, `obec.json`; jinak `[DOPLNIT: poskytovatel dlaždic]` |
| Čl. 50 odst. 4 AI Actu a označení ilustračních fotografií | eur-lex.europa.eu; označujeme vždy |
| Zákon č. 99/2019 Sb., EN 301 549 V3.2.1, WCAG 2.2 AA | e-Sbírka, w3.org/TR/WCAG22 |
</overit>

<zaver>
Na konci napiš krátké shrnutí:
- co je hotové a čím je to ověřené (příkazy a jejich výsledek, počet obrazovek s axe bez chyb, výsledek E2E s API 07 i bez něj),
- co zbývá a proč (například scénáře s API, pokud 07 neproběhl; nativní buildy, push, skutečné přihlášení, ovládání budov a AI asistent jsou záměrně v pozdějších promptech 02, 04 a 05),
- místa `[DOPLNIT]` a `[OVĚŘIT]` s cestou k souboru a odchylky od zadání, včetně doplněných endpointů v `apps/web`,
- co z promptu 02 prototyp předjímá a co musí 02 jen vyměnit (zdroj `api` za ostré API a přihlášení, simulovaná oznámení za push),
- jak prototyp spustit a otevřít (`pnpm --filter mobile web`, případně `pnpm demo`).
</zaver>
