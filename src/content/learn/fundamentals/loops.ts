import type { LessonContent } from '@/types/content';

export const loopsLesson: LessonContent = {
  id: 'loops',
  title: 'Loops',
  description: 'Master for, while, for...of, for...in, and control flow with break and continue.',
  slug: 'learn/fundamentals/loops',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['loops', 'iteration', 'for', 'while'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Loops repeat code blocks. JavaScript provides for, while, do...while, for...of, and for...in loops, each suited for different scenarios.',
  relatedTopics: ['arrays', 'objects'],
  order: 7,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['for', 'while', 'do while', 'for of', 'for in', 'break', 'continue', 'label', 'iterator'],
  prerequisites: ['Variables & Types'],
  learningGoals: [
    'Choose the right loop for each situation',
    'Use break and continue for flow control',
    'Understand for...of vs for...in',
    'Work with labeled statements',
    'Iterate over Maps, Sets, and other iterables',
    'Avoid common loop pitfalls',
  ],
  exercises: [
    'Write a loop that prints a multiplication table.',
    'Use for...of to iterate a Map and a Set.',
    'Implement FizzBuzz using different loop types.',
    'Write a nested loop with labeled break to search a 2D grid.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'for Loop', id: 'for-loop' },
    { type: 'paragraph', text: 'The classic `for` loop has three parts: initialization, condition, and update. It\'s best when you know the number of iterations in advance.' },
    {
      type: 'code', language: 'javascript', filename: 'for.js',
      code: `// Basic for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// Counting down
for (let i = 10; i > 0; i--) {
  console.log(i);
}

// Custom step
for (let i = 0; i < 100; i += 10) {
  console.log(i); // 0, 10, 20, ..., 90
}

// Multiple variables
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j); // 0 10, 1 9, 2 8, 3 7, 4 6
}

// Iterate array with index
const fruits = ['apple', 'banana', 'cherry'];
for (let i = 0; i < fruits.length; i++) {
  console.log(\`\${i}: \${fruits[i]}\`);
}

// Reverse iteration
for (let i = fruits.length - 1; i >= 0; i--) {
  console.log(fruits[i]);
}`,
    },

    { type: 'heading', level: 2, text: 'while & do...while', id: 'while' },
    { type: 'paragraph', text: '`while` loops repeat as long as a condition is true. `do...while` guarantees at least one execution.' },
    {
      type: 'code', language: 'javascript', filename: 'while.js',
      code: `// while — checks condition first
let count = 0;
while (count < 5) {
  console.log(count); // 0, 1, 2, 3, 4
  count++;
}

// do...while — runs at least once
let input;
do {
  input = prompt('Enter a number > 10:');
} while (Number(input) <= 10);

// Practical: process until condition met
let attempts = 0;
let success = false;
while (!success && attempts < 3) {
  success = tryOperation();
  attempts++;
}

// Infinite loop (careful!)
// while (true) {
//   if (shouldStop()) break;
//   doWork();
// }

// Reading a stream
// while ((line = reader.readLine()) !== null) {
//   processLine(line);
// }`,
    },

    { type: 'heading', level: 2, text: 'for...of (Iterables)', id: 'for-of' },
    { type: 'paragraph', text: '`for...of` works on any iterable: arrays, strings, Maps, Sets, generators, NodeLists, and more. It gives you the values directly.' },
    {
      type: 'code', language: 'javascript', filename: 'for-of.js',
      code: `// Arrays
const fruits = ['apple', 'banana', 'cherry'];
for (const fruit of fruits) {
  console.log(fruit);
}

// With destructuring
const users = [['Alice', 30], ['Bob', 25]];
for (const [name, age] of users) {
  console.log(\`\${name} is \${age}\`);
}

// Strings
for (const char of 'Hello 🌍') {
  console.log(char); // H, e, l, l, o, ' ', 🌍 (handles emoji correctly)
}

// Maps
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
for (const [key, value] of map) {
  console.log(\`\${key} = \${value}\`);
}

// Sets
const set = new Set([1, 2, 3, 2, 1]);
for (const value of set) {
  console.log(value); // 1, 2, 3 (unique values)
}

// With entries() for index
for (const [index, fruit] of fruits.entries()) {
  console.log(\`\${index}: \${fruit}\`);
}

// NodeList (from DOM)
for (const el of document.querySelectorAll('.item')) {
  el.classList.add('processed');
}`,
    },

    { type: 'heading', level: 2, text: 'for...in (Object Keys)', id: 'for-in' },
    { type: 'paragraph', text: '`for...in` iterates over enumerable property names (keys). It\'s designed for objects, not arrays.' },
    {
      type: 'code', language: 'javascript', filename: 'for-in.js',
      code: `const user = { name: 'Alice', age: 30, role: 'admin' };

for (const key in user) {
  console.log(\`\${key}: \${user[key]}\`);
}

// PROBLEM: for...in includes inherited properties
function Animal(name) { this.name = name; }
Animal.prototype.type = 'animal';
const dog = new Animal('Rex');

for (const key in dog) {
  console.log(key); // "name", then "type" (inherited!)
}

// Fix: filter own properties
for (const key in dog) {
  if (Object.hasOwn(dog, key)) {
    console.log(key); // "name" only
  }
}

// Better: use Object.keys/entries instead
for (const [key, value] of Object.entries(user)) {
  console.log(\`\${key}: \${value}\`);
}`,
    },
    { type: 'callout', variant: 'warning', title: 'Avoid for...in on Arrays', text: '`for...in` on arrays iterates indices as strings and includes inherited properties. Use `for...of` or array methods instead. Example: `for (const key in [10, 20]) { typeof key }` → `"string"` (not number!)' },

    { type: 'heading', level: 2, text: 'break & continue', id: 'break-continue' },
    { type: 'paragraph', text: '`break` exits the loop entirely. `continue` skips the rest of the current iteration and moves to the next. Both work with `for`, `while`, and `for...of`.' },
    {
      type: 'code', language: 'javascript', filename: 'control.js',
      code: `// break — exit loop entirely
for (let i = 0; i < 100; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}

// continue — skip current iteration
for (let i = 0; i < 10; i++) {
  if (i % 2 !== 0) continue; // Skip odd numbers
  console.log(i); // 0, 2, 4, 6, 8
}

// break in while loop
const items = [1, 2, -1, 3, 4];
let sum = 0;
for (const item of items) {
  if (item < 0) break; // Stop at negative number
  sum += item;
}
console.log(sum); // 3

// Practical: find first match
function findUser(users, name) {
  for (const user of users) {
    if (user.name === name) return user; // Early return = implicit break
  }
  return null;
}`,
    },

    { type: 'heading', level: 2, text: 'Labeled Statements', id: 'labels' },
    { type: 'paragraph', text: 'Labels let you break or continue outer loops from inner loops. They\'re rarely needed but useful for nested loop control.' },
    {
      type: 'code', language: 'javascript', filename: 'labels.js',
      code: `// Without labels — break only exits inner loop
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) break; // Only breaks inner loop
    console.log(i, j);
  }
}
// Prints: 0 0, 1 0, 2 0

// With labels — break exits the labeled loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer; // Breaks BOTH loops
    console.log(i, j);
  }
}
// Prints: 0 0, 0 1, 0 2, 1 0

// continue with label — skips to next iteration of labeled loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer; // Skips to next i
    console.log(i, j);
  }
}
// Prints: 0 0, 1 0, 2 0

// Practical: search in 2D grid
const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

search: for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    if (grid[row][col] === 5) {
      console.log(\`Found at [\${row}][\${col}]\`);
      break search;
    }
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Loop Comparison Table', id: 'comparison' },
    {
      type: 'table',
      headers: ['Loop', 'Best For', 'break/continue', 'Async Friendly'],
      rows: [
        ['for', 'Known iteration count, index access', 'Yes', 'Yes (with await)'],
        ['while', 'Unknown iteration count, conditions', 'Yes', 'Yes'],
        ['do...while', 'At least one execution needed', 'Yes', 'Yes'],
        ['for...of', 'Arrays, strings, iterables', 'Yes', 'Yes (for await...of)'],
        ['for...in', 'Object keys (avoid for arrays)', 'Yes', 'Yes'],
        ['forEach', 'Array callbacks', 'No', 'No (can\'t await)'],
        ['.map/.filter', 'Array transformations', 'No', 'No'],
      ],
    },

    { type: 'heading', level: 2, text: 'Iterating Maps & Sets', id: 'maps-sets' },
    {
      type: 'code', language: 'javascript', filename: 'maps-sets.js',
      code: `// Map iteration
const userMap = new Map([
  ['alice', { age: 30, role: 'admin' }],
  ['bob', { age: 25, role: 'user' }],
]);

for (const [username, data] of userMap) {
  console.log(\`\${username}: \${data.role}\`);
}

userMap.forEach((value, key) => {
  console.log(key, value);
});

// Iterate only keys or values
for (const key of userMap.keys()) { /* ... */ }
for (const value of userMap.values()) { /* ... */ }

// Set iteration
const tags = new Set(['javascript', 'typescript', 'react']);

for (const tag of tags) {
  console.log(tag);
}

// Convert to array for array methods
const sorted = [...tags].sort();
const filtered = [...tags].filter(t => t.startsWith('type'));`,
    },

    { type: 'heading', level: 2, text: 'Async Iteration', id: 'async-iteration' },
    { type: 'paragraph', text: '`for await...of` iterates over async iterables, which yield promises. This is essential for streaming data or paginated API calls.' },
    {
      type: 'code', language: 'javascript', filename: 'async-iteration.js',
      code: `// for await...of with async iterables
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page}\`);
    const data = await res.json();
    if (data.length === 0) return;
    yield data;
    page++;
  }
}

for await (const page of fetchPages('/api/users')) {
  console.log('Got page:', page);
}

// Sequential async operations in a loop
async function processItems(items) {
  for (const item of items) {
    await processItem(item); // Runs one at a time
  }
}

// CAUTION: forEach does NOT await
items.forEach(async (item) => {
  await processItem(item); // Fires all at once! Not sequential!
});

// Parallel processing (when order doesn’t matter)
await Promise.all(items.map(item => processItem(item)));`,
    },
    { type: 'callout', variant: 'warning', title: 'forEach + async', text: '`forEach` does not wait for async callbacks. Use `for...of` with `await` for sequential async iteration, or `Promise.all` with `map` for parallel processing.' },

    { type: 'heading', level: 2, text: 'Loop Performance', id: 'performance' },
    {
      type: 'code', language: 'javascript', filename: 'performance.js',
      code: `const arr = new Array(1_000_000).fill(1);

// Cache array length (minor optimization for very large arrays)
// Slightly faster:
for (let i = 0, len = arr.length; i < len; i++) { /* ... */ }
// Standard (engines optimize this nowadays):
for (let i = 0; i < arr.length; i++) { /* ... */ }

// Avoid repeated property access in hot loops
// Slow:
for (let i = 0; i < arr.length; i++) {
  document.getElementById('output').textContent += arr[i];
}
// Fast:
const output = document.getElementById('output');
const parts = [];
for (let i = 0; i < arr.length; i++) {
  parts.push(arr[i]);
}
output.textContent = parts.join('');

// Avoid creating functions in loops
// Bad:
for (let i = 0; i < 1000; i++) {
  element.addEventListener('click', function() { /* ... */ });
}
// Good:
function handleClick() { /* ... */ }
for (let i = 0; i < 1000; i++) {
  element.addEventListener('click', handleClick);
}`,
    },

    { type: 'heading', level: 2, text: 'Common Patterns', id: 'patterns' },
    {
      type: 'code', language: 'javascript', filename: 'patterns.js',
      code: `// FizzBuzz
for (let i = 1; i <= 100; i++) {
  const output = (i % 3 === 0 ? 'Fizz' : '') + (i % 5 === 0 ? 'Buzz' : '');
  console.log(output || i);
}

// Pagination
function* paginate(items, pageSize) {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}
for (const page of paginate([1,2,3,4,5,6,7], 3)) {
  console.log(page); // [1,2,3], [4,5,6], [7]
}

// Retry loop
async function retry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

// Polling
async function poll(fn, interval = 1000, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fn();
    if (result) return result;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error('Polling timed out');
}`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Off-by-one errors
const arr = [1, 2, 3];
for (let i = 0; i <= arr.length; i++) { // BUG: <= should be <
  console.log(arr[i]); // Last iteration: undefined
}

// 2. Infinite loops
let i = 10;
while (i > 0) {
  console.log(i);
  // Forgot i--! Loop never ends
}

// 3. Modifying array while iterating
const items = [1, 2, 3, 4, 5];
for (let i = 0; i < items.length; i++) {
  if (items[i] % 2 === 0) {
    items.splice(i, 1); // Shifts indices — skips elements!
  }
}
// Fix: iterate backwards or use filter

// 4. Using for...in on arrays
for (const i in [10, 20, 30]) {
  console.log(typeof i); // "string" — not a number!
}
// Fix: Use for...of for arrays

// 5. Using var in for loops (closure bug)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3, 3, 3
}
// Fix: Use let instead of var`,
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use `for...of` for iterating arrays and iterables — it is clean and handles Unicode correctly',
        'Use `for...in` only for objects, and always check `Object.hasOwn()`',
        'Use `let` (never `var`) in `for` loops to get correct block scoping',
        'Prefer array methods (`map`, `filter`, `reduce`) over manual loops for data transformations',
        'Use `break` and early returns to avoid unnecessary iterations',
        'Use `for await...of` for sequential async processing',
        'Avoid modifying the collection you are iterating over',
        'Use labeled `break` for nested loops instead of boolean flags',
        'Cache expensive computations outside the loop body',
        'Consider generators for lazy iteration over large or infinite sequences',
      ],
    },
  ],
};
