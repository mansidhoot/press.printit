import { useEffect, useState, useRef } from "react";
import { scrollToHeroStage } from "@/three/animations";
import { scrollSceneStore, subscribeScrollStore, notifyScrollStore } from "@/three/scene";
import { Play, Pause, RotateCcw, Check, Sparkles } from "lucide-react";

const STAGES = [
  {
    step: "01",
    title: "Blank Paper",
    subtitle: "High-grade virgin paper feed & registration",
    range: [0, 0.25],
    target: 0.12,
  },
  {
    step: "02",
    title: "Precision Press",
    subtitle: "Cylinder impression & mechanical plate drive",
    range: [0.25, 0.5],
    target: 0.38,
  },
  {
    step: "03",
    title: "CMYK Inking",
    subtitle: "Cyan, Magenta, Yellow & Key color transfer",
    range: [0.5, 0.75],
    target: 0.62,
  },
  {
    step: "04",
    title: "Your Brand",
    subtitle: "Sharp cured print, die-cut & stacked",
    range: [0.75, 1.0],
    target: 0.88,
  },
];

export default function HeroStageController() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayAnimRef = useRef<number | null>(null);

  useEffect(() => {
    // Listen to scroll scene store updates
    const unsubscribe = subscribeScrollStore((store) => {
      setScrollProgress(store.heroScroll);
    });
    return () => unsubscribe();
  }, []);

  // Determine current active stage index
  const activeIndex = STAGES.findIndex(
    (s) => scrollProgress >= s.range[0] && scrollProgress <= s.range[1]
  );
  const currentStageIndex = activeIndex === -1 ? (scrollProgress > 0.5 ? 3 : 0) : activeIndex;

  // Toggle Auto-Play simulation
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      if (autoPlayAnimRef.current) cancelAnimationFrame(autoPlayAnimRef.current);
      setIsAutoPlaying(false);
    } else {
      setIsAutoPlaying(true);
      let p = scrollSceneStore.heroScroll;
      let forward = true;
      const step = () => {
        if (forward) {
          p += 0.0035;
          if (p >= 0.98) forward = false;
        } else {
          p -= 0.0035;
          if (p <= 0.02) forward = true;
        }
        scrollSceneStore.heroScroll = p;
        notifyScrollStore();
        autoPlayAnimRef.current = requestAnimationFrame(step);
      };
      autoPlayAnimRef.current = requestAnimationFrame(step);
    }
  };

  useEffect(() => {
    return () => {
      if (autoPlayAnimRef.current) cancelAnimationFrame(autoPlayAnimRef.current);
    };
  }, []);

  // CMYK calculation based on progress
  const cLevel = Math.min(100, Math.max(0, ((scrollProgress - 0.22) / 0.15) * 100));
  const mLevel = Math.min(100, Math.max(0, ((scrollProgress - 0.35) / 0.15) * 100));
  const yLevel = Math.min(100, Math.max(0, ((scrollProgress - 0.48) / 0.15) * 100));
  const kLevel = Math.min(100, Math.max(0, ((scrollProgress - 0.60) / 0.15) * 100));

  return (
    <div className="flex flex-col gap-4">
      {/* 4 Interactive Stage Pills */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STAGES.map((s, idx) => {
          const isActive = idx === currentStageIndex;
          const isPassed = scrollProgress > s.range[1];
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                if (isAutoPlaying) toggleAutoPlay();
                scrollToHeroStage(s.target, "hero");
              }}
              className={`group relative flex flex-col rounded-xl border p-2.5 text-left transition-all duration-300 ${
                isActive
                  ? "border-cyan/70 bg-gradient-to-br from-cyan/20 to-white/5 shadow-[0_0_20px_rgba(63,180,224,0.3)] ring-1 ring-cyan"
                  : isPassed
                  ? "border-white/20 bg-white/[0.05] text-white/80 hover:border-white/40"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white/70"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isActive ? "text-cyan" : "text-white/40"}>{s.step}</span>
                {isPassed ? (
                  <Check className="h-3 w-3 text-cyan" />
                ) : isActive ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
                  </span>
                ) : null}
              </div>
              <strong className="mt-1 text-xs font-bold tracking-wide text-white group-hover:text-cyan transition-colors">
                {s.title}
              </strong>
              <small className="mt-0.5 line-clamp-1 text-[10px] text-white/60">
                {s.subtitle}
              </small>
            </button>
          );
        })}
      </div>

      {/* CMYK Ink Gauges & Simulation Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
        {/* CMYK Micro Inking Status */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">CMYK Inking:</span>
          <div className="flex items-center gap-2">
            {[
              { label: "C", color: "bg-[#00A3E0]", level: cLevel },
              { label: "M", color: "bg-[#E6007E]", level: mLevel },
              { label: "Y", color: "bg-[#FFDD00]", level: yLevel },
              { label: "K", color: "bg-white", level: kLevel },
            ].map(({ label, color, level }) => (
              <div key={label} className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold text-white/70">{label}</span>
                <div className="h-2 w-6 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full ${color} transition-[width] duration-150`}
                    style={{ width: `${Math.round(level)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAutoPlay}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
              isAutoPlaying
                ? "bg-cyan text-ink shadow-[0_0_15px_rgba(63,180,224,0.5)]"
                : "border border-white/20 bg-white/5 text-white hover:bg-white/15"
            }`}
          >
            {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isAutoPlaying ? "Pause Press" : "Auto Run 3D"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isAutoPlaying) toggleAutoPlay();
              scrollToHeroStage(0, "hero");
            }}
            title="Reset to Start"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
