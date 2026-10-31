"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// Plynulé posúvanie stránky (Lenis)
export function PlynulyScroll() {
  useEffect(() => {
    // Prístupnosť: bez plynulého posúvania, ak to používateľ v systéme vypol
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
