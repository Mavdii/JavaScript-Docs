import type { RecipeContent } from '@/types/content';

export const searchUiRecipe: RecipeContent = {
  id: 'search-ui',
  title: 'Search UI',
  description: 'Build responsive search with autocomplete, highlighting, and keyboard navigation.',
  slug: 'recipes/search-ui',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['search', 'autocomplete', 'UI'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Create a search interface with debounced input, result highlighting, and keyboard navigation.',
  relatedTopics: ['debouncing', 'form-validation'],
  order: 5,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['search', 'autocomplete', 'highlight', 'keyboard', 'cmdk'],
  problem: 'Search UIs need instant feedback, result highlighting, and accessible keyboard navigation.',
  pitfalls: [
    'Not debouncing API calls (hammers server)',
    'Missing keyboard navigation (arrow keys)',
    'No empty/error states (confusing UX)',
    'Not cancelling stale requests (shows wrong results)',
    'XSS via unescaped highlight HTML',
  ],
  variations: ['Command palette (⌘K)', 'Fuzzy search', 'Search with filters', 'Typeahead autocomplete'],
  sections: [
    { type: 'heading', level: 2, text: 'Debounced Search Hook', id: 'debounced-hook' },
    { type: 'code', language: 'typescript', filename: 'useSearch.ts', code: `function useSearch<T>(url: string, delay = 300) {\\n  const [query, setQuery] = useState('');\\n  const [results, setResults] = useState<T[]>([]);\\n  const [loading, setLoading] = useState(false);\\n  const [error, setError] = useState<string | null>(null);\\n\\n  useEffect(() => {\\n    if (!query.trim()) {\\n      setResults([]);\\n      return;\\n    }\\n\\n    setLoading(true);\\n    setError(null);\\n    const controller = new AbortController();\\n\\n    const timer = setTimeout(async () => {\\n      try {\\n        const res = await fetch(\\\`\\\${url}?q=\\\${encodeURIComponent(query)}\\\`, {\\n          signal: controller.signal,\\n        });\\n        if (!res.ok) throw new Error('Search failed');\\n        const data = await res.json();\\n        setResults(data);\\n      } catch (err) {\\n        if (err instanceof DOMException && err.name === 'AbortError') return;\\n        setError((err as Error).message);\\n      } finally {\\n        setLoading(false);\\n      }\\n    }, delay);\\n\\n    return () => {\\n      clearTimeout(timer);\\n      controller.abort();\\n    };\\n  }, [query, url, delay]);\\n\\n  return { query, setQuery, results, loading, error };\\n}` },

    { type: 'heading', level: 2, text: 'Highlight Matches', id: 'highlight' },
    { type: 'paragraph', text: 'Safely highlight matching substrings without using dangerouslySetInnerHTML to prevent XSS.' },
    { type: 'code', language: 'tsx', filename: 'Highlight.tsx', code: `function Highlight({ text, query }: { text: string; query: string }) {\\n  if (!query.trim()) return <>{text}</>;\\n\\n  // Escape regex special characters\\n  const escaped = query.replace(/[.*+?^{}$()|[\\\\]\\\\\\\\]/g, '\\\\\\\\$&');\\n  const regex = new RegExp('(' + escaped + ')', 'gi');\\n  const parts = text.split(regex);\\n\\n  return (\\n    <>\\n      {parts.map((part, i) =>\\n        regex.test(part)\\n          ? <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark>\\n          : <span key={i}>{part}</span>\\n      )}\\n    </>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Keyboard Navigation', id: 'keyboard-nav' },
    { type: 'code', language: 'typescript', filename: 'useKeyboardNav.ts', code: `function useKeyboardNav<T>(items: T[]) {\\n  const [activeIndex, setActiveIndex] = useState(-1);\\n\\n  // Reset when items change\\n  useEffect(() => setActiveIndex(-1), [items]);\\n\\n  const onKeyDown = useCallback((e: React.KeyboardEvent) => {\\n    switch (e.key) {\\n      case 'ArrowDown':\\n        e.preventDefault();\\n        setActiveIndex(i => Math.min(i + 1, items.length - 1));\\n        break;\\n      case 'ArrowUp':\\n        e.preventDefault();\\n        setActiveIndex(i => Math.max(i - 1, -1));\\n        break;\\n      case 'Enter':\\n        if (activeIndex >= 0) {\\n          e.preventDefault();\\n          // Handle selection\\n        }\\n        break;\\n      case 'Escape':\\n        setActiveIndex(-1);\\n        break;\\n    }\\n  }, [activeIndex, items.length]);\\n\\n  return { activeIndex, onKeyDown };\\n}` },

    { type: 'heading', level: 2, text: 'Complete Search Component', id: 'complete-component' },
    { type: 'code', language: 'tsx', filename: 'SearchBox.tsx', code: `function SearchBox() {\\n  const { query, setQuery, results, loading, error } = useSearch('/api/search');\\n  const { activeIndex, onKeyDown } = useKeyboardNav(results);\\n  const inputRef = useRef<HTMLInputElement>(null);\\n\\n  return (\\n    <div className="relative" role="combobox" aria-expanded={results.length > 0}>\\n      <div className="relative">\\n        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />\\n        <input\\n          ref={inputRef}\\n          value={query}\\n          onChange={(e) => setQuery(e.target.value)}\\n          onKeyDown={onKeyDown}\\n          placeholder="Search..."\\n          className="w-full pl-9 pr-3 py-2 border rounded-lg"\\n          aria-autocomplete="list"\\n          aria-controls="search-results"\\n        />\\n        {query && (\\n          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">✕</button>\\n        )}\\n      </div>\\n\\n      {loading && <p className="text-sm text-muted-foreground mt-2">Searching...</p>}\\n      {error && <p className="text-sm text-destructive mt-2">Error: {error}</p>}\\n\\n      {results.length > 0 && (\\n        <div id="search-results" className="absolute top-full left-0 right-0 mt-1 border rounded-lg bg-background shadow-lg z-50">\\n          {results.map((result, i) => (\\n            <button\\n              key={i}\\n              onClick={() => setQuery(result.title)}\\n              className={'w-full text-left px-4 py-2 hover:bg-muted' + (activeIndex === i ? ' bg-muted' : '')}\\n              role="option"\\n              aria-selected={activeIndex === i}\\n            >\\n              <Highlight text={result.title} query={query} />\\n            </button>\\n          ))}\\n        </div>\\n      )}\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Command Palette (⌘K)', id: 'command-palette' },
    { type: 'paragraph', text: 'The command palette pattern — opened with ⌘K / Ctrl+K — is popular in developer tools. Use the cmdk library or build your own with Dialog + search.' },
    { type: 'code', language: 'typescript', filename: 'useCommandK.ts', code: `function useCommandK(onOpen: () => void) {\\n  useEffect(() => {\\n    const handler = (e: KeyboardEvent) => {\\n      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {\\n        e.preventDefault();\\n        onOpen();\\n      }\\n    };\\n    document.addEventListener('keydown', handler);\\n    return () => document.removeEventListener('keydown', handler);\\n  }, [onOpen]);\\n}` },

    { type: 'heading', level: 2, text: 'Client-Side Fuzzy Search', id: 'fuzzy-search' },
    { type: 'paragraph', text: 'For small datasets, search locally without API calls. A simple fuzzy search scores matches by character position.' },
    { type: 'code', language: 'typescript', filename: 'fuzzySearch.ts', code: `function fuzzyMatch(text: string, pattern: string): number {\\n  const lower = text.toLowerCase();\\n  const chars = pattern.toLowerCase().split('');\\n  let score = 0;\\n  let lastIndex = -1;\\n\\n  for (const char of chars) {\\n    const index = lower.indexOf(char, lastIndex + 1);\\n    if (index === -1) return 0; // no match\\n    score += index === lastIndex + 1 ? 2 : 1; // consecutive bonus\\n    lastIndex = index;\\n  }\\n\\n  return score;\\n}\\n\\nfunction fuzzySearch<T>(items: T[], pattern: string, gettext: (item: T) => string) {\\n  return items\\n    .map(item => ({ item, score: fuzzyMatch(gettext(item), pattern) }))\\n    .filter(({ score }) => score > 0)\\n    .sort((a, b) => b.score - a.score)\\n    .map(({ item }) => item);\\n}` },

    { type: 'heading', level: 2, text: 'Search with Filters', id: 'filters' },
    { type: 'code', language: 'typescript', filename: 'filtered-search.ts', code: `interface SearchParams {\\n  query: string;\\n  category?: string;\\n  sortBy?: 'relevance' | 'date' | 'name';\\n  dateRange?: { from: string; to: string };\\n}\\n\\nfunction buildSearchURL(base: string, params: SearchParams): string {\\n  const url = new URL(base);\\n  url.searchParams.set('q', params.query);\\n  if (params.category) url.searchParams.set('category', params.category);\\n  if (params.sortBy) url.searchParams.set('sort', params.sortBy);\\n  if (params.dateRange) {\\n    url.searchParams.set('from', params.dateRange.from);\\n    url.searchParams.set('to', params.dateRange.to);\\n  }\\n  return url.toString();\\n}` },

    { type: 'heading', level: 2, text: 'Recent Searches', id: 'recent-searches' },
    { type: 'code', language: 'typescript', filename: 'recentSearches.ts', code: `const MAX_RECENT = 5;\\nconst STORAGE_KEY = 'recent-searches';\\n\\nfunction getRecent(): string[] {\\n  try {\\n    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');\\n  } catch {\\n    return [];\\n  }\\n}\\n\\nfunction addRecent(query: string): void {\\n  const recent = getRecent().filter(q => q !== query);\\n  recent.unshift(query);\\n  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));\\n}` },

    { type: 'heading', level: 2, text: 'Accessibility Checklist', id: 'accessibility' },
    { type: 'list', items: [
      'Use role="combobox" on container, role="listbox" on results',
      'Set aria-expanded, aria-autocomplete="list", aria-controls',
      'Mark active item with aria-selected="true"',
      'Announce result count with aria-live="polite" region',
      'Support Escape to close, Enter to select, Arrow keys to navigate',
    ]},

    { type: 'heading', level: 2, text: 'Performance Tips', id: 'performance' },
    { type: 'callout', variant: 'tip', title: 'Optimization', text: 'For client-side search over large lists, use a Web Worker to avoid blocking the UI thread. Libraries like Fuse.js or MiniSearch handle indexing and fuzzy matching efficiently.' },
  ],
};
