"use client";

import { useState } from "react";
import { SLUZBY } from "@/data/cennik";
import { datum, eur, kapacitaText, miestnost } from "@/lib/vypocet";
import type { Ziadost } from "@/lib/store";
import { TabulkaKalkulacie } from "./TabulkaKalkulacie";

const STAV = {
  caka: ["Čaká na schválenie", "bg-amber-100 text-amber-800"],
  schvalena: ["Schválená", "bg-green-100 text-green-800"],
  zamietnuta: ["Zamietnutá", "bg-red-100 text-red-800"],
  zrusena: ["Zrušená žiadateľom", "bg-slate-200 text-slate-700"],
} as const;

const TYP = { externa: "Externá firma alebo organizácia", spolok: "Študentský spolok UH", zamestnanec: "Zamestnanec UH" };

export function StavZiadosti({ z }: { z: Ziadost }) {
  const [t, c] = STAV[z.stav];
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold ${c}`}>{t}</span>;
}

export function Termin({ z }: { z: Ziadost }) {
  const o = z.objednavka;
  return (
    <>
      {o.terminy.length > 1 ? `${o.terminy.length} termínov od ${datum(o.terminy[0])}` : datum(o.terminy[0])}, {o.od} až {o.do}
    </>
  );
}

export function HlavickaZiadosti({ z }: { z: Ziadost }) {
  const m = miestnost(z.objednavka.kod)!;
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <div className="font-mono text-xs text-slate-500">{z.cislo}</div>
        <div className="font-semibold">
          {m.nazov} ({m.kod}) · <Termin z={z} />
        </div>
        <div className="text-sm text-slate-600">
          {z.ziadatel.firma} · {z.objednavka.osoby} osôb · {z.ziadatel.ucel}
        </div>
      </div>
      <div className="text-right">
        <StavZiadosti z={z} />
        <div className="mt-1 text-sm font-semibold">{eur(z.kalkulacia.spoluSDph)} s DPH</div>
      </div>
    </div>
  );
}

function Riadky({ nadpis, riadky }: { nadpis: string; riadky: [string, React.ReactNode][] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-500">{nadpis}</div>
      <dl className="mt-1 space-y-1 text-sm">
        {riadky.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[130px_1fr] gap-2">
            <dt className="text-slate-500">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Všetko, čo žiadateľ vyplnil, plus cena a rozhodnutie.
// ponuka = nezáväzná cenová ponuka pred odoslaním (bez stavu a schválenia).
export function UdajeZiadosti({ z, ponuka = false }: { z: Ziadost; ponuka?: boolean }) {
  const o = z.objednavka;
  const m = miestnost(o.kod)!;
  const sluzby = SLUZBY.filter((s) => o.sluzby[s.id]).map((s) => {
    const pocet = o.sluzby[s.id]!;
    return pocet > 1 ? `${s.nazov}: ${pocet}×` : s.nazov;
  });
  const vytvorena = new Date(z.vytvorena);
  const rozhodnutie: [string, React.ReactNode][] = z.rozhodnutie
    ? [
        [z.stav === "schvalena" ? "Schválil(a)" : "Zamietol(a)", z.rozhodnutie.kto],
        ["Kedy", new Date(z.rozhodnutie.kedy).toLocaleString("sk-SK")],
      ]
    : [];
  if (z.rozhodnutie?.dovod) rozhodnutie.push(["Poznámka", `„${z.rozhodnutie.dovod}“`]);
  if (z.zrusena) rozhodnutie.push(["Zrušená", new Date(z.zrusena).toLocaleString("sk-SK")]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        {ponuka ? (
          <span className="text-sm text-slate-600">
            Nezáväzná cenová ponuka zo dňa {vytvorena.toLocaleDateString("sk-SK")}. Rezervácia platí až po schválení.
          </span>
        ) : (
          <>
            <StavZiadosti z={z} />
            <span className="text-sm text-slate-500">
              Odoslaná {vytvorena.toLocaleDateString("sk-SK")} o{" "}
              {vytvorena.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </>
        )}
        <button
          onClick={() => window.print()}
          className="no-print ml-auto cursor-pointer rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Tlačiť / uložiť ako PDF
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Riadky
          nadpis="Rezervácia"
          riadky={[
            ["Miestnosť", `${m.nazov} (${m.kod})`],
            ["Pracovisko", m.pracovisko],
            ["Budova", m.budova],
            ["Kapacita", kapacitaText(m)],
            ["Termín", o.terminy.filter(Boolean).map(datum).join(", ")],
            ["Čas", `${o.od} až ${o.do}`],
            ["Počet osôb", o.osoby],
            ["Služby", sluzby.length ? sluzby.join(", ") : "bez služieb"],
          ]}
        />
        <Riadky
          nadpis="Žiadateľ"
          riadky={[
            ["Typ", TYP[o.typ]],
            ["Firma", z.ziadatel.firma],
            ["IČO", z.ziadatel.ico],
            ["Fakturačná adresa", z.ziadatel.adresa],
            ["Kontaktná osoba", z.ziadatel.kontakt],
            ["E-mail", z.ziadatel.email],
            ["Telefón", z.ziadatel.telefon],
            ["Účel akcie", z.ziadatel.ucel],
          ]}
        />
      </div>
      <div>
        <div className="mb-1 text-xs font-semibold uppercase text-slate-500">Cena</div>
        <TabulkaKalkulacie k={z.kalkulacia} />
      </div>
      {!ponuka && <Riadky nadpis="Schválenie" riadky={[["Schvaľuje", z.schvalovatel], ...rozhodnutie]} />}
    </div>
  );
}

type Poradie = "najnovsie" | "najstarsie" | "termin" | "miestnost" | "ziadatel" | "cena";

const PORADIA: [Poradie, string][] = [
  ["najnovsie", "Najnovšie"],
  ["najstarsie", "Najstaršie"],
  ["termin", "Podľa termínu"],
  ["miestnost", "Miestnosť A–Z"],
  ["ziadatel", "Žiadateľ A–Z"],
  ["cena", "Najvyššia cena"],
];

const nazovMiestnosti = (z: Ziadost) => miestnost(z.objednavka.kod)!.nazov;
const zaciatok = (z: Ziadost) => `${z.objednavka.terminy[0]} ${z.objednavka.od}`;

function zorad(a: Ziadost, b: Ziadost, p: Poradie) {
  switch (p) {
    case "najnovsie":
      return b.vytvorena.localeCompare(a.vytvorena);
    case "najstarsie":
      return a.vytvorena.localeCompare(b.vytvorena);
    case "termin":
      return zaciatok(a).localeCompare(zaciatok(b));
    case "miestnost":
      return nazovMiestnosti(a).localeCompare(nazovMiestnosti(b), "sk");
    case "ziadatel":
      return a.ziadatel.firma.localeCompare(b.ziadatel.firma, "sk");
    case "cena":
      return b.kalkulacia.spoluSDph - a.kalkulacia.spoluSDph;
  }
}

// Zoznam žiadostí: hľadanie, filter podľa miestnosti a stavu, triedenie, rozbalenie každej karty
export function ZoznamZiadosti({
  ziadosti,
  sFiltromStavu = false,
  rozbalenaNaZaciatku = () => false,
  telo,
  prazdny,
}: {
  ziadosti: Ziadost[];
  sFiltromStavu?: boolean;
  rozbalenaNaZaciatku?: (z: Ziadost) => boolean;
  telo: (z: Ziadost) => React.ReactNode;
  prazdny: string;
}) {
  const [kod, setKod] = useState("");
  const [stav, setStav] = useState<"" | Ziadost["stav"]>("");
  const [poradie, setPoradie] = useState<Poradie>("najnovsie");
  const [hladaj, setHladaj] = useState("");
  // Čo používateľ rozbalil alebo zbalil. Ostatné karty sa riadia podľa rozbalenaNaZaciatku.
  const [volby, setVolby] = useState<Record<string, boolean>>({});

  if (ziadosti.length === 0) return <p className="mt-4 text-slate-600">{prazdny}</p>;

  const miestnosti = [...new Set(ziadosti.map((z) => z.objednavka.kod))]
    .map((k) => miestnost(k)!)
    .sort((a, b) => a.nazov.localeCompare(b.nazov, "sk"));
  const q = hladaj.trim().toLowerCase();
  const zoznam = ziadosti
    .filter(
      (z) =>
        (!kod || z.objednavka.kod === kod) &&
        (!stav || z.stav === stav) &&
        (!q || `${z.cislo} ${z.ziadatel.firma} ${z.ziadatel.ucel} ${z.ziadatel.kontakt}`.toLowerCase().includes(q)),
    )
    .sort((a, b) => zorad(a, b, poradie));

  const jeOtvorena = (z: Ziadost) => volby[z.cislo] ?? rozbalenaNaZaciatku(z);
  const prepni = (z: Ziadost) => setVolby((v) => ({ ...v, [z.cislo]: !jeOtvorena(z) }));
  const vsetky = (otvor: boolean) => setVolby(Object.fromEntries(zoznam.map((z) => [z.cislo, otvor])));

  const pole = "rounded border border-slate-300 bg-white px-2 py-1.5 text-sm";
  return (
    <div className="mt-4">
      <div className="no-print flex flex-wrap items-center gap-2">
        <input
          value={hladaj}
          onChange={(e) => setHladaj(e.target.value)}
          placeholder="Hľadať firmu, účel, číslo…"
          className={`${pole} w-60`}
        />
        <select value={kod} onChange={(e) => setKod(e.target.value)} className={pole} aria-label="Miestnosť">
          <option value="">Všetky miestnosti</option>
          {miestnosti.map((m) => (
            <option key={m.kod} value={m.kod}>
              {m.nazov} ({m.kod})
            </option>
          ))}
        </select>
        {sFiltromStavu && (
          <select value={stav} onChange={(e) => setStav(e.target.value as typeof stav)} className={pole} aria-label="Stav">
            <option value="">Všetky stavy</option>
            {Object.entries(STAV).map(([k, [t]]) => (
              <option key={k} value={k}>
                {t}
              </option>
            ))}
          </select>
        )}
        <select value={poradie} onChange={(e) => setPoradie(e.target.value as Poradie)} className={pole} aria-label="Zoradiť">
          {PORADIA.map(([k, t]) => (
            <option key={k} value={k}>
              {t}
            </option>
          ))}
        </select>
        <div className="ml-auto flex gap-1 text-sm">
          <button onClick={() => vsetky(true)} className="cursor-pointer rounded px-2 py-1 text-blue-700 hover:bg-blue-50">
            Rozbaliť všetko
          </button>
          <button onClick={() => vsetky(false)} className="cursor-pointer rounded px-2 py-1 text-blue-700 hover:bg-blue-50">
            Zbaliť všetko
          </button>
        </div>
      </div>

      <div className="no-print mt-2 text-xs text-slate-500">
        {zoznam.length} z {ziadosti.length} žiadostí
      </div>

      {zoznam.length === 0 ? (
        <p className="mt-3 text-slate-600">Filtru nevyhovuje žiadna žiadosť.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {zoznam.map((z) => {
            const je = jeOtvorena(z);
            return (
              <li
                key={z.cislo}
                className={`rounded border bg-white ${je ? "border-slate-300 shadow-sm" : "border-slate-200 print:hidden"}`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={je}
                  onClick={() => prepni(z)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    prepni(z);
                  }}
                  className="flex cursor-pointer gap-3 rounded p-4 hover:bg-slate-50"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`no-print h-5 w-5 shrink-0 self-center fill-slate-500 transition-transform duration-200 ${je ? "rotate-90" : ""}`}
                  >
                    <path d="M7 4l7 6-7 6z" />
                  </svg>
                  <div className="flex-1">
                    <HlavickaZiadosti z={z} />
                  </div>
                </div>
                {je && <div className="border-t border-slate-100 p-4">{telo(z)}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
