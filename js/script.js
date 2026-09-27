import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHeroSequence } from './hero-controller.js';
import { initBackgroundBeams } from './background-beams.js';
import { initCanvasText } from './canvas-text.js';
import { initInteractiveGlobe } from './globe.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Boedoxol Stacked Sticky Cards Scaling & Stacking Effect on Scroll
 */
function initStackedCards() {
  const cards = document.querySelectorAll('.works_sticky_container .works_item');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    if (index === cards.length - 1) return; // Last card stays flat

    const inner = card.querySelector('.works_item_inner') || card;
    const nextCard = cards[index + 1];

    gsap.to(inner, {
      scale: 0.94,
      filter: 'brightness(0.75)',
      transformOrigin: '50% 0%',
      ease: 'none',
      scrollTrigger: {
        trigger: nextCard,
        start: 'top 80%',
        end: 'top 10%',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}

// Safe execution helper
function safeExec() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Initialize Lenis smooth scroll engine (wirelessly synced with GSAP ScrollTrigger)
  initSmoothScroll();

  // Initialize Background Beams in hero area
  if (document.getElementById('background-beams')) {
    initBackgroundBeams();
  }

  // Initialize CanvasText sine-wave animated text
  initCanvasText();

  // Initialize 3D Interactive World Globe
  if (document.getElementById('globe-canvas-container')) {
    initInteractiveGlobe('globe-canvas-container');
  }

  // Initialize Boedoxol Stacked Sticky Cards Effect
  initStackedCards();

  try {
    if (typeof window.runLoader === 'function') {
      window.runLoader().then(() => {
        try { if (typeof window.BdxInitPageAfter === 'function') window.BdxInitPageAfter(); } catch(e) {}
        ScrollTrigger.refresh();
      }).catch(() => {
        ScrollTrigger.refresh();
      });
    } else if (typeof window.BdxInitPageAfter === 'function') {
      window.BdxInitPageAfter();
    }
  } catch(e) {
    console.warn('[Stalwart] Loader skipped:', e);
  }

  try {
    if (typeof window.BdxInitPageBefore === 'function') {
      window.BdxInitPageBefore();
    }
  } catch(e) {}

  // Initialize 3-stage GSAP Hero sequence if present
  if (document.getElementById('hero-viewport')) {
    initHeroSequence();
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeExec);
} else {
  safeExec();
}
