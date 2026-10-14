import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import {
  Sparkles as SparklesIcon,
  Layers,
  ShieldCheck,
  Eye,
  ArrowRight,
  MessageCircle,
  RotateCw,
  Camera,
  CheckCircle2,
} from "lucide-react";
import FinishesBox, { type FinishType } from "./FinishesBox";
import ScrollScene from "./ScrollScene";

import finishGold from "@/assets/finish-gold.jpg";
import finishSpotUv from "@/assets/finish-spotuv.jpg";
import finishKraft from "@/assets/finish-kraft.jpg";
import finishHolo from "@/assets/finish-holo.jpg";

const PHONE = "+916354535789";

const FINISH_DETAILS: Record<
  FinishType,
  {
    name: string;
    image: string;
    tagline: string;
    description: string;
    bestFor: string[];
    tactileFeel: string;
    specs: string;
  }
> = {
  gold: {
    name: "24K Metallic Hot Foil Stamping",
    image: finishGold,
    tagline: "Mirrored, metallic luxury that catches every ray of light",
    description:
      "Heat-pressed metallic foils create an ultra-reflective, premium finish that commands attention. Ideal for logos, titles, and ornate border flourishes.",
    bestFor: ["Luxury Perfume & Cosmetic Boxes", "VIP Visiting Cards", "Invitation & Gift Packaging", "Certificates"],
    tactileFeel: "Smooth metallic inlay with subtle edge deboss",
    specs: "Gold, Rose Gold, Silver, Copper & Holographic foils",
  },
  spotuv: {
    name: "Precision Raised Spot UV Varnish",
    image: finishSpotUv,
    tagline: "Contrast deep velvet matte with liquid high-gloss highlights",
    description:
      "A high-build glossy polymer is cured onto specific areas over a velvet-matte laminated card, creating dramatic contrast and tactile depth.",
    bestFor: ["Mono Cartons", "Premium Book Covers", "Corporate Folders", "Product Packaging"],
    tactileFeel: "Raised 3D gloss ridges against silky matte backdrop",
    specs: "Spot gloss up to 60 microns elevation",
  },
  kraft: {
    name: "Textured Kraft Board & 3D Embossing",
    image: finishKraft,
    tagline: "Earth-friendly, organic warmth with sculpted 3D relief",
    description:
      "Virgin unbleached kraft board stamped with custom brass dies to raise your logo into a physical 3D relief without using plastic laminates.",
    bestFor: ["Eco Packaging", "Artisan Food & Sweet Boxes", "Garment Tags", "Organic Cosmetics"],
    tactileFeel: "Warm fibrous grain with deep sculpted paper relief",
    specs: "280–450 GSM virgin biodegradable kraft board",
  },
  holo: {
    name: "Holographic Tamper-Proof Security Seal",
    image: finishHolo,
    tagline: "Prismatic color-shift for authenticity and anti-counterfeiting",
    description:
      "Multi-spectrum diffraction foils that shift colors as the angle changes. Widely required for pharmaceutical cartons, FMCG seals, and high-value merchandise.",
    bestFor: ["Medicine Packaging", "Pharma Security Seals", "Electronics Cartons", "Warranty Cards"],
    tactileFeel: "Micro-etched optical diffraction foil surface",
    specs: "Custom 2D/3D holographic patterns & void tamper evidence",
  },
};

