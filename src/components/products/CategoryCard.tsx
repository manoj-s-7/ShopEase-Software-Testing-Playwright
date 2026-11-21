import { Link } from 'react-router-dom';
import SafeImage from '../common/SafeImage';
import { prettifySlug } from '../../utils/format';
import { categoryIcon } from './categoryIcon';

interface Props {
  slug: string;
  name?: string;
  cover?: string | null;
}

export default function CategoryCard({ slug, name, cover }: Props) {
  const Icon = categoryIcon(slug);
  const label = name || prettifySlug(slug);
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(slug)}`}
      data-testid="category-card"
      data-category={slug}
      aria-label={`Browse ${label}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-[0_8px_28px_rgba(28,27,34,0.08)]"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-brand-50/60">
        {cover ? (
          <SafeImage src={cover} alt="" className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]" />
        ) : (
          <Icon size={34} className="text-brand-500" aria-hidden />
        )}
      </div>
      <div className="flex items-center gap-2 px-4 py-3">
        <Icon size={16} className="shrink-0 text-brand-600" aria-hidden />
        <span data-testid="category-name" className="truncate text-sm font-semibold text-ink">
          {label}
        </span>
      </div>
    </Link>
  );
}
