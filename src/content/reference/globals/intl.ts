import type { ReferenceContent } from '@/types/content';

export const intlReference: ReferenceContent = {
  id: 'reference-intl',
  title: 'Intl API (i18n)',
  description: 'Internationalization and localization with the Intl API for dates, numbers, currencies, and collation.',
  slug: 'reference/globals/intl',
  pillar: 'reference',
  category: 'globals',
  tags: ['intl', 'i18n', 'localization', 'dates', 'numbers', 'currencies'],
  difficulty: 'intermediate',
  contentType: 'reference',
  summary: 'The Intl namespace provides powerful tools for formatting and comparing strings, dates, and numbers in a locale-aware manner.',
  relatedTopics: ['temporal', 'string-methods'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 12,
  featured: false,
  keywords: ['intl', 'i18n', 'localization', 'locale', 'formatting'],
  signature: 'new Intl.Constructor(locales, options)',
  parameters: [
    { name: 'locales', type: 'string | string[]', description: 'BCP 47 language tags (e.g., "en-US", "de-DE").' },
    { name: 'options', type: 'object', description: 'Configuration object specific to the constructor.' }
  ],
  returnValue: { type: 'Intl Object', description: 'An Intl instance for formatting/comparing.' },
  compatibility: 'All modern browsers — Intl is built-in',
  sections: [
    { type: 'heading', level: 2, text: 'Introduction to Intl', id: 'introduction' },
    { type: 'paragraph', text: 'The Intl namespace provides locale-sensitive operations. Instead of hardcoding date formats, number separators, or currency symbols, Intl automatically adapts to the user\'s locale.' },
    { type: 'callout', variant: 'info', title: 'Locale Awareness', text: 'Always use Intl methods for user-facing date and number formatting. They handle regional variations automatically (date order, decimal separators, currency symbols, etc.).' },

    { type: 'heading', level: 2, text: 'Number Formatting', id: 'number-formatting' },
    { type: 'code', language: 'javascript', filename: 'intl-number.js', code: `// Basic number formatting
const formatter = new Intl.NumberFormat('en-US');
console.log(formatter.format(1234567.89));  // '1,234,567.89'

const deFormatter = new Intl.NumberFormat('de-DE');
console.log(deFormatter.format(1234567.89)); // '1.234.567,89' (different separators!)

// Different locales have different number formatting
console.log(new Intl.NumberFormat('fr-FR').format(1234.5));  // '1 234,5'
console.log(new Intl.NumberFormat('en-IN').format(1234567)); // '12,34,567'

// Options for number formatting
const options = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
  style: 'decimal'
};

const precise = new Intl.NumberFormat('en-US', options);
console.log(precise.format(1234.5)); // '1,234.50'

// Percentage formatting
const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent' });
console.log(percentFormatter.format(0.25)); // '25%'
console.log(percentFormatter.format(0.8));  // '80%'

// Scientific notation
const scientific = new Intl.NumberFormat('en-US', { notation: 'scientific' });
console.log(scientific.format(1234567)); // '1.23E6'

// Compact notation
const compact = new Intl.NumberFormat('en-US', { notation: 'compact' });
console.log(compact.format(1000));      // '1K'
console.log(compact.format(1000000));   // '1M'
console.log(compact.format(1000000000)); // '1B'` },

    { type: 'heading', level: 2, text: 'Currency Formatting', id: 'currency' },
    { type: 'code', language: 'javascript', filename: 'intl-currency.js', code: `// Currency formatting for different locales
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
console.log(usdFormatter.format(99.99));    // '$99.99'

const eurFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
});
console.log(eurFormatter.format(99.99));    // '99,99 €' (space before €!)

const jpyFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY'
});
console.log(jpyFormatter.format(10000));    // '¥10,000'

const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP'
});
console.log(gbpFormatter.format(99.99));    // '£99.99'

// International currency code display
const codeFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'code'  // Show USD instead of $
});
console.log(codeFormatter.format(99.99));   // 'USD 99.99'

// Currency name display
const nameFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  currencyDisplay: 'name'
});
console.log(nameFormatter.format(99.99));   // '99.99 euros'

// Handling currency rounding
const btcFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'BTC',
  minimumFractionDigits: 8,
  maximumFractionDigits: 8
});
console.log(btcFormatter.format(0.00123456)); // '₿0.00123456'` },

    { type: 'heading', level: 2, text: 'Date and Time Formatting', id: 'datetime' },
    { type: 'code', language: 'javascript', filename: 'intl-datetime.js', code: `// Basic date formatting
const date = new Date('2024-06-15T14:30:00');

const enFormatter = new Intl.DateTimeFormat('en-US');
console.log(enFormatter.format(date));   // '6/15/2024'

const deFormatter = new Intl.DateTimeFormat('de-DE');
console.log(deFormatter.format(date));   // '15.6.2024'

// Different date styles
const styleOptions = {
  dateStyle: 'full',      // 'Saturday, June 15, 2024'
  // or 'long', 'medium', 'short'
};

const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });
console.log(fullDate.format(date)); // 'Saturday, June 15, 2024'

// Time formatting
const timeFormatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'long' });
console.log(timeFormatter.format(date)); // '2:30:00 PM EDT'

// Combined date and time
const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short'
});
console.log(datetimeFormatter.format(date)); // '6/15/2024, 2:30 PM'

// Custom format parts
const parts = datetimeFormatter.formatToParts(date);
console.log(parts);
// [{ type: 'month', value: '6' }, { type: 'literal', value: '/' }, ...]

// Timezone handling
const tzFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  timeStyle: 'long',
  dateStyle: 'medium'
});
console.log(tzFormatter.format(date)); // Converted to NY time

// List of available timezones
const timezones = Intl.supportedValuesOf('timeZone');
console.log(timezones.slice(0, 5)); // ['Africa/Abidjan', 'Africa/Accra', ...]` },

    { type: 'heading', level: 2, text: 'List Formatting', id: 'list-formatting' },
    { type: 'code', language: 'javascript', filename: 'intl-list.js', code: `// Format lists in a locale-aware way
const items = ['apple', 'banana', 'orange'];

const enFormatter = new Intl.ListFormat('en-US');
console.log(enFormatter.format(items));  // 'apple, banana, and orange'

const deFormatter = new Intl.ListFormat('de-DE');
console.log(deFormatter.format(items));  // 'apple, banana und orange' (und instead of and)

const frFormatter = new Intl.ListFormat('fr-FR');
console.log(frFormatter.format(items));  // 'apple, banana et orange'

// Type: 'conjunction' (and) vs 'disjunction' (or)
const orFormatter = new Intl.ListFormat('en-US', { type: 'disjunction' });
console.log(orFormatter.format(['red', 'blue', 'green'])); // 'red, blue, or green'

// Type: 'unit' (no conjunctions)
const unitFormatter = new Intl.ListFormat('en-US', { type: 'unit' });
console.log(unitFormatter.format(['1m', '2m', '3m'])); // '1m, 2m, 3m'

// Style: 'long', 'short', 'narrow'
const shortFormatter = new Intl.ListFormat('en-US', { style: 'short' });
console.log(shortFormatter.format(items)); // 'apple, banana, & orange'

// Use case: display user names
const users = ['Alice', 'Bob', 'Charlie'];
const nameFormatter = new Intl.ListFormat('en-US', {
  type: 'conjunction',
  style: 'long'
});
console.log(nameFormatter.format(users)); // 'Alice, Bob, and Charlie'` },

    { type: 'heading', level: 2, text: 'Collation and String Comparison', id: 'collation' },
    { type: 'code', language: 'javascript', filename: 'intl-collation.js', code: `// String comparison with locale awareness
const collator = new Intl.Collator('en-US');

// compare() returns -1, 0, or 1
console.log(collator.compare('a', 'b'));      // -1 (a < b)
console.log(collator.compare('b', 'a'));      // 1 (b > a)
console.log(collator.compare('apple', 'apple')); // 0 (equal)

// Case-insensitive comparison
const caseInsensitive = new Intl.Collator('en-US', { sensitivity: 'base' });
console.log(caseInsensitive.compare('A', 'a')); // 0 (equal!)

// Accent-insensitive comparison
const noAccent = new Intl.Collator('en-US', { sensitivity: 'base' });
console.log(noAccent.compare('e', 'é')); // 0 (equal!)

// Numeric ordering
const numeric = new Intl.Collator('en-US', { numeric: true });
const files = ['file1.txt', 'file2.txt', 'file10.txt', 'file20.txt'];
const sorted = files.sort(numeric.compare);
console.log(sorted); // Correctly: file1, file2, file10, file20

// Without numeric: file1, file10, file2, file20

// Locale-specific sorting
const spanish = new Intl.Collator('es-ES');
const words = ['ñandú', 'nata', 'omega'];
console.log(words.sort(spanish.compare)); // ñandú sorts correctly in Spanish

// Sorting with options
const options = {
  sensitivity: 'variant',  // Distinguishes all differences (most strict)
  numeric: true,
  ignorePunctuation: false,
  caseFirst: 'upper'       // Uppercase before lowercase
};
const customCollator = new Intl.Collator('en-US', options);` },

    { type: 'heading', level: 2, text: 'Plural Rules', id: 'plural-rules' },
    { type: 'code', language: 'javascript', filename: 'intl-plural.js', code: `// Get correct plural form for a number in a locale
const enPluralRules = new Intl.PluralRules('en-US');
console.log(enPluralRules.select(0));  // 'other' — "0 items"
console.log(enPluralRules.select(1));  // 'one' — "1 item"
console.log(enPluralRules.select(2));  // 'other' — "2 items"
console.log(enPluralRules.select(5));  // 'other'

// English: one, other
// Polish: one, few, many, other
// Russian: one, few, many, other
// Arabic: zero, one, two, few, many, other

const ruPluralRules = new Intl.PluralRules('ru-RU');
console.log(ruPluralRules.select(1));  // 'one'
console.log(ruPluralRules.select(2));  // 'few'
console.log(ruPluralRules.select(5));  // 'many'

// Use with message formatting
function formatMessage(count, locale) {
  const pluralRules = new Intl.PluralRules(locale);
  const rule = pluralRules.select(count);
  
  const messages = {
    'one': 'You have 1 message',
    'other': \`You have \${count} messages\`
  };
  
  return messages[rule];
}

console.log(formatMessage(1, 'en-US'));  // 'You have 1 message'
console.log(formatMessage(5, 'en-US'));  // 'You have 5 messages'

// Get all plural categories for a locale
const categories = enPluralRules.resolvedOptions().pluralCategories;
console.log(categories); // ['one', 'other']

const ruCategories = ruPluralRules.resolvedOptions().pluralCategories;
console.log(ruCategories); // ['one', 'few', 'many', 'other']` },

    { type: 'heading', level: 2, text: 'Locale Negotiation', id: 'locale-negotiation' },
    { type: 'code', language: 'javascript', filename: 'intl-locale.js', code: `// Intl.Locale represents a locale
const locale1 = new Intl.Locale('en-US');
console.log(locale1.language);    // 'en'
console.log(locale1.region);      // 'US'
console.log(locale1.baseName);    // 'en-US'

const locale2 = new Intl.Locale('zh', { script: 'Hans', region: 'CN' });
console.log(locale2.toString()); // 'zh-Hans-CN'

// Use browser's language
const userLocale = new Intl.Locale(navigator.language);
console.log(userLocale.language); // Browser's language

// Match against available locales
const supportedLocales = ['en-US', 'de-DE', 'fr-FR'];
const userPreferred = ['de-DE', 'en-US'];

const bestMatch = Intl.DateTimeFormat.supportedLocalesOf(userPreferred)[0];
console.log(bestMatch); // 'de-DE'

// Get resolved options
const dateFormatter = new Intl.DateTimeFormat('en', {
  timeZone: 'UTC',
  year: 'numeric'
});

const resolved = dateFormatter.resolvedOptions();
console.log(resolved.locale);     // 'en' (may be more specific)
console.log(resolved.timeZone);   // 'UTC'
console.log(resolved.calendar);   // 'gregory' (Gregorian calendar)
console.log(resolved.numberingSystem); // 'latn' (Latin digits)` },

    { type: 'heading', level: 2, text: 'Segment Iterator (Text Segmentation)', id: 'segmentation' },
    { type: 'code', language: 'javascript', filename: 'intl-segmentation.js', code: `// Segment text by grapheme, word, or sentence
const text = 'Hello, world! 👨‍👩‍👧‍👦';

// Grapheme segmentation (user-perceived characters)
const graphemeSegmenter = new Intl.Segmenter('en-US', { granularity: 'grapheme' });
const graphemes = [...graphemeSegmenter.segment(text)].map(s => s.segment);
console.log(graphemes);
// ['H', 'e', 'l', 'l', 'o', ',', ' ', 'w', 'o', 'r', 'l', 'd', '!', ' ', '👨‍👩‍👧‍👦']

// Word segmentation
const wordSegmenter = new Intl.Segmenter('en-US', { granularity: 'word' });
const words = [...wordSegmenter.segment(text)].map(s => s.segment);
console.log(words); // ['Hello', ',', ' ', 'world', '!', ' ', '👨‍👩‍👧‍👦']

// Sentence segmentation
const text2 = 'Hello world. How are you? I am fine.';
const sentenceSegmenter = new Intl.Segmenter('en-US', { granularity: 'sentence' });
const sentences = [...sentenceSegmenter.segment(text2)].map(s => s.segment);
console.log(sentences);
// ['Hello world. ', 'How are you? ', 'I am fine.']

// isWordLike property for word segments
const wordSegments = wordSegmenter.segment('hello-world');
for (const segment of wordSegments) {
  console.log(segment.segment, 'isWordLike:', segment.isWordLike);
}
// 'hello' isWordLike: true
// '-' isWordLike: false
// 'world' isWordLike: true` },

    { type: 'heading', level: 2, text: 'Practical Examples', id: 'examples' },
    { type: 'code', language: 'javascript', filename: 'intl-examples.js', code: `// Format a price for an e-commerce site
function formatPrice(amount, locale, currency) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  });
  return formatter.format(amount);
}

console.log(formatPrice(99.99, 'en-US', 'USD'));  // '$99.99'
console.log(formatPrice(99.99, 'de-DE', 'EUR'));  // '99,99 €'
console.log(formatPrice(99.99, 'ja-JP', 'JPY'));  // '¥100' (JPY has no decimals)

// Display relative dates
function formatRelativeDate(date, locale) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    return rtf.format(diffHours, 'hour');
  }
  
  return rtf.format(diffDays, 'day');
}

const tomorrow = new Date(Date.now() + 86400000);
console.log(formatRelativeDate(tomorrow, 'en-US')); // 'tomorrow'

// Validate and normalize email for display
function formatEmail(email, locale) {
  const [local, domain] = email.split('@');
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });
  
  // Case-insensitive comparison for email checking
  return email.toLowerCase();
}

// Create a user-friendly product description with proper formatting
function describeProduct(name, price, quantity, locale) {
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD'
  });
  
  const pluralRules = new Intl.PluralRules(locale);
  const quantityRule = pluralRules.select(quantity);
  
  const units = {
    'one': 'unit',
    'other': 'units'
  };
  
  return \`\${name}: \${priceFormatter.format(price)} (\${quantity} \${units[quantityRule]})\`;
}

console.log(describeProduct('Widget', 9.99, 1, 'en-US'));  // Widget: $9.99 (1 unit)
console.log(describeProduct('Widget', 9.99, 5, 'en-US'));  // Widget: $9.99 (5 units)` },

    { type: 'heading', level: 2, text: 'Browser Support and Fallbacks', id: 'support' },
    { type: 'code', language: 'javascript', filename: 'intl-support.js', code: `// Check if a locale is supported
const supportedLocales = Intl.DateTimeFormat.supportedLocalesOf(['de-DE', 'invalid-locale']);
console.log(supportedLocales); // ['de-DE']

// Polyfill pattern for older browsers
if (typeof Intl === 'undefined') {
  console.warn('Intl API not supported');
  // Use fallback formatting
} else {
  const formatter = new Intl.DateTimeFormat('en-US');
  console.log(formatter.format(new Date()));
}

// Check for specific constructors
if ('RelativeTimeFormat' in Intl) {
  // Use Intl.RelativeTimeFormat
} else {
  // Use manual relative time formatting
}

// Get all supported timezones
try {
  const timezones = Intl.supportedValuesOf('timeZone');
  console.log(timezones.length); // Usually 400+
} catch (e) {
  console.log('supportedValuesOf not available');
}` },
  ],
};
