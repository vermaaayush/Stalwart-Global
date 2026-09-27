import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export let lenisInstance = null;

/**
 * Initialize Lenis smooth scroll and wire it seamlessly to GSAP ScrollTrigger
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  lenisInstance = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.15,
    touchMultiplier: 2.0,
    infinite: false,
  });

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Drive Lenis from GSAP's internal high-performance ticker
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  // Prevent lag smoothing delays for 60fps responsiveness
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

/**
 * Lock scrolling (used during intro splash screen or modals)
 */
export function lockScroll() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
  document.body.style.overflow = 'hidden';
}

/**
 * Unlock scrolling (used when entering the main site)
 */
export function unlockScroll() {
  if (lenisInstance) {
    lenisInstance.start();
  }
  document.body.style.overflow = '';
}

/**
 * Smooth scroll to target element
 */
export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  }
}
