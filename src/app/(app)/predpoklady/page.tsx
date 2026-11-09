import { PREDPOKLADY } from "@/data/predpoklady";

const SKUPINY = [
  {
    nazov: "Miestnosti a dostupnosť",
    popis: "Čo sa dá rezervovať, za akých podmienok a s akými údajmi.",
    ids: ["P3", "P4", "P5", "P6", "P7", "P10"],
  },
  {
    nazov: "Cenník a výpočet ceny",
    popis: "Pravidlá, ktoré priamo ovplyvňujú cenu rezervácie.",
    ids: ["P1", "P2", "P8", "P9", "P11", "P12", "P17"],
  },
  {
    nazov: "Služby a občerstvenie",
    popis: "Ako počítame technika, občerstvenie a doplnkové služby.",
    ids: ["P13", "P14", "P15", "P23"],
  },
  {
    nazov: "Zľavy a interní používatelia",
    popis: "Rozdiely medzi externou firmou, zamestnancom a študentským spolkom.",
    ids: ["P19", "P20", "P22", "P25"],
  },
  {
    nazov: "Opakované rezervácie a storno",
    popis: "Pravidlá pre série termínov a zrušenie rezervácie.",
    ids: ["P21", "P27"],
  },
  {
    nazov: "Rozsah prototypu",
    popis: "Čo je v prototype zjednodušené alebo odložené do ďalšej fázy.",
    ids: ["P16", "P18", "P24", "P26"],
  },
];

export default function Predpoklady() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Predpoklady a otázky pre vás</h1>
      <p className="mt-1 text-sm text-slate-600">
        V podkladoch nie sú pri všetkých pravidlách jasné odpovede. Preto sme ich zoskupili do šiestich oblastí a zvolili
        dočasné pravidlá, aby prototyp fungoval. Najdôležitejšie otázky sú viditeľné hneď, podrobnosti otvoríte rozbalením.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4">
        {SKUPINY.map((skupina) => {
          const predpoklady = skupina.ids.map((id) => PREDPOKLADY.find((p) => p.id === id)!);
          const otazky = predpoklady.filter((p) => p.otazka);
          return (
            <details key={skupina.nazov} className="group rounded-xl border-2 border-blue-200 bg-blue-50/80 p-4 shadow-sm">
              <summary className="cursor-pointer list-none pr-6 marker:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-blue-950">{skupina.nazov}</h2>
                    <p className="mt-1 text-sm text-slate-600">{skupina.popis}</p>
                  </div>
                  <span className="rounded-full bg-blue-700 px-2 py-0.5 text-xs font-bold text-white">{otazky.length} otázok</span>
                </div>
                <div className="mt-3 text-sm font-semibold text-blue-800 group-open:hidden">Zobraziť predpoklady ↓</div>
              </summary>
              <div className="mt-4 space-y-3 border-t border-blue-200 pt-3">
                {predpoklady.map((p) => (
                  <article key={p.id} className="rounded-lg border border-blue-200 bg-white p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700">{p.id}</span>
                      {p.meniCenu && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">mení cenu</span>}
                    </div>
                    <p className="mt-1 text-slate-800">{p.text}</p>
                    {p.otazka && <p className="mt-2 text-blue-900"><strong>Otázka:</strong> {p.otazka}</p>}
                    <p className="mt-2 text-xs text-slate-500"><strong>Zdroj:</strong> {p.zdroj}</p>
                  </article>
                ))}
              </div>
            </details>
          );
        })}
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
