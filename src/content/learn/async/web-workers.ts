import type { LessonContent } from '@/types/content';

export const webWorkersLesson: LessonContent = {
  id: 'web-workers-001',
  title: 'Web Workers: Multithreading in JavaScript',
  description: 'Master Web Workers to run JavaScript code in background threads, offloading heavy computations and keeping your UI responsive.',
  slug: 'learn/async/web-workers',
  pillar: 'learn',
  category: 'async',
  tags: ['web-workers', 'multithreading', 'background-threads', 'performance', 'async'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn how to use Web Workers to run CPU-intensive tasks in background threads. Understand message passing, shared memory, and practical performance improvements.',
  relatedTopics: ['async-await', 'promises', 'event-loop'],
  order: 6,
  updatedAt: '2024-01-15T12:30:00Z',
  readingTime: 22,
  featured: false,
  keywords: ['Web Workers', 'multithreading', 'background thread', 'message passing', 'SharedArrayBuffer', 'worker pool', 'performance'],
  prerequisites: ['async-await', 'promises', 'event-listeners'],
  learningGoals: [
    'Understand what Web Workers are and when to use them',
    'Create and communicate with Web Workers',
    'Master message passing between main and worker threads',
    'Learn about SharedArrayBuffer for shared memory',
    'Implement worker pools for parallel processing',
    'Optimize long-running computations with workers'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'What are Web Workers?',
      id: 'what-are-web-workers'
    },
    {
      type: 'paragraph',
      text: 'Web Workers allow you to run JavaScript code in background threads separate from the main thread. This prevents long-running computations from blocking the UI, keeping your application responsive. Each worker runs in its own global scope and cannot directly access the DOM.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Creating a Web Worker
const worker = new Worker('worker.js');

// Sending data to worker
worker.postMessage({ data: 'Hello from main thread' });

// Receiving data from worker
worker.onmessage = (event) => {
  console.log('Received from worker:', event.data);
};

// Handling errors
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
};

// Terminating the worker
worker.terminate();

// Worker script (worker.js)
// Receives message from main thread
self.onmessage = (event) => {
  const data = event.data;
  console.log('Received in worker:', data);

  // Do some computation
  const result = data.data.toUpperCase();

  // Send result back to main thread
  self.postMessage({ result });
};`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Main Thread vs Worker Thread',
      id: 'main-vs-worker-thread'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Main Thread (blocks during long operations)
function heavyComputation() {
  // This blocks the main thread
  let sum = 0;
  for (let i = 0; i < 1000000000; i++) {
    sum += i;
  }
  return sum;
}

// Call blocks UI until complete
const result = heavyComputation(); // UI freezes!

// With Web Worker (non-blocking)
// main.js
const worker = new Worker('heavy-worker.js');

worker.postMessage({ n: 1000000000 });

worker.onmessage = (event) => {
  console.log('Computation done:', event.data);
  // UI remains responsive while worker computes
};

// heavy-worker.js
self.onmessage = (event) => {
  const n = event.data.n;
  let sum = 0;
  
  // Heavy computation doesn't block UI
  for (let i = 0; i < n; i++) {
    sum += i;
  }

  self.postMessage(sum);
};

// Web Worker limitations
const worker2 = new Worker('limited-worker.js');

// limited-worker.js
// ❌ Cannot access DOM
// document.getElementById('id'); // Error!

// ❌ Cannot access window directly
// console.log(window); // Error!

// ✅ Can access some globals
// console.log(navigator); // Works
// console.log(location); // Works
// setTimeout, setInterval work

// ✅ Can access other workers
// const nestedWorker = new Worker('another.js');`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Advanced Message Passing',
      id: 'advanced-message-passing'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Structured cloning for complex objects
const mainThread = () => {
  const worker = new Worker('worker.js');

  const complexData = {
    name: 'Data',
    values: new Float64Array([1, 2, 3]),
    nested: {
      arr: [1, 2, 3]
    },
    date: new Date(),
    map: new Map([['a', 1], ['b', 2]]) // Maps are cloned
  };

  // Data is deep-cloned, not shared
  worker.postMessage(complexData);

  worker.onmessage = (event) => {
    console.log('Modified data:', event.data);
    // Main thread's complexData is unchanged
  };
};

// Transferable objects (zero-copy transfer)
const transferExample = () => {
  const worker = new Worker('worker.js');

  // Create a buffer
  const buffer = new ArrayBuffer(1024);
  const view = new Uint8Array(buffer);

  // Fill with data
  for (let i = 0; i < view.length; i++) {
    view[i] = i % 256;
  }

  // Transfer buffer to worker (main thread loses access!)
  worker.postMessage({ buffer }, [buffer]);

  // buffer is now unusable in main thread
  console.log(buffer.byteLength); // 0 (transferred!)

  worker.onmessage = (event) => {
    // Receive modified buffer back
    const receivedBuffer = event.data.buffer;
    console.log(receivedBuffer.byteLength); // 1024 (restored!)
  };
};

// In worker, receive and transfer back
const workerScript = () => {
  self.onmessage = (event) => {
    const buffer = event.data.buffer;
    const view = new Uint8Array(buffer);

    // Modify data
    for (let i = 0; i < view.length; i++) {
      view[i] = (view[i] * 2) % 256;
    }

    // Transfer back (worker loses access)
    self.postMessage({ buffer }, [buffer]);
  };
};

// Progress reporting with messages
const mainProgress = () => {
  const worker = new Worker('progress-worker.js');

  worker.postMessage({ items: 10000 });

  let lastProgress = 0;
  worker.onmessage = (event) => {
    if (event.data.type === 'progress') {
      lastProgress = event.data.percent;
      updateProgressBar(lastProgress);
    } else if (event.data.type === 'complete') {
      console.log('Done:', event.data.result);
    }
  };
};

// In worker: send progress updates
const progressWorkerScript = () => {
  self.onmessage = (event) => {
    const items = event.data.items;
    let result = 0;

    for (let i = 0; i < items; i++) {
      result += i;

      // Send progress every 1000 items
      if ((i + 1) % 1000 === 0) {
        self.postMessage({
          type: 'progress',
          percent: ((i + 1) / items) * 100
        });
      }
    }

    // Send completion
    self.postMessage({
      type: 'complete',
      result
    });
  };
};`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Shared Array Buffer',
      id: 'shared-array-buffer'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// SharedArrayBuffer for shared memory without copying
const sharedMemoryExample = () => {
  // Create shared buffer
  const sharedBuffer = new SharedArrayBuffer(4 * Float64Array.BYTES_PER_ELEMENT);
  const sharedArray = new Float64Array(sharedBuffer);

  const worker = new Worker('shared-worker.js');

  // Send shared buffer (not copied!)
  worker.postMessage({ sharedArray: sharedBuffer });

  // Main thread can read/write
  sharedArray[0] = 10;

  setTimeout(() => {
    console.log('Value written by worker:', sharedArray[1]);
  }, 100);

  // Stop the worker when done
  worker.terminate();
};

// In worker: access shared memory
const sharedWorkerScript = () => {
  self.onmessage = (event) => {
    const sharedBuffer = event.data.sharedArray;
    const sharedArray = new Float64Array(sharedBuffer);

    // Read value written by main thread
    const value = sharedArray[0];
    console.log('Read from main:', value);

    // Write back
    sharedArray[1] = value * 2;
  };
};

// Atomic operations for thread-safe access
const atomicOperations = () => {
  const sharedBuffer = new SharedArrayBuffer(4);
  const sharedArray = new Int32Array(sharedBuffer);

  // Initialize
  Atomics.store(sharedArray, 0, 0);

  const worker = new Worker('atomic-worker.js');
  worker.postMessage({ sharedBuffer });

  // Main thread increments atomically
  Atomics.add(sharedArray, 0, 5);
  console.log('Value:', Atomics.load(sharedArray, 0)); // 5

  // Wait for worker to signal
  const timeout = 5000; // 5 seconds
  Atomics.wait(sharedArray, 0, 5, timeout);
  console.log('Worker signaled!');
};

// Worker using atomics
const atomicWorkerScript = () => {
  self.onmessage = (event) => {
    const sharedBuffer = event.data.sharedBuffer;
    const sharedArray = new Int32Array(sharedBuffer);

    // Work for a bit
    setTimeout(() => {
      // Increment atomically
      Atomics.add(sharedArray, 0, 3);

      // Signal main thread
      Atomics.notify(sharedArray, 0);
    }, 1000);
  };
};`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Worker Pools and Resource Management',
      id: 'worker-pools'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Worker pool for reusing workers
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workers = [];
    this.taskQueue = [];
    this.activeWorkers = new Set();

    // Create pool of workers
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (event) => {
        this.onWorkerComplete(worker, event);
      };
      worker.onerror = (error) => {
        console.error('Worker error:', error);
      };
      this.workers.push(worker);
    }
  }

  execute(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };

      // Find available worker
      const availableWorker = this.workers.find(
        w => !this.activeWorkers.has(w)
      );

      if (availableWorker) {
        this.runTask(availableWorker, task);
      } else {
        // Queue task if no workers available
        this.taskQueue.push(task);
      }
    });
  }

  runTask(worker, task) {
    this.activeWorkers.add(worker);
    worker.currentTask = task;
    worker.postMessage(task.data);
  }

  onWorkerComplete(worker, event) {
    const task = worker.currentTask;
    task.resolve(event.data);

    this.activeWorkers.delete(worker);

    // Process queued tasks
    if (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift();
      this.runTask(worker, nextTask);
    }
  }

  terminate() {
    this.workers.forEach(w => w.terminate());
    this.workers = [];
    this.taskQueue = [];
  }
}

