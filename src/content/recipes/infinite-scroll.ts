import type { RecipeContent } from '@/types/content';

export const infiniteScrollRecipe: RecipeContent = {
  id: 'infinite-scroll',
  title: 'Infinite Scroll',
  description: 'Load more content as the user scrolls using IntersectionObserver.',
  slug: 'recipes/infinite-scroll',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['infinite-scroll', 'lazy-loading', 'performance'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Implement infinite scroll with IntersectionObserver for seamless content loading.',
  relatedTopics: ['pagination', 'debouncing'],
  order: 6,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['infinite scroll', 'lazy load', 'IntersectionObserver', 'virtual scroll'],
  problem: 'Loading all items at once is slow. Infinite scroll loads content on demand as users scroll.',
  pitfalls: [
    'No loading indicator (users think it broke)',
    'Duplicate requests on rapid scroll',
    'Missing "end of list" state',
    'Back button losing scroll position',
    'Memory leaks from accumulated DOM nodes',
  ],
  variations: ['Load more button', 'Virtual scrolling', 'Bidirectional infinite scroll'],
  sections: [
    { type: 'heading', level: 2, text: 'IntersectionObserver Hook', id: 'hook' },
    { type: 'paragraph', text: 'The core pattern: place a sentinel element at the bottom of the list and use IntersectionObserver to detect when it becomes visible.' },
    { type: 'code', language: 'typescript', filename: 'useInfiniteScroll.ts', code: `function useInfiniteScroll(\\n  callback: () => void,\\n  options?: { threshold?: number; rootMargin?: string }\\n) {\\n  const sentinelRef = useRef<HTMLDivElement>(null);\\n  const callbackRef = useRef(callback);\\n  callbackRef.current = callback;\\n\\n  useEffect(() => {\\n    const sentinel = sentinelRef.current;\\n    if (!sentinel) return;\\n\\n    const observer = new IntersectionObserver(\\n      ([entry]) => {\\n        if (entry.isIntersecting) {\\n          callbackRef.current();\\n        }\\n      },\\n      {\\n        threshold: options?.threshold ?? 0.1,\\n        rootMargin: options?.rootMargin ?? '100px',\\n      }\\n    );\\n\\n    observer.observe(sentinel);\\n    return () => observer.disconnect();\\n  }, []);\\n\\n  return sentinelRef;\\n}` },

    { type: 'heading', level: 2, text: 'Complete Implementation', id: 'complete' },
    { type: 'code', language: 'tsx', filename: 'InfiniteList.tsx', code: `interface UseInfiniteDataOptions {\\n  pageSize?: number;\\n}\\n\\nfunction useInfiniteData<T>(url: string, opts?: UseInfiniteDataOptions) {\\n  const pageSize = opts?.pageSize ?? 20;\\n  const [items, setItems] = useState<T[]>([]);\\n  const [page, setPage] = useState(1);\\n  const [hasMore, setHasMore] = useState(true);\\n  const [loading, setLoading] = useState(false);\\n  const [error, setError] = useState<Error | null>(null);\\n\\n  const loadMore = useCallback(async () => {\\n    if (loading || !hasMore) return;\\n\\n    setLoading(true);\\n    setError(null);\\n    try {\\n      const res = await fetch(url + '?page=' + page + '&limit=' + pageSize);\\n      if (!res.ok) throw new Error('Failed to load');\\n      const data = await res.json();\\n\\n      setItems(prev => [...prev, ...data]);\\n      setHasMore(data.length === pageSize);\\n      setPage(p => p + 1);\\n    } catch (err) {\\n      setError(err instanceof Error ? err : new Error('Unknown error'));\\n    } finally {\\n      setLoading(false);\\n    }\\n  }, [page, loading, hasMore, url, pageSize]);\\n\\n  const sentinelRef = useInfiniteScroll(loadMore);\\n\\n  return { items, loading, error, hasMore, sentinelRef };\\n}\\n\\nfunction InfiniteList() {\\n  const { items, loading, error, sentinelRef } = useInfiniteData('/api/items');\\n\\n  return (\\n    <div className="space-y-4">\\n      {items.map((item, i) => (\\n        <div key={i} className="p-4 border rounded">{item.title}</div>\\n      ))}\\n      {error && <p className="text-destructive">Error: {error.message}</p>}\\n      {loading && <p className="text-muted-foreground">Loading...</p>}\\n      <div ref={sentinelRef} className="h-1" />\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'TanStack Query: useInfiniteQuery', id: 'tanstack-query' },
    { type: 'paragraph', text: 'TanStack Query provides a built-in useInfiniteQuery hook that handles caching, refetching, and page management automatically.' },
    { type: 'code', language: 'typescript', filename: 'useInfiniteItems.ts', code: `import { useInfiniteQuery } from '@tanstack/react-query';\\n\\nfunction useInfiniteItems() {\\n  return useInfiniteQuery({\\n    queryKey: ['items'],\\n    queryFn: async ({ pageParam }) => {\\n      const res = await fetch('/api/items?cursor=' + (pageParam ?? ''));\\n      return res.json();\\n    },\\n    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,\\n    initialPageParam: '',\\n  });\\n}\\n\\n// Usage\\nfunction Items() {\\n  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteItems();\\n  const sentinelRef = useInfiniteScroll(() => fetchNextPage());\\n\\n  return (\\n    <div>\\n      {data?.pages.map(page => page.items.map(item => (\\n        <div key={item.id}>{item.title}</div>\\n      )))}\\n      {isFetchingNextPage && <p>Loading...</p>}\\n      <div ref={sentinelRef} />\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Virtual Scrolling', id: 'virtual-scrolling' },
    { type: 'paragraph', text: 'When lists have thousands of items, rendering all DOM nodes causes performance issues. Virtual scrolling only renders items visible in the viewport.' },
    { type: 'code', language: 'tsx', filename: 'VirtualList.tsx', code: `import { useVirtualizer } from '@tanstack/react-virtual';\\n\\nfunction VirtualList({ items }: { items: Item[] }) {\\n  const parentRef = useRef<HTMLDivElement>(null);\\n\\n  const virtualizer = useVirtualizer({\\n    count: items.length,\\n    getScrollElement: () => parentRef.current,\\n    estimateSize: () => 72, // estimated item height\\n    overscan: 5, // render 5 extra items above/below\\n  });\\n\\n  return (\\n    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>\\n      <div style={{ height: String(virtualizer.getTotalSize()) + 'px' }}>\\n        {virtualizer.getVirtualItems().map(virtualItem => (\\n          <div key={virtualItem.key} data-index={virtualItem.index} style={{ height: String(virtualItem.size) + 'px' }}>\\n            {items[virtualItem.index].title}\\n          </div>\\n        ))}\\n      </div>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Scroll Restoration', id: 'scroll-restoration' },
    { type: 'paragraph', text: 'When users navigate away and return, they should see the same scroll position. Save it in sessionStorage.' },
    { type: 'code', language: 'typescript', filename: 'useScrollRestore.ts', code: `function useScrollRestore(key: string) {\\n  useEffect(() => {\\n    // Restore position\\n    const saved = sessionStorage.getItem('scroll-' + key);\\n    if (saved) {\\n      window.scrollTo(0, parseInt(saved, 10));\\n    }\\n\\n    // Save position on unmount\\n    return () => {\\n      sessionStorage.setItem('scroll-' + key, String(window.scrollY));\\n    };\\n  }, [key]);\\n}` },

    { type: 'heading', level: 2, text: 'Load More Button Alternative', id: 'load-more' },
    { type: 'paragraph', text: 'For better UX control, use a manual "Load More" button instead of auto-loading. Users can decide when to load more data.' },
    { type: 'code', language: 'tsx', filename: 'LoadMoreButton.tsx', code: `function LoadMoreButton({\\n  onClick, loading, remaining\\n}: {\\n  onClick: () => void;\\n  loading: boolean;\\n  remaining: number;\\n}) {\\n  return (\\n    <button\\n      onClick={onClick}\\n      disabled={loading}\\n      className="w-full py-3 border rounded hover:bg-muted transition"\\n    >\\n      {loading ? 'Loading...' : 'Load More (' + remaining + ')'}\\n    </button>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Performance Considerations', id: 'performance' },
    { type: 'list', items: [
      'Use rootMargin to prefetch before the sentinel is visible',
      'Implement virtual scrolling for 1000+ items to avoid DOM bloat',
      'Debounce rapid intersection events',
      'Use key props correctly to avoid re-renders when items shift',
      'Clean up observers on unmount to prevent memory leaks',
    ]},

    { type: 'callout', variant: 'warning', title: 'SEO', text: 'Infinite scroll hides content from search engines. For SEO-critical pages, use traditional pagination with <a> links. Consider a hybrid: infinite scroll for logged-in users, pagination for crawlers.' },
  ],
};
