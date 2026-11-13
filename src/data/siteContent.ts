export interface Product {
  slug: string;
  name: string;
  category: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  specs: {
    origin: string;
    packaging: string;
    moq: string;
    privateLabel: boolean;
    incoterms: string;
  };
  certifications: string[];
  needsUniqueImage: boolean;
  featured?: boolean;
  seo: {
    title: string;
    description: string;
  };
}

export const COMPANY = {
  brand: 'Mondal Export Import',
  tagline: 'A Trusted Name in Foreign Trade',
  motto: 'Your Satisfaction is Our Priority.',
  foundedYear: 2017,
  phoneDisplay: '+91 8617864081',
  phoneHref: 'tel:+918617864081',
  whatsappBase: 'https://wa.me/918617864081',
  email: 'info@mondalexportimport.com',
  regdOffice:
    'Bansbona, Fatepur, Haringhata, Nadia, Pin-7411249, West Bengal, India',
  warehouse:
    'Rasullapur Bazar, PO Kadambagachi, Chakdaha, Nadia, Pin-7412222',
  cataloguePdfUrl:
    'https://mondalexportimport.com/wp-content/uploads/2026/05/MONDAL-EXPORT-IMPORT-CATALOG.pdf',
  logoUrl: '/images/logo.png',
  googleReviewsUrl: 'https://share.google/hl1xe00ViSJqThrqU',
  socials: {
    facebook: 'https://www.facebook.com/MerchantExporter1',
    instagram: 'https://www.instagram.com/mondal_export_import',
    x: 'https://x.com/Mondalexport',
    youtube: 'https://www.youtube.com/@mondalexportimoport',
  },
  markets: ['Bangladesh', 'Asia', 'Middle East', 'Africa', 'Europe'],
  certificationsList: [
    'ISO 9001:2015',
    'APEDA',
    'FIEO',
    'ICC',
    'Spice Board',
    'MSME',
    'FSSAI',
    'One Star Export House',
    'GPC Dubai',
  ],
};

export function getWhatsAppLink(message?: string): string {
  const text =
    message ||
    'Hello Mondal Export Import, I would like to enquire about your export products.';
  return `${COMPANY.whatsappBase}?text=${encodeURIComponent(text)}`;
}

export const CATEGORIES = [
  {
    id: 'agriculture' as const,
    name: 'Agricultural Products',
    shortName: 'Agriculture',
    count: 18,
    image: '/products/2-1.webp',
    description:
      'We specialize in exporting premium quality agricultural products. From rice to grains, carefully selected and sourced for optimal quality for our clients.',
  },
  {
    id: 'spices' as const,
    name: 'Spices',
    shortName: 'Spices',
    count: 9,
    image: '/products/10-3.webp',
    description:
      'Explore our vast range of spices including turmeric, red chilli and black pepper, all ensured for authenticity and freshness for every culinary need.',
  },
  {
    id: 'fruits' as const,
    name: 'Fresh Fruits',
    shortName: 'Fruits',
    count: 10,
    image: '/products/9-2-1.webp',
    description:
      'We export fresh fruits carefully selected from trusted farms to ensure superior freshness, nutrition and international export quality.',
  },
  {
    id: 'vegetables' as const,
    name: 'Fresh Vegetables',
    shortName: 'Vegetables',
    count: 8,
    image: '/products/6-3-1.webp',
    description:
      'We export fresh vegetables carefully selected from trusted farms to ensure superior freshness, nutrition and international export quality.',
  },
];

export const COMPANY_OVERVIEW =
  "Since 2017, Mondal Export Import has been one of India's most reliable merchant exporters, delivering a wide range of products to international buyers, including agricultural commodities, fresh fruits & vegetables and spices. We have built a strong reputation through quality, ethical trade practices and global trade expertise. Our extensive buyer network spans Bangladesh, Asia, the Middle East, Africa and Europe. Our motto: 'Your Satisfaction is Our Priority.'";

