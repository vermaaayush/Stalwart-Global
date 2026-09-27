import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export let lenisInstance = null;

/**
 * Initialize Lenis smooth scroll and wire it seamlessly to GSAP ScrollTrigger
 * Configured for an ultra-luxurious, weighted, silky-smooth inertial scroll feel.
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  lenisInstance = new Lenis({
    duration: 1.4, // Luxuriously smooth inertia (slightly slower, velvety feel)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Expose global window.lenis for vendor.js compatibility
  window.lenis = lenisInstance;

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Drive Lenis from GSAP's internal high-performance ticker
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  // Smooth out any frame hitches gracefully
  gsap.ticker.lagSmoothing(500, 33);

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
