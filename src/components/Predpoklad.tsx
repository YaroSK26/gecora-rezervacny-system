import { predpoklad, type Predpoklad as TPredpoklad } from "@/data/predpoklady";

function tooltip(p: TPredpoklad, sTextom: boolean) {
  return [
    sTextom && `Predpoklad ${p.id}: ${p.text}`,
    `Zdroj: ${p.zdroj}`,
    p.otazka && `Otázka pre klienta: ${p.otazka}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Žltý rámček s predpokladom. Pri prejdení myšou ukáže zdroj a otázku pre klienta.
export function Predpoklad({ id }: { id: string }) {
  const p = predpoklad(id);
  return (
    <div className="my-1 cursor-help rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900" title={tooltip(p, false)}>
      <strong>Predpoklad {p.id}:</strong> {p.text}
    </div>
  );
}

// Malá značka s číslom predpokladu (napr. v tabuľke). Celý text je v tooltipe.
export function PredpokladZnacka({ id }: { id: string }) {
  const p = predpoklad(id);
  return (
    <span className="ml-1 inline-block cursor-help rounded bg-amber-200 px-1 text-[10px] font-semibold text-amber-900" title={tooltip(p, true)}>
      {p.id}
    </span>
  );
}

export function DalsiaFaza({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-2 rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
      <strong>Ďalšia fáza:</strong> {children}
    </div>
  );
}
