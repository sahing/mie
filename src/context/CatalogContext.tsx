import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import initialProducts from '../../data/products.json';
import { CATEGORIES as INITIAL_CATEGORIES, Product } from '../data/siteContent';
import {
  CategoryItem,
  fetchCategories,
  fetchProducts,
} from '../services/api';

interface CatalogContextValue {
  products: Product[];
  categories: CategoryItem[];
  loading: boolean;
  refreshCatalog: () => Promise<void>;
}

const DEFAULT_CATEGORIES: CategoryItem[] = INITIAL_CATEGORIES.map((c, idx) => ({
  id: c.id,
  name: c.name,
  shortName: c.shortName,
  description: c.description,
  image: c.image,
  sortOrder: idx + 1,
  count: c.count,
}));

const CatalogContext = createContext<CatalogContextValue>({
  products: initialProducts as Product[],
  categories: DEFAULT_CATEGORIES,
  loading: false,
  refreshCatalog: async () => {},
});

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    initialProducts as Product[]
  );
  const [categories, setCategories] =
    useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);

  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const [liveProducts, liveCategories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      if (Array.isArray(liveProducts) && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
      if (Array.isArray(liveCategories) && liveCategories.length > 0) {
        setCategories(liveCategories);
      }
    } catch {
      // Keep bundled fallback data seamlessly if API is offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  return (
    <CatalogContext.Provider
      value={{ products, categories, loading, refreshCatalog }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
