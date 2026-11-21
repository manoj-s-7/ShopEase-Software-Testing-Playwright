import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Price from '../../components/common/Price';
import Rating from '../../components/common/Rating';
import SafeImage from '../../components/common/SafeImage';
import { useWishlist } from '../../context/WishlistContext';
import { useAddToCart } from '../../hooks/useAddToCart';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../context/ToastContext';
import { prettifySlug } from '../../utils/format';

export default function WishlistPage() {
  useDocumentTitle('Wishlist');
  const { items, remove } = useWishlist();
  const addToCart = useAddToCart();
  const { notify } = useToast();

  return (
    <PageContainer className="pb-6">
      <PageHeader title="Wishlist" description={items.length ? `${items.length} saved ${items.length === 1 ? 'item' : 'items'}` : undefined} testId="wishlist-title" />
      {items.length === 0 ? (
        <EmptyState testId="wishlist-empty" icon={Heart} title="Your wishlist is empty" description="Tap the heart on any product to save it for later.">
          <Button component={Link} to="/shop" variant="contained" data-testid="wishlist-browse">
            Browse products
          </Button>
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="wishlist-list">
          {items.map((p) => (
            <li key={p.id} data-testid="wishlist-item" data-product-id={p.id} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
              <Link to={`/product/${p.id}`} aria-hidden tabIndex={-1} className="h-28 w-28 shrink-0 rounded-xl bg-brand-50/50">
                <SafeImage src={p.thumbnail} alt="" className="h-full w-full object-contain p-2" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <p className="text-xs text-muted">{prettifySlug(p.category)}</p>
                <Link to={`/product/${p.id}`} data-testid="wishlist-item-title" className="line-clamp-2 font-semibold text-ink hover:text-brand-600">
                  {p.title}
                </Link>
                <Rating value={p.rating} />
                <Price price={p.price} discountPercentage={p.discountPercentage} size="sm" />
                <div className="mt-auto flex gap-2 pt-2">
                  <Button
                    type="button"
                    size="small"
                    variant="contained"
                    disabled={p.stock <= 0}
                    data-testid="wishlist-move-to-cart"
                    startIcon={<ShoppingBag size={14} />}
                    onClick={() => {
                      const result = addToCart(p, 1);
                      if (result !== 'out-of-stock') {
                        remove(p.id);
                        notify('Moved to your cart.');
                      }
                    }}
                  >
                    {p.stock <= 0 ? 'Out of stock' : 'Move to cart'}
                  </Button>
                  <Button type="button" size="small" variant="outlined" data-testid="wishlist-remove" aria-label={`Remove ${p.title} from wishlist`} onClick={() => remove(p.id)}>
                    <Trash2 size={15} aria-hidden />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
