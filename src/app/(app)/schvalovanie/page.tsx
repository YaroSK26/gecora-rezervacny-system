"use client";

import { useState } from "react";
import { DalsiaFaza, Predpoklad } from "@/components/Predpoklad";
import { ZoznamZiadosti } from "@/components/DetailZiadosti";
import { TabulkaKalkulacie } from "@/components/TabulkaKalkulacie";
import { rozhodni, useStav, type Ziadost } from "@/lib/store";
import { kapacitaText, miestnost } from "@/lib/vypocet";

function Rozhodnutie({ z }: { z: Ziadost }) {
  const [dovod, setDovod] = useState("");
  const m = miestnost(z.objednavka.kod)!;
  return (
    <div>
      <div className="grid gap-1 text-sm text-slate-600 md:grid-cols-2">
        <div>
          Kontakt: {z.ziadatel.kontakt}, {z.ziadatel.email}, {z.ziadatel.telefon}
        </div>
        <div>
          IČO {z.ziadatel.ico}, {z.ziadatel.adresa}
        </div>
        <div>Kapacita miestnosti: {kapacitaText(m)}</div>
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
            <input
              value={dovod}
              onChange={(e) => setDovod(e.target.value)}
              className="rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <button
            onClick={() => rozhodni(z.cislo, "schvalena", z.schvalovatel, dovod)}
            className="cursor-pointer rounded bg-green-700 px-4 py-1.5 font-semibold text-white hover:bg-green-800"
          >
            Schváliť
          </button>
          <button
            disabled={!dovod.trim()}
            onClick={() => rozhodni(z.cislo, "zamietnuta", z.schvalovatel, dovod)}
            className="cursor-pointer rounded border border-red-700 px-4 py-1.5 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Zamietnuť
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-600">
          {z.rozhodnutie && <>Rozhodnuté: {z.rozhodnutie.kto}</>}
          {z.rozhodnutie?.dovod && ` · „${z.rozhodnutie.dovod}“`}
          {z.zrusena && <span className="block">Žiadateľ rezerváciu zrušil {new Date(z.zrusena).toLocaleString("sk-SK")}.</span>}
        </p>
      )}
    </div>
  );
}

export default function Schvalovanie() {
  const { ziadosti } = useStav();

  return (
    <div>
      <h1 className="text-2xl font-bold">Žiadosti na schválenie</h1>
      <p className="mt-1 text-sm text-slate-600">
        Každý schvaľovateľ vidí len žiadosti na miestnosti svojho pracoviska. V prototype sú pre jednoduchosť všetky spolu.
      </p>
      <Predpoklad id="P18" />
      <Predpoklad id="P5" />
      <DalsiaFaza>
        úprava zľavy schvaľovateľom s uvedením dôvodu (cenník to povoľuje), zástup počas dovolenky, kontrola kolízií s inými
        rezerváciami.
      </DalsiaFaza>

      <ZoznamZiadosti
        ziadosti={ziadosti}
        sFiltromStavu
        rozbalenaNaZaciatku={(z) => z.stav === "caka"}
        telo={(z) => <Rozhodnutie z={z} />}
        prazdny="Žiadne žiadosti."
      />
    </div>
  );
}
