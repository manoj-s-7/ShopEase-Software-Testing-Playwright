import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Skeleton } from '@mui/material';
import { ChevronRight, Heart, PackageSearch, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Price from '../../components/common/Price';
import QuantitySelector from '../../components/common/QuantitySelector';
import Rating from '../../components/common/Rating';
import SafeImage from '../../components/common/SafeImage';
import ProductGrid, { ProductGridSkeleton } from '../../components/products/ProductGrid';
import { useWishlist } from '../../context/WishlistContext';
import { useAddToCart } from '../../hooks/useAddToCart';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useWishlistToggle } from '../../hooks/useWishlistToggle';
import { ApiError, getProduct, getRelatedProducts, toSummary } from '../../services/productApi';
import type { Product } from '../../types';
import { maxQuantityFor } from '../../utils/calculations';
import { formatShortDate, prettifySlug } from '../../utils/format';

function Loading() {
  return (
    <PageContainer className="grid gap-10 py-10 lg:grid-cols-2" aria-busy="true">
      <div data-testid="product-details-loading">
        <Skeleton variant="rounded" sx={{ aspectRatio: '1 / 1', height: 'auto' }} />
      </div>
      <div className="space-y-4">
        <Skeleton width="30%" />
        <Skeleton height={44} />
        <Skeleton width="40%" />
        <Skeleton height={40} width="35%" />
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={48} />
      </div>
    </PageContainer>
  );
}

function Details({ product }: { product: Product }) {
  useDocumentTitle(product.title);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const toggleWishlist = useWishlistToggle();
  const { has } = useWishlist();
  const related = useAsync((s) => getRelatedProducts(product.category, product.id, s), [product.category, product.id]);

  const max = maxQuantityFor(product.stock);
  const outOfStock = max < 1;
  const saved = has(product.id);
  const availability = outOfStock ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In stock';
  const images = product.images;
  const facts: Array<[string, string | undefined]> = [
    ['SKU', product.sku],
    ['Warranty', product.warrantyInformation],
    ['Shipping', product.shippingInformation],
    ['Returns', product.returnPolicy],
  ];

  return (
    <PageContainer className="pb-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 py-6 text-sm text-muted">
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <ChevronRight size={14} aria-hidden />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-ink" data-testid="breadcrumb-category">
          {prettifySlug(product.category)}
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="line-clamp-1 text-ink" aria-current="page">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div data-testid="product-gallery">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface">
            <SafeImage src={images[activeImage]} alt={product.title} data-testid="gallery-main-image" className="h-full w-full object-contain p-6" />
          </div>
          {images.length > 1 && (
            <ul className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Product images">
              {images.map((src, i) => (
                <li key={src + i}>
                  <button
                    type="button"
                    data-testid="gallery-thumb"
                    aria-label={`Show image ${i + 1} of ${images.length}`}
                    aria-pressed={i === activeImage}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-surface transition-colors ${i === activeImage ? 'border-brand-600 ring-1 ring-brand-600' : 'border-line hover:border-brand-500'}`}
                  >
                    <SafeImage src={src} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-sm text-muted">
            <span data-testid="product-brand">{product.brand ?? 'Unbranded'}</span> · <span data-testid="product-category">{prettifySlug(product.category)}</span>
          </p>
          <h1 data-testid="product-title" className="mt-2 text-3xl font-bold leading-tight text-ink">
            {product.title}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviews.length || undefined} />
            <span
              data-testid="product-availability"
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${outOfStock ? 'bg-red-50 text-danger' : product.stock <= 5 ? 'bg-amber-50 text-warning' : 'bg-green-50 text-success'}`}
            >
              {availability}
            </span>
          </div>
          <div className="mt-5">
            <Price price={product.price} discountPercentage={product.discountPercentage} size="lg" />
          </div>
          <p data-testid="product-description" className="mt-5 max-w-prose leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mt-7 flex flex-wrap items-start gap-3">
            <QuantitySelector value={quantity} max={max} onChange={setQuantity} testId="product-quantity" itemLabel={product.title} disabled={outOfStock} />
            <Button
              type="button"
              variant="contained"
              size="large"
              disabled={outOfStock}
              data-testid="add-to-cart"
              startIcon={<ShoppingBag size={18} />}
              onClick={() => addToCart(toSummary(product), quantity)}
              sx={{ minHeight: 42 }}
            >
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="large"
              data-testid="wishlist-toggle"
              aria-pressed={saved}
              startIcon={<Heart size={18} className={saved ? 'fill-current' : ''} />}
              onClick={() => toggleWishlist(toSummary(product))}
              sx={{ minHeight: 42 }}
            >
              {saved ? 'Saved to wishlist' : 'Add to wishlist'}
            </Button>
          </div>

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-sm text-muted sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck size={16} className="text-brand-600" aria-hidden /> Free shipping over $100</li>
            <li className="flex items-center gap-2"><RotateCcw size={16} className="text-brand-600" aria-hidden /> Simple returns</li>
            <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-brand-600" aria-hidden /> Secure demo checkout</li>
          </ul>

          {facts.some(([, v]) => v) && (
            <dl className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface text-sm" data-testid="product-facts">
              {facts.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex gap-4 px-4 py-3">
                  <dt className="w-24 shrink-0 text-muted">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section aria-labelledby="reviews" className="mt-14" data-testid="product-reviews">
          <h2 id="reviews" className="text-xl font-bold text-ink">Customer reviews</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {product.reviews.slice(0, 3).map((r, i) => (
              <li key={i} className="rounded-xl border border-line bg-surface p-5">
                <Rating value={r.rating} testId="review-rating" />
                <p className="mt-3 text-sm text-ink">{r.comment}</p>
                <p className="mt-3 text-xs text-muted">{r.reviewerName} · {formatShortDate(r.date)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="related" className="mt-14" data-testid="related-products">
        <h2 id="related" className="mb-5 text-xl font-bold text-ink">You may also like</h2>
        {related.loading ? (
          <ProductGridSkeleton count={4} />
        ) : related.error ? (
          <p className="text-sm text-muted" data-testid="related-error">Related products are unavailable right now.</p>
        ) : (related.data ?? []).length === 0 ? (
          <p className="text-sm text-muted">No related products found.</p>
        ) : (
          <ProductGrid products={related.data ?? []} testId="related-grid" />
        )}
      </section>
    </PageContainer>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);
  const valid = Number.isInteger(productId) && productId > 0;
  const state = useAsync(
    (s) => (valid ? getProduct(productId, s) : Promise.reject(new ApiError('Not found.', 'not-found', 404))),
    [productId, valid],
  );
  useDocumentTitle(state.data?.title ?? 'Product');

  if (state.loading) return <Loading />;
  if (state.error) {
    const notFound = state.error instanceof ApiError && state.error.kind === 'not-found';
    return (
      <PageContainer className="py-16">
        {notFound ? (
          <EmptyState testId="product-not-found" icon={PackageSearch} title="Product not found" description="This product does not exist or is no longer available.">
            <Button component={Link} to="/shop" variant="contained">Back to shop</Button>
          </EmptyState>
        ) : (
          <ErrorState testId="product-error" title="We could not load this product" message={state.error.message} onRetry={state.reload} />
        )}
      </PageContainer>
    );
  }
  if (!state.data) return null;
  return <Details key={state.data.id} product={state.data} />;
}
