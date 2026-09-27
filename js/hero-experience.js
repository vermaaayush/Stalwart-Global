/* ============================================================
   STALWART GROUP — ULTRA-SMOOTH CINEMATIC HERO CONTROLLER
   - Stage 01: Initial Load (Giant centered lion on pure black)
   - Stage 02: First Scroll (Logo zooms out -> STALWART GROUP reveal)
   - Stage 03: Second Scroll (Logo moves right -> Hero text left -> hero_bg.png)
   - Continuous 3D floating animation + Interactive cursor mouse tilt
   ============================================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroSequence() {
  console.log('⚡ [Stalwart Group] Initializing Cinematic Hero Experience...');

  const viewport = document.getElementById('hero-viewport');
  const lionStage = document.getElementById('lion-stage');
  const lionWrapper = document.getElementById('lion-floating-wrapper');
  const lionImg = document.getElementById('main-lion-img');
  const lionAura = document.getElementById('lion-aura');
  const brandingStage = document.getElementById('branding-stage');
  const heroContentStage = document.getElementById('hero-content-stage');
  const heroTextContainer = document.getElementById('hero-text-container');
  const siteHeader = document.getElementById('site-header');
  const scrollCue = document.getElementById('scroll-cue');
  const heroSlateBg = document.getElementById('hero-slate-bg');

  if (!viewport || !lionStage) {
    console.warn('[Stalwart] Required elements missing for hero sequence.');
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
    x: -40,
  });

  gsap.set(siteHeader, {
    opacity: 0,
    y: -20,
    pointerEvents: 'none',
  });

  gsap.set(heroSlateBg, {
    opacity: 0,
  });

  // 2. Continuous Dynamic 3D Floating & Wave Motion on the Logo
  const floatingTl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { ease: 'sine.inOut' },
  });

  floatingTl
    .to(lionWrapper, {
      y: -18,
      rotationZ: 1.8,
      duration: 2.2,
    })
    .to(lionWrapper, {
      y: 16,
      rotationZ: -1.8,
      duration: 2.4,
    });

  gsap.to(lionAura, {
    scale: 1.2,
    opacity: 0.85,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // 3. High-Sensitivity Interactive 3D Cursor Parallax Tilt & Depth
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX = (e.clientX / innerWidth - 0.5) * 2; // Range: -1 to 1
    mouseY = (e.clientY / innerHeight - 0.5) * 2; // Range: -1 to 1

    gsap.to(lionWrapper, {
      rotateY: mouseX * 18, // High-sensitivity 18-degree horizontal tilt
      rotateX: -mouseY * 14, // High-sensitivity 14-degree vertical tilt
      z: (Math.abs(mouseX) + Math.abs(mouseY)) * 30, // 3D depth expansion
      duration: 0.35, // Fast, highly responsive follow speed
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, { passive: true });

  // 4. Responsive Breakpoint Calculations
  const getResponsiveTargets = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isDesktop = width > 900;
    const isMobile = width <= 600;

    return {
      isDesktop,
      isMobile,
      stage2: {
        scale: isDesktop ? 0.44 : 0.46,
        y: isDesktop ? -85 : -70,
        brandingY: isDesktop ? 65 : 50,
      },
      stage3: {
        x: isDesktop ? (width * 0.24) : 0,
        y: isDesktop ? 0 : (isMobile ? -height * 0.22 : -height * 0.19),
        scale: isDesktop ? 0.82 : 0.46,
      },
    };
  };

  let targets = getResponsiveTargets();

  window.addEventListener('resize', () => {
    targets = getResponsiveTargets();
  }, { passive: true });

  // 5. Master Cinematic ScrollTrigger Timeline with Viewport Pinning
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: viewport,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      start: 'top top',
      end: '+=2400', // 2400px of smooth scroll track
      scrub: 1.0, // Smooth physical interpolation
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Enable pointer events on Stage 03 hero elements only when visible
        if (self.progress > 0.72) {
          heroContentStage.style.pointerEvents = 'auto';
          siteHeader.style.pointerEvents = 'auto';
        } else {
          heroContentStage.style.pointerEvents = 'none';
          siteHeader.style.pointerEvents = 'none';
        }
      },
    },
  });

  // ══════════════════════════════════════════════════════════
  // STAGE 02 — FIRST SCROLL (0.0 to 0.44)
  // Lion zooms out & moves up slightly -> STALWART GROUP reveals
  // ══════════════════════════════════════════════════════════
  masterTimeline
    // A. Fade out initial scroll cue
    .to(scrollCue, {
      opacity: 0,
      duration: 0.08,
      ease: 'power2.out',
    }, 0)

    // B. Lion slowly zooms out into its centered branding position
    .to(lionStage, {
      scale: () => targets.stage2.scale,
      y: () => targets.stage2.y,
      x: 0,
      duration: 0.40,
      ease: 'power2.inOut',
    }, 0.02)

    // C. STALWART GROUP typography fades and rises into place
    .to(brandingStage, {
      opacity: 1,
      scale: 1,
      y: () => targets.stage2.brandingY,
      duration: 0.38,
      ease: 'power2.out',
    }, 0.06)

    // D. Minimal hold / pause: the user experiences pure centered branding
    .to({}, { duration: 0.12 }); // Holds minimal branding between 0.44 and 0.56

  // ══════════════════════════════════════════════════════════
  // STAGE 03 — SECOND SCROLL (0.56 to 1.0)
  // Branding dissolves -> Lion glides to Right -> Hero text Left -> hero_bg.png reveals
  // ══════════════════════════════════════════════════════════
  masterTimeline
    // A. Centered STALWART GROUP branding dissolves
    .to(brandingStage, {
      opacity: 0,
      scale: 0.94,
      y: 40,
      duration: 0.20,
      ease: 'power2.in',
    }, 0.56)

    // B. Architectural slate background panels (hero_bg.png) reveal
    .to(heroSlateBg, {
      opacity: 1.0,
      duration: 0.42,
      ease: 'power2.out',
    }, 0.56)

    // C. Lion logo moves toward the RIGHT side (or top on mobile)
    .to(lionStage, {
      x: () => targets.stage3.x,
      y: () => targets.stage3.y,
      scale: () => targets.stage3.scale,
      duration: 0.42,
      ease: 'power3.inOut',
    }, 0.58)

    // D. Hero Content Stage fades in on the LEFT side with chronicle title
    .to(heroContentStage, {
      opacity: 1,
      duration: 0.15,
      ease: 'power1.out',
    }, 0.62)

    .to(heroTextContainer, {
      opacity: 1,
      x: 0,
      duration: 0.38,
      ease: 'power2.out',
    }, 0.62)

    // E. Transparent Navigation appears smoothly at the top
    .to(siteHeader, {
      opacity: 1,
      y: 0,
      duration: 0.32,
      ease: 'power2.out',
    }, 0.68);

  console.log('✨ [Stalwart Group] Cinematic Hero Sequence Ready.');
}
