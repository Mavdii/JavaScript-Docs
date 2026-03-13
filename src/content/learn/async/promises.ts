import type { LessonContent } from '@/types/content';

export const promisesLesson: LessonContent = {
  id: 'promises',
  title: 'Promises',
  description: 'Master Promises — creation, chaining, error handling, and combinators like Promise.all.',
  slug: 'learn/async/promises',
  pillar: 'learn',
  category: 'async',
  tags: ['promises', 'async', 'then', 'catch'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'Promises represent a value that may not be available yet. They provide a cleaner alternative to callbacks with chainable .then(), .catch(), and combinators like Promise.all.',
  relatedTopics: ['callbacks', 'async-await', 'event-loop'],
  order: 3,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['Promise', 'then', 'catch', 'finally', 'Promise.all', 'Promise.race', 'resolve', 'reject'],
  prerequisites: ['Callbacks', 'Error Handling'],
  learningGoals: [
    'Create and consume Promises',
    'Chain .then() calls for sequential async operations',
    'Handle errors with .catch() and .finally()',
    'Use Promise.all, Promise.race, Promise.allSettled, and Promise.any',
    'Implement custom Promise-based utilities',
    'Avoid common Promise pitfalls',
  ],
  exercises: [
    'Convert a callback-based function to return a Promise.',
    'Use Promise.all to fetch data from three APIs in parallel.',
    'Implement a timeout wrapper using Promise.race.',
    'Build a retry function that retries a Promise-returning function N times.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What is a Promise?', id: 'what-is-promise' },
    { type: 'paragraph', text: 'A Promise is an object representing the eventual completion (or failure) of an asynchronous operation. It has three states: pending, fulfilled, or rejected. Once settled (fulfilled or rejected), a Promise cannot change state.' },
    {
      type: 'table',
      headers: ['State', 'Description', 'Triggered By'],
      rows: [
        ['Pending', 'Initial state, neither fulfilled nor rejected', 'Promise created'],
        ['Fulfilled', 'Operation completed successfully', 'resolve(value)'],
        ['Rejected', 'Operation failed', 'reject(reason)'],
      ],
    },

    { type: 'heading', level: 2, text: 'Creating a Promise', id: 'creating' },
    {
      type: 'code', language: 'javascript', filename: 'creating.js',
      code: `// The Promise constructor takes an executor function
const promise = new Promise((resolve, reject) => {
  // Do async work...
  const success = true;

  setTimeout(() => {
    if (success) {
      resolve({ data: 'Hello' }); // Fulfill with value
    } else {
      reject(new Error('Something went wrong')); // Reject with reason
    }
  }, 1000);
});

// Consume with .then() and .catch()
promise
  .then(result => console.log(result.data))   // "Hello"
  .catch(error => console.error(error.message));

// Important: The executor runs IMMEDIATELY (synchronously)
console.log('before');
new Promise((resolve) => {
  console.log('inside executor'); // Runs synchronously!
  resolve('done');
}).then(v => console.log(v));
console.log('after');
// Output: before, inside executor, after, done`,
    },

    { type: 'heading', level: 2, text: 'Consuming Promises', id: 'consuming' },
    {
      type: 'code', language: 'javascript', filename: 'consuming.js',
      code: `// .then(onFulfilled, onRejected)
promise.then(
  (value) => console.log('Success:', value),
  (error) => console.log('Error:', error)
);

// .catch(onRejected) — equivalent to .then(null, onRejected)
promise.catch((error) => console.error(error));

// .finally(onSettled) — runs regardless of outcome
promise.finally(() => {
  hideLoadingSpinner(); // Cleanup
  // No arguments, no access to value or error
  // Return value is ignored (pass-through)
});

// Practical pattern
fetch('/api/data')
  .then(res => {
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json();
  })
  .then(data => renderData(data))
  .catch(err => showError(err.message))
  .finally(() => hideSpinner());`,
    },

    { type: 'heading', level: 2, text: 'Chaining', id: 'chaining' },
    { type: 'paragraph', text: 'Each `.then()` returns a new Promise, enabling chaining. The return value of one `.then()` becomes the input of the next. If you return a Promise, the chain waits for it to settle.' },
    {
      type: 'code', language: 'javascript', filename: 'chaining.js',
      code: `fetch('/api/user/1')
  .then(res => res.json())                        // Returns parsed JSON
  .then(user => fetch(\`/api/orders/\${user.id}\`))  // Returns fetch Promise
  .then(res => res.json())                         // Returns parsed JSON
  .then(orders => {
    console.log('Orders:', orders);
    return orders.length;                          // Returns a value
  })
  .then(count => console.log(\`\${count} orders\`))
  .catch(err => console.error('Failed:', err));    // Catches any error above

// Each .then returns a new Promise:
const p1 = fetch('/api');
const p2 = p1.then(res => res.json());
const p3 = p2.then(data => data.name);
// p1, p2, p3 are three different Promise objects`,
    },
    { type: 'callout', variant: 'warning', title: 'Always Return!', text: 'Forgetting to return in a `.then()` breaks the chain. The next `.then()` receives `undefined` instead of your intended value.' },
    {
      type: 'code', language: 'javascript', filename: 'return-gotcha.js',
      code: `// ❌ Broken chain — forgot to return
fetch('/api/user')
  .then(res => {
    res.json(); // Not returned! Next .then gets undefined
  })
  .then(data => {
    console.log(data); // undefined!
  });

// ✅ Fixed — return the Promise
fetch('/api/user')
  .then(res => {
    return res.json(); // or just: .then(res => res.json())
  })
  .then(data => {
    console.log(data); // actual data
  });`,
    },

    { type: 'heading', level: 2, text: 'Error Handling', id: 'error-handling' },
    { type: 'paragraph', text: 'Errors propagate down the chain until caught by a `.catch()`. A single `.catch()` at the end handles errors from any point in the chain. Caught errors don\'t propagate further — the chain continues normally after `.catch()`.' },
    {
      type: 'code', language: 'javascript', filename: 'errors.js',
      code: `// Errors propagate to the nearest .catch()
fetchData()
  .then(process)   // If this throws, skip to catch
  .then(save)      // If this throws, skip to catch
  .catch(err => {
    // Catches errors from fetchData, process, OR save
    console.error('Error:', err.message);
    return fallbackData; // Recovery — chain continues!
  })
  .then(data => {
    // Runs with fallbackData if there was an error
    // Runs with save’s result if no error
    display(data);
  })
  .finally(() => {
    hideLoadingSpinner(); // Always runs
  });

// Multiple .catch() blocks for different error handling
fetch('/api/data')
  .then(res => {
    if (res.status === 404) throw new NotFoundError();
    if (res.status === 401) throw new AuthError();
    return res.json();
  })
  .catch(err => {
    if (err instanceof NotFoundError) return defaultData;
    throw err; // Re-throw other errors
  })
  .catch(err => {
    // Catches re-thrown errors
    console.error('Unhandled:', err);
  });`,
    },

    { type: 'heading', level: 2, text: 'Static Methods', id: 'static-methods' },
    {
      type: 'code', language: 'javascript', filename: 'static.js',
      code: `// Promise.resolve — wrap a value in a fulfilled Promise
const p1 = Promise.resolve(42);
p1.then(v => console.log(v)); // 42

// Promise.reject — wrap a reason in a rejected Promise
const p2 = Promise.reject(new Error('fail'));
p2.catch(e => console.log(e.message)); // "fail"

// Useful for normalizing sync/async APIs
function getData(cache) {
  if (cache.has('data')) {
    return Promise.resolve(cache.get('data')); // Sync → Promise
  }
  return fetch('/api/data').then(r => r.json()); // Async → Promise
}
// Consumer always uses .then() — consistent API`,
    },

    { type: 'heading', level: 2, text: 'Promise.all', id: 'promise-all' },
    { type: 'paragraph', text: 'Waits for ALL promises to fulfill. Returns an array of results in the same order. Rejects immediately if ANY promise rejects.' },
    {
      type: 'code', language: 'javascript', filename: 'promise-all.js',
      code: `// Parallel fetching — much faster than sequential
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json()),
]);
// Total time = max(users, posts, comments), not sum

// If any one fails, the whole thing fails
try {
  const results = await Promise.all([
    Promise.resolve(1),
    Promise.reject(new Error('fail')),
    Promise.resolve(3),
  ]);
} catch (err) {
  console.log(err.message); // "fail"
  // You don’t get results[0] or results[2]
}

// Use with dynamic arrays
const urls = ['/api/a', '/api/b', '/api/c'];
const results = await Promise.all(
  urls.map(url => fetch(url).then(r => r.json()))
);`,
    },

    { type: 'heading', level: 2, text: 'Promise.allSettled', id: 'promise-allsettled' },
    { type: 'paragraph', text: 'Waits for ALL promises to settle (fulfill or reject). Never rejects itself. Returns an array of result objects.' },
    {
      type: 'code', language: 'javascript', filename: 'allsettled.js',
      code: `const results = await Promise.allSettled([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/missing-endpoint'),
  fetch('/api/posts').then(r => r.json()),
]);

results.forEach((result, i) => {
  if (result.status === 'fulfilled') {
    console.log(\`Request \${i}: Success\`, result.value);
  } else {
    console.log(\`Request \${i}: Failed\`, result.reason.message);
  }
});

// result format:
// { status: 'fulfilled', value: ... }
// { status: 'rejected', reason: Error }

// Extract only successful results
const successful = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);`,
    },

    { type: 'heading', level: 2, text: 'Promise.race & Promise.any', id: 'race-any' },
    {
      type: 'code', language: 'javascript', filename: 'race-any.js',
      code: `// Promise.race — first to SETTLE wins (fulfill or reject)
const result = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
]);
// If fetch completes in 2s → success
// If 5s passes first → timeout error

// Promise.any — first to FULFILL wins (ES2021)
const fastest = await Promise.any([
  fetch('https://cdn1.example.com/data'),
  fetch('https://cdn2.example.com/data'),
  fetch('https://cdn3.example.com/data'),
]);
// Returns result from whichever CDN responds first
// Only rejects if ALL promises reject (AggregateError)

try {
  await Promise.any([
    Promise.reject('a'),
    Promise.reject('b'),
  ]);
} catch (err) {
  // AggregateError: All promises were rejected
  console.log(err.errors); // ['a', 'b']
}`,
    },

    { type: 'heading', level: 2, text: 'Combinators Comparison', id: 'combinators' },
    {
      type: 'table',
      headers: ['Method', 'Resolves when', 'Rejects when', 'Use case'],
      rows: [
        ['Promise.all', 'ALL fulfill', 'ANY rejects', 'Parallel tasks, all required'],
        ['Promise.allSettled', 'ALL settle', 'Never', 'Parallel tasks, partial OK'],
        ['Promise.race', 'First settles', 'First settles (if rejected)', 'Timeout, fastest response'],
        ['Promise.any', 'First fulfills', 'ALL reject', 'Fastest success, fallbacks'],
      ],
    },

    { type: 'heading', level: 2, text: 'Building Utilities', id: 'utilities' },
    {
      type: 'code', language: 'javascript', filename: 'utilities.js',
      code: `// Timeout wrapper
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(\`Timeout after \${ms}ms\`)), ms)
  );
  return Promise.race([promise, timeout]);
}

await withTimeout(fetch('/api/slow'), 5000);

// Retry with exponential backoff
async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, attempt)));
    }
  }
}

await retry(() => fetch('/api/flaky'), 3, 1000);

// Sequential execution of Promise-returning functions
async function sequential(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// Delay / sleep
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await delay(2000); // Wait 2 seconds`,
    },

    { type: 'heading', level: 2, text: 'Promise.withResolvers', id: 'with-resolvers' },
    { type: 'paragraph', text: 'ES2024 introduced Promise.withResolvers() which returns a promise along with its resolve and reject functions. This simplifies patterns where you need to resolve/reject from outside the executor.' },
    {
      type: 'code', language: 'javascript', filename: 'with-resolvers.js',
      code: `// Before: awkward pattern to expose resolve/reject
let resolveOuter, rejectOuter;
const promise = new Promise((resolve, reject) => {
  resolveOuter = resolve;
  rejectOuter = reject;
});

// After: clean with Promise.withResolvers()
const { promise, resolve, reject } = Promise.withResolvers();

// Use case: deferred pattern
class Deferred {
  constructor() {
    const { promise, resolve, reject } = Promise.withResolvers();
    this.promise = promise;
    this.resolve = resolve;
    this.reject = reject;
  }
}

const deferred = new Deferred();
setTimeout(() => deferred.resolve('done'), 1000);
const result = await deferred.promise; // "done"`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Nesting instead of chaining
fetch('/api/user')
  .then(res => {
    res.json().then(user => { // Nested! Don’t do this
      fetch(\`/api/orders/\${user.id}\`).then(res => { ... });
    });
  });

// ✅ Fix: Chain with returns
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(\`/api/orders/\${user.id}\`))
  .then(res => res.json());

// ❌ Mistake 2: Creating unnecessary Promises
function getData() {
  return new Promise((resolve) => {
    resolve(fetch('/api')); // Wrapping a Promise in a Promise!
  });
}
// ✅ Just return the Promise
function getData() {
  return fetch('/api');
}

// ❌ Mistake 3: Forgetting to handle rejections
fetch('/api').then(r => r.json()); // Unhandled rejection if it fails!
// ✅ Always add .catch()

// ❌ Mistake 4: Using forEach with async callbacks
urls.forEach(async (url) => {
  await fetch(url); // These DON’T wait for each other!
});
// ✅ Use for...of for sequential, Promise.all for parallel

// ❌ Mistake 5: Catching and swallowing errors
promise.catch(() => {}); // Silent failure — very hard to debug`,
    },

    { type: 'heading', level: 2, text: 'Promises & the Microtask Queue', id: 'microtasks' },
    {
      type: 'code', language: 'javascript', filename: 'microtasks.js',
      code: `// Promise callbacks (.then, .catch, .finally) are microtasks
// They run BEFORE setTimeout (macrotask)

console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Output: 1, 4, 3, 2

// Chained .then() creates sequential microtasks
Promise.resolve()
  .then(() => console.log('micro 1'))
  .then(() => console.log('micro 2'))
  .then(() => console.log('micro 3'));

setTimeout(() => console.log('macro'), 0);

// Output: micro 1, micro 2, micro 3, macro`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What are the three states of a Promise?',
        'What is the difference between .then(onFulfilled, onRejected) and .then().catch()?',
        'How does Promise.all differ from Promise.allSettled?',
        'Why does returning inside .then() matter?',
        'Implement a timeout wrapper for Promises.',
        'Are Promise callbacks microtasks or macrotasks?',
        'What is the Promise constructor antipattern?',
        'Implement Promise.all from scratch.',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Best Practice', text: 'Always add a .catch() at the end of every Promise chain. Unhandled rejections cause warnings in the console and can crash Node.js processes. In modern code, prefer async/await with try/catch for cleaner syntax.' },
  ],
};