// Using the worker pool
async function useWorkerPool() {
  const pool = new WorkerPool('compute-worker.js', 4);

  // Execute many tasks
  const tasks = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    n: 1000000 + i * 100000
  }));

  try {
    const results = await Promise.all(
      tasks.map(task => pool.execute(task))
    );

    console.log('All tasks completed:', results);
  } finally {
    pool.terminate();
  }
}

// Compute worker
const computeWorkerScript = () => {
  self.onmessage = (event) => {
    const { id, n } = event.data;
    let sum = 0;

    for (let i = 0; i < n; i++) {
      sum += i;
    }

    self.postMessage({ id, sum });
  };
};`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Practical Examples',
      id: 'practical-examples'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Example: Image Processing',
      id: 'image-processing'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Main thread
const processImage = (imageBuffer) => {
  const worker = new Worker('image-worker.js');

  // Transfer image data to worker
  worker.postMessage({ imageBuffer }, [imageBuffer]);

  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      const processedBuffer = event.data.imageBuffer;
      worker.terminate();
      resolve(processedBuffer);
    };
  });
};

// Image worker
const imageWorkerScript = () => {
  self.onmessage = async (event) => {
    let imageBuffer = event.data.imageBuffer;
    const imageArray = new Uint8ClampedArray(imageBuffer);

    // Apply filter (grayscale)
    for (let i = 0; i < imageArray.length; i += 4) {
      const r = imageArray[i];
      const g = imageArray[i + 1];
      const b = imageArray[i + 2];

      // Calculate grayscale
      const gray = (r + g + b) / 3;

      imageArray[i] = gray;
      imageArray[i + 1] = gray;
      imageArray[i + 2] = gray;
    }

    self.postMessage({ imageBuffer }, [imageBuffer]);
  };
};`,
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
      text: 'Web Workers run JavaScript in background threads, preventing UI blocking. Use workers for CPU-intensive tasks like heavy computation, image processing, or cryptography. Communication happens through message passing (data is cloned by default). SharedArrayBuffer enables shared memory for high-performance scenarios. Transferable objects move data without copying for better performance. Worker pools manage multiple workers efficiently.'
    }
  ],
  exercises: [
    'Create a Web Worker for calculating Fibonacci numbers',
    'Implement a worker pool for processing batches of tasks',
    'Build an image processor using Web Workers',
    'Compare performance: main thread vs worker thread computation',
    'Implement progress reporting from a worker to main thread',
    'Use SharedArrayBuffer for real-time data sharing between threads'
  ]
};
