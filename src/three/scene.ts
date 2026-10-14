import * as THREE from "three";

/**
 * A plain, mutable, module-level store for values that drive the 3D scene.
 *
 * We deliberately do NOT use React state here. GSAP's ScrollTrigger and the
 * window pointermove listener write into this object imperatively (outside
 * React's render cycle), and every R3F component reads it inside its own
 * useFrame callback, every frame. That keeps 60fps scroll/pointer-driven
 * animation off the React render path entirely.
 */
export interface ScrollSceneStore {
  /** Normalized pointer position in [-1, 1], updated on window pointermove. */
  pointer: { x: number; y: number };
  /** Internal auto-advancing showcase clock for the hero paper stack, 0..1 looping. */
  heroFold: number;
  /** Local scroll progress through the #hero section (top to bottom), 0..1, from GSAP. */
  heroScroll: number;
  /** Scroll-driven fold progress for the pharma packaging box, 0..1, from GSAP. */
  pharmaFold: number;
  /** Scroll progress through the finishes interactive section, 0..1, from GSAP. */
  finishesScroll: number;
  /** Set once on mount from the prefers-reduced-motion media query. */
  reducedMotion: boolean;
}

type Listener = (store: ScrollSceneStore) => void;
const listeners = new Set<Listener>();

export const scrollSceneStore: ScrollSceneStore = {
  pointer: { x: 0, y: 0 },
  heroFold: 0,
  heroScroll: 0,
  pharmaFold: 0,
  finishesScroll: 0,
  reducedMotion: false,
};

export function notifyScrollStore() {
  listeners.forEach((fn) => fn(scrollSceneStore));
}

export function subscribeScrollStore(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** CMYK ink swatches used on the printed sheets in the hero scene. */
export const INK_COLORS = {
  cyan: new THREE.Color("#3fb4e0"),
  magenta: new THREE.Color("#e0498f"),
  yellow: new THREE.Color("#f0cf5a"),
  key: new THREE.Color("#15161c"),
};

/** Approximate hex equivalents of the site's oklch design tokens (src/styles.css). */
export const BRAND = {
  paper: new THREE.Color("#f4efe2"),
  paperShadow: new THREE.Color("#cfc7ba"),
  ink: new THREE.Color("#101219"),
  primary: new THREE.Color("#d8432b"),
  cyan: new THREE.Color("#4fb8e0"),
  magenta: new THREE.Color("#d1487e"),
  yellow: new THREE.Color("#e9c34c"),
};
