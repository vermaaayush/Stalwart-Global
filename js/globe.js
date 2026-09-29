/**
 * STALWART GROUP — 3D INTERACTIVE WORLD GLOBE (Aceternity UI + Three.js)
 * Native Vanilla JS + Three.js + ThreeGlobe Engine for High Performance Web
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ThreeGlobe from 'three-globe';
import countriesData from '../data/globe.json';

const RING_PROPAGATION_SPEED = 2.5;

export const DEFAULT_GLOBE_CONFIG = {
  pointSize: 1.8,
  globeColor: "#0b0d14",
  showAtmosphere: true,
  atmosphereColor: "#ffdf00",
  atmosphereAltitude: 0.26,
  emissive: "#201a08",
  emissiveIntensity: 0.85,
  shininess: 1.2,
  polygonColor: "rgba(255, 220, 0, 1.0)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffea70",
  directionalTopLight: "#ffffff",
  pointLight: "#ffea70",
  arcTime: 1600,
  arcLength: 0.9,
  rings: 2,
  maxRings: 4,
  initialPosition: { lat: 20.5937, lng: 78.9629 }, // Center on India / Asia-Pacific Hub
  autoRotate: true,
  autoRotateSpeed: 0.55,
};

// Stalwart Key International Trade & Supply Chain Routes (Only Between Operating Countries)
export const STALWART_TRADE_ARCS = [
  // India <-> China (Sourcing & FMCG)
  { order: 1, startLat: 28.6139, startLng: 77.2090, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.32, color: "#ffffff" },
  { order: 1, startLat: 19.0760, startLng: 72.8777, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.28, color: "#EFBF04" },
  // India <-> Myanmar (Agricultural Commodities & Pulses)
  { order: 2, startLat: 22.5726, startLng: 88.3639, endLat: 16.8661, endLng: 96.1951, arcAlt: 0.22, color: "#EFBF04" },
  // India <-> Sri Lanka (Tea, Spices, Logistics)
  { order: 2, startLat: 13.0827, startLng: 80.2707, endLat: 6.9271, endLng: 79.8612, arcAlt: 0.16, color: "#ffffff" },
  // Thailand <-> Cambodia (Hospitality & Distribution)
  { order: 3, startLat: 13.7563, startLng: 100.5018, endLat: 11.5564, endLng: 104.9282, arcAlt: 0.18, color: "#EFBF04" },
  // China <-> Australia (Livestock & Life Sciences)
  { order: 3, startLat: 31.2304, startLng: 121.4737, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.46, color: "#EFBF04" },
  // India <-> Australia (International Trade Corridor)
  { order: 4, startLat: 12.9716, startLng: 77.5946, endLat: -37.8136, endLng: 144.9631, arcAlt: 0.5, color: "#ffffff" },
  // India <-> Thailand (Supply Chain)
  { order: 4, startLat: 19.0760, startLng: 72.8777, endLat: 13.7563, endLng: 100.5018, arcAlt: 0.26, color: "#EFBF04" },
  // Myanmar <-> China (Cross-border Trade)
  { order: 5, startLat: 16.8661, startLng: 96.1951, endLat: 39.9042, endLng: 116.4074, arcAlt: 0.34, color: "#ffffff" },
  // India <-> Cambodia
  { order: 5, startLat: 28.6139, startLng: 77.2090, endLat: 11.5564, endLng: 104.9282, arcAlt: 0.36, color: "#EFBF04" },
  // Thailand <-> Australia
  { order: 6, startLat: 13.7563, startLng: 100.5018, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.42, color: "#EFBF04" },
  // Sri Lanka <-> Thailand
  { order: 6, startLat: 6.9271, startLng: 79.8612, endLat: 13.7563, endLng: 100.5018, arcAlt: 0.22, color: "#ffffff" }
];

export function initInteractiveGlobe(containerId = 'globe-canvas-container') {
  const container = document.getElementById(containerId);
  if (!container || container.dataset.globeInitialized === 'true') return;
  container.dataset.globeInitialized = 'true';

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 650;

  // 1. Scene & Camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x030406, 500, 2500);

  const camera = new THREE.PerspectiveCamera(36, width / height, 10, 2000);
  camera.position.set(0, 8, 520);

  // 2. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.7; // Bright, high-vibrancy exposure

  container.appendChild(renderer.domElement);

  // 3. OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 440;
  controls.maxDistance = 680;
  controls.autoRotate = true;
  controls.autoRotateSpeed = -3.5;
  controls.minPolarAngle = Math.PI / 3.6;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  // 4. Lighting (Enhanced Brightness & Illumination)
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);

  const dirLeft = new THREE.DirectionalLight('#ffea70', 3.0);
  dirLeft.position.set(-300, 150, 300);
  scene.add(dirLeft);

  const dirRightRim = new THREE.DirectionalLight('#ffdf00', 4.5);
  dirRightRim.position.set(380, 80, 200);
  scene.add(dirRightRim);

  const dirTop = new THREE.DirectionalLight('#ffffff', 2.5);
  dirTop.position.set(-100, 450, 250);
  scene.add(dirTop);

  const pointLight = new THREE.PointLight('#ffea70', 3.5);
  pointLight.position.set(180, 250, 220);
  scene.add(pointLight);

  // Stalwart operating countries — India, China, Myanmar, Sri Lanka, Cambodia, Thailand, Australia
  const STALWART_COUNTRIES = new Set([
    'India', 'China', 'Myanmar', 'Sri Lanka', 'Cambodia', 'Thailand', 'Australia',
    'United Republic of Tanzania', 'Viet Nam', 'Lao PDR'
  ]);

  const isStalwartCountry = (d) => {
    const p = d.properties || {};
    const name = p.NAME || p.ADMIN || p.SOVEREIGNT || p.NAME_LONG || '';
    const iso = p.ISO_A3 || p.ADM0_A3 || '';
    return STALWART_COUNTRIES.has(name) || ['IND', 'CHN', 'MMR', 'LKA', 'KHM', 'THA', 'AUS'].includes(iso);
  };

  // 5. ThreeGlobe Construction
  const globe = new ThreeGlobe()
    .hexPolygonsData(countriesData.features || [])
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.4)
    .showAtmosphere(true)
    .atmosphereColor('#ffdb4d')
    .atmosphereAltitude(0.26)
    .hexPolygonAltitude(d => isStalwartCountry(d) ? 0.05 : 0.015)
    .hexPolygonColor(d => {
      if (isStalwartCountry(d)) {
        return 'rgba(255, 220, 0, 1.0)'; // Super bright radiant electric gold
      }
      return 'rgba(240, 225, 170, 0.82)'; // High-visibility bright glowing golden-white map polygons for all world countries
    });

  // Initial rotation: face India (lat 20.6° N, lon 79.0° E) & Asia directly dead-center front
  globe.rotation.y = 1.11;
  globe.rotation.x = 0.35;

  // Material setup
  const globeMaterial = globe.globeMaterial();
  globeMaterial.color = new THREE.Color(DEFAULT_GLOBE_CONFIG.globeColor);
  globeMaterial.emissive = new THREE.Color(DEFAULT_GLOBE_CONFIG.emissive);
  globeMaterial.emissiveIntensity = DEFAULT_GLOBE_CONFIG.emissiveIntensity;
  globeMaterial.shininess = DEFAULT_GLOBE_CONFIG.shininess;

  // Filter unique points for hubs
  const points = [];
  STALWART_TRADE_ARCS.forEach((arc) => {
    points.push({ lat: arc.startLat, lng: arc.startLng, color: arc.color, order: arc.order });
    points.push({ lat: arc.endLat, lng: arc.endLng, color: arc.color, order: arc.order });
  });

  const uniquePoints = points.filter((v, i, a) =>
    a.findIndex(v2 => v2.lat === v.lat && v2.lng === v.lng) === i
  );

  // Configure Arcs & Points & Concentric Pulse Rings
  globe
    .arcsData(STALWART_TRADE_ARCS)
    .arcStartLat(d => d.startLat)
    .arcStartLng(d => d.startLng)
    .arcEndLat(d => d.endLat)
    .arcEndLng(d => d.endLng)
    .arcColor(d => d.color)
    .arcAltitude(d => d.arcAlt)
    .arcStroke(() => 0.4)
    .arcDashLength(DEFAULT_GLOBE_CONFIG.arcLength)
    .arcDashInitialGap(d => d.order * 0.8)
    .arcDashGap(15)
    .arcDashAnimateTime(() => DEFAULT_GLOBE_CONFIG.arcTime)
    .pointsData(uniquePoints)
    .pointColor(d => d.color)
    .pointsMerge(true)
    .pointAltitude(0.01)
    .pointRadius(1.6)
    .ringsData([])
    .ringColor(() => DEFAULT_GLOBE_CONFIG.polygonColor)
    .ringMaxRadius(DEFAULT_GLOBE_CONFIG.maxRings)
    .ringPropagationSpeed(RING_PROPAGATION_SPEED)
    .ringRepeatPeriod((DEFAULT_GLOBE_CONFIG.arcTime * DEFAULT_GLOBE_CONFIG.arcLength) / DEFAULT_GLOBE_CONFIG.rings);

  scene.add(globe);

  // Concentric Rings Pulse Interval
  const ringInterval = setInterval(() => {
    const randomCount = Math.floor(uniquePoints.length * 0.6);
    const selectedPoints = [...uniquePoints].sort(() => 0.5 - Math.random()).slice(0, randomCount);
    globe.ringsData(selectedPoints);
  }, 2200);

  // Responsive Resize
  function onWindowResize() {
    if (!container) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 550;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  let reqId;
  function renderLoop() {
    controls.update();
    renderer.render(scene, camera);
    reqId = requestAnimationFrame(renderLoop);
  }

  renderLoop();

  return () => {
    clearInterval(ringInterval);
    cancelAnimationFrame(reqId);
    window.removeEventListener('resize', onWindowResize);
    renderer.dispose();
  };
}
