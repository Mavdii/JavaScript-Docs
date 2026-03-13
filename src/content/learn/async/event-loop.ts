import type { LessonContent } from '@/types/content';

export const eventLoopLesson: LessonContent = {
  id: 'event-loop',
  title: 'Event Loop',
  description: 'Understand the event loop, task queue, microtask queue, and how JavaScript handles concurrency.',
  slug: 'learn/async/event-loop',
  pillar: 'learn',
  category: 'async',
  tags: ['event-loop', 'async', 'microtasks', 'macrotasks'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'JavaScript is single-threaded but handles async operations via the event loop. Understanding the event loop, task queue, and microtask queue explains execution order.',
  relatedTopics: ['promises', 'callbacks'],
  order: 1,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['event loop', 'task queue', 'microtask', 'macrotask', 'setTimeout', 'Promise'],
  prerequisites: ['Functions', 'Scope'],
  learningGoals: [
    'Understand the event loop cycle',
    'Distinguish microtasks from macrotasks',
    'Predict execution order of async code',
    'Understand how rendering fits into the event loop',
    'Debug timing issues with event loop knowledge',
  ],
  exercises: [
    'Predict the output order of a snippet mixing setTimeout, Promise.resolve, and synchronous logs.',
    'Explain why a long-running synchronous operation blocks the UI.',
    'Implement a scheduler that yields to the event loop between tasks.',
    'Draw the event loop diagram for a complex async code snippet.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Single-Threaded Model', id: 'single-threaded' },
    { type: 'paragraph', text: 'JavaScript runs on a single thread — one thing at a time. Async operations (timers, network, events) are handled by the browser, and callbacks are queued for later.' },
    {
      type: 'code', language: 'javascript', filename: 'single-thread.js',
      code: `// Only one thing runs at a time
console.log('A');

// This doesn’t run "in parallel" â it schedules for later
setTimeout(() => console.log('B'), 0);

console.log('C');

// Output: A, C, B
// Even with 0ms delay, B runs AFTER all synchronous code`,
    },

    { type: 'heading', level: 2, text: 'How the Event Loop Works', id: 'how-it-works' },
    { type: 'paragraph', text: 'The event loop coordinates execution between the call stack, microtask queue, and macrotask queue. It follows a specific algorithm and runs continuously.' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Execute all synchronous code on the call stack until it\'s empty',
        'Process ALL microtasks in the microtask queue (Promise callbacks, queueMicrotask)',
        'If microtasks schedule more microtasks, process those too (drain the queue)',
        'Perform rendering if needed (requestAnimationFrame, layout, paint)',
        'Take ONE macrotask from the macrotask queue (setTimeout, setInterval, I/O)',
        'Go back to step 2',
      ],
    },

    { type: 'heading', level: 2, text: 'Execution Order Example', id: 'execution-order' },
    {
      type: 'code', language: 'javascript', filename: 'event-loop.js',
      code: `console.log('1 — sync');

setTimeout(() => console.log('2 — macrotask'), 0);

Promise.resolve().then(() => console.log('3 — microtask'));

console.log('4 — sync');

// Output:
// 1 — sync       (call stack)
// 4 — sync       (call stack)
// 3 — microtask  (microtask queue — runs before macrotasks)
// 2 — macrotask  (macrotask queue)`,
    },

    { type: 'heading', level: 2, text: 'Complex Execution Order', id: 'complex-order' },
    {
      type: 'code', language: 'javascript', filename: 'complex-order.js',
      code: `console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});

Promise.resolve().then(() => console.log('6'));

console.log('7');

// Output: 1, 7, 4, 6, 2, 3, 5
//
// Step by step:
// 1. Call stack: log('1'), log('7')
// 2. Microtasks: log('4'), then schedules setTimeout('5'), log('6')
// 3. Macrotask: log('2'), then microtask log('3') runs immediately
// 4. Macrotask: log('5')`,
    },
    { type: 'callout', variant: 'info', title: 'Key Rule', text: 'Microtasks (Promise .then, queueMicrotask) always execute before the next macrotask (setTimeout, setInterval), even if the macrotask was queued first. Microtasks can also schedule more microtasks that run in the same cycle.' },

    { type: 'heading', level: 2, text: 'Microtasks vs Macrotasks', id: 'micro-vs-macro' },
    {
      type: 'table',
      headers: ['Type', 'Examples', 'Priority', 'Processing'],
      rows: [
        ['Microtask', 'Promise.then, queueMicrotask, MutationObserver', 'High', 'ALL processed between macrotasks'],
        ['Macrotask', 'setTimeout, setInterval, I/O, UI events', 'Normal', 'ONE per event loop cycle'],
        ['Animation', 'requestAnimationFrame', 'Before paint', 'All rAF callbacks per frame'],
      ],
    },

    { type: 'heading', level: 2, text: 'queueMicrotask', id: 'queue-microtask' },
    { type: 'paragraph', text: 'queueMicrotask() explicitly schedules a microtask. It\'s useful when you need something to run after the current synchronous code but before any macrotasks or rendering.' },
    {
      type: 'code', language: 'javascript', filename: 'queue-microtask.js',
      code: `// Schedule a microtask directly
queueMicrotask(() => {
  console.log('microtask');
});
console.log('sync');
// Output: sync, microtask

// Use case: batch updates
class BatchProcessor {
  #pending = [];
  #scheduled = false;

  add(item) {
    this.#pending.push(item);
    if (!this.#scheduled) {
      this.#scheduled = true;
      queueMicrotask(() => this.#flush());
    }
  }

  #flush() {
    const batch = this.#pending.splice(0);
    this.#scheduled = false;
    console.log('Processing batch:', batch);
  }
}

const processor = new BatchProcessor();
processor.add('a');
processor.add('b');
processor.add('c');
// All three processed in a single batch after sync code`,
    },

    { type: 'heading', level: 2, text: 'Rendering & requestAnimationFrame', id: 'rendering' },
    { type: 'paragraph', text: 'The browser renders between macrotasks at ~60fps (every 16.7ms). requestAnimationFrame runs right before each paint.' },
    {
      type: 'code', language: 'javascript', filename: 'raf.js',
      code: `// requestAnimationFrame — runs before next paint
function animate() {
  element.style.left = \`\${position}px\`;
  position += 2;

  if (position < 500) {
    requestAnimationFrame(animate); // Schedule next frame
  }
}
requestAnimationFrame(animate);

// Event loop with rendering:
// [Macrotask] → [All Microtasks] → [rAF callbacks] → [Render] → repeat

// â Don’t use setTimeout for animations
setInterval(() => {
  element.style.left = \`\${pos}px\`; // May jank — not synced to frame rate
}, 16);

// ✅ Use requestAnimationFrame
function smoothAnimate(timestamp) {
  const elapsed = timestamp - startTime;
  element.style.left = \`\${elapsed * 0.1}px\`;
  if (elapsed < 5000) requestAnimationFrame(smoothAnimate);
}
requestAnimationFrame(smoothAnimate);`,
    },

    { type: 'heading', level: 2, text: 'Blocking the Event Loop', id: 'blocking' },
    { type: 'paragraph', text: 'Long sync operations block everything — no UI updates, no events, no animations. The page freezes.' },
    {
      type: 'code', language: 'javascript', filename: 'blocking.js',
      code: `// ❌ This blocks the UI for ~5 seconds!
function heavyComputation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {} // Busy loop
}

// ❌ Processing millions of items synchronously
function processAll(items) {
  items.forEach(item => expensiveWork(item)); // Blocks
}

// ✅ Solution 1: Break work into chunks
function processChunked(items, chunkSize = 100) {
  let i = 0;
  function nextChunk() {
    const end = Math.min(i + chunkSize, items.length);
    for (; i < end; i++) {
      processItem(items[i]);
    }
    if (i < items.length) {
      setTimeout(nextChunk, 0); // Yield to event loop
    }
  }
  nextChunk();
}

// ✅ Solution 2: Use scheduler API (modern)
async function processWithScheduler(items) {
  for (const item of items) {
    processItem(item);
    // Yield to let browser handle events and render
    if (navigator.scheduling?.isInputPending()) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}`,
    },

    { type: 'heading', level: 2, text: 'setTimeout Minimum Delay', id: 'settimeout-delay' },
    { type: 'paragraph', text: 'setTimeout(fn, 0) doesn\'t mean "run immediately." It means "run as soon as possible after the current execution and all microtasks." Browsers also enforce a minimum delay of ~4ms for nested setTimeout calls.' },
    {
      type: 'code', language: 'javascript', filename: 'timer-precision.js',
      code: `// setTimeout(fn, 0) is NOT instant
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
// start, end, promise, timeout

// Nested setTimeout gets clamped to 4ms
function nestedTimers() {
  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        setTimeout(() => {
          // After 4 levels of nesting, minimum delay is 4ms
          console.log('deeply nested');
        }, 0);
      }, 0);
    }, 0);
  }, 0);
}

// For more precise timing, use performance.now()
const start = performance.now();
setTimeout(() => {
  const elapsed = performance.now() - start;
  console.log(\`Actual delay: \${elapsed}ms\`); // Usually 1-10ms, not 0
}, 0);`,
    },

    { type: 'heading', level: 2, text: 'Microtask Starvation', id: 'starvation' },
    { type: 'paragraph', text: 'Since all microtasks run before the next macrotask, infinite microtasks starve rendering — the page freezes.' },
    {
      type: 'code', language: 'javascript', filename: 'starvation.js',
      code: `// ❌ DANGER: Infinite microtask loop — freezes the page!
function infiniteMicrotasks() {
  Promise.resolve().then(() => {
    console.log('microtask');
    infiniteMicrotasks(); // Schedules another microtask
    // Macrotasks and rendering NEVER get a chance to run!
  });
}
// infiniteMicrotasks(); // DON’T RUN THIS

// ✅ Use setTimeout to yield to the event loop
function safeRecursion() {
  setTimeout(() => {
    console.log('task');
    safeRecursion(); // Schedules a macrotask — other things can run between
  }, 0);
}`,
    },

    { type: 'heading', level: 2, text: 'Node.js Event Loop Phases', id: 'nodejs' },
    { type: 'paragraph', text: 'Node.js has more detailed phases. Browsers are simpler but follow the same core concept.' },
    {
      type: 'table',
      headers: ['Phase', 'Handles', 'Examples'],
      rows: [
        ['Timers', 'setTimeout, setInterval callbacks', 'Expired timer callbacks'],
        ['I/O Callbacks', 'System operation callbacks', 'TCP errors, etc.'],
        ['Poll', 'Retrieve I/O events', 'File I/O, network I/O'],
        ['Check', 'setImmediate callbacks', 'Node.js-specific'],
        ['Close', 'Close callbacks', 'socket.on("close")'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'node-specific.js',
      code: `// Node.js specific: process.nextTick vs queueMicrotask
process.nextTick(() => console.log('nextTick'));
queueMicrotask(() => console.log('microtask'));
// nextTick runs BEFORE microtask in Node.js

// setImmediate vs setTimeout(fn, 0)
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// Order is non-deterministic in the main module
// But inside I/O callbacks, setImmediate always runs first`,
    },

    { type: 'heading', level: 2, text: 'Practical Debugging', id: 'debugging' },
    {
      type: 'code', language: 'javascript', filename: 'debugging.js',
      code: `// Trace execution order
const log = (msg) => {
  const time = performance.now().toFixed(2);
  console.log(\`[\${time}ms] \${msg}\`);
};

log('sync 1');
setTimeout(() => log('macrotask 1'), 0);
setTimeout(() => log('macrotask 2'), 0);
Promise.resolve().then(() => log('microtask 1'));
Promise.resolve().then(() => {
  log('microtask 2');
  queueMicrotask(() => log('microtask 3 (nested)'));
});
requestAnimationFrame(() => log('rAF'));
log('sync 2');

// Expected order:
// sync 1, sync 2, microtask 1, microtask 2,
// microtask 3 (nested), rAF, macrotask 1, macrotask 2`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'list',
      items: [
        'Assuming setTimeout(fn, 0) runs immediately — it runs after all sync code and microtasks',
        'Using setTimeout for animations instead of requestAnimationFrame',
        'Not understanding that Promise.then is a microtask, not a macrotask',
        'Blocking the event loop with synchronous heavy computation',
        'Scheduling infinite microtasks that starve rendering',
        'Expecting precise timing from setTimeout (it\'s a minimum delay, not exact)',
        'Forgetting that async/await is sugar over Promises (and uses microtasks)',
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Explain the event loop in your own words.',
        'What is the difference between microtasks and macrotasks?',
        'Predict the output of this code: [complex async snippet]',
        'Why does setTimeout(fn, 0) not execute immediately?',
        'How does the event loop relate to rendering?',
        'What happens if you schedule microtasks inside microtasks?',
        'How would you prevent a long-running task from blocking the UI?',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Mental Model', text: 'Think of the event loop as a waiter at a restaurant. It processes one order (macrotask) at a time, but between orders it checks for urgent requests (microtasks) and updates the display (rendering). Long orders block everything else.' },
  ],
};
