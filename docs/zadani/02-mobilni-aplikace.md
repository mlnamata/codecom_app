# Prompt: Mobilní aplikace pro občany a úřad

Použití: vlož celý text do Claude Code v kořeni repozitáře `codecom`, nebo napiš: Proveď zadání v `prompty/02-mobilni-aplikace.md`.
Závisí na: 01 (web obce a CMS: multi-tenant, `obce`, `castiObce`, krizová hlášení, `GET /api/krize/aktivni`, `GET /api/obce`, `GET /api/obce/<slug>/prehled`), 03 (digitální úřad: `hlaseni-zavad`, služby), 04 (IoT: `budovy`, stav budov), 05 (AI: `POST /api/asistent/dotaz`). Nic z toho nemusí být hotové; kde to chybí, viz <vychozi_stav>.

<kontext>
CodeKom je platforma pro české obce (pilot do 2 000 obyvatel, Plzeňský kraj). Mobilní aplikace je jedna pro iOS a Android a má dvě role: občan (bez účtu čte, s účtem hlásí závady a odebírá oznámení) a pracovník obce (navíc záložka Úřad). Společný kontext je v `CLAUDE.md`, důvody rozhodnutí v `docs/rozhodnuti.md`, návrh v `docs/navrh-platformy/06-iot-dashboard-a-aplikace.md` (část Mobilní aplikace), právní podklady v `docs/pravni-dokumenty.md` (dokument D Zásady ochrany osobních údajů, dokument E Podmínky používání aplikace). Klikací návrhy `design/prototypy/App-Obcan.dc.html` a `App-Urad.dc.html` jsou vodítko vzhledu a toků, ne závazná struktura; obsahují obec Horní Vzorov, ty používej Javoří Lhotu.

Hlášení závad a oznámení jsou nativní hodnota, bez které by App Store aplikaci odmítl jako sbírku odkazů (Apple 4.2.2).

Konkurence (App Store, rešerše 3. 11. 2026; před psaním popisu ověř ručně):
- Munipolis: push výstrahy, zprávy, hlášení závad, více obcí; 4,2/5 z 499 hodnocení, 153,4 MB, iOS 15+. Uděláme lépe: malá instalace (cíl do 60 MB, změř), AI asistent nad dokumenty obce, role úřad ve stejné aplikaci, stav budov.
- V obraze: zprávy z webů obcí a desek, přes 2 600 organizací; 3,4/5 z 68 hodnocení, věk 16+. Uděláme lépe: hlášení závad se stavem, účet, deska s archivem podle pravidel.
</kontext>

<cil>
Na konci stojí v `apps/mobile` aplikace v Expo SDK 58, kterou jde pomocí EAS postavit pro iOS i Android. Demo obec Javoří Lhota funguje celá: onboarding, Domů s krizovým bannerem, úřední deska, hlášení závady s fotkou a polohou, AI asistent, Služby, Profil s mazáním účtu a záložka Úřad pro pracovníka obce. Krizové hlášení publikované s kanálem „aplikace“ dorazí jako push na zařízení do 60 sekund. Bez signálu aplikace ukáže poslední známý stav s časem poslední aktualizace. V `apps/web` je hotový backend: kolekce `obcane` a `mobilni-zarizeni`, přihlášení kódem, registrace tokenů, odesílací úloha s kontrolou receiptů a mazání neplatných tokenů, mazání účtu.
</cil>

<vychozi_stav>
- `apps/web` existuje (Next.js 16 + Payload 3, npm, kolekce aktuality, uredni-deska, kategorie-desky, krizova-hlaseni, zastupitele, dokumenty, media, users; migrace v `src/migrations`; logika banneru v `src/lib/krize.ts`: `vyberBanner`, `lzeSkryt`, `klicSkryti`, `bezpecnyOdkaz`, `UROVNE`). Čisté funkce přesuň do `packages/typy` (bez změny chování, testy webu projdou) a importuj v obou aplikacích.
- `apps/mobile`, `packages/typy`, `packages/tokeny` a pnpm workspace zatím nemusí existovat. Pokud chybí, založ minimální kostru (pnpm workspace, Turborepo `turbo.json`, `packages/typy`, `packages/tokeny` s barvami krizových úrovní podle CLAUDE.md). Nepřepisuj to, co už tam z jiných promptů je.
- Role v `users` jsou dnes `admin` a `redaktor`; sdílené zadání říká `superadmin`, `spravce`, `redaktor` a pole `obec`; prompt 01 hodnotu `admin` datovou migrací přejmenuje na `spravce`. Role čti na serveru jedinou funkcí `rolePracovnika(user, obecId)`, aby šla změnit na jednom místě; zapiš do `docs/rozhodnuti.md`.
- Chybí-li `GET /api/krize/aktivni`, `GET /api/obce`, `GET /api/obce/<slug>/prehled`, `POST /api/hlaseni-zavad` nebo kolekce `hlaseni-zavad`, postav minimální verzi přesně podle kontraktu v <architektura>, označ ji komentářem `// MINIMUM z promptu 02, rozšíří prompt 03` a neimplementuj nic navíc.
- Krizové hlášení dostane vztah `casti` (na `castiObce`) místo textu `tykaSe`. Prompt 01 `tykaSe` nahrazuje polem `casti` (pole slugů z `obce.castiObce`, datová migrace spáruje staré texty). Pokud to web ještě nemá, udělej totéž novou migrací (starou neměň) a `tykaSe` ponech jako zastaralé nepovinné pole.
- Prototypy 07 a 08. Pokud už proběhl prompt 08 (prototyp aplikace v prohlížeči v `apps/mobile`: Expo SDK 58, Expo Router, TanStack Query, react-native-web, zdroje dat `api` a `vestavene`, obrazovky občana i záložka Úřad podle `design/prototypy/App-Obcan.dc.html` a `App-Urad.dc.html`), převezmi kostru, obrazovky, komponenty a testy a UI nepřepisuj. Jen vyměň zdroj dat a doplň ostré věci: zdroj `api` napoj na skutečné endpointy z 01 a 03 (`EXPO_PUBLIC_API_URL`), zdroj `vestavene` nech jako „Offline ukázku“, ukázkové přihlášení nahraď skutečným (kód z e-mailu, heslo a 2FA pracovníka), přepínač role správce a redaktor v Úřadu nahraď rolí z `GET /api/mobilni/me`, přidej push, šifrovanou perzistentní cache, návrhy hlášení offline a EAS profily.
- Pokud už proběhl prompt 07 (prototyp webu bez databáze), endpointy `GET /api/krize/aktivni`, `GET /api/obce`, `GET /api/obce/<slug>/prehled` a `POST /api/hlaseni-zavad` už existují nad demo daty a prompt 01 je přepne na Payload (`CODEKOM_ZDROJ=payload`). Nepřepisuj je a nestav jejich minimální verzi podruhé.
- Pokud 07 ani 08 neproběhly, postupuj podle zbytku zadání.
</vychozi_stav>

