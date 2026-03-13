import type { LessonContent } from '@/types/content';

export const fetchLesson: LessonContent = {
  id: 'fetch',
  title: 'Fetch API',
  description: 'Make HTTP requests the modern way — GET, POST, handling errors without pulling your hair out, and streaming big files.',
  slug: 'learn/browser/fetch',
  pillar: 'learn',
  category: 'browser',
  tags: ['fetch', 'http', 'api', 'network'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Fetch is the modern way to make HTTP requests in JavaScript. It returns Promises, works with all HTTP methods, and handles headers and streaming like a pro.',
  relatedTopics: ['promises', 'async-await'],
  order: 1,
  updatedAt: '2024-03-01',
  readingTime: 18,
  featured: false,
  keywords: ['fetch', 'HTTP', 'GET', 'POST', 'REST', 'API', 'headers', 'JSON', 'PUT', 'DELETE', 'PATCH', 'streaming', 'AbortController'],
  prerequisites: ['Promises', 'Async/Await'],
  learningGoals: [
    'Make GET and POST requests with fetch',
    'Set headers and handle JSON responses',
    'Handle HTTP errors correctly',
    'Use AbortController to cancel requests',
    'Upload files with FormData',
    'Stream response bodies',
    'Implement request interceptors and wrappers',
  ],
  exercises: [
    'Build a function that fetches user data with error handling and timeout.',
    'Create a POST request with JSON body and custom headers.',
    'Implement a generic fetchJSON wrapper with retry logic.',
    'Build a file upload function with progress tracking using streams.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What Is Fetch?', id: 'what-is-fetch' },
    { type: 'paragraph', text: 'The Fetch API provides a modern, Promise-based interface for making HTTP requests. It replaced the older XMLHttpRequest (XHR) with a cleaner, more flexible API. Fetch is built into all modern browsers and is also available in Node.js 18+.' },
    { type: 'paragraph', text: 'At its core, `fetch()` takes a URL (and optional config), sends an HTTP request, and returns a Promise that resolves with a `Response` object. The response body is a readable stream that must be consumed with methods like `.json()`, `.text()`, or `.blob()`.' },

    { type: 'heading', level: 2, text: 'Basic GET Request', id: 'basic-get' },
    {
      type: 'code', language: 'javascript', filename: 'get.js',
      code: `// Simple GET — returns a Promise<Response>
const response = await fetch('https://api.example.com/users');

// Parse the JSON body
const users = await response.json();
console.log(users);

// You can also use .then() chains
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(users => console.log(users))
  .catch(err => console.error(err));`,
    },
    { type: 'callout', variant: 'info', title: 'Two-Step Process', text: 'Fetch always requires two awaits: one for the response headers, and one for the body. This is because the body is a stream that arrives after the headers.' },

    { type: 'heading', level: 2, text: 'POST Request', id: 'post' },
    { type: 'paragraph', text: 'To send data to a server, use the `method`, `headers`, and `body` options. JSON is the most common format — set `Content-Type` to `application/json` and stringify the body.' },
    {
      type: 'code', language: 'javascript', filename: 'post.js',
      code: `const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123',
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com',
  }),
});

const newUser = await response.json();
console.log('Created:', newUser);`,
    },

    { type: 'heading', level: 2, text: 'All HTTP Methods', id: 'http-methods' },
    { type: 'paragraph', text: 'Fetch supports all standard HTTP methods. Here are the common CRUD operations:' },
    {
      type: 'code', language: 'javascript', filename: 'crud.js',
      code: `// CREATE — POST
await fetch('/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'New Item' }),
});

// READ — GET (default)
await fetch('/api/items/1');

// UPDATE (full replace) — PUT
await fetch('/api/items/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated Item', price: 29.99 }),
});

// UPDATE (partial) — PATCH
await fetch('/api/items/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: 19.99 }),
});

// DELETE
await fetch('/api/items/1', { method: 'DELETE' });`,
    },
    {
      type: 'table',
      headers: ['Method', 'Purpose', 'Has Body?'],
      rows: [
        ['GET', 'Retrieve data', 'No'],
        ['POST', 'Create resource', 'Yes'],
        ['PUT', 'Full update/replace', 'Yes'],
        ['PATCH', 'Partial update', 'Yes'],
        ['DELETE', 'Remove resource', 'Rarely'],
        ['HEAD', 'Headers only (no body)', 'No'],
        ['OPTIONS', 'CORS preflight', 'No'],
      ],
    },

    { type: 'heading', level: 2, text: 'Error Handling', id: 'error-handling' },
    { type: 'paragraph', text: 'This is the most common mistake with fetch: it only rejects on **network errors** (DNS failure, no internet). HTTP errors like 404 or 500 still resolve successfully — you must check `response.ok` or `response.status` manually.' },
    {
      type: 'code', language: 'javascript', filename: 'errors.js',
      code: `async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    // Try to parse error body for more details
    const errorBody = await res.text();
    throw new Error(
      \`HTTP \${res.status} \${res.statusText}: \${errorBody}\`
    );
  }

  return res.json();
}

// Usage with try/catch
try {
  const user = await fetchJSON('/api/users/999');
  console.log(user);
} catch (err) {
  if (err.message.includes('404')) {
    console.log('User not found');
  } else if (err.message.includes('500')) {
    console.log('Server error — try again later');
  } else {
    console.log('Network error:', err.message);
  }
}`,
    },
    { type: 'callout', variant: 'warning', title: 'Common Mistake', text: 'fetch does NOT throw on 404 or 500 errors. Always check `response.ok` or `response.status`. A fetch rejection means the request never reached the server.' },

    { type: 'heading', level: 2, text: 'Request Headers', id: 'headers' },
    { type: 'paragraph', text: 'Headers can be passed as a plain object or as a `Headers` instance. Common headers include authentication tokens, content type, and custom app headers.' },
    {
      type: 'code', language: 'javascript', filename: 'headers.js',
      code: `// Plain object (most common)
await fetch('/api/data', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOi...',
    'Content-Type': 'application/json',
    'X-Request-ID': crypto.randomUUID(),
  },
});

// Headers instance (useful for manipulation)
const headers = new Headers();
headers.set('Authorization', 'Bearer token');
headers.append('Accept', 'application/json');

// Headers are iterable
for (const [key, value] of headers) {
  console.log(\`\${key}: \${value}\`);
}

// Check response headers
const res = await fetch('/api/data');
console.log(res.headers.get('Content-Type'));
console.log(res.headers.get('X-RateLimit-Remaining'));`,
    },

    { type: 'heading', level: 2, text: 'Query Parameters', id: 'query-params' },
    { type: 'paragraph', text: 'Use URLSearchParams to safely construct query strings with proper encoding:' },
    {
      type: 'code', language: 'javascript', filename: 'query-params.js',
      code: `// Build query string safely
const params = new URLSearchParams({
  search: 'hello world',
  page: '1',
  limit: '20',
  sort: 'name:asc',
});

const url = \`/api/items?\${params}\`;
// /api/items?search=hello+world&page=1&limit=20&sort=name%3Aasc

const res = await fetch(url);

// Dynamic params
const filters = new URLSearchParams();
if (category) filters.set('category', category);
if (minPrice) filters.set('min_price', minPrice.toString());

const filteredUrl = \`/api/products?\${filters}\`;`,
    },

    { type: 'heading', level: 2, text: 'Cancellation with AbortController', id: 'abort' },
    { type: 'paragraph', text: 'AbortController lets you cancel in-flight requests. This is essential for search-as-you-type, component unmounts, and timeout logic.' },
    {
      type: 'code', language: 'javascript', filename: 'abort.js',
      code: `// Basic cancellation
const controller = new AbortController();

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/data', {
    signal: controller.signal,
  });
  const data = await res.json();
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Request was cancelled');
  } else {
    throw err; // Re-throw non-abort errors
  }
}

// Cancel on user action
const controller2 = new AbortController();
cancelButton.onclick = () => controller2.abort();

// Timeout helper
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(\`Request timed out after \${timeout}ms\`);
    }
    throw err;
  }
}`,
    },

    { type: 'heading', level: 2, text: 'React: Cancel on Unmount', id: 'react-abort' },
    {
      type: 'code', language: 'tsx', filename: 'useUserData.tsx',
      code: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const res = await fetch(\`/api/users/\${userId}\`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load user');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      }
    }

    loadUser();

    // Cleanup: cancel request if component unmounts or userId changes
    return () => controller.abort();
  }, [userId]);

  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}`,
    },

    { type: 'heading', level: 2, text: 'File Upload with FormData', id: 'file-upload' },
    { type: 'paragraph', text: 'Use FormData to upload files. Do NOT set Content-Type manually — the browser sets the correct multipart boundary automatically.' },
    {
      type: 'code', language: 'javascript', filename: 'upload.js',
      code: `// Single file upload
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'Profile photo');

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type header — browser handles it!
  });

  return res.json();
}

// Multiple file upload
async function uploadFiles(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  return fetch('/api/upload', { method: 'POST', body: formData });
}

// From an input element
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await uploadFile(file);
  console.log('Uploaded:', result.url);
});`,
    },
    { type: 'callout', variant: 'warning', title: 'Don\'t Set Content-Type', text: 'When sending FormData, do NOT manually set the Content-Type header. The browser needs to set it to `multipart/form-data` with the correct boundary string.' },

    { type: 'heading', level: 2, text: 'Response Types', id: 'response-types' },
    {
      type: 'table',
      headers: ['Method', 'Returns', 'Use Case'],
      rows: [
        ['response.json()', 'Parsed JSON object', 'API responses'],
        ['response.text()', 'Plain text string', 'HTML, XML, plain text'],
        ['response.blob()', 'Binary data (Blob)', 'Images, files, downloads'],
        ['response.arrayBuffer()', 'Raw binary buffer', 'Binary processing, WebAssembly'],
        ['response.formData()', 'FormData object', 'Multipart form responses'],
        ['response.body', 'ReadableStream', 'Streaming, progress tracking'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'response-types.js',
      code: `// Download an image as Blob
const res = await fetch('/photo.jpg');
const blob = await res.blob();
const url = URL.createObjectURL(blob);
img.src = url;

// Read HTML
const htmlRes = await fetch('/page.html');
const html = await htmlRes.text();
document.getElementById('content').innerHTML = html;

// Download a file
async function downloadFile(url, filename) {
  const res = await fetch(url);
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}`,
    },

    { type: 'heading', level: 2, text: 'Streaming Responses', id: 'streaming' },
    { type: 'paragraph', text: 'The response body is a ReadableStream. You can read it incrementally for progress tracking or processing large responses:' },
    {
      type: 'code', language: 'javascript', filename: 'streaming.js',
      code: `async function fetchWithProgress(url, onProgress) {
  const res = await fetch(url);
  const contentLength = +res.headers.get('Content-Length');
  const reader = res.body.getReader();

  let received = 0;
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    received += value.length;

    if (contentLength) {
      onProgress(received / contentLength);
    }
  }

  // Combine chunks into a single Uint8Array
  const body = new Uint8Array(received);
  let position = 0;
  for (const chunk of chunks) {
    body.set(chunk, position);
    position += chunk.length;
  }

  return new TextDecoder().decode(body);
}

// Usage
const data = await fetchWithProgress('/api/large-data', (progress) => {
  console.log(\`\${Math.round(progress * 100)}% downloaded\`);
});`,
    },

    { type: 'heading', level: 2, text: 'Retry Logic', id: 'retry' },
    {
      type: 'code', language: 'javascript', filename: 'retry.js',
      code: `async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);

      // Don’t retry client errors (4xx)
      if (res.status >= 400 && res.status < 500) {
        throw new Error(\`Client error: \${res.status}\`);
      }

      if (!res.ok) {
        throw new Error(\`HTTP \${res.status}\`);
      }

      return res;
    } catch (err) {
      lastError = err;

      // Don’t retry aborted requests or client errors
      if (err.name === 'AbortError' || err.message.includes('Client error')) {
        throw err;
      }

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 10000);
        console.log(\`Retry \${attempt + 1}/\${maxRetries} in \${delay}ms\`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}`,
    },

    { type: 'heading', level: 2, text: 'Request Wrapper Pattern', id: 'wrapper' },
    { type: 'paragraph', text: 'In real apps, wrap fetch with a configured client that handles base URLs, auth headers, error parsing, and response transformation:' },
    {
      type: 'code', language: 'typescript', filename: 'api-client.ts',
      code: `class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = \`Bearer \${token}\`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const res = await fetch(url, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new ApiError(res.status, error.message || res.statusText);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
const api = new ApiClient('https://api.example.com');
api.setAuthToken('eyJhbGciOi...');

const users = await api.get<User[]>('/users');
const newUser = await api.post<User>('/users', { name: 'Alice' });`,
    },

    { type: 'heading', level: 2, text: 'CORS (Cross-Origin Requests)', id: 'cors' },
    { type: 'paragraph', text: 'When fetching from a different domain, the browser enforces CORS (Cross-Origin Resource Sharing). The server must include `Access-Control-Allow-Origin` headers, or the request will be blocked.' },
    {
      type: 'code', language: 'javascript', filename: 'cors.js',
      code: `// Simple requests (GET, POST with form content-types) are sent directly.
// Complex requests (custom headers, PUT/DELETE) trigger a preflight OPTIONS request.

// Request mode options:
await fetch(url, { mode: 'cors' });      // Default — enforce CORS
await fetch(url, { mode: 'no-cors' });   // Opaque response (can’t read body)
await fetch(url, { mode: 'same-origin' }); // Reject cross-origin requests

// Credentials (cookies) with CORS:
await fetch(url, {
  credentials: 'include',    // Send cookies cross-origin
  // credentials: 'same-origin' // Default — cookies for same origin only
  // credentials: 'omit'        // Never send cookies
});`,
    },
    { type: 'callout', variant: 'info', title: 'CORS Is Server-Side', text: 'CORS errors cannot be fixed in frontend code. The server must respond with the correct `Access-Control-Allow-Origin` headers. Use a proxy server during development if needed.' },

    { type: 'heading', level: 2, text: 'Fetch vs XMLHttpRequest vs Axios', id: 'comparison' },
    {
      type: 'table',
      headers: ['Feature', 'fetch', 'XMLHttpRequest', 'Axios'],
      rows: [
        ['Promise-based', '✅ Yes', '❌ No (callbacks)', '✅ Yes'],
        ['Streaming', '✅ ReadableStream', '❌ No', '❌ No'],
        ['Upload progress', '❌ No built-in', '✅ onprogress', '✅ onUploadProgress'],
        ['Cancel requests', '✅ AbortController', '✅ abort()', '✅ CancelToken'],
        ['Auto JSON parse', '❌ Manual', '❌ Manual', '✅ Automatic'],
        ['Error on 4xx/5xx', '❌ No', '❌ No', '✅ Yes'],
        ['Interceptors', '❌ Manual', '❌ No', '✅ Built-in'],
        ['Browser support', 'Modern + polyfill', 'All browsers', 'All (uses XHR)'],
        ['Bundle size', '0 KB (native)', '0 KB (native)', '~13 KB'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Not checking response.ok
const res = await fetch('/api/data');
const data = await res.json(); // Might parse error HTML as JSON!

// ✅ Fix: Always check response.ok
const res2 = await fetch('/api/data');
if (!res2.ok) throw new Error(\`HTTP \${res2.status}\`);
const data2 = await res2.json();

// ❌ Mistake 2: Setting Content-Type with FormData
const form = new FormData();
form.append('file', file);
fetch('/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data' }, // WRONG!
  body: form,
});

// ✅ Fix: Let browser set Content-Type for FormData
fetch('/upload', { method: 'POST', body: form });

// ❌ Mistake 3: Forgetting to stringify JSON body
fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { name: 'Alice' }, // WRONG — will become "[object Object]"
});

// ✅ Fix: Always JSON.stringify
fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
});

// ❌ Mistake 4: Reading body twice
const res3 = await fetch('/api/data');
const text = await res3.text();
const json = await res3.json(); // Error! Body already consumed

// ✅ Fix: Clone if you need multiple reads
const res4 = await fetch('/api/data');
const clone = res4.clone();
const text2 = await res4.text();
const json2 = await clone.json();`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'Why doesn\'t fetch reject on HTTP errors like 404 or 500?',
        'What\'s the difference between fetch and XMLHttpRequest?',
        'How do you cancel a fetch request?',
        'What is CORS and how does it affect fetch requests?',
        'Why can\'t you read a response body twice?',
        'How would you implement request retry logic with exponential backoff?',
        'What happens if you set Content-Type manually with FormData?',
        'How do you track download progress with fetch?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Always check `response.ok` before parsing the body',
        'Use AbortController for timeouts and component unmounts',
        'Create a reusable API client wrapper for your app',
        'Use URLSearchParams for query string construction',
        'Don\'t set Content-Type manually for FormData uploads',
        'Handle both network errors and HTTP errors separately',
        'Use exponential backoff for retries (don\'t retry 4xx errors)',
        'Clone responses if you need to read the body multiple times',
      ],
    },
  ],
};
