import type { ReferenceContent } from '@/types/content';
export const arraySliceSpliceReference: ReferenceContent = {
  id: 'array-slice-splice', title: 'Array slice() / splice()', description: 'Extract sub-arrays with slice() and add/remove elements in place with splice().', slug: 'reference/array/slice-splice', pillar: 'reference', category: 'array', tags: ['array','slice','splice','mutate'], difficulty: 'beginner', contentType: 'reference', summary: 'slice() extracts a portion of an array without mutating. splice() adds/removes elements in place and returns the removed items.', relatedTopics: ['array-map','array-filter'],
  signature: 'array.slice(start?, end?) / array.splice(start, deleteCount?, ...items)',
  parameters: [{ name: 'start', type: 'number', description: 'Start index. Negative values count from the end.' }, { name: 'end / deleteCount', type: 'number', description: 'End index exclusive (slice) or count to delete (splice).', optional: true }],
  returnValue: { type: 'T[]', description: 'slice: new sub-array. splice: array of removed elements.' },
  compatibility: 'ES3+ — All browsers',
  sections: [
    { type: 'heading', level: 2, text: 'slice() — Non-Mutating', id: 'slice' },
    { type: 'paragraph', text: 'slice() pulls out a chunk of an array without changing the original. You give it a start and end, and it returns the portion between them (not including the end index).' },
    { type: 'code', language: 'javascript', filename: 'slice.js', code: `const arr = [1, 2, 3, 4, 5];\n\narr.slice(1, 3);   // [2, 3] — from index 1 to 3 (exclusive)\narr.slice(2);      // [3, 4, 5] — from index 2 to end\narr.slice(-2);     // [4, 5] — last 2 elements\narr.slice(-3, -1); // [3, 4] — negative indices work\narr.slice();       // [1, 2, 3, 4, 5] — shallow copy\narr.slice(0, 0);   // [] — empty range\n\nconsole.log(arr);  // [1, 2, 3, 4, 5] — unchanged` },

    { type: 'heading', level: 2, text: 'slice() Patterns', id: 'slice-patterns' },
    { type: 'code', language: 'javascript', filename: 'slice-patterns.js', code: `// Shallow clone\nconst clone = arr.slice();\n\n// First N elements\nconst firstThree = arr.slice(0, 3);\n\n// Last N elements\nconst lastTwo = arr.slice(-2);\n\n// Everything except first element\nconst tail = arr.slice(1);\n\n// Everything except last element\nconst init = arr.slice(0, -1);\n\n// Pagination\nfunction getPage(items, page, pageSize) {\n  const start = (page - 1) * pageSize;\n  return items.slice(start, start + pageSize);\n}\ngetPage([1,2,3,4,5,6,7,8,9,10], 2, 3); // [4, 5, 6]\n\n// Convert array-like to array (legacy)\nconst args = Array.prototype.slice.call(arguments);\n// Modern: Array.from(arguments) or [...arguments]` },

    { type: 'heading', level: 2, text: 'splice() — Mutating', id: 'splice' },
    { type: 'paragraph', text: 'splice() is the destructive one — it changes your array in place. You tell it where to start, how many to remove, and what to add. It returns whatever you removed.' },
    { type: 'code', language: 'javascript', filename: 'splice.js', code: `const arr = ['a', 'b', 'c', 'd', 'e'];\n\n// Remove 2 elements starting at index 1\nconst removed = arr.splice(1, 2);\n// removed: ['b', 'c']\n// arr: ['a', 'd', 'e']\n\n// Insert without removing (deleteCount = 0)\narr.splice(1, 0, 'x', 'y');\n// arr: ['a', 'x', 'y', 'd', 'e']\n\n// Replace 1 element at index 2\narr.splice(2, 1, 'Z');\n// arr: ['a', 'x', 'Z', 'd', 'e']\n\n// Remove from end using negative index\narr.splice(-1, 1);\n// arr: ['a', 'x', 'Z', 'd']` },

    { type: 'heading', level: 2, text: 'splice() Patterns', id: 'splice-patterns' },
    { type: 'code', language: 'javascript', filename: 'splice-patterns.js', code: `// Remove element by value\nfunction removeByValue(arr, value) {\n  const index = arr.indexOf(value);\n  if (index !== -1) arr.splice(index, 1);\n  return arr;\n}\n\n// Remove element by index\nfunction removeByIndex(arr, index) {\n  arr.splice(index, 1);\n  return arr;\n}\n\n// Insert at specific position\nfunction insertAt(arr, index, ...items) {\n  arr.splice(index, 0, ...items);\n  return arr;\n}\n\n// Replace range\nfunction replaceRange(arr, start, count, ...items) {\n  arr.splice(start, count, ...items);\n  return arr;\n}\n\n// Clear array (keep reference)\nfunction clearArray(arr) {\n  arr.splice(0, arr.length);\n}` },

    { type: 'heading', level: 2, text: 'Comparison Table', id: 'comparison' },
    { type: 'table', headers: ['Feature', 'slice()', 'splice()'], rows: [
      ['Mutates original', 'No', 'Yes'],
      ['Returns', 'New sub-array', 'Array of removed elements'],
      ['Can insert', 'No', 'Yes'],
      ['Can remove', 'No (extracts)', 'Yes'],
      ['Can replace', 'No', 'Yes'],
      ['End parameter', 'Exclusive index', 'Count to delete'],
    ]},
    { type: 'callout', variant: 'warning', title: 'Mutation Alert', text: 'splice() mutates the original array. In React and other frameworks that rely on immutability for change detection, prefer non-mutating alternatives.' },

    { type: 'heading', level: 2, text: 'Immutable Alternatives', id: 'immutable' },
    { type: 'paragraph', text: 'For frameworks like React where state must be treated immutably, use these splice-like patterns without mutation.' },
    { type: 'code', language: 'javascript', filename: 'immutable-splice.js', code: `const arr = [1, 2, 3, 4, 5];\n\n// Remove at index (immutable)\nconst without3 = [...arr.slice(0, 2), ...arr.slice(3)];\n// [1, 2, 4, 5]\n\n// Insert at index (immutable)\nconst withX = [...arr.slice(0, 2), 'x', ...arr.slice(2)];\n// [1, 2, 'x', 3, 4, 5]\n\n// Replace at index (immutable)\nconst replaced = arr.map((v, i) => i === 2 ? 'new' : v);\n// [1, 2, 'new', 4, 5]\n\n// ES2023: toSpliced() — immutable splice!\nconst result = arr.toSpliced(1, 2, 'a', 'b');\n// result: [1, 'a', 'b', 4, 5]\n// arr: [1, 2, 3, 4, 5] — unchanged` },

    { type: 'heading', level: 2, text: 'toSpliced() (ES2023)', id: 'to-spliced' },
    { type: 'paragraph', text: 'toSpliced() is the immutable version of splice(). It returns a new array without touching the original.' },
    { type: 'code', language: 'javascript', filename: 'to-spliced.js', code: `const arr = ['a', 'b', 'c', 'd'];\n\n// Same API as splice, but returns new array\nconst result = arr.toSpliced(1, 2, 'x');\n// result: ['a', 'x', 'd']\n// arr: ['a', 'b', 'c', 'd'] — unchanged\n\n// Other new immutable methods (ES2023):\narr.toReversed();    // Immutable reverse\narr.toSorted();      // Immutable sort\narr.with(1, 'X');    // Immutable index replacement` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'mistakes.js', code: `// ❌ Confusing slice and splice\nconst arr = [1, 2, 3, 4, 5];\narr.splice(1, 3); // Mutates! arr is now [1, 5]\narr.slice(1, 3);  // Returns [2, 3], arr unchanged\n\n// ❌ Forgetting splice returns REMOVED elements\nconst arr2 = [1, 2, 3];\nconst result = arr2.splice(1, 0, 'new');\nconsole.log(result); // [] — nothing was removed!\n\n// ❌ splice in a loop (indices shift!)\nconst arr3 = [1, 2, 3, 4, 5];\nfor (let i = 0; i < arr3.length; i++) {\n  if (arr3[i] % 2 === 0) arr3.splice(i, 1);\n  // After removing index 1 (2), index 1 becomes 3\n  // Element 4 at index 2 is now at index 1 — skipped!\n}\n// Fix: iterate backwards\nfor (let i = arr3.length - 1; i >= 0; i--) {\n  if (arr3[i] % 2 === 0) arr3.splice(i, 1);\n}` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'slice() with start > end returns empty array',
      'slice() with indices beyond array length clamps to the length',
      'splice() with negative start counts from the end',
      'splice() with deleteCount of 0 inserts without removing',
      'splice() with no deleteCount removes everything from start to end',
      'Both methods work with negative indices',
    ]},

    { type: 'heading', level: 2, text: 'Mnemonic', id: 'mnemonic' },
    { type: 'callout', variant: 'tip', title: 'Remember the Difference', text: 'slice = "select" a portion (non-destructive). splice = "surgery" on the array (destructive). The extra "p" in splice stands for "permanent change."' },
  ],
};
