"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cenaMiestnosti } from "@/data/cennik";
import { Predpoklad, PredpokladZnacka } from "@/components/Predpoklad";
import { PreAutora } from "@/components/PreAutora";
import { odporuc, type Navrh } from "@/lib/odporucanie";
import { ulozKoncept } from "@/lib/store";
import { dovodNedostupnosti, eur, MIESTNOSTI, schvalovatel, type Miestnost } from "@/lib/vypocet";

const PRACOVISKA = [...new Set(MIESTNOSTI.map((m) => m.pracovisko))];

function cena2024(m: Miestnost) {
  const c = m.cenaExterni2024;
  if (c === null) return "neuvedená";
  return typeof c === "number" ? `${c} €/h` : c;
}

function casDo(od: string, hodiny: number) {
  const min = 9 * 60 + Math.round(hodiny * 60);
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function CenaKratko({ kod }: { kod: string }) {
  const c = cenaMiestnosti(kod);
  if (!c) return <span className="text-slate-400">na dopyt</span>;
  return (
    <span>
      {eur(c.zaBlok)} <span className="text-slate-500">/ {c.blokMin} min</span>
      {c.pausal > 0 && <span className="block text-xs text-slate-500">+ paušál {eur(c.pausal)}</span>}
    </span>
  );
}

export default function Miestnosti() {
  const router = useRouter();
  const [osoby, setOsoby] = useState(40);
  const [hodiny, setHodiny] = useState(6.5);
  const [rozpocet, setRozpocet] = useState<number | "">(250);
  const [pohlad, setPohlad] = useState<"nic" | "odporucanie" | "vsetky">("nic");

  const [hladaj, setHladaj] = useState("");
  const [pracovisko, setPracovisko] = useState("");
  const [lenOnline, setLenOnline] = useState(false);
  const [vybrana, setVybrana] = useState<string>("IPH-K1");

  const vysledok = odporuc({ osoby, hodiny, rozpocet: rozpocet === "" ? null : rozpocet * 100 });

  function rezervovat(m: Miestnost, s?: { osoby: number; hodiny: number }) {
    ulozKoncept({
      kod: m.kod,
      terminy: [""],
      od: s ? "09:00" : "",
      do: s ? casDo("09:00", s.hodiny) : "",
      osoby: s?.osoby ?? 1,
      typ: "externa",
      sluzby: {},
      ziadatel: { firma: "", ico: "", adresa: "", kontakt: "", email: "", ucel: "" },
    });
    router.push("/rezervacia");
  }

  const zoznam = MIESTNOSTI.filter(
    (m) =>
      (!pracovisko || m.pracovisko === pracovisko) &&
      (!lenOnline || !dovodNedostupnosti(m)) &&
      (!hladaj || `${m.nazov} ${m.kod} ${m.vybavenie ?? ""}`.toLowerCase().includes(hladaj.toLowerCase())),
  );
  const detail = MIESTNOSTI.find((m) => m.kod === vybrana);

  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white md:p-8">
        <div className="text-sm text-blue-200">Krok 1 z 5 · Externý hosť</div>
        <h1 className="mt-1 text-3xl font-bold">Nájsť miestnosť</h1>
        <p className="mt-1 text-blue-100">Odpovedzte na 3 otázky a odporučíme vám vhodnú miestnosť.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="rounded-lg bg-white/10 p-3">
            <span className="block text-xs text-blue-200">Koľko ľudí príde?</span>
            <input
              type="number"
              min={1}
              value={osoby || ""}
              onChange={(e) => setOsoby(Number(e.target.value))}
              className="mt-1 w-full rounded bg-white px-3 py-2 text-lg font-semibold text-slate-900"
            />
          </label>
          <label className="rounded-lg bg-white/10 p-3">
            <span className="block text-xs text-blue-200">Na ako dlho? (hodiny)</span>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={hodiny || ""}
              onChange={(e) => setHodiny(Number(e.target.value))}
              className="mt-1 w-full rounded bg-white px-3 py-2 text-lg font-semibold text-slate-900"
            />
          </label>
          <label className="rounded-lg bg-white/10 p-3">
            <span className="block text-xs text-blue-200">Rozpočet na miestnosť (€ bez DPH)</span>
            <input
              type="number"
              min={0}
              value={rozpocet}
              placeholder="nemám limit"
              onChange={(e) => setRozpocet(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded bg-white px-3 py-2 text-lg font-semibold text-slate-900"
            />
          </label>
          <div className="flex flex-col justify-end gap-2">
            <button
              onClick={() => setPohlad("odporucanie")}
              disabled={!osoby || !hodiny}
              className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-900 shadow hover:bg-blue-50 disabled:opacity-50"
            >
              Odporučiť miestnosť
            </button>
          </div>
        </div>
        <button onClick={() => setPohlad("vsetky")} className="mt-4 text-sm text-blue-100 underline hover:text-white">
          Alebo pozrieť všetky miestnosti ({MIESTNOSTI.length}) →
        </button>
      </section>

      <PreAutora>
        <p>
          <strong>Prečo odporúčanie:</strong> Hudák chce systém, ktorý nahradí e-maily a Excel (e-mail od Hudáka, bod 1
          zápisu). Firma nepozná naše miestnosti, chce vedieť, čo sa jej zmestí a koľko to stojí. Výsledok predvyplní
          formulár.
        </p>
        <p>
          <strong>Ako to funguje:</strong> pravidlá v{" "}
          <code>src/lib/odporucanie.ts</code>. 1. len miestnosti s cenou 2027 a číselnou kapacitou, 2. kapacita ≥ počet ľudí,
          3. cena miestnosti = paušál + začaté bloky × cena za blok, 4. zoradenie podľa najmenšej kapacity, potom ceny.
        </p>
        <p>
          <strong>Pre K1 (40 ľudí, 6,5 h):</strong> IPH-K1 nevyjde ako prvá, lebo R-205 (60 miest) je menšia. To je
          v poriadku: ukazuje to, že pravidlá sú čestné. Na porade klikni na IPH-K1 v zozname alebo daj „Rovno vyplniť K1“.
        </p>
        <p>
          <strong>Prečo nie AI:</strong> zadanie, situácia 5.5. Pravidlá vieš klientovi vysvetliť a vždy dajú rovnaký výsledok.
        </p>
      </PreAutora>

      {pohlad === "odporucanie" && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">
            Odporúčame pre {osoby} ľudí na {hodiny.toLocaleString("sk-SK")} h
            {rozpocet !== "" && ` do ${rozpocet} € bez DPH`}
          </h2>
          <Predpoklad id="P24" />
          <Predpoklad id="P25" />
          {vysledok.vhodne.length === 0 ? (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
              V rozpočte nemáme vhodnú miestnosť. Pozrite si možnosti nad rozpočtom nižšie.
            </p>
          ) : (
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {vysledok.vhodne.slice(0, 3).map((n, i) => (
                <NavrhPanel key={n.m.kod} n={n} prvy={i === 0} onRezervovat={() => rezervovat(n.m, { osoby, hodiny })} />
              ))}
            </div>
          )}
          {vysledok.nadRozpocet.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-600">Zmestí sa, ale je nad rozpočet</h3>
              <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white text-sm">
                {vysledok.nadRozpocet.map((n) => (
                  <li key={n.m.kod} className="flex items-center justify-between gap-3 px-4 py-2">
                    <span>
                      {n.m.nazov} <span className="font-mono text-xs text-slate-500">{n.m.kod}</span> · {n.m.kapacita} miest
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="tabular font-semibold">{eur(n.cena)}</span>
                      <button onClick={() => rezervovat(n.m, { osoby, hodiny })} className="text-blue-700 underline">
                        Rezervovať
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setPohlad("vsetky")} className="mt-6 rounded-lg border border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50">
            Pozrieť všetky miestnosti
          </button>
        </section>
      )}

      {pohlad === "vsetky" && (
        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Všetky miestnosti</h2>
              <p className="text-sm text-slate-600">
                {MIESTNOSTI.length} miestností z {PRACOVISKA.length} pracovísk, ktoré poslali údaje. Ostatné fakulty, ústavy
                a internáty zatiaľ nič neposlali.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <input
                value={hladaj}
                onChange={(e) => setHladaj(e.target.value)}
                placeholder="Hľadať názov, kód, vybavenie…"
                className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-1.5"
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={lenOnline} onChange={(e) => setLenOnline(e.target.checked)} />
                len s online rezerváciou
              </label>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {["", ...PRACOVISKA].map((p) => (
              <button
                key={p || "vsetky"}
                onClick={() => setPracovisko(p)}
                className={`rounded-full border px-3 py-1 ${pracovisko === p ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-white hover:border-blue-400"}`}
              >
                {p || "Všetky pracoviská"}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_380px]">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Miestnosť</th>
                    <th className="px-4 py-2 text-right">Kapacita</th>
                    <th className="px-4 py-2 text-right">Cena 2027 bez DPH</th>
                    <th className="px-4 py-2">Online</th>
                  </tr>
                </thead>
                {PRACOVISKA.filter((p) => zoznam.some((m) => m.pracovisko === p)).map((p) => (
                  <tbody key={p}>
                    <tr className="bg-blue-50/60">
                      <td colSpan={4} className="px-4 py-1.5 text-xs font-semibold text-blue-900">
                        {p}
                      </td>
                    </tr>
                    {zoznam
                      .filter((m) => m.pracovisko === p)
                      .map((m) => {
                        const dovod = dovodNedostupnosti(m);
                        return (
                          <tr
                            key={m.kod}
                            onClick={() => setVybrana(m.kod)}
                            className={`cursor-pointer border-t border-slate-100 ${vybrana === m.kod ? "bg-blue-100/70" : "hover:bg-slate-50"}`}
                          >
                            <td className="px-4 py-2">
                              <div className="font-medium">{m.nazov}</div>
                              <div className="font-mono text-xs text-slate-500">{m.kod}</div>
                            </td>
                            <td className="tabular px-4 py-2 text-right">{m.kapacita ?? "–"}</td>
                            <td className="tabular px-4 py-2 text-right">
                              <CenaKratko kod={m.kod} />
                            </td>
                            <td className="px-4 py-2">
                              {dovod ? (
                                <span className="text-xs text-slate-400">nie</span>
                              ) : (
                                <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-800">áno</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                ))}
              </table>
            </div>

            {detail && <DetailMiestnosti m={detail} onRezervovat={() => rezervovat(detail)} />}
          </div>
          <Predpoklad id="P2" />
          <Predpoklad id="P17" />
        </section>
      )}
    </div>
  );
}

function NavrhPanel({ n, prvy, onRezervovat }: { n: Navrh; prvy: boolean; onRezervovat: () => void }) {
  return (
    <div className={`flex flex-col rounded-xl border bg-white p-5 ${prvy ? "border-blue-600 shadow-lg ring-2 ring-blue-600/20" : "border-slate-200"}`}>
      {prvy && <div className="mb-2 w-fit rounded-full bg-blue-700 px-2 py-0.5 text-xs font-semibold text-white">Najlepšia zhoda</div>}
      <div className="text-lg font-bold">{n.m.nazov}</div>
      <div className="text-xs text-slate-500">
        {n.m.kod} · {n.m.budova}
      </div>
      <div className="mt-3 text-2xl font-bold text-blue-900">
        {eur(n.cena)} <span className="text-sm font-normal text-slate-500">bez DPH</span>
      </div>
      <ul className="mt-3 flex-1 space-y-1 text-sm text-slate-700">
        {n.dovody.map((d) => (
          <li key={d} className="flex gap-2">
            <span className="text-blue-600">✓</span>
            {d}
          </li>
        ))}
        <li className="flex gap-2 text-slate-500">
          <span>·</span>schvaľuje {schvalovatel(n.m)}
        </li>
      </ul>
      <button onClick={onRezervovat} className="mt-4 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">
        Rezervovať
      </button>
    </div>
  );
}

function DetailMiestnosti({ m, onRezervovat }: { m: Miestnost; onRezervovat: () => void }) {
  const c = cenaMiestnosti(m.kod);
  const dovod = dovodNedostupnosti(m);
  const riadky: [string, React.ReactNode][] = [
    ["Pracovisko", m.pracovisko],
    ["Budova", m.budova],
    ["Kapacita", m.kapacita ?? "neuvedená"],
    ["Vybavenie", m.vybavenie ?? "neuvedené"],
    ["Otvorené", m.otvaracieHodiny],
    ["Schvaľuje", schvalovatel(m)],
    [
      "Cena 2027",
      c ? (
        <>
          {c.pausal > 0 && `paušál ${eur(c.pausal)} + `}
          {eur(c.zaBlok)} za blok {c.blokMin} min
          {c.poznamka && <span className="block text-xs text-slate-500">{c.poznamka}</span>}
        </>
      ) : (
        "chýba"
      ),
    ],
    ["Cena 2024", <span key="c" className="text-slate-500">{cena2024(m)} (neplatí)</span>],
  ];
  if (m.poznamka) riadky.push(["Poznámka", m.poznamka]);

  return (
    <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-4">
      <div className="font-mono text-xs text-slate-500">{m.kod}</div>
      <h3 className="text-xl font-bold">{m.nazov}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {riadky.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[90px_1fr] gap-2">
            <dt className="text-slate-500">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {m.kod === "R-AULA" && <Predpoklad id="P13" />}
      {m.kod === "UK-1" && <Predpoklad id="P14" />}
      {m.kod === "SC-H" && <Predpoklad id="P22" />}
      {typeof m.kapacita !== "number" && <Predpoklad id="P17" />}
      {c && (
        <p className="mt-2 text-xs text-slate-500">
          Ceny sú z Cenníka 2027 <PredpokladZnacka id="P1" />
        </p>
      )}
      {dovod ? (
        <div className="mt-4 rounded bg-slate-100 px-3 py-2 text-sm text-slate-600">{dovod}</div>
      ) : (
        <button onClick={onRezervovat} className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">
          Rezervovať túto miestnosť
        </button>
      )}
    </aside>
  );
}
