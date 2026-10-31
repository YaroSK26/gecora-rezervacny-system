// Všetky predpoklady na jednom mieste. Na obrazovkách sa ukazujú podľa id.
// Ak klient rozhodne inak, stačí zmeniť text tu a pravidlo vo výpočte.
// `zdroj` = kde v podkladoch je medzera alebo rozpor, ktorý predpoklad rieši.

export type Predpoklad = { id: string; text: string; otazka: string; zdroj: string; meniCenu?: boolean };

export const PREDPOKLADY: Predpoklad[] = [
  {
    id: "P1",
    text: "Odporúčanie porovnáva rozpočet bez DPH len s cenou miestnosti. Služby (technik, káva) pridáte v ďalšom kroku.",
    otazka: "Majú zákazníci uvádzať rozpočet s DPH, alebo bez DPH?",
    zdroj: "Vlastný návrh. Podklady odporúčanie nepožadujú.",
  },
  {
    id: "P2",
    text: "Odporúčame podľa jasných pravidiel: miestnosť sa zmestí, je v rozpočte a zostáva v nej čo najmenej voľných miest. Žiadna umelá inteligencia.",
    otazka: "",
    zdroj: "Vlastný návrh. Súvisí so situáciou 5.5 v zadaní (výber miestnosti cez AI vs. pravidlá).",
  },
  {
    id: "P3",
    text: "Miestnosť bez ceny v Cenníku 2027 si externí nemôžu rezervovať online. Zobrazí sa „cena na dopyt“.",
    otazka: "Doplní ekonomické oddelenie ceny pre ostatné miestnosti do februára?",
    zdroj: "data.xlsx › Cenník 2027: „Zatiaľ len pracoviská, ktoré poslali podklady, ostatné doplníme.“ Cena je len pre 11 z 37 miestností.",
  },
  {
    id: "P4",
    text: "Počet osôb nesmie byť vyšší ako kapacita. Kde kapacita chýba alebo nie je číslo, kontrolu nerobíme.",
    otazka: "Doplnia pracoviská chýbajúce kapacity?",
    zdroj: "data.xlsx › Miestnosti, stĺpec Kapacita: R-012 „?“, SC-V prázdne, SC-H „500 divákov“, SC-B „6 dráh“.",
  },
  {
    id: "P5",
    text: "Aulu Magna schvaľuje rektorát (Ing. Oravcová). Fakulta umení (doc. Lenártová) dostane informáciu, jej koncerty majú prednosť.",
    otazka: "Kto má pri Aule posledné slovo: rektorát alebo FU? Čo ak jeden neodpovie?",
    zdroj: "data.xlsx › Miestnosti, R-AULA: Schvaľuje „Ing. Oravcová, doc. Lenártová (FU)“, poznámka „koncerty FU majú prednosť“. Zápis z porady, bod 6 (Sedlák). Zadanie, situácia 5.7.",
  },
  {
    id: "P6",
    text: "Platia otváracie hodiny miestnosti, nie budovy (napr. Veľká čitáreň do 19:00, budova do 20:00).",
    otazka: "Sú hodiny v zozname konečné? Dá sa rezervovať aj mimo nich (napr. večerné akcie)?",
    zdroj: "data.xlsx › Poznámky ÚIT: „Otváracie hodiny sú z vrátnice budovy, miestnosti môžu mať iné.“ Miestnosti, UK-1: „08:00 až 19:00 (budova 08:00 až 20:00)“.",
  },
  {
    id: "P7",
    text: "Halu SC-H sa dá rezervovať len celú. Cena za polovicu haly v cenníku chýba.",
    otazka: "Koľko stojí polovica haly?",
    zdroj: "Cenník 2027, A. Miestnosti, SC-H: „polovica haly: cenu doplní ŠC“. Miestnosti, SC-H: „dá sa deliť na polovice“.",
  },
  {
    id: "P8",
    text: "Ceny rátame len podľa Cenníka 2027 (pracovná verzia zo 4. 11. 2026). Staré ceny z roku 2024 nepoužívame.",
    otazka: "Je Cenník 2027 už konečný? Kedy príde finálna verzia?",
    zdroj: "data.xlsx › Poznámky ÚIT: „Ceny sú z roku 2024, ekonomické oddelenie pripravuje nový cenník od 1/2027.“ Zápis z porady, bod 5 (Kováčová). Zadanie Časť 1, pravidlo 2.",
  },
  {
    id: "P9",
    text: "Začatý blok sa platí celý (zaokrúhľujeme nahor). Platí pre miestnosť aj pre technika.",
    otazka: "Ak rezervácia trvá 1,5 hodiny a blok je 60 min, platí sa 1,5 alebo 2 bloky?",
    zdroj: "data.xlsx › Cenník 2027, D. Výpočet: „paušál + počet blokov × cena za blok“. Nepíše, čo s neúplným blokom. Týka sa K1 (technik 6,5 h) aj K2 (hala 1,5 h).",
    meniCenu: true,
  },
  {
    id: "P10",
    text: "Rezervácia musí začať aj skončiť v otváracích hodinách miestnosti. Víkendy a sviatky zatiaľ nekontrolujeme.",
    otazka: "Ktoré miestnosti sú otvorené cez víkend a sviatky?",
    zdroj: "data.xlsx › Miestnosti, stĺpec Otváracie hodiny: len čas, žiadne dni v týždni.",
  },
  {
    id: "P11",
    text: "Technik „celý čas“ = rovnaký čas ako miestnosť. 9:00 až 15:30 = 6,5 h → 7 hodín.",
    otazka: "Platí sa technik aj za prípravu pred akciou?",
    zdroj: "Zadanie, K1: „Technik celý čas“. Cenník 2027, B. Služby, Technik: blok 60 min, „účtuje sa po hodinách“.",
    meniCenu: true,
  },
  {
    id: "P12",
    text: "Videokonferenčná sada: 17,50 € raz za rezerváciu. Cena za jednotku je v cenníku 0 €, preto počet blokov cenu nemení.",
    otazka: "„Za blok miestnosti“ s paušálom 17,50 € a jednotkou 0 €: je to 17,50 € raz, alebo 17,50 € za každý blok?",
    zdroj: "Cenník 2027, B. Služby, Videokonferenčná sada: Účtuje sa „za blok miestnosti“, Paušál 17,50 €, Cena za jednotku 0 €. Tieto údaje si protirečia.",
    meniCenu: true,
  },
  {
    id: "P13",
    text: "Počet porcií coffee breaku a obeda = počet osôb. Žiadateľ ho môže zmeniť.",
    otazka: "",
    zdroj: "Zadanie, K1: „coffee break pre všetkých 40 účastníkov“.",
  },
  {
    id: "P14",
    text: "Obed 9,90 € je cena s DPH 19 %. Základ a DPH dopočítame spätne zo súčtu.",
    otazka: "Fakturuje obed univerzita, alebo priamo dodávateľ?",
    zdroj: "Cenník 2027, B. Služby, Obed: „9,90 s DPH“, „cena od dodávateľa vrátane DPH“. Ostatné ceny sú bez DPH.",
  },
  {
    id: "P15",
    text: "Upratovanie nie je povinné. Zaráta sa, len ak ho žiadateľ vyberie.",
    otazka: "Je upratovanie po akcii povinné?",
    zdroj: "Cenník 2027, B. Služby, Upratovanie: „za rezerváciu“, 35 €. Nepíše, či je povinné. K1 ho nemá.",
  },
  {
    id: "P16",
    text: "V prototype nie je prihlásenie. Rolu si vyberiete sami. Externá firma vyplní svoje údaje do formulára.",
    otazka: "Majú mať externí účet, alebo stačí formulár s e-mailom?",
    zdroj: "Príloha 3, poznámka ÚIT: prihlásenie (SSO/IDM) dodá univerzita. Zadanie, TIP: „nemusí mať skutočné prihlásenie“. Pre externých podklady nič nehovoria.",
  },
  {
    id: "P17",
    text: "DPH počítame zo súčtu za každú sadzbu (23 % a 19 %) a zaokrúhľujeme na centy (0,5 centa nahor). Nepočítame DPH po riadkoch.",
    otazka: "Ako počíta DPH SAP: po riadkoch alebo zo súčtu? (Výsledok sa môže líšiť o pár centov.)",
    zdroj: "Cenník 2027: „Sadzba DPH 23 %, pri občerstvení a cateringu 19 %.“ Spôsob zaokrúhlenia neuvádza. Zadanie, situácia 5.2 (199,88 € vs. 199,94 €).",
    meniCenu: true,
  },
  {
    id: "P18",
    text: "Žiadosť schvaľuje osoba zo stĺpca „Schvaľuje“. Mená nemusia byť oficiálne.",
    otazka: "Kto je oficiálny schvaľovateľ za každé pracovisko a kto ho zastupuje?",
    zdroj: "data.xlsx › Poznámky ÚIT: „Schvaľovatelia: mená podľa toho, kto odpovedal na e-mail, nie vždy je to oficiálne.“",
  },
  {
    id: "P19",
    text: "Študentské spolky majú zľavu 50 % podľa cenníka. Riaditeľ ŠC povedal, že spolky neplatia vôbec. Kým to vedenie nerozhodne, platí cenník.",
    otazka: "Platia študentské spolky 50 %, alebo nič?",
    zdroj: "Rozpor: Cenník 2027, C. Zľavy: „Študentské spolky registrované na UH: zľava 50 %.“ × Zápis z porady, bod 4 (Baran): „študentské spolky nie [neplatia]“ × data.xlsx › Miestnosti, SC-H: „študentské spolky nie“.",
    meniCenu: true,
  },
  {
    id: "P20",
    text: "Zľava je z ceny miestnosti (paušál aj bloky), nie zo služieb.",
    otazka: "Platí zľava pre spolky aj na paušál a na služby?",
    zdroj: "Cenník 2027, C. Zľavy: pri zamestnancoch „z ceny miestnosti, nie zo služieb“. Pri spolkoch to nepíše.",
    meniCenu: true,
  },
  {
    id: "P21",
    text: "Pri opakovanej rezervácii (napr. 13 stried) sa paušál platí raz za celú sériu.",
    otazka: "Platí sa paušál raz za sériu, alebo za každý termín?",
    zdroj: "Cenník 2027, D. Výpočet: „Paušál sa platí raz za rezerváciu.“ Nepíše, či je séria jedna rezervácia. Zadanie, K2: 13 termínov.",
    meniCenu: true,
  },
  {
    id: "P22",
    text: "Ceny v Cenníku 2027 sú ceny pre externých. Zamestnanci (interní) dnes neplatia, cenník im dáva zľavu 30 %. Interné rezervácie sú v ďalšej fáze.",
    otazka: "Platia zamestnanci od 2027 so zľavou 30 %, alebo nič, ako doteraz?",
    zdroj: "Rozpor: data.xlsx › Poznámky ÚIT: „Interní (zamestnanci) neplatia.“ × Cenník 2027, C. Zľavy: „Zamestnanci UH: zľava 30 %.“ Miestnosti: stĺpec „Cena interní“ = 0.",
  },
  {
    id: "P23",
    text: "Streaming sa dá objednať len s technikom (tak píše cenník).",
    otazka: "",
    zdroj: "Cenník 2027, B. Služby, Živé vysielanie: „len s technikom“.",
  },
  {
    id: "P24",
    text: "Každý návštevník začína s 3 ukážkovými žiadosťami. Čo sám pridá alebo schváli, sa ukladá len v jeho prehliadači. Prototyp nemá databázu ani e-maily.",
    otazka: "",
    zdroj: "Zadanie, TIP: „Prototyp môže bežať na statických dátach z data.xlsx, nemusí mať … databázu.“",
  },
  {
    id: "P25",
    text: "Rezervovať môže len externý hosť. Schvaľovateľ a ekonomické oddelenie vidia len svoje stránky, ani cez adresu sa inam nedostanú.",
    otazka: "Majú si aj schvaľovatelia a ekonómovia vedieť rezervovať miestnosť za seba?",
    zdroj: "Zadanie, Časť 1, pravidlo 1: jedna cesta má fungovať celá. Rezervácie zamestnancov a študentov sú ďalšia fáza.",
  },
  {
    id: "P26",
    text: "Rezervovať sa dá od 1. 1. 2027, lebo ceny máme len na rok 2027.",
    otazka: "Majú sa v systéme dať rezervovať aj termíny v roku 2026?",
    zdroj: "data.xlsx › Cenník 2027: „Návrh cenníka … od 1. 1. 2027“.",
  },
  {
    id: "P27",
    text: "Žiadateľ môže zrušiť čakajúcu aj schválenú rezerváciu kedykoľvek, bez poplatku. Zamietnutú zrušiť nemusí.",
    otazka: "Platí sa storno poplatok, ak firma zruší schválenú rezerváciu krátko pred akciou? Do kedy sa dá rušiť zadarmo?",
    zdroj: "Príloha 3, Biznis proces: „Žiadateľ kedykoľvek môže zrušiť rezerváciu.“ Storno podmienky v cenníku chýbajú.",
  },
];

export function predpoklad(id: string) {
  const p = PREDPOKLADY.find((x) => x.id === id);
  if (!p) throw new Error(`Neznámy predpoklad ${id}`);
  return p;
}
