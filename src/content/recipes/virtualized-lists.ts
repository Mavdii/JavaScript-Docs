import type { RecipeContent } from '@/types/content';

export const virtualizedListsRecipe: RecipeContent = {
  id: 'recipe-virtualized-lists',
  title: 'Virtualized Lists (Windowing)',
  description: 'Render massive lists efficiently by only rendering visible items using virtualization.',
  slug: 'recipes/virtualized-lists',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['virtualization', 'lists', 'performance', 'windowing', 'scrolling'],
  difficulty: 'advanced',
  contentType: 'recipe',
  summary: 'Virtualization (windowing) renders only visible items, enabling smooth scrolling of lists with thousands of items.',
  relatedTopics: ['dom-manipulation', 'scrolling', 'performance'],
  order: 8,
  updatedAt: '2025-06-01',
  readingTime: 12,
  featured: false,
  keywords: ['virtualization', 'windowing', 'large lists', 'performance'],
  problem: 'Rendering 10,000 list items causes memory bloat and slow scrolling. Users need smooth scrolling of massive datasets.',
  pitfalls: [
    'Not accounting for item height variations',
    'Forgetting to update scroll position when items are added',
    'Not handling dynamic item heights',
    'Scroll jank from layout thrashing',
    'Not caching measurements'
  ],
  variations: ['Fixed height items', 'Variable height items', 'Horizontal scrolling', 'Grid layout'],
  sections: [
    { type: 'heading', level: 2, text: 'Basic Virtual List', id: 'basic-virtual' },
    { type: 'code', language: 'javascript', filename: 'virtual-list-basic.js', code: `class VirtualList {
  constructor(container, items, itemHeight, bufferSize = 5) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.bufferSize = bufferSize;
    this.scrollTop = 0;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    
    this.container.addEventListener('scroll', this.onScroll.bind(this));
    this.render();
  }

  onScroll() {
    this.scrollTop = this.container.scrollTop;
    this.render();
  }

  render() {
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
    const endIndex = Math.min(
      this.items.length,
      startIndex + this.visibleCount + this.bufferSize * 2
    );

    const html = this.items.slice(startIndex, endIndex)
      .map((item, i) => {
        const index = startIndex + i;
        const offset = index * this.itemHeight;
        return \`
          <div class="virtual-item" style="transform: translateY(\${offset}px); height: \${this.itemHeight}px;">
            \${this.renderItem(item, index)}
          </div>
        \`;
      })
      .join('');

    const totalHeight = this.items.length * this.itemHeight;
    this.container.innerHTML = \`
      <div class="virtual-list-viewport" style="height: \${totalHeight}px;">
        \${html}
      </div>
    \`;
  }

  renderItem(item, index) {
    return \`<div class="item">#\${index}: \${item.name}</div>\`;
  }
}

// Usage
const container = document.getElementById('list');
const items = Array.from({ length: 10000 }, (_, i) => ({ name: \`Item \${i}\` }));
const virtualList = new VirtualList(container, items, 50);` },

    { type: 'heading', level: 2, text: 'Variable Height Items', id: 'variable-height' },
    { type: 'code', language: 'javascript', filename: 'virtual-list-variable.js', code: `class VariableHeightVirtualList {
  constructor(container, items, renderFn) {
    this.container = container;
    this.items = items;
    this.renderFn = renderFn;
    this.itemHeights = new Map();
    this.cumulativeHeights = [0];
    this.visibleStart = 0;
    this.visibleEnd = 0;

    this.container.style.overflowY = 'auto';
    this.container.addEventListener('scroll', this.onScroll.bind(this));
    
    this.resizeObserver = new ResizeObserver(this.onItemResize.bind(this));
    this.render();
  }

  getItemHeight(index) {
    if (this.itemHeights.has(index)) {
      return this.itemHeights.get(index);
    }
    return 50; // Default fallback
  }

  getCumulativeHeight(index) {
    return this.cumulativeHeights[index] || 0;
  }

  updateCumulativeHeights() {
    this.cumulativeHeights = [0];
    for (let i = 0; i < this.items.length; i++) {
      this.cumulativeHeights[i + 1] = 
        this.cumulativeHeights[i] + this.getItemHeight(i);
    }
  }

  getVisibleRange() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;

    let startIndex = 0;
    while (this.getCumulativeHeight(startIndex + 1) < scrollTop) {
      startIndex++;
    }

    let endIndex = startIndex;
    let currentHeight = this.getCumulativeHeight(startIndex);
    while (currentHeight < scrollTop + containerHeight && endIndex < this.items.length) {
      currentHeight += this.getItemHeight(endIndex);
      endIndex++;
    }

    return { startIndex, endIndex };
  }

  onScroll() {
    this.render();
  }

  onItemResize(entries) {
    entries.forEach(entry => {
      const index = parseInt(entry.target.dataset.index);
      this.itemHeights.set(index, entry.contentRect.height);
    });
    this.updateCumulativeHeights();
    this.render();
  }

  render() {
    this.updateCumulativeHeights();
    const { startIndex, endIndex } = this.getVisibleRange();
    const offsetY = this.getCumulativeHeight(startIndex);

    const items = this.items.slice(startIndex, endIndex)
      .map((item, i) => {
        const index = startIndex + i;
        return \`
          <div class="virtual-item" data-index="\${index}" style="position: relative;">
            \${this.renderFn(item, index)}
          </div>
        \`;
      })
      .join('');

    const totalHeight = this.getCumulativeHeight(this.items.length);
    
    this.container.innerHTML = \`
      <div style="height: \${totalHeight}px;">
        <div style="transform: translateY(\${offsetY}px);">
          \${items}
        </div>
      </div>
    \`;

    // Observe new items for resize
    this.container.querySelectorAll('[data-index]').forEach(el => {
      this.resizeObserver.observe(el);
    });
  }
}` },

    { type: 'heading', level: 2, text: 'Intersection Observer Approach', id: 'intersection-observer' },
    { type: 'code', language: 'javascript', filename: 'virtual-list-intersection.js', code: `class IntersectionVirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleItems = new Set();

    this.intersectionObserver = new IntersectionObserver(
      this.onIntersection.bind(this),
      {
        root: this.container,
        rootMargin: '100px',
        threshold: 0
      }
    );

    this.render();
  }

  onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.visibleItems.add(parseInt(entry.target.dataset.index));
      } else {
        this.visibleItems.delete(parseInt(entry.target.dataset.index));
      }
    });
  }

  render() {
    const html = this.items.map((item, index) => {
      const offset = index * this.itemHeight;
      return \`
        <div 
          class="virtual-item"
          data-index="\${index}"
          style="position: absolute; top: \${offset}px; height: \${this.itemHeight}px; width: 100%;"
        >
          \${this.visibleItems.has(index) ? this.renderItem(item, index) : ''}
        </div>
      \`;
    }).join('');

    const totalHeight = this.items.length * this.itemHeight;
    this.container.innerHTML = \`
      <div style="position: relative; height: \${totalHeight}px;">
        \${html}
      </div>
    \`;

    // Start observing
    this.container.querySelectorAll('[data-index]').forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  renderItem(item, index) {
    return \`Item #\${index}: \${item.name}\`;
  }
}` },

    { type: 'heading', level: 2, text: 'React Virtual List Example', id: 'react-example' },
    { type: 'code', language: 'typescript', filename: 'virtual-list-react.tsx', code: `import React, { useState, useRef, useEffect } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  height: number;
}

function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  height
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
  const endIndex = Math.min(items.length, startIndex + visibleCount + 10);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    setScrollTop(element.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height,
        overflowY: 'auto',
        border: '1px solid #ccc'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: \`translateY(\${offsetY}px)\`,
            position: 'absolute',
            width: '100%'
          }}
        >
          {visibleItems.map((item, i) => (
            <div
              key={startIndex + i}
              style={{
                height: itemHeight,
                borderBottom: '1px solid #eee'
              }}
            >
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Usage
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: \`Item \${i}\`
  }));

  return (
    <VirtualList
      items={items}
      itemHeight={50}
      height={600}
      renderItem={(item) => <div>{item.name}</div>}
    />
  );
}

export default App;` },

    { type: 'heading', level: 2, text: 'Performance Monitoring', id: 'performance' },
    { type: 'code', language: 'javascript', filename: 'virtual-list-perf.js', code: `class VirtualListWithMetrics {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.metrics = {
      renderCount: 0,
      scrollEvents: 0,
      lastRenderTime: 0
    };

    this.container.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    this.metrics.scrollEvents++;
    const start = performance.now();
    this.render();
    const end = performance.now();
    this.metrics.lastRenderTime = end - start;
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const itemsPerView = Math.ceil(this.container.clientHeight / this.itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - 5);
    const endIndex = Math.min(this.items.length, startIndex + itemsPerView + 10);

    const visibleCount = endIndex - startIndex;

    // Update metrics
    this.metrics.renderCount++;

    console.log(\`
      Render #\${this.metrics.renderCount}:
      - Visible items: \${visibleCount} / \${this.items.length}
      - Render time: \${this.metrics.lastRenderTime.toFixed(2)}ms
      - Scroll events: \${this.metrics.scrollEvents}
      - DOM nodes: \${document.querySelectorAll('.virtual-item').length}
    \`);

    // Render items...
  }

  getMetrics() {
    return this.metrics;
  }
}` },

    { type: 'heading', level: 2, text: 'Common Pitfalls and Solutions', id: 'pitfalls-solutions' },
    { type: 'code', language: 'javascript', filename: 'virtual-list-pitfalls.js', code: `// ❌ Pitfall 1: Scroll jank from layout thrashing
// BAD: Triggering layout in scroll handler
container.addEventListener('scroll', () => {
  const height = element.clientHeight; // Layout read
  element.style.transform = \`translateY(\${height}px)\`; // Layout write
});

// ✅ GOOD: Batch reads and writes
let cachedHeight = 0;
container.addEventListener('scroll', () => {
  const scrollTop = container.scrollTop; // Read
  const newHeight = Math.floor(scrollTop / itemHeight) * itemHeight; // Calculate
  
  if (newHeight !== cachedHeight) {
    cachedHeight = newHeight;
    element.style.transform = \`translateY(\${newHeight}px)\`; // Single write
  }
});

// ❌ Pitfall 2: Not handling dynamic content
// BAD: Fixed item heights when content varies
const list = new VirtualList(container, items, 50);

// ✅ GOOD: Measure actual heights
const measuredHeights = new Map();
items.forEach((item, i) => {
  const el = document.createElement('div');
  el.textContent = item.text;
  document.body.appendChild(el);
  measuredHeights.set(i, el.offsetHeight);
  el.remove();
});

// ❌ Pitfall 3: Scroll jumping when adding items
// ✅ GOOD: Maintain scroll position
const scrollTop = container.scrollTop;
addItems(newItems);
container.scrollTop = scrollTop;

// ❌ Pitfall 4: Memory leaks with event listeners
// BAD
class VirtualList {
  constructor() {
    this.container.addEventListener('scroll', this.onScroll);
  }
}

// ✅ GOOD: Bind and cleanup
class VirtualList {
  constructor() {
    this.onScroll = this.onScroll.bind(this);
    this.container.addEventListener('scroll', this.onScroll);
  }

  destroy() {
    this.container.removeEventListener('scroll', this.onScroll);
  }
}` },
  ],
};
