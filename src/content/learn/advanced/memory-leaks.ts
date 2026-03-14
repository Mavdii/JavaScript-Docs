import type { LessonContent } from '@/types/content';

export const memoryLeaksLesson: LessonContent = {
  id: 'memory-leaks-001',
  title: 'Memory Leaks in JavaScript',
  description: 'Identify and prevent memory leaks in JavaScript applications through understanding garbage collection, reference counting, and common leak patterns.',
  slug: 'learn/advanced/memory-leaks',
  pillar: 'learn',
  category: 'advanced',
  tags: ['memory', 'garbage-collection', 'performance', 'debugging', 'memory-leaks'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn how to identify, prevent, and fix memory leaks in JavaScript. Understand garbage collection mechanisms, common leak patterns, and debugging tools.',
  relatedTopics: ['garbage-collection', 'performance-optimization', 'debugging'],
  order: 7,
  updatedAt: '2024-01-15T11:30:00Z',
  readingTime: 24,
  featured: false,
  keywords: ['memory leaks', 'garbage collection', 'heap', 'references', 'detached DOM', 'event listeners', 'closures'],
  prerequisites: ['objects', 'references', 'event-listeners'],
  learningGoals: [
    'Understand how JavaScript garbage collection works',
    'Identify common sources of memory leaks',
    'Learn techniques to prevent memory leaks',
    'Use browser DevTools to detect and analyze leaks',
    'Master proper cleanup patterns in applications',
    'Optimize memory usage in long-running applications'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Understanding Garbage Collection',
      id: 'garbage-collection-basics'
    },
    {
      type: 'paragraph',
      text: 'JavaScript automatically manages memory through garbage collection. The engine periodically identifies objects that are no longer referenced and frees their memory. However, if references to unused objects persist, the garbage collector cannot free them, causing memory leaks.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Garbage collection in action
let obj = { name: 'Alice', data: new Array(1000000) };

// obj is referenced, won't be garbage collected
console.log(obj.name);

// Remove the reference
obj = null;

// Now the object is eligible for garbage collection
// The engine will free the memory on the next GC cycle

// Reference counting (simplified concept)
let a = { id: 1 };
let b = a; // Now two references to the same object
let c = a; // Three references

a = null; // Still referenced by b and c
b = null; // Still referenced by c
c = null; // No references left - eligible for GC

// Circular references (handled by modern engines)
let x = { name: 'X' };
let y = { name: 'Y' };

x.ref = y;
y.ref = x; // Circular reference

// Modern engines use mark-and-sweep, so this is collected
x = null;
y = null;`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Common Memory Leak Patterns',
      id: 'common-leak-patterns'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Leak 1: Global Variables and Accidental Globals',
      id: 'global-variables-leak'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// ❌ LEAK: Accidental global variable
function processData() {
  largeData = new Array(1000000); // Missing 'const', 'let', or 'var'
  // This creates a global variable that persists forever
}

processData();
// largeData still exists in global scope and prevents GC

// ❌ LEAK: Intentional global accumulation
window.cache = [];

function addToCache(item) {
  window.cache.push(item); // Accumulates without limit
}

// ✅ FIX: Use proper variable scope
function processDataFixed() {
  const largeData = new Array(1000000);
  // Local scope - garbage collected after function ends
}

// ✅ FIX: Use bounded cache with size limit
class BoundedCache {
  constructor(maxSize = 100) {
    this.cache = [];
    this.maxSize = maxSize;
  }

  add(item) {
    this.cache.push(item);
    if (this.cache.length > this.maxSize) {
      this.cache.shift(); // Remove oldest
    }
  }

  clear() {
    this.cache = [];
  }
}

const cache = new BoundedCache(100);`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Leak 2: Event Listeners and DOM References',
      id: 'event-listeners-leak'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// ❌ LEAK: Event listeners not removed
class Component {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000);
    
    // Add event listener without removing it
    this.element.addEventListener('click', () => {
      this.handleClick();
    });
  }

  handleClick() {
    console.log(this.data.length);
  }

  // Component is destroyed but listener remains
  destroy() {
    // This.element is not cleaned up, listener still holds reference
  }
}

// ❌ LEAK: Detached DOM nodes with references
const elements = [];

function createElements() {
  for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = 'Element ' + i;
    elements.push(div);
  }
}

