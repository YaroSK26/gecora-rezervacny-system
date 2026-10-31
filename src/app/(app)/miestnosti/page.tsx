"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cenaMiestnosti } from "@/data/cennik";
import { Okno } from "@/components/Okno";
import { Predpoklad, PredpokladZnacka } from "@/components/Predpoklad";
import { ViacVyber } from "@/components/ViacVyber";
import { odporuc, type Navrh } from "@/lib/odporucanie";
import { ulozKoncept } from "@/lib/store";
import { dovodNedostupnosti, eur, kapacitaText, MIESTNOSTI, schvalovatel, type Miestnost } from "@/lib/vypocet";

const PRACOVISKA = [...new Set(MIESTNOSTI.map((m) => m.pracovisko))];
const BUDOVY = [...new Set(MIESTNOSTI.map((m) => m.budova.split(",")[0]))].sort((a, b) => a.localeCompare(b, "sk"));

// „videokonferencia (Teams)“ → „videokonferencia“, „24 PC“ → „PC“, „whiteboard“ → „tabuľa“
function vybavenieMiestnosti(m: Miestnost) {
  return (m.vybavenie ?? "")
    .split(",")
    .map((v) =>
      v
        .replace(/\(.*?\)/g, "")
        .replace(/^\d+\s*/, "")
        .trim()
        .toLowerCase(),
    )
    .map((v) => (v === "whiteboard" ? "tabuľa" : v === "pc" ? "PC" : v === "tv" ? "TV" : v))
    .filter(Boolean);
}

// Ponúkame len vybavenie, ktoré majú aspoň 2 miestnosti
const VYBAVENIE = Object.entries(
  MIESTNOSTI.flatMap(vybavenieMiestnosti).reduce<Record<string, number>>((s, v) => ({ ...s, [v]: (s[v] ?? 0) + 1 }), {}),
)
  .filter(([, n]) => n >= 2)
  .sort((a, b) => b[1] - a[1])
  .map(([v]) => v);

