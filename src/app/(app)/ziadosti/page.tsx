"use client";

import Link from "next/link";
import { useState } from "react";
import { DalsiaFaza, Predpoklad } from "@/components/Predpoklad";
import { HlavickaZiadosti, UdajeZiadosti } from "@/components/DetailZiadosti";
import { Okno } from "@/components/Okno";
import { useStav, zrus, type Ziadost } from "@/lib/store";

export default function MojeZiadosti() {
  const { ziadosti } = useStav();
  const posledna = ziadosti.at(-1);
  const [detail, setDetail] = useState<Ziadost | null>(null);
  const [rusit, setRusit] = useState<Ziadost | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold">Moje žiadosti</h1>

      {posledna?.stav === "caka" && (
        <div className="mt-4 rounded border border-green-300 bg-green-50 p-4 text-sm">
          <div className="font-semibold text-green-800">Žiadosť {posledna.cislo} sme prijali.</div>
          <p className="mt-1">
            Teraz ju posúdi <strong>{posledna.schvalovatel}</strong>. Rezervácia platí až po schválení.
          </p>
        </div>
      )}
      <DalsiaFaza>potvrdenie e-mailom a pozvánka do kalendára. E-maily pôjdu cez poštový server univerzity.</DalsiaFaza>

      {ziadosti.length === 0 ? (
        <p className="mt-4 text-slate-600">
          Zatiaľ žiadne žiadosti.{" "}
          <Link href="/miestnosti" className="text-blue-700 underline">
            Nájsť miestnosť
          </Link>
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
              {z.zrusena && (
                <p className="mt-2 text-sm text-slate-600">Zrušili ste {new Date(z.zrusena).toLocaleString("sk-SK")}.</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setDetail(z)}
                  className="cursor-pointer rounded border border-blue-700 px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Zobraziť detail
                </button>
                {(z.stav === "caka" || z.stav === "schvalena") && (
                  <button
                    onClick={() => setRusit(z)}
                    className="cursor-pointer rounded border border-red-700 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Zrušiť rezerváciu
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {detail && (
        <Okno nadpis={`Žiadosť ${detail.cislo}`} sirka="max-w-4xl" onZavri={() => setDetail(null)}>
          <UdajeZiadosti z={detail} />
        </Okno>
      )}

      {rusit && (
        <Okno nadpis={`Zrušiť žiadosť ${rusit.cislo}?`} onZavri={() => setRusit(null)}>
          <p className="text-sm text-slate-700">
            Rezervácia sa zruší a miestnosť sa uvoľní. Schvaľovateľ uvidí, že ste ju zrušili. Zrušenie sa nedá vrátiť.
          </p>
          <Predpoklad id="P27" />
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setRusit(null)}
              className="cursor-pointer rounded border border-slate-300 px-4 py-1.5 text-sm hover:bg-slate-100"
            >
              Nerušiť
            </button>
            <button
              onClick={() => {
                zrus(rusit.cislo);
                setRusit(null);
              }}
              className="cursor-pointer rounded bg-red-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-800"
            >
              Áno, zrušiť
            </button>
          </div>
        </Okno>
      )}
    </div>
  );
}
