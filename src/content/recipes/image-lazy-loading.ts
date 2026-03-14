import type { RecipeContent } from '@/types/content';

export const imageLazyLoadingRecipe: RecipeContent = {
  id: 'recipe-image-lazy-loading',
  title: 'Image Lazy Loading',
  description: 'Defer loading images until they\'re near the viewport using Intersection Observer or native lazy loading.',
  slug: 'recipes/image-lazy-loading',
  pillar: 'recipes',
  category: 'performance',
  tags: ['lazy-loading', 'performance', 'images', 'intersection-observer', 'optimization'],
  difficulty: 'beginner',
  contentType: 'recipe',
  summary: 'Improve page load performance by deferring image loading until needed using native or JavaScript techniques.',
  relatedTopics: ['intersection-observer', 'performance', 'images'],
  order: 5,
  updatedAt: '2025-06-01',
  readingTime: 9,
  featured: false,
  keywords: ['lazy load', 'images', 'performance', 'intersection observer'],
  problem: 'Loading all images on page load wastes bandwidth. Users don\'t scroll to see all images, but you\'re loading them all anyway.',
  pitfalls: [
    'Not using native lazy loading for simple cases',
    'Forgetting to set placeholder dimensions (layout shift)',
    'Not unobserving images after loading (wasted observers)',
    'Background images not supported by native lazy loading',
    'No fallback for users with JavaScript disabled'
  ],
  variations: ['Native loading attribute', 'Intersection Observer', 'Scroll events', 'Background images'],
  sections: [
    { type: 'heading', level: 2, text: 'Native Lazy Loading', id: 'native-lazy-loading' },
    { type: 'code', language: 'html', filename: 'lazy-native.html', code: `<!-- Native lazy loading with loading="lazy" -->
<!-- Works in modern browsers, ignored in older ones -->
<img
  src="placeholder.jpg"
  data-src="real-image.jpg"
  loading="lazy"
  alt="Description"
  width="300"
  height="200"
/>

<!-- Multiple images -->
<img src="img1.jpg" loading="lazy" alt="Image 1" width="300" height="200" />
<img src="img2.jpg" loading="lazy" alt="Image 2" width="300" height="200" />
<img src="img3.jpg" loading="lazy" alt="Image 3" width="300" height="200" />

<!-- With srcset for responsive images -->
<img
  src="image-small.jpg"
  srcset="
    image-small.jpg 480w,
    image-medium.jpg 800w,
    image-large.jpg 1200w
  "
  loading="lazy"
  alt="Responsive image"
/>

<!-- Picture element with lazy loading -->
<picture>
  <source media="(max-width: 600px)" srcset="image-small.jpg" />
  <source media="(max-width: 1200px)" srcset="image-medium.jpg" />
  <img src="image-large.jpg" loading="lazy" alt="Responsive" />
</picture>

<style>
  /* Prevent layout shift while loading */
  img {
    display: block;
    aspect-ratio: 16 / 9;
    width: 100%;
    height: auto;
    background-color: #f0f0f0; /* Placeholder color */
  }
</style>` },

    { type: 'heading', level: 2, text: 'Intersection Observer Method', id: 'intersection-observer' },
    { type: 'code', language: 'javascript', filename: 'lazy-intersection.js', code: `class LazyImageLoader {
  constructor(options = {}) {
    this.selector = options.selector || '[data-src]';
    this.threshold = options.threshold || 0.1;
    this.rootMargin = options.rootMargin || '50px';
    this.images = new Map();

    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin
      }
    );

    this.init();
  }

  init() {
    document.querySelectorAll(this.selector).forEach(img => {
      this.intersectionObserver.observe(img);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
      }
    });
  }

  loadImage(img) {
    // Get actual image source
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    // Set image source
    if (src) img.src = src;
    if (srcset) img.srcset = srcset;

    // Load image
    img.addEventListener('load', () => this.onImageLoaded(img));
    img.addEventListener('error', () => this.onImageError(img));

    // Stop observing once loaded
    this.intersectionObserver.unobserve(img);
  }

  onImageLoaded(img) {
    img.classList.add('loaded');
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
  }

  onImageError(img) {
    img.classList.add('error');
    img.src = img.dataset.fallback || 'placeholder-error.jpg';
  }

  // Manually load all remaining images
  loadAll() {
    document.querySelectorAll(this.selector).forEach(img => {
      this.loadImage(img);
    });
  }

  destroy() {
    this.intersectionObserver.disconnect();
  }
}

// Usage
const lazyLoader = new LazyImageLoader({
  threshold: 0.1,
  rootMargin: '50px'
});

// CSS for smooth transitions
const style = document.createElement('style');
style.textContent = \`
  img[data-src] {
    background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  img.loaded {
    animation: fadeIn 0.3s;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
\`;
document.head.appendChild(style);` },

    { type: 'heading', level: 2, text: 'Responsive Images with Lazy Loading', id: 'responsive-lazy' },
    { type: 'code', language: 'html', filename: 'lazy-responsive.html', code: `<!-- Responsive lazy images -->
<img
  loading="lazy"
  src="image-small.jpg"
  srcset="
    image-small.jpg 480w,
    image-medium.jpg 800w,
    image-large.jpg 1200w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 1000px"
  alt="Responsive image"
  width="1000"
  height="667"
/>

<!-- Picture element (art direction) -->
<picture>
  <source
    media="(max-width: 600px)"
    srcset="
      mobile-small.jpg 480w,
      mobile-large.jpg 800w
    "
  />
  <source
    media="(max-width: 1200px)"
    srcset="
      tablet-small.jpg 800w,
      tablet-large.jpg 1200w
    "
  />
  <img
    src="desktop-large.jpg"
    srcset="desktop-small.jpg 1200w, desktop-large.jpg 2000w"
    loading="lazy"
    alt="Art-directed responsive image"
    width="1000"
    height="667"
  />
</picture>

<!-- WebP with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.jpg" type="image/jpeg" />
  <img
    src="image.jpg"
    loading="lazy"
    alt="Image with WebP support"
    width="300"
    height="200"
  />
</picture>` },

    { type: 'heading', level: 2, text: 'Background Image Lazy Loading', id: 'background-images' },
    { type: 'code', language: 'javascript', filename: 'lazy-background.js', code: `class LazyBackgroundImageLoader {
  constructor(selector = '[data-bg]', options = {}) {
    this.selector = selector;
    this.options = options;
    
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    this.init();
  }

  init() {
    document.querySelectorAll(this.selector).forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadBackgroundImage(entry.target);
      }
    });
  }

  loadBackgroundImage(el) {
    const bgUrl = el.dataset.bg;
    
    if (!bgUrl) return;

    // Preload image
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = \`url('\${bgUrl}')\`;
      el.classList.add('bg-loaded');
      this.intersectionObserver.unobserve(el);
    };
    img.onerror = () => {
      el.classList.add('bg-error');
    };
    img.src = bgUrl;
  }

  destroy() {
    this.intersectionObserver.disconnect();
  }
}

// Usage
const bgLoader = new LazyBackgroundImageLoader('[data-bg]');

// HTML
\`
  <div
    data-bg="background-image.jpg"
    style="
      width: 100%;
      height: 400px;
      background-size: cover;
      background-position: center;
    "
  ></div>
\`;

// CSS
const style = document.createElement('style');
style.textContent = \`
  [data-bg] {
    background-color: #f0f0f0;
    transition: opacity 0.3s;
    opacity: 0;
  }

  [data-bg].bg-loaded {
    opacity: 1;
  }

  [data-bg].bg-error {
    background-color: #ddd;
  }
\`;
document.head.appendChild(style);` },

    { type: 'heading', level: 2, text: 'Blur-Up Technique', id: 'blur-up' },
    { type: 'code', language: 'javascript', filename: 'lazy-blur-up.js', code: `class BlurUpImageLoader {
  constructor() {
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.1, rootMargin: '50px' }
    );

    this.init();
  }

  init() {
    document.querySelectorAll('[data-src]').forEach(img => {
      if (img.dataset.placeholder) {
        this.intersectionObserver.observe(img);
      }
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    const placeholder = img.dataset.placeholder;

    // Show placeholder (small, blurred image)
    img.src = placeholder;
    img.style.filter = 'blur(10px)';

    // Load high-quality image
    const fullImg = new Image();
    fullImg.onload = () => {
      img.src = src;
      img.style.filter = 'none';
      img.style.transition = 'filter 0.3s';
      img.classList.add('loaded');
    };
    fullImg.src = src;

    this.intersectionObserver.unobserve(img);
  }
}

// Usage
const blurLoader = new BlurUpImageLoader();

// HTML - placeholder is a tiny blurred image (data URI)
\`
  <img
    data-placeholder="data:image/jpeg;base64,/9j/4AAQSkZJ..."
    data-src="full-resolution.jpg"
    alt="Image with blur-up effect"
    width="300"
    height="200"
  />
\`;` },

    { type: 'heading', level: 2, text: 'Performance Monitoring', id: 'performance-monitoring' },
    { type: 'code', language: 'javascript', filename: 'lazy-performance.js', code: `class LazyLoadingPerformance {
  constructor() {
    this.metrics = {
      imagesOnPage: 0,
      imagesLoaded: 0,
      totalBytesLoaded: 0,
      startTime: Date.now(),
      loadTimes: []
    };
  }

  track(img) {
    this.metrics.imagesOnPage++;

    const startTime = performance.now();
    
    img.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      this.metrics.imagesLoaded++;
      this.metrics.loadTimes.push(loadTime);

      // Track bytes (requires server to send Content-Length)
      if (img.naturalWidth && img.naturalHeight) {
        const estimatedBytes = img.naturalWidth * img.naturalHeight * 4; // RGBA
        this.metrics.totalBytesLoaded += estimatedBytes;
      }

      console.log(\`Image loaded: \${img.src} (\${loadTime.toFixed(2)}ms)\`);
    });

    img.addEventListener('error', () => {
      console.error(\`Failed to load: \${img.src}\`);
    });
  }

  getMetrics() {
    const avgLoadTime = this.metrics.loadTimes.length > 0
      ? this.metrics.loadTimes.reduce((a, b) => a + b, 0) / this.metrics.loadTimes.length
      : 0;

    return {
      ...this.metrics,
      avgLoadTime: avgLoadTime.toFixed(2),
      loadPercentage: (this.metrics.imagesLoaded / this.metrics.imagesOnPage * 100).toFixed(1),
      totalMB: (this.metrics.totalBytesLoaded / 1024 / 1024).toFixed(2)
    };
  }

  report() {
    const metrics = this.getMetrics();
    console.table(metrics);
  }
}

// Usage
const perf = new LazyLoadingPerformance();
document.querySelectorAll('img').forEach(img => perf.track(img));

// Later, check metrics
setInterval(() => perf.report(), 5000);` },

    { type: 'heading', level: 2, text: 'Fallback for No JavaScript', id: 'no-js-fallback' },
    { type: 'code', language: 'html', filename: 'lazy-fallback.html', code: `<!-- Fallback for users without JavaScript -->

<!-- Using picture element with noscript -->
<picture>
  <!-- Lazy loaded version -->
  <img
    loading="lazy"
    src="placeholder.jpg"
    data-src="real-image.jpg"
    alt="Description"
    width="300"
    height="200"
  />
</picture>

<!-- Fallback for no JavaScript (hidden by JS if available) -->
<noscript>
  <picture>
    <img src="real-image.jpg" alt="Description" width="300" height="200" />
  </picture>
</noscript>

<!-- Alternative: Use srcset as fallback -->
<img
  src="placeholder.jpg"
  srcset="real-image.jpg"
  data-lazy="true"
  alt="Description"
  width="300"
  height="200"
/>

<!-- Lazy-load inline SVGs as images -->
<svg
  data-src="icon.svg"
  class="lazy-svg"
  width="48"
  height="48"
  aria-label="Icon"
>
  <!-- Fallback SVG content if JavaScript fails -->
  <circle cx="24" cy="24" r="20" fill="currentColor" />
</svg>

<script>
  // If JavaScript loads, use proper lazy loading
  document.querySelectorAll('img[data-src]').forEach(img => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  });
</script>` },
  ],
};