export default function FinishesShowcase() {
  const [activeFinish, setActiveFinish] = useState<FinishType>("gold");
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");

  useEffect(() => {
    setMounted(true);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const listener = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener("change", listener);
    return () => motionQuery.removeEventListener("change", listener);
  }, []);

  const detail = FINISH_DETAILS[activeFinish];
  const whatsappUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(
    `Hello PRINTIT, I am interested in custom printing with ${detail.name}. Please share details and pricing.`
  )}`;

  const finishList: { id: FinishType; label: string; icon: typeof SparklesIcon; image: string }[] = [
    { id: "gold", label: "Gold Foil Stamping", icon: SparklesIcon, image: finishGold },
    { id: "spotuv", label: "Spot UV Gloss", icon: Layers, image: finishSpotUv },
    { id: "kraft", label: "Embossed Kraft", icon: Eye, image: finishKraft },
    { id: "holo", label: "Holographic Seal", icon: ShieldCheck, image: finishHolo },
  ];

  return (
    <section id="finishes" className="section-pad relative overflow-hidden bg-[#090b11] text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-magenta/15 blur-[130px]" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow-dark">
              <SparklesIcon className="h-3.5 w-3.5 text-cyan" /> Interactive 3D Finish Lab
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Touch, light & texture. <span className="text-gradient-cmyk">In real 3D.</span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/70">
              See actual photographic finishes and interactive 3D light reflections. Click any finish to inspect
              surface textures, specs, and real-world sample imagery.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-md self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                viewMode === "3d" ? "bg-cyan text-ink shadow-sm" : "text-white/70 hover:text-white"
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" /> 3D Live View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("photo")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                viewMode === "photo" ? "bg-cyan text-ink shadow-sm" : "text-white/70 hover:text-white"
              }`}
            >
              <Camera className="h-3.5 w-3.5" /> Real Photo Macro
            </button>
          </div>
        </div>

        {/* Finish Selector Strip with Real Photo Thumbnails */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {finishList.map(({ id, label, icon: Icon, image }) => {
            const isActive = activeFinish === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFinish(id)}
                className={`group flex items-center gap-3 rounded-2xl border p-2 text-left transition-all duration-300 ${
                  isActive
                    ? "border-cyan bg-white/10 shadow-[0_0_25px_rgba(56,189,248,0.35)] ring-1 ring-cyan"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <img
                  src={image}
                  alt={label}
                  className="h-12 w-12 rounded-xl object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white/60">
                    <Icon className="h-3 w-3 text-cyan" />
                    <span>Finish</span>
                  </div>
                  <strong className="block truncate text-xs font-bold text-white group-hover:text-cyan transition-colors">
                    {label}
                  </strong>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Display Stage: 3D or Photo View + Details */}
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Visual Display Box */}
          <div className="relative flex aspect-square max-h-[560px] w-full items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {viewMode === "3d" ? (
              <>
                {/* 3D Hint Badge */}
                <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-md">
                  <RotateCw className="h-3.5 w-3.5 animate-spin text-cyan" style={{ animationDuration: "6s" }} />
                  Scroll or move cursor to gleam light
                </div>

                {/* Live finish badge */}
                <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  3D Finish: <span className="text-cyan">{detail.name}</span>
                </div>

                {mounted ? (
                  <div className="h-full w-full">
                    <Canvas
                      shadows
                      dpr={[1, 2]}
                      camera={{ position: [0, 0, 6.2], fov: 42 }}
                      gl={{ antialias: true, alpha: true }}
                    >
                      <ambientLight intensity={0.8} />
                      <directionalLight position={[4, 5, 4]} intensity={2.4} castShadow color="#ffffff" />
                      <pointLight position={[-4, 2, 3]} intensity={1.5} color="#38bdf8" />
                      <pointLight position={[3, -3, 2]} intensity={1.2} color="#f59e0b" />
                      <Environment preset="studio" />

                      <Suspense fallback={null}>
                        <FinishesBox finish={activeFinish} reducedMotion={reducedMotion} />
                      </Suspense>

                      <Sparkles count={30} scale={[5, 5, 3]} size={1.8} speed={0.4} color="#ffffff" opacity={0.35} />
                      <ContactShadows position={[0, -2.1, 0]} opacity={0.65} scale={8} blur={2.5} far={4} />
                    </Canvas>
                    <ScrollScene mode="finishes" sectionId="finishes" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-sm text-white/50">
                    Loading 3D Finish Canvas...
                  </div>
                )}
              </>
            ) : (
              /* High-Res Photographic Macro View */
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <img
                  src={detail.image}
                  alt={detail.name}
                  className="h-full w-full object-cover rounded-2xl transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-bold bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                    📸 Actual Production Macro Sample
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    className="font-bold text-cyan hover:underline bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md"
                  >
                    Switch to 3D Orbit →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Finish Information Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-8 backdrop-blur-xl sm:p-10">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-bold text-cyan">
                  PREMIUM PRINT FINISH
                </span>
                {/* Photo preview thumbnail */}
                <img
                  src={detail.image}
                  alt={detail.name}
                  className="h-10 w-10 rounded-lg object-cover border border-white/20"
                />
              </div>

              <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{detail.name}</h3>
              <p className="mt-2 text-sm font-medium text-cyan">{detail.tagline}</p>
              <p className="mt-4 text-base leading-7 text-white/75">{detail.description}</p>

              <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">Tactile Feel</div>
                  <div className="mt-1 text-sm font-semibold text-white/90">{detail.tactileFeel}</div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">Specifications</div>
                  <div className="mt-1 text-sm font-semibold text-white/90">{detail.specs}</div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Recommended Applications
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {detail.bestFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Quote This Finish on WhatsApp <MessageCircle className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "3d" ? "photo" : "3d")}
                className="btn-ghost-dark"
              >
                {viewMode === "3d" ? "View Real Photo" : "View in 3D"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
