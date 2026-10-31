"use client";

import { DalsiaFaza, Predpoklad } from "@/components/Predpoklad";
import { Termin, ZoznamZiadosti } from "@/components/DetailZiadosti";
import { TabulkaKalkulacie } from "@/components/TabulkaKalkulacie";
import { useStav, type Ziadost } from "@/lib/store";
import { miestnost } from "@/lib/vypocet";

export default function Podklady() {
  const { ziadosti } = useStav();
  const schvalene = ziadosti.filter((z) => z.stav === "schvalena");

  return (
    <div>
      <h1 className="text-2xl font-bold">Podklady pre faktúru</h1>
      <div className="no-print">
        <p className="mt-1 text-sm text-slate-600">
          Z každej schválenej rezervácie externého žiadateľa vznikne podklad: položky, základ, DPH podľa sadzieb a spolu. Faktúru
          vystaví ekonomické oddelenie v SAP.
        </p>
        <DalsiaFaza>prepojenie so SAP. Teraz sa nerobí. Podklad sa dá vytlačiť alebo uložiť ako PDF.</DalsiaFaza>
      </div>

      <ZoznamZiadosti ziadosti={schvalene} prazdny="Zatiaľ žiadna schválená rezervácia." telo={(z) => <Podklad z={z} />} />
    </div>
  );
}

function Podklad({ z }: { z: Ziadost }) {
  const m = miestnost(z.objednavka.kod)!;
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <div className="text-xs uppercase text-slate-500">Podklad pre faktúru</div>
          <div className="font-mono text-lg font-bold">{z.cislo}</div>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print h-fit cursor-pointer rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
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
            {z.ziadatel.kontakt}, {z.ziadatel.email}, {z.ziadatel.telefon}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-500">Rezervácia</div>
          <div className="font-semibold">
            {m.nazov} ({m.kod})
          </div>
          <div>
            {m.pracovisko}, {m.budova}
          </div>
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
        <Predpoklad id="P17" />
      </div>
    </div>
  );
}
