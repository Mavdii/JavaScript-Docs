import type { ProjectContent } from '@/types/content';

export const chatAppProject: ProjectContent = {
  id: 'project-chat-app',
  title: 'Chat Application',
  description: 'Build a real-time chat application with React and WebSockets.',
  slug: 'projects/chat-app',
  pillar: 'projects',
  category: 'applications',
  tags: ['chat', 'WebSocket', 'realtime', 'React'],
  difficulty: 'intermediate',
  contentType: 'project',
  summary: 'Build a fully functional chat app with real-time messaging, chat rooms, typing indicators, and message history. This project teaches WebSocket connections, state management, and realtime patterns.',
  relatedTopics: ['websockets', 'integration-realtime'],
  order: 3,
  updatedAt: '2025-06-01',
  readingTime: 30,
  featured: true,
  keywords: ['chat app', 'WebSocket', 'realtime messaging'],
  techStack: ['React', 'TypeScript', 'WebSocket', 'Tailwind CSS'],
  learningGoals: ['Establish WebSocket connections', 'Implement real-time message delivery', 'Build chat room UI components', 'Handle typing indicators and presence'],
  features: ['Real-time messaging', 'Chat rooms', 'Typing indicators', 'Message timestamps', 'Auto-scroll'],
  sections: [
    { type: 'heading', level: 2, text: 'Project Architecture', id: 'architecture' },
    { type: 'paragraph', text: 'A chat app is fundamentally a WebSocket connection that broadcasts messages to everyone in a room. The frontend connects, the backend manages rooms and routes messages, and both sides handle edge cases like disconnects and lag.' },
    { type: 'table', headers: ['Layer', 'Technology', 'Responsibility'], rows: [
      ['UI', 'React + Tailwind CSS', 'Message list, input, room sidebar'],
      ['State', 'useReducer + Context', 'Messages, rooms, users, connection status'],
      ['Transport', 'WebSocket', 'Real-time bidirectional communication'],
      ['Server', 'Node.js / Deno', 'Room management, message broadcasting'],
    ]},

    { type: 'heading', level: 2, text: 'Data Models', id: 'data-models' },
    { type: 'code', language: 'typescript', code: `interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'text' | 'system' | 'image';
  edited?: boolean;
  replyTo?: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  members: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: number;
}

// WebSocket event types
type WsEvent =
  | { type: 'message'; payload: Message }
  | { type: 'typing'; payload: { userId: string; roomId: string; isTyping: boolean } }
  | { type: 'presence'; payload: { userId: string; status: User['status'] } }
  | { type: 'room:join'; payload: { roomId: string; userId: string } }
  | { type: 'room:leave'; payload: { roomId: string; userId: string } }
  | { type: 'message:edit'; payload: { messageId: string; text: string } }
  | { type: 'message:delete'; payload: { messageId: string } };` },

    { type: 'heading', level: 2, text: 'WebSocket Client with Auto-Reconnect', id: 'ws-client' },
    { type: 'paragraph', text: 'Building a robust WebSocket client means handling disconnects gracefully. We\'ll add reconnection logic, a message queue for offline messages, and heartbeats to detect dead connections.' },
    { type: 'code', language: 'typescript', code: `class ChatClient {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<(data: any) => void>>();
  private reconnectAttempts = 0;
  private maxReconnects = 10;
  private messageQueue: string[] = [];
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private url: string,
    private userId: string,
    private token: string
  ) {}

  connect(): void {
    this.ws = new WebSocket(\`\${this.url}?userId=\${this.userId}&token=\${this.token}\`);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
      this.flushQueue();
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        if (type === 'pong') return;
        this.emit(type, payload);
      } catch { /* ignore malformed messages */ }
    };

    this.ws.onclose = (e) => {
      this.stopHeartbeat();
      this.emit('connection', { status: 'disconnected' });
      if (e.code !== 1000 && this.reconnectAttempts < this.maxReconnects) {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000, 30000);
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), delay);
      }
    };

    this.ws.onerror = () => this.emit('connection', { status: 'error' });
  }

  send(type: string, payload: unknown): void {
    const msg = JSON.stringify({ type, payload });
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    } else {
      this.messageQueue.push(msg);
    }
  }

  private flushQueue() {
    while (this.messageQueue.length) this.ws?.send(this.messageQueue.shift()!);
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => this.send('ping', {}), 25000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
  }

  on(event: string, fn: (data: any) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn);
    return () => this.listeners.get(event)?.delete(fn);
  }

  private emit(event: string, data: unknown) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }

  joinRoom(roomId: string) { this.send('room:join', { roomId }); }
  leaveRoom(roomId: string) { this.send('room:leave', { roomId }); }
  sendMessage(roomId: string, text: string) {
    this.send('message', { roomId, text, id: crypto.randomUUID(), timestamp: Date.now() });
  }
  setTyping(roomId: string, isTyping: boolean) {
    this.send('typing', { roomId, isTyping });
  }

  disconnect() { this.stopHeartbeat(); this.ws?.close(1000); this.listeners.clear(); }
}` },

    { type: 'heading', level: 2, text: 'Chat State Management', id: 'state' },
    { type: 'code', language: 'typescript', code: `interface ChatState {
  rooms: Room[];
  activeRoomId: string | null;
  messages: Record<string, Message[]>; // roomId → messages
  typingUsers: Record<string, string[]>; // roomId → userIds
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  onlineUsers: Set<string>;
}

type ChatAction =
  | { type: 'SET_CONNECTION'; status: ChatState['connectionStatus'] }
  | { type: 'SET_ACTIVE_ROOM'; roomId: string }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_TYPING'; roomId: string; userId: string; isTyping: boolean }
  | { type: 'SET_PRESENCE'; userId: string; status: User['status'] }
  | { type: 'SET_ROOMS'; rooms: Room[] }
  | { type: 'MARK_READ'; roomId: string }
  | { type: 'EDIT_MESSAGE'; messageId: string; text: string }
  | { type: 'DELETE_MESSAGE'; messageId: string; roomId: string };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONNECTION':
      return { ...state, connectionStatus: action.status };

    case 'ADD_MESSAGE': {
      const { roomId } = action.message;
      const existing = state.messages[roomId] ?? [];
      // Prevent duplicates
      if (existing.some(m => m.id === action.message.id)) return state;
      return {
        ...state,
        messages: { ...state.messages, [roomId]: [...existing, action.message] },
        rooms: state.rooms.map(r =>
          r.id === roomId
            ? { ...r, lastMessage: action.message, unreadCount: r.id === state.activeRoomId ? 0 : r.unreadCount + 1 }
            : r
        ),
      };
    }

    case 'SET_TYPING': {
      const users = state.typingUsers[action.roomId] ?? [];
      const updated = action.isTyping
        ? [...new Set([...users, action.userId])]
        : users.filter(id => id !== action.userId);
      return { ...state, typingUsers: { ...state.typingUsers, [action.roomId]: updated } };
    }

    case 'MARK_READ':
      return {
        ...state,
        rooms: state.rooms.map(r => r.id === action.roomId ? { ...r, unreadCount: 0 } : r),
      };

    default:
      return state;
  }
}` },

    { type: 'heading', level: 2, text: 'Message List with Auto-Scroll', id: 'message-list' },
    { type: 'paragraph', text: 'Auto-scroll is a classic chat feature. We only auto-scroll if the user is already at the bottom. If they\'re scrolling up through history, we don\'t jump them back down.' },
    { type: 'code', language: 'tsx', code: `function MessageList({ messages, currentUserId }: {
  messages: Message[];
  currentUserId: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-scroll only if user is near the bottom
  useEffect(() => {
    if (isAtBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100;
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold);
  }

  // Group consecutive messages from same sender
  const grouped = messages.reduce<Message[][]>((groups, msg) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup[0].senderId === msg.senderId &&
        msg.timestamp - lastGroup[lastGroup.length - 1].timestamp < 60000) {
      lastGroup.push(msg);
    } else {
      groups.push([msg]);
    }
    return groups;
  }, []);

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4">
      {grouped.map((group) => {
        const isOwn = group[0].senderId === currentUserId;
        return (
          <div key={group[0].id} className={\`flex flex-col \${isOwn ? 'items-end' : 'items-start'}\`}>
            {!isOwn && (
              <span className="text-xs font-medium text-muted-foreground mb-1">
                {group[0].senderName}
              </span>
            )}
            {group.map(msg => (
              <div
                key={msg.id}
                className={\`max-w-[70%] rounded-2xl px-4 py-2 mb-0.5 \${
                  isOwn
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted rounded-bl-sm'
                }\`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            ))}
            <span className="text-xs text-muted-foreground mt-0.5">
              {formatTime(group[group.length - 1].timestamp)}
            </span>
          </div>
        );
      })}

      {!isAtBottom && (
        <button
          onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed bottom-20 right-6 rounded-full bg-primary p-2 shadow-lg"
        >
          ↓
        </button>
      )}
      <div ref={endRef} />
    </div>
  );
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}` },

    { type: 'heading', level: 2, text: 'Message Input with Typing Indicator', id: 'message-input' },
    { type: 'code', language: 'tsx', code: `function MessageInput({ onSend, onTyping }: {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
}) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);

    // Emit typing start
    onTyping(true);

    // Clear previous timeout and set new one
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText('');
    onTyping(false);
    clearTimeout(typingTimeoutRef.current);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
      <textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 resize-none rounded-xl border bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded-xl bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}` },

    { type: 'heading', level: 2, text: 'Typing Indicator Component', id: 'typing-indicator' },
    { type: 'code', language: 'tsx', code: `function TypingIndicator({ userNames }: { userNames: string[] }) {
  if (userNames.length === 0) return null;

  const text = userNames.length === 1
    ? \`\${userNames[0]} is typing...\`
    : userNames.length === 2
    ? \`\${userNames[0]} and \${userNames[1]} are typing...\`
    : \`\${userNames[0]} and \${userNames.length - 1} others are typing...\`;

  return (
    <div className="flex items-center gap-2 px-4 py-1 text-xs text-muted-foreground">
      <div className="flex gap-0.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: \`\${i * 150}ms\` }}
          />
        ))}
      </div>
      <span>{text}</span>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Room Sidebar', id: 'room-sidebar' },
    { type: 'code', language: 'tsx', code: `function RoomSidebar({ rooms, activeRoomId, onSelectRoom }: {
  rooms: Room[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}) {
  return (
    <aside className="w-72 border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={\`w-full text-left p-3 hover:bg-muted transition-colors \${
              room.id === activeRoomId ? 'bg-muted' : ''
            }\`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{room.name}</span>
              {room.unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {room.unreadCount}
                </span>
              )}
            </div>
            {room.lastMessage && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {room.lastMessage.senderName}: {room.lastMessage.text}
              </p>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}` },

    { type: 'heading', level: 2, text: 'Performance Considerations', id: 'performance' },
    { type: 'list', items: [
      'Virtualize long message lists with react-window to avoid rendering thousands of DOM nodes',
      'Debounce typing indicator events — emit at most once per 2 seconds',
      'Batch message inserts — group rapid messages into a single state update',
      'Use memo for message components to prevent re-renders on scroll',
      'Implement pagination for message history — load 50 messages at a time',
      'Clean up WebSocket listeners on component unmount to prevent memory leaks',
    ] },
    { type: 'callout', variant: 'tip', title: 'Message Deduplication', text: 'Generate a unique message ID (crypto.randomUUID()) on the client before sending. Check for duplicates in the reducer to prevent the same message from appearing twice when the server broadcasts it back.' },
  ],
};
