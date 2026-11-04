import type {
  Akce,
  Aktualita,
  Budova,
  DokumentDesky,
  FiltrDesky,
  HlaseniRozhlasu,
  HlaseniZavady,
  KrizoveHlaseni,
  ObecVerejna,
  Poplatek,
  Prehled,
  PrehledUradu,
  Prostor,
  Rezervace,
  RoleUradu,
  StavZavady,
  StavZavadyVerejny,
  VstupKrize,
  VstupRezervace,
  VstupRozhlasu,
  VstupZavady,
} from '@codekom/typy'

export type RezimZdroje = 'api' | 'vestavene'

export interface ZdrojAplikace {
  rezim: RezimZdroje
  obce(): Promise<ObecVerejna[]>
  prehled(obec: string): Promise<Prehled>
  krizeAktivni(obec: string): Promise<{ hlavni: KrizoveHlaseni | null; dalsich: number }>
  deska(obec: string, filtr?: FiltrDesky): Promise<DokumentDesky[]>
  dokument(obec: string, id: string): Promise<DokumentDesky | null>
  aktuality(obec: string): Promise<Aktualita[]>
  akce(obec: string): Promise<Akce[]>
  sluzby(obec: string): Promise<{ poplatky: Poplatek[]; prostory: Prostor[]; rezervace: Rezervace[] }>
  odeslatZavadu(obec: string, v: VstupZavady): Promise<{ cislo: string; sledovaciKod: string }>
  stavZavady(obec: string, kod: string): Promise<StavZavadyVerejny | null>
  zadatRezervaci(obec: string, v: VstupRezervace): Promise<Rezervace>
  urad: {
    prehled(obec: string): Promise<PrehledUradu>
    zavady(obec: string, stav?: StavZavady): Promise<HlaseniZavady[]>
    zmenitStavZavady(
      obec: string,
      id: string,
      v: { stav: StavZavady; verejnaOdpoved?: string },
    ): Promise<HlaseniZavady>
    vydatKrizi(obec: string, v: VstupKrize, role: RoleUradu): Promise<KrizoveHlaseni>
    ukoncitKrizi(obec: string, id: string, role: RoleUradu): Promise<KrizoveHlaseni>
    vydatRozhlas(obec: string, v: VstupRozhlasu, role: RoleUradu): Promise<HlaseniRozhlasu>
    budovy(obec: string): Promise<Budova[]>
  }
  obnovitUkazku(): Promise<void>
}
