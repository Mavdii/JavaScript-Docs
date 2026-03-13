import type { IntegrationContent } from '@/types/content';

export const restApisIntegration: IntegrationContent = {
  id: 'integration-rest-apis',
  title: 'REST APIs',
  description: 'Learn how to consume and integrate RESTful APIs in JavaScript applications.',
  slug: 'integrations/rest-apis',
  pillar: 'integrations',
  category: 'apis-services',
  tags: ['REST', 'API', 'fetch', 'HTTP'],
  difficulty: 'beginner',
  contentType: 'integration',
  summary: 'Master working with REST APIs — from simple GET requests to authentication, pagination, error handling, and request cancellation. We\'ll build a reusable, type-safe API client.',
  relatedTopics: ['fetch', 'api-retries'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 12,
  featured: true,
  keywords: ['REST API', 'fetch', 'HTTP methods', 'CRUD'],
  requiredLibraries: ['fetch (built-in)', 'axios (optional)'],
  setupSteps: ['No setup required — fetch is built into all modern browsers.'],
  authNotes: 'Most REST APIs require an API key or Bearer token sent via the Authorization header.',
  sections: [
    { type: 'heading', level: 2, text: 'What is a REST API?', id: 'what-is-rest' },
    { type: 'paragraph', text: 'REST is just a pattern for building APIs using HTTP methods to do CRUD operations on resources identified by URLs. It\'s stateless — each request has everything the server needs. GET fetches data, POST creates, PUT replaces, PATCH updates, DELETE removes. Simple and elegant.' },
    { type: 'table', headers: ['Method', 'Purpose', 'Idempotent', 'Body'], rows: [
      ['GET', 'Read resource(s)', 'Yes', 'No'],
      ['POST', 'Create a resource', 'No', 'Yes'],
      ['PUT', 'Replace a resource entirely', 'Yes', 'Yes'],
      ['PATCH', 'Partially update a resource', 'No', 'Yes'],
      ['DELETE', 'Delete a resource', 'Yes', 'Optional'],
      ['HEAD', 'GET without body (check existence)', 'Yes', 'No'],
      ['OPTIONS', 'Discover allowed methods (CORS preflight)', 'Yes', 'No'],
    ]},

    { type: 'heading', level: 2, text: 'Type-Safe API Client', id: 'api-client' },
    { type: 'code', language: 'typescript', code: `interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.timeout = config.timeout ?? 10_000;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; signal?: AbortSignal }
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(\`\${this.baseUrl}\${path}\`, {
        method,
        headers: { ...this.defaultHeaders, ...options?.headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal ?? controller.signal,
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new ApiError(res.status, res.statusText, errorBody);
      }

      // Handle 204 No Content
      if (res.status === 204) return undefined as T;

      return res.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(path: string, signal?: AbortSignal) {
    return this.request<T>('GET', path, undefined, { signal });
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>('PUT', path, body);
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
  ) {
    super(\`API Error \${status}: \${statusText}\`);
    this.name = 'ApiError';
  }

  get isNotFound() { return this.status === 404; }
  get isUnauthorized() { return this.status === 401; }
  get isServerError() { return this.status >= 500; }
  get isRateLimited() { return this.status === 429; }
}` },

    { type: 'heading', level: 2, text: 'Query Parameters & URL Building', id: 'query-params' },
    { type: 'code', language: 'typescript', code: `// Safe URL building with URLSearchParams
function buildUrl(
  base: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, base);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

// Usage
const url = buildUrl('https://api.example.com', '/users', {
  page: 1,
  limit: 20,
  sort: 'name',
  active: true,
  deleted: undefined, // omitted
});
// → https://api.example.com/users?page=1&limit=20&sort=name&active=true` },

    { type: 'heading', level: 2, text: 'Authentication Patterns', id: 'auth-patterns' },
    { type: 'table', headers: ['Method', 'Header', 'Example', 'Notes'], rows: [
      ['API Key', 'X-API-Key or Authorization', 'X-API-Key: abc123', 'Simple but less secure'],
      ['Bearer Token', 'Authorization', 'Bearer eyJhbG...', 'JWT or OAuth access tokens'],
      ['Basic Auth', 'Authorization', 'Basic dXNlcjpwYXNz', 'Base64-encoded user:pass'],
      ['Query Param', 'None (in URL)', '?api_key=abc123', 'Avoid — visible in logs/history'],
    ]},
    { type: 'code', language: 'typescript', code: `// API client with auth
const api = new ApiClient({
  baseUrl: 'https://api.example.com',
  headers: {
    'Authorization': \`Bearer \${token}\`,
  },
});

// Per-request auth override
const data = await api.get('/admin/users', undefined, {
  headers: { 'Authorization': \`Bearer \${adminToken}\` },
});` },

    { type: 'heading', level: 2, text: 'Pagination Patterns', id: 'pagination' },
    { type: 'code', language: 'typescript', code: `// Offset-based pagination
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>
): Promise<T[]> {
  const firstPage = await fetchPage(1);
  const allItems = [...firstPage.data];

  const remaining = Array.from(
    { length: firstPage.totalPages - 1 },
    (_, i) => i + 2
  );

  // Fetch remaining pages in parallel (with concurrency limit)
  const CONCURRENCY = 3;
  for (let i = 0; i < remaining.length; i += CONCURRENCY) {
    const batch = remaining.slice(i, i + CONCURRENCY);
    const pages = await Promise.all(batch.map(fetchPage));
    pages.forEach(p => allItems.push(...p.data));
  }

  return allItems;
}

// Cursor-based pagination (more efficient for large datasets)
interface CursorResponse<T> {
  data: T[];
  nextCursor: string | null;
}

async function* fetchWithCursor<T>(
  fetchPage: (cursor?: string) => Promise<CursorResponse<T>>
): AsyncGenerator<T[], void, unknown> {
  let cursor: string | undefined;
  do {
    const page = await fetchPage(cursor);
    yield page.data;
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
}` },

    { type: 'heading', level: 2, text: 'Request Cancellation', id: 'cancellation' },
    { type: 'code', language: 'typescript', code: `// Cancel previous request when user types (search)
function useApiSearch<T>(searchFn: (q: string, signal: AbortSignal) => Promise<T[]>) {
  const [results, setResults] = useState<T[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string) => {
    // Cancel previous in-flight request
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const data = await searchFn(query, controller.signal);
      setResults(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; // Expected — request was superseded
      }
      throw err;
    }
  }, [searchFn]);

  // Cleanup on unmount
  useEffect(() => () => controllerRef.current?.abort(), []);

  return { results, search };
}` },

    { type: 'heading', level: 2, text: 'Error Response Handling', id: 'error-handling' },
    { type: 'table', headers: ['Status', 'Meaning', 'Action'], rows: [
      ['400', 'Bad Request', 'Show validation errors to user'],
      ['401', 'Unauthorized', 'Redirect to login or refresh token'],
      ['403', 'Forbidden', 'Show permission denied message'],
      ['404', 'Not Found', 'Show "not found" state'],
      ['409', 'Conflict', 'Handle optimistic update collision'],
      ['422', 'Unprocessable Entity', 'Show field-level validation errors'],
      ['429', 'Too Many Requests', 'Back off and retry after Retry-After header'],
      ['500', 'Server Error', 'Show generic error, log for debugging'],
      ['503', 'Service Unavailable', 'Retry with exponential backoff'],
    ]},

    { type: 'heading', level: 2, text: 'TanStack Query Integration', id: 'tanstack-query' },
    { type: 'code', language: 'typescript', code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const api = new ApiClient({ baseUrl: '/api' });

// Typed query hook
function useUsers(page: number) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: ({ signal }) =>
      api.get<PaginatedResponse<User>>(\`/users?page=\${page}\`, signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev, // Keep previous data while loading next page
  });
}

// Mutation with optimistic update
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => api.put<User>(\`/users/\${user.id}\`, user),
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old: User[]) =>
        old.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['users'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'mistakes' },
    { type: 'list', items: [
      'Not checking response.ok — fetch doesn\'t throw on 4xx/5xx status codes',
      'Forgetting Content-Type header when sending JSON',
      'Not encoding URL parameters — use encodeURIComponent or URLSearchParams',
      'Sending credentials (cookies) to third-party APIs — use credentials: "same-origin"',
      'Not handling network errors separately from HTTP errors',
      'Ignoring rate limits — implement backoff when you get 429',
      'Not canceling in-flight requests when components unmount',
    ] },
    { type: 'callout', variant: 'warning', title: 'fetch Doesn\'t Throw on Errors!', text: 'Unlike axios, fetch only throws on network failures. A 404 or 500 response is a "successful" fetch. Always check response.ok or response.status before processing the response body.' },
  ],
};
