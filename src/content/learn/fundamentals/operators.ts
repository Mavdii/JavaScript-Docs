import type { LessonContent } from '@/types/content';

export const operatorsLesson: LessonContent = {
  id: 'operators',
  title: 'Operators',
  description: 'Master arithmetic, comparison, logical, and assignment operators in JavaScript.',
  slug: 'learn/fundamentals/operators',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['operators', 'comparison', 'logical', 'arithmetic'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Operators perform operations on values. JavaScript includes arithmetic, comparison, logical, assignment, and special operators like nullish coalescing and optional chaining.',
  relatedTopics: ['variables'],
  order: 2,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['operators', 'ternary', 'nullish coalescing', 'optional chaining', 'spread', 'bitwise', 'precedence'],
  prerequisites: ['Variables & Types'],
  learningGoals: [
    'Use arithmetic and assignment operators comfortably',
    'Understand comparison operators and equality rules',
    'Apply logical operators with short-circuit evaluation',
    'Use modern operators like ??, ?., and ...',
    'Get operator precedence right',
    'Work with bitwise and comma operators',
  ],
  exercises: [
    'Write expressions using nullish coalescing to provide default values.',
    'Create a chain of optional chaining to safely access deeply nested properties.',
    'Build a function that uses bitwise operators to check file permissions.',
    'Write a precedence quiz that predicts the output of complex expressions.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Arithmetic Operators', id: 'arithmetic' },
    { type: 'paragraph', text: 'Standard math operators work on numbers. The `%` operator gives you the remainder, and `**` is for exponentiation. Arithmetic operators convert operands to numbers (except `+` with strings).' },
    {
      type: 'code', language: 'javascript', filename: 'arithmetic.js',
      code: `10 + 3   // 13
10 - 3   // 7
10 * 3   // 30
10 / 3   // 3.333...
10 % 3   // 1 (remainder)
2 ** 10  // 1024 (exponentiation)

// Unary operators
let x = 5;
x++      // Returns 5, then x becomes 6 (postfix)
++x      // x becomes 7, returns 7 (prefix)
x--      // Returns 7, then x becomes 6
-x       // -6 (negation)
+true    // 1 (unary plus converts to number)
+'42'    // 42`,
    },

    { type: 'heading', level: 2, text: 'Assignment Operators', id: 'assignment' },
    { type: 'paragraph', text: 'Assignment operators combine an operation with assignment. They\'re shorthand for common patterns.' },
    {
      type: 'code', language: 'javascript', filename: 'assignment.js',
      code: `let x = 10;
x += 5;   // x = x + 5  → 15
x -= 3;   // x = x - 3  → 12
x *= 2;   // x = x * 2  → 24
x /= 4;   // x = x / 4  → 6
x %= 4;   // x = x % 4  → 2
x **= 3;  // x = x ** 3 → 8

// Logical assignment (ES2021)
let a = null;
a ??= 'default';   // a = 'default' (only if null/undefined)

let b = 0;
b ||= 42;          // b = 42 (if falsy)

let c = 1;
c &&= 2;           // c = 2 (if truthy)

// Practical examples
const config = {};
config.timeout ??= 5000;    // Set default only if missing
config.retries ??= 3;
user.name ||= 'Anonymous';  // Set if empty/falsy`,
    },

    { type: 'heading', level: 2, text: 'Comparison Operators', id: 'comparison' },
    { type: 'paragraph', text: 'Comparison operators return booleans. The big distinction is loose (`==`) vs strict (`===`) equality.' },
    {
      type: 'table',
      headers: ['Operator', 'Description', 'Example', 'Result'],
      rows: [
        ['===', 'Strict equality', '5 === 5', 'true'],
        ['!==', 'Strict inequality', '5 !== "5"', 'true'],
        ['==', 'Loose equality (coerces)', '5 == "5"', 'true'],
        ['!=', 'Loose inequality', '5 != "5"', 'false'],
        ['<', 'Less than', '3 < 5', 'true'],
        ['>', 'Greater than', '5 > 3', 'true'],
        ['<=', 'Less than or equal', '5 <= 5', 'true'],
        ['>=', 'Greater than or equal', '5 >= 6', 'false'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'equality-deep.js',
      code: `// Loose equality coercion rules (== / !=)
null == undefined    // true (special rule)
null == 0            // false (null only equals undefined)
null == ''           // false
NaN == NaN           // false (NaN never equals anything)

'' == false          // true (both coerce to 0)
'0' == false         // true ('0' → 0, false → 0)
[] == false          // true ([] → '' → 0)
[] == ![]            // true! (confusing but true)

// Strict equality — no surprises
'' === false         // false
'0' === false        // false
[] === false         // false

// Object comparison (by reference)
{} === {}            // false (different objects)
[] === []            // false (different arrays)

const a = { x: 1 };
const b = a;
a === b              // true (same reference)`,
    },
    { type: 'callout', variant: 'warning', title: 'Always Use ===', text: 'Loose equality `==` has confusing coercion rules. Always use `===` unless you intentionally want `null == undefined` (which is really the only acceptable use case for `==`).' },

    { type: 'heading', level: 2, text: 'Logical Operators', id: 'logical' },
    { type: 'paragraph', text: 'Logical operators use short-circuit evaluation — they return the value that determined the result, not necessarily a boolean. This enables powerful patterns.' },
    {
      type: 'code', language: 'javascript', filename: 'logical.js',
      code: `// AND (&&) — returns first falsy or last value
true && 'hello'     // "hello"
false && 'hello'    // false
0 && 'hello'        // 0
'a' && 'b' && 'c'   // "c" (all truthy, returns last)

// OR (||) — returns first truthy or last value
'' || 'default'     // "default"
'value' || 'default' // "value"
0 || null || 'end'   // "end"
0 || '' || false     // false (all falsy, returns last)

// NOT (!)
!true    // false
!0       // true
!''      // true
!!0      // false (double-not for boolean conversion)
!!'hello' // true

// Short-circuit patterns
const user = isLoggedIn && getUserData();     // Only calls getUserData if logged in
const name = user?.name || 'Anonymous';       // Fallback for falsy
const theme = settings?.theme ?? 'light';     // Fallback for null/undefined only`,
    },
    {
      type: 'code', language: 'javascript', filename: 'logical-patterns.js',
      code: `// Guard clause pattern with &&
function processUser(user) {
  user && user.name && console.log(user.name);
  // Modern equivalent:
  console.log(user?.name);
}

// Default value pattern with ||
function greet(name) {
  name = name || 'World'; // Problem: '' is falsy!
  return 'Hello, ' + name;
}
greet('');  // "Hello, World" — Bug! Empty string is valid

// Fix with ??
function greetFixed(name) {
  name = name ?? 'World';
  return 'Hello, ' + name;
}
greetFixed('');   // "Hello, "  — Correct!
greetFixed(null); // "Hello, World" — Correct!`,
    },

    { type: 'heading', level: 2, text: 'Nullish Coalescing (??)', id: 'nullish-coalescing' },
    { type: 'paragraph', text: 'The `??` operator returns the right-hand side only when the left is `null` or `undefined`. Unlike `||`, it preserves falsy values like `0`, `""`, and `false`.' },
    {
      type: 'code', language: 'javascript', filename: 'nullish.js',
      code: `// ?? vs || comparison
0 ?? 'default'       // 0       (0 is NOT null/undefined)
0 || 'default'       // "default" (0 is falsy)

'' ?? 'default'      // ""      (empty string is NOT null/undefined)
'' || 'default'      // "default" (empty string is falsy)

false ?? 'default'   // false   (false is NOT null/undefined)
false || 'default'   // "default" (false is falsy)

null ?? 'default'    // "default"
undefined ?? 'default' // "default"

// Real-world usage
function getConfig(options) {
  return {
    port: options.port ?? 3000,         // 0 is a valid port
    debug: options.debug ?? false,       // false is intentional
    name: options.name ?? 'my-app',      // '' might be valid
    timeout: options.timeout ?? 5000,
  };
}

// Cannot mix ?? with && or || without parentheses
// null ?? true && false  // SyntaxError!
(null ?? true) && false   // false (OK with parens)`,
    },

    { type: 'heading', level: 2, text: 'Optional Chaining (?.)', id: 'optional-chaining' },
    { type: 'paragraph', text: 'Optional chaining short-circuits to `undefined` if any part of the chain is `null` or `undefined`. No more "Cannot read property of undefined" errors.' },
    {
      type: 'code', language: 'javascript', filename: 'optional-chaining.js',
      code: `const user = {
  name: 'Alice',
  address: {
    city: 'NYC',
    geo: { lat: 40.7, lng: -74.0 }
  },
  getFullName() { return 'Alice Smith'; }
};

// Property access
user?.address?.city         // "NYC"
user?.phone?.number         // undefined (no error!)
user?.address?.zip?.code    // undefined

// Method calls
user?.getFullName?.()       // "Alice Smith"
user?.getNickname?.()       // undefined (no error)

// Array element access
const users = [{ name: 'Alice' }, { name: 'Bob' }];
users?.[0]?.name            // "Alice"
users?.[5]?.name            // undefined

// Combined with ??
const city = user?.address?.city ?? 'Unknown';
const phone = user?.phone?.number ?? 'Not provided';

// Without optional chaining (the old way)
const oldCity = user && user.address && user.address.city
  ? user.address.city
  : 'Unknown';`,
    },

    { type: 'heading', level: 2, text: 'Spread & Rest Operators (...)', id: 'spread-rest' },
    { type: 'paragraph', text: 'The `...` syntax does two things depending on context: spread (expanding) and rest (collecting).' },
    {
      type: 'code', language: 'javascript', filename: 'spread-rest.js',
      code: `// SPREAD — expands iterables/objects

// Arrays
const arr = [1, 2, 3];
const copy = [...arr];            // [1, 2, 3]
const merged = [...arr, 4, 5];    // [1, 2, 3, 4, 5]
Math.max(...arr);                 // 3

// Objects
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const config = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "en" } — later wins

// Function call
function add(a, b, c) { return a + b + c; }
add(...[1, 2, 3]); // 6

// REST — collects remaining items

// Function parameters
function sum(first, ...rest) {
  return rest.reduce((acc, n) => acc + n, first);
}
sum(1, 2, 3, 4); // 10

// Destructuring
const [head, ...tail] = [1, 2, 3, 4];
// head = 1, tail = [2, 3, 4]

const { name, ...metadata } = { name: 'Alice', age: 30, city: 'NYC' };
// name = "Alice", metadata = { age: 30, city: "NYC" }`,
    },

    { type: 'heading', level: 2, text: 'Ternary Operator', id: 'ternary' },
    { type: 'paragraph', text: 'The ternary operator (`?:`) is a concise alternative to `if/else` for simple conditions. Avoid nesting ternaries though — they get hard to read fast.' },
    {
      type: 'code', language: 'javascript', filename: 'ternary.js',
      code: `const age = 20;
const status = age >= 18 ? 'adult' : 'minor';

// In template literals
const msg = \`You are \${age >= 18 ? 'an adult' : 'a minor'}\`;

// In JSX / React
const Button = ({ isLoading }) => (
  <button disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Submit'}
  </button>
);

// Nested ternary (AVOID — hard to read)
const category = age < 13 ? 'child' : age < 18 ? 'teen' : 'adult';

// Better: use a function or if/else
function getCategory(age) {
  if (age < 13) return 'child';
  if (age < 18) return 'teen';
  return 'adult';
}`,
    },

    { type: 'heading', level: 2, text: 'Bitwise Operators', id: 'bitwise' },
    { type: 'paragraph', text: 'Bitwise operators work on 32-bit integers. They\'re rare in everyday JavaScript but useful for flags, permissions, and low-level optimizations.' },
    {
      type: 'code', language: 'javascript', filename: 'bitwise.js',
      code: `// Basic bitwise operators
5 & 3    // 1  (AND:  0101 & 0011 = 0001)
5 | 3    // 7  (OR:   0101 | 0011 = 0111)
5 ^ 3    // 6  (XOR:  0101 ^ 0011 = 0110)
~5       // -6 (NOT:  inverts all bits)
5 << 1   // 10 (left shift: multiply by 2)
5 >> 1   // 2  (right shift: divide by 2)

// Permission flags (common pattern)
const READ    = 0b0001; // 1
const WRITE   = 0b0010; // 2
const EXECUTE = 0b0100; // 4
const ADMIN   = 0b1000; // 8

// Combine permissions with OR
const userPerms = READ | WRITE;  // 0b0011 = 3

// Check permission with AND
const canRead = (userPerms & READ) !== 0;    // true
const canExecute = (userPerms & EXECUTE) !== 0; // false

// Toggle permission with XOR
const toggled = userPerms ^ WRITE;  // Removes WRITE

// Quick integer tricks
~~3.7     // 3 (faster Math.floor for positive numbers)
5 | 0     // 5 (convert to integer)
'42' | 0  // 42 (parse integer)`,
    },

    { type: 'heading', level: 2, text: 'Comma Operator', id: 'comma' },
    { type: 'paragraph', text: 'The comma operator evaluates expressions from left to right and returns the last one. Rarely used but shows up in `for` loops and minified code.' },
    {
      type: 'code', language: 'javascript', filename: 'comma.js',
      code: `// Comma in for loops (common)
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j);
}

// Comma expression (rare)
const result = (1 + 2, 3 + 4, 5 + 6);
// result = 11 (only the last expression is returned)

// In arrow functions (for side effects)
const log = (x) => (console.log(x), x);
// Logs x and returns x`,
    },

    { type: 'heading', level: 2, text: 'Operator Precedence', id: 'precedence' },
    { type: 'paragraph', text: 'Operators have different precedence levels that determine evaluation order. When in doubt, use parentheses for clarity.' },
    {
      type: 'table',
      headers: ['Precedence', 'Operator', 'Description'],
      rows: [
        ['1 (highest)', '()', 'Grouping'],
        ['2', '.  ?.  []', 'Member access'],
        ['3', '()  new', 'Function call / constructor'],
        ['4', '++ --', 'Postfix increment/decrement'],
        ['5', '! ~ typeof void delete', 'Unary'],
        ['6', '**', 'Exponentiation'],
        ['7', '* / %', 'Multiplication'],
        ['8', '+ -', 'Addition'],
        ['9', '<< >> >>>', 'Bitwise shift'],
        ['10', '< > <= >= instanceof in', 'Relational'],
        ['11', '== != === !==', 'Equality'],
        ['12', '&&', 'Logical AND'],
        ['13', '||', 'Logical OR'],
        ['14', '??', 'Nullish coalescing'],
        ['15', '? :', 'Ternary'],
        ['16 (lowest)', '= += -= etc.', 'Assignment'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'precedence-examples.js',
      code: `// Precedence determines evaluation order
2 + 3 * 4       // 14 (not 20)
(2 + 3) * 4     // 20

// && has higher precedence than ||
true || false && false  // true  (evaluates as: true || (false && false))
(true || false) && false // false

// Assignment is very low precedence
let x = 1 + 2 * 3;     // x = 7  (evaluates 2*3 first, then +1)

// When in doubt, use parentheses!
const result = (a > b) ? (a - b) : (b - a);`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Using || when ?? is needed
function setVolume(level) {
  level = level || 50;  // Bug: setVolume(0) gives 50!
  level = level ?? 50;  // Correct: 0 is preserved
}

// 2. Forgetting short-circuit side effects
let count = 0;
false && count++;  // count stays 0 (right side never executes)
true || count++;   // count stays 0 (right side never executes)

// 3. Chaining comparisons (doesn’t work like math)
const x = 5;
1 < x < 3       // true — but WRONG reasoning!
// Evaluates as: (1 < 5) < 3 → true < 3 → 1 < 3 → true
// Correct way:
1 < x && x < 3  // false (5 is not less than 3)

// 4. = vs === in conditions
if (x = 5) {    // Assignment, not comparison! Always true
  // This always runs
}
if (x === 5) {  // Correct comparison
  // Runs only when x is 5
}

// 5. typeof pitfalls
typeof null === 'object'  // true (historical bug)
typeof NaN === 'number'   // true (NaN is a number!)
typeof [] === 'object'    // true (use Array.isArray)`,
    },

    { type: 'heading', level: 2, text: 'Real-World Patterns', id: 'patterns' },
    {
      type: 'code', language: 'javascript', filename: 'patterns.js',
      code: `// Safe property access with defaults
const theme = user?.preferences?.theme ?? 'light';
const fontSize = config?.display?.fontSize ?? 16;

// Conditional object property
const query = {
  status: 'active',
  ...(role === 'admin' && { includeDeleted: true }),
  ...(search && { q: search }),
};

// Toggle boolean
let isOpen = false;
isOpen = !isOpen; // true

// Clamp a value between min and max
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
clamp(150, 0, 100); // 100
clamp(-5, 0, 100);  // 0

// Convert to boolean
const hasItems = !!items?.length;
const isValid = Boolean(value);

// Swap without temp variable
let a = 1, b = 2;
[a, b] = [b, a];`,
    },

    { type: 'heading', level: 2, text: 'in and instanceof', id: 'in-instanceof' },
    { type: 'paragraph', text: 'The `in` operator checks if a property exists in an object. `instanceof` checks if an object is an instance of a constructor.' },
    {
      type: 'code', language: 'javascript', filename: 'in-instanceof.js',
      code: `// in — checks property existence
const car = { make: 'Toyota', year: 2020 };
'make' in car     // true
'color' in car    // false
'toString' in car // true (inherited from prototype)

// Useful with optional properties
if ('email' in formData) {
  validateEmail(formData.email);
}

// instanceof — checks prototype chain
const date = new Date();
date instanceof Date    // true
date instanceof Object  // true (Date inherits from Object)

[] instanceof Array     // true
[] instanceof Object    // true

// Custom classes
class Animal {}
class Dog extends Animal {}
const dog = new Dog();
dog instanceof Dog      // true
dog instanceof Animal   // true

// Caveat: doesn’t work across iframes/realms
// Use Array.isArray() instead of instanceof Array`,
    },

    { type: 'heading', level: 2, text: 'Best Practices Summary', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use `===` over `==` — the only exception is `value == null`',
        'Use `??` for defaults when `0`, `""`, or `false` are valid values',
        'Use `?.` to safely access nested properties without verbose null checks',
        'Prefer explicit parentheses over relying on operator precedence',
        'Avoid nested ternaries — use functions or `if/else` instead',
        'Use logical assignment (`??=`, `||=`, `&&=`) to simplify conditionals',
        'Use spread `...` for immutable array/object operations',
        'Convert to boolean with `Boolean()` or `!!` — prefer `Boolean()` for readability',
        'Use `Array.isArray()` instead of `instanceof Array` for cross-realm safety',
      ],
    },
  ],
};
