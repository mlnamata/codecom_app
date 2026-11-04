/**
 * Katalog komunikačních standardů, se kterými brána CodeKom počítá.
 *
 * Každý standard má poctivě uvedenou cestu, kterou se dnes připojí:
 * - `nativni`: brána má vlastní adaptér a mluví se zařízením napřímo,
 * - `mqtt-most`: zařízení obslouží most (Zigbee2MQTT, Z-Wave JS UI, ChirpStack…), brána čte jeho MQTT,
 * - `home-assistant`: zařízení obslouží integrace Home Assistantu, brána čte entity přes WebSocket API,
 * - `planovano`: existuje jen rozhraní adaptéru, implementace chybí.
 *
 * Údaje označené [OVĚŘIT] nejsou ověřené z dokumentace výrobce nebo projektu.
 */

export const CESTY = ['nativni', 'mqtt-most', 'home-assistant', 'planovano'] as const
export type Cesta = (typeof CESTY)[number]

/** Adaptéry brány, které existují v kódu (apps/brana/src/adaptery). */
export const ADAPTERY = ['homeassistant', 'mqtt', 'modbus-tcp', 'shelly-rpc', 'http-json'] as const
export type AdapterId = (typeof ADAPTERY)[number]

export type Vrstva = 'radio' | 'sbernice' | 'ip'

export interface ZpusobPripojeni {
  cesta: Cesta
  /** Adaptér brány, přes který data tečou. U `planovano` chybí. */
  adapter?: AdapterId
  /** Předvolba MQTT adaptéru, pokud cesta vede přes most. */
  predvolba?: string
  /** Most nebo integrace, kterou je potřeba spustit vedle brány. */
  most?: string
  poznamka?: string
}

export interface Standard {
  id: string
  nazev: string
  vrstva: Vrstva
  /** Typická zařízení v obecních budovách. */
  zarizeni: string[]
  /** Hardware, který brána potřebuje navíc. Prázdné = stačí síť LAN. */
  hardware: string[]
  /** Cesty seřazené od doporučené. */
  cesty: ZpusobPripojeni[]
  /** Jde zařízení řídit i bez internetu? */
  lokalni: boolean
  poznamka?: string
}

