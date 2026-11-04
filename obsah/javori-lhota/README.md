# Ukázková obec Javoří Lhota

Kompletní obsah smyšlené obce Javoří Lhota (684 obyvatel, okres Klatovy, Plzeňský kraj, pod Javorníkem). Z těchto souborů čte balíček `@codekom/demo-data`, prototyp webu (prompt 07) a prototyp aplikace (prompt 08). Balíček soubory jen importuje a validuje schématy z `@codekom/typy`, obsah nepřepisuje.

Obsah vychází z těl 20 šablon (`design/generator/bodies/*.html`), z dat šablon v `design/generator/tpls.py`, z krizových hlášení v `design/generator/build.py` (objekt `A`) a z prototypů `App-Obcan`, `App-Urad`, `IoT-Dashboard` a `Editor-Zaklad` v `design/prototypy/`. Texty, které v podkladech nebyly (znění dokumentů úřední desky, části článků, rezervace, hlášení závad), jsou dopsané tak, aby odpovídaly těmto podkladům. Prototypy aplikace a IoT ukazovaly obec Horní Vzorov, údaje jsou převedené na Javoří Lhotu.

## Pravidla pro všechny soubory

- Názvy polí jsou česky bez diakritiky v camelCase. Hodnoty výčtů jsou malými písmeny bez diakritiky (`v_reseni` u stavu hlášení podle promptu 07).
- Kalendářní den je řetězec `YYYY-MM-DD`. Okamžik je ISO 8601 v UTC (`2026-11-04T09:50:00.000Z`). V listopadu platí v Praze UTC+1, takže 9:00 v Praze je `08:00:00.000Z`. Čas dne bez data je `HH:MM` v Europe/Prague.
- Referenční „dnešek“ ukázky je `DEMO_DNES` = 2026-11-04 12:00 Europe/Prague (středa). Všechna data jsou k němu konzistentní: co „visí“, co je „sejmuté“, co je „aktivní“.
- `id` je stabilní textový klíč, jedinečný v souboru. Odkazy mezi soubory jdou přes `id` (například `aktuality[].dokumentyDesky`, `prostory[].budova`, `asistent-ukazka` citace).
- Skutečné údaje úřadu se nevymýšlí. IČO, DIČ, datová schránka, číslo účtu, PSČ, e-mail, telefon, ORP, jména u osobních údajů a čísla jednací cizích úřadů jsou zjevné zástupné texty v hranatých závorkách, stejně jako v prototypech: `[IČO]`, `[DIČ]`, `[ID DS]`, `[ČÍSLO ÚČTU]`, `[PSČ]`, `[E-MAIL]`, `[TELEFON]`, `[ORP]`, `[JMÉNO]`, `[POVĚŘENEC]`, `[ČÍSLO JEDNACÍ]`. Web i aplikace je tak i zobrazí.
- `null` znamená „není uvedeno“. Prázdné pole `casti: []` znamená celou obec.

## Soubory

### `obec.json` (objekt)

| Pole | Typ | Popis |
| --- | --- | --- |
| `nazev`, `slug`, `vLokale` | text | „Javoří Lhota“, `javori-lhota`, „v Javoří Lhotě“ (6. pád s předložkou do vět) |
| `okres`, `kraj`, `orp` | text | `orp` je zástupný text `[ORP]` |
| `obyvatel` | číslo | 684, součet částí obce |
| `adresa` | {ulice, psc, obec} | Náves 1, `[PSČ]` |
| `ico`, `dic`, `datovaSchranka`, `cisloUctu`, `email`, `telefon` | text | zástupné texty; `cisloUctu` není platné číslo účtu, QR platba se proto nevytvoří |
| `uredniHodiny` | [{den 1–7, od, do}] | 1 = pondělí; Po a St 8–17, Út a Čt 8–12 |
| `uredniHodinyText` | text | stejné hodiny slovy pro patičky šablon |
| `castiObce` | [{nazev, slug, obyvatel}] | Javoří Lhota 412, Podjavoří 138, Hájek 86, Na Rovném 48 |
| `kontakty` | [{id, jmeno, funkce, agenda, kancelar, kdy, email, telefon}] | lidé a agendy úřadu; `jmeno: null` u agendy bez jména |
| `poverenec` | {jmeno, email, telefon} | pověřenec pro ochranu osobních údajů, zástupné texty |
| `znakUrl` | text nebo null | null: znak kreslí komponenta `ZnakObce` |
| `sablona`, `paleta` | klíč šablony, 0–2 | výchozí vzhled `naves`, paleta 0 |
| `urovenEditoru` | `zaklad` \| `pokrocily` \| `advance` | |
| `moduly` | [`web`, `aplikace`, `urad`, `iot`, `ai`] | zapnuté moduly |
| `popis` | text | jedna věta o obci |
| `spravceWebu` | {jmeno, funkce, aktualizovano} | „Stránku spravuje Jana Malá“ z šablon |
| `ukazka` | true | obec je ukázková |

### `aktuality.json` (pole, 12 položek)

