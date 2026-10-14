import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { notifyScrollStore, scrollSceneStore } from "./scene";

let registered = false;
function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/**
 * As #hero scrolls out of view (top to bottom of the section passing the
 * top of the viewport), heroScroll goes 0 -> 1.
 */
export function initHeroScrollTrigger(sectionId: string) {
  ensureGsap();
  const el = document.getElementById(sectionId);
  if (!el) return () => {};
  const trigger = ScrollTrigger.create({
    trigger: el,
    start: "top top",
    end: "bottom top",
    scrub: 0.5,
    onUpdate: (self) => {
      scrollSceneStore.heroScroll = self.progress;
      notifyScrollStore();
    },
  });
  return () => trigger.kill();
}

/**
 * Scrolls the window smoothly so the hero section hits a specific target progress (0 to 1).
 */
export function scrollToHeroStage(targetProgress: number, sectionId: string = "hero") {
  if (typeof window === "undefined") return;
  const el = document.getElementById(sectionId);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const sectionTop = rect.top + scrollTop;
  const scrollDistance = el.offsetHeight - window.innerHeight;
  const targetScroll = sectionTop + scrollDistance * THREE_clamp01(targetProgress);

  window.scrollTo({
    top: targetScroll,
    behavior: "smooth",
  });
}

function THREE_clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * As #pharma scrolls into view, pharmaFold goes 0 -> 1, which
 * PackagingBox uses to fold its flaps closed around the bottom panel.
 */
export function initPharmaScrollTrigger(sectionId: string) {
  ensureGsap();
  const el = document.getElementById(sectionId);
  if (!el) return () => {};
  const trigger = ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    end: "top 20%",
    scrub: 0.6,
    onUpdate: (self) => {
      scrollSceneStore.pharmaFold = self.progress;
      notifyScrollStore();
    },
  });
  return () => trigger.kill();
}

/**
 * As #finishes scrolls into view, finishesScroll goes 0 -> 1 to rotate
 * and display specular light effects on the 3D finish swatch.
 */
export function initFinishesScrollTrigger(sectionId: string) {
  ensureGsap();
  const el = document.getElementById(sectionId);
  if (!el) return () => {};
  const trigger = ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    end: "bottom 30%",
    scrub: 0.6,
    onUpdate: (self) => {
      scrollSceneStore.finishesScroll = self.progress;
      notifyScrollStore();
    },
  });
  return () => trigger.kill();
}

/** Normalized window pointermove -> scrollSceneStore.pointer, for camera/scene parallax. */
export function initPointerParallax() {
  if (typeof window === "undefined") return () => {};
  const handler = (e: PointerEvent) => {
    scrollSceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    scrollSceneStore.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", handler, { passive: true });
  return () => window.removeEventListener("pointermove", handler);
}

