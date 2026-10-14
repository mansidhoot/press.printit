import { MessageCircle, PackageCheck, Sparkles, CheckCircle2 } from "lucide-react";

const PHONE = "+916354535789";

export default function SampleKitBanner() {
  const whatsappUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(
    "Hello PRINTIT, I would like to request a Free Print & Paper Sample Swatch Kit for my business. Please share delivery details."
  )}`;

  return (
    <section className="relative overflow-hidden border-y border-black/10 bg-gradient-to-r from-[#11141d] via-[#1b2230] to-[#11141d] text-white py-12">
      {/* Decorative CMYK light streaks */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-magenta/20 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan">
              <Sparkles className="h-3.5 w-3.5" /> Free Tactile Swatch Kit
            </div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Feel our paper stocks, boards & finishes before placing your order.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/75 sm:text-base">
              Get an actual physical sample box containing 100–400 GSM art card, unbleached kraft, metallic boards,
              and live samples of Spot UV, Foil Stamping, and Die-cuts sent to your office.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/70 lg:justify-start">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan" /> 12+ Paper & Board Weights
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan" /> Foil & Spot UV Finishes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan" /> Free Dispatch Across India
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan to-blue-500 px-7 py-3.5 text-sm font-bold text-ink shadow-[0_0_25px_rgba(63,180,224,0.4)] transition hover:scale-105 hover:shadow-[0_0_35px_rgba(63,180,224,0.6)]"
            >
              <PackageCheck className="h-5 w-5" /> Request Free Sample Kit
            </a>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              Quick Price Calculator
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
