import type { RecipeContent } from '@/types/content';

export const skeletonLoadersRecipe: RecipeContent = {
  id: 'recipe-skeleton-loaders',
  title: 'Skeleton Loaders',
  description: 'Show placeholder content while data loads for better perceived performance.',
  slug: 'recipes/skeleton-loaders',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['skeleton', 'loading', 'ux', 'perceived-performance', 'placeholder'],
  difficulty: 'beginner',
  contentType: 'recipe',
  summary: 'Skeleton loaders improve perceived performance by showing placeholder content matching the final layout while data loads.',
  relatedTopics: ['loading-states', 'css-animations', 'api-retries'],
  order: 9,
  updatedAt: '2025-06-01',
  readingTime: 8,
  featured: false,
  keywords: ['skeleton', 'loader', 'placeholder', 'loading state', 'ux'],
  problem: 'Blank screens during loading feel slow. Users perceive skeleton loaders as faster, even if total time is the same.',
  pitfalls: [
    'Skeleton too different from final content (layout shift)',
    'Animations that distract rather than inform',
    'Not hiding skeleton when content loads',
    'Skeleton duration mismatched with actual load time',
    'Skeletons that look unnatural or confusing'
  ],
  variations: ['Animated shimmer', 'Pulse animation', 'Gradient wave', 'Static placeholder'],
  sections: [
    { type: 'heading', level: 2, text: 'Basic Skeleton Structure', id: 'basic-skeleton' },
    { type: 'code', language: 'html', filename: 'skeleton-basic.html', code: `<!-- Article Card Skeleton -->
<div class="skeleton-card">
  <div class="skeleton skeleton-image"></div>
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text" style="width: 60%;"></div>
</div>

<!-- User Profile Skeleton -->
<div class="skeleton-profile">
  <div class="skeleton skeleton-avatar"></div>
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text" style="width: 70%;"></div>
  <div class="skeleton-buttons">
    <div class="skeleton skeleton-button"></div>
    <div class="skeleton skeleton-button"></div>
  </div>
</div>

<style>
  .skeleton {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-card {
    padding: 16px;
    background: white;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  .skeleton-image {
    height: 200px;
    margin-bottom: 12px;
  }

  .skeleton-title {
    height: 24px;
    margin-bottom: 12px;
    width: 80%;
  }

  .skeleton-text {
    height: 16px;
    margin-bottom: 8px;
  }

  .skeleton-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-bottom: 12px;
  }

  .skeleton-button {
    height: 40px;
    width: 100px;
    display: inline-block;
    margin-right: 8px;
  }
</style>` },

    { type: 'heading', level: 2, text: 'React Skeleton Component', id: 'react-skeleton' },
    { type: 'code', language: 'typescript', filename: 'skeleton-react.tsx', code: `import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  count?: number;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}

function Skeleton({
  count = 1,
  width = '100%',
  height = 16,
  circle = false,
  className = ''
}: SkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={\`skeleton \${circle ? 'skeleton-circle' : ''} \${className}\`}
      style={{
        width: typeof width === 'number' ? \`\${width}px\` : width,
        height: typeof height === 'number' ? \`\${height}px\` : height,
        marginBottom: i < count - 1 ? 8 : 0
      }}
    />
  ));

  return <>{skeletons}</>;
}

// Card Skeleton
function CardSkeleton() {
  return (
    <div style={{ padding: 16, background: 'white', borderRadius: 8 }}>
      <Skeleton height={200} style={{ marginBottom: 12 }} />
      <Skeleton width="80%" height={24} style={{ marginBottom: 12 }} />
      <Skeleton count={3} />
    </div>
  );
}

// List Skeleton
function ListSkeleton({ count = 5 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <Skeleton width={48} height={48} circle />
          <div style={{ flex: 1 }}>
            <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="90%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Usage with data loading
function ArticleDetail({ articleId }: { articleId: string }) {
  const [article, setArticle] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(\`/api/articles/\${articleId}\`)
      .then(r => r.json())
      .then(data => {
        setArticle(data);
        setLoading(false);
      });
  }, [articleId]);

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div style={{ padding: 16, background: 'white', borderRadius: 8 }}>
      <img src={article.image} alt="" style={{ width: '100%', marginBottom: 12 }} />
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}

export { Skeleton, CardSkeleton, ListSkeleton, ArticleDetail };` },

    { type: 'heading', level: 2, text: 'Shimmer Animation', id: 'shimmer-animation' },
    { type: 'code', language: 'css', filename: 'skeleton-shimmer.css', code: `/* Shimmer effect */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  background-position: 200% 0;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Pulse effect */
.skeleton-pulse {
  background-color: #f0f0f0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* Wave effect (diagonal) */
.skeleton-wave {
  background: linear-gradient(
    -45deg,
    #f0f0f0 0%,
    #e0e0e0 10%,
    #f0f0f0 20%
  );
  background-size: 200% 100%;
  animation: wave 2s infinite;
}

@keyframes wave {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Fade in when content loads */
.skeleton {
  position: relative;
  overflow: hidden;
}

.skeleton.loaded {
  animation: fadeOut 0.3s ease-out forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}` },

    { type: 'heading', level: 2, text: 'Dynamic Skeleton Generator', id: 'dynamic-skeleton' },
    { type: 'code', language: 'javascript', filename: 'skeleton-dynamic.js', code: `// Generate skeleton that matches actual content layout
class SkeletonGenerator {
  static generateFromTemplate(template) {
    const clone = template.cloneNode(true);
    
    // Walk through all elements
    this.replacementWithSkeletons(clone);
    
    return clone;
  }

  static replacementWithSkeletons(element) {
    element.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0) {
        // Leaf node - replace with skeleton
        const height = el.offsetHeight || 16;
        const width = el.offsetWidth || '100%';
        
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton';
        skeleton.style.height = \`\${height}px\`;
        skeleton.style.width = \`\${width}px\`;
        skeleton.style.marginBottom = '8px';
        
        el.replaceWith(skeleton);
      }
    });
  }

  static hideSkeletons(container) {
    container.querySelectorAll('.skeleton').forEach(el => {
      el.classList.add('loaded');
      setTimeout(() => el.remove(), 300);
    });
  }
}

// Usage
const actualContent = document.getElementById('content');
const skeletonTemplate = actualContent.cloneNode(true);

// Show skeleton first
const skeleton = SkeletonGenerator.generateFromTemplate(skeletonTemplate);
document.body.appendChild(skeleton);

// Fetch data
fetch('/api/content')
  .then(r => r.json())
  .then(data => {
    // Update content
    actualContent.innerHTML = renderData(data);
    
    // Hide skeleton
    SkeletonGenerator.hideSkeletons(document.body);
  });` },

    { type: 'heading', level: 2, text: 'Avoiding Layout Shift (CLS)', id: 'avoid-cls' },
    { type: 'code', language: 'html', filename: 'skeleton-cls.html', code: `<!-- BAD: Different dimensions cause layout shift -->
<div id="content"></div>

<script>
  // Skeleton is small
  content.innerHTML = '<div style="height: 20px; width: 100px;"></div>';
  
  // Real content is large - causes shift!
  setTimeout(() => {
    content.innerHTML = '<div style="height: 400px; width: 300px;">Real content</div>';
  }, 2000);
</script>

<!-- GOOD: Same dimensions, no shift -->
<div id="content" style="height: 400px; width: 300px;">
  <!-- Skeleton or real content -->
</div>

<script>
  // Skeleton matches final dimensions
  const skeleton = \`
    <div class="skeleton" style="height: 400px; width: 300px;"></div>
  \`;
  content.innerHTML = skeleton;

  // Real content has same dimensions
  setTimeout(() => {
    const realContent = \`
      <div style="height: 400px; width: 300px;">
        <img src="..." style="height: 300px;" />
        <h2>Title</h2>
        <p>Description</p>
      </div>
    \`;
    content.innerHTML = realContent;
  }, 2000);
</script>

<!-- BETTER: Use aspect ratio container -->
<div class="aspect-ratio-box" style="aspect-ratio: 16 / 9;">
  <div class="skeleton"></div>
</div>

<style>
  .aspect-ratio-box {
    position: relative;
    width: 100%;
  }

  .aspect-ratio-box > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>` },

    { type: 'heading', level: 2, text: 'Timeout and Error States', id: 'timeout-errors' },
    { type: 'code', language: 'javascript', filename: 'skeleton-timeout.js', code: `async function loadWithSkeleton(url, skeletonElement, timeout = 10000) {
  let timeoutId;
  
  try {
    // Show skeleton
    skeletonElement.style.display = 'block';

    // Fetch with timeout
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }

    const data = await response.json();

    // Hide skeleton, show content
    skeletonElement.style.display = 'none';
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    skeletonElement.style.display = 'none';

    if (error.name === 'AbortError') {
      // Timeout
      console.error('Request timed out');
      showError('Content took too long to load. Try again.');
    } else {
      // Network or parsing error
      console.error('Failed to load:', error);
      showError('Failed to load content. Try again.');
    }

    return null;
  }
}

function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  errorEl.style.padding = '16px';
  errorEl.style.background = '#fee';
  errorEl.style.color = '#c33';
  errorEl.style.borderRadius = '4px';
  document.body.appendChild(errorEl);
}

// Usage
const skeleton = document.getElementById('skeleton');
const data = await loadWithSkeleton('/api/data', skeleton, 5000);

if (data) {
  // Render data
  renderContent(data);
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'code', language: 'javascript', filename: 'skeleton-best-practices.js', code: `// ✅ BEST PRACTICE 1: Match final layout exactly
function createSkeletonForCard() {
  return \`
    <div class="card" style="width: 300px;">
      <div class="skeleton" style="width: 100%; height: 200px;"></div>
      <div style="padding: 16px;">
        <div class="skeleton" style="width: 80%; height: 24px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 100%; height: 16px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 100%; height: 16px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 60%; height: 16px;"></div>
      </div>
    </div>
  \`;
}

// ✅ BEST PRACTICE 2: Subtle animation, not distracting
const skeletonCSS = \`
  .skeleton {
    background: linear-gradient(90deg, #f3f3f3 0%, #e8e8e8 50%, #f3f3f3 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton {
      animation: none;
      background: #f0f0f0;
    }
  }
\`;

// ✅ BEST PRACTICE 3: Appropriate duration (1-2 seconds)
// Too short: feels jerky
// Too long: feels slow

// ✅ BEST PRACTICE 4: Provide actual timing information
function loadWithProgress(url, skeletonEl) {
  const startTime = Date.now();
  
  return fetch(url).then(r => r.json()).then(data => {
    const duration = Date.now() - startTime;
    
    // Fade out skeleton smoothly
    skeletonEl.style.transition = 'opacity 0.3s';
    skeletonEl.style.opacity = '0';
    
    setTimeout(() => skeletonEl.remove(), 300);
    
    return data;
  });
}

// ✅ BEST PRACTICE 5: Show multiple skeletons for lists
function renderSkeletonList(count = 5) {
  return Array.from({ length: count })
    .map(() => createSkeletonItem())
    .join('');
}` },
  ],
};
