import type { LessonContent } from '@/types/content';

export const sessionStorageLesson: LessonContent = {
  id: 'session-storage',
  title: 'Session Storage',
  description: 'Store temporary data that only lasts while the tab is open.',
  slug: 'learn/browser/session-storage',
  pillar: 'learn',
  category: 'browser',
  tags: ['sessionStorage', 'storage', 'browser'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'sessionStorage is like localStorage but only lasts for the current tab. Close the tab, and it\'s gone.',
  relatedTopics: ['local-storage'],
  order: 3,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['sessionStorage', 'tab-scoped', 'temporary storage', 'form wizard', 'scroll restoration'],
  prerequisites: ['Variables & Types'],
  learningGoals: [
    'Understand sessionStorage vs localStorage',
    'Use sessionStorage for temporary tab data',
    'Build multi-step form persistence',
    'Implement scroll position restoration',
    'Handle edge cases and browser differences',
  ],
  exercises: [
    'Store form progress in sessionStorage so it survives page refreshes but not tab closes.',
    'Build a multi-step wizard that saves progress per tab.',
    'Implement scroll position restoration using sessionStorage.',
    'Create a "recently viewed" tracker scoped to the current session.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What Is sessionStorage?', id: 'what-is-session-storage' },
    { type: 'paragraph', text: 'sessionStorage is part of the Web Storage API, sharing the same interface as localStorage. The critical difference: sessionStorage data is scoped to the browser tab (or window) and is automatically cleared when the tab is closed. Each tab gets its own isolated storage, even for the same origin.' },
    { type: 'paragraph', text: 'This makes sessionStorage ideal for temporary state that should survive page navigation and refreshes within a tab, but should not persist after the user closes the tab or be shared between tabs.' },

    { type: 'heading', level: 2, text: 'Basic API', id: 'api' },
    {
      type: 'code', language: 'javascript', filename: 'session-storage.js',
      code: `// Store — identical API to localStorage
sessionStorage.setItem('step', '3');
sessionStorage.setItem('formData', JSON.stringify({ name: 'Alice' }));

// Retrieve
const step = sessionStorage.getItem('step'); // "3"
const formData = JSON.parse(sessionStorage.getItem('formData'));

// Remove specific item
sessionStorage.removeItem('step');

// Clear all sessionStorage for this origin (this tab only)
sessionStorage.clear();

// Count stored items
console.log(sessionStorage.length);

// Get key by index
console.log(sessionStorage.key(0));`,
    },

    { type: 'heading', level: 2, text: 'localStorage vs sessionStorage', id: 'comparison' },
    {
      type: 'table',
      headers: ['Feature', 'localStorage', 'sessionStorage'],
      rows: [
        ['Persistence', 'Until explicitly cleared', 'Until tab/window closes'],
        ['Scope', 'All tabs (same origin)', 'Single tab only'],
        ['Survives refresh', '✅ Yes', '✅ Yes'],
        ['Survives tab close', '✅ Yes', '❌ No'],
        ['Shared between tabs', '✅ Yes', '❌ No'],
        ['Size limit', '~5-10 MB', '~5 MB'],
        ['storage event', '✅ Fires in other tabs', '❌ Same tab only'],
        ['Use case', 'Preferences, cached data', 'Form wizards, temp state'],
      ],
    },

    { type: 'heading', level: 2, text: 'Tab Isolation Behavior', id: 'tab-isolation' },
    { type: 'paragraph', text: 'Each tab has its own sessionStorage. Opening the same URL in a new tab starts with a fresh sessionStorage. However, there\'s an important edge case:' },
    {
      type: 'code', language: 'javascript', filename: 'tab-behavior.js',
      code: `// Tab A: sets a value
sessionStorage.setItem('data', 'Tab A data');

// Tab B (same URL): has empty sessionStorage
sessionStorage.getItem('data'); // null

// EDGE CASE: "Duplicate tab" in Chrome/Firefox
// copies the sessionStorage from the source tab!
// After duplication, each tab is independent.

// Window.open() also copies sessionStorage
const popup = window.open('/page', '_blank');
// The popup gets a COPY of the opener’s sessionStorage

// iframes share the parent’s sessionStorage (same origin)`,
    },
    { type: 'callout', variant: 'warning', title: 'Duplicate Tab Gotcha', text: 'When a user duplicates a tab (Ctrl+Shift+T or right-click → Duplicate), the new tab gets a copy of the original\'s sessionStorage. After that, they\'re independent. This can cause unexpected behavior if you assume each tab starts fresh.' },

    { type: 'heading', level: 2, text: 'Multi-Step Form Wizard', id: 'form-wizard' },
    { type: 'paragraph', text: 'sessionStorage is perfect for multi-step forms: data persists through page navigation and refreshes, but doesn\'t leak into other tabs or persist after the user closes the tab.' },
    {
      type: 'code', language: 'typescript', filename: 'form-wizard.ts',
      code: `interface WizardData {
  step: number;
  personal: { name: string; email: string } | null;
  address: { street: string; city: string; zip: string } | null;
  payment: { cardLast4: string; expiry: string } | null;
}

const WIZARD_KEY = 'checkout_wizard';

function getWizardData(): WizardData {
  const raw = sessionStorage.getItem(WIZARD_KEY);
  if (!raw) {
    return { step: 1, personal: null, address: null, payment: null };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { step: 1, personal: null, address: null, payment: null };
  }
}

function saveWizardStep(stepData: Partial<WizardData>): void {
  const current = getWizardData();
  const updated = { ...current, ...stepData };
  sessionStorage.setItem(WIZARD_KEY, JSON.stringify(updated));
}

function clearWizard(): void {
  sessionStorage.removeItem(WIZARD_KEY);
}

// Usage in step 1
saveWizardStep({
  step: 2,
  personal: { name: 'Alice', email: 'alice@example.com' },
});

// On completion
clearWizard();`,
    },

    { type: 'heading', level: 2, text: 'React Form Wizard', id: 'react-wizard' },
    {
      type: 'code', language: 'tsx', filename: 'CheckoutWizard.tsx',
      code: `function useSessionStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const clear = () => {
    sessionStorage.removeItem(key);
    setValue(initial);
  };

  return [value, setValue, clear] as const;
}

function CheckoutWizard() {
  const [step, setStep] = useSessionStorage('checkout_step', 1);
  const [formData, setFormData, clearForm] = useSessionStorage('checkout_data', {
    name: '', email: '', address: '',
  });

  const handleNext = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    await submitOrder(formData);
    clearForm();
    setStep(1);
  };

  return (
    <div>
      {step === 1 && <PersonalInfoStep data={formData} onNext={handleNext} />}
      {step === 2 && <AddressStep data={formData} onNext={handleNext} />}
      {step === 3 && <ReviewStep data={formData} onSubmit={handleSubmit} />}
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Scroll Position Restoration', id: 'scroll-restoration' },
    {
      type: 'code', language: 'javascript', filename: 'scroll-restore.js',
      code: `// Save scroll position before page unload
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('scrollPos', JSON.stringify({
    x: window.scrollX,
    y: window.scrollY,
  }));
});

// Restore on page load
window.addEventListener('load', () => {
  const saved = sessionStorage.getItem('scrollPos');
  if (saved) {
    const { x, y } = JSON.parse(saved);
    window.scrollTo(x, y);
    sessionStorage.removeItem('scrollPos');
  }
});

// For a specific scrollable container
function saveContainerScroll(container, key) {
  sessionStorage.setItem(key, container.scrollTop.toString());
}

function restoreContainerScroll(container, key) {
  const saved = sessionStorage.getItem(key);
  if (saved) container.scrollTop = parseInt(saved, 10);
}`,
    },

    { type: 'heading', level: 2, text: 'One-Time Notifications', id: 'notifications' },
    {
      type: 'code', language: 'javascript', filename: 'one-time.js',
      code: `// Show a banner once per session
function showSessionBanner(id, message) {
  const dismissed = sessionStorage.getItem(\`banner_\${id}\`);
  if (dismissed) return;

  const banner = createBanner(message, () => {
    sessionStorage.setItem(\`banner_\${id}\`, 'true');
    banner.remove();
  });

  document.body.prepend(banner);
}

// Track page views this session (without persisting long-term)
function trackSessionPageView(page) {
  const views = JSON.parse(sessionStorage.getItem('page_views') || '[]');
  views.push({ page, timestamp: Date.now() });
  sessionStorage.setItem('page_views', JSON.stringify(views));
}

// Show "recently viewed" scoped to current session
function getSessionHistory() {
  return JSON.parse(sessionStorage.getItem('page_views') || '[]');
}`,
    },

    { type: 'heading', level: 2, text: 'Redirect Return URL', id: 'redirect-url' },
    { type: 'paragraph', text: 'A common pattern: save the intended destination before redirecting to login, then restore it after authentication:' },
    {
      type: 'code', language: 'javascript', filename: 'redirect.js',
      code: `// Before redirecting to login
function requireAuth() {
  if (!isLoggedIn()) {
    sessionStorage.setItem('returnUrl', window.location.pathname);
    window.location.href = '/login';
  }
}

// After successful login
function onLoginSuccess() {
  const returnUrl = sessionStorage.getItem('returnUrl') || '/dashboard';
  sessionStorage.removeItem('returnUrl');
  window.location.href = returnUrl;
}`,
    },

    { type: 'heading', level: 2, text: 'When to Use sessionStorage', id: 'when-to-use' },
    {
      type: 'table',
      headers: ['Use Case', 'Why sessionStorage?'],
      rows: [
        ['Multi-step form wizard', 'Survives refresh, clears on tab close'],
        ['Search filters / sort state', 'Per-tab filter state, no cross-tab leakage'],
        ['Redirect return URL', 'Only needed for current navigation flow'],
        ['One-time banners/tooltips', 'Show once per session, reset on new session'],
        ['Scroll position', 'Restore on back navigation, clear on tab close'],
        ['Temporary API cache', 'Fresh data each session, auto-cleanup'],
        ['Debug/logging state', 'Tab-scoped diagnostic info'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Using sessionStorage for data that should persist
sessionStorage.setItem('theme', 'dark');
// Problem: user has to set theme again every time they open a new tab!
// ✅ Fix: Use localStorage for user preferences

// ❌ Mistake 2: Expecting cross-tab sharing
// Tab A:
sessionStorage.setItem('cart', JSON.stringify(cartItems));
// Tab B:
sessionStorage.getItem('cart'); // null — each tab is independent!
// ✅ Fix: Use localStorage if you need cross-tab data

// ❌ Mistake 3: Storing auth tokens in sessionStorage
sessionStorage.setItem('auth_token', token);
// Problem: XSS can read it; and the user loses auth when opening a new tab
// ✅ Fix: Use HTTP-only cookies for auth tokens

// ❌ Mistake 4: Not handling the duplicate-tab edge case
// If user duplicates a tab, both tabs have the same sessionStorage snapshot
// This can cause conflicts in wizard/form state
// ✅ Fix: Add a tab ID and validate it
const TAB_ID = crypto.randomUUID();
sessionStorage.setItem('tab_id', TAB_ID);`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What\'s the difference between localStorage and sessionStorage?',
        'When would you choose sessionStorage over localStorage?',
        'What happens to sessionStorage when you duplicate a tab?',
        'Can sessionStorage be shared between tabs?',
        'Does sessionStorage survive a page refresh?',
        'What are the security implications of storing data in sessionStorage?',
        'How would you implement a multi-step form with sessionStorage?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use sessionStorage for truly temporary, tab-scoped data only',
        'Use localStorage if data should persist across sessions or tabs',
        'Always wrap access in try/catch — it can fail in private mode',
        'Clean up completed wizard data explicitly, don\'t rely on tab close',
        'Namespace keys to avoid collisions: `myapp_wizard_step`',
        'Never store auth tokens or sensitive data in sessionStorage',
        'Be aware of the duplicate-tab behavior when designing your logic',
        'Keep stored data small — sessionStorage is synchronous',
      ],
    },
  ],
};
