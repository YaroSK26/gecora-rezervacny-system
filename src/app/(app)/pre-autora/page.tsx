import Link from "next/link";
import { notFound } from "next/navigation";
import { JE_VYVOJ } from "@/components/PreAutora";
import { PREDPOKLADY } from "@/data/predpoklady";
import { eur, K1, K2, PREDVOLENE_VOLBY, vypocitaj, type Volby } from "@/lib/vypocet";

// Interná stránka pre autora prototypu. Na zverejnenom webe (production) vráti 404.

function Sekcia({ id, nadpis, children }: { id: string; nadpis: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-lg border border-violet-200 bg-white p-5">
      <h2 className="text-xl font-bold text-violet-900">{nadpis}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Tab({ hlavicka, riadky }: { hlavicka: string[]; riadky: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="tabular w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            {hlavicka.map((h) => (
              <th key={h} className="px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {riadky.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 align-top">
              {r.map((b, j) => (
                <td key={j} className="px-3 py-2">
                  {b}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Cit = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-slate-100 px-1 italic text-slate-700">„{children}“</span>
);

export default function PreAutoraStranka() {
  if (!JE_VYVOJ) notFound();

  const k1 = vypocitaj(K1);
  const k2 = vypocitaj(K2);
  // DPH po riadkoch (iný spôsob, P6): každý riadok zaokrúhlime zvlášť
  const k1PoRiadkoch23 = k1.riadky.filter((r) => r.sadzba === 23).reduce((s, r) => s + Math.round((r.zaklad * 23) / 100), 0);

  const varianty: [string, Partial<Volby>][] = [
    ["Náš predpoklad (50 %, paušál raz, 2 bloky)", {}],
    ["Spolky neplatia (Baran)", { spolok: "zadarmo" }],
    ["Paušál za každý termín", { pausal: "zaTermin" }],
    ["Bloky pomerne (1,5 bloku)", { bloky: "presne" }],
    ["Paušál za termín + bloky pomerne", { pausal: "zaTermin", bloky: "presne" }],
  ];
  const variantyK1: [string, Partial<Volby>][] = [
    ["Náš predpoklad (technik 7 h, videosada raz)", {}],
    ["Technik presne 6,5 h", { bloky: "presne" }],
    ["Videosada za každý blok (13 ×)", { videosada: "zaBlok" }],
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="w-fit rounded bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">len pre teba · na zverejnenom webe sa neukáže</div>
        <h1 className="mt-2 text-3xl font-bold">Pre autora: čo, prečo a kde v zadaní</h1>
        <p className="mt-1 text-slate-600">
          Tu je všetko, čo potrebuješ vedieť, aby si vedel prototyp vysvetliť vlastnými slovami. Na porade sa budú pýtať na
          tvoje čísla a vety (Zadanie, časť 6).
        </p>
        <nav className="mt-3 flex flex-wrap gap-2 text-sm">
          {[
            ["uloha", "1. Čo je úloha"],
            ["pravidla", "2. Pravidlá → kde na webe"],
            ["odpovede", "3. Čo napísať do 1.1 až 1.4"],
            ["k1", "4. Výpočet K1"],
            ["k2", "5. Výpočet K2"],
            ["dph", "6. Pasca s DPH"],
            ["porada", "7. Ľudia z porady"],
            ["demo", "8. Scenár na poradu"],
            ["kod", "9. Kde je čo v kóde"],
          ].map(([id, t]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-violet-800 hover:bg-violet-100">
              {t}
            </a>
          ))}
        </nav>
      </div>

      <Sekcia id="uloha" nadpis="1. Čo je úloha (Časť 1, 18 bodov)">
        <p>
          Máš urobiť <strong>klikaciu ukážku</strong>, nie hotový systém. Ukážeš ju vedeniu UH na porade 23. 11. 2026.
          Zadanie hovorí: <Cit>Radšej jedna správne zvolená cesta, ktorá funguje, než päť obrazoviek, ktoré nikam nevedú.</Cit>
        </p>
        <p>
          <strong>Naša cesta:</strong> externá firma nájde sálu → vidí cenu → pošle žiadosť → schvaľovateľ schváli →
          ekonómka dostane podklad pre faktúru. Je to presne príklad zo zadania: <Cit>externá firma rezervuje a dostane podklad pre faktúru</Cit>.
        </p>
        <p>
          <strong>Prečo táto cesta:</strong> zadanie chce cestu, ktorá <Cit>preverí najväčšiu neistotu v podkladoch</Cit>.
          Najviac neistôt je v cenníku (bloky, videosada, DPH, zľavy) a cenu má len externá rezervácia. Zamestnanci dnes
          neplatia (data.xlsx, Poznámky ÚIT), ich cesta by cenu neukázala.
        </p>
      </Sekcia>

      <Sekcia id="pravidla" nadpis="2. Štyri pravidlá zadania a kde ich spĺňame">
        <Tab
          hlavicka={["Pravidlo", "Čo presne chcú", "Kde na webe"]}
          riadky={[
            [
              "1. Jedna cesta",
              <Cit key="c">Ostatné role a funkcie nemusia fungovať, ale mali by byť v prototype viditeľné</Cit>,
              <>Kroky 1 až 5 fungujú. Ostatné role sú v Prihlásení a v prepínači roly (sivé „ďalšia fáza“). Stránka <Link className="text-violet-700 underline" href="/dalsia-faza">Ďalšia fáza</Link>.</>,
            ],
            [
              "2. Dáta klienta",
              <Cit key="c">Pracoviská, budovy a miestnosti vrátane kapacít a schvaľovateľov … ceny … zo záložky Cenník 2027</Cit>,
              <>Miestnosti: <code>src/data/miestnosti.json</code> (vytiahnuté z Excelu skriptom, nič ručne). Ceny: <code>src/data/cennik.ts</code>.</>,
            ],
            [
              "3. Predpoklady na obrazovke",
              <Cit key="c">napr. ako tooltips … Klient má vidieť, kde čakáte jeho rozhodnutie</Cit>,
              <>Žlté rámčeky a značky P1 až P25. Myšou nad nimi uvidíš zdroj a otázku. Zoznam: <Link className="text-violet-700 underline" href="/predpoklady">Predpoklady</Link>.</>,
            ],
            [
              "4. Kalkulácia ceny",
              <Cit key="c">z čoho sa cena skladá a koľko je spolu bez DPH, DPH a spolu s DPH … na cent</Cit>,
              <>V rezervácii (krok 2), u schvaľovateľa (krok 4), v podklade (krok 5) a na <Link className="text-violet-700 underline" href="/kalkulacie">Kalkulácii K1 a K2</Link>.</>,
            ],
          ]}
        />
      </Sekcia>

      <Sekcia id="odpovede" nadpis="3. Čo napísať do dokumentu (body 1.1 až 1.4)">
        <p className="rounded bg-amber-50 p-2 text-amber-900">
          Toto sú <strong>návrhy</strong>. Prepíš ich vlastnými slovami. Za každú vetu ručíš ty (Zadanie, pravidlá).
        </p>
        <h3 className="font-semibold">1.1 Odkaz na prototyp</h3>
        <p>Verejný odkaz po zverejnení (napr. Vercel). Musí sa otvoriť bez inštalácie a bežať až do konca výberu.</p>

        <h3 className="font-semibold">1.2 Cesta a prečo (max 6 viet)</h3>
        <p className="rounded border border-slate-200 bg-slate-50 p-3">
          Vybral som cestu externej firmy: nájde sálu, vidí cenu, pošle žiadosť, schvaľovateľ ju schváli a ekonomické
          oddelenie dostane podklad pre faktúru. Cesta prejde cez tri role naraz, takže vedenie uvidí, že jeden systém
          nahradí e-maily, Excel aj ručné počítanie cien. Zároveň preverí najväčšiu neistotu v podkladoch: Cenník 2027 je
          pracovná verzia a na viacerých miestach nie je jasný. Chyba v cene by bola pre univerzitu najdrahšia. Rezervácia
          zamestnanca by cenu neukázala, lebo zamestnanci dnes neplatia. Opakované rezervácie a akcie FU závisia od
          rozhodnutí, ktoré vedenie ešte neurobilo.
        </p>

        <h3 className="font-semibold">1.3 Čo som vynechal (1 veta na položku)</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Prihlásenie školským účtom: dodá ho univerzita (Príloha 3, ÚIT).</li>
          <li>E-maily a kalendár: poštový server je len vo vnútornej sieti, v ukážke netreba (Príloha 3, ÚIT).</li>
          <li>Opakované rezervácie vo formulári: počítam len ich cenu (K2), formulár príde v ďalšej fáze.</li>
          <li>Akcie a verejné stránky FU: vedenie ešte nerozhodlo, či patria do prvej fázy (zápis z porady, bod 3).</li>
          <li>Kontrola obsadenosti miestnosti: nemáme dáta o existujúcich rezerváciách.</li>
          <li>Prepojenie so SAP: faktúry rieši ekonomické oddelenie samo, chce len podklad (zápis, bod 5).</li>
          <li>Bazén po dráhach a coworking po miestach: iný spôsob rezervácie, ďalšia fáza.</li>
          <li>Databáza: zadanie ju nevyžaduje (TIP), dáta sú len v prehliadači.</li>
        </ul>

        <h3 className="font-semibold">1.4 Výpočet K1 a K2</h3>
        <p>
          Screenshot stránky <Link className="text-violet-700 underline" href="/kalkulacie">Kalkulácia K1 a K2</Link> s
          predvolenými prepínačmi. K1 = <strong>{eur(k1.spoluSDph)}</strong>, K2 = <strong>{eur(k2.spoluSDph)}</strong>. Pod
          screenshot napíš predpoklady P3, P4, P5, P6, P8, P9, P10.
        </p>
      </Sekcia>

      <Sekcia id="k1" nadpis={`4. Výpočet K1 krok za krokom: ${eur(k1.spoluSDph)}`}>
        <p>
          <strong>Zadanie:</strong> externá firma, IPH-K1 Konferenčná sála N1, piatok 12. 3. 2027, 9:00 až 15:30, 40 osôb,
          technik celý čas, videokonferenčná sada, coffee break pre 40.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Čas:</strong> 9:00 až 15:30 = 6 h 30 min = <strong>390 minút</strong>.
          </li>
          <li>
            <strong>Sála:</strong> Cenník A, riadok IPH-K1: paušál 20 €, blok 30 min za 12,50 €. 390 / 30 = 13 blokov (vyjde
            presne). 13 × 12,50 = <strong>162,50 €</strong>. Plus paušál <strong>20,00 €</strong>.
          </li>
          <li>
            <strong>Technik:</strong> Cenník B: vlastný blok 60 min, 25 €. 390 / 60 = 6,5 → <strong>7 hodín</strong> (P3:
            začatý blok sa platí celý). 7 × 25 = <strong>175,00 €</strong>.
          </li>
          <li>
            <strong>Videosada:</strong> Cenník B: „za blok miestnosti“, paušál 17,50 €, za jednotku 0 €. Paušál 17,50 + 13
            blokov × 0 = <strong>17,50 €</strong> (P5).
          </li>
          <li>
            <strong>Coffee break:</strong> Cenník B: za osobu 4,20 €, DPH <strong>19 %</strong>. 40 × 4,20 ={" "}
            <strong>168,00 €</strong>.
          </li>
          <li>
            <strong>DPH 23 %:</strong> 20 + 162,50 + 175 + 17,50 = 375,00 € → 375 × 0,23 = <strong>86,25 €</strong>.
          </li>
          <li>
            <strong>DPH 19 %:</strong> 168,00 × 0,19 = <strong>31,92 €</strong>.
          </li>
          <li>
            <strong>Spolu:</strong> bez DPH 375 + 168 = <strong>543,00 €</strong>, DPH 86,25 + 31,92 ={" "}
            <strong>118,17 €</strong>, s DPH <strong>{eur(k1.spoluSDph)}</strong>.
          </li>
        </ol>
        <h3 className="font-semibold">Čo ak cenník znamená niečo iné</h3>
        <Tab
          hlavicka={["Variant", "Bez DPH", "DPH", "S DPH"]}
          riadky={variantyK1.map(([n, v]) => {
            const k = vypocitaj(K1, { ...PREDVOLENE_VOLBY, ...v });
            return [n, eur(k.spoluZaklad), eur(k.spoluDph), <strong key="s">{eur(k.spoluSDph)}</strong>];
          })}
        />
      </Sekcia>

      <Sekcia id="k2" nadpis={`5. Výpočet K2 krok za krokom: ${eur(k2.spoluSDph)}`}>
        <p>
          <strong>Zadanie:</strong> študentský florbalový klub UH (registrovaný spolok), SC-H Športová hala celá, každú
          stredu 18:00 až 19:30, od 17. 2. do 12. 5. 2027 = 13 termínov, 20 osôb, bez služieb.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Čas:</strong> 18:00 až 19:30 = <strong>90 minút</strong> za termín.
          </li>
          <li>
            <strong>Bloky:</strong> Cenník A, SC-H: blok 60 min za 55 €. 90 / 60 = 1,5 → <strong>2 bloky</strong> (P3).
          </li>
          <li>
            <strong>Prenájom:</strong> 13 termínov × 2 bloky × 55 € = <strong>1 430,00 €</strong>.
          </li>
          <li>
            <strong>Paušál:</strong> 10 € <strong>raz</strong> za celú sériu (P8; Cenník D: „Paušál sa platí raz za
            rezerváciu“) = <strong>10,00 €</strong>.
          </li>
          <li>
            <strong>Zľava:</strong> Cenník C: spolky 50 %. Z ceny miestnosti (P10): 50 % z 1 440 € ={" "}
            <strong>−720,00 €</strong>.
          </li>
          <li>
            <strong>DPH 23 %:</strong> 720,00 × 0,23 = <strong>165,60 €</strong>.
          </li>
          <li>
            <strong>Spolu:</strong> bez DPH <strong>720,00 €</strong>, DPH <strong>165,60 €</strong>, s DPH{" "}
            <strong>{eur(k2.spoluSDph)}</strong>.
          </li>
        </ol>
        <p className="rounded bg-amber-50 p-2 text-amber-900">
          <strong>Najväčší rozpor v celom zadaní:</strong> cenník hovorí 50 % zľava, riaditeľ ŠC Baran na porade povedal, že
          spolky neplatia vôbec. Nerozhodli sme za klienta, len sme vybrali písomný cenník a rozpor ukázali. Toto je dobrá
          otázka do e-mailu (2.1).
        </p>
        <h3 className="font-semibold">Všetky varianty K2</h3>
        <Tab
          hlavicka={["Variant", "Bez DPH", "DPH", "S DPH"]}
          riadky={varianty.map(([n, v]) => {
            const k = vypocitaj(K2, { ...PREDVOLENE_VOLBY, ...v });
            return [n, eur(k.spoluZaklad), eur(k.spoluDph), <strong key="s">{eur(k.spoluSDph)}</strong>];
          })}
        />
      </Sekcia>

      <Sekcia id="dph" nadpis="6. Pasca s DPH (súvisí so situáciou 5.2)">
        <p>DPH sa dá počítať dvoma spôsobmi. Pri K1 vyjde rozdiel 1 cent:</p>
        <Tab
          hlavicka={["Spôsob", "DPH 23 % pri K1"]}
          riadky={[
            ["Zo súčtu (náš): 375,00 × 0,23", <strong key="a">86,25 €</strong>],
            [
              "Po riadkoch: 4,60 + 37,38 + 40,25 + 4,03",
              <strong key="b">{eur(k1PoRiadkoch23)}</strong>,
            ],
          ]}
        />
        <p>
          Pri riadku 162,50 × 0,23 = 37,375 sa zaokrúhli na 37,38 a pri 17,50 × 0,23 = 4,025 na 4,03. Tak vzniknú centy
          navyše. V situácii 5.2 (199,88 € vs. 199,94 €) ide o ten istý jav. Správne je to, čo robí SAP ekonomického
          oddelenia, preto je to otázka pre klienta (P6).
        </p>
      </Sekcia>

      <Sekcia id="porada" nadpis="7. Ľudia z porady: čo chcú a čo sme spravili">
        <Tab
          hlavicka={["Kto (bod zápisu)", "Čo chce", "Čo sme spravili", "Prečo"]}
          riadky={[
            ["Hudák (1)", "Jeden systém pre všetky pracoviská, rezervácie so schvaľovaním", "Všetky miestnosti v jednom zozname, schvaľovanie", "Je to hlavný cieľ 1. fázy."],
            ["Lenártová (2, 3)", "Verejné stránky akcií, registrácia, program", "Len „ďalšia fáza“ a otvorená otázka", "Hudák to chce neskôr, nerozhodli. Nerozhodujeme za klienta."],
            ["Baran (4)", "Rezervácie na celý semester, spolky neplatia", "Cena série v K2, formulár neskôr, rozpor P9", "K2 je presne jeho prípad."],
            ["Kováčová (5)", "Podklad s rozpisom DPH, nový cenník", "Podklad pre faktúru, len Cenník 2027", "Je to koniec našej cesty."],
            ["Sedlák (6)", "Každý schvaľuje svoje, Aula nejasná", "Schvaľovateľ zo stĺpca Schvaľuje, Aula P13", "Súvisí so situáciou 5.7."],
          ]}
        />
      </Sekcia>

      <Sekcia id="demo" nadpis="8. Scenár na poradu (časť 6, 10 minút ukážky)">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Úvod → Prihlásiť sa → ukáž všetky role, povedz, ktoré fungujú a prečo.</li>
          <li>Externý hosť → Nájsť miestnosť → 40 ľudí, 6,5 h, 250 € → odporúčanie.</li>
          <li>Pozrieť všetky miestnosti → klikni IPH-K1 → Rezervovať (alebo „Rovno vyplniť K1“).</li>
          <li>Vyplň služby K1, ukáž cenu, ukáž žlté predpoklady. Odošli.</li>
          <li>Prepni rolu na Schvaľovateľa → schváľ.</li>
          <li>Prepni rolu na Ekonomické oddelenie → podklad pre faktúru.</li>
          <li>Kalkulácia K1 a K2 → prepni „Študentský spolok“ → ukáž rozdiel → spýtaj sa, čo platí.</li>
        </ol>
        <p>
          <strong>Zmena naživo (5 min, po anglicky):</strong> väčšina zmien bude v <code>src/data/predpoklady.ts</code>,{" "}
          <code>src/data/cennik.ts</code> alebo <code>src/lib/vypocet.ts</code>.
        </p>
      </Sekcia>

      <Sekcia id="kod" nadpis="9. Kde je čo v kóde">
        <Tab
          hlavicka={["Súbor", "Čo v ňom je"]}
          riadky={[
            [<code key="a">src/data/miestnosti.json</code>, "37 miestností z Excelu, záložka Miestnosti"],
            [<code key="a">src/data/cennik.ts</code>, "Cenník 2027: ceny miestností, služby, zľavy (v centoch)"],
            [<code key="a">src/data/predpoklady.ts</code>, `Všetkých ${PREDPOKLADY.length} predpokladov so zdrojom a otázkou`],
            [<code key="a">src/data/roly.ts</code>, "Role a ich menu"],
            [<code key="a">src/lib/vypocet.ts</code>, "Výpočet ceny, kontroly formulára, K1 a K2"],
            [<code key="a">src/lib/odporucanie.ts</code>, "Pravidlá odporúčania miestnosti"],
            [<code key="a">src/lib/store.ts</code>, "Ukladanie žiadostí a roly v prehliadači"],
            [<code key="a">src/components/PreAutora.tsx</code>, "Fialové rámčeky. Len pri npm run dev."],
          ]}
        />
        <p>
          Prečo centy: 0,1 + 0,2 v počítači nie je presne 0,3. Celé čísla (centy) sa sčítajú vždy presne. Tak sedí výsledok na
          cent (pravidlo 4).
        </p>
      </Sekcia>
    </div>
  );
}
