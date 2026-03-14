import type { LessonContent } from '@/types/content';

export const microMacroTasksLesson: LessonContent = {
  id: 'micro-macro-tasks-001',
  title: 'Understanding Microtasks and Macrotasks',
  description: 'Master the event loop, microtasks, and macrotasks to understand JavaScript execution order and optimize async code.',
  slug: 'learn/async/micro-macro-tasks',
  pillar: 'learn',
  category: 'async',
  tags: ['event-loop', 'microtasks', 'macrotasks', 'promises', 'async', 'execution-order'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn the distinction between microtasks and macrotasks, how the event loop processes them, and how this affects code execution order.',
  relatedTopics: ['event-loop', 'promises', 'async-await'],
  order: 8,
  updatedAt: '2024-01-15T13:00:00Z',
  readingTime: 20,
  featured: false,
  keywords: ['microtasks', 'macrotasks', 'event loop', 'task queue', 'promises', 'setTimeout', 'execution order'],
  prerequisites: ['promises', 'async-await', 'event-listeners'],
  learningGoals: [
    'Understand the JavaScript event loop architecture',
    'Learn the difference between microtasks and macrotasks',
    'Master execution order of async operations',
    'Predict code execution timing accurately',
    'Optimize performance by understanding task scheduling',
    'Debug timing-related issues'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'The JavaScript Event Loop',
      id: 'javascript-event-loop'
    },
    {
      type: 'paragraph',
      text: 'The JavaScript event loop is the core mechanism that allows asynchronous code to work. It continuously checks for tasks to execute, prioritizing microtasks over macrotasks. Understanding this hierarchy is crucial for predicting code execution order.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Event loop visualization
/*
┌─────────────────────────────────────────────────┐
│           JavaScript Engine                      │
│  ┌──────────────┐      ┌──────────────┐         │
│  │ Call Stack   │      │ Heap         │         │
│  └──────────────┘      └──────────────┘         │
└─────────────────────────────────────────────────┘
           │                    │
           ↓                    ↓
┌──────────────────────────────────────────────────┐
│              Browser/Runtime                     │
│  ┌────────────────┐  ┌──────────────────┐       │
│  │ Microtask Q    │  │ Macrotask Q      │       │
│  │ - Promises     │  │ - setTimeout     │       │
│  │ - MutationObs  │  │ - setInterval    │       │
│  │ - queueMicro   │  │ - I/O           │       │
│  └────────────────┘  └──────────────────┘       │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Event Loop                               │  │
│  │ 1. Execute synchronous code (call stack) │  │
│  │ 2. Process ALL microtasks               │  │
│  │ 3. Render (if needed)                   │  │
│  │ 4. Execute ONE macrotask                │  │
│  │ 5. Repeat from step 2                   │  │
│  └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
*/

// Simple event loop example
console.log('1. Synchronous');

setTimeout(() => {
  console.log('2. Macrotask');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask');
});

console.log('4. Synchronous');

// Output:
// 1. Synchronous
// 4. Synchronous
// 3. Microtask
// 2. Macrotask`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Microtasks vs Macrotasks',
      id: 'microtasks-vs-macrotasks'
    },
    {
      type: 'table',
      headers: ['Microtasks', 'Macrotasks'],
      rows: [
        ['Promises (then, catch, finally)', 'setTimeout'],
        ['async/await', 'setInterval'],
        ['MutationObserver', 'setImmediate (Node.js)'],
        ['queueMicrotask()', 'I/O operations'],
        ['Process.nextTick (Node.js)', 'UI events (click, scroll)'],
        ['', 'requestAnimationFrame (in some specs)'],
        ['Executed after each macrotask', 'One per event loop iteration']
      ]
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Microtask vs Macrotask examples

// MICROTASKS
// 1. Promises
Promise.resolve().then(() => {
  console.log('Microtask: Promise');
});

// 2. async/await
async function asyncExample() {
  console.log('Microtask: async');
}
asyncExample();

// 3. MutationObserver
const observer = new MutationObserver(() => {
  console.log('Microtask: MutationObserver');
});

const element = document.createElement('div');
observer.observe(element, { attributes: true });
element.setAttribute('data-test', 'value'); // Triggers observer

// 4. queueMicrotask
queueMicrotask(() => {
  console.log('Microtask: queueMicrotask');
});


// MACROTASKS
// 1. setTimeout
setTimeout(() => {
  console.log('Macrotask: setTimeout');
}, 0);

// 2. setInterval
let intervalCount = 0;
const intervalId = setInterval(() => {
  intervalCount++;
  console.log('Macrotask: setInterval');
  if (intervalCount >= 1) clearInterval(intervalId);
}, 0);

// 3. setImmediate (Node.js only)
if (typeof setImmediate !== 'undefined') {
  setImmediate(() => {
    console.log('Macrotask: setImmediate');
  });
}

// 4. I/O operations
const fs = require('fs');
fs.readFile('file.txt', () => {
  console.log('Macrotask: I/O');
});

// 5. UI events
document.addEventListener('click', () => {
  console.log('Macrotask: UI event');
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Execution Order Deep Dive',
      id: 'execution-order-deep-dive'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Complex execution order example
console.log('Start');

// Macrotask
setTimeout(() => {
  console.log('setTimeout 1');
  
  // Microtask inside macrotask
  Promise.resolve().then(() => {
    console.log('Promise inside setTimeout');
  });
}, 0);

// Microtask
Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    
    // Nested microtask
    return Promise.resolve().then(() => {
      console.log('Promise 2');
    });
  })
  .then(() => {
    console.log('Promise 3');
  });

// Synchronous
console.log('End');

// Execution trace:
// 1. Start (synchronous)
// 2. End (synchronous)
// 3. Promise 1 (microtask)
// 4. Promise 2 (nested microtask)
// 5. Promise 3 (microtask chain)
// 6. setTimeout 1 (macrotask)
// 7. Promise inside setTimeout (microtask after macrotask)

// More complex example with mixed tasks
console.log('A');

setTimeout(() => {
  console.log('B');
  Promise.resolve().then(() => console.log('C'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('D');
    setTimeout(() => console.log('E'), 0);
  })
  .then(() => {
    console.log('F');
  });

console.log('G');

// Output:
// A, G (sync)
// D (microtask)
// F (microtask chain)
// B (macrotask 1)
// C (microtask after B)
// E (macrotask 2, scheduled in D)`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Practical Implications',
      id: 'practical-implications'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Implication 1: Promise timing
function delayedLog(message, delay) {
  // setTimeout is a macrotask
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(message);
      resolve();
    }, delay);
  });
}

async function example1() {
  console.log('Start');
  
  // These execute in parallel (not sequential waits)
  await delayedLog('First', 100);  // Macrotask
  await delayedLog('Second', 100); // Macrotask
  
  console.log('Done');
  
  // Output:
  // Start
  // (100ms pause)
  // First
  // (100ms pause)
  // Second
  // Done
}

// Implication 2: React batching (React uses microtasks)
// React batches state updates by using microtasks
function ButtonClick() {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    // These state updates might be batched
    setCount(count + 1); // Microtask
    setCount(count + 1); // Microtask
    
    // Both might execute in same render
    // Because they're in the same macrotask (click event)
  };

  return <button onClick={handleClick}>{count}</button>;
}

