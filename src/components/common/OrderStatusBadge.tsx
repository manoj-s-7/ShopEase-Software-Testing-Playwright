import type { OrderStatus } from '../../types';

const STYLES: Record<OrderStatus, string> = {
  Processing: 'bg-amber-50 text-warning',
  Shipped: 'bg-brand-50 text-brand-700',
  Delivered: 'bg-green-50 text-success',
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span data-testid="order-status" className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
      {status}
    </span>
  );
}
