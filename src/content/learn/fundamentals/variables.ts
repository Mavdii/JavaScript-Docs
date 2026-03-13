import type { LessonContent } from '@/types/content';

export const variablesLesson: LessonContent = {
  id: 'variables',
  title: 'Variables & Types',
  description: 'Learn how to declare variables with var, let, and const, and understand JavaScript\'s type system.',
  slug: 'learn/fundamentals/variables',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['variables', 'types', 'let', 'const', 'var'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Variables store data values. JavaScript provides var, let, and const for declaration, each with different scoping rules. Understanding primitive and reference types is essential.',
  relatedTopics: ['scope', 'operators'],
  order: 1,
  updatedAt: '2024-03-01',
  readingTime: 25,
  featured: false,
  keywords: ['var', 'let', 'const', 'types', 'string', 'number', 'boolean', 'undefined', 'null', 'symbol', 'bigint', 'typeof', 'type coercion'],
  prerequisites: [],
  learningGoals: [
    'Get the differences between var, let, and const down pat',
    'Know all the primitive types JavaScript has to offer',
    'Wrap your head around type coercion and the typeof operator',
    'Use template literals to inject values into strings',
    'Tell primitives and reference types apart',
    'Destructure arrays and objects like a pro',
    'Handle null and undefined safely',
  ],
  exercises: [
    'Declare variables using let, const, and var and watch how they scope differently.',
    'Write a function that figures out if a value is null, undefined, or NaN.',
    'Create examples showing type coercion gotchas with == vs ===.',
    'Build a type-checking utility that returns the actual type of any value (even null and arrays).',
    'Write a function that deep-compares two values of any type for equality.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Declaring Variables', id: 'declaring-variables' },
    { type: 'paragraph', text: 'JavaScript gives you three keywords for declaring variables: `var`, `let`, and `const`. Modern JavaScript favors `let` and `const` because they give you predictable scoping.' },
    {
      type: 'code', language: 'javascript', filename: 'variables.js',
      code: `// const â can’t be reassigned
const PI = 3.14159;
const name = 'Alice';

// let — can be reassigned, block-scoped
let score = 0;
score = 10;

// var — function-scoped (old school)
var oldStyle = 'avoid this';`,
    },
    { type: 'callout', variant: 'tip', title: 'Best Practice', text: 'Start with `const` by default. Only reach for `let` when you know you’ll need to reassign. Never use `var` in modern code.' },

    { type: 'heading', level: 2, text: 'var vs let vs const', id: 'var-let-const' },
    { type: 'paragraph', text: 'These three keywords differ in scoping, hoisting, and whether you can reassign them. Getting these differences straight prevents a lot of bugs.' },
    {
      type: 'table',
      headers: ['Feature', 'var', 'let', 'const'],
      rows: [
        ['Scope', 'Function', 'Block', 'Block'],
        ['Hoisting', 'Yes (initialized to undefined)', 'Yes (TDZ — not initialized)', 'Yes (TDZ — not initialized)'],
        ['Reassignment', 'Yes', 'Yes', 'No'],
        ['Redeclaration', 'Yes (same scope)', 'No', 'No'],
        ['Global object property', 'Yes (in global scope)', 'No', 'No'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'var-problems.js',
      code: `// var leaks out of blocks
if (true) {
  var leaked = 'I escape!';
}
console.log(leaked); // "I escape!"

// var allows accidental redeclaration
var count = 1;
var count = 2; // No error — you just overwrote it!

// let and const are block-scoped
if (true) {
  let safe = 'contained';
  const alsoSafe = 'contained too';
}
// console.log(safe); // ReferenceError

// const stops reassignment, not mutation
const arr = [1, 2, 3];
arr.push(4); // This works! The array gets modified
// arr = [5, 6]; // TypeError: Assignment to constant variable`,
    },
    { type: 'callout', variant: 'warning', title: 'const and Mutability', text: '`const` prevents you from reassigning the variable, but it doesn\'t make the value immutable. Objects and arrays can still be modified. Use `Object.freeze()` if you need true immutability.' },

    { type: 'heading', level: 2, text: 'Primitive Types', id: 'primitive-types' },
    { type: 'paragraph', text: 'JavaScript has seven primitive types. Primitives are immutable and compared by value. When you assign a primitive to another variable, you get a copy.' },
    {
      type: 'code', language: 'javascript', filename: 'types.js',
      code: `typeof 'hello'      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object" (historical bug)
typeof Symbol()     // "symbol"
typeof 9007199254740991n // "bigint"`,
    },
    { type: 'callout', variant: 'warning', title: 'null Gotcha', text: '`typeof null` returns `"object"` — this is a famous JavaScript bug that can\'t be fixed without breaking stuff. Use `value === null` to check for null.' },

    { type: 'heading', level: 2, text: 'Numbers in Depth', id: 'numbers' },
    { type: 'paragraph', text: 'JavaScript uses 64-bit floating point (IEEE 754) for all numbers. This causes some weirdness with decimal math. `BigInt` is there if you need arbitrary-precision integers.' },
    {
      type: 'code', language: 'javascript', filename: 'numbers.js',
      code: `// Floating point precision â it’s weird
0.1 + 0.2 === 0.3        // false! (0.30000000000000004)
0.1 + 0.2                // 0.30000000000000004

// Safe comparison for decimals
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true

// Special numeric values
Infinity                  // Division by zero (positive)
-Infinity                 // Division by zero (negative)
NaN                       // "Not a Number"

// NaN is the only value that doesn’t equal itself
NaN === NaN               // false
Number.isNaN(NaN)         // true (use this!)
isNaN('hello')            // true (converts string first — avoid!)
Number.isNaN('hello')     // false (strict — better)

// Number limits
Number.MAX_SAFE_INTEGER   // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER   // -9007199254740991
Number.isFinite(42)       // true
Number.isFinite(Infinity) // false

// BigInt for huge integers
const big = 9007199254740992n;
big + 1n                  // 9007199254740993n
// Can’t mix BigInt and Number: big + 1 â TypeError`,
    },

    { type: 'heading', level: 2, text: 'Strings in Depth', id: 'strings' },
    { type: 'paragraph', text: 'Strings are sequences of UTF-16 code units. They\'re immutable — string methods give you new strings, they don\'t change the original. Template literals let you embed expressions and write multi-line strings.' },
    {
      type: 'code', language: 'javascript', filename: 'strings.js',
      code: `// String methods (all return new strings)
'Hello'.length           // 5
'Hello'.toUpperCase()    // "HELLO"
'Hello'.toLowerCase()    // "hello"
'Hello'.includes('ell')  // true
'Hello'.startsWith('He') // true
'Hello'.endsWith('lo')   // true
'Hello'.slice(1, 3)      // "el"
'Hello'.indexOf('l')     // 2
'  Hello  '.trim()       // "Hello"
'Ha'.repeat(3)           // "HaHaHa"
'a-b-c'.split('-')       // ["a", "b", "c"]

// String immutability
const str = 'Hello';
str[0] = 'h';            // Silently fails (no error)
console.log(str);        // "Hello" — unchanged

// Unicode and emoji
'café'.length            // 4
'😀'.length              // 2 (emoji is 2 code units)
[...'😀'].length         // 1 (spread handles emoji)`,
    },

    { type: 'heading', level: 2, text: 'Template Literals', id: 'template-literals' },
    { type: 'paragraph', text: 'Template literals use backticks and let you embed expressions with `${}`. You can write multi-line strings and even create custom string processors with tagged templates.' },
    {
      type: 'code', language: 'javascript', filename: 'templates.js',
      code: `const name = 'World';
const greeting = \`Hello, \${name}!\`;

// Expressions inside \${}
const price = 9.99;
const qty = 3;
const total = \`Total: $\${(price * qty).toFixed(2)}\`;
// "Total: $29.97"

// Multi-line strings
const html = \`
  <div class="card">
    <h2>\${name}</h2>
    <p>Price: \${price}</p>
  </div>
\`;

// Tagged templates (advanced)
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? \`<mark>\${values[i]}</mark>\` : '';
    return result + str + value;
  }, '');
}

const msg = highlight\`Hello \${name}, your total is \${total}\`;
// "Hello <mark>World</mark>, your total is <mark>Total: $29.97</mark>"`,
    },

    { type: 'heading', level: 2, text: 'Booleans & Truthy/Falsy', id: 'booleans' },
    { type: 'paragraph', text: 'JavaScript converts values to boolean in certain contexts. There are exactly 8 falsy values — everything else is truthy. This is crucial to understand.' },
    {
      type: 'code', language: 'javascript', filename: 'booleans.js',
      code: `// The 8 falsy values in JavaScript:
Boolean(false)      // false
Boolean(0)          // false
Boolean(-0)         // false
Boolean(0n)         // false (BigInt zero)
Boolean('')         // false (empty string)
Boolean(null)       // false
Boolean(undefined)  // false
Boolean(NaN)        // false

// Everything else is truthy — including:
Boolean('0')        // true (non-empty string!)
Boolean([])         // true (empty array!)
Boolean({})         // true (empty object!)
Boolean('false')    // true (the string "false")

// Double-NOT for explicit boolean conversion
!!0                 // false
!!'hello'           // true
!![]                // true

// Common pitfall
if ([]) {
  console.log('Empty array is truthy!'); // This RUNS
}
if ([].length) {
  console.log('But its length is falsy'); // This does NOT run
}`,
    },
    { type: 'callout', variant: 'warning', title: 'Empty Array Trap', text: 'Empty arrays `[]` and objects `{}` are truthy! To check if an array is empty, use `arr.length === 0`. For objects, use `Object.keys(obj).length === 0`.' },

    { type: 'heading', level: 2, text: 'Type Coercion', id: 'type-coercion' },
    { type: 'paragraph', text: 'JavaScript automatically converts types in certain contexts. This implicit coercion can lead to surprising and buggy behavior. Strict equality prevents this mess.' },
    {
      type: 'code', language: 'javascript', filename: 'coercion.js',
      code: `// Loose equality (==) coerces types
'5' == 5      // true  (string → number)
'' == false   // true  (both → 0)
null == undefined // true (special rule)
null == 0     // false (null only equals undefined)

// Strict equality (===) never coerces
'5' === 5     // false
'' === false  // false

// String concatenation vs addition
'3' + 2       // "32" (number → string, concatenation)
'3' - 2       // 1   (string → number, subtraction)
'3' * '2'     // 6   (both → numbers)
true + true   // 2   (both → 1)
'foo' + + 'bar' // "fooNaN" (+\'bar\' → NaN → string)

// Comparison coercion
'10' > '9'    // false! (string comparison: "1" < "9")
'10' > 9      // true  (string → number: 10 > 9)`,
    },
    {
      type: 'code', language: 'javascript', filename: 'explicit-conversion.js',
      code: `// Explicit type conversion (much safer)
String(42)          // "42"
String(null)        // "null"
String(undefined)   // "undefined"

Number('42')        // 42
Number('')          // 0
Number('abc')       // NaN
Number(true)        // 1
Number(false)       // 0
Number(null)        // 0
Number(undefined)   // NaN

parseInt('42px')    // 42 (stops at non-digit)
parseFloat('3.14') // 3.14
parseInt('0xFF', 16) // 255 (specify radix!)

Boolean(0)          // false
Boolean('')         // false
Boolean('hello')    // true`,
    },
    { type: 'callout', variant: 'tip', title: 'Always Use ===', text: 'Stick with strict equality (`===`). The only time `==` is acceptable is `value == null` which checks for both `null` and `undefined`.' },

    { type: 'heading', level: 2, text: 'Reference Types', id: 'reference-types' },
    { type: 'paragraph', text: 'Objects, arrays, and functions are reference types. Variables hold a reference (pointer) to the value in memory, not the value itself. This matters for assignment and comparison.' },
    {
      type: 'code', language: 'javascript', filename: 'references.js',
      code: `// Primitives are copied by value
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 (unchanged)

// Objects are copied by reference
const obj1 = { name: 'Alice' };
const obj2 = obj1;
obj2.name = 'Bob';
console.log(obj1.name); // "Bob" (both point to same object!)

// Reference comparison
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
arr1 === arr2  // false (different references!)

const arr3 = arr1;
arr1 === arr3  // true (same reference)

// Shallow copy to avoid reference sharing
const original = { x: 1, nested: { y: 2 } };
const shallow = { ...original };
shallow.x = 99;
console.log(original.x); // 1 (top-level copied)
shallow.nested.y = 99;
console.log(original.nested.y); // 99 (nested still shared!)

// Deep copy
const deep = structuredClone(original);
deep.nested.y = 0;
console.log(original.nested.y); // 99 (fully independent)`,
    },

    { type: 'heading', level: 2, text: 'Symbol', id: 'symbol' },
    { type: 'paragraph', text: 'Symbols are unique, immutable primitives used as property keys to avoid name collisions. They don\'t show up in `for...in` loops or `Object.keys()`.' },
    {
      type: 'code', language: 'javascript', filename: 'symbols.js',
      code: `// Every Symbol is unique
const id1 = Symbol('id');
const id2 = Symbol('id');
id1 === id2  // false (always unique)

// Use as object keys
const user = {
  name: 'Alice',
  [id1]: 12345  // Symbol-keyed property
};

user[id1]            // 12345
Object.keys(user)    // ["name"] — Symbol keys hidden
Object.getOwnPropertySymbols(user) // [Symbol(id)]

// Well-known Symbols
const iterable = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        return { value: i++, done: i > 3 };
      }
    };
  }
};

for (const val of iterable) {
  console.log(val); // 0, 1, 2
}

// Symbol.for — shared across the global registry
const s1 = Symbol.for('app.id');
const s2 = Symbol.for('app.id');
s1 === s2  // true (same global symbol)`,
    },

    { type: 'heading', level: 2, text: 'Nullish Values', id: 'nullish' },
    { type: 'paragraph', text: 'JavaScript has two "empty" values: `null` and `undefined`. They behave differently in various contexts, so handle them carefully.' },
    {
      type: 'code', language: 'javascript', filename: 'nullish.js',
      code: `// undefined — default "no value"
let x;
console.log(x);         // undefined
function foo() {}
console.log(foo());      // undefined (no return)

const obj = {};
console.log(obj.missing); // undefined (property doesn’t exist)

// null — intentional "no value"
let user = null; // explicitly set to empty

// Checking for nullish values
x == null               // true for both null and undefined
x === null              // only null
x === undefined         // only undefined
typeof x === 'undefined' // works even if x isn’t declared

// Nullish coalescing (??) — only null/undefined trigger default
0 ?? 'default'          // 0 (zero is NOT nullish)
'' ?? 'default'         // "" (empty string is NOT nullish)
null ?? 'default'       // "default"
undefined ?? 'default'  // "default"

// Optional chaining (?.) — safe access
const data = { user: { name: 'Alice' } };
data?.user?.name        // "Alice"
data?.settings?.theme   // undefined (no error)
data?.getUser?.()       // undefined (safe function call)`,
    },

    { type: 'heading', level: 2, text: 'typeof and Type Checking', id: 'typeof' },
    { type: 'paragraph', text: 'The `typeof` operator returns a string indicating the type. But it has quirks, so it\'s not perfect for all situations.' },
    {
      type: 'code', language: 'javascript', filename: 'type-checking.js',
      code: `// typeof results
typeof 'hello'     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" (bug!)
typeof {}          // "object"
typeof []          // "object" (arrays are objects!)
typeof function(){} // "function"
typeof Symbol()    // "symbol"

// Better type checking
Array.isArray([])          // true
Array.isArray({})          // false

value === null             // check for null specifically
value instanceof Date      // check class instance
value instanceof RegExp    // check regex

// Robust type checking utility
function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

getType(null)      // "null"
getType([1, 2])    // "array"
getType({})        // "object"
getType(42)        // "number"

// Object.prototype.toString (most reliable)
Object.prototype.toString.call([])      // "[object Array]"
Object.prototype.toString.call(null)    // "[object Null]"
Object.prototype.toString.call(/regex/) // "[object RegExp]"
Object.prototype.toString.call(new Map()) // "[object Map]"`,
    },

    { type: 'heading', level: 2, text: 'Variable Naming Conventions', id: 'naming' },
    { type: 'paragraph', text: 'Consistent naming makes code readable and maintainable. JavaScript uses camelCase by convention, with specific patterns for different situations.' },
    {
      type: 'code', language: 'javascript', filename: 'naming.js',
      code: `// camelCase for variables and functions
const userName = 'Alice';
const isActive = true;
function getUserById(id) { /* ... */ }

// UPPER_SNAKE_CASE for true constants
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// PascalCase for classes and constructors
class UserAccount { /* ... */ }
function UserComponent() { /* ... */ } // React component

// Prefix booleans with is/has/can/should
const isLoading = false;
const hasPermission = true;
const canDelete = user.role === 'admin';
const shouldRefresh = Date.now() > cacheExpiry;

// Use descriptive names — avoid abbreviations
// Bad
const d = new Date();
const cb = () => {};
const usr = getUser();

// Good
const currentDate = new Date();
const onSubmit = () => {};
const currentUser = getUser();`,
    },

    { type: 'heading', level: 2, text: 'Destructuring Assignment', id: 'destructuring' },
    { type: 'paragraph', text: 'Destructuring extracts values from arrays and objects into distinct variables. It makes function parameters and return values much cleaner.' },
    {
      type: 'code', language: 'javascript', filename: 'destructuring.js',
      code: `// Object destructuring
const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;

// With defaults and renaming
const { name: userName, role = 'user' } = user;
// userName = "Alice", role = "user"

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements
const [, , third] = [1, 2, 3]; // third = 3

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1

// Nested destructuring
const response = {
  data: {
    users: [{ id: 1, name: 'Alice' }]
  },
  status: 200
};
const { data: { users: [firstUser] }, status } = response;
// firstUser = { id: 1, name: "Alice" }, status = 200

// Function parameters
function createUser({ name, age, role = 'user' }) {
  return { name, age, role, createdAt: new Date() };
}
createUser({ name: 'Bob', age: 25 });

// Function return destructuring
function getMinMax(arr) {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = getMinMax([3, 1, 4, 1, 5]);`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'paragraph', text: 'These are the most frequent variable and type-related bugs that catch JavaScript developers off guard.' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Forgetting var creates global variables
function oops() {
  accidental = 'global!'; // No declaration keyword — leaks to global
}
// Fix: Always use const/let. Enable "use strict" to catch this.

// 2. Comparing with == instead of ===
if (userInput == 0) {  // '' == 0 is true!
  // This runs for empty strings too
}
// Fix: Use === for comparisons

// 3. Checking for NaN incorrectly
const result = parseInt('abc');
if (result === NaN) {   // ALWAYS false — NaN !== NaN
  console.log('invalid');
}
// Fix: Use Number.isNaN(result)

// 4. Mutating const objects unintentionally
const config = { debug: false };
applyDefaults(config); // Might mutate config!
// Fix: const config = Object.freeze({ debug: false });

// 5. typeof null === 'object'
function process(value) {
  if (typeof value === 'object') {
    value.toString(); // Crashes if value is null!
  }
}
// Fix: Check value !== null first

// 6. Floating point arithmetic
const total = 0.1 + 0.2;
if (total === 0.3) { // false!
  applyDiscount();   // Never executes
}
// Fix: Use Math.abs(total - 0.3) < Number.EPSILON
// Or work in cents: (10 + 20) / 100 === 0.3`,
    },

    { type: 'heading', level: 2, text: 'Performance Considerations', id: 'performance' },
    {
      type: 'list',
      items: [
        '`const` and `let` enable block-scoping optimizations in modern engines',
        'String concatenation with `+` in a loop is slow — use `Array.join()` or template literals',
        '`BigInt` operations are significantly slower than `Number` — only use when necessary',
        'Avoid frequent type conversions in hot paths — keep values in their expected type',
        '`typeof` is very fast — it\'s a language operator, not a function call',
        'Immutable data patterns (spreading) create copies — consider `structuredClone` for deep copies',
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    { type: 'paragraph', text: 'Variables and types show up in almost every JavaScript interview. Here are common questions and answers.' },
    {
      type: 'code', language: 'javascript', filename: 'interview.js',
      code: `// Q: What’s the output?
console.log(typeof typeof 42);
// A: "string" — typeof 42 is "number" (a string), typeof "number" is "string"

// Q: What’s the difference between null and undefined?
// A: undefined = variable declared but not assigned, or missing property
//    null = intentionally empty value, set by the programmer

// Q: What does this print?
let x = 1;
{
  // console.log(x); // ReferenceError! (TDZ)
  let x = 2;
  console.log(x); // 2
}
console.log(x); // 1

// Q: How to check if a variable is an array?
Array.isArray([1, 2])     // true
Array.isArray('string')   // false
// Don’t use typeof â arrays return "object"

// Q: What happens here?
console.log(0.1 + 0.2 === 0.3); // false
// Because floating point representation can’t precisely represent 0.1 and 0.2`,
    },

    { type: 'heading', level: 2, text: 'Best Practices Summary', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Always use `const` unless reassignment is needed, then `let` — never `var`',
        'Use `===` instead of `==` to avoid coercion bugs',
        'Initialize variables at declaration time',
        'Use descriptive, camelCase variable names',
        'Prefer template literals over string concatenation',
        'Use `Number.isNaN()` instead of `isNaN()` for strict checks',
        'Use `??` (nullish coalescing) instead of `||` when 0 or "" are valid values',
        'Use `?.` (optional chaining) for safe property access on potentially null objects',
        'Use `structuredClone()` for deep copies instead of `JSON.parse(JSON.stringify())`',
        'Enable `"use strict"` or use ES modules (which are strict by default)',
      ],
    },
  ],
};
