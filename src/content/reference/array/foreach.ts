import type { ReferenceContent } from '@/types/content';
export const arrayForEachReference: ReferenceContent = {
  id: 'array-foreach', title: 'Array.prototype.forEach()', description: 'Executes a function once for each array element.', slug: 'reference/array/foreach', pillar: 'reference', category: 'array', tags: ['array','forEach','iteration','loop'], difficulty: 'beginner', contentType: 'reference', summary: 'forEach() calls a function for each element in order. It always returns undefined and cannot be broken out of early.', relatedTopics: ['array-map','array-filter'], order: 4, updatedAt: '2024-03-01',
  signature: 'array.forEach(callbackFn, thisArg?)',
  parameters: [{ name: 'callbackFn', type: '(element, index, array) => void', description: 'Function to execute for each element.' }, { name: 'thisArg', type: 'any', description: 'Value to use as this.', optional: true }],
  returnValue: { type: 'undefined', description: 'forEach always returns undefined. It cannot be chained.' },
  compatibility: 'ES5+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'forEach() runs your function once for each element, in order. It\'s all about side effects — logging stuff, updating the DOM, hitting an API. Don\'t expect a return value because it always gives you undefined.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'foreach-basic.js', code: `const fruits = ['apple', 'banana', 'cherry'];\n\nfruits.forEach((fruit, index) => {\n  console.log(\\\`\\\${index}: \\\${fruit}\\\`);\n});\n// 0: apple\n// 1: banana\n// 2: cherry\n\n// Side effects: modifying external state\nconst lengths = [];\nfruits.forEach(f => lengths.push(f.length));\n// lengths: [5, 6, 6]` },

    { type: 'heading', level: 2, text: 'forEach vs for...of', id: 'vs-for-of' },
    { type: 'paragraph', text: 'for...of is way more flexible — you can break out, continue, return from the outer function, and it works with any iterable. forEach is just about running a function on each item.' },
    { type: 'code', language: 'javascript', filename: 'foreach-vs-forof.js', code: `const nums = [1, 2, 3, 4, 5];\n\n// Wrong: you can't break out of forEach\nnums.forEach(n => {\n  if (n === 3) return; // Only skips this iteration, doesn't break\n  console.log(n); // 1, 2, 4, 5\n});\n\n// Correct: for...of supports break\nfor (const n of nums) {\n  if (n === 3) break;\n  console.log(n); // 1, 2\n}\n\n// Correct: for...of supports await\nfor (const url of urls) {\n  await fetch(url); // Sequential async\n}` },

    { type: 'heading', level: 2, text: 'forEach vs map()', id: 'vs-map' },
    { type: 'table', headers: ['Feature', 'forEach()', 'map()'], rows: [
      ['Returns', 'undefined', 'New array'],
      ['Purpose', 'Side effects', 'Transformations'],
      ['Chainable', 'No', 'Yes'],
      ['Use when', 'Logging, DOM updates, API calls', 'Creating new array from old'],
    ]},
    { type: 'callout', variant: 'warning', title: 'Don\'t misuse map()', text: 'If you don\'t need the returned array, use forEach(). Using map() just for side effects wastes memory creating an array you\'ll throw away.' },

    { type: 'heading', level: 2, text: 'Can\'t Break Early', id: 'cannot-break' },
    { type: 'paragraph', text: 'This is the big gotcha with forEach — it always runs through every element. There\'s no way to bail out early. You can\'t use break, continue, or return to stop the loop.' },
    { type: 'code', language: 'javascript', filename: 'foreach-no-break.js', code: `// return in forEach only exits the current callback, not the loop\n[1, 2, 3, 4, 5].forEach(n => {\n  if (n === 3) return; // Skips 3 but continues to 4, 5\n  console.log(n);\n});\n// 1, 2, 4, 5\n\n// If you need early exit, use:\n// 1. for...of with break\n// 2. some() — stops on first true\n// 3. every() — stops on first false\n// 4. find() — stops on first match\n\n[1, 2, 3, 4, 5].some(n => {\n  if (n === 3) return true; // Stops iteration\n  console.log(n);\n  return false;\n});\n// 1, 2` },

    { type: 'heading', level: 2, text: 'async/await Pitfall', id: 'async-pitfall' },
    { type: 'callout', variant: 'danger', title: 'forEach does NOT await', text: 'This trips everyone up — forEach ignores the return value of your callback, including Promises. Don\'t use it with async code. Reach for for...of for sequential operations or Promise.all with map() for parallel.' },
    { type: 'code', language: 'javascript', filename: 'foreach-async.js', code: `// Wrong: forEach doesn't wait for async callbacks\nconst urls = ['/api/1', '/api/2', '/api/3'];\n\nurls.forEach(async (url) => {\n  const data = await fetch(url); // Fires all at once, no waiting\n  console.log(data);\n});\nconsole.log('Done!'); // Runs BEFORE any fetch completes!\n\n// Correct: use for...of for sequential work\nfor (const url of urls) {\n  const data = await fetch(url);\n  console.log(data);\n}\nconsole.log('Done!'); // Runs after all fetches complete\n\n// Correct: use Promise.all + map for parallel work\nconst results = await Promise.all(urls.map(url => fetch(url)));\nconsole.log('Done!');` },

    { type: 'heading', level: 2, text: 'Common Use Cases', id: 'use-cases' },
    { type: 'code', language: 'javascript', filename: 'foreach-use-cases.js', code: `// DOM manipulation\ndocument.querySelectorAll('.card').forEach(card => {\n  card.classList.add('visible');\n});\n\n// Logging / debugging\ndata.forEach((item, i) => {\n  console.log(\\\`Item \\\${i}:\\\`, item);\n});\n\n// Accumulating into external structures\nconst index = new Map();\nusers.forEach(user => {\n  index.set(user.id, user);\n});\n\n// Event listener setup\nconst buttons = document.querySelectorAll('button');\nbuttons.forEach(btn => {\n  btn.addEventListener('click', handleClick);\n});` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'forEach() skips empty slots in sparse arrays',
      'Modifying the array during forEach may cause unexpected behavior',
      'forEach() is not called on empty arrays',
      'The callback receives (element, index, array) — same as map/filter',
      'Throwing an exception is the only way to "break" out of forEach',
    ]},
    { type: 'code', language: 'javascript', filename: 'foreach-edge.js', code: `// Sparse arrays\nconst sparse = [1, , , 4];\nsparse.forEach(n => console.log(n));\n// 1, 4 — empty slots are skipped\n\n// Modifying during iteration\nconst arr = [1, 2, 3, 4, 5];\narr.forEach((n, i) => {\n  if (n === 2) arr.splice(i, 1); // Dangerous!\n});\n// arr might not be what you expect` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'forEach() has a tiny bit of overhead compared to a plain for loop — you\'re calling a function per element. For most code this doesn\'t matter, but if you\'re processing millions of elements in a tight loop, a regular for loop might be noticeably faster.' },
    { type: 'table', headers: ['Loop Type', 'Speed', 'Break', 'Async'], rows: [
      ['for', 'Fastest', '✅', '✅'],
      ['for...of', 'Fast', '✅', '✅'],
      ['forEach', 'Slightly slower', '❌', '❌'],
      ['for...in', 'Slowest (for arrays)', '✅', '✅'],
    ]},

    { type: 'heading', level: 2, text: 'When to Use forEach', id: 'when-to-use' },
    { type: 'list', items: [
      '✅ Executing side effects (logging, DOM updates, API calls)',
      '✅ When you don\'t need the return value',
      '✅ When you don\'t need to break early',
      '❌ Don\'t use for transformations — use map()',
      '❌ Don\'t use for filtering — use filter()',
      '❌ Don\'t use for async operations — use for...of',
      '❌ Don\'t use when you need early exit — use for...of, some(), or find()',
    ]},
  ],
};
