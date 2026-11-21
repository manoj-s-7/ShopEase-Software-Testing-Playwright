import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Package } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getOrders } from '../../services/db';
import { formatCurrency, formatShortDate } from '../../utils/format';

export default function OrdersPage() {
  useDocumentTitle('My orders');
  const { user } = useAuth();
  const orders = useMemo(() => (user ? getOrders(user.id) : []), [user]);

  return (
    <PageContainer className="pb-6">
      <PageHeader title="My orders" description={orders.length ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} placed` : undefined} testId="orders-title" />
      {orders.length === 0 ? (
        <EmptyState testId="orders-empty" icon={Package} title="No orders yet" description="When you place an order it will show up here.">
          <Button component={Link} to="/shop" variant="contained" data-testid="orders-shop">
            Start shopping
          </Button>
        </EmptyState>
      ) : (
        <ul className="space-y-3" data-testid="orders-list">
          {orders.map((o) => {
            const count = o.items.reduce((n, i) => n + i.quantity, 0);
            return (
              <li key={o.id} data-testid="order-row" data-order-id={o.id} className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-[1.4fr_1fr_0.8fr_0.9fr_0.9fr_auto] sm:items-center">
                <div>
                  <p className="text-xs text-muted">Order ID</p>
                  <p data-testid="order-id" className="font-semibold text-ink">{o.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Date</p>
                  <p data-testid="order-date" className="text-sm text-ink">{formatShortDate(o.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Products</p>
                  <p data-testid="order-items-count" className="text-sm text-ink">{count}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Total</p>
                  <p data-testid="order-total" className="text-sm font-semibold text-ink">{formatCurrency(o.totals.total)}</p>
                </div>
                <div>
                  <OrderStatusBadge status={o.status} />
                </div>
                <Button component={Link} to={`/orders/${o.id}`} variant="outlined" size="small" data-testid="order-view" aria-label={`View details of order ${o.id}`}>
                  View details
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}
