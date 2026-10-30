"use client";

import Link from "next/link";
import { PreAutora } from "@/components/PreAutora";
import { DalsiaFaza, Predpoklad } from "@/components/Predpoklad";
import { Termin } from "@/components/DetailZiadosti";
import { TabulkaKalkulacie } from "@/components/TabulkaKalkulacie";
import { useStav } from "@/lib/store";
import { miestnost } from "@/lib/vypocet";

export default function Podklady() {
  const { ziadosti } = useStav();
  const schvalene = ziadosti.filter((z) => z.stav === "schvalena").reverse();

  return (
    <div>
      <div className="no-print text-sm text-slate-500">Krok 5 z 5 · Ekonomické oddelenie</div>
      <h1 className="text-2xl font-bold">Podklady pre faktúru</h1>
      <PreAutora>
        <p>
          <strong>Koniec cesty.</strong> Kováčová (zápis, bod 5): „potrebuje z každej rezervácie podklad s rozpisom DPH“.
          Cenník, časť D: „Podklad pre faktúru: položky, cena bez DPH, DPH, spolu.“ Presne to tu je.
        </p>
        <p>
          <strong>Prečo nie faktúra:</strong> faktúry robí ekonomické oddelenie v SAP. Prepojenie teraz nebude (Príloha 3,
          ÚIT: faktúry rieši univerzita sama). Preto len tlač alebo PDF.
        </p>
      </PreAutora>
      <div className="no-print">
        <p className="mt-1 text-sm text-slate-600">
          Z každej schválenej rezervácie externého žiadateľa vznikne podklad: položky, základ, DPH podľa sadzieb a spolu.
          Faktúru vystaví ekonomické oddelenie v SAP.
        </p>
        <DalsiaFaza>prepojenie so SAP. Teraz sa nerobí. Podklad sa dá vytlačiť alebo uložiť ako PDF.</DalsiaFaza>
      </div>

      {schvalene.length === 0 ? (
        <p className="mt-4 text-slate-600">
          Zatiaľ žiadna schválená rezervácia. <Link href="/schvalovanie" className="text-blue-700 underline">Schvaľovanie</Link>
        </p>
      ) : (
        <ul className="mt-4 space-y-6">
          {schvalene.map((z) => {
            const m = miestnost(z.objednavka.kod)!;
            return (
              <li key={z.cislo} className="rounded border border-slate-300 bg-white p-5">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase text-slate-500">Podklad pre faktúru</div>
                    <div className="font-mono text-lg font-bold">{z.cislo}</div>
                  </div>
                  <button onClick={() => window.print()} className="no-print h-fit rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100">
                    Tlačiť / PDF
                  </button>
                </div>
                <div className="mt-3 grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <div className="text-xs uppercase text-slate-500">Odberateľ</div>
                    <div className="font-semibold">{z.ziadatel.firma}</div>
                    <div>IČO {z.ziadatel.ico}</div>
                    <div>{z.ziadatel.adresa}</div>
                    <div>
                      {z.ziadatel.kontakt}, {z.ziadatel.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500">Rezervácia</div>
                    <div className="font-semibold">
                      {m.nazov} ({m.kod})
                    </div>
                    <div>{m.pracovisko}, {m.budova}</div>
                    <div>
                      <Termin z={z} />, {z.objednavka.osoby} osôb
                    </div>
                    <div>Schválil(a): {z.rozhodnutie?.kto}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <TabulkaKalkulacie k={z.kalkulacia} />
                </div>
                <div className="no-print">
                  <Predpoklad id="P6" />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
