# PRINTIT website upgrade

## Main changes
- Reworked the homepage around printing/packaging rather than a generic SaaS layout.
- Added a premium print-studio hero with layered 3D-style paper/packaging cards and motion.
- Added dedicated pharma/medical printing section.
- Expanded services from 3 to 6 core service categories.
- Reworked products into a cleaner portfolio-style grid using existing assets.
- Removed unverified-looking testimonial names and hard-coded social-proof numbers from the public-facing UI.
- Reworked the calculator copy so it is clearly an indicative estimate rather than a guaranteed GST-inclusive quote.
- Fixed calculator quantity reset when switching products.
- Added a WhatsApp enquiry flow to the contact form.
- Added persistent floating WhatsApp CTA.
- Added stronger local SEO metadata and PrintingService JSON-LD for Indore.
- Added reduced-motion support and responsive mobile layouts.
- Kept the existing React/TanStack/Vite architecture and existing assets; no new runtime dependency is required.

## Files changed
- `src/routes/index.tsx`
- `src/styles.css`
- `src/components/PriceCalculator.tsx`

## Deployment
Run:

```bash
npm install
npm run build
```

Then deploy the project to Vercel/Netlify using the existing Vite/TanStack configuration.

Note: the uploaded source archive's `node_modules` contained an incomplete native Rolldown/Vite optional dependency in this inspection environment, so a local build could not be completed here. The project source itself remains structured for the existing build pipeline.
