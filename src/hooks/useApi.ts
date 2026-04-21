import { useState, useCallback, useRef, useEffect } from 'react';
import { parseError, AppError } from '@/errors/errorHandler';
import { RETRYABLE_CODES } from '@/errors/errorCodes';

interface QueryState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface MutationState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

/**
 * useQuery — fetch data on mount with loading/error/retry states.
 * Cancels stale requests on unmount or re-fetch.
 */
export function useQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    isLoading: true,
    isSuccess: false,
  });

  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const data = await fetcher(controller.signal);
      if (!controller.signal.aborted) {
        setState({ data, error: null, isLoading: false, isSuccess: true });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setState({ data: null, error: parseError(err), isLoading: false, isSuccess: false });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
    return () => abortRef.current?.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return { ...state, refetch: execute };
}

/**
 * useMutation — trigger async operations with loading/error/success states.
 * Prevents duplicate submissions.
 */
export function useMutation<TInput, TOutput>(
  mutator: (input: TInput) => Promise<TOutput>
) {
  const [state, setState] = useState<MutationState<TOutput>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
  });

  const abortRef = useRef<AbortController | null>(null);

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      if (state.isLoading) return null; // prevent duplicate submissions

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setState({ data: null, error: null, isLoading: true, isSuccess: false });

      try {
        const data = await mutator(input);
        setState({ data, error: null, isLoading: false, isSuccess: true });
        return data;
      } catch (err) {
        const parsed = parseError(err);
        setState({ data: null, error: parsed, isLoading: false, isSuccess: false });
        return null;
      }
    },
    [mutator, state.isLoading]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false, isSuccess: false });
  }, []);

  // Cleanup on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  return { ...state, mutate, reset, canRetry: state.error ? RETRYABLE_CODES.has(state.error.code) : false };
}
