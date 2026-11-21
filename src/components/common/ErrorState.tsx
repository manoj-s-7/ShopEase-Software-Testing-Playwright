import { Button } from '@mui/material';
import { TriangleAlert } from 'lucide-react';

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
  testId?: string;
}

export default function ErrorState({ title = 'Something went wrong', message, onRetry, testId = 'error-state' }: Props) {
  return (
    <div
      role="alert"
      data-testid={testId}
      className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line bg-surface px-6 py-12 text-center"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-danger">
        <TriangleAlert size={22} aria-hidden />
      </span>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p data-testid={`${testId}-message`} className="mt-1.5 text-sm text-muted">
        {message}
      </p>
      {onRetry && (
        <Button type="button" variant="outlined" onClick={onRetry} data-testid="retry-button" sx={{ mt: 3 }}>
          Try again
        </Button>
      )}
    </div>
  );
}
