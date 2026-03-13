import type { ReferenceContent } from '@/types/content';
export const objectValuesReference: ReferenceContent = {
  id: 'object-values', title: 'Object.values()', description: 'Returns an array of an object\'s own enumerable property values.', slug: 'reference/object/values', pillar: 'reference', category: 'object', tags: ['object','values','properties','enumerable'], difficulty: 'beginner', contentType: 'reference', summary: 'Object.values() returns an array of all own enumerable property values in the same order as Object.keys().', relatedTopics: ['object-keys','object-entries'], order: 2,
  signature: 'Object.values(obj)',
  parameters: [{ name: 'obj', type: 'object', description: 'The object whose own enumerable property values are returned.' }],
  returnValue: { type: 'any[]', description: 'Array of property values.' },
  compatibility: 'ES2017+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'Object.values() pulls out all the property values from an object into an array. It only grabs your own properties (not inherited), in the same order as Object.keys().' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'values-basic.js', code: `const obj = { a: 1, b: 2, c: 3 };\nObject.values(obj);\n// [1, 2, 3]\n\nconst person = { name: 'Alice', age: 30, city: 'NYC' };\nObject.values(person);\n// ['Alice', 30, 'NYC']\n\n// Integer keys are sorted numerically (like Object.keys)\nconst mixed = { 10: 'ten', 2: 'two', name: 'Test' };\nObject.values(mixed);\n// ['two', 'ten', 'Test']` },

    { type: 'heading', level: 2, text: 'Summing Values', id: 'summing' },
    { type: 'code', language: 'javascript', filename: 'values-sum.js', code: `const expenses = { rent: 1200, food: 300, utilities: 150, entertainment: 100 };\n\n// Sum all expenses\nconst total = Object.values(expenses).reduce((sum, val) => sum + val, 0);\n// 1750\n\n// Average\nconst values = Object.values(expenses);\nconst average = values.reduce((a, b) => a + b, 0) / values.length;\n// 437.5\n\n// Min/Max\nconst max = Math.max(...Object.values(expenses));\nconst min = Math.min(...Object.values(expenses));` },

    { type: 'heading', level: 2, text: 'Checking All Values', id: 'checking' },
    { type: 'code', language: 'javascript', filename: 'values-checking.js', code: `const form = { name: 'Alice', email: 'alice@test.com', password: '123' };\n\n// Are all fields filled?\nconst allFilled = Object.values(form).every(val => val && val.trim?.());\n// true\n\n// Are any values empty?\nconst anyEmpty = Object.values(form).some(val => !val);\n// false\n\n// All are strings?\nconst allStrings = Object.values(form).every(val => typeof val === 'string');\n// true\n\n// Do any values contain 'test'?\nconst hasTest = Object.values(form).some(val =>\n  typeof val === 'string' && val.includes('test')\n);\n// true` },

    { type: 'heading', level: 2, text: 'Filtering Values', id: 'filtering' },
    { type: 'code', language: 'javascript', filename: 'values-filter.js', code: `const scores = { alice: 95, bob: 87, charlie: 92, diana: 88 };\n\n// Get all passing scores (>= 90)\nconst passing = Object.values(scores).filter(score => score >= 90);\n// [95, 92]\n\n// Get count of high scores\nconst highScoreCount = Object.values(scores).filter(s => s > 90).length;\n// 2\n\n// Filter by value type\nconst config = { port: 3000, host: 'localhost', debug: true };\nconst boolValues = Object.values(config).filter(val => typeof val === 'boolean');\n// [true]\n\nconst stringValues = Object.values(config).filter(val => typeof val === 'string');\n// ['localhost']` },

    { type: 'heading', level: 2, text: 'Working Together: keys(), values(), entries()', id: 'trio' },
    { type: 'code', language: 'javascript', filename: 'values-trio.js', code: `const user = { id: 1, name: 'Alice', role: 'admin' };\n\n// Get keys\nObject.keys(user);\n// ['id', 'name', 'role']\n\n// Get values\nObject.values(user);\n// [1, 'Alice', 'admin']\n\n// Get key-value pairs (best for most tasks)\nObject.entries(user);\n// [['id', 1], ['name', 'Alice'], ['role', 'admin']]\n\n// Iterate key-value pairs\nfor (const [key, value] of Object.entries(user)) {\n  console.log(\\\`\\\${key}: \\\${value}\\\`);\n}` },

    { type: 'heading', level: 2, text: 'Real-World Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'values-patterns.js', code: `// Get all URLs from config\nconst config = {\n  apiUrl: 'https://api.example.com',\n  authUrl: 'https://auth.example.com',\n  cdnUrl: 'https://cdn.example.com',\n  port: 3000,\n};\nconst urls = Object.values(config).filter(val => typeof val === 'string' && val.startsWith('https'));\n\n// Flatten nested values\nconst nested = {\n  frontend: { styles: 'css', scripts: 'js' },\n  backend: { lang: 'node', db: 'postgres' },\n};\nconst allValues = Object.values(nested).flatMap(obj => Object.values(obj));\n// ['css', 'js', 'node', 'postgres']\n\n// Remove falsy values\nconst data = { a: 'text', b: null, c: 0, d: false, e: 'more' };\nconst truthy = Object.values(data).filter(Boolean);\n// ['text', 'more']\n\n// Count occurrences\nconst status = { pending: 5, active: 12, closed: 3 };\nconst statusCounts = Object.entries(status)\n  .map(([key, count]) => \\\`\\\${key}: \\\${count}\\\`)\n  .join(', ');\n// 'pending: 5, active: 12, closed: 3'` },

    { type: 'heading', level: 2, text: 'Performance with Large Objects', id: 'performance' },
    { type: 'paragraph', text: 'Object.values() creates a new array every time you call it. For frequently accessed values, consider caching or using destructuring.' },
    { type: 'code', language: 'javascript', filename: 'values-perf.js', code: `// ❌ Creates new array each time\nfor (let i = 0; i < 1000; i++) {\n  const total = Object.values(expensiveObj).reduce((a, b) => a + b, 0);\n}\n\n// ✅ Cache the values\nconst values = Object.values(expensiveObj);\nfor (let i = 0; i < 1000; i++) {\n  const total = values.reduce((a, b) => a + b, 0);\n}\n\n// ✅ Or destructure if you know the keys\nconst { x, y, z } = obj;\nconst total = x + y + z;` },

    { type: 'heading', level: 2, text: 'TypeScript Patterns', id: 'typescript' },
    { type: 'code', language: 'typescript', filename: 'values-typescript.ts', code: `interface User {\n  id: number;\n  name: string;\n  active: boolean;\n}\n\nconst user: User = { id: 1, name: 'Alice', active: true };\n\n// Object.values returns any[] by default\nconst values = Object.values(user);\n// values: any[]\n\n// Type-safe helper\nfunction typedValues<T extends object>(obj: T): Array<T[keyof T]> {\n  return Object.values(obj) as Array<T[keyof T]>;\n}\n\nconst typed = typedValues(user);\n// typed: (string | number | boolean)[]` },

    { type: 'heading', level: 2, text: 'Only Own Properties', id: 'own-properties' },
    { type: 'paragraph', text: 'Like Object.keys(), Object.values() only returns own properties, not inherited ones.' },
    { type: 'code', language: 'javascript', filename: 'values-own.js', code: `const parent = { inherited: 'from parent' };\nconst child = Object.create(parent);\nchild.own = 'from child';\n\nObject.values(child);    // ['from child'] — only own properties\n\n// Get all values including inherited\nconst allValues = [];\nfor (const key in child) {\n  allValues.push(child[key]);\n}\n// ['from child', 'from parent']` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Values are returned in the same order as Object.keys()',
      'Integer properties appear first (sorted numerically)',
      'String properties appear in insertion order',
      'Non-enumerable properties are excluded',
      'Inherited properties are excluded',
      'Symbol properties are excluded',
      'Values can be of any type (primitives, objects, functions, etc.)',
    ]},

    { type: 'heading', level: 2, text: 'Comparison Table', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Returns', 'Order', 'Inherited'], rows: [
      ['Object.keys()', 'Property names', 'Same as for...in', 'No'],
      ['Object.values()', 'Property values', 'Same as for...in', 'No'],
      ['Object.entries()', '[key, value] pairs', 'Same as for...in', 'No'],
      ['for...in', 'Iterates keys', 'Same as for...in', 'Yes'],
    ]},
  ],
};
