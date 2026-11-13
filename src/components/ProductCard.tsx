import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Product, getWhatsAppLink } from '../data/siteContent';
import { ProductImage } from './ProductImage';
import { trackEvent } from '../utils/analytics';

interface ProductCardProps {
  product: Product;
  showImageNotice?: boolean;
}

const CATEGORY_LABELS: Record<Product['category'], string> = {
  agriculture: 'Agriculture',
  fruits: 'Fresh Fruits',
  vegetables: 'Fresh Vegetables',
  spices: 'Spices',
};

export function ProductCard({ product, showImageNotice = false }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-[#0F3D2E]/10 overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1ECE0] block"
      >
        <ProductImage
          src={product.image}
          alt={`${product.name} — ${CATEGORY_LABELS[product.category]} exported from India by Mondal Export Import`}
          category={product.category}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09271D]/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F0]">
            <span>View Export Specs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#2E8B57] font-medium mb-1.5">
            <span>{CATEGORY_LABELS[product.category] || product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#1B1B1B]/55">India Origin</span>
          </div>

          <h3 className="font-display text-lg font-semibold text-[#0F3D2E] leading-snug">
            <Link
              to={`/products/${product.slug}`}
              className="hover:text-[#2E8B57] transition-colors"
            >
              {product.name}
            </Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[#1B1B1B]/70 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {showImageNotice && product.needsUniqueImage && (
            <p className="mt-2 text-[11px] font-mono text-[#C0392B]">
              Note: Shared placeholder image — replace with unique photo
            </p>
          )}
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#0F3D2E]/8 flex items-center justify-between gap-3">
          <Link
            to={`/products/${product.slug}`}
            className="text-xs font-semibold text-[#0F3D2E] hover:text-[#E0A526] inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={getWhatsAppLink(
              `Hello, I want to buy ${product.name}. Please share price and details.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('whatsapp_click', {
                location: 'product_card',
                product: product.name,
              })
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E8B57] hover:text-[#0F3D2E] whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Quick Enquire</span>
          </a>
        </div>
      </div>
    </article>
  );
}
