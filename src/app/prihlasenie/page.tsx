"use client";

import Link from "next/link";
import { Predpoklad } from "@/components/Predpoklad";
import { VyberRoly } from "@/components/VyberRoly";

export default function Prihlasenie() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-950 to-blue-800 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/" className="text-sm text-blue-200 hover:text-white">
          ← Späť
        </Link>
        <div className="mt-4 rounded-xl bg-white p-6 shadow-xl md:p-8">
          <h1 className="text-2xl font-bold">Prihlásiť sa</h1>
          <p className="mt-1 text-sm text-slate-600">Vyberte, ako chcete systém vyskúšať. Rolu môžete kedykoľvek zmeniť v hlavičke.</p>

          <div className="mt-6">
            <VyberRoly />
          </div>

          <div className="mt-6">
            <Predpoklad id="P16" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            V ostrej verzii sa zamestnanci a študenti prihlásia školským účtom. Napojenie dodá univerzita.
          </p>
        </div>
      </div>
    </div>
  );
}
