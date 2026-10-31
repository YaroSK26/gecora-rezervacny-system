"use client";

import { useRouter } from "next/navigation";
import { nastavRolu, ulozKoncept, type Ziadatel } from "@/lib/store";
import { K1 } from "@/lib/vypocet";

// Vzorová firma pre ukážku. Údaje sú vymyslené.
export const VZOROVA_FIRMA: Ziadatel = {
  firma: "Vzorová firma s. r. o.",
  ico: "12345678",
  adresa: "Hlavná 1, 974 01 Banská Bystrica",
  kontakt: "Jana Nováková",
  email: "jana.novakova@vzorovafirma.sk",
  telefon: "+421 905 123 456",
  ucel: "Celodenné školenie zamestnancov",
};

export function VyplnitK1({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        nastavRolu("host");
        ulozKoncept({ ...K1, ziadatel: VZOROVA_FIRMA });
        router.push("/rezervacia");
      }}
      className={className ?? "rounded border border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"}
    >
      Vyplniť kontrolnú rezerváciu K1
    </button>
  );
}