export const STANDARDY: readonly Standard[] = [
  {
    id: 'zigbee',
    nazev: 'Zigbee',
    vrstva: 'radio',
    zarizeni: ['termostatické hlavice', 'čidla teploty a vlhkosti', 'kontakty oken', 'čidla zaplavení', 'zásuvky'],
    hardware: ['koordinátor Zigbee na USB, například Home Assistant Connect ZBT-2'],
    cesty: [
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace ZHA', poznamka: 'výchozí cesta podle zadání IoT' },
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'zigbee2mqtt', most: 'Zigbee2MQTT', poznamka: 'když ZHA nepodporuje konkrétní zařízení' },
    ],
    lokalni: true,
  },
  {
    id: 'zwave',
    nazev: 'Z-Wave',
    vrstva: 'radio',
    zarizeni: ['hlavice', 'zámky', 'relé', 'čidla'],
    hardware: ['Z-Wave stick pro pásmo EU 868,4 MHz'],
    cesty: [
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Z-Wave (Z-Wave JS)' },
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'zwave-js-ui', most: 'Z-Wave JS UI s MQTT' },
    ],
    lokalni: true,
  },
  {
    id: 'thread',
    nazev: 'Thread',
    vrstva: 'radio',
    zarizeni: ['zařízení Matter přes Thread'],
    hardware: ['Thread border router, například ZBT-2 s firmwarem pro Thread [OVĚŘIT souběh Zigbee a Thread]'],
    cesty: [{ cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Thread a OpenThread Border Router' }],
    lokalni: true,
    poznamka: 'Thread je síťová vrstva, aplikační data nese Matter.',
  },
  {
    id: 'matter',
    nazev: 'Matter',
    vrstva: 'ip',
    zarizeni: ['zámky (Nuki přes Matter)', 'zásuvky', 'čidla', 'termostaty'],
    hardware: ['pro Matter přes Thread border router, pro Matter přes Wi-Fi nic'],
    cesty: [{ cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Matter (Matter Server)' }],
    lokalni: true,
    poznamka: 'Párování kódem nebo QR z krabičky zařízení. Přímý adaptér na Matter Server je [OVĚŘIT].',
  },
  {
    id: 'ble',
    nazev: 'Bluetooth LE',
    vrstva: 'radio',
    zarizeni: ['Shelly BLU hlavice a čidla', 'čidla BTHome'],
    hardware: ['Bluetooth v mini PC, nebo Bluetooth proxy (ESPHome), nebo Shelly BLU Gateway Gen3'],
    cesty: [
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Bluetooth a BTHome' },
      { cesta: 'nativni', adapter: 'shelly-rpc', poznamka: 'zařízení Shelly BLU přes BLU Gateway Gen3 a její lokální RPC [OVĚŘIT názvy komponent]' },
    ],
    lokalni: true,
  },
  {
    id: 'shelly',
    nazev: 'Wi-Fi a LAN: Shelly Gen2 a novější',
    vrstva: 'ip',
    zarizeni: ['měřiče energie Shelly Pro EM a 3EM', 'relé', 'stmívače'],
    hardware: [],
    cesty: [
      { cesta: 'nativni', adapter: 'shelly-rpc', poznamka: 'lokální RPC přes HTTP (Shelly.GetStatus, Switch.Set)' },
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'shelly', poznamka: 'jen čtení, zařízení publikuje stav do MQTT' },
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Shelly' },
    ],
    lokalni: true,
  },
  {
    id: 'esphome',
    nazev: 'Wi-Fi: ESPHome',
    vrstva: 'ip',
    zarizeni: ['vlastní čidla a relé na ESP32', 'Bluetooth proxy'],
    hardware: [],
    cesty: [
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace ESPHome (nativní API)' },
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'esphome', poznamka: 'když má zařízení zapnutou komponentu MQTT' },
    ],
    lokalni: true,
  },
  {
    id: 'tasmota',
    nazev: 'Wi-Fi: Tasmota',
    vrstva: 'ip',
    zarizeni: ['zásuvky a relé s firmwarem Tasmota'],
    hardware: [],
    cesty: [
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'tasmota' },
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Tasmota' },
    ],
    lokalni: true,
  },
  {
    id: 'lorawan',
    nazev: 'LoRaWAN',
    vrstva: 'radio',
    zarizeni: ['vodoměry a plynoměry s rádiovým modulem', 'venkovní čidla', 'čidla v odlehlých budovách'],
    hardware: ['LoRaWAN gateway (868 MHz) a síťový server ChirpStack, nebo pokrytí The Things Network'],
    cesty: [
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'chirpstack', most: 'ChirpStack v4', poznamka: 'jen příjem (uplink), downlink je plánovaný' },
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'ttn', most: 'The Things Stack v3', poznamka: 'jen příjem; data jdou přes server TTN, ověřte umístění v EU [OVĚŘIT]' },
    ],
    lokalni: true,
    poznamka: 'Lokální jen s vlastním ChirpStackem. Dekodér payloadu se nastavuje v síťovém serveru.',
  },
  {
    id: 'modbus-tcp',
    nazev: 'Modbus TCP',
    vrstva: 'ip',
    zarizeni: ['tepelná čerpadla', 'kotle', 'fotovoltaické střídače', 'elektroměry', 'vzduchotechnika'],
    hardware: [],
    cesty: [
      { cesta: 'nativni', adapter: 'modbus-tcp', poznamka: 'funkce 1, 2, 3, 4, 5, 6 a 16' },
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Modbus' },
    ],
    lokalni: true,
    poznamka: 'Mapa registrů je v dokumentaci výrobce zařízení.',
  },
  {
    id: 'modbus-rtu',
    nazev: 'Modbus RTU (RS-485)',
    vrstva: 'sbernice',
    zarizeni: ['elektroměry na DIN lištu', 'regulátory'],
    hardware: ['převodník RS-485 na Modbus TCP (doporučeno), nebo převodník RS-485 na USB'],
    cesty: [
      { cesta: 'nativni', adapter: 'modbus-tcp', poznamka: 'přes převodník RS-485 na Modbus TCP' },
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace Modbus (serial)' },
    ],
    lokalni: true,
  },
  {
    id: 'mbus',
    nazev: 'M-Bus a Wireless M-Bus',
    vrstva: 'sbernice',
    zarizeni: ['měřiče tepla', 'vodoměry', 'kalorimetry'],
    hardware: ['M-Bus převodník (drátový), nebo přijímač wM-Bus 868 MHz na USB'],
    cesty: [{ cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'wmbusmeters', most: 'wmbusmeters', poznamka: 'wmbusmeters publikuje odečty jako JSON do MQTT [OVĚŘIT tvar témat ve vaší konfiguraci]' }],
    lokalni: true,
  },
  {
    id: 'knx',
    nazev: 'KNX',
    vrstva: 'sbernice',
    zarizeni: ['osvětlení', 'žaluzie', 'vytápění ve větších budovách'],
    hardware: ['KNX IP rozhraní nebo router'],
    cesty: [{ cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace KNX' }],
    lokalni: true,
    poznamka: 'Skupinové adresy dodá projektant KNX instalace.',
  },
  {
    id: 'bacnet',
    nazev: 'BACnet/IP',
    vrstva: 'ip',
    zarizeni: ['řídicí systémy budov', 'vzduchotechnika'],
    hardware: [],
    cesty: [{ cesta: 'planovano', poznamka: 'jen rozhraní adaptéru; mezitím přes převodník BACnet na Modbus TCP nebo MQTT [OVĚŘIT]' }],
    lokalni: true,
  },
  {
    id: 'opcua',
    nazev: 'OPC UA',
    vrstva: 'ip',
    zarizeni: ['průmyslové řídicí systémy (ČOV, vodárna)'],
    hardware: [],
    cesty: [{ cesta: 'planovano', poznamka: 'jen rozhraní adaptéru' }],
    lokalni: true,
  },
  {
    id: 'mqtt',
    nazev: 'MQTT',
    vrstva: 'ip',
    zarizeni: ['cokoli, co publikuje do MQTT brokeru', 'zařízení s konvencí Homie'],
    hardware: ['MQTT broker v síti budovy (například doplněk Mosquitto v Home Assistantu)'],
    cesty: [
      { cesta: 'nativni', adapter: 'mqtt', predvolba: 'obecna' },
      { cesta: 'nativni', adapter: 'mqtt', predvolba: 'homie' },
    ],
    lokalni: true,
  },
  {
    id: 'http',
    nazev: 'HTTP a REST',
    vrstva: 'ip',
    zarizeni: ['zařízení s lokálním JSON API', 'meteostanice'],
    hardware: [],
    cesty: [{ cesta: 'nativni', adapter: 'http-json', poznamka: 'pravidelné čtení JSON, zápis jen tam, kde to adaptér umí' }],
    lokalni: true,
  },
  {
    id: 'coap',
    nazev: 'CoAP a LwM2M',
    vrstva: 'ip',
    zarizeni: ['úsporná čidla NB-IoT'],
    hardware: [],
    cesty: [{ cesta: 'planovano', poznamka: 'jen rozhraní adaptéru' }],
    lokalni: false,
    poznamka: 'Zařízení NB-IoT běží přes síť operátora, nejsou lokální.',
  },
  {
    id: 'opentherm',
    nazev: 'OpenTherm',
    vrstva: 'sbernice',
    zarizeni: ['plynové kotle'],
    hardware: ['OpenTherm Gateway mezi kotlem a termostatem'],
    cesty: [{ cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace OpenTherm Gateway' }],
    lokalni: true,
  },
  {
    id: 'dali',
    nazev: 'DALI',
    vrstva: 'sbernice',
    zarizeni: ['osvětlení v sálech a školách'],
    hardware: ['převodník DALI na Modbus TCP nebo KNX [OVĚŘIT dostupné typy]'],
    cesty: [
      { cesta: 'nativni', adapter: 'modbus-tcp', poznamka: 'přes převodník DALI na Modbus TCP' },
      { cesta: 'planovano', poznamka: 'přímý adaptér DALI' },
    ],
    lokalni: true,
  },
  {
    id: 'onewire',
    nazev: '1-Wire',
    vrstva: 'sbernice',
    zarizeni: ['teplotní čidla DS18B20 v potrubí a v kotelně'],
    hardware: ['modul ESP32 s ESPHome nebo Tasmota, nebo převodník 1-Wire na USB'],
    cesty: [
      { cesta: 'mqtt-most', adapter: 'mqtt', predvolba: 'tasmota', poznamka: 'čidla připojená k modulu s Tasmotou' },
      { cesta: 'home-assistant', adapter: 'homeassistant', most: 'ESPHome nebo integrace 1-Wire' },
    ],
    lokalni: true,
  },
  {
    id: 'enocean',
    nazev: 'EnOcean',
    vrstva: 'radio',
    zarizeni: ['bezbateriové vypínače', 'kontakty oken'],
    hardware: ['přijímač EnOcean na USB'],
    cesty: [{ cesta: 'home-assistant', adapter: 'homeassistant', most: 'integrace EnOcean' }],
    lokalni: true,
  },
] as const

export const najdiStandard = (id: string): Standard | undefined => STANDARDY.find((s) => s.id === id)

/** Doporučená cesta: první v seznamu. */
export const doporucenaCesta = (s: Standard): ZpusobPripojeni => s.cesty[0] ?? { cesta: 'planovano' }
