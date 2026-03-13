import type { LessonContent } from '@/types/content';

export const functionalPatternsLesson: LessonContent = {
  id: 'functional-patterns',
  title: 'Functional Patterns',
  description: 'Apply functional programming concepts: pure functions, composition, currying, and immutability.',
  slug: 'learn/advanced/functional-patterns',
  pillar: 'learn',
  category: 'advanced',
  tags: ['functional', 'pure-functions', 'composition', 'immutability'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'Functional programming emphasizes pure functions, immutability, and composition. These patterns lead to more predictable, testable, and maintainable code.',
  relatedTopics: ['closures', 'array-map'],
  order: 5,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['pure function', 'composition', 'curry', 'pipe', 'immutable', 'higher-order function'],
  prerequisites: ['Functions', 'Closures'],
  learningGoals: [
    'Write pure functions without side effects',
    'Compose functions with pipe and compose',
    'Use currying and partial application',
    'Keep data immutable when transforming',
    'Understand functors and monads',
    'Use FP patterns in real code',
  ],
  exercises: [
    'Build a pipe() function that chains multiple transformations.',
    'Refactor imperative code into a functional pipeline using map, filter, and reduce.',
    'Implement a curry() utility that works with any number of arguments.',
    'Build an immutable state management system using pure functions.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Pure Functions', id: 'pure-functions' },
    { type: 'paragraph', text: 'A pure function gives you the same output for the same input and has no side effects. Pure functions are predictable, testable, cacheable, and easy to run in parallel.' },
    {
      type: 'code', language: 'javascript', filename: 'pure.js',
      code: `// ✅ Pure — same input, same output, no side effects
const add = (a, b) => a + b;
const toUpper = (str) => str.toUpperCase();
const area = (r) => Math.PI * r * r;

// ❌ Impure — depends on/modifies external state
let count = 0;
const increment = () => ++count; // Side effect: mutates count

// ❌ Impure — non-deterministic
const now = () => Date.now(); // Different output each call

// ❌ Impure — side effects
const log = (msg) => console.log(msg); // I/O side effect
const saveUser = (user) => db.save(user); // Network side effect`,
    },
    {
      type: 'table',
      headers: ['Pure', 'Impure'],
      rows: [
        ['No side effects', 'Modifies external state'],
        ['Same input → same output', 'Depends on time, random, I/O'],
        ['Easy to test', 'Requires mocking'],
        ['Cacheable (memoizable)', 'Can\'t safely cache'],
        ['Parallelizable', 'May have race conditions'],
      ],
    },

    { type: 'heading', level: 2, text: 'Higher-Order Functions', id: 'higher-order' },
    { type: 'paragraph', text: 'A higher-order function takes a function as an argument, returns a function, or both. They’re the building blocks of everything composable.' },
    {
      type: 'code', language: 'javascript', filename: 'higher-order.js',
      code: `// Returns a function (factory pattern)
const multiplier = (factor) => (n) => n * factor;
const double = multiplier(2);
const triple = multiplier(3);
double(5);  // 10
triple(5);  // 15

// Takes a function (decorator pattern)
const withLogging = (fn) => (...args) => {
  console.log(\`Calling \${fn.name} with\`, args);
  const result = fn(...args);
  console.log(\`Result:\`, result);
  return result;
};

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
loggedAdd(2, 3); // Logs: "Calling add with [2, 3]" → "Result: 5"

// Real-world: once() — only call a function once
const once = (fn) => {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
};

const initialize = once(() => console.log('Initialized!'));
initialize(); // "Initialized!"
initialize(); // (nothing — already called)`,
    },

    { type: 'heading', level: 2, text: 'Function Composition', id: 'composition' },
    { type: 'paragraph', text: 'Composition is combining simple functions into complex transformations. Instead of nesting like `f(g(h(x)))`, use `pipe` or `compose` for readable pipelines.' },
    {
      type: 'code', language: 'javascript', filename: 'composition.js',
      code: `// pipe — left to right (most common)
const pipe = (...fns) => (x) =>
  fns.reduce((acc, fn) => fn(acc), x);

// compose — right to left (mathematical notation)
const compose = (...fns) => (x) =>
  fns.reduceRight((acc, fn) => fn(acc), x);

// Build a text processor
const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const slugify = (s) => s.replace(/\\s+/g, '-');
const truncate = (max) => (s) => s.slice(0, max);

const processSlug = pipe(trim, lower, slugify, truncate(50));
processSlug('  Hello Beautiful World  '); // "hello-beautiful-world"

// Equivalent with compose (right to left):
const processSlug2 = compose(truncate(50), slugify, lower, trim);

// Equivalent with nesting (hard to read):
// truncate(50)(slugify(lower(trim('  Hello World  '))))`,
    },

    { type: 'heading', level: 2, text: 'Currying', id: 'currying' },
    { type: 'paragraph', text: 'Currying turns a multi-argument function into a sequence of single-argument functions. This enables partial application and better composition.' },
    {
      type: 'code', language: 'javascript', filename: 'currying.js',
      code: `// Manual currying
const add = (a) => (b) => a + b;
add(2)(3);     // 5
const add5 = add(5);
add5(3);       // 8

// Generic curry utility
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const multiply = curry((a, b, c) => a * b * c);
multiply(2)(3)(4);    // 24
multiply(2, 3)(4);    // 24
multiply(2)(3, 4);    // 24
multiply(2, 3, 4);    // 24

// Practical: reusable data transformations
const map = curry((fn, arr) => arr.map(fn));
const filter = curry((fn, arr) => arr.filter(fn));
const prop = curry((key, obj) => obj[key]);

const getName = prop('name');
const getNames = map(getName);
const users = [{ name: 'Alice' }, { name: 'Bob' }];
getNames(users); // ['Alice', 'Bob']`,
    },

    { type: 'heading', level: 2, text: 'Partial Application', id: 'partial-application' },
    { type: 'paragraph', text: 'Partial application fixes some arguments of a function, producing a new function with fewer parameters. Unlike currying, it doesn\'t require one-argument-at-a-time.' },
    {
      type: 'code', language: 'javascript', filename: 'partial.js',
      code: `// Using bind for partial application
const greet = (greeting, name) => \`\${greeting}, \${name}!\`;
const sayHello = greet.bind(null, 'Hello');
sayHello('Alice'); // "Hello, Alice!"

// Custom partial function
const partial = (fn, ...preset) =>
  (...later) => fn(...preset, ...later);

const multiply = (a, b, c) => a * b * c;
const double = partial(multiply, 2, 1);
double(5); // 10

// Practical: API helpers
const fetchAPI = (baseURL, endpoint, options) =>
  fetch(\`\${baseURL}\${endpoint}\`, options);

const fetchMyAPI = partial(fetchAPI, 'https://api.example.com');
fetchMyAPI('/users', { method: 'GET' });`,
    },

    { type: 'heading', level: 2, text: 'Immutability', id: 'immutability' },
    { type: 'paragraph', text: 'Immutable data never changes. You create new copies with changes instead. This prevents bugs and makes change detection reliable (React depends on this).' },
    {
      type: 'code', language: 'javascript', filename: 'immutable.js',
      code: `// ✅ Immutable array operations
const addItem = (arr, item) => [...arr, item];
const removeItem = (arr, index) => arr.filter((_, i) => i !== index);
const updateItem = (arr, index, fn) =>
  arr.map((item, i) => i === index ? fn(item) : item);

// ✅ Immutable object operations
const setProp = (obj, key, value) => ({ ...obj, [key]: value });
const removeProp = (obj, key) => {
  const { [key]: _, ...rest } = obj;
  return rest;
};

// ✅ Deep immutable updates
const updateNested = (state) => ({
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'New York',
    },
  },
});

// Freeze to enforce immutability
const config = Object.freeze({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
});
// config.apiUrl = 'x'; // Silently fails (throws in strict mode)

// Deep freeze utility
const deepFreeze = (obj) => {
  Object.freeze(obj);
  Object.values(obj).forEach(v => {
    if (typeof v === 'object' && v !== null) deepFreeze(v);
  });
  return obj;
};`,
    },
    { type: 'callout', variant: 'tip', title: 'Why Immutability?', text: 'Immutable data is easier to debug and reason about. React uses immutable updates to compare references instead of deep values.' },

    { type: 'heading', level: 2, text: 'Memoization', id: 'memoization' },
    { type: 'paragraph', text: 'Memoization caches results from expensive function calls. Same arguments = cached result. No recompute.' },
    {
      type: 'code', language: 'javascript', filename: 'memoize.js',
      code: `// Simple memoize for single-argument functions
const memoize = (fn) => {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
};

const factorial = memoize((n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});

factorial(100); // Computed
factorial(100); // Cached!

// Multi-argument memoize with JSON key
const memoizeMulti = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// With LRU cache (bounded memory)
const memoizeLRU = (fn, maxSize = 100) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value); // Move to end (most recent)
      return value;
    }
    const result = fn(...args);
    cache.set(key, result);
    if (cache.size > maxSize) {
      cache.delete(cache.keys().next().value); // Remove oldest
    }
    return result;
  };
};`,
    },

    { type: 'heading', level: 2, text: 'Functors & Mapping', id: 'functors' },
    { type: 'paragraph', text: 'A functor is anything you can map over. Arrays are the most common functor, but you can make your own.' },
    {
      type: 'code', language: 'javascript', filename: 'functors.js',
      code: `// Arrays are functors — they implement map()
[1, 2, 3].map(x => x * 2); // [2, 4, 6]

// Maybe functor — safely handle null/undefined
class Maybe {
  constructor(value) { this._value = value; }
  static of(value) { return new Maybe(value); }

  isNothing() { return this._value == null; }

  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value));
  }

  getOrElse(fallback) {
    return this.isNothing() ? fallback : this._value;
  }
}

// Safe property access without null checks
const getStreetName = (user) =>
  Maybe.of(user)
    .map(u => u.address)
    .map(a => a.street)
    .map(s => s.toUpperCase())
    .getOrElse('No street');

getStreetName({ address: { street: 'Main St' } }); // "MAIN ST"
getStreetName({ address: {} });                      // "No street"
getStreetName(null);                                  // "No street"`,
    },

    { type: 'heading', level: 2, text: 'Declarative vs Imperative', id: 'declarative-vs-imperative' },
    {
      type: 'code', language: 'javascript', filename: 'declarative.js',
      code: `const users = [
  { name: 'Alice', age: 28, active: true },
  { name: 'Bob', age: 35, active: false },
  { name: 'Carol', age: 22, active: true },
  { name: 'Dave', age: 31, active: true },
];

// ❌ Imperative — HOW to do it (step by step)
const result1 = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].active && users[i].age >= 25) {
    result1.push(users[i].name.toUpperCase());
  }
}

// ✅ Declarative — WHAT to do (describe the result)
const result2 = users
  .filter(u => u.active)
  .filter(u => u.age >= 25)
  .map(u => u.name.toUpperCase());

// ✅ Even more composable with curried helpers
const isActive = (u) => u.active;
const olderThan = (min) => (u) => u.age >= min;
const getName = (u) => u.name.toUpperCase();

const result3 = users
  .filter(isActive)
  .filter(olderThan(25))
  .map(getName);
// ["ALICE", "DAVE"]`,
    },

    { type: 'heading', level: 2, text: 'Reduce as a Swiss Army Knife', id: 'reduce-power' },
    {
      type: 'code', language: 'javascript', filename: 'reduce-patterns.js',
      code: `// reduce can implement map
const map = (arr, fn) =>
  arr.reduce((acc, x) => [...acc, fn(x)], []);

// reduce can implement filter
const filter = (arr, fn) =>
  arr.reduce((acc, x) => fn(x) ? [...acc, x] : acc, []);

// Group by
const groupBy = (arr, keyFn) =>
  arr.reduce((groups, item) => {
    const key = keyFn(item);
    return { ...groups, [key]: [...(groups[key] || []), item] };
  }, {});

const people = [
  { name: 'Alice', dept: 'Eng' },
  { name: 'Bob', dept: 'Sales' },
  { name: 'Carol', dept: 'Eng' },
];
groupBy(people, p => p.dept);
// { Eng: [Alice, Carol], Sales: [Bob] }

// Frequency counter
const frequency = (arr) =>
  arr.reduce((map, item) => ({ ...map, [item]: (map[item] || 0) + 1 }), {});

frequency(['a', 'b', 'a', 'c', 'b', 'a']);
// { a: 3, b: 2, c: 1 }`,
    },

    { type: 'heading', level: 2, text: 'Transducers', id: 'transducers' },
    { type: 'paragraph', text: 'Transducers compose map and filter operations without creating intermediate arrays. They\'re more efficient for large datasets.' },
    {
      type: 'code', language: 'javascript', filename: 'transducers.js',
      code: `// Problem: chaining creates intermediate arrays
const result = data      // 1M items
  .filter(x => x > 10)  // creates 500K-item array
  .map(x => x * 2)      // creates another 500K-item array
  .filter(x => x < 100); // creates final array

// Solution: transducer-style single pass
const transduce = (arr, ...transforms) => {
  return arr.reduce((acc, item) => {
    let value = item;
    for (const transform of transforms) {
      value = transform(value);
      if (value === undefined) return acc; // Filtered out
    }
    acc.push(value);
    return acc;
  }, []);
};

// Or simply use a single reduce
const efficient = data.reduce((acc, x) => {
  if (x > 10) {
    const doubled = x * 2;
    if (doubled < 100) {
      acc.push(doubled);
    }
  }
  return acc;
}, []);`,
    },

    { type: 'heading', level: 2, text: 'Real-World FP Patterns', id: 'real-world' },
    {
      type: 'code', language: 'javascript', filename: 'real-world.js',
      code: `// 1. Validation pipeline
const validate = pipe(
  (data) => data.email ? data : { ...data, errors: ['Email required'] },
  (data) => data.password?.length >= 8 ? data : { ...data, errors: [...(data.errors || []), 'Password too short'] },
  (data) => data.errors ? { valid: false, ...data } : { valid: true, ...data },
);

// 2. Data transformation pipeline
const processAPIResponse = pipe(
  (res) => res.data,
  (data) => data.filter(item => item.active),
  (items) => items.map(({ id, name, email }) => ({ id, name, email })),
  (items) => items.sort((a, b) => a.name.localeCompare(b.name)),
);

// 3. Event handler composition
const handleSubmit = pipe(
  preventDefault,
  getFormData,
  validate,
  (data) => data.valid ? submitToAPI(data) : showErrors(data),
);`,
    },

    { type: 'heading', level: 2, text: 'FP Libraries', id: 'libraries' },
    {
      type: 'table',
      headers: ['Library', 'Style', 'Key Features'],
      rows: [
        ['Ramda', 'Auto-curried, data-last', 'pipe, compose, lens, all FP utilities'],
        ['Lodash/FP', 'Auto-curried, data-last', 'FP-flavored Lodash — familiar API'],
        ['fp-ts', 'TypeScript-first', 'Either, Option, Task, full type safety'],
        ['Immer', 'Immutable updates', 'Write "mutations" that produce immutable copies'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Impure function pretending to be pure
const addToCart = (cart, item) => {
  cart.push(item); // Mutates the original array!
  return cart;
};
// ✅ Fix: return new array
const addToCartPure = (cart, item) => [...cart, item];

// ❌ Mistake 2: Over-abstracting simple code
const add1 = pipe(partial(add, 1)); // Just use (x) => x + 1

// ❌ Mistake 3: Ignoring performance
users.filter(isActive).map(getName).filter(Boolean);
// Three passes — fine for small arrays, wasteful for 1M items
// Use single reduce for performance-critical paths

// ❌ Mistake 4: Forgetting that map/filter return new arrays
const original = [1, 2, 3];
const doubled = original.map(x => x * 2);
original === doubled; // false — always a new array`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What is a pure function? Give three examples.',
        'What is the difference between currying and partial application?',
        'Implement pipe() and compose() from scratch.',
        'Why is immutability important in React?',
        'How would you implement memoization for an expensive function?',
        'What is a higher-order function? Name five built-in ones.',
        'How can you avoid creating intermediate arrays in a map/filter chain?',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Pragmatic FP', text: 'You don\'t need to go 100% functional. The biggest wins come from: pure functions for business logic, immutable state updates, and composition for data pipelines. Mix with imperative code where it\'s clearer.' },
  ],
};
