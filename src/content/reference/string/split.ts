import type { ReferenceContent } from '@/types/content';
export const stringSplitReference: ReferenceContent = {
  id: 'string-split', title: 'String split()', description: 'Split a string into an array of substrings.', slug: 'reference/string/split', pillar: 'reference', category: 'string', tags: ['string','split','array','delimeter','separator'], difficulty: 'beginner', contentType: 'reference', summary: 'split() cuts a string into pieces using a separator and returns an array. It\'s the opposite of array.join().', relatedTopics: ['string-replace','string-match','string-includes'], order: 4,
  signature: 'string.split(separator, limit?)',
  parameters: [{ name: 'separator', type: 'string | RegExp', description: 'Pattern to split on. If undefined, returns array with whole string.' }, { name: 'limit', type: 'number', description: 'Maximum number of array elements to return.', optional: true }],
  returnValue: { type: 'string[]', description: 'Array of substrings.' },
  compatibility: 'ES3+ — All browsers',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'split() chops up a string into pieces based on a separator you give it and hands back an array. It\'s the opposite of array.join(). The separator isn\'t included in the results, except when using regex capture groups.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'split-basic.js', code: `const text = 'apple,banana,cherry';\n\n// Split by comma\ntext.split(',');\n// ['apple', 'banana', 'cherry']\n\n// Split by space\n’hello world test'.split(' ');\n// ['hello', 'world', 'test']\n\n// Split by dash\n'2024-03-15'.split('-');\n// ['2024', '03', '15']\n\n// Empty separator splits every character\n’hello'.split('');\n// ['h', 'e', 'l', 'l', 'o']\n\n// Undefined separator returns array with whole string\n’hello world'.split();\n// ['hello world']` },

    { type: 'heading', level: 2, text: 'Common Separators', id: 'common-separators' },
    { type: 'code', language: 'javascript', filename: 'split-separators.js', code: `const csv = 'name,age,city\\nAlice,30,NYC\\nBob,25,LA';\n\n// Split lines\ncsv.split('\\n');\n// ['name,age,city', 'Alice,30,NYC', 'Bob,25,LA']\n\n// Split on multiple line endings\nconst text = 'line1\\r\\nline2\\nline3';\ntext.split(/\\r?\\n/);\n// ['line1', 'line2', 'line3']\n\n// Split on whitespace (any amount)\n’hello   world  test'.split(/\\s+/);\n// ['hello', 'world', 'test']\n\n// Split on special characters\nconst path = 'home/user/documents';\npath.split('/');\n// ['home', 'user', 'documents']` },

    { type: 'heading', level: 2, text: 'Limit Parameter', id: 'limit' },
    { type: 'code', language: 'javascript', filename: 'split-limit.js', code: `const text = 'a,b,c,d,e';\n\n// All splits\ntext.split(',');\n// ['a', 'b', 'c', 'd', 'e']\n\n// Limit to 3 elements\ntext.split(',', 3);\n// ['a', 'b', 'c']\n\n// Limit to 1 element\ntext.split(',', 1);\n// ['a']\n\n// Limit of 0 returns empty array\ntext.split(',', 0);\n// []` },

    { type: 'heading', level: 2, text: 'Regex Split', id: 'regex' },
    { type: 'code', language: 'javascript', filename: 'split-regex.js', code: `// Split on digit\n’a1b2c3d'.split(/\\d/);\n// ['a', 'b', 'c', 'd']\n\n// Split on non-alphanumeric\n’hello-world_test123'.split(/[^a-zA-Z0-9]+/);\n// ['hello', 'world', 'test123']\n\n// Split with capture groups (includes groups in result)\nconst text = 'apple (100) banana (200) cherry';\ntext.split(/(\\(\\d+\\))/);\n// ['apple ', '(100)', ' banana ', '(200)', ' cherry']\n\n// Case-insensitive split\n’appleAPPLEapple'.split(/apple/i);\n// ['', '', '', '']` },

    { type: 'heading', level: 2, text: 'Parsing CSV and Data', id: 'parsing' },
    { type: 'code', language: 'javascript', filename: 'split-parsing.js', code: `// Simple CSV parsing\nconst csv = 'name,age,city\\nAlice,30,NYC\\nBob,25,LA';\nconst lines = csv.split('\\n');\nconst rows = lines.map(line => line.split(','));\n// [['name', 'age', 'city'], ['Alice', '30', 'NYC'], ['Bob', '25', 'LA']]\n\n// Parse query string\nconst query = 'name=alice&age=30&city=NYC';\nconst params = {};\nquery.split('&').forEach(pair => {\n  const [key, value] = pair.split('=');\n  params[key] = decodeURIComponent(value);\n});\n// { name: 'alice', age: '30', city: 'NYC' }\n\n// Or use URLSearchParams (better)\nconst params2 = Object.fromEntries(new URLSearchParams(query));\n\n// Parse file path\nconst filepath = '/home/user/documents/file.txt';\nconst parts = filepath.split('/');\nconst filename = parts[parts.length - 1]; // 'file.txt'\nconst dirname = parts.slice(0, -1).join('/'); // '/home/user/documents'` },

    { type: 'heading', level: 2, text: 'split() vs match()', id: 'vs-match' },
    { type: 'table', headers: ['Method', 'Returns', 'Purpose', 'Use when'], rows: [
      ['split()', 'Array of parts', 'Break into pieces', 'You have a known separator'],
      ['match()', 'Array of matches', 'Extract patterns', 'You\'re finding specific patterns'],
      ['split(\'\')', 'Character array', 'Get characters', 'You need every character'],
    ]},

    { type: 'heading', level: 2, text: 'split() vs join()', id: 'vs-join' },
    { type: 'code', language: 'javascript', filename: 'split-vs-join.js', code: `// split breaks apart\nconst text = 'apple,banana,cherry';\nconst arr = text.split(',');\n// ['apple', 'banana', 'cherry']\n\n// join puts back together\nconst back = arr.join(',');\n// 'apple,banana,cherry'\n\n// They’re inverse operations\n’a-b-c'.split('-').join('_'); // 'a_b_c'\n\n// Common pattern: split, transform, join\nconst sentence = 'hello world';\nsentence\n  .split(' ')\n  .map(word => word.toUpperCase())\n  .join(' ');\n// 'HELLO WORLD'` },

    { type: 'heading', level: 2, text: 'Practical Examples', id: 'practical' },
    { type: 'code', language: 'javascript', filename: 'split-practical.js', code: `// Extract file extension\nfunction getExtension(filename) {\n  const parts = filename.split('.');\n  return parts[parts.length - 1];\n}\ngetExtension('document.pdf'); // 'pdf'\n\n// Capitalize words\nfunction capitalize(text) {\n  return text\n    .split(' ')\n    .map(word => word.charAt(0).toUpperCase() + word.slice(1))\n    .join(' ');\n}\ncapitalize('hello world'); // 'Hello World'\n\n// Convert array to sentence\nfunction arrayToSentence(arr) {\n  if (arr.length === 0) return '';\n  if (arr.length === 1) return arr[0];\n  return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];\n}\narraySentence(['apple', 'banana', 'cherry']);\n// 'apple, banana and cherry'\n\n// Split and filter\nconst text = 'apple,,banana,, cherry';\ntext.split(',').filter(x => x.trim()); // Remove empty entries\n// ['apple', 'banana', 'cherry']` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'split-mistakes.js', code: `// ❌ Forgetting separator
nconst text = 'a,b,c';\ntext.split(); // ['a,b,c'] (whole string, not split!)\n// ✅ Provide separator\ntext.split(','); // ['a', 'b', 'c']\n\n// ❌ Forgetting result is array\nconst csv = 'alice,30,nyc';\nconst age = csv.split(',')[1]; // '30' (string, not number!)\nconst ageNum = parseInt(csv.split(',')[1]); // 30 (number)\n\n// ❌ Empty string separator splits characters (unexpected)\nconst text2 = 'hello';\ntext2.split(''); // ['h', 'e', 'l', 'l', 'o']\n// ✅ If you meant to split by space:\ntext2.split(' '); // ['hello']\n\n// ❌ Assuming order with limit\nconst text3 = 'a-b-c-d';\ntext3.split('-', 2); // ['a', 'b'] (first 2, not last 2)\n\n// ❌ Forgetting split returns new array\nconst str = 'a,b,c';\nstr.split(','); // Returns new array, original unchanged\nconst arr = str.split(','); // Need to capture result` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Empty separator splits into individual characters',
      'Undefined separator returns array with whole string',
      'Trailing/leading separators create empty strings in result',
      'Consecutive separators create empty strings',
      'Regex with capture groups includes the groups in result',
      'Empty string splits to [""]',
      'Limit of 0 returns empty array',
    ]},
    { type: 'code', language: 'javascript', filename: 'split-edge.js', code: `// Trailing separator creates empty string\n’a,b,c,'.split(',');\n// ['a', 'b', 'c', '']\n\n// Consecutive separators create empty strings\n’a,,b'.split(',');\n// ['a', '', 'b']\n\n// Empty string\n''.split(',');\n// ['']\n\n// Regex capture groups included\n’a1b2c'.split(/(\\d)/);  \n// ['a', '1', 'b', '2', 'c']` },
  ],
};
