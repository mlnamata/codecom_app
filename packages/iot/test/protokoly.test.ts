import { describe, expect, it } from 'vitest'
import { ADAPTERY, STANDARDY, doporucenaCesta, najdiStandard } from '../src/protokoly'

describe('katalog standardů', () => {
  it('má jedinečná id a každý standard aspoň jednu cestu', () => {
    const id = STANDARDY.map((s) => s.id)
    expect(new Set(id).size).toBe(id.length)
    for (const s of STANDARDY) expect(s.cesty.length).toBeGreaterThan(0)
  })

  it('cesty mimo plánované odkazují na existující adaptér', () => {
    for (const s of STANDARDY)
      for (const c of s.cesty) {
        if (c.cesta === 'planovano') expect(c.adapter).toBeUndefined()
        else expect(ADAPTERY).toContain(c.adapter)
      }
  })

  it('pokrývá požadované standardy', () => {
    for (const id of ['zigbee', 'zwave', 'thread', 'matter', 'ble', 'shelly', 'esphome', 'tasmota', 'lorawan', 'modbus-tcp', 'modbus-rtu', 'mbus', 'knx', 'bacnet', 'opcua', 'mqtt', 'http', 'coap', 'opentherm', 'dali', 'onewire', 'enocean'])
      expect(najdiStandard(id), id).toBeDefined()
  })

  it('doporučená cesta je první v seznamu', () => {
    expect(doporucenaCesta(najdiStandard('zigbee')!).cesta).toBe('home-assistant')
  })
})