<rozsah>
Postav:
1. `apps/mobile`: Expo SDK 58, Expo Router, nová architektura, TypeScript strict (`noUncheckedIndexedAccess`), TanStack Query s perzistentní offline cache, EAS profily (development, preview, production) pro Build, Update i Submit, i18n s češtinou jako výchozím jazykem.
2. Obrazovky občana a záložku Úřad podle <funkce>.
3. Backend v `apps/web`: `obcane`, `mobilni-zarizeni`, endpointy `/api/mobilni/*`, úloha odeslání push, kontrola receiptů, mazání neplatných tokenů, stránka pro smazání účtu a odkaz na zásady.
4. Podklady pro obchody v `apps/mobile/store/`: popisy v češtině, odpovědi pro App Privacy a Google Play Data safety, poznámky pro recenzenty, šablona prohlášení o přístupnosti aplikace.
5. Testy podle <testy>.
6. Seed ukázkové obce Javoří Lhota spustitelný jedním příkazem (`pnpm --filter web seed:demo`). Obsah (obec se 4 částmi Javoří Lhota, Podjavoří, Hájek, Na Rovném, aktuality, dokumenty desky, informační hlášení) bere z `obsah/javori-lhota/*.json` a nic nevymýšlí; příkaz už může existovat z promptu 01, pak jen doplň demo občana a demo pracovníka. Chybí-li pole, je `[DOPLNIT: pole]`.

Mimo rozsah (nedělej, jen zapiš do `docs/rozhodnuti.md`, že se neřešilo):
- přihlášení přes NIA a mobilní klíč eGovernmentu (pro čtení a hlášení není důvod ověřovat totožnost; do produkce NIA jen subjekty s právní povinností),
- přihlášení přes Google, Facebook nebo Apple,
- certifikační pinning (zdůvodnění v <bezpecnost_a_soukromi>),
- ovládání budov z aplikace (topení, otevření dveří); tento prompt staví Budovy v záložce Úřad jen ke čtení. Otevření dveří (biometrie na zařízení, povinný důvod, právo `dvere` v `users.iotPrava`, čerstvé 2FA, audit) přidává prompt 04 jako samostatný milník 9; zapiš do `docs/rozhodnuti.md`,
- veřejná mapa cizích hlášení závad, komentáře a hlasování,
- platby a rezervace přímo v aplikaci (Služby je otevírají přes web obce; mimo IAP viz Apple 3.1.3(e)),
- SMS a rozhlas jako odesílací kanály (pole `kanaly` je může obsahovat, odesílá je jiná služba),
- push pro aktuality a úřední desku (odesílač je obecný, spouštěč je jen pro krizová hlášení a změnu stavu hlášení závady),
- Critical Alerts v buildu (viz <funkce>, Push),
- tablet a web export.
</rozsah>

<architektura>
`apps/mobile`: `app/` (Expo Router: `(onboarding)`, `(tabs)` domu, deska, hlasit, asistent, sluzby, urad; `profil/`; `krize/[id]`), `src/` (api, cache, auth, push, hlaseni, ui, i18n), `.maestro/`, `store/`, `eas.json`, `app.config.ts`, `.env.example`.

Rozhraní, která nesmíš změnit (platí pro všechny části):
- `GET /api/krize/aktivni?obec=<slug>` vrací `{ hlavni, dalsich }` (jedno nejzávažnější aktivní hlášení).
- `GET /api/obce/<slug>/prehled` vrací souhrn: obec (nazev, slug, znak, castiObce, kontakty, uredniHodiny, moduly), krize `{hlavni, dalsich}`, 5 aktualit, 5 dokumentů desky, poslední hlášení rozhlasu. Pokud tvar nesedí s tím, co web vrací, uprav klienta přes zod schéma v `packages/typy` a rozdíl zapiš.
- `GET /api/obce` vrací veřejný seznam obcí se zapnutým modulem `aplikace`, jen pole `{ slug, nazev, okres, znakUrl, castiObce: [{nazev, slug}] }`, cache 5 minut. Staví ho prompt 01 (a prompt 07 nad demo daty); aplikace ho jen volá přes zod schéma `ObceSeznamOdpoved` z `packages/typy`. Neimplementuj ho podruhé.
- `POST /api/mobilni-zarizeni` s tělem `{ token, platforma, obce[], casti[], kategorie[] }`. Kolekce `mobilni-zarizeni` by v Payloadu dostala automatický REST `/api/mobilni-zarizeni`, který koliduje s vlastním koncovým bodem aplikace. Řešení: vlastní Next route handler `src/app/(payload)/api/mobilni-zarizeni/route.ts` (POST) má přednost před catch-all Payloadu [OVĚŘIT testem]; kolekce má REST přístup jen pro superadmina (create, read, update, delete) a handler zapisuje přes Local API s `overrideAccess: true` až po vlastní validaci (zod) a rate limitu. Test: POST jde do vlastního handleru, GET /api/mobilni-zarizeni bez přihlášení vrací 403.
- `POST /api/hlaseni-zavad`, `POST /api/asistent/dotaz` (body `{obec, otazka, kanal: "aplikace"}`, odpověď `{odpoved, zdroje[], jistota}`).
- Obec je tenant (pole `obec`), `castiObce` je pole `{nazev, slug}`.

