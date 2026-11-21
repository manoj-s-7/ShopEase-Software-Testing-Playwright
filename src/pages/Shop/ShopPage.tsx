import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Pagination } from '@mui/material';
import { Search, SearchX, X } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import SelectField from '../../components/common/SelectField';
import ProductGrid, { ProductGridSkeleton } from '../../components/products/ProductGrid';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getCategories, getProducts } from '../../services/productApi';
import type { SortOption } from '../../types';
import { prettifySlug } from '../../utils/format';

const PAGE_SIZE = 12;
const SORTS: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
];

export default function ShopPage() {
  useDocumentTitle('Shop');
  const [params, setParams] = useSearchParams();

  const q = (params.get('q') ?? '').trim();
  const category = params.get('category') ?? '';
  const sortParam = params.get('sort');
  const sort: SortOption = SORTS.some((s) => s.value === sortParam) ? (sortParam as SortOption) : 'relevance';
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);

  const [searchDraft, setSearchDraft] = useState(q);
  useEffect(() => setSearchDraft(q), [q]);

  const categories = useAsync((s) => getCategories(s), []);
  const products = useAsync((s) => getProducts({ q, category, sort, page, pageSize: PAGE_SIZE }, s), [q, category, sort, page]);

  const update = (patch: Record<string, string | undefined>, resetPage = true) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (resetPage) next.delete('page');
    setParams(next);
  };

  const total = products.data?.total ?? 0;
  const list = products.data?.products ?? [];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(q || category || sort !== 'relevance');

  // Out-of-range page (e.g. ?page=99): fall back to the first page.
  useEffect(() => {
    if (!products.loading && !products.error && list.length === 0 && total > 0 && page > 1) {
      update({ page: undefined }, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.loading, products.error, list.length, total, page]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    update({ q: searchDraft.trim() || undefined });
  };

  const categoryOptions = categories.data ?? [];
  const categoryLabel = category ? (categoryOptions.find((c) => c.slug === category)?.name ?? prettifySlug(category)) : '';
  const heading = categoryLabel || (q ? `Results for "${q}"` : 'All products');

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <PageContainer className="pb-6">
      <PageHeader title={heading} testId="shop-title" description={q && categoryLabel ? `Searching "${q}" in ${categoryLabel}` : undefined} />

      <div className="mb-6 grid gap-4 rounded-2xl border border-line bg-surface p-4 md:grid-cols-[1.6fr_1fr_1fr] md:items-end">
        <form role="search" onSubmit={submitSearch} noValidate className="flex flex-col gap-1.5">
          <label htmlFor="product-search" className="text-sm font-medium text-ink">
            Search products
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="product-search"
                type="search"
                data-testid="product-search"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                placeholder="Try phone, mascara, desk"
                autoComplete="off"
                className="h-10 w-full rounded-[10px] border border-line bg-surface pl-3.5 pr-3 text-sm text-ink outline-none placeholder:text-muted hover:border-brand-500 focus:border-brand-600"
              />
            </div>
            <Button type="submit" variant="contained" data-testid="search-submit" startIcon={<Search size={16} />}>
              Search
            </Button>
          </div>
        </form>
        <SelectField label="Category" testId="category-filter" value={category} onChange={(v) => update({ category: v || undefined })}>
          <option value="">All categories</option>
          {category && !categoryOptions.some((c) => c.slug === category) && <option value={category}>{prettifySlug(category)}</option>}
          {categoryOptions.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="Sort by" testId="sort-select" value={sort} onChange={(v) => update({ sort: v === 'relevance' ? undefined : v })}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mb-4 flex min-h-[28px] flex-wrap items-center justify-between gap-3">
        <p data-testid="results-count" className="text-sm text-muted" aria-live="polite">
          {products.loading ? 'Loading products...' : products.error ? '' : total === 0 ? '0 products' : `Showing ${from}-${to} of ${total} products`}
        </p>
        {hasFilters && (
          <button
            type="button"
            data-testid="clear-filters"
            onClick={() => setParams(new URLSearchParams())}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
          >
            <X size={14} aria-hidden /> Clear filters
          </button>
        )}
      </div>

      {products.loading ? (
        <ProductGridSkeleton count={PAGE_SIZE} />
      ) : products.error ? (
        <ErrorState testId="shop-error" title="We could not load products" message={products.error.message} onRetry={products.reload} />
      ) : list.length === 0 ? (
        <EmptyState
          testId="no-results"
          icon={SearchX}
          title="No products found"
          description={q ? `Nothing matched "${q}"${categoryLabel ? ` in ${categoryLabel}` : ''}. Check the spelling or try a broader term.` : 'There are no products in this category yet.'}
        >
          <Button type="button" variant="contained" data-testid="no-results-clear" onClick={() => setParams(new URLSearchParams())}>
            Clear search and filters
          </Button>
        </EmptyState>
      ) : (
        <ProductGrid products={list} />
      )}

      {!products.loading && !products.error && totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            data-testid="pagination"
            count={totalPages}
            page={Math.min(page, totalPages)}
            shape="rounded"
            color="primary"
            onChange={(_, value) => {
              update({ page: value === 1 ? undefined : String(value) }, false);
              window.scrollTo({ top: 0 });
            }}
          />
        </div>
      )}
    </PageContainer>
  );
}