function casDo(od: string, hodiny: number) {
  const min = 9 * 60 + Math.round(hodiny * 60);
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function CenaKratko({ kod }: { kod: string }) {
  const c = cenaMiestnosti(kod);
  if (!c) return <span className="text-slate-500">na dopyt</span>;
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
  const [odporucanie, setOdporucanie] = useState(false);

  const [hladaj, setHladaj] = useState("");
  const [pracoviska, setPracoviska] = useState<string[]>([]);
  const [budova, setBudova] = useState("");
  const [minKapacita, setMinKapacita] = useState<number | "">("");
  const [vybavenie, setVybavenie] = useState<string[]>([]);
  const [lenOnline, setLenOnline] = useState(false);
  const [vybrana, setVybrana] = useState<string>("IPH-K1");
  const [detailOkno, setDetailOkno] = useState(false);

  const vysledok = odporuc({
    osoby,
    hodiny,
    rozpocet: rozpocet === "" ? null : rozpocet * 100,
  });

  function rezervovat(m: Miestnost, s?: { osoby: number; hodiny: number }) {
    ulozKoncept({
      kod: m.kod,
      terminy: [""],
      od: s ? "09:00" : "",
      do: s ? casDo("09:00", s.hodiny) : "",
      osoby: s?.osoby ?? 1,
      typ: "externa",
      sluzby: {},
      ziadatel: {
        firma: "",
        ico: "",
        adresa: "",
        kontakt: "",
        email: "",
        telefon: "",
        ucel: "",
      },
    });
    router.push("/rezervacia");
  }

  const zoznam = MIESTNOSTI.filter(
    (m) =>
      (pracoviska.length === 0 || pracoviska.includes(m.pracovisko)) &&
      (!budova || m.budova.startsWith(budova)) &&
      (minKapacita === "" || (typeof m.kapacita === "number" && m.kapacita >= minKapacita)) &&
      vybavenie.every((v) => vybavenieMiestnosti(m).includes(v)) &&
      (!lenOnline || !dovodNedostupnosti(m)) &&
      (!hladaj || `${m.nazov} ${m.kod} ${m.vybavenie ?? ""}`.toLowerCase().includes(hladaj.toLowerCase())),
  );
  const detail = MIESTNOSTI.find((m) => m.kod === vybrana);
  const filtrov =
    [budova, minKapacita, lenOnline || "", hladaj].filter((x) => x !== "").length + vybavenie.length + pracoviska.length;

  function vyber(kod: string) {
    setVybrana(kod);
    // Na mobile a tablete nie je miesto vedľa zoznamu: detail otvoríme v okne
    if (window.innerWidth < 1024) setDetailOkno(true);
  }

  function zrusFiltre() {
    setPracoviska([]);
    setBudova("");
    setMinKapacita("");
    setVybavenie([]);
    setLenOnline(false);
    setHladaj("");
  }

  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-5 text-white md:p-8">
        <h1 className="text-3xl font-bold">Nájsť miestnosť</h1>
        <p className="mt-1 text-blue-100">Odpovedzte na 3 otázky a odporučíme vám vhodnú miestnosť.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
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
            <span className="block text-xs text-blue-200">Rozpočet na miestnosť (€)</span>
            <input
              type="number"
              min={0}
              value={rozpocet}
              placeholder="nemám limit"
              onChange={(e) => setRozpocet(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded bg-white px-3 py-2 text-lg font-semibold text-slate-900"
            />
          </label>
          <div className="flex flex-col justify-end sm:col-span-3 lg:col-span-1 lg:pb-3">
            <button
              onClick={() => setOdporucanie(true)}
              disabled={!osoby || !hodiny}
              className="rounded bg-white px-5 py-2 text-lg font-semibold leading-7 text-blue-900 shadow hover:bg-blue-50 disabled:opacity-50"
            >
              Odporučiť miestnosť
            </button>
          </div>
        </div>
      </section>

      {odporucanie && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">
            Odporúčame pre {osoby} ľudí na {hodiny.toLocaleString("sk-SK")} h{rozpocet !== "" && ` do ${rozpocet} €`}
          </h2>
          <Predpoklad id="P1" />
          <Predpoklad id="P2" />
          {vysledok.vhodne.length === 0 ? (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
              V rozpočte nemáme vhodnú miestnosť. Pozrite si všetky miestnosti nižšie.
            </p>
          ) : (
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {vysledok.vhodne.slice(0, 3).map((n, i) => (
                <NavrhPanel key={n.m.kod} n={n} prvy={i === 0} onRezervovat={() => rezervovat(n.m, { osoby, hodiny })} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Všetky miestnosti</h2>
            <p className="text-sm text-slate-600">
              {MIESTNOSTI.length} miestností na {PRACOVISKA.length} pracoviskách. (Chýbajú údaje od ostatných fakúlt, ústavov a
              internátov.)
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 text-sm sm:w-auto">
            <input
              value={hladaj}
              onChange={(e) => setHladaj(e.target.value)}
              placeholder="Hľadať názov, kód, vybavenie…"
              aria-label="Hľadať miestnosť"
              className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 sm:w-64"
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={lenOnline} onChange={(e) => setLenOnline(e.target.checked)} />
              len s online rezerváciou
            </label>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:flex sm:flex-wrap sm:items-end">
          <ViacVyber
            nazov="Pracovisko"
            vsetko="Všetky pracoviská"
            moznosti={PRACOVISKA}
            vybrane={pracoviska}
            onZmena={setPracoviska}
          />
          <ViacVyber
            nazov="Vybavenie (musí mať všetko vybrané)"
            vsetko="Akékoľvek vybavenie"
            moznosti={VYBAVENIE}
            vybrane={vybavenie}
            onZmena={setVybavenie}
          />
          <label className="flex flex-col">
            <span className="text-xs text-slate-500">Lokalita (budova)</span>
            <select
              value={budova}
              onChange={(e) => setBudova(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-2 sm:w-56"
            >
              <option value="">Všetky budovy</option>
              {BUDOVY.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-xs text-slate-500">Kapacita aspoň</span>
            <input
              type="number"
              min={1}
              value={minKapacita}
              placeholder="počet osôb"
              onChange={(e) => setMinKapacita(e.target.value === "" ? "" : Number(e.target.value))}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 sm:w-32"
            />
          </label>
          {filtrov > 0 && (
            <button onClick={zrusFiltre} className="h-9 cursor-pointer px-1 text-left text-blue-700 underline">
              Zrušiť filtre
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <div className="px-4 pt-2 text-xs text-slate-500" aria-live="polite">
              Zobrazené: {zoznam.length} z {MIESTNOSTI.length}
            </div>
            {zoznam.length === 0 && <p className="px-4 py-6 text-slate-600">Filtru nevyhovuje žiadna miestnosť.</p>}
            {/* Mobil: kompaktné karty, celý zoznam bez posúvania do strany */}
            <ul className="divide-y divide-slate-100 sm:hidden">
              {PRACOVISKA.filter((p) => zoznam.some((m) => m.pracovisko === p)).map((p) => (
                <li key={p}>
                  <div className="bg-blue-50/60 px-4 py-1.5 text-xs font-semibold text-blue-900">{p}</div>
                  <ul className="divide-y divide-slate-100">
                    {zoznam
                      .filter((m) => m.pracovisko === p)
                      .map((m) => {
                        const dovod = dovodNedostupnosti(m);
                        return (
                          <li key={m.kod}>
                            <button
                              onClick={() => vyber(m.kod)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-blue-50"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="truncate font-medium">{m.nazov}</div>
                                <div className="text-xs text-slate-500">
                                  <span className="font-mono">{m.kod}</span> · {kapacitaText(m)}
                                  {dovod && " · len na dopyt"}
                                </div>
                              </div>
                              <div className="tabular shrink-0 text-right text-sm">
                                <CenaKratko kod={m.kod} />
                              </div>
                              <span aria-hidden="true" className="text-slate-400">
                                ›
                              </span>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </li>
              ))}
            </ul>
            <table className="hidden w-full text-sm sm:table">
              <caption className="sr-only">Miestnosti podľa pracovísk. Riadok vyberiete klikom alebo klávesom Enter.</caption>
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">Miestnosť</th>
                  <th className="px-4 py-2 text-right">Kapacita</th>
                  <th className="px-4 py-2 text-right">Cena bez DPH</th>
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
                          onClick={() => vyber(m.kod)}
                          onKeyDown={(e) => e.key === "Enter" && vyber(m.kod)}
                          tabIndex={0}
                          aria-selected={vybrana === m.kod}
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
                              <span className="text-xs text-slate-500">nie</span>
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

          {detail && (
            <div className="hidden lg:block">
              <DetailMiestnosti m={detail} onRezervovat={() => rezervovat(detail)} />
            </div>
          )}
          {detail && detailOkno && (
            <div className="lg:hidden">
              <Okno nadpis={detail.nazov} sirka="max-w-lg" onZavri={() => setDetailOkno(false)}>
                <DetailMiestnosti m={detail} vOkne onRezervovat={() => rezervovat(detail)} />
              </Okno>
            </div>
          )}
        </div>
        <Predpoklad id="P3" />
        <Predpoklad id="P4" />
      </section>
    </div>
  );
}

function NavrhPanel({ n, prvy, onRezervovat }: { n: Navrh; prvy: boolean; onRezervovat: () => void }) {
  return (
    <div
      className={`flex flex-col rounded-xl border bg-white p-5 ${prvy ? "border-blue-600 shadow-lg ring-2 ring-blue-600/20" : "border-slate-200"}`}
    >
      {prvy && (
        <div className="mb-2 w-fit rounded-full bg-blue-700 px-2 py-0.5 text-xs font-semibold text-white">Najlepšia zhoda</div>
      )}
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
          <span>·</span>Schvaľuje: {schvalovatel(n.m)}
        </li>
      </ul>
      <button
        onClick={onRezervovat}
        className="mt-4 cursor-pointer rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
      >
        Rezervovať
      </button>
    </div>
  );
}

function DetailMiestnosti({ m, vOkne = false, onRezervovat }: { m: Miestnost; vOkne?: boolean; onRezervovat: () => void }) {
  const c = cenaMiestnosti(m.kod);
  const dovod = dovodNedostupnosti(m);
  const riadky: [string, React.ReactNode][] = [
    ["Pracovisko", m.pracovisko],
    ["Budova", m.budova],
    ["Kapacita", kapacitaText(m)],
    ["Vybavenie", m.vybavenie ?? "neuvedené"],
    ["Otvorené", m.otvaracieHodiny],
    ["Schvaľuje", schvalovatel(m)],
    [
      "Cena bez DPH",
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
  ];
  if (m.poznamka) riadky.push(["Poznámka", m.poznamka]);

  return (
    <aside className={vOkne ? "" : "h-fit rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-4"}>
      <div className="font-mono text-xs text-slate-500">{m.kod}</div>
      {!vOkne && <h3 className="text-xl font-bold">{m.nazov}</h3>}
      <dl className="mt-3 space-y-2 text-sm">
        {riadky.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[90px_1fr] gap-2">
            <dt className="text-slate-500">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {m.kod === "R-AULA" && <Predpoklad id="P5" />}
      {m.kod === "UK-1" && <Predpoklad id="P6" />}
      {m.kod === "SC-H" && <Predpoklad id="P7" />}
      {typeof m.kapacita !== "number" && <Predpoklad id="P4" />}
      {c && (
        <p className="mt-2 text-xs text-slate-500">
          Ceny sú z Cenníka 2027 <PredpokladZnacka id="P8" />
        </p>
      )}
      {dovod ? (
        <div className="mt-4 rounded bg-slate-100 px-3 py-2 text-sm text-slate-600">{dovod}</div>
      ) : (
        <button
          onClick={onRezervovat}
          className="mt-4 w-full cursor-pointer rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
        >
          Rezervovať túto miestnosť
        </button>
      )}
    </aside>
  );
}
