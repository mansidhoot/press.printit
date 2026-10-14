import cards from "@/assets/tw.png";
import brochure from "@/assets/p-brochure.jpg";
import flyers from "@/assets/p-flyers.jpg";
import books from "@/assets/Brochure_Mockup_2.png";
import packaging from "@/assets/PORTFOLIO FINAL.jpg";
import posters from "@/assets/p-posters.jpg";
import stationery from "@/assets/p-stationery.jpg";
import magazines from "@/assets/p-magazines.jpg";
import stickers from "@/assets/sticker.png";
import standees from "@/assets/p-standees.jpg";
import bags from "@/assets/p-bags.jpg";
import paperfiles from "@/assets/p-files.jpeg";


export type Product = {
  slug: string;
  name: string;
  image: string;
  blurb: string;
  // price calc: base per unit at qty 100
  basePer100: number;
  minQty: number;
  category?: "Packaging" | "Marketing" | "Corporate" | "Publications";
  specs?: string;
};

export const products: Product[] = [
  {
    slug: "business-cards",
    name: "Business Cards",
    image: cards,
    blurb: "300–350gsm art card with matt, gloss or spot UV finish.",
    basePer100: 180,
    minQty: 100,
    category: "Corporate",
    specs: "350 GSM • Spot UV & Foil",
  },
  {
    slug: "brochures",
    name: "Brochures",
    image: brochure,
    blurb: "Bi-fold and tri-fold brochures on premium art paper.",
    basePer100: 650,
    minQty: 100,
    category: "Marketing",
    specs: "170 GSM Art Paper • Folded",
  },
  {
    slug: "flyers",
    name: "Flyers & Leaflets",
    image: flyers,
    blurb: "A4, A5 and DL flyers, single or double sided.",
    basePer100: 320,
    minQty: 250,
    category: "Marketing",
    specs: "130–170 GSM • High-Speed",
  },
  {
    slug: "almanac-school",
    name: "School Almanac",
    image: books,
    blurb: "Custom school almanacs with student information, academic calendars, activities, and premium printed pages.",
    basePer100: 3200,
    minQty: 50,
    category: "Publications",
    specs: "Perfect Binding • Hard Cover",
  },
  {
    slug: "packaging",
    name: "Mono Carton Boxes",
    image: packaging,
    blurb: "Custom mono carton boxes for sweet boxes, mehendi cones, cosmetics, FMCG products, and retail packaging — designed, printed and finished to match your brand.",
    basePer100: 2400,
    minQty: 100,
    category: "Packaging",
    specs: "300–400 GSM • Custom Die-Cut",
  },
  {
    slug: "posters",
    name: "Posters & Displays",
    image: posters,
    blurb: "High-impact posters for promotions, events and retail — A3, A2, A1 and custom sizes printed on premium paper and display stocks.",
    basePer100: 900,
    minQty: 50,
    category: "Marketing",
    specs: "A3 to A1 • Vivid CMYK",
  },
  {
    slug: "stationery",
    name: "Business Stationery",
    image: stationery,
    blurb: "Professional business essentials including letterheads, envelopes, visiting cards, bills, invoices, forms and customised office stationery.",
    basePer100: 450,
    minQty: 100,
    category: "Corporate",
    specs: "Bond & Executive Paper",
  },
  {
    slug: "magazines",
    name: "Magazines & Catalogues",
    image: magazines,
    blurb: "Premium magazines, product catalogues, company profiles and brochures with sharp printing, quality paper and professional binding.",
    basePer100: 4800,
    minQty: 50,
    category: "Publications",
    specs: "Saddle-stitch / Perfect bind",
  },
  {
    slug: "stickers",
    name: "Stickers & Labels",
    image: stickers,
    blurb: "Custom stickers for every brand and product — FMCG labels, cosmetic bottle stickers, metallic labels, paper stickers, opaque stickers, transparent labels and more, with premium finishes.",
    basePer100: 250,
    minQty: 100,
    category: "Packaging",
    specs: "Vinyl, Chromo, Waterproof",
  },
  {
    slug: "standees",
    name: "Standees & Banners",
    image: standees,
    blurb: "Roll-up standees, flex banners and backdrops.",
    basePer100: 85000,
    minQty: 1,
    category: "Marketing",
    specs: "Aluminum base • Star flex",
  },
  {
    slug: "bags",
    name: "Paper Bags",
    image: bags,
    blurb: "Custom printed paper carry bags for retail brands.",
    basePer100: 2200,
    minQty: 100,
    category: "Packaging",
    specs: "Kraft / Art Card • D-cut & Rope",
  },
  {
    slug: "files",
    name: "Printed Files",
    image: paperfiles,
    blurb: "Custom printed office files, paper files, plastic files and presentation folders with professional finishing.",
    basePer100: 1200,
    minQty: 100,
    category: "Corporate",
    specs: "Clip & Ring mechanism",
  },
];
