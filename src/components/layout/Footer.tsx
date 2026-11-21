import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { DEV_TOOLS_ENABLED } from '../../utils/devTools';
import PageContainer from '../common/PageContainer';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { to: '/shop', label: 'All products' },
      { to: '/categories', label: 'Categories' },
      { to: '/shop?sort=rating-desc', label: 'Top rated' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/account', label: 'My account' },
      { to: '/orders', label: 'My orders' },
      { to: '/wishlist', label: 'Wishlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About ShopEase' },
      { to: '/cart', label: 'Shopping cart' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface" data-testid="footer">
      <PageContainer className="grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link to="/" className="flex items-center gap-2" aria-label="ShopEase home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ShoppingBag size={17} aria-hidden />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">ShopEase</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted">
            A calm, considered place to shop. Fewer distractions, better products, honest prices.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold text-ink">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </PageContainer>
      <div className="border-t border-line">
        <PageContainer className="flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-muted">
          <p>&copy; 2026 ShopEase. A demo store built for a software testing project; no real payments are taken.</p>
          {DEV_TOOLS_ENABLED && (
            <Link to="/dev/reset" data-testid="dev-reset-link" className="font-medium text-brand-600 hover:underline">
              Reset demo data
            </Link>
          )}
        </PageContainer>
      </div>
    </footer>
  );
}
