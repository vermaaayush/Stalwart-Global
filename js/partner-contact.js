import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Sections 12 & 13: Partner with Us and Contact
 */
export function initPartnerAndContact() {
  const partnerSection = document.getElementById('partner');
  const partnerCards = gsap.utils.toArray('.partner-card');
  const contactForm = document.getElementById('stalwart-contact-form');

  if (partnerSection && partnerCards.length) {
    gsap.from(partnerCards, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.partner-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>ENQUIRY RECEIVED &bull; THANK YOU</span>';
        submitBtn.style.borderColor = 'var(--color-gold, #C5A55A)';
        submitBtn.style.color = 'var(--color-gold, #C5A55A)';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
        }, 4000);
      }
    });
  }
}
