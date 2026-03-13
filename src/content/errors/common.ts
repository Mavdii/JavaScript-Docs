import type { ErrorGuideContent } from '@/types/content';

export const commonErrorsGuide: ErrorGuideContent = {
  id: 'error-common',
  title: 'Common JavaScript Errors',
  description: 'Understand and fix the most common JavaScript errors.',
  slug: 'errors/common',
  pillar: 'errors',
  category: 'error-types',
  tags: ['errors', 'TypeError', 'ReferenceError', 'debugging'],
  difficulty: 'beginner',
  contentType: 'error-guide',
  summary: 'A practical guide to understanding, diagnosing, and fixing the most frequently encountered JavaScript errors — with real-world examples and prevention strategies.',
  relatedTopics: ['error-debugging', 'error-handling'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 20,
  featured: true,
  keywords: ['TypeError', 'ReferenceError', 'SyntaxError', 'common errors'],
  errorType: 'Runtime Errors',
  solutions: [
    'Always check if a value exists before accessing properties on it.',
    'Use const/let instead of var to avoid hoisting issues.',
    'Enable strict mode to catch silent errors.',
    'Use TypeScript for compile-time error detection.',
    'Use optional chaining (?.) and nullish coalescing (??) as defensive patterns.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'TypeError: Cannot read properties of undefined', id: 'typeerror-undefined' },
    { type: 'paragraph', text: 'The most common JavaScript error. Occurs when you try to access a property or call a method on undefined or null. This often happens with nested objects, API responses, or uninitialized state.' },
    { type: 'code', language: 'javascript', code: `// ❌ Common scenarios that cause this error

// 1. Accessing property on undefined variable
const user = undefined;
console.log(user.name); // TypeError: Cannot read property 'name' of undefined

// 2. Missing return value
function getUser() {
  // forgot to return something
}
const user = getUser(); // undefined
console.log(user.name); // TypeError

// 3. Nested property access without checking
const response = { data: { user: null } };
console.log(response.data.user.name); // TypeError

// 4. Array element doesn’t exist
const users = [];
console.log(users[0].id); // TypeError if array is empty

// ✅ Solutions

// 1. Check before accessing
const user = getUser();
if (user) {
  console.log(user.name);
}

// 2. Use optional chaining (?.)
console.log(user?.name); // undefined instead of error
console.log(response?.data?.user?.name); // safe nested access

// 3. Provide default values
console.log(user?.name ?? 'Anonymous');

// 4. Use nullish coalescing with optional chaining
const name = user?.name ?? 'Unknown';

// 5. Destructure with defaults
const { name = 'Anonymous' } = user || {};

// 6. Guard clauses
function processUser(user) {
  if (!user || !user.name) {
    console.log('Invalid user');
    return;
  }
  console.log(user.name);
}` },

    { type: 'heading', level: 2, text: 'ReferenceError: Variable is not defined', id: 'referenceerror' },
    { type: 'code', language: 'javascript', code: `// â Variable doesn’t exist or is out of scope
console.log(userName); // ReferenceError: userName is not defined

// ❌ Typo in variable name
const firstName = 'Alice';
console.log(firstname); // ReferenceError (lowercase)

// ❌ Variable used before declaration (let/const)
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// ✅ Solutions

// 1. Check spelling
const firstName = 'Alice';
console.log(firstName); // ✅

// 2. Declare before using
let x = 5;
console.log(x); // ✅

// 3. Check variable scope
function outer() {
  let x = 5;
  
  function inner() {
    console.log(x); // ✅ accessible in inner scope
  }
  inner();
}

// 4. Use TypeScript to catch typos at compile time
const firstName: string = 'Alice';
console.log(firstName); // ✅ caught by IDE

// 5. Use a linter (ESLint) to catch undefined variables
// Set up ESLint with 'no-undef' rule` },

    { type: 'heading', level: 2, text: 'TypeError: Cannot read property of null', id: 'typeerror-null' },
    { type: 'code', language: 'javascript', code: `// ❌ Explicitly null value
let user = null;
console.log(user.name); // TypeError: Cannot read property 'name' of null

// â DOM element doesn’t exist
const button = document.querySelector('.nonexistent-button');
console.log(button.addEventListener('click', () => {})); // TypeError

// ✅ Solutions

// 1. Check for null explicitly
if (user !== null && user !== undefined) {
  console.log(user.name);
}

// 2. Use optional chaining and nullish coalescing
console.log(user?.name ?? 'Guest');

// 3. For DOM, check if element exists
const button = document.querySelector('.button');
if (button) {
  button.addEventListener('click', () => {});
}

// 4. Provide default values
const name = user?.name || 'Anonymous';

// 5. Use try/catch as last resort (not preferred)
try {
  console.log(user.name);
} catch (e) {
  console.log('User is null');
}` },

    { type: 'heading', level: 2, text: 'SyntaxError', id: 'syntaxerror' },
    { type: 'paragraph', text: 'Syntax errors occur before the code even runs. The JavaScript parser rejects the code because it violates the language\'s rules.' },
    { type: 'code', language: 'javascript', code: `// ❌ Missing semicolon (sometimes)
const x = 5
const y = 10

// ❌ Mismatched brackets
function test() {
  console.log('hello')
} // missing closing brace

// ❌ Invalid JSON in JSON.parse
JSON.parse('{invalid json}'); // SyntaxError

// ❌ Invalid template string
const name = 'Alice';
const msg = \`Hello \${name; // missing closing brace

// ✅ Solutions

// 1. Use a code formatter (Prettier)
// Automatically fixes many syntax issues

// 2. Use a linter (ESLint)
// Catches syntax errors before runtime

// 3. Use IDE with syntax highlighting
// Shows errors immediately

// 4. For JSON parsing, wrap in try/catch
try {
  const data = JSON.parse(jsonString);
} catch (e) {
  console.error('Invalid JSON:', e.message);
}

// 5. Validate before parsing
function safeParse(json) {
  if (typeof json !== 'string') {
    throw new Error('Expected string');
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error(\`Invalid JSON: \${e.message}\`);
  }
}` },

    { type: 'heading', level: 2, text: 'Array Index Out of Bounds', id: 'array-bounds' },
    { type: 'code', language: 'javascript', code: `// ❌ Accessing non-existent array index
const arr = [1, 2, 3];
console.log(arr[5]); // undefined (not an error, but often a bug)
console.log(arr[5].toString()); // TypeError: Cannot read property 'toString' of undefined

// ❌ Assuming array has elements
const items = [];
const first = items[0]; // undefined
console.log(first.id); // TypeError

// ✅ Solutions

// 1. Check array length
if (arr.length > 5) {
  console.log(arr[5]);
}

// 2. Use array methods instead of index access
const first = arr[0] ?? 'default';

// 3. Use destructuring with defaults
const [first, second, third = 'default'] = arr;

// 4. Check before accessing
const items = [];
if (items.length > 0) {
  console.log(items[0].id);
}

// 5. Use optional chaining
console.log(arr[5]?.toString()); // undefined instead of error

// 6. Use try/catch as last resort
try {
  processArray(arr[i]);
} catch (e) {
  console.error('Invalid array access');
}` },

    { type: 'heading', level: 2, text: 'Unexpected Token Errors', id: 'unexpected-token' },
    { type: 'paragraph', text: 'These occur when the parser encounters a token it doesn\'t expect in that context.' },
    { type: 'code', language: 'javascript', code: `// ❌ Using await outside async function
function getData() {
  const data = await fetch('/api/data'); // SyntaxError
}

// ❌ Missing comma in object
const obj = {
  name: 'Alice'
  age: 30 // SyntaxError: Unexpected identifier
};

// ❌ Invalid use of spread operator
const obj = { x: 1, y: 2 };
const copy = { ...obj, ...obj }; // Valid, but easy to mess up

// ✅ Solutions

// 1. Make function async to use await
async function getData() {
  const data = await fetch('/api/data'); // ✅
}

// 2. Add missing comma
const obj = {
  name: 'Alice',
  age: 30
};

// 3. Use proper spread syntax
const merged = { ...obj1, ...obj2 };

// 4. Use a code formatter to fix automatically
// Prettier catches most of these

// 5. Enable strict mode to catch more errors
'use strict';
// Disallows undeclared variables, etc.` },

    { type: 'heading', level: 2, text: 'Debug Strategy', id: 'debug-strategy' },
    { type: 'paragraph', text: 'When you encounter an error, follow this systematic approach:' },
    { type: 'list', items: [
      'Read the error message carefully — it tells you what and where',
      'Check the line number and look at the code',
      'Add console.log statements before the error to see the state',
      'Use browser DevTools debugger to step through code',
      'Check variable types with typeof or console.log',
      'Isolate the problem by narrowing down which line causes it',
      'Test with simple values first, then complex ones',
      'Check similar code that works for comparison',
    ] },

    { type: 'heading', level: 2, text: 'Prevention Strategies', id: 'prevention' },
    { type: 'list', items: [
      'Use TypeScript to catch errors at compile time',
      'Use ESLint to enforce best practices',
      'Use strict mode ("use strict")',
      'Write tests to catch regressions',
      'Use optional chaining (?.) and nullish coalescing (??)',
      'Use guard clauses to check preconditions',
      'Keep functions small and focused',
      'Add JSDoc comments for clarity',
    ] },

    { type: 'callout', variant: 'tip', title: 'Error Messages are Helpful', text: 'Don\'t ignore error messages. They tell you exactly what went wrong and where. Read them carefully — they\'re your debugging best friend.' },
  ],
};
