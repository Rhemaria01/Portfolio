import type Lenis from "lenis";

type LenisWindow = Window & { __lenis?: Lenis };

export function getLenis() {
  return typeof window === "undefined" ? undefined : (window as LenisWindow).__lenis;
}

export function setLenis(lenis: Lenis | undefined) {
  (window as LenisWindow).__lenis = lenis;
}

export function travelTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset: id === "launch" ? 0 : -40 });
  else el.scrollIntoView({ behavior: "smooth" });
}

// The starfield listens for this to jump to hyperspace for a moment.
export function warp(ms = 1400) {
  window.dispatchEvent(new CustomEvent("rh:warp", { detail: ms }));
}
