import type { ReactNode } from 'react';
import type { Totals } from '../../types';
import { formatCurrency } from '../../utils/format';

interface Props {
  totals: Totals;
  /** 'cart' or 'summary' - prefix for data-testid values. */
  testPrefix: string;
  title?: string;
  freeShippingGap?: number;
  children?: ReactNode;
}

export default function OrderSummary({ totals, testPrefix, title = 'Order summary', freeShippingGap = 0, children }: Props) {
  const row = 'flex items-center justify-between text-sm';
  return (
    <section aria-label={title} className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <dl className="mt-5 space-y-3">
        <div className={row}>
          <dt className="text-muted">Items</dt>
          <dd data-testid={`${testPrefix}-items-count`} className="font-medium text-ink">
            {totals.itemCount}
          </dd>
        </div>
        <div className={row}>
          <dt className="text-muted">Subtotal</dt>
          <dd data-testid={`${testPrefix}-subtotal`} className="font-medium text-ink">
            {formatCurrency(totals.subtotal)}
          </dd>
        </div>
        <div className={row}>
          <dt className="text-muted">Discount</dt>
          <dd data-testid={`${testPrefix}-discount`} className="font-medium text-success">
            {totals.discount > 0 ? `-${formatCurrency(totals.discount)}` : formatCurrency(0)}
          </dd>
        </div>
        <div className={row}>
          <dt className="text-muted">Shipping</dt>
          <dd data-testid={`${testPrefix}-shipping`} className="font-medium text-ink">
            {totals.shipping > 0 ? formatCurrency(totals.shipping) : 'Free'}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <dt className="font-semibold text-ink">Total</dt>
          <dd data-testid={`${testPrefix}-total`} className="font-display text-xl font-bold text-ink">
            {formatCurrency(totals.total)}
          </dd>
        </div>
      </dl>
      {freeShippingGap > 0 && (
        <p data-testid={`${testPrefix}-free-shipping-hint`} className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
          Add {formatCurrency(freeShippingGap)} more to get free shipping.
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
