import type { LessonContent } from '@/types/content';

export const memoryPerformanceLesson: LessonContent = {
  id: 'memory-performance',
  title: 'Memory & Performance',
  description: 'Understand garbage collection, memory leaks, and performance optimization techniques.',
  slug: 'learn/advanced/memory-performance',
  pillar: 'learn',
  category: 'advanced',
  tags: ['memory', 'performance', 'garbage-collection', 'optimization'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'JavaScript automatically manages memory via garbage collection, but memory leaks still happen. Understanding common leak patterns and performance techniques is critical for production apps.',
  relatedTopics: ['closures', 'debouncing'],
  order: 6,
  updatedAt: '2024-03-01',
  readingTime: 24,
  featured: false,
  keywords: ['garbage collection', 'memory leak', 'WeakMap', 'WeakRef', 'performance', 'profiling'],
  prerequisites: ['Closures', 'DOM Basics'],
  learningGoals: [
    'Get how garbage collection works',
    'Find and fix memory leaks',
    'Use WeakMap and WeakRef caching',
    'Profile with DevTools',
    'Optimize rendering and events',
    'Get V8 engine optimizations',
  ],
  exercises: [
    'Identify the memory leak in a provided code snippet and fix it.',
    'Use Chrome DevTools Memory tab to take heap snapshots and find retained objects.',
    'Optimize a slow list rendering function to avoid layout thrashing.',
    'Implement a bounded LRU cache using Map.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Garbage Collection', id: 'gc' },
    { type: 'paragraph', text: 'JavaScript uses a mark-and-sweep algorithm. Objects that are no longer reachable from the root (global scope, call stack) are automatically freed. You don\'t manually allocate or free memory, but you must understand what keeps objects alive.' },
    {
      type: 'code', language: 'javascript', filename: 'gc.js',
      code: `let user = { name: 'Alice' }; // Object is reachable via 'user'
user = null; // Object becomes unreachable → garbage collected

// Circular references are handled by modern GC
let a = {};
let b = {};
a.ref = b;
b.ref = a;
a = null;
b = null; // Both are collected despite circular refs

// Reachability tree:
// Root (global) → variables → objects → properties → more objects
// If an object can’t be reached from any root, it’s garbage`,
    },

    { type: 'heading', level: 2, text: 'How Mark-and-Sweep Works', id: 'mark-sweep' },
    {
      type: 'list',
      ordered: true,
      items: [
        'GC starts from roots (global object, call stack, active closures)',
        'It marks every reachable object by following references',
        'Unmarked objects are unreachable and get freed',
        'This runs periodically and automatically — you can\'t control timing',
        'Modern engines use generational GC — new objects are checked often',
      ],
    },
    {
      type: 'table',
      headers: ['Generation', 'Description', 'GC Frequency'],
      rows: [
        ['Young (nursery)', 'Newly created objects', 'Very frequent (minor GC)'],
        ['Old (tenured)', 'Objects that survived several GCs', 'Less frequent (major GC)'],
        ['Large objects', 'Objects too big for young generation', 'Separate handling'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Memory Leaks', id: 'leaks' },
    { type: 'paragraph', text: 'Memory leaks happen when objects stay alive unintentionally. Here are the five main patterns:' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Forgotten event listeners — always removeEventListener on cleanup',
        'Detached DOM nodes — removing elements while keeping JS references',
        'Closures holding large scopes unnecessarily',
        'Unbounded caches or arrays that grow forever',
        'setInterval without clearInterval',
      ],
    },

    { type: 'heading', level: 2, text: 'Leak: Forgotten Event Listeners', id: 'leak-listeners' },
    {
      type: 'code', language: 'javascript', filename: 'leak-listeners.js',
      code: `// ❌ LEAK: Event listener holds closure over large data
function setup() {
  const data = new Array(1000000).fill('x');
  window.addEventListener('resize', () => {
    console.log(data.length); // data is retained forever!
  });
}
setup(); // data can never be GC’d

// ✅ FIX: Store reference and clean up
function setupFixed() {
  const data = new Array(1000000).fill('x');
  const handler = () => console.log(data.length);
  window.addEventListener('resize', handler);

  // Return cleanup function
  return () => window.removeEventListener('resize', handler);
}

const cleanup = setupFixed();
// Later: cleanup(); // Now data can be GC’d

// ✅ Modern: AbortController for easy cleanup
const controller = new AbortController();
window.addEventListener('resize', handler, { signal: controller.signal });
// Later: controller.abort(); // Removes the listener`,
    },

    { type: 'heading', level: 2, text: 'Leak: Detached DOM Nodes', id: 'leak-dom' },
    {
      type: 'code', language: 'javascript', filename: 'leak-dom.js',
      code: `// ❌ LEAK: JS reference keeps DOM node alive after removal
let detachedNode;

function createAndRemove() {
  const el = document.createElement('div');
  el.innerHTML = '<p>Large content...</p>'.repeat(1000);
  document.body.appendChild(el);
  detachedNode = el; // Store reference
  document.body.removeChild(el); // Removed from DOM...
  // BUT still alive in memory because of detachedNode!
}

// ✅ FIX: Null out references after removal
function createAndRemoveFixed() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  document.body.removeChild(el);
  // Don’t store reference, or set it to null
}`,
    },

    { type: 'heading', level: 2, text: 'Leak: Closures', id: 'leak-closures' },
    {
      type: 'code', language: 'javascript', filename: 'leak-closures.js',
      code: `// ❌ LEAK: Closure retains entire scope
function processData() {
  const hugeData = fetchHugeDataset(); // 100MB
  const summary = computeSummary(hugeData);

  // This closure keeps hugeData alive!
  return function getSummary() {
    return summary; // Only needs summary, but hugeData is retained
  };
}

// â FIX: Don’t close over large data
function processDataFixed() {
  const hugeData = fetchHugeDataset();
  const summary = computeSummary(hugeData);
  // hugeData goes out of scope and can be GC’d

  return function getSummary() {
    return summary;
  };
}

// ✅ FIX: Explicitly null out large references
function processDataFixed2() {
  let hugeData = fetchHugeDataset();
  const summary = computeSummary(hugeData);
  hugeData = null; // Allow GC

  return () => summary;
}`,
    },

    { type: 'heading', level: 2, text: 'Leak: Unbounded Caches', id: 'leak-caches' },
    {
      type: 'code', language: 'javascript', filename: 'leak-caches.js',
      code: `// ❌ LEAK: Cache grows without bound
const cache = {};
function getData(key) {
  if (!cache[key]) {
    cache[key] = expensiveComputation(key);
  }
  return cache[key];
}
// After 1M unique keys, cache holds 1M entries forever!

// ✅ FIX: LRU cache with bounded size
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // Move to end
    return value;
  }

  set(key, value) {
    this.cache.delete(key); // Remove if exists
    this.cache.set(key, value);
    if (this.cache.size > this.maxSize) {
      // Delete oldest (first) entry
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
  }
}`,
    },

    { type: 'heading', level: 2, text: 'WeakMap & WeakRef', id: 'weak-references' },
    { type: 'paragraph', text: '`WeakMap` keys are held weakly — if the key object is garbage collected, the entry is automatically removed. `WeakRef` creates a weak reference to an object that doesn\'t prevent GC.' },
    {
      type: 'code', language: 'javascript', filename: 'weakmap.js',
      code: `// WeakMap â cache that doesn’t prevent GC
const cache = new WeakMap();

function getMetadata(element) {
  if (cache.has(element)) return cache.get(element);
  const meta = computeExpensiveMetadata(element);
  cache.set(element, meta);
  return meta;
}
// When element is removed from DOM and dereferenced,
// its cache entry is automatically cleaned up

// WeakRef â hold a reference that doesn’t prevent GC
class ImageCache {
  #cache = new Map();

  get(url) {
    const ref = this.#cache.get(url);
    if (!ref) return null;
    const img = ref.deref(); // Returns object or undefined
    if (!img) {
      this.#cache.delete(url); // Clean up dead ref
      return null;
    }
    return img;
  }

  set(url, img) {
    this.#cache.set(url, new WeakRef(img));
  }
}

// FinalizationRegistry â run cleanup when object is GC’d
const registry = new FinalizationRegistry((url) => {
  console.log(\`Image for \${url} was garbage collected\`);
});

function cacheImage(url, img) {
  registry.register(img, url); // Clean up when img is GC’d
}`,
    },

    { type: 'heading', level: 2, text: 'DOM Performance', id: 'dom-performance' },
    {
      type: 'code', language: 'javascript', filename: 'dom-perf.js',
      code: `// ❌ Layout thrashing — reading and writing in alternation
function bad() {
  for (const el of elements) {
    const height = el.offsetHeight; // READ — forces layout
    el.style.height = height * 2 + 'px'; // WRITE — invalidates layout
    // Next read forces a new layout calculation!
  }
}

// ✅ Batch reads, then batch writes
function good() {
  const heights = elements.map(el => el.offsetHeight); // All reads
  elements.forEach((el, i) => {
    el.style.height = heights[i] * 2 + 'px'; // All writes
  });
}

// ✅ Use DocumentFragment for batch insertions
function addManyItems(items) {
  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li);
  });
  list.appendChild(fragment); // Single DOM operation
}

// ✅ Use requestAnimationFrame for visual updates
function smoothUpdate() {
  requestAnimationFrame(() => {
    element.style.transform = \`translateX(\${pos}px)\`;
  });
}`,
    },

    { type: 'heading', level: 2, text: 'Event Handling Optimization', id: 'event-optimization' },
    {
      type: 'code', language: 'javascript', filename: 'events-perf.js',
      code: `// ❌ Individual listeners on 1000 items
items.forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ Event delegation — one listener on parent
container.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item) handleClick(item);
});

// ✅ Passive event listeners for scroll performance
window.addEventListener('scroll', handleScroll, { passive: true });
// Tells the browser the handler won’t call preventDefault(),
// so it can scroll immediately without waiting

// ✅ Debounce resize/scroll handlers
const handleResize = debounce(() => {
  recalculateLayout();
}, 150);
window.addEventListener('resize', handleResize);`,
    },

    { type: 'heading', level: 2, text: 'V8 Engine Optimizations', id: 'v8-optimizations' },
    { type: 'paragraph', text: 'V8 (Chrome/Node.js) uses hidden classes and inline caches to optimize property access. Writing "monomorphic" code helps the engine optimize.' },
    {
      type: 'code', language: 'javascript', filename: 'v8-tips.js',
      code: `// ✅ Consistent object shapes (hidden classes)
// Good: all objects have same properties in same order
function createUser(name, age) {
  return { name, age }; // Same "shape" every time
}

// Bad: conditional properties create different shapes
function createUserBad(name, age, isAdmin) {
  const user = { name };
  if (isAdmin) user.role = 'admin'; // Different shape!
  user.age = age;
  return user;
}

// ✅ Avoid delete — it changes the hidden class
const obj = { a: 1, b: 2 };
delete obj.a; // Slow! Changes hidden class
// Better: obj.a = undefined;

// ✅ Use typed arrays for number-heavy work
const floats = new Float64Array(1000);
// Much faster than regular arrays for math operations

// ✅ Avoid megamorphic call sites
function process(item) {
  return item.getValue(); // If called with many different types, V8 can’t optimize
}`,
    },

    { type: 'heading', level: 2, text: 'Lazy Loading & Code Splitting', id: 'lazy-loading' },
    {
      type: 'code', language: 'javascript', filename: 'lazy.js',
      code: `// Dynamic import — load modules on demand
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return new Chart(canvas, config);
};

// Intersection Observer for lazy images
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Load actual image
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});

// React lazy loading
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));`,
    },

    { type: 'heading', level: 2, text: 'Profiling with DevTools', id: 'profiling' },
    {
      type: 'list',
      items: [
        'Performance tab: Record and analyze CPU usage, rendering, and scripting time',
        'Memory tab: Take heap snapshots to find retained objects and memory growth',
        'Allocation timeline: See when and where objects are allocated',
        'Performance.mark/measure: Add custom timing markers to your code',
        'Lighthouse: Automated performance auditing with actionable suggestions',
        'Coverage tab: Find unused CSS and JavaScript code',
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'profiling.js',
      code: `// Custom performance markers
performance.mark('start-process');
processData();
performance.mark('end-process');

performance.measure('Data Processing', 'start-process', 'end-process');

const [measure] = performance.getEntriesByName('Data Processing');
console.log(\`Processing took \${measure.duration.toFixed(2)}ms\`);

// Memory usage (Chrome only)
if (performance.memory) {
  console.log(\`Heap: \${(performance.memory.usedJSHeapSize / 1e6).toFixed(1)}MB\`);
}

// Quick timing utility
const time = (label, fn) => {
  console.time(label);
  const result = fn();
  console.timeEnd(label);
  return result;
};

time('sort', () => array.sort());`,
    },

    { type: 'heading', level: 2, text: 'Performance Checklist', id: 'checklist' },
    {
      type: 'list',
      items: [
        'Debounce/throttle expensive event handlers (resize, scroll, input)',
        'Use event delegation instead of individual listeners',
        'Batch DOM reads and writes separately to avoid layout thrashing',
        'Use DocumentFragment for batch DOM insertions',
        'Use requestAnimationFrame for visual updates',
        'Lazy-load images, videos, and heavy modules',
        'Use passive event listeners for scroll/touch handlers',
        'Avoid creating objects in hot loops — reuse when possible',
        'Use Map/Set for frequent lookups instead of arrays',
        'Profile before optimizing — measure, don\'t guess',
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Premature optimization
// Don’t optimize until you’ve measured a real bottleneck

// ❌ String concatenation in a loop
let html = '';
for (const item of items) {
  html += \`<li>\${item}</li>\`; // Creates new string each time
}
// ✅ Use array + join, or template literals with map
const html2 = items.map(item => \`<li>\${item}</li>\`).join('');

// ❌ Synchronous large dataset processing
const sorted = hugeArray.sort(); // Blocks main thread
// ✅ Use Web Workers or chunk processing

// ❌ Not cleaning up in React useEffect
useEffect(() => {
  const handler = () => updateSize();
  window.addEventListener('resize', handler);
  // return () => window.removeEventListener('resize', handler); // Missing!
}, []);`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'How does garbage collection work in JavaScript?',
        'Name five common memory leak patterns and how to fix them.',
        'What is the difference between WeakMap and Map?',
        'How would you diagnose a memory leak using DevTools?',
        'What is layout thrashing and how do you avoid it?',
        'When would you use a Web Worker instead of async/await?',
        'What are hidden classes in V8 and why do they matter?',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Golden Rule', text: 'Don\'t optimize prematurely. Use browser DevTools (Performance tab, Memory tab) to identify real bottlenecks before making code more complex. The biggest wins usually come from algorithmic improvements, not micro-optimizations.' },
  ],
};
