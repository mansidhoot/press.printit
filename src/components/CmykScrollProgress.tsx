import { useEffect, useState } from "react";

export default function CmykScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docEl = document.documentElement;
          const totalHeight = docEl.scrollHeight - window.innerHeight;
          const currentProgress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
          setProgress(Math.min(100, Math.max(0, currentProgress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-black/10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #00A3E0 0%, #E6007E 35%, #FFDD00 70%, #15161C 100%)",
          boxShadow: "0 0 10px rgba(0, 163, 224, 0.7), 0 0 5px rgba(230, 0, 126, 0.5)",
        }}
      />
    </div>
  );
}
