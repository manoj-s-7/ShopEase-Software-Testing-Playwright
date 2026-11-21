import { useEffect, useState, type ChangeEvent } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MESSAGES } from '../../utils/validation';

interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** Test id of the input; buttons/errors get -decrease / -increase / -error suffixes. */
  testId: string;
  itemLabel?: string;
  disabled?: boolean;
}

export default function QuantitySelector({ value, max, onChange, testId, itemLabel = 'item', disabled = false }: Props) {
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState('');

  useEffect(() => setDraft(String(value)), [value]);

  const step = (delta: number) => {
    setError('');
    onChange(Math.min(Math.max(value + delta, 1), Math.max(max, 1)));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setDraft(raw);
    const n = Number(raw);
    if (raw === '' || n < 1 || n > max) {
      setError(MESSAGES.quantity(max));
      return;
    }
    setError('');
    onChange(n);
  };

  const btn =
    'flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-muted/50 disabled:hover:bg-transparent';

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="inline-flex items-center overflow-hidden rounded-[10px] border border-line bg-surface">
        <button
          type="button"
          className={btn}
          aria-label={`Decrease quantity of ${itemLabel}`}
          data-testid={`${testId}-decrease`}
          disabled={disabled || value <= 1}
          onClick={() => step(-1)}
        >
          <Minus size={16} aria-hidden />
        </button>
        <input
          type="text"
          inputMode="numeric"
          aria-label={`Quantity of ${itemLabel}`}
          aria-invalid={error ? true : undefined}
          data-testid={testId}
          className="h-10 w-12 border-x border-line bg-transparent text-center text-sm font-semibold text-ink outline-none focus:bg-brand-50"
          value={draft}
          disabled={disabled}
          onChange={handleChange}
          onBlur={() => setDraft(String(value))}
        />
        <button
          type="button"
          className={btn}
          aria-label={`Increase quantity of ${itemLabel}`}
          data-testid={`${testId}-increase`}
          disabled={disabled || value >= max}
          onClick={() => step(1)}
        >
          <Plus size={16} aria-hidden />
        </button>
      </div>
      {error && (
        <p role="alert" data-testid={`${testId}-error`} className="max-w-[10rem] text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
