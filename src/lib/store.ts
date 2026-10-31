"use client";

// Jednoduché úložisko v prehliadači (localStorage). Prototyp nemá databázu (P24).

import { useSyncExternalStore } from "react";
import { UKAZKOVE_ZIADOSTI } from "./ukazka";
import type { Kalkulacia, Objednavka } from "./vypocet";

export type Ziadatel = {
  firma: string;
  ico: string;
  adresa: string;
  kontakt: string;
  email: string;
  telefon: string;
  ucel: string;
};

export type Koncept = Objednavka & { ziadatel: Ziadatel };

export type Ziadost = {
  cislo: string;
  vytvorena: string;
  objednavka: Objednavka;
  ziadatel: Ziadatel;
  kalkulacia: Kalkulacia;
  schvalovatel: string;
  stav: "caka" | "schvalena" | "zamietnuta" | "zrusena";
  rozhodnutie?: { kto: string; kedy: string; dovod: string };
  zrusena?: string; // kedy žiadateľ rezerváciu zrušil
};

export type Rola = "host" | "schvalovatel" | "ekonom";

type Stav = { rola: Rola | null; koncept: Koncept | null; ziadosti: Ziadost[] };

const KLUC = "uh-rezervacie-prototyp-v4"; // v4: telefón žiadateľa, zrušenie
// Nový návštevník začína s ukážkovými žiadosťami
const ZACIATOK: Stav = { rola: null, koncept: null, ziadosti: UKAZKOVE_ZIADOSTI };

let stav: Stav = ZACIATOK;
let nacitane = false;
const posluchaci = new Set<() => void>();

function nacitaj() {
  if (nacitane || typeof window === "undefined") return;
  nacitane = true;
  try {
    const t = localStorage.getItem(KLUC);
    if (t) stav = { ...ZACIATOK, ...JSON.parse(t) };
  } catch {
    stav = ZACIATOK;
  }
}

function zmen(f: (s: Stav) => Stav) {
  nacitaj();
  stav = f(stav);
  localStorage.setItem(KLUC, JSON.stringify(stav));
  posluchaci.forEach((p) => p());
}

export function useStav() {
  return useSyncExternalStore(
    (p) => {
      posluchaci.add(p);
      return () => posluchaci.delete(p);
    },
    () => {
      nacitaj();
      return stav;
    },
    () => ZACIATOK,
  );
}

export function nastavRolu(rola: Rola | null) {
  zmen((s) => ({ ...s, rola }));
}

export function ulozKoncept(k: Koncept | null) {
  zmen((s) => ({ ...s, koncept: k }));
}

export function odosliZiadost(z: Omit<Ziadost, "cislo" | "vytvorena" | "stav">) {
  let cislo = "";
  zmen((s) => {
    cislo = `REZ-2027-${String(s.ziadosti.length + 1).padStart(4, "0")}`;
    const nova: Ziadost = { ...z, cislo, vytvorena: new Date().toISOString(), stav: "caka" };
    return { ...s, koncept: null, ziadosti: [...s.ziadosti, nova] };
  });
  return cislo;
}

export function rozhodni(cislo: string, stavZiadosti: "schvalena" | "zamietnuta", kto: string, dovod: string) {
  zmen((s) => ({
    ...s,
    ziadosti: s.ziadosti.map((z) =>
      z.cislo === cislo ? { ...z, stav: stavZiadosti, rozhodnutie: { kto, kedy: new Date().toISOString(), dovod } } : z,
    ),
  }));
}

// Žiadateľ zruší čakajúcu alebo schválenú rezerváciu
export function zrus(cislo: string) {
  zmen((s) => ({
    ...s,
    ziadosti: s.ziadosti.map((z) => (z.cislo === cislo ? { ...z, stav: "zrusena", zrusena: new Date().toISOString() } : z)),
  }));
}

// Vráti ukážkové žiadosti, zmaže vlastné. Rola ostane.
export function obnovUkazku() {
  zmen((s) => ({ ...ZACIATOK, rola: s.rola }));
}
