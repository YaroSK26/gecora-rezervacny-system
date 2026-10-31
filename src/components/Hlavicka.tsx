"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { infoRoly, ROLY } from "@/data/roly";
import { nastavRolu, obnovUkazku, useStav, type Rola } from "@/lib/store";
import { SPOLOCNE } from "./Strazca";

export function Hlavicka() {
  const cesta = usePathname();
  const router = useRouter();
  const { rola, ziadosti } = useStav();
  const [otvorene, setOtvorene] = useState(false);
  const [menu, setMenu] = useState(false);
  const aktualna = infoRoly(rola);

  const pocty: Record<string, number> = {
    "/schvalovanie": ziadosti.filter((z) => z.stav === "caka").length,
    "/podklady": ziadosti.filter((z) => z.stav === "schvalena").length,
    "/ziadosti": ziadosti.length,
  };

  function prepni(id: Rola, domov: string) {
    nastavRolu(id);
    setOtvorene(false);
    setMenu(false);
    router.push(domov);
  }

  const odkaz = (href: string, text: string, mobil = false) => {
    const aktivny = cesta.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMenu(false)}
        aria-current={aktivny ? "page" : undefined}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded px-3 text-sm ${mobil ? "py-2.5" : "py-1.5"} ${
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
      <div className="mx-auto flex max-w-7xl flex-nowrap items-center gap-2 px-4 py-2">
        <Link href={aktualna.domov} className="mr-3 whitespace-nowrap font-bold">
          Rezervačný systém
        </Link>

        <nav aria-label="Hlavné menu" className="hidden flex-nowrap items-center gap-1 lg:flex">
          {aktualna.menu.map((m) => odkaz(m.href, m.text))}
        </nav>

        <div className="ml-auto flex flex-nowrap items-center gap-1">
          <div className="hidden flex-nowrap items-center gap-1 lg:flex">
            {SPOLOCNE.map((m) => odkaz(m.href, m.text))}
          </div>

          <div className="relative ml-2">
            <button
              onClick={() => setOtvorene(!otvorene)}
              className="flex h-10 items-center gap-2 whitespace-nowrap rounded border border-white/30 px-3 text-sm hover:bg-white/10"
              aria-expanded={otvorene}
              aria-label={`Prihlásený ako ${aktualna.nazov}. Prepnúť rolu`}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-blue-900">
                {aktualna.nazov[0]}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[10px] text-blue-200">Prihlásený ako</span>
                {aktualna.nazov}
              </span>
              <span className="text-xs" aria-hidden="true">
                ▾
              </span>
            </button>
            {otvorene && (
              <div className="absolute right-0 z-20 mt-1 w-72 rounded-lg border border-slate-200 bg-white p-1 text-slate-900 shadow-lg">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase text-slate-500">Prepnúť rolu</div>
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
                <button
                  onClick={() => {
                    obnovUkazku();
                    setOtvorene(false);
                  }}
                  className="block w-full rounded px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                >
                  Obnoviť ukážku
                  <span className="block text-xs text-slate-500">vráti ukážkové žiadosti, zmaže vaše</span>
                </button>
                <Link href="/" onClick={() => nastavRolu(null)} className="block rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  Odhlásiť sa
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="mobilne-menu"
            className="ml-1 h-10 rounded border border-white/30 px-3 text-sm hover:bg-white/10 lg:hidden"
          >
            {menu ? "Zavrieť" : "Menu"}
          </button>
        </div>
      </div>

      {menu && (
        <nav id="mobilne-menu" aria-label="Menu" className="border-t border-white/10 px-4 pb-3 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {aktualna.menu.map((m) => odkaz(m.href, m.text, true))}
            <div className="my-1 border-t border-white/10" />
            {SPOLOCNE.map((m) => odkaz(m.href, m.text, true))}
          </div>
        </nav>
      )}
    </header>
  );
}
