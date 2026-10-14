import { useEffect } from "react";
import {
  initFinishesScrollTrigger,
  initHeroScrollTrigger,
  initPharmaScrollTrigger,
  initPointerParallax,
} from "@/three/animations";

interface ScrollSceneProps {
  mode: "hero" | "pharma" | "finishes";
  sectionId: string;
}

/** Renders nothing — just registers/cleans up the scroll + pointer listeners for its scene. */
export default function ScrollScene({ mode, sectionId }: ScrollSceneProps) {
  useEffect(() => {
    let modeCleanup = () => {};
    if (mode === "hero") {
      modeCleanup = initHeroScrollTrigger(sectionId);
    } else if (mode === "pharma") {
      modeCleanup = initPharmaScrollTrigger(sectionId);
    } else if (mode === "finishes") {
      modeCleanup = initFinishesScrollTrigger(sectionId);
    }

    const parallaxCleanup = initPointerParallax();
    return () => {
      modeCleanup();
      parallaxCleanup();
    };
  }, [mode, sectionId]);

  return null;
}
