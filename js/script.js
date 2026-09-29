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
 * Mobile Navigation Side Drawer Handler
 */
function initMobileNav() {
  const toggleBtns = document.querySelectorAll('#mobile-toggle, .mobile_menu_toggle');
  let mobileMenu = document.querySelector('.mobile_menu');

  if (!mobileMenu) return;

  // Auto-populate mobile_menu if empty
  if (!mobileMenu.querySelector('a')) {
    mobileMenu.innerHTML = `
      <ul class="mobile_menu_nav list-unstyled mb-0">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li class="has_child">
          <a href="#">Our Companies</a>
          <ul class="child_menu">
            <li><a href="stalwart-global.html">Stalwart Global</a></li>
            <li><a href="stalwart-resources.html">Stalwart Resources</a></li>
            <li><a href="stalwart-life-sciences.html">Stalwart Life Sciences</a></li>
            <li><a href="indian-tadka.html">Indian Tadka</a></li>
          </ul>
        </li>
        <li class="has_child">
          <a href="#">Capabilities</a>
          <ul class="child_menu">
            <li><a href="capabilities.html#sourcing">Global Sourcing</a></li>
            <li><a href="capabilities.html#trade">International Trade</a></li>
            <li><a href="capabilities.html#supply-chain">Supply Chain</a></li>
            <li><a href="capabilities.html#logistics">Logistics Coordination</a></li>
            <li><a href="capabilities.html#distribution">Wholesale & Distribution</a></li>
            <li><a href="capabilities.html#hospitality">Hospitality Operations</a></li>
            <li><a href="capabilities.html#market-dev">Market Development</a></li>
          </ul>
        </li>
        <li><a href="global-presence.html">Global Presence</a></li>
        <li><a href="partner.html">Partner With Us</a></li>
      </ul>
    `;
  }

  if (!toggleBtns.length) return;

  function toggleMenu(show) {
    const isShowing = typeof show === 'boolean' ? show : !mobileMenu.classList.contains('is-open');
    if (isShowing) {
      mobileMenu.classList.add('is-open');
      toggleBtns.forEach(btn => btn.classList.add('is-active'));
      document.body.classList.add('mobile-menu-open');
    } else {
      mobileMenu.classList.remove('is-open');
      toggleBtns.forEach(btn => btn.classList.remove('is-active'));
      document.body.classList.remove('mobile-menu-open');
    }
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
  });

  // Toggle child submenus on mobile accordion tap
  const hasChildLinks = mobileMenu.querySelectorAll('.has_child > a');
  hasChildLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const parent = link.closest('.has_child');
      if (parent) {
        e.preventDefault();
        e.stopPropagation();
        parent.classList.toggle('active-child');
      }
    });
  });

  // Close menu when clicking backdrop overlay
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('is-open')) {
      let isClickInside = false;
      toggleBtns.forEach(btn => {
        if (btn.contains(e.target)) isClickInside = true;
      });
      if (!isClickInside && !mobileMenu.contains(e.target)) {
        toggleMenu(false);
      }
    }
  });

  // Close menu when clicking navigation links inside drawer
  const navLinks = mobileMenu.querySelectorAll('a:not(.has_child > a)');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        toggleMenu(false);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeExec);
} else {
  safeExec();
}
