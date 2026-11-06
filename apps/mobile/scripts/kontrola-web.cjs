/* global fetch, setTimeout, localStorage, document */
/**
 * Celková kontrola webového exportu prototypu (smoke test v prohlížeči).
 *
 * Projde všechny obrazovky občana i úřadu a hlavní akce (úvod, deska,
 * nahlášení závady a sledování stavu, krizové hlášení, vyřízení závady).
 * Na každé obrazovce hlídá chyby v konzoli, pády stránky, rozbité texty
 * („undefined“, „NaN“…) a vodorovné přetečení.
 *
 * Spuštění (po `pnpm export:web`):  pnpm kontrola:web
 * Potřebuje Playwright s Chromiem (v cloudovém prostředí je předinstalovaný).
 */
const { spawn } = require('node:child_process')
const path = require('node:path')
const { chromium } = require('playwright')

const PORT = Number(process.env.PORT || 8123)
const ZAKLAD = `http://localhost:${PORT}`
const KLIC_RELACE = 'codekom.ukazka.relace'

const vysledky = []
let aktualniKrok = ''

function zapis(ok, nazev, detail = '') {
  vysledky.push({ ok, nazev, detail })
  console.log(`${ok ? 'OK  ' : 'CHYBA'} ${nazev}${detail ? ` – ${detail}` : ''}`)
}

async function krok(nazev, fn) {
  aktualniKrok = nazev
  try {
    await fn()
    zapis(true, nazev)
  } catch (e) {
    zapis(false, nazev, e instanceof Error ? e.message.split('\n')[0] : String(e))
  }
}

function spustServer() {
  const server = spawn(process.execPath, [path.join(__dirname, 'serve.mjs')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  })
  return server
}

async function pockejNaServer() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(ZAKLAD + '/')
      if (r.ok) return
    } catch {
      // server ještě neběží
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('Statický server nenaběhl')
}

/** Nový kontext prohlížeče v šířce telefonu, volitelně s uloženou relací. */
async function novaStranka(browser, relace) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  if (relace) {
    await ctx.addInitScript(
      ([klic, hodnota]) => localStorage.setItem(klic, hodnota),
      [KLIC_RELACE, JSON.stringify(relace)],
    )
  }
  const page = await ctx.newPage()
  page.chyby = []
  page.on('pageerror', (e) => page.chyby.push(`[${aktualniKrok}] pád: ${e.message.split('\n')[0]}`))
  page.on('console', (m) => {
    if (m.type() === 'error')
      page.chyby.push(`[${aktualniKrok}] konzole: ${m.text().split('\n')[0]}`)
  })
  return page
}

const ROZBITE = ['undefined', 'NaN', '[object Object]', 'Invalid Date', 'null null']

/** Zkontroluje text obrazovky a rozložení. */
async function zkontrolujObrazovku(page, ocekavanyText) {
  if (ocekavanyText) {
    await page.getByText(ocekavanyText, { exact: false }).first().waitFor({ timeout: 8000 })
  } else {
    await page.waitForTimeout(1500)
  }
  const text = await page.locator('body').innerText()
  for (const r of ROZBITE) {
    if (text.includes(r)) throw new Error(`na obrazovce je text „${r}“`)
  }
  const preteceni = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (preteceni > 1) throw new Error(`stránka přetéká vodorovně o ${preteceni} px`)
}

async function navstiv(page, cesta, ocekavanyText) {
  await page.goto(ZAKLAD + cesta)
  await zkontrolujObrazovku(page, ocekavanyText)
}

const OBCAN = { role: 'obcan', obec: 'javori-lhota', roleUradu: 'spravce', prihlasen: false }
const URAD = { role: 'urad', obec: 'javori-lhota', roleUradu: 'spravce', prihlasen: true }