export const WHY_CHOOSE_US = [
  {
    number: '01',
    title: 'ISO Certified Quality',
    description:
      'As an ISO 9001:2015 certified company, we ensure that all our products meet stringent quality standards, providing you with peace of mind in your sourcing.',
  },
  {
    number: '02',
    title: 'Global Trust',
    description:
      'Our proven track record of successful exports and recognition as a One Star Export House highlight our credibility in the global market. We are also an official member of the Dubai Global Pulse Confederation (GPC).',
  },
  {
    number: '03',
    title: 'Consistency & Trust',
    description:
      'Many years of consistent export experience since 2017 · Diverse product portfolio – Agriculture, Fruits & Vegetables, Spices · Strong international network – Bangladesh, Asia, Middle East, Africa & Europe · Globally certified – ISO, APEDA, FIEO, ICC, Spice Board, MSME, FSSAI · Customer-first approach – transparent trade, competitive pricing & on-time shipment.',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Direct Sourcing',
    detail:
      'Procuring graded harvests directly from vetted farms and mandis across West Bengal, Punjab, Haryana, and major Indian belts.',
  },
  {
    step: '02',
    title: 'Quality Check',
    detail:
      'Batch inspection for moisture, purity, size grading, and food-safety compliance under ISO 9001:2015 and FSSAI protocols.',
  },
  {
    step: '03',
    title: 'Packing & Private Label',
    detail:
      'Custom retail or bulk packaging (PP bags, jute, CFB cartons, mesh bags) with OEM private labelling options.',
  },
  {
    step: '04',
    title: 'Export Documentation',
    detail:
      'Phytosanitary certificates, Certificate of Origin, APEDA/Spice Board clearances, Bill of Lading, and commercial invoices.',
  },
  {
    step: '05',
    title: 'Global Shipping',
    detail:
      'Coordinated land cross-border trucking (Bangladesh), reefer/dry ocean containers, and air freight dispatch.',
  },
  {
    step: '06',
    title: 'On-Time Delivery',
    detail:
      'Dedicated shipment tracking and responsive buyer support until cargo clears smoothly at destination port.',
  },
];

export const CONSULTANCY_SERVICES = [
  {
    slug: 'export-license-registration',
    title: 'Export License & Registration',
    oneLine:
      'End-to-end assistance with IEC, APEDA, Spice Board, FIEO, and FSSAI export registrations.',
    summary:
      'We help Indian manufacturers, farmers, and aspiring merchant exporters obtain essential statutory export registrations quickly and accurately.',
    deliverables: [
      'Import Export Code (IEC) registration and amendment with DGFT',
      'APEDA RCMC registration for agricultural and processed food exports',
      'Spice Board CRES registration for spice exporters',
      'FIEO, MSME Udyam, and Central FSSAI Export License advisory',
    ],
    clientToConfirm: true,
  },
  {
    slug: 'export-documentation',
    title: 'Export Documentation',
    oneLine:
      'Error-free preparation of commercial invoices, packing lists, phytosanitary clearances, and Letters of Credit.',
    summary:
      'Accurate export documentation prevents costly port demurrages and customs delays. Our documentation desk handles end-to-end compliance.',
    deliverables: [
      'Commercial Invoice, Packing List, and Shipping Bill coordination',
      'Phytosanitary Certificate and Fumigation Certificate processing',
      'Certificate of Origin (Preferential & Non-Preferential via ICC/EIC)',
      'Letter of Credit (L/C) scrutiny and bank realization (e-BRC) support',
    ],
    clientToConfirm: true,
  },
  {
    slug: 'govt-benefits-service',
    title: 'Govt Benefits Service',
    oneLine:
      'Guidance on RoDTEP, duty drawback, export credit schemes, and Star Export House recognition.',
    summary:
      'Maximize your export competitiveness by lawfully claiming Government of India export incentives and trade promotion schemes.',
    deliverables: [
      'RoDTEP (Remission of Duties and Taxes on Exported Products) scrip claims',
      'Duty Drawback and GST refund reconciliation for exporters',
      'One Star / Two Star Export House status documentation advisory',
      'APEDA financial assistance and international trade fair subsidy guidance',
    ],
    clientToConfirm: true,
  },
  {
    slug: 'business-consultancy',
    title: 'Business Consultancy',
    oneLine:
      'International market entry strategy, buyer verification, Incoterms pricing, and freight optimization.',
    summary:
      'Practical trade advisory built on Mondal Export Import’s active exporting experience across five global regions since 2017.',
    deliverables: [
      'Product-market fit assessment across Bangladesh, Middle East, Africa, Asia, and Europe',
      'FOB, CFR, and CIF export costing and container load optimization',
      'Payment risk mitigation (ECGC, L/C, CAD, advance structures)',
      'Cold-chain, grading, and private-label packaging standardization',
    ],
    clientToConfirm: true,
  },
];

