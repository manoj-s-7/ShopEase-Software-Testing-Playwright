import { Star } from 'lucide-react';

interface Props {
  value: number;
  count?: number;
  testId?: string;
}

export default function Rating({ value, count, testId = 'product-rating' }: Props) {
  const rounded = Math.round(value * 10) / 10;
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted" data-testid={testId}>
      <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden />
      <span className="font-medium text-ink" aria-label={`Rated ${rounded.toFixed(1)} out of 5`}>
        {rounded.toFixed(1)}
      </span>
      {count !== undefined && <span>({count})</span>}
    </span>
  );
}
