"use client";

import { useRouter } from "next/navigation";
import { ROLY } from "@/data/roly";
import { nastavRolu, type Rola } from "@/lib/store";

export function VyberRoly() {
  const router = useRouter();

  function vyber(id: Rola, domov: string) {
    nastavRolu(id);
    router.push(domov);
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {ROLY.map((r) => (
        <li key={r.id}>
          <button
            disabled={r.dalsiaFaza}
            onClick={() => vyber(r.id as Rola, r.domov)}
            className="group cursor-pointer h-full w-full rounded-lg border-2 border-slate-300 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-50 disabled:hover:translate-y-0 disabled:hover:border-slate-300 disabled:hover:shadow-none"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold transition group-hover:text-blue-800 group-disabled:text-slate-400">{r.nazov}</div>
              {r.dalsiaFaza ? (
                <span className="shrink-0 whitespace-nowrap rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">ďalšia fáza</span>
              ) : (
                <span className="-translate-x-1 text-blue-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">→</span>
              )}
            </div>
            <div className="text-xs text-slate-500">{r.kto}</div>
            <div className="mt-2 text-sm text-slate-700 group-disabled:text-slate-400">{r.popis}</div>
          </button>
        </li>
      ))}
    </ul>
  );
}
