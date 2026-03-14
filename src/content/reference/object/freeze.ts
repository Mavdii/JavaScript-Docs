import type { ReferenceContent } from '@/types/content';
export const objectFreezeReference: ReferenceContent = {
  id: 'object-freeze', title: 'Object.freeze()', description: 'Prevent modifications to an object\'s properties — making it immutable.', slug: 'reference/object/freeze', pillar: 'reference', category: 'object', tags: ['object','freeze','immutable','seal','preventExtensions'], difficulty: 'beginner', contentType: 'reference', summary: 'Object.freeze() prevents adding, removing, or modifying properties. It\'s shallow — nested objects remain mutable. Compare with seal() and preventExtensions().', relatedTopics: ['object-assign','object-keys'],
  signature: 'Object.freeze(obj)',
  parameters: [{ name: 'obj', type: 'object', description: 'The object to freeze.' }],
  returnValue: { type: 'object', description: 'The same object, now frozen.' },
  compatibility: 'ES5+ — All browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'Object.freeze() locks down an object — no adding properties, no removing them, no changing them. In strict mode, violations throw errors. In regular mode, they just silently fail.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'freeze-basic.js', code: `const config = Object.freeze({\n  apiUrl: 'https://api.example.com',\n  timeout: 5000,\n  retries: 3,\n});\n\nconfig.timeout = 10000;    // Silently fails (throws in strict mode)\nconfig.newProp = true;     // Silently fails\ndelete config.retries;     // Silently fails\n\nconsole.log(config.timeout); // 5000 — unchanged\nconsole.log(Object.isFrozen(config)); // true` },

    { type: 'heading', level: 2, text: 'Strict Mode Behavior', id: 'strict-mode' },
    { type: 'code', language: 'javascript', filename: 'freeze-strict.js', code: `'use strict';\n\nconst obj = Object.freeze({ x: 1 });\n\nobj.x = 2;      // TypeError: Cannot assign to read only property\nobj.y = 3;      // TypeError: Cannot add property y\ndelete obj.x;   // TypeError: Cannot delete property 'x'\n\n// Attempting to redefine also fails\nObject.defineProperty(obj, 'x', { value: 2 });\n// TypeError: Cannot redefine property: x` },

    { type: 'heading', level: 2, text: 'Shallow Freeze', id: 'shallow' },
    { type: 'callout', variant: 'warning', title: 'Shallow Only', text: 'Object.freeze() only freezes the top level. Nested objects, arrays, and other things inside can still be changed.' },
    { type: 'code', language: 'javascript', filename: 'freeze-shallow.js', code: `const state = Object.freeze({\n  user: { name: 'Alice', age: 30 },\n  items: [1, 2, 3],\n});\n\n// Top-level changes are blocked\nstate.user = {}; // Fails silently\n\n// Nested mutations still work\nstate.user.name = 'Bob';  // Works! Nested object isn't frozen\nstate.items.push(4);      // Works! Array isn't frozen\n\nconsole.log(state.user.name); // 'Bob'\nconsole.log(state.items);     // [1, 2, 3, 4]` },

    { type: 'heading', level: 2, text: 'Deep Freeze', id: 'deep-freeze' },
    { type: 'code', language: 'javascript', filename: 'deep-freeze.js', code: `function deepFreeze(obj) {\n  Object.freeze(obj);\n  Object.values(obj).forEach(value => {\n    if (value && typeof value === 'object' && !Object.isFrozen(value)) {\n      deepFreeze(value);\n    }\n  });\n  return obj;\n}\n\nconst state = deepFreeze({\n  user: { name: 'Alice', age: 30 },\n  items: [1, 2, 3],\n});\n\nstate.user.name = 'Bob';  // Now fails (in strict mode: TypeError)\nstate.items.push(4);       // TypeError: Cannot add property 3\n\n// ⚠️ Be careful with circular references\n// The isFrozen check prevents infinite recursion` },

    { type: 'heading', level: 2, text: 'freeze() vs seal() vs preventExtensions()', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Add props?', 'Delete props?', 'Modify values?', 'Reconfigure?'], rows: [
      ['Object.freeze()', 'No', 'No', 'No', 'No'],
      ['Object.seal()', 'No', 'No', 'Yes', 'No'],
      ['Object.preventExtensions()', 'No', 'Yes', 'Yes', 'Yes'],
      ['(none)', 'Yes', 'Yes', 'Yes', 'Yes'],
    ]},
    { type: 'code', language: 'javascript', filename: 'freeze-vs-seal.js', code: `// seal(): can modify existing properties, can't add or delete\nconst sealed = Object.seal({ a: 1, b: 2 });\nsealed.a = 10;      // Works\nsealed.c = 3;       // Fails\ndelete sealed.a;    // Fails\n\n// preventExtensions(): can modify and delete, can't add\nconst ext = Object.preventExtensions({ a: 1, b: 2 });\next.a = 10;         // Works\ndelete ext.b;       // Works\next.c = 3;          // Fails\n\n// Check methods\nObject.isFrozen(frozen);              // true\nObject.isSealed(sealed);              // true\nObject.isExtensible(ext);             // false` },

    { type: 'heading', level: 2, text: 'Freezing Arrays', id: 'arrays' },
    { type: 'code', language: 'javascript', filename: 'freeze-arrays.js', code: `const frozenArr = Object.freeze([1, 2, 3]);\n\nfrozenArr.push(4);     // TypeError in strict mode\nfrozenArr[0] = 99;     // Fails\nfrozenArr.length = 0;  // Fails\n\n// Non-mutating methods still work (they return new arrays)\nconst doubled = frozenArr.map(n => n * 2); // [2, 4, 6]\nconst filtered = frozenArr.filter(n => n > 1); // [2, 3]\nconst sorted = [...frozenArr].sort(); // [1, 2, 3]` },

    { type: 'heading', level: 2, text: 'Use Cases', id: 'use-cases' },
    { type: 'code', language: 'javascript', filename: 'freeze-use-cases.js', code: `// 1. Constants / Configuration\nconst CONFIG = Object.freeze({\n  API_URL: 'https://api.example.com',\n  MAX_RETRIES: 3,\n  TIMEOUT: 5000,\n});\n\n// 2. Enum-like objects\nconst Status = Object.freeze({\n  PENDING: 'pending',\n  ACTIVE: 'active',\n  CLOSED: 'closed',\n});\n\n// 3. Default values (prevent accidental mutation)\nconst DEFAULT_OPTIONS = Object.freeze({\n  page: 1,\n  pageSize: 20,\n  sortBy: 'createdAt',\n  order: 'desc',\n});\n\nfunction fetchItems(options = {}) {\n  const opts = { ...DEFAULT_OPTIONS, ...options };\n  // DEFAULT_OPTIONS can't be accidentally mutated\n}\n\n// 4. Redux/state management: frozen state prevents direct mutation\nconst initialState = Object.freeze({\n  users: [],\n  loading: false,\n  error: null,\n});` },

    { type: 'heading', level: 2, text: 'freeze() vs const', id: 'vs-const' },
    { type: 'callout', variant: 'info', title: 'const ≠ immutable', text: 'const stops you from reassigning the variable. Object.freeze() stops you from changing the object\'s properties. They do different things and you can use them together.' },
    { type: 'code', language: 'javascript', filename: 'freeze-vs-const.js', code: `// const prevents reassignment\nconst obj = { x: 1 };\nobj = { x: 2 }; // TypeError: Assignment to constant variable\n\n// But properties can still be changed\nobj.x = 2; // ✅ Works\n\n// freeze prevents property changes\nconst frozen = Object.freeze({ x: 1 });\nfrozen.x = 2; // Fails — property change blocked\nfrozen = {};   // Also fails — const blocks reassignment\n\n// For true immutability: const + freeze\nconst CONFIG = Object.freeze({ key: 'value' });` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'freeze() has a tiny one-time cost. Reading properties from frozen objects isn\'t slower — V8 can actually optimize them better since it knows they won\'t change.' },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'freeze-mistakes.js', code: `// ❌ Assuming freeze is deep\nconst obj = Object.freeze({ nested: { value: 1 } });\nobj.nested.value = 2; // Works! Only top-level is frozen\n\n// ❌ Not checking if frozen before modifying\n// Can lead to silent failures in non-strict mode\nfunction updateConfig(config, updates) {\n  if (Object.isFrozen(config)) {\n    return { ...config, ...updates }; // Return new object\n  }\n  Object.assign(config, updates); // Mutate\n  return config;\n}\n\n// ❌ Freezing too early — freeze after all properties are set\nconst obj2 = Object.freeze({});\nobj2.key = 'value'; // Fails! Should have added before freezing` },

    { type: 'heading', level: 2, text: 'Alternatives', id: 'alternatives' },
    { type: 'list', items: [
      'Object.freeze() — Built-in, shallow, free',
      'structuredClone() + freeze — Deep clone then freeze',
      'Immer — Library for immutable state with mutable syntax',
      'TypeScript Readonly<T> — Compile-time only, no runtime protection',
      'as const — TypeScript deep readonly inference',
    ]},
  ],
};
