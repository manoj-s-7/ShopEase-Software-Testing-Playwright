import type { Category, Product, ProductListResult, ProductSummary, SortOption } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com').replace(/\/$/, '');

export type ApiErrorKind = 'network' | 'http' | 'not-found';

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiError(
      'We could not reach the product service. Check your connection and try again.',
      'network',
    );
  }
  if (response.status === 404) throw new ApiError('Not found.', 'not-found', 404);
  if (!response.ok) {
    throw new ApiError('The product service had a problem. Please try again.', 'http', response.status);
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('The product service sent an unreadable response.', 'http', response.status);
  }
}

/** Guard against missing fields in API data. */
export function normalizeProduct(raw: Partial<Product> & { id: number }): Product {
  const images = Array.isArray(raw.images) ? raw.images.filter(Boolean) : [];
  const thumbnail = raw.thumbnail || images[0] || '';
  return {
    id: raw.id,
    title: raw.title?.trim() || 'Untitled product',
    description: raw.description || 'No description available for this product.',
    category: raw.category || 'uncategorized',
    price: typeof raw.price === 'number' ? raw.price : 0,
    discountPercentage: typeof raw.discountPercentage === 'number' ? raw.discountPercentage : 0,
    rating: typeof raw.rating === 'number' ? raw.rating : 0,
    stock: typeof raw.stock === 'number' ? raw.stock : 0,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    brand: raw.brand || undefined,
    sku: raw.sku,
    weight: raw.weight,
    warrantyInformation: raw.warrantyInformation,
    shippingInformation: raw.shippingInformation,
    availabilityStatus: raw.availabilityStatus,
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    returnPolicy: raw.returnPolicy,
    minimumOrderQuantity: raw.minimumOrderQuantity,
    images: images.length > 0 ? images : thumbnail ? [thumbnail] : [],
    thumbnail,
  };
}

export const toSummary = (p: Product): ProductSummary => ({
  id: p.id,
  title: p.title,
  thumbnail: p.thumbnail,
  price: p.price,
  discountPercentage: p.discountPercentage,
  rating: p.rating,
  category: p.category,
  stock: p.stock,
  brand: p.brand,
});

interface RawList {
  products?: Array<Partial<Product> & { id: number }>;
  total?: number;
}

const normalizeList = (raw: RawList): ProductListResult => ({
  products: (raw.products ?? []).map(normalizeProduct),
  total: raw.total ?? raw.products?.length ?? 0,
});

const SORT_PARAMS: Record<Exclude<SortOption, 'relevance'>, { sortBy: string; order: 'asc' | 'desc' }> = {
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  'rating-desc': { sortBy: 'rating', order: 'desc' },
};

export interface ProductQuery {
  q?: string;
  category?: string;
  sort?: SortOption;
  page: number;
  pageSize: number;
}

function sortLocally(products: Product[], sort: SortOption): Product[] {
  if (sort === 'relevance') return products;
  const copy = [...products];
  if (sort === 'price-asc') copy.sort((a, b) => a.price - b.price || a.id - b.id);
  if (sort === 'price-desc') copy.sort((a, b) => b.price - a.price || a.id - b.id);
  if (sort === 'rating-desc') copy.sort((a, b) => b.rating - a.rating || a.id - b.id);
  return copy;
}

/**
 * GET /products, /products/search?q=, /products/category/{slug}
 * DummyJSON cannot combine search + category, so that case is filtered client-side.
 */
export async function getProducts(query: ProductQuery, signal?: AbortSignal): Promise<ProductListResult> {
  const { q = '', category = '', sort = 'relevance', page, pageSize } = query;
  const term = q.trim();
  const skip = (page - 1) * pageSize;

  if (term && category) {
    const all = normalizeList(
      await request<RawList>(`/products/search?q=${encodeURIComponent(term)}&limit=0`, signal),
    );
    const filtered = sortLocally(
      all.products.filter((p) => p.category === category),
      sort,
    );
    return { products: filtered.slice(skip, skip + pageSize), total: filtered.length };
  }

  const params = new URLSearchParams({ limit: String(pageSize), skip: String(skip) });
  if (sort !== 'relevance') {
    params.set('sortBy', SORT_PARAMS[sort].sortBy);
    params.set('order', SORT_PARAMS[sort].order);
  }
  let path = '/products';
  if (term) {
    path = '/products/search';
    params.set('q', term);
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}`;
  }
  return normalizeList(await request<RawList>(`${path}?${params.toString()}`, signal));
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const raw = await request<Array<Category | string>>('/products/categories', signal);
  return raw.map((c) =>
    typeof c === 'string' ? { slug: c, name: c, url: '' } : { slug: c.slug, name: c.name, url: c.url },
  );
}

export async function getProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return normalizeProduct(await request<Partial<Product> & { id: number }>(`/products/${id}`, signal));
}

export async function getRelatedProducts(category: string, excludeId: number, signal?: AbortSignal) {
  const list = normalizeList(
    await request<RawList>(`/products/category/${encodeURIComponent(category)}?limit=8`, signal),
  );
  return list.products.filter((p) => p.id !== excludeId).slice(0, 4);
}

export async function getTopRated(skip: number, limit: number, signal?: AbortSignal): Promise<Product[]> {
  const list = normalizeList(
    await request<RawList>(`/products?sortBy=rating&order=desc&limit=${limit}&skip=${skip}`, signal),
  );
  return list.products;
}

/** Thumbnail of the first product in a category, used as a category cover. */
export async function getCategoryCover(slug: string, signal?: AbortSignal): Promise<string | null> {
  const raw = await request<{ products?: Array<{ thumbnail?: string }> }>(
    `/products/category/${encodeURIComponent(slug)}?limit=1&select=thumbnail`,
    signal,
  );
  return raw.products?.[0]?.thumbnail ?? null;
}
