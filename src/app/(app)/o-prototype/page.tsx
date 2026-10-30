import Link from "next/link";
import { VyplnitK1 } from "@/components/VyplnitK1";

const kroky = [
  ["1", "Nájsť miestnosť", "Externá firma vidí všetky miestnosti všetkých pracovísk na jednom mieste, s kapacitou a cenou 2027."],
  ["2", "Rezervácia a cena", "Vyplní termín, počet osôb a služby. Cenu vidí hneď, aj s rozpisom DPH."],
  ["3", "Odoslanie", "Žiadosť dostane správny schvaľovateľ pracoviska. Firma vidí stav žiadosti."],
  ["4", "Schválenie", "Schvaľovateľ vidí termín, služby aj cenu. Schváli alebo zamietne s dôvodom."],
  ["5", "Podklad pre faktúru", "Ekonomické oddelenie dostane rozpis položiek, základ, DPH a spolu. Faktúru vystaví v SAP."],
];

const ziadosti = [
  ["Ing. Hudák (ÚIT)", "Jeden systém pre všetky pracoviská, rezervácie so schvaľovaním.", "Krok 1 až 4: všetky pracoviská v jednom zozname, schvaľovanie.", "funguje"],
  ["Ing. Kováčová (ekonomické odd.)", "Podklad s rozpisom DPH, nový cenník od januára.", "Krok 5: podklad pre faktúru. Ceny podľa Cenníka 2027.", "funguje"],
  ["Mgr. Sedlák (knižnica)", "Každé pracovisko schvaľuje len svoje miestnosti. Kto schvaľuje Aulu?", "Žiadosť ide schvaľovateľovi pracoviska. Aula: predpoklad P13.", "funguje"],
  ["Ing. Baran (športové centrum)", "Rezervácie na celý semester, každý týždeň. Spolky neplatia.", "Cena série (K2) je v Kalkulácii K1 a K2. Formulár pre sériu: ďalšia fáza.", "čiastočne"],
  ["doc. Lenártová (Fakulta umení)", "Verejná stránka akcie s programom a registráciou.", "Ukážka, kde to bude. Rozhodnutie o termíne je otvorené.", "ďalšia fáza"],
];

export default function Uvod() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Rezervácie miestností Univerzity Hron</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Dnes každé pracovisko rezervuje inak: e-maily, Excel, formuláre, zošit na recepcii. Tento prototyp ukazuje jednu
        cestu v novom systéme od začiatku do konca:{" "}
        <strong>externá firma si prenajme sálu a ekonomické oddelenie dostane podklad pre faktúru.</strong>
      </p>

      <ol className="mt-6 grid gap-3 md:grid-cols-5">
        {kroky.map(([c, n, t]) => (
          <li key={c} className="rounded border border-slate-200 bg-white p-3">
            <div className="text-xs font-semibold text-blue-700">Krok {c}</div>
            <div className="font-semibold">{n}</div>
            <div className="mt-1 text-xs text-slate-600">{t}</div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/miestnosti" className="rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">
          Začať: nájsť miestnosť
        </Link>
        <VyplnitK1 />
        <Link href="/kalkulacie" className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100">
          Kalkulácia K1 a K2
        </Link>
      </div>

      <h2 className="mt-10 text-xl font-bold">Čo zaznelo na porade a kde to je</h2>
      <div className="mt-3 overflow-x-auto rounded border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Kto</th>
              <th className="px-3 py-2">Čo potrebuje</th>
              <th className="px-3 py-2">Kde je to v prototype</th>
              <th className="px-3 py-2">Stav</th>
            </tr>
          </thead>
          <tbody>
            {ziadosti.map(([kto, co, kde, stav]) => (
              <tr key={kto} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2 font-medium">{kto}</td>
                <td className="px-3 py-2">{co}</td>
                <td className="px-3 py-2">{kde}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      stav === "funguje" ? "bg-green-100 text-green-800" : stav === "čiastočne" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {stav}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">Termíny</h2>
      <ul className="mt-2 list-disc pl-6 text-sm text-slate-700">
        <li>23. 11. 2026: ukážka a rozhodnutie o cene na porade vedenia.</li>
        <li>8. 2. 2027: začiatok letného semestra, systém má bežať.</li>
      </ul>
    </div>
  );
}
