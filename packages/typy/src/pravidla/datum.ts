/**
 * Dates for a Czech municipality. Everything public is shown in Europe/Prague.
 *
 * Day-only fields (úřední deska "visí od" / "visí do") are stored as 12:00 UTC of the
 * chosen calendar day. That is what the Payload date picker writes for `dayOnly`, and
 * noon never crosses a day boundary in Europe/Prague (UTC+1 / UTC+2), so the calendar
 * day can be read back unambiguously and compared as plain `YYYY-MM-DD` strings.
 */
export const TZ = 'Europe/Prague'

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/

/** Calendar day in Prague as `YYYY-MM-DD`. */
export function pragueDayKey(date: Date = new Date()): string {
  return dayKeyFormat.format(date)
}

/** Prague calendar day of a stored value, or null for empty or invalid input. */
export function dayKeyOf(value: string | Date | null | undefined): string | null {
  if (value == null || value === '') return null
  if (typeof value === 'string' && DAY_KEY.test(value)) return value
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : pragueDayKey(d)
}

/** Canonical stored form of a calendar day. */
export function noonUtc(dayKey: string): string {
  if (!DAY_KEY.test(dayKey)) throw new RangeError(`Neplatné datum: ${dayKey}`)
  return `${dayKey}T12:00:00.000Z`
}

/** Normalises any incoming date value to noon UTC of its Prague calendar day. */
export function toStoredDay(value: unknown): string | null {
  if (value == null || value === '') return null
  const key = dayKeyOf(value as string | Date)
  return key ? noonUtc(key) : null
}

/** `2. 11. 2026` – the form used on Czech official notice boards. */
export function formatDay(dayKey: string): string {
  const [y, m, d] = dayKey.split('-').map(Number)
  return `${d}. ${m}. ${y}`
}

const dateTimeFormat = new Intl.DateTimeFormat('cs-CZ', {
  timeZone: TZ,
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** `2. 11. 2026 8:00` in Prague time. */
export function formatDateTime(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value)
  // Intl gives "2. 11. 2026 8:00"; normalise the separators some engines use.
  return dateTimeFormat.format(d).replace(/ /g, ' ').replace(' v ', ' ')
}
