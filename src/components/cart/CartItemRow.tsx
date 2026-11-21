import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../types';
import { lineTotal, maxQuantityFor } from '../../utils/calculations';
import { formatCurrency, prettifySlug } from '../../utils/format';
import Price from '../common/Price';
import QuantitySelector from '../common/QuantitySelector';
import SafeImage from '../common/SafeImage';

export default function CartItemRow({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart();
  return (
    <li
      data-testid="cart-item"
      data-product-id={item.productId}
      className="flex gap-4 rounded-2xl border border-line bg-surface p-4 sm:gap-6 sm:p-5"
    >
      <Link to={`/product/${item.productId}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-50/50 sm:h-28 sm:w-28" aria-hidden tabIndex={-1}>
        <SafeImage src={item.thumbnail} alt="" className="h-full w-full object-contain p-2" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/product/${item.productId}`}
              data-testid="cart-item-title"
              className="line-clamp-2 font-semibold text-ink hover:text-brand-600"
            >
              {item.title}
            </Link>
            <p className="mt-0.5 text-xs text-muted">
              {item.brand ? `${item.brand} · ` : ''}
              {prettifySlug(item.category)}
            </p>
          </div>
          <button
            type="button"
            data-testid="cart-remove"
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => removeItem(item.productId)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-danger"
          >
            <Trash2 size={17} aria-hidden />
          </button>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            max={maxQuantityFor(item.stock)}
            onChange={(q) => setQuantity(item.productId, q)}
            testId="cart-quantity"
            itemLabel={item.title}
          />
          <div className="text-right">
            <Price price={item.price} discountPercentage={item.discountPercentage} size="sm" testIdPrefix="cart-unit" />
            <p className="mt-1 text-sm text-muted">
              Line total:{' '}
              <span data-testid="cart-item-total" className="font-semibold text-ink">
                {formatCurrency(lineTotal(item))}
              </span>
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
