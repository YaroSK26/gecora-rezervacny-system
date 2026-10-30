"use client";

import Link from "next/link";
import { useState } from "react";
import { PreAutora } from "@/components/PreAutora";
import { DalsiaFaza, Predpoklad } from "@/components/Predpoklad";
import { HlavickaZiadosti } from "@/components/DetailZiadosti";
import { TabulkaKalkulacie } from "@/components/TabulkaKalkulacie";
import { rozhodni, useStav, type Ziadost } from "@/lib/store";
import { miestnost } from "@/lib/vypocet";

function ZiadostKarta({ z }: { z: Ziadost }) {
  const [dovod, setDovod] = useState("");
  const m = miestnost(z.objednavka.kod)!;
  return (
    <li className="rounded border border-slate-200 bg-white p-4">
      <HlavickaZiadosti z={z} />
      <div className="mt-2 grid gap-1 text-sm text-slate-600 md:grid-cols-2">
        <div>Kontakt: {z.ziadatel.kontakt}, {z.ziadatel.email}</div>
        <div>IČO {z.ziadatel.ico}, {z.ziadatel.adresa}</div>
        <div>Kapacita miestnosti: {m.kapacita ?? "neuvedená"}</div>
        <div>Schvaľuje: {z.schvalovatel}</div>
        {m.poznamka && <div className="md:col-span-2">Poznámka pracoviska: {m.poznamka}</div>}
      </div>
      <div className="mt-3">
        <TabulkaKalkulacie k={z.kalkulacia} />
      </div>
      {z.stav === "caka" ? (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="flex min-w-64 flex-1 flex-col text-sm">
            <span className="text-xs text-slate-500">Poznámka pre žiadateľa (pri zamietnutí povinná)</span>
            <input value={dovod} onChange={(e) => setDovod(e.target.value)} className="rounded border border-slate-300 px-2 py-1" />
          </label>
          <button
            onClick={() => rozhodni(z.cislo, "schvalena", z.schvalovatel, dovod)}
            className="rounded bg-green-700 px-4 py-1.5 font-semibold text-white hover:bg-green-800"
          >
            Schváliť
          </button>
          <button
            disabled={!dovod.trim()}
            onClick={() => rozhodni(z.cislo, "zamietnuta", z.schvalovatel, dovod)}
            className="rounded border border-red-700 px-4 py-1.5 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
          >
            Zamietnuť
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-600">
          Rozhodnuté: {z.rozhodnutie?.kto}
          {z.rozhodnutie?.dovod && ` · „${z.rozhodnutie.dovod}“`}
          {z.stav === "schvalena" && (
            <Link href="/podklady" className="ml-2 text-blue-700 underline">
              Podklad pre faktúru →
            </Link>
          )}
        </p>
      )}
    </li>
  );
}

export default function Schvalovanie() {
  const { ziadosti } = useStav();
  const poradie = [...ziadosti].sort((a, b) => (a.stav === "caka" ? -1 : 0) - (b.stav === "caka" ? -1 : 0));

  return (
    <div>
      <div className="text-sm text-slate-500">Krok 4 z 5 · Schvaľovateľ pracoviska</div>
      <h1 className="text-2xl font-bold">Žiadosti na schválenie</h1>
      <PreAutora>
        <p>
          <strong>Prečo táto obrazovka:</strong> Hudák chce „rezervácie miestností so schvaľovaním“ (zápis, bod 1). Bez nej
          by cesta skončila odoslaním a nebol by žiadny podklad.
        </p>
        <p>
          <strong>Schvaľovateľ vidí cenu:</strong> zadanie, pravidlo 4 spomína kalkuláciu aj „v detaile žiadosti u
          schvaľovateľa“. Pri zamietnutí je dôvod povinný, aby firma vedela prečo.
        </p>
        <p>
          <strong>Aula s dvoma schvaľovateľmi</strong> (P13) je situácia 5.7. V prototype rozhoduje rektorát. Dobrá otázka
          pre klienta.
        </p>
      </PreAutora>
      <p className="mt-1 text-sm text-slate-600">
        Každý schvaľovateľ vidí len žiadosti na miestnosti svojho pracoviska. V prototype sú pre jednoduchosť všetky spolu.
      </p>
      <Predpoklad id="P12" />
      <Predpoklad id="P13" />
      <DalsiaFaza>úprava zľavy schvaľovateľom s uvedením dôvodu (cenník to povoľuje), zástup počas dovolenky, kontrola kolízií s inými rezerváciami.</DalsiaFaza>

      {poradie.length === 0 ? (
        <p className="mt-4 text-slate-600">
          Žiadne žiadosti. <Link href="/miestnosti" className="text-blue-700 underline">Vytvoriť rezerváciu</Link>
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {poradie.map((z) => (
            <ZiadostKarta key={z.cislo} z={z} />
          ))}
        </ul>
      )}
    </div>
  );
}