`{id, slug, titulek, perex, obsah: string[] (odstavce), rubrika: zpravy | oznameni | kultura | zpravodaj, autor (text, kdo zprávu píše), publikovano (okamžik), obrazek: null, dokumentyDesky: id[]}`. Rubriky odpovídají kolekci `apps/web/src/collections/Aktuality.ts`. Seřazené od nejnovější.

### `akce.json` (pole, 9 položek)

`{id, slug, nazev, den, od (HH:MM nebo null), do (HH:MM nebo null), misto, poradatel, kategorie: obec | spolky | kultura, popis, casti: slug[]}`. Od 7. 11. do 5. 12. 2026.

### `uredni-deska.json` (objekt)

- `kategorie`: `[{id, nazev, slug, poradi}]`, šest kategorií z šablony Zvonice: Zastupitelstvo, Doprava, Rozpočet, Oznámení, Vyhlášky, Majetek obce.
- `dokumenty`: `[{id, nazev, kategorie (slug), cisloJednaci, puvodce, vyvesenoOd (den), vyvesenoDo (den nebo null = do odvolání), skrytPoSejmuti, anotace, text: string[] (2 až 6 odstavců), soubor: {nazev, url, typ, velikost}}]`.
- K 4. 11. 2026 visí 13 dokumentů (jeden „do odvolání“: vyhláška o poplatku ze psů), 7 je sejmutých, z nich 3 mají `skrytPoSejmuti: true` a do archivu nepatří.
- `soubor.url` je `/demo/deska/<id>.pdf`, `typ` `application/pdf`, `velikost` `null`. PDF zatím neexistují; prototyp je vygeneruje z `text`, nebo vrátí zástupný soubor.
- Den vyvěšení i sejmutí se v ostré verzi ukládá jako 12:00 UTC daného dne (`apps/web/src/lib/datum.ts`). Dokument „visí“, když `vyvesenoOd <= dnes <= vyvesenoDo`.
- Pole `verze[]` (záznam o vyvěšení) tu není, přidává ho úložiště prototypu 07 při prvním načtení.

### `krizova-hlaseni.json` (pole, 3 položky)

`{id, uroven: info | warning | emergency, titulek, text, odkazText, odkazUrl, casti: slug[], platiOd (okamžik), platiDo (okamžik nebo null = do odvolání), updatedAt}`. Texty jsou z objektu `A` v `build.py`. `titulek` začíná malým písmenem, protože se vykresluje za úrovní („Krizová situace: nepijte vodu…“). Odkazy vedou jen na stránky webu obce.

K `DEMO_DNES` jsou aktivní všechna tři: informace o mostě (2.–30. 11.), výstraha před větrem (4. 11. 8:00 až 5. 11. 22:00) a krize „nepijte vodu“ (od 2. 11. 13:00 do odvolání). Banner proto ukáže krizi a „Další hlášení: 2“. Přepínač ukázky v prototypu 07 umí zobrazit i ostatní stavy.

### `rozhlas.json` (pole, 6 položek)

`{id, cas (okamžik), titulek, text, casti: slug[], audioUrl: null}`. Hlášení obecního rozhlasu přepsaná do textu, od nejnovějšího.

### `zastupitele.json` (pole, 7 položek)

Pole podle kolekce `Zastupitele.ts`: `{id, titulPred, jmeno, titulZa, funkce: starosta | mistostarosta | radni | zastupitel, funkceText (slovo ve správném rodě), vybory, zvolenZa, email, telefon, uredniHodiny, foto, obdobi, poradi, aktivni}`. Obec s 684 obyvateli má 7 až 15 zastupitelů, proto 7. Jména jsou z šablon a prototypů.

### `zivotni-situace.json` (pole, 4 položky)

`{id, slug, nazev, kratkyNazev, kdoPoradi, kroky: [{poradi, nazev, zpusob: online | urad | samo, text, sluzba (id ze sluzby.json nebo null)}], uradCesta}`. Z šablony Úřad. `uradCesta` je cesta přes úřad pro toho, kdo nechce nebo nemůže online.

### `sluzby.json` (objekt)

- `sluzby`: `[{id, slug, nazev, popis, zpusob: online | urad, odkaz (trasa webu nebo null), uradCesta, klicovaSlova (bez diakritiky, pro hledání)}]`, 9 služeb ze šablony Lípa.
- `poplatky`: `[{id, nazev, castka (Kč), mena, jednotka, splatnost (MM-DD), splatnostText, kdoPlati, ulevy, poradiVs, zpusobyPlatby: qr | prevod | hotove, uradCesta, vyhlaska?}]`. Odpad 900 Kč na osobu a rok, pes 200 Kč, chalupa 900 Kč. `poradiVs` je dvoumístné pořadí poplatku ve variabilním symbolu (rok, číslo popisné na 4 místa, pořadí), ukázkové schéma podle promptu 07.

### `prostory.json` (objekt)