Rozhraní, která vlastní tento prompt (vše v `apps/web/src/app/(payload)/api/mobilni/...` jako vlastní endpointy Payloadu nebo route handlery; všude zod validace těla, maximální velikost těla, rate limit):

| Endpoint | Účel |
|---|---|
| `POST /api/mobilni/auth/kod` `{email}` | pošle 6místný kód; odpověď je vždy stejná (bez zjišťování, zda účet existuje) |
| `POST /api/mobilni/auth/overit` `{email, kod, souhlas?}` | ověří kód, při prvním ověření založí účet (vyžaduje souhlas s podmínkami a věkem 15+), vrátí `{pristup, obnova, vyprsiVe}` |
| `POST /api/mobilni/auth/obnovit` `{obnova}` | rotuje obnovovací token |
| `POST /api/mobilni/auth/odhlasit` | zneplatní relaci a zařízení |
| `GET /api/mobilni/ucet`, `PATCH ...` | moje údaje (e-mail, sledované obce, nastavení), export JSON |
| `DELETE /api/mobilni/ucet` | smazání účtu po čerstvém ověření kódem |
| `GET /api/mobilni/hlaseni` | moje hlášení závad a jejich stavy |
| `POST /api/mobilni/urad/prihlaseni` `{email, heslo}` | první krok přihlášení pracovníka; vrátí výzvu 2FA |
| `POST /api/mobilni/urad/overit-2fa` | druhý krok; vrátí tokeny s rolí a obcemi |
| `GET /api/mobilni/urad/hlaseni-zavad?stav=&kurzor=` | fronta, `PATCH .../:id` změna stavu, odpověď občanovi, přiřazení |
| `POST /api/mobilni/urad/krize/nahled`, `POST .../krize` | náhled a odeslání krizového hlášení; publikuje jen `spravce` a `superadmin`, `redaktor` volá `POST .../krize` s `koncept: true` a vznikne koncept, publikaci server odmítne 403 |
| `GET /api/mobilni/urad/budovy` | stav budov, jen čtení; když modul IoT chybí, `{dostupne:false}` |
| `GET /api/mobilni/me` | role a obce uživatele; jediný zdroj pravdy pro zobrazení záložky Úřad |

Tok dat: aplikace čte veřejná data přes `prehled` a REST kolekcí Payloadu (jen publikované a vyvěšené, to hlídá `publishedOr` a přístupová pravidla), ukládá je do cache a zobrazuje s časem poslední aktualizace. Zápis jde jen přes endpointy výše. Server kontroluje roli a příslušnost k obci u každého požadavku; skrytí záložky v UI je jen pohodlí.

Tokeny: přístupový token platí 15 minut, obnovovací 30 dní a rotuje; na serveru jsou uložené jen jako otisk. Obojí je v SecureStore. U pracovníka obce `requireAuthentication` (biometrie) a obnovovací token 7 dní.
</architektura>

<datovy_model>
Vše novou migrací Payloadu.

`obcane` (auth vypnutá lokální strategie, vlastní strategie nad tokeny z `mobilni-relace`):

| Pole | Typ | Pravidlo |
|---|---|---|
| email | email | povinné, unikátní, malá písmena |
| jmeno | text(120) | nepovinné |
| sledovaneObce | vztah na `obce`, hasMany | alespoň jedna po onboardingu |
| souhlas | skupina {verzePodminek, souhlasenoVe, vek15} | povinné při založení |
| nastaveni | skupina {kategorie[], tichyRezim {od, do, zapnuto}} | |
| stav | select aktivni, smazan | |
| posledniPrihlaseni | date | |

Přístup: občan čte a mění jen sebe; personál obce nevidí `obcane` vůbec (ve správě jen počet). Žádné pole obce, protože občan může sledovat víc obcí; kolekce je proto mimo plugin multi-tenant a to je zapsané v `docs/rozhodnuti.md`.

`mobilni-kody`: emailHash, kodHash (HMAC s tajemstvím ze serveru), platnostDo (10 minut), pokusy (max 5), pouzito; maže se po expiraci. `mobilni-relace`: ucet (obcan nebo user), obnovaHash, zarizeniId, platnostDo, posledniPouziti.

`mobilni-zarizeni`: token (unikátní, index), platforma (ios | android), obce (vztah, hasMany), casti (pole textů `<obec-slug>:<cast-slug>`), kategorie (select, hasMany: krize, informace_obce, aktuality, uredni_deska, moje_hlaseni), obcan (vztah, nepovinný), tichyRezim, jazyk, verzeAplikace, posledniAktivita, neplatne (boolean). Tvorba a změna jen přes vlastní endpoint: Kolekce `mobilni-zarizeni` by v Payloadu dostala automatický REST `/api/mobilni-zarizeni`, který koliduje s vlastním koncovým bodem aplikace. Řešení: vlastní Next route handler `src/app/(payload)/api/mobilni-zarizeni/route.ts` (POST) má přednost před catch-all Payloadu [OVĚŘIT testem]; kolekce má REST přístup jen pro superadmina (create, read, update, delete) a handler zapisuje přes Local API s `overrideAccess: true` až po vlastní validaci (zod) a rate limitu. Test: POST jde do vlastního handleru, GET /api/mobilni-zarizeni bez přihlášení vrací 403. Personál vidí jen agregované počty. Token se upsertuje podle hodnoty. Zařízení bez účtu je platné: oznámení jsou vázaná na zařízení. Po přihlášení se k zařízení připojí `obcan`, po odhlášení nebo smazání účtu se odpojí a odběry `moje_hlaseni` zaniknou.

`push-tikety`: zarizeni, hlaseni, ticketId, stav, vytvoreno; smazat po vyřízení receiptu nebo po 24 hodinách.

`krizova-hlaseni` (rozšíření): `casti` (pole slugů z `obce.castiObce`, prázdné = celá obec, validace vůči obci, shodně s promptem 01), `pushOdeslanoVe` (date, jen čtení), `pushStatistika` {zamereno, prijato, chyby, neplatnych}, `upozornitZnovu` (boolean, po odeslání se vynuluje).

