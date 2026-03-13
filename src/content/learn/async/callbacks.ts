import type { LessonContent } from '@/types/content';

export const callbacksLesson: LessonContent = {
  id: 'callbacks',
  title: 'Callbacks',
  description: 'Understand callback functions, the callback pattern for async operations, and callback hell.',
  slug: 'learn/async/callbacks',
  pillar: 'learn',
  category: 'async',
  tags: ['callbacks', 'async', 'functions'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Callbacks are functions passed as arguments to be called later. They were the original async pattern in JavaScript before Promises and async/await.',
  relatedTopics: ['promises', 'event-loop', 'functions'],
  order: 2,
  updatedAt: '2024-03-01',
  readingTime: 18,
  featured: false,
  keywords: ['callback', 'async', 'callback hell', 'error-first callback', 'Node.js'],
  prerequisites: ['Functions'],
  learningGoals: [
    'Use callbacks for async operations',
    'Understand the error-first callback pattern',
    'Recognize callback hell and why Promises were needed',
    'Convert callbacks to Promises',
    'Apply callbacks effectively in modern JavaScript',
  ],
  exercises: [
    'Rewrite a nested callback chain using Promises.',
    'Implement a simple async file reader using error-first callbacks.',
    'Build a utility that converts any callback-based function to return a Promise.',
    'Implement a parallel execution helper using only callbacks.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What is a Callback?', id: 'what-is-callback' },
    { type: 'paragraph', text: 'A callback is just a function you pass to another function to be called later. They’re everywhere â event handlers, array methods, timers, async operations.' },
    {
      type: 'code', language: 'javascript', filename: 'callback.js',
      code: `// Synchronous callback
function processArray(arr, callback) {
  const results = [];
  for (const item of arr) {
    results.push(callback(item));
  }
  return results;
}

processArray([1, 2, 3], (n) => n * 2); // [2, 4, 6]

// Asynchronous callback
function fetchData(url, callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'Alice' };
    callback(data);
  }, 1000);
}

fetchData('/api/user', (data) => {
  console.log(data.name); // "Alice" (after 1 second)
});
console.log('This runs first!'); // Sync code runs before callback`,
    },

    { type: 'heading', level: 2, text: 'Synchronous vs Asynchronous Callbacks', id: 'sync-vs-async' },
    {
      type: 'table',
      headers: ['Type', 'Execution', 'Examples'],
      rows: [
        ['Synchronous', 'Runs immediately within the calling function', 'Array.map, Array.filter, Array.sort'],
        ['Asynchronous', 'Runs later, after the calling function returns', 'setTimeout, fetch, event handlers'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'sync-async.js',
      code: `// Synchronous — callback runs immediately
console.log('before');
[1, 2, 3].forEach((n) => console.log(n));
console.log('after');
// before, 1, 2, 3, after

// Asynchronous — callback runs later
console.log('before');
setTimeout(() => console.log('timer'), 0);
console.log('after');
// before, after, timer`,
    },
    { type: 'callout', variant: 'warning', title: 'Zalgo', text: 'A function should be consistently sync or async. Mixing them causes unpredictable behavior ("releasing Zalgo").' },

    { type: 'heading', level: 2, text: 'Error-First Callbacks', id: 'error-first' },
    { type: 'paragraph', text: 'Node.js made error-first callbacks standard: first arg is the error (or null). This pattern is called an errback.' },
    {
      type: 'code', language: 'javascript', filename: 'error-first.js',
      code: `function readFile(path, callback) {
  setTimeout(() => {
    if (!path) {
      callback(new Error('Path is required'), null);
      return;
    }
    if (path === 'missing.txt') {
      callback(new Error('File not found'), null);
      return;
    }
    callback(null, 'file contents here');
  }, 100);
}

readFile('data.txt', (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return; // Important: return early to avoid processing null data
  }
  console.log('Data:', data);
});

// You MUST check for errors — forgetting leads to bugs
readFile('missing.txt', (err, data) => {
  // ❌ if you skip the error check:
  // console.log(data.length); // TypeError: Cannot read property 'length' of null

  // ✅ Always check err first
  if (err) return console.error(err.message);
  console.log(data.length);
});`,
    },

    { type: 'heading', level: 2, text: 'Callback Hell (Pyramid of Doom)', id: 'callback-hell' },
    { type: 'paragraph', text: 'When async operations depend on each other, callbacks nest deeper. This ugly nesting is callback hell.' },
    {
      type: 'code', language: 'javascript', filename: 'callback-hell.js',
      code: `// ❌ Pyramid of doom — deeply nested, hard to follow
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      getShippingInfo(details.shippingId, (err, shipping) => {
        if (err) return handleError(err);
        displayResult(user, details, shipping);
      });
    });
  });
});

// Problems with callback hell:
// 1. Hard to read — deeply indented
// 2. Hard to handle errors — repeated if (err) checks
// 3. Hard to compose â can’t easily reorder or parallelize
// 4. Hard to debug — stack traces are confusing
// 5. Hard to refactor — tightly coupled`,
    },

    { type: 'heading', level: 2, text: 'Mitigating Callback Hell', id: 'mitigating' },
    { type: 'paragraph', text: 'You can reduce callback hell with named functions, flattening, and helper utilities.' },
    {
      type: 'code', language: 'javascript', filename: 'named-callbacks.js',
      code: `// ✅ Strategy 1: Named functions (flatten the pyramid)
function handleUser(err, user) {
  if (err) return handleError(err);
  getOrders(user.id, handleOrders);
}

function handleOrders(err, orders) {
  if (err) return handleError(err);
  getOrderDetails(orders[0].id, handleDetails);
}

function handleDetails(err, details) {
  if (err) return handleError(err);
  displayResult(details);
}

getUser(userId, handleUser);

// ✅ Strategy 2: async library (before Promises existed)
// async.waterfall([
//   (cb) => getUser(userId, cb),
//   (user, cb) => getOrders(user.id, cb),
//   (orders, cb) => getOrderDetails(orders[0].id, cb),
// ], (err, result) => { ... });`,
    },

    { type: 'heading', level: 2, text: 'Converting Callbacks to Promises', id: 'promisify' },
    {
      type: 'code', language: 'javascript', filename: 'promisify.js',
      code: `// Manual conversion (wrapping)
function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Now you can use async/await!
const data = await readFileAsync('data.txt');

// Generic promisify utility
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

const readFileP = promisify(readFile);
const getUser P = promisify(getUser);

// Node.js has built-in util.promisify
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

// Node.js also has fs.promises
const { readFile } = require('fs').promises;`,
    },

    { type: 'heading', level: 2, text: 'Parallel Execution with Callbacks', id: 'parallel' },
    {
      type: 'code', language: 'javascript', filename: 'parallel.js',
      code: `// Run multiple async operations in parallel with callbacks
function parallel(tasks, finalCallback) {
  const results = [];
  let completed = 0;
  let hasError = false;

  tasks.forEach((task, index) => {
    task((err, result) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return finalCallback(err);
      }
      results[index] = result;
      completed++;
      if (completed === tasks.length) {
        finalCallback(null, results);
      }
    });
  });
}

// Usage
parallel([
  (cb) => fetchUser(1, cb),
  (cb) => fetchOrders(1, cb),
  (cb) => fetchSettings(cb),
], (err, [user, orders, settings]) => {
  if (err) return handleError(err);
  renderDashboard(user, orders, settings);
});`,
    },

    { type: 'heading', level: 2, text: 'Sequential Execution with Callbacks', id: 'sequential' },
    {
      type: 'code', language: 'javascript', filename: 'sequential.js',
      code: `// Run tasks one after another, passing results forward
function waterfall(tasks, finalCallback) {
  let index = 0;

  function next(err, ...results) {
    if (err) return finalCallback(err);
    if (index >= tasks.length) return finalCallback(null, ...results);

    const task = tasks[index++];
    task(...results, next);
  }

  next(null);
}

// Usage
waterfall([
  (next) => getUser(userId, next),
  (user, next) => getOrders(user.id, next),
  (orders, next) => getOrderDetails(orders[0].id, next),
], (err, details) => {
  if (err) return handleError(err);
  displayResult(details);
});`,
    },

    { type: 'heading', level: 2, text: 'Common Callback Uses Today', id: 'common-uses' },
    { type: 'paragraph', text: 'Even with Promises and async/await, callbacks are still fundamental for synchronous patterns and events.' },
    {
      type: 'table',
      headers: ['Use Case', 'Example', 'Sync/Async'],
      rows: [
        ['Event handlers', 'el.addEventListener("click", fn)', 'Async'],
        ['Array methods', 'arr.map(fn), arr.filter(fn)', 'Sync'],
        ['Timers', 'setTimeout(fn, delay)', 'Async'],
        ['Iterators', 'arr.sort((a, b) => a - b)', 'Sync'],
        ['Observer pattern', 'observer.subscribe(fn)', 'Async'],
        ['Middleware', 'app.use((req, res, next) => {})', 'Async'],
      ],
    },

    { type: 'heading', level: 2, text: 'Callback Design Patterns', id: 'patterns' },
    {
      type: 'code', language: 'javascript', filename: 'patterns.js',
      code: `// 1. Continuation Passing Style (CPS)
function add(a, b, callback) {
  callback(a + b);
}
add(2, 3, (result) => console.log(result)); // 5

// 2. Observer / EventEmitter pattern
class EventEmitter {
  #listeners = {};

  on(event, callback) {
    (this.#listeners[event] ??= []).push(callback);
    return this; // Enable chaining
  }

  emit(event, ...args) {
    (this.#listeners[event] ?? []).forEach(cb => cb(...args));
  }

  off(event, callback) {
    this.#listeners[event] = (this.#listeners[event] ?? [])
      .filter(cb => cb !== callback);
  }
}

const emitter = new EventEmitter();
emitter
  .on('data', (d) => console.log('Received:', d))
  .on('error', (e) => console.error(e));
emitter.emit('data', { id: 1 });

// 3. Middleware pattern (Express-style)
function compose(middlewares) {
  return function (context) {
    let index = 0;
    function next() {
      if (index < middlewares.length) {
        middlewares[index++](context, next);
      }
    }
    next();
  };
}`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Calling callback multiple times
function fetchData(url, callback) {
  if (!url) {
    callback(new Error('No URL'));
    // Missing return! Falls through to the async part
  }
  setTimeout(() => callback(null, 'data'), 100);
}
// ✅ Fix: always return after calling callback
function fetchDataFixed(url, callback) {
  if (!url) return callback(new Error('No URL'));
  setTimeout(() => callback(null, 'data'), 100);
}

// ❌ Mistake 2: Swallowing errors
fetchData('/api', (err, data) => {
  // Forgot to check err!
  console.log(data.name); // Crashes if err exists
});

// ❌ Mistake 3: Not handling the async nature
let result;
fetchData('/api', (err, data) => {
  result = data;
});
console.log(result); // undefined! Callback hasn’t run yet

// ❌ Mistake 4: Using 'this' in a callback without binding
class API {
  base = 'https://api.example.com';
  fetch(path, callback) {
    // 'this' might not be the API instance in the callback
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Callbacks vs Promises vs Async/Await', id: 'comparison' },
    {
      type: 'table',
      headers: ['Feature', 'Callbacks', 'Promises', 'Async/Await'],
      rows: [
        ['Error handling', 'Manual (if/else)', '.catch()', 'try/catch'],
        ['Chaining', 'Nesting (hell)', '.then() chaining', 'Sequential lines'],
        ['Parallel', 'Custom helper', 'Promise.all()', 'Promise.all() + await'],
        ['Cancellation', 'Manual flag', 'AbortController', 'AbortController'],
        ['Readability', 'Poor when nested', 'Good', 'Best'],
        ['Debugging', 'Hard (async stacks)', 'Better', 'Best (sync-like stacks)'],
        ['Learning curve', 'Low', 'Medium', 'Medium'],
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What is a callback function? Give sync and async examples.',
        'What is the error-first callback pattern?',
        'What is callback hell and how do you solve it?',
        'How would you implement Promise.all using only callbacks?',
        'Convert a callback-based API to use Promises.',
        'What is "releasing Zalgo"?',
        'When are callbacks still preferred over Promises?',
      ],
    },
    { type: 'callout', variant: 'info', title: 'Still Relevant', text: 'Promises and async/await replaced callbacks for async patterns, but callbacks are still essential for events, array methods, and observers. You need to understand them.' },
  ],
};
