"use client";

import Link from "next/link";
import { PreAutora } from "@/components/PreAutora";
import { DalsiaFaza } from "@/components/Predpoklad";
import { HlavickaZiadosti } from "@/components/DetailZiadosti";
import { useStav } from "@/lib/store";

export default function MojeZiadosti() {
  const { ziadosti } = useStav();
  const posledna = ziadosti.at(-1);

  return (
    <div>
      <div className="text-sm text-slate-500">Krok 3 z 5 · Externá firma</div>
      <h1 className="text-2xl font-bold">Moje žiadosti</h1>
      <PreAutora>
        <p>
          <strong>Prečo stav žiadosti:</strong> dnes firma pošle e-mail a nevie, či ho niekto čítal (e-mail od Hudáka).
          Tu vidí, kto žiadosť posudzuje a v akom je stave.
        </p>
        <p>
          <strong>E-mail s potvrdením</strong> je ďalšia fáza: poštový server školy je len vo vnútornej sieti (zápis z porady,
          Príloha 3).
        </p>
      </PreAutora>

      {posledna?.stav === "caka" && (
        <div className="mt-4 rounded border border-green-300 bg-green-50 p-4 text-sm">
          <div className="font-semibold text-green-800">Žiadosť {posledna.cislo} sme prijali.</div>
          <p className="mt-1">
            Teraz ju posúdi <strong>{posledna.schvalovatel}</strong>. Rezervácia platí až po schválení.
          </p>
          <Link href="/schvalovanie" className="mt-2 inline-block rounded bg-blue-700 px-3 py-1.5 font-semibold text-white hover:bg-blue-800">
            Pokračovať ako schvaľovateľ →
          </Link>
        </div>
      )}
      <DalsiaFaza>potvrdenie e-mailom a pozvánka do kalendára. E-maily pôjdu cez poštový server univerzity.</DalsiaFaza>

      {ziadosti.length === 0 ? (
        <p className="mt-4 text-slate-600">
          Zatiaľ žiadne žiadosti. <Link href="/miestnosti" className="text-blue-700 underline">Nájsť miestnosť</Link>
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {[...ziadosti].reverse().map((z) => (
            <li key={z.cislo} className="rounded border border-slate-200 bg-white p-4">
              <HlavickaZiadosti z={z} />
              {z.rozhodnutie && (
                <p className="mt-2 text-sm text-slate-600">
                  {z.stav === "schvalena" ? "Schválil(a)" : "Zamietol(a)"}: {z.rozhodnutie.kto}
                  {z.rozhodnutie.dovod && ` · „${z.rozhodnutie.dovod}“`}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
