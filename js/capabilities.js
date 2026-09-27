import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 07: Capabilities That Create Opportunities
 */
export function initCapabilities() {
  const section = document.getElementById('capabilities');
  const cards = gsap.utils.toArray('.capability-card');

  if (!section || !cards.length) return;

  gsap.from(cards, {
    opacity: 0,
    y: 35,
    duration: 0.9,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.capabilities-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}
