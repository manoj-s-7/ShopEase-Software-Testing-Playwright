import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ShoppingBag } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import OrderSummary from '../../components/cart/OrderSummary';
import EmptyState from '../../components/common/EmptyState';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import SafeImage from '../../components/common/SafeImage';
import FormField from '../../components/forms/FormField';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { generateOrderId, getOrders, saveOrder } from '../../services/db';
import type { DeliveryInfo, Order, PaymentMethod } from '../../types';
import { calculateTotals, lineTotal } from '../../utils/calculations';
import { formatCurrency } from '../../utils/format';
import { rules } from '../../utils/validation';

type CheckoutValues = DeliveryInfo & { payment: PaymentMethod };

export default function CheckoutPage() {
  useDocumentTitle('Checkout');
  const { user } = useAuth();
  const { items, totals, clear } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<CheckoutValues>({
    defaultValues: {
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
      city: '',
      state: '',
      postalCode: '',
      payment: 'cod',
    },
  });

  if (items.length === 0) {
    return (
      <PageContainer className="py-14">
        <EmptyState testId="checkout-empty" icon={ShoppingBag} title="Your cart is empty" description="Add something to your cart before checking out.">
          <Button component={Link} to="/shop" variant="contained" data-testid="checkout-empty-shop">
            Browse products
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  const onSubmit = async ({ payment, ...delivery }: CheckoutValues) => {
    // Guard against double clicks / repeated Enter presses.
    if (submittingRef.current || !user) return;
    submittingRef.current = true;
    setPlacing(true);
    setSubmitError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // simulated processing
      const orderItems = items.map((i) => ({ ...i }));
      const existing = getOrders(user.id).map((o) => o.id);
      const order: Order = {
        id: generateOrderId(existing),
        userId: user.id,
        createdAt: new Date().toISOString(),
        status: 'Processing',
        items: orderItems,
        delivery: {
          fullName: delivery.fullName.trim(),
          email: delivery.email.trim(),
          phone: delivery.phone.replace(/[\s-]/g, ''),
          address: delivery.address.trim(),
          city: delivery.city.trim(),
          state: delivery.state.trim(),
          postalCode: delivery.postalCode.trim(),
        },
        paymentMethod: payment,
        totals: calculateTotals(orderItems),
      };
      if (!saveOrder(order)) throw new Error('save-failed');
      clear();
      navigate(`/order-success/${order.id}`, { replace: true });
    } catch {
      setSubmitError('We could not place your order. Please try again.');
      submittingRef.current = false;
      setPlacing(false);
    }
  };

  return (
    <PageContainer className="pb-6">
      <PageHeader title="Checkout" description="Review your details and place your order." testId="checkout-title" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="checkout-form" aria-label="Checkout" className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {submitError && (
            <Alert severity="error" data-testid="checkout-error">
              {submitError}
            </Alert>
          )}
          <section aria-labelledby="delivery-heading" className="rounded-2xl border border-line bg-surface p-6">
            <h2 id="delivery-heading" className="text-lg font-semibold text-ink">
              Delivery information
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField testId="checkout-name" label="Full name" autoComplete="name" registration={register('fullName', rules.name)} error={errors.fullName} />
              </div>
              <FormField testId="checkout-email" label="Email" type="email" autoComplete="email" registration={register('email', rules.email)} error={errors.email} />
              <FormField testId="checkout-phone" label="Phone number" type="tel" autoComplete="tel" registration={register('phone', rules.phone)} error={errors.phone} />
              <div className="sm:col-span-2">
                <FormField testId="checkout-address" label="Address" autoComplete="street-address" registration={register('address', rules.address)} error={errors.address} />
              </div>
              <FormField testId="checkout-city" label="City" autoComplete="address-level2" registration={register('city', rules.city)} error={errors.city} />
              <FormField testId="checkout-state" label="State" autoComplete="address-level1" registration={register('state', rules.state)} error={errors.state} />
              <FormField testId="checkout-postal" label="Postal code" autoComplete="postal-code" inputMode="numeric" registration={register('postalCode', rules.postalCode)} error={errors.postalCode} />
            </div>
          </section>

          <section aria-labelledby="payment-heading" className="rounded-2xl border border-line bg-surface p-6">
            <h2 id="payment-heading" className="text-lg font-semibold text-ink">
              Payment method
            </h2>
            <Controller
              name="payment"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} aria-labelledby="payment-heading" sx={{ mt: 1.5, gap: 1 }}>
                  {[
                    { value: 'cod', label: 'Cash on Delivery', hint: 'Pay in cash when your order arrives.', id: 'payment-cod' },
                    { value: 'card', label: 'Demo Card Payment', hint: 'Simulated only. No card details are collected or charged.', id: 'payment-card' },
                  ].map((o) => (
                    <FormControlLabel
                      key={o.value}
                      value={o.value}
                      control={<Radio slotProps={{ input: { 'data-testid': o.id } as object }} />}
                      sx={{ m: 0, alignItems: 'flex-start', border: '1px solid #e8e6e1', borderRadius: '10px', px: 1, py: 0.5 }}
                      label={
                        <span className="block py-1.5">
                          <span className="block text-sm font-semibold text-ink">{o.label}</span>
                          <span className="block text-xs text-muted">{o.hint}</span>
                        </span>
                      }
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </section>
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummary totals={totals} testPrefix="summary">
            <ul className="mb-5 max-h-60 space-y-3 overflow-y-auto border-b border-line pb-5" data-testid="checkout-items" aria-label="Items in your order">
              {items.map((i) => (
                <li key={i.productId} data-testid="checkout-item" className="flex items-center gap-3 text-sm">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-50/60">
                    <SafeImage src={i.thumbnail} alt="" className="h-full w-full object-contain p-1" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 font-medium text-ink">{i.title}</span>
                    <span className="text-muted">Qty {i.quantity}</span>
                  </span>
                  <span className="font-medium text-ink">{formatCurrency(lineTotal(i))}</span>
                </li>
              ))}
            </ul>
            <Button type="submit" variant="contained" size="large" fullWidth disabled={placing} data-testid="place-order">
              {placing ? 'Placing order...' : 'Place order'}
            </Button>
          </OrderSummary>
        </div>
      </form>
    </PageContainer>
  );
}
