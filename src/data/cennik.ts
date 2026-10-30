// Prepísané zo záložky „Cenník 2027“ v data.xlsx (pracovná verzia, Ing. Kováčová, 4. 11. 2026).
// Všetky sumy sú v centoch, bez DPH, ak nie je uvedené inak.

export type CenaMiestnosti = {
  kod: string;
  nazov: string;
  pausal: number; // centy, raz za rezerváciu
  zaBlok: number; // centy
  blokMin: number;
  poznamka?: string;
};

export const CENY_MIESTNOSTI: CenaMiestnosti[] = [
  { kod: "R-AULA", nazov: "Aula Magna", pausal: 15000, zaBlok: 10000, blokMin: 60 },
  { kod: "R-205", nazov: "Konferenčná miestnosť", pausal: 2000, zaBlok: 2000, blokMin: 60 },
  { kod: "UK-1", nazov: "Veľká čitáreň", pausal: 0, zaBlok: 2500, blokMin: 60 },
  { kod: "FU-K1", nazov: "Koncertná sála", pausal: 5000, zaBlok: 7000, blokMin: 60, poznamka: "ladenie klavíra pozri služby" },
  { kod: "FIE-P1", nazov: "Posluchárňa P1", pausal: 0, zaBlok: 6000, blokMin: 90, poznamka: "vyučovací blok 90 min" },
  { kod: "SC-H", nazov: "Športová hala (celá)", pausal: 1000, zaBlok: 5500, blokMin: 60, poznamka: "polovica haly: cenu doplní ŠC" },
  { kod: "IPH-K1", nazov: "Konferenčná sála N1", pausal: 2000, zaBlok: 1250, blokMin: 30 },
  // „IPH-M1 až IPH-M4“ je v cenníku jeden riadok
  { kod: "IPH-M1", nazov: "Meeting room 1", pausal: 0, zaBlok: 600, blokMin: 30 },
  { kod: "IPH-M2", nazov: "Meeting room 2", pausal: 0, zaBlok: 600, blokMin: 30 },
  { kod: "IPH-M3", nazov: "Meeting room 3", pausal: 0, zaBlok: 600, blokMin: 30 },
  { kod: "IPH-M4", nazov: "Meeting room 4", pausal: 0, zaBlok: 600, blokMin: 30 },
];

export function cenaMiestnosti(kod: string) {
  return CENY_MIESTNOSTI.find((c) => c.kod === kod);
}

export type SluzbaId =
  | "technik"
  | "videosada"
  | "streaming"
  | "upratovanie"
  | "coffee"
  | "obed"
  | "parking"
  | "ladenie";

export type Sluzba = {
  id: SluzbaId;
  nazov: string;
  kde: string; // text z cenníka
  uctujeSa: string; // text z cenníka
  dph: 23 | 19;
  pausal?: number; // centy
  zaJednotku?: number; // centy
  blokMin?: number;
  sDph?: boolean; // cena už obsahuje DPH
  poznamka?: string;
  dostupnaPre: (kodMiestnosti: string) => boolean;
};

const vsade = () => true;

export const SLUZBY: Sluzba[] = [
  {
    id: "technik",
    nazov: "Technik (zvuk, svetlo, záznam)",
    kde: "Aula, FU, IPH",
    uctujeSa: "za čas (vlastný blok 60 min)",
    dph: 23,
    pausal: 0,
    zaJednotku: 2500,
    blokMin: 60,
    poznamka: "účtuje sa po hodinách",
    dostupnaPre: (k) => k === "R-AULA" || k.startsWith("FU-") || k.startsWith("IPH-"),
  },
  {
    id: "videosada",
    nazov: "Videokonferenčná sada (kamera, mikrofón)",
    kde: "všetky pracoviská",
    uctujeSa: "za blok miestnosti",
    dph: 23,
    pausal: 1750,
    zaJednotku: 0,
    dostupnaPre: vsade,
  },
  {
    id: "streaming",
    nazov: "Živé vysielanie (streaming)",
    kde: "R-AULA, IPH-K1",
    uctujeSa: "za rezerváciu",
    dph: 23,
    pausal: 4000,
    poznamka: "len s technikom",
    dostupnaPre: (k) => k === "R-AULA" || k === "IPH-K1",
  },
  {
    id: "upratovanie",
    nazov: "Upratovanie po akcii",
    kde: "všetky pracoviská",
    uctujeSa: "za rezerváciu",
    dph: 23,
    pausal: 3500,
    dostupnaPre: vsade,
  },
  {
    id: "coffee",
    nazov: "Coffee break (káva, čaj, voda, pečivo)",
    kde: "všetky pracoviská",
    uctujeSa: "za osobu",
    dph: 19,
    zaJednotku: 420,
    dostupnaPre: vsade,
  },
  {
    id: "obed",
    nazov: "Obed (catering)",
    kde: "všetky pracoviská",
    uctujeSa: "za osobu",
    dph: 19,
    zaJednotku: 990,
    sDph: true,
    poznamka: "cena od dodávateľa vrátane DPH",
    dostupnaPre: vsade,
  },
  {
    id: "parking",
    nazov: "Parkovacie miesto",
    kde: "IPH",
    uctujeSa: "za kus (za miesto a deň)",
    dph: 23,
    zaJednotku: 400,
    dostupnaPre: (k) => k.startsWith("IPH-"),
  },
  {
    id: "ladenie",
    nazov: "Ladenie klavíra",
    kde: "FU-K1",
    uctujeSa: "za rezerváciu",
    dph: 23,
    pausal: 6000,
    dostupnaPre: (k) => k === "FU-K1",
  },
];

export const ZLAVY = {
  zamestnanec: 30, // % z ceny miestnosti, nie zo služieb
  spolok: 50, // %
};
