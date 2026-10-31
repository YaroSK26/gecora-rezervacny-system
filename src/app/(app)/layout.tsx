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
      <main id="obsah" tabIndex={-1} className="flex-1 px-4 py-6 outline-none sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Strazca>{children}</Strazca>
        </div>
      </main>
      <footer className="no-print border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Rezervačný systém Univerzity Hron · prototyp · <Link href="/dalsia-faza" className="underline">Čo bude v ďalšej fáze</Link>
      </footer>
    </div>
  );
}
