import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
  testId?: string;
}

export default function PageHeader({ title, description, actions, testId }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-8 sm:pt-10">
      <div>
        <h1 data-testid={testId} className="text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-muted sm:text-base">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
