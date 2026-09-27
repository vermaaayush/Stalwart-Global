import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 02: More Than Trading ScrollTrigger Kinetic Animations
 */
export function initMoreThanTrading() {
  const section = document.getElementById('more-than-trading');
  const headline = document.querySelector('.trading-headline');
  const lead = document.querySelector('.trading-lead');
  const headerMeta = document.querySelector('.trading-header');
  const cards = document.querySelectorAll('.trading-verb-card');

  if (!section || !headline) return;

  // 1. Kinetic headline split-text reveal on scroll
  const splitHeadline = new SplitType(headline, { types: 'lines,words' });

  const textTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  textTl
    .from(headerMeta, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power2.out',
    })
    .from(
      splitHeadline.words,
      {
        opacity: 0,
        y: 40,
        rotationX: -20,
        stagger: 0.04,
        duration: 1.0,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .from(
      lead,
      {
        opacity: 0,
        y: 25,
        duration: 1.0,
        ease: 'power3.out',
      },
      '-=0.6'
    );

  // 2. Sequential reveal of the 5 operational verbs with staggered entry
  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 40,
    },
    {
      opacity: 0.65,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.trading-verbs-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onComplete: () => {
        // Activate cards sequentially on scroll scrub
        setupScrubActivation(section, cards);
      },
    }
  );
}

/**
 * Activate verb cards sequentially as user scrolls through the section
 */
function setupScrubActivation(section, cards) {
  cards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 70%',
      end: 'bottom 40%',
      onEnter: () => {
        cards.forEach((c) => c.classList.remove('is-active'));
        card.classList.add('is-active');
      },
      onEnterBack: () => {
        cards.forEach((c) => c.classList.remove('is-active'));
        card.classList.add('is-active');
      },
    });
  });
}
