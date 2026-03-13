import type { LessonContent } from '@/types/content';

export const websocketsLesson: LessonContent = {
  id: 'websockets',
  title: 'WebSockets',
  description: 'Build real-time two-way communication between browser and server — no polling needed.',
  slug: 'learn/browser/websockets',
  pillar: 'learn',
  category: 'browser',
  tags: ['websockets', 'realtime', 'chat', 'bidirectional'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'WebSockets are persistent two-way connections. Server and client can send messages to each other anytime — way better than polling.',
  relatedTopics: ['fetch', 'event-loop'],
  order: 8,
  updatedAt: '2024-03-01',
  readingTime: 16,
  featured: false,
  keywords: ['WebSocket', 'real-time', 'chat', 'bidirectional', 'ws', 'wss', 'reconnection', 'heartbeat', 'SSE'],
  prerequisites: ['Events', 'Async/Await'],
  learningGoals: [
    'Create WebSocket connections',
    'Send and receive messages',
    'Handle reconnection with exponential backoff',
    'Implement heartbeat/ping-pong',
    'Build a type-safe message protocol',
    'Compare WebSocket with SSE and HTTP polling',
  ],
  exercises: [
    'Build a simple chat client that connects to a WebSocket server.',
    'Implement a reconnection manager with exponential backoff.',
    'Create a real-time stock ticker using WebSockets.',
    'Build a collaborative text editor with WebSocket sync.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What Are WebSockets?', id: 'what-are-websockets' },
    { type: 'paragraph', text: 'WebSockets provide a persistent, full-duplex communication channel between the browser and server over a single TCP connection. After an initial HTTP handshake (upgrade), both client and server can send messages at any time, without the overhead of HTTP headers on each message.' },
    { type: 'paragraph', text: 'This makes WebSockets ideal for real-time apps: chat, live notifications, multiplayer games, collaborative editing, stock tickers, and IoT dashboards. They\'re fundamentally different from HTTP\'s request-response model.' },

    { type: 'heading', level: 2, text: 'Basic Connection', id: 'basic-connection' },
    {
      type: 'code', language: 'javascript', filename: 'websocket.js',
      code: `// Create a WebSocket connection
const ws = new WebSocket('wss://echo.websocket.org');
// wss:// = secure (like HTTPS), ws:// = insecure (like HTTP)

// Connection opened
ws.onopen = () => {
  console.log('Connected');
  ws.send('Hello Server!');
};

// Message received
ws.onmessage = (event) => {
  console.log('Received:', event.data);
  // event.data can be string, Blob, or ArrayBuffer
};

// Error occurred
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Connection closed
ws.onclose = (event) => {
  console.log('Disconnected:', event.code, event.reason);
  console.log('Clean close:', event.wasClean);
};`,
    },

    { type: 'heading', level: 2, text: 'Connection Lifecycle', id: 'lifecycle' },
    {
      type: 'table',
      headers: ['ReadyState', 'Constant', 'Value', 'Meaning'],
      rows: [
        ['CONNECTING', 'WebSocket.CONNECTING', '0', 'Connection in progress'],
        ['OPEN', 'WebSocket.OPEN', '1', 'Connected and ready to send'],
        ['CLOSING', 'WebSocket.CLOSING', '2', 'Connection closing'],
        ['CLOSED', 'WebSocket.CLOSED', '3', 'Connection closed'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'readystate.js',
      code: `// Always check readyState before sending
function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(data);
    return true;
  }
  console.warn('WebSocket not open, state:', ws.readyState);
  return false;
}

// Close the connection
ws.close(1000, 'Normal closure'); // code, reason
// Code 1000 = normal closure
// Code 1001 = going away (page unload)`,
    },

    { type: 'heading', level: 2, text: 'Sending Data', id: 'sending' },
    {
      type: 'code', language: 'javascript', filename: 'sending.js',
      code: `// Send text
ws.send('Hello');

// Send JSON (most common for apps)
ws.send(JSON.stringify({
  type: 'chat_message',
  payload: { text: 'Hi there!', room: 'general' },
  timestamp: Date.now(),
}));

// Send binary data
const buffer = new ArrayBuffer(8);
ws.send(buffer);

// Send Blob
const blob = new Blob(['binary data'], { type: 'application/octet-stream' });
ws.send(blob);

// Set binary type for receiving
ws.binaryType = 'arraybuffer'; // or 'blob' (default)`,
    },

    { type: 'heading', level: 2, text: 'Message Protocol', id: 'protocol' },
    { type: 'paragraph', text: 'WebSocket messages are raw text or binary — there\'s no built-in structure. Define a protocol for your app with typed messages:' },
    {
      type: 'code', language: 'typescript', filename: 'protocol.ts',
      code: `// Define message types
type ClientMessage =
  | { type: 'join_room'; room: string }
  | { type: 'leave_room'; room: string }
  | { type: 'chat_message'; room: string; text: string }
  | { type: 'typing'; room: string; isTyping: boolean };

type ServerMessage =
  | { type: 'room_joined'; room: string; users: string[] }
  | { type: 'chat_message'; room: string; from: string; text: string; timestamp: number }
  | { type: 'user_joined'; room: string; user: string }
  | { type: 'user_left'; room: string; user: string }
  | { type: 'typing'; room: string; user: string; isTyping: boolean }
  | { type: 'error'; message: string };

// Type-safe send
function send(ws: WebSocket, message: ClientMessage) {
  ws.send(JSON.stringify(message));
}

// Type-safe receive
function handleMessage(data: string) {
  const message: ServerMessage = JSON.parse(data);

  switch (message.type) {
    case 'chat_message':
      displayMessage(message.from, message.text);
      break;
    case 'user_joined':
      showNotification(\`\${message.user} joined \${message.room}\`);
      break;
    case 'typing':
      updateTypingIndicator(message.user, message.isTyping);
      break;
    case 'error':
      showError(message.message);
      break;
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Reconnection with Backoff', id: 'reconnection' },
    {
      type: 'code', language: 'typescript', filename: 'reconnect.ts',
      code: `class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private retries = 0;
  private maxRetries = 10;
  private listeners = new Map<string, Set<Function>>();
  private messageQueue: string[] = [];

  constructor(
    private url: string,
    private protocols?: string | string[]
  ) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url, this.protocols);

    this.ws.onopen = () => {
      console.log('Connected');
      this.retries = 0;

      // Flush queued messages
      while (this.messageQueue.length > 0) {
        this.ws!.send(this.messageQueue.shift()!);
      }

      this.emit('open');
    };

    this.ws.onmessage = (event) => {
      this.emit('message', event.data);
    };

    this.ws.onclose = (event) => {
      this.emit('close', event);

      if (!event.wasClean && this.retries < this.maxRetries) {
        const delay = Math.min(1000 * 2 ** this.retries, 30000);
        const jitter = Math.random() * 1000;
        this.retries++;
        console.log(\`Reconnecting in \${delay + jitter}ms (attempt \${this.retries})\`);
        setTimeout(() => this.connect(), delay + jitter);
      }
    };

    this.ws.onerror = () => {
      this.emit('error');
    };
  }

  send(data: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.messageQueue.push(data); // Queue for when reconnected
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  private emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach(cb => cb(...args));
  }

  close() {
    this.maxRetries = 0; // Prevent reconnection
    this.ws?.close(1000, 'Client closing');
  }
}

// Usage
const ws = new ReconnectingWebSocket('wss://api.example.com/ws');

ws.on('message', (data: string) => {
  const msg = JSON.parse(data);
  handleMessage(msg);
});

ws.send(JSON.stringify({ type: 'join', room: 'general' }));`,
    },
    { type: 'callout', variant: 'tip', title: 'Jitter', text: 'Always add random jitter to backoff delays. Without it, all disconnected clients will try to reconnect at the same time, overwhelming the server (thundering herd problem).' },

    { type: 'heading', level: 2, text: 'Heartbeat / Ping-Pong', id: 'heartbeat' },
    { type: 'paragraph', text: 'WebSocket connections can silently die (network change, proxy timeout). Use heartbeat messages to detect dead connections:' },
    {
      type: 'code', language: 'javascript', filename: 'heartbeat.js',
      code: `function createHeartbeat(ws, intervalMs = 30000, timeoutMs = 5000) {
  let pingInterval;
  let pongTimeout;

  function startHeartbeat() {
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));

        // If no pong received within timeout, connection is dead
        pongTimeout = setTimeout(() => {
          console.warn('Heartbeat timeout — closing connection');
          ws.close(4000, 'Heartbeat timeout');
        }, timeoutMs);
      }
    }, intervalMs);
  }

  function handlePong() {
    clearTimeout(pongTimeout);
  }

  function stopHeartbeat() {
    clearInterval(pingInterval);
    clearTimeout(pongTimeout);
  }

  return { startHeartbeat, handlePong, stopHeartbeat };
}

// Usage
const ws = new WebSocket('wss://api.example.com/ws');
const heartbeat = createHeartbeat(ws);

ws.onopen = () => heartbeat.startHeartbeat();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'pong') {
    heartbeat.handlePong();
  } else {
    handleAppMessage(msg);
  }
};

ws.onclose = () => heartbeat.stopHeartbeat();`,
    },

    { type: 'heading', level: 2, text: 'React WebSocket Hook', id: 'react-hook' },
    {
      type: 'code', language: 'tsx', filename: 'useWebSocket.tsx',
      code: `import { useEffect, useRef, useState, useCallback } from 'react';

type WSStatus = 'connecting' | 'open' | 'closed' | 'error';

function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>('connecting');
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setStatus('open');
    ws.onclose = () => setStatus('closed');
    ws.onerror = () => setStatus('error');
    ws.onmessage = (e) => setLastMessage(e.data);

    return () => {
      ws.close(1000, 'Component unmount');
    };
  }, [url]);

  const send = useCallback((data: string | object) => {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  return { status, lastMessage, send };
}

// Usage
function Chat({ room }: { room: string }) {
  const { status, lastMessage, send } = useWebSocket(
    \`wss://api.example.com/ws?room=\${room}\`
  );
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage);
      if (msg.type === 'chat_message') {
        setMessages(prev => [...prev, msg.text]);
      }
    }
  }, [lastMessage]);

  if (status !== 'open') return <p>Connecting...</p>;

  return (
    <div>
      {messages.map((msg, i) => <p key={i}>{msg}</p>)}
      <input onKeyDown={(e) => {
        if (e.key === 'Enter') {
          send({ type: 'chat_message', text: e.currentTarget.value, room });
          e.currentTarget.value = '';
        }
      }} />
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'HTTP vs WebSocket vs SSE', id: 'comparison' },
    {
      type: 'table',
      headers: ['Feature', 'HTTP Polling', 'SSE', 'WebSocket'],
      rows: [
        ['Direction', 'Client → Server', 'Server → Client', 'Bidirectional'],
        ['Connection', 'New per request', 'Persistent', 'Persistent'],
        ['Protocol', 'HTTP', 'HTTP', 'WS (TCP)'],
        ['Overhead', 'High (headers per req)', 'Low', 'Very low'],
        ['Auto-reconnect', 'N/A', '✅ Built-in', '❌ Manual'],
        ['Binary data', '✅ Yes', '❌ Text only', '✅ Yes'],
        ['Browser support', 'All', 'All (no IE)', 'All (no IE)'],
        ['Use case', 'Infrequent updates', 'Live feeds, notifications', 'Chat, gaming, collab'],
        ['Complexity', 'Simple', 'Simple', 'Complex'],
      ],
    },
    { type: 'callout', variant: 'info', title: 'Choose Wisely', text: 'Use SSE for server-to-client streams (notifications, feeds). Use WebSocket only when you need bidirectional communication. HTTP polling is fine for updates every 30+ seconds.' },

    { type: 'heading', level: 2, text: 'Server-Sent Events (SSE) Comparison', id: 'sse' },
    {
      type: 'code', language: 'javascript', filename: 'sse.js',
      code: `// SSE: Server → Client only (simpler than WebSocket)
const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
  console.log('Data:', event.data);
};

eventSource.addEventListener('notification', (event) => {
  console.log('Notification:', JSON.parse(event.data));
});

eventSource.onerror = () => {
  console.log('SSE error — will auto-reconnect');
};

// Close when done
eventSource.close();

// SSE advantages over WebSocket:
// - Auto-reconnect built-in
// - Works with HTTP/2
// - Simpler server implementation
// - No special protocol needed`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Sending before connection is open
const ws = new WebSocket('wss://example.com');
ws.send('hello'); // Error! Still CONNECTING

// ✅ Fix: Wait for onopen
ws.onopen = () => ws.send('hello');

// ❌ Mistake 2: No reconnection logic
const ws2 = new WebSocket('wss://example.com');
ws2.onclose = () => console.log('Disconnected');
// Connection lost = app is dead!

// ✅ Fix: Always implement reconnection

// ❌ Mistake 3: Not closing on unmount
useEffect(() => {
  const ws = new WebSocket(url);
  // If component unmounts, connection leaks!
  // ✅ Fix: return () => ws.close();
}, []);

// ❌ Mistake 4: JSON.parse without try/catch
ws.onmessage = (e) => {
  const data = JSON.parse(e.data); // Will crash on non-JSON messages!
};

// ✅ Fix
ws.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data);
    handleMessage(data);
  } catch {
    console.warn('Non-JSON message:', e.data);
  }
};`,
    },

    { type: 'heading', level: 2, text: 'Close Codes', id: 'close-codes' },
    {
      type: 'table',
      headers: ['Code', 'Meaning', 'Reconnect?'],
      rows: [
        ['1000', 'Normal closure', 'No'],
        ['1001', 'Going away (page unload)', 'No'],
        ['1006', 'Abnormal closure (no close frame)', 'Yes'],
        ['1008', 'Policy violation', 'No'],
        ['1011', 'Server error', 'Yes (with backoff)'],
        ['1012', 'Server restarting', 'Yes (after delay)'],
        ['1013', 'Try again later', 'Yes (after delay)'],
        ['4000-4999', 'Application-specific', 'Depends on your protocol'],
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'How do WebSockets differ from HTTP?',
        'What is the WebSocket handshake process?',
        'How do you handle reconnection? What is exponential backoff?',
        'What are Server-Sent Events (SSE) and when would you use them instead?',
        'How do you detect dead connections?',
        'What are WebSocket close codes?',
        'How would you implement a chat room with WebSockets?',
        'What is the thundering herd problem in reconnection?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Always use wss:// (secure WebSocket) in production',
        'Implement reconnection with exponential backoff + jitter',
        'Use heartbeat/ping-pong to detect dead connections',
        'Define a typed message protocol (don\'t send raw strings)',
        'Queue messages sent while disconnected, flush on reconnect',
        'Close connections on component unmount / page unload',
        'Consider SSE for server-to-client-only communication',
        'Use established libraries (Socket.IO, Ably) for complex real-time needs',
        'Wrap JSON.parse in try/catch for all received messages',
      ],
    },
  ],
};