createElements();
// Remove from DOM, but references in 'elements' array prevent GC

// ✅ FIX: Properly remove event listeners
class ComponentFixed {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000);
    this.handleClickBound = this.handleClick.bind(this);
    
    this.element.addEventListener('click', this.handleClickBound);
  }

  handleClick() {
    console.log(this.data.length);
  }

  destroy() {
    // Remove the listener
    this.element.removeEventListener('click', this.handleClickBound);
    // Clear references
    this.element = null;
    this.data = null;
  }
}

// ✅ FIX: Clean up DOM references
class DOMManager {
  constructor() {
    this.elements = new WeakSet(); // Use WeakSet for DOM references
  }

  createElements() {
    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div');
      div.textContent = 'Element ' + i;
      this.elements.add(div);
      document.body.appendChild(div);
    }
  }

  cleanup() {
    // WeakSet automatically releases references when elements are removed from DOM
  }
}

// ✅ FIX: Using AbortController for event listeners
class ModernComponent {
  constructor(element) {
    this.element = element;
    this.controller = new AbortController();
    
    this.element.addEventListener('click', 
      () => this.handleClick(), 
      { signal: this.controller.signal }
    );
  }

  handleClick() {
    console.log('Clicked');
  }

  destroy() {
    this.controller.abort(); // Removes all listeners registered with this signal
    this.element = null;
  }
}`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Leak 3: Closures Retaining References',
      id: 'closure-leak'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// ❌ LEAK: Closure retaining large object
function createProcessor() {
  const largeData = new Array(1000000);
  
  return function process(item) {
    // This closure captures largeData
    console.log(largeData.length, item);
  };
}

const processor = createProcessor();
// largeData is retained even if only 'item' is used

// ❌ LEAK: Observer pattern without cleanup
class DataStore {
  constructor() {
    this.data = { value: 0 };
    this.observers = [];
  }

  subscribe(callback) {
    this.observers.push(callback);
    return this; // No unsubscribe method
  }

  notify(newValue) {
    this.data.value = newValue;
    this.observers.forEach(cb => cb(newValue));
  }
}

const store = new DataStore();
const observers = [];

for (let i = 0; i < 1000; i++) {
  store.subscribe((value) => {
    observers.push(value); // Accumulating data
  });
}

// ✅ FIX: Only capture what you need
function createProcessorFixed() {
  const largeData = new Array(1000000);
  const length = largeData.length; // Extract what you need
  
  return function process(item) {
    console.log(length, item); // Only retains 'length'
  };
}

// ✅ FIX: Proper Observer with unsubscribe
class DataStoreFixed {
  constructor() {
    this.data = { value: 0 };
    this.observers = [];
  }

  subscribe(callback) {
    this.observers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  notify(newValue) {
    this.data.value = newValue;
    this.observers.forEach(cb => cb(newValue));
  }
}

const storeFixed = new DataStoreFixed();
const unsubscribers = [];

for (let i = 0; i < 1000; i++) {
  const unsubscribe = storeFixed.subscribe(() => {});
  unsubscribers.push(unsubscribe);
}

// Clean up when done
unsubscribers.forEach(fn => fn());`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Leak 4: Timers and Callbacks',
      id: 'timers-leak'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// ❌ LEAK: setInterval without clearInterval
class Updater {
  constructor() {
    this.data = new Array(1000000);
    
    this.intervalId = setInterval(() => {
      console.log(this.data.length);
    }, 1000);
  }

  destroy() {
    // Forgot to clear interval - it keeps running and holding references
  }
}

// ❌ LEAK: setTimeout in loop
function scheduleMany() {
  for (let i = 0; i < 1000; i++) {
    const largeData = new Array(1000);
    
    setTimeout(() => {
      console.log(largeData[0]); // Closure captures largeData
    }, 1000);
  }
  // All 1000 closures hold references until their timeouts complete
}

