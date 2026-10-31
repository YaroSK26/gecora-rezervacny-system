// Ukážkové žiadosti: každý návštevník ich vidí hneď po otvorení webu.
// Firmy a osoby sú vymyslené. Ceny sa rátajú tým istým výpočtom ako pri skutočnej rezervácii.

import type { Ziadatel, Ziadost } from "./store";
import { miestnost, schvalovatel, vypocitaj, type Objednavka } from "./vypocet";

type Vzor = {
  objednavka: Objednavka;
  ziadatel: Ziadatel;
  vytvorena: string;
  stav: Ziadost["stav"];
  rozhodnutie?: { kedy: string; dovod: string };
};

const VZORY: Vzor[] = [
  {
    objednavka: {
      kod: "R-205",
      terminy: ["2027-02-10"],
      od: "09:00",
      do: "12:00",
      osoby: 25,
      typ: "externa",
      sluzby: { coffee: 25 },
    },
    ziadatel: {
      firma: "Stredoslovenská energetika a. s.",
      ico: "36403008",
      adresa: "Ulica 29. augusta 5, 974 01 Banská Bystrica",
      kontakt: "Peter Horváth",
      email: "peter.horvath@sse-ukazka.sk",
      telefon: "+421 948 111 222",
      ucel: "Porada regionálnych manažérov",
    },
    vytvorena: "2026-10-26T10:15:00.000Z",
    stav: "schvalena",
    rozhodnutie: { kedy: "2026-10-27T08:40:00.000Z", dovod: "Miestnosť bude pripravená od 8:30." },
  },
  {
    objednavka: {
      kod: "FIE-P1",
      terminy: ["2027-01-20"],
      od: "08:00",
      do: "16:00",
      osoby: 150,
      typ: "externa",
      sluzby: { upratovanie: 1 },
    },
    ziadatel: {
      firma: "Tech Akadémia s. r. o.",
      ico: "51234567",
      adresa: "Námestie SNP 12, 974 01 Banská Bystrica",
      kontakt: "Lucia Kmeťová",
      email: "lucia.kmetova@techakademia.sk",
      telefon: "+421 917 333 444",
      ucel: "Celodenná konferencia pre študentov",
    },
    vytvorena: "2026-10-28T14:02:00.000Z",
    stav: "zamietnuta",
    rozhodnutie: {
      kedy: "2026-10-29T09:10:00.000Z",
      dovod: "V tento deň je v posluchárni skúškové obdobie. Skúste prosím termín vo februári.",
    },
  },
  {
    objednavka: {
      kod: "IPH-M4",
      terminy: ["2027-03-04"],
      od: "13:00",
      do: "15:30",
      osoby: 8,
      typ: "externa",
      sluzby: { videosada: 1, parking: 2 },
    },
    ziadatel: {
      firma: "Zelená dolina, o. z.",
      ico: "42198765",
      adresa: "Lesná 3, 976 02 Badín",
      kontakt: "Martin Šimko",
      email: "martin.simko@zelenadolina.sk",
      telefon: "+421 903 555 666",
      ucel: "Stretnutie s partnermi projektu",
    },
    vytvorena: "2026-10-30T16:45:00.000Z",
    stav: "caka",
  },
];

export const UKAZKOVE_ZIADOSTI: Ziadost[] = VZORY.map((v, i) => {
  const m = miestnost(v.objednavka.kod)!;
  const kto = schvalovatel(m);
  return {
    cislo: `REZ-2027-${String(i + 1).padStart(4, "0")}`,
    vytvorena: v.vytvorena,
    objednavka: v.objednavka,
    ziadatel: v.ziadatel,
    kalkulacia: vypocitaj(v.objednavka),
    schvalovatel: kto,
    stav: v.stav,
    ...(v.rozhodnutie && { rozhodnutie: { kto, ...v.rozhodnutie } }),
  };
});
