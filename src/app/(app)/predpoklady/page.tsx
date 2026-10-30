import { PREDPOKLADY } from "@/data/predpoklady";

export default function Predpoklady() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Predpoklady a otázky pre vás</h1>
      <p className="mt-1 text-sm text-slate-600">
        Tu sme v podkladoch nenašli jasnú odpoveď. Rozhodli sme sa sami, aby prototyp fungoval. Každý predpoklad sa dá
        zmeniť, keď rozhodnete inak.
      </p>
      <div className="mt-4 overflow-x-auto rounded border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Čo sme predpokladali</th>
              <th className="px-3 py-2">Prečo: čo v podkladoch chýba</th>
              <th className="px-3 py-2">Čo potrebujeme od vás vedieť</th>
            </tr>
          </thead>
          <tbody>
            {PREDPOKLADY.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2 font-mono text-xs font-semibold">{p.id}</td>
                <td className="px-3 py-2">
                  {p.text}
                  {p.meniCenu && (
                    <span className="ml-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">mení cenu</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">{p.zdroj}</td>
                <td className="px-3 py-2 text-slate-600">{p.otazka || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-xl font-bold">Otvorené rozhodnutia vedenia</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
        <li>
          <strong>Verejné stránky akcií FU:</strong> v prvej fáze (doc. Lenártová), alebo neskôr (Ing. Hudák)? Bez nich
          Fakulta umení systém nepoužije.
        </li>
        <li>
          <strong>Študentské spolky:</strong> zľava 50 % (cenník), alebo zadarmo (športové centrum)?
        </li>
        <li>
          <strong>Aula Magna:</strong> kto má posledné slovo, rektorát alebo Fakulta umení?
        </li>
      </ul>
    </div>
  );
}
