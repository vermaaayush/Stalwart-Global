/* ============================================================
   STALWART GROUP — HERO ANIMATION MASTER ENTRY POINT
   Cinematic scroll-driven hero sequence:
   STAGE 01: Initial Load (Giant centered main_lion.png)
   STAGE 02: First Scroll (Logo zooms out -> STALWART GROUP reveal)
   STAGE 03: Second Scroll (Logo moves right -> Hero text left -> Transparent nav)
   ============================================================ */

// ── Core CSS Imports ─────────────────────────────────────────
import '../css/reset.css';
import '../css/tokens.css';
import '../css/hero-sequence.css';
import 'lenis/dist/lenis.css';

// ── JavaScript Imports ───────────────────────────────────────
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHeroSequence } from './hero-experience.js';

gsap.registerPlugin(ScrollTrigger);

// ── Application Bootstrapping ────────────────────────────────
function init() {
  console.log('⚡ [Stalwart Group] Bootstrapping Cinematic Hero Experience...');

  // Ensure scroll is at the top on initial load/refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Initialize smooth scroll engine
  const lenis = initSmoothScroll();

  // Initialize the 3-stage ScrollTrigger timeline
  initHeroSequence();

  // Expose global object for debugging
  window.stalwart = {
    lenis,
    gsap,
    ScrollTrigger,
  };

  console.log('✨ [Stalwart Group] Hero Experience Ready.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
