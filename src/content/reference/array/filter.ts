import type { ReferenceContent } from '@/types/content';
export const arrayFilterReference: ReferenceContent = {
  id: 'array-filter', title: 'Array.prototype.filter()', description: 'Keep only the array elements that pass a test.', slug: 'reference/array/filter', pillar: 'reference', category: 'array', tags: ['array','filter','predicate','functional'], difficulty: 'beginner', contentType: 'reference', summary: 'filter() keeps only elements where your test returns true. The original array stays safe.', relatedTopics: ['array-map','array-find','array-some-every'], order: 2, updatedAt: '2024-03-01', readingTime: 8, featured: false, keywords: ['filter','array','predicate','Boolean','truthy'],
  signature: 'array.filter(callbackFn, thisArg?)',
  parameters: [{ name: 'callbackFn', type: '(element, index, array) => boolean', description: 'Function that tests each element. Return true to keep the element.' }, { name: 'thisArg', type: 'any', description: 'Value to use as this when executing callbackFn.', optional: true }],
  returnValue: { type: 'T[]', description: 'A new array with elements that passed the test. May be empty.' },
  compatibility: 'ES5+ — All modern browsers, Node.js 0.10+',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'The filter() method creates a shallow copy of a portion of an array, filtered down to just the elements that pass a test implemented by the provided function. It does not modify the original array and always returns a new array (even if empty).' },
    { type: 'callout', variant: 'info', title: 'Pure Filtering', text: 'filter() never mutates the original array. It returns a new array that may be shorter than or equal in length to the original — never longer.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic-usage' },
    { type: 'code', language: 'javascript', filename: 'filter-basic.js', code: `const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Keep only even numbers
const even = nums.filter(n => n % 2 === 0);
console.log(even); // [2, 4, 6, 8, 10]

// Keep numbers greater than 5
const big = nums.filter(n => n > 5);
console.log(big); // [6, 7, 8, 9, 10]

// Original is unchanged
console.log(nums); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` },

    { type: 'heading', level: 2, text: 'Filtering Objects', id: 'filtering-objects' },
    { type: 'paragraph', text: 'filter() is commonly used with arrays of objects to select items matching specific criteria.' },
    { type: 'code', language: 'javascript', filename: 'filter-objects.js', code: `const users = [
  { name: 'Alice', active: true, age: 28 },
  { name: 'Bob', active: false, age: 35 },
  { name: 'Charlie', active: true, age: 22 },
  { name: 'Diana', active: true, age: 31 },
];

// Active users
const active = users.filter(u => u.active);
// [{ name: 'Alice', ... }, { name: 'Charlie', ... }, { name: 'Diana', ... }]

// Active users over 25
const seniorActive = users.filter(u => u.active && u.age > 25);
// [{ name: 'Alice', ... }, { name: 'Diana', ... }]` },

    { type: 'heading', level: 2, text: 'Using Index and Array Parameters', id: 'index-array' },
    { type: 'paragraph', text: 'The callback receives three arguments: the current element, its index, and the full array.' },
    { type: 'code', language: 'javascript', filename: 'filter-index.js', code: `// Keep elements at even indices
const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
const everyOther = letters.filter((_, index) => index % 2 === 0);
// ['a', 'c', 'e']

// Remove duplicates (using indexOf trick)
const withDupes = [1, 2, 3, 2, 4, 1, 5];
const unique = withDupes.filter((value, index, self) =>
  self.indexOf(value) === index
);
// [1, 2, 3, 4, 5]` },

    { type: 'heading', level: 2, text: 'Removing Falsy Values', id: 'remove-falsy' },
    { type: 'paragraph', text: 'Passing Boolean as the callback is a popular pattern to remove all falsy values (0, "", null, undefined, NaN, false) from an array.' },
    { type: 'code', language: 'javascript', filename: 'filter-boolean.js', code: `const messy = [0, 'hello', '', null, 42, undefined, false, 'world', NaN];

const clean = messy.filter(Boolean);
// ['hello', 42, 'world']

// Be careful: this removes 0 and '' which may be valid!
const numbers = [0, 1, 2, 3];
numbers.filter(Boolean); // [1, 2, 3] — 0 is removed!

// If you want to keep 0 but remove null/undefined:
const safe = messy.filter(x => x != null);
// [0, 'hello', '', 42, false, NaN]` },
    { type: 'callout', variant: 'warning', title: 'Boolean Trap', text: 'filter(Boolean) removes ALL falsy values, including 0, empty strings, and false. If these are valid in your data, use a more specific predicate.' },

    { type: 'heading', level: 2, text: 'Chaining with Other Methods', id: 'chaining' },
    { type: 'paragraph', text: 'Since filter() returns a new array, it chains naturally with map(), reduce(), sort(), and other array methods.' },
    { type: 'code', language: 'javascript', filename: 'filter-chain.js', code: `const products = [
  { name: 'Laptop', price: 999, inStock: true },
  { name: 'Mouse', price: 25, inStock: false },
  { name: 'Keyboard', price: 75, inStock: true },
  { name: 'Monitor', price: 450, inStock: true },
  { name: 'Cable', price: 10, inStock: true },
];

// Names of available products over $50
const premiumAvailable = products
  .filter(p => p.inStock)
  .filter(p => p.price > 50)
  .map(p => p.name);
// ['Laptop', 'Keyboard', 'Monitor']

// Total cost of available products
const totalCost = products
  .filter(p => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
// 1534` },

    { type: 'heading', level: 2, text: 'Search / Text Filtering', id: 'text-filtering' },
    { type: 'code', language: 'javascript', filename: 'filter-search.js', code: `const cities = ['New York', 'Los Angeles', 'New Orleans', 'San Francisco', 'Newark'];

function searchCities(query) {
  const q = query.toLowerCase();
  return cities.filter(city => city.toLowerCase().includes(q));
}

searchCities('new');   // ['New York', 'New Orleans', 'Newark']
searchCities('san');   // ['San Francisco']
searchCities('xyz');   // []` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'filter-mistakes.js', code: `// ❌ Mistake 1: Using filter for side effects (use forEach instead)
const results = [];
[1, 2, 3].filter(n => {
  results.push(n * 2); // Side effect in filter — bad practice
  return true;
});

// ❌ Mistake 2: Forgetting that filter returns a NEW array
const arr = [1, 2, 3, 4];
arr.filter(n => n > 2);
console.log(arr); // [1, 2, 3, 4] — original unchanged!
// You need to capture the return value:
const filtered = arr.filter(n => n > 2); // [3, 4]

// ❌ Mistake 3: Returning assignment instead of comparison
const nums = [1, 2, 3];
nums.filter(n => n = 2); // Always truthy! Should be n === 2

// ❌ Mistake 4: Using filter when you need just one result
// Use find() instead of filter()[0]
const user = users.filter(u => u.id === 5)[0]; // Scans entire array
const user2 = users.find(u => u.id === 5);      // Stops at first match` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'filter() on an empty array returns an empty array',
      'If no elements pass the test, an empty array is returned',
      'filter() skips empty slots in sparse arrays',
      'The callback can access elements added during iteration, but filter iterates over the original length',
      'filter() creates a shallow copy — object references are shared',
    ]},
    { type: 'code', language: 'javascript', filename: 'filter-edge.js', code: `// Sparse arrays: empty slots are skipped
const sparse = [1, , , 4, , 6];
sparse.filter(n => true); // [1, 4, 6] — holes removed!

// Shallow copy: objects are shared references
const original = [{ count: 1 }, { count: 2 }];
const filtered = original.filter(o => o.count > 0);
filtered[0].count = 99;
console.log(original[0].count); // 99 — same reference!` },

    { type: 'heading', level: 2, text: 'Performance Notes', id: 'performance' },
    { type: 'paragraph', text: 'filter() always iterates through every element — it cannot short-circuit. For very large arrays, consider whether you can combine operations or use a single reduce() call instead of chained filter().map().' },
    { type: 'code', language: 'javascript', filename: 'filter-perf.js', code: `// Two iterations:
const result = bigArray
  .filter(x => x.active)
  .map(x => x.name);

// Single iteration with reduce:
const result2 = bigArray.reduce((acc, x) => {
  if (x.active) acc.push(x.name);
  return acc;
}, []);

// Or with flatMap:
const result3 = bigArray.flatMap(x =>
  x.active ? [x.name] : []
);` },

    { type: 'heading', level: 2, text: 'TypeScript Type Narrowing', id: 'type-narrowing' },
    { type: 'paragraph', text: 'In TypeScript, filter() can narrow types when used with a type predicate.' },
    { type: 'code', language: 'typescript', filename: 'filter-typescript.ts', code: `const mixed: (string | null | undefined)[] = ['hello', null, 'world', undefined];

// Without type predicate: result is still (string | null | undefined)[]
const strings1 = mixed.filter(x => x != null);

// With type predicate: result is string[]
const strings2 = mixed.filter((x): x is string => x != null);

// Works great with discriminated unions
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number };

const shapes: Shape[] = [/*...*/];
const circles = shapes.filter(
  (s): s is Extract<Shape, { kind: 'circle' }> => s.kind === 'circle'
);
// circles is { kind: 'circle'; radius: number }[]` },

    { type: 'heading', level: 2, text: 'When to Use filter() vs Alternatives', id: 'when-to-use' },
    { type: 'table', headers: ['Method', 'Purpose', 'Returns'], rows: [
      ['filter()', 'Keep elements matching a condition', 'New array (possibly shorter)'],
      ['find()', 'Get first matching element', 'Element or undefined'],
      ['some()', 'Check if any match', 'boolean'],
      ['every()', 'Check if all match', 'boolean'],
      ['map()', 'Transform each element', 'New array (same length)'],
      ['reduce()', 'Accumulate into single value', 'Any type'],
    ]},

    { type: 'heading', level: 2, text: 'Real-World Patterns', id: 'real-world' },
    { type: 'code', language: 'javascript', filename: 'filter-real-world.js', code: `// Permission-based UI filtering
const menuItems = allMenuItems.filter(item =>
  item.requiredRole === 'public' || user.roles.includes(item.requiredRole)
);

// Date range filtering
const recentOrders = orders.filter(order => {
  const orderDate = new Date(order.createdAt);
  return orderDate >= startDate && orderDate <= endDate;
});

// Multi-criteria search
function applyFilters(items, filters) {
  return items.filter(item =>
    (!filters.category || item.category === filters.category) &&
    (!filters.minPrice || item.price >= filters.minPrice) &&
    (!filters.maxPrice || item.price <= filters.maxPrice) &&
    (!filters.search || item.name.toLowerCase().includes(filters.search.toLowerCase()))
  );
}` },
  ],
};
