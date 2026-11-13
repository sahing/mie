import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '../data/siteContent';
import { useCatalog } from '../context/CatalogContext';
import { SeoHead } from '../components/SeoHead';
import { ProductCard } from '../components/ProductCard';

export function ProductsPage({ forcedCategory }: { forcedCategory?: string }) {
  const { products: allProducts, categories } = useCatalog();
  const categorySet = useMemo(() => new Set(categories.map((c) => c.id)), [categories]);
  const { category: paramCategory } = useParams<{ category?: string }>();
  const routeCategory = forcedCategory || paramCategory;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialCat =
    routeCategory && categorySet.has(routeCategory)
      ? routeCategory
      : searchParams.get('category') && categorySet.has(searchParams.get('category')!)
        ? searchParams.get('category')!
        : 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'default');
  const [showImageAudit, setShowImageAudit] = useState(false);

  useEffect(() => {
    if (routeCategory && categorySet.has(routeCategory)) {
      setSelectedCategory(routeCategory);
    } else if (!routeCategory) {
      const paramCat = searchParams.get('category');
      setSelectedCategory(paramCat && categorySet.has(paramCat) ? paramCat : 'all');
    }
  }, [routeCategory, searchParams, categorySet]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const nextParams = new URLSearchParams(searchParams);
    if (query) nextParams.set('q', query);
    if (sortBy !== 'default') nextParams.set('sort', sortBy);

    if (cat === 'all') {
      nextParams.delete('category');
      navigate(`/products${nextParams.toString() ? `?${nextParams.toString()}` : ''}`);
    } else {
      nextParams.delete('category');
      navigate(`/products/${cat}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`);
    }
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    const next = new URLSearchParams(searchParams);
    if (val) next.set('q', val);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    const next = new URLSearchParams(searchParams);
    if (val !== 'default') next.set('sort', val);
    else next.delete('sort');
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allProducts.filter((p) => {
      const catMatch = selectedCategory === 'all' || p.category === selectedCategory;
      const textMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return catMatch && textMatch;
    });

    if (sortBy === 'az') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'za') {
      return [...list].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortBy === 'category') {
      return [...list].sort((a, b) => a.category.localeCompare(b.category));
    }
    return list;
  }, [allProducts, selectedCategory, query, sortBy]);

  const activeCategoryMeta = categories.find((c) => c.id === selectedCategory);
  const pageTitle = activeCategoryMeta
    ? `${activeCategoryMeta.name} Exporter India | Mondal Export Import`
    : `All ${allProducts.length} Export Products | Agricultural, Fruits, Vegetables & Spices`;
  const pageDescription = activeCategoryMeta
    ? activeCategoryMeta.description
    : `Browse all ${allProducts.length} export commodities supplied globally by Mondal Export Import: Basmati & Non-Basmati rice, pulses, fresh fruits, vegetables, and whole spices.`;

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead title={pageTitle} description={pageDescription} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold text-[#2E8B57] mb-2">
            Export Product Catalogue · {filtered.length} Items Shown
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance">
            {activeCategoryMeta ? activeCategoryMeta.name : 'All Export Products'}
          </h1>
          <p className="mt-3 text-base text-[#1B1B1B]/75 leading-relaxed">
            {pageDescription}
          </p>
        </div>

        {/* Filter Bar & Search Controls */}
        <div className="bg-white rounded-2xl border border-[#0F3D2E]/10 p-4 mb-10 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#0F3D2E] text-[#FAF7F0]'
                    : 'text-[#0F3D2E]/75 hover:text-[#0F3D2E]'
                }`}
              >
                All ({allProducts.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#0F3D2E] text-[#FAF7F0]'
                      : 'text-[#0F3D2E]/75 hover:text-[#0F3D2E]'
                  }`}
                >
                  {cat.shortName} (
                  {cat.count ?? allProducts.filter((p) => p.category === cat.id).length})
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#0F3D2E]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search rice, turmeric, mango..."
                  aria-label="Search export products"
                  className="w-full pl-10 pr-8 py-2 rounded-xl bg-[#FAF7F0] border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1B1B1B]/50 hover:text-[#0F3D2E]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0F3D2E]/60 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  aria-label="Sort products"
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#0F3D2E]/15 text-xs font-medium text-[#0F3D2E] focus:outline-none"
                >
                  <option value="default">Sort: Catalogue Order</option>
                  <option value="az">Sort: A – Z</option>
                  <option value="za">Sort: Z – A</option>
                  <option value="category">Sort: Category</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#1B1B1B]/60 pt-2 border-t border-[#0F3D2E]/8">
            <span className="tabular-nums">
              Showing {filtered.length} of {allProducts.length} export products
            </span>
            <button
              type="button"
              onClick={() => setShowImageAudit((v) => !v)}
              className="text-[#0F3D2E] hover:underline font-medium"
            >
              {showImageAudit ? 'Hide Image Replacement Flags' : 'Show Shared Image Flags'}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#0F3D2E]/10 p-12 text-center space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#0F3D2E]">
              No matching commodities found
            </h2>
            <p className="text-sm text-[#1B1B1B]/70 max-w-md mx-auto">
              Try clearing your search filter or switching to All Categories to view all
              45 Indian export commodities.
            </p>
            <button
              type="button"
              onClick={() => {
                handleSearchChange('');
                handleCategoryChange('all');
              }}
              className="px-6 py-2.5 rounded-full bg-[#0F3D2E] text-white text-sm font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product) => (
              <motion.div key={product.slug} layout>
                <ProductCard product={product} showImageNotice={showImageAudit} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
