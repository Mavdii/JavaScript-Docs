import type { LessonContent } from '@/types/content';

export const garbageCollectionLesson: LessonContent = {
  id: 'garbage-collection-001',
  title: 'Understanding JavaScript Garbage Collection',
  description: 'Deep dive into how JavaScript engines collect garbage, various GC algorithms, and optimizing code for efficient memory management.',
  slug: 'learn/advanced/garbage-collection',
  pillar: 'learn',
  category: 'advanced',
  tags: ['garbage-collection', 'memory-management', 'performance', 'optimization', 'gc-algorithms'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn how JavaScript engines manage memory with garbage collection. Understand Mark-and-Sweep, Generational GC, and write code that minimizes GC pauses.',
  relatedTopics: ['memory-leaks', 'performance', 'debugging'],
  order: 10,
  updatedAt: '2024-01-15T12:15:00Z',
  readingTime: 25,
  featured: false,
  keywords: ['garbage collection', 'mark-and-sweep', 'generational', 'young generation', 'old generation', 'GC pause', 'heap'],
  prerequisites: ['memory-leaks', 'objects', 'references'],
  learningGoals: [
    'Understand how JavaScript garbage collection works',
    'Learn the Mark-and-Sweep algorithm',
    'Master generational garbage collection concepts',
    'Understand GC pauses and their impact',
    'Write code that cooperates with garbage collectors',
    'Optimize applications for minimal GC pressure'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'How Garbage Collection Works',
      id: 'how-gc-works'
    },
    {
      type: 'paragraph',
      text: 'Garbage collection (GC) is the automatic process of reclaiming memory occupied by objects that are no longer in use. Unlike languages like C++ where you manually manage memory, JavaScript automatically frees memory when objects are no longer reachable from the root (global scope).'
    },
    {
      type: 'paragraph',
      text: 'Modern JavaScript engines use sophisticated algorithms to manage memory efficiently. Understanding these mechanisms helps you write code that plays nicely with the garbage collector and avoids performance issues.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Reachability and Root Objects',
      id: 'reachability-and-roots'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Understanding reachability
let user = { name: 'Alice' };
let admin = user;

// Two references to the same object
// Object is still reachable through 'user' and 'admin'

user = null;
// Object still reachable through 'admin'

admin = null;
// Object is now unreachable - eligible for garbage collection

// Root references (always kept alive)
let globalData = new Array(1000000);

function processData() {
  let localData = new Array(1000000); // Local scope
  return localData.length; // Alive during function execution
}

// Closures capture variables
const createClosure = (() => {
  const capturedData = new Array(1000000);
  return () => {
    console.log(capturedData.length);
    // capturedData kept alive as long as function exists
  };
})();

// Event listeners create references
const element = document.querySelector('#button');
element.addEventListener('click', function handler() {
  // This callback keeps all its closure variables alive
});

// Memory chains
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

let head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);

// All nodes reachable from 'head'
// If head = null, all nodes can be garbage collected
head = null;`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Mark-and-Sweep Algorithm',
      id: 'mark-and-sweep'
    },
    {
      type: 'paragraph',
      text: 'Mark-and-Sweep is the fundamental algorithm used by modern JavaScript engines. It has two phases: marking reachable objects and sweeping away unreachable ones.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Conceptual Mark-and-Sweep process

// MARK PHASE: Start from roots, mark all reachable objects
function markPhase(roots) {
  const marked = new Set();
  const queue = [...roots];

  while (queue.length > 0) {
    const obj = queue.shift();
    if (marked.has(obj)) continue;

    marked.add(obj);

    // Add all referenced objects to queue
    for (const ref of obj.references || []) {
      if (!marked.has(ref)) {
        queue.push(ref);
      }
    }
  }

  return marked;
}

// SWEEP PHASE: Free memory of unmarked objects
function sweepPhase(objects, marked) {
  const survivors = [];

  for (const obj of objects) {
    if (marked.has(obj)) {
      survivors.push(obj);
    } else {
      // Memory is freed
    }
  }

  return survivors;
}

// Real example
let globalUser = { name: 'Alice', address: { city: 'NYC' } };

// During Mark phase: globalUser and address are marked as reachable
// During Sweep phase: unreferenced objects freed

globalUser = null;
// Next GC cycle: globalUser and address freed;`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Generational Garbage Collection',
      id: 'generational-gc'
    },
    {
      type: 'paragraph',
      text: 'Most modern engines use generational garbage collection: young objects die faster than old objects. Objects are split into generations with different collection frequencies.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Understanding generational collection

// Young Generation (collected frequently)
// Objects here are small and usually die quickly
function createTemporaryObjects() {
  for (let i = 0; i < 1000; i++) {
    const temp = { value: Math.random() };
    // Objects created and immediately discarded
    // Young generation optimized for this pattern
  }
}

// Old Generation (collected infrequently)
// Objects that survive multiple young collections are promoted
let longLivedObject = { 
  data: new Array(1000),
  createdAt: Date.now()
};

// Practical implications
class CacheManager {
  constructor() {
    this.cache = new Map(); // Lives in old generation
  }

  add(key, value) {
    // References stored in old generation cache
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear(); // Allows young objects to be collected
  }
}

// GC-friendly: reuse objects
class ObjectPool {
  constructor() {
    this.available = [];
    this.inUse = new Set();
  }

  acquire() {
    // Reusing objects keeps them in old generation
    // Reduces young generation pressure
    return this.available.pop() || new Object();
  }

  release(obj) {
    this.available.push(obj);
  }
}

// Generational collection phases
// 1. Scavenger (Young Generation):
//    - Runs frequently (milliseconds)
//    - Collects young space, promotes survivors to old space
//    - Very fast, 1-3 ms pause time
//
// 2. Full Mark-Sweep-Compact (Old Generation):
//    - Runs infrequently (seconds)
//    - Can cause noticeable pauses (50-200+ ms)
//    - More expensive algorithm;`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'GC Pause Times and Performance',
      id: 'gc-pause-times'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// GC pause times impact real-time applications
// A "pause" is when the engine stops executing to run GC

class RealTimeApplication {
  constructor() {
    this.frameTime = 16.67; // 60 FPS target (milliseconds per frame)
  }

  animate() {
    const startTime = performance.now();

    this.update();
    this.render();

    const frameTime = performance.now() - startTime;

    // If GC happens, frame time exceeds budget
    console.log(\`Frame took \${frameTime.toFixed(2)}ms (target: \${this.frameTime}ms)\`);

    if (frameTime > this.frameTime) {
      console.log('Jank detected!'); // Visible frame drop
    }
  }

  update() {}
  render() {}
}

// Monitoring GC pauses
class GCMonitor {
  constructor() {
    this.gcEvents = [];
  }

  recordGCPause(duration, type = 'scavenge') {
    this.gcEvents.push({
      duration,
      type,
      timestamp: Date.now()
    });

    if (type === 'major' && duration > 100) {
      console.warn(\`Long GC pause: \${duration}ms\`);
    }
  }

  getAveragePause() {
    if (this.gcEvents.length === 0) return 0;
    const totalPause = this.gcEvents.reduce((sum, e) => sum + e.duration, 0);
    return totalPause / this.gcEvents.length;
  }

  getMajorCollections() {
    return this.gcEvents.filter(e => e.type === 'major').length;
  }
}

// Reducing GC pressure
class GCOptimizedApp {
  constructor() {
    // Pre-allocate arrays instead of growing them
    this.buffer = new Array(1000);
    this.bufferIndex = 0;
  }

  // Avoid creating objects in hot loops
  badApproach() {
    for (let i = 0; i < 1000; i++) {
      const point = { x: Math.random(), y: Math.random() }; // 1000 allocations
    }
  }

  // Better: reuse objects
  goodApproach() {
    const point = { x: 0, y: 0 };
    for (let i = 0; i < 1000; i++) {
      point.x = Math.random();
      point.y = Math.random();
    }
  }

  // Avoid creating temporary strings
  stringBad() {
    let result = '';
    for (let i = 0; i < 1000; i++) {
      result += i.toString(); // Creates new string each iteration
    }
    return result;
  }

  // Better: batch string operations
  stringGood() {
    const parts = [];
    for (let i = 0; i < 1000; i++) {
      parts.push(i.toString());
    }
    return parts.join('');
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'GC-Efficient Code Patterns',
      id: 'efficient-patterns'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Pattern 1: Object pooling
class PointPool {
  constructor(size = 100) {
    this.available = [];
    for (let i = 0; i < size; i++) {
      this.available.push({ x: 0, y: 0 });
    }
  }

  acquire(x, y) {
    const point = this.available.pop() || { x: 0, y: 0 };
    point.x = x;
    point.y = y;
    return point;
  }

  release(point) {
    this.available.push(point);
  }
}

// Pattern 2: Array pre-allocation
class EfficientArray {
  constructor(size) {
    this.array = new Array(size); // Pre-allocate
    this.length = 0;
  }

  push(item) {
    if (this.length < this.array.length) {
      this.array[this.length++] = item;
    }
  }

  clear() {
    this.length = 0; // Reuse, don't deallocate
  }
}

// Pattern 3: Avoid temporary arrays
function processDataInefficient(items) {
  // Creates intermediate arrays
  return items
    .map(x => x * 2)
    .filter(x => x > 10)
    .reduce((sum, x) => sum + x, 0);
}

function processDataEfficient(items) {
  // Single pass, no temporary arrays
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    const doubled = items[i] * 2;
    if (doubled > 10) {
      sum += doubled;
    }
  }
  return sum;
}

// Pattern 4: Batch operations
class BatchProcessor {
  constructor(batchSize = 100) {
    this.batch = [];
    this.batchSize = batchSize;
  }

  add(item) {
    this.batch.push(item);

    if (this.batch.length >= this.batchSize) {
      this.processBatch();
    }
  }

  processBatch() {
    // Process all items, then clear
    this.batch = []; // Young objects freed
  }
}

// Pattern 5: Explicit cleanup
class ManagedResource {
  constructor() {
    this.largeBuffer = new Array(1000000);
    this.listeners = [];
  }

  dispose() {
    // Explicitly release references
    this.largeBuffer = null;

    for (const listener of this.listeners) {
      listener.remove();
    }
    this.listeners = [];
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Detecting and Analyzing GC',
      id: 'detecting-gc'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Using performance API to detect GC impact
class GCDetector {
  constructor() {
    this.lastEntryCount = 0;
  }

  checkForGC() {
    const entries = performance.getEntriesByType('measure');
    const currentCount = entries.length;

    // If entry count jumped, GC likely happened
    if (currentCount > this.lastEntryCount + 10) {
      console.log('GC likely occurred');
    }

    this.lastEntryCount = currentCount;
  }
}

// Measuring heap size
class HeapMonitor {
  constructor() {
    this.measurements = [];
  }

  recordHeapSize() {
    if (performance.memory) {
      const heap = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };

      this.measurements.push(heap);
      return heap;
    }
    return null;
  }

  getGrowthRate() {
    if (this.measurements.length < 2) return 0;

    const first = this.measurements[0];
    const last = this.measurements[this.measurements.length - 1];

    const timeDiff = last.timestamp - first.timestamp;
    const heapDiff = last.usedJSHeapSize - first.usedJSHeapSize;

    return heapDiff / timeDiff; // bytes per millisecond
  }

  analyzeHeap() {
    const m = this.measurements[0];
    const usedPercent = (m.usedJSHeapSize / m.jsHeapSizeLimit * 100).toFixed(2);
    
    console.log(\`Heap usage: \${usedPercent}%\`);
    console.log(\`Growth: \${(this.getGrowthRate() * 1000).toFixed(2)} bytes/sec\`);
  }
}

// Best practices for heap snapshots
// 1. In Chrome DevTools: Memory > Take heap snapshot
// 2. Compare multiple snapshots over time
// 3. Look for objects that shouldn't be in memory
// 4. Check for detached DOM nodes
// 5. Verify event listeners are cleaned up
// 6. Monitor heap growth in long-running apps;`,
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
      text: 'Garbage collection automatically manages memory based on reachability. Mark-and-Sweep marks live objects and sweeps dead ones. Generational GC optimizes for the fact that young objects die faster. GC pauses can cause performance issues; minimize object allocation in hot paths. Use object pooling, pre-allocate arrays, and batch operations. Monitor heap size and GC impact. Write code that cooperates with the garbage collector.'
    }
  ],
  exercises: [
    'Monitor heap growth in a long-running application',
    'Implement an object pool to reduce GC pressure',
    'Compare performance of different allocation patterns',
    'Use Chrome DevTools to analyze GC pauses',
    'Refactor code to minimize temporary object creation',
    'Build a memory profiler tracking allocation patterns'
  ]
};
