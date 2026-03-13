import type { ReferenceContent } from '@/types/content';
export const objectKeysReference: ReferenceContent = {
  id: 'object-keys', title: 'Object.keys()', description: 'Returns an array of an object\'s own enumerable string-keyed property names.', slug: 'reference/object/keys', pillar: 'reference', category: 'object', tags: ['object','keys','properties','enumerable'], difficulty: 'beginner', contentType: 'reference', summary: 'Object.keys() returns an array of own enumerable string-keyed property names in the same order as a for...in loop.', relatedTopics: ['object-values','object-entries'], order: 1, updatedAt: '2024-03-01',
  signature: 'Object.keys(obj)',
  parameters: [{ name: 'obj', type: 'object', description: 'The object whose own enumerable string-keyed property names are returned.' }],
  returnValue: { type: 'string[]', description: 'Array of property name strings.' },
  compatibility: 'ES5+ — All browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'Object.keys() gives you an array of all the property names on an object. It only includes your own properties, not ones you inherited. The order is the same as for...in loops (integers first sorted numerically, then strings in insertion order).' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'keys-basic.js', code: `const obj = { a: 1, b: 2, c: 3 };\nObject.keys(obj); // ['a', 'b', 'c']\n\n// Count properties\nObject.keys(obj).length; // 3\n\n// Check if empty\nObject.keys(obj).length === 0; // false\nObject.keys({}).length === 0;  // true\n\n// Integer keys are sorted numerically\nconst mixed = { 10: 'ten', 2: 'two', name: 'Test' };\nObject.keys(mixed); // ['2', '10', 'name']` },

    { type: 'heading', level: 2, text: 'Iterating Keys', id: 'iterating' },
    { type: 'code', language: 'javascript', filename: 'keys-iterate.js', code: `const user = { name: 'Alice', age: 30, city: 'NYC' };\n\n// Simple iteration\nfor (const key of Object.keys(user)) {\n  console.log(key);\n}\n\n// With values (use entries instead, but this works)\nfor (const key of Object.keys(user)) {\n  console.log(\\\`\\\${key}: \\\${user[key]}\\\`);\n}\n\n// Better: use Object.entries for key-value pairs\nfor (const [key, value] of Object.entries(user)) {\n  console.log(\\\`\\\${key}: \\\${value}\\\`);\n}` },

    { type: 'heading', level: 2, text: 'Filtering Properties', id: 'filtering' },
    { type: 'code', language: 'javascript', filename: 'keys-filter.js', code: `const config = { apiUrl: 'https://api.dev.com', debug: true, secret: 'xyz' };\n\n// Get non-secret keys\nconst publicKeys = Object.keys(config).filter(\n  key => !['secret', 'apiKey'].includes(key)\n);\n// ['apiUrl', 'debug']\n\n// Get keys with string values\nconst stringKeys = Object.keys(config).filter(\n  key => typeof config[key] === 'string'\n);\n// ['apiUrl', 'secret']\n\n// Get all keys except specific ones\nfunction omit(obj, keysToRemove) {\n  return Object.keys(obj).filter(k => !keysToRemove.includes(k));\n}\nomit(config, ['secret']); // ['apiUrl', 'debug']` },

    { type: 'heading', level: 2, text: 'Checking for Properties', id: 'checking' },
    { type: 'code', language: 'javascript', filename: 'keys-checking.js', code: `const obj = { x: 1, y: 2 };\n\n// Does property exist?\nObject.keys(obj).includes('x'); // true\nObject.keys(obj).includes('z'); // false\n\n// Better alternative: use 'in' operator or hasOwnProperty\n’x' in obj; // true\nobj.hasOwnProperty('x'); // true\n\n// Do all required properties exist?\nconst required = ['name', 'email', 'password'];\nconst form = { name: 'Alice', email: 'alice@test.com', password: '123' };\nconst hasAll = required.every(key => Object.keys(form).includes(key));\n\n// Cleaner with in operator\nconst hasAll2 = required.every(key => key in form);` },

    { type: 'heading', level: 2, text: 'Only Own Properties', id: 'own-properties' },
    { type: 'paragraph', text: 'Object.keys() only returns own properties, not inherited ones. This is different from for...in, which includes inherited properties.' },
    { type: 'code', language: 'javascript', filename: 'keys-own.js', code: `const parent = { inherited: 'from parent' };\nconst child = Object.create(parent);\nchild.own = 'from child';\n\nObject.keys(child);    // ['own'] — only own properties\nfor (const key in child) {\n  console.log(key);    // 'own', then 'inherited' (includes inherited)\n}\n\n// If you want inherited properties too:\nconst allKeys = [];\nfor (const key in child) {\n  allKeys.push(key);\n}\n// or filter them:\nconst allKeysFiltered = Object.keys(child).concat(\n  Object.getOwnPropertyNames(parent)\n);` },

    { type: 'heading', level: 2, text: 'Working with Object.entries()', id: 'with-entries' },
    { type: 'code', language: 'javascript', filename: 'keys-entries.js', code: `const prices = { apple: 1.5, banana: 0.75, cherry: 3.0 };\n\n// Get keys\nconst keys = Object.keys(prices);\n// ['apple', 'banana', 'cherry']\n\n// Get entries (key-value pairs)\nconst entries = Object.entries(prices);\n// [['apple', 1.5], ['banana', 0.75], ['cherry', 3.0]]\n\n// Get values\nconst values = Object.values(prices);\n// [1.5, 0.75, 3.0]\n\n// Prefer Object.entries for key-value work\n// It’s cleaner than Object.keys when you need both` },

    { type: 'heading', level: 2, text: 'Common Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'keys-patterns.js', code: `// Pick specific properties\nfunction pick(obj, keys) {\n  const result = {};\n  keys.forEach(key => {\n    if (key in obj) result[key] = obj[key];\n  });\n  return result;\n}\npick({ a: 1, b: 2, c: 3 }, ['a', 'c']);\n// { a: 1, c: 3 }\n\n// Or with Object.entries (cleaner)\nfunction pick2(obj, keys) {\n  return Object.fromEntries(\n    Object.entries(obj).filter(([k]) => keys.includes(k))\n  );\n}\n\n// Map object properties\nfunction mapKeys(obj, fn) {\n  const result = {};\n  Object.keys(obj).forEach(key => {\n    result[fn(key)] = obj[key];\n  });\n  return result;\n}\nmapKeys({ a: 1, b: 2 }, k => k.toUpperCase());\n// { A: 1, B: 2 }\n\n// Count properties by type\nfunction countByType(obj) {\n  return Object.keys(obj).reduce((counts, key) => {\n    const type = typeof obj[key];\n    counts[type] = (counts[type] || 0) + 1;\n    return counts;\n  }, {});\n}` },

    { type: 'heading', level: 2, text: 'Excluding Non-Enumerable Properties', id: 'enumerable' },
    { type: 'paragraph', text: 'Object.keys() only includes enumerable properties. If you need all own properties (including non-enumerable ones), use getOwnPropertyNames().' },
    { type: 'code', language: 'javascript', filename: 'keys-enumerable.js', code: `const obj = { a: 1, b: 2 };\nObject.defineProperty(obj, 'hidden', {\n  value: 'secret',\n  enumerable: false\n});\n\nObject.keys(obj);              // ['a', 'b']\nObject.getOwnPropertyNames(obj); // ['a', 'b', 'hidden']\n\n// Check if property is enumerable\nObject.getOwnPropertyDescriptor(obj, 'a').enumerable;      // true\nObject.getOwnPropertyDescriptor(obj, 'hidden').enumerable; // false` },

    { type: 'heading', level: 2, text: 'Symbol Properties', id: 'symbols' },
    { type: 'paragraph', text: 'Object.keys() doesn\'t include Symbol properties. Use getOwnPropertySymbols() for those.' },
    { type: 'code', language: 'javascript', filename: 'keys-symbols.js', code: `const sym = Symbol('id');\nconst obj = { a: 1, [sym]: 'secret' };\n\nObject.keys(obj);              // ['a']\nObject.getOwnPropertySymbols(obj); // [Symbol(id)]\n\nobj[sym]; // 'secret'` },

    { type: 'heading', level: 2, text: 'Comparison Table', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Own only', 'Inherited', 'Enumerable', 'Symbols'], rows: [
      ['Object.keys()', '✅', '❌', '✅ only', '❌'],
      ['Object.getOwnPropertyNames()', '✅', '❌', 'Both', '❌'],
      ['Object.getOwnPropertySymbols()', '✅', '❌', 'Both', '✅'],
      ['for...in', '❌', '✅', '✅ only', '❌'],
      ['Reflect.ownKeys()', '✅', '❌', 'Both', '✅'],
    ]},

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Array-like objects with numeric properties include those numbers as keys',
      'Duplicate keys are impossible (objects use unique keys)',
      'Integer properties appear first, sorted numerically',
      'String keys appear in insertion order',
      'Non-enumerable properties are excluded',
      'Inherited properties from the prototype chain are excluded',
    ]},
  ],
};
