import type { ExploreContent } from '@/types/content';

export const webVitalsExplore: ExploreContent = {
  id: 'explore-web-vitals',
  title: 'Web Vitals & Performance',
  description: 'Measure and optimize web performance with Core Web Vitals, LCP, INP, CLS, and modern optimization techniques.',
  slug: 'explore/web-vitals',
  pillar: 'explore',
  category: 'tooling',
  tags: ['performance', 'web vitals', 'lcp', 'inp', 'cls', 'optimization'],
  difficulty: 'intermediate',
  contentType: 'library',
  summary: 'Comprehensive guide to web performance metrics — Core Web Vitals (LCP, INP, CLS), measurement tools, optimization techniques, and performance best practices.',
  relatedTopics: [],
  order: 10,
  updatedAt: '2025-06-01',
  readingTime: 25,
  featured: true,
  keywords: ['Web Vitals', 'Core Web Vitals', 'performance', 'LCP', 'INP', 'CLS', 'optimization'],
  items: [
    {
      name: 'web.dev',
      description: 'Google\'s Web Vitals resource',
      url: 'https://web.dev/vitals/',
    },
    {
      name: 'PageSpeed Insights',
      description: 'Check page performance scores',
      url: 'https://pagespeed.web.dev',
    },
    {
      name: 'WebPageTest',
      description: 'Advanced performance analysis',
      url: 'https://webpagetest.org',
    },
    {
      name: 'Lighthouse',
      description: 'Chrome DevTools performance audits',
      url: 'https://developers.google.com/web/tools/lighthouse',
    },
    {
      name: 'Web Vitals Library',
      description: 'Google\'s measurement library',
      url: 'https://github.com/GoogleChrome/web-vitals',
    },
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Core Web Vitals Overview',
      id: 'core-web-vitals',
    },
    {
      type: 'paragraph',
      text: 'Core Web Vitals are three key metrics that Google uses to rank pages. They measure loading speed, interactivity, and visual stability.',
    },
    {
      type: 'table',
      headers: ['Metric', 'Measures', 'Good', 'Needs Work', 'Poor'],
      rows: [
        ['LCP', 'Loading (largest element)', '< 2.5s', '2.5-4s', '> 4s'],
        ['INP', 'Interactivity (input delay)', '< 200ms', '200-500ms', '> 500ms'],
        ['CLS', 'Stability (layout shift)', '< 0.1', '0.1-0.25', '> 0.25'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Largest Contentful Paint (LCP)',
      id: 'lcp',
    },
    {
      type: 'paragraph',
      text: 'LCP measures when the largest content element (text, image, video) becomes visible. Target: under 2.5 seconds.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Measure LCP with web-vitals library
import { getLCP, onCLS } from 'web-vitals';

getLCP((metric) => {
  console.log('LCP:', metric.value, 'ms');
  // Send to analytics
  sendToAnalytics('LCP', metric.value);
});

// Manual LCP measurement
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP candidate:', entry.renderTime || entry.loadTime);
  }
});

observer.observe({ type: 'largest-contentful-paint', buffered: true });

// Optimize LCP:
// 1. Minimize server response time (TTFB)
app.get('/', async (req, res) => {
  // Serve from cache or CDN when possible
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(renderedHTML);
});

// 2. Eliminate render-blocking resources
// ❌ Blocks rendering
<script src="analytics.js"></script>

// ✅ Load asynchronously
<script src="analytics.js" async></script>
<script src="third-party.js" defer></script>

// 3. Lazy load images
<img
  src="image.jpg"
  loading="lazy"
  alt="Description"
/>

// 4. Optimize images
// Use modern formats (WebP) with fallbacks
<picture>
  <source srcSet="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>

// 5. Use font-display: swap
@font-face {
  font-family: 'MyFont';
  font-display: swap; // Show fallback while loading
  src: url('myfont.woff2') format('woff2');
}

// 6. Minimize CSS/JS
// Use bundlers to remove unused code
const productionBuild = {
  mode: 'production',
  optimization: {
    minimize: true,
    usedExports: true, // Tree-shaking
  },
};`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Interaction to Next Paint (INP)',
      id: 'inp',
    },
    {
      type: 'paragraph',
      text: 'INP measures how responsive your page is to user interactions (clicks, taps, key presses). Target: under 200ms.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Measure INP
import { onINP } from 'web-vitals';

onINP((metric) => {
  console.log('INP:', metric.value, 'ms');
  if (metric.value > 200) {
    console.warn('INP exceeds target');
  }
});

// Identify slow interactions
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Interaction:', {
      name: entry.name,
      duration: entry.duration,
      processingStart: entry.processingStart,
      presentationDelay: entry.duration - (entry.processingStart - entry.startTime),
    });
  }
});

observer.observe({ type: 'event', buffered: true, durationThreshold: 100 });

// Optimize INP:
// 1. Break up long tasks (> 50ms)
// ❌ Bad: Blocks main thread for 500ms
function processLargeArray(items: any[]) {
  items.forEach((item) => {
    complexComputation(item);
  });
}

// ✅ Good: Break into chunks
async function processLargeArrayOptimized(items: any[]) {
  const chunkSize = 50;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    await new Promise((resolve) => {
      requestIdleCallback(() => {
        chunk.forEach((item) => complexComputation(item));
        resolve(null);
      });
    });
  }
}

// 2. Use web workers for heavy computation
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeDataset });

worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// worker.js
self.onmessage = (e) => {
  const result = expensiveComputation(e.data);
  self.postMessage(result);
};

// 3. Defer non-critical updates
function handleButtonClick() {
  // Critical: Update UI immediately
  setLoading(true);

  // Non-critical: Log event later
  requestIdleCallback(() => {
    analytics.trackEvent('button_clicked');
  });
}

// 4. Use React startTransition for non-urgent updates
import { startTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e: any) => {
    const newQuery = e.target.value;
    setQuery(newQuery); // Urgent: update input immediately

    // Non-urgent: fetch and update results
    startTransition(() => {
      const newResults = performSearch(newQuery);
      setResults(newResults);
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      <Suspense fallback={<Loading />}>
        <Results items={results} />
      </Suspense>
    </>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cumulative Layout Shift (CLS)',
      id: 'cls',
    },
    {
      type: 'paragraph',
      text: 'CLS measures unexpected layout shifts. Elements moving around after page load hurts user experience. Target: under 0.1.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Measure CLS
import { onCLS } from 'web-vitals';

onCLS((metric) => {
  console.log('CLS:', metric.value);
});

// Manual CLS measurement
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) { // Ignore user-initiated shifts
      console.log('Layout shift:', entry.value);
    }
  }
});

observer.observe({ type: 'layout-shift', buffered: true });

// Optimize CLS:
// 1. Reserve space for dynamic content
// ❌ Bad: Image loads after text
<article>
  <h1>Title</h1>
  <img src="large-image.jpg" alt="..."> {/* Shifts content down */}
</article>

// ✅ Good: Reserve space with aspect ratio
<article>
  <h1>Title</h1>
  <img
    src="large-image.jpg"
    alt="..."
    width="800"
    height="600"
    style={{ aspectRatio: '800/600' }}
  />
</article>

// Or use aspect-ratio CSS
img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}

// 2. Avoid inserting content above existing content
// ❌ Bad: Insert banner at top
<div>{bannerNotification}</div> {/* Shifts everything down */}
<main>Main content</main>

// ✅ Good: Use fixed or modal position
{bannerNotification && (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
    {bannerNotification}
  </div>
)}
<main>Main content</main>

// 3. Avoid font loading shifts
// ❌ Bad: Font loads after page render
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2');
}

// ✅ Good: Prevent FOUT/FOIT
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2');
  font-display: swap; // Show fallback while loading
}

// 4. Use transform instead of layout-affecting properties
// ❌ Bad: Changes layout
element.style.top = '100px'; // Triggers layout recalculation

// ✅ Good: Only repaints
element.style.transform = 'translateY(100px)'; // GPU accelerated`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Other Important Metrics',
      id: 'other-metrics',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// First Input Delay (FID) - being replaced by INP
import { getFID } from 'web-vitals';

getFID((metric) => {
  console.log('FID:', metric.value, 'ms');
});

// Time to First Byte (TTFB)
const paintEntries = performance.getEntriesByType('navigation');
const ttfb = paintEntries[0].responseStart - paintEntries[0].requestStart;
console.log('TTFB:', ttfb, 'ms');

// First Contentful Paint (FCP)
const fcp = performance.getEntriesByName('first-contentful-paint')[0];
console.log('FCP:', fcp.startTime, 'ms');

// Measure all metrics
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

function sendMetricsToAnalytics(metric: any) {
  // Send to your analytics service
  navigator.sendBeacon('/analytics', JSON.stringify(metric));
}

getCLS(sendMetricsToAnalytics);
getFCP(sendMetricsToAnalytics);
getFID(sendMetricsToAnalytics);
getLCP(sendMetricsToAnalytics);
getTTFB(sendMetricsToAnalytics);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Performance Optimization Checklist',
      id: 'optimization-checklist',
    },
    {
      type: 'list',
      items: [
        'Minimize server response time (TTFB < 600ms)',
        'Use a CDN to serve static assets',
        'Enable gzip/brotli compression',
        'Minify CSS, JavaScript, and HTML',
        'Remove unused CSS with PurgeCSS or Tailwind',
        'Code splitting and lazy loading',
        'Use modern image formats (WebP, AVIF)',
        'Optimize images with compression',
        'Defer non-critical JavaScript',
        'Load fonts with font-display: swap',
        'Break up long tasks into chunks',
        'Use requestIdleCallback for non-urgent work',
        'Avoid layout shifts by reserving space',
        'Use CSS transforms instead of layout-affecting properties',
        'Enable browser caching with Cache-Control headers',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Monitoring Performance in Production',
      id: 'monitoring',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Create custom analytics payload
function sendMetrics(metrics: any) {
  const payload = {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    metrics: {
      lcp: metrics.lcp,
      inp: metrics.inp,
      cls: metrics.cls,
      fcp: metrics.fcp,
      ttfb: metrics.ttfb,
    },
    navigation: {
      domContentLoaded: performance.timing.domContentLoaded,
      loadComplete: performance.timing.loadEventEnd,
    },
  };

  // Send via beacon API (survives page unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics/metrics', JSON.stringify(payload));
  } else {
    fetch('/analytics/metrics', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

// Monitor in real user monitoring (RUM)
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

const vitals = {};

onCLS((metric) => vitals.cls = metric.value);
onFCP((metric) => vitals.fcp = metric.value);
onFID((metric) => vitals.fid = metric.value);
onLCP((metric) => vitals.lcp = metric.value);
onTTFB((metric) => vitals.ttfb = metric.value);

// Send when user leaves page
window.addEventListener('beforeunload', () => {
  sendMetrics(vitals);
});

// Performance budgets
const performanceBudget = {
  maxLCP: 2500,
  maxINP: 200,
  maxCLS: 0.1,
  maxFCP: 1800,
  maxTTFB: 600,
};

function checkPerformanceBudget(metrics: any) {
  const violations = [];

  if (metrics.lcp > performanceBudget.maxLCP) {
    violations.push(\`LCP (\${metrics.lcp}ms) exceeds budget\`);
  }
  if (metrics.inp > performanceBudget.maxINP) {
    violations.push(\`INP (\${metrics.inp}ms) exceeds budget\`);
  }
  if (metrics.cls > performanceBudget.maxCLS) {
    violations.push(\`CLS (\${metrics.cls}) exceeds budget\`);
  }

  if (violations.length > 0) {
    console.warn('Performance Budget Violations:', violations);
  }

  return violations.length === 0;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Tools & Resources',
      id: 'tools',
    },
    {
      type: 'list',
      items: [
        'Lighthouse: Built into Chrome DevTools',
        'PageSpeed Insights: Online performance analysis',
        'WebPageTest: Detailed waterfall charts',
        'web-vitals: Google\'s measurement library',
        'Sentry: Detailed error and performance monitoring',
        'New Relic: Enterprise APM',
        'Datadog: Full-stack monitoring',
      ],
    },
  ],
};
