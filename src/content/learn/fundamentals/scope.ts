import type { LessonContent } from '@/types/content';

export const scopeLesson: LessonContent = {
  id: 'scope',
  title: 'Scope',
  description: 'Understand global, function, and block scope, plus the scope chain and hoisting.',
  slug: 'learn/fundamentals/scope',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['scope', 'hoisting', 'block-scope', 'global'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Scope determines where variables are accessible. JavaScript has global, function, and block scope. Understanding scope is essential for avoiding bugs and writing clean code.',
  relatedTopics: ['variables', 'closures'],
  order: 4,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['scope', 'block scope', 'function scope', 'global scope', 'hoisting', 'TDZ', 'lexical scope', 'scope chain'],
  prerequisites: ['Variables & Types', 'Functions'],
  learningGoals: [
    'Distinguish between global, function, and block scope',
    'Understand hoisting and the Temporal Dead Zone',
    'Trace variable lookup through the scope chain',
    'Understand lexical vs dynamic scoping',
    'Avoid common scoping bugs',
    'Use module scope for encapsulation',
  ],
  exercises: [
    'Predict the output of code snippets involving nested scopes and hoisting.',
    'Refactor code using var to use let/const and fix scoping bugs.',
    'Write a function that demonstrates the Temporal Dead Zone.',
    'Create examples showing how closures capture variables by reference, not value.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What is Scope?', id: 'what-is-scope' },
    { type: 'paragraph', text: 'Scope is the context in which variables and expressions are "visible" or can be referenced. It determines the accessibility of variables throughout your code. JavaScript uses lexical (static) scoping, meaning scope is determined by where code is written, not where it\'s called.' },
    {
      type: 'code', language: 'javascript', filename: 'scope-intro.js',
      code: `// Each function creates its own scope
function outer() {
  const a = 1; // Visible inside outer and inner

  function inner() {
    const b = 2; // Visible only inside inner
    console.log(a); // 1 — accesses outer scope
    console.log(b); // 2
  }

  inner();
  // console.log(b); // ReferenceError — b is not visible here
}`,
    },

    { type: 'heading', level: 2, text: 'Global Scope', id: 'global-scope' },
    { type: 'paragraph', text: 'Variables declared outside any function or block are in the global scope. They\'re accessible everywhere in your code. In browsers, global `var` declarations become properties of `window`.' },
    {
      type: 'code', language: 'javascript', filename: 'global.js',
      code: `const appName = 'MyApp'; // Global

function showName() {
  console.log(appName); // Accessible here
}

// In browsers, var creates window properties
var globalVar = 'hello';
console.log(window.globalVar); // "hello" (browsers only)

// let and const do NOT create window properties
let globalLet = 'world';
console.log(window.globalLet); // undefined

// Implicit globals (avoid!)
function leaky() {
  oops = 'I am global!'; // No declaration → global variable!
}
leaky();
console.log(oops); // "I am global!" — accidental pollution`,
    },
    { type: 'callout', variant: 'warning', title: 'Global Pollution', text: 'Avoid putting variables in the global scope. Global variables can be overwritten by any code, including third-party libraries. Use modules or IIFE to encapsulate code.' },

    { type: 'heading', level: 2, text: 'Function Scope', id: 'function-scope' },
    { type: 'paragraph', text: 'Variables declared with `var` inside a function are scoped to that function. They\'re not accessible outside. This is the only type of scope that `var` respects.' },
    {
      type: 'code', language: 'javascript', filename: 'function-scope.js',
      code: `function calculate() {
  var result = 42;
  let also = 100;
  console.log(result); // 42
  console.log(also);   // 100
}

// console.log(result); // ReferenceError
// console.log(also);   // ReferenceError

// var is function-scoped, NOT block-scoped
function example() {
  if (true) {
    var x = 10; // Scoped to function, not the if block
  }
  console.log(x); // 10 — accessible! var ignores block scope

  for (var i = 0; i < 3; i++) {}
  console.log(i); // 3 — i leaks out of the for loop
}

// Each function creates a separate scope
function a() { var x = 1; }
function b() { var x = 2; } // Different x — no conflict`,
    },

    { type: 'heading', level: 2, text: 'Block Scope', id: 'block-scope' },
    { type: 'paragraph', text: '`let` and `const` are block-scoped — they exist only within the nearest curly braces `{}`. Blocks include `if`, `for`, `while`, `switch`, and standalone `{}` blocks.' },
    {
      type: 'code', language: 'javascript', filename: 'block-scope.js',
      code: `if (true) {
  let blockVar = 'inside';
  const alsoBlock = 'inside too';
  var notBlock = 'leaks out!';
}

// console.log(blockVar);  // ReferenceError
// console.log(alsoBlock); // ReferenceError
console.log(notBlock);     // "leaks out!" — var ignores block scope

// Block scope in loops
for (let i = 0; i < 3; i++) {
  // i is scoped to this block — new binding per iteration
}
// console.log(i); // ReferenceError

// Standalone blocks for scoping
{
  const temp = computeExpensiveValue();
  processValue(temp);
}
// temp is not accessible here — clean!

// Switch statement scoping gotcha
switch (action) {
  case 'add': {
    const item = createItem(); // block needed for const/let!
    list.push(item);
    break;
  }
  case 'remove': {
    const item = findItem(); // separate block, separate const
    list.splice(list.indexOf(item), 1);
    break;
  }
}`,
    },
    { type: 'callout', variant: 'warning', title: 'var Leaks', text: '`var` ignores block scope and is only constrained by function scope. This is a major reason to prefer `let` and `const`.' },

    { type: 'heading', level: 2, text: 'Hoisting', id: 'hoisting' },
    { type: 'paragraph', text: 'JavaScript moves declarations to the top of their scope before execution. However, only the declaration is hoisted, not the initialization. `let` and `const` are hoisted but not initialized, creating a Temporal Dead Zone.' },
    {
      type: 'code', language: 'javascript', filename: 'hoisting.js',
      code: `// var is hoisted and initialized to undefined
console.log(x); // undefined (not ReferenceError!)
var x = 5;
// Equivalent to:
// var x;
// console.log(x); // undefined
// x = 5;

// let/const are hoisted but NOT initialized (TDZ)
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function declarations are fully hoisted (name + body)
greet(); // "Hello!" — works!
function greet() { console.log('Hello'); }

// Function expressions are NOT fully hoisted
// sayHi(); // TypeError: sayHi is not a function
var sayHi = function() { console.log('Hi'); };
// sayHi is hoisted as undefined, then assigned the function`,
    },

    { type: 'heading', level: 2, text: 'Temporal Dead Zone (TDZ)', id: 'tdz' },
    { type: 'paragraph', text: 'The TDZ is the region between the start of a scope and the line where a `let` or `const` variable is declared. Accessing the variable in the TDZ throws a ReferenceError.' },
    {
      type: 'code', language: 'javascript', filename: 'tdz.js',
      code: `// TDZ starts at the beginning of the block
{
  // --- TDZ for 'name' starts here ---
  // console.log(name); // ReferenceError!

  const name = 'Alice';
  // --- TDZ ends here ---
  console.log(name);  // "Alice" — OK
}

// TDZ applies to function parameters too
function example(a = b, b = 1) {
  // 'a' defaults to 'b', but 'b' is in its TDZ when 'a' is evaluated!
}
// example(); // ReferenceError

// TDZ with typeof
// typeof undeclaredVar;  // "undefined" (no TDZ for undeclared!)
// typeof letVar;         // ReferenceError (TDZ!)
// let letVar = 1;

// TDZ in switch cases
switch (x) {
  case 1:
    let result = compute(); // TDZ: 'result' exists in entire switch block
    break;
  case 2:
    // console.log(result); // ReferenceError! (TDZ)
    break;
}`,
    },
    { type: 'callout', variant: 'tip', title: 'Declare at the Top', text: 'Always declare variables at the top of their scope to avoid TDZ issues and make code easier to read.' },

    { type: 'heading', level: 2, text: 'Scope Chain', id: 'scope-chain' },
    { type: 'paragraph', text: 'When JavaScript looks up a variable, it searches the current scope first, then moves outward through parent scopes until it reaches the global scope. This chain of scopes is called the scope chain.' },
    {
      type: 'code', language: 'javascript', filename: 'scope-chain.js',
      code: `const a = 'global';

function outer() {
  const b = 'outer';

  function middle() {
    const c = 'middle';

    function inner() {
      const d = 'inner';

      // Lookup chain: inner → middle → outer → global
      console.log(d); // "inner" (found in current scope)
      console.log(c); // "middle" (found in parent)
      console.log(b); // "outer" (found in grandparent)
      console.log(a); // "global" (found in global scope)
    }

    inner();
  }

  middle();
}

// Variable shadowing
const x = 'global';
function test() {
  const x = 'function'; // Shadows the global x
  if (true) {
    const x = 'block'; // Shadows the function x
    console.log(x); // "block"
  }
  console.log(x); // "function"
}
console.log(x); // "global"`,
    },

    { type: 'heading', level: 2, text: 'Lexical vs Dynamic Scope', id: 'lexical-scope' },
    { type: 'paragraph', text: 'JavaScript uses lexical (static) scoping — the scope of a variable is determined by its position in the source code, not by how or where the function is called. This is what makes closures work predictably.' },
    {
      type: 'code', language: 'javascript', filename: 'lexical.js',
      code: `const x = 10;

function foo() {
  console.log(x); // Lexical scope: looks where foo was DEFINED
}

function bar() {
  const x = 20; // This x is irrelevant to foo
  foo();         // Still prints 10, not 20
}

bar(); // 10

// If JavaScript used dynamic scoping (it doesn’t!),
// foo() inside bar() would print 20 because it would
// look up x in the calling scope rather than the defining scope.

// This is why closures work:
function createMultiplier(factor) {
  // factor is captured from the lexical environment
  return (n) => n * factor;
}

const double = createMultiplier(2);
double(5); // 10 — factor is still 2, captured at creation time`,
    },

    { type: 'heading', level: 2, text: 'Module Scope', id: 'module-scope' },
    { type: 'paragraph', text: 'ES modules have their own scope. Variables declared at the top level of a module are NOT global — they\'re scoped to the module file. Only explicitly exported values are accessible from outside.' },
    {
      type: 'code', language: 'javascript', filename: 'module-scope.js',
      code: `// utils.js
const SECRET_KEY = 'abc123'; // Module-scoped — NOT global
export const publicApi = 'hello';

// app.js
import { publicApi } from './utils.js';
console.log(publicApi);     // "hello"
// console.log(SECRET_KEY); // ReferenceError — not exported

// Modules are strict mode by default
// - No implicit globals
// - No 'with' statement
// - 'this' at top level is undefined, not window

// Each module has its own top-level scope
// File: counter.js
let count = 0;
export const increment = () => ++count;
export const getCount = () => count;

// File: app.js
import { increment, getCount } from './counter.js';
increment();
getCount(); // 1 — shared state within the module`,
    },

    { type: 'heading', level: 2, text: 'The Classic Loop Bug', id: 'loop-bug' },
    { type: 'paragraph', text: 'One of the most famous JavaScript bugs involves `var` in loops. Because `var` is function-scoped, all iterations share the same variable.' },
    {
      type: 'code', language: 'javascript', filename: 'loop-bug.js',
      code: `// BUG: All callbacks share the same 'i'
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 (not 0, 1, 2!)
// By the time callbacks run, the loop is finished and i === 3

// FIX 1: Use let (creates new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2 ✓

// FIX 2: IIFE (old pattern)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Prints: 0, 1, 2 ✓

// FIX 3: forEach (no index variable needed)
[0, 1, 2].forEach(i => {
  setTimeout(() => console.log(i), 100);
});
// Prints: 0, 1, 2 ✓`,
    },

    { type: 'heading', level: 2, text: 'Variable Shadowing', id: 'shadowing' },
    { type: 'paragraph', text: 'When a variable in an inner scope has the same name as one in an outer scope, it "shadows" the outer variable. The inner variable takes precedence within its scope.' },
    {
      type: 'code', language: 'javascript', filename: 'shadowing.js',
      code: `const name = 'Global Alice';

function greet() {
  const name = 'Function Alice'; // Shadows global name
  console.log(name); // "Function Alice"

  if (true) {
    const name = 'Block Alice'; // Shadows function name
    console.log(name); // "Block Alice"
  }

  console.log(name); // "Function Alice" (block scope ended)
}

greet();
console.log(name); // "Global Alice" (function scope ended)

// Shadowing with function parameters
function process(data) {
  // 'data' parameter shadows any outer 'data' variable
  console.log(data);
}

// Intentional shadowing in destructuring
const user = { name: 'Bob', age: 30 };
const { name: userName } = user; // Rename to avoid shadowing`,
    },
    { type: 'callout', variant: 'tip', title: 'Avoid Accidental Shadowing', text: 'Shadowing is sometimes intentional but often a source of bugs. Use descriptive variable names to avoid accidentally shadowing outer variables. Linters like ESLint can warn you about shadowing.' },

    { type: 'heading', level: 2, text: 'Hoisting Summary Table', id: 'hoisting-summary' },
    {
      type: 'table',
      headers: ['Declaration', 'Hoisted?', 'Initialized?', 'Scope', 'TDZ?'],
      rows: [
        ['var x = 1', 'Yes', 'undefined', 'Function', 'No'],
        ['let x = 1', 'Yes', 'No', 'Block', 'Yes'],
        ['const x = 1', 'Yes', 'No', 'Block', 'Yes'],
        ['function f() {}', 'Yes', 'Yes (full body)', 'Function', 'No'],
        ['const f = () => {}', 'Yes (as const)', 'No', 'Block', 'Yes'],
        ['class C {}', 'Yes', 'No', 'Block', 'Yes'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Forgetting that var is function-scoped
function example() {
  if (false) {
    var x = 5; // Never executes, but x is still declared!
  }
  console.log(x); // undefined (not ReferenceError)
}

// 2. Accidental closure over loop variable
const handlers = [];
for (var i = 0; i < 3; i++) {
  handlers.push(() => console.log(i));
}
handlers[0](); // 3 (not 0!)
// Fix: use let instead of var

// 3. Shadowing causes confusion
let count = 0;
function process(items) {
  let count = 0; // Accidentally shadows outer count
  items.forEach(() => count++);
  return count; // Returns local count, not outer
}
// Outer count is never modified

// 4. Assuming hoisted let/const is undefined
function test() {
  console.log(typeof x); // ReferenceError (not "undefined")
  let x = 5;
}

// 5. Creating globals accidentally
function oops() {
  myGlobal = 42; // No declaration → global!
}
// Fix: 'use strict' mode catches this`,
    },

    { type: 'heading', level: 2, text: 'Strict Mode and Scope', id: 'strict-mode' },
    { type: 'paragraph', text: 'Strict mode changes some scoping behaviors and catches common mistakes. ES modules are automatically in strict mode.' },
    {
      type: 'code', language: 'javascript', filename: 'strict.js',
      code: `'use strict';

// 1. No implicit globals
function test() {
  // x = 5; // ReferenceError in strict mode!
  let x = 5; // Must declare
}

// 2. No duplicate parameter names
// function add(a, a) {} // SyntaxError in strict mode!

// 3. this is undefined in functions (not window)
function showThis() {
  console.log(this); // undefined (not window)
}

// 4. No with statement
// with (obj) {} // SyntaxError in strict mode!

// 5. eval has its own scope
eval('var x = 1;');
// console.log(x); // ReferenceError in strict mode (x stays in eval scope)`,
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use `const` and `let` — never `var`',
        'Declare variables at the top of their scope',
        'Keep scopes small — avoid deep nesting',
        'Use descriptive names to avoid accidental shadowing',
        'Use modules to encapsulate code and avoid global pollution',
        'Enable strict mode (or use ES modules which are strict by default)',
        'Use `let` in `for` loops to get per-iteration bindings',
        'Use linters to catch shadowing and unused variables',
        'Prefer arrow functions in callbacks to avoid `this` scoping issues',
      ],
    },
  ],
};
