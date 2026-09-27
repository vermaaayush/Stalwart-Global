import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Step 15: Global Reading Progress & Section Counter Sync
 */
export function initScrollProgress() {
  const progressBar = document.getElementById('global-scroll-progress');
  const counterCurrent = document.querySelector('.hero-section-counter .current-num');
  const navLinks = document.querySelectorAll('.nav-link');

  // 1. Reading progress bar pinned to top of viewport
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // 2. Map all sections to their numeric order (01 to 14)
  const sections = [
    { id: 'hero', num: '01' },
    { id: 'more-than-trading', num: '02' },
    { id: 'about', num: '03' },
    { id: 'businesses', num: '04' },
    { id: 'source-to-market', num: '05' },
    { id: 'capabilities', num: '06' },
    { id: 'presence', num: '07' },
    { id: 'network', num: '08' },
    { id: 'why-stalwart', num: '09' },
    { id: 'industries', num: '10' },
    { id: 'partner', num: '11' },
    { id: 'contact', num: '12' },
  ];

  sections.forEach((sec) => {
    const el = document.getElementById(sec.id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => updateSectionState(sec.id, sec.num),
      onEnterBack: () => updateSectionState(sec.id, sec.num),
    });
  });

  function updateSectionState(sectionId, numStr) {
    if (counterCurrent) {
      counterCurrent.textContent = numStr;
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
