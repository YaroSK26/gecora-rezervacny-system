"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { infoRoly, ROLY } from "@/data/roly";
import { nastavRolu, useStav, type Rola } from "@/lib/store";
import { JE_VYVOJ } from "./PreAutora";

const SPOLOCNE = [
  { href: "/kalkulacie", text: "Kalkulácia K1 a K2" },
  { href: "/predpoklady", text: "Predpoklady" },
  { href: "/o-prototype", text: "O prototype" },
];

export function Hlavicka() {
  const cesta = usePathname();
  const router = useRouter();
  const { rola, ziadosti } = useStav();
  const [otvorene, setOtvorene] = useState(false);
  const aktualna = infoRoly(rola);

  const pocty: Record<string, number> = {
    "/schvalovanie": ziadosti.filter((z) => z.stav === "caka").length,
    "/podklady": ziadosti.filter((z) => z.stav === "schvalena").length,
    "/ziadosti": ziadosti.length,
  };

  function prepni(id: Rola, domov: string) {
    nastavRolu(id);
    setOtvorene(false);
    router.push(domov);
  }

  const odkaz = (href: string, text: string) => {
    const aktivny = cesta.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded px-3 py-1.5 text-sm ${
          aktivny ? "bg-white/15 font-semibold text-white" : "text-blue-100 hover:bg-white/10 hover:text-white"
        }`}
      >
        {text}
        {!!pocty[href] && <span className="rounded-full bg-white px-1.5 text-xs font-bold text-blue-900">{pocty[href]}</span>}
      </Link>
    );
  };

  return (
    <header className="no-print bg-blue-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
        <Link href="/" className="mr-3 flex items-center gap-2 font-bold">
          <span className="grid h-7 w-7 place-items-center rounded bg-white text-xs text-blue-900">UH</span>
          Rezervácie UH
        </Link>

        <nav className="flex flex-wrap items-center gap-1">{aktualna.menu.map((m) => odkaz(m.href, m.text))}</nav>

        <div className="ml-auto flex flex-wrap items-center gap-1">
          {SPOLOCNE.map((m) => odkaz(m.href, m.text))}
          {JE_VYVOJ && (
            <Link href="/pre-autora" className="rounded bg-violet-500 px-3 py-1.5 text-sm font-semibold hover:bg-violet-400">
              Pre autora
            </Link>
          )}

          <div className="relative ml-2">
            <button
              onClick={() => setOtvorene(!otvorene)}
              className="flex items-center gap-2 rounded border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10"
              aria-expanded={otvorene}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-blue-900">
                {aktualna.nazov[0]}
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[10px] text-blue-200">Prihlásený ako</span>
                {aktualna.nazov}
              </span>
              <span className="text-xs">▾</span>
            </button>
            {otvorene && (
              <div className="absolute right-0 z-20 mt-1 w-72 rounded-lg border border-slate-200 bg-white p-1 text-slate-900 shadow-lg">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase text-slate-400">Prepnúť rolu</div>
                {ROLY.map((r) => (
                  <button
                    key={r.id}
                    disabled={r.dalsiaFaza}
                    onClick={() => prepni(r.id as Rola, r.domov)}
                    className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent ${
                      r.id === aktualna.id ? "bg-blue-50 font-semibold text-blue-800" : ""
                    }`}
                  >
                    {r.nazov}
                    <span className="block text-xs font-normal text-slate-500">{r.dalsiaFaza ? "ďalšia fáza" : r.kto}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-slate-100" />
                <Link href="/" onClick={() => nastavRolu(null)} className="block rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  Odhlásiť sa
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
