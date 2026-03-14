import type { ReferenceContent } from '@/types/content';

export const arrayMapReference: ReferenceContent = {
  id: 'reference-array-map',
  title: 'Array.prototype.map()',
  description: 'Transform each element in an array using a function, returning a new array of the same length.',
  slug: 'reference/array/map',
  pillar: 'reference',
  category: 'array-methods',
  tags: ['array', 'map', 'transformation', 'functional', 'es5'],
  difficulty: 'beginner',
  contentType: 'reference',
  summary: 'map() applies a function to every element and returns a new array with the results. Perfect for transforming data.',
  relatedTopics: ['array-filter', 'array-reduce', 'array-foreach'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 8,
  featured: true,
  keywords: ['map', 'transform', 'functional programming', 'iteration'],
  signature: 'array.map(callbackFn(element, index, array), thisArg?)',
  parameters: [
    { name: 'callbackFn', type: '(element: T, index: number, array: T[]) => U', description: 'Function to call for every array element. Should return the new value.' },
    { name: 'thisArg', type: 'any', description: 'Value to use as this when executing callbackFn.', optional: true }
  ],
  returnValue: { type: 'U[]', description: 'A new array with each element transformed by the callback function.' },
  compatibility: 'ES5+ — All modern browsers, Node.js 0.10+',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'The map() method creates a new array populated with the results of calling a provided function on every element in the calling array. It does not modify the original array and always returns an array of the same length as the input (empty slots are preserved).' },
    { type: 'callout', variant: 'info', title: 'Pure Transformation', text: 'map() is immutable — it never changes the original array. It always returns a new array with the same number of elements.' },

    { type: 'heading', level: 2, text: 'Basic Numeric Transformation', id: 'basic-numeric' },
    { type: 'code', language: 'javascript', filename: 'map-numeric.js', code: `const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
console.log(numbers); // [1, 2, 3, 4, 5] — original unchanged

// Square each number
const squared = numbers.map(n => n ** 2);
console.log(squared); // [1, 4, 9, 16, 25]

// Convert to strings
const strings = numbers.map(n => n.toString());
console.log(strings); // ['1', '2', '3', '4', '5']` },

    { type: 'heading', level: 2, text: 'Transforming Objects', id: 'transforming-objects' },
    { type: 'paragraph', text: 'map() is powerful for extracting specific properties from an array of objects or creating new object shapes.' },
    { type: 'code', language: 'javascript', filename: 'map-objects.js', code: `const users = [
  { id: 1, name: 'Alice', age: 28 },
  { id: 2, name: 'Bob', age: 35 },
  { id: 3, name: 'Charlie', age: 22 }
];

// Extract just names
const names = users.map(user => user.name);
console.log(names); // ['Alice', 'Bob', 'Charlie']

// Create new objects with selected properties
const userSummaries = users.map(user => ({
  id: user.id,
  displayName: user.name.toUpperCase()
}));
// [{ id: 1, displayName: 'ALICE' }, ...]

// Apply calculations
const userWithYearBorn = users.map(user => ({
  ...user,
  yearBorn: new Date().getFullYear() - user.age
}));` },

    { type: 'heading', level: 2, text: 'Using Index and Array Parameters', id: 'index-array-params' },
    { type: 'paragraph', text: 'The callback receives three parameters: the element, its index in the array, and the entire array.' },
    { type: 'code', language: 'javascript', filename: 'map-with-index.js', code: `const letters = ['a', 'b', 'c', 'd'];

// Create pairs of [letter, index]
const indexed = letters.map((letter, index) => [letter, index]);
console.log(indexed); // [['a', 0], ['b', 1], ['c', 2], ['d', 3]]

// Add 1-based ranking
const ranked = letters.map((letter, index) => \`\${index + 1}. \${letter}\`);
console.log(ranked); // ['1. a', '2. b', '3. c', '4. d']

// Access the original array
const withLength = letters.map((letter, _, arr) => \`\${letter} of \${arr.length}\`);
console.log(withLength); // ['a of 4', 'b of 4', 'c of 4', 'd of 4']` },

    { type: 'heading', level: 2, text: 'Parsing and Formatting', id: 'parsing-formatting' },
    { type: 'code', language: 'javascript', filename: 'map-parsing.js', code: `// Parse strings to numbers
const stringNumbers = ['1', '2.5', '3.14', '42'];
const parsed = stringNumbers.map(Number);
console.log(parsed); // [1, 2.5, 3.14, 42]

// Format prices
const prices = [10.5, 20, 15.75, 8.99];
const formatted = prices.map(price => \`$\${price.toFixed(2)}\`);
console.log(formatted); // ['$10.50', '$20.00', '$15.75', '$8.99']

// Extract date parts
const dates = ['2024-01-15', '2024-06-20', '2024-12-25'];
const years = dates.map(date => date.split('-')[0]);
console.log(years); // ['2024', '2024', '2024']

// Uppercase transformation
const words = ['hello', 'world', 'javascript'];
const upperWords = words.map(word => word.toUpperCase());
console.log(upperWords); // ['HELLO', 'WORLD', 'JAVASCRIPT']` },

    { type: 'heading', level: 2, text: 'Chaining with Other Array Methods', id: 'chaining' },
    { type: 'paragraph', text: 'Since map() returns a new array, it chains perfectly with filter(), reduce(), sort(), and other array methods.' },
    { type: 'code', language: 'javascript', filename: 'map-chaining.js', code: `const products = [
  { name: 'Laptop', price: 999, inStock: true },
  { name: 'Mouse', price: 25, inStock: false },
  { name: 'Keyboard', price: 75, inStock: true },
  { name: 'Monitor', price: 450, inStock: true }
];

// Get formatted names of in-stock products over $50
const result = products
  .filter(p => p.inStock && p.price > 50)
  .map(p => \`\${p.name} ($\${p.price})\`);
console.log(result); // ['Keyboard ($75)', 'Monitor ($450)', 'Laptop ($999)']

// Calculate total price of available items
const total = products
  .filter(p => p.inStock)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);
console.log(total); // 1524

// Sort by price after transformation
const sorted = products
  .map(p => ({ name: p.name, price: p.price }))
  .sort((a, b) => a.price - b.price);` },

    { type: 'heading', level: 2, text: 'Using map() with Strings', id: 'string-mapping' },
    { type: 'code', language: 'javascript', filename: 'map-strings.js', code: `// Convert string to array of character codes
const word = 'hello';
const codes = [...word].map(char => char.charCodeAt(0));
console.log(codes); // [104, 101, 108, 108, 111]

// Convert back
const decoded = codes.map(code => String.fromCharCode(code)).join('');
console.log(decoded); // 'hello'

// Split string and process each word
const sentence = 'the quick brown fox';
const titleCase = sentence
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
console.log(titleCase); // 'The Quick Brown Fox'

// Extract all numbers from strings
const mixed = ['item1', 'box42', 'page999'];
const numbers = mixed.map(str => parseInt(str.match(/\\d+/)[0]));
console.log(numbers); // [1, 42, 999]` },

    { type: 'heading', level: 2, text: 'Common Mistakes and Pitfalls', id: 'mistakes' },
    { type: 'code', language: 'javascript', filename: 'map-mistakes.js', code: `// ❌ Mistake 1: Using map for side effects (use forEach or for...of)
const results = [];
[1, 2, 3].map(n => {
  results.push(n * 2); // Side effect in map — bad!
  return n * 2;
});

// ✅ Better: use forEach for side effects
[1, 2, 3].forEach(n => console.log(n * 2));

// ❌ Mistake 2: Forgetting to return a value
const arr = [1, 2, 3];
arr.map(n => { n * 2; }); // Returns [undefined, undefined, undefined]

// ✅ Correct: explicitly return
arr.map(n => { return n * 2; });
arr.map(n => n * 2); // Implicit return with arrow function

// ❌ Mistake 3: Using map on non-arrays
const obj = { a: 1, b: 2 };
obj.map(x => x * 2); // TypeError: obj.map is not a function

// ✅ Correct: convert to array first
Object.values(obj).map(x => x * 2); // [2, 4]
Object.entries(obj).map(([key, val]) => ({ [key]: val * 2 }));

// ❌ Mistake 4: Expecting mutation of original array
const nums = [1, 2, 3];
nums.map(n => n * 2);
console.log(nums); // [1, 2, 3] — unchanged!

// ✅ Correct: capture the result
const doubled = nums.map(n => n * 2); // [2, 4, 6]` },

    { type: 'heading', level: 2, text: 'TypeScript with map()', id: 'typescript' },
    { type: 'code', language: 'typescript', filename: 'map-typescript.ts', code: `interface User {
  id: number;
  name: string;
  email: string;
}

interface UserDTO {
  id: number;
  displayName: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// Type-safe transformation
const dtos: UserDTO[] = users.map(user => ({
  id: user.id,
  displayName: user.name
}));

// Generic map wrapper
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const squared = mapArray(numbers, n => n ** 2); // Type: number[]

// Extracting types
type UserKeys = keyof User; // 'id' | 'name' | 'email'
const keys: UserKeys[] = ['id', 'name', 'email'];
const values = keys.map(key => users[0][key]);` },

    { type: 'heading', level: 2, text: 'Performance Considerations', id: 'performance' },
    { type: 'paragraph', text: 'map() always creates a new array and iterates every element. For very large arrays, consider whether you can combine operations or use reduce() in a single pass.' },
    { type: 'code', language: 'javascript', filename: 'map-performance.js', code: `// Two iterations (less efficient)
const bigArray = Array.from({ length: 1000000 }, (_, i) => i);
const result = bigArray
  .map(x => x * 2)      // 1st iteration
  .filter(x => x > 100) // 2nd iteration
  .map(x => x + 1);     // 3rd iteration

// Single iteration with reduce (more efficient)
const result2 = bigArray.reduce((acc, x) => {
  const doubled = x * 2;
  if (doubled > 100) {
    acc.push(doubled + 1);
  }
  return acc;
}, []);

// For simple transformations, map is fine and more readable
// Only optimize if you've profiled and found a bottleneck` },

    { type: 'heading', level: 2, text: 'map() vs forEach() vs for loop', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Returns', 'Use When', 'Mutates Original'], rows: [
      ['map()', 'New array with transformed values', 'You need the results', 'No'],
      ['forEach()', 'undefined', 'You only care about side effects', 'No'],
      ['for loop', 'nothing', 'You need fine-grained control', 'Optional'],
      ['for...of loop', 'nothing', 'You want simple iteration with breaks', 'Optional'],
    ]},

    { type: 'heading', level: 2, text: 'Real-World Examples', id: 'real-world' },
    { type: 'code', language: 'javascript', filename: 'map-real-world.js', code: `// API response transformation
const apiResponse = [
  { id: 1, firstName: 'Alice', lastName: 'Smith' },
  { id: 2, firstName: 'Bob', lastName: 'Jones' }
];

const displayUsers = apiResponse.map(user => ({
  id: user.id,
  fullName: \`\${user.firstName} \${user.lastName}\`
}));

// Form data preparation
const formData = [
  { field: 'email', value: 'test@example.com' },
  { field: 'age', value: '25' }
];

const params = new URLSearchParams(
  formData.map(item => [item.field, item.value])
);

// HTML generation
const items = ['apple', 'banana', 'orange'];
const html = items.map(item => \`<li>\${item}</li>\`).join('');
console.log(\`<ul>\${html}</ul>\`);

// Database batch operations
const users = [{ name: 'Alice' }, { name: 'Bob' }];
const insertStatements = users.map(user =>
  \`INSERT INTO users (name) VALUES ('\${user.name}')\`
);` },
  ],
};
