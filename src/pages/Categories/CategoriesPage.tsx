import { Skeleton } from '@mui/material';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import CategoryCard from '../../components/products/CategoryCard';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getCategories } from '../../services/productApi';

export default function CategoriesPage() {
  useDocumentTitle('Categories');
  const { data, loading, error, reload } = useAsync((s) => getCategories(s), []);

  return (
    <PageContainer className="pb-6">
      <PageHeader title="Categories" description="Browse the store by what you are looking for." testId="categories-title" />
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-busy="true" data-testid="categories-loading">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton key={i} variant="rounded" height={150} />
          ))}
        </div>
      ) : error ? (
        <ErrorState testId="categories-error" message={error.message} onRetry={reload} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" data-testid="category-grid">
          {(data ?? []).map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} name={c.name} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
