import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let activeSlideIndex = 0;

/**
 * Initialize Section 04: Full-Screen Company Presentation Deck
 */
export function initCompanySlides() {
  const section = document.getElementById('businesses');
  const stage = document.querySelector('.company-slides-stage');
  const slides = gsap.utils.toArray('.company-slide');
  const navItems = gsap.utils.toArray('.slides-nav-item');

  if (!section || !slides.length) return;

  // Initialize initial visibility
  slides.forEach((slide, idx) => {
    if (idx === 0) {
      slide.classList.add('is-current');
      gsap.set(slide, { opacity: 1, visibility: 'visible', scale: 1, y: 0 });
    } else {
      slide.classList.remove('is-current');
      gsap.set(slide, { opacity: 0, visibility: 'hidden', scale: 1.05, y: 40 });
    }
  });

  // Master Pinning & Slide Sequence Timeline
  const totalSlides = slides.length;
  const slideTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${(totalSlides - 1) * window.innerHeight * 1.5}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Track progress to update nav indicators
        const progress = self.progress;
        const currentIdx = Math.min(
          Math.floor(progress * totalSlides),
          totalSlides - 1
        );
        updateNavIndicators(currentIdx, navItems);
      },
    },
  });

  // Build the sequential crossfade / scale transition between slides
  slides.forEach((slide, i) => {
    if (i < totalSlides - 1) {
      const nextSlide = slides[i + 1];

      // Current slide transitions away
      slideTl
        .to(slide, {
          opacity: 0,
          scale: 0.94,
          y: -40,
          duration: 1,
          ease: 'power2.inOut',
          onStart: () => {
            slide.classList.add('is-current');
          },
          onComplete: () => {
            slide.classList.remove('is-current');
            gsap.set(slide, { visibility: 'hidden' });
          },
        })
        // Next slide transitions in
        .set(nextSlide, { visibility: 'visible' }, '-=0.5')
        .to(
          nextSlide,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power2.inOut',
            onStart: () => {
              nextSlide.classList.add('is-current');
            },
          },
          '-=0.7'
        );
    }
  });

  // Nav Item click to jump to corresponding slide progress
  navItems.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const scrollTrigger = slideTl.scrollTrigger;
      if (!scrollTrigger) return;

      const targetProgress = idx / (totalSlides - 1);
      const targetScroll =
        scrollTrigger.start +
        targetProgress * (scrollTrigger.end - scrollTrigger.start);

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    });
  });
}

/**
 * Update the active navigation indicator dots and labels
 */
function updateNavIndicators(index, navItems) {
  if (index === activeSlideIndex) return;
  activeSlideIndex = index;

  navItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('is-active');
    } else {
      item.classList.remove('is-active');
    }
  });
}
