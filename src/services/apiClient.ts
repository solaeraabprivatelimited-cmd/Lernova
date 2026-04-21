/**
 * Enhanced API client with:
 * - Exponential backoff retry (max 2 retries for retryable errors)
 * - Request cancellation via AbortController
 * - Standardized error parsing
 * - Auth token injection from existing api.ts
 */

import { API_URL, getAccessToken } from '@/app/lib/api';
import { parseError, AppError } from '@/errors/errorHandler';
import { RETRYABLE_CODES, ErrorCode } from '@/errors/errorCodes';

export interface RequestOptions extends Omit<RequestInit, 'signal'> {
  timeout?: number;
  maxRetries?: number;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT = 30_000;
const MAX_RETRIES = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestOptions = {},
  attempt = 0
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, maxRetries = MAX_RETRIES, signal: externalSignal, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Merge external signal
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  const token = getAccessToken();

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers ?? {}),
      },
    });

    clearTimeout(timeoutId);

    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = {};
    }

    if (!res.ok) {
      const err = parseError(body, res.status);

      // Retry on retryable errors
      if (RETRYABLE_CODES.has(err.code) && attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 8000);
        await sleep(delay);
        return fetchWithRetry<T>(url, options, attempt + 1);
      }

      throw err;
    }

    return body as T;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err && typeof err === 'object' && 'code' in err) {
      // Already an AppError
      throw err;
    }

    const parsed = parseError(err);

    if (RETRYABLE_CODES.has(parsed.code) && attempt < maxRetries) {
      const delay = Math.min(1000 * 2 ** attempt, 8000);
      await sleep(delay);
      return fetchWithRetry<T>(url, options, attempt + 1);
    }

    throw parsed;
  }
}

export const apiClient = {
  get<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
    return fetchWithRetry<T>(`${API_URL}${path}`, { ...options, method: 'GET' });
  },

  post<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchWithRetry<T>(`${API_URL}${path}`, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchWithRetry<T>(`${API_URL}${path}`, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
    return fetchWithRetry<T>(`${API_URL}${path}`, { ...options, method: 'DELETE' });
  },
};

export type { AppError };
export { ErrorCode };
