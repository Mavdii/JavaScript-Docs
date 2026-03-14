import type { ExploreContent } from '@/types/content';

export const accessibilityExplore: ExploreContent = {
  id: 'explore-accessibility',
  title: 'Accessibility (a11y)',
  description: 'Build inclusive web applications accessible to all users including those with disabilities.',
  slug: 'explore/accessibility',
  pillar: 'explore',
  category: 'tooling',
  tags: ['accessibility', 'a11y', 'aria', 'wcag', 'keyboard navigation'],
  difficulty: 'intermediate',
  contentType: 'library',
  summary: 'Complete guide to web accessibility — ARIA roles and attributes, semantic HTML, keyboard navigation, screen reader support, focus management, and WCAG compliance.',
  relatedTopics: [],
  order: 9,
  updatedAt: '2025-06-01',
  readingTime: 24,
  featured: true,
  keywords: ['accessibility', 'ARIA', 'WCAG', 'screen readers', 'keyboard navigation'],
  items: [
    {
      name: 'WCAG 2.1 Guidelines',
      description: 'Web Content Accessibility Guidelines',
      url: 'https://www.w3.org/WAI/WCAG21/quickref/',
    },
    {
      name: 'WAI-ARIA',
      description: 'Accessible Rich Internet Applications',
      url: 'https://www.w3.org/WAI/ARIA/apg/',
    },
    {
      name: 'axe DevTools',
      description: 'Automated accessibility testing',
      url: 'https://www.deque.com/axe/devtools/',
    },
    {
      name: 'NVDA',
      description: 'Free screen reader for testing',
      url: 'https://www.nvaccess.org',
    },
    {
      name: 'WebAIM',
      description: 'Web accessibility resources',
      url: 'https://webaim.org',
    },
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Semantic HTML Foundation',
      id: 'semantic-html',
    },
    {
      type: 'paragraph',
      text: 'Semantic HTML is the foundation of accessibility. Use native elements with built-in accessibility instead of building custom components from divs.',
    },
    {
      type: 'code',
      language: 'html',
      code: `<!-- ❌ NOT ACCESSIBLE: Generic divs -->
<div class="button" onclick="handleClick()">
  Click me
</div>

<div class="form-field">
  <div class="label">Email</div>
  <input type="text">
</div>

<!-- ✅ ACCESSIBLE: Semantic elements -->
<button onclick="handleClick()">
  Click me
</button>

<label>
  Email
  <input type="email">
</label>

<!-- Better semantic structure -->
<header>
  <h1>Site Title</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h2>Article Title</h2>
    <p>Content here...</p>
  </article>

  <aside>
    <h3>Related</h3>
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>&copy; 2025 Company</p>
</footer>`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'ARIA Roles and Attributes',
      id: 'aria',
    },
    {
      type: 'paragraph',
      text: 'ARIA (Accessible Rich Internet Applications) enhances semantics when native HTML elements aren\'t sufficient. But always prefer native elements first.',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// ❌ Don't do this unless necessary
<div role="button" onClick={handleClick}>
  Click me
</div>

// ✅ Do this instead (native button)
<button onClick={handleClick}>
  Click me
</button>

// Modals with ARIA
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function Modal({ isOpen, onClose, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal"
    >
      <h2 id="modal-title">{title}</h2>
      <button
        onClick={onClose}
        aria-label="Close modal"
      >
        ✕
      </button>
    </div>
  );
}

// Alert boxes
<div
  role="alert"
  aria-live="polite"
  className="notification success"
>
  Your changes have been saved!
</div>

// Dynamic content updates
<div
  role="status"
  aria-live="assertive"
  aria-atomic="true"
>
  {loadingMessage}
</div>

// Form validation
<input
  type="email"
  aria-required="true"
  aria-invalid={!isValidEmail}
  aria-describedby="email-error"
/>
{!isValidEmail && (
  <span id="email-error" className="error">
    Please enter a valid email
  </span>
)}

// Complex widgets: Dropdown
interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

function Dropdown({ options, value, onChange, label }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="dropdown">
      <label htmlFor="dropdown-button">{label}</label>

      <button
        id="dropdown-button"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
      >
        {value}
      </button>

      {isOpen && (
        <ul
          id="dropdown-list"
          role="listbox"
          aria-labelledby="dropdown-button"
        >
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Keyboard Navigation',
      id: 'keyboard-navigation',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Make elements keyboard accessible
function useKeyboardNavigation(items: HTMLElement[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + items.length) % items.length);
          break;

        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % items.length);
          break;

        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setActiveIndex(items.length - 1);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          items[activeIndex]?.click();
          break;

        case 'Escape':
          // Close menu or dialog
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items]);

  return activeIndex;
}

// Focus management for modals
function useFocusManager(isOpen: boolean, triggerRef: React.RefObject<HTMLElement>) {
  const contentRef = useRef<HTMLElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Move focus into modal
    firstFocusableRef.current?.focus();

    // Trap focus within modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const firstElement = firstFocusableRef.current;
      const lastElement = lastFocusableRef.current;

      if (e.shiftKey) {
        // Shift+Tab on first element, focus last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab on last element, focus first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    contentRef.current?.addEventListener('keydown', handleKeyDown);

    return () => {
      contentRef.current?.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus(); // Restore focus when modal closes
    };
  }, [isOpen]);

  return { contentRef, firstFocusableRef, lastFocusableRef };
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Screen Reader Support',
      id: 'screen-reader',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Announce dynamic content to screen readers
function useAnnouncement() {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = (message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message;
    }
  };

  return { announce, announceRef };
}

