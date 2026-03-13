import type { LessonContent } from '@/types/content';

export const functionsLesson: LessonContent = {
  id: 'functions',
  title: 'Functions',
  description: 'Learn function declarations, expressions, arrow functions, default parameters, and rest parameters.',
  slug: 'learn/fundamentals/functions',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['functions', 'arrow-functions', 'parameters', 'return'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Functions are reusable blocks of code. JavaScript supports declarations, expressions, and arrow functions, each with different behavior for hoisting and `this` binding.',
  relatedTopics: ['scope', 'closures'],
  order: 3,
  updatedAt: '2024-03-01',
  readingTime: 25,
  featured: false,
  keywords: ['function', 'arrow function', 'callback', 'return', 'parameters', 'arguments', 'IIFE', 'higher-order', 'recursion', 'generator'],
  prerequisites: ['Variables & Types'],
  learningGoals: [
    'Declare functions using all three syntaxes',
    'Understand how function declarations get hoisted',
    'Use default and rest parameters effectively',
    'Know when to use arrow functions vs regular functions',
    'Write higher-order functions and callbacks',
    'Get the basics of closures',
    'Use IIFE and generator functions',
  ],
  exercises: [
    'Write a function that accepts any number of arguments and returns their sum using rest parameters.',
    'Convert a set of function declarations to arrow functions and note behavioral differences.',
    'Create a higher-order function `retry(fn, times)` that retries a function up to N times if it throws.',
    'Write a recursive function to flatten nested arrays: `flatten([1, [2, [3, [4]]]])` → `[1, 2, 3, 4]`.',
    'Build a memoize function that caches results of expensive computations.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Function Declarations', id: 'declarations' },
    { type: 'paragraph', text: 'Function declarations are hoisted — you can call them before they appear in the code. They\'re the most traditional way to define functions.' },
    {
      type: 'code', language: 'javascript', filename: 'declarations.js',
      code: `// Hoisted — works even before declaration
greet('Alice'); // "Hello, Alice!"

function greet(name) {
  return 'Hello, ' + name + '!';
}

// Functions without return statement return undefined
function log(msg) {
  console.log(msg);
}
const result = log('hi'); // result is undefined`,
    },

    { type: 'heading', level: 2, text: 'Function Expressions', id: 'expressions' },
    { type: 'paragraph', text: 'Function expressions assign a function to a variable. They\'re NOT hoisted, so you can\'t call them before the assignment.' },
    {
      type: 'code', language: 'javascript', filename: 'expressions.js',
      code: `// Anonymous function expression
const greet = function(name) {
  return 'Hello, ' + name + '!';
};

// Named function expression (useful for recursion & stack traces)
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
factorial(5); // 120
// fact(5);   // ReferenceError — name only accessible inside

// NOT hoisted — calling before assignment throws an error
// sayHi(); // TypeError: sayHi is not a function
const sayHi = function() { return 'Hi!'; };`,
    },

    { type: 'heading', level: 2, text: 'Arrow Functions', id: 'arrow-functions' },
    { type: 'paragraph', text: 'Arrow functions give you concise syntax and lexically bind `this`. They can\'t be used as constructors and don\'t have their own `arguments` object.' },
    {
      type: 'code', language: 'javascript', filename: 'arrow.js',
      code: `// Concise body (implicit return)
const double = x => x * 2;

// Block body (explicit return needed)
const add = (a, b) => {
  const sum = a + b;
  return sum;
};

// No parameters
const greet = () => 'Hello!';

// Returning objects (wrap in parentheses)
const makeUser = (name) => ({ name, id: Date.now() });

// Multi-line with implicit return (using parentheses)
const getUser = (id) => (
  fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
);`,
    },
    { type: 'callout', variant: 'warning', title: 'No own this', text: 'Arrow functions don\'t have their own `this`. They inherit `this` from the enclosing scope, making them unsuitable as object methods or constructors.' },

    { type: 'heading', level: 2, text: 'Arrow vs Regular Functions', id: 'arrow-vs-regular' },
    { type: 'paragraph', text: 'Choosing between arrow and regular functions depends on what you\'re doing. Here\'s a detailed breakdown.' },
    {
      type: 'table',
      headers: ['Feature', 'Regular Function', 'Arrow Function'],
      rows: [
        ['this binding', 'Dynamic (depends on call site)', 'Lexical (inherits from parent)'],
        ['arguments object', 'Yes', 'No (use rest params)'],
        ['Hoisting', 'Declarations are hoisted', 'Never hoisted'],
        ['Constructor (new)', 'Yes', 'No — throws TypeError'],
        ['prototype property', 'Yes', 'No'],
        ['Syntax', 'Verbose', 'Concise'],
        ['Best for', 'Methods, constructors', 'Callbacks, transforms'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'this-difference.js',
      code: `const obj = {
  name: 'Alice',
  // Regular function — this refers to obj
  greetRegular() {
    console.log('Hi, ' + this.name); // "Hi, Alice"
  },
  // Arrow function — this refers to enclosing scope (NOT obj)
  greetArrow: () => {
    console.log('Hi, ' + this.name); // "Hi, undefined"
  },
  // Common pattern: arrow inside regular method
  delayedGreet() {
    setTimeout(() => {
      console.log('Hi, ' + this.name); // "Hi, Alice" ✓
    }, 100);
    // Without arrow, you’d need:
    // const self = this;
    // setTimeout(function() { console.log(self.name); }, 100);
  }
};`,
    },

    { type: 'heading', level: 2, text: 'Default Parameters', id: 'default-params' },
    { type: 'paragraph', text: 'Default parameters give you fallback values when arguments are `undefined` (but not `null`). They can reference previous parameters and even call functions.' },
    {
      type: 'code', language: 'javascript', filename: 'defaults.js',
      code: `// Basic defaults
function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}
greet();          // "Hello, World!"
greet('Alice');   // "Hello, Alice!"
greet(undefined); // "Hello, World!" (undefined triggers default)
greet(null);      // "Hello, null!" (null does NOT trigger default)

// Defaults can reference previous params
function createRange(start, end, step = start < end ? 1 : -1) {
  const range = [];
  for (let i = start; start < end ? i < end : i > end; i += step) {
    range.push(i);
  }
  return range;
}
createRange(0, 5);    // [0, 1, 2, 3, 4]
createRange(5, 0);    // [5, 4, 3, 2, 1]

// Default with destructuring
function createUser({ name = 'Anonymous', role = 'user' } = {}) {
  return { name, role, createdAt: Date.now() };
}
createUser();                    // { name: "Anonymous", role: "user", ... }
createUser({ name: 'Alice' });   // { name: "Alice", role: "user", ... }`,
    },

    { type: 'heading', level: 2, text: 'Rest Parameters', id: 'rest-params' },
    { type: 'paragraph', text: 'Rest parameters collect remaining arguments into a real array. They replace the legacy `arguments` object and must be the last parameter.' },
    {
      type: 'code', language: 'javascript', filename: 'rest.js',
      code: `// Rest collects remaining args into an array
function sum(first, ...rest) {
  return rest.reduce((total, n) => total + n, first);
}
sum(1, 2, 3, 4); // 10

// rest is a real Array (unlike arguments)
function example(...args) {
  console.log(Array.isArray(args)); // true
  return args.map(x => x * 2);
}

// Legacy: arguments object (avoid in modern code)
function oldStyle() {
  console.log(arguments);      // Array-like, not a real array
  console.log(arguments[0]);   // First argument
  // Must convert: Array.from(arguments).map(...)
}

// Common pattern: wrapper functions
function log(level, ...messages) {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] [\${level}]\`, ...messages);
}
log('INFO', 'Server started', 'on port 3000');`,
    },

    { type: 'heading', level: 2, text: 'Higher-Order Functions', id: 'higher-order' },
    { type: 'paragraph', text: 'Higher-order functions either take functions as arguments or return functions. They\'re a cornerstone of functional programming in JavaScript.' },
    {
      type: 'code', language: 'javascript', filename: 'higher-order.js',
      code: `// Function that takes a function
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}
repeat(3, console.log); // 0, 1, 2

// Function that returns a function
function multiplier(factor) {
  return (number) => number * factor;
}
const double = multiplier(2);
const triple = multiplier(3);
double(5);  // 10
triple(5);  // 15

// Function composition
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

const addOne = x => x + 1;
const square = x => x * x;
const negate = x => -x;

const transform = compose(negate, square, addOne);
transform(3);  // -(4²) = -16

// Practical: creating specialized validators
function createValidator(rules) {
  return (value) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };
}

const required = (v) => v ? null : 'Required';
const minLen = (n) => (v) => v.length >= n ? null : \`Min \${n} chars\`;

const validatePassword = createValidator([required, minLen(8)]);
validatePassword('');      // "Required"
validatePassword('short'); // "Min 8 chars"
validatePassword('longpassword'); // null`,
    },

    { type: 'heading', level: 2, text: 'Callbacks', id: 'callbacks' },
    { type: 'paragraph', text: 'Functions passed as arguments to other functions are called callbacks. They\'re fundamental to asynchronous JavaScript and event-driven programming.' },
    {
      type: 'code', language: 'javascript', filename: 'callbacks.js',
      code: `// Synchronous callback
function process(data, callback) {
  const result = callback(data);
  console.log(result);
}
process(5, x => x * 2); // 10

// Array methods use callbacks
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
];

const names = users.map(user => user.name);
const adults = users.filter(user => user.age >= 30);
const totalAge = users.reduce((sum, user) => sum + user.age, 0);

// Asynchronous callback
function fetchData(url, onSuccess, onError) {
  fetch(url)
    .then(res => res.json())
    .then(data => onSuccess(data))
    .catch(err => onError(err));
}

fetchData(
  '/api/users',
  data => console.log('Got:', data),
  err => console.error('Failed:', err)
);

// Event listener callback
button.addEventListener('click', function handleClick(event) {
  console.log('Clicked!', event.target);
});`,
    },

    { type: 'heading', level: 2, text: 'IIFE (Immediately Invoked Function Expression)', id: 'iife' },
    { type: 'paragraph', text: 'An IIFE runs immediately after being defined. It creates a private scope and was commonly used before `let`/`const` and modules. Still useful for one-time initialization.' },
    {
      type: 'code', language: 'javascript', filename: 'iife.js',
      code: `// Classic IIFE syntax
(function() {
  const privateVar = 'hidden';
  console.log('IIFE executed');
})();

// Arrow IIFE
(() => {
  const secret = 42;
  console.log('Arrow IIFE');
})();

// IIFE with return value
const config = (() => {
  const env = process.env.NODE_ENV || 'development';
  return {
    apiUrl: env === 'production'
      ? 'https://api.example.com'
      : 'http://localhost:3000',
    debug: env !== 'production',
  };
})();

// Async IIFE
(async () => {
  const data = await fetch('/api/config').then(r => r.json());
  console.log(data);
})();

// IIFE for loop variable capture (legacy pattern)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100); // 0, 1, 2
  })(i);
}
// Modern: just use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}`,
    },

    { type: 'heading', level: 2, text: 'Recursion', id: 'recursion' },
    { type: 'paragraph', text: 'Recursive functions call themselves to solve problems by breaking them into smaller sub-problems. Every recursive function needs a base case to stop the recursion.' },
    {
      type: 'code', language: 'javascript', filename: 'recursion.js',
      code: `// Factorial
function factorial(n) {
  if (n <= 1) return 1;  // Base case
  return n * factorial(n - 1);  // Recursive case
}
factorial(5); // 120

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// Note: This is O(2^n) — very slow for large n

// Flatten nested arrays
function flatten(arr) {
  return arr.reduce((flat, item) =>
    flat.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}
flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]

// Deep clone
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, deepClone(val)])
  );
}

// Tree traversal
function findInTree(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.children || []) {
    const found = findInTree(child, predicate);
    if (found) return found;
  }
  return null;
}`,
    },
    { type: 'callout', variant: 'warning', title: 'Stack Overflow', text: 'JavaScript has a limited call stack (~10,000-25,000 frames). Deep recursion can cause "Maximum call stack size exceeded." Use iteration for very deep recursion or implement tail-call optimization (only Safari supports it).' },

    { type: 'heading', level: 2, text: 'Generator Functions', id: 'generators' },
    { type: 'paragraph', text: 'Generator functions can pause execution with `yield` and resume later. They return an iterator and are useful for lazy sequences and custom iteration.' },
    {
      type: 'code', language: 'javascript', filename: 'generators.js',
      code: `// Define with function*
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

// Use with for...of
for (const n of range(0, 5)) {
  console.log(n); // 0, 1, 2, 3, 4
}

// Manual iteration
const gen = range(0, 3);
gen.next(); // { value: 0, done: false }
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: undefined, done: true }

// Infinite sequences (lazy evaluation)
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Take first 10 fibonacci numbers
function take(n, iterable) {
  const result = [];
  for (const item of iterable) {
    result.push(item);
    if (result.length >= n) break;
  }
  return result;
}

take(10, fibonacci()); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// yield* delegates to another generator
function* concat(...iterables) {
  for (const iter of iterables) {
    yield* iter;
  }
}

[...concat([1, 2], [3, 4])]; // [1, 2, 3, 4]`,
    },

    { type: 'heading', level: 2, text: 'Function Scope & Closures Preview', id: 'closures-preview' },
    { type: 'paragraph', text: 'Functions create their own scope and can "close over" variables from their parent scope. This creates closures — functions that remember their environment.' },
    {
      type: 'code', language: 'javascript', filename: 'closure-preview.js',
      code: `// Basic closure
function createCounter() {
  let count = 0;  // Private variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
// count is not accessible directly â it’s enclosed

// Practical: function factory
function createGreeter(greeting) {
  return (name) => \`\${greeting}, \${name}!\`;
}

const hello = createGreeter('Hello');
const hola = createGreeter('Hola');
hello('Alice'); // "Hello, Alice!"
hola('Alice');  // "Hola, Alice!"`,
    },
    { type: 'callout', variant: 'tip', title: 'Deep Dive', text: 'Closures are covered in detail in the dedicated Closures lesson. This is just a preview of how functions and scope interact.' },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Forgetting return in block-body arrow functions
const double = (x) => { x * 2 };     // Returns undefined!
const doubleFixed = (x) => { return x * 2 }; // Correct
const doubleBest = (x) => x * 2;     // Concise body — implicit return

// 2. Using arrow functions as methods
const obj = {
  value: 42,
  getValue: () => this.value,  // undefined! Arrow has no own this
  getValueFixed() { return this.value; },  // 42 — correct
};

// 3. Not handling missing arguments
function divide(a, b) {
  return a / b;  // divide(10) → 10 / undefined → NaN
}
function divideFixed(a, b = 1) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// 4. Modifying arguments array
function example(a, b, c) {
  arguments[0] = 99;  // In sloppy mode, this changes a!
  console.log(a);     // 99 in sloppy mode, original in strict mode
}
// Fix: Use rest parameters instead of arguments

// 5. Excessive recursion without base case
function infinite(n) {
  return infinite(n + 1); // Stack overflow!
}

// 6. Returning object literal from arrow without parens
const make = () => { name: 'Alice' };  // Returns undefined! (labeled statement)
const makeFixed = () => ({ name: 'Alice' }); // Returns object`,
    },

    { type: 'heading', level: 2, text: 'Performance Tips', id: 'performance' },
    {
      type: 'list',
      items: [
        'Function declarations are slightly faster to parse than expressions due to hoisting',
        'Arrow functions have less overhead (no `this`, `arguments`, `prototype` bindings)',
        'Avoid creating functions inside loops — define them outside and reference them',
        'Use memoization for expensive pure functions that are called with repeated arguments',
        'Recursive algorithms can often be converted to iterative for better performance',
        'Named functions produce better stack traces for debugging than anonymous functions',
        'Generators are lazy — use them when you don\'t need all values at once',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices Summary', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use arrow functions for callbacks and short transforms',
        'Use regular functions (or methods) when you need `this` binding',
        'Always name functions (even expressions) for better debugging',
        'Use default parameters instead of manual `undefined` checks',
        'Use rest parameters instead of the `arguments` object',
        'Keep functions small and focused — each should do one thing',
        'Prefer pure functions (no side effects) for testability',
        'Use early returns to reduce nesting',
        'Document complex functions with JSDoc comments',
      ],
    },
  ],
};
