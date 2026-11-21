import { Skeleton } from '@mui/material';
import type { ProductSummary } from '../../types';
import ProductCard from './ProductCard';

export function ProductCardSkeleton() {
  return (
    <div data-testid="product-skeleton" className="overflow-hidden rounded-xl border border-line bg-surface">
      <Skeleton variant="rectangular" sx={{ aspectRatio: '1 / 1', height: 'auto' }} animation="wave" />
      <div className="space-y-2 p-4">
        <Skeleton width="40%" />
        <Skeleton width="90%" height={24} />
        <Skeleton width="30%" />
        <Skeleton width="45%" height={28} />
        <Skeleton variant="rounded" height={40} />
      </div>
    </div>
  );
}

const GRID = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6';

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID} data-testid="product-grid-loading" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProductGrid({ products, testId = 'product-grid' }: { products: ProductSummary[]; testId?: string }) {
  return (
    <div className={GRID} data-testid={testId}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
