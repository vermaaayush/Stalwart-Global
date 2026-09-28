import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Section 08: Global Presence Interactive Map
 */
export function initGlobalPresence() {
  const section = document.getElementById('presence');
  const hubCards = document.querySelectorAll('.presence-hub-card');
  const mapNodes = document.querySelectorAll('.map-node');

  if (!section) return;

  // Stagger entrance of map and hub cards
  gsap.from('.presence-stage', {
    opacity: 0,
    scale: 0.96,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
    },
  });

  gsap.from(hubCards, {
    opacity: 0,
    y: 25,
    stagger: 0.06,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.presence-hubs-grid',
      start: 'top 85%',
    },
  });

  // Cross-interactive highlighting between cards and map nodes
  hubCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const countryId = card.getAttribute('data-country');
      highlightNode(countryId);
    });

    card.addEventListener('mouseleave', () => {
      resetNodes();
    });
  });

  mapNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      const countryId = node.getAttribute('data-country');
      highlightCard(countryId);
    });

    node.addEventListener('mouseleave', () => {
      resetCards();
    });
  });
}

function highlightNode(countryId) {
  const targetNode = document.querySelector(`.map-node[data-country="${countryId}"]`);
  if (targetNode) {
    const core = targetNode.querySelector('.core-dot');
    if (core) {
      gsap.to(core, { fill: '#FFFFFF', r: 7, duration: 0.2 });
    }
  }
}

function resetNodes() {
  document.querySelectorAll('.map-node .core-dot').forEach((dot) => {
    gsap.to(dot, { fill: '#EFBF04', r: 5, duration: 0.2 });
  });
}

function highlightCard(countryId) {
  document.querySelectorAll('.presence-hub-card').forEach((card) => {
    if (card.getAttribute('data-country') === countryId) {
      card.classList.add('is-active');
    } else {
      card.classList.remove('is-active');
    }
  });
}

function resetCards() {
  document.querySelectorAll('.presence-hub-card').forEach((card) => {
    card.classList.remove('is-active');
  });
}
