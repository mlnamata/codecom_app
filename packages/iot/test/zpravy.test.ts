import { describe, expect, it } from 'vitest'
import { konfiguraceSchema, prikazSchema, rozlozTema, tema, telemetrieSchema } from '../src'

describe('témata MQTT', () => {
  it('skládá a rozkládá téma brány', () => {
    const t = tema('lhota-urad', 'telemetrie')
    expect(t).toBe('codekom/v1/brany/lhota-urad/telemetrie')
    expect(rozlozTema(t)).toEqual({ branaId: 'lhota-urad', druh: 'telemetrie' })
  })
  it('odmítne cizí nebo neplatné téma', () => {
    expect(rozlozTema('codekom/v1/brany/x/telemetrie')).toBeNull()
    expect(rozlozTema('jine/v1/brany/lhota/stav')).toBeNull()
    expect(rozlozTema('codekom/v1/brany/lhota/neznamy')).toBeNull()
    expect(() => tema('Lhota Úřad', 'stav')).toThrow()
  })
})

describe('zprávy', () => {
  it('ověří dávku telemetrie', () => {
    expect(telemetrieSchema.safeParse({ seq: 1, vzorky: [{ cas: '2026-11-04T12:00:00Z', prvekId: 'p1', metrika: 'teplota', hodnota: 21.5 }] }).success).toBe(true)
    expect(telemetrieSchema.safeParse({ seq: 1, vzorky: [] }).success).toBe(false)
    expect(telemetrieSchema.safeParse({ seq: 1, vzorky: [{ cas: 'vcera', prvekId: 'p1', metrika: 'teplota', hodnota: 1 }] }).success).toBe(false)
  })
  it('příkaz vyžaduje platnost a idempotencyKey', () => {
    expect(prikazSchema.safeParse({ id: 'a', typ: 'otevriDvere', prvekId: 'z', platnoDo: '2026-11-04T12:00:30Z', idempotencyKey: '12345678' }).success).toBe(true)
    expect(prikazSchema.safeParse({ id: 'a', typ: 'otevriDvere', prvekId: 'z', platnoDo: '2026-11-04T12:00:30Z' }).success).toBe(false)
  })
})

describe('konfigurace', () => {
  const zaklad = {
    branaId: 'lhota-urad',
    pripojeni: [
      { id: 'ha', protokol: 'homeassistant', url: 'ws://supervisor/core/websocket', token: 'env:SUPERVISOR_TOKEN', body: [{ id: 't-sal', prvekId: 'cidlo-sal', metrika: 'teplota', entita: 'sensor.sal_teplota' }, { id: 'h-sal', prvekId: 'hlavice-sal', metrika: 'cilovaTeplota', entita: 'climate.sal', atribut: 'temperature', zapis: true }] },
      { id: 'em', protokol: 'modbus-tcp', host: '192.168.10.20', body: [{ id: 'em-p', prvekId: 'elektromer', metrika: 'vykonW', tabulka: 'input', adresa: 12, format: 'float32' }] },
    ],
    mraz: [{ teplotaBod: 't-sal', cilBod: 'h-sal' }],
  }
  it('přijme platnou konfiguraci s výchozími hodnotami', () => {
    const k = konfiguraceSchema.parse(zaklad)
    expect(k.mraz[0]?.prahC).toBe(5)
    const mb = k.pripojeni[1]
    expect(mb?.protokol === 'modbus-tcp' && mb.port).toBe(502)
  })
  it('odmítne heslo zapsané přímo a duplicitní body', () => {
    const s = structuredClone(zaklad) as { pripojeni: { token?: string }[] }
    s.pripojeni[0]!.token = 'tajne-heslo'
    expect(konfiguraceSchema.safeParse(s).success).toBe(false)
    const d = structuredClone(zaklad)
    d.pripojeni[1]!.body[0]!.id = 't-sal'
    expect(konfiguraceSchema.safeParse(d).success).toBe(false)
  })
  it('odmítne pravidlo mrazu s neznámým bodem', () => {
    expect(konfiguraceSchema.safeParse({ ...zaklad, mraz: [{ teplotaBod: 'neni', cilBod: 'h-sal' }] }).success).toBe(false)
  })
})
