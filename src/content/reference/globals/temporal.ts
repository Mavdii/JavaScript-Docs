import type { ReferenceContent } from '@/types/content';

export const temporalReference: ReferenceContent = {
  id: 'reference-temporal',
  title: 'Date & Time (Temporal)',
  description: 'Work with dates and times using JavaScript\'s Date object and handling timezones correctly.',
  slug: 'reference/globals/temporal',
  pillar: 'reference',
  category: 'globals',
  tags: ['date', 'time', 'timestamp', 'timezone', 'temporal'],
  difficulty: 'intermediate',
  contentType: 'reference',
  summary: 'JavaScript\'s Date object handles dates and times. While Temporal is coming, learn effective patterns with Date for timezone handling, parsing, and calculations.',
  relatedTopics: ['intl', 'math'],
  order: 2,
  updatedAt: '2025-06-01',
  readingTime: 13,
  featured: false,
  keywords: ['date', 'time', 'timezone', 'temporal', 'timestamps'],
  signature: 'new Date(year, month, date?, hours?, minutes?, seconds?, milliseconds?) or new Date(dateString) or new Date(milliseconds)',
  parameters: [
    { name: 'year', type: 'number', description: 'Year (required if using constructor form).' },
    { name: 'month', type: 'number', description: 'Month (0-11, where 0 is January).' },
    { name: 'dateString', type: 'string', description: 'ISO 8601 or other recognized format.' }
  ],
  returnValue: { type: 'Date', description: 'A Date object representing a specific moment in time.' },
  compatibility: 'All browsers — Date is built-in. Temporal is in Stage 3 TC39 proposal.',
  sections: [
    { type: 'heading', level: 2, text: 'Creating Date Objects', id: 'creating-dates' },
    { type: 'code', language: 'javascript', filename: 'date-create.js', code: `// Current date and time
const now = new Date();
console.log(now); // 2024-06-15T14:30:00.000Z (or similar)

// From ISO 8601 string (recommended)
const specific = new Date('2024-06-15T14:30:00Z');
console.log(specific);

// From year, month, day (month is 0-indexed!)
const date = new Date(2024, 5, 15);  // June 15, 2024 (month 5 = June)
console.log(date);

// From timestamp (milliseconds since Jan 1, 1970 UTC)
const fromTimestamp = new Date(1718456400000);
console.log(fromTimestamp);

// Parsing various formats
const iso = new Date('2024-06-15T14:30:00Z');
const rfc = new Date('Sat, 15 Jun 2024 14:30:00 GMT');
const custom = new Date('June 15, 2024');

// ❌ Gotcha: Parsing is browser-dependent!
// Always use ISO 8601 for consistency
const safe = new Date('2024-06-15T14:30:00Z');

// Get current timestamp
const timestamp = Date.now();           // Milliseconds since epoch
const timestamp2 = new Date().getTime(); // Same thing` },

    { type: 'heading', level: 2, text: 'Getting Date Components', id: 'getting-components' },
    { type: 'code', language: 'javascript', filename: 'date-get.js', code: `const date = new Date('2024-06-15T14:30:45.123Z');

// UTC methods (recommended)
console.log(date.getUTCFullYear());    // 2024
console.log(date.getUTCMonth());       // 5 (June, 0-indexed!)
console.log(date.getUTCDate());        // 15 (day of month)
console.log(date.getUTCDay());         // 6 (day of week: 0=Sunday, 6=Saturday)
console.log(date.getUTCHours());       // 14
console.log(date.getUTCMinutes());     // 30
console.log(date.getUTCSeconds());     // 45
console.log(date.getUTCMilliseconds()); // 123

// Local methods (affected by timezone!)
console.log(date.getFullYear());       // May differ from UTC
console.log(date.getMonth());          // May differ from UTC
console.log(date.getDate());           // May differ from UTC

// Get timestamp
console.log(date.getTime());           // 1718456445123 (milliseconds since epoch)

// Helper: Get all components at once
function getDateParts(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,     // Convert to 1-indexed
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
    milliseconds: date.getUTCMilliseconds()
  };
}

console.log(getDateParts(date));` },

    { type: 'heading', level: 2, text: 'Setting Date Components', id: 'setting-components' },
    { type: 'code', language: 'javascript', filename: 'date-set.js', code: `const date = new Date('2024-06-15T14:30:45Z');

// UTC methods
date.setUTCFullYear(2025);
date.setUTCMonth(0);           // January (0-indexed)
date.setUTCDate(1);
date.setUTCHours(0);
date.setUTCMinutes(0);
date.setUTCSeconds(0);
date.setUTCMilliseconds(0);

console.log(date);             // 2025-01-01T00:00:00Z

// These methods mutate the original date object
const original = new Date('2024-06-15');
original.setUTCDate(20);
console.log(original);         // 2024-06-20 (modified!)

// Immutable approach: create a new date
function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

const date1 = new Date('2024-06-15');
const date2 = addDays(date1, 5);
console.log(date1);            // 2024-06-15 (unchanged)
console.log(date2);            // 2024-06-20 (new object)

// Month arithmetic (handles overflow)
const date3 = new Date('2024-01-31');
date3.setUTCMonth(1);          // February (auto-adjusts to last day)
console.log(date3);            // 2024-02-29 (leap year!)` },

    { type: 'heading', level: 2, text: 'Date Formatting', id: 'formatting' },
    { type: 'code', language: 'javascript', filename: 'date-format.js', code: `const date = new Date('2024-06-15T14:30:45Z');

// Default string representations
console.log(date.toString());              // 'Sat Jun 15 2024 14:30:45 GMT+0000'
console.log(date.toUTCString());           // 'Sat, 15 Jun 2024 14:30:45 GMT'
console.log(date.toISOString());           // '2024-06-15T14:30:45.000Z' (best for storage)
console.log(date.toLocaleString());        // Locale-aware: '6/15/2024, 2:30:45 PM'
console.log(date.toLocaleDateString());    // Locale-aware: '6/15/2024'
console.log(date.toLocaleTimeString());    // Locale-aware: '2:30:45 PM'

// Custom formatting with Intl
const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'America/New_York'
});
console.log(formatter.format(date));       // 'June 15, 2024, 10:30:45 AM'

// Manual formatting helper
function formatDate(date, format) {
  const parts = {
    YYYY: date.getUTCFullYear(),
    MM: String(date.getUTCMonth() + 1).padStart(2, '0'),
    DD: String(date.getUTCDate()).padStart(2, '0'),
    HH: String(date.getUTCHours()).padStart(2, '0'),
    mm: String(date.getUTCMinutes()).padStart(2, '0'),
    ss: String(date.getUTCSeconds()).padStart(2, '0')
  };
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => parts[match]);
}

console.log(formatDate(date, 'YYYY-MM-DD HH:mm:ss')); // '2024-06-15 14:30:45'` },

    { type: 'heading', level: 2, text: 'Date Comparison and Arithmetic', id: 'comparison-arithmetic' },
    { type: 'code', language: 'javascript', filename: 'date-comparison.js', code: `const date1 = new Date('2024-06-15');
const date2 = new Date('2024-06-20');
const date3 = new Date('2024-06-15');

// Comparison (uses timestamp)
console.log(date1.getTime() < date2.getTime());  // true
console.log(date1.getTime() === date3.getTime()); // true (but use getTime!)
console.log(date1 < date2);                       // true (implicit conversion)

// ❌ Gotcha: Direct comparison doesn't work
console.log(date1 == date3);  // false (different objects!)
console.log(date1 === date3); // false

// ✅ Always use getTime() for comparison
console.log(date1.getTime() === date3.getTime()); // true

// Date difference (milliseconds)
const diff = date2.getTime() - date1.getTime();
console.log(diff);            // 432000000 (milliseconds)

// Convert difference to other units
const diffDays = diff / (1000 * 60 * 60 * 24);
const diffHours = diff / (1000 * 60 * 60);
const diffMinutes = diff / (1000 * 60);
const diffSeconds = diff / 1000;

console.log(diffDays);        // 5
console.log(diffHours);       // 120

// Date arithmetic helpers
function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function addHours(date, hours) {
  const result = new Date(date);
  result.setUTCHours(result.getUTCHours() + hours);
  return result;
}

function daysBetween(date1, date2) {
  const ms = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

console.log(addDays(date1, 7));      // One week later
console.log(addHours(date1, 24));    // One day later
console.log(daysBetween(date1, date2)); // 5` },

    { type: 'heading', level: 2, text: 'Parsing Dates Safely', id: 'parsing' },
    { type: 'code', language: 'javascript', filename: 'date-parsing.js', code: `// ⚠️ Date parsing is notoriously tricky!

// ISO 8601 (safest — always UTC)
const iso = new Date('2024-06-15T14:30:00Z');
console.log(iso);

// Ambiguous parsing (browser-dependent!)
const ambiguous = new Date('06/15/2024'); // Is this MM/DD or DD/MM?
console.log(ambiguous); // Depends on browser!

// ✅ Always parse into components and construct explicitly
function parseDate(dateString) {
  // Handle ISO 8601
  if (dateString.includes('T')) {
    return new Date(dateString);
  }
  
  // Handle custom formats
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// Safer date parsing from user input
function parseUserDate(input) {
  try {
    const date = new Date(input);
    
    // Validate it parsed correctly
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return date;
  } catch (e) {
    console.error('Failed to parse date:', input);
    return null;
  }
}

// Parse specific format: YYYY-MM-DD
function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Validate
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  
  return new Date(Date.UTC(year, month - 1, day));
}

console.log(parseDateString('2024-06-15')); // 2024-06-15T00:00:00Z
console.log(parseDateString('2024-13-01')); // null (invalid month)` },

    { type: 'heading', level: 2, text: 'Working with Timezones', id: 'timezones' },
    { type: 'code', language: 'javascript', filename: 'date-timezone.js', code: `// JavaScript Date is always UTC internally
const date = new Date('2024-06-15T14:30:00Z');

// Getting local timezone offset
const offsetMinutes = new Date().getTimezoneOffset();
console.log(offsetMinutes); // -240 (for UTC-4, negative = ahead of UTC)

// The offset is always negative of what you might expect!
// UTC-5 = -300 minutes
// UTC+1 = -60 minutes

// Convert UTC date to local time display
function toLocalTime(utcDate) {
  const localDate = new Date(utcDate);
  // localDate methods (getHours, etc.) already use local time
  return localDate;
}

// Convert local time to UTC
function toUTC(localDate) {
  const offset = localDate.getTimezoneOffset() * 60 * 1000;
  return new Date(localDate.getTime() + offset);
}

// Get local time parts (affected by timezone)
const now = new Date();
console.log(now.getHours());    // Local hours
console.log(now.getUTCHours()); // UTC hours

// Format in specific timezone using Intl
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

const date1 = new Date('2024-06-15T14:30:00Z');
console.log(formatter.format(date1)); // 10:30:00 AM (EDT = UTC-4)

// Calculate what time it is in different cities
function getTimeInCity(city, tzName) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tzName,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const timeStr = formatter.format(new Date());
  return \`\${city}: \${timeStr}\`;
}

console.log(getTimeInCity('New York', 'America/New_York'));
console.log(getTimeInCity('London', 'Europe/London'));
console.log(getTimeInCity('Tokyo', 'Asia/Tokyo'));` },

    { type: 'heading', level: 2, text: 'Relative Dates and Time Ago', id: 'relative-time' },
    { type: 'code', language: 'javascript', filename: 'date-relative.js', code: `// Calculate relative time ("5 minutes ago", "2 days from now")
function getTimeAgo(date) {
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);
  
  if (secondsAgo < 60) {
    return 'just now';
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return \`\${minutesAgo}m ago\`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return \`\${hoursAgo}h ago\`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return \`\${daysAgo}d ago\`;
  }
  
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return \`\${weeksAgo}w ago\`;
  }
  
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return \`\${monthsAgo}mo ago\`;
  }
  
  const yearsAgo = Math.floor(monthsAgo / 12);
  return \`\${yearsAgo}y ago\`;
}

console.log(getTimeAgo(new Date(Date.now() - 5000)));      // 'just now'
console.log(getTimeAgo(new Date(Date.now() - 300000)));    // '5m ago'
console.log(getTimeAgo(new Date(Date.now() - 86400000))); // '1d ago'

// Use Intl.RelativeTimeFormat for locale-aware relative time
function formatRelative(date, locale = 'en-US') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffDays) >= 1) {
    return rtf.format(diffDays, 'day');
  }
  
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (Math.abs(diffHours) >= 1) {
    return rtf.format(diffHours, 'hour');
  }
  
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  return rtf.format(diffMinutes, 'minute');
}

const pastDate = new Date(Date.now() - 86400000);
console.log(formatRelative(pastDate)); // 'yesterday'

const futureDate = new Date(Date.now() + 86400000);
console.log(formatRelative(futureDate)); // 'tomorrow'` },

    { type: 'heading', level: 2, text: 'Common Patterns and Gotchas', id: 'patterns-gotchas' },
    { type: 'code', language: 'javascript', filename: 'date-patterns.js', code: `// ❌ Gotcha 1: Month is 0-indexed
const wrongDate = new Date(2024, 6, 15);  // July 15, not June!
const correctDate = new Date(2024, 5, 15); // June 15

// ❌ Gotcha 2: New Date() with string parsing is unreliable
const ambiguous = new Date('06-15-2024'); // Might parse differently
const safe = new Date('2024-06-15T00:00:00Z'); // Always ISO 8601

// ❌ Gotcha 3: Comparing Date objects directly
const date1 = new Date('2024-06-15');
const date2 = new Date('2024-06-15');
console.log(date1 === date2); // false (different objects)
console.log(date1.getTime() === date2.getTime()); // true ✓

// ❌ Gotcha 4: getTimezoneOffset is confusing
const offset = new Date().getTimezoneOffset();
// Negative for ahead of UTC, positive for behind
// UTC+5: offset = -300
// UTC-5: offset = 300

// ❌ Gotcha 5: Date mutations
const original = new Date('2024-06-15');
original.setDate(20); // Mutates original!
// Use immutable pattern:
const modified = new Date(original);
modified.setDate(20);

// ✅ Good pattern: Date helper functions
function addDays(date, days) {
  const result = new Date(date); // Create copy
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

// ✅ Always use UTC methods for consistency
const goodDate = new Date('2024-06-15T14:30:00Z');
console.log(goodDate.getUTCHours()); // Consistent across timezones
console.log(goodDate.getHours());    // Varies by timezone` },

    { type: 'heading', level: 2, text: 'Practical Examples', id: 'examples' },
    { type: 'code', language: 'javascript', filename: 'date-examples.js', code: `// Check if a date is today
function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Check if a date is in the past
function isPast(date) {
  return date.getTime() < Date.now();
}

// Get the start of the day (midnight UTC)
function getStartOfDay(date) {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

// Get the end of the day (23:59:59.999 UTC)
function getEndOfDay(date) {
  const result = new Date(date);
  result.setUTCHours(23, 59, 59, 999);
  return result;
}

// Get start of week (Monday)
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const result = new Date(d.setUTCDate(diff));
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

// Get all dates in a range
function getDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  
  while (current.getTime() <= endDate.getTime()) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  
  return dates;
}

// Calculate age from birthdate
function getAge(birthDate) {
  const today = new Date();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
    age--;
  }
  
  return age;
}

// Check if year is a leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Get number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getUTCDate();
}` },
  ],
};
