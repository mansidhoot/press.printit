import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect, type CSSProperties, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Factory,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Palette,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
  Search,
} from "lucide-react";
import heroPress from "@/assets/hero-press.jpg";
import heroBox from "@/assets/Box_Mockups_OK_3-removebg-preview.png";
import pharmaBox from "@/assets/rahul sweet box.jpg";
import portfolioFinal from "@/assets/PORTFOLIO FINAL.jpg";
import portfolioStationery from "@/assets/ChatGPT Image Jul 30, 2026, 11_14_52 AM.png";
import portfolioBrochure from "@/assets/print it brochure.jpg";
import portfolioBox from "@/assets/Box_Mockups_OK_3.png";

import { products } from "@/lib/products";
import { PriceCalculator } from "@/components/PriceCalculator";
import logo from "@/assets/logo-white.png";

import CmykScrollProgress from "@/components/CmykScrollProgress";
import SampleKitBanner from "@/components/SampleKitBanner";
import TiltCard from "@/components/TiltCard";

import HeroShowcase from "@/components/HeroShowcase";
const FinishesShowcase = lazy(() => import("@/components/FinishesShowcase"));
const PharmaManufacturing3D = lazy(() => import("@/components/PharmaManufacturing3D"));

const PHONE = "+916354535789";
const EMAIL = "press.printit@gmail.com";
const WHATSAPP = `https://wa.me/${PHONE}`;
const INSTAGRAM = "https://www.instagram.com/press.printit_indore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PRINTIT Press & Packaging | Printing Press in Indore" },
      {
        name: "description",
        content:
          "PRINTIT Press & Packaging offers offset printing, digital printing, pharmaceutical packaging, mono cartons, medical stationery, brochures, pamphlets, labels and custom printed materials from Indore.",
      },
      {
        name: "keywords",
        content:
          "printing press in Indore, offset printing Indore, packaging printing Indore, pharma packaging, medicine box printing, prescription pad printing, pamphlet printing, brochure printing, calendar printing, custom packaging",
      },
      { property: "og:title", content: "PRINTIT Press & Packaging | Indore" },
      {
        property: "og:description",
        content:
          "Premium printing and packaging solutions for medical, pharmaceutical, corporate and retail businesses.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { name: "geo.region", content: "IN-MP" },
      { name: "geo.placename", content: "Indore" },
      { name: "geo.position", content: "22.7196;75.8577" },
      { name: "ICBM", content: "22.7196, 75.8577" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PrintingService",
          name: "PRINTIT Press & Packaging",
          image: "https://printitpress.com/logo.png",
          telephone: PHONE,
          email: EMAIL,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rambali Nagar Industrial Area",
            addressLocality: "Indore",
            addressRegion: "Madhya Pradesh",
            postalCode: "452006",
            addressCountry: "IN",
          },
          areaServed: ["Indore", "Madhya Pradesh", "India"],
          priceRange: "₹₹",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "09:30",
              closes: "20:00",
            },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090b11] text-foreground">
      <CmykScrollProgress />
      <Nav />
      <Hero />
      <TrustStrip />
      <Services />
      <Suspense fallback={<div className="h-96 w-full bg-[#090b11]" />}>
        <FinishesShowcase />
      </Suspense>
      <ProductsGrid />
      <PharmaSection />
      <SampleKitBanner />
      <CalculatorSection />
      <WhyUs />
      <Process />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#finishes", label: "3D Finishes", badge: "3D" },
    { href: "#products", label: "Products" },
    { href: "#calculator", label: "Pricing" },
    { href: "#why", label: "Why Us" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/15 bg-[#090b11]/95 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.7)]"
          : "border-b border-white/10 bg-[#090b11]/80 backdrop-blur-xl"
      }`}
    >
      <div className="container mx-auto flex h-20 sm:h-24 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo with larger size */}
        <a href="#" className="group flex items-center gap-3.5 focus:outline-none" aria-label="PRINTIT home">
          <img
            src={logo}
            alt="PRINTIT Press & Packaging"
            width={200}
            height={80}
            className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          {/* <div className="hidden lg:flex flex-col border-l border-white/15 pl-3 py-0.5 leading-tight">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan">Indore Press</span>
            <span className="text-[10px] font-medium text-white/50">Est. 1997</span>
          </div> */}
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-2 lg:gap-3 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded-full border border-cyan/40 bg-cyan/15 px-2 py-0.5 text-[10px] font-bold text-cyan group-hover:bg-cyan group-hover:text-ink transition-colors">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Mobile Header Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white active:scale-95 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="border-t border-white/10 bg-[#090b11]/98 px-5 py-6 md:hidden shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-cyan/20 border border-cyan/40 px-2 py-0.5 text-[10px] font-bold text-cyan">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="h-4 w-4 text-white/40" />
                )}
              </a>
            ))}

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3 text-sm font-bold text-black shadow-lg"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <a
                href={`tel:${PHONE}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4 text-cyan" /> Call {PHONE}
              </a>
              <a
                href="#calculator"
                onClick={() => setOpen(false)}
                className="btn-primary justify-center text-sm py-3 mt-1"
              >
                Calculate Price <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-3 text-center text-[11px] text-white/40">
              Indore Press Facility • Mon–Sat 9:30 AM–8:00 PM
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero hero-printing relative isolate overflow-hidden bg-[#090b11] text-white">
      <img
        src={heroPress}
        alt="Commercial offset printing press"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,11,17,.98)_0%,rgba(9,11,17,.92)_45%,rgba(9,11,17,.65)_100%)]" />
      <div className="absolute inset-0 -z-10 hero-grid opacity-25" />

      <div className="hero-printing-sticky container relative mx-auto grid items-center gap-10 px-4 pt-8 pb-12 lg:pt-12 lg:pb-16 lg:grid-cols-2 lg:gap-12">
        <div className="hero-copy max-w-3xl">
          <div className="eyebrow-dark">
            <Sparkles className="h-3.5 w-3.5 text-cyan" /> Printing & Packaging from Indore · Since 1997
          </div>
          <h1 className="mt-7 text-5xl font-bold leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-8xl">
            Print that makes your <span className="text-gradient-cmyk">brand visible.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
            Premium offset printing, pharmaceutical packaging, medical stationery and custom printed products —
            crafted with industrial precision, consistency and care.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#calculator" className="btn-primary btn-lg">
              Calculate Instant Price <ArrowRight className="h-5 w-5" />
            </a>
            <a href="#finishes" className="btn-ghost-dark btn-lg">
              Explore 3D Finishes <ChevronRight className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/70">
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-cyan" /> 25+ years press experience
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-cyan" /> Custom quantities & finishes
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-cyan" /> Pan-India delivery
            </span>
          </div>
        </div>

        <div className="w-full">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const stats = [
    ["25+", "Years of experience"],
    ["Since 1997", "Printing expertise"],
    ["Custom", "Sizes, papers & finishes"],
    ["Pan-India", "Business deliveries"],
  ];
  return (
    <section className="border-b border-white/10 bg-[#0c0f17] text-white">
      <div className="container mx-auto grid grid-cols-2 divide-x divide-y divide-white/10 px-4 md:grid-cols-4 md:divide-y-0">
        {stats.map(([value, label]) => (
          <div key={label} className="px-5 py-7 text-center md:px-8">
            <div className="text-2xl font-bold tracking-tight text-white md:text-3xl">{value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[.16em] text-white/50">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: Printer,
      title: "Commercial Offset Printing",
      desc: "High-volume, color-calibrated printing for brochures, catalogues, stationery, books, and marketing campaigns.",
    },
    {
      icon: Sparkles,
      title: "High-Speed Digital Printing",
      desc: "Fast production for short runs, urgent needs, personalized marketing collateral, flyers, and event badges.",
    },
    {
      icon: Boxes,
      title: "Custom Mono Cartons & Boxes",
      desc: "Retail packaging, sweet boxes, cosmetic cartons, and corrugated outer boxes engineered for shelf appeal.",
    },
    {
      icon: ShieldCheck,
      title: "Pharma & Medical Stationery",
      desc: "Medicine cartons, tamper-evident labels, prescription pads, patient files, and GMP compliant literature.",
    },
    {
      icon: Palette,
      title: "Luxury Finishes & Foiling",
      desc: "24K metallic hot foil, spot UV gloss, embossing, debossing, matte lamination, and laser die-cutting.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Corporate Identity Essentials",
      desc: "Executive letterheads, luxury visiting cards, presentation folders, invoice books, and custom paper bags.",
    },
  ];

  return (
    <section id="services" className="section-pad bg-[#090b11] text-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="What we do"
          title="From blank paper to a finished brand experience."
          text="One printing partner for everyday business stationery, high-volume commercial jobs, and specialized custom packaging."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <TiltCard key={s.title} maxTilt={6} scale={1.02} className="h-full">
              <article
                className="service-card group h-full flex flex-col justify-between"
                style={{ "--delay": `${i * 60}ms` } as CSSProperties}
              >
                <div>
                  <div className="service-icon">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-7 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">{s.title}</h3>
                    <ArrowRight className="mt-1 h-5 w-5 text-white/50 transition group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">{s.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan">
                  <span>Explore capabilities</span>
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Packaging", "Marketing", "Corporate", "Publications"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.blurb.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="section-pad bg-[#0c0f17] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our products"
            title="Printed products for every part of your business."
            text="Explore popular formats with indicative pricing. Select any product to estimate instant pricing or share custom dimensions on WhatsApp."
          />
          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search products, boxes, cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/15 bg-[#141824] pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-cyan text-ink shadow-sm scale-105"
                  : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat === "All" ? `All Products (${products.length})` : cat}
            </button>
          ))}
        </div>

        {/* Products Grid with 3D Tilt Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p, i) => (
            <TiltCard key={p.slug} maxTilt={6} scale={1.015} className="h-full">
              <a
                href="#calculator"
                className="product-card group flex h-full flex-col justify-between"
                style={{ "--delay": `${i * 35}ms` } as CSSProperties}
              >
                <div>
                  <div className="product-image-wrap">
                    <img
                      src={p.image}
                      alt={`${p.name} printing by PRINTIT`}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="product-image"
                    />
                    <span className="product-badge">PRINTIT</span>
                    {p.specs && (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md border border-white/10">
                        {p.specs}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-white">{p.name}</h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-cyan transition group-hover:translate-x-1" />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">{p.blurb}</p>
                  </div>
                </div>

                <div className="border-t border-white/10 px-5 py-3 flex items-center justify-between text-xs bg-white/[0.02]">
                  <span className="font-semibold text-white/60">From ₹{p.basePer100}/100</span>
                  <span className="font-bold uppercase tracking-wider text-cyan group-hover:underline">
                    Calculate & Quote →
                  </span>
                </div>
              </a>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function PharmaSection() {
  const items = [
    "Medicine boxes & mono cartons",
    "Pharmaceutical product labels",
    "Prescription pads & Rx stationery",
    "Doctor files & OPD folders",
    "Patient information leaflets & inserts",
    "Medical hospital letterheads & bills",
  ];

  return (
    <section id="pharma" className="section-pad overflow-hidden bg-[#090b11] text-white relative">
      <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <div className="eyebrow-dark">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan" /> Medical & pharmaceutical printing
          </div>
          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Precision printing for healthcare & pharma.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
            From medicine packaging with tamper-evident folds to doctor prescription pads, we assist hospitals, clinics,
            and pharmaceutical brands in maintaining a pristine, GMP-compliant printed standard.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-cyan shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Interactive 6-Stage Manufacturing Workflow Guide */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-white/80">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                Live 3D Manufacturing Line
              </span>
              <span className="text-cyan text-[11px]">6 Automated Stages</span>
            </div>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[10px] font-semibold text-white/70">
              <div className="rounded-lg bg-white/10 py-1.5">01 Sheet Feed</div>
              <div className="rounded-lg bg-white/10 py-1.5">02 Print Rx</div>
              <div className="rounded-lg bg-white/10 py-1.5">03 Lamination</div>
              <div className="rounded-lg bg-white/10 py-1.5">04 Die-Punch</div>
              <div className="rounded-lg bg-white/10 py-1.5">05 Pasting</div>
              <div className="rounded-lg bg-cyan/20 py-1.5 text-cyan font-bold">06 3D Box</div>
            </div>
            <p className="mt-2.5 text-[11px] text-white/50">
              Use the interactive 3D video controls on the right to scrub, pause, or inspect each manufacturing stage.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-primary btn-lg">
              Get a Pharma Quote <MessageCircle className="h-5 w-5" />
            </a>
            <a href={`tel:${PHONE}`} className="btn-ghost-dark btn-lg">
              Call Pharma Desk <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative w-full">
          {/* Ambient colored back-glow */}
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan/15 via-rose-500/10 to-indigo-500/10 blur-3xl" />

          {/* 3D Animated Video Simulation */}
          <Suspense
            fallback={
              <div className="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#111420] text-sm text-white/60">
                <span className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
                Loading 3D Pharma Manufacturing Line...
              </div>
            }
          >
            <PharmaManufacturing3D />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section id="calculator" className="section-pad bg-[#090b11] text-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Quick estimate"
          title="Start with a rough price. Finish with a real quote."
          text="Use our dynamic price calculator for an instant estimate, then share your specs directly to our team on WhatsApp for final scheduling."
        />
        <div className="mt-10">
          <PriceCalculator />
        </div>
        <p className="mt-4 text-center text-xs text-white/50">
          Estimates are indicative. Final quotation depends on exact dimensions, paper stock GSM, custom finishes, and delivery destination.
        </p>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    {
      icon: Clock3,
      title: "Reliable On-Time Turnaround",
      desc: "Clear timelines and proactive production scheduling for both everyday commercial batches and urgent dispatches.",
    },
    {
      icon: ShieldCheck,
      title: "Precision Quality Checks",
      desc: "Multi-point pre-press review, color density calibration, and post-finishing inspection before goods are packed.",
    },
    {
      icon: Factory,
      title: "25+ Years Print Engineering",
      desc: "Extensive craftsmanship across offset printing, mono carton packaging, corporate stationery, and die-cutting.",
    },
    {
      icon: Truck,
      title: "Pan-India Logistics Support",
      desc: "Local pickup in Indore or secured courier and freight dispatch to client warehouses and outlets across India.",
    },
  ];
  return (
    <section id="why" className="section-pad bg-[#0c0f17] text-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Why PRINTIT"
          title="A print partner that understands the finer details."
          text="Good printing is not just ink on paper. It is about substrate thickness, color fidelity, finishing longevity, and getting the final product right every time."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <TiltCard key={item.title} maxTilt={6} scale={1.02} className="h-full">
              <div className="why-card h-full flex flex-col justify-between">
                <div>
                  <item.icon className="h-7 w-7 text-cyan" />
                  <h3 className="mt-5 font-bold text-lg text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{item.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-xs font-semibold text-cyan">
                  PRINTIT Quality Assured
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ["01", "Share Your Requirements", "Tell us your product type, dimensions, quantity, paper stock, and finish preferences."],
    ["02", "Instant Quotation", "Our estimators evaluate your specifications and provide a competitive, transparent quote."],
    ["03", "Pre-Press & Proofing", "Artwork files are checked for bleed, CMYK color profiles, and die-line accuracy."],
    ["04", "Production & Delivery", "Printing, lamination, die-cutting, packaging, and timely dispatch to your address."],
  ];
  return (
    <section className="section-pad bg-[#090b11] text-white">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="How it works" title="Simple process. Industrial output." />
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map(([number, title, desc]) => (
            <TiltCard key={number} maxTilt={6} scale={1.02} className="h-full">
              <div className="process-card h-full flex flex-col justify-between">
                <div>
                  <div className="process-number">{number}</div>
                  <h3 className="mt-5 font-bold text-lg text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
                </div>
                <div className="mt-5 text-[11px] font-bold uppercase tracking-wider text-white/40">
                  Step {number}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const work = [
    { image: portfolioFinal, label: "Custom Packaging & Boxes" },
    { image: portfolioStationery, label: "Printed Corporate Stationery" },
    { image: portfolioBrochure, label: "Brochures & Marketing Materials" },
    { image: portfolioBox, label: "Mono Cartons & Product Boxes" },
  ];

  return (
    <section className="section-pad bg-[#0c0f17] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading
            eyebrow="Selected work"
            title="Print products that are built to be noticed."
            text="A visual sample of the commercial, corporate, and packaging print solutions produced by PRINTIT."
          />
          <a href="#contact" className="btn-ghost-dark">
            Start your project <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {work.map((item) => (
            <TiltCard key={item.label} maxTilt={6} scale={1.02} className="h-full">
              <div className="portfolio-card group h-full">
                <img src={item.image} alt={item.label} loading="lazy" />
                <div className="portfolio-caption">{item.label}</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section-pad bg-[#090b11] text-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Customer experience"
          title="Quality is easiest to notice in the final product."
          text="We focus on dependable production, clear communication, and practical paper and finishing recommendations."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            "Clear communication and transparent estimates from initial query to final delivery.",
            "Invaluable guidance on paper weights, spot UV contrasts, and structural carton folding.",
            "Our go-to printing press in Indore for repeat corporate stationery and marketing orders.",
          ].map((text, idx) => (
            <TiltCard key={idx} maxTilt={5} scale={1.01} className="h-full">
              <div className="quote-card h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl leading-none text-cyan font-serif">“</div>
                  <p className="mt-3 text-lg font-semibold leading-7 text-white/90">{text}</p>
                </div>
                <div className="mt-7 flex items-center gap-2 text-sm text-white/50">
                  <CheckCircle2 className="h-4 w-4 text-cyan" /> Verified Client Review
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const requirement = String(form.get("requirement") || "");
    const message = `Hello PRINTIT, I need a quotation.\nName: ${name}\nPhone: ${phone}\nRequirement: ${requirement}`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <section id="contact" className="section-pad pt-8 bg-[#0c0f17] text-white">
      <div className="container mx-auto px-4">
        <div className="contact-panel border border-white/10 bg-gradient-to-br from-[#121520] to-[#0c0e14]">
          <div>
            <div className="eyebrow-dark">
              <MessageCircle className="h-3.5 w-3.5 text-cyan" /> Get a quotation
            </div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl text-white">
              Have a printing requirement?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Tell us what you want to print. For the most accurate quotation, include approximate quantity, size,
              paper GSM, and desired finishes.
            </p>

            <div className="mt-9 grid gap-4 text-sm text-white/80">
              <a href={`tel:${PHONE}`} className="contact-line">
                <Phone className="h-5 w-5 text-cyan" /> {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="contact-line">
                <Mail className="h-5 w-5 text-cyan" /> {EMAIL}
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="contact-line">
                <Instagram className="h-5 w-5 text-cyan" /> @press.printit_indore
              </a>
              <div className="contact-line">
                <MapPin className="h-5 w-5 text-cyan shrink-0" /> Rambali Nagar Industrial Area, Indore, Madhya Pradesh
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${PHONE}`} className="btn-primary">
                Call for Quotation <Phone className="h-4 w-4" />
              </a>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-ghost-dark">
                WhatsApp Us <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                Name <input name="name" required placeholder="Your name" />
              </label>
              <label>
                Phone <input name="phone" required type="tel" placeholder="+91 ..." />
              </label>
            </div>
            <label>
              Email <input name="email" type="email" placeholder="you@company.com" />
            </label>
            <label>
              Printing requirement
              <textarea
                name="requirement"
                required
                rows={5}
                placeholder="Example: 1,000 medicine boxes, 350 GSM board, matte lamination and gold foil on logo..."
              />
            </label>
            <button type="submit" className="btn-primary w-full justify-center">
              Send Enquiry on WhatsApp <ArrowRight className="h-4 w-4" />
            </button>
            {submitted && (
              <p className="text-center text-xs text-cyan">
                WhatsApp opened with your enquiry. If it did not open, use the WhatsApp button on the left.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06070a] text-white">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src={logo} alt="PRINTIT" className="h-11 w-auto brightness-110" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
            Commercial offset, digital printing, and custom packaging solutions for businesses that value consistency,
            color accuracy, and presentation.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-btn border-white/15 text-white/70 hover:text-white hover:border-cyan">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href="#contact" aria-label="Contact" className="social-btn border-white/15 text-white/70 hover:text-white hover:border-cyan">
              <Phone className="h-4 w-4" />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Email" className="social-btn border-white/15 text-white/70 hover:text-white hover:border-cyan">
              <Mail className="h-4 w-4" />
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-btn border-white/15 text-white/70 hover:text-white hover:border-cyan">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        <FooterColumn
          title="Services"
          links={[
            "Commercial Offset Printing",
            "High-Speed Digital Printing",
            "Custom Mono Cartons",
            "Pharma & Medical Printing",
            "Luxury Finishes & Foiling",
          ]}
        />
        <FooterColumn
          title="Products"
          links={[
            "Business Cards",
            "Brochures & Catalogues",
            "Flyers & Leaflets",
            "Mono Carton Boxes",
            "Stickers & Labels",
          ]}
        />
        <FooterColumn
          title="Company"
          links={["Why PRINTIT", "How it works", "3D Finishes", "Price Calculator", "Contact"]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} PRINTIT Printing, Packaging & Designing Solutions.</span>
          <span>Indore, Madhya Pradesh · Serving commercial printing across India</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-white/65">
        {links.map((link) => (
          <li key={link}>
            <a
              href={
                link === "Contact"
                  ? "#contact"
                  : link === "Price Calculator"
                  ? "#calculator"
                  : link === "Why PRINTIT"
                  ? "#why"
                  : link === "3D Finishes"
                  ? "#finishes"
                  : link === "How it works"
                  ? "#services"
                  : "#products"
              }
              className="hover:text-cyan transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float group"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute right-16 rounded-xl bg-black/90 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap pointer-events-none border border-white/15">
        💬 Fast WhatsApp Quote
      </span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500" />
      </span>
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow-dark">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      {text && (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
          {text}
        </p>
      )}
    </div>
  );
}