function SearchResults({ results, isLoading }: any) {
  const { announce, announceRef } = useAnnouncement();

  useEffect(() => {
    if (isLoading) {
      announce('Searching...');
    } else {
      announce(\`Found \${results.length} results\`);
    }
  }, [results, isLoading]);

  return (
    <>
      {/* Announcement region for screen readers */}
      <div ref={announceRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      {isLoading && <p>Searching...</p>}

      {results.length === 0 && !isLoading && (
        <p>No results found</p>
      )}

      {results.length > 0 && (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <a href={result.url}>{result.title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// Skip links for keyboard users
function SkipLinks() {
  return (
    <div className="sr-only">
      <a href="#main-content">Skip to main content</a>
    </div>
  );
}

function App() {
  return (
    <>
      <SkipLinks />
      <header>Navigation</header>
      <main id="main-content">Content</main>
    </>
  );
}

// CSS for screen-reader-only content
const srOnlyStyles = \`
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
\`;`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Color Contrast & Visual Accessibility',
      id: 'visual-accessibility',
    },
    {
      type: 'code',
      language: 'css',
      code: `/* WCAG AA requires 4.5:1 contrast for normal text */
/* WCAG AAA requires 7:1 contrast for normal text */

/* ❌ Insufficient contrast */
.bad {
  color: #999;
  background: #f5f5f5;
  /* Contrast ratio: ~2.5:1 */
}

/* ✅ WCAG AA compliant */
.good {
  color: #333;
  background: #f5f5f5;
  /* Contrast ratio: ~8.5:1 */
}

/* Don't rely on color alone */
/* ❌ Bad: only color distinguishes status */
.status-success { color: green; }
.status-error { color: red; }

/* ✅ Good: color + icon + text */
.status-success::before { content: '✓ '; }
.status-success { color: green; }

.status-error::before { content: '✕ '; }
.status-error { color: red; }

/* Focus indicators */
button {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

/* Never remove focus indicators! */
*:focus {
  outline: 2px solid #4A90E2;
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Support high contrast mode */
@media (prefers-contrast: more) {
  button {
    border: 2px solid currentColor;
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Testing for Accessibility',
      id: 'testing',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('has proper heading hierarchy', () => {
    render(<Page />);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();

    // Check that h2 comes after h1
    const headings = screen.getAllByRole('heading');
    const h1Index = headings.indexOf(h1);
    const h2Index = headings.findIndex((h) => h.tagName === 'H2');

    expect(h2Index).toBeGreaterThan(h1Index);
  });

  it('has accessible form labels', () => {
    render(<Form />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('has accessible button text', () => {
    render(<Component />);

    // ❌ Bad: no accessible text
    // screen.getByRole('button', { name: '' });

    // ✅ Good: descriptive text
    const button = screen.getByRole('button', { name: /save changes/i });
    expect(button).toBeInTheDocument();
  });

  it('announces dynamic updates', async () => {
    const { rerender } = render(
      <LiveRegion message="" />
    );

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');

    rerender(<LiveRegion message="Updated!" />);
    expect(region).toHaveTextContent('Updated!');
  });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'WCAG Compliance Checklist',
      id: 'wcag-checklist',
    },
    {
      type: 'list',
      items: [
        'Use semantic HTML (not divs for everything)',
        'Ensure sufficient color contrast (4.5:1 minimum)',
        'Don\'t rely on color alone to convey information',
        'Use proper heading hierarchy (h1, h2, h3...)',
        'Associate labels with form inputs',
        'Provide alt text for images',
        'Support keyboard navigation',
        'Make focus indicators visible',
        'Test with screen readers (NVDA, JAWS, VoiceOver)',
        'Respect prefers-reduced-motion',
        'Use ARIA for complex widgets',
        'Announce dynamic content changes',
        'Provide skip links',
        'Ensure links have descriptive text',
        'Add captions to videos',
      ],
    },
  ],
};
