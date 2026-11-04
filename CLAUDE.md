# CodeKom App – kontext pro Claude Code

Repozitář aplikací CodeKom: mobilní aplikace (občan a úřad) a brána do obecních budov (IoT). Co je hotové a co dělat dál, je v `docs/PREDANI.md`, zadání v `docs/zadani/`.
Pravidla domény, jazyka, designu a práva platí stejně jako v hlavním repozitáři `mlnamata/codecom` (jeho `CLAUDE.md`), hlavně:

- Komentáře a texty česky, doménové názvy česky bez diakritiky, technické anglicky. Commity česky v rozkazovacím způsobu.
- TypeScript strict s `noUncheckedIndexedAccess`, žádné `any` ani `@ts-ignore` kvůli tichému průchodu.
- Pravidlo 5: zámek jde vždy otevřít klíčem, ochrana proti mrazu nezávisí na cloudu, brána řídí budovu i bez internetu.
- Údaje, které neznáš, nevymýšlej: `[DOPLNIT: …]`, neověřené `[OVĚŘIT]`. Tajné klíče jen do `.env`.

## Uspořádání

```
packages/iot   katalog standardů, zod schémata konfigurace a zpráv MQTT
apps/mobile    (zatím není) aplikace Expo, zadání 08 a 02
apps/brana     (zatím není) agent brány, zadání 04
docs/          předání, zadání, podklady, průběh práce
design/        klikací návrhy aplikace a IoT dashboardu
```

## Kontrola hotovo

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Práce více agentů najednou

Na repozitáři pracuje víc sezení Claude Code současně.

- Commituj po malých krocích a pushni hned po každém ověřeném kroku (prošly kontroly výše).
- Před každým pushem `git pull --rebase --autostash origin main`. Při konfliktu se zastav a napiš, s čím je konflikt. Nikdy nepoužívej force push.
- Přidávej jen svoje soubory (`git add <cesty>`), ne `git add -A`.
- Úkoly vedeme v `docs/progress.md`: co je hotové, co se dělá a kdo na tom je. Aktualizuj ho v každém commitu.
