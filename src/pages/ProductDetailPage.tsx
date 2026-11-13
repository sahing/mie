import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ZoomIn,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { SeoHead } from '../components/SeoHead';
import { ProductImage } from '../components/ProductImage';
import { ProductCard } from '../components/ProductCard';
import { EnquiryForm } from '../components/EnquiryForm';

export function ProductDetailPage({ forcedSlug }: { forcedSlug?: string }) {
  const { slug: paramSlug } = useParams<{ slug?: string }>();
  const slug = forcedSlug || paramSlug;
  const { products: allProducts, categories } = useCatalog();
  const productIndex = allProducts.findIndex((p) => p.slug === slug);
  const product = productIndex >= 0 ? allProducts[productIndex] : null;

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);

  if (!product) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center space-y-4">
        <SeoHead
          title="Product Not Found | Mondal Export Import"
          description="Explore all 45 export products from Mondal Export Import."
        />
        <h1 className="font-display text-3xl font-semibold text-[#0F3D2E]">
          Product Not Found
        </h1>
        <p className="text-sm text-[#1B1B1B]/75">
          The product you requested could not be located in our current export catalogue.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All 45 Products</span>
        </Link>
      </div>
    );
  }

  const categoryMeta = categories.find((c) => c.id === product.category);
  const galleryImages = [product.image, ...(product.gallery || [])];
  const displayImage =
    activeImage && galleryImages.includes(activeImage) ? activeImage : product.image;

  const related = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  const prevProduct = productIndex > 0 ? allProducts[productIndex - 1] : null;
  const nextProduct =
    productIndex < allProducts.length - 1 ? allProducts[productIndex + 1] : null;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image:
      typeof window !== 'undefined'
        ? `${window.location.origin}${product.image}`
        : product.image,
    category: categoryMeta?.name || product.category,
    brand: {
      '@type': 'Brand',
      name: 'Mondal Export Import',
    },
    countryOfOrigin: 'IN',
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title={product.seo.title || `${product.name} Exporter India | Mondal Export Import`}
        description={product.seo.description || product.shortDescription}
        image={product.image}
        jsonLd={productJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-[#1B1B1B]/65 mb-6"
        >
          <Link to="/" className="hover:text-[#0F3D2E]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/products" className="hover:text-[#0F3D2E]">
            Products
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={`/products/${product.category}`} className="hover:text-[#0F3D2E]">
            {categoryMeta?.name || product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0F3D2E] font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery + Description + Key Details Table */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#2E8B57] mb-2">
                <span>{categoryMeta?.name || product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#1B1B1B]/60">Origin: {product.specs.origin}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance">
                {product.name}
              </h1>
            </div>

            {/* Interactive Zoom Product Image */}
            <div className="space-y-3">
              <div
                onClick={() => setZoomed((v) => !v)}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#0F3D2E]/10 shadow-sm cursor-zoom-in group"
              >
                <ProductImage
                  src={displayImage}
                  alt={`${product.name} export grade commodity`}
                  category={product.category}
                  loading="eager"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    zoomed ? 'scale-125' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#09271D]/80 text-[#FAF7F0] text-xs font-medium inline-flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-[#E0A526]" />
                  <span>{zoomed ? 'Click to reset' : 'Click to zoom'}</span>
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
                        displayImage === img ? 'border-[#E0A526]' : 'border-transparent'
                      }`}
                    >
                      <ProductImage
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        category={product.category}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-6 sm:p-8 space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#0F3D2E]">
                Product Overview
              </h2>
              <p className="text-base text-[#1B1B1B]/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Details Table */}
            <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-semibold text-[#0F3D2E]">
                  Export Specifications
                </h2>
                <span className="text-xs text-[#1B1B1B]/55">
                  TBC specs confirmed per order
                </span>
              </div>
              <dl className="divide-y divide-[#0F3D2E]/10 text-sm">
                <div className="py-3.5 grid grid-cols-3 gap-4">
                  <dt className="font-medium text-[#1B1B1B]/65">Origin</dt>
                  <dd className="col-span-2 font-medium text-[#0F3D2E]">
                    {product.specs.origin}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-3 gap-4">
                  <dt className="font-medium text-[#1B1B1B]/65">Category</dt>
                  <dd className="col-span-2 font-medium text-[#0F3D2E]">
                    {categoryMeta?.name || product.category}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-3 gap-4">
                  <dt className="font-medium text-[#1B1B1B]/65">Packaging</dt>
                  <dd className="col-span-2 font-mono text-xs sm:text-sm text-[#1B1B1B] tabular-nums">
                    {product.specs.packaging}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-3 gap-4">
                  <dt className="font-medium text-[#1B1B1B]/65">Min. Order (MOQ)</dt>
                  <dd className="col-span-2 font-mono text-xs sm:text-sm text-[#1B1B1B] tabular-nums">
                    {product.specs.moq}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-3 gap-4">
                  <dt className="font-medium text-[#1B1B1B]/65">Private Labelling</dt>
                  <dd className="col-span-2 font-medium text-[#0F3D2E]">
                    {product.specs.privateLabel
                      ? 'Yes — Custom buyer branding available'
                      : 'Standard export packing'}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-3 gap-4">
                  <dt className="font-medium text-[#1B1B1B]/65">Certifications</dt>
                  <dd className="col-span-2 font-medium text-[#0F3D2E]">
                    {product.certifications.join(' · ')}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-3 gap-4">
                  <dt className="font-medium text-[#1B1B1B]/65">Incoterms &amp; Payment</dt>
                  <dd className="col-span-2 font-mono text-xs sm:text-sm text-[#1B1B1B]">
                    {product.specs.incoterms}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Why buy from Mondal */}
            <div className="bg-[#0F3D2E] text-[#FAF7F0] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-[#E0A526] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Why Source {product.name} From Mondal Export Import</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#FAF7F0]/85">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E0A526] shrink-0 mt-0.5" />
                  <span>ISO 9001:2015 certified &amp; One Star Export House</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E0A526] shrink-0 mt-0.5" />
                  <span>Direct farm-belt sourcing across India since 2017</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E0A526] shrink-0 mt-0.5" />
                  <span>Complete Phytosanitary, FSSAI &amp; Certificate of Origin</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E0A526] shrink-0 mt-0.5" />
                  <span>Flexible private-label &amp; bulk container dispatch</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Enquiry Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-[#0F3D2E]/12 p-6 sm:p-8 shadow-md space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#2E8B57]">
                  Direct Export Desk
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#0F3D2E] mt-1">
                  Enquire About {product.name}
                </h2>
                <p className="text-xs text-[#1B1B1B]/65 mt-1">
                  Receive FOB / CIF quotation, moisture specs, and shipment schedule.
                </p>
              </div>
              <EnquiryForm compact defaultProduct={product.name} />
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="mt-14 pt-8 border-t border-[#0F3D2E]/10 flex items-center justify-between gap-4">
          {prevProduct ? (
            <Link
              to={`/products/${prevProduct.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D2E] hover:text-[#2E8B57]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: {prevProduct.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextProduct && (
            <Link
              to={`/products/${nextProduct.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D2E] hover:text-[#2E8B57]"
            >
              <span>Next: {nextProduct.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F3D2E] mb-8">
              Related {categoryMeta?.name || product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
