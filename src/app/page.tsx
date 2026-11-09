"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLY } from "@/data/roly";
import { Okno } from "@/components/Okno";
import { nastavRolu, type Rola } from "@/lib/store";

export default function Landing() {
  const router = useRouter();
  const [otvorene, setOtvorene] = useState(false);
  const [rola, setRola] = useState<Rola>("host");
  const vybranaRola = ROLY.find((r) => r.id === rola) ?? ROLY[0];

  function prihlasit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    nastavRolu(rola);
    router.push(vybranaRola.domov);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-950 via-blue-900 to-blue-700 px-6 text-center text-white">
      <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">Rezervačný systém pre Univerzitu Hron</h1>
      <p className="mt-5 max-w-2xl text-lg text-blue-100">
        Aula, učebne, sály, telocvične aj galérie na jednom mieste.
      </p>
      <button
        onClick={() => setOtvorene(true)}
        className="mt-8 rounded bg-white px-8 py-3 font-semibold text-blue-900 shadow hover:bg-blue-50"
      >
        Prihlásiť sa
      </button>

      {otvorene && (
        <Okno nadpis={<span className="text-2xl">Prihlásiť sa</span>} sirka="max-w-3xl" onZavri={() => setOtvorene(false)}>
          <form onSubmit={prihlasit} className="mt-5 space-y-5">
            <div>
              <label htmlFor="rola" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Vaša rola
              </label>
              <select
                id="rola"
                value={rola}
                onChange={(e) => setRola(e.target.value as Rola)}
                className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {ROLY.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.dalsiaFaza}>
                    {r.nazov}{r.dalsiaFaza ? " (ďalšia fáza)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-slate-50 px-3 py-2.5">
              <div className="text-sm font-semibold text-slate-800">Vaša úloha</div>
              <div className="mt-1 text-sm text-slate-600">{vybranaRola.popis}</div>
            </div>

            <p className="text-sm text-slate-600">
              <span className="text-sm font-semibold text-slate-800">Prihlasujem sa ako </span>
              {vybranaRola.kto}.
            </p>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => setOtvorene(false)}
                className="rounded-lg border-2 border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Zrušiť
              </button>
              <button type="submit" className="rounded-lg bg-blue-800 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-900">
                Pokračovať
              </button>
            </div>
          </form>
        </Okno>
      )}
    </div>
  );
}