export const CERTIFICATE_ITEMS = [
  {
    id: 'apeda',
    title: 'APEDA Registration',
    issuer: 'Agricultural & Processed Food Products Export Development Authority',
    image: '/certificates/apeda-300x300.png',
  },
  {
    id: 'cert-iso',
    title: 'ISO 9001:2015 & Export Credential',
    issuer: 'Quality Management System Certification',
    image: '/certificates/Screenshot-2026-05-25-104519.png',
  },
  {
    id: 'cert-star',
    title: 'One Star Export House Recognition',
    issuer: 'Directorate General of Foreign Trade (DGFT)',
    image: '/certificates/Screenshot-2026-05-25-104559.png',
  },
  {
    id: 'cert-fieo',
    title: 'FIEO & Trade Membership',
    issuer: 'Federation of Indian Export Organisations',
    image: '/certificates/Screenshot-2026-05-25-105146.png',
  },
  {
    id: 'cert-spice',
    title: 'Spice Board / FSSAI Compliance',
    issuer: 'Government of India Statutory Boards',
    image: '/certificates/Screenshot-2026-05-25-105547.png',
  },
  {
    id: 'cert-gpc',
    title: 'Global Pulse Confederation (GPC) Dubai',
    issuer: 'Official Member Registration',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-11.27.22-AM.jpeg',
  },
  {
    id: 'cert-icc',
    title: 'Indian Chamber of Commerce (ICC)',
    issuer: 'Trade & Certificate of Origin Membership',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-12.01.36-PM-1.jpeg',
  },
  {
    id: 'cert-msme',
    title: 'MSME / Udyam Registration',
    issuer: 'Ministry of Micro, Small & Medium Enterprises',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-12.13.43-PM.jpeg',
  },
  {
    id: 'cert-doc-1',
    title: 'Statutory Export Certificate',
    issuer: 'Verified Export Compliance Record',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-12.15.13-PM.jpeg',
  },
  {
    id: 'cert-doc-2',
    title: 'Export House Accreditation',
    issuer: 'Government of India Foreign Trade Record',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-12.17.24-PM.jpeg',
  },
  {
    id: 'cert-doc-3',
    title: 'Food Safety & Quality License',
    issuer: 'FSSAI Export Standards',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-12.19.27-PM.jpeg',
  },
  {
    id: 'cert-doc-4',
    title: 'Trade Board Registration',
    issuer: 'Indian Agricultural & Spice Export Compliance',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-12.24.37-PM.jpeg',
  },
  {
    id: 'cert-doc-5',
    title: 'International Trade Accreditation',
    issuer: 'Mondal Export Import Compliance Archive',
    image: '/certificates/WhatsApp-Image-2026-05-25-at-12.30.05-PM.jpeg',
  },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Tariqul Islam',
    role: 'Procurement Director',
    company: 'Dhaka Agro Commodities Ltd.',
    country: 'Bangladesh',
    quote:
      'Consistent grain sizing and prompt cross-border documentation from Nadia have made Mondal Export Import our reliable partner for rice, pulses, and fresh produce.',
    isPlaceholder: true,
  },
  {
    id: 't2',
    name: 'Rashid Al Mansoori',
    role: 'Import Manager',
    company: 'Gulf Fresh Foods Trading LLC',
    country: 'UAE (Middle East)',
    quote:
      'Their private-label 5 kg and 25 kg Basmati rice shipments and fresh green chillies arrive in Dubai clean, well-graded, and right on schedule.',
    isPlaceholder: true,
  },
  {
    id: 't3',
    name: 'Samuel Okafor',
    role: 'Managing Partner',
    company: 'Lagos Spice & Grain Imports',
    country: 'Nigeria (Africa)',
    quote:
      'Transparent pricing, APEDA and ISO-backed quality checks, and responsive WhatsApp coordination throughout container loading.',
    isPlaceholder: true,
  },
  {
    id: 't4',
    name: 'Elena Georgiou',
    role: 'Category Buyer',
    company: 'Mediterranean Botanicals & Spices',
    country: 'Greece (Europe)',
    quote:
      'High-curcumin turmeric, cumin seeds, and cardamom met our European lab moisture specifications without delays.',
    isPlaceholder: true,
  },
];

