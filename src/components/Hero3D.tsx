import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { scrollSceneStore } from "@/three/scene";
import PrintingScene from "./PrintingScene";
import ScrollScene from "./ScrollScene";

/** Matches the Tailwind `lg` breakpoint that hides the visual slot in markup (see .hero3d-canvas usage). */
const DESKTOP_QUERY = "(min-width: 1024px)";

interface Hero3DProps {
  /** Which showcase to render: the hero paper stack, or the pharma packaging box. */
  mode: "hero" | "pharma";
  /** DOM id of the section this scene is scroll-linked to (#hero or #pharma). */
  sectionId: string;
  className?: string;
}

/**
 * Live Three.js / React Three Fiber canvas. Renders nothing on the server
 * (TanStack Start SSR) or on mobile/coarse-pointer devices — those get the
 * existing static image fallback already in the markup around this
 * component. Respects prefers-reduced-motion by freezing the scene on a
 * single settled pose instead of animating it.
 */
export default function Hero3D({ mode, sectionId, className = "" }: Hero3DProps) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highQuality, setHighQuality] = useState(true);

  useEffect(() => {
    setMounted(true);

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const applyDesktop = () => setIsDesktop(desktopQuery.matches);
    applyDesktop();
    desktopQuery.addEventListener("change", applyDesktop);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPref = () => {
      setReducedMotion(motionQuery.matches);
      scrollSceneStore.reducedMotion = motionQuery.matches;
    };
    applyMotionPref();
    motionQuery.addEventListener("change", applyMotionPref);

    const cores = navigator.hardwareConcurrency ?? 4;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setHighQuality(cores >= 4 && !coarsePointer);

    return () => {
      desktopQuery.removeEventListener("change", applyDesktop);
      motionQuery.removeEventListener("change", applyMotionPref);
    };
  }, []);

  if (!mounted || !isDesktop) return null;

  return (
    <div className={`hero3d-canvas ${className}`} aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2.25]}
        camera={{ position: [0, 0.18, 7.55], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <PrintingScene mode={mode} reducedMotion={reducedMotion} highQuality={highQuality} />
        </Suspense>
      </Canvas>
      <ScrollScene mode={mode} sectionId={sectionId} />
    </div>
  );
}
