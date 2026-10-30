import { eur, type Kalkulacia } from "@/lib/vypocet";
import { PredpokladZnacka } from "./Predpoklad";

// Rozpis ceny: položky, základ, DPH podľa sadzieb, spolu. Rovnaká tabuľka pre súhrn, schvaľovateľa aj podklad pre faktúru.
export function TabulkaKalkulacie({ k }: { k: Kalkulacia }) {
  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="tabular w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-2">Položka</th>
            <th className="px-3 py-2">Výpočet</th>
            <th className="px-3 py-2 text-right">DPH</th>
            <th className="px-3 py-2 text-right">Bez DPH</th>
          </tr>
        </thead>
        <tbody>
          {k.riadky.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 align-top">
              <td className="px-3 py-2">
                {r.nazov}
                {r.predpoklady.map((p) => (
                  <PredpokladZnacka key={p} id={p} />
                ))}
              </td>
              <td className="px-3 py-2 text-slate-600">
                {r.vypocet}
                {r.brutto !== undefined && (
                  <div className="text-xs">
                    = {eur(r.brutto)} s DPH → základ {eur(r.brutto)} / 1,{r.sadzba} = {eur(r.zaklad)}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 text-right">{r.sadzba} %</td>
              <td className={`px-3 py-2 text-right ${r.zaklad < 0 ? "text-green-700" : ""}`}>{eur(r.zaklad)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="tabular w-full border-t-2 border-slate-300 text-sm">
        <thead className="text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-2">
              Rozpis DPH <PredpokladZnacka id="P6" />
            </th>
            <th className="px-3 py-2 text-right">Základ</th>
            <th className="px-3 py-2 text-right">DPH</th>
            <th className="px-3 py-2 text-right">Spolu</th>
          </tr>
        </thead>
        <tbody>
          {k.skupiny.map((g) => (
            <tr key={g.sadzba} className="border-t border-slate-100">
              <td className="px-3 py-1.5">Sadzba {g.sadzba} %</td>
              <td className="px-3 py-1.5 text-right">{eur(g.zaklad)}</td>
              <td className="px-3 py-1.5 text-right">{eur(g.dph)}</td>
              <td className="px-3 py-1.5 text-right">{eur(g.zaklad + g.dph)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
            <td className="px-3 py-2">Spolu</td>
            <td className="px-3 py-2 text-right">{eur(k.spoluZaklad)}</td>
            <td className="px-3 py-2 text-right">{eur(k.spoluDph)}</td>
            <td className="px-3 py-2 text-right text-base">{eur(k.spoluSDph)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
