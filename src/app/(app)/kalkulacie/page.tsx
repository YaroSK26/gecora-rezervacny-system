"use client";

import { useState } from "react";
import { Predpoklad } from "@/components/Predpoklad";
import { PreAutora } from "@/components/PreAutora";
import { TabulkaKalkulacie } from "@/components/TabulkaKalkulacie";
import { datum, eur, K1, K2, miestnost, PREDVOLENE_VOLBY, vypocitaj, type Objednavka, type Volby } from "@/lib/vypocet";

const KROKY: [string, string, string][] = [
  ["Bloky.", "Čas rezervácie rozdelíme na bloky miestnosti (30, 60 alebo 90 min).", "Začatý blok sa platí celý (P3)."],
  ["Miestnosť.", "Paušál (raz) + počet blokov × cena za blok.", "Cenník 2027, časť D."],
  ["Zľava.", "Len z ceny miestnosti: spolky 50 %, zamestnanci 30 %.", "Cenník 2027, časť C (P9, P10)."],
  ["Služby.", "Každá podľa svojho pravidla: za čas, za osobu, za rezerváciu.", "Cenník 2027, časť B."],
  ["DPH.", "Sčítame základy podľa sadzby (23 %, 19 %) a z každého súčtu spočítame DPH.", "Zaokrúhlenie na cent (P6)."],
  ["Spolu.", "Základ + DPH = cena s DPH.", "Toto ide do podkladu pre faktúru."],
];

type Prepinac ={ kluc: keyof Volby; nazov: string; predpoklad: string; moznosti: [string, string][] };

const PREPINACE: Prepinac[] = [
  { kluc: "bloky", nazov: "Začatý blok", predpoklad: "P3", moznosti: [["nahor", "platí sa celý"], ["presne", "platí sa pomerne"]] },
  { kluc: "videosada", nazov: "Videosada", predpoklad: "P5", moznosti: [["raz", "17,50 € raz"], ["zaBlok", "17,50 € za každý blok"]] },
  { kluc: "pausal", nazov: "Paušál pri sérii", predpoklad: "P8", moznosti: [["raz", "raz za sériu"], ["zaTermin", "za každý termín"]] },
  { kluc: "spolok", nazov: "Študentský spolok", predpoklad: "P9", moznosti: [["50", "zľava 50 % (cenník)"], ["zadarmo", "neplatí (ŠC)"]] },
];

function Karta({ nazov, o, popis, volby }: { nazov: string; o: Objednavka; popis: string; volby: Volby }) {
  const m = miestnost(o.kod)!;
  const k = vypocitaj(o, volby);
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold">{nazov}</h2>
        <div className="text-lg font-bold">{eur(k.spoluSDph)}</div>
      </div>
      <p className="text-sm text-slate-600">{popis}</p>
      <p className="mt-1 text-sm">
        {m.nazov} ({m.kod}) ·{" "}
        {o.terminy.length > 1
          ? `${o.terminy.length} termínov: ${o.terminy.map(datum).join(", ")}`
          : datum(o.terminy[0])}{" "}
        · {o.od} až {o.do} · {o.osoby} osôb
      </p>
      <div className="mt-3">
        <TabulkaKalkulacie k={k} />
      </div>
    </section>
  );
}

export default function Kalkulacie() {
  const [volby, setVolby] = useState<Volby>(PREDVOLENE_VOLBY);
  const zmenene = JSON.stringify(volby) !== JSON.stringify(PREDVOLENE_VOLBY);

  return (
    <div>
      <h1 className="text-2xl font-bold">Kalkulácia kontrolných rezervácií K1 a K2</h1>
      <p className="mt-1 text-sm text-slate-600">
        Výpočet podľa Cenníka 2027. Cena miestnosti = paušál + počet blokov × cena za blok. Všetky sumy sa dajú prepočítať
        na kalkulačke.
      </p>

      <section className="mt-4 rounded-lg border border-blue-200 bg-white p-4">
        <h2 className="font-semibold text-blue-900">Ako sa cena počíta</h2>
        <ol className="mt-2 grid gap-3 text-sm md:grid-cols-3">
          {KROKY.map(([n, t, d], i) => (
            <li key={n} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-700 text-xs font-bold text-white">{i + 1}</span>
              <span>
                <strong>{n}</strong> {t}
                <span className="block text-xs text-slate-500">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <PreAutora>
        <p>
          <strong>Zadanie, Časť 1, pravidlo 4:</strong> „z čoho sa cena skladá a koľko je spolu bez DPH, DPH a spolu s DPH.
          Čísla sa musia dať prepočítať a sčítať na cent.“ Preto má každý riadok stĺpec „Výpočet“.
        </p>
        <p>
          <strong>Zadanie, bod 1.4:</strong> výpočet oboch, ideálne screenshot. Urob screenshot tejto stránky s
          predvolenými prepínačmi (✓).
        </p>
        <p>
          <strong>Prečo prepínače:</strong> cenník je na 4 miestach nejasný. Prepínač ukáže klientovi, o koľko sa cena líši,
          a on rozhodne. Na porade (časť 6) to je dobrá otázka: „Platia spolky 50 %, alebo nič? Pozrite, rozdiel je
          885,60 €.“
        </p>
        <p>
          Celý výpočet krok za krokom je na stránke <strong>Pre autora</strong>.
        </p>
      </PreAutora>

      <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-sm">
        <div className="mb-2 font-semibold text-amber-900">
          Kde cenník nie je jasný: vyskúšajte, ako sa cena zmení {zmenene && "· "}
          {zmenene && (
            <button onClick={() => setVolby(PREDVOLENE_VOLBY)} className="font-normal underline">
              späť na náš predpoklad
            </button>
          )}
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {PREPINACE.map((p) => (
            <div key={p.kluc} className="flex items-center gap-2">
              <span className="w-32 shrink-0 text-xs text-amber-900">
                {p.nazov} ({p.predpoklad})
              </span>
              <div className="flex overflow-hidden rounded border border-amber-400">
                {p.moznosti.map(([hodnota, text], i) => (
                  <button
                    key={hodnota}
                    onClick={() => setVolby({ ...volby, [p.kluc]: hodnota })}
                    className={`px-2 py-1 text-xs ${volby[p.kluc] === hodnota ? "bg-amber-400 font-semibold" : "bg-white"}`}
                  >
                    {text}
                    {i === 0 && " ✓"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-amber-900">✓ = náš predpoklad, kým klient nerozhodne.</p>
      </div>

      <div className="mt-6 space-y-6">
        <Karta nazov="K1" o={K1} volby={volby} popis="Externá firma, celodenné školenie. Technik celý čas, videokonferenčná sada, coffee break pre 40 osôb." />
        <Predpoklad id="P4" />
        <Karta
          nazov="K2"
          o={K2}
          volby={volby}
          popis="Študentský florbalový klub UH (registrovaný spolok). Každú stredu 18:00 až 19:30, od 17. 2. do 12. 5. 2027. Bez služieb."
        />
        <Predpoklad id="P10" />
      </div>
    </div>
  );
}
