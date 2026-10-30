"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cenaMiestnosti, SLUZBY, type SluzbaId } from "@/data/cennik";
import { PreAutora } from "@/components/PreAutora";
import { DalsiaFaza, Predpoklad } from "@/components/Predpoklad";
import { TabulkaKalkulacie } from "@/components/TabulkaKalkulacie";
import { VyplnitK1 } from "@/components/VyplnitK1";
import { odosliZiadost, ulozKoncept, useStav, type Koncept, type Ziadatel } from "@/lib/store";
import { kontrola, miestnost, schvalovatel, vypocitaj } from "@/lib/vypocet";

const NA_POCET: SluzbaId[] = ["coffee", "obed", "parking"];

const POLIA: [keyof Ziadatel, string][] = [
  ["firma", "Názov firmy / organizácie"],
  ["ico", "IČO"],
  ["adresa", "Fakturačná adresa"],
  ["kontakt", "Kontaktná osoba"],
  ["email", "E-mail"],
  ["ucel", "Účel akcie"],
];

export default function Rezervacia() {
  const router = useRouter();
  const { koncept } = useStav();
  const [suhlas, setSuhlas] = useState(false);

  if (!koncept) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Rezervácia a cena</h1>
        <p className="mt-2 text-slate-600">Najprv vyberte miestnosť.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/miestnosti" className="rounded bg-blue-700 px-4 py-2 font-semibold text-white">
            Nájsť miestnosť
          </Link>
          <VyplnitK1 />
        </div>
      </div>
    );
  }

  const k = koncept;
  const m = miestnost(k.kod)!;
  const cena = cenaMiestnosti(k.kod)!;
  const zmen = (z: Partial<Koncept>) => ulozKoncept({ ...k, ...z });
  const zmenSluzbu = (id: SluzbaId, v: number) => zmen({ sluzby: { ...k.sluzby, [id]: v } });

  const chyby = kontrola(k);
  const chybyZiadatela = POLIA.filter(([p]) => !k.ziadatel[p].trim()).map(([, n]) => n);
  const kalkulacia = chyby.length === 0 ? vypocitaj(k) : null;
  const mozeOdoslat = kalkulacia && chybyZiadatela.length === 0 && suhlas;

  function odoslat() {
    if (!kalkulacia) return;
    const { ziadatel, ...objednavka } = k;
    odosliZiadost({ objednavka, ziadatel, kalkulacia, schvalovatel: schvalovatel(m) });
    router.push("/ziadosti");
  }

  return (
    <div>
      <div className="text-sm text-slate-500">Krok 2 z 5 · Externá firma</div>
      <h1 className="text-2xl font-bold">
        Rezervácia: {m.nazov} <span className="font-mono text-base text-slate-500">{m.kod}</span>
      </h1>
      <p className="text-sm text-slate-600">
        {m.budova} · kapacita {m.kapacita ?? "neuvedená"} · otvorené {m.otvaracieHodiny} · schvaľuje {schvalovatel(m)}
      </p>
      <PreAutora>
        <p>
          <strong>Prečo cena hneď vedľa formulára:</strong> Zadanie, pravidlo 4 chce kalkuláciu napríklad „v súhrne pred
          odoslaním“. Firma vidí každú zmenu ceny hneď, keď zmení čas alebo služby.
        </p>
        <p>
          <strong>Kontroly:</strong> otváracie hodiny miestnosti (P14, P15), kapacita (P17), dátum od 2027 (P18), streaming
          len s technikom (P20). Všetko z data.xlsx. Kód: <code>kontrola()</code> v <code>src/lib/vypocet.ts</code>.
        </p>
        <p>
          <strong>Služby:</strong> ukazujeme len tie, ktoré cenník povoľuje pre danú miestnosť (stĺpec „Kde“). Pri IPH-K1
          je technik, streaming aj parkovanie; pri FIE-P1 technik nie je.
        </p>
        <p>
          <strong>Opakovaná rezervácia</strong> tu nie je: Baran ju chce (zápis, bod 4), ale je to ďalšia fáza. Cenu série
          ukazuje K2.
        </p>
      </PreAutora>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <section className="rounded border border-slate-200 bg-white p-4">
            <h2 className="mb-2 font-semibold">Termín</h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <label className="flex flex-col">
                <span className="text-xs text-slate-500">Dátum</span>
                <input
                  type="date"
                  min="2027-01-01"
                  value={k.terminy[0] ?? ""}
                  onChange={(e) => zmen({ terminy: [e.target.value] })}
                  className="rounded border border-slate-300 px-2 py-1"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-xs text-slate-500">Od</span>
                <input type="time" step={1800} value={k.od} onChange={(e) => zmen({ od: e.target.value })} className="rounded border border-slate-300 px-2 py-1" />
              </label>
              <label className="flex flex-col">
                <span className="text-xs text-slate-500">Do</span>
                <input type="time" step={1800} value={k.do} onChange={(e) => zmen({ do: e.target.value })} className="rounded border border-slate-300 px-2 py-1" />
              </label>
              <label className="flex flex-col">
                <span className="text-xs text-slate-500">Počet osôb</span>
                <input
                  type="number"
                  min={1}
                  value={k.osoby || ""}
                  onChange={(e) => zmen({ osoby: Number(e.target.value) })}
                  className="rounded border border-slate-300 px-2 py-1"
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Cena miestnosti sa ráta po blokoch {cena.blokMin} min
              {cena.poznamka ? ` (${cena.poznamka})` : ""}.
            </p>
            <Predpoklad id="P3" />
            <Predpoklad id="P15" />
            <DalsiaFaza>opakovaná rezervácia (napr. každú stredu celý semester) a kontrola, či je miestnosť voľná.</DalsiaFaza>
          </section>

          <section className="rounded border border-slate-200 bg-white p-4">
            <h2 className="mb-2 font-semibold">Služby</h2>
            <ul className="space-y-2 text-sm">
              {SLUZBY.filter((s) => s.dostupnaPre(k.kod)).map((s) => {
                const v = k.sluzby[s.id] ?? 0;
                const naPocet = NA_POCET.includes(s.id);
                return (
                  <li key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={s.id}
                      checked={v > 0}
                      onChange={(e) => zmenSluzbu(s.id, e.target.checked ? (naPocet && s.id !== "parking" ? k.osoby : 1) : 0)}
                    />
                    <label htmlFor={s.id} className="flex-1">
                      {s.nazov}
                      <span className="block text-xs text-slate-500">
                        {s.uctujeSa}
                        {s.pausal ? `, paušál ${(s.pausal / 100).toFixed(2).replace(".", ",")} €` : ""}
                        {s.zaJednotku ? `, ${(s.zaJednotku / 100).toFixed(2).replace(".", ",")} €${s.sDph ? " s DPH" : ""}` : ""} · DPH {s.dph} %
                      </span>
                    </label>
                    {naPocet && v > 0 && (
                      <input
                        type="number"
                        min={1}
                        value={v}
                        onChange={(e) => zmenSluzbu(s.id, Number(e.target.value))}
                        className="w-20 rounded border border-slate-300 px-2 py-1"
                        aria-label={`Počet: ${s.nazov}`}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
            {!!k.sluzby.technik && <Predpoklad id="P4" />}
            {!!k.sluzby.videosada && <Predpoklad id="P5" />}
            {(!!k.sluzby.coffee || !!k.sluzby.obed) && <Predpoklad id="P21" />}
            {!!k.sluzby.obed && <Predpoklad id="P7" />}
            <Predpoklad id="P19" />
          </section>

          <section className="rounded border border-slate-200 bg-white p-4">
            <h2 className="mb-2 font-semibold">Žiadateľ (údaje pre faktúru)</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {POLIA.map(([p, n]) => (
                <label key={p} className={`flex flex-col ${p === "adresa" || p === "ucel" ? "col-span-2" : ""}`}>
                  <span className="text-xs text-slate-500">{n}</span>
                  <input
                    value={k.ziadatel[p]}
                    onChange={(e) => zmen({ ziadatel: { ...k.ziadatel, [p]: e.target.value } })}
                    className="rounded border border-slate-300 px-2 py-1"
                  />
                </label>
              ))}
            </div>
            <Predpoklad id="P16" />
          </section>
        </div>

        <div className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <h2 className="font-semibold">Cena</h2>
          {kalkulacia ? (
            <TabulkaKalkulacie k={kalkulacia} />
          ) : (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <div className="font-semibold">Cenu spočítame, keď opravíte:</div>
              <ul className="list-disc pl-5">
                {chyby.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          <Predpoklad id="P1" />
          <Predpoklad id="P6" />

          {chybyZiadatela.length > 0 && (
            <div className="text-xs text-slate-500">Ešte vyplňte: {chybyZiadatela.join(", ")}.</div>
          )}
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={suhlas} onChange={(e) => setSuhlas(e.target.checked)} className="mt-1" />
            Súhlasím s cenou. Viem, že rezervácia platí až po schválení pracoviskom.
          </label>
          <button
            disabled={!mozeOdoslat}
            onClick={odoslat}
            className="w-full rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Odoslať žiadosť na schválenie
          </button>
          <p className="text-xs text-slate-500">Žiadosť dostane: {schvalovatel(m)}.</p>
          {k.kod === "R-AULA" && <Predpoklad id="P13" />}
          <Predpoklad id="P12" />
        </div>
      </div>
    </div>
  );
}
