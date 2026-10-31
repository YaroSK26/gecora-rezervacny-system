"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { infoRoly } from "@/data/roly";
import { useStav } from "@/lib/store";
import { Predpoklad } from "./Predpoklad";

// Stránky, ktoré vidí každá rola
export const SPOLOCNE = [
  { href: "/kalkulacie", text: "Kalkulácia K1 a K2" },
  { href: "/predpoklady", text: "Predpoklady" },
  { href: "/o-prototype", text: "O prototype" },
];
const VZDY = ["/dalsia-faza", ...SPOLOCNE.map((m) => m.href)];

const nic = () => () => {};

// Pustí na stránku len rolu, ktorej patrí (P25)
export function Strazca({ children }: { children: React.ReactNode }) {
  const cesta = usePathname();
  const { rola } = useStav();
  const nacitane = useSyncExternalStore(nic, () => true, () => false);
  const aktualna = infoRoly(rola);
  const smie = [...VZDY, ...aktualna.menu.map((m) => m.href)].some((h) => cesta.startsWith(h));

  if (smie) return children;
  if (!nacitane) return null;
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-bold">Táto stránka nie je pre vašu rolu</h1>
      <p className="mt-2 text-slate-600">
        Ste prihlásený ako <strong>{aktualna.nazov}</strong>. Rolu zmeníte vpravo hore.
      </p>
      <Link href={aktualna.domov} className="mt-6 inline-block rounded bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800">
        Na moju úvodnú stránku
      </Link>
      <div className="mt-6">
        <Predpoklad id="P25" />
      </div>
    </div>
  );
}
