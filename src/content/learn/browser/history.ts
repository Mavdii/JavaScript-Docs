import type { LessonContent } from '@/types/content';

export const historyLesson: LessonContent = {
  id: 'history',
  title: 'History API',
  description: 'Manage browser history for single-page apps — update URLs without full page reloads.',
  slug: 'learn/browser/history',
  pillar: 'learn',
  category: 'browser',
  tags: ['history', 'routing', 'navigation', 'SPA'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'The History API lets you update URLs and manage navigation in single-page apps without reloading. pushState, replaceState, and popstate are your friends.',
  relatedTopics: ['fetch'],
  order: 5,
  updatedAt: '2024-03-01',
  readingTime: 14,
  featured: false,
  keywords: ['history', 'pushState', 'replaceState', 'popstate', 'SPA', 'routing', 'Navigation API', 'hash routing'],
  prerequisites: ['DOM Basics', 'Events'],
  learningGoals: [
    'Add and replace history entries',
    'Listen for navigation with popstate',
    'Understand how SPA routers work',
    'Build a minimal client-side router',
    'Know the difference between hash and history routing',
    'Understand the new Navigation API',
  ],
  exercises: [
    'Build a minimal SPA router using the History API.',
    'Implement breadcrumb navigation that syncs with browser history.',
    'Create a tabbed interface where each tab updates the URL.',
    'Build a "back to search results" feature using history state.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Overview', id: 'overview' },
    { type: 'paragraph', text: 'The History API lets JavaScript modify the browser\'s URL and history stack without causing a page reload. This is the foundation of all modern SPA (Single Page Application) routing — libraries like React Router, Vue Router, and Angular Router all use this API under the hood.' },
    { type: 'paragraph', text: 'Before the History API, developers used hash-based routing (`/#/about`) to avoid page reloads. The History API enables clean URLs (`/about`) while keeping the single-page experience.' },

    { type: 'heading', level: 2, text: 'pushState', id: 'pushstate' },
    { type: 'paragraph', text: '`history.pushState()` adds a new entry to the browser\'s history stack. The URL changes, but no page reload occurs. The user can press the back button to return to the previous URL.' },
    {
      type: 'code', language: 'javascript', filename: 'pushstate.js',
      code: `// Signature: history.pushState(state, title, url)
// - state: any serializable data (stored with this history entry)
// - title: mostly ignored by browsers (pass "")
// - url: the new URL (must be same-origin)

// Navigate to /about (adds to history stack)
history.pushState({ page: 'about' }, '', '/about');

// The URL bar now shows /about, but no page reload happened
console.log(location.pathname); // '/about'

// Navigate with complex state
history.pushState({
  page: 'products',
  filters: { category: 'electronics', sort: 'price' },
  scrollPosition: 450,
}, '', '/products?category=electronics&sort=price');

// IMPORTANT: pushState doesn’t trigger popstate!
// It only adds an entry — you must update the UI yourself.
renderPage('about');`,
    },

    { type: 'heading', level: 2, text: 'replaceState', id: 'replacestate' },
    { type: 'paragraph', text: '`replaceState` modifies the current history entry instead of adding a new one. The back button will skip the replaced entry. Use it for URL normalization, filter updates, or state corrections.' },
    {
      type: 'code', language: 'javascript', filename: 'replacestate.js',
      code: `// Replace current entry (user can’t go "back" to the old URL)
history.replaceState({ page: 'home' }, '', '/');

// Common use cases:

// 1. Normalize URL (e.g., redirect /Home to /home)
if (location.pathname !== location.pathname.toLowerCase()) {
  history.replaceState(null, '', location.pathname.toLowerCase());
}

// 2. Update URL with filters without adding history entries
function updateFilters(filters) {
  const params = new URLSearchParams(filters);
  history.replaceState(
    { filters },
    '',
    \`\${location.pathname}?\${params}\`
  );
}

// 3. Remove query params after processing
// URL: /callback?code=abc123
const code = new URLSearchParams(location.search).get('code');
if (code) {
  processAuthCode(code);
  history.replaceState(null, '', location.pathname); // Clean URL
}`,
    },
    { type: 'callout', variant: 'tip', title: 'pushState vs replaceState', text: 'Use `pushState` for real navigation (user expects back button to work). Use `replaceState` for cosmetic URL updates like filter changes, sort order, or URL cleanup.' },

    { type: 'heading', level: 2, text: 'popstate Event', id: 'popstate' },
    { type: 'paragraph', text: 'The `popstate` event fires when the user navigates using the back/forward buttons (or `history.back()`/`history.forward()`). It does NOT fire when you call `pushState` or `replaceState`.' },
    {
      type: 'code', language: 'javascript', filename: 'popstate.js',
      code: `// Listen for back/forward navigation
window.addEventListener('popstate', (event) => {
  console.log('Navigated to:', location.pathname);
  console.log('State:', event.state);

  // event.state contains the data passed to pushState/replaceState
  if (event.state) {
    renderPage(event.state.page);
    if (event.state.scrollPosition) {
      window.scrollTo(0, event.state.scrollPosition);
    }
  } else {
    // null state = initial page load entry
    renderPage('home');
  }
});

// IMPORTANT: popstate fires for back/forward, NOT for pushState
history.pushState({ page: 'about' }, '', '/about'); // No popstate!
history.back(); // popstate fires with state from previous entry`,
    },

    { type: 'heading', level: 2, text: 'Navigation Methods', id: 'navigation' },
    {
      type: 'code', language: 'javascript', filename: 'navigation.js',
      code: `history.back();      // Go back one step (same as browser back button)
history.forward();   // Go forward one step
history.go(-2);      // Go back two steps
history.go(1);       // Go forward one step
history.go(0);       // Reload current page

// Check history length
console.log(history.length);
// NOTE: For privacy, you can’t read the actual URLs in the history stack

// Read current state
console.log(history.state); // The state object for the current entry`,
    },

    { type: 'heading', level: 2, text: 'Building a Minimal Router', id: 'minimal-router' },
    {
      type: 'code', language: 'javascript', filename: 'router.js',
      code: `class Router {
  constructor() {
    this.routes = new Map();
    window.addEventListener('popstate', () => this.handleRoute());
  }

  // Register a route
  on(path, handler) {
    this.routes.set(path, handler);
    return this; // For chaining
  }

  // Navigate to a path
  navigate(path, state = {}) {
    history.pushState(state, '', path);
    this.handleRoute();
  }

  // Handle current route
  handleRoute() {
    const path = location.pathname;
    const handler = this.routes.get(path);

    if (handler) {
      handler(history.state);
    } else {
      // Try to find a parameterized route
      for (const [pattern, handler] of this.routes) {
        const match = this.matchRoute(pattern, path);
        if (match) {
          handler({ ...history.state, params: match });
          return;
        }
      }
      // 404
      this.routes.get('*')?.(history.state);
    }
  }

  // Simple pattern matching (/users/:id)
  matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }
}

// Usage
const router = new Router();

router
  .on('/', () => renderHome())
  .on('/about', () => renderAbout())
  .on('/users/:id', ({ params }) => renderUser(params.id))
  .on('*', () => render404());

// Navigate
router.navigate('/about');

// Handle link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-route]');
  if (link) {
    e.preventDefault();
    router.navigate(link.getAttribute('href'));
  }
});`,
    },

    { type: 'heading', level: 2, text: 'Hash Routing vs History Routing', id: 'hash-vs-history' },
    {
      type: 'table',
      headers: ['Feature', 'Hash Routing', 'History Routing'],
      rows: [
        ['URL format', '/#/about', '/about'],
        ['Server config', 'None needed', 'Must serve index.html for all routes'],
        ['SEO', 'Poor (hash is ignored by servers)', 'Good (real URLs)'],
        ['Browser support', 'All browsers', 'IE 10+'],
        ['API', 'hashchange event', 'pushState / popstate'],
        ['Use case', 'Simple SPAs, static hosting', 'Production apps'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'hash-routing.js',
      code: `// Hash routing (older approach)
window.addEventListener('hashchange', () => {
  const route = location.hash.slice(1); // Remove #
  console.log('Hash route:', route);
  renderPage(route);
});

// Navigate with hash
location.hash = '#/about';
// URL: http://example.com/#/about

// The hash is never sent to the server,
// so no server configuration is needed.`,
    },
    { type: 'callout', variant: 'info', title: 'Server Configuration', text: 'History routing requires the server to return `index.html` for all routes. Without this, refreshing `/about` will return a 404. Most hosting platforms (Vercel, Netlify, etc.) support this with simple configuration.' },

    { type: 'heading', level: 2, text: 'Intercepting Link Clicks', id: 'intercepting-links' },
    {
      type: 'code', language: 'javascript', filename: 'intercept-links.js',
      code: `// SPA link interception — prevent full page reloads for internal links
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a');
  if (!anchor) return;

  // Only intercept same-origin links
  if (anchor.origin !== location.origin) return;

  // Don’t intercept modified clicks (Ctrl+Click = new tab)
  if (event.metaKey || event.ctrlKey || event.shiftKey) return;

  // Don’t intercept download links or target="_blank"
  if (anchor.hasAttribute('download') || anchor.target === '_blank') return;

  event.preventDefault();
  history.pushState(null, '', anchor.href);
  handleRoute();
});`,
    },

    { type: 'heading', level: 2, text: 'Storing State in History', id: 'storing-state' },
    {
      type: 'code', language: 'javascript', filename: 'state-examples.js',
      code: `// Store search results position for "back to results"
function viewProduct(product) {
  // Save current scroll position and page in state
  history.replaceState({
    ...history.state,
    scrollY: window.scrollY,
    page: 'search-results',
  }, '', location.href);

  // Navigate to product
  history.pushState({
    page: 'product',
    productId: product.id,
  }, '', \`/products/\${product.id}\`);

  renderProduct(product.id);
}

// On popstate, restore scroll position
window.addEventListener('popstate', (e) => {
  if (e.state?.scrollY !== undefined) {
    requestAnimationFrame(() => {
      window.scrollTo(0, e.state.scrollY);
    });
  }
});

// ⚠️ State must be serializable (no functions, DOM nodes, classes)
// ❌ This will fail:
history.pushState({ element: document.body }, '', '/');
// ✅ Store identifiers instead:
history.pushState({ elementId: 'main-content' }, '', '/');`,
    },
    { type: 'callout', variant: 'warning', title: 'State Size Limit', text: 'Most browsers limit state objects to ~640KB (serialized). Don\'t store large datasets — store identifiers and fetch data as needed.' },

    { type: 'heading', level: 2, text: 'The Navigation API (Modern)', id: 'navigation-api' },
    { type: 'paragraph', text: 'The new Navigation API (Chrome 102+) is designed to replace the History API with a more powerful, ergonomic interface. It provides navigation interception, transition tracking, and better state management:' },
    {
      type: 'code', language: 'javascript', filename: 'navigation-api.js',
      code: `// Navigation API (Chrome 102+, not yet in Firefox/Safari)
navigation.addEventListener('navigate', (event) => {
  // Intercept all navigation (link clicks, form submits, back/forward)
  if (!event.canIntercept) return;

  const url = new URL(event.destination.url);

  if (url.pathname.startsWith('/app/')) {
    event.intercept({
      handler: async () => {
        const content = await fetchContent(url.pathname);
        renderContent(content);
      },
    });
  }
});

// Navigate programmatically
navigation.navigate('/about');
navigation.navigate('/about', { state: { from: 'home' } });

// Read current state
console.log(navigation.currentEntry.getState());

// Go back/forward
navigation.back();
navigation.forward();

// List all entries
for (const entry of navigation.entries()) {
  console.log(entry.url, entry.getState());
}`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Expecting popstate on pushState
history.pushState({}, '', '/about');
// popstate does NOT fire here — you must update UI manually!

// ✅ Fix: Call your render function after pushState
history.pushState({}, '', '/about');
renderPage('about');

// ❌ Mistake 2: Cross-origin URLs
history.pushState({}, '', 'https://other-site.com/page');
// SecurityError! pushState only works with same-origin URLs

// ❌ Mistake 3: Not handling initial page load
// If user bookmarks /about and opens it directly, popstate won’t fire
// ✅ Fix: Run your route handler on page load too
window.addEventListener('DOMContentLoaded', handleRoute);
window.addEventListener('popstate', handleRoute);

// ❌ Mistake 4: Forgetting server configuration
// User refreshes /about → server returns 404
// ✅ Fix: Configure server to serve index.html for all routes`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What is the difference between pushState and replaceState?',
        'When does the popstate event fire?',
        'How do SPA routers like React Router work under the hood?',
        'What is the difference between hash routing and history routing?',
        'Why does history routing require server configuration?',
        'What are the limitations of the state object in pushState?',
        'How would you build a minimal client-side router?',
        'What is the Navigation API and how does it improve on the History API?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use pushState for real navigation, replaceState for URL cosmetics',
        'Always handle the initial page load route, not just popstate',
        'Configure your server to serve index.html for all SPA routes',
        'Store scroll position in state for "back to results" UX',
        'Intercept link clicks but respect Ctrl/Cmd+Click (new tab)',
        'Keep state objects small and serializable',
        'Consider the Navigation API for new Chrome-only apps',
        'Use a router library (React Router, etc.) instead of building your own in production',
      ],
    },
  ],
};
