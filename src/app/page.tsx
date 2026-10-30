import Link from "next/link";
import { PreAutora } from "@/components/PreAutora";
import { MIESTNOSTI } from "@/lib/vypocet";

const PRACOVISKA = new Set(MIESTNOSTI.map((m) => m.pracovisko)).size;

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-950 via-blue-900 to-blue-700 text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded bg-white text-sm text-blue-900">UH</span>
          Rezervácie UH
        </div>
        <Link href="/prihlasenie" className="rounded border border-white/40 px-4 py-1.5 text-sm hover:bg-white/10">
          Prihlásiť sa
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-24">
        <div className="mb-4 w-fit rounded-full bg-white/10 px-3 py-1 text-xs text-blue-100">
          Prototyp · porada vedenia 23. 11. 2026
        </div>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
          Rezervačný systém pre Univerzitu Hron
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-blue-100">
          Aula, učebne, sály, telocvične aj galérie na jednom mieste. Bez e-mailov, Excelov a zošita na recepcii. Cenu
          vidíte hneď, žiadosť ide priamo tomu, kto ju schvaľuje.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/prihlasenie" className="rounded bg-white px-6 py-3 font-semibold text-blue-900 shadow hover:bg-blue-50">
            Prihlásiť sa
          </Link>
          <Link href="/o-prototype" className="rounded border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">
            Čo prototyp ukazuje
          </Link>
        </div>
        <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-blue-200">Miestností</dt>
            <dd className="text-3xl font-bold">{MIESTNOSTI.length}</dd>
          </div>
          <div>
            <dt className="text-blue-200">Pracovísk</dt>
            <dd className="text-3xl font-bold">{PRACOVISKA}</dd>
          </div>
          <div>
            <dt className="text-blue-200">Cenník</dt>
            <dd className="text-3xl font-bold">2027</dd>
          </div>
        </dl>
        <div className="mt-10 max-w-2xl text-slate-900">
          <PreAutora>
            Zadanie, Časť 1, pravidlo 1: „Ostatné role a funkcie nemusia fungovať, ale mali by byť v prototype viditeľné.“
            Preto je tu prihlásenie s výberom roly: klient hneď vidí, že systém má viac rolí. Prihlásenie je len
            naoko, skutočné školské prihlásenie (SSO) dodá univerzita (Príloha 3, poznámka ÚIT).
          </PreAutora>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-blue-200">
        Prototyp. Dáta z data.xlsx (Miestnosti, Cenník 2027). Nie je to hotový systém.
      </footer>
    </div>
  );
}
