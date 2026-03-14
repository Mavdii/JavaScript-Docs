import type { ContentSummary } from '@/types/content';

// ─── Navigation Types ────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavSection {
  label: string;
  href: string;
  groups: NavGroup[];
}

export interface SidebarItem {
  label: string;
  href: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

export interface ResolvedNavItem extends NavItem {
  status: 'available' | 'coming-soon';
  entry?: ContentSummary;
}

export interface ResolvedNavGroup {
  label: string;
  items: ResolvedNavItem[];
}

export interface ResolvedNavSection {
  label: string;
  href: string;
  groups: ResolvedNavGroup[];
}

export interface ResolvedSidebarItem extends SidebarItem {
  status: 'available' | 'coming-soon';
  entry?: ContentSummary;
}

export interface ResolvedSidebarGroup {
  label: string;
  items: ResolvedSidebarItem[];
  defaultOpen?: boolean;
}

// ─── Top Navigation (Mega Menu) ──────────────────────────────────

export const topNavigation: NavSection[] = [
  {
    label: 'Learn',
    href: '/learn',
    groups: [
      {
        label: 'Fundamentals',
        items: [
          { label: 'Variables & Types', href: '/learn/fundamentals/variables' },
          { label: 'Functions', href: '/learn/fundamentals/functions' },
          { label: 'Scope', href: '/learn/fundamentals/scope' },
          { label: 'Arrays', href: '/learn/fundamentals/arrays' },
          { label: 'Type Coercion & Equality', href: '/learn/fundamentals/type-coercion' },
          { label: 'Maps & Sets', href: '/learn/fundamentals/maps-sets' },
          { label: 'Modules (ESM vs CJS)', href: '/learn/fundamentals/modules-esm-cjs' },
          { label: 'Generators & Iterators', href: '/learn/fundamentals/generators' },
        ],
      },
      {
        label: 'Advanced',
        items: [
          { label: 'Closures', href: '/learn/advanced/closures' },
          { label: 'Prototypes', href: '/learn/advanced/prototypes' },
          { label: 'this Keyword', href: '/learn/advanced/this-keyword' },
          { label: 'Execution Context', href: '/learn/advanced/execution-context' },
          { label: 'Memory Leaks Management', href: '/learn/advanced/memory-leaks' },
          { label: 'Proxy & Reflect', href: '/learn/advanced/proxy-reflect' },
          { label: 'Design Patterns', href: '/learn/advanced/design-patterns' },
          { label: 'Garbage Collection', href: '/learn/advanced/garbage-collection' },
        ],
      },
      {
        label: 'Async Programming',
        items: [
          { label: 'Event Loop', href: '/learn/async/event-loop' },
          { label: 'Promises', href: '/learn/async/promises' },
          { label: 'Async/Await', href: '/learn/async/async-await' },
          { label: 'Web Workers', href: '/learn/async/web-workers' },
          { label: 'Service Workers', href: '/learn/async/service-workers' },
          { label: 'Microtasks vs Macrotasks', href: '/learn/async/micro-macro-tasks' },
          { label: 'AbortController', href: '/learn/async/abort-controller' },
        ],
      },
      {
        label: 'Browser APIs',
        items: [
          { label: 'Fetch API', href: '/learn/browser/fetch' },
          { label: 'Local Storage', href: '/learn/browser/local-storage' },
          { label: 'WebSockets', href: '/learn/browser/websockets' },
          { label: 'IndexedDB', href: '/learn/browser/indexeddb' },
          { label: 'Web Crypto API', href: '/learn/browser/web-crypto' },
          { label: 'Intersection Observer', href: '/learn/browser/intersection-observer' },
          { label: 'Pointer Events', href: '/learn/browser/pointer-events' },
        ],
      },
    ],
  },
  {
    label: 'Reference',
    href: '/reference',
    groups: [
      {
        label: 'Array Methods',
        items: [
          { label: 'map()', href: '/reference/array/map', description: 'Transform array elements' },
          { label: 'filter()', href: '/reference/array/filter', description: 'Filter array elements' },
          { label: 'reduce()', href: '/reference/array/reduce', description: 'Reduce to single value' },
          { label: 'flat() & flatMap()', href: '/reference/array/flat-flatmap', description: 'Flatten nested arrays' },
          { label: 'Typed Arrays', href: '/reference/array/typed-arrays', description: 'Binary data buffers' },
        ],
      },
      {
        label: 'String & Math Methods',
        items: [
          { label: 'split()', href: '/reference/string/split', description: 'Split into array' },
          { label: 'replace() & replaceAll()', href: '/reference/string/replace', description: 'Replace substrings' },
          { label: 'includes()', href: '/reference/string/includes', description: 'Check for substring' },
          { label: 'Math API Deep Dive', href: '/reference/math/deep-dive', description: 'Advanced calculations' },
          { label: 'RegExp Deep Dive', href: '/reference/regexp/deep-dive', description: 'Pattern matching' },
        ],
      },
      {
        label: 'Object & Globals',
        items: [
          { label: 'Object.keys() / values()', href: '/reference/object/keys', description: 'Get property iterables' },
          { label: 'Object.entries() / fromEntries()', href: '/reference/object/entries', description: 'Key-value pairs' },
          { label: 'Intl API (i18n)', href: '/reference/globals/intl', description: 'Internationalization formatting' },
          { label: 'Date & Time (Temporal)', href: '/reference/globals/temporal', description: 'Modern Date handling' },
          { label: 'URL & URLSearchParams', href: '/reference/globals/url', description: 'Parsing Web URLs' },
        ],
      },
    ],
  },
  {
    label: 'Integrations',
    href: '/integrations',
    groups: [
      {
        label: 'APIs & Services',
        items: [
          { label: 'REST APIs', href: '/integrations/rest-apis' },
          { label: 'GraphQL APIs', href: '/integrations/graphql' },
          { label: 'OpenAI / AI APIs', href: '/integrations/openai' },
          { label: 'Telegram', href: '/integrations/telegram' },
          { label: 'YouTube', href: '/integrations/youtube' },
          { label: 'Stripe API', href: '/integrations/stripe' },
          { label: 'GraphQL / Apollo', href: '/integrations/graphql' },
          { label: 'OpenAI SDK', href: '/integrations/openai' },
        ],
      },
      {
        label: 'Auth & Communication',
        items: [
          { label: 'OAuth & JWT', href: '/integrations/oauth' },
          { label: 'Payments', href: '/integrations/payments' },
          { label: 'Realtime (Socket.io)', href: '/integrations/realtime' },
          { label: 'WebRTC (Audio/Video)', href: '/integrations/webrtc' },
          { label: 'Firebase', href: '/integrations/firebase' },
          { label: 'Push Notifications', href: '/integrations/push-notifications' },
        ],
      },
    ],
  },
  {
    label: 'Recipes',
    href: '/recipes',
    groups: [
      {
        label: 'UI Patterns',
        items: [
          { label: 'Form Validation', href: '/recipes/form-validation' },
          { label: 'Search UI', href: '/recipes/search-ui' },
          { label: 'Infinite Scroll', href: '/recipes/infinite-scroll' },
          { label: 'Pagination', href: '/recipes/pagination' },
          { label: 'Drag & Drop Interfaces', href: '/recipes/drag-and-drop' },
          { label: 'Dark Mode Toggles', href: '/recipes/dark-mode' },
          { label: 'Virtualized Lists (Windowing)', href: '/recipes/virtualized-lists' },
          { label: 'Skeleton Loaders', href: '/recipes/skeleton-loaders' },
        ],
      },
      {
        label: 'State & Performance',
        items: [
          { label: 'Debouncing & Throttling', href: '/recipes/debouncing' },
          { label: 'API Retries & Exponential Backoff', href: '/recipes/api-retries' },
          { label: 'Error Fallback UX', href: '/recipes/error-fallback' },
          { label: 'Global State Management', href: '/recipes/global-state' },
          { label: 'Image Lazy Loading', href: '/recipes/image-lazy-loading' },
          { label: 'Complex Routing & Guards', href: '/recipes/route-guards' },
        ],
      },
    ],
  },
  {
    label: 'Projects',
    href: '/projects',
    groups: [
      {
        label: 'Build Practical Apps',
        items: [
          { label: 'Chat Application', href: '/projects/chat-app' },
          { label: 'Admin Dashboard', href: '/projects/admin-dashboard' },
          { label: 'Notes App', href: '/projects/notes-app' },
          { label: 'Analytics Dashboard', href: '/projects/analytics-dashboard' },
          { label: 'Kanban Board (Drag/Drop)', href: '/projects/kanban-board' },
          { label: 'E-commerce Cart Logic', href: '/projects/ecommerce-cart' },
          { label: 'Real-time Collaborative Editor', href: '/projects/collaborative-editor' },
          { label: 'Music Player Clone', href: '/projects/music-player' },
        ],
      },
    ],
  },
  {
    label: 'Explore',
    href: '/explore',
    groups: [
      {
        label: 'Ecosystem',
        items: [
          { label: 'Libraries & Frameworks', href: '/explore/libraries' },
          { label: 'Public APIs', href: '/explore/apis' },
          { label: 'Build Tooling (Vite/Webpack)', href: '/explore/tooling' },
          { label: 'Testing (Vitest/Playwright)', href: '/explore/testing' },
          { label: 'CI/CD for JS Apps', href: '/explore/ci-cd' },
          { label: 'Monorepos (Turborepo)', href: '/explore/monorepos' },
        ],
      },
      {
        label: 'Resources & Security',
        items: [
          { label: 'Glossary', href: '/explore/glossary' },
          { label: 'Ecosystem Comparisons', href: '/explore/comparisons' },
          { label: 'Common Errors & Gotchas', href: '/errors' },
          { label: 'Security (XSS / CSRF)', href: '/explore/security' },
          { label: 'Accessibility (A11y)', href: '/explore/accessibility' },
          { label: 'Web Vitals & SEO', href: '/explore/web-vitals' },
        ],
      },
    ],
  },
];

// ─── Sidebar Configuration (per pillar) ──────────────────────────

export const sidebarConfig: Record<string, SidebarGroup[]> = {
  learn: [
    {
      label: 'Fundamentals',
      defaultOpen: true,
      items: [
        { label: 'Variables & Types', href: '/learn/fundamentals/variables' },
        { label: 'Operators', href: '/learn/fundamentals/operators' },
        { label: 'Functions', href: '/learn/fundamentals/functions' },
        { label: 'Scope', href: '/learn/fundamentals/scope' },
        { label: 'Arrays', href: '/learn/fundamentals/arrays' },
        { label: 'Objects', href: '/learn/fundamentals/objects' },
        { label: 'Loops', href: '/learn/fundamentals/loops' },
        { label: 'DOM Basics', href: '/learn/fundamentals/dom' },
        { label: 'Events', href: '/learn/fundamentals/events' },
        { label: 'Modules', href: '/learn/fundamentals/modules' },
        { label: 'Error Handling', href: '/learn/fundamentals/error-handling' },
        { label: 'Type Coercion & Equality', href: '/learn/fundamentals/type-coercion' },
        { label: 'Maps & Sets', href: '/learn/fundamentals/maps-sets' },
        { label: 'Modules (ESM vs CJS)', href: '/learn/fundamentals/modules-esm-cjs' },
        { label: 'Generators & Iterators', href: '/learn/fundamentals/generators' },
      ],
    },
    {
      label: 'Advanced JavaScript',
      defaultOpen: false,
      items: [
        { label: 'Closures', href: '/learn/advanced/closures' },
        { label: 'Prototypes', href: '/learn/advanced/prototypes' },
        { label: 'this Keyword', href: '/learn/advanced/this-keyword' },
        { label: 'Execution Context', href: '/learn/advanced/execution-context' },
        { label: 'Functional Patterns', href: '/learn/advanced/functional-patterns' },
        { label: 'Memory & Performance', href: '/learn/advanced/memory-performance' },
        { label: 'Memory Leaks', href: '/learn/advanced/memory-leaks' },
        { label: 'Proxy & Reflect', href: '/learn/advanced/proxy-reflect' },
        { label: 'Design Patterns', href: '/learn/advanced/design-patterns' },
        { label: 'Garbage Collection', href: '/learn/advanced/garbage-collection' },
      ],
    },
    {
      label: 'Async Programming',
      defaultOpen: false,
      items: [
        { label: 'Event Loop', href: '/learn/async/event-loop' },
        { label: 'Callbacks', href: '/learn/async/callbacks' },
        { label: 'Promises', href: '/learn/async/promises' },
        { label: 'Async/Await', href: '/learn/async/async-await' },
        { label: 'Concurrency', href: '/learn/async/concurrency' },
        { label: 'Web Workers', href: '/learn/async/web-workers' },
        { label: 'Service Workers', href: '/learn/async/service-workers' },
        { label: 'Microtasks vs Macrotasks', href: '/learn/async/micro-macro-tasks' },
        { label: 'AbortController', href: '/learn/async/abort-controller' },
      ],
    },
    {
      label: 'Browser APIs',
      defaultOpen: false,
      items: [
        { label: 'Fetch API', href: '/learn/browser/fetch' },
        { label: 'Local Storage', href: '/learn/browser/local-storage' },
        { label: 'Session Storage', href: '/learn/browser/session-storage' },
        { label: 'Clipboard API', href: '/learn/browser/clipboard' },
        { label: 'History API', href: '/learn/browser/history' },
        { label: 'Geolocation', href: '/learn/browser/geolocation' },
        { label: 'Intersection Observer', href: '/learn/browser/intersection-observer' },
        { label: 'WebSockets', href: '/learn/browser/websockets' },
        { label: 'Notifications', href: '/learn/browser/notifications' },
        { label: 'File APIs', href: '/learn/browser/file-apis' },
        { label: 'IndexedDB', href: '/learn/browser/indexeddb' },
        { label: 'Web Crypto API', href: '/learn/browser/web-crypto' },
        { label: 'Pointer Events', href: '/learn/browser/pointer-events' },
      ],
    },
  ],
  reference: [
    {
      label: 'Array Methods',
      defaultOpen: true,
      items: [
        { label: 'map()', href: '/reference/array/map' },
        { label: 'filter()', href: '/reference/array/filter' },
        { label: 'reduce()', href: '/reference/array/reduce' },
        { label: 'forEach()', href: '/reference/array/foreach' },
        { label: 'find()', href: '/reference/array/find' },
        { label: 'some() / every()', href: '/reference/array/some-every' },
        { label: 'flat() / flatMap()', href: '/reference/array/flat' },
        { label: 'flat-flatmap()', href: '/reference/array/flat-flatmap' },
        { label: 'Typed Arrays', href: '/reference/array/typed-arrays' },
        { label: 'sort()', href: '/reference/array/sort' },
        { label: 'slice() / splice()', href: '/reference/array/slice-splice' },
      ],
    },
    {
      label: 'String Methods',
      defaultOpen: false,
      items: [
        { label: 'split()', href: '/reference/string/split' },
        { label: 'replace()', href: '/reference/string/replace' },
        { label: 'match()', href: '/reference/string/match' },
        { label: 'includes()', href: '/reference/string/includes' },
        { label: 'trim()', href: '/reference/string/trim' },
      ],
    },
    {
      label: 'Object Methods',
      defaultOpen: false,
      items: [
        { label: 'Object.keys()', href: '/reference/object/keys' },
        { label: 'Object.values()', href: '/reference/object/values' },
        { label: 'Object.entries()', href: '/reference/object/entries' },
        { label: 'Object.assign()', href: '/reference/object/assign' },
        { label: 'Object.freeze()', href: '/reference/object/freeze' },
    ],
  },
  {
    label: 'Math & RegExp',
    defaultOpen: false,
    items: [
        { label: 'Math API Deep Dive', href: '/reference/math/deep-dive' },
        { label: 'RegExp Deep Dive', href: '/reference/regexp/deep-dive' },
    ],
  },
  {
    label: 'Globals & APIs',
    defaultOpen: false,
    items: [
        { label: 'Intl API (i18n)', href: '/reference/globals/intl' },
        { label: 'Date & Time (Temporal)', href: '/reference/globals/temporal' },
        { label: 'URL & URLSearchParams', href: '/reference/globals/url' },
      ],
    },
  ],
  recipes: [
    {
      label: 'UI Patterns',
      defaultOpen: true,
      items: [
        { label: 'Form Validation', href: '/recipes/form-validation' },
        { label: 'File Upload', href: '/recipes/file-upload' },
        { label: 'Pagination', href: '/recipes/pagination' },
        { label: 'Search UI', href: '/recipes/search-ui' },
        { label: 'Infinite Scroll', href: '/recipes/infinite-scroll' },
        { label: 'Drag & Drop Interfaces', href: '/recipes/drag-and-drop' },
        { label: 'Dark Mode Toggles', href: '/recipes/dark-mode' },
        { label: 'Virtualized Lists', href: '/recipes/virtualized-lists' },
        { label: 'Skeleton Loaders', href: '/recipes/skeleton-loaders' },
      ],
    },
    {
      label: 'Performance',
      defaultOpen: false,
      items: [
        { label: 'Debouncing & Throttling', href: '/recipes/debouncing' },
        { label: 'API Retries', href: '/recipes/api-retries' },
        { label: 'Error Fallback UX', href: '/recipes/error-fallback' },
        { label: 'Global State Management', href: '/recipes/global-state' },
        { label: 'Image Lazy Loading', href: '/recipes/image-lazy-loading' },
        { label: 'Route Guards', href: '/recipes/route-guards' },
      ],
    },
    {
      label: 'Data Patterns',
      defaultOpen: false,
      items: [
        { label: 'Realtime Updates', href: '/recipes/realtime-updates' },
        { label: 'Dashboard Patterns', href: '/recipes/dashboard-patterns' },
        { label: 'Auth UI Patterns', href: '/recipes/auth-ui-patterns' },
      ],
    },
  ],
  integrations: [
    {
      label: 'APIs & Services',
      defaultOpen: true,
      items: [
        { label: 'REST APIs', href: '/integrations/rest-apis' },
        { label: 'Telegram', href: '/integrations/telegram' },
        { label: 'YouTube', href: '/integrations/youtube' },
      ],
    },
    {
      label: 'Auth & Payments',
      defaultOpen: false,
      items: [
        { label: 'OAuth', href: '/integrations/oauth' },
        { label: 'Payments', href: '/integrations/payments' },
        { label: 'Stripe Payments', href: '/integrations/stripe' },
        { label: 'Authentication Flows', href: '/integrations/auth-flows' },
        { label: 'Realtime Systems', href: '/integrations/realtime' },
        { label: 'WebRTC & Peer Connections', href: '/integrations/webrtc' },
        { label: 'Firebase & BaaS', href: '/integrations/firebase' },
        { label: 'Push Notifications', href: '/integrations/push-notifications' },
      ],
    },
  ],
  projects: [
    {
      label: 'Applications',
      defaultOpen: true,
      items: [
        { label: 'Telegram Bot Dashboard', href: '/projects/telegram-bot' },
        { label: 'YouTube Search App', href: '/projects/youtube-search' },
        { label: 'Chat Application', href: '/projects/chat-app' },
        { label: 'Admin Dashboard', href: '/projects/admin-dashboard' },
        { label: 'Notes App', href: '/projects/notes-app' },
        { label: 'Analytics Dashboard', href: '/projects/analytics-dashboard' },
        { label: 'API-driven CRUD App', href: '/projects/crud-app' },
        { label: 'Kanban Board App', href: '/projects/kanban-board' },
        { label: 'E-Commerce Cart', href: '/projects/ecommerce-cart' },
        { label: 'Collaborative Text Editor', href: '/projects/collaborative-editor' },
        { label: 'Music Player', href: '/projects/music-player' },
      ],
    },
  ],
  explore: [
    {
      label: 'Directories',
      defaultOpen: true,
      items: [
        { label: 'Libraries', href: '/explore/libraries' },
        { label: 'APIs', href: '/explore/apis' },
        { label: 'Tooling', href: '/explore/tooling' },
      ],
    },
    {
      label: 'Resources',
      defaultOpen: false,
      items: [
        { label: 'Glossary', href: '/explore/glossary' },
        { label: 'Comparisons', href: '/explore/comparisons' },
        { label: 'Testing Ecosystem', href: '/explore/testing' },
        { label: 'CI/CD for JavaScript', href: '/explore/ci-cd' },
        { label: 'JavaScript Security', href: '/explore/security' },
        { label: 'Accessibility (a11y)', href: '/explore/accessibility' },
        { label: 'Web Vitals & Performance', href: '/explore/web-vitals' },
      ],
    },
  ],
  errors: [
    {
      label: 'Error Types',
      defaultOpen: true,
      items: [
        { label: 'Common JS Errors', href: '/errors/common' },
        { label: 'Async Mistakes', href: '/errors/async' },
        { label: 'DOM Mistakes', href: '/errors/dom' },
        { label: 'API Integration', href: '/errors/api' },
      ],
    },
    {
      label: 'Debugging',
      defaultOpen: false,
      items: [
        { label: 'Debugging Guides', href: '/errors/debugging' },
      ],
    },
  ],
};

// ─── Utility ─────────────────────────────────────────────────────

export function getPillarFromPath(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  return segments[0] || null;
}
