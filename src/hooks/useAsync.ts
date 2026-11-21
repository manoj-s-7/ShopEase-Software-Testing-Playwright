import { useCallback, useEffect, useState, type DependencyList } from 'react';
import { ApiError } from '../services/productApi';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;
}

/** Runs an abortable async function whenever `deps` change. */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error('Something went wrong.'),
        });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, reload };
}