`hlaseni-zavad` (pouze minimum, pokud ještě neexistuje; rozšíří prompt 03): obec, obcan, cislo (`2026-047`), kategorie, popis(max 1000), poloha {lat, lng}, cast (slug z `castiObce`, nepovinné), fotky (relace na `media`, max 3), stav (`nove`, `prijato`, `v_reseni`, `vyreseno`, `zamitnuto`, shodně s promptem 03), verejnaOdpoved, prirazenoUzivateli (vztah na `users` téže obce), idempotencyKey (unikátní), vytvoreno. Pole a stavy drž přesně podle promptu 03, aby ho rozšířil bez přejmenování.

`mobilni-audit`: kdo, role, akce, objekt, cas (přihlášení pracovníka, krizová hlášení, změny stavu, smazání účtu; bez dalších osobních údajů). `mobilni-limity`: klic, pocet, oknoOd (rate limit v Postgresu, bez další služby).
</datovy_model>

<funkce>
Obecně: každá obrazovka má stavy načítání (kostra s popiskem pro čtečku), prázdný, chybový s tlačítkem „Zkusit znovu“ a offline (poslední data a řádek „Naposledy aktualizováno 3. 11. 2026 v 9:41“, čas v Europe/Prague). Kontakt úřadu, úřední hodiny a adresa jsou v cache vždy (pravidlo 6 z CLAUDE.md).

**Onboarding.** (1) Úvod s odkazem „Pokračovat bez účtu“. (2) Výběr obce ze seznamu obcí s modulem `aplikace` (veřejný `GET /api/obce` z promptu 01), víc obcí povolí. (3) Výběr částí obce, výchozí je celá obec. (4) Vysvětlení oznámení před systémovým dotazem: co dostanu, že jde vypnout po kategoriích, že oznámení nenahrazuje sirény, rozhlas ani IZS; tlačítka „Povolit oznámení“ (až poté systémový dotaz) a „Teď ne“. Aplikace funguje i po odmítnutí (Apple 4.5.4, 5.1.2(i)). (5) Domů.

**Domů.** Krizový banner: jen jedno, nejzávažnější hlášení z `vyberBanner`; úroveň slovem (Krizová situace, Výstraha, Informace obce), barva doplněk; „další hlášení: N“ vede na seznam; Krizovou situaci nejde skrýt, ostatní ano (`lzeSkryt`, `klicSkryti`, takže úprava hlášení ho ukáže znovu). Hlášení s částmi obce vidí jen ten, kdo sleduje danou část nebo celou obec. Pod bannerem hlášení rozhlasu, 5 aktualit, 5 dokumentů desky, kontakt a hodiny. Offline banner zůstane s časem a větou „Údaj může být zastaralý, řiďte se rozhlasem a pokyny IZS“.

**Úřední deska.** Seznam s filtrem kategorie, detail s přílohami (PDF v systémovém prohlížeči, na požádání uložit offline). Cache se při každé úspěšné synchronizaci nahrazuje, ne slučuje, takže sejmutý dokument s volbou „Po sejmutí nezveřejňovat“ zmizí z telefonu i s uloženou přílohou. Offline se dokument po `vyvesenoDo` skryje bez serveru.

**Hlásit závadu** (účet; bez něj výzva k přihlášení a pokračování po něm). Kroky: kategorie, fotky (kamera nebo galerie, až 3), popis, poloha. Fotka: `expo-image-picker` s `exif: false`, pak `expo-image-manipulator` (delší strana 1600 px, JPEG 0,7), čímž zmizí i GPS; před odesláním upozornění, že se nemají fotit lidé ani SPZ (dokument E, 3.4). Poloha volitelná, jen „při používání“, dotaz až po klepnutí na „Použít moji polohu“; jinak špendlík na mapě posunutý ručně, jinak textový popis místa; nikdy na pozadí; posílá se jako pole `poloha`. Odeslání: `POST /api/hlaseni-zavad` jako multipart s hlavičkou `Idempotency-Key` (UUID z otevření návrhu, opakování nevytvoří duplicitu). Offline se hlášení uloží jako návrh (text v šifrované cache, fotky v souborovém úložišti aplikace), obrazovka říká „Čeká na odeslání“ a odešle se po obnovení sítě. Po úspěchu číslo (odpověď promptu 03 je `{cislo, sledovaciKod}`, počáteční stav `nove`). „Moje hlášení“: stavy `nove` (text Přijato), `prijato` (Převzato), `v_reseni` (Řeší se), `vyreseno` (Vyřešeno), `zamitnuto` (Zamítnuto), s odpovědí obce. Upozornění: nouzi nehlaste, volejte 112, 150, 155, 158; hlášení není úřední podání (dokument E, 3.2, 3.3). Aplikace nezobrazuje cizí hlášení, takže Apple 1.2 (UGC) se nespouští; ověř, a přidá-li prompt 03 veřejnou mapu, doplň nahlášení obsahu a blokaci.

**Asistent.** Při první interakci celá obrazovka: je to umělá inteligence, ne úředník; běží na serveru CodeKom v ČR; odpovídá z dokumentů obce a cituje je; může se mýlit; nepsat rodná čísla ani zdravotní údaje. Souhlas se pamatuje lokálně s verzí textu. Štítek „AI asistent“ trvale v záhlaví a u každé odpovědi. Odpověď má zdroje a jistotu; při nízké nabídne kontakt na úřad. Dotaz jde bez identity uživatele; historie jen v paměti. Před odesláním lokální kontrola vzoru rodného čísla a čísla účtu s varováním. Model je na vlastním serveru, ne u třetí strany (Apple 5.1.2(i)); ověř a uveď v poznámkách pro recenzenty.

**Služby.** Služby digitálního úřadu (životní situace, formuláře, platby, rezervace) z `prehled` nebo z endpointu, který určí prompt 03; do té doby odkazy na stránky webu obce `[DOPLNIT: cesta]` v systémovém prohlížeči (`expo-web-browser`). Aplikace nic nevybírá.

