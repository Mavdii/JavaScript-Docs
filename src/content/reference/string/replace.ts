import type { ReferenceContent } from '@/types/content';
export const stringReplaceReference: ReferenceContent = {
  id: 'string-replace', title: 'String replace() / replaceAll()', description: 'Replace parts of a string with new text.', slug: 'reference/string/replace', pillar: 'reference', category: 'string', tags: ['string','replace','replaceall','substitute','regex'], difficulty: 'beginner', contentType: 'reference', summary: 'replace() replaces the first match. replaceAll() replaces all matches. Both return a new string (immutable). Use regex with /g for multiple replacements.', relatedTopics: ['string-match','string-split'], order: 3,
  signature: 'string.replace(pattern, replacement) / string.replaceAll(pattern, replacement)',
  parameters: [{ name: 'pattern', type: 'string | RegExp', description: 'String or regex pattern to search for.' }, { name: 'replacement', type: 'string | function', description: 'Replacement text or function returning replacement.' }],
  returnValue: { type: 'string', description: 'New string with replacements made.' },
  compatibility: 'ES3+ (replaceAll: ES2021)',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'replace() swaps out text in a string. By default it only replaces the first match. Use /g flag with regex to replace all, or use replaceAll() which is cleaner. Strings are immutable, so it returns a brand new string.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'replace-basic.js', code: `const text = 'Hello World World';\n\n// Replace first occurrence only\ntext.replace('World', 'Universe');\n// 'Hello Universe World'\n\n// Replace with regex + /g flag (all occurrences)\ntext.replace(/World/g, 'Universe');\n// 'Hello Universe Universe'\n\n// Using replaceAll() (cleaner)\ntext.replaceAll('World', 'Universe');\n// 'Hello Universe Universe'\n\n// Original is unchanged\nconsole.log(text); // 'Hello World World'` },

    { type: 'heading', level: 2, text: 'Case-Insensitive Replace', id: 'case-insensitive' },
    { type: 'code', language: 'javascript', filename: 'replace-case.js', code: `const text = 'JavaScript is great. Python is cool. JAVASCRIPT rocks.';\n\n// Case-sensitive (only exact match)\ntext.replace('javascript', 'TypeScript');\n// 'JavaScript is great. Python is cool. JAVASCRIPT rocks.' (no change!)\n\n// Case-insensitive with /i flag\ntext.replace(/javascript/i, 'TypeScript');\n// 'TypeScript is great. Python is cool. JAVASCRIPT rocks.' (first only)\n\n// Case-insensitive, all occurrences\ntext.replace(/javascript/gi, 'TypeScript');\n// 'TypeScript is great. Python is cool. TypeScript rocks.'` },

    { type: 'heading', level: 2, text: 'Function Replacement', id: 'function-replacement' },
    { type: 'paragraph', text: 'Instead of a plain string, you can pass a function that computes the replacement. This is powerful for conditional replacements.' },
    { type: 'code', language: 'javascript', filename: 'replace-function.js', code: `const text = 'apple banana apple';\n\n// Function gets (match, ...groups, index, string)\nconst result = text.replace(/apple/g, (match, index, str) => {\n  return match.toUpperCase();\n});\n// 'APPLE banana APPLE'\n\n// With capture groups\nconst date = '2024-03-15';\nconst formatted = date.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, (match, year, month, day) => {\n  return month + '/' + day + '/' + year;\n});\n// '03/15/2024'\n\n// Conditional replacement\nconst text2 = 'price: $10 and $200';\nconst result2 = text2.replace(/\\$(\\d+)/g, (match, amount) => {\n  const price = parseInt(amount);\n  return price > 100 ? '**expensive**' : match;\n});\n// 'price: $10 and **expensive**'` },

    { type: 'heading', level: 2, text: 'Special Replacement Patterns', id: 'special-patterns' },
    { type: 'code', language: 'javascript', filename: 'replace-patterns.js', code: `const text = 'John Smith';\nconst regex = /(\\w+)\\s+(\\w+)/;\n\n// $1, $2 refer to capture groups\ntext.replace(regex, '$2, $1');\n// 'Smith, John'\n\n// Special patterns:\n// $& = the matched string\n// $\\\` = text before match\n// $' = text after match\ntext.replace(regex, '[$&]'); // '[John Smith]'\n\n// Example: adding brackets around matches\nconst text2 = 'apple and banana';\ntext2.replace(/\\b\\w{5,}\\b/g, '[$&]');\n// '[apple] and [banana]'` },

    { type: 'heading', level: 2, text: 'Practical Examples', id: 'practical' },
    { type: 'code', language: 'javascript', filename: 'replace-practical.js', code: `// Template string replacement\nconst template = 'Hello {name}, welcome to {place}!';\nconst result = template\n  .replace('{name}', 'Alice')\n  .replace('{place}', 'our site');\n// 'Hello Alice, welcome to our site!'\n\n// Or with a function\nconst data = { name: 'Alice', place: 'our site' };\nconst result2 = template.replace(/{(\\w+)}/g, (match, key) => data[key]);\n// 'Hello Alice, welcome to our site!'\n\n// Escape HTML special characters\nfunction escapeHtml(text) {\n  const map = {\n    '&': '&amp;',\n    '<': '&lt;',\n    '>': '&gt;',\n    '\"': '&quot;',\n    \"'\": '&#39;'\n  };\n  return text.replace(/[&<>\"']/g, m => map[m]);\n}\n\n// Remove trailing spaces\nconst text3 = 'hello  ';\ntext3.replace(/\\s+$/, ''); // 'hello'\n\n// Convert snake_case to camelCase\nconst snake = 'hello_world_test';\nconst camel = snake.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());\n// 'helloWorldTest'` },

    { type: 'heading', level: 2, text: 'replace() vs replaceAll()', id: 'vs-replaceall' },
    { type: 'table', headers: ['Method', 'First/All', 'Strings', 'Performance'], rows: [
      ['replace(str, ...)', 'First only', 'Yes', 'Fast'],
      ['replace(regex, ...)', 'First (or /g for all)', 'Yes', 'Fast'],
      ['replaceAll(str, ...)', 'All', 'Yes', 'Good'],
      ['replaceAll(regex, ...)', 'All (requires /g)', 'Yes', 'Good'],
    ]},

    { type: 'heading', level: 2, text: 'Common Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'replace-patterns-common.js', code: `// Trim all whitespace\nconst text = '  hello  world  ';\ntext.replace(/\\s+/g, ' ').trim();\n// 'hello world'\n\n// Remove all non-alphanumeric\nconst messy = 'h3ll0-w0rld!';\nmessy.replace(/[^a-zA-Z0-9]/g, '');\n// 'h3ll0w0rld'\n\n// Format phone number\nconst phone = '5551234567';\nphone.replace(/(\\d{3})(\\d{3})(\\d{4})/, '($1) $2-$3');\n// '(555) 123-4567'\n\n// Abbreviate text\nconst text2 = 'Hello World';\ntext2.replace(/\\b(\\w)/g, '$1.');\n// 'H.W. W.'` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'replace-mistakes.js', code: `// â Forgetting strings only replace first match\nconst text = 'apple apple apple';\ntext.replace('apple', 'orange'); // 'orange apple apple'\n// â Use replaceAll() for all\ntext.replaceAll('apple', 'orange'); // 'orange orange orange'\n\n// â Forgetting /g flag with regex\ntext.replace(/apple/, 'orange'); // 'orange apple apple'\n// â Use /g for all matches\ntext.replace(/apple/g, 'orange'); // 'orange orange orange'\n\n// â Not escaping special characters in string pattern\nconst price = '$10';\nprice.replace('$', 'â¬'); // Works (strings don’t need escaping)\n// But with regex:\nprice.replace('$', 'â¬'); // '$10' ($ is special in regex!)\n// â Escape with regex\nprice.replace(/\\$/, 'â¬'); // 'â¬10'\n\n// â Expecting original to be modified\nconst str = 'hello';\nstr.replace('hello', 'hi'); // Returns new string\nconsole.log(str); // 'hello' (unchanged!)\n// â Capture the result\nconst newStr = str.replace('hello', 'hi');` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'replace() and replaceAll() are fast. For multiple sequential replacements, consider a single regex or a function. Creating many intermediate strings can be inefficient.' },
    { type: 'code', language: 'javascript', filename: 'replace-perf.js', code: `const text = 'aaa bbb ccc';\n\n// ❌ Multiple chains create intermediate strings\ntext.replace(/a/g, 'x')\n    .replace(/b/g, 'y')\n    .replace(/c/g, 'z');\n\n// ✅ One pass with function\nconst map = { a: 'x', b: 'y', c: 'z' };\ntext.replace(/[abc]/g, m => map[m]);\n\n// ✅ Or one regex that matches all\nconst regex = /a|b|c/;\ntext.replace(regex, m => ({ a: 'x', b: 'y', c: 'z' }[m]));` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'replaceAll() with string throws if pattern contains special regex chars (use regex instead)',
      'Empty search string matches before every character',
      'Function parameter receives (match, group1, group2, ..., offset, string)',
      'Strings are case-sensitive; regex needs /i flag for case-insensitive',
      'Returns original string if no matches found',
    ]},
  ],
};
