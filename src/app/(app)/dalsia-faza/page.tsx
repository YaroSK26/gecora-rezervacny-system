const CASTI = [
  {
    id: "zamestnanci",
    nazov: "Rezervácie zamestnancov a študentov",
    kto: "Ing. Hudák, všetky pracoviská",
    text: "Zamestnanci a študenti si rezervujú miestnosti po prihlásení školským účtom. Cena pre nich: zatiaľ nie je jasné, či platia (pozri P22).",
  },
  {
    id: "opakovane",
    nazov: "Opakované rezervácie (športové centrum)",
    kto: "Ing. Baran",
    text: "Jedna žiadosť na celý semester, napr. každú stredu 18:00 až 19:30. Jedno schválenie pre celú sériu, zrušenie jedného termínu. Výpočet ceny série už funguje: pozri Kalkuláciu K2.",
  },
  {
    id: "akcie",
    nazov: "Akcie a verejné stránky (Fakulta umení)",
    kto: "doc. Lenártová",
    text: "Akcia na viac dní a vo viacerých priestoroch naraz (napr. festival v máji: Koncertná sála, Galéria, Aula). Verejná stránka s programom, registráciou účastníkov a kontaktom. Otvorené: vedenie ešte nerozhodlo, či to bude v prvej fáze.",
  },
  {
    id: "prihlasenie",
    nazov: "Prihlásenie školským účtom",
    kto: "ÚIT",
    text: "Prihlásenie cez jednotný školský účet (SSO/IDM). Napojenie dodá univerzita.",
  },
  {
    id: "emaily",
    nazov: "E-maily a kalendár",
    kto: "ÚIT",
    text: "Potvrdenia a pripomienky e-mailom cez poštový server univerzity (je len vo vnútornej sieti). Export rezervácie do kalendára. Záznam o tom, kto čo zmenil.",
  },
  {
    id: "sprava",
    nazov: "Správa miestností a cenníka",
    kto: "pracoviská, ekonomické oddelenie",
    text: "Pracovisko si samo upraví miestnosti, otváracie hodiny a schvaľovateľov. Ekonomické oddelenie upraví cenník bez programátora.",
  },
];

export default function DalsiaFaza() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Ďalšia fáza</h1>
      <p className="mt-1 text-sm text-slate-600">
        Tieto časti v prototype nefungujú. Ukazujeme ich, aby bolo vidieť, kam systém smeruje.
      </p>
      <div className="mt-4 space-y-3">
        {CASTI.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-6 rounded border border-dashed border-slate-300 bg-white p-4">
            <h2 className="font-semibold">{c.nazov}</h2>
            <div className="text-xs text-slate-500">Požaduje: {c.kto}</div>
            <p className="mt-1 text-sm">{c.text}</p>
          </section>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Mimo nášho systému (rieši univerzita): vystavenie faktúr v SAP, reporty, Power BI, exporty.
      </p>
    </div>
  );
}
