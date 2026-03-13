import type { LessonContent } from '@/types/content';

export const arraysLesson: LessonContent = {
  id: 'arrays',
  title: 'Arrays',
  description: 'Learn to create, access, modify, and iterate over arrays in JavaScript.',
  slug: 'learn/fundamentals/arrays',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['arrays', 'data-structures', 'iteration'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Arrays are ordered collections of values. They provide powerful built-in methods for adding, removing, searching, and transforming elements.',
  relatedTopics: ['objects', 'array-map'],
  order: 5,
  updatedAt: '2024-03-01',
  readingTime: 28,
  featured: false,
  keywords: ['array', 'push', 'pop', 'map', 'filter', 'reduce', 'destructuring', 'flat', 'sort', 'splice'],
  prerequisites: ['Variables & Types'],
  learningGoals: [
    'Create arrays and access elements by index',
    'Use mutating methods like push, pop, splice',
    'Iterate with for...of, forEach, and map',
    'Destructure arrays and use the spread operator',
    'Chain array methods for complex transformations',
    'Understand mutating vs non-mutating methods',
    'Work with typed arrays and array-like objects',
  ],
  exercises: [
    'Write a function that removes duplicates from an array.',
    'Use map, filter, and reduce to transform an array of objects.',
    'Implement a function that chunks an array into groups of N.',
    'Write a function that finds the intersection of two arrays.',
    'Build a pipeline that processes a dataset using chained array methods.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Creating Arrays', id: 'creating' },
    { type: 'paragraph', text: 'Arrays can be created with literal syntax, the `Array` constructor, or factory methods like `Array.from()` and `Array.of()`.' },
    {
      type: 'code', language: 'javascript', filename: 'creating.js',
      code: `const fruits = ['apple', 'banana', 'cherry'];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, 'two', true, null, { key: 'value' }];
const empty = [];

// Array.from — create from iterables or array-like objects
const range = Array.from({ length: 5 }, (_, i) => i + 1);
// [1, 2, 3, 4, 5]

const chars = Array.from('Hello'); // ['H', 'e', 'l', 'l', 'o']

// Array.of — create from arguments (unlike new Array)
Array.of(5);        // [5] (single element)
new Array(5);       // [empty × 5] (5 empty slots — confusing!)

// Fill with values
const zeros = new Array(5).fill(0);   // [0, 0, 0, 0, 0]
const matrix = Array.from({ length: 3 }, () => new Array(3).fill(0));
// [[0,0,0], [0,0,0], [0,0,0]]

// Spread from other iterables
const fromSet = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]
const fromMap = [...new Map([['a', 1]])];    // [['a', 1]]`,
    },

    { type: 'heading', level: 2, text: 'Accessing & Modifying', id: 'accessing' },
    {
      type: 'code', language: 'javascript', filename: 'access.js',
      code: `const arr = ['a', 'b', 'c', 'd', 'e'];

// Reading elements
arr[0]              // "a" (first)
arr[arr.length - 1] // "e" (last)
arr.at(-1)          // "e" (modern — negative indexing)
arr.at(-2)          // "d"

// Checking length
arr.length           // 5
arr.length = 3;      // Truncates to ['a', 'b', 'c']!

// Checking if array
Array.isArray(arr)   // true
Array.isArray('str') // false
Array.isArray({ length: 3 }) // false`,
    },

    { type: 'heading', level: 2, text: 'Adding & Removing Elements', id: 'add-remove' },
    { type: 'paragraph', text: 'JavaScript provides methods for adding/removing from both ends of an array, as well as at arbitrary positions.' },
    {
      type: 'code', language: 'javascript', filename: 'add-remove.js',
      code: `const arr = ['b', 'c', 'd'];

// End
arr.push('e');       // ['b', 'c', 'd', 'e'] — returns new length (4)
arr.pop();           // ['b', 'c', 'd'] — returns 'e'

// Start
arr.unshift('a');    // ['a', 'b', 'c', 'd'] — returns new length (4)
arr.shift();         // ['b', 'c', 'd'] — returns 'a'

// Middle — splice(startIndex, deleteCount, ...items)
arr.splice(1, 0, 'x');      // Insert 'x' at index 1 → ['b', 'x', 'c', 'd']
arr.splice(1, 1);            // Remove 1 at index 1 → ['b', 'c', 'd']
arr.splice(1, 1, 'y', 'z'); // Replace 1 at index 1 → ['b', 'y', 'z', 'd']

// Performance comparison
// push/pop    — O(1) — fast (end of array)
// shift/unshift — O(n) — slow (reindexes all elements)
// splice       — O(n) — depends on position`,
    },
    {
      type: 'table',
      headers: ['Method', 'Position', 'Returns', 'Mutates?'],
      rows: [
        ['push(...items)', 'End', 'New length', 'Yes'],
        ['pop()', 'End', 'Removed element', 'Yes'],
        ['unshift(...items)', 'Start', 'New length', 'Yes'],
        ['shift()', 'Start', 'Removed element', 'Yes'],
        ['splice(i, n, ...items)', 'Any', 'Removed elements', 'Yes'],
      ],
    },

    { type: 'heading', level: 2, text: 'Iterating Arrays', id: 'iterating' },
    {
      type: 'code', language: 'javascript', filename: 'iterating.js',
      code: `const nums = [1, 2, 3, 4, 5];

// for...of — best for simple iteration
for (const n of nums) {
  console.log(n);
}

// for...of with index (using entries)
for (const [i, n] of nums.entries()) {
  console.log(\`Index \${i}: \${n}\`);
}

// forEach — callback-based, no break/continue
nums.forEach((n, i, arr) => {
  console.log(i, n);
});

// Classic for loop — when you need index control
for (let i = 0; i < nums.length; i++) {
  if (nums[i] === 3) break; // Can break
}

// Reverse iteration
for (let i = nums.length - 1; i >= 0; i--) {
  console.log(nums[i]);
}

// for...in — AVOID for arrays (iterates keys as strings)
for (const key in nums) {
  console.log(typeof key); // "string" — not what you want!
}`,
    },

    { type: 'heading', level: 2, text: 'Transforming: map, filter, reduce', id: 'transform' },
    { type: 'paragraph', text: 'The "big three" array methods are the foundation of functional array processing. They\'re non-mutating and can be chained together.' },
    {
      type: 'code', language: 'javascript', filename: 'transform.js',
      code: `const users = [
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob', age: 25, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'Diana', age: 28, active: true },
];

// map — transform each element → new array
const names = users.map(u => u.name);
// ['Alice', 'Bob', 'Charlie', 'Diana']

// filter — keep elements matching condition → new array
const activeUsers = users.filter(u => u.active);
// [Alice, Charlie, Diana]

// reduce — accumulate to single value
const totalAge = users.reduce((sum, u) => sum + u.age, 0);
// 118

// Chaining — pipeline style
const result = users
  .filter(u => u.active)
  .map(u => u.name.toUpperCase())
  .sort();
// ['ALICE', 'CHARLIE', 'DIANA']

// reduce to build objects
const byName = users.reduce((acc, u) => {
  acc[u.name] = u;
  return acc;
}, {});
// { Alice: {...}, Bob: {...}, ... }

// reduce to group by property
const grouped = users.reduce((groups, u) => {
  const key = u.active ? 'active' : 'inactive';
  (groups[key] ??= []).push(u);
  return groups;
}, {});
// { active: [Alice, Charlie, Diana], inactive: [Bob] }`,
    },

    { type: 'heading', level: 2, text: 'Searching Arrays', id: 'searching' },
    {
      type: 'code', language: 'javascript', filename: 'searching.js',
      code: `const nums = [1, 2, 3, 4, 5, 3];

// find — first match (or undefined)
nums.find(n => n > 3);          // 4
nums.findIndex(n => n > 3);     // 3 (index)

// findLast / findLastIndex (ES2023)
nums.findLast(n => n === 3);       // 3 (last occurrence)
nums.findLastIndex(n => n === 3);  // 5

// includes — check existence (uses ===)
nums.includes(3);      // true
nums.includes(3, 4);   // true (search from index 4)

// indexOf / lastIndexOf — find position
nums.indexOf(3);       // 2 (first)
nums.lastIndexOf(3);   // 5 (last)
nums.indexOf(99);      // -1 (not found)

// some — at least one matches
nums.some(n => n > 4);     // true
nums.some(n => n > 10);    // false

// every — all match
nums.every(n => n > 0);    // true
nums.every(n => n > 3);    // false

// Practical: check if user exists
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const hasAlice = users.some(u => u.name === 'Alice'); // true
const alice = users.find(u => u.name === 'Alice');     // { id: 1, name: 'Alice' }`,
    },

    { type: 'heading', level: 2, text: 'Sorting Arrays', id: 'sorting' },
    { type: 'paragraph', text: '`sort()` sorts in-place and mutates the original array. Without a comparator, it converts elements to strings and sorts lexicographically.' },
    {
      type: 'code', language: 'javascript', filename: 'sorting.js',
      code: `// Default sort is lexicographic (string-based)
[10, 9, 2, 1, 21].sort();
// [1, 10, 2, 21, 9] — WRONG for numbers!

// Numeric sort — use comparator
[10, 9, 2, 1, 21].sort((a, b) => a - b);
// [1, 2, 9, 10, 21] — ascending

[10, 9, 2, 1, 21].sort((a, b) => b - a);
// [21, 10, 9, 2, 1] — descending

// Sort strings properly
const words = ['banana', 'Apple', 'cherry'];
words.sort(); // ['Apple', 'banana', 'cherry'] — uppercase first

// Case-insensitive sort
words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

// Sort objects by property
const users = [
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

users.sort((a, b) => a.age - b.age); // By age ascending
users.sort((a, b) => a.name.localeCompare(b.name)); // By name

// Non-mutating sort (ES2023)
const sorted = [3, 1, 2].toSorted((a, b) => a - b);
// sorted = [1, 2, 3], original unchanged

// toReversed (ES2023) — non-mutating reverse
const reversed = [1, 2, 3].toReversed(); // [3, 2, 1]`,
    },
    { type: 'callout', variant: 'warning', title: 'sort() Mutates!', text: '`sort()` modifies the original array. Use `toSorted()` (ES2023) or `[...arr].sort()` if you need a non-mutating sort.' },

    { type: 'heading', level: 2, text: 'Slicing & Splicing', id: 'slice-splice' },
    {
      type: 'code', language: 'javascript', filename: 'slice-splice.js',
      code: `// slice(start, end) — returns new array, does NOT mutate
const arr = [0, 1, 2, 3, 4, 5];
arr.slice(1, 4);    // [1, 2, 3] (end is exclusive)
arr.slice(2);       // [2, 3, 4, 5] (from index 2 to end)
arr.slice(-2);      // [4, 5] (last 2 elements)
arr.slice();        // [0, 1, 2, 3, 4, 5] (shallow copy)

// splice(start, deleteCount, ...items) — MUTATES original
const items = ['a', 'b', 'c', 'd', 'e'];

// Delete
items.splice(2, 1);           // Removes 'c' → ['a', 'b', 'd', 'e']

// Insert
items.splice(2, 0, 'x', 'y'); // Insert at 2 → ['a', 'b', 'x', 'y', 'd', 'e']

// Replace
items.splice(1, 2, 'z');      // Replace 2 items at 1 → ['a', 'z', 'y', 'd', 'e']

// Non-mutating version (ES2023)
const original = [1, 2, 3, 4, 5];
const modified = original.toSpliced(1, 2, 'a', 'b');
// modified = [1, 'a', 'b', 4, 5], original unchanged`,
    },

    { type: 'heading', level: 2, text: 'Flattening & Mapping', id: 'flat-flatmap' },
    {
      type: 'code', language: 'javascript', filename: 'flat.js',
      code: `// flat(depth) — flatten nested arrays
[1, [2, [3, [4]]]].flat();    // [1, 2, [3, [4]]] (depth 1)
[1, [2, [3, [4]]]].flat(2);   // [1, 2, 3, [4]] (depth 2)
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4] (all levels)

// flatMap — map + flat(1) in one step
const sentences = ['Hello World', 'Foo Bar'];
sentences.map(s => s.split(' '));
// [['Hello', 'World'], ['Foo', 'Bar']]

sentences.flatMap(s => s.split(' '));
// ['Hello', 'World', 'Foo', 'Bar'] — flattened!

// Practical: expand and filter in one pass
const orders = [
  { id: 1, items: ['apple', 'banana'] },
  { id: 2, items: ['cherry'] },
];
const allItems = orders.flatMap(o => o.items);
// ['apple', 'banana', 'cherry']

// Filter + transform with flatMap (use empty array to skip)
const nums = [1, 2, 3, 4, 5];
nums.flatMap(n => n % 2 === 0 ? [n * 2] : []);
// [4, 8] — even numbers doubled, odds skipped`,
    },

    { type: 'heading', level: 2, text: 'Destructuring & Spread', id: 'destructuring' },
    {
      type: 'code', language: 'javascript', filename: 'destructuring.js',
      code: `// Basic destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements
const [, , third] = [1, 2, 3]; // third = 3

// Default values
const [a = 0, b = 0, c = 0] = [1, 2];
// a = 1, b = 2, c = 0

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x]; // x = 2, y = 1

// Nested destructuring
const matrix = [[1, 2], [3, 4]];
const [[a1, b1], [a2, b2]] = matrix;

// Spread — copy and merge (shallow)
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2];     // [1, 2, 3, 4]
const withNew = [...arr1, 99, ...arr2]; // [1, 2, 99, 3, 4]

// Spread to convert iterables
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]
const chars = [...'hello']; // ['h', 'e', 'l', 'l', 'o']

// Spread as function arguments
const nums = [5, 3, 8, 1];
Math.max(...nums); // 8
Math.min(...nums); // 1`,
    },

    { type: 'heading', level: 2, text: 'Mutating vs Non-Mutating Methods', id: 'mutating' },
    { type: 'paragraph', text: 'Understanding which methods mutate the original array is critical. Non-mutating methods return new arrays, making them safer for functional programming and React state updates.' },
    {
      type: 'table',
      headers: ['Method', 'Returns', 'Mutates?', 'Non-Mutating Alternative'],
      rows: [
        ['push()', 'New length', 'Yes', '[...arr, item]'],
        ['pop()', 'Removed item', 'Yes', 'arr.slice(0, -1)'],
        ['shift()', 'Removed item', 'Yes', 'arr.slice(1)'],
        ['unshift()', 'New length', 'Yes', '[item, ...arr]'],
        ['splice()', 'Removed items', 'Yes', 'toSpliced() (ES2023)'],
        ['sort()', 'Sorted array', 'Yes', 'toSorted() (ES2023)'],
        ['reverse()', 'Reversed array', 'Yes', 'toReversed() (ES2023)'],
        ['fill()', 'Filled array', 'Yes', 'map()'],
        ['map()', 'New array', 'No', '—'],
        ['filter()', 'New array', 'No', '—'],
        ['reduce()', 'Accumulated value', 'No', '—'],
        ['slice()', 'New sub-array', 'No', '—'],
        ['concat()', 'New merged array', 'No', '—'],
        ['flat()', 'New flattened array', 'No', '—'],
      ],
    },

    { type: 'heading', level: 2, text: 'Array-Like Objects', id: 'array-like' },
    { type: 'paragraph', text: 'Some objects look like arrays (they have `length` and numeric keys) but are not real arrays. They lack array methods. Common examples: `arguments`, `NodeList`, `HTMLCollection`.' },
    {
      type: 'code', language: 'javascript', filename: 'array-like.js',
      code: `// arguments is array-like
function example() {
  console.log(arguments.length); // Works
  // arguments.map(x => x * 2);  // Error! No .map
  
  // Convert to real array
  const args = Array.from(arguments);
  const args2 = [...arguments];
}

// NodeList from querySelectorAll
const nodes = document.querySelectorAll('div');
// nodes.map(...)  // Error!
const divs = Array.from(nodes);
divs.map(div => div.textContent);

// Or use forEach directly (NodeList has forEach)
nodes.forEach(node => console.log(node));

// Custom array-like object
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
Array.from(arrayLike); // ['a', 'b', 'c']`,
    },

    { type: 'heading', level: 2, text: 'Advanced Patterns', id: 'advanced-patterns' },
    {
      type: 'code', language: 'javascript', filename: 'patterns.js',
      code: `// Remove duplicates
const unique = [...new Set([1, 2, 2, 3, 3, 3])];
// [1, 2, 3]

// Chunk array into groups of N
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, (i + 1) * size)
  );
}
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Array intersection
const intersection = (a, b) => a.filter(x => b.includes(x));
intersection([1, 2, 3], [2, 3, 4]); // [2, 3]

// Array difference
const difference = (a, b) => a.filter(x => !b.includes(x));
difference([1, 2, 3], [2, 3, 4]); // [1]

// Zip arrays
function zip(...arrays) {
  const length = Math.min(...arrays.map(a => a.length));
  return Array.from({ length }, (_, i) => arrays.map(a => a[i]));
}
zip(['a', 'b'], [1, 2]); // [['a', 1], ['b', 2]]

// Group by (ES2024 — Object.groupBy)
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
];
const grouped = Object.groupBy(users, u => u.role);
// { admin: [Alice, Charlie], user: [Bob] }`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Comparing arrays with ===
[1, 2] === [1, 2]  // false! (different references)
// Fix: Compare element by element or use JSON.stringify

// 2. Using delete on arrays (creates holes)
const arr = [1, 2, 3];
delete arr[1];
console.log(arr);     // [1, empty, 3] — sparse array!
console.log(arr.length); // 3 — length unchanged
// Fix: Use splice to remove elements

// 3. Sorting numbers without comparator
[10, 9, 2, 1].sort();  // [1, 10, 2, 9] — lexicographic!
// Fix: [10, 9, 2, 1].sort((a, b) => a - b)

// 4. Forgetting that map/filter return new arrays
const nums = [1, 2, 3];
nums.map(n => n * 2);  // Returns [2, 4, 6] but discarded!
// Fix: const doubled = nums.map(n => n * 2);

// 5. Modifying array while iterating
const items = [1, 2, 3, 4, 5];
items.forEach((item, i) => {
  if (item === 3) items.splice(i, 1); // Dangerous!
});
// Fix: Filter instead: items.filter(item => item !== 3)

// 6. Spread only does shallow copy
const nested = [[1, 2], [3, 4]];
const copy = [...nested];
copy[0].push(99);
console.log(nested[0]); // [1, 2, 99] — inner array shared!
// Fix: structuredClone(nested)`,
    },

    { type: 'heading', level: 2, text: 'Performance Tips', id: 'performance' },
    {
      type: 'list',
      items: [
        '`push`/`pop` are O(1) — much faster than `unshift`/`shift` which are O(n)',
        'Pre-allocate arrays with known size: `new Array(n)` is faster than repeated pushes',
        'Use `Set` for frequent `includes()` checks on large arrays — O(1) vs O(n)',
        'Avoid creating intermediate arrays in chains: consider a single `reduce` for complex transformations',
        '`for` loops are slightly faster than `forEach`/`map` in hot paths',
        'Use `TypedArrays` (Int32Array, Float64Array) for numeric data — faster and less memory',
        '`flatMap` is faster than separate `.map().flat()` calls',
        'Use `findIndex` + `splice` instead of `filter` when removing a single known element',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Prefer non-mutating methods (map, filter, slice) over mutating ones (push, splice, sort)',
        'Use `Array.isArray()` to check if something is an array — never `typeof` or `instanceof`',
        'Use `for...of` for simple iteration, `forEach` when you need the index',
        'Chain methods for readable data transformations',
        'Use destructuring for clean access to array elements',
        'Use `Set` when you need unique values',
        'Use `at(-1)` instead of `arr[arr.length - 1]` for last element access',
        'Use `structuredClone()` for deep copies of nested arrays',
        'Prefer `flatMap` when you need to map and flatten in one step',
      ],
    },
  ],
};
