import { useState } from "react";
import { Sparkles, Layers, Package, ShieldCheck, Printer, Star, ArrowRight, Zap } from "lucide-react";
import { TiltCard } from "./TiltCard";
import heroBox from "@/assets/Box_Mockups_OK_3-removebg-preview.png";
import portfolioFinal from "@/assets/PORTFOLIO FINAL.jpg";
import portfolioStationery from "@/assets/ChatGPT Image Jul 30, 2026, 11_14_52 AM.png";

const SHOWCASE_ITEMS = [
  {
    id: "packaging",
    label: "Custom Mono Cartons",
    tag: "Packaging & Boxes",
    title: "Tuck Mono Cartons",
    description: "Engineered with 350 GSM virgin SBS food-grade paperboard, interlocking tuck flaps, and luxury hot foil stamping.",
    image: heroBox,
    isCutout: true,
    badges: [
      { text: "350 GSM Virgin Board", icon: Layers, color: "text-cyan" },
      { text: "Spot UV & Gold Foil", icon: Sparkles, color: "text-amber-400" },
      { text: "Laser Die-Cut Creases", icon: Package, color: "text-rose-400" },
      { text: "ISO 9001 & GMP Grade", icon: ShieldCheck, color: "text-emerald-400" },
    ],
    pricing: "From ₹4.50 / box",
    leadTime: "48–72h Fast Dispatch",
  },
  {
    id: "brochures",
    label: "Brochures & Catalogs",
    tag: "Commercial Print",
    title: "Multi-Page Lookbooks & Catalogues",
    description: "High-volume 6-color offset printing with velvet soft-touch lamination, metallic foiling, and precision binding.",
    image: portfolioFinal,
    isCutout: false,
    badges: [
      { text: "170–300 GSM Imported Art", icon: Layers, color: "text-cyan" },
      { text: "Velvet Soft-Touch Film", icon: Sparkles, color: "text-amber-400" },
      { text: "Center Stitch / Perfect Bind", icon: Package, color: "text-rose-400" },
      { text: "CMYK Color Calibrated", icon: Printer, color: "text-emerald-400" },
    ],
    pricing: "From ₹8.50 / copy",
    leadTime: "24–48h Quick Run",
  },
  {
    id: "stationery",
    label: "Corporate Identity Kits",
    tag: "Luxury Stationery",
    title: "Executive Business Stationery",
    description: "Premium gold-foiled visiting cards, watermark letterheads, debossed presentation folders, and corporate envelopes.",
    image: portfolioStationery,
    isCutout: false,
    badges: [
      { text: "450 GSM Heavy Textured", icon: Layers, color: "text-cyan" },
      { text: "24K Metallic Hot Foil", icon: Sparkles, color: "text-amber-400" },
      { text: "Blind Embossed Logos", icon: Star, color: "text-rose-400" },
      { text: "Custom Boxed Sets", icon: ShieldCheck, color: "text-emerald-400" },
    ],
    pricing: "From ₹350 / 100 cards",
    leadTime: "Same-Day Dispatch",
  },
];

export default function HeroShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const current = SHOWCASE_ITEMS[activeTab];

  return (
    <div className="relative w-full">
      {/* Ambient Radial Color Backdrop - completely blends with #090b11 */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-gradient-to-tr from-cyan/20 via-rose-500/10 to-indigo-500/15 blur-3xl opacity-80" />

      {/* Category Navigation Pills */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {SHOWCASE_ITEMS.map((item, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan to-blue-500 text-ink shadow-[0_4px_20px_rgba(56,189,248,0.35)] scale-105"
                  : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main 3D Interactive Showcase Card */}
      <TiltCard maxTilt={6} scale={1.015} className="w-full">
        <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#141824]/90 via-[#0f121a]/85 to-[#090b11]/95 p-6 backdrop-blur-xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)]">
          {/* Subtle top glossy sheen line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />

          {/* Top Status & Craft Tag */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
                {current.tag}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
              <Zap className="h-3 w-3" />
              <span>{current.leadTime}</span>
            </div>
          </div>

          {/* Visual Showcase Stage */}
          <div className="relative mt-5 flex min-h-[260px] sm:min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent p-4">
            {/* Center glow behind the product */}
            <div className="pointer-events-none absolute h-48 w-48 rounded-full bg-radial from-cyan/30 via-transparent to-transparent blur-2xl" />

            {current.isCutout ? (
              <div className="relative flex items-center justify-center py-4">
                <img
                  src={current.image}
                  alt={current.title}
                  loading="eager"
                  className="max-h-[250px] sm:max-h-[280px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]"
                />
              </div>
            ) : (
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                <img
                  src={current.image}
                  alt={current.title}
                  loading="eager"
                  className="h-[240px] sm:h-[270px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            )}

            {/* Floating Quality Stamp */}
            <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-cyan" /> PRINTIT Certified
            </div>
          </div>

          {/* Product Headline & Description */}
          <div className="mt-5">
            <h3 className="text-xl font-bold text-white sm:text-2xl">{current.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-white/70 sm:text-sm">
              {current.description}
            </p>
          </div>

          {/* 4 Craft Finish Badges */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {current.badges.map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-white/80"
              >
                <b.icon className={`h-3.5 w-3.5 shrink-0 ${b.color}`} />
                <span className="truncate">{b.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom Interactive Calculator Link */}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Starting Rate
              </span>
              <div className="text-sm font-extrabold text-cyan">{current.pricing}</div>
            </div>

            <a
              href="#calculator"
              className="flex items-center gap-1.5 rounded-full bg-cyan px-4 py-2 text-xs font-bold text-ink transition-transform hover:scale-105 hover:bg-cyan/90 active:scale-95 shadow-md"
            >
              <span>Estimate in Calculator</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