export const FAQS = [
  {
    question: 'What is your Minimum Order Quantity (MOQ)?',
    answer:
      'For Rice, the standard minimum order is 20–22 MT (1 full truckload or 1 full container load). For other agricultural commodities, fresh fruits, vegetables, and spices, MOQs vary by sea container, land border truck, or air-freight shipment and are confirmed per enquiry (TBC).',
    editable: true,
  },
  {
    question: 'Do you offer custom packaging and private labelling?',
    answer:
      'Yes. We supply 5 kg, 10 kg, 25 kg, and 50 kg bags for grains as well as ventilated CFB cartons and mesh bags for fresh produce, with custom private-label branding upon request.',
    editable: true,
  },
  {
    question: 'What payment terms and Incoterms do you support?',
    answer:
      'We operate across standard international Incoterms including FOB, CFR, and CIF (air, ocean, and land borders). Accepted payment methods such as confirmed irrevocable L/C or advance TT are finalized in the proforma invoice (TBC).',
    editable: true,
  },
  {
    question: 'How do you handle shipping to Bangladesh vs. overseas ports?',
    answer:
      'From our warehouse in Nadia, West Bengal, we are strategically positioned for rapid road/rail shipments into Bangladesh via Petrapole–Benapole and Gede–Darshana, as well as ocean container shipments via Kolkata/Haldia and major Indian ports for the Middle East, Asia, Africa, and Europe.',
    editable: false,
  },
  {
    question: 'Can buyers request product samples before placing a bulk order?',
    answer:
      'Yes, commercial inspection samples for rice, pulses, oilcakes, and whole spices can be arranged via international courier prior to bulk contract confirmation (courier charges TBC).',
    editable: true,
  },
  {
    question: 'Which quality certifications and memberships hold true for shipments?',
    answer:
      'Mondal Export Import is an ISO 9001:2015 certified One Star Export House registered with APEDA, FIEO, ICC, Spice Board, MSME, and FSSAI, and is an official member of the Dubai Global Pulse Confederation (GPC).',
    editable: false,
  },
];

