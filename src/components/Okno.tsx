"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Popup v strede obrazovky. Zavrie sa krížikom, klávesom Esc alebo klikom vedľa.
// Ide cez portál do <body>, aby ho nič na stránke neorezalo.
export function Okno({
  nadpis,
  onZavri,
  sirka = "max-w-md",
  ram = "border-slate-200",
  children,
}: {
  nadpis: React.ReactNode;
  onZavri: () => void;
  sirka?: string;
  ram?: string;
  children: React.ReactNode;
}) {
  const okno = useRef<HTMLDivElement>(null);

  // Prístupnosť: fokus do okna, po zatvorení späť na tlačidlo, ktoré ho otvorilo
  useEffect(() => {
    const predtym = document.activeElement as HTMLElement | null;
    okno.current?.focus();
    return () => predtym?.focus();
  }, []);

  useEffect(() => {
    const zavri = (e: KeyboardEvent) => e.key === "Escape" && onZavri();
    window.addEventListener("keydown", zavri);
    return () => window.removeEventListener("keydown", zavri);
  }, [onZavri]);

  return createPortal(
    <div className="okno-tlac fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4" onClick={onZavri}>
      <div
        role="dialog"
        aria-modal="true"
        ref={okno}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border bg-white p-6 text-left text-slate-900 shadow-xl ${sirka} ${ram}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="text-lg font-bold">{nadpis}</div>
          <button
            onClick={onZavri}
            aria-label="Zavrieť"
            className="no-print rounded px-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
