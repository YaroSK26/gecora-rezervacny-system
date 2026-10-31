"use client";

import { useState } from "react";
import { Okno } from "@/components/Okno";
import { VyberRoly } from "@/components/VyberRoly";

export default function Landing() {
  const [otvorene, setOtvorene] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-950 via-blue-900 to-blue-700 px-6 text-center text-white">
      <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">Rezervačný systém pre Univerzitu Hron</h1>
      <p className="mt-5 max-w-2xl text-lg text-blue-100">
        Aula, učebne, sály, telocvične aj galérie na jednom mieste. Cenu vidíte hneď, žiadosť ide priamo tomu, kto ju schvaľuje.
      </p>
      <button
        onClick={() => setOtvorene(true)}
        className="mt-8 rounded bg-white px-8 py-3 font-semibold text-blue-900 shadow hover:bg-blue-50"
      >
        Prihlásiť sa
      </button>

      {otvorene && (
        <Okno nadpis={<span className="text-2xl">Prihlásiť sa</span>} sirka="max-w-3xl" onZavri={() => setOtvorene(false)}>
          <p className="text-sm text-slate-600">Vyberte rolu. Zmeniť ju môžete kedykoľvek v hlavičke.</p>
          <div className="mt-6">
            <VyberRoly />
          </div>
        </Okno>
      )}
    </div>
  );
}
