import { discountedUnitPrice } from '../../utils/calculations';
import { formatCurrency } from '../../utils/format';

interface Props {
  price: number;
  discountPercentage: number;
  size?: 'sm' | 'md' | 'lg';
  testIdPrefix?: string;
}

const SIZES = { sm: 'text-base', md: 'text-lg', lg: 'text-3xl' } as const;

export default function Price({ price, discountPercentage, size = 'md', testIdPrefix = 'product' }: Props) {
  const final = discountedUnitPrice(price, discountPercentage);
  const hasDiscount = discountPercentage > 0 && final < price;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span data-testid={`${testIdPrefix}-price`} className={`font-display font-bold text-ink ${SIZES[size]}`}>
        {formatCurrency(final)}
      </span>
      {hasDiscount && (
        <>
          <s data-testid={`${testIdPrefix}-original-price`} className="text-sm text-muted">
            {formatCurrency(price)}
          </s>
          <span data-testid={`${testIdPrefix}-discount`} className="text-sm font-semibold text-success">
            {Math.round(discountPercentage)}% off
          </span>
        </>
      )}
    </div>
  );
}
