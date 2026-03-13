import type { ReferenceContent } from '@/types/content';
export const arraySortReference: ReferenceContent = {
  id: 'array-sort', title: 'Array.prototype.sort()', description: 'Sort array elements in place using a custom comparator function.', slug: 'reference/array/sort', pillar: 'reference', category: 'array', tags: ['array','sort','comparator','order'], difficulty: 'beginner', contentType: 'reference', summary: 'sort() sorts elements in place. Without a comparator, it converts elements to strings and sorts lexicographically. Always provide a compare function for numeric or custom sorting.', relatedTopics: ['array-map','array-filter'],
  signature: 'array.sort(compareFn?)',
  parameters: [{ name: 'compareFn', type: '(a, b) => number', description: 'Returns negative if a < b, positive if a > b, or 0 if equal.', optional: true }],
  returnValue: { type: 'T[]', description: 'The sorted array (same reference — mutated in place).' },
  compatibility: 'ES1+ — All browsers (stable sort guaranteed since ES2019)',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'sort() rearranges your array in place and gives you back the same array (mutated). Without a comparator function, it converts everything to strings and sorts them alphabetically — which will mess up your numbers. Always provide a compare function for anything other than strings.' },
    { type: 'callout', variant: 'danger', title: 'sort() Mutates!', text: 'sort() changes the original array. Use [...arr].sort() or arr.toSorted() (ES2023) if you need a non-mutating version.' },

    { type: 'heading', level: 2, text: 'The Default Sort Trap', id: 'default-trap' },
    { type: 'code', language: 'javascript', filename: 'sort-default.js', code: `// Default sort converts to strings — WRONG for numbers!\n[10, 9, 2, 21, 100].sort();\n// [10, 100, 2, 21, 9] — lexicographic order!\n\n// Why: "10" < "2" because "1" < "2" in character codes\n'10' < '2'   // true (string comparison)\n10 < 2       // false (number comparison)\n\n// Strings sort correctly by default\n['banana', 'apple', 'cherry'].sort();\n// ['apple', 'banana', 'cherry']` },

    { type: 'heading', level: 2, text: 'Numeric Sorting', id: 'numeric' },
    { type: 'code', language: 'javascript', filename: 'sort-numeric.js', code: `const nums = [10, 9, 2, 21, 100];\n\n// Ascending\nnums.sort((a, b) => a - b);\n// [2, 9, 10, 21, 100]\n\n// Descending\nnums.sort((a, b) => b - a);\n// [100, 21, 10, 9, 2]\n\n// How the comparator works:\n// Return negative → a comes first\n// Return positive → b comes first\n// Return 0       → order preserved (stable sort)` },

    { type: 'heading', level: 2, text: 'Sorting Strings', id: 'strings' },
    { type: 'paragraph', text: 'For proper string sorting (handling accents and case), use localeCompare().' },
    { type: 'code', language: 'javascript', filename: 'sort-strings.js', code: `const names = ['Élodie', 'Alice', 'Björk', 'charlie', 'Bob'];\n\n// Default: uppercase before lowercase, accents wrong\nnames.sort();\n// ['Alice', 'Bob', 'Björk', 'charlie', 'Élodie']\n\n// Locale-aware: correct handling of accents and case\nnames.sort((a, b) => a.localeCompare(b));\n// ['Alice', 'Björk', 'Bob', 'charlie', 'Élodie']\n\n// Case-insensitive\nnames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));\n// ['Alice', 'Björk', 'Bob', 'charlie', 'Élodie']` },

    { type: 'heading', level: 2, text: 'Sorting Objects', id: 'objects' },
    { type: 'code', language: 'javascript', filename: 'sort-objects.js', code: `const users = [\n  { name: 'Charlie', age: 25, score: 88 },\n  { name: 'Alice', age: 30, score: 95 },\n  { name: 'Bob', age: 20, score: 88 },\n];\n\n// By name (alphabetical)\nusers.sort((a, b) => a.name.localeCompare(b.name));\n\n// By age (ascending)\nusers.sort((a, b) => a.age - b.age);\n\n// Multi-key: by score (desc), then by name (asc)\nusers.sort((a, b) =>\n  b.score - a.score || a.name.localeCompare(b.name)\n);\n// Alice (95), Bob (88), Charlie (88) — same score sorted by name` },

    { type: 'heading', level: 2, text: 'Multi-Key Sort Helper', id: 'multi-key' },
    { type: 'code', language: 'typescript', filename: 'multi-sort.ts', code: `type Comparator<T> = (a: T, b: T) => number;\n\nfunction multiSort<T>(...comparators: Comparator<T>[]): Comparator<T> {\n  return (a, b) => {\n    for (const compare of comparators) {\n      const result = compare(a, b);\n      if (result !== 0) return result;\n    }\n    return 0;\n  };\n}\n\n// Usage\nusers.sort(multiSort(\n  (a, b) => b.score - a.score,         // Primary: score desc\n  (a, b) => a.name.localeCompare(b.name), // Secondary: name asc\n  (a, b) => a.age - b.age,                // Tertiary: age asc\n));` },

    { type: 'heading', level: 2, text: 'Non-Mutating Sort', id: 'non-mutating' },
    { type: 'code', language: 'javascript', filename: 'sort-immutable.js', code: `const original = [3, 1, 4, 1, 5];\n\n// Spread + sort (works everywhere)\nconst sorted = [...original].sort((a, b) => a - b);\n// sorted: [1, 1, 3, 4, 5]\n// original: [3, 1, 4, 1, 5] — unchanged\n\n// toSorted() (ES2023) — cleaner\nconst sorted2 = original.toSorted((a, b) => a - b);\n// sorted2: [1, 1, 3, 4, 5]\n// original: [3, 1, 4, 1, 5] — unchanged` },

    { type: 'heading', level: 2, text: 'Stable Sort', id: 'stable-sort' },
    { type: 'paragraph', text: 'Since ES2019, sort() is guaranteed to be stable — elements that compare as equal keep their original relative order. This matters a lot for multi-key sorting.' },
    { type: 'code', language: 'javascript', filename: 'stable-sort.js', code: `const items = [\n  { name: 'A', group: 2 },\n  { name: 'B', group: 1 },\n  { name: 'C', group: 2 },\n  { name: 'D', group: 1 },\n];\n\n// Stable: A and C (both group 2) maintain their relative order\nitems.sort((a, b) => a.group - b.group);\n// [B(1), D(1), A(2), C(2)] — B before D, A before C (original order)` },

    { type: 'heading', level: 2, text: 'Sorting Dates', id: 'dates' },
    { type: 'code', language: 'javascript', filename: 'sort-dates.js', code: `const events = [\n  { name: 'Launch', date: '2024-03-15' },\n  { name: 'Planning', date: '2024-01-10' },\n  { name: 'Review', date: '2024-06-20' },\n];\n\n// Sort by date (ascending — oldest first)\nevents.sort((a, b) => new Date(a.date) - new Date(b.date));\n\n// Sort by date (descending — newest first)\nevents.sort((a, b) => new Date(b.date) - new Date(a.date));\n\n// With Date objects directly\nconst dates = [new Date('2024-03'), new Date('2024-01'), new Date('2024-06')];\ndates.sort((a, b) => a - b); // Works because Date coerces to timestamp` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'sort-mistakes.js', code: `// ❌ Sorting numbers without comparator\n[10, 2, 21].sort(); // [10, 2, 21] — lexicographic!\n[10, 2, 21].sort((a, b) => a - b); // [2, 10, 21] ✅\n\n// ❌ Boolean comparator (incorrect)\nitems.sort((a, b) => a.active); // Returns boolean, not number!\nitems.sort((a, b) => Number(b.active) - Number(a.active)); // ✅\n\n// ❌ Forgetting sort mutates\nfunction getSorted(arr) {\n  return arr.sort(); // Mutates the original!\n}\nfunction getSorted(arr) {\n  return [...arr].sort(); // Safe copy ✅\n}\n\n// ❌ Inconsistent comparator (must be transitive)\n// If a < b and b < c, then a < c must hold\nitems.sort((a, b) => Math.random() - 0.5); // NOT a valid shuffle!` },

    { type: 'heading', level: 2, text: 'Proper Shuffle (Fisher-Yates)', id: 'shuffle' },
    { type: 'code', language: 'javascript', filename: 'shuffle.js', code: `// ❌ Random sort — NOT uniformly random\narr.sort(() => Math.random() - 0.5);\n\n// ✅ Fisher-Yates shuffle — correct and efficient\nfunction shuffle(arr) {\n  const result = [...arr];\n  for (let i = result.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [result[i], result[j]] = [result[j], result[i]];\n  }\n  return result;\n}` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'sort() uses an optimized algorithm (typically TimSort) with O(n log n) average and worst-case complexity. Your comparator gets called a lot, so keep it fast.' },
    { type: 'table', headers: ['Concern', 'Advice'], rows: [
      ['Comparator speed', 'Avoid expensive operations in the comparator'],
      ['Pre-compute keys', 'For complex sorts, compute sort keys first (Schwartzian transform)'],
      ['Large arrays', 'Consider Web Workers for sorts > 100k elements'],
      ['Already sorted', 'TimSort is O(n) for nearly-sorted data'],
    ]},

    { type: 'heading', level: 2, text: 'Schwartzian Transform', id: 'schwartzian' },
    { type: 'paragraph', text: 'When computing the sort key is expensive, pre-compute it once instead of over and over in your comparator.' },
    { type: 'code', language: 'javascript', filename: 'schwartzian.js', code: `// Expensive: computes expensiveKey() O(n log n) times\nitems.sort((a, b) => expensiveKey(a) - expensiveKey(b));\n\n// Schwartzian: computes expensiveKey() only O(n) times\nconst sorted = items\n  .map(item => ({ item, key: expensiveKey(item) }))\n  .sort((a, b) => a.key - b.key)\n  .map(({ item }) => item);` },
  ],
};
