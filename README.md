# Mondal Export Import — B2B Export Website

Official web platform for **Mondal Export Import** ("A Trusted Name in Foreign Trade"), an ISO 9001:2015 certified One Star Export House exporting agricultural commodities, fresh fruits, fresh vegetables, and spices worldwide since 2017.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4 (`Fraunces` + `DM Sans` + `JetBrains Mono`)
- **Animations:** Framer Motion (`motion/react`), GSAP ScrollTrigger, Lenis smooth scrolling (with full `prefers-reduced-motion` compliance)
- **Backend / SEO Server:** Express (`server.ts`) serving `/api/enquiry` (Zod validation + rate limiting + optional Resend/webhook forwarding), `/sitemap.xml`, `/robots.txt`, and 301 redirects from legacy WordPress URLs (`redirects.json`)

## Setup & Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (optional email/webhook keys in `.env` based on `.env.example`):
   - `APP_URL` — Public site URL for `sitemap.xml` and canonical links
   - `RESEND_API_KEY` — Optional Resend key to email enquiries directly to `info@mondalexportimport.com`
   - `ENQUIRY_WEBHOOK_URL` — Optional Google Sheets / CRM webhook endpoint
3. Start development server on port 3000:
   ```bash
   npm run dev
   ```
4. Build and run production bundle:
   ```bash
   npm run build
   npm start
   ```

## Managing the Product Catalogue (`/data/products.json`)

All 45 export products are managed in `/data/products.json` as the single source of truth.

To add or edit a product:
1. Place its product image inside `/public/products/` (recommended 4:3 aspect ratio, WebP/JPG).
2. Add or update an entry in `/data/products.json` following the schema:
   ```json
   {
     "slug": "your-product-slug",
     "name": "Product Name",
     "category": "agriculture | fruits | vegetables | spices",
     "image": "/products/your-image.webp",
     "gallery": [],
     "shortDescription": "Concise 140-character summary...",
     "description": "Full product export description...",
     "specs": {
       "origin": "India",
       "packaging": "25 kg / 50 kg bags",
       "moq": "20 MT",
       "privateLabel": true,
       "incoterms": "FOB / CIF (TBC)"
     },
     "certifications": ["ISO 9001:2015", "FSSAI", "APEDA"],
     "needsUniqueImage": false,
     "seo": {
       "title": "Product Exporter India | Mondal Export Import",
       "description": "Meta description..."
     }
   }
   ```
3. Products flagged with `"needsUniqueImage": true` (Soybean Meal, Wheat Bran, Cauliflower, Drum Stick, Mustard Seeds) currently share placeholder images and can be surfaced on `/products` via **Show Shared Image Flags** until replaced.

## Legacy WordPress 301 Redirects
All legacy WordPress duplicate product and category URLs are mapped in `/redirects.json` and enforced with HTTP `301` redirects inside `server.ts`.
