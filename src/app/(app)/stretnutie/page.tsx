import Link from "next/link";

const OTAZKY = [
  {
    otazka: "Kedy nám viete poslať finálny zoznam miestností, cien a schvaľovateľov?",
    dovod: "Teraz máme neúplný zoznam. Bez správnych údajov nevieme spoľahlivo nastaviť rezervácie, ukázať správnu cenu ani určiť, komu žiadosť príde.",
    doplnenie: "Kto u vás tieto údaje potvrdí a dokedy ich vieme dostať? V ponuke sme uviedli, že otvorené rozhodnutia potrebujeme uzavrieť do 4. decembra.",
  },
  {
    otazka: "Ako má systém rátať DPH, aby suma sedela s podkladom pre faktúru?",
    dovod: "Pri K1 vyjde 199,88 €, ak najprv spočítame cenu bez DPH a potom vypočítame DPH. Ak zaokrúhlenú cenu 15,38 € s DPH vynásobíme 13 blokmi, vyjde 199,94 €. Ekonomické oddelenie musí potvrdiť, ktorý postup použiť.",
    doplnenie: "Má systém počítať DPH zo súčtu cien bez DPH, alebo zaokrúhľovať každú položku či blok zvlášť? Ktorá suma má byť na podklade pre faktúru?",
  },
  {
    otazka: "V ktorej fáze máme pripraviť verejné stránky akcií Fakulty umení?",
    dovod: "Na porade 4. novembra pán Hudák navrhol odložiť akcie a verejné stránky na ďalšiu fázu. Pani Lenártová namietala, že bez nich Fakulta umení systém nepoužije. Akcie fakulty bývajú viacdňové a môžu využívať viac priestorov naraz.",
    doplnenie: "Majú byť v prvej verzii stránka s programom, registrácia a kontakt na organizátora, alebo ich môžeme zaradiť neskôr?",
  },
  {
    otazka: "Majú študentské spolky platiť 50 % ceny alebo rezervovať priestory zadarmo?",
    dovod: "Na porade 4. novembra to povedal Ing. Martin Baran, riaditeľ Športového centra. Cenník však uvádza 50 % zľavu. Pri K2 tento rozdiel mení výslednú cenu.",
    doplnenie: "Ktoré pravidlo platí a vzťahuje sa na cenu miestnosti aj na paušál?",
  },
  {
    otazka: "Ako sa má zadať a účtovať rezervácia na každý týždeň počas semestra?",
    dovod: "Športové centrum potrebuje napríklad rezervovať halu každý týždeň v rovnakom čase. K2 ukazuje cenu 13 termínov, ale formulár na zadanie celej série ešte v prototype nie je.",
    doplnenie: "Čo sa má stať počas sviatkov alebo pri zrušenom tréningu? Pri 90-minútovom tréningu a 60-minútových blokoch sa majú účtovať dva bloky za každý termín?",
  },
];

const OTAZKY_KOMISIE = [
  {
    otazka: "Prečo ste pripravili len jednu úplnú cestu?",
    odpoved: "Chcel som overiť celý proces od žiadosti po podklad pre faktúru. Ostatné požiadavky som označil ako ďalšiu fázu, aby sme si najprv potvrdili základný postup.",
  },
  {
    otazka: "Je už hotové prihlásenie, e-mail a kontrola obsadenosti?",
    odpoved: "Nie. Toto je klikací prototyp. Tieto časti patria do vývoja prvej verzie a treba ich potvrdiť s vaším tímom.",
  },
  {
    otazka: "Prečo je cena v ponuke v rozpätí?",
    odpoved: "Odhad je 170 až 283 hodín, pri sadzbe 75 € za hodinu bez DPH. Rozpätie vychádza z otvorených pravidiel a napojení. Po analýze ich spresníme.",
  },
  {
    otazka: "Stihne sa spustenie do 8. februára?",
    odpoved: "Plán počíta s testovaním od 18. januára a spustením 8. februára. Závisí to od včasných prístupov, rozhodnutí a spätnej väzby. Ak sa niečo oneskorí, ukážem vplyv na rozsah alebo termín.",
  },
  {
    otazka: "Prečo K2 stojí 885,60 € s DPH, keď športové centrum hovorilo o bezplatnej rezervácii?",
    odpoved: "Základný výpočet používa 50 % zľavu z cenníka. Ak univerzita potvrdí rezerváciu zadarmo, zmeníme pravidlo a výpočet. V prototype sa dá tento variant ukázať.",
  },
  {
    otazka: "Ako sú chránené údaje?",
    odpoved: "Prototyp neobsahuje skutočné prihlásenie ani databázu; údaje ukladá iba v prehliadači. Pre hotový systém treba dohodnúť prístupové práva a pravidlá univerzity. Nebudem tvrdiť, že prototyp už tieto ochrany má.",
  },
];

export default function Stretnutie() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Príprava na ďalšie kolo</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Stretnutie s klientom</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Cieľ: ukázať jednu úplnú cestu, zistiť chýbajúce rozhodnutia a potvrdiť rozsah prvej verzie.
          Pýtaj sa pokojne a odpovede si zapisuj.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-bold">Päť hlavných otázok</h2>
        <div className="mt-3 grid gap-3">
          {OTAZKY.map((p, i) => (
            <article key={p.otazka} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-900">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-slate-950">{p.otazka}</h3>
                  <p className="mt-2 text-sm text-slate-700"><strong>Prečo sa pýtam:</strong> {p.dovod}</p>
                  <p className="mt-2 text-sm text-blue-900"><strong>Doplňujúca otázka:</strong> {p.doplnenie}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
