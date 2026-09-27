import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 11: Industries Staggered Grid Entrance
 */
export function initIndustries() {
  const section = document.getElementById('industries');
  const cards = gsap.utils.toArray('.industry-card');

  if (!section || !cards.length) return;

  gsap.from(cards, {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.industries-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}
