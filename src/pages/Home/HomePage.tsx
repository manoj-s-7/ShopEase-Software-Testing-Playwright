import { Link } from 'react-router-dom';
import { Button, Skeleton } from '@mui/material';
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import ErrorState from '../../components/common/ErrorState';
import SafeImage from '../../components/common/SafeImage';
import NewsletterForm from '../../components/forms/NewsletterForm';
import CategoryCard from '../../components/products/CategoryCard';
import ProductGrid, { ProductGridSkeleton } from '../../components/products/ProductGrid';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getCategoryCover, getTopRated } from '../../services/productApi';
import DeploymentBuildFailureProbe from '../../components/common/DeploymentBuildFailureProbe';

const FEATURED = ['beauty', 'furniture', 'smartphones', 'mens-watches', 'womens-bags', 'sunglasses'];

function SectionHeading({ title, subtitle, to, linkLabel, id }: { title: string; subtitle?: string; to: string; linkLabel: string; id: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="text-2xl font-bold text-ink">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      <Link to={to} className="text-sm font-semibold text-brand-600 hover:underline">
        {linkLabel}
      </Link>
    </div>
  );
}

export default function HomePage() {
  useDocumentTitle();
  const trending = useAsync((s) => getTopRated(0, 8, s), []);
  const bestSellers = useAsync((s) => getTopRated(8, 8, s), []);
  const covers = useAsync(
    async (s) => {
      const results = await Promise.allSettled(FEATURED.map((slug) => getCategoryCover(slug, s)));
      return results.map((r) => (r.status === 'fulfilled' ? r.value : null));
    },
    [],
  );

  const heroImages = trending.data?.slice(0, 3) ?? [];

  return (
    <>
      <section className="border-b border-line" data-testid="hero">
        <PageContainer className="grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <span className="mb-5 inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-brand-700">
              CI/CD DEPLOYMENT TEST • V1
            </span>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] text-ink sm:text-5xl">Discover products worth keeping.</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              A small, carefully organised catalogue of everyday essentials, from skincare and furniture to watches and phones.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button component={Link} to="/shop" variant="contained" size="large" data-testid="hero-shop-now">
                Shop now
              </Button>
              <Button component={Link} to="/categories" variant="outlined" size="large" data-testid="hero-browse-categories">
                Browse categories
              </Button>
            </div>
            <ul className="mt-10 grid max-w-xl gap-4 text-sm text-muted sm:grid-cols-3">
              {[
                { icon: Truck, text: 'Free shipping over $100' },
                { icon: RotateCcw, text: 'Simple returns' },
                { icon: ShieldCheck, text: 'Safe demo checkout' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon size={18} className="text-brand-600" aria-hidden /> {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-6 grid-rows-2 gap-4" aria-label="Featured products" data-testid="hero-collage">
            {trending.loading || heroImages.length < 3 ? (
              <>
                <Skeleton variant="rounded" className="col-span-4 row-span-2" sx={{ height: 360 }} />
                <Skeleton variant="rounded" className="col-span-2" sx={{ height: 172 }} />
                <Skeleton variant="rounded" className="col-span-2" sx={{ height: 172 }} />
              </>
            ) : (
              <>
                <Link to={`/product/${heroImages[0].id}`} className="col-span-4 row-span-2 flex items-center justify-center rounded-2xl bg-brand-50 p-6" aria-label={heroImages[0].title}>
                  <SafeImage src={heroImages[0].thumbnail} alt={heroImages[0].title} className="max-h-80 w-full object-contain" />
                </Link>
                {heroImages.slice(1).map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="col-span-2 flex items-center justify-center rounded-2xl border border-line bg-surface p-3" aria-label={p.title}>
                    <SafeImage src={p.thumbnail} alt={p.title} className="h-36 w-full object-contain" />
                  </Link>
                ))}
              </>
            )}
          </div>
        </PageContainer>
      </section>

      <section aria-labelledby="featured-categories" className="py-14" data-testid="featured-categories">
        <PageContainer>
          <SectionHeading id="featured-categories" title="Shop by category" to="/categories" linkLabel="All categories" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
            {FEATURED.map((slug, i) => (
              <CategoryCard key={slug} slug={slug} cover={covers.data?.[i] ?? null} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section aria-labelledby="trending" className="pb-14" data-testid="trending-products">
        <PageContainer>
          <SectionHeading id="trending" title="Trending now" subtitle="The highest rated products in the store." to="/shop?sort=rating-desc" linkLabel="View all" />
          {trending.loading ? (
            <ProductGridSkeleton count={4} />
          ) : trending.error ? (
            <ErrorState testId="trending-error" message={trending.error.message} onRetry={trending.reload} />
          ) : (
            <ProductGrid products={(trending.data ?? []).slice(0, 4)} testId="trending-grid" />
          )}
        </PageContainer>
      </section>

      <section className="pb-14" aria-label="Promotion" data-testid="promo-banner">
        <PageContainer>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-900 px-8 py-10 text-white sm:flex-row sm:items-center sm:px-12">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Free shipping on orders over $100</h2>
              <p className="mt-2 max-w-lg text-brand-100/80">Discounts are already applied to every price you see. Fill your cart and delivery costs nothing.</p>
            </div>
            <Button component={Link} to="/shop" variant="contained" size="large" data-testid="promo-cta" sx={{ bgcolor: '#fff', color: '#1d1b4b', '&:hover': { bgcolor: '#e3e1f4' } }}>
              Start shopping
            </Button>
          </div>
        </PageContainer>
      </section>

      <section aria-labelledby="best-sellers" className="pb-14" data-testid="best-sellers">
        <PageContainer>
          <SectionHeading id="best-sellers" title="Best sellers" subtitle="Customer favourites that keep coming back." to="/shop" linkLabel="View all" />
          {bestSellers.loading ? (
            <ProductGridSkeleton count={4} />
          ) : bestSellers.error ? (
            <ErrorState testId="best-sellers-error" message={bestSellers.error.message} onRetry={bestSellers.reload} />
          ) : (
            <ProductGrid products={(bestSellers.data ?? []).slice(0, 4)} testId="best-sellers-grid" />
          )}
        </PageContainer>
      </section>

      <section aria-labelledby="newsletter" className="pb-6" data-testid="newsletter">
        <PageContainer>
          <div className="grid items-center gap-6 rounded-2xl border border-line bg-surface px-8 py-10 md:grid-cols-2 md:px-12">
            <div>
              <h2 id="newsletter" className="text-2xl font-bold text-ink">
                Get new arrivals in your inbox
              </h2>
              <p className="mt-2 text-sm text-muted">One short email a month. Unsubscribe whenever you like.</p>
            </div>
            <NewsletterForm />
          </div>
        </PageContainer>
      </section>
    </>
  );
}
