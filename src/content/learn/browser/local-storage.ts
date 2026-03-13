import type { LessonContent } from '@/types/content';

export const localStorageLesson: LessonContent = {
  id: 'local-storage',
  title: 'Local Storage',
  description: 'Store stuff in the browser that sticks around even after they close the tab.',
  slug: 'learn/browser/local-storage',
  pillar: 'learn',
  category: 'browser',
  tags: ['localStorage', 'storage', 'persistence', 'browser'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'localStorage is simple key-value storage that survives browser restarts. It only stores strings, so you\'ll use JSON for objects.',
  relatedTopics: ['session-storage'],
  order: 2,
  updatedAt: '2024-03-01',
  readingTime: 14,
  featured: false,
  keywords: ['localStorage', 'setItem', 'getItem', 'removeItem', 'JSON', 'persistence', 'storage event', 'quota'],
  prerequisites: ['Variables & Types'],
  learningGoals: [
    'Store and retrieve data from localStorage',
    'Handle JSON serialization for objects',
    'Know localStorage limitations and quotas',
    'Sync data across tabs with the storage event',
    'Build type-safe storage wrappers',
    'Implement expiring storage entries',
  ],
  exercises: [
    'Build a theme preference that persists across page reloads.',
    'Create a wrapper function that handles JSON parse/stringify automatically.',
    'Implement an expiring cache using localStorage with TTL.',
    'Build a cross-tab synchronized counter using the storage event.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What Is localStorage?', id: 'what-is-localstorage' },
    { type: 'paragraph', text: 'localStorage is a Web Storage API that stores key-value pairs in the browser with no expiration date. Data persists even after the browser window is closed and reopened. It\'s scoped per origin (protocol + domain + port), meaning different websites cannot access each other\'s stored data.' },
    { type: 'paragraph', text: 'Unlike cookies, localStorage data is never sent to the server with HTTP requests. It provides a much larger storage quota (~5-10MB vs 4KB for cookies) and a simpler API.' },

    { type: 'heading', level: 2, text: 'Basic API', id: 'basic-api' },
    {
      type: 'code', language: 'javascript', filename: 'basic.js',
      code: `// Store a value
localStorage.setItem('username', 'Alice');

// Retrieve a value
const name = localStorage.getItem('username'); // "Alice"

// Remove a specific item
localStorage.removeItem('username');

// Clear all items for this origin
localStorage.clear();

// Check number of stored items
console.log(localStorage.length); // 0

// Get key by index (useful for iteration)
const firstKey = localStorage.key(0);`,
    },

    { type: 'heading', level: 2, text: 'Storing Objects & Arrays', id: 'storing-objects' },
    { type: 'paragraph', text: 'localStorage only stores strings. Any non-string value is automatically converted using `.toString()`, which usually gives useless results like `"[object Object]"`. Always use JSON serialization:' },
    {
      type: 'code', language: 'javascript', filename: 'objects.js',
      code: `// ❌ Wrong — stores "[object Object]"
localStorage.setItem('user', { name: 'Alice' });
localStorage.getItem('user'); // "[object Object]"

// ✅ Correct — serialize with JSON
const user = { name: 'Alice', age: 30, roles: ['admin', 'user'] };
localStorage.setItem('user', JSON.stringify(user));

// Parse back
const stored = JSON.parse(localStorage.getItem('user'));
console.log(stored.name); // "Alice"
console.log(stored.roles); // ['admin', 'user']

// ❌ Gotcha with booleans and numbers
localStorage.setItem('count', 42);       // Stored as "42"
localStorage.setItem('active', true);    // Stored as "true"
typeof localStorage.getItem('count');    // "string", not "number"
typeof localStorage.getItem('active');   // "string", not "boolean"

// ✅ Fix: JSON.stringify preserves types after parse
localStorage.setItem('count', JSON.stringify(42));
JSON.parse(localStorage.getItem('count')); // 42 (number)`,
    },
    { type: 'callout', variant: 'warning', title: 'Strings Only', text: 'localStorage only stores strings. Storing a number or boolean without JSON.stringify will silently convert it to a string, causing subtle bugs when comparing with `===`.' },

    { type: 'heading', level: 2, text: 'Safe Storage Wrapper', id: 'safe-wrapper' },
    { type: 'paragraph', text: 'Raw localStorage calls are error-prone: getItem returns null for missing keys, JSON.parse throws on invalid JSON, and setItem throws when quota is exceeded. Wrap it in a safe utility:' },
    {
      type: 'code', language: 'typescript', filename: 'storage-utils.ts',
      code: `function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('Storage failed:', e);
    return false; // Quota exceeded or private mode
  }
}

function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors in restricted environments
  }
}

// Usage
setStored('preferences', { theme: 'dark', lang: 'en' });
const prefs = getStored('preferences', { theme: 'light', lang: 'en' });`,
    },

    { type: 'heading', level: 2, text: 'Expiring Storage (TTL)', id: 'expiring-storage' },
    { type: 'paragraph', text: 'localStorage has no built-in expiration. Implement it by wrapping values with a timestamp:' },
    {
      type: 'code', language: 'typescript', filename: 'expiring-storage.ts',
      code: `interface StoredItem<T> {
  value: T;
  expiry: number; // timestamp in ms
}

function setWithExpiry<T>(key: string, value: T, ttlMs: number): void {
  const item: StoredItem<T> = {
    value,
    expiry: Date.now() + ttlMs,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const item: StoredItem<T> = JSON.parse(raw);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key); // Clean up expired item
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}

// Usage — cache API response for 5 minutes
const FIVE_MINUTES = 5 * 60 * 1000;

async function getCachedUsers() {
  const cached = getWithExpiry<User[]>('users_cache');
  if (cached) return cached;

  const users = await fetchUsers();
  setWithExpiry('users_cache', users, FIVE_MINUTES);
  return users;
}`,
    },

    { type: 'heading', level: 2, text: 'Cross-Tab Sync with storage Event', id: 'storage-event' },
    { type: 'paragraph', text: 'When localStorage changes in one tab, all other tabs of the same origin receive a `storage` event. This enables cross-tab communication without WebSockets:' },
    {
      type: 'code', language: 'javascript', filename: 'storage-event.js',
      code: `// Listen for changes from OTHER tabs (not the current one)
window.addEventListener('storage', (event) => {
  console.log('Key changed:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('URL of change:', event.url);

  // React to specific changes
  if (event.key === 'auth_token') {
    if (!event.newValue) {
      // Token was removed in another tab — log out here too
      redirectToLogin();
    }
  }

  if (event.key === 'theme') {
    applyTheme(event.newValue);
  }
});

// Example: Sync logout across all tabs
function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  // Other tabs will detect this via the storage event
  window.location.href = '/login';
}`,
    },
    { type: 'callout', variant: 'info', title: 'Same-Tab Limitation', text: 'The storage event only fires in OTHER tabs/windows of the same origin. It does not fire in the tab that made the change. For same-tab reactivity, use a custom event or state management.' },

    { type: 'heading', level: 2, text: 'React Hook for localStorage', id: 'react-hook' },
    {
      type: 'code', language: 'tsx', filename: 'useLocalStorage.tsx',
      code: `import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize from localStorage or use initial value
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [key, value]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove] as const;
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme ({theme})
      </button>
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Limitations', id: 'limitations' },
    {
      type: 'table',
      headers: ['Limitation', 'Details'],
      rows: [
        ['Storage limit', '~5-10 MB per origin (varies by browser)'],
        ['Synchronous API', 'Blocks the main thread — avoid storing large data'],
        ['Strings only', 'No binary data, no Blobs, no typed arrays'],
        ['No expiration', 'Data persists until explicitly removed'],
        ['No indexing', 'Cannot query or search — only key lookup'],
        ['Private mode', 'Some browsers restrict or disable in incognito'],
        ['No encryption', 'Data is stored in plain text — never store secrets'],
        ['No cross-origin', 'Each origin has its own isolated storage'],
      ],
    },

    { type: 'heading', level: 2, text: 'localStorage vs Alternatives', id: 'comparison' },
    {
      type: 'table',
      headers: ['Feature', 'localStorage', 'sessionStorage', 'Cookies', 'IndexedDB'],
      rows: [
        ['Capacity', '~5-10 MB', '~5 MB', '~4 KB', '~unlimited'],
        ['Persistence', 'Permanent', 'Tab session', 'Configurable', 'Permanent'],
        ['API', 'Sync, simple', 'Sync, simple', 'String-based', 'Async, complex'],
        ['Sent to server', 'No', 'No', 'Yes (every request)', 'No'],
        ['Data types', 'Strings', 'Strings', 'Strings', 'Structured (objects, blobs)'],
        ['Indexing/queries', 'No', 'No', 'No', 'Yes'],
        ['Web Workers', 'No', 'No', 'No', 'Yes'],
      ],
    },
    { type: 'callout', variant: 'tip', title: 'When Not to Use', text: 'Don\'t use localStorage for: sensitive data (tokens, passwords), large datasets (>1MB), data that needs to be queried/indexed, or data that needs server access. Use IndexedDB for complex local data, and HTTP-only cookies for auth tokens.' },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Not handling null
const name = localStorage.getItem('name');
name.toUpperCase(); // TypeError if key doesn’t exist!

// ✅ Fix: Always provide a fallback
const name2 = localStorage.getItem('name') || 'Guest';

// ❌ Mistake 2: Not handling JSON parse errors
const data = JSON.parse(localStorage.getItem('data')); // Throws if invalid!

// ✅ Fix: Wrap in try/catch
let data2;
try {
  data2 = JSON.parse(localStorage.getItem('data'));
} catch {
  data2 = null;
}

// ❌ Mistake 3: Not handling quota exceeded
for (let i = 0; i < 1000000; i++) {
  localStorage.setItem('item_' + i, 'x'.repeat(1000)); // Will throw!
}

// ✅ Fix: Catch and handle QuotaExceededError
try {
  localStorage.setItem('big-data', hugeString);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Clear old entries or notify user
    cleanupOldEntries();
  }
}

// ❌ Mistake 4: Storing sensitive data
localStorage.setItem('password', 'secret123'); // Accessible via DevTools!
localStorage.setItem('credit_card', '4111...'); // Never do this!

// ✅ Fix: Use HTTP-only cookies for auth, never store secrets client-side`,
    },

    { type: 'heading', level: 2, text: 'Debugging localStorage', id: 'debugging' },
    {
      type: 'list',
      items: [
        'Open DevTools → Application tab → Local Storage to view all entries',
        'You can edit, add, and delete entries directly in DevTools',
        'Use `localStorage.length` and `localStorage.key(i)` to iterate programmatically',
        'Check available quota: try storing progressively larger strings and catch QuotaExceededError',
        'Remember that private/incognito mode may restrict localStorage access',
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What is the difference between localStorage and sessionStorage?',
        'How do you store objects in localStorage?',
        'What happens when localStorage quota is exceeded?',
        'Can different tabs access the same localStorage data?',
        'Why shouldn\'t you store sensitive data in localStorage?',
        'How would you implement expiring entries in localStorage?',
        'What is the storage event and when does it fire?',
        'How does localStorage differ from cookies?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Always wrap localStorage access in try/catch for safety',
        'Use a typed wrapper function instead of raw getItem/setItem',
        'Never store sensitive data (passwords, tokens, PII) in localStorage',
        'Namespace your keys to avoid collisions: `myapp_theme`, `myapp_user`',
        'Keep stored data small — localStorage is synchronous and blocks the UI',
        'Implement cleanup/migration logic for when your data schema changes',
        'Use the storage event for cross-tab synchronization',
        'Consider IndexedDB for complex or large datasets',
      ],
    },
  ],
};
