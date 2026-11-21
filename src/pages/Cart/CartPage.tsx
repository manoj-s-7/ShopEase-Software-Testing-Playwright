import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ShoppingBag } from 'lucide-react';
import CartItemRow from '../../components/cart/CartItemRow';
import OrderSummary from '../../components/cart/OrderSummary';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { amountToFreeShipping } from '../../utils/calculations';

export default function CartPage() {
  useDocumentTitle('Shopping cart');
  const { items, totals, clear } = useCart();
  const navigate = useNavigate();

  return (
    <PageContainer className="pb-6">
      <PageHeader
        title="Shopping cart"
        testId="cart-title"
        description={items.length ? `${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'} in your cart` : undefined}
        actions={
          items.length > 0 ? (
            <Button type="button" variant="text" color="inherit" data-testid="cart-clear" onClick={clear} sx={{ color: 'text.secondary' }}>
              Clear cart
            </Button>
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <EmptyState testId="cart-empty" icon={ShoppingBag} title="Your cart is empty" description="Looks like you have not added anything yet.">
          <Button component={Link} to="/shop" variant="contained" data-testid="empty-cart-shop">
            Continue shopping
          </Button>
        </EmptyState>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <ul className="space-y-4" data-testid="cart-list" aria-label="Cart items">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </ul>
          <div className="lg:sticky lg:top-24">
            <OrderSummary totals={totals} testPrefix="cart" freeShippingGap={amountToFreeShipping(items)}>
              <Button type="button" variant="contained" size="large" fullWidth data-testid="checkout-button" onClick={() => navigate('/checkout')}>
                Proceed to checkout
              </Button>
              <Button component={Link} to="/shop" variant="text" fullWidth data-testid="continue-shopping" sx={{ mt: 1 }}>
                Continue shopping
              </Button>
            </OrderSummary>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
