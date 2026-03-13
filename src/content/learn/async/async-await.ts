import type { LessonContent } from '@/types/content';

export const asyncAwaitLesson: LessonContent = {
  id: 'async-await',
  title: 'Async/Await',
  description: 'Write clean asynchronous code with async functions and the await keyword.',
  slug: 'learn/async/async-await',
  pillar: 'learn',
  category: 'async',
  tags: ['async', 'await', 'promises', 'error-handling'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'async/await is syntactic sugar over Promises. It lets you write asynchronous code that looks and behaves like synchronous code, with try/catch for error handling.',
  relatedTopics: ['promises', 'error-handling'],
  order: 4,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['async', 'await', 'try catch', 'Promise', 'sequential', 'parallel'],
  prerequisites: ['Promises'],
  learningGoals: [
    'Write async functions with the async keyword',
    'Use await to pause execution until a Promise resolves',
    'Handle errors with try/catch in async functions',
    'Run async operations in parallel vs sequentially',
    'Use top-level await and async iteration',
    'Avoid common async/await pitfalls',
  ],
  exercises: [
    'Rewrite a Promise chain as an async/await function.',
    'Implement parallel fetching with Promise.all and await.',
    'Build an async retry function with exponential backoff.',
    'Process an array of URLs sequentially and in parallel, comparing timing.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Basic Syntax', id: 'basic-syntax' },
    { type: 'paragraph', text: 'An `async` function always returns a Promise. `await` pauses until a Promise settles. It resumes when the Promise fulfills, or throws if it rejects.' },
    {
      type: 'code', language: 'javascript', filename: 'async-basic.js',
      code: `async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return user; // Wrapped in Promise.resolve(user) automatically
}

// An async function ALWAYS returns a Promise
fetchUser(1).then(user => console.log(user));

// Equivalent Promise version:
function fetchUserPromise(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json());
}

// Arrow function syntax
const getUser = async (id) => {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
};`,
    },

    { type: 'heading', level: 2, text: 'How await Works', id: 'how-await-works' },
    { type: 'paragraph', text: '`await` pauses the async function and registers the rest of the function as a microtask callback on the Promise. The function\'s execution context is saved and restored when the Promise settles.' },
    {
      type: 'code', language: 'javascript', filename: 'how-await.js',
      code: `async function example() {
  console.log('A');          // Sync
  const x = await fetchX();  // Pause here
  console.log('B');          // Resumes after fetchX resolves
  const y = await fetchY();  // Pause again
  console.log('C');          // Resumes after fetchY resolves
  return x + y;
}

// Equivalent with .then():
function examplePromise() {
  console.log('A');
  return fetchX()
    .then(x => {
      console.log('B');
      return fetchY().then(y => {
        console.log('C');
        return x + y;
      });
    });
}

// await with non-Promise values just continues
async function demo() {
  const x = await 42; // Wraps in Promise.resolve(42)
  console.log(x);     // 42
}`,
    },

    { type: 'heading', level: 2, text: 'Error Handling', id: 'error-handling' },
    { type: 'paragraph', text: 'Use try/catch for errors in async functions. Works just like sync code — way better than .then().catch().' },
    {
      type: 'code', language: 'javascript', filename: 'error-handling.js',
      code: `async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) {
      throw new Error(\`HTTP error: \${res.status}\`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to load:', error.message);
    return null; // Return fallback
  } finally {
    hideSpinner(); // Always runs
  }
}

// Catch specific error types
async function fetchWithRetry(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error (offline, DNS failure)
      return getCachedData(url);
    }
    if (error instanceof SyntaxError) {
      // Invalid JSON response
      console.error('Bad response format');
      return null;
    }
    throw error; // Re-throw unknown errors
  }
}

// Multiple try/catch blocks for granular handling
async function processOrder(orderId) {
  let user, order;

  try {
    user = await fetchUser();
  } catch (e) {
    throw new Error('Could not load user');
  }

  try {
    order = await fetchOrder(orderId);
  } catch (e) {
    throw new Error('Could not load order');
  }

  return { user, order };
}`,
    },

    { type: 'heading', level: 2, text: 'Sequential vs Parallel', id: 'sequential-vs-parallel' },
    { type: 'paragraph', text: 'Sequential awaits are slow when operations are independent. Use Promise.all for parallel execution.' },
    {
      type: 'code', language: 'javascript', filename: 'parallel.js',
      code: `// ❌ SEQUENTIAL — each waits for the previous (SLOW!)
async function sequential() {
  const users = await fetch('/api/users').then(r => r.json()); // 500ms
  const posts = await fetch('/api/posts').then(r => r.json()); // 500ms
  const comments = await fetch('/api/comments').then(r => r.json()); // 500ms
  // Total: ~1500ms
  return { users, posts, comments };
}

// ✅ PARALLEL — all start immediately (FAST!)
async function parallel() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json()),
  ]);
  // Total: ~500ms (max of the three)
  return { users, posts, comments };
}

// ✅ Start in parallel, await later
async function parallelAlt() {
  // Start all requests (don’t await yet)
  const usersP = fetch('/api/users').then(r => r.json());
  const postsP = fetch('/api/posts').then(r => r.json());

  // Now await results
  const users = await usersP;
  const posts = await postsP;
  return { users, posts };
}`,
    },
    { type: 'callout', variant: 'tip', title: 'Performance Rule', text: 'Use Promise.all for independent operations. Sequential await is only for when one step depends on the previous.' },

    { type: 'heading', level: 2, text: 'Async Iteration', id: 'async-iteration' },
    {
      type: 'code', language: 'javascript', filename: 'async-loop.js',
      code: `// Process items sequentially (when order matters or rate limiting)
async function processSequential(items) {
  const results = [];
  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
  }
  return results;
}

// Process items in parallel (faster!)
async function processParallel(items) {
  return Promise.all(items.map(item => processItem(item)));
}

// Process in parallel with concurrency limit
async function processWithLimit(items, limit = 5) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = processItem(item).then(result => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}`,
    },

    { type: 'heading', level: 2, text: 'for await...of', id: 'for-await' },
    { type: 'paragraph', text: 'for await...of works with async iterables. Great for streams, paginated APIs, and async data sources.' },
    {
      type: 'code', language: 'javascript', filename: 'for-await.js',
      code: `// Async generator function
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(\`\${url}?page=\${page}\`);
    const data = await res.json();
    yield data.items;
    hasMore = data.hasNext;
    page++;
  }
}

// Consume with for await...of
async function getAllItems(url) {
  const allItems = [];
  for await (const items of fetchPages(url)) {
    allItems.push(...items);
  }
  return allItems;
}

// Reading a stream
async function readStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
  }

  return result;
}`,
    },

    { type: 'heading', level: 2, text: 'Top-Level Await', id: 'top-level-await' },
    {
      type: 'code', language: 'javascript', filename: 'top-level.js',
      code: `// In ES modules, you can use await at the top level
// (No need to wrap in an async function)

// config.js (ES module)
const response = await fetch('/config.json');
export const config = await response.json();

// main.js
import { config } from './config.js';
// config is already resolved when imported!

// Dynamic imports with top-level await
const locale = navigator.language;
const messages = await import(\`./i18n/\${locale}.js\`);

// Useful for initialization
const db = await connectToDatabase();
export { db };`,
    },

    { type: 'heading', level: 2, text: 'Error Handling Patterns', id: 'error-patterns' },
    {
      type: 'code', language: 'javascript', filename: 'error-patterns.js',
      code: `// Pattern 1: Go-style [error, result] tuple
async function to(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

const [err, user] = await to(fetchUser(1));
if (err) {
  console.error(err);
} else {
  console.log(user);
}

// Pattern 2: Error handler wrapper
function withErrorHandler(fn, errorHandler) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return errorHandler(error);
    }
  };
}

const safeFetch = withErrorHandler(fetchUser, (err) => {
  console.error(err);
  return defaultUser;
});

// Pattern 3: Retry with backoff
async function withRetry(fn, { maxRetries = 3, baseDelay = 1000 } = {}) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries) throw err;
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Cancellation with AbortController', id: 'cancellation' },
    {
      type: 'code', language: 'javascript', filename: 'abort.js',
      code: `// Cancel fetch requests
const controller = new AbortController();

async function fetchData() {
  try {
    const res = await fetch('/api/data', {
      signal: controller.signal,
    });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Request was cancelled');
      return null;
    }
    throw err;
  }
}

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

// Cancel on cleanup (React pattern)
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal })
    .then(setData);

  return () => controller.abort(); // Cleanup
}, []);