**Profil.** Sledované obce a části, kategorie oznámení (krize a výstrahy, informace obce, aktuality, úřední deska, moje hlášení), tichý režim od–do (Krizová situace ho vždy prolomí, text to říká), přihlášení a odhlášení, osobní údaje (zobrazit, export JSON), smazat účet, prohlášení o přístupnosti, zásady (D), podmínky (E), informace o zpracování obce (C), verze, provozovatel a kontakt. Vypnutí kategorie krize ukáže potvrzení s doporučením nechat ji zapnutou (E, 5.3).
Přihlášení: e-mail a 6místný kód (`textContentType="oneTimeCode"`), při prvním přihlášení souhlas s podmínkami a „je mi 15 let nebo více“.
Smazání účtu: vysvětlení, potvrzení čerstvým kódem. Server smaže `obcan`, relace, odběry `moje_hlaseni`, odpojí zařízení a v hlášeních závad odstraní vazbu na občana a kontakt; obsah hlášení patří obci a zůstává podle její retence ([DOPLNIT: retence, potvrdí advokát]). Dokument E slibuje 30 dní, uděláme to hned. Aplikace pak smaže SecureStore, cache i návrhy a vrátí se na onboarding (Apple 5.1.1(v)). Pro Google navíc veřejná stránka `/smazani-uctu` v `apps/web`.

**Záložka Úřad** (jen když `/api/mobilni/me` vrátí roli pracovníka). Přihlášení v Profilu: e-mail a heslo účtu z `users`, pak kód 2FA; token se uloží s biometrií; akce měnící data po 15 minutách nečinnosti znovu biometrie.
- Fronta hlášení závad: filtr stavu, od nejstaršího, detail s fotkami a polohou, změna stavu, veřejná odpověď občanovi (E, 3.5), přiřazení pracovníkovi téže obce. Změna stavu pošle občanovi push (`moje_hlaseni`).
- Krizové hlášení: pole jako ve správě (úroveň, titulek do 90 znaků, text do 300, odkaz https nebo cesta webu obce, části obce, platnost, kanály). Náhled ukáže banner v aplikaci i na webu a počet zařízení, která push dostanou (`krize/nahled`, jen číslo). Potvrzení: shrnutí a držení tlačítka 1,5 s s alternativou pro čtečku (dvojité klepnutí a dialog), u Krizové situace navíc biometrie. Publikovat smí jen `spravce` a `superadmin` obce, na všech úrovních editoru (rozhodnutí zakladatele 4. 11. 2026, shodně s promptem 01); `redaktor` smí hlášení jen uložit jako koncept (bez náhledu počtu zařízení a bez push) a server publikaci od něj odmítne s 403, i kdyby aplikace tlačítko ukázala. Ukončení nastaví `platiDo` s potvrzením. Hlášení nejde smazat.
- Stav budov: barva i slovní stav, teplota, baterie, čas měření; jen čtení. Žádné ovládání, ani otevření dveří, v tomto promptu nevzniká. Otevření dveří (biometrie, důvod, právo `dvere`, audit) do aplikace přidá prompt 04 jako samostatný milník nad adaptérem `GET /api/mobilni/urad/budovy`; do té doby UI žádné tlačítko ovládání nezobrazuje.

**Push, klient.** Po souhlasu `getExpoPushTokenAsync` (opakuje se při selhání offline), registrace `POST /api/mobilni-zarizeni` při startu a každé změně nastavení či tokenu. Android kanály vytvoř při startu s verzovaným ID (po vytvoření jde měnit jen název a popis): `krize_v1` (nejvyšší důležitost), `dulezite_v1` (vysoká), `informace_v1` (výchozí); Krizová situace jde do prvního, Výstraha do druhého, Informace do třetího (chybějící kanál by oznámení skryl). iOS: Krizová situace a Výstraha `timeSensitive`, Informace `active`; ověř entitlement a config plugin. Critical Alerts do buildu nepřidávej; napiš `store/critical-alerts-zadost.md` se zdůvodněním pro Apple (povodně, požár, výpadek vody, zdrojem je obec) a poznámkou, že design na něm nezávisí. Ťuknutí otevře `krize/[id]` (schéma `codekom://`, univerzální odkazy `[DOPLNIT: doména]`); v popředí se zobrazí banner v aplikaci a Domů se obnoví. Duplicity (Expo je „at least once“) se slučují podle `data.hlaseniId` a `data.verze`.

**Push, server (`apps/web`, Payload Jobs).** `afterChange` na `krizova-hlaseni` zařadí úlohu `odeslatPush`, je-li hlášení publikováno, kanály obsahují „aplikace“ a `pushOdeslanoVe` je prázdné, nebo editor zaškrtl `upozornitZnovu`. Úloha se spustí hned (na Vercelu přes `after`/`waitUntil`, ověř), ne až cronem, jinak nejde splnit 60 s. Výběr: obec; části (zařízení bez zvolených částí dané obce bere celou obec, hlášení bez částí jde všem); kategorie (Krizová situace a Výstraha = `krize`, Informace = `informace_obce`); mimo neplatná zařízení a tichý režim (prolomí jen Krizová situace). Dávky po 100, `priority: high` pro krizi a výstrahu, `ttl` v konstantách (návrh 12 h, informace 6 h), 429 a 5xx s exponenciálním čekáním. Titulek s úrovní slovem („Krizová situace: …“), celé oznámení pod 4 KiB, bez osobních údajů. Tikety do `push-tikety`; úloha `zkontrolovatReceipty` za 15 minut (max 1000 ID) označí a smaže zařízení s `DeviceNotRegistered`, ostatní chyby zapíše do `pushStatistika`. Odesílač je za rozhraním `PushOdesilac` (nyní Expo, výhledově FCM a APNs přes `getDevicePushTokenAsync`), protože Expo Push nemá SLA.
</funkce>

