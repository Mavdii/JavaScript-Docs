import type { LessonContent } from '@/types/content';

export const typeCoercionLesson: LessonContent = {
  id: 'type-coercion-001',
  title: 'JavaScript Type Coercion',
  description: 'Deep dive into implicit and explicit type conversion in JavaScript, understanding how values are automatically converted between types.',
  slug: 'learn/fundamentals/type-coercion',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['types', 'coercion', 'conversion', 'equality', 'primitives'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'Learn how JavaScript coerces values between types, including implicit conversions, the abstract equality operator, and best practices for avoiding type-related bugs.',
  relatedTopics: ['data-types', 'equality-operators', 'type-checking'],
  order: 12,
  updatedAt: '2024-01-15T10:30:00Z',
  readingTime: 18,
  featured: false,
  keywords: ['type coercion', 'type conversion', 'implicit conversion', 'explicit conversion', 'truthy', 'falsy', 'abstract equality'],
  prerequisites: ['data-types', 'operators'],
  learningGoals: [
    'Understand the difference between implicit and explicit type coercion',
    'Master the rules of abstract equality (==) versus strict equality (===)',
    'Learn how values convert to booleans in conditional contexts',
    'Avoid common type coercion pitfalls and bugs',
    'Use type coercion intentionally for cleaner code'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'What is Type Coercion?',
      id: 'what-is-type-coercion'
    },
    {
      type: 'paragraph',
      text: 'Type coercion is the automatic conversion of values from one data type to another. JavaScript is a dynamically typed language, which means the language engine performs coercion automatically in many contexts. This can be convenient but also a source of unexpected behavior if you don\'t understand how it works.'
    },
    {
      type: 'paragraph',
      text: 'There are two main types of coercion: implicit coercion happens automatically when the context requires a different type, while explicit coercion is when you intentionally convert a value using methods like Number(), String(), or Boolean().'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Implicit Coercion Rules',
      id: 'implicit-coercion-rules'
    },
    {
      type: 'heading',
      level: 3,
      text: 'String Coercion',
      id: 'string-coercion'
    },
    {
      type: 'paragraph',
      text: 'When a value is used in a string context, JavaScript converts it to a string. This happens with the + operator when one operand is a string, and with template literals.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `const num = 42;
const bool = true;
const obj = { name: 'John' };

// String concatenation triggers implicit string coercion
console.log('The answer is ' + num); // "The answer is 42"
console.log('Value: ' + bool); // "Value: true"
console.log('Object: ' + obj); // "Object: [object Object]"

// Template literals also coerce to strings
console.log(\`Number: \${num}\`); // "Number: 42"

// Array toString() coercion
console.log('Array: ' + [1, 2, 3]); // "Array: 1,2,3"
console.log('Nested: ' + [[1, 2], [3, 4]]); // "Nested: 1,2,3,4"`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Numeric Coercion',
      id: 'numeric-coercion'
    },
    {
      type: 'paragraph',
      text: 'When a value is used in a mathematical context, JavaScript converts it to a number. This happens with arithmetic operators (except +), comparison operators, and logical operators.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Arithmetic operations trigger numeric coercion
console.log('5' - 2); // 3 (not "52")
console.log('10' / '2'); // 5
console.log('5' * '2'); // 10
console.log(true + 1); // 2 (true becomes 1)
console.log(false + 10); // 10 (false becomes 0)

// Unary plus operator explicitly coerces to number
console.log(+'42'); // 42
console.log(+true); // 1
console.log(+false); // 0
console.log(+null); // 0
console.log(+undefined); // NaN

// Comparison operators coerce operands
console.log('2' > '10'); // true (string comparison)
console.log('2' > 10); // false (numeric comparison)
console.log(null == 0); // false (special case)
console.log(null >= 0); // true (coerces to 0)`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Boolean Coercion',
      id: 'boolean-coercion'
    },
    {
      type: 'paragraph',
      text: 'When a value is used in a boolean context (like in if statements or with logical operators), it\'s converted to a boolean. Certain values are falsy and convert to false, while all others are truthy.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Falsy values
const falsyValues = [false, 0, -0, 0n, '', null, undefined, NaN];

falsyValues.forEach(value => {
  console.log(Boolean(value)); // Always false
  if (value) {
    console.log('This will not execute');
  }
});

// Everything else is truthy
console.log(Boolean([])); // true (arrays are truthy)
console.log(Boolean({})); // true (objects are truthy)
console.log(Boolean('0')); // true (non-empty strings are truthy)
console.log(Boolean(1)); // true

// Double negation converts to boolean
console.log(!![]); // true
console.log(!!0); // false
console.log(!!{name: 'John'}); // true

// Logical operators use boolean coercion
if ('hello' && 42) {
  console.log('Both are truthy');
}

const result = null || 'default'; // 'default'
const value = 0 || 100; // 100`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Abstract Equality (==) vs Strict Equality (===)',
      id: 'abstract-vs-strict-equality'
    },
    {
      type: 'paragraph',
      text: 'The most confusing aspect of type coercion is the abstract equality operator (==). It performs type coercion before comparison, while strict equality (===) does not. Understanding these comparison rules is crucial for writing predictable code.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Abstract equality (==) performs type coercion
console.log(1 == '1'); // true (string coerced to number)
console.log(0 == false); // true (boolean coerced to number)
console.log(null == undefined); // true (special case)
console.log('' == false); // true (both coerce to 0)
console.log('0' == false); // true

// Strict equality (===) requires same type and value
console.log(1 === '1'); // false
console.log(0 === false); // false
console.log(null === undefined); // false
console.log('' === false); // false

// Abstract equality coercion rules
console.log([] == false); // true
console.log([] == ''); // true
console.log([] == 0); // true
console.log('0' == 0); // true
console.log(new Number(5) == 5); // true

// These comparisons can be surprising!
console.log([] == ![]); // true (both sides coerce to 0)
console.log('' == +''); // true (both coerce to 0)
console.log('00' == '0'); // false (string comparison, different values)`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Explicit Type Conversion',
      id: 'explicit-type-conversion'
    },
    {
      type: 'paragraph',
      text: 'While implicit coercion happens automatically, you can also explicitly convert values using built-in constructor functions or methods. This is often clearer and more predictable than relying on implicit coercion.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Explicit to String
console.log(String(42)); // "42"
console.log(String(true)); // "true"
console.log(String(null)); // "null"
console.log(String(undefined)); // "undefined"
console.log((42).toString()); // "42"

// Explicit to Number
console.log(Number('42')); // 42
console.log(Number('3.14')); // 3.14
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN
console.log(Number('')); // 0
console.log(Number('abc')); // NaN
console.log(parseInt('42', 10)); // 42
console.log(parseFloat('3.14')); // 3.14

// Explicit to Boolean
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean('hello')); // true
console.log(Boolean('')); // false
console.log(!!'value'); // true (double negation)`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Common Pitfalls and Best Practices',
      id: 'common-pitfalls'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Avoid Abstract Equality',
      text: 'Using == instead of === can lead to unexpected results. Modern JavaScript style guides recommend always using === to avoid confusion and bugs caused by type coercion.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// PITFALL: Using == can be unpredictable
if (userInput == 0) {
  // This runs for 0, '0', '', false, null, undefined
  console.log('Zero or falsy');
}

// BETTER: Use === for predictable behavior
if (userInput === 0) {
  // This only runs if userInput is exactly the number 0
  console.log('Exactly zero');
}

// PITFALL: Forgetting + is string concatenation when one operand is a string
const result = 5 + 2; // 7 (addition)
const result2 = 5 + '2'; // "52" (concatenation)

// BETTER: Be explicit about type conversion
const num = parseInt('5', 10);
const str = String(2);
const combined = num + parseInt(str, 10); // 7

// PITFALL: Array/object comparisons
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
console.log(arr1 == arr2); // false (different object references)

// BETTER: Compare contents explicitly
console.log(JSON.stringify(arr1) === JSON.stringify(arr2)); // true`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Type Coercion Decision Tree',
      id: 'coercion-decision-tree'
    },
    {
      type: 'table',
      headers: ['Operation', 'Coercion Type', 'Example', 'Result'],
      rows: [
        ['String concatenation (+)', 'To String', '"Value: " + 42', '"Value: 42"'],
        ['Arithmetic operations', 'To Number', '"5" - 2', '3'],
        ['Comparison operators', 'To Number', '"10" > "9"', 'false'],
        ['Logical operators (&&, ||)', 'To Boolean', 'if ("text") {}', 'true'],
        ['Unary plus (+)', 'To Number', '+"42"', '42'],
        ['Double negation (!!)', 'To Boolean', '!!"hello"', 'true'],
        ['Abstract equality (==)', 'Mixed', '0 == false', 'true']
      ]
    },
    {
      type: 'heading',
      level: 2,
      text: 'Real-World Examples',
      id: 'real-world-examples'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Example 1: Form validation
function validateAge(input) {
  // WRONG: Comparing form input (string) with number using ==
  if (input == 18) {
    console.log('You are 18');
  }
  
  // CORRECT: Explicitly convert and use ===
  const age = parseInt(input, 10);
  if (age === 18) {
    console.log('You are exactly 18');
  }
}

// Example 2: Default values with logical OR
function greet(name) {
  // Coerces to use default if name is falsy
  const displayName = name || 'Guest';
  return \`Hello, \${displayName}\`;
}

// Modern alternative using nullish coalescing
function greetModern(name) {
  const displayName = name ?? 'Guest'; // Only defaults for null/undefined
  return \`Hello, \${displayName}\`;
}

// Example 3: Working with API responses
function processData(response) {
  // API might return string numbers
  const count = Number(response.count);
  const isActive = response.status === 'active'; // Strict comparison
  const items = response.items || []; // Default with coercion
  
  return { count, isActive, items };
}

// Example 4: Array flattening via coercion
const values = [1, '2', true, null, undefined];
const sum = values.reduce((acc, val) => {
  return acc + Number(val); // Explicitly convert each value
}, 0);
console.log(sum); // 4 (1 + 2 + 1 + 0 + 0)`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Summary',
      id: 'summary'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Key Takeaways',
      text: 'Type coercion is automatic value conversion in JavaScript. Always use === instead of == for comparisons. Understand falsy values (false, 0, "", null, undefined, NaN). Use explicit conversion (Number(), String(), Boolean()) when you need clarity. Be aware of coercion in string concatenation with + and arithmetic operations.'
    }
  ],
  exercises: [
    'Compare == vs === in various scenarios and predict the outcomes',
    'Identify all falsy values and test their behavior in conditional statements',
    'Refactor code using == to use === and verify behavior remains correct',
    'Create a comparison matrix showing type coercion results for different value pairs',
    'Debug a form validation function that relies on implicit coercion',
    'Implement a function that safely converts mixed types to numbers for calculations'
  ]
};
