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
      filter: 'brightness(0.85)',
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

  // Initialize Rich GSAP Page Animations on Inner Pages
  initPageAnimations();

  // Initialize Mobile Navigation Toggle
  initMobileNav();

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

/**
 * GSAP ScrollTrigger Animations across all website pages
 */
function initPageAnimations() {
  // Heading & Subtitle Reveals
  const revealHeadings = document.querySelectorAll('.page-reveal-heading');
  revealHeadings.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Staggered Cards Reveal (Cards, Features, Grids)
  const staggerContainers = document.querySelectorAll('[data-stagger-cards]');
  staggerContainers.forEach((container) => {
    const items = container.querySelectorAll('.stagger-card-item');
    if (items.length) {
      gsap.fromTo(items,
        { opacity: 0, y: 45, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });

  // Smooth Reveal for Colored Photographic Elements
  const revealImages = document.querySelectorAll('.page-reveal-img');
  revealImages.forEach((img) => {
    gsap.fromTo(img,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: img,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Smooth Counter Animation for Metrics Section
  const counters = document.querySelectorAll('.stats_counter');
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-target')) || 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        counter.textContent = Math.floor(obj.val);
      }
    });
  });
}

/**
 * Mobile Navigation Menu Handler
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.querySelector('.mobile_menu');
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileMenu.style.display === 'block';
    if (isOpen) {
      mobileMenu.style.display = 'none';
      mobileMenu.style.opacity = '0';
    } else {
      mobileMenu.style.display = 'block';
      mobileMenu.style.opacity = '1';
    }
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.style.display = 'none';
      mobileMenu.style.opacity = '0';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeExec);
} else {
  safeExec();
}