<pravidla>
- Krizové hlášení: vždy jen jedno, nejzávažnější; úroveň slovem; Krizovou situaci nejde skrýt; hlášení nenahrazuje varování IZS (CLAUDE.md, pravidlo 2).
- Úřední deska: zveřejněný dokument visel od prvního dne; po sejmutí zmizí z aplikace, je-li označený „Po sejmutí nezveřejňovat“. Cache nikdy nedrží déle, než server dovoluje.
- Účet: veřejný obsah bez účtu; účet jen pro hlášení, odběr vázaný na účet a služby (E, 2; Apple 5.1.1(v), 5.1.2(i)). Samostatně od 15 let (hranici potvrdí advokát).
- Sign in with Apple není nutné, protože aplikace nenabízí přihlášení třetí stranou (Apple 4.8, vlastní systém účtů). Ověř znění a zapiš; vznikne-li Google nebo Facebook login, je nutné přidat.
- Správce a zpracovatel: u hlášení závad a obsahu obce je správcem obec, CodeKom zpracovatelem; u účtu v aplikaci správcem CodeKom (rozhodnutí z 2. 11. 2026). Profil jmenuje provozovatele CodeKom s.r.o. (`[DOPLNIT: IČO, sídlo, e-mail]`) a u každé obce odkaz na její informaci o zpracování.
- Bez souhlasu žádná analytika ani třetí strany (§ 89 odst. 3 zákona č. 127/2005 Sb.): do aplikace žádný analytický SDK. Hlášení pádů jen s přepínačem v Profilu, výchozí vypnuto; nástroj `[DOPLNIT]`.
- AI: čl. 50 AI Actu (platí od 2. 8. 2026): sdělení při první interakci a trvalý štítek; odpovědi se zdrojem; dotazy se neukládají k osobě.
- Platby: přímo na účet obce, aplikace peníze nedrží (CLAUDE.md, pravidlo 3).
- Google Play, vládní informace: aplikace není oficiální aplikací státu ani obce. V popisu „Neoficiální aplikace, provozuje CodeKom s.r.o. jménem obcí“ a zdroje (domény obcí); vyplň Government apps declaration, v poznámkách pro recenzenty doklad pověření pilotní obce `[DOPLNIT]`.
- Apple 5.1.1(ix): aplikaci v regulované oblasti podává právnická osoba, účty vede CodeKom s.r.o. (`[DOPLNIT: IČO, D-U-N-S]`); do jejího založení jen interní testování.
- Přístupnost, zákon č. 99/2019 Sb.: povinným subjektem je obec, aplikace „vytvořená pro něj“ musí vyhovět nepřímo. Cíl EN 301 549 V3.2.1 (WCAG 2.1 AA), stavět podle WCAG 2.2 AA. Prohlášení uvádí aplikace, míru souladu, důvody nesouladu a způsob podání stížnosti; dozor DIA. Šablona `store/prohlaseni-o-pristupnosti.md`, zobrazená i v Profilu; obec ho zveřejní na webu.
- Android: od 31. 8. 2026 musí nové aplikace a aktualizace cílit na API 36. Ověř, že výchozí `targetSdkVersion` SDK 58 to splňuje, jinak nastav v `expo-build-properties`.
</pravidla>

<design_a_pristupnost>
Vzhled: pravidla unslop z CLAUDE.md. Barvy a typografie z `packages/tokeny`; akcent z palety obce (0–2); krizové úrovně pevně podle gov.cz (Informace `#F2F6FC`/`#0C1838`/`#00469B`, Výstraha `#FEF6D8`/`#2A1B00`/`#CA8504`, Krizová situace `#B00A0D`/`#FFFFFF`/`#6E0507`). Text 17 pt, systémové škálování. Světlý i tmavý režim, kontrast textu aspoň 4,5 : 1, ovládacích prvků 3 : 1.

- Každý interaktivní prvek má `accessibilityRole`, srozumitelný `accessibilityLabel`, `accessibilityState` a tam, kde výsledek není zřejmý, `accessibilityHint`. Dekorativní obrázky skryté, ostatní mají popis.
- Cíle aspoň 44 × 44 pt (iOS) a 48 dp (Android), mezera mezi sousedními aspoň 8.
- Dynamická velikost písma bez pevných výšek; `maxFontSizeMultiplier` jen u záložkové lišty (nejvýš 1,5). Ruční kontrola při 200 % na šířce 320 pt: nic se neořízne ani nepřekrývá.
- Krizový banner čtečka přečte jako první na Domů; jeho změna za běhu se ohlásí (`accessibilityLiveRegion`, na iOS `announceForAccessibility`; u Krizové situace asertivně).
- Pořadí fokusu odpovídá vizuálnímu; modální okna fokus zachytí a vrátí; chyby formulářů se oznámí.
- Respektuj `AccessibilityInfo.isReduceMotionEnabled`; bez blikání. Úroveň, stav hlášení i budovy jsou slovem, barva je doplněk.
- Záložky: pro občana Domů, Deska, Hlásit, Asistent, Služby; Profil je ikona v záhlaví; pro pracovníka šestá záložka Úřad. Při velkém písmu popisek zalamuj, nezmenšuj.
- VoiceOver a TalkBack projdi ručně a výsledek zapiš do `docs/verification-log.md`.
</design_a_pristupnost>

