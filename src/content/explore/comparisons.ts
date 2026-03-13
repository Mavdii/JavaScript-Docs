import type { ExploreContent } from '@/types/content';

export const comparisonsExplore: ExploreContent = {
  id: 'explore-comparisons',
  title: 'Comparisons',
  description: 'Side-by-side comparisons of JavaScript concepts, methods, and tools.',
  slug: 'explore/comparisons',
  pillar: 'explore',
  category: 'resources',
  tags: ['comparisons', 'vs', 'differences'],
  difficulty: 'beginner',
  contentType: 'comparison',
  summary: 'Understand the differences between commonly confused JavaScript concepts through clear side-by-side comparisons. Learn when to use what.',
  relatedTopics: ['explore-glossary'],
  order: 5,
  updatedAt: '2025-06-01',
  readingTime: 25,
  featured: false,
  keywords: ['JavaScript comparisons', 'vs', 'differences'],
  sections: [
    { type: 'heading', level: 2, text: 'var vs let vs const', id: 'var-let-const' },
    { type: 'paragraph', text: 'Three ways to declare variables, three different behaviors. This is one of the most important concepts to understand in modern JavaScript.' },
    { type: 'table', headers: ['Feature', 'var', 'let', 'const'], rows: [
      ['Scope', 'Function', 'Block', 'Block'],
      ['Hoisting', 'Yes (undefined)', 'Yes (TDZ)', 'Yes (TDZ)'],
      ['Reassignment', 'Yes', 'Yes', 'No'],
      ['Redeclaration', 'Yes', 'No', 'No'],
    ]},
    { type: 'code', language: 'javascript', code: `// var is function-scoped — leaks out of blocks
if (true) { var x = 1; }
console.log(x); // 1 ← accessible outside the block

// let is block-scoped
if (true) { let y = 2; }
// console.log(y); // ReferenceError: y is not defined

// const prevents reassignment, NOT mutation
const arr = [1, 2, 3];
arr.push(4);       // ✅ Mutation allowed
// arr = [5, 6];   // ❌ TypeError: Assignment to constant variable

// Temporal Dead Zone (TDZ) — accessing before declaration
console.log(a); // undefined (var hoisted)
var a = 10;

// console.log(b); // ReferenceError (TDZ)
let b = 20;` },
    { type: 'callout', variant: 'tip', title: 'Best Practice', text: 'Default to const. Use let only when reassignment is needed. Never use var in modern code — it leads to subtle scoping bugs.' },

    { type: 'heading', level: 2, text: '== vs ===', id: 'equality' },
    { type: 'paragraph', text: '== performs type coercion before comparison. === compares both value and type without coercion. Always prefer === unless you intentionally want coercion.' },
    { type: 'code', language: 'javascript', code: `// == with type coercion — surprising results
0 == ''          // true  (both coerced to 0)
0 == '0'         // true
'' == '0'        // false (string comparison, no numeric coercion)
false == '0'     // true  (false → 0, '0' → 0)
null == undefined // true (special case in spec)
NaN == NaN       // false (NaN is never equal to anything)

// === strict equality — no coercion
0 === ''         // false
0 === '0'        // false
null === undefined // false

// Object.is() — even stricter
Object.is(NaN, NaN)   // true  (unlike ===)
Object.is(0, -0)      // false (=== returns true)
Object.is(+0, -0)     // false` },
    { type: 'table', headers: ['Expression', '==', '===', 'Object.is()'], rows: [
      ['0, ""', 'true', 'false', 'false'],
      ['null, undefined', 'true', 'false', 'false'],
      ['NaN, NaN', 'false', 'false', 'true'],
      ['+0, -0', 'true', 'true', 'false'],
    ]},

    { type: 'heading', level: 2, text: 'map() vs forEach()', id: 'map-foreach' },
    { type: 'paragraph', text: 'Both iterate over arrays, but they serve different purposes. map() transforms data, forEach() does side effects.' },
    { type: 'code', language: 'javascript', code: `const nums = [1, 2, 3, 4, 5];

// map() — returns a NEW array (pure transformation)
const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
console.log(nums);    // [1, 2, 3, 4, 5] — original unchanged

// forEach() — returns undefined (side effects only)
const result = nums.forEach(n => console.log(n));
console.log(result); // undefined

// ❌ Anti-pattern: using forEach to build an array
const bad = [];
nums.forEach(n => bad.push(n * 2)); // Use map() instead!

// Chaining: map supports it, forEach doesn’t
const processed = nums
  .map(n => n * 2)
  .filter(n => n > 4)
  .map(n => \`Value: \${n}\`);
// ["Value: 6", "Value: 8", "Value: 10"]

// Performance: nearly identical in modern engines
// Decision: need the result? → map(). Side effects only? → forEach().` },

    { type: 'heading', level: 2, text: 'null vs undefined', id: 'null-undefined' },
    { type: 'code', language: 'javascript', code: `// undefined — "no value assigned yet"
let x;
console.log(x);         // undefined
console.log(typeof x);  // "undefined"

function foo(a) { return a; }
foo();  // undefined (missing argument)

const obj = {};
obj.missing; // undefined (nonexistent property)

// null — "intentionally empty"
let user = null; // explicitly no user
console.log(typeof null); // "object" ← historical bug in JS

// Equality
null == undefined   // true  (loose)
null === undefined  // false (strict)

// Nullish coalescing (??) vs OR (||)
const val1 = 0 || 'default';   // 'default' (0 is falsy)
const val2 = 0 ?? 'default';   // 0 (only null/undefined trigger ??)
const val3 = '' ?? 'default';  // '' (empty string is NOT nullish)
const val4 = null ?? 'default'; // 'default'` },

    { type: 'heading', level: 2, text: 'for...in vs for...of', id: 'for-in-of' },
    { type: 'code', language: 'javascript', code: `// for...in — iterates over KEYS (enumerable properties)
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
  console.log(key); // "a", "b", "c"
}

// ⚠️ for...in on arrays iterates INDEX STRINGS, not values
const arr = ['x', 'y', 'z'];
for (const i in arr) {
  console.log(i, typeof i); // "0" string, "1" string, "2" string
}

// ⚠️ for...in includes inherited enumerable properties
function Parent() {}
Parent.prototype.inherited = true;
const child = new Parent();
child.own = 1;
for (const key in child) {
  console.log(key); // "own", "inherited"
}
// Fix: use hasOwnProperty check or Object.keys()

// for...of — iterates over VALUES (iterable protocol)
for (const val of arr) {
  console.log(val); // "x", "y", "z"
}

// Works with any iterable: arrays, strings, Maps, Sets, generators
for (const char of 'hello') {
  console.log(char); // "h", "e", "l", "l", "o"
}

const map = new Map([['a', 1], ['b', 2]]);
for (const [key, val] of map) {
  console.log(key, val); // "a" 1, "b" 2
}` },
    { type: 'table', headers: ['Feature', 'for...in', 'for...of'], rows: [
      ['Iterates', 'Keys (strings)', 'Values'],
      ['Works on objects', 'Yes', 'No (not iterable)'],
      ['Works on arrays', 'Yes (indices)', 'Yes (values)'],
      ['Includes inherited', 'Yes', 'No'],
      ['Best for', 'Objects', 'Arrays, Maps, Sets'],
    ]},

    { type: 'heading', level: 2, text: 'Promise.all vs allSettled vs race vs any', id: 'promise-combinators' },
    { type: 'code', language: 'javascript', code: `const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
const p3 = Promise.resolve(3);

// Promise.all — rejects on FIRST failure
try {
  await Promise.all([p1, p2, p3]);
} catch (e) {
  console.log(e); // "error" — p3 result is lost
}

// Promise.allSettled — waits for ALL, never rejects
const results = await Promise.allSettled([p1, p2, p3]);
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]

// Promise.race — first to SETTLE (fulfill or reject) wins
const winner = await Promise.race([
  fetch('/api/primary'),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
]);

// Promise.any — first to FULFILL wins (ignores rejections)
const first = await Promise.any([
  fetch('/cdn1/data.json'),
  fetch('/cdn2/data.json'),
  fetch('/cdn3/data.json'),
]); // fastest successful response` },
    { type: 'table', headers: ['Method', 'Resolves when', 'Rejects when'], rows: [
      ['Promise.all', 'All fulfill', 'Any rejects'],
      ['Promise.allSettled', 'All settle', 'Never'],
      ['Promise.race', 'First settles', 'First settles (if rejected)'],
      ['Promise.any', 'First fulfills', 'All reject (AggregateError)'],
    ]},

    { type: 'heading', level: 2, text: 'Spread (...) vs Rest (...)', id: 'spread-rest' },
    { type: 'code', language: 'javascript', code: `// SPREAD — expands an iterable into individual elements
const a = [1, 2, 3];
const b = [...a, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { x: 1, y: 2 };
const obj2 = { ...obj1, z: 3 }; // { x: 1, y: 2, z: 3 }

// Shallow clone (not deep!)
const clone = { ...obj1 };
clone.x = 99;
console.log(obj1.x); // 1 (primitive — independent)

// ⚠️ Nested objects share references
const deep = { nested: { val: 1 } };
const shallowClone = { ...deep };
shallowClone.nested.val = 99;
console.log(deep.nested.val); // 99 ← shared reference!

// REST — collects remaining elements into an array/object
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

// Destructuring with rest
const [first, ...remaining] = [1, 2, 3, 4];
// first = 1, remaining = [2, 3, 4]

const { id, ...metadata } = { id: 1, name: 'Alice', age: 30 };
// id = 1, metadata = { name: 'Alice', age: 30 }` },

    { type: 'heading', level: 2, text: 'fetch vs axios', id: 'fetch-axios' },
    { type: 'table', headers: ['Feature', 'fetch (native)', 'axios (library)'], rows: [
      ['Bundle size', '0 KB (built-in)', '~13 KB gzipped'],
      ['Error handling', 'Manual (check res.ok)', 'Auto throws on 4xx/5xx'],
      ['Request cancellation', 'AbortController', 'CancelToken + AbortController'],
      ['Interceptors', 'No (manual wrapper)', 'Built-in'],
      ['Progress tracking', 'ReadableStream (complex)', 'onUploadProgress / onDownloadProgress'],
      ['JSON parsing', 'Manual (res.json())', 'Automatic'],
      ['Timeout', 'AbortSignal.timeout()', 'timeout option'],
      ['Node.js support', 'v18+ (experimental)', 'Full support'],
    ]},
    { type: 'code', language: 'javascript', code: `// fetch — more verbose but zero dependencies
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
  signal: AbortSignal.timeout(5000),
});
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const data = await res.json();

// axios — cleaner API, auto error handling
const { data } = await axios.post('/api/users', { name: 'Alice' }, {
  timeout: 5000,
});
// Automatically throws on 4xx/5xx
// Automatically parses JSON` },

    { type: 'heading', level: 2, text: 'debounce vs throttle', id: 'debounce-throttle' },
    { type: 'paragraph', text: 'Both limit how often a function executes, but with different strategies. Debounce waits for a pause in calls; throttle executes at a steady rate.' },
    { type: 'code', language: 'javascript', code: `// DEBOUNCE — waits until calls stop for N ms
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
// Use case: search input — only search after user stops typing
const search = debounce((query) => fetchResults(query), 300);
input.addEventListener('input', (e) => search(e.target.value));

// THROTTLE — executes at most once every N ms
function throttle(fn, interval) {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}
// Use case: scroll handler — update position at steady rate
window.addEventListener('scroll', throttle(updatePosition, 100));

// Visual timeline (calls marked with |, executions with ●):
// Debounce(300ms): | | | | |............●  (fires once after pause)
// Throttle(300ms): |●  |  |●  |  |●       (fires at intervals)` },

    { type: 'heading', level: 2, text: 'Shallow Copy vs Deep Copy', id: 'shallow-deep-copy' },
    { type: 'code', language: 'javascript', code: `const original = {
  name: 'Alice',
  scores: [90, 85, 92],
  address: { city: 'NYC', zip: '10001' }
};

// ── Shallow Copy Methods ──
const spread = { ...original };
const assign = Object.assign({}, original);

// Primitives are independent
spread.name = 'Bob';
console.log(original.name); // 'Alice' ✅

// Nested objects/arrays are SHARED references
spread.scores.push(100);
console.log(original.scores); // [90, 85, 92, 100] ❌ mutated!

// ── Deep Copy Methods ──

// 1. structuredClone (modern, recommended)
const deep1 = structuredClone(original);
deep1.address.city = 'LA';
console.log(original.address.city); // 'NYC' ✅

// 2. JSON round-trip (limited — drops functions, dates, undefined)
const deep2 = JSON.parse(JSON.stringify(original));

// 3. Recursive utility (full control)
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}` },
    { type: 'table', headers: ['Method', 'Deep?', 'Functions', 'Date/RegExp', 'Circular refs'], rows: [
      ['Spread / Object.assign', 'No', '✅', '❌ (ref)', 'N/A'],
      ['JSON.parse(JSON.stringify())', 'Yes', '❌ dropped', '❌ string', '❌ throws'],
      ['structuredClone()', 'Yes', '❌ throws', '✅', '✅'],
      ['Custom recursive', 'Yes', '✅', '✅', 'Needs handling'],
    ]},

    { type: 'heading', level: 2, text: 'Event Bubbling vs Capturing', id: 'bubbling-capturing' },
    { type: 'code', language: 'javascript', code: `// Event flow: Capturing → Target → Bubbling
// 
//        ┌── Capturing (top → target) ──┐
//        │   document                    │
//        │     body                      │
//        │       div                     │
//        │         button  ← TARGET      │
//        └── Bubbling (target → top) ───┘

// Default: bubbling phase
document.querySelector('.parent').addEventListener('click', (e) => {
  console.log('Parent clicked (bubbling)');
});

// Capturing phase: third argument = true
document.querySelector('.parent').addEventListener('click', (e) => {
  console.log('Parent clicked (capturing)');
}, true); // or { capture: true }

// Stop propagation
button.addEventListener('click', (e) => {
  e.stopPropagation();  // prevents bubbling to parent
});

// Event delegation — leverage bubbling
document.querySelector('.todo-list').addEventListener('click', (e) => {
  const item = e.target.closest('.todo-item');
  if (item) {
    toggleTodo(item.dataset.id);
  }
});` },

    { type: 'callout', variant: 'warning', title: 'Common Pitfall', text: 'e.stopPropagation() prevents parent handlers from firing but does NOT prevent other listeners on the same element. Use e.stopImmediatePropagation() for that.' },
  ],
  items: [
    { name: 'var vs let vs const', description: 'Variable declaration keywords with different scoping and mutability rules.' },
    { name: '== vs ===', description: 'Loose equality (with coercion) vs strict equality (no coercion).' },
    { name: 'map() vs forEach()', description: 'Array iteration: returns new array vs returns undefined.' },
    { name: 'null vs undefined', description: 'Explicit absence vs uninitialized value.' },
    { name: 'for...in vs for...of', description: 'Iterate keys (enumerable) vs values (iterable protocol).' },
    { name: 'Promise combinators', description: 'all vs allSettled vs race vs any — different settlement strategies.' },
    { name: 'Spread vs Rest', description: 'Same syntax (...), opposite operations: expand vs collect.' },
    { name: 'fetch vs axios', description: 'Native API vs popular HTTP library trade-offs.' },
    { name: 'debounce vs throttle', description: 'Rate-limiting strategies: wait for pause vs steady interval.' },
    { name: 'Shallow vs Deep Copy', description: 'Reference sharing vs independent clones for nested data.' },
    { name: 'Bubbling vs Capturing', description: 'Event propagation phases in the DOM.' },
  ],
};
