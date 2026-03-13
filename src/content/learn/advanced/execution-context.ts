import type { LessonContent } from '@/types/content';

export const executionContextLesson: LessonContent = {
  id: 'execution-context',
  title: 'Execution Context',
  description: 'Master how JavaScript manages code execution: call stacks, execution contexts, lexical environments, and why hoisting works.',
  slug: 'learn/advanced/execution-context',
  pillar: 'learn',
  category: 'advanced',
  tags: ['execution-context', 'call-stack', 'hoisting', 'scope'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Every time your code runs, JavaScript creates an execution context. Master this, and hoisting, scope, and closures finally make sense.',
  relatedTopics: ['scope', 'closures', 'this-keyword'],
  order: 4,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['execution context', 'call stack', 'lexical environment', 'variable environment'],
  prerequisites: ['Scope', 'Functions', 'Closures'],
  learningGoals: [
    'Get global and function execution contexts',
    'Trace the call stack as code runs',
    'Understand the creation and execution phases',
    'Get lexical environments and scope chains',
    'See hoisting as a creation phase side effect',
    'Debug stack overflow and call stack problems',
  ],
  exercises: [
    'Draw the call stack for a recursive factorial function.',
    'Trace variable values through the creation and execution phases of a code snippet.',
    'Predict the output of code mixing var, let, and function declarations with hoisting.',
    'Identify which variables are in the Temporal Dead Zone at a given line.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What is an Execution Context?', id: 'what-is-ec' },
    { type: 'paragraph', text: 'An execution context is basically the environment where your code runs. It\'s got all the variables, functions, the scope chain, and the value of `this`. Think of it as a bubble of state around whatever code is executing right now.' },
    {
      type: 'list',
      items: [
        'Global EC — created when the script first runs. There is exactly one.',
        'Function EC — created each time a function is called. A new one per call.',
        'Eval EC — created when code runs inside eval() (rare and discouraged).',
        'Module EC — each ES module gets its own execution context.',
      ],
    },

    { type: 'heading', level: 2, text: 'Components of an Execution Context', id: 'components' },
    { type: 'paragraph', text: 'When an execution context gets created, it sets up three key things:' },
    {
      type: 'table',
      headers: ['Component', 'Purpose', 'Contains'],
      rows: [
        ['Variable Environment', 'Stores var declarations and functions', 'var variables, function declarations'],
        ['Lexical Environment', 'Stores let/const and block scopes', 'let/const variables, block scope chain'],
        ['this Binding', 'Determines the value of this', 'Depends on how the function was called'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'ec-components.js',
      code: `// When this code runs, the Global EC is created:
// Variable Environment: { greeting: undefined, sayHello: <function> }
// Lexical Environment: { name: <uninitialized (TDZ)> }
// this: window (browser) or globalThis

var greeting = 'Hello';
let name = 'Alice';

function sayHello() {
  // When called, a new Function EC is created:
  // Variable Environment: { prefix: undefined }
  // Lexical Environment: { message: <uninitialized> }
  // this: depends on call site
  var prefix = '>>>';
  let message = \`\${greeting}, \${name}\`;
  return \`\${prefix} \${message}\`;
}`,
    },

    { type: 'heading', level: 2, text: 'The Call Stack', id: 'call-stack' },
    { type: 'paragraph', text: 'The call stack tracks what’s executing. When you call a function, its context goes on the stack. When it returns, it comes off. JavaScript can only run whatever’s at the top of the stack â it can’t skip around.' },
    {
      type: 'code', language: 'javascript', filename: 'call-stack.js',
      code: `function first() {
  console.log('first start');
  second();
  console.log('first end');
}

function second() {
  console.log('second start');
  third();
  console.log('second end');
}

function third() {
  console.log('third');
}

first();

// Call stack evolution:
// Step 1: [global]
// Step 2: [global, first]     → "first start"
// Step 3: [global, first, second] → "second start"
// Step 4: [global, first, second, third] → "third"
// Step 5: [global, first, second] → "second end"
// Step 6: [global, first]     → "first end"
// Step 7: [global]`,
    },

    { type: 'heading', level: 2, text: 'Visualizing the Call Stack', id: 'visualizing' },
    { type: 'paragraph', text: 'You can actually see the call stack right in your browser. Pop open DevTools, hit Sources, set a breakpoint, and there it is. Or just look at any error message — the stack trace shows you exactly where you are.' },
    {
      type: 'code', language: 'javascript', filename: 'stack-trace.js',
      code: `function a() { b(); }
function b() { c(); }
function c() {
  console.trace('Stack trace:');
  // Outputs:
  // c @ stack-trace.js:3
  // b @ stack-trace.js:2
  // a @ stack-trace.js:1
  // (anonymous) @ stack-trace.js:6
}
a();

// Error stack traces show the same information:
function validate(input) {
  if (!input) {
    throw new Error('Input required');
    // Error.stack shows: validate → processForm → handleSubmit
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Creation & Execution Phases', id: 'phases' },
    { type: 'paragraph', text: 'Every execution context has two phases. Get this right, and hoisting stops being magic — it becomes obvious.' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Creation Phase — scans for declarations: function declarations are fully hoisted, var variables are initialized to undefined, let/const are placed in the Temporal Dead Zone (TDZ)',
        'Execution Phase — code runs line by line, values are assigned, expressions evaluated, functions called',
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'phases.js',
      code: `// === CREATION PHASE ===
// Variable Environment: { age: undefined, greet: <function> }
// Lexical Environment: { name: <uninitialized — TDZ> }

// === EXECUTION PHASE ===
console.log(typeof greet); // "function" — fully hoisted
console.log(age);          // undefined — var is hoisted but not initialized
// console.log(name);      // ReferenceError — TDZ!

var age = 25;              // age = 25
let name = 'Alice';        // name = 'Alice' (exits TDZ)
function greet() { return 'Hello'; }

console.log(age);          // 25
console.log(name);         // "Alice"`,
    },

    { type: 'heading', level: 2, text: 'Hoisting Deep Dive', id: 'hoisting' },
    { type: 'paragraph', text: 'Hoisting is not "moving code to the top." It\'s a consequence of the creation phase allocating memory for declarations before any code runs. Different declaration types hoist differently.' },
    {
      type: 'table',
      headers: ['Declaration', 'Hoisted?', 'Initial Value', 'TDZ?'],
      rows: [
        ['var x = 5', 'Yes', 'undefined', 'No'],
        ['let x = 5', 'Yes (but TDZ)', '<uninitialized>', 'Yes'],
        ['const x = 5', 'Yes (but TDZ)', '<uninitialized>', 'Yes'],
        ['function f() {}', 'Yes (fully)', 'The function itself', 'No'],
        ['const f = () => {}', 'Yes (but TDZ)', '<uninitialized>', 'Yes'],
        ['class C {}', 'Yes (but TDZ)', '<uninitialized>', 'Yes'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'hoisting-examples.js',
      code: `// Function declarations are fully hoisted
sayHi(); // "Hi!" — works before declaration
function sayHi() { console.log('Hi!'); }

// Function expressions are NOT fully hoisted
// sayBye(); // TypeError: sayBye is not a function
var sayBye = function() { console.log('Bye!'); };

// let/const — Temporal Dead Zone
{
  // TDZ starts here for 'x'
  // console.log(x); // ReferenceError
  let x = 10; // TDZ ends
  console.log(x); // 10
}

// var — no TDZ but still surprising
console.log(y); // undefined (not ReferenceError)
var y = 20;`,
    },
    { type: 'callout', variant: 'warning', title: 'TDZ is per-scope', text: 'The Temporal Dead Zone exists from the start of the block until the declaration is reached. This applies to let, const, and class declarations.' },

    { type: 'heading', level: 2, text: 'Lexical Environment & Scope Chain', id: 'lexical-env' },
    { type: 'paragraph', text: 'Each execution context keeps a reference to its outer environment. These references chain together, and that chain is how JavaScript looks up variables.' },
    {
      type: 'code', language: 'javascript', filename: 'scope-chain.js',
      code: `const global = 'I am global';

function outer() {
  const outerVar = 'I am outer';

  function inner() {
    const innerVar = 'I am inner';

    // Variable lookup follows the scope chain:
    console.log(innerVar);  // Found in inner’s LE
    console.log(outerVar);  // Found in outer’s LE
    console.log(global);    // Found in global LE
  }

  inner();
}

outer();

// Scope chain for inner():
// inner LE → outer LE → global LE → null
// Each LE has a reference to its parent (outer environment)`,
    },

    { type: 'heading', level: 2, text: 'Closures Explained via EC', id: 'closures-via-ec' },
    { type: 'paragraph', text: 'Closures work because a function\'s lexical environment keeps a reference to its outer environment even after the outer function has returned and its execution context has been popped off the stack.' },
    {
      type: 'code', language: 'javascript', filename: 'closure-ec.js',
      code: `function makeCounter() {
  let count = 0; // Part of makeCounter’s Lexical Environment

  return function increment() {
    count++; // References makeCounter’s LE (kept alive!)
    return count;
  };
}

const counter = makeCounter();
// makeCounter’s EC is popped from the stack, BUT
// its Lexical Environment is NOT garbage collected because
// increment() still references it.

counter(); // 1
counter(); // 2
counter(); // 3`,
    },

    { type: 'heading', level: 2, text: 'Recursion & the Call Stack', id: 'recursion' },
    {
      type: 'code', language: 'javascript', filename: 'recursion-stack.js',
      code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

factorial(5);
// Stack grows:
// [global, factorial(5)]
// [global, factorial(5), factorial(4)]
// [global, factorial(5), factorial(4), factorial(3)]
// [global, factorial(5), factorial(4), factorial(3), factorial(2)]
// [global, factorial(5), factorial(4), factorial(3), factorial(2), factorial(1)]
// Stack unwinds:
// factorial(1) returns 1
// factorial(2) returns 2 * 1 = 2
// factorial(3) returns 3 * 2 = 6
// factorial(4) returns 4 * 6 = 24
// factorial(5) returns 5 * 24 = 120`,
    },

    { type: 'heading', level: 2, text: 'Stack Overflow', id: 'stack-overflow' },
    { type: 'paragraph', text: 'Your call stack has a size limit — usually somewhere between 10,000 and 25,000 frames depending on your browser. Go too deep with recursion and you hit the ceiling.' },
    {
      type: 'code', language: 'javascript', filename: 'overflow.js',
      code: `// ❌ Infinite recursion — crashes!
function infinite() {
  infinite();
}
// infinite(); // RangeError: Maximum call stack size exceeded

// ✅ Fix: Use tail recursion or convert to iteration
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// ✅ Fix: Trampoline pattern for deep recursion
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
}

const factorial = trampoline(function f(n, acc = 1) {
  if (n <= 1) return acc;
  return () => f(n - 1, n * acc); // Returns thunk instead of recursive call
});

factorial(100000); // Works! No stack overflow`,
    },
    { type: 'callout', variant: 'info', title: 'Tail Call Optimization', text: 'ES6 says tail recursion should be optimized, which would let you go infinitely deep. But only Safari does it. For real apps, use iteration or trampolines.' },

    { type: 'heading', level: 2, text: 'Global Execution Context Details', id: 'global-ec' },
    {
      type: 'code', language: 'javascript', filename: 'global-ec.js',
      code: `// The Global EC is special:
// 1. It creates the global object (window in browser, global in Node)
// 2. It sets 'this' to the global object
// 3. var declarations become properties of the global object

var globalVar = 'hello';
let globalLet = 'world';

// In browser:
window.globalVar; // "hello" — var is on global object
window.globalLet; // undefined — let is NOT on global object

// This is why var pollution is dangerous
var Array = 'oops'; // Overwrites window.Array!`,
    },

    { type: 'heading', level: 2, text: 'eval and with (Avoid These)', id: 'eval-with' },
    {
      type: 'code', language: 'javascript', filename: 'eval.js',
      code: `// eval creates its own execution context
// ❌ NEVER use eval — security risk, performance killer
eval('var x = 10');
console.log(x); // 10 — eval leaked into the current scope!

// In strict mode, eval gets its own scope
'use strict';
eval('var y = 20');
// console.log(y); // ReferenceError â y stays in eval’s scope

// ❌ 'with' modifies the scope chain — also avoid
// with (obj) { ... } // Adds obj to the scope chain`,
    },

    { type: 'heading', level: 2, text: 'Debugging with the Call Stack', id: 'debugging' },
    {
      type: 'list',
      items: [
        'Hit the `debugger;` statement or set breakpoints in DevTools to pause',
        'The Call Stack panel in Sources shows what’s running',
        'Click any frame to see its local variables',
        'console.trace() prints your current stack without pausing',
        'Error.stack gives you the stack as a string',
        'Chrome’s async stack traces show the full chain',
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// â Mistake 1: Assuming let/const aren’t hoisted
{
  // typeof x; // ReferenceError (TDZ), not "undefined"
  let x = 5;
}

// ❌ Mistake 2: Function expression hoisting
// getName(); // TypeError: getName is not a function
var getName = function() { return 'Alice'; };

// ❌ Mistake 3: Re-declaring with var (silently merged)
var a = 1;
var a = 2; // No error! Same variable, reassigned

// ❌ Mistake 4: Not understanding when closures capture values
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 (not 0, 1, 2)
// Fix: use let instead of var

// ❌ Mistake 5: Stack overflow with accidental recursion
const obj = {
  toJSON() {
    return JSON.stringify(this); // Calls toJSON again!
  }
};`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What is an execution context and what does it contain?',
        'Explain the creation and execution phases.',
        'How does hoisting work for var, let, const, and function declarations?',
        'What is the Temporal Dead Zone?',
        'How does the scope chain relate to lexical environments?',
        'What causes a stack overflow and how can you prevent it?',
        'Explain how closures work in terms of execution contexts.',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Key Takeaway', text: 'Execution contexts are the mechanism behind scope, hoisting, closures, and `this`. Understanding them gives you a mental model for predicting how any JavaScript code will behave.' },
  ],
};
