// Vysvetlivky pre autora prototypu: prečo je čo tak a kde to je v zadaní.
// Ukazujú sa len pri `npm run dev`. Na zverejnenom webe ich klient nevidí.

export const JE_VYVOJ = process.env.NODE_ENV === "development";

export function PreAutora({ children }: { children: React.ReactNode }) {
  if (!JE_VYVOJ) return null;
  return (
    <details className="no-print my-3 rounded border border-violet-300 bg-violet-50 text-sm text-violet-950">
      <summary className="cursor-pointer px-3 py-1.5 font-semibold text-violet-800">Pre autora: prečo je to takto</summary>
      <div className="space-y-2 px-3 pb-3">{children}</div>
    </details>
  );
}
