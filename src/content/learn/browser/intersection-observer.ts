import type { LessonContent } from '@/types/content';

export const intersectionObserverLesson: LessonContent = {
  id: 'intersection-observer',
  title: 'Intersection Observer',
  description: 'Know when elements enter the viewport — perfect for lazy loading and scroll animations.',
  slug: 'learn/browser/intersection-observer',
  pillar: 'learn',
  category: 'browser',
  tags: ['intersection-observer', 'lazy-loading', 'scroll', 'performance'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'IntersectionObserver watches when elements become visible on screen. It\'s way better than spamming scroll event listeners.',
  relatedTopics: ['events', 'memory-performance'],
  order: 7,
  updatedAt: '2024-03-01',
  readingTime: 16,
  featured: false,
  keywords: ['IntersectionObserver', 'lazy load', 'viewport', 'scroll', 'infinite scroll', 'fade in', 'sticky', 'analytics'],
  prerequisites: ['DOM Basics', 'Callbacks'],
  learningGoals: [
    'Create and configure an IntersectionObserver',
    'Implement lazy loading images',
    'Build scroll-triggered animations',
    'Track element visibility for analytics',
    'Implement infinite scrolling',
    'Use IntersectionObserver in React',
  ],
  exercises: [
    'Implement lazy loading for images using IntersectionObserver.',
    'Create a "fade in on scroll" animation.',
    'Build an infinite scroll list that loads more items.',
    'Implement a "reading progress" indicator using IntersectionObserver.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What Is IntersectionObserver?', id: 'what-is-io' },
    { type: 'paragraph', text: 'IntersectionObserver is a browser API that asynchronously detects when an element enters or leaves the viewport (or a specified container). Before this API, developers used scroll event listeners with `getBoundingClientRect()`, which is expensive and causes layout thrashing.' },
    { type: 'paragraph', text: 'Use cases include: lazy loading images/iframes, infinite scrolling, scroll-triggered animations, ad impression tracking, sticky header detection, and element visibility analytics.' },

    { type: 'heading', level: 2, text: 'Basic Usage', id: 'basic-usage' },
    {
      type: 'code', language: 'javascript', filename: 'observer.js',
      code: `// Create an observer with a callback
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry.target.id, {
      isIntersecting: entry.isIntersecting,   // Is element visible?
      intersectionRatio: entry.intersectionRatio, // 0 to 1
      boundingClientRect: entry.boundingClientRect,
    });

    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Stop watching after first trigger
    }
  });
}, {
  threshold: 0.1,       // Trigger when 10% visible
  rootMargin: '50px',   // Start 50px before entering viewport
});

// Observe elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// Stop observing a specific element
observer.unobserve(element);

// Stop observing everything
observer.disconnect();`,
    },

    { type: 'heading', level: 2, text: 'Configuration Options', id: 'options' },
    {
      type: 'table',
      headers: ['Option', 'Default', 'Type', 'Description'],
      rows: [
        ['root', 'viewport', 'Element | null', 'Scrollable ancestor to observe against'],
        ['rootMargin', '"0px"', 'string', 'Margin around root (CSS-like: "10px 20px 30px 40px")'],
        ['threshold', '0', 'number | number[]', 'Visibility ratio(s) to trigger callback (0 to 1)'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'options.js',
      code: `// Trigger at multiple visibility thresholds
const observer = new IntersectionObserver(callback, {
  threshold: [0, 0.25, 0.5, 0.75, 1.0],
  // Fires at 0%, 25%, 50%, 75%, and 100% visibility
});

// Observe within a scrollable container (not viewport)
const scrollContainer = document.getElementById('scroll-area');
const containerObserver = new IntersectionObserver(callback, {
  root: scrollContainer,
  rootMargin: '0px',
  threshold: 0.5,
});

// Load content 200px before it enters viewport (preloading)
const preloadObserver = new IntersectionObserver(callback, {
  rootMargin: '200px 0px', // 200px top/bottom margin
  threshold: 0,
});`,
    },
    { type: 'callout', variant: 'info', title: 'rootMargin', text: '`rootMargin` works like CSS margin: "top right bottom left". Use positive values to trigger BEFORE the element reaches the viewport (preloading). Use negative values to trigger when the element is well inside the viewport.' },

    { type: 'heading', level: 2, text: 'Lazy Loading Images', id: 'lazy-loading' },
    {
      type: 'code', language: 'html', filename: 'lazy-images.html',
      code: `<!-- HTML: Use data-src instead of src -->
<img data-src="photo-large.jpg" class="lazy" alt="Photo" width="800" height="600">
<img data-src="banner.jpg" class="lazy" alt="Banner" width="1200" height="400">`,
    },
    {
      type: 'code', language: 'javascript', filename: 'lazy-images.js',
      code: `const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;

      // Set the real src
      img.src = img.dataset.src;

      // Optional: load srcset for responsive images
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }

      // Handle load/error events
      img.onload = () => img.classList.add('loaded');
      img.onerror = () => img.classList.add('error');

      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '200px 0px', // Start loading 200px before visible
  threshold: 0,
});

// Observe all lazy images
document.querySelectorAll('img.lazy').forEach(img => {
  imageObserver.observe(img);
});`,
    },
    {
      type: 'code', language: 'css', filename: 'lazy-styles.css',
      code: `.lazy {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.lazy.loaded {
  opacity: 1;
}
.lazy.error {
  /* Show broken image placeholder */
  background: #f0f0f0;
}`,
    },
    { type: 'callout', variant: 'tip', title: 'Native Lazy Loading', text: 'Modern browsers support `<img loading="lazy">` natively. Use IntersectionObserver only when you need: custom threshold/margin, fade-in animations, or analytics tracking.' },

    { type: 'heading', level: 2, text: 'Scroll-Triggered Animations', id: 'scroll-animations' },
    {
      type: 'code', language: 'javascript', filename: 'animate-on-scroll.js',
      code: `// Fade in elements as they scroll into view
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const animation = el.dataset.animation || 'fadeInUp';
      el.classList.add('animate', animation);
      animationObserver.unobserve(el);
    }
  });
}, {
  threshold: 0.15, // Trigger when 15% visible
  rootMargin: '0px 0px -50px 0px', // Trigger 50px after top enters viewport
});

document.querySelectorAll('[data-animation]').forEach(el => {
  animationObserver.observe(el);
});`,
    },
    {
      type: 'code', language: 'css', filename: 'animations.css',
      code: `/* Initial state: hidden */
[data-animation] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Animated state */
[data-animation].animate {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
[data-animation].animate:nth-child(2) { transition-delay: 0.1s; }
[data-animation].animate:nth-child(3) { transition-delay: 0.2s; }
[data-animation].animate:nth-child(4) { transition-delay: 0.3s; }`,
    },

    { type: 'heading', level: 2, text: 'Infinite Scrolling', id: 'infinite-scroll' },
    {
      type: 'code', language: 'javascript', filename: 'infinite-scroll.js',
      code: `// Watch a sentinel element at the bottom of the list
const sentinel = document.getElementById('scroll-sentinel');
let page = 1;
let loading = false;

const scrollObserver = new IntersectionObserver(async (entries) => {
  const entry = entries[0];
  if (entry.isIntersecting && !loading) {
    loading = true;
    showLoadingSpinner();

    try {
      const newItems = await fetchItems(++page);
      if (newItems.length === 0) {
        scrollObserver.disconnect(); // No more items
        showEndMessage();
        return;
      }
      appendItems(newItems);
    } catch (err) {
      page--; // Retry on next intersection
      showError(err);
    } finally {
      loading = false;
      hideLoadingSpinner();
    }
  }
}, {
  rootMargin: '300px', // Load next page 300px before reaching bottom
});

scrollObserver.observe(sentinel);`,
    },

    { type: 'heading', level: 2, text: 'Visibility Tracking (Analytics)', id: 'analytics' },
    {
      type: 'code', language: 'javascript', filename: 'visibility-tracking.js',
      code: `// Track which sections the user actually reads
function trackVisibility(elements, onVisible) {
  const visibleTimers = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;

      if (entry.isIntersecting) {
        // Start timer when element becomes visible
        visibleTimers.set(id, {
          start: Date.now(),
          ratio: entry.intersectionRatio,
        });
      } else {
        // Element left viewport — report duration
        const timer = visibleTimers.get(id);
        if (timer) {
          const duration = Date.now() - timer.start;
          if (duration > 1000) { // Only report if visible > 1 second
            onVisible(id, duration);
          }
          visibleTimers.delete(id);
        }
      }
    });
  }, {
    threshold: [0, 0.5, 1.0],
  });

  elements.forEach(el => observer.observe(el));
  return () => observer.disconnect();
}

// Usage
trackVisibility(
  document.querySelectorAll('section[id]'),
  (sectionId, durationMs) => {
    analytics.track('section_viewed', {
      section: sectionId,
      duration: Math.round(durationMs / 1000),
    });
  }
);`,
    },

    { type: 'heading', level: 2, text: 'Sticky Header Detection', id: 'sticky-header' },
    {
      type: 'code', language: 'javascript', filename: 'sticky-detection.js',
      code: `// Detect when header becomes sticky
// Trick: observe a zero-height sentinel above the header
const sentinel = document.createElement('div');
sentinel.style.height = '1px';
sentinel.style.marginBottom = '-1px';
header.parentNode.insertBefore(sentinel, header);

const stickyObserver = new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-stuck', !entry.isIntersecting);
}, {
  threshold: 0,
});

stickyObserver.observe(sentinel);

// CSS
// .header.is-stuck { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }`,
    },

    { type: 'heading', level: 2, text: 'React Hook', id: 'react-hook' },
    {
      type: 'code', language: 'tsx', filename: 'useIntersectionObserver.tsx',
      code: `import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

function useIntersectionObserver(options: UseIntersectionOptions = {}) {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);

      if (entry.isIntersecting && triggerOnce) {
        observer.unobserve(element);
      }
    }, { threshold, rootMargin });

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: setRef, isIntersecting, entry };
}

// Usage: Fade in on scroll
function FadeInSection({ children }: { children: React.ReactNode }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s, transform 0.6s',
      }}
    >
      {children}
    </div>
  );
}

// Usage: Lazy load component
function LazyComponent({ load }: { load: () => Promise<{ default: React.ComponentType }> }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (isIntersecting) {
      load().then(mod => setComponent(() => mod.default));
    }
  }, [isIntersecting, load]);

  return (
    <div ref={ref}>
      {Component ? <Component /> : <div className="skeleton" />}
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Performance: IO vs Scroll Events', id: 'performance' },
    {
      type: 'table',
      headers: ['Approach', 'Performance', 'Accuracy', 'Complexity'],
      rows: [
        ['scroll + getBoundingClientRect', 'Poor (causes layout thrashing)', 'Exact pixel position', 'Simple but expensive'],
        ['IntersectionObserver', 'Excellent (async, off main thread)', 'Threshold-based', 'Slightly more setup'],
        ['scroll + debounce', 'Moderate', 'Delayed response', 'Needs debounce logic'],
        ['CSS scroll-driven animations', 'Best (GPU-accelerated)', 'CSS-only', 'Limited control'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Not unobserving for one-time actions
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      // Missing: observer.unobserve(entry.target)
      // The callback keeps firing on every scroll!
    }
  });
});

// ❌ Mistake 2: Creating a new observer per element
elements.forEach(el => {
  const observer = new IntersectionObserver(callback); // Don’t do this!
  observer.observe(el);
});
// ✅ Fix: Use ONE observer for multiple elements
const observer = new IntersectionObserver(callback);
elements.forEach(el => observer.observe(el));

// ❌ Mistake 3: Not disconnecting on cleanup
useEffect(() => {
  const observer = new IntersectionObserver(callback);
  observer.observe(ref.current);
  // Missing: return () => observer.disconnect();
}, []);

// ❌ Mistake 4: Wrong threshold for the use case
// threshold: 1.0 means element must be 100% visible
// For tall elements this may never happen!
// ✅ Use lower thresholds (0.1-0.5) for most cases`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What problem does IntersectionObserver solve compared to scroll events?',
        'How does the threshold option work? Can you use multiple thresholds?',
        'What is rootMargin and how would you use it for preloading?',
        'How would you implement infinite scrolling with IntersectionObserver?',
        'Can you use IntersectionObserver with a scrollable container instead of the viewport?',
        'What is the performance benefit of IntersectionObserver?',
        'How do you clean up an IntersectionObserver properly?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use ONE observer instance for multiple elements of the same type',
        'Always unobserve elements after one-time actions (lazy load, animation)',
        'Disconnect the observer on component unmount / cleanup',
        'Use rootMargin to preload content before it\'s visible',
        'Choose appropriate thresholds — 0.1 is usually better than 1.0',
        'Prefer native `loading="lazy"` for simple image lazy loading',
        'Use CSS scroll-driven animations when possible (better performance)',
        'Avoid creating observers inside loops — create once, observe many',
      ],
    },
  ],
};
