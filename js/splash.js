import { gsap } from 'gsap';
import { lockScroll, unlockScroll } from './smooth-scroll.js';

let breathingTimeline = null;
let isExiting = false;

/**
 * Initialize Intro Splash Screen
 * @param {Function} onEnter - Callback function executed when user clicks or scrolls to enter
 */
export function initSplash(onEnter = null) {
  const splashScreen = document.getElementById('splash-screen');
  const logoWrapper = document.getElementById('splash-logo-wrapper');
  const logoGlow = document.querySelector('.splash-logo-glow');
  const enterBtn = document.getElementById('enter-btn');

  if (!splashScreen || !logoWrapper) {
    if (typeof onEnter === 'function') onEnter();
    unlockScroll();
    return;
  }

  // 1. Lock document scrolling while splash screen is active
  lockScroll();

  // 2. Start continuous breathing animation immediately
  startBreathing(logoWrapper, logoGlow);

  // 3. Gentle pulsing on the enter button
  if (enterBtn) {
    gsap.to(enterBtn, {
      boxShadow: '0 0 28px rgba(212, 175, 55, 0.45)',
      borderColor: 'rgba(212, 175, 55, 0.9)',
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut',
    });
  }

  // 4. Master Enter Handler
  const handleEnter = (e) => {
    if (isExiting) return;
    if (e && e.type === 'keydown' && !['Enter', ' ', 'ArrowDown', 'PageDown'].includes(e.key)) return;

    isExiting = true;
    console.log('[Stalwart] User triggered ENTER.');

    // Stop breathing cycle
    if (breathingTimeline) {
      breathingTimeline.pause();
    }

    // Cleanup listeners
    window.removeEventListener('keydown', handleEnter);
    window.removeEventListener('wheel', handleWheel);
    splashScreen.removeEventListener('click', handleEnter);
    splashScreen.removeEventListener('touchstart', handleEnter);

    // 1. Immediately apply CSS is-hidden class for hardware-accelerated fadeout
    splashScreen.classList.add('is-hidden');
    splashScreen.style.pointerEvents = 'none';

    // 2. Unlock scrolling immediately
    unlockScroll();

    // 3. Complete display none after transition
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 850);

    // 4. Trigger hero animation sequence
    if (typeof onEnter === 'function') {
      try {
        onEnter();
      } catch (err) {
        console.error('[Stalwart] onEnter transition error:', err);
      }
    }
  };

  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > 8) {
      handleEnter(e);
    }
  };

  // Expose globally as guaranteed fallback
  window.enterStalwartSite = handleEnter;

  // Click on enter button
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleEnter(e);
    });
  }

  // Click or touch anywhere on splash screen
  splashScreen.addEventListener('click', handleEnter);
  splashScreen.addEventListener('touchstart', handleEnter, { passive: true });

  // Scroll or keypress to enter
  window.addEventListener('wheel', handleWheel, { passive: true });
  window.addEventListener('keydown', handleEnter);
}

/**
 * Continuous royal breathing animation for the gold lion logo
 */
function startBreathing(logoWrapper, logoGlow) {
  if (breathingTimeline) breathingTimeline.kill();

  breathingTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { ease: 'sine.inOut', duration: 2.8 },
  });

  breathingTimeline
    .to(logoWrapper, {
      scale: 1.04,
    })
    .to(
      logoGlow,
      {
        opacity: 0.95,
        scale: 1.15,
      },
      0
    );
}

/**
 * Hide splash immediately (fallback utility)
 */
export function hideSplashInstant() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.style.display = 'none';
  }
  unlockScroll();
}