export const BLOG_POSTS = [
  {
    slug: 'indian-basmati-rice-export-guide',
    title: 'Sourcing Indian Basmati & Non-Basmati Rice: Packaging & Container Guide',
    category: 'Agricultural Trade',
    date: 'May 2026',
    readTime: '4 min read',
    image: '/products/2-1.webp',
    excerpt:
      'What international buyers in the Middle East, Europe, and Africa check when ordering 20–22 MT rice containers from India.',
    content: [
      'India supplies some of the most sought-after aged Basmati and Non-Basmati rice varieties harvested across Punjab, Haryana, Uttar Pradesh, and West Bengal.',
      'When importing a 20-foot container (20–22 MT), buyers typically choose between 5 kg and 10 kg consumer retail bags or 25 kg and 50 kg PP/BOPP/Jute wholesale sacks. Private labelling allows supermarket and distribution brands to standardize shelf presentation prior to dispatch.',
      'Every export lot must be accompanied by an APEDA-compliant Phytosanitary Certificate, FSSAI clearance, Fumigation Certificate, and Certificate of Origin so customs release proceeds smoothly at destination ports.',
    ],
  },
  {
    slug: 'apeda-phytosanitary-compliance-fresh-produce',
    title: 'Cold-Chain & Phytosanitary Readiness for Indian Mangoes, Onions & Chillies',
    category: 'Fresh Produce Logistics',
    date: 'May 2026',
    readTime: '5 min read',
    image: '/images/hero-fresh-produce.jpg',
    excerpt:
      'How pre-cooling, ventilated CFB cartons, and West Bengal border proximity keep perishables crisp across Asia and the Gulf.',
    content: [
      'Fresh fruits and vegetables—from Alphonso and Bengal mangoes to red onions, potatoes, and pungent green chillies—require tight synchronization between harvest maturity and transit mode.',
      'Pre-cooling produce immediately after sorting removes field heat and extends shelf life during reefer ocean transit or air freight. Breathable mesh bags for onions and potatoes prevent moisture condensation, while cushioned CFB boxes protect pomegranates and guavas.',
      'Being headquartered in Nadia, West Bengal gives Mondal Export Import rapid access to eastern agricultural belts as well as major land customs stations serving Bangladesh alongside sea/air gateways.',
    ],
  },
  {
    slug: 'spice-board-quality-standards-global-buyers',
    title: 'Evaluating Indian Turmeric, Cumin, Black Pepper & Cardamom for Bulk Import',
    category: 'Spices & Extracts',
    date: 'May 2026',
    readTime: '4 min read',
    image: '/products/10-3.webp',
    excerpt:
      'Key purity, moisture, and essential-oil indicators Spice Board registered exporters verify before loading.',
    content: [
      'Global spice importers value Indian whole spices—including high-curcumin turmeric fingers, bold black pepper, Sortex-cleaned cumin seeds, and green cardamom—for their aroma and oil concentration.',
      'Moisture control below threshold limits prevents clumping and microbial growth during long sea voyages. Moisture-barrier inner liners inside 25 kg or 50 kg bags preserve volatile oils until arrival.',
      'Sourcing from a Spice Board, FSSAI, and ISO 9001:2015 registered exporter ensures traceability and batch-level quality documentation.',
    ],
  },
  {
    slug: 'export-packaging-private-labeling-tips',
    title: 'Private Labelling & Export Documentation: Avoiding Delays at Destination Customs',
    category: 'Export Consultancy',
    date: 'May 2026',
    readTime: '3 min read',
    image: '/images/consultancy-trade.jpg',
    excerpt:
      'A practical checklist covering IEC, Certificate of Origin, HS codes, and private-label carton markings.',
    content: [
      'Most port delays stem not from cargo quality, but from mismatched HS codes, missing importer numbers on consumer packaging, or late Bill of Lading instructions.',
      'Before printing private-label bags or cartons, confirm destination country labelling laws (such as Arabic/English dual nutrition panels for GCC markets or EU allergen declarations).',
      'Our Export Consultancy desk assists new and growing trading firms with IEC registration, APEDA/Spice Board RCMC, RoDTEP claims, and watertight shipping documentation.',
    ],
  },
];

export const COUNTRY_OPTIONS = [
  'Bangladesh',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Oman',
  'Kuwait',
  'Bahrain',
  'Singapore',
  'Malaysia',
  'Vietnam',
  'Indonesia',
  'Sri Lanka',
  'Nepal',
  'Nigeria',
  'Kenya',
  'South Africa',
  'Egypt',
  'Ghana',
  'United Kingdom',
  'Germany',
  'Netherlands',
  'France',
  'Italy',
  'United States',
  'Canada',
  'Other',
];
