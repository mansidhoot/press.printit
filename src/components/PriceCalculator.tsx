import { useMemo, useState } from "react";
import { products } from "@/lib/products";

const sides = [
  { id: "single", label: "Single Side", mult: 1 },
  { id: "double", label: "Double Side", mult: 1.6 },
];
const papers = [
  { id: "std", label: "Standard 80gsm", mult: 1 },
  { id: "premium", label: "Premium 100gsm ", mult: 1.2 },
  { id: "lux", label: "Luxury 120gsm ", mult: 1.55 },
];
const finishes = [
  { id: "none", label: "No Finish", mult: 1 },
  { id: "matt", label: "Matt Lamination", mult: 1.15 },
  { id: "gloss", label: "Gloss Lamination", mult: 1.15 },
  { id: "spotuv", label: "Spot UV", mult: 1.35 },
  { id: "foil", label: "Gold / Silver Foil", mult: 1.6 },
];

export function PriceCalculator() {
  const [productSlug, setProductSlug] = useState(products[0].slug);
  const [qty, setQty] = useState(500);
  const [side, setSide] = useState("double");
  const [paper, setPaper] = useState("premium");
  const [finish, setFinish] = useState("matt");

  const product = products.find((p) => p.slug === productSlug)!;

  const changeProduct = (slug: string) => {
    setProductSlug(slug);
    const next = products.find((p) => p.slug === slug);
    if (next) setQty(Math.max(next.minQty, 500));
  };

  const price = useMemo(() => {
    const sideM = sides.find((s) => s.id === side)!.mult;
    const paperM = papers.find((p) => p.id === paper)!.mult;
    const finM = finishes.find((f) => f.id === finish)!.mult;
    const per100 = product.basePer100 * sideM * paperM * finM;
    // volume discount
    const volume = qty >= 5000 ? 0.75 : qty >= 2000 ? 0.85 : qty >= 1000 ? 0.92 : 1;
    return Math.round((per100 / 100) * qty * volume);
  }, [product, qty, side, paper, finish]);

  return (
    <div id="calculator" className="rounded-2xl bg-[#11141e] shadow-card p-6 md:p-10 border border-white/10 text-white">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">Product</label>
            <select
              value={productSlug}
              onChange={(e) => changeProduct(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-[#171b26] text-white px-4 py-3 font-medium outline-none focus:border-primary"
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug} className="bg-[#171b26] text-white">{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Quantity: <span className="text-primary font-bold">{qty.toLocaleString("en-IN")}</span>
            </label>
            <input
              type="range"
              min={product.minQty}
              max={10000}
              step={product.minQty}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value))}
              className="mt-3 w-full accent-primary"
            />
            <div className="flex justify-between text-[11px] text-white/50 mt-1">
              <span>Min {product.minQty}</span>
              <span>10,000+</span>
            </div>
          </div>

          <FieldGroup label="Print Sides" options={sides} value={side} onChange={setSide} />
          <FieldGroup label="Paper" options={papers} value={paper} onChange={setPaper} />
          <FieldGroup label="Finish" options={finishes} value={finish} onChange={setFinish} />
        </div>

        <div className="rounded-xl bg-[#080a0f] text-white p-8 border border-white/10 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan font-bold">Instant Estimate</p>
            <h3 className="mt-2 text-3xl font-bold text-white">{product.name}</h3>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Quantity</span><span className="font-semibold text-white">{qty.toLocaleString("en-IN")}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Sides</span><span className="font-semibold text-white">{sides.find(s=>s.id===side)!.label}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Paper</span><span className="font-semibold text-white">{papers.find(p=>p.id===paper)!.label}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Finish</span><span className="font-semibold text-white">{finishes.find(f=>f.id===finish)!.label}</span></li>
            </ul>
          </div>
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-white/60">Indicative estimate</p>
            <p className="mt-1 text-5xl font-bold text-gradient-cmyk">
              ₹{price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-white/50 mt-2">≈ ₹{(price / qty).toFixed(2)} per unit • Indicative pricing. Final quote depends on exact size, material, finishing and delivery requirements.</p>
            <a
              href="#contact"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition shadow-lg"
            >
              Confirm & Send Enquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({
  label, options, value, onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-white/60">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              value === o.id
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white/5 border-white/15 text-white/80 hover:border-white/35 hover:bg-white/10"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}




// import { useMemo, useState } from "react";
// import { products } from "@/lib/products";

// type Option = {
//   id: string;
//   label: string;
//   mult: number;
// };

// const GST_RATE = 0.18;

// /* -------------------------------------------------------
//    PRODUCT-SPECIFIC OPTIONS
// ------------------------------------------------------- */

// const commonSides: Option[] = [
//   { id: "single", label: "Single Side", mult: 1 },
//   { id: "double", label: "Double Side", mult: 1.6 },
// ];

// const paperOptions: Option[] = [
//   { id: "std", label: "Standard", mult: 1 },
//   { id: "premium", label: "Premium", mult: 1.2 },
//   { id: "luxury", label: "Luxury", mult: 1.5 },
// ];

// const finishOptions: Option[] = [
//   { id: "none", label: "No Finish", mult: 1 },
//   { id: "matt", label: "Matt Lamination", mult: 1.15 },
//   { id: "gloss", label: "Gloss Lamination", mult: 1.15 },
//   { id: "spotuv", label: "Spot UV", mult: 1.35 },
//   { id: "foil", label: "Gold / Silver Foil", mult: 1.6 },
// ];

// const stickerMaterials: Option[] = [
//   { id: "paper", label: "Paper Sticker", mult: 1 },
//   { id: "opaque", label: "Opaque Sticker", mult: 1.25 },
//   { id: "transparent", label: "Transparent", mult: 1.4 },
//   { id: "metallic", label: "Metallic", mult: 1.65 },
//   { id: "vinyl", label: "Vinyl", mult: 1.5 },
// ];

// const stickerFinishes: Option[] = [
//   { id: "none", label: "No Finish", mult: 1 },
//   { id: "matt", label: "Matt", mult: 1.1 },
//   { id: "gloss", label: "Gloss", mult: 1.1 },
//   { id: "lamination", label: "Lamination", mult: 1.2 },
// ];

// const cartonBoards: Option[] = [
//   { id: "250", label: "250 GSM Board", mult: 1 },
//   { id: "300", label: "300 GSM Board", mult: 1.15 },
//   { id: "350", label: "350 GSM Board", mult: 1.3 },
// ];

// const cartonFinishes: Option[] = [
//   { id: "none", label: "Standard", mult: 1 },
//   { id: "matt", label: "Matt Lamination", mult: 1.15 },
//   { id: "gloss", label: "Gloss Lamination", mult: 1.15 },
//   { id: "spotuv", label: "Spot UV", mult: 1.35 },
//   { id: "foil", label: "Foil", mult: 1.55 },
// ];

// const fileTypes: Option[] = [
//   { id: "paper", label: "Paper File", mult: 1 },
//   { id: "plastic", label: "Plastic File", mult: 1.25 },
//   { id: "whiteback", label: "White Back File", mult: 1.1 },
//   { id: "itc", label: "ITC File", mult: 1.2 },
// ];

// const filePrinting: Option[] = [
//   { id: "none", label: "No Printing", mult: 1 },
//   { id: "single", label: "Single Side Print", mult: 1.2 },
//   { id: "double", label: "Double Side Print", mult: 1.4 },
// ];

// const bindingOptions: Option[] = [
//   { id: "saddle", label: "Saddle Stitch", mult: 1 },
//   { id: "perfect", label: "Perfect Binding", mult: 1.25 },
//   { id: "spiral", label: "Spiral Binding", mult: 1.35 },
//   { id: "hardcover", label: "Hardcover", mult: 1.7 },
// ];

// const almanacPages: Option[] = [
//   { id: "32", label: "32 Pages", mult: 1 },
//   { id: "48", label: "48 Pages", mult: 1.25 },
//   { id: "64", label: "64 Pages", mult: 1.5 },
//   { id: "80", label: "80 Pages", mult: 1.8 },
// ];

// const posterSizes: Option[] = [
//   { id: "a3", label: "A3", mult: 1 },
//   { id: "a2", label: "A2", mult: 1.6 },
//   { id: "a1", label: "A1", mult: 2.4 },
// ];

// const bagPaper: Option[] = [
//   { id: "kraft", label: "Kraft Paper", mult: 1 },
//   { id: "art", label: "Art Paper", mult: 1.2 },
//   { id: "premium", label: "Premium Paper", mult: 1.4 },
// ];

// /* -------------------------------------------------------
//    PRODUCT TYPE
// ------------------------------------------------------- */

// function getProductType(slug: string) {
//   switch (slug) {
//     case "business-cards":
//       return "cards";

//     case "brochures":
//       return "brochures";

//     case "flyers":
//       return "flyers";

//     case "books":
//     case "almanac-school":
//       return "almanac";

//     case "packaging":
//       return "carton";

//     case "posters":
//       return "posters";

//     case "stationery":
//       return "stationery";

//     case "magazines":
//       return "magazines";

//     case "stickers":
//       return "stickers";

//     case "standees":
//       return "standees";

//     case "bags":
//       return "bags";

//     case "files":
//       return "files";

//     default:
//       return "general";
//   }
// }

// /* -------------------------------------------------------
//    VOLUME DISCOUNT
// ------------------------------------------------------- */

// function getVolumeDiscount(qty: number) {
//   if (qty >= 10000) return 0.7;
//   if (qty >= 5000) return 0.75;
//   if (qty >= 2500) return 0.82;
//   if (qty >= 1000) return 0.9;

//   return 1;
// }

// /* -------------------------------------------------------
//    FIND OPTION
// ------------------------------------------------------- */

// function getMultiplier(
//   options: Option[],
//   selectedId: string
// ) {
//   return options.find((o) => o.id === selectedId)?.mult ?? 1;
// }

// /* -------------------------------------------------------
//    MAIN COMPONENT
// ------------------------------------------------------- */

// export function PriceCalculator() {
//   const [productSlug, setProductSlug] = useState(products[0].slug);

//   const product = products.find(
//     (p) => p.slug === productSlug
//   )!;

//   const productType = getProductType(productSlug);

//   const [qty, setQty] = useState(
//     Math.max(product.minQty, 500)
//   );

//   const [side, setSide] = useState("double");
//   const [paper, setPaper] = useState("premium");
//   const [finish, setFinish] = useState("matt");

//   const [stickerMaterial, setStickerMaterial] =
//     useState("paper");

//   const [stickerFinish, setStickerFinish] =
//     useState("none");

//   const [cartonBoard, setCartonBoard] =
//     useState("300");

//   const [cartonFinish, setCartonFinish] =
//     useState("matt");

//   const [fileType, setFileType] =
//     useState("paper");

//   const [filePrinting, setFilePrinting] =
//     useState("single");

//   const [binding, setBinding] =
//     useState("saddle");

//   const [pages, setPages] =
//     useState("32");

//   const [posterSize, setPosterSize] =
//     useState("a3");

//   const [bagPaperType, setBagPaperType] =
//     useState("kraft");

//   /* -------------------------------------------------------
//      CALCULATE PRICE
//   ------------------------------------------------------- */

//   const calculation = useMemo(() => {
//     let multiplier = 1;

//     switch (productType) {
//       /* BUSINESS CARDS */
//       case "cards":
//         multiplier =
//           getMultiplier(commonSides, side) *
//           getMultiplier(paperOptions, paper) *
//           getMultiplier(finishOptions, finish);
//         break;

//       /* BROCHURES */
//       case "brochures":
//       case "flyers":
//         multiplier =
//           getMultiplier(commonSides, side) *
//           getMultiplier(paperOptions, paper) *
//           getMultiplier(finishOptions, finish);
//         break;

//       /* STICKERS */
//       case "stickers":
//         multiplier =
//           getMultiplier(
//             stickerMaterials,
//             stickerMaterial
//           ) *
//           getMultiplier(
//             stickerFinishes,
//             stickerFinish
//           );
//         break;

//       /* MONO CARTONS */
//       case "carton":
//         multiplier =
//           getMultiplier(
//             cartonBoards,
//             cartonBoard
//           ) *
//           getMultiplier(
//             cartonFinishes,
//             cartonFinish
//           );
//         break;

//       /* FILES */
//       case "files":
//         multiplier =
//           getMultiplier(fileTypes, fileType) *
//           getMultiplier(
//             filePrinting,
//             filePrinting
//           );
//         break;

//       /* ALMANAC */
//       case "almanac":
//         multiplier =
//           getMultiplier(
//             almanacPages,
//             pages
//           ) *
//           getMultiplier(
//             bindingOptions,
//             binding
//           );
//         break;

//       /* POSTERS */
//       case "posters":
//         multiplier =
//           getMultiplier(
//             posterSizes,
//             posterSize
//           ) *
//           getMultiplier(
//             finishOptions,
//             finish
//           );
//         break;

//       /* PAPER BAGS */
//       case "bags":
//         multiplier =
//           getMultiplier(
//             bagPaper,
//             bagPaperType
//           ) *
//           getMultiplier(
//             commonSides,
//             side
//           );
//         break;

//       /* STATIONERY */
//       case "stationery":
//         multiplier =
//           getMultiplier(
//             paperOptions,
//             paper
//           ) *
//           getMultiplier(
//             commonSides,
//             side
//           );
//         break;

//       /* MAGAZINES */
//       case "magazines":
//         multiplier =
//           getMultiplier(
//             paperOptions,
//             paper
//           ) *
//           getMultiplier(
//             bindingOptions,
//             binding
//           );
//         break;

//       default:
//         multiplier = 1;
//     }

//     const basePrice =
//       product.basePer100 * multiplier;

//     const subtotal =
//       (basePrice / 100) * qty;

//     const volumeDiscount =
//       getVolumeDiscount(qty);

//     const discountedSubtotal =
//       subtotal * volumeDiscount;

//     const gst =
//       discountedSubtotal * GST_RATE;

//     const total =
//       Math.round(
//         discountedSubtotal + gst
//       );

//     const discountAmount =
//       subtotal - discountedSubtotal;

//     return {
//       subtotal,
//       discountAmount,
//       discountedSubtotal,
//       gst,
//       total,
//       unitPrice: total / qty,
//     };
//   }, [
//     product,
//     productType,
//     qty,
//     side,
//     paper,
//     finish,
//     stickerMaterial,
//     stickerFinish,
//     cartonBoard,
//     cartonFinish,
//     fileType,
//     filePrinting,
//     binding,
//     pages,
//     posterSize,
//     bagPaperType,
//   ]);

//   /* -------------------------------------------------------
//      RESET PRODUCT OPTIONS
//   ------------------------------------------------------- */

//   const handleProductChange = (
//     slug: string
//   ) => {
//     setProductSlug(slug);

//     const newProduct = products.find(
//       (p) => p.slug === slug
//     );

//     if (newProduct) {
//       setQty(
//         Math.max(
//           newProduct.minQty,
//           500
//         )
//       );
//     }
//   };

//   /* -------------------------------------------------------
//      RENDER
//   ------------------------------------------------------- */

//   return (
//     <div
//       id="calculator"
//       className="rounded-2xl bg-card shadow-card p-6 md:p-10 border"
//     >
//       <div className="grid md:grid-cols-2 gap-8">

//         {/* LEFT SIDE */}
//         <div className="space-y-5">

//           {/* PRODUCT */}
//           <div>
//             <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               Select Product
//             </label>

//             <select
//               value={productSlug}
//               onChange={(e) =>
//                 handleProductChange(
//                   e.target.value
//                 )
//               }
//               className="mt-2 w-full rounded-lg border bg-background px-4 py-3 font-medium"
//             >
//               {products.map((p) => (
//                 <option
//                   key={p.slug}
//                   value={p.slug}
//                 >
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* QUANTITY */}
//           <div>
//             <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               Quantity:{" "}
//               <span className="text-primary">
//                 {qty.toLocaleString("en-IN")}
//               </span>
//             </label>

//             <input
//               type="range"
//               min={product.minQty}
//               max={10000}
//               step={product.minQty}
//               value={qty}
//               onChange={(e) =>
//                 setQty(
//                   parseInt(e.target.value)
//                 )
//               }
//               className="mt-3 w-full accent-primary"
//             />

//             <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
//               <span>
//                 Min {product.minQty}
//               </span>

//               <span>
//                 10,000+
//               </span>
//             </div>
//           </div>

//           {/* PRODUCT-SPECIFIC OPTIONS */}

//           {(productType === "cards" ||
//             productType === "brochures" ||
//             productType === "flyers") && (
//             <>
//               <FieldGroup
//                 label="Print Sides"
//                 options={commonSides}
//                 value={side}
//                 onChange={setSide}
//               />

//               <FieldGroup
//                 label="Paper"
//                 options={paperOptions}
//                 value={paper}
//                 onChange={setPaper}
//               />

//               <FieldGroup
//                 label="Finish"
//                 options={finishOptions}
//                 value={finish}
//                 onChange={setFinish}
//               />
//             </>
//           )}

//           {/* STICKERS */}

//           {productType === "stickers" && (
//             <>
//               <FieldGroup
//                 label="Sticker Material"
//                 options={stickerMaterials}
//                 value={stickerMaterial}
//                 onChange={setStickerMaterial}
//               />

//               <FieldGroup
//                 label="Sticker Finish"
//                 options={stickerFinishes}
//                 value={stickerFinish}
//                 onChange={setStickerFinish}
//               />
//             </>
//           )}

//           {/* MONO CARTON */}

//           {productType === "carton" && (
//             <>
//               <FieldGroup
//                 label="Board"
//                 options={cartonBoards}
//                 value={cartonBoard}
//                 onChange={setCartonBoard}
//               />

//               <FieldGroup
//                 label="Finishing"
//                 options={cartonFinishes}
//                 value={cartonFinish}
//                 onChange={setCartonFinish}
//               />
//             </>
//           )}

//           {/* FILES */}

//           {productType === "files" && (
//             <>
//               <FieldGroup
//                 label="File Type"
//                 options={fileTypes}
//                 value={fileType}
//                 onChange={setFileType}
//               />

//               <FieldGroup
//                 label="Printing"
//                 options={filePrinting}
//                 value={filePrinting}
//                 onChange={setFilePrinting}
//               />
//             </>
//           )}

//           {/* ALMANAC */}

//           {productType === "almanac" && (
//             <>
//               <FieldGroup
//                 label="Number of Pages"
//                 options={almanacPages}
//                 value={pages}
//                 onChange={setPages}
//               />

//               <FieldGroup
//                 label="Binding"
//                 options={bindingOptions}
//                 value={binding}
//                 onChange={setBinding}
//               />
//             </>
//           )}

//           {/* POSTERS */}

//           {productType === "posters" && (
//             <>
//               <FieldGroup
//                 label="Poster Size"
//                 options={posterSizes}
//                 value={posterSize}
//                 onChange={setPosterSize}
//               />

//               <FieldGroup
//                 label="Finish"
//                 options={finishOptions}
//                 value={finish}
//                 onChange={setFinish}
//               />
//             </>
//           )}

//           {/* BAGS */}

//           {productType === "bags" && (
//             <>
//               <FieldGroup
//                 label="Paper"
//                 options={bagPaper}
//                 value={bagPaperType}
//                 onChange={setBagPaperType}
//               />

//               <FieldGroup
//                 label="Printing"
//                 options={commonSides}
//                 value={side}
//                 onChange={setSide}
//               />
//             </>
//           )}

//           {/* STATIONERY */}

//           {productType === "stationery" && (
//             <>
//               <FieldGroup
//                 label="Paper"
//                 options={paperOptions}
//                 value={paper}
//                 onChange={setPaper}
//               />

//               <FieldGroup
//                 label="Printing"
//                 options={commonSides}
//                 value={side}
//                 onChange={setSide}
//               />
//             </>
//           )}

//           {/* MAGAZINES */}

//           {productType === "magazines" && (
//             <>
//               <FieldGroup
//                 label="Paper"
//                 options={paperOptions}
//                 value={paper}
//                 onChange={setPaper}
//               />

//               <FieldGroup
//                 label="Binding"
//                 options={bindingOptions}
//                 value={binding}
//                 onChange={setBinding}
//               />
//             </>
//           )}
//         </div>

//         {/* RIGHT SIDE */}

//         <div className="rounded-xl bg-ink text-ink-foreground p-8 flex flex-col justify-between">

//           <div>
//             <p className="text-xs uppercase tracking-widest opacity-70">
//               Instant Estimate
//             </p>

//             <h3 className="mt-2 text-3xl font-bold">
//               {product.name}
//             </h3>

//             <ul className="mt-6 space-y-2 text-sm opacity-90">

//               <SummaryRow
//                 label="Quantity"
//                 value={qty.toLocaleString("en-IN")}
//               />

//               {productType === "stickers" && (
//                 <>
//                   <SummaryRow
//                     label="Material"
//                     value={
//                       stickerMaterials.find(
//                         o =>
//                           o.id ===
//                           stickerMaterial
//                       )?.label || ""
//                     }
//                   />

//                   <SummaryRow
//                     label="Finish"
//                     value={
//                       stickerFinishes.find(
//                         o =>
//                           o.id ===
//                           stickerFinish
//                       )?.label || ""
//                     }
//                   />
//                 </>
//               )}

//               {productType === "carton" && (
//                 <>
//                   <SummaryRow
//                     label="Board"
//                     value={
//                       cartonBoards.find(
//                         o =>
//                           o.id ===
//                           cartonBoard
//                       )?.label || ""
//                     }
//                   />

//                   <SummaryRow
//                     label="Finish"
//                     value={
//                       cartonFinishes.find(
//                         o =>
//                           o.id ===
//                           cartonFinish
//                       )?.label || ""
//                     }
//                   />
//                 </>
//               )}

//               {productType === "files" && (
//                 <>
//                   <SummaryRow
//                     label="File Type"
//                     value={
//                       fileTypes.find(
//                         o =>
//                           o.id ===
//                           fileType
//                       )?.label || ""
//                     }
//                   />

//                   <SummaryRow
//                     label="Printing"
//                     value={
//                       filePrinting.find(
//                         o =>
//                           o.id ===
//                           filePrinting
//                       )?.label || ""
//                     }
//                   />
//                 </>
//               )}

//               {productType === "almanac" && (
//                 <>
//                   <SummaryRow
//                     label="Pages"
//                     value={
//                       almanacPages.find(
//                         o =>
//                           o.id === pages
//                       )?.label || ""
//                     }
//                   />

//                   <SummaryRow
//                     label="Binding"
//                     value={
//                       bindingOptions.find(
//                         o =>
//                           o.id === binding
//                       )?.label || ""
//                     }
//                   />
//                 </>
//               )}

//               {productType === "posters" && (
//                 <SummaryRow
//                   label="Size"
//                   value={
//                     posterSizes.find(
//                       o =>
//                         o.id === posterSize
//                     )?.label || ""
//                   }
//                 />
//               )}

//               <SummaryRow
//                 label="Volume Discount"
//                 value={
//                   calculation.discountAmount > 0
//                     ? `₹${calculation.discountAmount.toLocaleString(
//                         "en-IN"
//                       )}`
//                     : "None"
//                 }
//               />
//             </ul>
//           </div>

//           {/* PRICE */}

//           <div className="mt-8">

//             <p className="text-xs uppercase tracking-widest opacity-70">
//               Total Incl. GST
//             </p>

//             <p className="mt-1 text-5xl font-bold text-gradient-cmyk">
//               ₹
//               {calculation.total.toLocaleString(
//                 "en-IN"
//               )}
//             </p>

//             <p className="text-xs opacity-60 mt-2">
//               ≈ ₹
//               {calculation.unitPrice.toFixed(2)}
//               {" "}per unit
//             </p>

//             <p className="text-xs opacity-60 mt-1">
//               18% GST included • Final quote may vary
//               based on size, artwork and specifications.
//             </p>

//             <a
//               href="#contact"
//               className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition"
//             >
//               Confirm & Send Enquiry
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------
//    FIELD GROUP
// ------------------------------------------------------- */

// function FieldGroup({
//   label,
//   options,
//   value,
//   onChange,
// }: {
//   label: string;
//   options: Option[];
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div>
//       <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//         {label}
//       </label>

//       <div className="mt-2 flex flex-wrap gap-2">
//         {options.map((o) => (
//           <button
//             key={o.id}
//             type="button"
//             onClick={() =>
//               onChange(o.id)
//             }
//             className={`rounded-full border px-3 py-1.5 text-sm transition ${
//               value === o.id
//                 ? "bg-primary text-primary-foreground border-primary"
//                 : "bg-background hover:border-primary/50"
//             }`}
//           >
//             {o.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------
//    SUMMARY ROW
// ------------------------------------------------------- */

// function SummaryRow({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <li className="flex justify-between gap-4 border-b border-white/10 pb-2">
//       <span>{label}</span>
//       <span className="text-right">
//         {value}
//       </span>
//     </li>
//   );
// }