// ❌ LEAK: Promises not properly cleaned up
class DataFetcher {
  constructor() {
    this.requests = [];
  }

  fetch(url) {
    const promise = fetch(url)
      .then(r => r.json())
      .then(data => {
        this.data = data;
        // Never cleaned up
      });
    
    this.requests.push(promise);
  }

  destroy() {
    // requests array is never cleared
  }
}

// ✅ FIX: Properly clear timers
class UpdaterFixed {
  constructor() {
    this.data = new Array(1000000);
    
    this.intervalId = setInterval(() => {
      console.log(this.data.length);
    }, 1000);
  }

  destroy() {
    clearInterval(this.intervalId);
    this.data = null;
  }
}

// ✅ FIX: Limit pending operations
class DataFetcherFixed {
  constructor() {
    this.controller = new AbortController();
    this.requests = new Map();
  }

  async fetch(url) {
    try {
      const response = await fetch(url, { signal: this.controller.signal });
      this.data = await response.json();
      return this.data;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    }
  }

  destroy() {
    this.controller.abort(); // Cancels all pending requests
    this.requests.clear();
    this.data = null;
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Memory Leak Detection and Debugging',
      id: 'detection-and-debugging'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Using Chrome DevTools',
      id: 'chrome-devtools'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Code to test with Chrome DevTools Memory Profiler

// Create objects for memory profiling
function createTestObjects() {
  const objects = [];
  
  for (let i = 0; i < 10000; i++) {
    objects.push({
      id: i,
      data: new Array(100).fill('x'),
      timestamp: Date.now()
    });
  }
  
  return objects;
}

let testObjects = createTestObjects();

// Simulate memory leak
const leakedReferences = [];

function simulateLeak() {
  const batch = createTestObjects();
  leakedReferences.push(batch); // Never cleaned up
  console.log('Memory leak simulated, check heap size');
}

// Call simulateLeak multiple times
// 1. Open Chrome DevTools > Memory tab
// 2. Take a heap snapshot (baseline)
// 3. Run simulateLeak() several times
// 4. Take another heap snapshot
// 5. Compare: look for TestObject accumulation in retained objects

// Instrument code for profiling
class MemoryMonitor {
  constructor() {
    this.snapshots = [];
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  recordSnapshot(label) {
    const memory = this.getMemoryUsage();
    if (memory) {
      this.snapshots.push({
        label,
        timestamp: Date.now(),
        memory
      });
    }
  }

  reportGrowth() {
    if (this.snapshots.length < 2) return;
    
    const first = this.snapshots[0].memory;
    const last = this.snapshots[this.snapshots.length - 1].memory;
    
    const growth = last.usedJSHeapSize - first.usedJSHeapSize;
    const growthMB = (growth / 1024 / 1024).toFixed(2);
    
    console.log(\`Memory growth: \${growthMB} MB\`);
  }
}

const monitor = new MemoryMonitor();
monitor.recordSnapshot('Start');

// Run some operations
for (let i = 0; i < 10; i++) {
  simulateLeak();
}

monitor.recordSnapshot('After leaks');
monitor.reportGrowth();`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Memory Profiling Techniques',
      id: 'profiling-techniques'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Manual memory profiling
class PerformanceProfiler {
  constructor() {
    this.initialMemory = null;
    this.marks = {};
  }

  start(label) {
    if (performance.memory) {
      this.marks[label] = {
        startTime: performance.now(),
        startMemory: performance.memory.usedJSHeapSize
      };
    }
  }

  end(label) {
    if (!this.marks[label]) return;

    const mark = this.marks[label];
    const endTime = performance.now();
    const endMemory = performance.memory.usedJSHeapSize;

    const timeDiff = endTime - mark.startTime;
    const memoryDiff = endMemory - mark.startMemory;
    const memoryDiffMB = (memoryDiff / 1024 / 1024).toFixed(2);

    console.log(\`\${label}: \${timeDiff.toFixed(2)}ms, Memory: \${memoryDiffMB}MB\`);
  }
}

const profiler = new PerformanceProfiler();

// Profile a function
profiler.start('dataProcessing');

const largeArray = new Array(1000000).fill(0);
const processed = largeArray.map(x => x * 2);

profiler.end('dataProcessing');

// Weak references for tracking objects without preventing GC
const tracked = new WeakMap();

function trackObject(obj, metadata) {
  tracked.set(obj, metadata);
}

let obj = { id: 1 };
trackObject(obj, { created: Date.now() });

// When obj is garbage collected, its metadata is also removed
obj = null;

// Long-running app memory management
class LongRunningApp {
  constructor() {
    this.cache = new Map();
    this.timers = [];
  }

  async run() {
    while (true) {
      await this.processData();
      await this.cleanupResources();
    }
  }

  async processData() {
    const data = await fetch('/api/data').then(r => r.json());
    this.cache.set(Date.now(), data);
  }

  async cleanupResources() {
    // Remove old cache entries
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    for (const [time, _] of this.cache) {
      if (now - time > oneDayMs) {
        this.cache.delete(time);
      }
    }

    // Clear timers
    this.timers = this.timers.filter(id => {
      // This is simplified; you'd track timers differently
      return true;
    });

    // Force garbage collection hint (if available)
    if (global.gc) {
      global.gc();
    }
  }

  shutdown() {
    this.cache.clear();
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Best Practices for Memory Management',
      id: 'best-practices'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Best Practice 1: Cleanup patterns
class ResourceManager {
  constructor() {
    this.resources = [];
  }

  acquire(resource) {
    this.resources.push(resource);
    return resource;
  }

  releaseAll() {
    for (const resource of this.resources) {
      if (resource.dispose) {
        resource.dispose();
      }
    }
    this.resources = [];
  }
}

// Best Practice 2: Object pooling (reuse objects)
class ObjectPool {
  constructor(Factory, resetFn, size = 100) {
    this.available = [];
    this.inUse = new Set();
    
    for (let i = 0; i < size; i++) {
      this.available.push(new Factory());
    }
    
    this.resetFn = resetFn;
  }

  acquire() {
    let obj;
    if (this.available.length > 0) {
      obj = this.available.pop();
    } else {
      obj = new this.Factory();
    }
    this.inUse.add(obj);
    return obj;
  }

  release(obj) {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.resetFn(obj);
      this.available.push(obj);
    }
  }
}

// Best Practice 3: Explicit cleanup
class Component {
  constructor(container) {
    this.container = container;
    this.listeners = [];
    this.timers = [];
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }

  setTimer(callback, delay) {
    const id = setTimeout(callback, delay);
    this.timers.push(id);
    return id;
  }

  destroy() {
    // Remove all event listeners
    for (const { element, event, handler } of this.listeners) {
      element.removeEventListener(event, handler);
    }
    this.listeners = [];

    // Clear all timers
    for (const id of this.timers) {
      clearTimeout(id);
    }
    this.timers = [];

    // Clear container
    this.container = null;
  }
}

// Best Practice 4: Limit cache size
class LRUCache {
  constructor(maxSize = 100) {
    this.map = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (!this.map.has(key)) return undefined;
    
    const value = this.map.get(key);
    // Move to end (most recently used)
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    }

    this.map.set(key, value);

    if (this.map.size > this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Summary',
      id: 'summary'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Key Takeaways',
      text: 'Memory leaks occur when unused objects are retained due to persistent references. Common sources: global variables, unremovedEvent listeners, closures, timers, and DOM references. Always clean up: remove event listeners, clear timers, null out references, use WeakMap/WeakSet for metadata. Use browser DevTools to detect leaks with heap snapshots. Implement proper cleanup patterns, object pooling, and bounded caches. Monitor long-running applications for memory growth.'
    }
  ],
  exercises: [
    'Identify and fix memory leaks in an event listener heavy application',
    'Create a proper cleanup pattern for a component with multiple resources',
    'Implement a bounded cache with automatic eviction of old entries',
    'Use Chrome DevTools to detect memory leaks in a sample application',
    'Build an object pool implementation to reduce GC pressure',
    'Profile a long-running application and identify memory growth patterns'
  ]
};
