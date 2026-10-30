import Link from "next/link";
import { Hlavicka } from "@/components/Hlavicka";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Hlavicka />
      <div className="no-print border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-900">
        <strong>Prototyp.</strong> Dáta sú z data.xlsx. Žlté rámčeky sú naše predpoklady: tu čakáme na vaše rozhodnutie.{" "}
        <Link href="/predpoklady" className="underline">
          Všetky predpoklady
        </Link>
      </div>
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      <footer className="no-print border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Rezervácie UH · prototyp · <Link href="/dalsia-faza" className="underline">Čo bude v ďalšej fáze</Link>
      </footer>
    </div>
  );
}
