/* ============================================================
   STALWART GROUP — ULTRA-SMOOTH CINEMATIC HERO CONTROLLER
   - Stage 01: Initial Load (Giant centered lion on pure black)
   - Stage 02: First Scroll (Logo zooms out & moves UP -> STALWART GROUP reveal with ZERO W overlap)
   - Stage 03: Second Scroll (Logo glides right -> Hero text left -> Slate backdrop)
   - Continuous 3D floating animation + Interactive cursor mouse tilt
   ============================================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroSequence() {
  console.log('⚡ [Stalwart Group] Initializing Master GSAP Hero Sequence...');

  const viewport = document.getElementById('hero-viewport');
  const lionStage = document.getElementById('lion-stage');
  const lionWrapper = document.getElementById('lion-floating-wrapper');
  const lionAura = document.getElementById('lion-aura');
  const brandingStage = document.getElementById('branding-stage');
  const heroContentStage = document.getElementById('hero-content-stage');
  const heroTextContainer = document.getElementById('hero-text-container');
  const siteHeader = document.getElementById('site-header');
  const scrollCue = document.getElementById('scroll-cue');
  const heroSlateBg = document.getElementById('hero-slate-bg');

  if (!viewport || !lionStage) {
    console.warn('[Stalwart] Hero elements not found on this page.');
    return;
  }

  // 1. Initial State Initialization
  gsap.set(lionStage, {
    xPercent: -50,
    yPercent: -50,
    left: '50%',
    top: '50%',
    scale: 1,
    x: 0,
    y: 0,
    opacity: 1,
    transformOrigin: '50% 50%',
  });

  gsap.set(brandingStage, {
    xPercent: -50,
    yPercent: -50,
    left: '50%',
    top: '50%',
    opacity: 0,
    scale: 0.95,
    y: 40,
    transformOrigin: '50% 50%',
  });

  gsap.set(heroContentStage, {
    opacity: 0,
    pointerEvents: 'none',
  });

  gsap.set(heroTextContainer, {
    opacity: 0,
    x: -35,
  });

  siteHeader.classList.remove('is-stage3-active');

  gsap.set(heroSlateBg, {
    opacity: 0,
  });

  gsap.set(scrollCue, {
    opacity: 1,
  });

  // 2. Continuous Dynamic 3D Floating Motion on Lion
  const floatingTl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { ease: 'sine.inOut' },
  });

  floatingTl
    .to(lionWrapper, {
      y: -14,
      rotationZ: 1.5,
      duration: 2.4,
    })
    .to(lionWrapper, {
      y: 12,
      rotationZ: -1.5,
      duration: 2.6,
    });

  gsap.to(lionAura, {
    scale: 1.25,
    opacity: 0.85,
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // 3. High-Performance rAF-Throttled Mouse Parallax Tilt
  let mouseTicking = false;
  window.addEventListener('mousemove', (e) => {
    if (mouseTicking) return;
    mouseTicking = true;
    requestAnimationFrame(() => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(lionWrapper, {
        rotateY: mouseX * 16,
        rotateX: -mouseY * 12,
        z: (Math.abs(mouseX) + Math.abs(mouseY)) * 24,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      mouseTicking = false;
    });
  }, { passive: true });

  // 4. Responsive Breakpoint Calculations
  // Stage 02 logo made slightly smaller (0.46) and pushed higher upward (-115px) so it sits cleanly above "STALWART" without cutting the W
  const getResponsiveTargets = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isDesktop = width > 900;
    const isMobile = width <= 600;

    return {
      isDesktop,
      isMobile,
      stage2: {
        scale: isDesktop ? 0.46 : 0.40,
        y: isDesktop ? -115 : -90,
        brandingY: isDesktop ? 80 : 65,
      },
      stage3: {
        x: isDesktop ? (width * 0.29) : 0,
        y: isDesktop ? 15 : (isMobile ? -height * 0.22 : -height * 0.19),
        scale: isDesktop ? 0.54 : 0.44,
      },
    };
  };

  let targets = getResponsiveTargets();

  window.addEventListener('resize', () => {
    targets = getResponsiveTargets();
  }, { passive: true });

  // 5. Master Scroll-Driven GSAP ScrollTrigger Timeline
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: viewport,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      start: 'top top',
      end: '+=1200', // Perfectly balanced travel distance
      scrub: 0.3,   // Cushioned, responsive, silky-smooth tracking
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress > 0.48) {
          heroContentStage.style.pointerEvents = 'auto';
          siteHeader.classList.add('is-stage3-active');
        } else {
          heroContentStage.style.pointerEvents = 'none';
          siteHeader.classList.remove('is-stage3-active');
        }
      },
    },
  });

  // ══════════════════════════════════════════════════════════
  // STAGE 01 -> STAGE 02 (0.0 to 0.35) — First Scroll
  // Lion scales down to 0.46 and elevates upward (-115px); STALWART GROUP typography reveals cleanly below
  // ══════════════════════════════════════════════════════════
  masterTimeline
    // Softly fade out scroll cue
    .to(scrollCue, {
      opacity: 0,
      duration: 0.08,
      ease: 'power1.out',
    }, 0)

    // Lion smoothly scales down and moves UPWARD away from STALWART text
    .to(lionStage, {
      scale: () => targets.stage2.scale,
      y: () => targets.stage2.y,
      x: 0,
      duration: 0.35,
      ease: 'power2.out',
    }, 0)

    // STALWART GROUP typography rises and fades in smoothly below logo
    .to(brandingStage, {
      opacity: 1,
      scale: 1,
      y: () => targets.stage2.brandingY,
      duration: 0.30,
      ease: 'power2.out',
    }, 0.05);

  // ══════════════════════════════════════════════════════════
  // TRANSITION: Clean Separation (0.35 to 0.48)
  // Centered branding dissolves COMPLETELY before Stage 03 starts (Zero Overlap)
  // ══════════════════════════════════════════════════════════
  masterTimeline
    .to(brandingStage, {
      opacity: 0,
      scale: 0.94,
      y: -15,
      duration: 0.15,
      ease: 'power2.in',
    }, 0.35);

  // ══════════════════════════════════════════════════════════
  // STAGE 02 -> STAGE 03 (0.48 to 1.0) — Second Scroll
  // Lion glides smoothly to right, Slate backdrop reveals, Hero text & Nav drop in
  // ══════════════════════════════════════════════════════════
  masterTimeline
    // Ambient slate backdrop
    .to(heroSlateBg, {
      opacity: 1.0,
      duration: 0.40,
      ease: 'power1.out',
    }, 0.48)

    // Lion glides smoothly to the right
    .to(lionStage, {
      x: () => targets.stage3.x,
      y: () => targets.stage3.y,
      scale: () => targets.stage3.scale,
      duration: 0.48,
      ease: 'power2.inOut',
    }, 0.48)

    // Hero headline & content slide in from left
    .to(heroContentStage, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    }, 0.52)
    .to(heroTextContainer, {
      opacity: 1,
      x: 0,
      duration: 0.40,
      ease: 'power2.out',
    }, 0.52);

  console.log('✨ [Stalwart Group] GSAP Hero Sequence Controller Ready.');
}
