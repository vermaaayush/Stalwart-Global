/* ============================================================
   STALWART GROUP — ANIMATION UTILITIES
   Reusable GSAP animation functions used across all sections.
   ============================================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);


/* ============================================================
   TEXT REVEAL ANIMATIONS
   ============================================================ */

/**
 * Split text into characters/words and animate them in with a stagger.
 * @param {string|HTMLElement} element - Target element or selector
 * @param {object} options - Configuration options
 * @returns {gsap.core.Timeline} The animation timeline
 */
export function revealText(element, options = {}) {
  const {
    type = 'chars',
    direction = 'up',
    duration = 0.8,
    stagger = 0.03,
    delay = 0,
    ease = 'power3.out',
    scrollTrigger = null,
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return null;

  const split = new SplitType(el, { types: type });
  const targets = split[type] || [];

  const from = { opacity: 0 };
  switch (direction) {
    case 'up':    from.y = 40; break;
    case 'down':  from.y = -40; break;
    case 'left':  from.x = 40; break;
    case 'right': from.x = -40; break;
  }

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger,
    delay: delay,
  });

  tl.from(targets, {
    ...from,
    duration: duration,
    stagger: stagger,
    ease: ease,
  });

  el._splitInstance = split;
  return tl;
}

/**
 * Reveal text line-by-line from behind an overflow mask.
 */
export function revealLines(element, options = {}) {
  const {
    duration = 0.9,
    stagger = 0.12,
    delay = 0,
    ease = 'power3.out',
    scrollTrigger = null,
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return null;

  const split = new SplitType(el, { types: 'lines' });

  split.lines.forEach((line) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('text-reveal-wrap');
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger,
    delay: delay,
  });

  tl.from(split.lines, {
    y: '110%',
    duration: duration,
    stagger: stagger,
    ease: ease,
  });

  el._splitInstance = split;
  return tl;
}


/* ============================================================
   ELEMENT ANIMATIONS
   ============================================================ */

/**
 * Fade an element in from a direction.
 */
export function fadeIn(element, options = {}) {
  const {
    direction = 'up',
    distance = 60,
    duration = 1,
    delay = 0,
    ease = 'power3.out',
    scrollTrigger = null,
  } = options;

  const from = { opacity: 0, duration, delay, ease, scrollTrigger };

  switch (direction) {
    case 'up':    from.y = distance; break;
    case 'down':  from.y = -distance; break;
    case 'left':  from.x = distance; break;
    case 'right': from.x = -distance; break;
    case 'none':  break;
  }

  return gsap.from(element, from);
}

/**
 * Scale-reveal animation (zoom in or out).
 */
export function scaleReveal(element, options = {}) {
  const {
    from = 0.85,
    duration = 1.2,
    delay = 0,
    ease = 'power2.out',
    scrollTrigger = null,
  } = options;

  return gsap.from(element, {
    scale: from,
    opacity: 0,
    duration,
    delay,
    ease,
    scrollTrigger,
  });
}

/**
 * Image mask reveal using clip-path.
 */
export function maskReveal(element, options = {}) {
  const {
    direction = 'left',
    duration = 1.4,
    delay = 0,
    ease = 'power4.inOut',
    scrollTrigger = null,
  } = options;

  const clipPaths = {
    left:   { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
    right:  { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
    top:    { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
    bottom: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
  };

  const clip = clipPaths[direction];
  gsap.set(element, { clipPath: clip.from });

  return gsap.to(element, {
    clipPath: clip.to,
    duration,
    delay,
    ease,
    scrollTrigger,
  });
}


/* ============================================================
   PARALLAX
   ============================================================ */

/**
 * Apply scroll-driven parallax to an element.
 */
export function parallax(element, options = {}) {
  const {
    speed = 0.3,
    direction = 'y',
    trigger = null,
  } = options;

  const distance = speed * 100;

  gsap.to(element, {
    [direction]: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}


/* ============================================================
   DRAW LINE / STROKE ANIMATION
   ============================================================ */

/**
 * Animate an SVG path's stroke as if being drawn.
 */
export function drawLine(path, options = {}) {
  const {
    duration = 2,
    delay = 0,
    ease = 'power2.inOut',
    scrollTrigger = null,
  } = options;

  const el = typeof path === 'string' ? document.querySelector(path) : path;
  if (!el) return null;

  const length = el.getTotalLength();

  gsap.set(el, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  return gsap.to(el, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease,
    scrollTrigger,
  });
}


/* ============================================================
   COUNTER ANIMATION
   ============================================================ */

/**
 * Animate a number counting up.
 */
export function animateCounter(element, endValue, options = {}) {
  const {
    duration = 2,
    delay = 0,
    ease = 'power2.out',
    prefix = '',
    suffix = '',
    scrollTrigger = null,
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  const obj = { value: 0 };

  gsap.to(obj, {
    value: endValue,
    duration,
    delay,
    ease,
    scrollTrigger,
    onUpdate: () => {
      el.textContent = prefix + Math.round(obj.value) + suffix;
    },
  });
}


/* ============================================================
   STAGGER GROUP
   ============================================================ */

/**
 * Stagger-reveal a group of child elements.
 */
export function staggerReveal(parentSelector, childSelector, options = {}) {
  const {
    direction = 'up',
    distance = 40,
    duration = 0.7,
    stagger = 0.1,
    delay = 0,
    ease = 'power3.out',
    scrollTrigger = null,
  } = options;

  const from = { opacity: 0, duration, stagger, delay, ease, scrollTrigger };

  switch (direction) {
    case 'up':    from.y = distance; break;
    case 'down':  from.y = -distance; break;
    case 'left':  from.x = distance; break;
    case 'right': from.x = -distance; break;
  }

  return gsap.from(parentSelector + ' ' + childSelector, from);
}


/* ============================================================
   CLEANUP UTILITIES
   ============================================================ */

/**
 * Kill all ScrollTriggers and revert SplitType instances.
 */
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  document.querySelectorAll('[data-split]').forEach((el) => {
    if (el._splitInstance) {
      el._splitInstance.revert();
    }
  });
}
