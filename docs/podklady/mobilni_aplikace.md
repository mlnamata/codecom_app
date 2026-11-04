# CodeKom mobilní aplikace (Expo/React Native, role občan + úřad) – podklady, stav k 3. 11. 2026

Pozn.: Výzkum proběhl přes web search/fetch; několik primárních stránek (Apple HIG push/critical alerts, Google Data safety, Hlášenka, Obec v mobilu, Google Play hodnocení) se nepodařilo ověřit – viz Gaps. Neověřené věci z pozadového know-how jsou výslovně označeny "NEOVĚŘENO".

## 1. Expo SDK, architektura, EAS, offline, i18n

### Takeaway
Aktuální stabilní je Expo SDK 57 (30. 6. 2026; RN 0.86, React 19.2). New Architecture je povinná (legacy odstraněna od SDK 55), Hermes v1 je default od SDK 56. Doporučení: začít rovnou na SDK 57 (SDK 55/56 mají Hermes v1 memory regresi opravenou až v 57.0.9), Expo Router, development build (ne Expo Go).

### Cited Findings
- SDK 55: RN 0.83, React 19.2; Legacy Architecture už nepodporována (SDK 54 byla poslední s ní), volba `newArchEnabled` odstraněna z app.json; iOS min 15.1; Xcode 26 min; Node 20.19.4+/22.13+/24.3+; Expo Router default šablona používá Native Tabs a `/src/app`; pole `notification` v app.json odstraněno (nutno použít config plugin expo-notifications); push v Expo Go na Androidu háže chybu; `eas update` nově vyžaduje `--environment`; edge-to-edge povinné při targetu Android 16+ — [SDK 55 changelog](https://expo.dev/changelog/sdk-55.md)
- SDK 56 (21. 5. 2026): RN 0.85, React 19.2; iOS min 16.4; Xcode 26.4; Hermes v1 default (opt-out `useHermesV1` v expo-build-properties); expo-router už nezávisí na React Navigation (codemod `sdk-56-expo-router-react-navigation-replace`); `expo/fetch` je výchozí `fetch`; `expo-file-system` copy()/move() jsou async; TypeScript 6.0.3; `@expo/vector-icons` už není závislost `expo` — [SDK 56 changelog](https://expo.dev/changelog/sdk-56.md)
- SDK 57 (30. 6. 2026): RN 0.86, React 19.2; Hermes V1 memory regrese (zděděná z 56, týká se hlavně reanimated/worklets) opravena v `expo@57.0.9`; `expo prebuild` nově defaultně regeneruje android/ios (použít `--no-clean` pro zachování); bez deklarovaných breaking changes; Xcode 27/iOS 27 SDK vyžaduje UIKit scene-based lifecycle, v SDK 57 opt-in přes `ios.enableSceneSupport` (expo-build-properties, od `expo@57.0.23`), SDK 58 to má defaultně; worklets bundle mode experimentální, nedoporučen pro produkci — [SDK 57 changelog](https://expo.dev/changelog/sdk-57.md)
- Expo SQLite: v SDK 56 nativní ArrayBuffer podpora (blob sloupce, bind params) — [SDK 56 changelog](https://expo.dev/changelog/sdk-56.md)
- expo-secure-store: iOS Keychain, Android SharedPreferences šifrované Android Keystore; `requireAuthentication` (biometrie; při změně biometrie klíč zneplatněn, čtení vrací null); iOS data mohou přežít reinstalaci (nespoléhat), Android ne; limit velikosti není vynucen Expo, ale starší iOS odmítaly >~2048 B → neukládat velké blobby; Android Auto Backup SecureStore ignoruje automaticky — [SecureStore docs](https://docs.expo.dev/versions/latest/sdk/secure-store/)

### Inferences
- Pro app dnes: SDK 57 (min iOS pravděpodobně 16.4 jako v 56 – SDK 57 changelog min. OS neuvádí, ověřit), development build + EAS Build; SDK 58 přinese scene lifecycle defaultně (iOS 27) – plánovat upgrade do cca Q1 2027 (NEOVĚŘENO datum vydání 58).
- Offline cache: kombinace TanStack Query (persist) + expo-sqlite pro dokumenty/úřední desku/frontu hlášení; MMKV (react-native-mmkv) jen pro drobné preference; tokeny do SecureStore. To je doporučení z know-how, v tomto výzkumu nebylo zdrojově ověřeno (NEOVĚŘENO: aktuální verze TanStack Query v5 / MMKV v4 kompatibilita s RN 0.86).
- Roli "úřad" řešit server-side (RLS/claims), ne jen skrytím tabu v UI.

### Gaps
- Nezkoumáno: konkrétní verze TanStack Query, react-native-mmkv, i18n (i18next vs expo-localization + lingui), EAS Update politika (store pravidla pro OTA: Apple 3.3.2 – JS update nesmí měnit primární účel) a EAS Submit/pricing/limity. Doporučit samostatný dotaz.
- Expo Router změna v SDK 56 (bez React Navigation) – dopad na deep linking/universal links nezkoumán.

## 2. Push notifikace (expo-notifications vs FCM/APNs, critical alerts, segmentace)

### Takeaway
Expo Push Service je pro MVP použitelný, ale nemá SLA, doručení je "at least once" a vyžaduje kontrolu receiptů. Pro krizové výstrahy je rozumné mít abstrakci odesílače a možnost přejít na přímé FCM/APNs (`getDevicePushTokenAsync`). iOS Critical Alerts je pro obecní krizové výstrahy teoreticky způsobilé (emergency/safety), ale schvaluje Apple ručně; počítat s Time Sensitive jako realisticky jistou variantou.

### Cited Findings
- Expo Push: endpoint `exp.host/--/api/v2/push/send`; limit 600 notifikací/s na projekt; batch max 100; ticket `ok` ≠ doručeno; receipts se vyzvedávají po ~15 min (max 1000 ID/požadavek, mažou se po 24 h); `DeviceNotRegistered` = přestat posílat na token; payload max 4 KiB; retry 429/5xx s backoff; priority `high` (APNs 10) vs normal (APNs 5, na Androidu může být zpožděno v doze); `ttl` – příliš nízké může zabránit doručení na dozing Android; `interruptionLevel`: active/critical/passive/time-sensitive; `channelId` – pokud kanál na zařízení neexistuje, notifikace se nezobrazí; „Expo nemá SLA, doručení at-least-once, duplicity možné“; volitelné enhanced push security (access token) — [Expo: sending notifications](https://docs.expo.dev/push-notifications/sending-notifications/)
- expo-notifications: Android 8+ vyžaduje kanály (`setNotificationChannelAsync`; po vytvoření lze měnit jen jméno a popis → verzovat ID kanálů, např. `crisis_v1`); `critical` interruption level vyžaduje entitlement; `getDevicePushTokenAsync` vrací nativní FCM/APNs token, `getExpoPushTokenAsync` Expo token (může selhat offline – retry); background/data-only notifikace přes expo-task-manager + `contentAvailable` a `enableBackgroundRemoteNotifications`; remote push nefunguje v Expo Go na Androidu od SDK 53 — [expo-notifications docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- Apple Critical Alerts: entitlement jen pro health/safety/security/emergency (např. severe-weather a emergency notification apps); žádost podává Account Holder přes formulář, ruční posouzení dny až týdny; časté zamítnutí: generické zdůvodnění nebo "stačí Time Sensitive"; po schválení: entitlement + runtime `criticalAlert` autorizace + `sound.critical = 1`; uživatel musí povolit a může vypnout — [newly.app](https://newly.app/articles/critical-alerts-entitlement) (sekundární zdroj, ne Apple)
- Apple engineer na fóru: vývoj lze začít s běžnými notifikacemi, přechod na Critical Alerts je malá změna; prototyp k žádosti není nutný — [Apple Developer Forums](https://developer.apple.com/forums/thread/794822)
- Apple App Review 4.5.4: push nesmí být vyžadován pro fungování appky, neposílat citlivé osobní údaje, marketing jen s opt-in a možností odhlášení; 5.1.2(i): nelze vynucovat zapnutí push/polohy pro přístup k funkcím — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Inferences
- Segmentace: topics/tagy řešit na vlastním backendu (tabulka `subscription(user_id/device_id, obec_id, cast_obce_id, kategorie)`), odeslání po batchích 100 přes Expo SDK nebo FCM/APNs; Expo nemá nativní topics. Čtení bez účtu → push je vázán na zařízení (device_id + token), ne na uživatele.
- Doporučená vrstvení: 3 Android kanály (krizové = IMPORTANCE_MAX/bypass DND se souhlasem uživatele, důležité, informační); iOS: krizové `time-sensitive` hned, `critical` podat jako žádost (zdůvodnění: povodně, požár, výpadek vody; „obec/IZS je zdroj“), ale design nesmí na něm záviset. Doporučit dvoukanálovou redundanci (push + SMS/hlášení rozhlasu u obce) – zdroje v tomto výzkumu chybí.
- Právní/odpovědnostní: aplikace NENÍ náhradou oficiálního varování (IZS, Cell Broadcast / Veřejné varování); uvést v podmínkách a UI (NEOVĚŘENO – nutná právní konzultace; Cell Broadcast v ČR nezkoumán).

### Gaps
- Apple dokumentace Time Sensitive / entitlement `com.apple.developer.usernotifications.time-sensitive` a Android `USE_FULL_SCREEN_INTENT`/DND-bypass policy (Google Play omezení) nebyly ověřeny primárně.
- Neznámá reálná pravděpodobnost schválení Critical Alerts soukromému vendorovi jednající za obce (Apple vyžaduje, aby žádost podal vydavatel appky; rozhodnutí nelze předvídat). Doporučená mitigace: žádat o entitlement od MVP, ale nepočítat s ním.
- Spolehlivost Expo push v praxi (statistiky doručení) – žádný nezávislý zdroj.

## 3. Autentizace občana, Sign in with Apple, smazání účtu, NIA

### Takeaway
Passwordless e-mail OTP je v pořádku a Apple 4.8 se na něj nevztahuje (jen vlastní login systém) – Sign in with Apple je povinný jen když nabídnete Google/Facebook apod. Smazání účtu uvnitř appky je povinné (Apple 5.1.1(v); Google obdobně – viz Gaps). Přihlášení přes NIA/Identitu občana pro soukromou firmu jednající pro obce je v produkci nejspíš nedosažitelné bez zákonného důvodu k ověřování identity – nezařazovat do MVP.

### Cited Findings
- Apple 4.8: třetí strana/sociální login jako primární účet ⇒ nutno nabídnout ekvivalent (limit dat na jméno+e-mail, skrytí e-mailu, bez trackingu). Výjimky: vlastní account systém; appka používá „government or industry-backed citizen identification system or electronic ID“ — [App Review Guidelines 4.8](https://developer.apple.com/app-store/review/guidelines/)
- Apple 5.1.1(v): bez významných účtových funkcí umožnit používání bez loginu; vytváří-li appka účty, musí nabídnout smazání účtu v appce; nesmí vyžadovat osobní údaje mimo nutné — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Apple 5.1.1(ix): appky v silně regulovaných oblastech nebo s citlivými údaji musí podávat právnická osoba, ne individuální vývojář ⇒ účet vývojáře na CodeKom s.r.o. (D-U-N-S) — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- NIA kvalifikovaný poskytovatel (SeP): registrace přes portál jen pro OVM; ostatní organizace přímo přes DIA datovou schránkou; do produkčního prostředí lze připojit jen soukromoprávní subjekty, „kterým právní předpis ukládá ověřovat totožnost s využitím elektronické identifikace“; žádost musí uvést právní ustanovení a požadovanou LoA; testovací prostředí žádá datovkou na DIA (ID DS yukd8p7); časy a poplatky v příručce neuvedeny — [Příručka kvalifikovaného poskytovatele (info.identita.gov.cz)](https://info.identita.gov.cz/download/SeP_PriruckaKvalifikovanehoPoskytovatele.pdf)
- Mobilní klíč eGovernmentu: login přes NIA na úrovni „značná“ přes QR kód (uživatel skenuje QR zobrazený službou), vyžaduje NIA účet, zámek obrazovky, nepodporuje rootnutá zařízení; pro „vysokou“ úroveň neslouží; popis ze 2020 – app-to-app/deep-link integrace třetích stran nepopsána — [Lupa.cz](https://www.lupa.cz/clanky/mobilni-klic-ceskeho-egovernmentu-ven-ze-slepe-ulicky/) (stará, sekundární)

### Inferences
- Realistická cesta k NIA: obec (OVM) jako SeP a CodeKom jako její dodavatel/zpracovatel (přihlášení obce přes portál NIA), nikoli CodeKom jako SeP – nutno ověřit s DIA. Pro čtení desky a hlášení závad není zákonný důvod vyžadovat eID. Pro budoucí funkce (podání, platby daní) může být relevantní – řešit per obec.
- Supabase Auth: e-mail OTP (6místný kód, ne magic link kvůli přepínání appek; rate limit, expirace), session refresh token v SecureStore. Apple přijímá bez Sign in with Apple, pokud nebude Google/Facebook login.
- Smazání účtu: in-app tlačítko → backend smaže/anonymizuje účet + push tokeny + hlášení dle retenční politiky obce (hlášení patří obci – právní rozdělení rolí správce/zpracovatel, viz dohoda s obcí); web URL pro smazání je potřeba i pro Google Play.

### Gaps
- Primární text Google Play „Account deletion“ požadavek (web URL + in-app, Data safety) nebyl stažen; v NEOVĚŘENO podobě platí od 2024 pro všechny appky vytvářející účty.
- NIA: zda DIA připustí soukromý SaaS dodavatel obcí; Identita občana pro appky (OIDC/SAML, ne mobilní SDK) – neověřeno; stav eDoklad/Občanka v mobilu (Lupa titul naznačuje start „od ledna“, rok neověřen).

## 4. Požadavky obchodů 2026 (privacy manifest, Data safety, API level, government policy, věk)

### Takeaway
Povinný target Android 16 (API 36) pro nové appky a aktualizace od 31. 8. 2026 – už platí; Expo SDK 55+ to splňuje. Apple vyžaduje privacy manifesty (appky i SDK) a nový věkový dotazník (platný do 31. 1. 2026). Google Play vyžaduje Government apps declaration; Apple nemá zvláštní „government“ guideline, ale zrcadlová legální entita a nezavádějící prezentace jsou nutné.

### Cited Findings
- Google Play: od 31. 8. 2026 nové appky a aktualizace musí targetovat Android 16 (API 36) (telefony/tablety); existující appky min API 35, jinak nejsou dostupné novým uživatelům na novějších verzích Androidu; možnost prodloužení do 1. 11. 2026 (tj. už skončilo) — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)
- Google Play pro vládní informace: vládní appky – doporučen oficiální e-mail; appky usnadňující vládní proces (volby, ověření ID) mohou potřebovat písemný doklad oprávnění od vládního subjektu; nespojené appky komunikující vládní informace musí uvést zdroje v popisu a uvést, že nereprezentují vládu; od 31. 1. 2023 povinné „Government apps declaration“ v Play Console; privacy policy musí být v appce i na listingu; zákaz falešného tvrzení vládní příslušnosti — [Google Play: government information](https://support.google.com/googleplay/android-developer/answer/9514050?hl=en)
- Apple privacy manifest: `PrivacyInfo.xcprivacy` s klíči tracking, tracking domains, collected data types, accessed API types; Hermes je na seznamu SDK vyžadujících manifest (seznam 86 položek); chyba ITMS-91056 při uploadu; platnost 1. 5. 2024 (required-reason API) a 12. 2. 2025 (manifesty SDK) — [newly.app guide (říjen 2026)](https://newly.app/guides/third-party-sdk-privacy-manifest) (sekundární; ověřit u Applu)
- Apple věk: nové 13+/16+/18+; nutno odpovědět na nový dotazník v App Store Connect do 31. 1. 2026; AI/chatbot funkce je třeba zohlednit u hodnocení; lze nastavit vyšší věk — [Apple Developer News](https://developer.apple.com/news/?id=ks775ehf)
- Apple 1.2 UGC: pokud uživatelé nahrávají obsah (foto v hlášení), appka potřebuje filtr nevhodného obsahu, nahlášení, blokaci uživatelů, kontakt — relevantní pro hlášení závad (viditelnost pro veřejnost) [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Apple 3.1.3(e): platby za služby spotřebované mimo appku (poplatky obce, rezervace) mimo IAP (Apple Pay/karta) — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Apple 4.2.2: nesmí být jen sbírka odkazů/marketingový obsah → appka musí mít nativní hodnotu (push, hlášení, offline) — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Apple 5.1.2(i): sdílení osobních údajů s třetími stranami včetně third-party AI vyžaduje výslovné povolení → AI asistent: pokud dotazy jdou do externího LLM, zobrazit souhlas — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Inferences
- Pro review: demo účet roli úřad (Apple vyžaduje přihlašovací údaje), popis, že obsah poskytují obce; v App Review Notes odkaz na smlouvu/pověření obce (Google může chtít doklad oprávnění); v listingu uvést „Neoficiální/provozuje CodeKom s.r.o. jménem obcí“ a zdroje (domény obcí).
- Data safety (Google) a App Privacy (Apple) předvyplnit: e-mail (account), poloha přesná (jen při hlášení, ne sledování), fotky, crash diagnostika, push token/device ID; nelinkovat k tracking.
- Věk: pravděpodobně 4+/Everyone, ale UGC fotky + AI chat mohou zvednout (NEOVĚŘENO).

### Gaps
- Nestaženy primární stránky Apple privacy manifest/App Privacy a Google Data safety form.
- Kontrola, zda Google Play stále vyžaduje pro nové osobní účty 12 testerů/14 dní (relevantní jen pokud by nebyl organizační účet) – neověřeno; CodeKom s.r.o. má mít organizační účet (D-U-N-S).
- Nezkoumáno: EU DSA/Apple EU trader status (povinné uvést adresu/e-mail obchodníka v EU storefrontu).

## 5. Oprávnění a soukromí (kamera, poloha, komprese, EXIF)

### Takeaway
Primární zdroje pro tuto část jsem nenačetl; k dispozici jen pravidla Applu a obecná doporučení.

### Cited Findings
- Apple 5.1.1(ii): souhlas se sběrem dat, srozumitelné purpose strings, snadné odvolání souhlasu — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Apple 5.1.2(i): nelze vázat funkčnost na povolení polohy/push — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Inferences (NEOVĚŘENO – z know-how, nutno ověřit v docs.expo.dev)
- Poloha jen „when in use“ a jen při tvorbě hlášení; nabídnout ruční výběr bodu na mapě jako alternativu; nic na pozadí.
- Foto: expo-image-picker/expo-camera → expo-image-manipulator (resize delší strana ~1600 px, JPEG kvalita ~0.7); EXIF GPS odstranit klientsky (re-encode) i serverově; GPS posílat jako samostatné pole s uživatelovým souhlasem; limit velikosti, malware/obsah check, signed upload do Supabase Storage (EU region).
- Obličeje/SPZ na fotkách: upozornit v UI; moderace úřadem před zveřejněním (viz Apple 1.2).
- GDPR: retence fotek/poloh, DPIA (vhodné – systematické zpracování polohy, AI), vztah správce (obec) × zpracovatel (CodeKom) × účet pod CodeKom s.r.o. (společní správci?) – právní posouzení nutné.

### Gaps
- Chybí citace na Expo ImagePicker/Camera/Location/ImageManipulator, EXIF chování (expo-image-picker `exif: false`), Android 14+ selected photos access, Apple purpose strings.

## 6. Přístupnost (zákon 99/2019 Sb., EN 301 549, RN API)

### Takeaway
Zákon 99/2019 dopadá na obce (územní samosprávné celky) a mobilní aplikace od 23. 6. 2021, ale povinným subjektem není soukromá společnost jako taková. App provozovaná CodeKom s.r.o. ve prospěch obcí je tedy zřejmě povinná nepřímo (obec „vyrobená pro povinný subjekt“ – definice mobilní aplikace zahrnuje software „vytvořený povinným subjektem nebo pro něj“); prakticky bude obec po CodeKom požadovat shodu a prohlášení o přístupnosti. Cílit na WCAG 2.1 AA / EN 301 549.

### Cited Findings
- § 3 zákona 99/2019: povinný subjekt je stát, obec/kraj, právnická osoba zřízená zákonem, dobrovolný svazek obcí, kvalifikovaný správce elektronické identifikace atd.; soukromé firmy obecně ne (leda splní test veřejného zájmu a kontroly státem); mobilní aplikace definována jako software „vytvořený povinným subjektem nebo pro něj“; § 13(3): požadavky na mobilní aplikace platí od 23. 6. 2021; výjimky: mapy (s náhradním řešením navigace), archivní záznamy, živá časová média, obsah třetích stran nekontrolovaný subjektem, nepřiměřená zátěž (§ 7); prohlášení o přístupnosti (§ 8) pro mobilní aplikace zveřejněné na webu se seznamem aplikací, mírou souladu, důvody, způsobem podání stížnosti; dozor DIA (náprava do max. 6 měsíců), zákon obsahuje bez pokut — [zákon 99/2019 Sb. (zakonyprolidi.cz)](https://www.zakonyprolidi.cz/cs/2019-99) (shrnutí z fetch nástroje; ověřit v plném znění)
- DIA FAQ: zákon se vztahuje na všechny veřejné instituce a orgány s weby a mobilními aplikacemi; obsah třetích stran používaný obcí musí splňovat přístupnost; za minimum uvádí WCAG 2.1 AA — [DIA – Nejčastější dotazy](https://www.dia.gov.cz/media/2142/download/Nej%C4%8Dast%C4%9Bj%C5%A1%C3%AD%20dotazy.pdf)
- DIA metodický pokyn (v1.7) existuje pro weby a mobilní aplikace — [DIA metodický pokyn](https://www.dia.gov.cz/media/2134/download/Metodick%C3%BD%20pokyn%20%E2%80%93%20p%C5%99%C3%ADstupnost%20internetov%C3%BDch%20str%C3%A1nek%20a%20mobiln%C3%ADch%20aplikac%C3%AD%20v_1_7.docx) (obsah nestažen)

### Inferences
- Platí nepřímo přes obce; do smlouvy s obcí zapsat odpovědnost za shodu a poskytnout podklady pro prohlášení o přístupnosti (CodeKom dodá text pro každou obec + URL na web).
- Evropský přístupnostní akt (EAA, směrnice 2019/882) od 28. 6. 2025 pro e-commerce/spotřebitelské služby – pro platby/rezervace za soukromý subjekt možné dotčení (NEOVĚŘENO, nezkoumáno).
- RN: `accessibilityLabel/Role/State/Hint`, `accessible`, `importantForAccessibility`, `allowFontScaling` + `maxFontSizeMultiplier` (Dynamic Type/ Font scale), kontrast 4.5:1, cíle ≥ 44×44 pt / 48 dp, reduce motion (`AccessibilityInfo.isReduceMotionEnabled`), testování VoiceOver/TalkBack ručně + axe DevTools Mobile; (NEOVĚŘENO – z know-how, nestaženo z docs).

### Gaps
- Znění EN 301 549 verze citované vyhláškou/metodikou (v3.2.1 z roku 2021) nepotvrzeno; cílová verze WCAG 2.1 vs 2.2 pro mobilní appky nepotvrzena.
- Zda DIA výslovně řeší soukromé dodavatele – FAQ to neřeší; doporučit dotaz na DIA.

## 7. Konkurence v ČR

### Takeaway
Dominantní je Munipolis (dříve Mobilní rozhlas) s hodnocením 4,2/5 (499 hodnocení v CZ App Store). V obraze (Galileo Corporation) pokrývá >2600 organizací, ale hodnocení jen 3,4 (68). Zlepšeme Česko cílí na hlášení závad. Údaje o Hlášence a Obec v mobilu se nepodařilo ověřit.

### Cited Findings
- Munipolis (iOS CZ): 4,2/5 z 499 hodnocení, verze 6.0.4, 153,4 MB, iOS 15+, věk 4+, zdarma, čeština + 10 jazyků; funkce: push výstrahy, oficiální zprávy/kontakty/akce, hlášení závad (skládky, lavičky, osvětlení, výmoly), sledování více obcí; privacy labels: diagnostika, kontakt (e-mail, jméno, telefon), uživatelský obsah (foto) – vše „not linked“ — [App Store: Munipolis](https://apps.apple.com/cz/app/munipolis/id1378883073?l=cs)
- Munipolis historie: Mobilní rozhlas se přejmenoval na Munipolis (2021), expanze do Německa; 600 tis. uživatelů (CzechCrunch) — [CzechCrunch 2021](https://cc.cz/2021/04/mobilni-rozhlas-se-meni-na-munipolis-a-miri-do-nemecka-dalsi-na-rade-bude-spanelsko-a-velka-britanie/); [CzechCrunch – 600 tis. uživatelů](https://cc.cz/silny-rok-pro-munipolis-mestsky-rozhlas-do-kapsy-z-ceska-hlasi-600-tisic-uzivatelu-a-expanzi-do-zemi-se-kterymi-nepocital/) (datum článku nedohledáno)
- V OBRAZE – vím, co se děje (Galileo Corporation s.r.o.): 3,4/5 z 68 hodnocení; verze 6.4.1; zobrazuje zprávy z webů obcí a příspěvkových organizací, upozornění na novinky, akce, dokumenty z úředních desek; >2600 organizací; věk 16+; privacy label „žádné údaje“ — [App Store: V obraze](https://apps.apple.com/cz/app/v-obraze-v%C3%ADm-co-se-děje/id1128876118?l=cs)
- Zlepšeme Česko (2018, Ondřej Švrček/Neogenia): hlášení problémů s geolokací, směrování hlášení, ankety/participativní projekty, plánované API — [CzechCrunch 2018](https://cc.cz/nova-platforma-zlepseme-cesko-umozni-lidem-resit-komunalni-problemy-pres-mobilni-telefon/)
- Další nalezené aplikace (jen názvy ve výsledcích vyhledávání, neověřeno): Česká obec, MojeObec, Moje Satalice, Kamenice v mobilu, Obec Zeleneč (obecní white-label appky); TMAPY „Hlášení závad“ — [App Store: Česká obec](https://apps.apple.com/cz/app/%C4%8Desk%C3%A1-obec/id1027734504), [TMAPY](https://www.tmapy.cz/wp-content/uploads/2017/06/TMAPY_Hlaseni_zavad_novinky_3_2.pdf)

### Inferences
- Diferenciace CodeKom: AI asistent nad dokumenty obce, role úřad uvnitř téže appky, IoT stav budov, rezervace/platby; konkurence = hlavně rozhlas + závady. Slabina konkurentů (V obraze) = nižší hodnocení; Munipolis má 150 MB a široké pokrytí obcí – cílit na dosažitelnost obcí bez Munipolis.
- Průnik: občan sleduje více obcí – standard; nutnost importu obsahu z existujících webů obcí (RSS/scrape) u obcí, které nejsou na CodeKom, by zvýšil hodnotu, ale právní zakázka (autorská práva, desky) – NEOVĚŘENO.

### Gaps
- Nenalezena data pro: Hlášenka, Obec v mobilu (neověřeno, zda existuje pod tímto jménem), Google Play hodnocení všech appek, počty obcí Munipolisu aktuálně, ceny pro obce. Nutno doplnit ručním průchodem listingů (apps.apple.com, play.google.com).

## 8. Bezpečnost (úložiště tokenů, MASVS, pinning) + AI Act Art. 50

### Takeaway
Tokeny do SecureStore (Keychain/Keystore), bez PII v AsyncStorage; MASVS L1 jako základ, L2 pro roli úřad. Certificate pinning: nepoužívat napevno kvůli rotaci certifikátů a provozní křehkosti (NEOVĚŘENO – know-how). AI Act Art. 50 platí od 2. 8. 2026 – povinnost informovat, že uživatel komunikuje s AI.

### Cited Findings
- SecureStore chování (viz sekce 1): `requireAuthentication` pro citlivé tokeny role úřad; Android Auto Backup se SecureStore nezachází — [SecureStore docs](https://docs.expo.dev/versions/latest/sdk/secure-store/)
- Art. 50 AI Act: povinnosti transparentnosti se uplatňují od 2. 8. 2026 (výsledky vyhledávání a nadpisy: chatboty, deepfake labely); zdroje uvádějí odklad přísnějších pravidel (HR, biometrie, migrace) na prosinec 2027 v rámci Digital Omnibus — [Silicon Canals](https://siliconcanals.com/the-eus-ai-act-starts-requiring-chatbot-and-deepfake-labels-on-august-2-while-its-tougher-rules-on-hiring-biometrics-and-migration-are-pushed-back-to-december-2027/); [CSA research note, 29. 7. 2026](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-article-50-transparency-20260729/) (obsah nestažen, pouze titulky z vyhledávání)
- Apple 5.1.2(i): third-party AI – výslovný souhlas — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Inferences
- UI: štítek „AI asistent“ při první interakci + trvale v hlavičce chatu, odpovědi s citací zdrojového dokumentu obce, upozornění „může se mýlit, nezávazné“, odkaz na kontakt úřadu; provozovatelem/poskytovatelem je CodeKom (poskytovatel), obec nasazující = deployer – rozdělit smluvně.
- MASVS (OWASP): L1 pro všechny, L2 + MASVS-RESILIENCE jen volitelně; RLS v Supabase, role úřad ověřovat server-side; rate limit OTP; jailbreak/root detekce volitelně. Pinning: pokud, tak pinovat veřejné klíče s zálohou a vzdáleným vypnutím, nebo vůbec ne (NEOVĚŘENO).

### Gaps
- OWASP MASVS/MASTG text nebyl stažen; pinning pros/cons bez citací.
- Primární text Art. 50 (EUR-Lex) a stav Digital Omnibus ve vztahu k Art. 50(1) neověřeny – snippety jsou z blogů; před spec ověřit.
