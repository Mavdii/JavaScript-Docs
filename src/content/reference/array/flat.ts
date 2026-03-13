import type { ReferenceContent } from '@/types/content';
export const arrayFlatReference: ReferenceContent = {
  id: 'array-flat', title: 'Array flat() / flatMap()', description: 'Flatten nested arrays with flat() and combine mapping with flattening using flatMap().', slug: 'reference/array/flat', pillar: 'reference', category: 'array', tags: ['array','flat','flatMap','nested'], difficulty: 'beginner', contentType: 'reference', summary: 'flat() creates a new array with sub-array elements concatenated to a specified depth. flatMap() maps each element then flattens one level.', relatedTopics: ['array-map','array-filter'],
  signature: 'array.flat(depth?) / array.flatMap(callbackFn)',
  parameters: [{ name: 'depth', type: 'number', description: 'Depth level to flatten (default 1). Use Infinity for complete flattening.', optional: true }],
  returnValue: { type: 'T[]', description: 'A new flattened array.' },
  compatibility: 'ES2019+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'flat() takes nested arrays and flattens them out to a specified depth. flatMap() does the same thing but combines it with mapping — it\'s like running map() then flat(1) in one shot, which makes it both cleaner and faster.' },

    { type: 'heading', level: 2, text: 'flat() Basics', id: 'flat-basics' },
    { type: 'code', language: 'javascript', filename: 'flat-basic.js', code: `// Default depth is 1\n[1, [2, 3], [4, [5]]].flat();\n// [1, 2, 3, 4, [5]]\n\n// Depth 2\n[1, [2, [3, [4]]]].flat(2);\n// [1, 2, 3, [4]]\n\n// Flatten completely with Infinity\n[1, [2, [3, [4, [5]]]]].flat(Infinity);\n// [1, 2, 3, 4, 5]\n\n// Removes empty slots\n[1, , 3, , 5].flat();\n// [1, 3, 5]` },

    { type: 'heading', level: 2, text: 'flatMap() Basics', id: 'flatmap-basics' },
    { type: 'paragraph', text: 'flatMap() combines mapping and flattening in one go. It\'s identical to map() followed by flat(1), but cleaner and faster because you\'re not creating that intermediate array.' },
    { type: 'code', language: 'javascript', filename: 'flatmap-basic.js', code: `// Split sentences into words\nconst sentences = ['Hello world', 'Foo bar baz'];\nconst words = sentences.flatMap(s => s.split(' '));\n// ['Hello', 'world', 'Foo', 'bar', 'baz']\n\n// Equivalent to (but faster than):\nconst words2 = sentences.map(s => s.split(' ')).flat();` },

    { type: 'heading', level: 2, text: 'flatMap() as filter + map', id: 'filter-map' },
    { type: 'paragraph', text: 'Here\'s a neat trick — return an empty array from flatMap() to filter items out. Return an array with one item to transform it. You get filtering and transformation in one pass.' },
    { type: 'code', language: 'javascript', filename: 'flatmap-filter.js', code: `const nums = [1, 2, 3, 4, 5, 6];\n\n// Double only even numbers, remove odds\nconst doubledEvens = nums.flatMap(n =>\n  n % 2 === 0 ? [n * 2] : []\n);\n// [4, 8, 12]\n\n// Equivalent to filter + map:\nconst same = nums.filter(n => n % 2 === 0).map(n => n * 2);\n\n// Expand: one-to-many mapping\nconst items = [{ name: 'A', tags: ['x', 'y'] }, { name: 'B', tags: ['z'] }];\nconst allTags = items.flatMap(item => item.tags);\n// ['x', 'y', 'z']` },

    { type: 'heading', level: 2, text: 'Practical Examples', id: 'practical' },
    { type: 'code', language: 'javascript', filename: 'flat-practical.js', code: `// Merge arrays of permissions from multiple roles\nconst roles = [\n  { name: 'editor', permissions: ['read', 'write'] },\n  { name: 'admin', permissions: ['read', 'write', 'delete'] },\n];\nconst allPermissions = [...new Set(roles.flatMap(r => r.permissions))];\n// ['read', 'write', 'delete']\n\n// Parse CSV-like data\nconst rows = ['a,b,c', 'd,e,f', 'g,h,i'];\nconst cells = rows.flatMap(row => row.split(','));\n// ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']\n\n// Cartesian product\nfunction cartesian(a, b) {\n  return a.flatMap(x => b.map(y => [x, y]));\n}\ncartesian([1, 2], ['a', 'b']);\n// [[1,'a'], [1,'b'], [2,'a'], [2,'b']]` },

    { type: 'heading', level: 2, text: 'Deep Flattening Without flat()', id: 'deep-flatten' },
    { type: 'paragraph', text: 'Before flat() existed (it\'s only ES2019), you had to roll your own recursive function. Here\'s how it was done back then.' },
    { type: 'code', language: 'javascript', filename: 'deep-flatten.js', code: `// Recursive flatten (pre-ES2019 polyfill)\nfunction deepFlatten(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val),\n    []\n  );\n}\n\ndeepFlatten([1, [2, [3, [4]]]]);\n// [1, 2, 3, 4]\n\n// With flat() — much simpler\n[1, [2, [3, [4]]]].flat(Infinity);` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'flat-mistakes.js', code: `// ❌ Expecting flatMap to flatten deeply\n[[1, 2], [3, [4, 5]]].flatMap(x => x);\n// [1, 2, 3, [4, 5]] — only flattens ONE level\n\n// ❌ Forgetting flat() is non-mutating\nconst arr = [1, [2, 3]];\narr.flat();\nconsole.log(arr); // [1, [2, 3]] — unchanged!\nconst flat = arr.flat(); // Need to capture the result\n\n// ❌ Using flat on non-array iterables\n// flat() only works on arrays, not Sets, Maps, or generators` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'flatMap() is faster than .map().flat() because it doesn\'t create that intermediate array. For super deeply nested structures, flat(Infinity) can get expensive — consider iterative approaches if you\'re working with massive datasets.' },
    { type: 'table', headers: ['Approach', 'Intermediate arrays', 'Performance'], rows: [
      ['flatMap()', '0', 'Best for 1-level'],
      ['map().flat()', '1', 'Slightly slower'],
      ['flat(Infinity)', '0', 'Expensive for deep nesting'],
      ['reduce + concat', '0', 'Manual but flexible'],
    ]},

    { type: 'heading', level: 2, text: 'TypeScript', id: 'typescript' },
    { type: 'code', language: 'typescript', filename: 'flat-typescript.ts', code: `// flat() reduces array depth in the type system\nconst nested: number[][] = [[1, 2], [3, 4]];\nconst flat: number[] = nested.flat(); // Correctly inferred\n\n// flatMap callback must return an array (or value)\nconst result: string[] = ['a b', 'c d'].flatMap(s => s.split(' '));\n\n// Type for deep flatten\ntype DeepFlatten<T> = T extends (infer U)[] ? DeepFlatten<U> : T;` },

    { type: 'heading', level: 2, text: 'Comparison', id: 'comparison' },
    { type: 'table', headers: ['Method', 'What it does', 'Depth'], rows: [
      ['flat()', 'Flattens nested arrays', 'Configurable (default 1)'],
      ['flatMap()', 'Maps then flattens', 'Always 1'],
      ['concat()', 'Joins arrays', '1 level only'],
      ['reduce + spread', 'Manual flatten', 'Configurable'],
    ]},
  ],
};
