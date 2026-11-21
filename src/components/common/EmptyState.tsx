import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  testId?: string;
}

export default function EmptyState({ icon: Icon, title, description, children, testId }: Props) {
  return (
    <div
      data-testid={testId}
      className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon size={22} aria-hidden />
      </span>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
