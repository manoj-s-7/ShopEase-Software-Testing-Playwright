import type { ChangeEvent, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  testId: string;
  children: ReactNode;
}

/** Native <select> (easy to drive from Playwright's selectOption) with the app's styling. */
export default function SelectField({ label, value, onChange, testId, children }: Props) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      <span className="relative block">
        <select
          data-testid={testId}
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-[10px] border border-line bg-surface pl-3 pr-9 text-sm font-normal text-ink outline-none transition-colors hover:border-brand-500 focus:border-brand-600"
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
      </span>
    </label>
  );
}
