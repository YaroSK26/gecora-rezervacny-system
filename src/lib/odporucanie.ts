// Odporúčanie miestnosti podľa pravidiel (P24, P25): zmestí sa, je v rozpočte, najmenej prázdnych miest.

import { cenaMiestnosti } from "@/data/cennik";
import { dovodNedostupnosti, MIESTNOSTI, otvaracieHodiny, type Miestnost } from "./vypocet";

export type Poziadavka = { osoby: number; hodiny: number; rozpocet: number | null }; // rozpočet v centoch bez DPH

export type Navrh = {
  m: Miestnost;
  cena: number; // centy bez DPH, len miestnosť
  bloky: number;
  vRozpocte: boolean;
  dovody: string[];
};

// Cena miestnosti pre daný čas: paušál + začaté bloky × cena za blok (P3)
export function cenaZaCas(kod: string, minut: number) {
  const c = cenaMiestnosti(kod);
  if (!c) return null;
  const bloky = Math.ceil(minut / c.blokMin);
  return { cena: c.pausal + bloky * c.zaBlok, bloky, blokMin: c.blokMin };
}

export function odporuc(p: Poziadavka): { vhodne: Navrh[]; nadRozpocet: Navrh[] } {
  const minut = Math.round(p.hodiny * 60);
  const navrhy: Navrh[] = [];

  for (const m of MIESTNOSTI) {
    if (dovodNedostupnosti(m) || typeof m.kapacita !== "number" || m.kapacita < p.osoby) continue;
    const hodiny = otvaracieHodiny(m.otvaracieHodiny);
    if (hodiny && hodiny[1] - hodiny[0] < minut) continue;
    const c = cenaZaCas(m.kod, minut)!;
    const vRozpocte = p.rozpocet === null || c.cena <= p.rozpocet;
    navrhy.push({
      m,
      cena: c.cena,
      bloky: c.bloky,
      vRozpocte,
      dovody: [
        `${m.kapacita} miest pre ${p.osoby} ${p.osoby === 1 ? "osobu" : "osôb"}`,
        `${c.bloky} ${c.bloky === 1 ? "blok" : c.bloky < 5 ? "bloky" : "blokov"} po ${c.blokMin} min`,
        ...(m.vybavenie ? [m.vybavenie] : []),
      ],
    });
  }

  // Najmenej prázdnych miest, potom najnižšia cena
  navrhy.sort((a, b) => (a.m.kapacita as number) - (b.m.kapacita as number) || a.cena - b.cena);
  return {
    vhodne: navrhy.filter((n) => n.vRozpocte),
    nadRozpocet: navrhy.filter((n) => !n.vRozpocte).sort((a, b) => a.cena - b.cena),
  };
}
