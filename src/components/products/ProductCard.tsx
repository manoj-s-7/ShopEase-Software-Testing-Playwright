import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAddToCart } from '../../hooks/useAddToCart';
import { useWishlistToggle } from '../../hooks/useWishlistToggle';
import type { ProductSummary } from '../../types';
import { prettifySlug } from '../../utils/format';
import Price from '../common/Price';
import Rating from '../common/Rating';
import SafeImage from '../common/SafeImage';

export default function ProductCard({ product }: { product: ProductSummary }) {
  const { has } = useWishlist();
  const toggleWishlist = useWishlistToggle();
  const addToCart = useAddToCart();
  const saved = has(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <article
      data-testid="product-card"
      data-product-id={product.id}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-[0_8px_28px_rgba(28,27,34,0.08)]"
    >
      <div className="relative aspect-square bg-brand-50/50">
        <Link to={`/product/${product.id}`} data-testid="product-image-link" tabIndex={-1} aria-hidden>
          <SafeImage
            src={product.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        {product.discountPercentage >= 1 && (
          <span className="absolute left-3 top-3 rounded-md bg-surface px-2 py-1 text-xs font-semibold text-success shadow-sm">
            {Math.round(product.discountPercentage)}% off
          </span>
        )}
        <button
          type="button"
          data-testid="wishlist-toggle"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-sm transition-colors hover:text-brand-600"
        >
          <Heart size={17} className={saved ? 'fill-brand-600 text-brand-600' : ''} aria-hidden />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p data-testid="product-category" className="text-xs text-muted">
          {product.brand ? `${product.brand} · ` : ''}
          {prettifySlug(product.category)}
        </p>
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-ink">
          <Link to={`/product/${product.id}`} data-testid="product-title" className="hover:text-brand-600">
            {product.title}
          </Link>
        </h3>
        <Rating value={product.rating} />
        <div className="mt-auto pt-1">
          <Price price={product.price} discountPercentage={product.discountPercentage} size="md" />
        </div>
        <Button
          type="button"
          variant="contained"
          fullWidth
          disabled={outOfStock}
          data-testid="add-to-cart"
          startIcon={<ShoppingBag size={16} />}
          onClick={() => addToCart(product, 1)}
          sx={{ mt: 1 }}
        >
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </Button>
      </div>
    </article>
  );
}
