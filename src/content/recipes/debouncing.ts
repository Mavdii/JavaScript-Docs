import type { RecipeContent } from '@/types/content';

export const debouncingRecipe: RecipeContent = {
  id: 'debouncing',
  title: 'Debouncing & Throttling',
  description: 'Control how often functions run during rapid events like typing or scrolling.',
  slug: 'recipes/debouncing',
  pillar: 'recipes',
  category: 'performance',
  tags: ['debounce', 'throttle', 'performance', 'events'],
  difficulty: 'beginner',
  contentType: 'recipe',
  summary: 'Master debouncing and throttling to optimize performance during frequent events like search input, window resizing, or scroll events.',
  relatedTopics: ['search-ui', 'form-validation'],
  order: 1,
  updatedAt: '2024-03-01',
  readingTime: 10,
  featured: false,
  keywords: ['debounce', 'throttle', 'performance', 'event handling'],
  problem: 'Events fire rapidly — typing, scrolling, resizing. Running logic on every event hammers your API and bogs down the UI.',
  pitfalls: [
    'Not cleaning up debounce timers (memory leaks)',
    'Confusing debounce and throttle (they\'re different!)',
    'Debouncing with zero delay (defeats the purpose)',
    'Not canceling pending requests when debouncing search',
  ],
  variations: ['Debounce leading edge', 'Debounce trailing edge', 'Throttle', 'Request deduplication'],
  sections: [
    { type: 'heading', level: 2, text: 'Debounce vs Throttle', id: 'comparison' },
    { type: 'paragraph', text: 'Debounce waits for the user to stop doing something (typing, resizing) before running. Throttle runs at most once per time interval. Search input? Debounce. Scroll event? Throttle. Different tools, different jobs.' },
    { type: 'table', headers: ['Pattern', 'When it runs', 'Best for', 'Example delay'], rows: [
      ['Debounce', 'After user stops (waits X ms)', 'Search, form validation, autosave', '300-500ms'],
      ['Throttle', 'At most once per X ms', 'Scroll, resize, mousemove', '100-200ms'],
    ]},

    { type: 'heading', level: 2, text: 'Basic Debounce', id: 'basic-debounce' },
    { type: 'code', language: 'typescript', filename: 'debounce.ts', code: `function debounce<T extends (...args: any[]) => any>(\\n  func: T,\\n  delay: number\\n): (...args: Parameters<T>) => void {\\n  let timeoutId: ReturnType<typeof setTimeout> | null = null;\\n\\n  return function(...args: Parameters<T>) {\\n    // Cancel previous call\\n    if (timeoutId !== null) {\\n      clearTimeout(timeoutId);\\n    }\\n    // Schedule new call\\n    timeoutId = setTimeout(() => {\\n      func(...args);\\n    }, delay);\\n  };\\n}\\n\\n// Usage\\nconst debouncedSearch = debounce((query: string) => {\\n  console.log('Searching for:', query);\\n}, 300);\\n\\n// Type as you normally would\\ninput.addEventListener('input', (e) => {\\n  debouncedSearch((e.target as HTMLInputElement).value);\\n}); // only searches after you stop typing for 300ms` },

    { type: 'heading', level: 2, text: 'Debounce with Cancel', id: 'debounce-cancel' },
    { type: 'code', language: 'typescript', filename: 'debounceCancel.ts', code: `function debounce<T extends (...args: any[]) => any>(\\n  func: T,\\n  delay: number\\n): ((...args: Parameters<T>) => void) & { cancel: () => void } {\\n  let timeoutId: ReturnType<typeof setTimeout> | null = null;\\n\\n  const debounced = (...args: Parameters<T>) => {\\n    if (timeoutId !== null) clearTimeout(timeoutId);\\n    timeoutId = setTimeout(() => {\\n      func(...args);\\n    }, delay);\\n  };\\n\\n  debounced.cancel = () => {\\n    if (timeoutId !== null) {\\n      clearTimeout(timeoutId);\\n      timeoutId = null;\\n    }\\n  };\\n\\n  return debounced;\\n}\\n\\n// Usage: clean up when component unmounts\\nconst debouncedSearch = debounce((q) => fetchSearch(q), 300);\\n\\nuseEffect(() => {\\n  return () => debouncedSearch.cancel(); // cleanup\\n}, []);` },

    { type: 'heading', level: 2, text: 'Throttle', id: 'throttle' },
    { type: 'code', language: 'typescript', filename: 'throttle.ts', code: `function throttle<T extends (...args: any[]) => any>(\\n  func: T,\\n  interval: number\\n): (...args: Parameters<T>) => void {\\n  let lastCall = 0;\\n\\n  return function(...args: Parameters<T>) {\\n    const now = Date.now();\\n    if (now - lastCall >= interval) {\\n      lastCall = now;\\n      func(...args);\\n    }\\n  };\\n}\\n\\n// Usage: scroll event fires ~60 times per second, throttle to 10 times per second\\nconst throttledScroll = throttle(() => {\\n  console.log('Scroll position:', window.scrollY);\\n}, 100); // fires at most every 100ms\\n\\nwindow.addEventListener('scroll', throttledScroll);` },

    { type: 'heading', level: 2, text: 'React Hook: useDebounce', id: 'react-hook' },
    { type: 'code', language: 'typescript', filename: 'useDebounce.ts', code: `function useDebounce<T>(value: T, delay: number): T {\\n  const [debouncedValue, setDebouncedValue] = useState(value);\\n\\n  useEffect(() => {\\n    const handler = setTimeout(() => {\\n      setDebouncedValue(value);\\n    }, delay);\\n\\n    return () => clearTimeout(handler);\\n  }, [value, delay]);\\n\\n  return debouncedValue;\\n}\\n\\n// Usage in a search component\\nfunction SearchUsers() {\\n  const [query, setQuery] = useState('');\\n  const debouncedQuery = useDebounce(query, 300);\\n  const { data: results } = useQuery({\\n    queryKey: ['search', debouncedQuery],\\n    queryFn: () => searchUsers(debouncedQuery),\\n    enabled: debouncedQuery.length >= 2,\\n  });\\n\\n  return (\\n    <>\\n      <input\\n        value={query}\\n        onChange={e => setQuery(e.target.value)}\\n        placeholder="Search..."\\n      />\\n      {results?.map(user => (\\n        <div key={user.id}>{user.name}</div>\\n      ))}\\n    </>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Search with Request Cancellation', id: 'search-cancel' },
    { type: 'code', language: 'typescript', filename: 'useSearch.ts', code: `function useSearch(query: string, delay = 300) {\\n  const [results, setResults] = useState([]);\\n  const [loading, setLoading] = useState(false);\\n  const controllerRef = useRef<AbortController | null>(null);\\n\\n  useEffect(() => {\\n    if (!query.trim()) {\\n      setResults([]);\\n      return;\\n    }\\n\\n    // Cancel previous request\\n    controllerRef.current?.abort();\\n    const controller = new AbortController();\\n    controllerRef.current = controller;\\n\\n    setLoading(true);\\n    const timer = setTimeout(async () => {\\n      try {\\n        const res = await fetch(\\\`/api/search?q=\\\${encodeURIComponent(query)}\\\`, {\\n          signal: controller.signal,\\n        });\\n        if (!res.ok) throw new Error('Search failed');\\n        const data = await res.json();\\n        setResults(data);\\n      } catch (err) {\\n        if (err instanceof DOMException && err.name === 'AbortError') {\\n          return; // request was cancelled — expected\\n        }\\n        console.error('Search error:', err);\\n      } finally {\\n        setLoading(false);\\n      }\\n    }, delay);\\n\\n    return () => {\\n      clearTimeout(timer);\\n      controller.abort();\\n    };\\n  }, [query, delay]);\\n\\n  return { results, loading };\\n}` },

    { type: 'heading', level: 2, text: 'Window Resize Handler', id: 'resize' },
    { type: 'code', language: 'typescript', filename: 'useWindowSize.ts', code: `function useWindowSize() {\\n  const [size, setSize] = useState({ width: 0, height: 0 });\\n\\n  useEffect(() => {\\n    // Set initial size\\n    setSize({ width: window.innerWidth, height: window.innerHeight });\\n\\n    // Throttled resize handler\\n    const handleResize = throttle(() => {\\n      setSize({ width: window.innerWidth, height: window.innerHeight });\\n    }, 150);\\n\\n    window.addEventListener('resize', handleResize);\\n    return () => window.removeEventListener('resize', handleResize);\\n  }, []);\\n\\n  return size;\\n}` },

    { type: 'heading', level: 2, text: 'Autosave Pattern', id: 'autosave' },
    { type: 'code', language: 'typescript', filename: 'useAutosave.ts', code: `function useAutosave(data: any, onSave: (data: any) => Promise<void>, delay = 2000) {\\n  const [saved, setSaved] = useState(true);\\n  const [error, setError] = useState<Error | null>(null);\\n\\n  const save = useCallback(async () => {\\n    try {\\n      setSaved(false);\\n      setError(null);\\n      await onSave(data);\\n      setSaved(true);\\n    } catch (err) {\\n      setError(err instanceof Error ? err : new Error('Save failed'));\\n    }\\n  }, [data, onSave]);\\n\\n  const debouncedSave = useMemo(() => debounce(save, delay), [save, delay]);\\n\\n  useEffect(() => {\\n    debouncedSave();\\n  }, [data, debouncedSave]);\\n\\n  return { saved, error };\\n}\\n\\n// Usage\\nfunction TextEditor() {\\n  const [content, setContent] = useState('');\\n  const { saved } = useAutosave(content, async (text) => {\\n    await fetch('/api/save', { method: 'POST', body: JSON.stringify({ text }) });\\n  }, 1000);\\n\\n  return (\\n    <div>\\n      <textarea value={content} onChange={e => setContent(e.target.value)} />\\n      <span>{saved ? '✓ Saved' : '◉ Saving...'}</span>\\n    </div>\\n  );\\n}` },

    { type: 'callout', variant: 'warning', title: 'Memory Leaks', text: 'Always clean up debounce timers in useEffect cleanup functions. Forgetting this means timers keep running even after your component unmounts, holding onto stale state.' },
  ],
};
