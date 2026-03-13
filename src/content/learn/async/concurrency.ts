import type { LessonContent } from '@/types/content';

export const concurrencyLesson: LessonContent = {
  id: 'concurrency',
  title: 'Concurrency',
  description: 'Manage concurrent operations with Web Workers, SharedArrayBuffer, and concurrency patterns.',
  slug: 'learn/async/concurrency',
  pillar: 'learn',
  category: 'async',
  tags: ['concurrency', 'web-workers', 'parallelism'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'JavaScript is single-threaded, but Web Workers enable true parallelism. Learn concurrency patterns for CPU-intensive tasks without blocking the main thread.',
  relatedTopics: ['event-loop', 'memory-performance'],
  order: 5,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['Web Worker', 'concurrency', 'parallelism', 'SharedArrayBuffer', 'postMessage'],
  prerequisites: ['Event Loop', 'Promises'],
  learningGoals: [
    'Use Web Workers for CPU-intensive tasks',
    'Communicate between main thread and workers',
    'Understand concurrency vs parallelism',
    'Implement concurrency-limiting patterns',
    'Use SharedArrayBuffer and Atomics',
    'Apply worker pooling patterns',
  ],
  exercises: [
    'Create a Web Worker that computes Fibonacci numbers without blocking the UI.',
    'Implement a task queue that limits concurrent Promise executions.',
    'Build a worker pool that distributes tasks across multiple workers.',
    'Implement a producer-consumer pattern using async generators.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Concurrency vs Parallelism', id: 'concurrency-vs-parallelism' },
    { type: 'paragraph', text: 'Concurrency is about managing multiple tasks that make progress over overlapping time periods. Parallelism is about running tasks simultaneously on different processors. JavaScript\'s event loop provides concurrency; Web Workers provide parallelism.' },
    {
      type: 'table',
      headers: ['', 'Concurrency', 'Parallelism'],
      rows: [
        ['Definition', 'Managing multiple tasks over time', 'Running tasks simultaneously'],
        ['JavaScript', 'Event loop + async/await', 'Web Workers + threads'],
        ['Use case', 'I/O-bound (network, disk)', 'CPU-bound (computation)'],
        ['Analogy', 'One cook, multiple dishes', 'Multiple cooks, multiple dishes'],
        ['Thread safety', 'Not an issue (single-threaded)', 'Must handle shared state'],
      ],
    },

    { type: 'heading', level: 2, text: 'Web Workers Basics', id: 'web-workers' },
    { type: 'paragraph', text: 'Web Workers run code in background threads with their own scope. No DOM access. They talk to the main thread by passing messages. Data gets copied.' },
    {
      type: 'code', language: 'javascript', filename: 'main.js',
      code: `// Main thread — creates and communicates with worker
const worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({
  type: 'compute',
  data: { numbers: [1, 2, 3, 4, 5], operation: 'sum' }
});

// Receive results from worker
worker.onmessage = (event) => {
  console.log('Result:', event.data.result);
  updateUI(event.data.result);
};

// Handle errors
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
};

// Terminate worker when done
worker.terminate();`,
    },
    {
      type: 'code', language: 'javascript', filename: 'worker.js',
      code: `// Worker thread — separate global scope, no DOM
self.onmessage = (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'compute': {
      // Heavy computation runs here without blocking UI
      let result;
      if (data.operation === 'sum') {
        result = data.numbers.reduce((a, b) => a + b, 0);
      } else if (data.operation === 'fibonacci') {
        result = fibonacci(data.n);
      }
      self.postMessage({ result });
      break;
    }
    case 'stop':
      self.close(); // Worker terminates itself
      break;
  }
};

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    },

    { type: 'heading', level: 2, text: 'Worker Limitations', id: 'worker-limitations' },
    {
      type: 'table',
      headers: ['Available in Workers', 'NOT Available in Workers'],
      rows: [
        ['fetch, XMLHttpRequest', 'document, window'],
        ['setTimeout, setInterval', 'DOM manipulation'],
        ['IndexedDB', 'localStorage, sessionStorage'],
        ['WebSockets', 'alert, confirm, prompt'],
        ['importScripts()', 'Parent page variables'],
        ['navigator (partial)', 'Any UI APIs'],
      ],
    },

    { type: 'heading', level: 2, text: 'Inline Workers', id: 'inline-workers' },
    { type: 'paragraph', text: 'You can make workers from Blob URLs without separate files. Great for bundled apps.' },
    {
      type: 'code', language: 'javascript', filename: 'inline-worker.js',
      code: `// Create a worker from a string
function createWorker(fn) {
  const blob = new Blob(
    [\`self.onmessage = \${fn.toString()}\`],
    { type: 'application/javascript' }
  );
  return new Worker(URL.createObjectURL(blob));
}

const worker = createWorker((event) => {
  const { data } = event;
  const result = data.map(n => n * n);
  self.postMessage(result);
});

worker.postMessage([1, 2, 3, 4, 5]);
worker.onmessage = (e) => console.log(e.data); // [1, 4, 9, 16, 25]

// With Vite/Webpack, you can use module workers:
const worker = new Worker(
  new URL('./worker.js', import.meta.url),
  { type: 'module' } // ES modules in worker!
);`,
    },

    { type: 'heading', level: 2, text: 'Worker with Promises', id: 'worker-promises' },
    {
      type: 'code', language: 'javascript', filename: 'promise-worker.js',
      code: `// Wrap worker communication in Promises
class AsyncWorker {
  #worker;
  #pending = new Map();
  #nextId = 0;

  constructor(url) {
    this.#worker = new Worker(url);
    this.#worker.onmessage = ({ data }) => {
      const { id, result, error } = data;
      const handler = this.#pending.get(id);
      if (!handler) return;
      this.#pending.delete(id);
      error ? handler.reject(new Error(error)) : handler.resolve(result);
    };
  }

  run(task, data) {
    return new Promise((resolve, reject) => {
      const id = this.#nextId++;
      this.#pending.set(id, { resolve, reject });
      this.#worker.postMessage({ id, task, data });
    });
  }

  terminate() {
    this.#worker.terminate();
    for (const { reject } of this.#pending.values()) {
      reject(new Error('Worker terminated'));
    }
    this.#pending.clear();
  }
}

// Usage
const worker = new AsyncWorker('worker.js');
const result = await worker.run('fibonacci', { n: 40 });
console.log(result);`,
    },

    { type: 'heading', level: 2, text: 'Worker Pool', id: 'worker-pool' },
    { type: 'paragraph', text: 'A worker pool distributes work across multiple workers. Like a thread pool in other languages.' },
    {
      type: 'code', language: 'javascript', filename: 'pool.js',
      code: `class WorkerPool {
  #workers = [];
  #queue = [];
  #activeJobs = new Map();

  constructor(workerUrl, size = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerUrl);
      worker.busy = false;
      worker.onmessage = ({ data }) => {
        const { resolve } = this.#activeJobs.get(worker);
        this.#activeJobs.delete(worker);
        worker.busy = false;
        resolve(data.result);
        this.#processQueue();
      };
      this.#workers.push(worker);
    }
  }

  run(task) {
    return new Promise((resolve, reject) => {
      const freeWorker = this.#workers.find(w => !w.busy);
      if (freeWorker) {
        this.#assign(freeWorker, task, resolve, reject);
      } else {
        this.#queue.push({ task, resolve, reject });
      }
    });
  }

  #assign(worker, task, resolve, reject) {
    worker.busy = true;
    this.#activeJobs.set(worker, { resolve, reject });
    worker.postMessage(task);
  }

  #processQueue() {
    if (this.#queue.length === 0) return;
    const freeWorker = this.#workers.find(w => !w.busy);
    if (!freeWorker) return;
    const { task, resolve, reject } = this.#queue.shift();
    this.#assign(freeWorker, task, resolve, reject);
  }
}

const pool = new WorkerPool('compute-worker.js', 4);
const results = await Promise.all(
  tasks.map(task => pool.run(task))
);`,
    },

    { type: 'heading', level: 2, text: 'Concurrency Limiting', id: 'limiting' },
    { type: 'paragraph', text: 'Limit concurrency on requests to avoid overwhelming servers. Works for any Promise-based tasks.' },
    {
      type: 'code', language: 'javascript', filename: 'concurrency-limit.js',
      code: `// Generic concurrency limiter
async function pLimit(tasks, concurrency = 5) {
  const results = [];
  const executing = new Set();

  for (const [i, task] of tasks.entries()) {
    const p = task().then(result => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results[i] = p;

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// Usage: fetch 100 URLs, max 5 at a time
const urls = Array.from({ length: 100 }, (_, i) => \`/api/item/\${i}\`);
const tasks = urls.map(url => () => fetch(url).then(r => r.json()));
const results = await pLimit(tasks, 5);

// Reusable semaphore class
class Semaphore {
  #queue = [];
  #current = 0;

  constructor(max) { this.max = max; }

  async acquire() {
    if (this.#current < this.max) {
      this.#current++;
      return;
    }
    await new Promise(resolve => this.#queue.push(resolve));
  }

  release() {
    this.#current--;
    if (this.#queue.length > 0) {
      this.#current++;
      this.#queue.shift()();
    }
  }
}

const sem = new Semaphore(5);
const results = await Promise.all(urls.map(async (url) => {
  await sem.acquire();
  try { return await fetch(url).then(r => r.json()); }
  finally { sem.release(); }
}));`,
    },

    { type: 'heading', level: 2, text: 'SharedArrayBuffer & Atomics', id: 'shared-memory' },
    { type: 'paragraph', text: 'SharedArrayBuffer shares memory between threads without copying. Atomics gives thread-safe operations. Use for high-performance parallel code.' },
    {
      type: 'code', language: 'javascript', filename: 'shared.js',
      code: `// Main thread
const buffer = new SharedArrayBuffer(1024);
const view = new Int32Array(buffer);

const worker = new Worker('worker.js');
worker.postMessage({ buffer }); // Share memory, not copy

// Atomic operations — thread-safe
Atomics.store(view, 0, 42);       // Write atomically
Atomics.load(view, 0);            // Read atomically
Atomics.add(view, 0, 1);          // Increment atomically
Atomics.compareExchange(view, 0, 42, 100); // CAS

// Worker thread (worker.js)
self.onmessage = ({ data: { buffer } }) => {
  const view = new Int32Array(buffer);

  // Both threads can read/write the same memory
  Atomics.add(view, 0, 10);

  // Wait/notify for synchronization
  Atomics.wait(view, 1, 0);    // Block until notified
};

// Main thread notifies worker
Atomics.store(view, 1, 1);
Atomics.notify(view, 1, 1);    // Wake one waiting thread`,
    },
    { type: 'callout', variant: 'warning', title: 'Security Headers Required', text: 'SharedArrayBuffer requires specific HTTP headers: `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. Without these, SharedArrayBuffer is unavailable.' },

    { type: 'heading', level: 2, text: 'Service Workers', id: 'service-workers' },
    { type: 'paragraph', text: 'Service Workers are a special type of worker that act as a proxy between the browser and the network. They enable offline functionality, push notifications, and background sync.' },
    {
      type: 'code', language: 'javascript', filename: 'service-worker.js',
      code: `// Register a service worker (main thread)
if ('serviceWorker' in navigator) {
  const reg = await navigator.serviceWorker.register('/sw.js');
  console.log('SW registered:', reg.scope);
}

// sw.js — the service worker
const CACHE_NAME = 'v1';
const ASSETS = ['/', '/styles.css', '/app.js'];

// Cache assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});`,
    },

    { type: 'heading', level: 2, text: 'When to Use Workers', id: 'when-to-use' },
    {
      type: 'table',
      headers: ['Task', 'Use Worker?', 'Reason'],
      rows: [
        ['Image/video processing', '✅ Yes', 'CPU-intensive, blocks UI'],
        ['Large dataset sorting', '✅ Yes', 'Can take seconds for 1M+ items'],
        ['Cryptographic operations', '✅ Yes', 'Heavy computation'],
        ['Parsing large CSV/JSON', '✅ Yes', 'Can freeze the page'],
        ['API fetch requests', '❌ No', 'Already async, non-blocking'],
        ['Simple DOM updates', '❌ No', 'Workers can\'t access DOM'],
        ['Small computations (<16ms)', '❌ No', 'Overhead of postMessage not worth it'],
      ],
    },

    { type: 'heading', level: 2, text: 'Producer-Consumer Pattern', id: 'producer-consumer' },
    {
      type: 'code', language: 'javascript', filename: 'producer-consumer.js',
      code: `// Async queue: producers add items, consumers process them
class AsyncQueue {
  #queue = [];
  #waiters = [];

  enqueue(item) {
    if (this.#waiters.length > 0) {
      this.#waiters.shift()(item); // Wake a waiting consumer
    } else {
      this.#queue.push(item);
    }
  }

  dequeue() {
    if (this.#queue.length > 0) {
      return Promise.resolve(this.#queue.shift());
    }
    return new Promise(resolve => this.#waiters.push(resolve));
  }
}

const queue = new AsyncQueue();

// Producer
async function produce() {
  for (let i = 0; i < 10; i++) {
    await delay(Math.random() * 100);
    queue.enqueue({ id: i, data: \`item-\${i}\` });
  }
}

// Consumer
async function consume() {
  while (true) {
    const item = await queue.dequeue();
    console.log('Processing:', item);
    await processItem(item);
  }
}

// Start both
produce();
consume();`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'list',
      items: [
        'Using Web Workers for trivial tasks — the postMessage overhead exceeds the computation time',
        'Sending large data to workers via postMessage — use Transferable objects for ArrayBuffers',
        'Not handling worker errors — always set onerror handler',
        'Forgetting to terminate workers — they continue running and consuming memory',
        'Trying to access DOM from a worker — use postMessage to send results to main thread',
        'Not limiting concurrent async operations — overwhelming the server or network',
        'Using SharedArrayBuffer without understanding Atomics — race conditions',
      ],
    },

    { type: 'heading', level: 2, text: 'Transferable Objects', id: 'transferable' },
    {
      type: 'code', language: 'javascript', filename: 'transferable.js',
      code: `// Normal postMessage: data is COPIED (slow for large data)
const largeArray = new Float64Array(1000000);
worker.postMessage(largeArray); // Copies 8MB of data!

// Transfer: data is MOVED (instant, zero-copy)
worker.postMessage(largeArray.buffer, [largeArray.buffer]);
// largeArray is now empty on the main thread!
// The worker owns the data exclusively

// OffscreenCanvas — render in worker
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);

// In the worker:
self.onmessage = ({ data: { canvas } }) => {
  const ctx = canvas.getContext('2d');
  // Draw on canvas from the worker!
};`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What is the difference between concurrency and parallelism?',
        'How do Web Workers communicate with the main thread?',
        'What limitations do Web Workers have?',
        'How would you implement a concurrency limiter for Promise-based tasks?',
        'What is SharedArrayBuffer and when would you use it?',
        'What is the difference between Web Workers and Service Workers?',
        'How do Transferable objects improve worker performance?',
      ],
    },
    { type: 'callout', variant: 'info', title: 'Key Insight', text: 'Most JavaScript performance issues are I/O-bound (waiting for network/disk), not CPU-bound. The event loop handles I/O concurrency excellently. Only reach for Web Workers when you have genuine CPU-intensive work that blocks the main thread for more than ~16ms.' },
  ],
};
