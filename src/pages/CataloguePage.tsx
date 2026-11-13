import { Link } from 'react-router-dom';
import { FileDown, MessageCircle, ArrowRight } from 'lucide-react';
import { COMPANY, getWhatsAppLink } from '../data/siteContent';
import { useCatalog } from '../context/CatalogContext';
import { SeoHead } from '../components/SeoHead';
import { trackEvent } from '../utils/analytics';

export function CataloguePage() {
  const { products: allProducts, categories } = useCatalog();

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title="Download Export Product Catalogue (PDF) | Mondal Export Import"
        description="Download the official Mondal Export Import PDF product catalogue covering 45 agricultural commodities, fresh fruits, vegetables, and spices."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-[#0F3D2E] text-[#FAF7F0] rounded-3xl p-8 sm:p-12 space-y-6 shadow-lg">
          <p className="text-xs font-semibold text-[#E0A526]">
            Official 2026 Export Brochure
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-balance">
            Mondal Export Import Product Catalogue
          </h1>
          <p className="text-base text-[#FAF7F0]/80 max-w-2xl leading-relaxed">
            Access our complete PDF brochure featuring agricultural products, fresh
            fruits, vegetables, whole spices, certifications, and export specifications.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={COMPANY.cataloguePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('catalogue_download', { location: 'catalogue_page' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E0A526] hover:bg-[#C9911A] text-[#09271D] text-sm font-semibold transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF Catalogue</span>
            </a>
            <a
              href={getWhatsAppLink(
                'Hello, please share your latest export catalogue and FOB/CIF price list.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'catalogue_page' })}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#FAF7F0]/30 hover:bg-white/10 text-[#FAF7F0] text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#E0A526]" />
              <span>Request Price List on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Complete 45-Product Index by Category */}
        <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0F3D2E]/10 pb-5">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#0F3D2E]">
                Quick Online Product Index (45 Commodities)
              </h2>
              <p className="text-xs text-[#1B1B1B]/65 mt-1">
                Click any product below to open its full specifications and enquiry card.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F3D2E] hover:text-[#2E8B57]"
            >
              <span>Filter Visual Grid</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat) => {
              const items = allProducts.filter((p) => p.category === cat.id);
              return (
                <div key={cat.id} className="space-y-3">
                  <h3 className="font-display text-xl font-semibold text-[#0F3D2E] flex items-center justify-between">
                    <span>{cat.name}</span>
                    <span className="font-mono text-xs text-[#2E8B57] tabular-nums">
                      {items.length} items
                    </span>
                  </h3>
                  <ul className="divide-y divide-[#0F3D2E]/8">
                    {items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          to={`/products/${item.slug}`}
                          className="py-2 flex items-center justify-between text-sm text-[#1B1B1B]/85 hover:text-[#0F3D2E] hover:font-medium transition-colors"
                        >
                          <span>{item.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#0F3D2E]/40" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
