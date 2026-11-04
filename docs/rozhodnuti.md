# Rozhodnutí

Odchylky od zadání a jejich důvody. Nejnovější dole.

## 1. Sdílené balíčky jako kopie z `codecom` (4. 11. 2026)

Zadání 08 počítá s tím, že aplikace vzniká v repozitáři `codecom` vedle `packages/tokeny`, `packages/typy`, `packages/demo-data` a `obsah/javori-lhota`. Aplikace se ale přesunula do `codecom_app`. Prompt 07 v `codecom` proběhl (balíčky, datová vrstva `apps/web/src/lib/data/demo-pamet.ts`, endpointy, `CODEKOM_APP_ORIGIN`), takže balíčky se nezakládají znovu.

- Balíčky a obsah se kopírují skriptem `scripts/synchronizuj-sdilene.sh` (výchozí zdroj `../codecom`). Zdrojem pravdy zůstává `codecom`, kopie se ručně neupravují.
- Jediná úprava při kopírování: z `packages/tokeny/package.json` se odebere skript `generate`, protože generátor `design/generator` je jen v `codecom`.
- Kořenový ESLint kopie ignoruje (obsahují záměrné nezlomitelné mezery v českých textech a v `codecom` mají vlastní kontrolu).
- Proč ne git submodul nebo závislost z gitu: `codecom` je velký monorepozitář s Next.js a Payload a pnpm workspace by ho celý tahal; kopie tří malých balíčků je jednodušší a odpovídá tomu, jak se sem už kopírují `docs/zadani` a `design/`.

## 2. Systémové písmo v mobilní aplikaci (4. 11. 2026)

Písma šablon obce jsou určena pro web a v aplikaci by vyžadovala stahování externích webových písem při každém načtení. Mobilní aplikace proto používá systémové písmo (`system-ui` na webu, `System` na iOS, `sans-serif` na Androidu).

## 3. Založení apps/mobile (4. 11. 2026)

Prototyp aplikace je založen na Expo SDK 58 (58.0.23), Expo Router (58.0.30), React 19 (19.3.0), react-native 0.88.1, react-native-web 0.21.4 a TanStack Query v5. Metro v monorepu sleduje i kořenový adresář (`packages/*`, `obsah/`).
Webový rámec (`Ramec.web.tsx`) vykresluje aplikaci na desktopu v rámu telefonu o maximální šířce 430 px uprostřed obrazovky.

## 4. Rozšíření služeb občana o 5 oblastí chytré obce (4. 11. 2026)

Na vyžádání uživatele byl do sekce Služby v roli Občan (`apps/mobile/app/(obcan)/(tabs)/sluzby/`) doplněn kompletní ekosystém 14 interaktivních obrazovek rozdělených do 5 tematických celků:
1. **Senzorika, IoT a Chytrá obec (`senzory.tsx`):** enviromentální čidla (hladina potoka s varováním, AQI, teplota vozovky, vlhkost půdy), GPS poloha komunální techniky a protažených ulic, chytré parkování a nabíječky EV, živé odjezdy spojů.
2. **Komunitní sdílení a lokální ekonomika (`pujcovna.tsx`, `bazar.tsx`, `spolujizda.tsx`, `dobrovolnictvi.tsx`):** obecní půjčovna nářadí, sousedský bazar a darovna, sousedská spolujízda a burza dobrovolnictví.
3. **Pokročilá správa majetku a infrastruktury (`nemovitosti.tsx`, `energetika.tsx`, `hrbitov.tsx`):** obecní byty a zasíťované parcely, komunitní energetika (FVE dashboard a registrace EDC), Hřbitov 2.0 (platnost nájemní smlouvy a virtuální svíčka).
4. **Bezpečnost a krizové situace (`ztraty-a-nalezy.tsx`, `aed.tsx`, `kamery.tsx`):** Ztráty a nálezy 2.0 (registr nalezených zvířat s GPS a útulkem), mapa AED defibrilátorů s postupem první pomoci, veřejné webkamery v souladu s GDPR.
5. **Zákulisní portály a Gamifikace (`body.tsx`, `zastupitelstvo.tsx`, `developer.tsx`):** občanské body a odměny, zastupitelský extranet pro radní a zastupitele, developer portál s otevřeným REST API a webhooky.

## 5. Simulace rolí Úřadu a správa budov pouze ke čtení (4. 11. 2026)

- V roli Úřad se přepíná podrole **Správce** a **Redaktor**. Hlavička `X-Ukazka-Role` slouží výhradně k simulaci oprávnění v ukázce (redaktor může krizové hlášení uložit pouze jako koncept, vydat a ukončit platnost smí jen správce; žádné krizové hlášení nelze smazat).
- Obrazovka **Budovy** (`app/(urad)/(tabs)/budovy.tsx`) dodržuje pravidlo 5: zobrazuje stavy budov, místností, oken a dveří slovem a obsahuje povinné upozornění, že ovládání budov přibude v další verzi (zadání 04) a ochrana proti mrazu běží v bráně nezávisle na cloudu. Tlačítka pro odemčení dveří ani přepínání režimu vytápění v prototypu nejsou.
