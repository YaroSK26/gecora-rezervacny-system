"use client";

import { useEffect, useRef, useState } from "react";

// Roletka, v ktorej sa dá zaškrtnúť viac možností naraz
export function ViacVyber({
  nazov,
  vsetko,
  moznosti,
  vybrane,
  onZmena,
}: {
  nazov: string;
  vsetko: string; // text, keď nie je nič vybrané, napr. „Všetky pracoviská“
  moznosti: string[];
  vybrane: string[];
  onZmena: (v: string[]) => void;
}) {
  const [otvorene, setOtvorene] = useState(false);
  const obal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!otvorene) return;
    const mimo = (e: MouseEvent) => !obal.current?.contains(e.target as Node) && setOtvorene(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOtvorene(false);
    document.addEventListener("mousedown", mimo);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", mimo);
      document.removeEventListener("keydown", esc);
    };
  }, [otvorene]);

  const text = vybrane.length === 0 ? vsetko : vybrane.length === 1 ? vybrane[0] : `${vybrane.length} vybrané`;
  const prepni = (v: string) => onZmena(vybrane.includes(v) ? vybrane.filter((x) => x !== v) : [...vybrane, v]);

  return (
    <div ref={obal} className="relative flex flex-col">
      <span className="text-xs text-slate-500">{nazov}</span>
      <button
        type="button"
        onClick={() => setOtvorene(!otvorene)}
        aria-expanded={otvorene}
        aria-haspopup="listbox"
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left text-sm sm:w-56 ${
          vybrane.length ? "border-blue-600 text-blue-900" : "border-slate-300"
        }`}
      >
        <span className="truncate">{text}</span>
        <span aria-hidden="true" className={`text-xs text-slate-500 transition-transform ${otvorene ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {otvorene && (
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label={nazov}
          data-lenis-prevent
          className="absolute top-full z-30 mt-1 max-h-72 w-full min-w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
        >
          {moznosti.map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-blue-50">
              <input type="checkbox" checked={vybrane.includes(v)} onChange={() => prepni(v)} />
              {v}
            </label>
          ))}
          {vybrane.length > 0 && (
            <button
              type="button"
              onClick={() => onZmena([])}
              className="mt-1 w-full rounded border-t border-slate-100 px-2 py-1.5 text-left text-sm text-blue-700 hover:bg-blue-50"
            >
              Zrušiť výber
            </button>
          )}
        </div>
      )}
    </div>
  );
}
