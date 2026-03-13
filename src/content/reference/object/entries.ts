import type { ReferenceContent } from '@/types/content';
export const objectEntriesReference: ReferenceContent = {
  id: 'object-entries', title: 'Object.entries()', description: 'Returns an array of key-value pairs from an object.', slug: 'reference/object/entries', pillar: 'reference', category: 'object', tags: ['object','entries','key-value','fromEntries'], difficulty: 'beginner', contentType: 'reference', summary: 'Object.entries() returns [key, value] pairs for own enumerable string-keyed properties. Object.fromEntries() reverses the operation.', relatedTopics: ['object-keys','object-values'], order: 3,
  signature: 'Object.entries(obj)',
  parameters: [{ name: 'obj', type: 'object', description: 'The object to extract entries from.' }],
  returnValue: { type: '[string, any][]', description: 'Array of [key, value] pairs.' },
  compatibility: 'ES2017+ — All modern browsers (fromEntries: ES2019+)',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'Object.entries() gives you an array of [key, value] pairs from an object. Paired with Object.fromEntries(), this opens up powerful object transformation pipelines — you can filter, map, and rebuild objects using your familiar array methods.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'entries-basic.js', code: `const obj = { a: 1, b: 2, c: 3 };\nObject.entries(obj);\n// [['a', 1], ['b', 2], ['c', 3]]\n\n// Destructured loop — the most common pattern\nfor (const [key, value] of Object.entries(obj)) {\n  console.log(\\\`\\\${key}: \\\${value}\\\`);\n}\n// a: 1\n// b: 2\n// c: 3` },

    { type: 'heading', level: 2, text: 'Object.fromEntries()', id: 'from-entries' },
    { type: 'paragraph', text: 'Object.fromEntries() is the reverse — takes an array of [key, value] pairs and creates an object from them.' },
    { type: 'code', language: 'javascript', filename: 'from-entries.js', code: `// Array of pairs → object\nconst pairs = [['x', 1], ['y', 2], ['z', 3]];\nObject.fromEntries(pairs);\n// { x: 1, y: 2, z: 3 }\n\n// Map → object\nconst map = new Map([['name', 'Alice'], ['age', '30']]);\nObject.fromEntries(map);\n// { name: 'Alice', age: '30' }\n\n// URLSearchParams → object\nconst params = new URLSearchParams('name=Alice&age=30');\nObject.fromEntries(params);\n// { name: 'Alice', age: '30' }` },

    { type: 'heading', level: 2, text: 'Transform Object Values', id: 'transform-values' },
    { type: 'paragraph', text: 'The entries → transform → fromEntries pattern is how you transform object values using array methods. Convert to entries, modify, then convert back.' },
    { type: 'code', language: 'javascript', filename: 'transform.js', code: `const prices = { apple: 1.5, banana: 0.75, cherry: 3.0 };\n\n// Double all values\nconst doubled = Object.fromEntries(\n  Object.entries(prices).map(([k, v]) => [k, v * 2])\n);\n// { apple: 3, banana: 1.5, cherry: 6 }\n\n// Apply discount\nconst discounted = Object.fromEntries(\n  Object.entries(prices).map(([k, v]) => [k, +(v * 0.9).toFixed(2)])\n);\n// { apple: 1.35, banana: 0.68, cherry: 2.70 }\n\n// Transform keys\nconst uppercased = Object.fromEntries(\n  Object.entries(prices).map(([k, v]) => [k.toUpperCase(), v])\n);\n// { APPLE: 1.5, BANANA: 0.75, CHERRY: 3 }` },

    { type: 'heading', level: 2, text: 'Filter Object Properties', id: 'filter' },
    { type: 'code', language: 'javascript', filename: 'filter.js', code: `const config = {\n  host: 'localhost',\n  port: 3000,\n  debug: true,\n  secret: 'abc123',\n  apiKey: 'xyz789',\n};\n\n// Remove sensitive keys\nconst safeConfig = Object.fromEntries(\n  Object.entries(config).filter(([key]) =>\n    !['secret', 'apiKey'].includes(key)\n  )\n);\n// { host: 'localhost', port: 3000, debug: true }\n\n// Keep only string values\nconst strings = Object.fromEntries(\n  Object.entries(config).filter(([, value]) =>\n    typeof value === 'string'\n  )\n);\n// { host: 'localhost', secret: 'abc123', apiKey: 'xyz789' }\n\n// Filter by value condition\nconst expensive = Object.fromEntries(\n  Object.entries(prices).filter(([, price]) => price > 1)\n);` },

    { type: 'heading', level: 2, text: 'Converting to Map', id: 'to-map' },
    { type: 'code', language: 'javascript', filename: 'entries-map.js', code: `const obj = { a: 1, b: 2, c: 3 };\n\n// Object → Map\nconst map = new Map(Object.entries(obj));\nmap.get('a'); // 1\n\n// Map → Object\nconst back = Object.fromEntries(map);\n// { a: 1, b: 2, c: 3 }\n\n// Why use Map?\n// - Keys can be any type (not just strings)\n// - Preserves insertion order\n// - Has .size property\n// - Better performance for frequent additions/deletions` },

    { type: 'heading', level: 2, text: 'Practical Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'entries-patterns.js', code: `// Pick specific keys\nfunction pick(obj, keys) {\n  return Object.fromEntries(\n    Object.entries(obj).filter(([k]) => keys.includes(k))\n  );\n}\npick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }\n\n// Omit specific keys\nfunction omit(obj, keys) {\n  return Object.fromEntries(\n    Object.entries(obj).filter(([k]) => !keys.includes(k))\n  );\n}\n\n// Map values with a function\nfunction mapValues(obj, fn) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, fn(v, k)])\n  );\n}\nmapValues({ a: 1, b: 2 }, v => v * 10); // { a: 10, b: 20 }\n\n// Group entries by a key\nfunction groupBy(arr, keyFn) {\n  return arr.reduce((groups, item) => {\n    const key = keyFn(item);\n    (groups[key] ??= []).push(item);\n    return groups;\n  }, {});\n}\n\n// Diff two objects\nfunction diff(a, b) {\n  return Object.fromEntries(\n    Object.entries(b).filter(([k, v]) => a[k] !== v)\n  );\n}\ndiff({ x: 1, y: 2 }, { x: 1, y: 3, z: 4 });\n// { y: 3, z: 4 }` },

    { type: 'heading', level: 2, text: 'TypeScript', id: 'typescript' },
    { type: 'code', language: 'typescript', filename: 'entries-typescript.ts', code: `const config = { host: 'localhost', port: 3000 };\n\n// Entries returns [string, string | number][]\nconst entries = Object.entries(config);\n\n// Type-safe iteration\nfor (const [key, value] of Object.entries(config)) {\n  // key: string (not 'host' | 'port')\n  // value: string | number\n}\n\n// Typed mapValues\nfunction mapValues<T, U>(\n  obj: Record<string, T>,\n  fn: (value: T) => U\n): Record<string, U> {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, fn(v)])\n  );\n}` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Keys are always strings in the returned pairs',
      'Integer keys appear first, sorted numerically',
      'Non-enumerable properties are excluded',
      'Symbol properties are excluded',
      'Prototype properties are excluded',
      'fromEntries with duplicate keys: last value wins',
    ]},

    { type: 'heading', level: 2, text: 'Comparison', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Returns', 'Inverse'], rows: [
      ['Object.keys()', 'string[]', 'N/A'],
      ['Object.values()', 'any[]', 'N/A'],
      ['Object.entries()', '[string, any][]', 'Object.fromEntries()'],
      ['for...in', 'Iterates keys (including inherited)', 'N/A'],
    ]},
  ],
};
