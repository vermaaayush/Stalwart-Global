import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 09: Value Chain Flow Animation
 */
export function initNetworkFlow() {
  const section = document.getElementById('network');
  const cards = gsap.utils.toArray('.network-node-card');

  if (!section || !cards.length) return;

  gsap.from(cards, {
    opacity: 0,
    y: 30,
    stagger: 0.08,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.network-flow-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}
