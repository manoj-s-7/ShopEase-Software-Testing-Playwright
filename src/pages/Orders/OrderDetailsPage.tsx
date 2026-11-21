import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { ArrowLeft, PackageSearch } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import PageContainer from '../../components/common/PageContainer';
import SafeImage from '../../components/common/SafeImage';
import OrderSummary from '../../components/cart/OrderSummary';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getOrder, updateOrderStatus } from '../../services/db';
import type { OrderStatus } from '../../types';
import { lineTotal } from '../../utils/calculations';
import { DEV_TOOLS_ENABLED } from '../../utils/devTools';
import { formatCurrency, formatDate, prettifySlug } from '../../utils/format';

const STEPS: OrderStatus[] = ['Processing', 'Shipped', 'Delivered'];

export default function OrderDetailsPage() {
  useDocumentTitle('Order details');
  const { orderId = '' } = useParams();
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  // `version` is bumped after a status change so the order is re-read from storage.
  const order = user ? (void version, getOrder(user.id, orderId)) : undefined;

  if (!order || !user) {
    return (
      <PageContainer className="py-14">
        <EmptyState testId="order-not-found" icon={PackageSearch} title="Order not found" description="This order does not exist in your account.">
          <Button component={Link} to="/orders" variant="contained">
            Back to my orders
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  const stepIndex = STEPS.indexOf(order.status);
  const next = STEPS[stepIndex + 1];
  const d = order.delivery;

  return (
    <PageContainer className="pb-6">
      <div className="pt-8">
        <Link to="/orders" data-testid="back-to-orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft size={15} aria-hidden /> My orders
        </Link>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            Order <span data-testid="order-id">{order.id}</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Placed on <span data-testid="order-date">{formatDate(order.createdAt)}</span>
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <ol className="mb-8 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-surface p-5" aria-label="Order progress" data-testid="order-progress">
        {STEPS.map((s, i) => (
          <li key={s} className="text-center text-sm" aria-current={i === stepIndex ? 'step' : undefined}>
            <div className={`mx-auto mb-2 h-1.5 w-full rounded-full ${i <= stepIndex ? 'bg-brand-600' : 'bg-line'}`} />
            <span className={i <= stepIndex ? 'font-semibold text-ink' : 'text-muted'}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-surface p-6" aria-labelledby="items-heading">
            <h2 id="items-heading" className="text-lg font-semibold text-ink">Items</h2>
            <ul className="mt-4 divide-y divide-line" data-testid="order-items">
              {order.items.map((i) => (
                <li key={i.productId} data-testid="order-item" className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-50/60">
                    <SafeImage src={i.thumbnail} alt="" className="h-full w-full object-contain p-1.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${i.productId}`} data-testid="order-item-title" className="line-clamp-1 font-medium text-ink hover:text-brand-600">
                      {i.title}
                    </Link>
                    <p className="text-xs text-muted">{prettifySlug(i.category)} · Qty {i.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-ink">{formatCurrency(lineTotal(i))}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-line bg-surface p-6" aria-labelledby="delivery-heading" data-testid="order-delivery">
            <h2 id="delivery-heading" className="text-lg font-semibold text-ink">Delivery information</h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
              <span className="font-medium text-ink">{d.fullName}</span>
              <br />
              {d.address}
              <br />
              {d.city}, {d.state} {d.postalCode}
              <br />
              {d.phone} · {d.email}
            </address>
            <p className="mt-4 text-sm text-muted">
              Payment: <span data-testid="order-payment" className="font-medium text-ink">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Demo Card Payment'}</span>
            </p>
          </section>
        </div>
        <div className="lg:sticky lg:top-24">
          <OrderSummary totals={order.totals} testPrefix="order">
            {DEV_TOOLS_ENABLED && next && (
              <Button
                type="button"
                variant="outlined"
                fullWidth
                data-testid="advance-order-status"
                onClick={() => {
                  updateOrderStatus(user.id, order.id, next);
                  setVersion((v) => v + 1);
                }}
              >
                Simulate status: {next}
              </Button>
            )}
          </OrderSummary>
        </div>
      </div>
    </PageContainer>
  );
}
