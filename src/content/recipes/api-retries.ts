import type { RecipeContent } from '@/types/content';

export const apiRetriesRecipe: RecipeContent = {
  id: 'api-retries',
  title: 'API Retries',
  description: 'Implement retry logic with exponential backoff for failed API calls.',
  slug: 'recipes/api-retries',
  pillar: 'recipes',
  category: 'performance',
  tags: ['retries', 'api', 'error-handling'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Retry failed API requests with exponential backoff and jitter to handle transient failures.',
  relatedTopics: ['error-fallback', 'debouncing'],
  order: 7,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['retry', 'backoff', 'exponential', 'jitter', 'resilience', 'circuit breaker'],
  problem: 'Network requests fail sometimes — could be temporary. Retrying with backoff helps you get through those hiccups.',
  pitfalls: [
    'Retrying POST requests (can create duplicates)',
    'No upper limit on retries (infinite loops suck)',
    'Not using jitter (causes thundering herd)',
    'Retrying 4xx errors (client bugs won\'t fix themselves)',
    'Ignoring the Retry-After header (the server tells you when to try again)',
  ],
  variations: ['Linear backoff', 'Exponential with jitter', 'Circuit breaker pattern', 'Retry queue'],
  sections: [
    { type: 'heading', level: 2, text: 'Basic Retry with Backoff', id: 'basic-backoff' },
    { type: 'code', language: 'typescript', filename: 'retry.ts', code: `interface RetryOptions {\\n  maxRetries?: number;\\n  baseDelay?: number;\\n  maxDelay?: number;\\n  retryCondition?: (error: Error, response?: Response) => boolean;\\n}\\n\\nasync function fetchWithRetry(\\n  url: string,\\n  options?: RequestInit,\\n  retryOptions?: RetryOptions\\n): Promise<Response> {\\n  const {\\n    maxRetries = 3,\\n    baseDelay = 1000,\\n    maxDelay = 10000,\\n    retryCondition = defaultRetryCondition,\\n  } = retryOptions ?? {};\\n\\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\\n    try {\\n      const res = await fetch(url, options);\\n      if (res.ok) return res;\\n\\n      // Only retry on specific status codes\\n      if (!retryCondition(new Error(res.statusText), res)) {\\n        return res; // don’t retry\\n      }\\n    } catch (err) {\\n      // Network error â might be temporary\\n      if (attempt === maxRetries) throw err;\\n    }\\n\\n    // Calculate delay with exponential backoff\\n    const delay = Math.min(\\n      baseDelay * Math.pow(2, attempt),\\n      maxDelay\\n    );\\n\\n    await new Promise(r => setTimeout(r, delay));\\n  }\\n\\n  throw new Error(\\\`Failed after \\\${maxRetries} retries\\\`);\\n}\\n\\nfunction defaultRetryCondition(error: Error, response?: Response): boolean {\\n  // Retry on 5xx or network errors\\n  if (response) {\\n    return response.status >= 500 || response.status === 429;\\n  }\\n  return true; // network error\\n}` },

    { type: 'heading', level: 2, text: 'Backoff Strategies', id: 'strategies' },
    { type: 'table', headers: ['Strategy', 'Formula', 'When to Use'], rows: [
      ['Constant', 'wait 1 second, try again', 'Simple retries with predictable load'],
      ['Linear', 'wait 1s, then 2s, then 3s...', 'Gradual increase (less common)'],
      ['Exponential', 'wait 1s, 2s, 4s, 8s...', 'Great for rate limits'],
      ['Exponential + Jitter', 'randomize the wait time', 'Distributed systems (recommended)'],
      ['Decorrelated Jitter', 'wait random(baseDelay, lastDelay × 3)', 'AWS-recommended for reliability'],
    ]},

    { type: 'heading', level: 2, text: 'Jitter Strategies', id: 'jitter' },
    { type: 'paragraph', text: 'Ever heard of the "thundering herd" problem? Imagine 1000 clients all retrying at the exact same millisecond after a server recovers. Jitter (randomness) spreads out those retries so the server doesn\'t get hammered again.' },
    { type: 'code', language: 'typescript', filename: 'jitter.ts', code: `// Full jitter: random between 0 and calculated delay\\nfunction fullJitter(baseDelay: number, attempt: number, maxDelay: number) {\\n  const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);\\n  return Math.random() * delay;\\n}\\n\\n// Equal jitter: half fixed, half random (smoother)\\nfunction equalJitter(baseDelay: number, attempt: number, maxDelay: number) {\\n  const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);\\n  return delay / 2 + Math.random() * (delay / 2);\\n}\\n\\n// Decorrelated jitter (AWS recommendation)\\n// Prevents exponential growth while still spreading requests\\nfunction decorrelatedJitter(baseDelay: number, lastDelay: number): number {\\n  return Math.min(baseDelay * 3, Math.random() * baseDelay * 3);\\n}` },

    { type: 'heading', level: 2, text: 'Cancellable Retry', id: 'cancellable' },
    { type: 'code', language: 'typescript', filename: 'cancellableRetry.ts', code: `async function fetchWithRetryCancellable(\\n  url: string,\\n  options?: RequestInit & { signal?: AbortSignal },\\n  maxRetries = 3\\n): Promise<Response> {\\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\\n    // Check if cancelled before each attempt\\n    if (options?.signal?.aborted) {\\n      throw new DOMException('Aborted', 'AbortError');\\n    }\\n\\n    try {\\n      const response = await fetch(url, options);\\n      if (response.ok) return response;\\n\\n      // Don’t retry client errors\\n      if (response.status < 500 && response.status !== 429) {\\n        return response;\\n      }\\n    } catch (err) {\\n      if (attempt === maxRetries) throw err;\\n    }\\n\\n    // Wait before retry (with jitter)\\n    const delay = Math.min(\\n      1000 * Math.pow(2, attempt) + Math.random() * 1000,\\n      30000\\n    );\\n    await new Promise((r, reject) => {\\n      const timeoutId = setTimeout(r, delay);\\n      options?.signal?.addEventListener('abort', () => {\\n        clearTimeout(timeoutId);\\n        reject(new DOMException('Aborted', 'AbortError'));\\n      }, { once: true });\\n    });\\n  }\\n\\n  throw new Error('Max retries exceeded');\\n}` },

    { type: 'heading', level: 2, text: 'Circuit Breaker', id: 'circuit-breaker' },
    { type: 'paragraph', text: 'A circuit breaker stops trying when a service is clearly down. Think of it like a light switch: open (fail fast), closed (normal operation), or half-open (testing if it\'s back). This prevents your app from hammering a broken service while it recovers.' },
    { type: 'code', language: 'typescript', filename: 'circuitBreaker.ts', code: `type CircuitState = 'closed' | 'open' | 'half-open';\\n\\nclass CircuitBreaker {\\n  private state: CircuitState = 'closed';\\n  private failureCount = 0;\\n  private lastFailureTime = 0;\\n  private successCount = 0;\\n\\n  constructor(\\n    private threshold = 5,        // failures before opening\\n    private resetTimeout = 30000, // ms before trying again\\n    private halfOpenMax = 2       // successes to close\\n  ) {}\\n\\n  async execute<T>(\\n    fn: () => Promise<T>\\n  ): Promise<T> {\\n    if (this.state === 'open') {\\n      if (Date.now() - this.lastFailureTime > this.resetTimeout) {\\n        this.state = 'half-open';\\n        this.successCount = 0;\\n      } else {\\n        throw new Error('Circuit breaker OPEN — service unavailable');\\n      }\\n    }\\n\\n    try {\\n      const result = await fn();\\n      this.onSuccess();\\n      return result;\\n    } catch (err) {\\n      this.onFailure();\\n      throw err;\\n    }\\n  }\\n\\n  private onSuccess() {\\n    this.failureCount = 0;\\n    if (this.state === 'half-open') {\\n      this.successCount++;\\n      if (this.successCount >= this.halfOpenMax) {\\n        this.state = 'closed';\\n      }\\n    }\\n  }\\n\\n  private onFailure() {\\n    this.lastFailureTime = Date.now();\\n    this.failureCount++;\\n    if (this.failureCount >= this.threshold) {\\n      this.state = 'open';\\n    }\\n  }\\n}` },

    { type: 'heading', level: 2, text: 'React Hook with Retry', id: 'react-hook' },
    { type: 'code', language: 'typescript', filename: 'useFetchWithRetry.ts', code: `function useFetchWithRetry<T>(url: string, maxRetries = 3) {\\n  const [data, setData] = useState<T | null>(null);\\n  const [error, setError] = useState<Error | null>(null);\\n  const [loading, setLoading] = useState(true);\\n  const [attempt, setAttempt] = useState(0);\\n\\n  const execute = useCallback(async () => {\\n    setLoading(true);\\n    setError(null);\\n    try {\\n      const res = await fetchWithRetry(url, undefined, {\\n        maxRetries,\\n        baseDelay: 1000 * (attempt + 1), // scale delay by attempt count\\n      });\\n      const json = await res.json();\\n      setData(json);\\n      setAttempt(0);\\n    } catch (err) {\\n      if (attempt < maxRetries) {\\n        setAttempt(a => a + 1);\\n      } else {\\n        setError(err instanceof Error ? err : new Error('Unknown error'));\\n      }\\n    } finally {\\n      setLoading(false);\\n    }\\n  }, [url, maxRetries, attempt]);\\n\\n  useEffect(() => {\\n    execute();\\n  }, [execute]);\\n\\n  return { data, error, loading, retry: execute };\\n}` },

    { type: 'heading', level: 2, text: 'TanStack Query Retry', id: 'tanstack-query' },
    { type: 'paragraph', text: 'TanStack Query handles retries for you with smart defaults. It knows which errors should be retried and has built-in support for exponential backoff. Much easier than rolling your own.' },
    { type: 'code', language: 'typescript', filename: 'queryRetry.ts', code: `import { useQuery } from '@tanstack/react-query';\\n\\nconst { data } = useQuery({\\n  queryKey: ['data'],\\n  queryFn: fetchData,\\n  retry: 3,\\n  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),\\n  // Don’t retry on 4xx errors\\n  retryOnMount: true,\\n  meta: { errorPolicy: 'all' },\\n});` },

    { type: 'heading', level: 2, text: 'When NOT to Retry', id: 'when-not' },
    { type: 'callout', variant: 'warning', title: 'Idempotency Matters', text: 'Only retry idempotent requests (GET, PUT, DELETE). POST is not idempotent — retrying it can create duplicates, double-charge customers, or send duplicate emails. If you must retry POST, use an idempotency key.' },
    { type: 'list', items: [
      '400 Bad Request — your request is broken, retrying won\'t help',
      '401/403 Unauthorized — fix your credentials or token, don\'t just retry',
      '404 Not Found — the thing doesn\'t exist, it won\'t magically appear',
      '422 Validation Error — fix the data, then try again',
      'POST without idempotency key — you\'ll create duplicates',
    ]},
  ],
};
