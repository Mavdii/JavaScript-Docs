import type { ReferenceContent } from '@/types/content';
export const arrayReduceReference: ReferenceContent = {
  id: 'array-reduce', title: 'Array.prototype.reduce()', description: 'Reduces an array to a single value by applying a function to each element.', slug: 'reference/array/reduce', pillar: 'reference', category: 'array', tags: ['array','reduce','accumulator','fold'], difficulty: 'intermediate', contentType: 'reference', summary: 'reduce() executes a reducer function on each element, passing the result from one call to the next, resulting in a single output value.', relatedTopics: ['array-map','array-filter'],
  signature: 'array.reduce(callbackFn, initialValue?)',
  parameters: [{ name: 'callbackFn', type: '(accumulator, currentValue, index, array) => T', description: 'Function to execute on each element. The return value becomes the accumulator for the next call.' }, { name: 'initialValue', type: 'T', description: 'Initial value for the accumulator. If omitted, the first element is used.', optional: true }],
  returnValue: { type: 'T', description: 'The single accumulated result.' },
  compatibility: 'ES5+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'reduce() is the Swiss Army knife of array methods. You give it a function that takes an accumulator and a value, and it runs that function on each element, passing the result along as the accumulator for the next iteration. At the end, you get one final value. It\'s super powerful — you can express almost any array operation as a reduce.' },

    { type: 'heading', level: 2, text: 'Sum and Aggregate', id: 'sum' },
    { type: 'code', language: 'javascript', filename: 'reduce-sum.js', code: `const nums = [1, 2, 3, 4, 5];\n\nconst sum = nums.reduce((acc, n) => acc + n, 0);\n// 15\n\nconst product = nums.reduce((acc, n) => acc * n, 1);\n// 120\n\nconst max = nums.reduce((a, b) => Math.max(a, b));\n// 5\n\nconst min = nums.reduce((a, b) => Math.min(a, b));\n// 1\n\n// Average\nconst avg = nums.reduce((acc, n, _, arr) => acc + n / arr.length, 0);\n// 3` },

    { type: 'heading', level: 2, text: 'Building Objects', id: 'building-objects' },
    { type: 'code', language: 'javascript', filename: 'reduce-objects.js', code: `// Counting occurrences\nconst fruits = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];\n\nconst counts = fruits.reduce((acc, fruit) => {\n  acc[fruit] = (acc[fruit] || 0) + 1;\n  return acc;\n}, {});\n// { apple: 3, banana: 2, cherry: 1 }\n\n// Indexing by ID\nconst users = [\n  { id: 1, name: 'Alice' },\n  { id: 2, name: 'Bob' },\n];\nconst byId = users.reduce((acc, user) => {\n  acc[user.id] = user;\n  return acc;\n}, {});\n// { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }` },

    { type: 'heading', level: 2, text: 'Grouping (groupBy)', id: 'grouping' },
    { type: 'code', language: 'javascript', filename: 'reduce-group.js', code: `const people = [\n  { name: 'Alice', dept: 'Engineering' },\n  { name: 'Bob', dept: 'Marketing' },\n  { name: 'Charlie', dept: 'Engineering' },\n  { name: 'Diana', dept: 'Marketing' },\n];\n\nconst byDept = people.reduce((groups, person) => {\n  const key = person.dept;\n  (groups[key] ??= []).push(person);\n  return groups;\n}, {});\n// { Engineering: [Alice, Charlie], Marketing: [Bob, Diana] }\n\n// ES2024: Object.groupBy (when available)\n// const byDept = Object.groupBy(people, p => p.dept);` },

    { type: 'heading', level: 2, text: 'Flattening Arrays', id: 'flatten' },
    { type: 'code', language: 'javascript', filename: 'reduce-flatten.js', code: `const nested = [[1, 2], [3, 4], [5]];\n\n// One level\nconst flat = nested.reduce((acc, arr) => acc.concat(arr), []);\n// [1, 2, 3, 4, 5]\n\n// Modern alternative: .flat()\nnested.flat(); // [1, 2, 3, 4, 5]\n\n// Deep flatten with reduce\nfunction deepFlatten(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val)\n  , []);\n}` },

    { type: 'heading', level: 2, text: 'Pipeline / Compose', id: 'pipeline' },
    { type: 'paragraph', text: 'Here\'s a cool pattern — use reduce to apply a series of transformations (a function pipeline) to a value, one after another.' },
    { type: 'code', language: 'javascript', filename: 'reduce-pipe.js', code: `const pipe = (...fns) => (input) =>\n  fns.reduce((acc, fn) => fn(acc), input);\n\nconst processUser = pipe(\n  name => name.trim(),\n  name => name.toLowerCase(),\n  name => name.replace(/\\\\s+/g, '-'),\n);\n\nprocessUser('  John Doe  '); // 'john-doe'\n\n// Middleware pattern\nconst middleware = [auth, validate, transform, save];\nconst result = await middleware.reduce(\n  (promise, fn) => promise.then(fn),\n  Promise.resolve(request)\n);` },

    { type: 'heading', level: 2, text: 'reduceRight()', id: 'reduce-right' },
    { type: 'paragraph', text: 'reduceRight() is the same as reduce() but goes backwards through the array. Handy for function composition.' },
    { type: 'code', language: 'javascript', filename: 'reduce-right.js', code: `// Compose (right-to-left function application)\nconst compose = (...fns) => (input) =>\n  fns.reduceRight((acc, fn) => fn(acc), input);\n\n// Build nested structure\nconst sections = ['a', 'b', 'c'];\nconst nested = sections.reduceRight((child, name) =>\n  ({ name, child }), null\n);\n// { name: 'a', child: { name: 'b', child: { name: 'c', child: null } } }` },

    { type: 'heading', level: 2, text: 'Initial Value Importance', id: 'initial-value' },
    { type: 'callout', variant: 'danger', title: 'Always Provide Initial Value', text: 'Without an initial value, reduce() uses the first element as the accumulator and starts from the second. This throws TypeError on empty arrays and can cause subtle bugs with object accumulators.' },
    { type: 'code', language: 'javascript', filename: 'reduce-initial.js', code: `// ❌ No initial value on empty array\n[].reduce((a, b) => a + b);\n// TypeError: Reduce of empty array with no initial value\n\n// ✅ With initial value — safe for empty arrays\n[].reduce((a, b) => a + b, 0); // 0\n\n// ❌ Subtle bug without initial value\nconst items = [{ price: 10 }, { price: 20 }];\nitems.reduce((sum, item) => sum + item.price);\n// "[object Object]20" — first element is used as accumulator!\n\n// ✅ Fix: provide initial value\nitems.reduce((sum, item) => sum + item.price, 0); // 30` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'reduce-mistakes.js', code: `// â Forgetting to return the accumulator\nconst counts = ['a', 'b', 'a'].reduce((acc, val) => {\n  acc[val] = (acc[val] || 0) + 1;\n  // Missing return acc!\n}, {});\n// counts is undefined\n\n// â Mutating when you shouldn’t\nconst result = nums.reduce((acc, n) => {\n  acc.push(n * 2); // Mutating acc works but isn’t "pure"\n  return acc;\n}, []);\n\n// â Overcomplicating: reduce when map/filter suffice\n// Bad: using reduce to double numbers\nconst doubled = nums.reduce((acc, n) => [...acc, n * 2], []);\n// Good: just use map\nconst doubled2 = nums.map(n => n * 2);` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'reduce() iterates through the array once, so it\'s O(n). But if you\'re creating new arrays or objects inside reduce using spread syntax, that can become O(n²). For big datasets, prefer mutating the accumulator.' },
    { type: 'code', language: 'javascript', filename: 'reduce-perf.js', code: `// ❌ O(n²) — spreads create new array each iteration\nconst flat = nested.reduce((acc, arr) => [...acc, ...arr], []);\n\n// ✅ O(n) — push mutates the accumulator\nconst flat2 = nested.reduce((acc, arr) => {\n  acc.push(...arr);\n  return acc;\n}, []);` },

    { type: 'heading', level: 2, text: 'When to Use reduce()', id: 'when-to-use' },
    { type: 'table', headers: ['Task', 'Best method'], rows: [
      ['Sum / aggregate', 'reduce()'],
      ['Transform elements', 'map()'],
      ['Filter elements', 'filter()'],
      ['Find one element', 'find()'],
      ['Group by key', 'reduce() or Object.groupBy()'],
      ['Count occurrences', 'reduce()'],
      ['Build objects from arrays', 'reduce()'],
      ['Pipeline / compose', 'reduce()'],
    ]},
    { type: 'callout', variant: 'tip', title: 'Readability First', text: 'reduce() is powerful but can be hard to read. If you can express your logic as a chain of map() and filter(), prefer that for clarity. Use reduce() when it genuinely simplifies things.' },

    { type: 'heading', level: 2, text: 'Real-World Patterns', id: 'real-world' },
    { type: 'code', language: 'javascript', filename: 'reduce-real-world.js', code: `// Shopping cart total\nconst total = cart.reduce((sum, item) =>\n  sum + item.price * item.quantity, 0\n);\n\n// Merge multiple configs with precedence\nconst config = configs.reduce((merged, cfg) =>\n  ({ ...merged, ...cfg }), {}\n);\n\n// Build query string\nconst params = { page: 1, sort: 'name', order: 'asc' };\nconst query = Object.entries(params).reduce((qs, [k, v], i) =>\n  qs + (i ? '&' : '?') + \\\`\\\${k}=\\\${v}\\\`, ''\n);\n// '?page=1&sort=name&order=asc'` },
  ],
};
