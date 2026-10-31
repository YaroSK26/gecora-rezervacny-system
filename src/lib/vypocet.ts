// Výpočet ceny podľa Cenníka 2027. Všetko v centoch (celé čísla), aby sumy sedeli na cent.

import { cenaMiestnosti, SLUZBY, ZLAVY, type SluzbaId } from "@/data/cennik";
import miestnosti from "@/data/miestnosti.json";
import type { Ziadatel } from "./store";

export type Miestnost = (typeof miestnosti)[number];
export const MIESTNOSTI: Miestnost[] = miestnosti;

export function miestnost(kod: string) {
  return MIESTNOSTI.find((m) => m.kod === kod);
}

export type TypZiadatela = "externa" | "spolok" | "zamestnanec";

export type Volby = {
  bloky: "nahor" | "presne"; // P9
  pausal: "raz" | "zaTermin"; // P21
  spolok: "50" | "zadarmo"; // P19
  videosada: "raz" | "zaBlok"; // P12
};

export const PREDVOLENE_VOLBY: Volby = {
  bloky: "nahor",
  pausal: "raz",
  spolok: "50",
  videosada: "raz",
};

export type Objednavka = {
  kod: string;
  terminy: string[]; // ISO dátumy, YYYY-MM-DD
  od: string; // HH:MM
  do: string; // HH:MM
  osoby: number;
  typ: TypZiadatela;
  sluzby: Partial<Record<SluzbaId, number>>; // 0/1 pri áno/nie, inak počet kusov
};

export type Riadok = {
  nazov: string;
  vypocet: string;
  zaklad: number; // centy bez DPH
  sadzba: 23 | 19;
  brutto?: number; // len pri položkách s cenou vrátane DPH
  predpoklady: string[];
};

export type Kalkulacia = {
  riadky: Riadok[];
  skupiny: { sadzba: 23 | 19; zaklad: number; dph: number }[];
  spoluZaklad: number;
  spoluDph: number;
  spoluSDph: number;
};

