import type { ReferenceContent } from '@/types/content';
export const stringTrimReference: ReferenceContent = {
  id: 'string-trim', title: 'String trim() / trimStart() / trimEnd()', description: 'Remove whitespace from the beginning and end of a string.', slug: 'reference/string/trim', pillar: 'reference', category: 'string', tags: ['string','trim','whitespace','trimstart','trimend'], difficulty: 'beginner', contentType: 'reference', summary: 'trim() removes whitespace from both ends. trimStart() removes from the beginning, trimEnd() from the end. Whitespace includes spaces, tabs, newlines.', relatedTopics: ['string-replace','string-split'], order: 5,
  signature: 'string.trim() / string.trimStart() / string.trimEnd()',
  parameters: [],
  returnValue: { type: 'string', description: 'New string with whitespace removed.' },
  compatibility: 'trim: ES5+. trimStart/trimEnd: ES2019+',
  sections: [
    { type: 'heading', level: 2, text: 'Description', id: 'description' },
    { type: 'paragraph', text: 'trim() cleans up the edges of a string by removing all whitespace (spaces, tabs, newlines, etc.) from both ends. trimStart() and trimEnd() do the same thing but only on one side. The original string is unchanged — you get a new string back.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic' },
    { type: 'code', language: 'javascript', filename: 'trim-basic.js', code: `const text = '  hello world  ';\n\ntext.trim();\n// 'hello world'\n\ntext.trimStart();\n// 'hello world  ' (only removes from start)\n\ntext.trimEnd();\n// '  hello world' (only removes from end)\n\nconsole.log(text);\n// '  hello world  ' (original unchanged)` },

    { type: 'heading', level: 2, text: 'Types of Whitespace Removed', id: 'whitespace-types' },
    { type: 'code', language: 'javascript', filename: 'trim-whitespace.js', code: `// Regular spaces\n'  hello  '.trim(); // 'hello'\n\n// Tabs\n'\\thello\\t'.trim(); // 'hello'\n\n// Newlines\n'\\nhello\\n'.trim(); // 'hello'\n\n// Mixed whitespace\n'  \\t\\nhello\\n\\t  '.trim(); // 'hello'\n\n// Interior whitespace is preserved\n'  hello  world  '.trim(); // 'hello  world'\n\n// Non-breaking space (U+00A0)\n'\\u00A0hello\\u00A0'.trim(); // 'hello'` },

    { type: 'heading', level: 2, text: 'Form Input Validation', id: 'form-validation' },
    { type: 'code', language: 'javascript', filename: 'trim-form.js', code: `// Clean user input\nfunction validateEmail(input) {\n  const email = input.trim();\n  return email.includes('@') && email.length > 0;\n}\n\nvalidateEmail('  user@example.com  '); // true\nvalidateEmail('   '); // false\n\n// Check if field is really filled\nfunction isFieldFilled(input) {\n  return input.trim().length > 0;\n}\n\nisFieldFilled('  hello  '); // true\nisFieldFilled('  '); // false (just whitespace)\n\n// Common pattern: trim and check\nconst name = userInput.trim();\nif (!name) {\n  console.log('Name is required');\n}` },

    { type: 'heading', level: 2, text: 'Parsing Data', id: 'parsing' },
    { type: 'code', language: 'javascript', filename: 'trim-parsing.js', code: `// CSV with spaces\nconst csv = 'name , age , city\\nAlice , 30 , NYC';\nconst rows = csv.split('\\n').map(row =>\n  row.split(',').map(col => col.trim())\n);\n// [['name', 'age', 'city'], ['Alice', '30', 'NYC']]\n\n// Parse config file\nconst config = \`\n  port: 3000\n  host: localhost\n  debug: true\n\`;\nconst lines = config.trim().split('\\n').map(line => line.trim());\n// ['port: 3000', 'host: localhost', 'debug: true']\n\n// Filter out empty lines\nconst lines2 = text.split('\\n').map(line => line.trim()).filter(Boolean);\n// ['port: 3000', 'host: localhost', 'debug: true']` },

    { type: 'heading', level: 2, text: 'trimStart() vs trimEnd()', id: 'comparison' },
    { type: 'code', language: 'javascript', filename: 'trim-sides.js', code: `const text = '  hello world  ';\n\n// Remove from both ends\ntext.trim();\n// 'hello world'\n\n// Remove from start only\ntext.trimStart();\n// 'hello world  '\n\n// Remove from end only\ntext.trimEnd();\n// '  hello world'\n\n// Legacy names (still work)\ntext.trimLeft(); // Same as trimStart\ntext.trimRight(); // Same as trimEnd` },

    { type: 'heading', level: 2, text: 'Real-World Patterns', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'trim-patterns.js', code: `// Clean multi-line template strings\nconst message = \`\n  Hello there!\n  This is a message.\n  Thanks!\n\`.trim();\n// 'Hello there!\\n  This is a message.\\n  Thanks!'\n\n// Remove surrounding newlines from code blocks\nconst code = \`\n  function hello() {\n    console.log('hi');\n  }\n\`.trim();\n\n// Normalize user input from textarea\nconst userComment = textareaElement.value.trim();\nif (userComment) {\n  saveComment(userComment);\n}\n\n// Clean filename\nconst filename = userInput.trim().toLowerCase().replace(/\\s+/g, '-');\n// Converts: '  My Document  ' → 'my-document'\n\n// Extract tag from text\nconst tag = '#hashtag '.trim(); // '#hashtag'\nconst justTheTag = tag.slice(1); // 'hashtag'` },

    { type: 'heading', level: 2, text: 'trim() vs replace()', id: 'vs-replace' },
    { type: 'code', language: 'javascript', filename: 'trim-vs-replace.js', code: `const text = '  hello world  ';\n\n// trim is simpler for whitespace on edges\ntext.trim(); // 'hello world'\n\n// replace is more flexible\ntext.replace(/^\\s+|\\s+$/g, ''); // Same result\n\n// Replace specific character\nconst text2 = '...hello...';\ntext2.replace(/^\\.+|\\.+$/g, ''); // 'hello'\n\n// trim only removes whitespace (spaces, tabs, newlines)\ntext.trim(); // 'hello world'\n\n// replace can target specific patterns\ntext.replace(/^ +| +$/g, ''); // Remove only spaces, not tabs` },

    { type: 'heading', level: 2, text: 'Performance', id: 'performance' },
    { type: 'paragraph', text: 'trim() is optimized and very fast. For typical use cases (form validation, data cleaning), performance isn\'t a concern. Using trim() is cleaner and more readable than regex alternatives.' },
    { type: 'code', language: 'javascript', filename: 'trim-perf.js', code: `// All equivalent, trim() is clearest\ntext.trim();\ntext.replace(/^\\s+|\\s+$/g, ''); // Regex alternative\ntext.replace(/^\\s+/, '').replace(/\\s+$/, ''); // Two passes\n\n// For simple whitespace trimming, use trim()\n// For custom trimming, use replace/regex` },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    { type: 'code', language: 'javascript', filename: 'trim-mistakes.js', code: `// â Assuming trim removes interior whitespace\nconst text = 'hello   world';\ntext.trim(); // 'hello   world' (interior spaces kept!)\n// â Use replace to collapse interior spaces\ntext.replace(/\\s+/g, ' '); // 'hello world'\n\n// â Forgetting trim doesn’t mutate\nconst userInput = '  text  ';\nuserInput.trim(); // Returns new string\nconsole.log(userInput); // '  text  ' (unchanged!)\n// â Assign the result\nconst cleaned = userInput.trim();\n\n// â Not trimming before validation\nfunction validate(input) {\n  return input.length > 0; // Returns true for '   '!\n}\n// â Trim first\nfunction validate(input) {\n  return input.trim().length > 0;\n}\n\n// â Trimming array of strings incorrectly\nconst items = ['  a  ', '  b  ', '  c  '];\nitems.trim(); // TypeError: items.trim is not a function\n// â Map to trim each item\nconst trimmed = items.map(item => item.trim());` },

    { type: 'heading', level: 2, text: 'Chaining with Other Methods', id: 'chaining' },
    { type: 'code', language: 'javascript', filename: 'trim-chaining.js', code: `// Trim then lowercase then check\nconst email = '  USER@EXAMPLE.COM  ';\nemail.trim().toLowerCase().includes('@'); // true\n\n// Trim then split\nconst csv = '  apple, banana, cherry  ';\ncsv.trim().split(',').map(x => x.trim());\n// ['apple', 'banana', 'cherry']\n\n// Multi-step cleaning\nconst text = '  Hello  World  ';\ntext\n  .trim()\n  .toLowerCase()\n  .replace(/\\s+/g, '-');\n// 'hello-world'` },

    { type: 'heading', level: 2, text: 'Edge Cases', id: 'edge-cases' },
    { type: 'list', items: [
      'Empty string returns empty string: "".trim() → ""',
      'String with only whitespace returns empty: "   ".trim() → ""',
      'Interior spaces/newlines are preserved',
      'Tabs, newlines, and spaces are all considered whitespace',
      'Non-breaking space (U+00A0) is trimmed',
      'Zero-width spaces are NOT trimmed',
      'Original string is never modified',
    ]},
    { type: 'code', language: 'javascript', filename: 'trim-edge.js', code: `// Only whitespace\n'   '.trim(); // ''\n\n// Mixed whitespace types\n' \\t\\n '.trim(); // ''\n\n// Interior preserved\n’a  b'.trim(); // 'a  b'\n\n// Zero-width space NOT trimmed\n’hello\\u200Bworld'.trim(); // Still contains zero-width space\n\n// Very long whitespace\n'   '.repeat(10000).trim(); // Still works efficiently` },
  ],
};
