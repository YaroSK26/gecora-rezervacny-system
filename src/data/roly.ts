import type { Rola } from "@/lib/store";

export type InfoRoly = {
  id: Rola | "zamestnanec" | "spravca";
  nazov: string;
  kto: string;
  popis: string;
  domov: string;
  menu: { href: string; text: string }[];
  dalsiaFaza?: boolean;
};

export const ROLY: InfoRoly[] = [
  {
    id: "host",
    nazov: "Externý hosť",
    kto: "firma, organizácia, verejnosť",
    popis: "Nájdem miestnosť, vidím cenu a pošlem žiadosť.",
    domov: "/miestnosti",
    menu: [
      { href: "/miestnosti", text: "Nájsť miestnosť" },
      { href: "/rezervacia", text: "Rezervácia" },
      { href: "/ziadosti", text: "Moje žiadosti" },
    ],
  },
  {
    id: "schvalovatel",
    nazov: "Schvaľovateľ pracoviska",
    kto: "napr. Ing. Tóthová, Inovačný park",
    popis: "Vidím žiadosti na svoje miestnosti a schválim ich alebo zamietnem.",
    domov: "/schvalovanie",
    menu: [{ href: "/schvalovanie", text: "Žiadosti na schválenie" }],
  },
  {
    id: "ekonom",
    nazov: "Ekonomické oddelenie",
    kto: "napr. Ing. Kováčová",
    popis: "Zo schválených rezervácií dostanem podklad pre faktúru s rozpisom DPH.",
    domov: "/podklady",
    menu: [{ href: "/podklady", text: "Podklady pre faktúru" }],
  },
  {
    id: "zamestnanec",
    nazov: "Zamestnanec alebo študent UH",
    kto: "prihlásenie školským účtom",
    popis: "Rezervácia pre výučbu, porady, spolky a šport.",
    domov: "/dalsia-faza#zamestnanci",
    menu: [],
    dalsiaFaza: true,
  },
  {
    id: "spravca",
    nazov: "Správca systému",
    kto: "ÚIT",
    popis: "Miestnosti, schvaľovatelia, cenník.",
    domov: "/dalsia-faza#sprava",
    menu: [],
    dalsiaFaza: true,
  },
];

export function infoRoly(id: Rola | null) {
  return ROLY.find((r) => r.id === (id ?? "host"))!;
}
