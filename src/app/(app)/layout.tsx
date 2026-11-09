import Link from "next/link";
import { Hlavicka } from "@/components/Hlavicka";
import { Strazca } from "@/components/Strazca";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#obsah"
        className="sr-only z-50 rounded bg-white px-4 py-2 font-semibold text-blue-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Preskočiť na obsah
      </a>
      <Hlavicka />
      <main
        id="obsah"
        tabIndex={-1}
        className="flex-1 bg-gradient-to-b from-blue-50 via-slate-50 to-blue-50/70 px-4 py-6 outline-none sm:py-8"
      >
        <div className="mx-auto max-w-6xl">
          <Strazca>{children}</Strazca>
        </div>
      </main>
      <footer className="no-print border-t border-blue-950 bg-blue-900 py-4 text-center text-xs text-white">
        Rezervačný systém Univerzity Hron · prototyp ·{" "}
        <Link href="/dalsia-faza" className="text-white underline hover:text-blue-100">
          Čo bude v ďalšej fáze
        </Link>
      </footer>
    </div>
  );
}
