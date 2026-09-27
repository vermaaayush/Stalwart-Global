import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 03: About Stalwart scroll animations & image parallax
 */
export function initAboutSection() {
  const section = document.getElementById('about');
  const headline = document.querySelector('.about-headline');
  const lead = document.querySelector('.about-lead');
  const bodyText = document.querySelector('.about-body-text');
  const pillarItems = document.querySelectorAll('.about-pillar-item');
  const imageInner = document.querySelector('.about-image-inner img');
  const visualWrap = document.querySelector('.about-visual-wrap');

  if (!section) return;

  // 1. Text entrance animation
  const splitHeadline = headline ? new SplitType(headline, { types: 'lines,words' }) : null;

  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  if (splitHeadline && splitHeadline.words) {
    aboutTl.from(splitHeadline.words, {
      opacity: 0,
      y: 35,
      stagger: 0.03,
      duration: 0.9,
      ease: 'power3.out',
    });
  }

  aboutTl
    .from(
      [lead, bodyText],
      {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.5'
    )
    .from(
      pillarItems,
      {
        opacity: 0,
        y: 25,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4'
    );

  // 2. Smooth Image Parallax effect
  if (imageInner && visualWrap) {
    gsap.fromTo(
      imageInner,
      {
        yPercent: -8,
        scale: 1.08,
      },
      {
        yPercent: 8,
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: visualWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    );
  }
}
