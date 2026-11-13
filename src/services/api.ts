import { Product } from '../data/siteContent';

export interface CategoryItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  sortOrder: number;
  count?: number;
}

export interface EnquiryItem {
  id: string;
  referenceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  products: string[];
  quantity: string;
  message: string;
  status: 'new' | 'quoted' | 'closed';
  adminNotes: string;
  createdAt: string;
}

export interface HealthResponse {
  ok: boolean;
  engine: string;
  productCount: number;
  categoryCount: number;
  timestamp: string;
}

const TOKEN_KEY = 'mei_admin_token';
const BASE_URL_OVERRIDE_KEY = 'mei_api_base_url';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem(BASE_URL_OVERRIDE_KEY);
    if (override && override.trim()) {
      return override.trim().replace(/\/+$/, '');
    }
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '/api';
}

export function setApiBaseUrlOverride(url: string) {
  if (typeof window === 'undefined') return;
  const cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned || cleaned === '/api') {
    localStorage.removeItem(BASE_URL_OVERRIDE_KEY);
  } else {
    localStorage.setItem(BASE_URL_OVERRIDE_KEY, cleaned);
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  customBase?: string
): Promise<T> {
  const base = (customBase || getApiBaseUrl()).replace(/\/+$/, '');
  const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let parsed: Record<string, unknown> = {};
  try {
    parsed = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    throw new Error(`Unexpected server response (${res.status}).`);
  }
  if (!res.ok) {
    throw new Error(
      (parsed.error as string) || `Request failed with status ${res.status}`
    );
  }
  return parsed as T;
}

export async function fetchHealth(customBase?: string): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health', { method: 'GET' }, customBase);
}

export async function loginAdmin(email: string, password: string) {
  const data = await apiRequest<{
    ok: boolean;
    token: string;
    expiresAt: number;
    user: { email: string; role: string };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) setStoredToken(data.token);
  return data;
}

export async function verifySession() {
  return apiRequest<{ ok: boolean; user: { email: string; role: string } }>(
    '/auth/me',
    { method: 'GET' }
  );
}

export async function fetchProducts(): Promise<Product[]> {
  return apiRequest<Product[]>('/products', { method: 'GET' });
}

export async function createProduct(product: Product) {
  return apiRequest<{ ok: boolean; product: Product }>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(originalSlug: string, product: Product) {
  return apiRequest<{ ok: boolean; product: Product }>(
    `/products/${encodeURIComponent(originalSlug)}`,
    {
      method: 'PUT',
      body: JSON.stringify(product),
    }
  );
}

export async function deleteProduct(slug: string) {
  return apiRequest<{ ok: boolean }>(
    `/products/${encodeURIComponent(slug)}`,
    { method: 'DELETE' }
  );
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  return apiRequest<CategoryItem[]>('/categories', { method: 'GET' });
}

export async function createCategory(category: CategoryItem) {
  return apiRequest<{ ok: boolean; category: CategoryItem }>('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategory(id: string, category: CategoryItem) {
  return apiRequest<{ ok: boolean; category: CategoryItem }>(
    `/categories/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(category),
    }
  );
}

export async function deleteCategory(id: string) {
  return apiRequest<{ ok: boolean }>(
    `/categories/${encodeURIComponent(id)}`,
    { method: 'DELETE' }
  );
}

export async function uploadProductImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await apiRequest<{ ok: boolean; url: string }>('/upload', {
    method: 'POST',
    body: form,
  });
  return res.url;
}

export async function fetchEnquiries(): Promise<EnquiryItem[]> {
  return apiRequest<EnquiryItem[]>('/enquiries', { method: 'GET' });
}

export async function updateEnquiry(
  id: string,
  patch: { status?: EnquiryItem['status']; adminNotes?: string }
) {
  return apiRequest<{ ok: boolean; enquiry?: EnquiryItem }>(
    `/enquiries/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }
  );
}

export async function downloadSqlSeed(): Promise<void> {
  const base = getApiBaseUrl();
  const token = getStoredToken();
  const res = await fetch(`${base}/export-sql`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error('Could not export SQL seed from the current API.');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mondal-seed.sql';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
