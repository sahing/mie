import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Inbox,
  Server,
  Plus,
  LogOut,
  Search,
  Pencil,
  Trash2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  X,
  Download,
  RefreshCw,
  MessageCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { Product, getWhatsAppLink } from '../data/siteContent';
import { useCatalog } from '../context/CatalogContext';
import {
  CategoryItem,
  EnquiryItem,
  HealthResponse,
  clearStoredToken,
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  downloadSqlSeed,
  fetchEnquiries,
  fetchHealth,
  getApiBaseUrl,
  getStoredToken,
  loginAdmin,
  setApiBaseUrlOverride,
  updateCategory,
  updateEnquiry,
  updateProduct,
  uploadProductImage,
  verifySession,
} from '../services/api';
import { SeoHead } from '../components/SeoHead';
import { ProductImage } from '../components/ProductImage';

type AdminTab = 'products' | 'categories' | 'enquiries' | 'cpanel';

function slugify(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EMPTY_PRODUCT: Product = {
  slug: '',
  name: '',
  category: 'agriculture',
  image: '/products/2-1.webp',
  gallery: [],
  shortDescription: '',
  description: '',
  specs: {
    origin: 'India',
    packaging: '25 kg / 50 kg bags (TBC)',
    moq: 'TBC',
    privateLabel: true,
    incoterms: 'FOB / CIF (TBC)',
  },
  certifications: ['ISO 9001:2015', 'FSSAI', 'APEDA'],
  needsUniqueImage: false,
  featured: false,
  seo: { title: '', description: '' },
};

export function AdminPage() {
  const { products, categories, refreshCatalog } = useCatalog();
  const [authChecked, setAuthChecked] = useState(false);
  const [authedUser, setAuthedUser] = useState<{ email: string; role: string } | null>(
    null
  );

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@mondalexportimport.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Workspace state
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Products state
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [onlyNeedsImage, setOnlyNeedsImage] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Categories state
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'new' | 'quoted' | 'closed'>(
    'all'
  );
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState<EnquiryItem['status']>('new');
  const [savingEnquiry, setSavingEnquiry] = useState(false);

  // cPanel Connection state
  const [apiUrlInput, setApiUrlInput] = useState(() => getApiBaseUrl());
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setAuthChecked(true);
      return;
    }
    verifySession()
      .then((res) => {
        if (res.ok) setAuthedUser(res.user);
      })
      .catch(() => {
        clearStoredToken();
      })
      .finally(() => setAuthChecked(true));
  }, []);

  const loadEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const list = await fetchEnquiries();
      setEnquiries(list);
    } catch (err) {
      setNotice({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to load enquiries',
      });
    } finally {
      setLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    if (authedUser && activeTab === 'enquiries') {
      loadEnquiries();
    }
  }, [authedUser, activeTab]);

  useEffect(() => {
    if (authedUser && activeTab === 'cpanel') {
      handleTestConnection(apiUrlInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authedUser, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await loginAdmin(loginEmail, loginPassword);
      setAuthedUser(res.user);
      await refreshCatalog();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setAuthedUser(null);
    setLoginPassword('');
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = catFilter === 'all' || p.category === catFilter;
      const matchFlag = !onlyNeedsImage || p.needsUniqueImage;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchFlag && matchQ;
    });
  }, [products, catFilter, onlyNeedsImage, searchQuery]);

  const sharedImageCount = useMemo(
    () => products.filter((p) => p.needsUniqueImage).length,
    [products]
  );

  const openNewProduct = () => {
    setOriginalSlug(null);
    setEditingProduct({
      ...EMPTY_PRODUCT,
      category: categories[0]?.id || 'agriculture',
    });
  };

  const openEditProduct = (p: Product) => {
    setOriginalSlug(p.slug);
    setEditingProduct(JSON.parse(JSON.stringify(p)) as Product);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);
    setNotice(null);
    try {
      const payload: Product = {
        ...editingProduct,
        slug: editingProduct.slug || slugify(editingProduct.name),
        shortDescription:
          editingProduct.shortDescription ||
          editingProduct.description.slice(0, 140),
      };
      if (originalSlug) {
        await updateProduct(originalSlug, payload);
        setNotice({ type: 'ok', text: `Updated "${payload.name}" successfully.` });
      } else {
        await createProduct(payload);
        setNotice({ type: 'ok', text: `Created "${payload.name}" successfully.` });
      }
      setEditingProduct(null);
      await refreshCatalog();
    } catch (err) {
      setNotice({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not save product.',
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}" (${p.slug}) from the catalogue?`)) {
      return;
    }
    try {
      await deleteProduct(p.slug);
      setNotice({ type: 'ok', text: `Deleted "${p.name}".` });
      await refreshCatalog();
    } catch (err) {
      setNotice({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to delete product.',
      });
    }
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setUploadingImg(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setEditingProduct({
        ...editingProduct,
        image: uploadedUrl,
        needsUniqueImage: false,
      });
      setNotice({
        type: 'ok',
        text: 'Image uploaded and assigned. Save product to publish.',
      });
    } catch (err) {
      setNotice({
        type: 'err',
        text: err instanceof Error ? err.message : 'Image upload failed.',
      });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSavingCategory(true);
    try {
      if (isNewCategory) {
        await createCategory(editingCategory);
        setNotice({
          type: 'ok',
          text: `Category "${editingCategory.name}" created.`,
        });
      } else {
        await updateCategory(editingCategory.id, editingCategory);
        setNotice({
          type: 'ok',
          text: `Category "${editingCategory.name}" updated.`,
        });
      }
      setEditingCategory(null);
      await refreshCatalog();
    } catch (err) {
      setNotice({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save category.',
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (c: CategoryItem) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCategory(c.id);
      setNotice({ type: 'ok', text: `Category "${c.name}" removed.` });
      await refreshCatalog();
    } catch (err) {
      setNotice({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not delete category.',
      });
    }
  };

  const handleSaveEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSavingEnquiry(true);
    try {
      await updateEnquiry(selectedEnquiry.id, {
        status: enquiryStatus,
        adminNotes: enquiryNotes,
      });
      setNotice({
        type: 'ok',
        text: `Updated enquiry ${selectedEnquiry.referenceId}.`,
      });
      setSelectedEnquiry(null);
      await loadEnquiries();
    } catch (err) {
      setNotice({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to update enquiry.',
      });
    } finally {
      setSavingEnquiry(false);
    }
  };

  const handleTestConnection = async (targetUrl: string) => {
    setTestingHealth(true);
    setHealthError(null);
    try {
      const res = await fetchHealth(targetUrl);
      setHealthStatus(res);
    } catch (err) {
      setHealthStatus(null);
      setHealthError(
        err instanceof Error ? err.message : 'Could not reach API health endpoint.'
      );
    } finally {
      setTestingHealth(false);
    }
  };

  const handleApplyApiUrl = async () => {
    setApiBaseUrlOverride(apiUrlInput);
    clearStoredToken();
    setAuthedUser(null);
    await refreshCatalog();
    setNotice({
      type: 'ok',
      text: `Switched active API endpoint to ${getApiBaseUrl()}. Please sign in against that server.`,
    });
  };

  const filteredEnquiries = useMemo(() => {
    if (enquiryFilter === 'all') return enquiries;
    return enquiries.filter((e) => e.status === enquiryFilter);
  }, [enquiries, enquiryFilter]);

  if (!authChecked) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#0F3D2E]" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!authedUser) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#FAF7F0] px-4 flex items-center justify-center">
        <SeoHead
          title="Admin Sign In | Mondal Export Import"
          description="Manage products, categories, images, and buyer enquiries for Mondal Export Import."
        />
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#0F3D2E]/15 p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0F3D2E] text-[#E0A526] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#0F3D2E]">
              Export Catalogue Admin
            </h1>
            <p className="text-xs text-[#1B1B1B]/65">
              Connected API:{' '}
              <span className="font-mono text-[#0F3D2E]">{getApiBaseUrl()}</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#0F3D2E]/15 text-sm focus:border-[#0F3D2E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#0F3D2E]/15 text-sm focus:border-[#0F3D2E] focus:outline-none"
              />
            </div>

            {loginError && (
              <div
                role="alert"
                className="rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/25 px-3.5 py-2.5 text-xs font-medium text-[#C0392B]"
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-[#0F3D2E] hover:bg-[#09271D] text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {loggingIn ? 'Signing In...' : 'Sign In to Admin'}
            </button>
          </form>

          {getApiBaseUrl() === '/api' && (
            <div className="pt-4 border-t border-[#0F3D2E]/10 text-xs text-[#1B1B1B]/65 space-y-1">
              <div className="font-semibold text-[#0F3D2E]">
                Preview Environment Credentials
              </div>
              <div className="font-mono">
                Email: admin@mondalexportimport.com
              </div>
              <div className="font-mono">Pass: MondalExport@2026</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-[#FAF7F0]">
      <SeoHead
        title="Admin Console | Mondal Export Import"
        description="Manage export products, categories, images, and buyer enquiries."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Admin Breadcrumb Header */}
        <div className="bg-white rounded-2xl border border-[#0F3D2E]/12 px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-[#0F3D2E]">Admin</span>
            <span className="text-[#1B1B1B]/40">/</span>
            <span className="text-[#1B1B1B]/75 capitalize">{activeTab}</span>
            <span className="text-[#1B1B1B]/30 mx-1">·</span>
            <span className="font-mono text-xs text-[#2E8B57]">
              {getApiBaseUrl()}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeTab === 'products' && (
              <button
                type="button"
                onClick={openNewProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F3D2E] hover:bg-[#09271D] text-white text-xs font-semibold whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}
            {activeTab === 'categories' && (
              <button
                type="button"
                onClick={() => {
                  setIsNewCategory(true);
                  setEditingCategory({
                    id: '',
                    name: '',
                    shortName: '',
                    description: '',
                    image: '/products/2-1.webp',
                    sortOrder: categories.length + 1,
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F3D2E] hover:bg-[#09271D] text-white text-xs font-semibold whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#0F3D2E]/20 text-xs font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className={`mb-6 rounded-xl px-4 py-3 border text-xs font-medium flex items-center justify-between gap-4 ${
              notice.type === 'ok'
                ? 'bg-[#2E8B57]/10 border-[#2E8B57]/30 text-[#0F3D2E]'
                : 'bg-[#C0392B]/10 border-[#C0392B]/30 text-[#C0392B]'
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#C0392B] shrink-0" />
              )}
              <span>{notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Workspace Sidebar (240px desktop feel) */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#0F3D2E]/12 p-3 space-y-1">
            {[
              {
                id: 'products' as AdminTab,
                label: 'Products',
                count: products.length,
                icon: Package,
              },
              {
                id: 'categories' as AdminTab,
                label: 'Categories',
                count: categories.length,
                icon: FolderTree,
              },
              {
                id: 'enquiries' as AdminTab,
                label: 'Enquiries',
                count: enquiries.length || undefined,
                icon: Inbox,
              },
              {
                id: 'cpanel' as AdminTab,
                label: 'cPanel Setup & Sync',
                icon: Server,
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#0F3D2E] text-[#FAF7F0]'
                      : 'text-[#1B1B1B]/80 hover:bg-[#FAF7F0]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && (
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        active ? 'text-[#E0A526]' : 'text-[#1B1B1B]/50'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-[#0F3D2E]/10 px-2">
              <Link
                to="/products"
                className="flex items-center justify-between text-xs font-medium text-[#2E8B57] hover:underline py-1.5"
              >
                <span>View Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Main Workspace Canvas */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl border border-[#0F3D2E]/12 overflow-hidden">
                <div className="p-4 border-b border-[#0F3D2E]/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-[#0F3D2E]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by name or slug..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FAF7F0] border border-[#0F3D2E]/15 text-xs focus:border-[#0F3D2E] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={catFilter}
                      onChange={(e) => setCatFilter(e.target.value)}
                      aria-label="Filter by category"
                      className="px-3 py-2 rounded-lg bg-[#FAF7F0] border border-[#0F3D2E]/15 text-xs font-medium text-[#0F3D2E]"
                    >
                      <option value="all">All Categories ({products.length})</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.shortName}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setOnlyNeedsImage((v) => !v)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                        onlyNeedsImage
                          ? 'bg-[#E0A526] border-[#E0A526] text-[#09271D]'
                          : 'bg-[#FAF7F0] border-[#0F3D2E]/15 text-[#0F3D2E]'
                      }`}
                    >
                      Needs Unique Image ({sharedImageCount})
                    </button>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <p className="text-sm font-medium text-[#0F3D2E]">
                      No products match the current filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCatFilter('all');
                        setOnlyNeedsImage(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#0F3D2E] text-white text-xs font-semibold"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#0F3D2E]/10 bg-[#FAF7F0]/70 text-[11px] font-semibold text-[#1B1B1B]/65">
                          <th className="py-2.5 px-4">Product</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">MOQ</th>
                          <th className="py-2.5 px-3">Image Status</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0F3D2E]/8 text-xs">
                        {filteredProducts.map((p) => (
                          <tr
                            key={p.slug}
                            className="hover:bg-[#FAF7F0]/60 transition-colors h-12"
                          >
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#F1ECE0] shrink-0">
                                  <ProductImage
                                    src={p.image}
                                    alt={p.name}
                                    category={p.category}
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-[#0F3D2E]">
                                    {p.name}
                                  </div>
                                  <div className="font-mono text-[11px] text-[#1B1B1B]/50">
                                    /{p.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-3 capitalize text-[#1B1B1B]/80">
                              {p.category}
                            </td>
                            <td className="py-2 px-3 font-mono tabular-nums text-[#1B1B1B]/75">
                              {p.specs?.moq || 'TBC'}
                            </td>
                            <td className="py-2 px-3">
                              {p.needsUniqueImage ? (
                                <span className="inline-flex items-center gap-1 text-[#C0392B] font-medium">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Shared photo</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[#2E8B57] font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Unique</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => openEditProduct(p)}
                                aria-label={`Edit ${p.name}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[#0F3D2E] hover:bg-[#0F3D2E]/10 font-medium mr-1"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p)}
                                aria-label={`Delete ${p.name}`}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[#C0392B] hover:bg-[#C0392B]/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="bg-white rounded-2xl border border-[#0F3D2E]/12 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#0F3D2E]/10 bg-[#FAF7F0]/70 text-[11px] font-semibold text-[#1B1B1B]/65">
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-3">ID Slug</th>
                        <th className="py-2.5 px-3">Products</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0F3D2E]/8 text-xs">
                      {categories.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAF7F0]/60 h-12">
                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-[#0F3D2E]">
                              {c.name}
                            </div>
                            <div className="text-[11px] text-[#1B1B1B]/60 line-clamp-1">
                              {c.description}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#1B1B1B]/70">
                            {c.id}
                          </td>
                          <td className="py-2.5 px-3 font-mono tabular-nums text-[#0F3D2E] font-semibold">
                            {c.count ?? products.filter((p) => p.category === c.id).length}
                          </td>
                          <td className="py-2.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setIsNewCategory(false);
                                setEditingCategory({ ...c });
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[#0F3D2E] hover:bg-[#0F3D2E]/10 font-medium mr-1"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(c)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[#C0392B] hover:bg-[#C0392B]/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="bg-white rounded-2xl border border-[#0F3D2E]/12 overflow-hidden">
                <div className="p-4 border-b border-[#0F3D2E]/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-lg">
                    {(['all', 'new', 'quoted', 'closed'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setEnquiryFilter(st)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                          enquiryFilter === st
                            ? 'bg-[#0F3D2E] text-white'
                            : 'text-[#0F3D2E]/70 hover:text-[#0F3D2E]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={loadEnquiries}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0F3D2E]/15 text-xs font-medium text-[#0F3D2E] hover:bg-[#FAF7F0]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                {loadingEnquiries ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-10 rounded-lg bg-[#FAF7F0] animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredEnquiries.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <p className="text-sm font-semibold text-[#0F3D2E]">
                      No buyer enquiries found
                    </p>
                    <p className="text-xs text-[#1B1B1B]/65">
                      Submissions from the Contact page or Product Enquiry cards will
                      appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#0F3D2E]/10 bg-[#FAF7F0]/70 text-[11px] font-semibold text-[#1B1B1B]/65">
                          <th className="py-2.5 px-4">Ref</th>
                          <th className="py-2.5 px-3">Buyer</th>
                          <th className="py-2.5 px-3">Country</th>
                          <th className="py-2.5 px-3">Products</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0F3D2E]/8 text-xs">
                        {filteredEnquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-[#FAF7F0]/60 h-12">
                            <td className="py-2.5 px-4 font-mono tabular-nums text-[#0F3D2E]">
                              {enq.referenceId}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-[#1B1B1B]">
                                {enq.name}
                              </div>
                              <div className="text-[11px] text-[#1B1B1B]/60">
                                {enq.company || enq.email}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-[#1B1B1B]/80">
                              {enq.country}
                            </td>
                            <td className="py-2.5 px-3 max-w-[180px] truncate text-[#1B1B1B]/75">
                              {enq.products?.join(', ') || 'General'}
                            </td>
                            <td className="py-2.5 px-3 capitalize font-medium">
                              <span
                                className={
                                  enq.status === 'new'
                                    ? 'text-[#D97706]'
                                    : enq.status === 'quoted'
                                      ? 'text-[#2E8B57]'
                                      : 'text-[#1B1B1B]/55'
                                }
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEnquiry(enq);
                                  setEnquiryStatus(enq.status);
                                  setEnquiryNotes(enq.adminNotes || '');
                                }}
                                className="px-3 py-1.5 rounded-md bg-[#0F3D2E]/8 hover:bg-[#0F3D2E] hover:text-white text-[#0F3D2E] font-medium transition-colors"
                              >
                                Open
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CPANEL SETUP & SYNC */}
            {activeTab === 'cpanel' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#0F3D2E]/12 p-6 space-y-4">
                  <h2 className="font-display text-2xl font-semibold text-[#0F3D2E]">
                    Connect to Your cPanel PHP &amp; MySQL API
                  </h2>
                  <p className="text-sm text-[#1B1B1B]/75 leading-relaxed">
                    Once you upload the <code className="font-mono">/cpanel-api/</code>{' '}
                    files to <code className="font-mono">public_html/api/</code> on your
                    cPanel hosting and import the MySQL schema, enter your API URL below
                    to test connectivity or switch this frontend live.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={apiUrlInput}
                      onChange={(e) => setApiUrlInput(e.target.value)}
                      placeholder="https://mondalexportimport.com/api"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#0F3D2E]/15 font-mono text-xs focus:border-[#0F3D2E] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTestConnection(apiUrlInput)}
                      disabled={testingHealth}
                      className="px-4 py-2.5 rounded-xl border border-[#0F3D2E]/20 text-xs font-semibold text-[#0F3D2E] hover:bg-[#FAF7F0] whitespace-nowrap"
                    >
                      {testingHealth ? 'Testing...' : 'Test /health'}
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyApiUrl}
                      className="px-4 py-2.5 rounded-xl bg-[#0F3D2E] text-white text-xs font-semibold hover:bg-[#09271D] whitespace-nowrap"
                    >
                      Use This API
                    </button>
                  </div>

                  {healthStatus && (
                    <div className="rounded-xl bg-[#2E8B57]/10 border border-[#2E8B57]/25 p-4 text-xs space-y-1">
                      <div className="font-semibold text-[#0F3D2E]">
                        Connected: {healthStatus.engine}
                      </div>
                      <div className="font-mono tabular-nums text-[#1B1B1B]/80">
                        Products: {healthStatus.productCount} · Categories:{' '}
                        {healthStatus.categoryCount}
                      </div>
                    </div>
                  )}

                  {healthError && (
                    <div className="rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/25 p-4 text-xs text-[#C0392B]">
                      {healthError}
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#0F3D2E]/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-[#0F3D2E]">
                        Export Current Catalogue for cPanel phpMyAdmin
                      </div>
                      <p className="text-xs text-[#1B1B1B]/65 mt-0.5">
                        Downloads <code className="font-mono">mondal-seed.sql</code>{' '}
                        with all {products.length} products and {categories.length}{' '}
                        categories ready to import after <code className="font-mono">schema.sql</code>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadSqlSeed().catch((err) =>
                          setNotice({
                            type: 'err',
                            text: err instanceof Error ? err.message : 'Export failed',
                          })
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E0A526] hover:bg-[#C9911A] text-[#09271D] text-xs font-semibold whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download MySQL seed.sql</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT EDITOR MODAL */}
      {editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit Product"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#0F3D2E]/15 shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[#0F3D2E]/10 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#0F3D2E]">
                {originalSlug ? `Edit ${editingProduct.name}` : 'Add Export Product'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-lg hover:bg-[#FAF7F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        name,
                        slug: originalSlug ? editingProduct.slug : slugify(name),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        slug: slugify(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as Product['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Product Image Upload / Path *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={editingProduct.image}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          image: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 rounded-lg border border-[#0F3D2E]/15 font-mono text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E0A526] text-[#09271D] text-xs font-semibold cursor-pointer hover:bg-[#C9911A] whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImg ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.needsUniqueImage}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        needsUniqueImage: e.target.checked,
                      })
                    }
                  />
                  <span>Flag as needing a unique replacement photo</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.featured)}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        featured: e.target.checked,
                      })
                    }
                  />
                  <span>Featured on Home Carousel</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                  Full Export Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    value={editingProduct.specs.origin}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, origin: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Packaging
                  </label>
                  <input
                    type="text"
                    value={editingProduct.specs.packaging}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, packaging: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Minimum Order (MOQ)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.specs.moq}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, moq: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Incoterms
                  </label>
                  <input
                    type="text"
                    value={editingProduct.specs.incoterms}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, incoterms: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Certifications (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.certifications.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        certifications: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-xs"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.specs.privateLabel}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          specs: {
                            ...editingProduct.specs,
                            privateLabel: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>Private Labelling Available</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0F3D2E]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-lg border border-[#0F3D2E]/20 text-xs font-semibold text-[#0F3D2E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 rounded-lg bg-[#0F3D2E] text-white text-xs font-semibold hover:bg-[#09271D] disabled:opacity-60"
                >
                  {savingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY EDITOR MODAL */}
      {editingCategory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit Category"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#0F3D2E]/15 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#0F3D2E]">
                {isNewCategory ? 'Add Category' : `Edit ${editingCategory.name}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-lg hover:bg-[#FAF7F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                  Category ID Slug *
                </label>
                <input
                  type="text"
                  required
                  disabled={!isNewCategory}
                  value={editingCategory.id}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      id: slugify(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 font-mono text-xs disabled:bg-[#FAF7F0]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                    Tab Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.shortName}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        shortName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-lg border border-[#0F3D2E]/20 text-xs font-semibold text-[#0F3D2E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-5 py-2 rounded-lg bg-[#0F3D2E] text-white text-xs font-semibold"
                >
                  {savingCategory ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENQUIRY DETAIL MODAL */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enquiry Details"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#0F3D2E]/15 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-[#2E8B57]">
                  {selectedEnquiry.referenceId}
                </div>
                <h2 className="font-display text-xl font-semibold text-[#0F3D2E]">
                  {selectedEnquiry.name} · {selectedEnquiry.country}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg hover:bg-[#FAF7F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#FAF7F0] p-4 text-xs space-y-1.5">
              <div>
                <strong>Company:</strong> {selectedEnquiry.company || 'N/A'}
              </div>
              <div>
                <strong>Email:</strong> {selectedEnquiry.email}
              </div>
              <div>
                <strong>Phone / WhatsApp:</strong> {selectedEnquiry.phone}
              </div>
              <div>
                <strong>Products:</strong>{' '}
                {selectedEnquiry.products?.join(', ') || 'General'}
              </div>
              <div>
                <strong>Quantity:</strong> {selectedEnquiry.quantity || 'TBC'}
              </div>
              <div className="pt-2 border-t border-[#0F3D2E]/10">
                <strong>Message:</strong>
                <p className="mt-1 whitespace-pre-wrap text-[#1B1B1B]/80">
                  {selectedEnquiry.message}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEnquiry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                  Workflow Status
                </label>
                <select
                  value={enquiryStatus}
                  onChange={(e) =>
                    setEnquiryStatus(e.target.value as EnquiryItem['status'])
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-xs font-medium"
                >
                  <option value="new">New</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F3D2E] mb-1">
                  Internal Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={enquiryNotes}
                  onChange={(e) => setEnquiryNotes(e.target.value)}
                  placeholder="Record quoted FOB/CIF rate, container notes, or follow-up dates..."
                  className="w-full px-3 py-2 rounded-lg border border-[#0F3D2E]/15 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={getWhatsAppLink(
                    `Hello ${selectedEnquiry.name}, regarding your Mondal Export Import enquiry (${selectedEnquiry.referenceId})...`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E8B57] text-white text-xs font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Reply on WhatsApp</span>
                </a>
                <button
                  type="submit"
                  disabled={savingEnquiry}
                  className="px-5 py-2 rounded-lg bg-[#0F3D2E] text-white text-xs font-semibold"
                >
                  {savingEnquiry ? 'Saving...' : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