// Timeout with AbortSignal.timeout()
const res = await fetch('/api/data', {
  signal: AbortSignal.timeout(5000), // Auto-abort after 5s
});`,
    },

    { type: 'heading', level: 2, text: 'Async Class Methods', id: 'class-methods' },
    {
      type: 'code', language: 'javascript', filename: 'async-class.js',
      code: `class UserService {
  #baseUrl;

  constructor(baseUrl) {
    this.#baseUrl = baseUrl;
  }

  // Async method
  async getUser(id) {
    const res = await fetch(\`\${this.#baseUrl}/users/\${id}\`);
    if (!res.ok) throw new Error(\`User \${id} not found\`);
    return res.json();
  }

  // Static async method
  static async create(name) {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return res.json();
  }

  // Async factory pattern (can’t use async constructors)
  static async init(configUrl) {
    const res = await fetch(configUrl);
    const config = await res.json();
    return new UserService(config.baseUrl);
  }
}

// Usage
const service = await UserService.init('/config.json');
const user = await service.getUser(1);`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Forgetting await — you get a Promise, not the value
async function bad() {
  const data = fetch('/api'); // Missing await!
  console.log(data); // Promise { <pending> }
}

// â Mistake 2: Using await in forEach â it doesn’t wait!
async function bad2(urls) {
  urls.forEach(async (url) => {
    const data = await fetch(url);
    // forEach doesn’t await these! All fire at once
    // and the outer function returns before they finish
  });
}
// ✅ Fix: Use for...of for sequential
async function good2(urls) {
  for (const url of urls) {
    const data = await fetch(url); // Actually waits
  }
}

// ❌ Mistake 3: Sequential await when parallel is possible
const a = await fetchA(); // Waits 500ms
const b = await fetchB(); // Waits another 500ms = 1000ms total
// ✅ Use Promise.all
const [a, b] = await Promise.all([fetchA(), fetchB()]); // 500ms total

// ❌ Mistake 4: async function returning await
async function bad4() {
  return await somePromise(); // Unnecessary await
}
// ✅ Just return the Promise (unless in try/catch)
async function good4() {
  return somePromise();
}

// ❌ Mistake 5: Not handling errors
async function bad5() {
  const data = await riskyOperation();
  // If it rejects → unhandled Promise rejection!
}

// ❌ Mistake 6: Using await outside async function
// const data = await fetch('/api'); // SyntaxError (unless top-level module)`,
    },

    { type: 'heading', level: 2, text: 'async/await vs Promise Chains', id: 'comparison' },
    {
      type: 'table',
      headers: ['Feature', 'async/await', 'Promise chains'],
      rows: [
        ['Readability', 'Sequential, sync-like', 'Nested .then() callbacks'],
        ['Error handling', 'try/catch (familiar)', '.catch() (chainable)'],
        ['Debugging', 'Normal stack traces', 'Async stack traces needed'],
        ['Conditional logic', 'Natural if/else', 'Awkward in .then()'],
        ['Loops', 'for/while work naturally', 'Need recursion or reduce'],
        ['Parallel', 'Still need Promise.all', 'Promise.all works natively'],
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What does the async keyword do to a function?',
        'What happens when you await a non-Promise value?',
        'How do you run async operations in parallel with async/await?',
        'Why doesn\'t await work inside forEach?',
        'How do you handle errors in async functions?',
        'What is the difference between `return await p` and `return p`?',
        'How do you cancel an async operation?',
        'What is for await...of and when would you use it?',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Best Practice', text: 'Use async/await for most async code — it\'s more readable and debuggable. Use raw Promises for combinators (Promise.all, Promise.race) and when building utilities. Always handle errors with try/catch or a .catch() on the returned Promise.' },
  ],
};
