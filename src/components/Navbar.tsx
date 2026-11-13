import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, Wheat, Apple, Carrot, Flame, ArrowRight, FileDown } from 'lucide-react';
import { COMPANY, getWhatsAppLink } from '../data/siteContent';
import { useCatalog } from '../context/CatalogContext';
import { trackEvent } from '../utils/analytics';

export function Navbar() {
  const { categories, products } = useCatalog();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const megaTimeout = useRef<number | null>(null);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 48);
      if (y > 140 && y > lastScrollY.current + 6) {
        setHidden(true);
        setMegaOpen(false);
      } else if (y < lastScrollY.current - 6 || y < 80) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparent = isHome && !scrolled && !megaOpen && !mobileOpen;

  const openMega = () => {
    if (megaTimeout.current) window.clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    megaTimeout.current = window.setTimeout(() => setMegaOpen(false), 160);
  };

  const categoryIcon = (id: string) => {
    if (id === 'fruits') return Apple;
    if (id === 'vegetables') return Carrot;
    if (id === 'spices') return Flame;
    return Wheat;
  };

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !mobileOpen ? '-100%' : '0%' }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        isTransparent
          ? 'bg-gradient-to-b from-[#09271D]/80 to-transparent text-[#FAF7F0]'
          : 'bg-[#FAF7F0]/95 backdrop-blur-md text-[#1B1B1B] border-b border-[#0F3D2E]/10 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single clean wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A526] rounded-md"
        >
          <img
            src={COMPANY.logoUrl}
            alt="Mondal Export Import logo"
            className="w-9 h-9 rounded-lg object-contain bg-white/95 p-0.5 shadow-sm"
          />
          <span
            className={`font-display text-lg sm:text-xl font-semibold tracking-tight ${
              isTransparent ? 'text-[#FAF7F0]' : 'text-[#0F3D2E]'
            }`}
          >
            {COMPANY.brand}
          </span>
        </Link>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          <div
            className="relative"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              className={`inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#E0A526] ${
                pathname.startsWith('/products') ? 'text-[#E0A526]' : ''
              }`}
            >
              <span>Products</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  megaOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[620px]"
                >
                  <div className="bg-[#FAF7F0] text-[#1B1B1B] rounded-2xl shadow-xl border border-[#0F3D2E]/10 p-6">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {categories.map((cat) => {
                        const Icon = categoryIcon(cat.id);
                        const catCount =
                          cat.count ?? products.filter((p) => p.category === cat.id).length;
                        return (
                          <Link
                            key={cat.id}
                            to={`/products/${cat.id}`}
                            className="group flex items-start gap-3 p-3 rounded-xl hover:bg-[#0F3D2E]/5 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center shrink-0 group-hover:bg-[#0F3D2E] group-hover:text-[#FAF7F0] transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-sm text-[#0F3D2E] flex items-center gap-1.5">
                                <span>{cat.name}</span>
                                <span className="text-xs text-[#1B1B1B]/50 tabular-nums">
                                  ({catCount})
                                </span>
                              </div>
                              <p className="text-xs text-[#1B1B1B]/65 line-clamp-1 mt-0.5">
                                {cat.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="pt-3 border-t border-[#0F3D2E]/10 flex items-center justify-between text-xs font-medium">
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-1.5 text-[#0F3D2E] hover:text-[#2E8B57]"
                      >
                        <span>Browse All {products.length} Export Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/catalogue"
                        className="inline-flex items-center gap-1.5 text-[#0F3D2E] hover:text-[#E0A526]"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download PDF Catalogue</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/consultancy"
            className={`py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#E0A526] ${
              pathname.startsWith('/consultancy') ? 'text-[#E0A526]' : ''
            }`}
          >
            Consultancy
          </Link>
          <Link
            to="/certifications"
            className={`py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#E0A526] ${
              pathname === '/certifications' ? 'text-[#E0A526]' : ''
            }`}
          >
            Certifications
          </Link>
          <Link
            to="/about"
            className={`py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#E0A526] ${
              pathname === '/about' ? 'text-[#E0A526]' : ''
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#E0A526] ${
              pathname === '/contact' ? 'text-[#E0A526]' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { location: 'navbar' })}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#E0A526] hover:bg-[#C9911A] text-[#09271D] text-xs sm:text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0 shadow-sm"
          >
            Enquire on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2.5 rounded-lg hover:bg-black/10 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#FAF7F0] text-[#1B1B1B] border-t border-[#0F3D2E]/10 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-5 space-y-1 max-h-[80vh] overflow-y-auto">
              <Link
                to="/products"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                All Export Products ({products.length})
              </Link>
              <div className="pl-4 grid grid-cols-2 gap-1 pb-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/products/${c.id}`}
                    className="px-3 py-2 rounded-lg text-sm text-[#1B1B1B]/80 hover:bg-[#0F3D2E]/5"
                  >
                    {c.shortName} ({c.count ?? products.filter((p) => p.category === c.id).length})
                  </Link>
                ))}
              </div>
              <Link
                to="/consultancy"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                Consultancy Services
              </Link>
              <Link
                to="/certifications"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                Certifications & Accreditations
              </Link>
              <Link
                to="/gallery"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                Product & Shipment Gallery
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                Export Insights & Blog
              </Link>
              <Link
                to="/catalogue"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                Download Catalogue
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2.5 rounded-xl font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
              >
                Contact Us
              </Link>
              <div className="pt-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { location: 'mobile_menu' })}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#E0A526] text-[#09271D] font-semibold text-sm"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
