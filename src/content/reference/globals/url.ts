import type { ReferenceContent } from '@/types/content';

export const urlReference: ReferenceContent = {
  id: 'reference-url',
  title: 'URL & URLSearchParams',
  description: 'Parse, manipulate, and work with URLs and query strings using the URL and URLSearchParams APIs.',
  slug: 'reference/globals/url',
  pillar: 'reference',
  category: 'globals',
  tags: ['url', 'query', 'parsing', 'searchparams', 'routing'],
  difficulty: 'beginner',
  contentType: 'reference',
  summary: 'The URL and URLSearchParams APIs provide robust tools for parsing and manipulating URLs without string manipulation.',
  relatedTopics: ['string-methods', 'fetch'],
  order: 3,
  updatedAt: '2025-06-01',
  readingTime: 11,
  featured: false,
  keywords: ['url', 'query parameters', 'parsing', 'urlsearchparams'],
  signature: 'new URL(urlString, base?) and new URLSearchParams(init?)',
  parameters: [
    { name: 'urlString', type: 'string', description: 'The URL to parse.' },
    { name: 'base', type: 'string | URL', description: 'Base URL for relative URLs.' }
  ],
  returnValue: { type: 'URL | URLSearchParams', description: 'Parsed URL or query parameters object.' },
  compatibility: 'All modern browsers — Not in older IE',
  sections: [
    { type: 'heading', level: 2, text: 'Parsing URLs with URL API', id: 'parsing-urls' },
    { type: 'paragraph', text: 'The URL API provides a robust way to parse and manipulate URLs without complex string operations.' },
    { type: 'code', language: 'javascript', filename: 'url-parse.js', code: `// Parse a complete URL
const url = new URL('https://user:pass@example.com:8080/path?foo=bar#section');

// Break down components
console.log(url.protocol);    // 'https:'
console.log(url.username);    // 'user'
console.log(url.password);    // 'pass'
console.log(url.hostname);    // 'example.com'
console.log(url.port);        // '8080'
console.log(url.host);        // 'example.com:8080'
console.log(url.pathname);    // '/path'
console.log(url.search);      // '?foo=bar'
console.log(url.hash);        // '#section'
console.log(url.origin);      // 'https://example.com:8080'
console.log(url.href);        // Full URL string

// Relative URLs need a base
const baseUrl = new URL('https://example.com/app/');
const relative = new URL('page.html', baseUrl);
console.log(relative.href);   // 'https://example.com/app/page.html'

// Parse from window location in browser
const current = new URL(window.location.href);
console.log(current.pathname); // '/current/path'

// Create URL from parts
const built = new URL('https://example.com');
built.pathname = '/api/users';
built.searchParams.set('id', '123');
built.hash = 'results';
console.log(built.href); // 'https://example.com/api/users?id=123#results'` },

    { type: 'heading', level: 2, text: 'Modifying URL Components', id: 'modifying-url' },
    { type: 'code', language: 'javascript', filename: 'url-modify.js', code: `const url = new URL('https://example.com/page');

// Modifying components
url.protocol = 'http:';       // Changes to http
url.hostname = 'api.example.com'; // Change domain
url.port = '3000';            // Change port
url.pathname = '/api/v1/users'; // Change path

console.log(url.href);        // 'http://api.example.com:3000/api/v1/users'

// Adding/removing port
const withPort = new URL('https://example.com');
withPort.port = '8080';
console.log(withPort.href);   // 'https://example.com:8080/'

// Remove port (resets to default)
withPort.port = '';
console.log(withPort.href);   // 'https://example.com/'

// Working with pathname
const pathUrl = new URL('https://example.com/users/123/profile');
console.log(pathUrl.pathname); // '/users/123/profile'

pathUrl.pathname = '/api/users/456';
console.log(pathUrl.href);    // 'https://example.com/api/users/456'

// URL encoding (automatic)
const encodedUrl = new URL('https://example.com');
encodedUrl.pathname = '/search results'; // Space will be encoded
console.log(encodedUrl.href); // Spaces become %20

// Credentials (not recommended for security)
const urlWithAuth = new URL('https://user:password@example.com');
console.log(urlWithAuth.username); // 'user'
urlWithAuth.password = 'newPassword';
console.log(urlWithAuth.href);     // Shows credentials in URL (unsafe!)` },

    { type: 'heading', level: 2, text: 'Query Parameters with URLSearchParams', id: 'searchparams' },
    { type: 'code', language: 'javascript', filename: 'url-searchparams.js', code: `// Create URLSearchParams
const params1 = new URLSearchParams('foo=bar&baz=qux');
console.log(params1.toString()); // 'foo=bar&baz=qux'

// From key-value pairs
const params2 = new URLSearchParams([
  ['name', 'John'],
  ['age', '30']
]);
console.log(params2.toString()); // 'name=John&age=30'

// From object
const params3 = new URLSearchParams({
  page: '1',
  limit: '10',
  sort: 'date'
});
console.log(params3.toString()); // 'page=1&limit=10&sort=date'

// From URL
const url = new URL('https://example.com?foo=bar&baz=qux');
const params4 = url.searchParams;
console.log(params4.get('foo'));  // 'bar'
console.log(params4.get('baz'));  // 'qux'

// Get single value
const params = new URLSearchParams('name=John&age=30&city=NYC');
console.log(params.get('name'));  // 'John'
console.log(params.get('missing')); // null

// Get all values for a key
const multiParams = new URLSearchParams('tag=javascript&tag=web&tag=frontend');
console.log(multiParams.getAll('tag')); // ['javascript', 'web', 'frontend']

// Check if key exists
console.log(params.has('name'));  // true
console.log(params.has('email')); // false

// Iterate over parameters
for (const [key, value] of params) {
  console.log(\`\${key} = \${value}\`);
}` },

    { type: 'heading', level: 2, text: 'Modifying Query Parameters', id: 'modify-params' },
    { type: 'code', language: 'javascript', filename: 'url-modify-params.js', code: `const params = new URLSearchParams('foo=bar&baz=qux');

// Add or update a parameter
params.set('foo', 'new-value');
console.log(params.toString()); // 'foo=new-value&baz=qux'

// Add parameter (keeps existing)
params.append('tag', 'javascript');
params.append('tag', 'web');
console.log(params.getAll('tag')); // ['javascript', 'web']
console.log(params.toString());    // '...&tag=javascript&tag=web'

// Delete a parameter
params.delete('baz');
console.log(params.toString()); // 'foo=new-value&tag=javascript&tag=web'

// Clear all parameters
params.clear();
console.log(params.toString()); // ''

// Modify URL's search params
const url = new URL('https://example.com');
url.searchParams.set('page', '1');
url.searchParams.set('limit', '10');
url.searchParams.append('filter', 'active');
url.searchParams.append('filter', 'verified');

console.log(url.href); // 'https://example.com?page=1&limit=10&filter=active&filter=verified'

// Sort parameters (useful for caching)
const params2 = new URLSearchParams('z=3&a=1&m=2');
const sorted = new URLSearchParams([...params2].sort());
console.log(sorted.toString()); // 'a=1&m=2&z=3'` },

    { type: 'heading', level: 2, text: 'Common URL Operations', id: 'common-operations' },
    { type: 'code', language: 'javascript', filename: 'url-operations.js', code: `// Check if URL is same origin
function isSameOrigin(urlString) {
  try {
    const url = new URL(urlString);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

console.log(isSameOrigin('/path'));                    // true (relative)
console.log(isSameOrigin('https://example.com/path')); // false (different origin)

// Add or update query parameter
function addParam(urlString, key, value) {
  const url = new URL(urlString, window.location.origin);
  url.searchParams.set(key, value);
  return url.href;
}

console.log(addParam('https://example.com', 'page', '2'));
// 'https://example.com?page=2'

// Remove query parameter
function removeParam(urlString, key) {
  const url = new URL(urlString, window.location.origin);
  url.searchParams.delete(key);
  return url.href;
}

// Build query string from object
function buildQueryString(obj) {
  return new URLSearchParams(obj).toString();
}

const params = { page: 1, search: 'javascript', sort: 'date' };
console.log(buildQueryString(params)); // 'page=1&search=javascript&sort=date'

// Parse query string to object
function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const obj = {};
  for (const [key, value] of params) {
    if (obj[key]) {
      obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

const parsed = parseQueryString('page=1&filter=active&filter=verified');
console.log(parsed);
// { page: '1', filter: ['active', 'verified'] }

// Get current page query params
function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

// Get the domain without protocol
function getDomain(urlString) {
  return new URL(urlString).hostname;
}

console.log(getDomain('https://www.example.com/page')); // 'www.example.com'

// Check if URL is external
function isExternalUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.origin !== window.location.origin;
  } catch {
    return false; // Invalid URL
  }
}` },

    { type: 'heading', level: 2, text: 'URL Encoding and Special Characters', id: 'encoding' },
    { type: 'code', language: 'javascript', filename: 'url-encoding.js', code: `// URLSearchParams automatically encodes
const params = new URLSearchParams();
params.set('name', 'John Doe');         // Space
params.set('emoji', '😀');             // Emoji
params.set('special', 'foo&bar=baz'); // Special chars

console.log(params.toString());
// 'name=John+Doe&emoji=%F0%9F%98%80&special=foo%26bar%3Dbaz'

// URL pathname encoding
const url = new URL('https://example.com');
url.pathname = '/search/hello world';
console.log(url.href); // '/search/hello%20world'

// Manual encoding (rarely needed)
const encoded = encodeURIComponent('hello world');
console.log(encoded); // 'hello%20world'

const decoded = decodeURIComponent('hello%20world');
console.log(decoded); // 'hello world'

// Difference between encodeURI and encodeURIComponent
const url2 = 'https://example.com/path?foo=bar';

// encodeURI — encodes for use in a full URL
console.log(encodeURI(url2));
// 'https://example.com/path?foo=bar' (doesn't encode / : ? = &)

// encodeURIComponent — encodes for use in a component
console.log(encodeURIComponent(url2));
// 'https%3A%2F%2Fexample.com%2Fpath%3Ffoo%3Dbar' (encodes everything)

// Use URLSearchParams for safety (recommended)
const safeParams = new URLSearchParams({ url: url2 });
console.log(safeParams.toString()); // Properly encoded` },

    { type: 'heading', level: 2, text: 'Real-World Examples', id: 'examples' },
    { type: 'code', language: 'javascript', filename: 'url-examples.js', code: `// Example 1: Build API request URL
function buildApiUrl(endpoint, filters, options = {}) {
  const url = new URL(\`https://api.example.com\${endpoint}\`);
  
  // Add filter parameters
  for (const [key, value] of Object.entries(filters)) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    }
  }
  
  // Add options
  if (options.page) url.searchParams.set('page', options.page);
  if (options.limit) url.searchParams.set('limit', options.limit);
  if (options.sort) url.searchParams.set('sort', options.sort);
  
  return url.href;
}

const apiUrl = buildApiUrl('/users', { role: 'admin', active: true }, { page: 2, limit: 50 });
// 'https://api.example.com/users?role=admin&active=true&page=2&limit=50'

// Example 2: Update current URL without navigation
function updateUrlParams(updates) {
  const url = new URL(window.location);
  
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }
  
  window.history.pushState({}, '', url);
}

// Usage: updateUrlParams({ page: 2, search: 'javascript' })

// Example 3: Parse and validate URL
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

console.log(isValidUrl('https://example.com')); // true
console.log(isValidUrl('not a url'));           // false

// Example 4: Create absolute URL from relative
function absoluteUrl(relativePath, baseUrl = window.location.origin) {
  return new URL(relativePath, baseUrl).href;
}

console.log(absoluteUrl('/api/users'));              // 'https://example.com/api/users'
console.log(absoluteUrl('settings', 'https://app.example.com/user/'));
// 'https://app.example.com/user/settings'` },

    { type: 'heading', level: 2, text: 'Common Pitfalls', id: 'pitfalls' },
    { type: 'code', language: 'javascript', filename: 'url-pitfalls.js', code: `// ❌ Mistake 1: Using string manipulation instead of URL API
const bad = 'https://example.com?page=1&filter=active';
const newBad = bad + '&sort=date'; // Breaks if bad already has extra params

// ✅ Use URLSearchParams
const url = new URL('https://example.com?page=1&filter=active');
url.searchParams.set('sort', 'date');

// ❌ Mistake 2: Assuming relative URLs work without a base
const badUrl = new URL('/path/to/page'); // Throws error!

// ✅ Provide base if needed
const goodUrl = new URL('/path/to/page', window.location.origin);

// ❌ Mistake 3: Not encoding query parameters
const unencoded = 'https://example.com?name=John Doe'; // Space breaks the URL

// ✅ URLSearchParams handles encoding automatically
const params = new URLSearchParams();
params.set('name', 'John Doe');
const encodedUrl = \`https://example.com?\${params.toString()}\`;

// ❌ Mistake 4: Forgetting URL constructor throws on invalid URLs
try {
  const url = new URL('not a valid url');
} catch (e) {
  console.error('Invalid URL:', e.message);
}

// ✅ Always wrap in try-catch
function safeUrl(urlString) {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

// ❌ Mistake 5: Modifying immutable URLs
const originalUrl = new URL('https://example.com');
const sameUrl = originalUrl; // Same reference!
sameUrl.pathname = '/new';
console.log(originalUrl.href); // Changed!

// ✅ Clone URL if you need to preserve original
const clonedUrl = new URL(originalUrl.href);
clonedUrl.pathname = '/new';
console.log(originalUrl.href); // Unchanged` },

    { type: 'heading', level: 2, text: 'Browser Support', id: 'support' },
    { type: 'code', language: 'javascript', filename: 'url-support.js', code: `// Check if URL API is supported
if (typeof URL !== 'undefined') {
  console.log('URL API supported');
} else {
  console.log('URL API not supported');
}

// Check if URLSearchParams is supported
if (typeof URLSearchParams !== 'undefined') {
  console.log('URLSearchParams supported');
}

// Polyfill for older browsers (url-parse library)
function parseUrlOldBrowser(urlString) {
  if (typeof URL !== 'undefined') {
    return new URL(urlString);
  }
  
  // Fallback to regex parsing
  const match = /^(https?:)\\/\\/([^\\/:?#]+)(:\\d+)?(\\/[^?#]*)?(\\?[^#]*)?(#.*)?$/.exec(urlString);
  
  if (!match) return null;
  
  return {
    protocol: match[1],
    hostname: match[2],
    port: match[3] ? match[3].substring(1) : '',
    pathname: match[4] || '/',
    search: match[5] || '',
    hash: match[6] || ''
  };
}` },
  ],
};