import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  FileDown,
  MessageCircle,
  ShieldCheck,
  Globe,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Wheat,
  Apple,
  Carrot,
  Flame,
} from 'lucide-react';
import {
  COMPANY,
  COMPANY_OVERVIEW,
  WHY_CHOOSE_US,
  PROCESS_STEPS,
  CONSULTANCY_SERVICES,
  CERTIFICATE_ITEMS,
  TESTIMONIALS,
  FAQS,
  Product,
  getWhatsAppLink,
} from '../data/siteContent';
import { SeoHead } from '../components/SeoHead';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { CountUpNumber } from '../components/CountUpNumber';
import { ExportMarketsMap } from '../components/ExportMarketsMap';
import { useCatalog } from '../context/CatalogContext';
import { trackEvent } from '../utils/analytics';

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  {
    src: '/images/hero-grains-spices.jpg',
    label: 'Aged Basmati Rice & Authentic Whole Spices',
  },
  {
    src: '/images/hero-fresh-produce.jpg',
    label: 'Farm-Fresh Mangoes, Pomegranates, Green Chillies & Onions',
  },
  {
    src: '/images/company-warehouse.jpg',
    label: 'ISO 9001:2015 Graded Export Warehouse & Dispatch',
  },
];

export function HomePage() {
  const { products: allProducts, categories } = useCatalog();
  const [slideIndex, setSlideIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [activeFeaturedCat, setActiveFeaturedCat] =
    useState<Product['category']>('agriculture');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightboxCert, setLightboxCert] = useState<
    (typeof CERTIFICATE_ITEMS)[number] | null
  >(null);

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineLineRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  // GSAP ScrollTrigger for Process Timeline progress line
  useEffect(() => {
    if (!timelineRef.current || !timelineLineRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 78%',
            end: 'bottom 60%',
            scrub: 0.5,
          },
        }
      );
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
    setMouseOffset({ x, y });
  };

  const featuredProducts = allProducts
    .filter((p) => p.category === activeFeaturedCat)
    .slice(0, 8);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = dir === 'left' ? -340 : 340;
    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const categoryIcon = (id: string) => {
    if (id === 'fruits') return Apple;
    if (id === 'vegetables') return Carrot;
    if (id === 'spices') return Flame;
    return Wheat;
  };

  const homeJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: COMPANY.brand,
      url: typeof window !== 'undefined' ? window.location.origin : 'https://mondalexportimport.com',
      logo: typeof window !== 'undefined' ? `${window.location.origin}${COMPANY.logoUrl}` : '',
      foundingDate: '2017',
      email: COMPANY.email,
      telephone: COMPANY.phoneDisplay,
      sameAs: Object.values(COMPANY.socials),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: COMPANY.brand,
      description: COMPANY_OVERVIEW,
      telephone: COMPANY.phoneDisplay,
      email: COMPANY.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bansbona, Fatepur, Haringhata',
        addressLocality: 'Nadia',
        addressRegion: 'West Bengal',
        postalCode: '7411249',
        addressCountry: 'IN',
      },
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <SeoHead
        title="Mondal Export Import – A Trusted Name in Foreign Trade"
        description="ISO 9001:2015 certified Indian merchant exporter since 2017 delivering agricultural products, fresh fruits, vegetables, and spices worldwide."
        path="/"
        jsonLd={homeJsonLd}
      />

      {/* 1. HERO SECTION */}
      <section
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[88vh] lg:min-h-[92vh] flex items-center bg-[#09271D] text-[#FAF7F0] overflow-hidden pt-20 pb-16"
      >
        {/* Ken-Burns Slideshow Backdrop */}
        <AnimatePresence mode="sync">
          <motion.div
            key={HERO_SLIDES[slideIndex].src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[slideIndex].src}
              alt={HERO_SLIDES[slideIndex].label}
              loading="eager"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-ken-burns"
            />
          </motion.div>
        </AnimatePresence>

        {/* Measured Forest-Green Scrim for >= 4.5:1 Contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#09271D]/95 via-[#09271D]/80 to-[#09271D]/45"
        />

        {/* Subtle parallax organic spice/grain motifs on desktop */}
        <div
          aria-hidden="true"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          }}
          className="hidden lg:block absolute right-12 bottom-16 pointer-events-none transition-transform duration-300 ease-out"
        >
          <div className="w-64 h-64 rounded-full border border-[#E0A526]/20 flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border border-[#FAF7F0]/15" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#E0A526]">
              <span>ISO 9001:2015 Certified Company</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#FAF7F0]/85">One Star Export House</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#FAF7F0]/85">Since 2017</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight leading-[1.08] text-balance"
            >
              Mondal Export Import — A Trusted Name in Foreign Trade
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#FAF7F0]/88 max-w-2xl leading-relaxed"
            >
              Delivering premium Agricultural Products, Fresh Fruits &amp; Vegetables,
              Spices and more – with trust and excellence across the globe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { location: 'hero_cta' })}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E0A526] hover:bg-[#C9911A] text-[#09271D] text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 shadow-lg whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </a>
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#FAF7F0]/35 hover:border-[#E0A526] hover:bg-white/10 text-[#FAF7F0] text-sm font-medium transition-colors whitespace-nowrap"
              >
                <FileDown className="w-4 h-4 text-[#E0A526]" />
                <span>Download Catalogue</span>
              </Link>
            </motion.div>

            {/* Slide Indicator */}
            <div className="pt-4 flex items-center gap-3">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setSlideIndex(idx)}
                  aria-label={`Show hero slide ${idx + 1}: ${s.label}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    slideIndex === idx
                      ? 'w-8 bg-[#E0A526]'
                      : 'w-2.5 bg-[#FAF7F0]/35 hover:bg-[#FAF7F0]/60'
                  }`}
                />
              ))}
              <span className="text-xs text-[#FAF7F0]/70 ml-2 truncate">
                {HERO_SLIDES[slideIndex].label}
              </span>
            </div>
          </div>
        </div>

        {/* Organic Curved Section Divider */}
        <div className="absolute bottom-0 inset-x-0 pointer-events-none leading-none">
          <svg
            viewBox="0 0 1440 56"
            className="w-full h-8 sm:h-12 text-[#FAF7F0]"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,32 C360,68 1080,0 1440,36 L1440,56 L0,56 Z"
            />
          </svg>
        </div>
      </section>

      {/* 2. TRUST STRIP & STATS BAR */}
      <section className="bg-[#FAF7F0] py-10 border-b border-[#0F3D2E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Quantitative Count-Up Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#0F3D2E]/10">
              <div className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] tabular-nums">
                Since <CountUpNumber startFrom={2010} target={2017} />
              </div>
              <div className="mt-1 text-xs sm:text-sm text-[#1B1B1B]/70">
                Merchant Exporter Heritage
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#0F3D2E]/10">
              <div className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] tabular-nums">
                <CountUpNumber target={allProducts.length} suffix="+" />
              </div>
              <div className="mt-1 text-xs sm:text-sm text-[#1B1B1B]/70">
                Export Products Across {categories.length} Categories
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#0F3D2E]/10">
              <div className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] tabular-nums">
                <CountUpNumber target={5} /> Regions
              </div>
              <div className="mt-1 text-xs sm:text-sm text-[#1B1B1B]/70">
                Bangladesh, Asia, Middle East, Africa, Europe
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#0F3D2E]/10">
              <div className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] tabular-nums">
                <CountUpNumber target={9} /> Accreditations
              </div>
              <div className="mt-1 text-xs sm:text-sm text-[#1B1B1B]/70">
                ISO, APEDA, FIEO, Spice Board, GPC Dubai
              </div>
            </div>
          </div>

          {/* Unboxed Typographic Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-[#0F3D2E]/85">
            {COMPANY.certificationsList.map((cert, i) => (
              <span key={cert} className="inline-flex items-center gap-4">
                <span>{cert}</span>
                {i < COMPANY.certificationsList.length - 1 && (
                  <span aria-hidden="true" className="text-[#E0A526]">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR PREMIUM EXPORT PRODUCTS (4 LARGE CATEGORY CARDS) */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0] paper-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#2E8B57] mb-2">
                Export Portfolio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] text-balance">
                Our Premium Export Products
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D2E] hover:text-[#E0A526] transition-colors whitespace-nowrap"
            >
              <span>View Complete 45-Product Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = categoryIcon(cat.id);
              const catCount =
                cat.count ?? allProducts.filter((p) => p.category === cat.id).length;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
                  style={{ transformPerspective: 900 }}
                  className="group bg-white rounded-3xl border border-[#0F3D2E]/10 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
                >
                  <Link
                    to={`/products/${cat.id}`}
                    className="relative aspect-[4/3] overflow-hidden bg-[#F1ECE0] block"
                  >
                    <ProductImage
                      src={cat.image}
                      alt={cat.name}
                      category={cat.id}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09271D]/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#FAF7F0]">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                        <Icon className="w-4 h-4 text-[#E0A526]" />
                        <span className="tabular-nums">{catCount} Products</span>
                      </span>
                    </div>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[#0F3D2E]">
                        {cat.name}
                      </h3>
                      <p className="mt-2.5 text-sm text-[#1B1B1B]/75 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                    <Link
                      to={`/products/${cat.id}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F3D2E] group-hover:text-[#2E8B57]"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. COMPANY OVERVIEW */}
      <section className="py-16 lg:py-24 bg-white border-y border-[#0F3D2E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-[#F1ECE0] min-h-[300px]">
              <img
                src="/images/company-warehouse.jpg"
                alt="Mondal Export Import grading and container loading facility in West Bengal, India"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5 py-2">
              <p className="text-xs font-semibold text-[#2E8B57]">
                Company Overview · Nadia, West Bengal, India
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] text-balance">
                Consistent Indian Sourcing Built on Ethical Foreign Trade
              </h2>
              <p className="text-base text-[#1B1B1B]/80 leading-relaxed">
                {COMPANY_OVERVIEW}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-[#1B1B1B]/75">
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#0F3D2E]/10">
                  <div className="font-semibold text-[#0F3D2E]">Private Labelling</div>
                  <p className="text-xs mt-1">
                    Custom retail and wholesale bags &amp; cartons tailored to buyer brands.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#0F3D2E]/10">
                  <div className="font-semibold text-[#0F3D2E]">
                    Export &amp; Domestic Supply
                  </div>
                  <p className="text-xs mt-1">
                    Containerized global exports plus domestic wholesale supply on demand.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] hover:bg-[#09271D] text-[#FAF7F0] text-sm font-semibold transition-colors"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS CAROUSEL (PER CATEGORY) */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#2E8B57] mb-2">
                Featured Export Showcase
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E]">
                Browse Commodities by Category
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Interactive segmented filter tabs */}
              <div className="inline-flex flex-wrap p-1 rounded-xl bg-[#0F3D2E]/8 gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveFeaturedCat(cat.id as Product['category'])}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      activeFeaturedCat === cat.id
                        ? 'bg-[#0F3D2E] text-[#FAF7F0] shadow-sm'
                        : 'text-[#0F3D2E]/75 hover:text-[#0F3D2E]'
                    }`}
                  >
                    {cat.shortName}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  aria-label="Scroll featured products left"
                  className="w-10 h-10 rounded-full border border-[#0F3D2E]/20 flex items-center justify-center text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  aria-label="Scroll featured products right"
                  className="w-10 h-10 rounded-full border border-[#0F3D2E]/20 flex items-center justify-center text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          >
            {featuredProducts.map((product) => (
              <div
                key={product.slug}
                className="min-w-[270px] sm:min-w-[295px] max-w-[300px] snap-start shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to={`/products/${activeFeaturedCat}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F3D2E] hover:text-[#2E8B57]"
            >
              <span>
                Explore All{' '}
                {categories.find((c) => c.id === activeFeaturedCat)?.name || activeFeaturedCat}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US (3 PILLARS) */}
      <section className="py-16 lg:py-24 bg-[#0F3D2E] text-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-[#E0A526] mb-2">
              Why Partner With Us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance">
              Built for International Importers &amp; Wholesale Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => {
              const Icon =
                idx === 0 ? ShieldCheck : idx === 1 ? Globe : Award;
              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="rounded-3xl bg-white/5 border border-white/10 p-7 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#E0A526]/15 text-[#E0A526] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-[#FAF7F0]/50 tabular-nums">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#FAF7F0]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#FAF7F0]/80 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. EXPORT MARKETS MAP (ANIMATED) */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#2E8B57] mb-2">
              Global Trade Corridors
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] text-balance">
              Serving Buyers Across Five International Regions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#1B1B1B]/75">
              Select a region to view shipping modes and primary exported commodities
              from West Bengal, India.
            </p>
          </div>

          <ExportMarketsMap />
        </div>
      </section>

      {/* 8. HOW WE WORK (6-STEP TIMELINE) */}
      <section
        ref={timelineRef}
        className="py-16 lg:py-24 bg-white border-y border-[#0F3D2E]/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-[#2E8B57] mb-2">
              Export Execution Workflow
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E]">
              How We Deliver From Farm to Destination Port
            </h2>
          </div>

          <div className="relative">
            {/* Animated horizontal connector line (desktop) */}
            <div className="hidden lg:block absolute top-6 left-8 right-8 h-0.5 bg-[#0F3D2E]/10">
              <div
                ref={timelineLineRef}
                className="h-full bg-[#E0A526] origin-left"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {PROCESS_STEPS.map((st, idx) => (
                <motion.div
                  key={st.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="relative flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0F3D2E] text-[#E0A526] font-mono text-sm font-semibold flex items-center justify-center shadow-sm relative z-10 tabular-nums">
                    {st.step}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-[#0F3D2E]">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#1B1B1B]/70 leading-relaxed">
                    {st.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONSULTANCY SERVICES TEASER (4 CARDS) */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0] paper-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#2E8B57] mb-2">
                Export Trade Advisory
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E] text-balance">
                Export Consultancy &amp; Compliance Services
              </h2>
            </div>
            <Link
              to="/consultancy"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D2E] hover:text-[#E0A526] whitespace-nowrap"
            >
              <span>All Consultancy Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONSULTANCY_SERVICES.map((svc, idx) => (
              <Link
                key={svc.slug}
                to={`/consultancy/${svc.slug}`}
                className="group bg-white rounded-2xl border border-[#0F3D2E]/10 p-6 flex flex-col justify-between hover:border-[#0F3D2E]/30 hover:-translate-y-1 transition-all duration-200 shadow-sm"
              >
                <div>
                  <span className="font-mono text-xs text-[#2E8B57] tabular-nums">
                    0{idx + 1}. Service
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-[#0F3D2E] group-hover:text-[#2E8B57] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#1B1B1B]/75 leading-relaxed">
                    {svc.oneLine}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3D2E]">
                  <span>View Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CERTIFICATIONS MARQUEE + LIGHTBOX */}
      <section className="py-16 bg-white border-y border-[#0F3D2E]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#2E8B57] mb-1.5">
              Verified Credentials
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#0F3D2E]">
              Certifications &amp; Trade Memberships
            </h2>
          </div>
          <Link
            to="/certifications"
            className="text-sm font-semibold text-[#0F3D2E] hover:text-[#E0A526] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Open Full Certificate Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="flex w-max gap-5 animate-marquee px-4">
            {[...CERTIFICATE_ITEMS, ...CERTIFICATE_ITEMS].map((cert, i) => (
              <button
                key={`${cert.id}-${i}`}
                type="button"
                onClick={() => setLightboxCert(cert)}
                className="w-56 shrink-0 rounded-2xl bg-[#FAF7F0] border border-[#0F3D2E]/10 p-3 text-left hover:border-[#E0A526] transition-colors focus-visible:outline-none"
              >
                <div className="aspect-[4/3] rounded-xl bg-white overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-2.5 text-xs font-semibold text-[#0F3D2E] truncate">
                  {cert.title}
                </div>
                <div className="text-[11px] text-[#1B1B1B]/60 truncate">
                  {cert.issuer}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS / GOOGLE REVIEWS */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#2E8B57] mb-1.5">
                Buyer Feedback
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E]">
                Global Partner Reviews
              </h2>
            </div>
            <a
              href={COMPANY.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D2E] hover:text-[#2E8B57] whitespace-nowrap"
            >
              <span>Read Verified Google Reviews</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#0F3D2E]/10 p-8 sm:p-10 shadow-sm">
              <div className="text-xs text-[#1B1B1B]/55 mb-4">
                Sample buyer testimonial (replace with verified client review) ·{' '}
                {TESTIMONIALS[testimonialIdx].country}
              </div>
              <blockquote className="font-display text-xl sm:text-2xl text-[#0F3D2E] leading-relaxed">
                “{TESTIMONIALS[testimonialIdx].quote}”
              </blockquote>
              <div className="mt-6 pt-5 border-t border-[#0F3D2E]/10 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm text-[#0F3D2E]">
                    {TESTIMONIALS[testimonialIdx].name}
                  </div>
                  <div className="text-xs text-[#1B1B1B]/65">
                    {TESTIMONIALS[testimonialIdx].role} ·{' '}
                    {TESTIMONIALS[testimonialIdx].company}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous testimonial"
                    onClick={() =>
                      setTestimonialIdx(
                        (i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                      )
                    }
                    className="w-9 h-9 rounded-full border border-[#0F3D2E]/20 flex items-center justify-center hover:bg-[#0F3D2E] hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next testimonial"
                    onClick={() =>
                      setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)
                    }
                    className="w-9 h-9 rounded-full border border-[#0F3D2E]/20 flex items-center justify-center hover:bg-[#0F3D2E] hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-3xl bg-[#0F3D2E] text-[#FAF7F0] p-8 space-y-4">
              <h3 className="font-display text-2xl font-semibold">
                Verified on Google
              </h3>
              <p className="text-sm text-[#FAF7F0]/80 leading-relaxed">
                Explore authentic client feedback and export shipment updates on our
                official Google Business profile.
              </p>
              <a
                href={COMPANY.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#E0A526] text-[#09271D] text-sm font-semibold hover:bg-[#C9911A] transition-colors"
              >
                <span>Open Google Reviews</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ SECTION */}
      <section className="py-16 lg:py-24 bg-white border-t border-[#0F3D2E]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#2E8B57] mb-2">
              Buyer Information
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-[#0F3D2E]/12 bg-[#FAF7F0]/60 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F3D2E]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[#1B1B1B]/80 leading-relaxed">
                      {faq.answer}
                      {faq.editable && (
                        <span className="block mt-2 text-xs font-mono text-[#1B1B1B]/50">
                          Editable buyer policy — final terms confirmed per proforma invoice.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13. CTA BANNER */}
      <section className="py-16 lg:py-20 bg-[#0F3D2E] text-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance">
              Get In Touch Today
            </h2>
            <p className="text-sm sm:text-base text-[#FAF7F0]/80">
              Request FOB, CFR, or CIF pricing for container loads, cross-border
              trucking, or private-label retail packaging.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E0A526] hover:bg-[#C9911A] text-[#09271D] text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <span>Request Export Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#FAF7F0]/30 hover:bg-white/10 text-[#FAF7F0] text-sm font-medium transition-colors whitespace-nowrap"
            >
              <FileDown className="w-4 h-4 text-[#E0A526]" />
              <span>Download Catalogue</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Certificate Lightbox */}
      {lightboxCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxCert.title}
          onClick={() => setLightboxCert(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxCert(null)}
              aria-label="Close certificate preview"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F0] text-[#0F3D2E] flex items-center justify-center hover:bg-[#E0A526]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-[4/3] bg-[#FAF7F0] rounded-2xl overflow-hidden flex items-center justify-center p-4">
              <img
                src={lightboxCert.image}
                alt={lightboxCert.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-xl font-semibold text-[#0F3D2E]">
                {lightboxCert.title}
              </h3>
              <p className="text-sm text-[#1B1B1B]/70 mt-1">{lightboxCert.issuer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
