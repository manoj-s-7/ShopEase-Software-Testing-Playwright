import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import type { ProductSummary } from '../types';

/** Toggle a product in the wishlist, sending guests to sign in first. */
export function useWishlistToggle() {
  const { user } = useAuth();
  const { toggle } = useWishlist();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (product: ProductSummary) => {
      if (!user) {
        navigate('/login', {
          state: {
            from: location.pathname + location.search,
            notice: 'Please sign in to save items to your wishlist.',
          },
        });
        return;
      }
      const result = toggle(product);
      notify(result === 'added' ? 'Added to your wishlist.' : 'Removed from your wishlist.');
    },
    [user, toggle, notify, navigate, location],
  );
}
