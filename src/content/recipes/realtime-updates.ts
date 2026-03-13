import type { RecipeContent } from '@/types/content';

export const realtimeUpdatesRecipe: RecipeContent = {
  id: 'realtime-updates',
  title: 'Realtime Updates',
  description: 'Keep UI in sync with server data using polling, SSE, and WebSockets.',
  slug: 'recipes/realtime-updates',
  pillar: 'recipes',
  category: 'data-patterns',
  tags: ['realtime', 'polling', 'SSE', 'websockets'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Implement real-time data synchronization with polling, Server-Sent Events, or WebSockets.',
  relatedTopics: ['debouncing'],
  order: 9,
  updatedAt: '2024-03-01',
  readingTime: 14,
  featured: false,
  keywords: ['realtime', 'polling', 'SSE', 'WebSocket', 'sync', 'live data'],
  problem: 'Users expect live data without manual refreshes. Polling hammers servers, but you need something.',
  pitfalls: [
    'Polling way too frequently (goodbye CPU)',
    'Not cleaning up connections on unmount',
    'Missing reconnection logic (goes stale)',
    'No backoff on errors (retries immediately)',
    'Memory leaks from accumulated listeners',
  ],
  variations: ['Short polling', 'Long polling', 'Server-Sent Events', 'WebSocket'],
  sections: [
    { type: 'heading', level: 2, text: 'Transport Comparison', id: 'comparison' },
    { type: 'table', headers: ['Method', 'Direction', 'Complexity', 'Latency', 'Best For'], rows: [
      ['Short Polling', 'Client → Server', 'Low', 'High (interval)', 'Simple dashboards'],
      ['Long Polling', 'Client → Server', 'Medium', 'Medium', 'Chat fallback'],
      ['SSE', 'Server → Client', 'Medium', 'Low', 'Notifications, feeds'],
      ['WebSocket', 'Bidirectional', 'High', 'Lowest', 'Chat, gaming, collaboration'],
    ]},

    { type: 'heading', level: 2, text: 'Polling Hook', id: 'polling' },
    { type: 'code', language: 'typescript', filename: 'usePolling.ts', code: `function usePolling<T>(\\n  url: string,\\n  interval = 5000,\\n  options?: { enabled?: boolean; onError?: (err: Error) => void }\\n) {\\n  const [data, setData] = useState<T | null>(null);\\n  const [loading, setLoading] = useState(true);\\n  const [error, setError] = useState<Error | null>(null);\\n\\n  useEffect(() => {\\n    if (options?.enabled === false) return;\\n\\n    let active = true;\\n    const controller = new AbortController();\\n\\n    async function poll() {\\n      try {\\n        const res = await fetch(url, { signal: controller.signal });\\n        if (!res.ok) throw new Error('Status ' + res.status);\\n        const json = await res.json();\\n        if (active) {\\n          setData(json);\\n          setError(null);\\n        }\\n      } catch (err) {\\n        if (active) {\\n          const error = err instanceof Error ? err : new Error('Unknown error');\\n          setError(error);\\n          options?.onError?.(error);\\n        }\\n      } finally {\\n        if (active) setLoading(false);\\n      }\\n    }\\n\\n    poll();\\n    const timer = setInterval(poll, interval);\\n    return () => {\\n      active = false;\\n      clearInterval(timer);\\n      controller.abort();\\n    };\\n  }, [url, interval, options?.enabled]);\\n\\n  return { data, loading, error };\\n}` },

    { type: 'heading', level: 2, text: 'Smart Polling with Visibility', id: 'smart-polling' },
    { type: 'paragraph', text: 'Stop polling when the tab is hidden to save bandwidth and battery.' },
    { type: 'code', language: 'typescript', filename: 'useSmartPolling.ts', code: `function usePageVisible() {\\n  const [visible, setVisible] = useState(!document.hidden);\\n\\n  useEffect(() => {\\n    const handler = () => setVisible(!document.hidden);\\n    document.addEventListener('visibilitychange', handler);\\n    return () => document.removeEventListener('visibilitychange', handler);\\n  }, []);\\n\\n  return visible;\\n}\\n\\n// Usage: pause polling when tab is hidden\\nfunction useDashboardData(url: string) {\\n  const visible = usePageVisible();\\n  return usePolling(url, 5000, { enabled: visible });\\n}` },

    { type: 'heading', level: 2, text: 'Server-Sent Events (SSE)', id: 'sse' },
    { type: 'code', language: 'typescript', filename: 'useSSE.ts', code: `function useSSE<T>(url: string) {\\n  const [data, setData] = useState<T | null>(null);\\n  const [connected, setConnected] = useState(false);\\n  const [error, setError] = useState<string | null>(null);\\n\\n  useEffect(() => {\\n    const source = new EventSource(url);\\n\\n    source.onopen = () => {\\n      setConnected(true);\\n      setError(null);\\n    };\\n\\n    source.onmessage = (event) => {\\n      try {\\n        const parsed = JSON.parse(event.data);\\n        setData(parsed);\\n      } catch {\\n        setError('Failed to parse message');\\n      }\\n    };\\n\\n    source.onerror = () => {\\n      setConnected(false);\\n      setError('Connection lost — auto-reconnecting...');\\n    };\\n\\n    return () => source.close();\\n  }, [url]);\\n\\n  return { data, connected, error };\\n}` },

    { type: 'heading', level: 2, text: 'WebSocket with Reconnection', id: 'websocket' },
    { type: 'code', language: 'typescript', filename: 'useWebSocket.ts', code: `interface UseWebSocketOptions {\\n  onMessage: (data: any) => void;\\n  onConnect?: () => void;\\n  onDisconnect?: () => void;\\n  reconnect?: boolean;\\n  maxRetries?: number;\\n}\\n\\nfunction useWebSocket(url: string, options: UseWebSocketOptions) {\\n  const wsRef = useRef<WebSocket | null>(null);\\n  const retriesRef = useRef(0);\\n  const maxRetries = options.maxRetries ?? 5;\\n\\n  const connect = useCallback(() => {\\n    const ws = new WebSocket(url);\\n    wsRef.current = ws;\\n\\n    ws.onopen = () => {\\n      retriesRef.current = 0;\\n      options.onConnect?.();\\n    };\\n\\n    ws.onmessage = (event) => {\\n      const data = JSON.parse(event.data);\\n      options.onMessage(data);\\n    };\\n\\n    ws.onclose = () => {\\n      options.onDisconnect?.();\\n      if (options.reconnect && retriesRef.current < maxRetries) {\\n        const delay = Math.min(1000 * Math.pow(2, retriesRef.current), 10000);\\n        retriesRef.current++;\\n        setTimeout(connect, delay);\\n      }\\n    };\\n  }, [url, options]);\\n\\n  useEffect(() => {\\n    connect();\\n    return () => wsRef.current?.close();\\n  }, [connect]);\\n\\n  return {\\n    send: (data: any) => wsRef.current?.send(JSON.stringify(data)),\\n    connected: wsRef.current?.readyState === WebSocket.OPEN,\\n  };\\n}` },

    { type: 'heading', level: 2, text: 'Heartbeat / Keep-Alive', id: 'heartbeat' },
    { type: 'code', language: 'typescript', filename: 'heartbeat.ts', code: `function useHeartbeat(ws: WebSocket | null, intervalMs = 30000) {\\n  useEffect(() => {\\n    if (!ws || ws.readyState !== WebSocket.OPEN) return;\\n\\n    const id = setInterval(() => {\\n      if (ws.readyState === WebSocket.OPEN) {\\n        ws.send(JSON.stringify({ type: 'ping' }));\\n      }\\n    }, intervalMs);\\n\\n    return () => clearInterval(id);\\n  }, [ws, intervalMs]);\\n}` },

    { type: 'heading', level: 2, text: 'Optimistic UI Updates', id: 'optimistic' },
    { type: 'paragraph', text: 'Show changes immediately in the UI before the server confirms them, then reconcile when the server responds.' },
    { type: 'code', language: 'typescript', filename: 'optimistic.ts', code: `function useOptimisticList<T extends { id: string }>() {\\n  const [items, setItems] = useState<T[]>([]);\\n  const [pending, setPending] = useState<Map<string, T>>(new Map());\\n\\n  const addOptimistic = (item: T) => {\\n    // Show immediately\\n    setItems(prev => [...prev, item]);\\n    setPending(prev => new Map(prev).set(item.id, item));\\n  };\\n\\n  const confirmItem = (tempId: string, confirmedItem: T) => {\\n    // Replace temp with confirmed\\n    setItems(prev => prev.map(i => i.id === tempId ? confirmedItem : i));\\n    setPending(prev => { const m = new Map(prev); m.delete(tempId); return m; });\\n  };\\n\\n  const rejectItem = (tempId: string) => {\\n    // Remove rejected item\\n    setItems(prev => prev.filter(i => i.id !== tempId));\\n    setPending(prev => { const m = new Map(prev); m.delete(tempId); return m; });\\n  };\\n\\n  return { items, pending, addOptimistic, confirmItem, rejectItem };\\n}` },

    { type: 'heading', level: 2, text: 'Connection Status UI', id: 'connection-status' },
    { type: 'code', language: 'tsx', filename: 'ConnectionBanner.tsx', code: `function ConnectionBanner({ connected }: { connected: boolean }) {\\n  if (connected) return null;\\n\\n  return (\\n    <div\\n      role="alert"\\n      className="fixed top-0 inset-x-0 bg-yellow-500 text-yellow-950 text-center py-2 text-sm font-medium z-50"\\n    >\\n      ⚡ Connection lost. Attempting to reconnect...\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'When to Use Each', id: 'decision-guide' },
    { type: 'list', items: [
      'Polling: data changes infrequently, simplicity is priority, < 100 concurrent users',
      'SSE: server pushes updates, no need for client-to-server messages, auto-reconnect needed',
      'WebSocket: bidirectional real-time (chat, collaboration), low-latency required',
      'Polling + WebSocket hybrid: use polling as fallback when WebSocket fails',
    ]},

    { type: 'callout', variant: 'tip', title: 'TanStack Query Polling', text: 'TanStack Query supports polling out of the box with refetchInterval. Set refetchIntervalInBackground: false to pause when tab is hidden. This is the simplest approach for dashboard-style polling.' },
  ],
};
