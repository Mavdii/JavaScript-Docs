import type { ReferenceContent } from '@/types/content';

export const arrayMapReference: ReferenceContent = {
  id: 'array-map',
  title: 'Array.prototype.map()',
  description:
    'Transform each element in an array and get a new array back.',
  slug: 'reference/array/map',
  pillar: 'reference',
  category: 'array',
  tags: ['array', 'methods', 'transformation', 'functional'],
  difficulty: 'beginner',
  contentType: 'reference',
  summary:
    'map() lets you transform every element and get a new array. The original stays untouched.',
  relatedTopics: ['closures', 'debouncing'],
  order: 1,
  updatedAt: '2024-03-01',
  readingTime: 8,
  featured: true,
  keywords: ['map', 'array', 'transform', 'callback', 'functional programming'],
  signature: 'array.map(callbackFn, thisArg?)',
  parameters: [
    {
      name: 'callbackFn',
      type: '(element, index, array) => T',
      description:
        'Function called for every element of the array. The return value is added to the new array.',
    },
    {
      name: 'thisArg',
      type: 'any',
      description: 'Value to use as `this` when executing callbackFn.',
      optional: true,
    },
  ],
  returnValue: {
    type: 'T[]',
    description: 'A new array with each element being the result of the callback function.',
  },
  compatibility: 'ES5+ — All modern browsers, Node.js 0.10+',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    {
      type: 'paragraph',
      text: 'The map() method creates a new array populated with the results of calling a provided function on every element in the calling array. It calls the function once for each element, in order, and constructs a new array from the results.',
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Pure Transformation',
      text: 'map() does not mutate the original array. It always returns a new array of the same length as the original.',
    },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic-usage' },
    {
      type: 'code',
      language: 'javascript',
      filename: 'basic-map.js',
      code: `const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const strings = numbers.map(String);
console.log(strings); // ["1", "2", "3", "4", "5"]`,
    },

    { type: 'heading', level: 2, text: 'Using Index and Array Parameters', id: 'index-array' },
    {
      type: 'paragraph',
      text: 'The callback receives three arguments: the current element, its index, and the full array.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'map-with-index.js',
      code: `const items = ['apple', 'banana', 'cherry'];

const labeled = items.map((item, index) =>
  (index + 1) + '. ' + item
);
console.log(labeled);
// ["1. apple", "2. banana", "3. cherry"]`,
    },

    { type: 'heading', level: 2, text: 'Mapping Objects', id: 'mapping-objects' },
    {
      type: 'paragraph',
      text: 'map() is commonly used to transform arrays of objects, extracting or reshaping data.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'map-objects.js',
      code: `const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

// Extract names
const names = users.map(user => user.name);
console.log(names); // ["Alice", "Bob", "Charlie"]

// Reshape data
const cards = users.map(user => ({
  label: user.name,
  value: user.id,
}));`,
    },

    { type: 'heading', level: 2, text: 'Chaining with Other Methods', id: 'chaining' },
    {
      type: 'paragraph',
      text: 'Since map() returns a new array, it chains naturally with filter(), reduce(), and other array methods.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'map-chaining.js',
      code: `const products = [
  { name: 'Laptop', price: 999, inStock: true },
  { name: 'Mouse', price: 25, inStock: false },
  { name: 'Keyboard', price: 75, inStock: true },
  { name: 'Monitor', price: 450, inStock: true },
];

const availableNames = products
  .filter(p => p.inStock)
  .map(p => p.name);
// ["Laptop", "Keyboard", "Monitor"]

const total = products
  .filter(p => p.inStock)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);
// 1524`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'callout',
      variant: 'warning',
      title: "Don’t forget to return",
      text: 'Arrow functions with curly braces require an explicit return statement. Omitting it produces an array of undefined values.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'map-mistakes.js',
      code: `// Wrong — no return
const bad = [1, 2, 3].map(n => { n * 2 });
// [undefined, undefined, undefined]

// Correct — explicit return
const good = [1, 2, 3].map(n => { return n * 2 });
// [2, 4, 6]

// Better — concise arrow
const best = [1, 2, 3].map(n => n * 2);
// [2, 4, 6]`,
    },

    { type: 'heading', level: 3, text: 'parseInt Pitfall', id: 'parseint' },
    {
      type: 'code',
      language: 'javascript',
      filename: 'parseint-pitfall.js',
      code: `// Unexpected behavior
['1', '2', '3'].map(parseInt);
// [1, NaN, NaN]

// parseInt receives (string, radix) where radix = index
// parseInt('1', 0) → 1
// parseInt('2', 1) → NaN
// parseInt('3', 2) → NaN

// Fix: use Number or be explicit
['1', '2', '3'].map(Number);        // [1, 2, 3]
['1', '2', '3'].map(s => parseInt(s, 10)); // [1, 2, 3]`,
    },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    {
      type: 'list',
      items: [
        'map() skips empty slots in sparse arrays but preserves them in the output',
        'map() does not mutate the original array, but the callback can',
        'If the array is modified during map(), the behavior follows the iteration protocol',
        'map() always returns an array of the same length as the input',
      ],
    },

    { type: 'heading', level: 2, text: 'When to Use map() vs Alternatives', id: 'when-to-use' },
    {
      type: 'table',
      headers: ['Method', 'Purpose', 'Returns'],
      rows: [
        ['map()', 'Transform each element', 'New array (same length)'],
        ['forEach()', 'Side effects for each element', 'undefined'],
        ['filter()', 'Keep elements matching a condition', 'New array (possibly shorter)'],
        ['reduce()', 'Accumulate into a single value', 'Any type'],
        ['flatMap()', 'Map + flatten one level', 'New array'],
      ],
    },
  ],
};
