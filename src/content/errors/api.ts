import type { ErrorGuideContent } from '@/types/content';

export const apiErrorsGuide: ErrorGuideContent = {
  id: 'error-api',
  title: 'API Integration Errors',
  description: 'Common API integration mistakes and debugging strategies.',
  slug: 'errors/api',
  pillar: 'errors',
  category: 'error-types',
  tags: ['API', 'fetch', 'CORS', 'HTTP errors'],
  difficulty: 'intermediate',
  contentType: 'error-guide',
  summary: 'Debug common API integration issues including CORS errors, incorrect headers, missing error handling, authentication failures, and network issues — with solutions and prevention strategies.',
  relatedTopics: ['integration-rest-apis', 'api-retries', 'error-async'],
  order: 4,
  updatedAt: '2025-06-01',
  readingTime: 22,
  featured: false,
  keywords: ['CORS error', 'API errors', 'fetch errors', '401 403'],
  errorType: 'API Integration Errors',
  solutions: [
    'Configure CORS headers on the server, not the client.',
    'Always check response.ok before parsing JSON.',
    'Use proper Content-Type headers when sending data.',
    'Implement retry logic for transient failures (5xx, network errors).',
    'Use AbortController for request timeouts and cancellation.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'CORS Errors', id: 'cors' },
    { type: 'paragraph', text: 'CORS (Cross-Origin Resource Sharing) errors occur when the server doesn\'t include the correct Access-Control-Allow-Origin headers. This is a security feature enforced by the browser — it cannot be bypassed from frontend code.' },
    { type: 'code', language: 'javascript', code: `// ❌ This error appears in the console:
// "Access to fetch at 'https://api.example.com/data' from origin 
//  'http://localhost:3000' has been blocked by CORS policy"

// ❌ These DO NOT fix CORS (common misconceptions):
fetch(url, { mode: 'no-cors' }); // makes response opaque â you can’t read it!
fetch(url, { headers: { 'Access-Control-Allow-Origin': '*' } }); // server header, not client

// ✅ Solution 1: Server-side CORS headers
// Express.js server:
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// ✅ Solution 2: Backend proxy (recommended for production)
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, ''),
      },
    },
  },
});
// Now fetch('/api/data') proxies to https://api.example.com/data — no CORS!

// ✅ Solution 3: Edge Function proxy (production)
// Move the API call to a server-side function that forwards the request` },
    { type: 'callout', variant: 'warning', title: 'Preflight Requests', text: 'Non-simple requests (POST with JSON, custom headers) trigger an OPTIONS preflight request. The server must respond to OPTIONS with the correct CORS headers. If the preflight fails, the actual request is never sent.' },

    { type: 'heading', level: 2, text: 'Not Checking response.ok', id: 'response-ok' },
    { type: 'paragraph', text: 'The most common fetch mistake: fetch() only rejects on network failures (DNS, offline). HTTP errors (404, 500) are considered successful responses — you must check manually.' },
    { type: 'code', language: 'javascript', code: `// ❌ fetch does NOT throw on HTTP errors
const data = await fetch('/api/users').then(r => r.json());
// If server returns 404, this might:
// 1. Try to parse HTML error page as JSON → SyntaxError
// 2. Return { error: "Not found" } which you treat as valid data

// ✅ Proper fetch wrapper
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    // Try to extract error message from response body
    let errorMessage;
    try {
      const errorBody = await res.json();
      errorMessage = errorBody.message || errorBody.error || res.statusText;
    } catch {
      errorMessage = res.statusText;
    }

    const error = new Error(errorMessage);
    error.status = res.status;
    error.statusText = res.statusText;
    throw error;
  }

  // Handle 204 No Content
  if (res.status === 204) return null;
  
  return res.json();
}

// Usage with specific error handling
try {
  const users = await apiFetch('/api/users');
} catch (error) {
  switch (error.status) {
    case 400: showValidationError(error.message); break;
    case 401: redirectToLogin(); break;
    case 403: showForbiddenMessage(); break;
    case 404: showNotFound(); break;
    case 429: showRateLimitWarning(); break;
    case 500: showServerError(); break;
    default: showGenericError(error.message);
  }
}` },

    { type: 'heading', level: 2, text: 'Wrong Content-Type', id: 'content-type' },
    { type: 'paragraph', text: 'Forgetting to set Content-Type: application/json when sending JSON data is a common cause of 400 Bad Request errors. The server receives the body as plain text instead of parsed JSON.' },
    { type: 'code', language: 'javascript', code: `// ❌ Missing Content-Type — server receives raw text
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Alice' }), // sent as text/plain
});

// ✅ Set Content-Type explicitly
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
});

// ❌ Sending FormData with Content-Type: application/json
const formData = new FormData();
formData.append('file', file);
fetch('/api/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // WRONG for FormData!
  body: formData,
});

// ✅ Let the browser set Content-Type for FormData (multipart/form-data with boundary)
fetch('/api/upload', {
  method: 'POST',
  body: formData, // browser adds correct Content-Type automatically
});

// ❌ Double-stringifying
fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(JSON.stringify(data)), // sends escaped string, not object
});` },

    { type: 'heading', level: 2, text: 'Authentication Errors (401/403)', id: 'auth-errors' },
    { type: 'code', language: 'javascript', code: `// 401 Unauthorized — missing or invalid credentials
// 403 Forbidden — authenticated but not authorized

// ❌ Common mistakes
fetch('/api/admin/users'); // ← no Authorization header

fetch('/api/data', {
  headers: { Authorization: token }, // ← missing "Bearer " prefix
});

// ✅ Proper auth header
fetch('/api/data', {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

// Token refresh pattern
async function authFetch(url, options = {}) {
  let token = getAccessToken();
  
  let res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: \`Bearer \${token}\` },
  });

  // If 401, try refreshing the token once
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      redirectToLogin();
      return;
    }
    
    token = newToken;
    res = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: \`Bearer \${token}\` },
    });
  }

  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// React: centralized auth in a fetch wrapper
const api = {
  get: (path) => authFetch(\`/api\${path}\`),
  post: (path, data) => authFetch(\`/api\${path}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
};` },

    { type: 'heading', level: 2, text: 'Network & Timeout Errors', id: 'network-errors' },
    { type: 'code', language: 'javascript', code: `// fetch throws TypeError on network failure (not HTTP errors)
// "TypeError: Failed to fetch" — causes:
// 1. User is offline
// 2. DNS resolution failed
// 3. Server is down
// 4. CORS blocked (also shows as TypeError)
// 5. Request was aborted

// ✅ Timeout with AbortController
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(\`Request timed out after \${timeout}ms\`);
    }
    throw error;
  }
}

// ✅ Modern: AbortSignal.timeout() (supported in most browsers)
const res = await fetch(url, {
  signal: AbortSignal.timeout(5000), // auto-abort after 5s
});

// ✅ Retry with exponential backoff
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok || res.status < 500) return res; // don’t retry 4xx
      throw new Error(\`HTTP \${res.status}\`);
    } catch (error) {
      if (attempt === retries) throw error;
      const delay = Math.min(1000 * 2 ** attempt, 10000);
      const jitter = delay * (0.5 + Math.random() * 0.5);
      await new Promise(r => setTimeout(r, jitter));
    }
  }
}` },

    { type: 'heading', level: 2, text: 'JSON Parsing Errors', id: 'json-parse' },
    { type: 'code', language: 'javascript', code: `// SyntaxError: Unexpected token < in JSON at position 0
// This means you’re trying to parse HTML as JSON
// Common cause: the server returned an HTML error page (404, 500)

// ❌ Blindly parsing response
const data = await fetch('/api/data').then(r => r.json());
// If server returns 404 HTML page → SyntaxError

// ✅ Check Content-Type before parsing
async function safeJsonParse(response) {
  const contentType = response.headers.get('content-type');
  
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    throw new Error(\`Expected JSON but received \${contentType}: \${text.slice(0, 200)}\`);
  }
  
  return response.json();
}

// ✅ Handle empty responses
async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null; // 204 or empty body
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse response:', text.slice(0, 500));
    throw new Error('Invalid JSON response from server');
  }
}` },

    { type: 'heading', level: 2, text: 'Rate Limiting (429)', id: 'rate-limiting' },
    { type: 'code', language: 'javascript', code: `// 429 Too Many Requests â you’re sending requests too fast

// ✅ Respect Retry-After header
async function handleRateLimit(response) {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const waitMs = retryAfter
      ? (isNaN(retryAfter) 
          ? new Date(retryAfter).getTime() - Date.now()  // HTTP-date
          : parseInt(retryAfter) * 1000)                   // seconds
      : 60000; // default 1 minute

    console.warn(\`Rate limited. Retrying in \${waitMs}ms\`);
    await new Promise(r => setTimeout(r, waitMs));
    return true; // signal to retry
  }
  return false;
}

// ✅ Client-side rate limiter
class RequestQueue {
  constructor(maxPerSecond = 10) {
    this.queue = [];
    this.interval = 1000 / maxPerSecond;
    this.processing = false;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      if (!this.processing) this.process();
    });
  }

  async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      try {
        resolve(await fn());
      } catch (e) {
        reject(e);
      }
      await new Promise(r => setTimeout(r, this.interval));
    }
    this.processing = false;
  }
}

const queue = new RequestQueue(5); // max 5 req/sec
const result = await queue.add(() => fetch('/api/data'));` },

    { type: 'heading', level: 2, text: 'Debugging Checklist', id: 'debugging-checklist' },
    { type: 'paragraph', text: 'When an API call fails, work through this checklist systematically:' },
    { type: 'code', language: 'javascript', code: `// 1. Check the Network tab — is the request even being sent?
//    Look at: URL, method, status code, request/response headers, body

// 2. Check the exact error
try {
  const res = await fetch(url);
  console.log('Status:', res.status);
  console.log('Headers:', Object.fromEntries(res.headers));
  const text = await res.text(); // text first, then try JSON
  console.log('Body:', text);
  const data = JSON.parse(text);
} catch (e) {
  console.error('Error type:', e.constructor.name);
  console.error('Message:', e.message);
}

// 3. Test the API independently
//    - Use curl/httpie in terminal
//    - Use Postman/Insomnia
//    - Use browser console: copy as fetch from Network tab

// 4. Common fixes by status code:
// 400 → Check request body format, required fields, data types
// 401 → Check auth token (expired? missing Bearer prefix?)
// 403 → Check permissions/roles, CORS
// 404 → Check URL path (trailing slash?), resource exists?
// 405 → Wrong HTTP method (GET vs POST)
// 422 → Validation error — read the response body
// 429 → Rate limited — add delays or queuing
// 500 → Server bug — check server logs, not your fault
// 502/503 → Server temporarily down — retry with backoff` },

    { type: 'callout', variant: 'tip', title: 'Pro Tip', text: 'Right-click any failed request in the Network tab and select "Copy as cURL" to get an exact reproduction of the request you can test in the terminal. This helps isolate whether the issue is in your code or the server.' },
  ],
};