- `prostory`: `[{id, slug, nazev, adresa, budova (id z budovy.json), kapacita, cenaZaBlok, kauce, mena, bloky: [{id, od, do}], popis, uradCesta}]`. Sál obecního úřadu (80 osob, 800 Kč za blok, kauce 1 000 Kč, z prototypu aplikace) a sál v hasičárně (120 lidí, ze šablony Hráz). Bloky 14:00–18:00 a 18:00–22:00 jsou z prototypu aplikace.
- `rezervace`: `[{id, prostor, den, od, do, ucel, zadatel: {jmeno, kontakt}, stav: ceka | schvaleno | zamitnuto, vytvoreno}]`. Stavy `ceka` a `schvaleno` blokují termín.

### `hlaseni-zavad.json` (objekt)

- `kategorie`: `[{id, nazev}]`: Výmol, Osvětlení, Odpad, Zeleň, Jiné (výchozí sada z promptu 08).
- `stavy`: `[{id, nazev}]`: `nove` Přijato, `prijato` Převzato, `v_reseni` Řeší se, `vyrizeno` Vyřízeno, `zamitnuto` Zamítnuto.
- `hlaseni`: `[{id, cislo (HZ-<rok>-<nnnn>), sledovaciKod (8 znaků bez 0, O, 1, I, L), stav, verejnaOdpoved, kategorie, popis, misto, poloha (null), kontakt ({jmeno, email, telefon} nebo null), pocetFotek, vytvoreno, zmeneno}]`, 7 hlášení ve všech stavech. `kontakt` se nikdy nevrací veřejným endpointem.

### `budovy.json` (objekt)

Podle `design/prototypy/IoT-Dashboard.dc.html`, pro aplikaci jen ke čtení.

- `stavKDni`: okamžik, ke kterému data platí (4. 11. 2026 10:50).
- `budovy`: `[{id, nazev, adresa, stav: ok | varovani | alarm, souhrn, rezimTopeni: auto | komfort | utlum, brana: {online, posledniZprava}, kdoMaKlic, mistnosti: [{id, nazev, teplota, cilovaTeplota, cilText, okno: zavreno | otevreno, poznamka?}], plan: [{nazev, od, do}], dvere: [{id, nazev, stav: zamceno | odemceno, posledniVstup: {cas, kdo, zpusob: PIN | karta}}], upozorneni: [{id, uroven: alarm | varovani, text, od, prevzal}], energie: [{den, kWh}] za 7 dní}]`. Pět budov: obecní úřad a sál, sokolovna (alarm, mráz), mateřská škola (slabá baterie), hasičská zbrojnice, knihovna.
- `prvky`: `[{id, budova, mistnost (id nebo null), typ: brana | hlavice | zamek | elektromer, nazev, baterie (procenta nebo null), stav}]`, tedy `PrvekBudovy`.

### `asistent-ukazka.json` (objekt)

`{upozorneni, otazky: [{id, otazka, odpoved, zdroje: [{dokument (id z uredni-deska.json), nazev}]}]}`. Tři předpřipravené odpovědi pro ukázku AI asistenta. Každá odpověď začíná větou „Odpovídá umělá inteligence z dokumentů obce.“ a cituje dokumenty úřední desky (čl. 50 AI Actu, pravidlo 4 v `CLAUDE.md`). Model se v prototypu nevolá.

## Rozdíly mezi šablonami a jak jsou vyřešené

Šablony mají většinu obsahu shodnou, ale některé údaje se liší. V datech platí:

| Téma | V šablonách | V datech |
| --- | --- | --- |
| Ulice bez vody ve čtvrtek 5. 11. | Main „Hlavní a Za Školou“, Lupa a Hráz „Hlavní a K Javorníku“ | Hlavní a K Javorníku (dvě šablony a podrobnější text) |
| Zpráva o bioodpadu | Main 23. 10., Radnice a Zpravodaj 27. 10. | 27. 10. |
| Sběr nebezpečného odpadu 7. 11. | Main „na návsi“, Lupa a Zpravodaj „u hasičárny“ | u hasičárny |
| Kdy přijímá starostka | Zvonice a Lípa „od 15 hodin“, Radnice „Út a Čt 8 až 12“ | obojí: Po a St od 15 do 17, Út a Čt 8 až 12 |
| Poplatek za chalupu | Lípa 900 Kč, Studánka 600 Kč za rekreační objekt | 900 Kč |
| Oprava chodníku v Lipové | Lípa „začne v dubnu“, prototyp aplikace „3. listopadu“ (Horní Vzorov) | v dubnu |
| E-mail obce | šablony `obec@javorilhota.cz` a další adresy na `javorilhota.cz` | `[E-MAIL]` podle briefu (e-mail obce se nevymýšlí) |
| „Dnes“ | šablony počítají s pondělím 2. 11. (Zvonice `today = '2026-11-02'`, Hnízdo „Dnes, po 2.“) | `DEMO_DNES` je středa 4. 11.; statické texty šablon s „dnes“ zůstávají, jak jsou |

Údaje, které jsou jen v jedné šabloně a patří k jejímu charakteru (vleky a sníh v Hřebenu, výrobci ve Vinici, pila a parcely v Mlýnu, Anenský pramen v Kolonádě, přeshraniční akce v Hranicích, adventní trh v Rynku), do dat nejsou převzaté a zůstávají jako statický text šablony.