// Implication 3: Forcing rendering with macrotasks
function forcingRender() {
  const element = document.getElementById('box');
  
  // Change 1: Happens in DOM
  element.style.background = 'blue';
  
  // This is still a microtask, won't force render
  Promise.resolve().then(() => {
    element.style.transform = 'translateX(100px)';
  });
  
  // This is a macrotask, WILL force render between the two
  setTimeout(() => {
    element.style.background = 'red';
  }, 0);
  
  // Result: You'll see blue->red animation
}

// Implication 4: Performance - minimize layout thrashing
function badApproach() {
  // This causes multiple layouts (thrashing)
  const box = document.getElementById('box');
  
  for (let i = 0; i < 100; i++) {
    // Each read forces layout calculation
    const height = box.offsetHeight; // Macrotask boundary
    box.style.height = (height + 1) + 'px';
  }
}

function goodApproach() {
  // Batch reads and writes separately
  const box = document.getElementById('box');
  
  // Read phase
  let height = box.offsetHeight;
  
  // Write phase (no layout recalculation between)
  for (let i = 0; i < 100; i++) {
    height += 1;
  }
  
  box.style.height = height + 'px';
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Node.js Event Loop',
      id: 'nodejs-event-loop'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Node.js has additional phases
// Timers → Pending Callbacks → Idle → Poll → Check → Close

console.log('Start');

// Timer phase
setTimeout(() => {
  console.log('setTimeout');
}, 0);

// Check phase (setImmediate runs after I/O)
setImmediate(() => {
  console.log('setImmediate');
});

// Process.nextTick (before all other phases)
process.nextTick(() => {
  console.log('nextTick');
});

// Microtask
Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');

// Output order in Node.js:
// Start
// End
// nextTick (before anything else)
// Promise (microtasks)
// setTimeout (timers)
// setImmediate (check phase)

// Practical example: proper cleanup
class Service {
  constructor() {
    this.timer = null;
    this.immediate = null;
  }

  start() {
    this.timer = setTimeout(() => {
      this.doWork();
    }, 1000);

    this.immediate = setImmediate(() => {
      this.doWork();
    });
  }

  stop() {
    clearTimeout(this.timer);
    clearImmediate(this.immediate);
  }

  doWork() {
    console.log('Working...');
  }
}

// Usage
const service = new Service();
service.start();

// Later, stop the service
setTimeout(() => {
  service.stop();
}, 500);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Debugging Execution Order',
      id: 'debugging-execution-order'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Helper to trace execution order
class ExecutionTracer {
  constructor() {
    this.trace = [];
    this.startTime = Date.now();
  }

  log(label) {
    const timestamp = Date.now() - this.startTime;
    const stackTrace = new Error().stack.split('\\n')[2];
    
    this.trace.push({
      label,
      timestamp,
      type: this.getTaskType(),
      stack: stackTrace
    });

    console.log(\`[+\${timestamp}ms] \${label}\`);
  }

  getTaskType() {
    // Simple heuristic: check if in microtask vs macrotask
    const stack = new Error().stack;
    if (stack.includes('Promise')) return 'microtask';
    if (stack.includes('setTimeout')) return 'macrotask';
    return 'sync';
  }

  report() {
    console.table(this.trace);
  }
}

// Using the tracer
const tracer = new ExecutionTracer();

tracer.log('Start');

setTimeout(() => {
  tracer.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  tracer.log('Promise');
});

tracer.log('End');

setTimeout(() => {
  tracer.report();
}, 100);

// Understanding queueMicrotask for optimization
function batchUpdates(updates) {
  const results = [];

  // Queue all updates as microtasks
  for (const update of updates) {
    queueMicrotask(() => {
      results.push(update());
    });
  }

  // All microtasks complete before next macrotask
  return new Promise((resolve) => {
    queueMicrotask(() => {
      resolve(results);
    });
  });
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
      text: 'Event loop executes synchronous code first, then ALL microtasks, then ONE macrotask, then renders if needed. Microtasks (Promises, async/await, queueMicrotask) execute before macrotasks (setTimeout, setInterval). Execution order: sync → microtasks → macrotask → microtasks (again) → next macrotask. Understand this to predict async behavior and optimize performance. Use process.nextTick in Node.js for immediate execution before other phases.'
    }
  ],
  exercises: [
    'Predict the output of complex async code with mixed tasks',
    'Create an execution tracer to visualize task execution order',
    'Debug timing issues by understanding microtask/macrotask boundaries',
    'Optimize code by batching operations into appropriate task queues',
    'Build a task scheduler that respects event loop phases',
    'Compare Node.js and browser event loop behavior'
  ]
};