<bezpecnost_a_soukromi>
- Standard OWASP MASVS L1 pro celou aplikaci, pro roli úřad L2 tam, kde to nestojí složitost (biometrie, krátké relace). Projdi kategorie MASVS a zapiš tabulku požadavek / stav / důkaz do `docs/mobil-masvs.md`.
- Tokeny jen v `expo-secure-store` (hodnoty pod 2 KB); v MMKV ani AsyncStorage žádné tokeny ani osobní údaje. Data občana v cache jsou v samostatné šifrované instanci s klíčem ze SecureStore a při odhlášení a smazání účtu se ničí; veřejná data v běžné cache.
- V aplikaci žádný tajný klíč. Do `EXPO_PUBLIC_*` jen veřejné hodnoty (adresa API, ID projektu, omezený klíč dlaždic, pokud ho poskytovatel vyžaduje). `.env.example` popisuje proměnné; `MOBILNI_KOD_PEPPER`, přístup k Expo push a demo kódy jsou jen serverové.
- Certificate pinning neřešíme: komunikujeme s vlastním API na běžném veřejném certifikátu, který obmění hostitel; pevný pin by při rotaci nebo změně hostingu aplikaci vyřadil a oprava jde jen novou verzí z obchodu, což u krizových hlášení hrozí víc než útok, který pinning řeší. Zapiš do `docs/rozhodnuti.md`.
- Validace: zod na všech vstupech (délky, výčty, formáty), limit těla, u nahrávání JPEG max 1,5 MB a 3 fotky, serverové překódování obrázku bez metadat (test s fixturou s GPS), kontrola, že `obec` a `casti` patří k sobě. Odkazy jen přes `bezpecnyOdkaz`, žádné HTML z API.
- Rate limit na serveru: kód 5/h na e-mail a 20/h na IP, 5 pokusů na kód, hlášení závad 10/den na účet, asistent 30/h na IP, registrace zařízení 20/h na IP, zamčení pracovníka po 5 chybách.
- Soukromí: poloha jen v popředí a jen při hlášení; foto a poloha jdou jen k obci.
- Demo pro recenzenty: kódem z e-mailu se recenzent nepřihlásí. Přes serverové proměnné povol jeden předem daný e-mail občana a jednoho demo pracovníka s pevným kódem bez skutečného 2FA, oba jen pro obec Javoří Lhota se seed daty, s vlastním rate limitem, ve výchozím stavu vypnuté (`[DOPLNIT: demo e-mail]`). Vědomý kompromis zapiš do `docs/rozhodnuti.md`.
- Obchody: `PrivacyInfo.xcprivacy` (nic nesleduje, deklarované API podle knihoven; ověř ITMS-91056 při uploadu), App Privacy a Data safety v `store/`: e-mail (účet), přesná poloha (jen při hlášení, volitelná), fotky (volitelné), push token, diagnostika jen s opt-in; žádné sledování. Věkové hodnocení vyplň v obou obchodech s ohledem na fotky a AI chat; předpoklad je nízké, ověř. Popisy a poznámky pro recenzenty česky.
</bezpecnost_a_soukromi>

<testy>
Ověřují se pravidla, ne pokrytí řádků. Žádný test se nepřeskakuje ani neupravuje, aby prošel.

| Co | Nástroj |
|---|---|
| Pravidla banneru: nejzávažnější vyhrává, Krizová situace nejde skrýt, skrytí se po úpravě vrací, filtr částí, platnost od–do, hranice času v Europe/Prague | Jest + RNTL, sdílené testy v `packages/typy` |
| Offline: poslední data s „Naposledy aktualizováno“, banner s upozorněním; sejmuté dokumenty zmizí po synchronizaci; dokument po `vyvesenoDo` zmizí i offline | RNTL, mock NetInfo a API (MSW) |
| Hlášení závady: idempotence, offline návrh, parametry komprese; asistent: sdělení o AI při prvním použití, trvalý štítek, varování před rodným číslem | RNTL |
| Server: výběr zařízení pro push (obec, části, kategorie, tichý režim, neplatná, prolomení Krizovou situací), dávky po 100, retry při 429, `DeviceNotRegistered` smaže zařízení | Vitest + PGlite, mock Expo API |
| Server: přihlášení kódem (stejná odpověď pro neexistující e-mail, vypršení, 5 pokusů, rate limity, rotace obnovy, souhlas), smazání účtu, role (občan nemá `/urad/*`, redaktor nepublikuje krizové hlášení na žádné úrovni editoru a dostane 403, správce a superadmin ano, pracovník jen svou obec), `mobilni-zarizeni` (POST jde do vlastního handleru, GET /api/mobilni-zarizeni bez přihlášení vrací 403, REST kolekce jen pro superadmina), EXIF/GPS pryč po zpracování | Vitest |
| E2E: onboarding, hlášení závady, příjem notifikace | Maestro v `.maestro/` na simulátorech iOS a Android |
| Přístupnost | `eslint-plugin-react-native-a11y` jako chyba; test vykresleného stromu vyžaduje role, popisky a minimální rozměry z tokenů; ruční VoiceOver a TalkBack |
| Typy, styl | `tsc --noEmit`, ESLint |

Příjem notifikace: iOS `xcrun simctl push` a ťuknutí otevře detail; Android emulátor s obrazem Google Play a skutečným Expo tokenem. Dobu od publikace do doručení měří skript `scripts/push-latence.ts`; možnosti Maestro u oznámení ověř v jeho dokumentaci.
</testy>

<postup>
Na začátku sepiš plán a seznam úkolů (`docs/progress.json`) a průběžně odškrtávej. Po každém milníku spusť typecheck, lint a testy dotčených balíčků a commitni (česky, rozkazovací způsob). Při dvou neúspěšných opravách téže chyby zastav, zapiš příčinu a změň postup.

0. Ověření a plán. Splň všechny body z <overit>, které blokují volbu (verze SDK 58, React Native, minimální iOS a Xcode, MMKV, TanStack Query, Router, mapa). Výsledky do `docs/verification-log.md`, rozhodnutí do `docs/rozhodnuti.md`.
1. Kostra. Pnpm workspace a Turborepo (pokud chybí), `apps/mobile` s Expo Routerem, strict TypeScript, ESLint s a11y pravidly, Jest, `eas.json`, `app.config.ts` s config pluginy (`expo-notifications`, `expo-secure-store`, `expo-build-properties`), `.env.example`, přesun logiky banneru do `packages/typy`. Development build spustitelný na simulátoru (ne Expo Go).
2. Backend účtů. Migrace, `obcane`, kódy, relace, rate limity, `me`, mazání účtu, stránka `/smazani-uctu`, testy.
3. Onboarding, Domů, cache. Seznam obcí, výběr částí, vysvětlení oznámení, přehled, krizový banner, perzistentní cache s časem poslední aktualizace, offline stavy, seed Javoří Lhota.
4. Deska, Služby, Profil. Úřední deska s pravidly cache, Služby, Profil včetně přihlášení, smazání účtu, přístupnosti a právních textů.
5. Hlášení závad. Kamera, galerie, komprese, poloha, mapa se špendlíkem, fronta návrhů, Moje hlášení, serverová část a EXIF.
6. Push. Kanály, registrace, kolekce `mobilni-zarizeni`, hook a úloha, receipty, mazání tokenů, deep linky, měření doby doručení.
7. Úřad. Přihlášení pracovníka, fronta hlášení, krizové hlášení s náhledem a potvrzením, stav budov, audit.
8. Asistent. Sdělení podle čl. 50, chat, zdroje, varování před citlivými údaji.
9. Dokončení. Přístupnost (ruční průchod), Maestro toky, MASVS tabulka, podklady pro obchody v `store/`, EAS build pro iOS i Android profilu `preview`, `npx expo-doctor` bez chyb, závěrečná zpráva.
</postup>

