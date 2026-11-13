import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { SeoHead } from '../components/SeoHead';
import { ProductImage } from '../components/ProductImage';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  group: 'facility' | 'agriculture' | 'produce' | 'spices';
  caption: string;
}

export function GalleryPage() {
  const { products: allProducts } = useCatalog();
  const [filter, setFilter] = useState<'all' | GalleryItem['group']>('all');
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const facilityItems: GalleryItem[] = [
    {
      id: 'fac-1',
      src: '/images/company-warehouse.jpg',
      title: 'Nadia Grading & Dispatch Warehouse',
      group: 'facility',
      caption: 'Palletized export sacks inspected before container stuffing.',
    },
    {
      id: 'fac-2',
      src: '/images/hero-grains-spices.jpg',
      title: 'Basmati Rice & Whole Spices Showcase',
      group: 'facility',
      caption: '25 kg burlap sacks with whole turmeric, red chilli, and cardamom.',
    },
    {
      id: 'fac-3',
      src: '/images/hero-fresh-produce.jpg',
      title: 'Fresh Produce Export Crates',
      group: 'facility',
      caption: 'Ventilated wooden and CFB crates prepared for export cold chain.',
    },
    {
      id: 'fac-4',
      src: '/images/consultancy-trade.jpg',
      title: 'Export Documentation & Compliance Desk',
      group: 'facility',
      caption: 'Bill of Lading, Phytosanitary, and port logistics coordination.',
    },
  ];

  const productItems: GalleryItem[] = allProducts
    .filter((p) => !p.needsUniqueImage)
    .slice(0, 24)
    .map((p) => ({
      id: p.slug,
      src: p.image,
      title: p.name,
      group:
        p.category === 'agriculture'
          ? 'agriculture'
          : p.category === 'spices'
            ? 'spices'
            : 'produce',
      caption: p.shortDescription,
    }));

  const items = [...facilityItems, ...productItems];
  const visible =
    filter === 'all' ? items : items.filter((item) => item.group === filter);

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title="Export Gallery | Products, Warehouse & Shipments | Mondal Export Import"
        description="Browse photographs of Mondal Export Import's agricultural commodities, fresh fruits, vegetables, spices, warehouse grading, and export packing."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold text-[#2E8B57] mb-2">
            Visual Showcase
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E]">
            Products, Packing &amp; Warehouse Gallery
          </h1>
          <p className="mt-3 text-base text-[#1B1B1B]/75">
            Inspect our export-grade commodities, grading operations, and shipment
            preparation. Click any image to view enlarged.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex flex-wrap gap-1.5 p-1 bg-white rounded-xl border border-[#0F3D2E]/10 mb-10">
          {[
            { id: 'all', label: 'All Media' },
            { id: 'facility', label: 'Warehouse & Packing' },
            { id: 'agriculture', label: 'Agriculture' },
            { id: 'produce', label: 'Fruits & Vegetables' },
            { id: 'spices', label: 'Spices' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#0F3D2E] text-[#FAF7F0]'
                  : 'text-[#0F3D2E]/75 hover:text-[#0F3D2E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry-style Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group break-inside-avoid w-full text-left bg-white rounded-2xl border border-[#0F3D2E]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
            >
              <div className="relative overflow-hidden bg-[#F1ECE0]">
                <ProductImage
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#09271D]/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-display text-lg font-semibold text-[#0F3D2E]">
                  {item.title}
                </h2>
                <p className="text-xs text-[#1B1B1B]/70 mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 relative shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close gallery lightbox"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F0] text-[#0F3D2E] flex items-center justify-center hover:bg-[#E0A526]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="max-h-[68vh] overflow-hidden rounded-2xl bg-[#FAF7F0] flex items-center justify-center">
              <img
                src={selected.src}
                alt={selected.title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-xl font-semibold text-[#0F3D2E]">
                {selected.title}
              </h3>
              <p className="text-sm text-[#1B1B1B]/75 mt-1">{selected.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
