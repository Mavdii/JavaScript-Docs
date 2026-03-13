import type { IntegrationContent } from '@/types/content';

export const realtimeIntegration: IntegrationContent = {
  id: 'integration-realtime',
  title: 'Realtime Systems',
  description: 'Build realtime features using WebSockets, Server-Sent Events, and polling.',
  slug: 'integrations/realtime',
  pillar: 'integrations',
  category: 'auth-payments',
  tags: ['realtime', 'WebSocket', 'SSE', 'polling'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'Learn when to use WebSockets vs SSE vs polling. We\'ll build a realtime client with reconnection logic, explore server-push patterns, and handle edge cases like network failures.',
  relatedTopics: ['websockets', 'realtime-updates'],
  order: 7,
  updatedAt: '2025-06-01',
  readingTime: 12,
  featured: false,
  keywords: ['WebSocket', 'SSE', 'realtime', 'push notifications'],
  requiredLibraries: ['WebSocket (built-in)', 'EventSource (built-in)'],
  setupSteps: ['Choose a transport (WebSocket, SSE, or polling)', 'Set up server-side support', 'Handle reconnection logic'],
  authNotes: 'WebSocket connections can pass auth tokens via query params or the first message after connection.',
  sections: [
    { type: 'heading', level: 2, text: 'Choosing a Transport', id: 'choosing-transport' },
    { type: 'paragraph', text: 'So you need data pushed to your client in real time. But which approach? WebSocket is two-way, SSE is one-way but simpler, and polling works literally everywhere. Let me break down the tradeoffs so you can pick the right one.' },
    { type: 'table', headers: ['Feature', 'WebSocket', 'SSE', 'Long Polling'], rows: [
      ['Direction', 'Bidirectional', 'Server → Client', 'Simulated bidirectional'],
      ['Protocol', 'ws:// / wss://', 'HTTP/1.1 or HTTP/2', 'HTTP/1.1+'],
      ['Reconnection', 'Manual', 'Automatic (built-in)', 'Manual'],
      ['Binary data', 'Yes (ArrayBuffer, Blob)', 'No (text only)', 'Yes'],
      ['Max connections', '~6 per domain (HTTP/1.1)', 'Shared via HTTP/2', '~6 per domain'],
      ['Proxy/CDN support', 'Requires upgrade support', 'Works everywhere', 'Works everywhere'],
      ['Best for', 'Chat, gaming, collaboration', 'Notifications, feeds, dashboards', 'Legacy support'],
    ]},

    { type: 'heading', level: 2, text: 'WebSocket — Full-Duplex Communication', id: 'websocket' },
    { type: 'code', language: 'typescript', code: `class RealtimeClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private listeners = new Map<string, Set<(data: unknown) => void>>();
  private messageQueue: string[] = [];
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private url: string,
    private options: {
      token?: string;
      heartbeatMs?: number;
      reconnectBaseMs?: number;
    } = {}
  ) {}

  connect(): void {
    const wsUrl = this.options.token
      ? \`\${this.url}?token=\${this.options.token}\`
      : this.url;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.reconnectAttempts = 0;
      this.flushQueue();
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        if (type === 'pong') return; // heartbeat response
        this.listeners.get(type)?.forEach(fn => fn(payload));
      } catch {
        console.warn('[WS] Invalid message:', event.data);
      }
    };

    this.ws.onclose = (event) => {
      console.log(\`[WS] Closed: \${event.code} \${event.reason}\`);
      this.stopHeartbeat();
      if (event.code !== 1000) this.reconnect();
    };

    this.ws.onerror = () => {
      console.error('[WS] Connection error');
    };
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnection attempts reached');
      this.listeners.get('disconnect')?.forEach(fn => fn({ permanent: true }));
      return;
    }

    const baseDelay = this.options.reconnectBaseMs ?? 1000;
    const delay = Math.min(
      baseDelay * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000,
      30_000
    );

    this.reconnectAttempts++;
    console.log(\`[WS] Reconnecting in \${Math.round(delay)}ms (attempt \${this.reconnectAttempts})\`);
    setTimeout(() => this.connect(), delay);
  }

  private startHeartbeat(): void {
    const interval = this.options.heartbeatMs ?? 30_000;
    this.heartbeatInterval = setInterval(() => {
      this.send('ping', {});
    }, interval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(type: string, payload: unknown): void {
    const message = JSON.stringify({ type, payload });
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()!;
      this.ws?.send(msg);
    }
  }

  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.ws?.close(1000, 'Client disconnecting');
    this.ws = null;
    this.listeners.clear();
  }
}` },

    { type: 'heading', level: 2, text: 'React Hook for WebSocket', id: 'ws-hook' },
    { type: 'code', language: 'typescript', code: `function useRealtime<T>(url: string, event: string) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const clientRef = useRef<RealtimeClient | null>(null);

  useEffect(() => {
    const client = new RealtimeClient(url);
    clientRef.current = client;

    client.on('connect', () => setStatus('connected'));
    client.on('disconnect', () => setStatus('disconnected'));
    client.on(event, (payload) => setData(payload as T));

    client.connect();

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, [url, event]);

  const send = useCallback((type: string, payload: unknown) => {
    clientRef.current?.send(type, payload);
  }, []);

  return { data, status, send };
}` },

    { type: 'heading', level: 2, text: 'Server-Sent Events (SSE)', id: 'sse' },
    { type: 'paragraph', text: 'SSE is dead simple for server-to-client streaming. The browser auto-reconnects if the connection drops, and it works through proxies without any special config. Perfect for notifications, live feeds, or dashboards where you don\'t need bidirectional communication.' },
    { type: 'code', language: 'typescript', code: `function useSSE<T>(url: string, eventName?: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const source = new EventSource(url);

    const handler = (event: MessageEvent) => {
      try {
        setData(JSON.parse(event.data));
        setError(null);
      } catch {
        setError('Failed to parse SSE message');
      }
    };

    if (eventName) {
      source.addEventListener(eventName, handler);
    } else {
      source.onmessage = handler;
    }

    source.onerror = () => {
      setError('SSE connection error — auto-reconnecting...');
    };

    return () => source.close();
  }, [url, eventName]);

  return { data, error };
}

// Server-side SSE endpoint (Deno/Edge Function)
// Response headers: Content-Type: text/event-stream
// Each message: "data: {...}\\n\\n"
// Named events: "event: notification\\ndata: {...}\\n\\n"
// Resume via Last-Event-ID header` },

    { type: 'heading', level: 2, text: 'Polling with Adaptive Intervals', id: 'polling' },
    { type: 'code', language: 'typescript', code: `function usePolling<T>(
  fetcher: () => Promise<T>,
  options: {
    intervalMs: number;
    onData?: (prev: T | null, next: T) => void;
    enabled?: boolean;
    adaptiveInterval?: { min: number; max: number };
  }
) {
  const [data, setData] = useState<T | null>(null);
  const intervalRef = useRef(options.intervalMs);

  useEffect(() => {
    if (options.enabled === false) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    async function poll() {
      try {
        const result = await fetcher();
        if (cancelled) return;

        const hasChanged = JSON.stringify(result) !== JSON.stringify(data);
        setData(result);
        options.onData?.(data, result);

        // Adaptive: slow down when no changes, speed up when active
        if (options.adaptiveInterval) {
          intervalRef.current = hasChanged
            ? options.adaptiveInterval.min
            : Math.min(intervalRef.current * 1.5, options.adaptiveInterval.max);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      if (!cancelled) {
        timeoutId = setTimeout(poll, intervalRef.current);
      }
    }

    poll();
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, [options.enabled]);

  return data;
}` },

    { type: 'heading', level: 2, text: 'Optimistic UI Updates', id: 'optimistic-ui' },
    { type: 'code', language: 'typescript', code: `// Apply changes instantly, then confirm via server
function useOptimisticList<T extends { id: string }>(initial: T[]) {
  const [items, setItems] = useState(initial);
  const [pending, setPending] = useState<Set<string>>(new Set());

  async function optimisticUpdate(
    id: string,
    updater: (item: T) => T,
    serverCall: () => Promise<T>
  ) {
    // Optimistic: update UI immediately
    setItems(prev => prev.map(item => item.id === id ? updater(item) : item));
    setPending(prev => new Set(prev).add(id));

    try {
      const confirmed = await serverCall();
      setItems(prev => prev.map(item => item.id === id ? confirmed : item));
    } catch {
      // Rollback on failure
      setItems(prev => prev.map(item => item.id === id ? initial.find(i => i.id === id)! : item));
    } finally {
      setPending(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  }

  return { items, pending, optimisticUpdate };
}` },

    { type: 'heading', level: 2, text: 'When to Use What', id: 'decision-guide' },
    { type: 'list', items: [
      'Chat / Gaming / Collaboration → WebSocket (bidirectional, low latency)',
      'Live dashboard / Notifications → SSE (simple, auto-reconnect, server-push)',
      'Checking for updates every N seconds → Polling (simplest, works everywhere)',
      'Large file streaming → Fetch + ReadableStream (progressive loading)',
      'Need offline support → Service Worker + Background Sync',
    ] },
    { type: 'callout', variant: 'tip', title: 'HTTP/2 and SSE', text: 'Under HTTP/2, SSE connections are multiplexed over a single TCP connection, eliminating the browser\'s 6-connection limit per domain. If your server supports HTTP/2, SSE becomes an even more attractive option.' },
  ],
};
