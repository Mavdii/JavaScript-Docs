import type { ReferenceContent } from '@/types/content';

export const arrayFlatFlatMapReference: ReferenceContent = {
  id: 'reference-array-flat-flatmap',
  title: 'flat() & flatMap()',
  description: 'Flatten nested arrays or map and flatten in one operation.',
  slug: 'reference/array/flat-flatmap',
  pillar: 'reference',
  category: 'array-methods',
  tags: ['array', 'flat', 'flatmap', 'nested', 'flatten', 'es2019'],
  difficulty: 'intermediate',
  contentType: 'reference',
  summary: 'flat() removes nesting from multi-dimensional arrays. flatMap() does map() then flat() in one step.',
  relatedTopics: ['array-map', 'array-reduce', 'spread-operator'],
  order: 10,
  updatedAt: '2025-06-01',
  readingTime: 9,
  featured: false,
  keywords: ['flat', 'flatmap', 'flatten', 'nested arrays', 'dimensions'],
  signature: 'array.flat(depth?) and array.flatMap(callbackFn, thisArg?)',
  parameters: [
    { name: 'depth', type: 'number', description: 'How many levels deep to flatten. Default is 1. Use Infinity for complete flattening.', optional: true },
    { name: 'callbackFn', type: '(element: T, index: number, array: T[]) => U | U[]', description: 'Function that returns either a value or array of values.' }
  ],
  returnValue: { type: 'U[]', description: 'A new flattened array.' },
  compatibility: 'ES2019 (ES10) — Modern browsers, Node.js 11.0+',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'flat() recursively flattens an array up to a specified depth, removing empty slots. flatMap() combines map() and flat() into a single operation — it maps each element to a new value (which may be an array) and then flattens the result.' },
    { type: 'callout', variant: 'info', title: 'Two Similar But Different Methods', text: 'Use flat() when you have nested arrays and want to flatten them. Use flatMap() when you want to transform each element and potentially split it into multiple results.' },

    { type: 'heading', level: 2, text: 'Basic flat() Usage', id: 'basic-flat' },
    { type: 'code', language: 'javascript', filename: 'flat-basic.js', code: `const nested = [1, 2, [3, 4], 5];

// Default: flatten one level
const flat1 = nested.flat();
console.log(flat1); // [1, 2, 3, 4, 5]

const deeply = [1, [2, [3, [4, [5]]]]];

// Flatten 2 levels
const flat2 = deeply.flat(2);
console.log(flat2); // [1, 2, 3, [4, [5]]]

// Flatten all levels
const flatAll = deeply.flat(Infinity);
console.log(flatAll); // [1, 2, 3, 4, 5]

// Original unchanged
console.log(deeply); // [1, [2, [3, [4, [5]]]]]` },

    { type: 'heading', level: 2, text: 'Real-World: Processing Nested Data', id: 'nested-data' },
    { type: 'paragraph', text: 'flat() is useful when dealing with hierarchical data that needs to be displayed in a flat list.' },
    { type: 'code', language: 'javascript', filename: 'flat-nested-data.js', code: `// E-commerce categories with subcategories
const categories = [
  { name: 'Electronics', subcats: ['Phones', 'Laptops'] },
  { name: 'Clothing', subcats: ['Shirts', 'Pants'] },
  { name: 'Books' }
];

// Extract all items (flattening structure)
const allItems = categories
  .map(cat => [cat.name, ...(cat.subcats || [])])
  .flat();
console.log(allItems);
// ['Electronics', 'Phones', 'Laptops', 'Clothing', 'Shirts', 'Pants', 'Books']

// Or with flatMap (cleaner)
const items = categories.flatMap(cat => [
  cat.name,
  ...(cat.subcats || [])
]);
console.log(items);
// ['Electronics', 'Phones', 'Laptops', 'Clothing', 'Shirts', 'Pants', 'Books']` },

    { type: 'heading', level: 2, text: 'Removing Empty Slots', id: 'empty-slots' },
    { type: 'paragraph', text: 'flat() automatically removes empty slots (holes) in arrays, which is a bonus feature.' },
    { type: 'code', language: 'javascript', filename: 'flat-holes.js', code: `// Sparse array with holes
const sparse = [1, , 3, , [5, , 7]];

// flat() removes the holes
const cleaned = sparse.flat();
console.log(cleaned); // [1, 3, 5, 7] — no holes!

// Original still has holes
console.log(sparse.length); // 5
console.log(4 in sparse); // false (hole at index 4)

// Useful for cleaning up array data
const messyData = [1, undefined, null, 2, [3, undefined, 4]];
const cleaned2 = messyData
  .flat()
  .filter(x => x != null);
console.log(cleaned2); // [1, 2, 3, 4]` },

    { type: 'heading', level: 2, text: 'Introduction to flatMap()', id: 'flatmap-intro' },
    { type: 'paragraph', text: 'flatMap() maps each element to a new value (which can be an array) and then flattens the result one level. It\'s equivalent to map().flat() but more efficient.' },
    { type: 'code', language: 'javascript', filename: 'flatmap-basic.js', code: `const words = ['hello', 'world', 'js'];

// Split each word into characters (returns arrays)
const chars = words.flatMap(word => word.split(''));
console.log(chars);
// ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd', 'j', 's']

// Duplicate each number
const nums = [1, 2, 3];
const doubled = nums.flatMap(n => [n, n]);
console.log(doubled); // [1, 1, 2, 2, 3, 3]

// Conditional results
const mixed = [1, 2, 3, 4, 5];
const result = mixed.flatMap(n =>
  n % 2 === 0 ? [n, n * 2] : n
);
console.log(result); // [1, 2, 4, 3, 4, 8, 5]` },

    { type: 'heading', level: 2, text: 'flatMap() vs map().flat()', id: 'flatmap-vs-mapflat' },
    { type: 'code', language: 'javascript', filename: 'flatmap-comparison.js', code: `const users = [
  { id: 1, roles: ['admin', 'user'] },
  { id: 2, roles: ['user'] },
  { id: 3, roles: ['user', 'moderator'] }
];

// Using map().flat() — less efficient
const rolesMapFlat = users
  .map(user => user.roles)
  .flat();
console.log(rolesMapFlat);
// ['admin', 'user', 'user', 'user', 'moderator']

// Using flatMap() — more efficient
const rolesFlatMap = users.flatMap(user => user.roles);
console.log(rolesFlatMap);
// ['admin', 'user', 'user', 'user', 'moderator']

// Performance: flatMap does map() and flat() in one pass
// map().flat() creates an intermediate array

// Bonus: flatMap allows access to index
const withIndex = users.flatMap((user, idx) =>
  user.roles.map(role => \`User \${idx}: \${role}\`)
);` },

    { type: 'heading', level: 2, text: 'Advanced flatMap() Patterns', id: 'flatmap-advanced' },
    { type: 'code', language: 'javascript', filename: 'flatmap-advanced.js', code: `// Generate all combinations (Cartesian product)
const colors = ['red', 'blue'];
const sizes = ['S', 'M', 'L'];

const combinations = colors.flatMap(color =>
  sizes.map(size => \`\${color}-\${size}\`)
);
console.log(combinations);
// ['red-S', 'red-M', 'red-L', 'blue-S', 'blue-M', 'blue-L']

// Conditional filtering with flatMap
const numbers = [1, 2, 3, 4, 5, 6];
const filtered = numbers.flatMap(n =>
  n % 2 === 0 ? [n] : []  // Include only even, exclude odd
);
console.log(filtered); // [2, 4, 6]

// Expanding search results
const searchResults = [
  { id: 1, tags: ['javascript', 'web'] },
  { id: 2, tags: ['typescript', 'types'] }
];

const byTag = searchResults.flatMap(result =>
  result.tags.map(tag => ({ resultId: result.id, tag }))
);
console.log(byTag);
// [
//   { resultId: 1, tag: 'javascript' },
//   { resultId: 1, tag: 'web' },
//   { resultId: 2, tag: 'typescript' },
//   { resultId: 2, tag: 'types' }
// ]` },

    { type: 'heading', level: 2, text: 'Practical: API Response Processing', id: 'api-processing' },
    { type: 'code', language: 'javascript', filename: 'flatmap-api.js', code: `// API returns paginated results grouped by page
const apiResponse = [
  {
    page: 1,
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]
  },
  {
    page: 2,
    items: [
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' }
    ]
  }
];

// Flatten to get all items
const allItems = apiResponse.flatMap(page => page.items);
console.log(allItems);
// [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }, { id: 4, ... }]

// With transformation
const itemNames = apiResponse.flatMap(page =>
  page.items.map(item => item.name)
);
console.log(itemNames); // ['Item 1', 'Item 2', 'Item 3', 'Item 4']

// With filtering
const filtered = apiResponse.flatMap(page =>
  page.items.filter(item => item.id > 2)
);
console.log(filtered); // [{ id: 3, ... }, { id: 4, ... }]` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'mistakes' },
    { type: 'code', language: 'javascript', filename: 'flat-mistakes.js', code: `// ❌ Mistake 1: flat() with default depth — doesn't flatten everything
const deeply = [1, [2, [3, [4]]]];
deeply.flat(); // [1, 2, [3, [4]]] — only goes 1 level!
deeply.flat(Infinity); // [1, 2, 3, 4] — correct!

// ❌ Mistake 2: Confusing flat() and flatMap()
const nums = [1, 2, 3];

// This does NOT work as expected:
nums.flat(x => x * 2); // Error or unexpected result

// flatMap is what you want:
nums.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]

// ❌ Mistake 3: Expecting flatMap to flatten multiple levels
const multi = [1, [2, [3]]];
multi.flatMap(x => x); // [1, 2, [3]] — only 1 level!
multi.flat(Infinity); // [1, 2, 3] — correct for complete flatten

// ❌ Mistake 4: Using flat() for filtering
// ❌ WRONG: flat() doesn't filter based on condition
[1, 2, 3].flat(); // Returns original array

// ✅ CORRECT: Use flatMap for conditional results
[1, 2, 3, 4].flatMap(n => n > 2 ? [n] : []); // [3, 4]` },

    { type: 'heading', level: 2, text: 'Browser Support and Polyfill', id: 'support' },
    { type: 'code', language: 'javascript', filename: 'flat-polyfill.js', code: `// Simple polyfill for flat()
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    return this.reduce((flat, toFlatten) => {
      return flat.concat(
        (Array.isArray(toFlatten) && depth > 1)
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  };
}

// Simple polyfill for flatMap()
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    return this.map(callback, thisArg).flat();
  };
}

// Now you can use them safely even in older browsers
const result = [1, 2, [3, 4]].flat(); // Works!` },

    { type: 'heading', level: 2, text: 'Comparison: flat() vs Spread vs Reduce', id: 'comparison-methods' },
    { type: 'table', headers: ['Method', 'Depth', 'Readability', 'Performance', 'Best For'], rows: [
      ['flat()', 'Configurable', 'Excellent', 'Good', 'Flatten nested arrays'],
      ['flatMap()', '1 level only', 'Excellent', 'Excellent', 'Map + flatten together'],
      ['Spread (...)', '1 level only', 'Good', 'Good', 'Shallow flatten'],
      ['reduce()', 'Custom', 'Complex', 'Varies', 'Complex transformations'],
    ]},

    { type: 'heading', level: 2, text: 'Real-World Examples', id: 'real-world' },
    { type: 'code', language: 'javascript', filename: 'flatmap-realworld.js', code: `// E-commerce: Get all product variants
const products = [
  {
    name: 'T-Shirt',
    variants: [
      { color: 'red', sizes: ['S', 'M', 'L'] },
      { color: 'blue', sizes: ['M', 'L', 'XL'] }
    ]
  },
  {
    name: 'Jeans',
    variants: [
      { color: 'black', sizes: ['30', '32', '34'] }
    ]
  }
];

// Get all unique size options
const allSizes = products
  .flatMap(p => p.variants)
  .flatMap(v => v.sizes);
console.log(allSizes); // ['S', 'M', 'L', 'M', 'L', 'XL', '30', '32', '34']

// Social media: Flatten comment threads
const posts = [
  {
    id: 1,
    comments: [
      { id: 'c1', author: 'Alice' },
      { id: 'c2', author: 'Bob' }
    ]
  },
  {
    id: 2,
    comments: [
      { id: 'c3', author: 'Charlie' }
    ]
  }
];

const allComments = posts.flatMap(post => post.comments);

// File system: Find all files recursively
const dir = {
  name: 'root',
  files: ['a.txt', 'b.txt'],
  subdirs: [
    {
      name: 'sub1',
      files: ['c.txt'],
      subdirs: []
    }
  ]
};

function getAllFiles(directory) {
  return [
    ...directory.files,
    ...directory.subdirs.flatMap(getAllFiles)
  ];
}` },
  ],
};
