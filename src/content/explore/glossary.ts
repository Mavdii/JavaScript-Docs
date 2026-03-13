import type { ExploreContent } from '@/types/content';

export const glossaryExplore: ExploreContent = {
  id: 'explore-glossary',
  title: 'JavaScript Glossary',
  description: 'Key JavaScript terms and concepts defined clearly.',
  slug: 'explore/glossary',
  pillar: 'explore',
  category: 'resources',
  tags: ['glossary', 'definitions', 'terminology'],
  difficulty: 'beginner',
  contentType: 'glossary',
  summary: 'A comprehensive glossary of JavaScript terminology — from basic concepts to advanced patterns, runtime mechanics, and modern API terms.',
  relatedTopics: ['explore-comparisons'],
  order: 4,
  updatedAt: '2025-06-01',
  readingTime: 20,
  featured: false,
  keywords: ['JavaScript glossary', 'definitions', 'terminology'],
  sections: [
    { type: 'heading', level: 2, text: 'Core Language', id: 'core-language' },
    { type: 'paragraph', text: 'Fundamental JavaScript concepts and terms that form the foundation of the language.' },

    { type: 'heading', level: 3, text: 'Closure', id: 'closure' },
    { type: 'paragraph', text: 'A function that retains access to its outer (enclosing) scope\'s variables even after the outer function has returned. Closures are created every time a function is created.' },
    { type: 'code', language: 'javascript', code: `function createCounter() {
  let count = 0; // enclosed variable
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
// 'count' is not accessible directly, but the returned functions still reference it` },

    { type: 'heading', level: 3, text: 'Hoisting', id: 'hoisting' },
    { type: 'paragraph', text: 'JavaScript\'s behavior of moving declarations to the top of their scope during the compilation phase. var declarations are hoisted and initialized to undefined. let/const are hoisted but remain in the Temporal Dead Zone (TDZ) until their declaration is reached.' },
    { type: 'code', language: 'javascript', code: `console.log(a); // undefined (hoisted, initialized to undefined)
var a = 5;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10; // TDZ ends here

// Function declarations are fully hoisted (body included)
greet(); // "Hello!" — works before declaration
function greet() { console.log("Hello!"); }

// Function expressions are NOT fully hoisted
// sayHi(); // TypeError: sayHi is not a function
var sayHi = function() { console.log("Hi!"); };` },

    { type: 'heading', level: 3, text: 'Scope', id: 'scope' },
    { type: 'paragraph', text: 'The context in which variables are accessible. JavaScript has three scope types: Global scope (accessible everywhere), Function scope (var), and Block scope (let/const — inside {}).' },

    { type: 'heading', level: 3, text: 'Destructuring', id: 'destructuring' },
    { type: 'paragraph', text: 'Syntax for extracting values from arrays or properties from objects into distinct variables.' },
    { type: 'code', language: 'javascript', code: `// Object destructuring
const { name, age, role = 'user' } = user; // with default value

// Nested destructuring
const { address: { city, zip } } = user;

// Array destructuring
const [first, , third] = [1, 2, 3]; // skip second element

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1

// Function parameter destructuring
function greet({ name, greeting = 'Hello' }) {
  return \`\${greeting}, \${name}!\`;
}` },

    { type: 'heading', level: 3, text: 'Temporal Dead Zone (TDZ)', id: 'tdz' },
    { type: 'paragraph', text: 'The period between entering a scope and the actual let/const declaration where the variable exists but cannot be accessed. Accessing it throws a ReferenceError.' },

    { type: 'heading', level: 3, text: 'Strict Mode', id: 'strict-mode' },
    { type: 'paragraph', text: 'A restricted variant of JavaScript enabled by "use strict" that catches common coding mistakes: assigning to undeclared variables, duplicate parameter names, deleting non-configurable properties, and using octal syntax.' },

    { type: 'heading', level: 2, text: 'Runtime & Environment', id: 'runtime' },
    { type: 'paragraph', text: 'Terms related to where and how JavaScript executes — the engine, event loop, and execution model.' },

    { type: 'heading', level: 3, text: 'Event Loop', id: 'event-loop' },
    { type: 'paragraph', text: 'The mechanism that processes asynchronous callbacks in a single-threaded JavaScript runtime. It continuously checks the call stack, and when empty, dequeues tasks from the microtask queue (Promises) first, then the macrotask queue (setTimeout, I/O).' },
    { type: 'code', language: 'javascript', code: `// Execution order demonstration
console.log('1 - synchronous');

setTimeout(() => console.log('2 - macrotask'), 0);

Promise.resolve().then(() => console.log('3 - microtask'));

console.log('4 - synchronous');

// Output: 1, 4, 3, 2
// Microtasks (Promises) always run before macrotasks (setTimeout)` },

    { type: 'heading', level: 3, text: 'Call Stack', id: 'call-stack' },
    { type: 'paragraph', text: 'A LIFO (Last In, First Out) data structure that tracks function execution. When a function is called, it\'s pushed onto the stack. When it returns, it\'s popped off. Stack overflow occurs when the stack exceeds its size limit (e.g., infinite recursion).' },

    { type: 'heading', level: 3, text: 'Execution Context', id: 'execution-context' },
    { type: 'paragraph', text: 'The environment in which JavaScript code is evaluated. Each context has a Variable Environment (var declarations), Lexical Environment (let/const, function declarations), and a this binding. A new context is created for every function call.' },

    { type: 'heading', level: 3, text: 'Garbage Collection', id: 'gc' },
    { type: 'paragraph', text: 'Automatic memory management that reclaims memory occupied by objects no longer reachable from root references. Modern engines use the Mark-and-Sweep algorithm. Common leaks: forgotten event listeners, closures holding large objects, detached DOM nodes, and uncleared timers.' },

    { type: 'heading', level: 2, text: 'Async Patterns', id: 'async-patterns' },

    { type: 'heading', level: 3, text: 'Promise', id: 'promise' },
    { type: 'paragraph', text: 'An object representing the eventual completion or failure of an asynchronous operation. A Promise is in one of three states: pending, fulfilled, or rejected. Once settled (fulfilled or rejected), it cannot change state.' },

    { type: 'heading', level: 3, text: 'Callback', id: 'callback' },
    { type: 'paragraph', text: 'A function passed as an argument to another function, to be called later when an operation completes. The "callback hell" pattern (deeply nested callbacks) led to the adoption of Promises and async/await.' },

    { type: 'heading', level: 3, text: 'async/await', id: 'async-await' },
    { type: 'paragraph', text: 'Syntactic sugar over Promises that makes asynchronous code look synchronous. async functions always return a Promise. await pauses execution until the Promise settles, without blocking the main thread.' },

    { type: 'heading', level: 3, text: 'Generator', id: 'generator' },
    { type: 'paragraph', text: 'A function (function*) that can pause and resume execution using yield. Generators return an iterator and are the foundation for async iteration (for await...of) and libraries like Redux-Saga.' },
    { type: 'code', language: 'javascript', code: `function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id; // pauses here, resumes on .next()
  }
}
const gen = idGenerator();
gen.next().value; // 1
gen.next().value; // 2

// Async generator
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page}\`);
    const data = await res.json();
    if (data.length === 0) return;
    yield data;
    page++;
  }
}` },

    { type: 'heading', level: 2, text: 'OOP & Prototypes', id: 'oop' },

    { type: 'heading', level: 3, text: 'Prototype', id: 'prototype' },
    { type: 'paragraph', text: 'An object from which other objects inherit properties. Every object has an internal [[Prototype]] link. When accessing a property, JavaScript walks up the prototype chain until it finds the property or reaches null.' },

    { type: 'heading', level: 3, text: 'this', id: 'this-keyword' },
    { type: 'paragraph', text: 'A keyword whose value depends on HOW a function is called: method call → the object, regular call → undefined (strict) or window, arrow function → inherits from enclosing scope, constructor → the new instance, explicit binding → call/apply/bind argument.' },

    { type: 'heading', level: 3, text: 'Proxy', id: 'proxy' },
    { type: 'paragraph', text: 'A wrapper that intercepts and customizes fundamental operations on an object (get, set, delete, etc.). Used for validation, logging, reactive systems (Vue 3), and creating "impossible" objects.' },
    { type: 'code', language: 'javascript', code: `const validator = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new TypeError('Age must be a positive number');
    }
    target[prop] = value;
    return true;
  }
});
validator.age = 25;  // ✅
// validator.age = -1; // ❌ TypeError` },

    { type: 'heading', level: 2, text: 'Modern APIs & Patterns', id: 'modern' },

    { type: 'heading', level: 3, text: 'Web Worker', id: 'web-worker' },
    { type: 'paragraph', text: 'A script that runs in a background thread, separate from the main thread. Workers communicate via postMessage and cannot access the DOM. Used for CPU-intensive tasks like image processing, data parsing, or cryptography.' },

    { type: 'heading', level: 3, text: 'Service Worker', id: 'service-worker' },
    { type: 'paragraph', text: 'A programmable network proxy that intercepts fetch requests. Enables offline support, push notifications, and background sync. The foundation of Progressive Web Apps (PWAs).' },

    { type: 'heading', level: 3, text: 'WeakMap / WeakSet', id: 'weakmap' },
    { type: 'paragraph', text: 'Collections that hold "weak" references to their keys/values, allowing garbage collection when no other references exist. Keys must be objects. Used for private data, caching, and metadata without memory leaks.' },

    { type: 'heading', level: 3, text: 'Symbol', id: 'symbol' },
    { type: 'paragraph', text: 'A unique, immutable primitive used as object property keys to avoid name collisions. Well-known Symbols (Symbol.iterator, Symbol.toPrimitive) customize built-in behaviors.' },

    { type: 'callout', variant: 'tip', title: 'Learning Path', text: 'Start with Core Language terms, then move to Runtime concepts to understand how your code actually executes. Async Patterns and Modern APIs build on these foundations.' },
  ],
  items: [
    { name: 'Closure', description: 'A function that retains access to its outer scope\'s variables even after the outer function has returned.' },
    { name: 'Hoisting', description: 'JavaScript\'s behavior of moving declarations to the top of their scope during compilation.' },
    { name: 'Prototype', description: 'An object from which other objects inherit properties via the prototype chain.' },
    { name: 'Event Loop', description: 'The mechanism that processes asynchronous callbacks in a single-threaded runtime.' },
    { name: 'Promise', description: 'An object representing the eventual completion or failure of an asynchronous operation.' },
    { name: 'Callback', description: 'A function passed as an argument to another function, to be called later.' },
    { name: 'Scope', description: 'The context in which variables are accessible — global, function, or block.' },
    { name: 'Destructuring', description: 'Syntax for extracting values from arrays or properties from objects into variables.' },
    { name: 'Generator', description: 'A function that can pause and resume execution using yield.' },
    { name: 'Proxy', description: 'A wrapper that intercepts fundamental operations on an object.' },
    { name: 'Symbol', description: 'A unique, immutable primitive used as object property keys.' },
    { name: 'WeakMap', description: 'A collection with weak references allowing garbage collection of unused keys.' },
    { name: 'Garbage Collection', description: 'Automatic memory management reclaiming unreachable objects.' },
    { name: 'Strict Mode', description: 'A restricted variant of JavaScript that catches common coding mistakes.' },
  ],
};