<hotovo_kdyz>
Příkazy (všechny bez chyb, bez přeskočených testů):
- `pnpm --filter mobile typecheck`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`
- `pnpm --filter web typecheck`, `pnpm --filter web test` (testy backendu a testy úřední desky a banneru z promptu 01, pokud už existují; v repu dnes žádné nejsou)
- Pokud proběhl prompt 08, jeho testy a e2e nad `api` i `vestavene` zdrojem dál procházejí beze změny očekávání.
- `pnpm --filter mobile e2e` (Maestro: onboarding, hlášení závady, příjem notifikace)
- `pnpm --filter mobile a11y` (a11y lint a test stromu)
- `npx expo-doctor` v `apps/mobile` bez chyb
- `eas build --profile preview --platform all` uspěje (iOS vyžaduje `[DOPLNIT: Apple Developer účet CodeKom s.r.o.]`; bez něj doložit lokální `expo run:ios` a `expo run:android` a napsat, co chybí)

Chování, které jde ukázat na demo obci Javoří Lhota:
- Onboarding bez účtu přes výběr obce a částí, vysvětlení oznámení předchází systémovému dotazu a po „Teď ne“ aplikace funguje.
- Publikace krizového hlášení s kanálem „aplikace“ ve správě webu doručí push na zařízení do 60 sekund (změřeno skriptem, hodnota zapsaná v závěru) a banner na Domů ukáže pouze nejzávažnější hlášení.
- V režimu letadlo Domů a Úřední deska ukážou „Naposledy aktualizováno …“.
- Hlášení závady s fotkou a polohou se odešle, dostane číslo a stav, v odeslané fotce nejsou EXIF ani GPS (ověřeno testem), pracovník obce změní stav a občan dostane push.
- Smazání účtu v aplikaci funguje, stránka `/smazani-uctu` také, po něm je e-mail volný pro nové založení.
- Pracovník obce se přihlásí heslem a 2FA, vidí Úřad, odešle krizové hlášení přes náhled a potvrzení; občan nemůže a redaktor uloží jen koncept (publikace vrací 403).
- Asistent při prvním otevření ukáže sdělení, že jde o AI, a odpoví se zdrojem.
- VoiceOver a TalkBack na Domů, Hlásit a Profil bez blokujících chyb; při 200 % písma na 320 pt se nic neořízne.
- `store/` obsahuje popisy v češtině, tabulky pro App Privacy a Data safety, poznámky pro recenzenty, šablonu prohlášení o přístupnosti a žádost o Critical Alerts.
</hotovo_kdyz>

<overit>
Vše zapiš do `docs/verification-log.md` (zdroj, datum, závěr), nebo v kódu nech `[OVĚŘIT]`. Čísla z rešerše nepoužívej jako fakt.

| Bod | Jak ověřit |
|---|---|
| SDK 58 (`expo@58.0.0` vyšlo 29. 9. 2026, dist-tag latest `58.0.23` k 3. 11. 2026): verze React Native, minimální iOS a Xcode, breaking changes, Hermes v1 regrese (opravená v 57.0.9), scene lifecycle pro iOS 27 | `npm view expo version`, `https://expo.dev/changelog/sdk-58.md`, `npx expo install --fix`, `npx expo-doctor`; návrat na 57 jen s písemným zdůvodněním |
| TanStack Query v5 a `react-native-mmkv` s RN pro SDK 58 (záloha: perzistence přes `expo-sqlite`); knihovna i18n | `npm view`, README, zkušební build |
| Expo Router bez React Navigation: deep linking, univerzální odkazy, Native Tabs a jejich přístupnost | docs.expo.dev/router |
| EAS Update vůči Apple 3.3.2; `eas update` vyžaduje `--environment` | docs.expo.dev/eas-update, App Review Guidelines |
| Time Sensitive entitlement, `USE_FULL_SCREEN_INTENT` a DND, reálná šance na Critical Alerts | developer.apple.com, developer.android.com |
| Google Play: smazání účtu (odkaz mimo aplikaci i uvnitř), Data safety, Government apps declaration, věk při fotkách a AI | Play Console, support.google.com |
| Apple 4.8, 5.1.1(v), 5.1.2(i), 3.1.3(e), 1.2; privacy manifest, required-reason API, věkový dotazník | developer.apple.com |
| `exif: false` a metadata po `expo-image-manipulator` na obou platformách; Android 14 selected photos; `requireAuthentication` bez biometrie | docs.expo.dev, test na zařízení |
| Mapa se špendlíkem: knihovna a poskytovatel dlaždic, licence, veřejný klíč (`[DOPLNIT: poskytovatel dlaždic]`) | docs a podmínky poskytovatele |
| OWASP MASVS (aktuální verze) a MASTG | mas.owasp.org |
| Čl. 50 AI Act a Digital Omnibus | eur-lex.europa.eu |
| Zákon č. 99/2019 Sb., EN 301 549 V3.2.1; zda DIA řeší soukromé dodavatele | e-Sbírka, dia.gov.cz; dotaz na DIA |
| Hlášenka, Obec v mobilu a hodnocení konkurentů na Google Play (rešerše je neověřila) | ruční průchod listingů |
| NIA pro soukromého dodavatele, EAA pro platby a rezervace, EU trader status v App Store | jen zapsat jako otevřené otázky pro DIA a právníka |
</overit>

<zaver>
Na konci napiš krátké shrnutí:
- co je hotové a čím je to ověřené (příkazy a jejich výsledek, naměřená doba doručení push v sekundách, výsledek EAS buildů),
- co zbývá a proč (například Critical Alerts, přímý FCM a APNs, veřejná mapa hlášení),
- místa `[DOPLNIT]` a `[OVĚŘIT]` s cestou k souboru a odchylky od zadání,
- úkoly pro zakladatele: založení CodeKom s.r.o., vývojářské účty Apple a Google, doména a univerzální odkazy, e-mailová služba pro kódy, dotaz na DIA, kontrola dokumentů D a E advokátem.
</zaver>
