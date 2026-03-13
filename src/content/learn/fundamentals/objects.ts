import type { LessonContent } from '@/types/content';

export const objectsLesson: LessonContent = {
  id: 'objects',
  title: 'Objects',
  description: 'Understand object creation, property access, methods, destructuring, and computed properties.',
  slug: 'learn/fundamentals/objects',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['objects', 'properties', 'methods', 'destructuring'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Objects are collections of key-value pairs. They are the foundation of JavaScript — nearly everything is an object.',
  relatedTopics: ['arrays', 'prototypes'],
  order: 6,
  updatedAt: '2024-03-01',
  readingTime: 25,
  featured: false,
  keywords: ['object', 'property', 'method', 'destructuring', 'computed property', 'shorthand', 'prototype', 'freeze', 'seal'],
  prerequisites: ['Variables & Types'],
  learningGoals: [
    'Create objects with literal syntax',
    'Access properties with dot and bracket notation',
    'Use destructuring and shorthand syntax',
    'Iterate over object properties',
    'Understand shallow vs deep copying',
    'Use Object.freeze, Object.seal, and Object.assign',
    'Work with getters, setters, and property descriptors',
  ],
  exercises: [
    'Create a deep clone function for nested objects without using JSON.',
    'Write a function that merges two objects, with the second overriding the first.',
    'Implement a function that picks only specified keys from an object.',
    'Build an object with getters that compute derived values.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Object Basics', id: 'basics' },
    { type: 'paragraph', text: 'Objects store data as key-value pairs (properties) and behavior as functions (methods). They\'re the most versatile data structure in JavaScript.' },
    {
      type: 'code', language: 'javascript', filename: 'basics.js',
      code: `const user = {
  name: 'Alice',
  age: 30,
  isActive: true,
  greet() {
    return \`Hi, I’m \${this.name}\`;
  }
};

// Dot notation
user.name          // "Alice"
user.greet()       // "Hi, I’m Alice"

// Bracket notation (for dynamic keys)
user['age']        // 30
const key = 'name';
user[key]          // "Alice"

// Property shorthand (ES6)
const name = 'Bob';
const age = 25;
const bob = { name, age }; // Same as { name: name, age: age }

// Method shorthand
const calc = {
  add(a, b) { return a + b; },    // Instead of add: function(a, b) { ... }
  subtract(a, b) { return a - b; }
};`,
    },

    { type: 'heading', level: 2, text: 'Dynamic Properties', id: 'dynamic' },
    { type: 'paragraph', text: 'Object properties can be added, modified, and deleted dynamically. Computed property names allow using expressions as keys.' },
    {
      type: 'code', language: 'javascript', filename: 'dynamic.js',
      code: `// Computed property names
const key = 'color';
const obj = { [key]: 'blue' }; // { color: "blue" }

const prefix = 'data';
const config = {
  [\`\${prefix}Source\`]: 'API',
  [\`\${prefix}Format\`]: 'JSON',
};
// { dataSource: "API", dataFormat: "JSON" }

// Adding / modifying properties
obj.size = 'large';
obj['weight'] = 10;

// Deleting properties
delete obj.size;

// Check existence
'color' in obj                  // true (checks prototype chain too)
obj.hasOwnProperty('color')    // true (own properties only)
Object.hasOwn(obj, 'color')    // true (modern — preferred)

// Undefined vs missing
const user = { name: 'Alice', age: undefined };
user.age        // undefined
user.phone      // undefined (missing property)
'age' in user   // true
'phone' in user // false — this is how you distinguish`,
    },

    { type: 'heading', level: 2, text: 'Destructuring', id: 'destructuring' },
    {
      type: 'code', language: 'javascript', filename: 'destructuring.js',
      code: `const user = { name: 'Alice', age: 30, city: 'NYC', role: 'admin' };

// Basic
const { name, age } = user;

// With defaults
const { name: userName, country = 'Unknown' } = user;
// userName = "Alice", country = "Unknown"

// Renaming
const { name: n, age: a } = user;

// Nested
const data = { results: { items: [1, 2, 3], total: 3 } };
const { results: { items, total } } = data;

// Rest — collect remaining properties
const { role, ...publicInfo } = user;
// role = "admin"
// publicInfo = { name: "Alice", age: 30, city: "NYC" }

// In function parameters
function displayUser({ name, age, role = 'user' }) {
  console.log(\`\${name} (\${age}) - \${role}\`);
}
displayUser(user);`,
    },

    { type: 'heading', level: 2, text: 'Object Methods', id: 'object-methods' },
    {
      type: 'code', language: 'javascript', filename: 'object-methods.js',
      code: `const obj = { a: 1, b: 2, c: 3 };

// Object.keys — own enumerable keys
Object.keys(obj);        // ['a', 'b', 'c']

// Object.values — own enumerable values
Object.values(obj);      // [1, 2, 3]

// Object.entries — key-value pairs
Object.entries(obj);     // [['a', 1], ['b', 2], ['c', 3]]

// Object.assign — merge objects (mutates first arg)
const target = { x: 1 };
const source = { y: 2 };
Object.assign(target, source);  // target = { x: 1, y: 2 }

// Better: use spread for non-mutating merge
const merged = { ...obj, ...{ d: 4 } };

// Object.freeze — prevent modifications
const frozen = Object.freeze({ value: 42 });
frozen.value = 99; // Silently fails (or throws in strict mode)

// Object.seal — allow mutations, prevent adding/removing
const sealed = Object.seal({ value: 42 });
sealed.value = 99; // OK
sealed.newProp = 5; // Fails

// Object.create — create with specific prototype
const proto = { greet() { return 'Hello'; } };
const obj2 = Object.create(proto);
obj2.greet(); // "Hello"`,
    },

    { type: 'heading', level: 2, text: 'Iterating Objects', id: 'iterating' },
    {
      type: 'code', language: 'javascript', filename: 'iterating.js',
      code: `const user = { name: 'Alice', age: 30, active: true };

// for...in — iterate keys (including inherited, enumerable ones)
for (const key in user) {
  console.log(\`\${key}: \${user[key]}\`);
}

// Better: use Object.entries
for (const [key, value] of Object.entries(user)) {
  console.log(\`\${key}: \${value}\`);
}

// forEach
Object.entries(user).forEach(([key, value]) => {
  console.log(\`\${key}: \${value}\`);
});

// Just keys
Object.keys(user).forEach(key => {
  console.log(key);
});

// Just values
Object.values(user).forEach(value => {
  console.log(value);
});`,
    },

    { type: 'heading', level: 2, text: 'Copying Objects', id: 'copying' },
    {
      type: 'code', language: 'javascript', filename: 'copying.js',
      code: `// Shallow copy — only top-level properties
const original = { x: 1, nested: { y: 2 } };

// Method 1: spread
const copy1 = { ...original };

// Method 2: Object.assign
const copy2 = Object.assign({}, original);

// Shallow copy warning
copy1.x = 99;
console.log(original.x); // 1 (top-level copied)

copy1.nested.y = 99;
console.log(original.nested.y); // 99 (nested shared!)

// Deep copy
// Method 1: structuredClone (modern)
const deep = structuredClone(original);
deep.nested.y = 0;
console.log(original.nested.y); // 99 (fully independent)

// Method 2: JSON (limited — loses functions, undefined, etc.)
const jsonCopy = JSON.parse(JSON.stringify(original));`,
    },

    { type: 'heading', level: 2, text: 'Getters & Setters', id: 'getters-setters' },
    {
      type: 'code', language: 'javascript', filename: 'getters-setters.js',
      code: `const user = {
  firstName: 'Alice',
  lastName: 'Smith',
  
  // Getter
  get fullName() {
    return \`\${this.firstName} \${this.lastName}\`;
  },
  
  // Setter
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  }
};

console.log(user.fullName);  // "Alice Smith" (getter)
user.fullName = 'Bob Jones'; // (setter)
console.log(user.firstName); // "Bob"

// Practical: validation in setter
const product = {
  _price: 0,  // Convention: _ prefix for private
  
  get price() {
    return this._price;
  },
  
  set price(value) {
    if (value < 0) throw new Error('Price cannot be negative');
    this._price = value;
  }
};

product.price = 99.99; // OK
// product.price = -5;  // Error!`,
    },

    { type: 'heading', level: 2, text: 'Property Descriptors', id: 'property-descriptors' },
    {
      type: 'code', language: 'javascript', filename: 'property-descriptors.js',
      code: `// Define property with specific descriptor
const obj = {};

Object.defineProperty(obj, 'count', {
  value: 0,
  writable: false,    // Can’t be reassigned
  enumerable: true,   // Shows in for...in
  configurable: false // Can’t be deleted or reconfigured
});

obj.count = 5; // Fails silently (or throws in strict mode)

// Get property descriptor
Object.getOwnPropertyDescriptor(obj, 'count');
// { value: 0, writable: false, enumerable: true, configurable: false }

// Define multiple properties
Object.defineProperties(obj, {
  id: { value: 1, writable: false },
  name: { value: 'Item', writable: true }
});

// Make object non-extensible (can’t add properties)
Object.preventExtensions(obj);
obj.newProp = 'test'; // Fails`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Comparing objects with ===
const a = { x: 1 };
const b = { x: 1 };
a === b  // false! (different references)
// Fix: Compare properties or use JSON.stringify

// 2. Mutating default parameters
function createUser(data = {}) {
  data.id = 1; // Mutates the default!
  return data;
}
const user1 = createUser();
const user2 = createUser();
user1.id === user2.id // true! They share the default object!

// 3. Shallow copy when you need deep copy
const original = { data: { value: 1 } };
const copy = { ...original };
copy.data.value = 2;
console.log(original.data.value); // 2 (shared!)

// 4. for...in includes inherited properties
const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;
for (const key in child) {
  console.log(key); // own, inherited
}
// Fix: Use Object.hasOwn() to filter

// 5. Deleting from object doesn’t compact it
const obj = { a: 1, b: 2, c: 3 };
delete obj.b;
Object.keys(obj); // ['a', 'c']`,
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use object shorthand syntax for cleaner code',
        'Prefer `Object.entries()` over `for...in` for iterating objects',
        'Use spread `{...obj}` for non-mutating copies (shallow)',
        'Use `structuredClone()` for deep copies',
        'Use `Object.freeze()` to prevent unwanted mutations',
        'Use destructuring for cleaner property access',
        'Use computed property names for dynamic keys',
        'Prefer `Object.hasOwn()` over `hasOwnProperty()`',
        'Use getters/setters for computed or validated properties',
        'Keep objects focused — avoid deeply nested structures',
      ],
    },
  ],
};
