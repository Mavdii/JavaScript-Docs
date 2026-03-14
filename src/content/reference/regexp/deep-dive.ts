import type { ReferenceContent } from '@/types/content';

export const regexpDeepDiveReference: ReferenceContent = {
  id: 'reference-regexp-deep-dive',
  title: 'RegExp Deep Dive',
  description: 'Master regular expressions for pattern matching, validation, and text manipulation.',
  slug: 'reference/regexp/deep-dive',
  pillar: 'reference',
  category: 'regexp',
  tags: ['regex', 'pattern', 'validation', 'matching', 'parsing'],
  difficulty: 'intermediate',
  contentType: 'reference',
  summary: 'Regular expressions are powerful tools for pattern matching and text processing. Learn the syntax, flags, methods, and practical patterns.',
  relatedTopics: ['string-methods', 'string-replace'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 15,
  featured: false,
  keywords: ['regex', 'regexp', 'pattern', 'matching', 'validation', 'flags'],
  signature: '/pattern/flags or new RegExp(pattern, flags)',
  parameters: [
    { name: 'pattern', type: 'string', description: 'The pattern to match.' },
    { name: 'flags', type: 'string', description: 'Optional flags: g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode), y (sticky), d (indices).' }
  ],
  returnValue: { type: 'RegExp', description: 'A regular expression object.' },
  compatibility: 'All browsers — RegExp is built-in',
  sections: [
    { type: 'heading', level: 2, text: 'Creating Regular Expressions', id: 'creating' },
    { type: 'paragraph', text: 'Regular expressions can be created using literal syntax or the RegExp constructor.' },
    { type: 'code', language: 'javascript', filename: 'regexp-create.js', code: `// Literal syntax (preferred when pattern is known at write time)
const regex1 = /hello/;
const regex2 = /world/i;  // i flag = case-insensitive

// Constructor syntax (useful with dynamic patterns)
const regex3 = new RegExp('hello');
const regex4 = new RegExp('world', 'i');

// Dynamic pattern example
const searchTerm = 'javascript';
const dynamicRegex = new RegExp(searchTerm, 'gi');

// Escaping special characters in constructor
const regex5 = new RegExp('\\\\d+'); // Matches digits

// Properties
console.log(regex2.source);  // 'world' (the pattern)
console.log(regex2.flags);   // 'i' (the flags)
console.log(regex2.global);  // false
console.log(regex2.ignoreCase); // true` },

    { type: 'heading', level: 2, text: 'Character Classes', id: 'character-classes' },
    { type: 'code', language: 'javascript', filename: 'regexp-classes.js', code: `// Basic character classes
const patterns = {
  digit: /\\d/,          // [0-9] — any digit
  nonDigit: /\\D/,       // [^0-9] — not a digit
  word: /\\w/,           // [a-zA-Z0-9_] — word character
  nonWord: /\\W/,        // [^a-zA-Z0-9_] — not word char
  whitespace: /\\s/,     // [ \\t\\n\\r\\f\\v] — whitespace
  nonWhitespace: /\\S/,  // [^ \\t\\n\\r\\f\\v] — not whitespace
  anyChar: /./,          // Any character (except newline)
  newlineIncluded: /./s  // Any character (including newline with s flag)
};

// Custom character classes
console.log(/[aeiou]/.test('hello'));        // true
console.log(/[0-9]/.test('abc123'));        // true
console.log(/[a-z]/.test('Hello'));         // true
console.log(/[^0-9]/.test('123abc'));       // true (negation)

// Range combinations
console.log(/[a-zA-Z0-9_-]/.test('test_1')); // true

// Usage examples
const hasDigit = /\\d/.test('password123');  // true
const email = /^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$/;
console.log(email.test('user@example.com'));  // true
console.log(email.test('invalid.email'));     // false` },

    { type: 'heading', level: 2, text: 'Quantifiers', id: 'quantifiers' },
    { type: 'code', language: 'javascript', filename: 'regexp-quantifiers.js', code: `// Quantifiers control how many times a character appears
const patterns = {
  zero_or_more: /a*/,      // 0 or more times
  one_or_more: /a+/,       // 1 or more times
  zero_or_one: /a?/,       // 0 or 1 time (optional)
  exactly_n: /a{3}/,       // Exactly 3 times
  n_or_more: /a{3,}/,      // 3 or more times
  between_n_m: /a{3,5}/    // Between 3 and 5 times
};

// Examples
console.log(/ab*c/.test('ac'));        // true (b* allows 0 b's)
console.log(/ab+c/.test('ac'));        // false (b+ requires at least 1 b)
console.log(/ab+c/.test('abc'));       // true
console.log(/ab+c/.test('abbbc'));     // true

// Phone number pattern: (123) 456-7890
const phone = /^\\(\\d{3}\\) \\d{3}-\\d{4}$/;
console.log(phone.test('(555) 123-4567'));  // true

// URL validation (simplified)
const url = /^https?:\\/\\/[\\w.-]+\\.\\w{2,}$/;
console.log(url.test('https://example.com'));  // true
console.log(url.test('http://test.co.uk'));    // true

// Greedy vs non-greedy
const text = '<div>Hello</div><div>World</div>';
console.log(text.match(/<div>.*<\\/div>/));   // Greedy: matches entire string
console.log(text.match(/<div>.*?<\\/div>/)); // Non-greedy: matches first div` },

    { type: 'heading', level: 2, text: 'Anchors and Boundaries', id: 'anchors' },
    { type: 'code', language: 'javascript', filename: 'regexp-anchors.js', code: `// Anchors match positions, not characters
const anchors = {
  start: /^/,              // Start of string (or line with m flag)
  end: /$/,                // End of string (or line with m flag)
  wordBoundary: /\\b/,    // Between word and non-word char
  nonWordBoundary: /\\B/  // Within a word
};

// Examples
console.log(/^hello/.test('hello world'));    // true
console.log(/^hello/.test('say hello'));      // false

console.log(/world$/.test('hello world'));    // true
console.log(/world$/.test('world hello'));    // false

// Word boundary
console.log(/\\bhello\\b/.test('hello world')); // true
console.log(/\\bhello\\b/.test('helloworld'));  // false

// Multiline mode
const multiline = 'line1\\nline2\\nline3';
console.log(multiline.match(/^line/));        // ['line1']
console.log(multiline.match(/^line/gm));      // ['line1', 'line2', 'line3']

// Common patterns
const startOfLine = /^\\s*/;      // Indentation at start
const endOfLine = /\\s*$/;        // Trailing whitespace
const emptyLines = /^\\s*$/gm;    // Lines with only whitespace` },

    { type: 'heading', level: 2, text: 'Capture Groups and Backreferences', id: 'groups' },
    { type: 'code', language: 'javascript', filename: 'regexp-groups.js', code: `// Capture groups create sub-matches
const dateRegex = /(\\d{4})-(\\d{2})-(\\d{2})/;
const match = '2024-06-15'.match(dateRegex);
console.log(match[0]); // '2024-06-15' (full match)
console.log(match[1]); // '2024' (first group)
console.log(match[2]); // '06' (second group)
console.log(match[3]); // '15' (third group)

// Named capture groups
const personRegex = /(?<firstName>\\w+) (?<lastName>\\w+)/;
const personMatch = 'John Doe'.match(personRegex);
console.log(personMatch.groups.firstName); // 'John'
console.log(personMatch.groups.lastName);  // 'Doe'

// Backreferences in pattern
const doubleWord = /(\\w+) \\1/;
console.log(doubleWord.test('hello hello'));  // true
console.log(doubleWord.test('hello world'));  // false

// Non-capturing groups
const email = /[\\w.-]+@(?:\\w+\\.)+\\w+/;  // (?:...) doesn't capture
const match2 = 'user@mail.example.com'.match(email);
console.log(match2.length); // 1 (only full match, no subdomain group)

// Lookahead and lookbehind
const lookahead = /\\w+(?=@)/;      // Word followed by @
const match3 = 'user@example.com'.match(lookahead);
console.log(match3[0]); // 'user'

const lookbehind = /(?<=\\$)\\d+/;  // Digits preceded by $
const match4 = 'Cost: \\$100'.match(lookbehind);
console.log(match4[0]); // '100'` },

    { type: 'heading', level: 2, text: 'Flags Explained', id: 'flags' },
    { type: 'code', language: 'javascript', filename: 'regexp-flags.js', code: `// g = global — match all occurrences
const globalRegex = /a/g;
console.log('banana'.match(globalRegex)); // ['a', 'a', 'a']
const noGlobal = /a/;
console.log('banana'.match(noGlobal));    // ['a'] — only first

// i = ignoreCase — case-insensitive matching
console.log(/hello/i.test('HELLO'));   // true
console.log(/hello/.test('HELLO'));    // false

// m = multiline — ^ and $ match line boundaries
const multilineText = 'line1\\nline2\\nline3';
console.log(multilineText.match(/^line/g));    // ['line1']
console.log(multilineText.match(/^line/gm));   // ['line1', 'line2', 'line3']

// s = dotAll — . matches newlines too
console.log('a\\nb'.match(/a.b/));     // null
console.log('a\\nb'.match(/a.b/s));    // ['a\\nb']

// u = unicode — proper unicode character handling
console.log(/\\p{Letter}/u.test('α'));  // true (Greek letter)

// y = sticky — matches only at lastIndex
const sticky = /a/y;
console.log(sticky.test('banana'));     // true
console.log(sticky.lastIndex);          // 2 (position after match)
console.log(sticky.test('banana'));     // false (doesn't match at position 2)

// d = indices — captures match indices
const indicesRegex = /(\\w+)@(\\w+)/d;
const indicesMatch = 'user@domain'.match(indicesRegex);
console.log(indicesMatch.indices); // [[0, 11], [0, 4], [5, 11]]` },

    { type: 'heading', level: 2, text: 'String Methods with RegExp', id: 'string-methods' },
    { type: 'code', language: 'javascript', filename: 'regexp-string-methods.js', code: `const text = 'The quick brown fox jumps over the lazy dog';

// match() — returns all matches
const matches = text.match(/\\b\\w{4,}\\b/g);
console.log(matches); // ['quick', 'brown', 'jumps', 'over']

// matchAll() — iterator of matches
for (const match of text.matchAll(/(\\w+)/g)) {
  console.log(match[0], match.index);
}

// search() — returns index of first match
console.log(text.search(/quick/)); // 4
console.log(text.search(/lazy/));  // 40

// replace() — replace matches
console.log(text.replace(/fox/, 'dog')); // Replaces first
console.log(text.replace(/o/g, '0'));   // Replaces all o's

// replace() with callback
const replaced = text.replace(/(\\w)\\w+/g, (match, first) => {
  return first + '*'.repeat(match.length - 1);
});
console.log(replaced); // Masks passwords

// replaceAll() — replace all (newer method)
console.log(text.replaceAll('o', '0')); // Similar to /o/g

// split() — split by pattern
console.log(text.split(/\\s+/));  // Split by whitespace
console.log('a1b2c3'.split(/\\d/)); // ['a', 'b', 'c', '']

// test() — boolean check
console.log(/quick/.test(text));    // true
console.log(/QUICK/.test(text));    // false
console.log(/QUICK/i.test(text));   // true (case-insensitive)

// exec() — detailed match info
const regex = /(\\w+)\\s+(\\w+)/g;
let exec;
while ((exec = regex.exec(text)) !== null) {
  console.log(exec[1], exec[2], 'at', exec.index);
}` },

    { type: 'heading', level: 2, text: 'Practical Validation Patterns', id: 'validation' },
    { type: 'code', language: 'javascript', filename: 'regexp-validation.js', code: `// Email (simplified)
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
console.log(emailRegex.test('user@example.com'));  // true
console.log(emailRegex.test('invalid.email'));     // false

// Password: 8+ chars, uppercase, lowercase, digit
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/;
console.log(passwordRegex.test('Secure123')); // true
console.log(passwordRegex.test('weak'));      // false

// URL
const urlRegex = /^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)$/;
console.log(urlRegex.test('https://example.com')); // true

// Phone number (US format)
const phoneRegex = /^(\\+1)?[-. ]?(\\d{3})[-. ]?(\\d{3})[-. ]?(\\d{4})$/;
console.log(phoneRegex.test('(555) 123-4567'));  // true
console.log(phoneRegex.test('+1 555-123-4567')); // true

// Credit card (Luhn algorithm would be needed for real validation)
const ccRegex = /^\\d{13,19}$/;
console.log(ccRegex.test('4532015112830366'));  // true format

// Date (YYYY-MM-DD)
const dateRegex = /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/;
console.log(dateRegex.test('2024-06-15')); // true
console.log(dateRegex.test('2024-13-01')); // false

// IP Address (simplified IPv4)
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?){3}$/;
console.log(ipRegex.test('192.168.1.1')); // true
console.log(ipRegex.test('256.1.1.1'));   // false` },

    { type: 'heading', level: 2, text: 'Text Parsing and Extraction', id: 'parsing' },
    { type: 'code', language: 'javascript', filename: 'regexp-parsing.js', code: `// Extract all hashtags
const text = 'Check out #JavaScript and #WebDevelopment!';
const hashtags = text.match(/#\\w+/g);
console.log(hashtags); // ['#JavaScript', '#WebDevelopment']

// Extract URLs
const content = 'Visit https://example.com or http://test.io for more';
const urls = content.match(/https?:\\/\\/[^\\s]+/g);
console.log(urls); // ['https://example.com', 'http://test.io']

// Parse CSV-like data
const csv = '"John Doe",30,"New York"';
const fields = csv.match(/"[^"]*"|\\w+/g);
console.log(fields);

// Extract numbers with context
const measurements = 'Temperature: 25°C, Humidity: 60%';
const values = measurements.match(/\\d+(?:[.,]\\d+)?/g);
console.log(values); // ['25', '60']

// Remove HTML tags
const html = '<div class="content"><p>Hello</p></div>';
const plainText = html.replace(/<[^>]*>/g, '');
console.log(plainText); // 'Hello'

// Highlight search term
const searchTerm = 'javascript';
const found = text.replace(new RegExp(searchTerm, 'gi'), 
  match => \`<mark>\${match}</mark>\`);
console.log(found);

// Camel case to kebab case
const camelCase = 'myVariableName';
const kebabCase = camelCase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
console.log(kebabCase); // 'my-variable-name'

// Extract JSON values
const json = '{"name":"John","age":30}';
const kvRegex = /"(\\w+)":\\s*(\\d+|"[^"]*")/g;
let kv;
while ((kv = kvRegex.exec(json)) !== null) {
  console.log(kv[1], ':', kv[2]);
}` },

    { type: 'heading', level: 2, text: 'Common Mistakes and Pitfalls', id: 'mistakes' },
    { type: 'code', language: 'javascript', filename: 'regexp-mistakes.js', code: `// ❌ Mistake 1: Forgetting to escape special characters
/.$/.test('test.js');      // true (. matches any char!)
/\\.\\$/.test('test.js');   // false (correct escaping)

// ❌ Mistake 2: Forgetting global flag when expecting all matches
const text = 'a1b2c3';
console.log(text.match(/\\d/));   // ['1'] — only first!
console.log(text.match(/\\d/g));  // ['1', '2', '3'] — correct

// ❌ Mistake 3: Using exec() in a loop without resetting lastIndex
const regex = /\\w+/g;
let match;
while ((match = regex.exec('test abc')) !== null) {
  console.log(match[0]); // Infinite loop if regex is reused!
}
// Solution: create new regex or reset lastIndex

// ❌ Mistake 4: Assuming case-sensitivity without flag
console.log(/hello/.test('HELLO'));   // false
console.log(/hello/i.test('HELLO'));  // true

// ❌ Mistake 5: Not considering regex.lastIndex with global flag
const globalRegex = /\\w+/g;
globalRegex.test('test');
console.log(globalRegex.lastIndex); // 4
globalRegex.test('test');           // false — starts at position 4!

// ✅ Reset lastIndex
globalRegex.lastIndex = 0;
globalRegex.test('test');           // true

// ❌ Mistake 6: Complex regex without documentation
// Hard to read and maintain!
/^(?!.*[<>])(?!.*\\$)\\w+$/;

// ✅ Use named groups and comments
const validUsername = /^(?<username>\\w+)$/;` },

    { type: 'heading', level: 2, text: 'Performance Considerations', id: 'performance' },
    { type: 'code', language: 'javascript', filename: 'regexp-performance.js', code: `// Catastrophic backtracking — avoid nested quantifiers
const badRegex = /(a+)+b/;
// This can hang on non-matching input!
// badRegex.test('aaaaaaaaaaaaac'); // SLOW!

// ✅ Use atomic groups or possessive quantifiers
const goodRegex = /(a)+b/;
goodRegex.test('aaaaaaaaaaaaac'); // Fast

// Prefer literal strings for simple patterns
console.time('regex');
for (let i = 0; i < 100000; i++) {
  /hello/.test('hello world');
}
console.timeEnd('regex');

console.time('indexOf');
for (let i = 0; i < 100000; i++) {
  'hello world'.indexOf('hello') !== -1;
}
console.timeEnd('indexOf');
// indexOf is usually faster for simple patterns

// Cache regex objects
const regex1 = /\\d+/g;  // Created once
for (const item of items) {
  regex1.lastIndex = 0; // Reset
  regex1.test(item);
}

// Avoid creating regex in loops
// ❌ Bad
for (const item of items) {
  if (item.match(new RegExp(pattern, 'g'))) { }
}

// ✅ Good
const regex = new RegExp(pattern, 'g');
for (const item of items) {
  regex.lastIndex = 0;
  if (regex.test(item)) { }
}` },

    { type: 'heading', level: 2, text: 'Advanced Patterns', id: 'advanced' },
    { type: 'code', language: 'javascript', filename: 'regexp-advanced.js', code: `// Positive lookahead (?=...)
const followedByDot = /\\w+(?=\\.)/;
console.log('test.js'.match(followedByDot)[0]); // 'test'

// Negative lookahead (?!...)
const notFollowedByDot = /\\w+(?!\\.)/;
console.log('test word'.match(notFollowedByDot)[0]); // 'test'

// Positive lookbehind (?<=...)
const precededByAt = /(?<=@)\\w+/;
console.log('user@domain'.match(precededByAt)[0]); // 'domain'

// Negative lookbehind (?<!...)
const notPrecededByAt = /(?<!@)\\w+/;

// Alternation
const pattern = /cat|dog|bird/;
console.log(pattern.test('I have a cat'));  // true

// Optional groups
const optional = /https?:\\/\\/(www\\.)?/;
console.log(optional.test('https://www.example.com')); // true
console.log(optional.test('http://example.com'));      // true

// Conditional patterns (limited support)
// Match either (if first group exists) or (fallback)
const dateOrTime = /(\\d{4})-(\\d{2})-(\\d{2})|\\d{2}:\\d{2}:\\d{2}/;
console.log('2024-06-15'.match(dateOrTime)); // matches
console.log('14:30:00'.match(dateOrTime));   // matches` },
  ],
};
