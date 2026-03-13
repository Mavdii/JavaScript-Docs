import type { ErrorGuideContent } from '@/types/content';

export const debuggingGuide: ErrorGuideContent = {
  id: 'error-debugging',
  title: 'Debugging Techniques',
  description: 'Master debugging tools and strategies for finding and fixing bugs.',
  slug: 'errors/debugging',
  pillar: 'errors',
  category: 'error-types',
  tags: ['debugging', 'DevTools', 'console', 'testing'],
  difficulty: 'intermediate',
  contentType: 'error-guide',
  summary: 'Learn debugging strategies and tools — from console methods to browser DevTools, debugger statements, and systematic problem-solving approaches.',
  relatedTopics: ['error-common', 'error-async'],
  order: 5,
  updatedAt: '2025-06-01',
  readingTime: 18,
  featured: false,
  keywords: ['debugging', 'DevTools', 'console', 'breakpoints'],
  errorType: 'Debugging Strategies',
  solutions: [
    'Use console methods beyond console.log (table, group, time, etc)',
    'Use browser DevTools debugger with breakpoints and stepping',
    'Add strategic logging to understand control flow',
    'Isolate the problem by narrowing down the code',
    'Use Network tab to inspect API calls',
    'Use Performance tab to identify slow code',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Console Methods', id: 'console-methods' },
    { type: 'paragraph', text: 'The console is your first line of defense. Beyond console.log, there are many specialized methods for different debugging scenarios.' },
    { type: 'code', language: 'javascript', code: `// Basic logging
console.log('Simple message');
console.error('Error message');
console.warn('Warning message');
console.info('Info message');

// Structured output
console.table([
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
]); // Shows as a table

// Grouped output
console.group('User Data');
console.log('Name: Alice');
console.log('Age: 30');
console.groupEnd();

// Conditional logging
console.assert(x > 0, 'x must be positive');

// Timing code
console.time('fetch-users');
// ... some code ...
console.timeEnd('fetch-users'); // logs: fetch-users: 123ms

// Stack trace
console.trace('Current stack');

// Counting calls
for (let i = 0; i < 5; i++) {
  console.count('loop');
}
// loop: 1, loop: 2, loop: 3, loop: 4, loop: 5

// Monitor function calls
// monitor(fetchData); // logs every call to fetchData in console

// Monitor DOM events
// monitorEvents(document, 'click'); // logs all clicks` },

    { type: 'heading', level: 2, text: 'Browser DevTools', id: 'devtools' },
    { type: 'paragraph', text: 'DevTools is where you\'ll spend a lot of time debugging. Learn the important tabs and features.' },

    { type: 'heading', level: 3, text: 'Sources Tab - Breakpoints', id: 'breakpoints' },
    { type: 'code', language: 'javascript', code: `// 1. Line breakpoint: Click on line number in Sources tab
// Code execution pauses at that line

// 2. Conditional breakpoint: Right-click line number → Add conditional breakpoint
// Only pauses if condition is true

// 3. Debugger statement
function fetchUser(id) {
  debugger; // Execution pauses here (if DevTools open)
  return fetch(\`/api/users/\${id}\`);
}

// 4. Set breakpoint in code
if (user.age < 0) {
  debugger; // Pause if this condition is true
}

// Stepping through code:
// Step over (F10) - Execute next line
// Step into (F11) - Go inside function calls
// Step out (Shift+F11) - Exit current function
// Continue (F8) - Resume execution` },

    { type: 'heading', level: 3, text: 'Network Tab', id: 'network-tab' },
    { type: 'paragraph', text: 'Inspect all network requests and responses to debug API issues.' },
    { type: 'code', language: 'javascript', code: `// Network tab shows:
// 1. Request URL, method, status code
// 2. Request headers and body
// 3. Response headers and body
// 4. Timing (DNS lookup, TCP connection, request, response, rendering)
// 5. Size (transferred vs uncompressed)

// Right-click request → Copy as cURL
// This lets you test the exact request in terminal:
// curl 'https://api.example.com/users' \\
//   -H 'Authorization: Bearer token' \\
//   -H 'Content-Type: application/json'

// Filter requests by type (XHR, JS, CSS, Img, etc)
// Throttle network speed to test slow connections

// Check for failed requests (red X)
// Look for slow requests (long bars)
// Verify request/response headers match expectations` },

    { type: 'heading', level: 3, text: 'Elements/Inspector Tab', id: 'elements-tab' },
    { type: 'code', language: 'javascript', code: `// Inspect DOM structure
// Right-click element → Inspect

// Edit HTML on the fly (doesn’t save, just for testing)
// Change CSS properties in Styles panel
// See computed styles vs declared styles

// Get element reference in console:
// $0 = last inspected element
// $1 = second-to-last inspected element
// etc

// Test selectors in console:
// document.querySelector('.my-button')
// document.querySelectorAll('.list-item')

// Monitor element changes:
// In Elements tab, right-click element → Break on → subtree modifications

// Check accessibility:
// Lighthouse tab → Accessibility section
// Shows color contrast issues, missing alt text, etc` },

    { type: 'heading', level: 3, text: 'Performance Tab', id: 'performance-tab' },
    { type: 'paragraph', text: 'Find performance bottlenecks and slow code.' },
    { type: 'code', language: 'javascript', code: `// Record performance:
// 1. Click Record (circle button)
// 2. Interact with your app
// 3. Click Stop
// 4. Analyze the timeline

// Look for:
// - Long tasks (red bars) — code running > 50ms
// - Layout thrashing — repeated layout measurements
// - Unnecessary re-renders
// - Memory leaks (heap keeps growing)

// JavaScript Profiler:
// Time which functions take the most time

// Flame chart:
// Shows call stack over time
// Wide sections = slow functions

// User Timing API (for custom measurements):
performance.mark('start-fetch');
// ... some code ...
performance.mark('end-fetch');
performance.measure('fetch', 'start-fetch', 'end-fetch');
// Shows in Performance tab

const measures = performance.getEntriesByType('measure');
console.log(measures[0].duration); // in milliseconds` },

    { type: 'heading', level: 2, text: 'Debugging Strategy', id: 'strategy' },
    { type: 'paragraph', text: 'A systematic approach to debugging helps you find bugs faster.' },
    { type: 'list', items: [
      '1. Reproduce the bug consistently — understand when it happens',
      '2. Isolate the problem — narrow down which code causes it',
      '3. Form a hypothesis about what\'s wrong',
      '4. Test your hypothesis with a breakpoint or log',
      '5. If wrong, adjust hypothesis and repeat',
      '6. Once found, understand why it happened',
      '7. Fix the root cause, not just the symptom',
      '8. Test to make sure the fix works and doesn\'t break anything else',
    ] },

    { type: 'heading', level: 2, text: 'Common Debugging Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', code: `// Pattern 1: Narrow down the issue
function processUser(user) {
  const validated = validateUser(user);
  console.log('validated:', validated); // Is it correct?
  
  const transformed = transformUser(validated);
  console.log('transformed:', transformed); // Did transformation work?
  
  const saved = saveUser(transformed);
  console.log('saved:', saved); // Did save work?
}

// Pattern 2: Check assumptions
const users = fetchUsers();
console.assert(Array.isArray(users), 'users should be an array');
console.assert(users.length > 0, 'users should not be empty');

// Pattern 3: Log before and after
const before = state;
setState(newState);
console.log('before:', before, 'after:', newState);

// Pattern 4: Debug async code
async function loadData() {
  console.log('Starting load...');
  try {
    const data = await fetchData();
    console.log('Loaded:', data);
    return data;
  } catch (err) {
    console.error('Load failed:', err);
    throw err;
  }
}

// Pattern 5: Check type
const value = getValue();
console.log('Type:', typeof value);
console.log('Is array:', Array.isArray(value));
console.log('Is null:', value === null);
console.log('Value:', value);

// Pattern 6: Isolate with minimal example
// If bug is hard to reproduce, create minimal example with just the essentials
// Remove everything unnecessary until bug disappears
// Then add back piece by piece to find what causes it` },

    { type: 'heading', level: 2, text: 'Remote Debugging', id: 'remote-debugging' },
    { type: 'paragraph', text: 'Debug production issues or code running on other machines.' },
    { type: 'code', language: 'javascript', code: `// 1. Source maps: Map minified code back to original
// Build process should generate .map files
// Upload to error tracking service (Sentry, etc)

// 2. Error tracking service
// Example: Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/123",
  environment: process.env.NODE_ENV,
});

// Automatically captures errors
// You can also manually report:
Sentry.captureException(err);
Sentry.captureMessage('Something happened');

// 3. Remote logging
// Send logs to server for analysis
const log = (level, message, data) => {
  fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify({ level, message, data, timestamp: Date.now() }),
  });
};

// 4. Feature flags for debugging
if (process.env.DEBUG_MODE) {
  console.log('Debug information...');
}

// 5. Browser console access
// User can open DevTools and run:
// window.DEBUG = true
// if (window.DEBUG) console.log(...);` },

    { type: 'callout', variant: 'tip', title: 'Pro Tip: Use VS Code Debugger', text: 'VS Code has built-in debugging for Node.js. Set breakpoints in your code, run with debugger, and step through. Much easier than adding console.log everywhere.' },
  ],
};
