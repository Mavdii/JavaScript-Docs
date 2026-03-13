import type { ReferenceContent } from '@/types/content';
export const stringIncludesReference: ReferenceContent = {
  id: 'string-includes', title: 'String includes()', description: 'Check if a string contains another string (case-sensitive).', slug: 'reference/string/includes', pillar: 'reference', category: 'string', tags: ['string','includes','search','contains','substring'], difficulty: 'beginner', contentType: 'reference', summary: 'includes() returns true if the string contains the search string at any position. It\'s case-sensitive and faster than indexOf().', relatedTopics: ['string-match','string-replace','string-split'], order: 1,
  signature: 'string.includes(searchString, position?)',
  parameters: [{ name: 'searchString', type: 'string', description: 'The string to search for.' }, { name: 'position', type: 'number', description: 'The position to start searching from (default 0).', optional: true }],
  returnValue: { type: 'boolean', description: 'True if the string is found, false otherwise.' },
  compatibility: 'ES6+ — All modern browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'includes() is your simple yes/no answer — does this string contain that substring? It returns true or false, nothing else. It\'s case-sensitive and it doesn\'t care where in the string the match is.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'includes-basic.js', code: `const text = 'Hello World';\n\ntext.includes('World');      // true\ntext.includes('world');      // false — case-sensitive!\ntext.includes('Hello');      // true\ntext.includes('xyz');        // false\n\n// With position parameter\ntext.includes('o', 5);       // true (finds 'o' after position 5)\ntext.includes('Hello', 1);   // false (starts searching at position 1)` },

    { type: 'heading', level: 2, text: 'Common Use Cases', id: 'use-cases' },
    { type: 'code', language: 'javascript', filename: 'includes-use-cases.js', code: `// Email validation (basic check)\nconst email = 'user@example.com';\nemail.includes('@'); // true\n\n// Check file extension\nconst filename = 'document.pdf';\nfilename.includes('.pdf'); // true\n\n// Search in user input\nconst query = 'javascript tutorial';\nconst article = 'A beginner\\'s guide to javascript';\narticle.toLowerCase().includes(query.toLowerCase()); // true\n\n// Filter array of strings\nconst users = ['alice', 'bob', 'charlie', 'david'];\nusers.filter(name => name.includes('a'));\n// ['alice', 'charlie', 'david']\n\n// Check for forbidden words\nconst content = 'This is a great article';\nconst forbidden = ['spam', 'scam', 'phishing'];\nconst isClean = !forbidden.some(word =>\n  content.toLowerCase().includes(word.toLowerCase())\n);\n// true` },

    { type: 'heading', level: 2, text: 'Case Sensitivity', id: 'case-sensitivity' },
    { type: 'code', language: 'javascript', filename: 'includes-case.js', code: `const text = 'JavaScript';\n\ntext.includes('Script');  // true\ntext.includes('script');  // false — capital S vs lowercase s\n\n// Case-insensitive search\ntext.toLowerCase().includes('script'); // true\ntext.toUpperCase().includes('SCRIPT'); // true\n\n// Using regex (alternative)\n/script/i.test(text); // true — the 'i' flag ignores case` },

    { type: 'heading', level: 2, text: 'includes() vs indexOf()', id: 'vs-indexof' },
    { type: 'code', language: 'javascript', filename: 'includes-vs-indexof.js', code: `const text = 'Hello World';\n\n// includes — cleaner for existence check\nif (text.includes('World')) {\n  console.log('Found!');\n}\n\n// indexOf — if you need the position\nconst pos = text.indexOf('World');\nif (pos !== -1) {\n  console.log('Found at position', pos); // 6\n}\n\n// includes returns boolean (cleaner)\nconst hasWorld = text.includes('World'); // true\n\n// indexOf returns index or -1 (more to check)\nconst index = text.indexOf('World'); // 6\nconst found = index !== -1; // true` },

    { type: 'heading', level: 2, text: 'Position Parameter', id: 'position' },
    { type: 'code', language: 'javascript', filename: 'includes-position.js', code: `const text = 'banana';\n\ntext.includes('ana');     // true\ntext.includes('ana', 0);  // true (search from position 0)\ntext.includes('ana', 1);  // true (search from position 1)\ntext.includes('ana', 3);  // true (search from position 3)\ntext.includes('ana', 4);  // false (search from position 4, too late)\n\n// Find all occurrences\nfunction findAll(str, search) {\n  const positions = [];\n  let pos = 0;\n  while (str.includes(search, pos)) {\n    pos = str.indexOf(search, pos);\n    positions.push(pos);\n    pos++;\n  }\n  return positions;\n}\nfindAll('aaa', 'aa'); // [0, 1]` },

    { type: 'heading', level: 2, text: 'String Matching Methods', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Returns', 'Use when'], rows: [
      ['includes()', 'boolean', 'Just checking if substring exists'],
      ['indexOf()', 'index or -1', 'You need the position or first occurrence'],
      ['startsWith()', 'boolean', 'Checking the beginning only'],
      ['endsWith()', 'boolean', 'Checking the end only'],
      ['match()', 'array or null', 'Need all matches or regex support'],
    ]},

    { type: 'heading', level: 2, text: 'Common Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'includes-patterns.js', code: `// URL validation\nfunction isValidUrl(url) {\n  return url.includes('http://') || url.includes('https://');\n}\n\n// Check if password is strong (has uppercase, number, special char)\nfunction isStrongPassword(pwd) {\n  return pwd.length >= 8 &&\n    /[A-Z]/.test(pwd) &&\n    /[0-9]/.test(pwd) &&\n    /[!@#$%^&*]/.test(pwd);\n}\n\n// Filter HTML tags\nconst text = '<p>Hello</p> <div>World</div>';\ntext.includes('<') && text.includes('>'); // true\n\n// Detect file types\nconst file = 'image.png';\nconst imageExtensions = ['.png', '.jpg', '.gif'];\nconst isImage = imageExtensions.some(ext => file.includes(ext));\n\n// Simple URL parameter check\nconst url = 'https://example.com?id=123&name=test';\nurl.includes('?'); // has query parameters\nurl.includes('id='); // has id parameter` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'includes-mistakes.js', code: `// ❌ Forgetting case-sensitivity\nconst email = 'User@Example.com';\nemail.includes('@'); // true — good\nemail.includes('example'); // false — capital E!\n// ✅ Fix: use toLowerCase()\nemail.toLowerCase().includes('example'); // true\n\n// ❌ Using with null/undefined\nconst value = null;\nvalue.includes('test'); // TypeError: Cannot read property 'includes' of null\n// ✅ Fix: check first\nif (value && value.includes('test')) { }\n\n// ❌ Assuming position parameter works like endsWith\nconst text = 'Hello World';\ntext.includes('World', 6); // true (searches FROM position 6)\ntext.includes('World', 7); // false (position is past the match)\n\n// ❌ Using includes on non-strings\nconst num = 12345;\nnum.includes(3); // TypeError\n// ✅ Convert to string first\nString(num).includes('3'); // true\nnum.toString().includes('3'); // true` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'includes() is fast for most strings. For very large strings or frequent searches, consider caching results. For complex pattern matching, use regex.' },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Empty string is always included: "text".includes("") → true',
      'Returns false if given null or undefined (with type coercion)',
      'Position parameter defaults to 0',
      'Position is 0-indexed',
      'If position is negative, it\'s treated as 0',
      'Whitespace matters: " " is different from ""',
    ]},
    { type: 'code', language: 'javascript', filename: 'includes-edge.js', code: `// Empty string always matches\n’hello'.includes(''); // true\n\n// Whitespace matters\n’hello world'.includes('o w'); // true\n’hello world'.includes('ow');  // false\n’hello world'.includes('o  w'); // false\n\n// Negative position treated as 0\n’hello'.includes('h', -1); // true (searches from 0)\n’hello'.includes('h', -100); // true (searches from 0)` },
  ],
};
