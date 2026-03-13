import type { ReferenceContent } from '@/types/content';
export const arrayFindReference: ReferenceContent = {
  id: 'array-find', title: 'Array.prototype.find()', description: 'Returns the first element that satisfies a testing function.', slug: 'reference/array/find', pillar: 'reference', category: 'array', tags: ['array','find','search','findIndex','findLast'], difficulty: 'beginner', contentType: 'reference', summary: 'find() returns the first element matching the predicate, or undefined if none match. findIndex() returns the index instead.', relatedTopics: ['array-filter','array-some-every'], order: 3,
  signature: 'array.find(callbackFn, thisArg?)',
  parameters: [{ name: 'callbackFn', type: '(element, index, array) => boolean', description: 'Function to test each element.' }, { name: 'thisArg', type: 'any', description: 'Value to use as this.', optional: true }],
  returnValue: { type: 'T | undefined', description: 'The first matching element, or undefined if no match.' },
  compatibility: 'ES6+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'So find() is your go-to when you need to locate one specific element in an array. It’ll grab the first element that passes your test and bounce â it doesn\'t keep searching after finding a match, which makes it way more efficient than filter() if you only care about one result.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'find-basic.js', code: `const numbers = [5, 12, 8, 130, 44];\n\nconst found = numbers.find(n => n > 10);\nconsole.log(found); // 12 (first match, not all matches)\n\nconst missing = numbers.find(n => n > 200);\nconsole.log(missing); // undefined` },

    { type: 'heading', level: 2, text: 'Finding Objects', id: 'finding-objects' },
    { type: 'paragraph', text: 'This is where find() really shines — when you\'re looking up an object by some property value (like finding a user by their ID).' },
    { type: 'code', language: 'javascript', filename: 'find-objects.js', code: `const users = [\n  { id: 1, name: 'Alice', role: 'admin' },\n  { id: 2, name: 'Bob', role: 'user' },\n  { id: 3, name: 'Charlie', role: 'user' },\n];\n\nconst bob = users.find(u => u.name === 'Bob');\n// { id: 2, name: 'Bob', role: 'user' }\n\nconst admin = users.find(u => u.role === 'admin');\n// { id: 1, name: 'Alice', role: 'admin' }\n\nconst eve = users.find(u => u.name === 'Eve');\n// undefined` },

    { type: 'heading', level: 2, text: 'findIndex()', id: 'find-index' },
    { type: 'paragraph', text: 'Need the position instead of the element itself? That\'s what findIndex() is for. It returns the index of the first matching element, or -1 if nothing matches.' },
    { type: 'code', language: 'javascript', filename: 'find-index.js', code: `const fruits = ['apple', 'banana', 'cherry', 'date'];\n\nconst idx = fruits.findIndex(f => f === 'cherry');\nconsole.log(idx); // 2\n\nconst missing = fruits.findIndex(f => f === 'grape');\nconsole.log(missing); // -1\n\n// Useful for updating arrays immutably\nconst users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];\nconst index = users.findIndex(u => u.id === 2);\nif (index !== -1) {\n  const updated = [...users];\n  updated[index] = { ...users[index], name: 'Robert' };\n}` },

    { type: 'heading', level: 2, text: 'findLast() and findLastIndex()', id: 'find-last' },
    { type: 'paragraph', text: 'ES2023 gave us findLast() and findLastIndex() — they work backwards from the end of the array. Handy when you\'re searching for the most recent item.' },
    { type: 'code', language: 'javascript', filename: 'find-last.js', code: `const nums = [1, 2, 3, 4, 5, 4, 3, 2, 1];\n\nnums.findLast(n => n > 3);       // 4 (last match)\nnums.findLastIndex(n => n > 3);  // 5 (index of last match)\n\n// Useful for finding the most recent item\nconst logs = [\n  { level: 'info', msg: 'Started' },\n  { level: 'error', msg: 'Failed auth' },\n  { level: 'info', msg: 'Retrying' },\n  { level: 'error', msg: 'Timeout' },\n];\n\nconst lastError = logs.findLast(l => l.level === 'error');\n// { level: 'error', msg: 'Timeout' }` },

    { type: 'heading', level: 2, text: 'find() vs filter()', id: 'find-vs-filter' },
    { type: 'table', headers: ['', 'find()', 'filter()'], rows: [
      ['Returns', 'First matching element', 'Array of all matches'],
      ['No match', 'undefined', 'Empty array []'],
      ['Short-circuits', 'Yes — stops at first match', 'No — always scans all'],
      ['Use when', 'You need one result', 'You need all results'],
      ['Performance', 'O(1) best, O(n) worst', 'Always O(n)'],
    ]},
    { type: 'callout', variant: 'tip', title: 'find vs filter', text: 'Use find() when you need just one result (like a database lookup by ID). Use filter() when you need all matches. Don\'t use filter()[0] — that wastes time scanning the whole array when you could stop early.' },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'find-mistakes.js', code: `// â Mistake 1: Not handling undefined\nconst user = users.find(u => u.id === 999);\nconsole.log(user.name); // TypeError: Cannot read properties of undefined!\n\n// â Fix: check for undefined\nconst user2 = users.find(u => u.id === 999);\nif (user2) {\n  console.log(user2.name);\n}\n// Or use optional chaining\nconsole.log(user2?.name); // undefined (no error)\n\n// â Mistake 2: Using find to check existence (use some() instead)\nif (users.find(u => u.role === 'admin')) { ... }  // Works but wasteful\nif (users.some(u => u.role === 'admin')) { ... }   // Better â returns boolean\n\n// â Mistake 3: Mutating the found object thinking it’s a copy\nconst found = users.find(u => u.id === 1);\nfound.name = 'Modified'; // This modifies the original array’s object!` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'find() on an empty array returns undefined',
      'find() skips empty slots in sparse arrays',
      'The callback can see the entire array via the third argument',
      'find() returns a reference to the original object — not a copy',
      'If the callback modifies the array, find() uses the original length',
    ]},

    { type: 'heading', level: 2, text: 'TypeScript Patterns', id: 'typescript' },
    { type: 'code', language: 'typescript', filename: 'find-typescript.ts', code: `// find() return type includes undefined\nconst users: User[] = [/*...*/];\nconst admin = users.find(u => u.role === 'admin');\n// admin: User | undefined\n\n// Non-null assertion (when you’re SURE it exists)\nconst admin2 = users.find(u => u.role === 'admin')!;\n// admin2: User\n\n// Better: exhaustive check\nconst admin3 = users.find(u => u.role === 'admin');\nif (!admin3) {\n  throw new Error('Admin user not found');\n}\n// admin3: User (narrowed by control flow)` },

    { type: 'heading', level: 2, text: 'Real-World Patterns', id: 'real-world' },
    { type: 'code', language: 'javascript', filename: 'find-real-world.js', code: `// Route matching\nconst routes = [\n  { path: '/home', component: Home },\n  { path: '/about', component: About },\n  { path: '/user/:id', component: UserProfile },\n];\nconst match = routes.find(r => currentPath.startsWith(r.path));\n\n// Config lookup with fallback\nconst config = configs.find(c => c.env === process.env.NODE_ENV)\n  ?? configs.find(c => c.env === 'default');\n\n// Linked list traversal\nfunction findInList(head, predicate) {\n  let node = head;\n  while (node) {\n    if (predicate(node.value)) return node;\n    node = node.next;\n  }\n  return undefined;\n}` },

    { type: 'heading', level: 2, text: 'Comparison Table', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Returns', 'When no match'], rows: [
      ['find()', 'First element', 'undefined'],
      ['findIndex()', 'First index', '-1'],
      ['findLast()', 'Last element', 'undefined'],
      ['findLastIndex()', 'Last index', '-1'],
      ['indexOf()', 'First index (strict ===)', '-1'],
      ['includes()', 'boolean', 'false'],
    ]},
  ],
};
