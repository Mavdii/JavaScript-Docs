import type { ReferenceContent } from '@/types/content';
export const arraySomeEveryReference: ReferenceContent = {
  id: 'array-some-every', title: 'Array some() / every()', description: 'Test whether some or all elements pass a condition.', slug: 'reference/array/some-every', pillar: 'reference', category: 'array', tags: ['array','some','every','boolean','predicate'], difficulty: 'beginner', contentType: 'reference', summary: 'some() returns true if at least one element passes the test. every() returns true only if all elements pass. Both short-circuit for efficiency.', relatedTopics: ['array-filter','array-find'],
  signature: 'array.some(callbackFn) / array.every(callbackFn)',
  parameters: [{ name: 'callbackFn', type: '(element, index, array) => boolean', description: 'Predicate function to test each element.' }, { name: 'thisArg', type: 'any', description: 'Value to use as this.', optional: true }],
  returnValue: { type: 'boolean', description: 'True or false based on the test results.' },
  compatibility: 'ES5+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'some() and every() are your boolean-returning buddies. some() checks if at least one element passes your test (like OR logic). every() checks if all of them pass (like AND logic). Both are smart — they stop iterating as soon as they know the answer.' },

    { type: 'heading', level: 2, text: 'some() — At Least One', id: 'some' },
    { type: 'code', language: 'javascript', filename: 'some.js', code: `const nums = [1, 2, 3, 4, 5];\n\nnums.some(n => n > 3);   // true — 4 passes\nnums.some(n => n > 10);  // false — none pass\nnums.some(n => n === 1); // true — first element matches\n\n// Short-circuits: stops at first true\n[1, 2, 3, 4, 5].some(n => {\n  console.log('checking', n);\n  return n === 3;\n});\n// checking 1\n// checking 2\n// checking 3  ← stops here, returns true` },

    { type: 'heading', level: 2, text: 'every() — All Must Pass', id: 'every' },
    { type: 'code', language: 'javascript', filename: 'every.js', code: `const nums = [2, 4, 6, 8];\n\nnums.every(n => n % 2 === 0);  // true — all even\nnums.every(n => n > 5);        // false — 2, 4 fail\n\n[2, 4, 6, 3, 8].every(n => {\n  console.log('checking', n);\n  return n % 2 === 0;\n});\n// checking 2\n// checking 4\n// checking 6\n// checking 3  ← stops here, returns false` },

    { type: 'heading', level: 2, text: 'Empty Array Behavior', id: 'empty-array' },
    { type: 'callout', variant: 'info', title: 'Vacuous Truth', text: 'every() on an empty array returns true (vacuous truth — "all zero elements pass"). some() on an empty array returns false. This follows mathematical logic conventions.' },
    { type: 'code', language: 'javascript', filename: 'empty-array.js', code: `[].some(x => true);   // false — no elements to pass\n[].every(x => false);  // true  — no elements to fail (vacuous truth)\n\n// This can be surprising:\nconst hasErrors = [].every(item => item.valid);\n// true — even though there are no items!` },

    { type: 'heading', level: 2, text: 'With Objects', id: 'with-objects' },
    { type: 'code', language: 'javascript', filename: 'some-every-objects.js', code: `const users = [\n  { name: 'Alice', active: true, verified: true },\n  { name: 'Bob', active: true, verified: false },\n  { name: 'Charlie', active: false, verified: true },\n];\n\n// Is any user active?\nusers.some(u => u.active); // true\n\n// Are all users verified?\nusers.every(u => u.verified); // false\n\n// Is any user both active AND verified?\nusers.some(u => u.active && u.verified); // true (Alice)\n\n// Form validation: all fields filled?\nconst fields = [\n  { name: 'email', value: 'test@test.com' },\n  { name: 'password', value: '123456' },\n  { name: 'name', value: '' },\n];\nconst allFilled = fields.every(f => f.value.trim() !== '');\n// false — name is empty` },

    { type: 'heading', level: 2, text: 'Comparison Table', id: 'comparison' },
    { type: 'table', headers: ['Feature', 'some()', 'every()'], rows: [
      ['Logic', 'OR (∃)', 'AND (∀)'],
      ['Returns true when', 'At least one passes', 'All pass'],
      ['Short-circuits on', 'First true', 'First false'],
      ['Empty array', 'false', 'true'],
      ['Equivalent', '!arr.every(x => !f(x))', '!arr.some(x => !f(x))'],
    ]},

    { type: 'heading', level: 2, text: 'some() as Early-Exit forEach', id: 'early-exit' },
    { type: 'paragraph', text: 'Here\'s a neat trick — since some() stops at the first true, you can use it as a forEach that supports "breaking". Return true to stop, false to keep going.' },
    { type: 'code', language: 'javascript', filename: 'some-break.js', code: `// â forEach: can’t break\n[1, 2, 3, 4, 5].forEach(n => {\n  if (n === 3) return; // only skips this callback\n  console.log(n);\n}); // 1, 2, 4, 5\n\n// â some: return true to "break"\n[1, 2, 3, 4, 5].some(n => {\n  if (n === 3) return true; // stops iteration\n  console.log(n);\n  return false;\n}); // 1, 2` },

    { type: 'heading', level: 2, text: 'Common Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'patterns.js', code: `// Permission check\nconst hasPermission = user.roles.some(role =>\n  role.permissions.includes('admin:write')\n);\n\n// All required fields present\nconst requiredFields = ['name', 'email', 'password'];\nconst isValid = requiredFields.every(field => formData[field]?.trim());\n\n// Check for duplicates\nfunction hasDuplicates(arr) {\n  return arr.some((item, index) => arr.indexOf(item) !== index);\n}\n\n// Array containment: does A contain all of B?\nfunction containsAll(a, b) {\n  return b.every(item => a.includes(item));\n}\n\n// Array overlap: do A and B share any element?\nfunction hasOverlap(a, b) {\n  return a.some(item => b.includes(item));\n}` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'Both some() and every() short-circuit, making them way faster than filter().length > 0 or similar approaches. They stop early, so you don\'t waste time on elements you don\'t need to check.' },
    { type: 'code', language: 'javascript', filename: 'perf.js', code: `const bigArray = Array.from({ length: 1_000_000 }, (_, i) => i);\n\n// ❌ Slow: scans entire array\nconst hasMatch = bigArray.filter(n => n === 5).length > 0;\n\n// ✅ Fast: stops at index 5\nconst hasMatch2 = bigArray.some(n => n === 5);\n\n// ❌ Slow: creates intermediate array\nconst allPositive = bigArray.filter(n => n >= 0).length === bigArray.length;\n\n// ✅ Fast: stops at first negative\nconst allPositive2 = bigArray.every(n => n >= 0);` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'mistakes.js', code: `// ❌ Using some/every when you need the matching element\nconst found = arr.some(x => x.id === 5); // true, but which one?\nconst found2 = arr.find(x => x.id === 5); // the actual element\n\n// ❌ Negating incorrectly\n// "no items are invalid" vs "all items are valid"\n!items.some(i => !i.valid)  // Confusing double negation\nitems.every(i => i.valid)    // Much clearer\n\n// ❌ Forgetting every([]) returns true\nfunction validateItems(items) {\n  if (items.every(i => i.valid)) { // true for empty!\n    // Add a length check:\n    if (items.length > 0 && items.every(i => i.valid)) {\n      // Now safe\n    }\n  }\n}` },

    { type: 'heading', level: 2, text: 'When to Use', id: 'when-to-use' },
    { type: 'table', headers: ['Need', 'Method', 'Returns'], rows: [
      ['Is any element X?', 'some()', 'boolean'],
      ['Are all elements X?', 'every()', 'boolean'],
      ['Which element is X?', 'find()', 'element | undefined'],
      ['All elements that are X?', 'filter()', 'array'],
      ['Does array contain value?', 'includes()', 'boolean'],
    ]},
  ],
};
