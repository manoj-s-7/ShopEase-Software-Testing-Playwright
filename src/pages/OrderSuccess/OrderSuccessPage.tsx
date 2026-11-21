import { Link, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { CircleCheck, PackageSearch } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PageContainer from '../../components/common/PageContainer';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getOrder } from '../../services/db';
import { formatCurrency, formatDate } from '../../utils/format';

export default function OrderSuccessPage() {
  useDocumentTitle('Order confirmed');
  const { orderId = '' } = useParams();
  const { user } = useAuth();
  const order = user ? getOrder(user.id, orderId) : undefined;

  if (!order) {
    return (
      <PageContainer className="py-14">
        <EmptyState testId="order-not-found" icon={PackageSearch} title="Order not found" description="We could not find this order in your account.">
          <Button component={Link} to="/orders" variant="contained">
            View my orders
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow className="py-12 sm:py-16">
      <div data-testid="order-success" className="rounded-2xl border border-line bg-surface p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-success">
          <CircleCheck size={30} aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-ink sm:text-3xl">Thank you, your order is confirmed</h1>
        <p className="mt-2 text-sm text-muted">We sent the details to {order.delivery.email}.</p>
        <dl className="mx-auto mt-8 grid max-w-sm gap-3 rounded-xl bg-brand-50 p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Order ID</dt>
            <dd data-testid="order-id" className="font-semibold text-ink">{order.id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Placed on</dt>
            <dd className="text-ink">{formatDate(order.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Total</dt>
            <dd data-testid="order-total" className="font-semibold text-ink">{formatCurrency(order.totals.total)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Payment</dt>
            <dd className="text-ink">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Demo Card Payment'}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button component={Link} to={`/orders/${order.id}`} variant="contained" size="large" data-testid="view-order">
            View order details
          </Button>
          <Button component={Link} to="/shop" variant="outlined" size="large" data-testid="continue-shopping">
            Continue shopping
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
