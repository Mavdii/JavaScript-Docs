import type { ReferenceContent } from '@/types/content';
export const stringMatchReference: ReferenceContent = {
  id: 'string-match', title: 'String match()', description: 'Search a string using a regex pattern and return matches.', slug: 'reference/string/match', pillar: 'reference', category: 'string', tags: ['string','match','regex','pattern','search'], difficulty: 'intermediate', contentType: 'reference', summary: 'match() executes a regex against a string and returns an array of matches, or null if none found. Use /g flag for all matches.', relatedTopics: ['string-replace','string-includes','string-split'], order: 2,
  signature: 'string.match(regexp)',
  parameters: [{ name: 'regexp', type: 'string | RegExp', description: 'A regex pattern or string to search for.' }],
  returnValue: { type: 'string[] | null', description: 'Array of matches or null if no matches found.' },
  compatibility: 'ES3+ (matchAll: ES2020)',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'match() searches a string using regex and gives you back an array of all the matches. No matches? It returns null. Use the /g flag to find all matches instead of just the first one.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'match-basic.js', code: `const text = 'The price is $19.99 and $25.50';\n\n// Without /g — just the first match with full details\nconst first = text.match(/\\$\\d+\\.\\d+/);\n// ['$19.99', index: 13, input: '...', groups: undefined]\n\n// With /g — all matches\nconst all = text.match(/\\$\\d+\\.\\d+/g);\n// ['$19.99', '$25.50']\n\n// No matches\nconst none = text.match(/xyz/);\n// null` },

    { type: 'heading', level: 2, text: 'With and Without /g Flag', id: 'g-flag' },
    { type: 'code', language: 'javascript', filename: 'match-g-flag.js', code: `const text = 'cat dog cat bird cat';\n\n// Without /g: first match only, with details\nconst first = text.match(/cat/);\n// [\n//   'cat',\n//   index: 0,\n//   input: 'cat dog cat bird cat',\n//   groups: undefined\n// ]\n\n// With /g: all matches, just the strings\nconst all = text.match(/cat/g);\n// ['cat', 'cat', 'cat']\n\n// Capture groups work differently with /g\nconst withGroups = text.match(/(c)(a)(t)/);  // Groups in first match\nconst allNoGroups = text.match(/(c)(a)(t)/g); // Just the matches, no groups` },

    { type: 'heading', level: 2, text: 'Extracting Data', id: 'extracting' },
    { type: 'code', language: 'javascript', filename: 'match-extract.js', code: `const email = 'Contact: john.doe@example.com for more info';\n\n// Extract email\nconst emailMatch = email.match(/[\\w\\.-]+@[\\w\\.-]+\\.\\w+/);\nif (emailMatch) {\n  console.log(emailMatch[0]); // 'john.doe@example.com'\n}\n\n// Extract all numbers from text\nconst text = 'Order #12345 placed on 2024-03-15';\nconst numbers = text.match(/\\d+/g);\n// ['12345', '2024', '03', '15']\n\n// Extract words\nconst sentence = 'Hello, World! How are you?';\nconst words = sentence.match(/\\b\\w+\\b/g);\n// ['Hello', 'World', 'How', 'are', 'you']` },

    { type: 'heading', level: 2, text: 'With Capture Groups', id: 'capture-groups' },
    { type: 'code', language: 'javascript', filename: 'match-groups.js', code: `const date = '2024-03-15';\n\n// Capture groups (without /g)\nconst parts = date.match(/(\\d{4})-(\\d{2})-(\\d{2})/);\nif (parts) {\n  parts[0]; // '2024-03-15' — full match\n  parts[1]; // '2024' — group 1\n  parts[2]; // '03' — group 2\n  parts[3]; // '15' — group 3\n}\n\n// Named groups\nconst nameRegex = /(\\w+)\\s+(\\w+)/;\nconst nameMatch = 'John Doe'.match(nameRegex);\nif (nameMatch) {\n  nameMatch[1]; // 'John'\n  nameMatch[2]; // 'Doe'\n}\n\n// With /g, groups are lost\nconst allMatches = date.match(/(\\d+)/g);\n// ['2024', '03', '15'] — no full match info` },

    { type: 'heading', level: 2, text: 'Case-Insensitive Search', id: 'case-insensitive' },
    { type: 'code', language: 'javascript', filename: 'match-case.js', code: `const text = 'JavaScript is great. python is cool.';\n\n// Case-sensitive\ntext.match(/java/g); // null\n\n// Case-insensitive with /i flag\ntext.match(/java/i); // ['Java'] — first only\ntext.match(/java/gi); // ['Java'] — hmm, wait\n\n// Actually get both with /gi\ntext.match(/java/gi);  // null (no match for 'java')\ntext.match(/script/gi); // ['Script']\ntext.match(/is/gi); // ['is', 'is']` },

    { type: 'heading', level: 2, text: 'String vs Regex Parameter', id: 'string-vs-regex' },
    { type: 'code', language: 'javascript', filename: 'match-string-param.js', code: `const text = 'The price is $19.99';\n\n// String parameter (converted to regex)\ntext.match('price'); // ['price'] â exact match\n\n// Regex parameter (more powerful)\ntext.match(/\\$\\d+\\.\\d+/); // ['$19.99']\n\n// String is converted to literal regex, so special chars don’t work\ntext.match('$19.99'); // null ($ is literal, not end-of-line)\ntext.match(/\\$19\\.99/); // ['$19.99'] ($ and . are escaped)` },

    { type: 'heading', level: 2, text: 'Practical Examples', id: 'practical' },
    { type: 'code', language: 'javascript', filename: 'match-practical.js', code: `// Extract URLs\nconst text = 'Visit https://example.com or http://test.org for details';\nconst urls = text.match(/https?:\\/\\/\\S+/g);\n// ['https://example.com', 'http://test.org']\n\n// Find repeated words\nconst sentence = 'The the quick brown fox fox';\nconst repeated = sentence.match(/(\\b\\w+\\b)\\s+\\1/g);\n// ['The the', 'fox fox']\n\n// Extract hashtags\nconst tweet = 'Great day! #JavaScript #coding #webdev';\nconst tags = tweet.match(/#\\w+/g);\n// ['#JavaScript', '#coding', '#webdev']\n\n// Validate phone number format\nconst phone = '(555) 123-4567';\nconst phoneMatch = phone.match(/\\((\\d{3})\\)\\s?(\\d{3})-(\\d{4})/);\nif (phoneMatch) {\n  const [full, area, exchange, line] = phoneMatch;\n  console.log(\\\`Area: \\\${area}, Exchange: \\\${exchange}, Line: \\\${line}\\\`);\n}` },

    { type: 'heading', level: 2, text: 'match() vs exec() vs test()', id: 'vs-other-methods' },
    { type: 'table', headers: ['Method', 'Returns', 'Stateful', 'Use when'], rows: [
      ['match()', 'Array or null', 'No', 'You want all matches as an array'],
      ['exec()', 'Array or null', 'Yes (with /g)', 'You need match info with positions'],
      ['test()', 'Boolean', 'Yes (with /g)', 'Just checking if pattern exists'],
      ['matchAll()', 'Iterator', 'No', 'You need all matches with capture groups'],
    ]},

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'match-mistakes.js', code: `// ❌ Forgetting to handle null\nconst text = 'hello world';\nconst matches = text.match(/xyz/);\nmatches.length; // TypeError: Cannot read property 'length' of null\n// ✅ Check for null first\nif (matches) {\n  console.log(matches.length);\n}\n\n// ❌ Expecting capture groups with /g\nconst text2 = 'apple banana apple';\nconst groups = text2.match(/(app)(le)/g);\n// ['apple', 'apple'] — groups lost!\n// ✅ Use matchAll or exec() for groups with /g\nfor (const match of text2.matchAll(/(app)(le)/g)) {\n  console.log(match[1], match[2]); // 'app', 'le'\n}\n\n// ❌ Forgetting to escape regex special characters\nconst price = '$19.99';\nprice.match('$19.99'); // null ($ is special in regex)\n// ✅ Escape special characters\nprice.match(/\\$19\\.99/); // ['$19.99']\n\n// ❌ Using string literals when you need regex features\nconst text3 = 'test123';\ntext3.match('\\\\d'); // Looks for literal backslash-d\n// ✅ Use regex\ntext3.match(/\\d/); // ['1']` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Empty pattern matches everything: "test".match(//) → [""]',
      'Returns null (not empty array) when no matches found',
      'Special characters in string parameter aren\'t escaped',
      'Global flag changes return format completely',
      'Capture groups are lost with /g flag',
      'Anchors (^ and $) only match start/end of string by default',
    ]},
  ],
};
