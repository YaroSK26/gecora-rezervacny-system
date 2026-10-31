"use client";

import { useState } from "react";
import { predpoklad } from "@/data/predpoklady";
import { Okno } from "./Okno";

// Žltá značka s predpokladom. Klik otvorí malé okno s textom, zdrojom a otázkou pre klienta.
function Znacka({ id }: { id: string }) {
  const p = predpoklad(id);
  const [otvorene, setOtvorene] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOtvorene(true)}
        className="no-print my-1 mr-1 inline-block cursor-pointer rounded bg-amber-200 px-1.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-300"
      >
        Predpoklad {p.id}
      </button>
      {otvorene && (
        <Okno
          nadpis={<span className="text-base text-amber-900">Predpoklad {p.id}</span>}
          ram="border-amber-300"
          onZavri={() => setOtvorene(false)}
        >
          <div className="text-sm text-slate-800">
            <p>{p.text}</p>
            {p.otazka && (
              <p className="mt-3 rounded bg-amber-50 px-3 py-2">
                <strong>Otázka pre klienta:</strong> {p.otazka}
              </p>
            )}
            <p className="mt-3 text-xs text-slate-500">Zdroj: {p.zdroj}</p>
          </div>
        </Okno>
      )}
    </>
  );
}

export function Predpoklad({ id }: { id: string }) {
  return <Znacka id={id} />;
}

// Rovnaká značka, len v riadku textu (napr. v tabuľke)
export function PredpokladZnacka({ id }: { id: string }) {
  return <Znacka id={id} />;
}

export function DalsiaFaza({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-2 rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
      <strong>Ďalšia fáza:</strong> {children}
    </div>
  );
}
