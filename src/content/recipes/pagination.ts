import type { RecipeContent } from '@/types/content';

export const paginationRecipe: RecipeContent = {
  id: 'pagination',
  title: 'Pagination',
  description: 'Implement page-based and cursor-based pagination patterns.',
  slug: 'recipes/pagination',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['pagination', 'lists', 'data'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Build pagination with page numbers, next/prev navigation, and cursor-based pagination for efficient data loading.',
  relatedTopics: ['infinite-scroll'],
  order: 4,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['pagination', 'cursor', 'page', 'offset'],
  problem: 'Load all data = slow. Pagination lets users browse data in chunks without overwhelming the API.',
  pitfalls: [
    'Offset pagination with huge datasets (slow queries)',
    'Not including total count (can\'t show "Page 3 of 100")',
    'No URL persistence (refresh loses your page)',
    'Broken back button (history doesn\'t work)',
  ],
  variations: ['Offset pagination', 'Cursor-based pagination', 'Keyset pagination'],
  sections: [
    { type: 'heading', level: 2, text: 'Offset-Based Pagination', id: 'offset' },
    { type: 'code', language: 'typescript', filename: 'useOffsetPagination.ts', code: `interface PaginationState {\\n  page: number;\\n  pageSize: number;\\n  total: number;\\n  totalPages: number;\\n}\\n\\nfunction useOffsetPagination<T>(\\n  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,\\n  pageSize = 20\\n) {\\n  const [state, setState] = useState<PaginationState>({\\n    page: 1,\\n    pageSize,\\n    total: 0,\\n    totalPages: 0,\\n  });\\n  const [items, setItems] = useState<T[]>([]);\\n  const [loading, setLoading] = useState(false);\\n\\n  const goToPage = useCallback(async (page: number) => {\\n    setLoading(true);\\n    const { data, total } = await fetchFn(page, pageSize);\\n    setItems(data);\\n    setState({\\n      page,\\n      pageSize,\\n      total,\\n      totalPages: Math.ceil(total / pageSize),\\n    });\\n    setLoading(false);\\n  }, [fetchFn, pageSize]);\\n\\n  const nextPage = () => goToPage(state.page + 1);\\n  const prevPage = () => goToPage(Math.max(1, state.page - 1));\\n\\n  useEffect(() => {\\n    goToPage(1);\\n  }, [goToPage]);\\n\\n  return { items, ...state, goToPage, nextPage, prevPage, loading };\\n}` },

    { type: 'heading', level: 2, text: 'Cursor-Based Pagination', id: 'cursor' },
    { type: 'paragraph', text: 'Better for large datasets. Instead of "page 1000", use a cursor (like an ID or timestamp) pointing to where you left off.' },
    { type: 'code', language: 'typescript', filename: 'useCursorPagination.ts', code: `interface CursorPageState<T> {\\n  data: T[];\\n  nextCursor: string | null;\\n  prevCursor: string | null;\\n  isFirst: boolean;\\n  isLast: boolean;\\n}\\n\\nfunction useCursorPagination<T>(\\n  fetchFn: (cursor?: string) => Promise<CursorPageState<T>>,\\n  pageSize = 20\\n) {\\n  const [pages, setPages] = useState<CursorPageState<T>[]>([]);\\n  const [currentIndex, setCurrentIndex] = useState(0);\\n  const [loading, setLoading] = useState(true);\\n\\n  const loadPage = useCallback(async (cursor?: string) => {\\n    setLoading(true);\\n    const page = await fetchFn(cursor);\\n    setPages(prev => [...prev, page]);\\n    setCurrentIndex(prev => prev + 1);\\n    setLoading(false);\\n  }, [fetchFn]);\\n\\n  const nextPage = () => {\\n    const current = pages[currentIndex];\\n    if (current?.nextCursor) {\\n      loadPage(current.nextCursor);\\n    }\\n  };\\n\\n  const prevPage = () => {\\n    if (currentIndex > 0) {\\n      setCurrentIndex(prev => prev - 1);\\n    }\\n  };\\n\\n  useEffect(() => {\\n    loadPage();\\n  }, []);\\n\\n  const current = pages[currentIndex] || { data: [], nextCursor: null, isLast: false };\\n  return { items: current.data, nextPage, prevPage, loading, isLast: current.isLast };\\n}` },

    { type: 'heading', level: 2, text: 'URL-Based Pagination', id: 'url-pagination' },
    { type: 'code', language: 'tsx', filename: 'UrlPagination.tsx', code: `function useUrlPagination(pageSize = 20) {\\n  const [searchParams, setSearchParams] = useSearchParams();\\n  const page = parseInt(searchParams.get('page') ?? '1', 10);\\n\\n  const goToPage = (newPage: number) => {\\n    setSearchParams({ page: String(Math.max(1, newPage)) });\\n  };\\n\\n  return { page, goToPage };\\n}\\n\\nfunction ItemsList() {\\n  const { page, goToPage } = useUrlPagination();\\n  const { items, totalPages, loading } = useOffsetPagination(\\n    async (p) => {\\n      const res = await fetch(\\\`/api/items?page=\\\${p}\\\`);\\n      return res.json();\\n    }\\n  );\\n\\n  return (\\n    <div>\\n      <ul>{items.map(item => <li key={item.id}>{item.title}</li>)}</ul>\\n      <div className="flex gap-2 mt-4">\\n        <button onClick={() => goToPage(page - 1)} disabled={page === 1}>Previous</button>\\n        <span>Page {page} of {totalPages}</span>\\n        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</button>\\n      </div>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Page Number Buttons', id: 'page-buttons' },
    { type: 'code', language: 'tsx', filename: 'PageNumbers.tsx', code: `function PageNumbers({\\n  current,\\n  total,\\n  onPage,\\n  maxVisible = 5,\\n}: {\\n  current: number;\\n  total: number;\\n  onPage: (page: number) => void;\\n  maxVisible?: number;\\n}) {\\n  const getPageNumbers = () => {\\n    const half = Math.floor(maxVisible / 2);\\n    let start = Math.max(1, current - half);\\n    let end = Math.min(total, start + maxVisible - 1);\\n    if (end - start < maxVisible - 1) {\\n      start = Math.max(1, end - maxVisible + 1);\\n    }\\n    return Array.from({ length: end - start + 1 }, (_, i) => start + i);\\n  };\\n\\n  return (\\n    <div className="flex gap-1">\\n      <button onClick={() => onPage(current - 1)} disabled={current === 1}>← Prev</button>\\n      {getPageNumbers().map(num => (\\n        <button\\n          key={num}\\n          onClick={() => onPage(num)}\\n          className={'px-2 py-1 rounded' + (current === num ? ' bg-primary text-primary-foreground' : ' border')}\\n        >\\n          {num}\\n        </button>\\n      ))}\\n      <button onClick={() => onPage(current + 1)} disabled={current === total}>Next →</button>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'TanStack Query Pagination', id: 'tanstack-query' },
    { type: 'code', language: 'typescript', filename: 'useItemsQuery.ts', code: `function useItemsQuery(page: number, pageSize = 20) {\\n  return useQuery({\\n    queryKey: ['items', page],\\n    queryFn: async () => {\\n      const res = await fetch('/api/items?page=' + page + '&pageSize=' + pageSize);\\n      return res.json();\\n    },\\n    staleTime: 5 * 60 * 1000, // cache 5 minutes\\n    placeholderData: (prev) => prev, // keep old data while loading next page\\n  });\\n}` },

    { type: 'heading', level: 2, text: 'Comparison: Offset vs Cursor', id: 'comparison' },
    { type: 'table', headers: ['Aspect', 'Offset', 'Cursor'], rows: [
      ['Performance', 'Slow with large offsets', 'Fast and consistent'],
      ['Back button', 'Works (stateless)', 'Works (stateless)'],
      ['Real-time data', 'Can show duplicates if sorted by newest', 'Handles changes gracefully'],
      ['Skip to page', 'Easy', 'Impossible'],
      ['Best for', 'Small datasets, search results', 'Large datasets, feeds, timelines'],
    ]},

    { type: 'callout', variant: 'tip', title: 'When to Use Each', text: 'Use offset pagination for small datasets or when users need to jump to specific pages. Use cursor-based for feeds, timelines, or when you\'re concerned about performance.' },
  ],
};