export function minuty(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function eur(centy: number) {
  const s = (Math.abs(centy) / 100).toLocaleString("sk-SK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${centy < 0 ? "−" : ""}${s} €`;
}

function slovoBlok(n: number) {
  if (n === 1) return "blok";
  if (Number.isInteger(n) && n >= 2 && n <= 4) return "bloky";
  return "blokov";
}

function cislo(n: number) {
  return n.toLocaleString("sk-SK", { maximumFractionDigits: 2 });
}

// Počet blokov pre jeden termín. Pri „nahor“ sa začatý blok platí celý.
function pocetBlokov(trvanieMin: number, blokMin: number, volby: Volby) {
  const presne = trvanieMin / blokMin;
  return volby.bloky === "nahor" ? Math.ceil(presne) : presne;
}

// Zaokrúhlenie na cent, 0,5 nahor. Funguje aj pre záporné čísla (zľavy).
function naCent(x: number) {
  return Math.sign(x) * Math.round(Math.abs(x));
}

export function vypocitaj(o: Objednavka, volby: Volby = PREDVOLENE_VOLBY): Kalkulacia {
  const cena = cenaMiestnosti(o.kod);
  if (!cena) throw new Error(`Miestnosť ${o.kod} nemá cenu v Cenníku 2027`);

  const n = o.terminy.length;
  const trvanie = minuty(o.do) - minuty(o.od);
  const riadky: Riadok[] = [];
  const terminyText = n > 1 ? `${n} termínov × ` : "";

  // Miestnosť: paušál + bloky
  const pausalKrat = volby.pausal === "raz" ? 1 : n;
  if (cena.pausal > 0) {
    riadky.push({
      nazov: `${o.kod} ${cena.nazov}: paušál za rezerváciu`,
      vypocet: `${pausalKrat} × ${eur(cena.pausal)}`,
      zaklad: pausalKrat * cena.pausal,
      sadzba: 23,
      predpoklady: n > 1 ? ["P21"] : [],
    });
  }
  const bloky = pocetBlokov(trvanie, cena.blokMin, volby);
  riadky.push({
    nazov: `${o.kod} ${cena.nazov}: prenájom`,
    vypocet: `${terminyText}${cislo(trvanie / 60)} h = ${cislo(bloky)} ${slovoBlok(bloky)} po ${cena.blokMin} min × ${eur(cena.zaBlok)}`,
    zaklad: naCent(n * bloky * cena.zaBlok),
    sadzba: 23,
    predpoklady: trvanie % cena.blokMin !== 0 ? ["P9"] : [],
  });
  const cenaZaMiestnost = riadky.reduce((s, r) => s + r.zaklad, 0);

  // Zľava (len z ceny miestnosti)
  const zlava =
    o.typ === "spolok" ? (volby.spolok === "zadarmo" ? 100 : ZLAVY.spolok) : o.typ === "zamestnanec" ? ZLAVY.zamestnanec : 0;
  if (zlava > 0) {
    riadky.push({
      nazov: o.typ === "spolok" ? `Zľava študentský spolok UH ${zlava} %` : `Zľava zamestnanec UH ${zlava} %`,
      vypocet: `${zlava} % z ${eur(cenaZaMiestnost)}`,
      zaklad: -naCent((cenaZaMiestnost * zlava) / 100),
      sadzba: 23,
      predpoklady: o.typ === "spolok" ? ["P19", "P20"] : ["P20", "P22"],
    });
  }

  // Služby
  for (const s of SLUZBY) {
    const pocet = o.sluzby[s.id] ?? 0;
    if (!pocet) continue;

    if (s.id === "technik") {
      const b = pocetBlokov(trvanie, s.blokMin!, volby);
      riadky.push({
        nazov: s.nazov,
        vypocet: `${terminyText}${cislo(trvanie / 60)} h = ${cislo(b)} h × ${eur(s.zaJednotku!)}`,
        zaklad: naCent(n * b * s.zaJednotku!),
        sadzba: s.dph,
        predpoklady: ["P11", ...(trvanie % s.blokMin! !== 0 ? ["P9"] : [])],
      });
    } else if (s.id === "videosada") {
      const krat = volby.videosada === "raz" ? pausalKrat : Math.ceil(n * bloky);
      riadky.push({
        nazov: s.nazov,
        vypocet:
          volby.videosada === "raz"
            ? `paušál ${krat} × ${eur(s.pausal!)} + ${cislo(n * bloky)} blokov × ${eur(s.zaJednotku!)}`
            : `${krat} blokov miestnosti × ${eur(s.pausal!)}`,
        zaklad: krat * s.pausal!,
        sadzba: s.dph,
        predpoklady: ["P12"],
      });
    } else if (s.pausal) {
      // za rezerváciu
      riadky.push({
        nazov: s.nazov,
        vypocet: `${pausalKrat} × ${eur(s.pausal)}`,
        zaklad: pausalKrat * s.pausal,
        sadzba: s.dph,
        predpoklady: s.id === "upratovanie" ? ["P15"] : s.id === "streaming" ? ["P23"] : [],
      });
    } else if (s.sDph) {
      // obed: cena je s DPH, základ dopočítame spätne
      const brutto = n * pocet * s.zaJednotku!;
      riadky.push({
        nazov: s.nazov,
        vypocet: `${terminyText}${pocet} os. × ${eur(s.zaJednotku!)} s DPH`,
        zaklad: Math.round((brutto * 100) / (100 + s.dph)),
        brutto,
        sadzba: s.dph,
        predpoklady: ["P14", "P13"],
      });
    } else {
      // za osobu alebo za kus
      riadky.push({
        nazov: s.nazov,
        vypocet: `${terminyText}${pocet} ${s.id === "parking" ? "ks" : "os."} × ${eur(s.zaJednotku!)}`,
        zaklad: n * pocet * s.zaJednotku!,
        sadzba: s.dph,
        predpoklady: s.id === "coffee" ? ["P13"] : [],
      });
    }
  }

  // DPH zo súčtu za každú sadzbu (P17)
  const skupiny = ([23, 19] as const)
    .map((sadzba) => {
      const r = riadky.filter((x) => x.sadzba === sadzba);
      const netto = r.filter((x) => x.brutto === undefined);
      const sDph = r.filter((x) => x.brutto !== undefined);
      const zakladNetto = netto.reduce((s, x) => s + x.zaklad, 0);
      const dphNetto = naCent((zakladNetto * sadzba) / 100);
      const zakladBrutto = sDph.reduce((s, x) => s + x.zaklad, 0);
      const dphBrutto = sDph.reduce((s, x) => s + x.brutto!, 0) - zakladBrutto;
      return { sadzba, zaklad: zakladNetto + zakladBrutto, dph: dphNetto + dphBrutto, pocet: r.length };
    })
    .filter((g) => g.pocet > 0)
    .map(({ sadzba, zaklad, dph }) => ({ sadzba, zaklad, dph }));

  const spoluZaklad = skupiny.reduce((s, g) => s + g.zaklad, 0);
  const spoluDph = skupiny.reduce((s, g) => s + g.dph, 0);
  return { riadky, skupiny, spoluZaklad, spoluDph, spoluSDph: spoluZaklad + spoluDph };
}

export function kapacitaText(m: Miestnost) {
  if (typeof m.kapacita === "number") return `${m.kapacita} miest`;
  return !m.kapacita || m.kapacita === "?" ? "neuvedená" : m.kapacita;
}

// Údaje žiadateľa: vrátane tvaru e-mailu, telefónu a IČO (8 číslic)
export function chybaPola(pole: keyof Ziadatel, hodnota: string): string | null {
  const v = hodnota.trim();
  if (!v) return "Povinné pole.";
  if (pole === "email" && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) return "Zadajte platný e-mail, napr. meno@firma.sk.";
  if (pole === "ico" && !/^\d{8}$/.test(v.replace(/\s/g, ""))) return "IČO má 8 číslic.";
  if (pole === "telefon" && !/^\+?\d{9,15}$/.test(v.replace(/[\s/-]/g, ""))) return "Zadajte telefón, napr. +421 905 123 456.";
  if (pole === "firma" && v.length < 2) return "Zadajte názov firmy.";
  if (pole === "kontakt" && !/\s/.test(v)) return "Zadajte meno aj priezvisko.";
  if (pole === "adresa" && !/\d/.test(v)) return "Zadajte ulicu, číslo, PSČ a mesto.";
  return null;
}

// Kontroly pred odoslaním. Vracia zoznam chýb (prázdny = v poriadku).
export function kontrola(o: Objednavka): string[] {
  const m = miestnost(o.kod);
  const chyby: string[] = [];
  if (!m) return ["Neznáma miestnosť."];
  if (o.terminy.length === 0 || o.terminy.some((d) => !d)) chyby.push("Vyberte dátum.");
  if (o.terminy.some((d) => d && d < "2027-01-01")) chyby.push("Rezervovať sa dá od 1. 1. 2027 (cenník platí od 2027).");
  if (!o.od || !o.do || minuty(o.do) <= minuty(o.od)) chyby.push("Čas „do“ musí byť neskôr ako čas „od“.");
  const hodiny = otvaracieHodiny(m.otvaracieHodiny);
  if (hodiny && o.od && o.do && (minuty(o.od) < hodiny[0] || minuty(o.do) > hodiny[1]))
    chyby.push(`Miestnosť je otvorená ${m.otvaracieHodiny.split(" (")[0]}.`);
  if (typeof m.kapacita === "number" && o.osoby > m.kapacita)
    chyby.push(`Kapacita miestnosti je ${m.kapacita} osôb.`);
  if (o.osoby < 1) chyby.push("Zadajte počet osôb.");
  if (o.sluzby.streaming && !o.sluzby.technik) chyby.push("Streaming sa dá objednať len s technikom.");
  return chyby;
}

// „07:00 až 19:00“ alebo „08:00 až 19:00 (budova 08:00 až 20:00)“ → minúty od/do. Berieme hodiny miestnosti (P6).
export function otvaracieHodiny(text: string): [number, number] | null {
  const t = text.match(/(\d{2}:\d{2}).*?(\d{2}:\d{2})/);
  return t ? [minuty(t[1]), minuty(t[2])] : null;
}

// Kto môže miestnosť rezervovať ako externý žiadateľ a prečo nie
export function dovodNedostupnosti(m: Miestnost): string | null {
  if (m.kod === "SC-F") return "Fitnes sa nerezervuje, len členstvo.";
  if (m.kod === "SC-B") return "Bazén sa rezervuje po dráhach: ďalšia fáza.";
  if (m.kod === "IPH-CW") return "Coworking sa rezervuje po miestach: ďalšia fáza.";
  if (m.kod === "UK-4" || m.kod === "FIE-L3") return "Len pre zamestnancov a študentov UH.";
  if (!cenaMiestnosti(m.kod)) return "Cena na dopyt. (Chýba v Cenníku 2027.)";
  return null;
}

export function schvalovatel(m: Miestnost) {
  // P5: pri Aule Magna rozhoduje rektorát
  if (m.kod === "R-AULA") return "Ing. Oravcová, kancelária rektora";
  return m.schvaluje;
}

// Kontrolné rezervácie zo zadania
function stredy(od: string, doDna: string) {
  const out: string[] = [];
  const d = new Date(`${od}T12:00:00Z`);
  const koniec = new Date(`${doDna}T12:00:00Z`);
  while (d <= koniec) {
    if (d.getUTCDay() === 3) out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

export const K1: Objednavka = {
  kod: "IPH-K1",
  terminy: ["2027-03-12"],
  od: "09:00",
  do: "15:30",
  osoby: 40,
  typ: "externa",
  sluzby: { technik: 1, videosada: 1, coffee: 40 },
};

export const K2: Objednavka = {
  kod: "SC-H",
  terminy: stredy("2027-02-17", "2027-05-12"),
  od: "18:00",
  do: "19:30",
  osoby: 20,
  typ: "spolok",
  sluzby: {},
};

export function datum(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}
