import Link from "next/link";

export default function NenajdenaStranka() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-950 to-blue-800 px-6 text-center text-white">
      <div className="text-8xl font-bold text-white/20">404</div>
      <h1 className="mt-2 text-3xl font-bold">Túto stránku sme nenašli</h1>
      <p className="mt-3 max-w-md text-blue-100">
        Možno je to časť, ktorá príde až v ďalšej fáze. Alebo sa v adrese stala chyba.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded bg-white px-5 py-2.5 font-semibold text-blue-900 hover:bg-blue-50">
          Na úvod
        </Link>
        <Link href="/miestnosti" className="rounded border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10">
          Nájsť miestnosť
        </Link>
        <Link href="/dalsia-faza" className="rounded border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10">
          Ďalšia fáza
        </Link>
      </div>
    </div>
  );
}
