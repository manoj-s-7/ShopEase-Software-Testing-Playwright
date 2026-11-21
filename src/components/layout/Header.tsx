import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Divider, Drawer, Menu, MenuItem } from '@mui/material';
import { ChevronDown, Heart, LogOut, Menu as MenuIcon, ShoppingBag, UserRound, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { initials } from '../../utils/format';
import SearchBox from './SearchBox';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-muted hover:text-ink'
  }`;

function CountBadge({ count, testId }: { count: number; testId: string }) {
  return (
    <span
      data-testid={testId}
      aria-label={`${count} items`}
      className={`absolute -right-1 -top-1 min-w-[18px] rounded-full bg-brand-600 px-1 text-center text-[11px] font-semibold leading-[18px] text-white ${
        count > 0 ? '' : 'hidden'
      }`}
    >
      {count}
    </span>
  );
}

const iconButton =
  'relative flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-brand-50';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlist } = useWishlist();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home', id: 'home' },
    { to: '/shop', label: 'Shop', id: 'shop' },
    { to: '/categories', label: 'Categories', id: 'categories' },
    ...(user ? [] : [{ to: '/about', label: 'About', id: 'about' }]),
  ];

  const go = (path: string) => {
    setAnchor(null);
    setDrawerOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setAnchor(null);
    setDrawerOpen(false);
    logout();
    navigate('/');
    notify('You have been signed out.');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className={`${iconButton} md:hidden`}
          aria-label="Open menu"
          data-testid="nav-menu-button"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon size={20} aria-hidden />
        </button>

        <Link to="/" className="flex items-center gap-2" data-testid="nav-logo" aria-label="ShopEase home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <ShoppingBag size={17} aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">ShopEase</span>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.id} to={l.to} end={l.to === '/'} className={linkClass} data-testid={`nav-${l.id}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <SearchBox testPrefix="nav-search" className="ml-auto hidden w-full max-w-xs md:block lg:max-w-sm" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {user && (
            <Link to="/wishlist" aria-label="Wishlist" data-testid="nav-wishlist" className={iconButton}>
              <Heart size={20} aria-hidden />
              <CountBadge count={wishlist.length} testId="wishlist-count" />
            </Link>
          )}
          <Link to="/cart" aria-label="Shopping cart" data-testid="nav-cart" className={iconButton}>
            <ShoppingBag size={20} aria-hidden />
            <CountBadge count={itemCount} testId="cart-count" />
          </Link>

          {user ? (
            <>
              <button
                type="button"
                data-testid="nav-account-menu"
                aria-label="Account menu"
                aria-haspopup="menu"
                onClick={(e) => setAnchor(e.currentTarget)}
                className="ml-1 flex h-10 items-center gap-2 rounded-lg pl-1 pr-2 transition-colors hover:bg-brand-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {initials(user.name)}
                </span>
                <ChevronDown size={14} className="hidden text-muted sm:block" aria-hidden />
              </button>
              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ list: { 'aria-label': 'Account' } }}>
                <div className="px-4 pb-2 pt-1">
                  <p data-testid="nav-user-name" className="text-sm font-semibold text-ink">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
                <Divider />
                <MenuItem data-testid="nav-account" onClick={() => go('/account')}>
                  My Account
                </MenuItem>
                <MenuItem data-testid="nav-orders" onClick={() => go('/orders')}>
                  My Orders
                </MenuItem>
                <MenuItem data-testid="nav-wishlist-menu" onClick={() => go('/wishlist')}>
                  Wishlist
                </MenuItem>
                <Divider />
                <MenuItem data-testid="nav-logout" onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div className="ml-1 hidden items-center gap-1 sm:flex">
              <Link to="/login" data-testid="nav-login" className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-brand-50">
                Login
              </Link>
              <Link
                to="/register"
                data-testid="nav-register"
                className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} slotProps={{ paper: { sx: { width: 300 } } }}>
        <div className="flex h-full flex-col p-5" data-testid="mobile-menu">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-display text-lg font-bold">ShopEase</span>
            <button type="button" className={iconButton} aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
              <X size={20} aria-hidden />
            </button>
          </div>
          <SearchBox testPrefix="mobile-nav-search" onSearched={() => setDrawerOpen(false)} />
          <nav aria-label="Mobile" className="mt-5 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.id}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setDrawerOpen(false)}
                className={linkClass}
                data-testid={`mobile-nav-${l.id}`}
              >
                {l.label}
              </NavLink>
            ))}
            {user && (
              <>
                <NavLink to="/wishlist" onClick={() => setDrawerOpen(false)} className={linkClass} data-testid="mobile-nav-wishlist">
                  Wishlist
                </NavLink>
                <NavLink to="/orders" onClick={() => setDrawerOpen(false)} className={linkClass} data-testid="mobile-nav-orders">
                  My Orders
                </NavLink>
                <NavLink to="/account" onClick={() => setDrawerOpen(false)} className={linkClass} data-testid="mobile-nav-account">
                  My Account
                </NavLink>
              </>
            )}
          </nav>
          <div className="mt-auto border-t border-line pt-4">
            {user ? (
              <button
                type="button"
                data-testid="mobile-nav-logout"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-brand-50"
              >
                <LogOut size={16} aria-hidden /> Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  data-testid="mobile-nav-login"
                  onClick={() => go('/login')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  <UserRound size={16} aria-hidden /> Login
                </button>
                <button
                  type="button"
                  data-testid="mobile-nav-register"
                  onClick={() => go('/register')}
                  className="rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
}
