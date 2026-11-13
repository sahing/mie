import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
} from 'react-router-dom';
import { MotionConfig, AnimatePresence, motion } from 'motion/react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { Preloader } from './components/Preloader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ConsultancyPage } from './pages/ConsultancyPage';
import { GalleryPage } from './pages/GalleryPage';
import { CertificationsPage } from './pages/CertificationsPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { CataloguePage } from './pages/CataloguePage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';
import { CatalogProvider, useCatalog } from './context/CatalogContext';

function ProductRouteDispatcher() {
  const { param } = useParams<{ param: string }>();
  const { categories } = useCatalog();
  const isCategory = categories.some((c) => c.id === param);
  if (param && isCategory) {
    return <ProductsPage forcedCategory={param} />;
  }
  return <ProductDetailPage forcedSlug={param} />;
}

function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:param" element={<ProductRouteDispatcher />} />
          <Route path="/consultancy" element={<ConsultancyPage />} />
          <Route path="/consultancy/:slug" element={<ConsultancyPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/privacy-policy" element={<LegalPage mode="privacy" />} />
          <Route path="/terms" element={<LegalPage mode="terms" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CatalogProvider>
        <BrowserRouter>
          <ScrollManager />
          <Preloader />
          <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#1B1B1B]">
            <Navbar />
            <div className="flex-1">
              <AnimatedRoutes />
            </div>
            <Footer />
            <FloatingActions />
          </div>
        </BrowserRouter>
      </CatalogProvider>
    </MotionConfig>
  );
}
