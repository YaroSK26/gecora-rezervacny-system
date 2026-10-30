import { datum, eur, miestnost } from "@/lib/vypocet";
import type { Ziadost } from "@/lib/store";

const STAV = {
  caka: ["Čaká na schválenie", "bg-amber-100 text-amber-800"],
  schvalena: ["Schválená", "bg-green-100 text-green-800"],
  zamietnuta: ["Zamietnutá", "bg-red-100 text-red-800"],
} as const;

export function StavZiadosti({ z }: { z: Ziadost }) {
  const [t, c] = STAV[z.stav];
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold ${c}`}>{t}</span>;
}

export function Termin({ z }: { z: Ziadost }) {
  const o = z.objednavka;
  return (
    <>
      {o.terminy.length > 1 ? `${o.terminy.length} termínov od ${datum(o.terminy[0])}` : datum(o.terminy[0])}, {o.od} až {o.do}
    </>
  );
}

export function HlavickaZiadosti({ z }: { z: Ziadost }) {
  const m = miestnost(z.objednavka.kod)!;
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <div className="font-mono text-xs text-slate-500">{z.cislo}</div>
        <div className="font-semibold">
          {m.nazov} ({m.kod}) · <Termin z={z} />
        </div>
        <div className="text-sm text-slate-600">
          {z.ziadatel.firma} · {z.objednavka.osoby} osôb · {z.ziadatel.ucel}
        </div>
      </div>
      <div className="text-right">
        <StavZiadosti z={z} />
        <div className="mt-1 text-sm font-semibold">{eur(z.kalkulacia.spoluSDph)} s DPH</div>
      </div>
    </div>
  );
}
