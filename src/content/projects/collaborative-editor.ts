import type { ProjectContent } from '@/types/content';

export const collaborativeEditorProject: ProjectContent = {
  id: 'project-collaborative-editor',
  title: 'Collaborative Text Editor',
  description: 'Build a real-time collaborative text editor with WebSockets, operational transformation, and multi-user support.',
  slug: 'projects/collaborative-editor',
  pillar: 'projects',
  category: 'applications',
  tags: ['collaborative', 'websockets', 'real-time', 'operational transformation', 'cursor tracking'],
  difficulty: 'advanced',
  contentType: 'project',
  summary: 'Create a Google Docs-like collaborative editor with real-time sync, operational transformation for conflict resolution, cursor tracking, user presence, and conflict-free editing.',
  relatedTopics: ['integration-realtime', 'integration-websockets'],
  order: 10,
  updatedAt: '2025-06-01',
  readingTime: 35,
  featured: true,
  keywords: ['collaborative editing', 'operational transformation', 'websockets', 'real-time sync', 'cursor tracking'],
  techStack: ['React', 'TypeScript', 'WebSockets', 'Operational Transformation'],
  learningGoals: [
    'Implement operational transformation',
    'Sync edits across clients',
    'Track cursor positions',
    'Show user presence',
    'Resolve conflicts automatically',
    'Handle network latency',
  ],
  features: [
    'Real-time text synchronization',
    'Multiple simultaneous editors',
    'Cursor and selection tracking',
    'User presence indicators',
    'Version history',
    'Conflict resolution',
    'Offline support with sync queue',
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Operational Transformation Basics',
      id: 'ot-basics',
    },
    {
      type: 'paragraph',
      text: 'Operational Transformation (OT) allows multiple users to edit simultaneously by transforming operations to account for concurrent edits. When Alice inserts "A" at position 0 and Bob inserts "B" at position 0, OT ensures both see "AB" not conflicting states.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Operation types
type Operation = InsertOp | DeleteOp;

interface InsertOp {
  type: 'insert';
  position: number;
  content: string;
  userId: string;
  timestamp: number;
}

interface DeleteOp {
  type: 'delete';
  position: number;
  length: number;
  userId: string;
  timestamp: number;
}

// Apply operation to text
function applyOperation(text: string, op: Operation): string {
  if (op.type === 'insert') {
    return (
      text.slice(0, op.position) + op.content + text.slice(op.position)
    );
  } else if (op.type === 'delete') {
    return (
      text.slice(0, op.position) + text.slice(op.position + op.length)
    );
  }
  return text;
}

// Transform operation based on concurrent operation
function transformOperation(
  op: Operation,
  concurrentOp: Operation
): Operation {
  // If operations don't affect same range, return unchanged
  if (
    op.type === 'insert' &&
    concurrentOp.type === 'insert'
  ) {
    if (op.position < concurrentOp.position) {
      return op; // No conflict
    } else if (op.position > concurrentOp.position) {
      // Shift position right by concurrent insert length
      return {
        ...op,
        position: op.position + concurrentOp.content.length,
      };
    } else {
      // Same position: use timestamp to determine order
      if (op.userId < concurrentOp.userId) {
        return op;
      } else {
        return {
          ...op,
          position: op.position + concurrentOp.content.length,
        };
      }
    }
  }

  if (op.type === 'insert' && concurrentOp.type === 'delete') {
    if (op.position <= concurrentOp.position) {
      return op; // Insert is before delete
    } else if (op.position >= concurrentOp.position + concurrentOp.length) {
      // Insert is after delete
      return {
        ...op,
        position: op.position - concurrentOp.length,
      };
    } else {
      // Insert is within deleted range
      return {
        ...op,
        position: concurrentOp.position,
      };
    }
  }

  // Handle delete + insert
  if (op.type === 'delete' && concurrentOp.type === 'insert') {
    if (op.position + op.length <= concurrentOp.position) {
      return op; // Delete is before insert
    } else if (op.position >= concurrentOp.position) {
      // Delete is after insert
      return {
        ...op,
        position: op.position + concurrentOp.content.length,
      };
    } else {
      // Delete spans the insert position
      return {
        ...op,
        length: op.length + concurrentOp.content.length,
      };
    }
  }

  // Delete + Delete
  if (op.type === 'delete' && concurrentOp.type === 'delete') {
    if (op.position + op.length <= concurrentOp.position) {
      return op;
    } else if (op.position >= concurrentOp.position + concurrentOp.length) {
      return {
        ...op,
        position: op.position - concurrentOp.length,
      };
    } else {
      const deletedBefore = Math.max(0, concurrentOp.position - op.position);
      const deletedAfter = Math.max(
        0,
        op.position + op.length - (concurrentOp.position + concurrentOp.length)
      );
      return {
        ...op,
        length: op.length - (concurrentOp.length - deletedBefore - deletedAfter),
      };
    }
  }

  return op;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Editor State & History Management',
      id: 'state-management',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface EditorState {
  content: string;
  version: number;
  userId: string;
  cursorPosition: number;
  selectionEnd?: number;
}

interface RemoteOperation {
  operation: Operation;
  version: number;
  userId: string;
}

class OperationHistory {
  private operations: Operation[] = [];
  private version: number = 0;

  addOperation(op: Operation): void {
    this.operations.push(op);
    this.version++;
  }

  getOperationsSince(version: number): Operation[] {
    return this.operations.slice(version);
  }

  getCurrentVersion(): number {
    return this.version;
  }

  // Transform incoming operation against all local ops since version
  transformIncoming(
    incomingOp: Operation,
    incomingSinceVersion: number
  ): Operation {
    let transformed = incomingOp;

    for (let i = incomingSinceVersion; i < this.version; i++) {
      transformed = transformOperation(transformed, this.operations[i]);
    }

    return transformed;
  }

  // Transform outgoing operations against incoming op
  transformOutgoing(incomingOp: Operation): Operation[] {
    const result: Operation[] = [];

    for (let i = 0; i < this.operations.length; i++) {
      const op = this.operations[i];
      const transformed = transformOperation(op, incomingOp);
      result.push(transformed);
      // Also transform incoming op
      incomingOp = transformOperation(incomingOp, op);
    }

    return result;
  }
}

// React hook for editor state
function useCollaborativeEditor(userId: string) {
  const [content, setContent] = useState('');
  const [version, setVersion] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const historyRef = useRef(new OperationHistory());

  const applyLocalOperation = (op: Operation) => {
    setContent((prev) => applyOperation(prev, op));
    historyRef.current.addOperation(op);
    setVersion((prev) => prev + 1);
  };

  const applyRemoteOperation = (op: Operation, remoteVersion: number) => {
    const history = historyRef.current;

    // Transform incoming op
    const transformed = history.transformIncoming(op, remoteVersion);

    // Apply to content
    setContent((prev) => applyOperation(prev, transformed));

    // Update cursor if needed
    if (transformed.type === 'insert' && transformed.position <= cursorPosition) {
      setCursorPosition(
        (prev) => prev + transformed.content.length
      );
    } else if (
      transformed.type === 'delete' &&
      transformed.position < cursorPosition
    ) {
      setCursorPosition((prev) =>
        Math.max(transformed.position, prev - transformed.length)
      );
    }

    setVersion((prev) => prev + 1);
  };

  return {
    content,
    version,
    cursorPosition,
    setCursorPosition,
    applyLocalOperation,
    applyRemoteOperation,
  };
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'WebSocket Real-time Sync',
      id: 'websocket-sync',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface EditorMessage {
  type: 'operation' | 'cursor' | 'presence' | 'ack';
  payload: any;
  version?: number;
  userId: string;
}

class CollaborativeEditorClient {
  private ws: WebSocket | null = null;
  private userId: string;
  private documentId: string;
  private pendingOperations: Operation[] = [];
  private version: number = 0;
  private onRemoteOperation?: (op: Operation, version: number) => void;
  private onRemoteCursor?: (userId: string, position: number) => void;

  constructor(userId: string, documentId: string) {
    this.userId = userId;
    this.documentId = documentId;
  }

  connect(serverUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(serverUrl);

        this.ws.onopen = () => {
          console.log('Connected to server');
          this.sendMessage('join', {
            userId: this.userId,
            documentId: this.documentId,
          });
          resolve();
        };

        this.ws.onmessage = (event) => {
          const message: EditorMessage = JSON.parse(event.data);
          this.handleMessage(message);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Disconnected from server');
          this.reconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  sendOperation(op: Operation): void {
    this.pendingOperations.push(op);
    this.sendMessage('operation', {
      operation: op,
      version: this.version,
    });
  }

  sendCursorPosition(position: number): void {
    this.sendMessage('cursor', {
      position,
    });
  }

  private handleMessage(message: EditorMessage): void {
    switch (message.type) {
      case 'operation': {
        if (message.userId !== this.userId) {
          if (this.onRemoteOperation) {
            this.onRemoteOperation(message.payload.operation, message.version!);
          }
        }
        this.version++;
        break;
      }

      case 'cursor': {
        if (this.onRemoteCursor) {
          this.onRemoteCursor(message.userId, message.payload.position);
        }
        break;
      }

      case 'ack': {
        // Remove acknowledged operation from pending
        this.pendingOperations.shift();
        break;
      }
    }
  }

  private sendMessage(type: string, payload: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    const message: EditorMessage = {
      type: type as any,
      payload,
      userId: this.userId,
      version: this.version,
    };

    this.ws.send(JSON.stringify(message));
  }

  private reconnect(): void {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      // Reconnect logic
    }, 3000);
  }

  close(): void {
    this.ws?.close();
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Text Editor Component with Cursor Tracking',
      id: 'editor-component',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `interface RemoteCursor {
  userId: string;
  position: number;
  color: string;
  userName: string;
}

function CollaborativeTextEditor() {
  const userId = useId();
  const documentId = 'doc-123';

  const editor = useCollaborativeEditor(userId);
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<CollaborativeEditorClient | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize connection
  useEffect(() => {
    const client = new CollaborativeEditorClient(userId, documentId);
    clientRef.current = client;

    client.connect('wss://collab-server.example.com').then(() => {
      setConnected(true);
    });

    client.onRemoteOperation = (op, version) => {
      editor.applyRemoteOperation(op, version);
    };

    client.onRemoteCursor = (remoteUserId, position) => {
      if (remoteUserId !== userId) {
        setRemoteCursors((prev) => [
          ...prev.filter((c) => c.userId !== remoteUserId),
          {
            userId: remoteUserId,
            position,
            color: generateColor(remoteUserId),
            userName: remoteUserId.slice(0, 6),
          },
        ]);
      }
    };

    return () => {
      client.close();
    };
  }, []);

  // Handle text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const oldContent = editor.content;

    if (newContent.length > oldContent.length) {
      // Insertion
      const inserted = newContent.substring(
        e.target.selectionStart - (newContent.length - oldContent.length),
        e.target.selectionStart
      );
      const op: InsertOp = {
        type: 'insert',
        position: e.target.selectionStart - inserted.length,
        content: inserted,
        userId,
        timestamp: Date.now(),
      };
      editor.applyLocalOperation(op);
      clientRef.current?.sendOperation(op);
    } else {
      // Deletion
      const deleted = oldContent.substring(
        e.target.selectionStart,
        e.target.selectionStart + (oldContent.length - newContent.length)
      );
      const op: DeleteOp = {
        type: 'delete',
        position: e.target.selectionStart,
        length: deleted.length,
        userId,
        timestamp: Date.now(),
      };
      editor.applyLocalOperation(op);
      clientRef.current?.sendOperation(op);
    }
  };

  // Send cursor position
  const handleCursorMove = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const position = e.currentTarget.selectionStart;
    editor.setCursorPosition(position);
    clientRef.current?.sendCursorPosition(position);
  };

  return (
    <div className="flex h-screen gap-4 p-4 bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Collaborative Editor</h1>
          <div className="flex items-center gap-2">
            <div
              className={\`w-3 h-3 rounded-full \${
                connected ? 'bg-green-500' : 'bg-red-500'
              }\`}
            />
            <span className="text-sm text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={editor.content}
          onChange={handleTextChange}
          onSelect={handleCursorMove}
          className="flex-1 p-4 border border-gray-300 rounded font-mono resize-none focus:outline-none focus:border-blue-500"
          placeholder="Start typing..."
        />

        <div className="mt-4 text-sm text-gray-600">
          Version: {editor.version} | Position: {editor.cursorPosition}
        </div>
      </div>

      {/* Presence sidebar */}
      <div className="w-48 bg-white rounded shadow p-4">
        <h2 className="font-bold text-gray-800 mb-4">Active Users</h2>
        <div className="space-y-2">
          {remoteCursors.map((cursor) => (
            <div key={cursor.userId} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cursor.color }}
              />
              <span className="text-sm text-gray-700">{cursor.userName}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {cursor.position}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateColor(id: string): string {
  const hash = id.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const hue = Math.abs(hash % 360);
  return \`hsl(\${hue}, 70%, 60%)\`;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Offline Support with Sync Queue',
      id: 'offline-support',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `class OfflineSyncManager {
  private queue: Operation[] = [];
  private version: number = 0;

  enqueueOperation(op: Operation): void {
    this.queue.push(op);
    this.persistQueue();
  }

  private persistQueue(): void {
    localStorage.setItem('pending-ops', JSON.stringify(this.queue));
  }

  private loadQueue(): void {
    const saved = localStorage.getItem('pending-ops');
    this.queue = saved ? JSON.parse(saved) : [];
  }

  async flushQueue(client: CollaborativeEditorClient): Promise<void> {
    this.loadQueue();

    while (this.queue.length > 0) {
      const op = this.queue.shift()!;
      try {
        client.sendOperation(op);
        this.persistQueue();
        // Wait for acknowledgement
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        this.queue.unshift(op);
        throw error;
      }
    }

    localStorage.removeItem('pending-ops');
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Architecture Tips',
      id: 'architecture-tips',
    },
    {
      type: 'list',
      items: [
        'Server should verify operations and maintain canonical history',
        'Use version numbers to ensure consistency across clients',
        'Implement backoff retry logic for failed operations',
        'Debounce cursor position updates to reduce network traffic',
        'Use differential sync for initial state (only send deltas)',
        'Implement operation compression for long documents',
        'Add read replicas for better performance with many readers',
      ],
    },
  ],
};
