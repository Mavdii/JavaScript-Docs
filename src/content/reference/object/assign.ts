import type { ReferenceContent } from '@/types/content';
export const objectAssignReference: ReferenceContent = {
  id: 'object-assign', title: 'Object.assign()', description: 'Copy properties from source objects to a target object (shallow merge).', slug: 'reference/object/assign', pillar: 'reference', category: 'object', tags: ['object','assign','merge','copy','spread'], difficulty: 'beginner', contentType: 'reference', summary: 'Object.assign() copies enumerable own properties from one or more source objects to a target object. It performs a shallow copy and mutates the target.', relatedTopics: ['object-keys','object-entries'],
  signature: 'Object.assign(target, ...sources)',
  parameters: [{ name: 'target', type: 'object', description: 'The target object to copy properties into.' }, { name: 'sources', type: 'object[]', description: 'One or more source objects whose properties are copied.' }],
  returnValue: { type: 'object', description: 'The modified target object (same reference).' },
  compatibility: 'ES6+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'Object.assign() takes properties from one or more source objects and copies them into a target object. Later sources overwrite earlier ones. It returns the target (modified). Just heads up — it\'s a shallow copy, so nested objects are still shared by reference.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'assign-basic.js', code: `const target = { a: 1 };\nObject.assign(target, { b: 2 }, { c: 3 });\nconsole.log(target); // { a: 1, b: 2, c: 3 }\n\n// Later sources overwrite earlier ones\nObject.assign({}, { a: 1 }, { a: 2, b: 3 });\n// { a: 2, b: 3 }\n\n// Returns the target (mutated)\nconst result = Object.assign(target, { d: 4 });\nresult === target; // true — same reference` },

    { type: 'heading', level: 2, text: 'Shallow Clone', id: 'clone' },
    { type: 'code', language: 'javascript', filename: 'assign-clone.js', code: `const original = { x: 1, y: 2, z: 3 };\n\n// Clone with assign\nconst clone1 = Object.assign({}, original);\n\n// Clone with spread (preferred in modern JS)\nconst clone2 = { ...original };\n\n// Both are shallow — nested objects are shared\nconst deep = { data: { value: 1 } };\nconst shallowClone = { ...deep };\nshallowClone.data.value = 99;\nconsole.log(deep.data.value); // 99 — same reference!\n\n// Deep clone with structuredClone\nconst deepClone = structuredClone(deep);\ndeepClone.data.value = 42;\nconsole.log(deep.data.value); // 99 — independent copy` },

    { type: 'heading', level: 2, text: 'Merging Objects', id: 'merging' },
    { type: 'code', language: 'javascript', filename: 'assign-merge.js', code: `// Default options pattern\nfunction createServer(options = {}) {\n  const defaults = { port: 3000, host: 'localhost', debug: false };\n  const config = Object.assign({}, defaults, options);\n  // Or with spread:\n  const config2 = { ...defaults, ...options };\n  return config;\n}\n\ncreateServer({ port: 8080 });\n// { port: 8080, host: 'localhost', debug: false }\n\n// Merging multiple configs\nconst base = { theme: 'light', lang: 'en' };\nconst user = { theme: 'dark' };\nconst session = { lang: 'fr' };\nObject.assign({}, base, user, session);\n// { theme: 'dark', lang: 'fr' }` },

    { type: 'heading', level: 2, text: 'assign() vs Spread', id: 'vs-spread' },
    { type: 'table', headers: ['Feature', 'Object.assign()', 'Spread { ...obj }'], rows: [
      ['Syntax', 'Function call', 'Syntax sugar'],
      ['Mutates target', 'Yes', 'No (creates new object)'],
      ['Triggers setters', 'Yes', 'No'],
      ['Dynamic sources', 'Yes', 'Yes (conditionally)'],
      ['Copies getters', 'Invokes them (copies value)', 'Invokes them (copies value)'],
      ['Readability', 'Good for merge in-place', 'Better for creating copies'],
    ]},
    { type: 'callout', variant: 'tip', title: 'Prefer Spread', text: 'In most cases, spread syntax { ...a, ...b } is cleaner because it\'s more readable, doesn\'t mutate, and plays nice with React/Redux patterns.' },

    { type: 'heading', level: 2, text: 'Shallow Copy Warning', id: 'shallow-warning' },
    { type: 'code', language: 'javascript', filename: 'assign-shallow.js', code: `const original = {\n  name: 'Alice',\n  address: { city: 'NYC', zip: '10001' },\n  tags: ['admin', 'user'],\n};\n\nconst copy = Object.assign({}, original);\n\n// Primitives are independent\ncopy.name = 'Bob';\nconsole.log(original.name); // 'Alice' ✅\n\n// Objects/arrays are shared references!\ncopy.address.city = 'LA';\nconsole.log(original.address.city); // 'LA' ❌\n\ncopy.tags.push('superuser');\nconsole.log(original.tags); // ['admin', 'user', 'superuser'] ❌\n\n// For deep copies, use structuredClone()\nconst deepCopy = structuredClone(original);` },

    { type: 'heading', level: 2, text: 'Practical Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'assign-patterns.js', code: `// Update object properties (mutation)\nconst state = { count: 0, loading: false };\nObject.assign(state, { count: 1, loading: true });\n// state: { count: 1, loading: true }\n\n// Mix-in pattern\nconst serializable = {\n  toJSON() { return JSON.stringify(this); },\n  fromJSON(json) { return Object.assign(this, JSON.parse(json)); },\n};\n\nconst loggable = {\n  log() { console.log(\\\`[\\\${this.constructor.name}]\\\`, this); },\n};\n\nclass User {\n  constructor(name) { this.name = name; }\n}\nObject.assign(User.prototype, serializable, loggable);\n\nconst user = new User('Alice');\nuser.log(); // [User] User { name: 'Alice' }\n\n// Conditional properties\nconst item = Object.assign(\n  { name: 'Widget' },\n  price && { price },\n  discount && { discount },\n);` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'assign-mistakes.js', code: `// ❌ Forgetting assign mutates the target\nconst defaults = { a: 1, b: 2 };\nconst result = Object.assign(defaults, { c: 3 });\nconsole.log(defaults); // { a: 1, b: 2, c: 3 } — mutated!\n// Fix: use empty object as target\nconst result2 = Object.assign({}, defaults, { c: 3 });\n\n// ❌ Expecting deep merge\nObject.assign(\n  {},\n  { nested: { a: 1, b: 2 } },\n  { nested: { b: 3 } }\n);\n// { nested: { b: 3 } } — nested object is REPLACED, not merged!\n\n// ❌ Using with class instances (loses prototype)\nclass Point {\n  constructor(x, y) { this.x = x; this.y = y; }\n  distance() { return Math.sqrt(this.x**2 + this.y**2); }\n}\nconst p = new Point(3, 4);\nconst clone = Object.assign({}, p);\nclone.distance(); // TypeError — method is on prototype, not copied\n\n// ✅ Fix: preserve prototype\nconst clone2 = Object.assign(Object.create(Point.prototype), p);` },

    { type: 'heading', level: 2, text: 'Deep Merge', id: 'deep-merge' },
    { type: 'paragraph', text: 'Object.assign() won\'t deep merge — nested objects get replaced entirely. If you need real deep merging, write a helper function or use a library.' },
    { type: 'code', language: 'javascript', filename: 'deep-merge.js', code: `function deepMerge(target, ...sources) {\n  for (const source of sources) {\n    for (const [key, value] of Object.entries(source)) {\n      if (value && typeof value === 'object' && !Array.isArray(value)) {\n        target[key] = deepMerge(target[key] || {}, value);\n      } else {\n        target[key] = value;\n      }\n    }\n  }\n  return target;\n}\n\ndeepMerge(\n  {},\n  { nested: { a: 1, b: 2 } },\n  { nested: { b: 3, c: 4 } }\n);\n// { nested: { a: 1, b: 3, c: 4 } } — properly merged` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Non-object sources are coerced (strings become indexed properties)',
      'null and undefined sources are silently skipped',
      'Only enumerable own properties are copied',
      'Symbols are copied (unlike for...in)',
      'Getters on source are invoked — the value is copied, not the getter',
      'If target has setters, they are triggered by assign',
    ]},
    { type: 'code', language: 'javascript', filename: 'assign-edge.js', code: `// Strings are spread into indexed properties\nObject.assign({}, 'hi'); // { '0': 'h', '1': 'i' }\n\n// null/undefined sources are skipped\nObject.assign({ a: 1 }, null, undefined, { b: 2 });\n// { a: 1, b: 2 }\n\n// Symbols are copied\nconst sym = Symbol('id');\nObject.assign({}, { [sym]: 42 });\n// { [Symbol(id)]: 42 }` },
  ],
};
