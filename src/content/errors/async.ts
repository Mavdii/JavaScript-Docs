import type { ErrorGuideContent } from '@/types/content';

export const asyncErrorsGuide: ErrorGuideContent = {
  id: 'error-async',
  title: 'Async Mistakes',
  description: 'Common mistakes with asynchronous JavaScript and how to avoid them.',
  slug: 'errors/async',
  pillar: 'errors',
  category: 'error-types',
  tags: ['async', 'promises', 'await', 'errors'],
  difficulty: 'intermediate',
  contentType: 'error-guide',
  summary: 'Learn about common pitfalls with Promises, async/await, and the event loop — race conditions, unhandled rejections, forEach traps, and memory leaks — with tested solutions.',
  relatedTopics: ['promises', 'async-await', 'error-common'],
  order: 2,
  updatedAt: '2025-06-01',
  readingTime: 22,
  featured: false,
  keywords: ['async errors', 'unhandled rejection', 'race condition'],
  errorType: 'Async Errors',
  solutions: [
    'Always handle Promise rejections with .catch() or try/catch.',
    'Don\'t forget to await async function calls.',
    'Avoid async operations inside forEach — use for...of or Promise.all instead.',
    'Be mindful of race conditions with concurrent state updates.',
    'Use AbortController to cancel stale requests.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Forgetting to Await', id: 'forgetting-await' },
    { type: 'paragraph', text: 'The most subtle async bug — calling an async function without await returns a Promise object instead of the resolved value. This often leads to confusing behavior rather than a clear error.' },
    { type: 'code', language: 'javascript', code: `// ❌ Missing await — result is a Promise, not the data
async function getUser() {
  const result = fetch('/api/user'); // missing await!
  console.log(result); // Promise {<pending>}
  
  // Even worse — truthy check passes!
  if (result) {
    console.log('User found!'); // always executes — Promise is truthy
  }
}

// ❌ Missing await in conditions
async function isAdmin() {
  const user = await fetch('/api/me').then(r => r.json());
  return user.role === 'admin'; // returns Promise<boolean>
}

// Bug: Promise is always truthy
if (isAdmin()) { // ← missing await!
  showAdminPanel(); // ALWAYS runs, security bug!
}

// ✅ Correct usage
if (await isAdmin()) {
  showAdminPanel();
}

// ✅ TypeScript catches this with @typescript-eslint/no-floating-promises
// and @typescript-eslint/no-misused-promises rules` },

    { type: 'heading', level: 2, text: 'Unhandled Promise Rejections', id: 'unhandled-rejections' },
    { type: 'code', language: 'javascript', code: `// ❌ No error handling — silent failure
fetch('/api/data').then(r => r.json());
// If the request fails, the error vanishes into the void

// ❌ Partial handling — .then() without .catch()
fetch('/api/data')
  .then(r => r.json())
  .then(data => processData(data));
// Error in processData OR fetch is unhandled

// ✅ Always chain .catch() at the end
fetch('/api/data')
  .then(r => r.json())
  .then(data => processData(data))
  .catch(error => {
    console.error('Pipeline failed:', error);
    showErrorToUser(error.message);
  });

// ✅ try/catch with async/await (cleaner)
async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    return processData(data);
  } catch (error) {
    console.error('Failed to load data:', error);
    return null; // graceful fallback
  }
}

// ✅ Global handler (safety net, not a replacement)
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // prevent default browser logging
  // Report to error tracking service (Sentry, etc.)
});` },

    { type: 'heading', level: 2, text: 'async/await in forEach', id: 'async-foreach' },
    { type: 'paragraph', text: 'Array.forEach does NOT wait for async callbacks. The callback returns a Promise, but forEach ignores it. This is one of the most common async traps.' },
    { type: 'code', language: 'javascript', code: `// â forEach fires all callbacks simultaneously, doesn’t wait
const ids = [1, 2, 3, 4, 5];

ids.forEach(async (id) => {
  const data = await fetchItem(id); // all 5 fire at once
  await saveToDb(data);              // order is unpredictable
});
console.log('Done!'); // ← runs IMMEDIATELY, before any fetch completes

// ✅ Sequential processing — for...of
async function processSequential(ids) {
  for (const id of ids) {
    const data = await fetchItem(id);  // waits for each one
    await saveToDb(data);
  }
  console.log('Done!'); // ← runs after ALL items are processed
}

// ✅ Parallel processing — Promise.all + map
async function processParallel(ids) {
  const results = await Promise.all(
    ids.map(async (id) => {
      const data = await fetchItem(id);
      await saveToDb(data);
      return data;
    })
  );
  console.log('Done! Processed:', results.length);
}

// ✅ Controlled concurrency — process N at a time
async function processWithConcurrency(ids, concurrency = 3) {
  const results = [];
  for (let i = 0; i < ids.length; i += concurrency) {
    const batch = ids.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(id => fetchItem(id))
    );
    results.push(...batchResults);
  }
  return results;
}

// Also broken: .map() without awaiting the result
const promises = ids.map(async (id) => fetchItem(id));
// promises is Promise[] — need: await Promise.all(promises)` },

    { type: 'heading', level: 2, text: 'Race Conditions', id: 'race-conditions' },
    { type: 'paragraph', text: 'Race conditions occur when multiple async operations compete to update the same state, and the final result depends on which completes last — not which was initiated last.' },
    { type: 'code', language: 'javascript', code: `// ❌ Classic React race condition — stale data from old request
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // User types "abc" quickly:
    // Request 1: "a"   → takes 500ms
    // Request 2: "ab"  → takes 200ms
    // Request 3: "abc" → takes 300ms
    // Results arrive: "ab"(200ms), "abc"(300ms), "a"(500ms)
    // Final state shows results for "a" — WRONG!
    
    fetch(\`/api/search?q=\${query}\`)
      .then(r => r.json())
      .then(data => setResults(data)); // stale response overwrites newer one
  }, [query]);
}

// ✅ Fix 1: AbortController — cancel previous request
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setResults(data))
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => controller.abort(); // cancel on re-render or unmount
  }, [query]);
}

// ✅ Fix 2: Ignore stale responses with a flag
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch(\`/api/search?q=\${query}\`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) setResults(data); // only update if still relevant
      });

    return () => { cancelled = true; };
  }, [query]);
}

// ✅ Fix 3: TanStack Query handles this automatically
function SearchResults({ query }) {
  const { data } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch(\`/api/search?q=\${query}\`).then(r => r.json()),
  });
  // Automatically cancels stale queries and deduplicates
}` },

    { type: 'heading', level: 2, text: 'Promise.all Pitfalls', id: 'promise-all' },
    { type: 'code', language: 'javascript', code: `// ❌ Promise.all fails fast — one rejection kills everything
try {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),    // succeeds
    fetchPosts(),    // FAILS
    fetchComments(), // succeeds, but result is lost!
  ]);
} catch (error) {
  // Only get the first error, successful results are discarded
}

// ✅ Use Promise.allSettled when partial results are acceptable
const results = await Promise.allSettled([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
]);

const data = results.map((result, i) => {
  if (result.status === 'fulfilled') return result.value;
  console.error(\`Request \${i} failed:\`, result.reason);
  return null; // graceful fallback
});

const [users, posts, comments] = data;
// users and comments have data, posts is null

// ✅ Helper to extract settled results
function getSettledResults(settled) {
  return {
    fulfilled: settled
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value),
    rejected: settled
      .filter(r => r.status === 'rejected')
      .map(r => r.reason),
  };
}` },

    { type: 'heading', level: 2, text: 'Async Memory Leaks', id: 'memory-leaks' },
    { type: 'code', language: 'javascript', code: `// ❌ React: setting state on unmounted component
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // If component unmounts before fetch completes,
    // setUser fires on an unmounted component
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(data => setUser(data)); // ⚠️ component might be gone

    // No cleanup!
  }, [userId]);
}

// ✅ Fix: AbortController cleanup
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setUser(data))
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => controller.abort(); // cleanup on unmount
  }, [userId]);
}

// ❌ Forgotten intervals
useEffect(() => {
  setInterval(() => {
    fetchNotifications(); // keeps running after unmount!
  }, 30000);
}, []);

// ✅ Always clear intervals
useEffect(() => {
  const id = setInterval(() => fetchNotifications(), 30000);
  return () => clearInterval(id);
}, []);

// ❌ Event listeners without cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Missing cleanup → listener accumulates on each mount
}, []);

// ✅ 
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);` },

    { type: 'heading', level: 2, text: 'Event Loop Confusion', id: 'event-loop' },
    { type: 'code', language: 'javascript', code: `// ❌ Expecting setTimeout(0) to run immediately
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');

// Output: A, D, C, B
// Why? Microtasks (Promises) run before macrotasks (setTimeout)

// ❌ Blocking the event loop with synchronous work
function processLargeArray(items) {
  items.forEach(item => {
    heavyComputation(item); // blocks UI for seconds
  });
}

// ✅ Yield to the event loop periodically
async function processLargeArray(items) {
  const BATCH_SIZE = 100;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    batch.forEach(item => heavyComputation(item));
    
    // Yield to event loop — let UI updates and events process
    await new Promise(r => setTimeout(r, 0));
  }
}

// ✅ Or use Web Workers for true parallelism
const worker = new Worker('heavy-task.js');
worker.postMessage(largeData);
worker.onmessage = (e) => {
  console.log('Result:', e.data); // runs in background thread
};` },

    { type: 'heading', level: 2, text: 'Error Handling Patterns', id: 'error-patterns' },
    { type: 'code', language: 'javascript', code: `// Pattern 1: Result type (Go-style, no try/catch needed)
async function safeAsync(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

const [user, error] = await safeAsync(fetchUser(id));
if (error) {
  console.error('Failed:', error.message);
  return;
}
console.log(user.name);

// Pattern 2: Error boundary for async React hooks
function useAsyncData(asyncFn, deps = []) {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState(s => ({ ...s, loading: true, error: null }));

    asyncFn(controller.signal)
      .then(data => {
        if (!controller.signal.aborted) {
          setState({ data, error: null, loading: false });
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          setState({ data: null, error, loading: false });
        }
      });

    return () => controller.abort();
  }, deps);

  return state;
}

// Usage
function UserProfile({ id }) {
  const { data: user, error, loading } = useAsyncData(
    (signal) => fetch(\`/api/users/\${id}\`, { signal }).then(r => r.json()),
    [id]
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user.name}</div>;
}` },

    { type: 'callout', variant: 'warning', title: 'Golden Rule', text: 'Every async operation needs three things: error handling, cleanup on unmount/cancel, and protection against stale results. If you\'re missing any of these, you have a bug waiting to happen.' },
  ],
};
