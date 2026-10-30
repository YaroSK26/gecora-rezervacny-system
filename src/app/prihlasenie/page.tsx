"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Predpoklad } from "@/components/Predpoklad";
import { PreAutora } from "@/components/PreAutora";
import { ROLY } from "@/data/roly";
import { nastavRolu, type Rola } from "@/lib/store";

export default function Prihlasenie() {
  const router = useRouter();

  function vyber(id: Rola, domov: string) {
    nastavRolu(id);
    router.push(domov);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-950 to-blue-800 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/" className="text-sm text-blue-200 hover:text-white">
          ← Späť
        </Link>
        <div className="mt-4 rounded-xl bg-white p-6 shadow-xl md:p-8">
          <h1 className="text-2xl font-bold">Prihlásiť sa</h1>
          <p className="mt-1 text-sm text-slate-600">Vyberte, ako chcete systém vyskúšať. Rolu môžete kedykoľvek zmeniť v hlavičke.</p>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {ROLY.map((r) => (
              <li key={r.id}>
                <button
                  disabled={r.dalsiaFaza}
                  onClick={() => vyber(r.id as Rola, r.domov)}
                  className="group h-full w-full rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:hover:border-slate-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold group-disabled:text-slate-400">{r.nazov}</div>
                    {r.dalsiaFaza ? (
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">ďalšia fáza</span>
                    ) : (
                      <span className="text-blue-600 opacity-0 transition group-hover:opacity-100">→</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{r.kto}</div>
                  <div className="mt-2 text-sm text-slate-700 group-disabled:text-slate-400">{r.popis}</div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Predpoklad id="P16" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            V ostrej verzii sa zamestnanci a študenti prihlásia školským účtom. Napojenie dodá univerzita.
          </p>
          <PreAutora>
            <p>
              <strong>Zadanie, Časť 1, pravidlo 1:</strong> jedna cesta má fungovať celá, ostatné role majú byť
              viditeľné. Funkčné sú 3 role, lebo naša cesta prechádza cez všetky tri: hosť pošle žiadosť → schvaľovateľ
              schváli → ekonómka dostane podklad.
            </p>
            <p>
              <strong>Prečo zamestnanec je „ďalšia fáza“:</strong> zamestnanci dnes neplatia (data.xlsx, Poznámky ÚIT),
              takže ich cesta neukáže výpočet ceny. A potrebuje školské prihlásenie (Príloha 3: „SSO/IDM dodá
              univerzita“).
            </p>
            <p>
              <strong>Tip na poradu (časť 6):</strong> ukáž cestu ako hosť, potom prepni rolu v hlavičke na schvaľovateľa
              a nakoniec na ekonómku.
            </p>
          </PreAutora>
        </div>
      </div>
    </div>
  );
}
