import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 06: From Source to Market Process Animations
 */
export function initSourceToMarket() {
  const section = document.getElementById('source-to-market');
  const nodes = gsap.utils.toArray('.process-step-node');
  const progressBar = document.querySelector('.process-timeline-progress');

  if (!section || !nodes.length) return;

  // Staggered node entrance
  gsap.from(nodes, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  // Animated progress bar and active illumination on scroll
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      // Activate nodes sequentially based on progress
      const activeCount = Math.floor(progress * nodes.length) + 1;
      nodes.forEach((node, idx) => {
        if (idx < activeCount) {
          node.classList.add('is-active');
        } else {
          node.classList.remove('is-active');
        }
      });
    },
  });
}
