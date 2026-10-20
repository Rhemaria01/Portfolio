"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/scroll";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4), autoRaf: true });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(undefined);
    };
  }, []);
  return null;
}