const SLUZBY = [
  ['zavada', 'Co se děje?'],
  ['sledovani', 'Sledovací kód'],
  ['poplatky', 'poplat'],
  ['rezervace', 'Rezervace'],
  ['senzory', 'Chytrá obec a živá data'],
  ['pujcovna', 'Půjčovna'],
  ['bazar', 'Bazar'],
  ['spolujizda', 'Spolujízda'],
  ['dobrovolnictvi', 'Brigád'],
  ['nemovitosti', 'Nemovitost'],
  ['energetika', 'Energ'],
  ['hrbitov', 'Hřbitov'],
  ['aed', 'AED'],
  ['ztraty-a-nalezy', 'Ztráty'],
  ['kamery', 'Kamer'],
  ['body', 'bod'],
  ['zastupitelstvo', 'Zastupitelský extranet'],
  ['developer', 'API'],
]

async function main() {
  const server = spustServer()
  const browser = await chromium.launch()
  const vsechnyChyby = []
  try {
    await pockejNaServer()

    // 1. Úvod: role, obec, vstup bez účtu
    {
      const page = await novaStranka(browser)
      await krok('Úvod: volba role Občan, obce a vstup bez účtu', async () => {
        await navstiv(page, '/', 'Zvolte roli')
        await page.getByRole('button', { name: /Vstoupit jako Občan/ }).click()
        await page.getByRole('button', { name: /Vybrat obec Javoří Lhota/ }).click()
        await page
          .getByRole('button', { name: 'Pokračovat do aplikace bez přihlášení' })
          .first()
          .click()
        await page.waitForURL('**/prehled')
        await zkontrolujObrazovku(page, 'Vidíte nepořádek nebo závadu?')
      })
      vsechnyChyby.push(...page.chyby)
      await page.context().close()
    }

    // 2. Obrazovky občana
    {
      const page = await novaStranka(browser, OBCAN)
      await krok('Občan: Přehled', () => navstiv(page, '/prehled', 'Vidíte nepořádek nebo závadu?'))
      await krok('Občan: Zprávy (aktuality i akce)', async () => {
        await navstiv(page, '/zpravy', 'Zprávy a události')
        await page.getByRole('tab', { name: /Kalendář akcí/ }).click()
        await zkontrolujObrazovku(page, 'Den konání')
      })
      await krok('Občan: Úřední deska, všechny filtry a detail dokumentu', async () => {
        await navstiv(page, '/deska', 'Vyvěšeno')
        const filtry = await page.getByRole('button', { name: /^Filtrovat kategorii / }).all()
        if (filtry.length < 5) throw new Error(`jen ${filtry.length} filtrů`)
        let neprazdnych = 0
        for (const f of filtry) {
          await f.click()
          await page.waitForTimeout(300)
          if (await page.getByRole('button', { name: /^Dokument:/ }).count()) neprazdnych++
        }
        if (neprazdnych < filtry.length - 2)
          throw new Error(`prázdných filtrů: ${filtry.length - neprazdnych}`)
        await page.getByRole('button', { name: /Filtrovat kategorii Vše/ }).click()
        await page
          .getByRole('button', { name: /^Dokument:/ })
          .first()
          .click()
        await zkontrolujObrazovku(page, 'Vyvěšeno od')
      })
      await krok('Občan: archiv desky', async () => {
        await navstiv(page, '/deska', 'Vyvěšeno')
        await page.getByRole('tab', { name: /Archiv/ }).click()
        await page.waitForTimeout(500)
        await zkontrolujObrazovku(page)
      })
      await krok('Občan: Služby', () => navstiv(page, '/sluzby', 'Služby a chytrá obec'))
      for (const [cesta, text] of SLUZBY) {
        await krok(`Občan: Služby › ${cesta}`, () => navstiv(page, `/sluzby/${cesta}`, text))
      }
      await krok('Občan: Více', () => navstiv(page, '/vice', 'Změnit roli'))
      vsechnyChyby.push(...page.chyby)
      await page.context().close()
    }

    // 3. Nahlášení závady z přehledu a sledování stavu
    {
      const page = await novaStranka(browser, OBCAN)
      let kod = ''
      await krok('Závada: zkratka z přehledu předvybere „Vysoká tráva“', async () => {
        await navstiv(page, '/prehled', 'Vidíte nepořádek nebo závadu?')
        await page.getByRole('button', { name: 'Nahlásit: Vysoká tráva' }).click()
        await page.waitForURL('**/sluzby/zavada**')
        const vybrana = page.getByRole('radio', { name: 'Vysoká tráva' })
        if ((await vybrana.getAttribute('aria-checked')) !== 'true')
          throw new Error('kategorie není vybraná')
      })
      await krok('Závada: odeslání bez popisu ukáže chybu', async () => {
        await page.getByRole('button', { name: 'Odeslat hlášení závady' }).click()
        await page.getByText('Zadejte prosím popis závady.').waitFor({ timeout: 5000 })
      })
      await krok('Závada: odeslání vrátí číslo a sledovací kód', async () => {
        await page
          .getByLabel('Popis závady')
          .fill('Tráva u dětského hřiště je po kolena, děti se tam nedostanou.')
        await page.getByLabel('Popis místa').fill('hřiště u školy')
        await page.getByRole('button', { name: /Přidat fotku závady/ }).click()
        await page.getByRole('button', { name: 'Odeslat hlášení závady' }).click()
        await page.getByText('Sledovací kód pro kontrolu stavu').waitFor({ timeout: 8000 })
        const text = await page.locator('body').innerText()
        const m = text.match(/Sledovací kód pro kontrolu stavu:\s*([A-Z0-9]{8})/)
        if (!m) throw new Error('sledovací kód nenalezen')
        kod = m[1]
        await zkontrolujObrazovku(page)
      })
      await krok('Závada: stav podle sledovacího kódu', async () => {
        await navstiv(page, '/sluzby/sledovani', 'Sledovací kód')
        await page.getByLabel('Sledovací kód').fill(kod)
        await page.getByRole('button', { name: 'Vyhledat stav' }).click()
        await page.getByText('Vysoká tráva').first().waitFor({ timeout: 8000 })
        await zkontrolujObrazovku(page)
      })
      await krok('Lišta: tlačítko „+“ otevře nahlášení závady', async () => {
        await navstiv(page, '/deska', 'Vyvěšeno')
        await page.getByRole('button', { name: 'Nahlásit závadu v obci' }).click()
        await page.getByText('Co se děje?').waitFor({ timeout: 5000 })
      })
      vsechnyChyby.push(...page.chyby)
      await page.context().close()
    }

    // 4. Úřad: přihlášení, obnovení stránky, obrazovky a akce
    {
      const page = await novaStranka(browser)
      await krok('Úřad: přihlášení kódem', async () => {
        await navstiv(page, '/', 'Zvolte roli')
        await page.getByRole('button', { name: /Vstoupit jako Úřad/ }).click()
        await page.getByRole('button', { name: /Vybrat obec Javoří Lhota/ }).click()
        await page.getByRole('button', { name: 'Pokračovat k přihlášení' }).click()
        await page.getByLabel('E-mailová adresa').fill('starosta@example.cz')
        await page.getByRole('button', { name: 'Poslat kód' }).click()
        await page.getByRole('button', { name: 'Potvrdit a vstoupit' }).click()
        await page.getByRole('tab', { name: 'Krize' }).waitFor({ timeout: 8000 })
      })
      await krok('Úřad: obnovení stránky zůstane v roli Úřad', async () => {
        await page.reload()
        await page.getByRole('tab', { name: 'Krize' }).waitFor({ timeout: 8000 })
        await zkontrolujObrazovku(page)
      })
      await krok('Úřad: Krize – vydání informace obce', async () => {
        await page.getByRole('tab', { name: 'Krize' }).click()
        await page.getByText('Úroveň závažnosti').waitFor()
        await page.getByText('Informace obce', { exact: true }).click()
        await page
          .getByLabel('Titulek hlášení (max 90 znaků)')
          .fill('Odstávka vody v ulici Za Školou')
        await page
          .getByLabel('Podrobný text hlášení (max 300 znaků)')
          .fill('Ve čtvrtek od 8 do 12 hodin nepoteče voda.')
        await page.getByRole('button', { name: 'Vydat krizové hlášení' }).click()
        const potvrdit = page.getByRole('button', { name: 'Ano, vydat hlášení' })
        if (await potvrdit.count()) await potvrdit.click()
        await page.getByText('Odstávka vody v ulici Za Školou').first().waitFor({ timeout: 8000 })
        await zkontrolujObrazovku(page)
      })
      await krok('Úřad: Závady – změna stavu hlášení', async () => {
        await page.getByRole('tab', { name: 'Závady' }).click()
        await page.getByText('Správa hlášení závad').waitFor()
        await page.getByText('Vyřídit / Změnit stav').first().click()
        await page.getByText(/Detail hlášení/).waitFor()
        await page.getByRole('button', { name: /Uložit změny hlášení/ }).click()
        await page.waitForTimeout(800)
        await zkontrolujObrazovku(page)
      })
      await krok('Úřad: Budovy', async () => {
        await page.getByRole('tab', { name: 'Budovy' }).click()
        await zkontrolujObrazovku(page, 'Budovy a technologie')
      })
      await krok('Úřad: Přehled', async () => {
        await page.getByRole('tab', { name: 'Přehled' }).click()
        await zkontrolujObrazovku(page, 'Administrace úřadu')
        if (await page.getByText('Role: Občan').count())
          throw new Error('úřad má popisek „Role: Občan“')
      })
      await krok('Občan vidí krizi vydanou úřadem', async () => {
        await page.evaluate(
          ([klic, hodnota]) => localStorage.setItem(klic, hodnota),
          [KLIC_RELACE, JSON.stringify(OBCAN)],
        )
        await navstiv(page, '/zpravy', 'Zprávy a události')
        await navstiv(page, '/prehled', 'Vidíte nepořádek nebo závadu?')
        const text = await page.locator('body').innerText()
        if (
          !text.includes('Odstávka vody v ulici Za Školou') &&
          !/Další aktivní hlášení: [3-9]/.test(text)
        ) {
          throw new Error('nové hlášení není na přehledu občana')
        }
      })
      vsechnyChyby.push(...page.chyby)
      await page.context().close()
    }

    // 5. Neznámá adresa ukáže českou stránku
    {
      const page = await novaStranka(browser, OBCAN)
      await krok('Neznámá adresa ukáže stránku „Stránka nenalezena“', () =>
        navstiv(page, '/neexistuje', 'Stránka nenalezena'),
      )
      vsechnyChyby.push(...page.chyby.filter((c) => !c.includes('404')))
      await page.context().close()
    }

    // 6. Redaktor smí krizi uložit jen jako koncept
    {
      const page = await novaStranka(browser, { ...URAD, roleUradu: 'redaktor' })
      await krok('Úřad (redaktor): krizi nelze vydat, jen uložit koncept', async () => {
        await navstiv(page, '/urad/krize', 'Úroveň závažnosti')
        if (await page.getByRole('button', { name: 'Vydat krizové hlášení' }).count()) {
          throw new Error('redaktor vidí tlačítko Vydat krizové hlášení')
        }
        await page
          .getByRole('button', { name: /koncept/i })
          .first()
          .waitFor({ timeout: 5000 })
      })
      vsechnyChyby.push(...page.chyby)
      await page.context().close()
    }
  } finally {
    await browser.close()
    server.kill()
  }

  const chyby = [...new Set(vsechnyChyby)]
  for (const c of chyby) zapis(false, 'Chyba v prohlížeči', c)

  const neuspesne = vysledky.filter((v) => !v.ok)
  console.log(`\nKroků: ${vysledky.length}, chyb: ${neuspesne.length}`)
  process.exitCode = neuspesne.length ? 1 : 0
}

void main()
