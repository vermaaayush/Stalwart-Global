import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 10: Why Stalwart 7 Differentiators Entrance
 */
export function initWhyStalwart() {
  const section = document.getElementById('why-stalwart');
  const cards = gsap.utils.toArray('.why-card');

  if (!section || !cards.length) return;

  gsap.from(cards, {
    opacity: 0,
    y: 35,
    stagger: 0.08,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.why-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}
