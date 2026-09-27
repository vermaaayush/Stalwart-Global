import { gsap } from 'gsap';
import { unlockScroll } from './smooth-scroll.js';

let heroIdleTimeline = null;

/**
 * Execute the cinematic Splash to Hero transition
 */
export function executeSplashToHeroTransition() {
  const splashScreen = document.getElementById('splash-screen');
  const splashEnter = document.querySelector('.splash-enter-section');
  const splashBrand = document.querySelector('.splash-brand-mark');

  const heroStage = document.querySelector('.hero-stage');
  const heroTitle = document.querySelector('.hero-title-container');
  const heroLionWrapper = document.querySelector('.hero-lion-wrapper');
  const heroSubtitle = document.querySelector('.hero-subtitle-group');
  const siteHeader = document.querySelector('.site-header');
  const heroBottomBar = document.querySelector('.hero-bottom-bar');

  console.log('[Stalwart] executeSplashToHeroTransition called.');

  // 1. Immediately disable pointer events on splash so user can interact with hero
  if (splashScreen) {
    splashScreen.style.pointerEvents = 'none';
  }

  // 2. Unlock scroll immediately
  unlockScroll();

  // 3. Master Transition Timeline
  const transitionTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      if (splashScreen) {
        splashScreen.style.display = 'none';
      }
      console.log('[Stalwart] Transition complete. Hero active.');
    },
  });

  // Step A: Fade out splash controls quickly
  if (splashEnter || splashBrand) {
    transitionTl.to([splashEnter, splashBrand], {
      opacity: 0,
      y: -20,
      duration: 0.3,
      stagger: 0.05,
    });
  }

  // Step B: Smoothly fade out the entire splash screen
  if (splashScreen) {
    transitionTl.to(
      splashScreen,
      {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      },
      '-=0.1'
    );
  }

  // Step C: Simultaneously reveal the Hero centerpiece elements
  if (heroTitle) {
    transitionTl.fromTo(
      heroTitle,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
      '-=0.5'
    );
  }

  if (heroLionWrapper) {
    transitionTl.fromTo(
      heroLionWrapper,
      { opacity: 0, scale: 0.82 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=0.9'
    );
  }

  if (heroSubtitle) {
    transitionTl.fromTo(
      heroSubtitle,
      { opacity: 0, y: 20 },
      { opacity: 0.95, y: 0, duration: 0.9, ease: 'power2.out' },
      '-=0.7'
    );
  }

  if (siteHeader) {
    transitionTl.fromTo(
      siteHeader,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.8'
    );
  }

  if (heroBottomBar) {
    transitionTl.fromTo(
      heroBottomBar,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.8'
    );
  }
}

// Expose on window for direct access
if (typeof window !== 'undefined') {
  window.executeSplashToHeroTransition = executeSplashToHeroTransition;
}
