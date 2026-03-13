import type { ProjectContent } from '@/types/content';

export const crudAppProject: ProjectContent = {
  id: 'project-crud-app',
  title: 'CRUD Todo App',
  description: 'Build a complete todo app with Create, Read, Update, Delete operations.',
  slug: 'projects/crud-app',
  pillar: 'projects',
  category: 'applications',
  tags: ['CRUD', 'todos', 'React', 'API'],
  difficulty: 'beginner',
  contentType: 'project',
  summary: 'Master the fundamentals of web apps by building a todo app. You\'ll learn CRUD operations, state management, API integration, and how to sync with a backend.',
  relatedTopics: ['integration-rest-apis', 'fetch'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 25,
  featured: true,
  keywords: ['todo app', 'CRUD', 'React hooks'],
  techStack: ['React', 'TypeScript', 'Tailwind CSS', 'REST API'],
  learningGoals: ['Understand CRUD operations', 'Manage component state', 'Integrate with APIs', 'Handle loading and error states'],
  features: ['Add todos', 'Mark complete', 'Edit todos', 'Delete todos', 'Persistent storage'],
  sections: [
    { type: 'heading', level: 2, text: 'What is CRUD?', id: 'what-is-crud' },
    { type: 'paragraph', text: 'CRUD is the foundation of every app: Create (add new data), Read (fetch and display), Update (modify), Delete (remove). Your todo app does all four. Understand CRUD, and you understand 80% of web development.' },
    { type: 'table', headers: ['Operation', 'HTTP Method', 'Endpoint', 'Purpose'], rows: [
      ['Create', 'POST', '/todos', 'Add a new todo'],
      ['Read', 'GET', '/todos', 'Fetch all todos'],
      ['Update', 'PUT/PATCH', '/todos/:id', 'Update a todo'],
      ['Delete', 'DELETE', '/todos/:id', 'Delete a todo'],
    ]},

    { type: 'heading', level: 2, text: 'Type Definitions', id: 'types' },
    { type: 'code', language: 'typescript', code: `interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

type TodoAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Todo[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string };` },

    { type: 'heading', level: 2, text: 'State Management', id: 'state' },
    { type: 'paragraph', text: 'We\'ll use useReducer to manage our todo state. It keeps all state changes in one place, making it easier to debug and test.' },
    { type: 'code', language: 'typescript', code: `function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, todos: action.payload, loading: false };

    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.payload.id ? action.payload : t),
      };

    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };

    default:
      return state;
  }
}` },

    { type: 'heading', level: 2, text: 'Fetch Todos (Read)', id: 'read' },
    { type: 'code', language: 'typescript', code: `const api = {
  getTodos: () => fetch('/api/todos').then(r => r.json()),
  createTodo: (title: string) =>
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: false }),
    }).then(r => r.json()),
  updateTodo: (id: string, updates: Partial<Todo>) =>
    fetch(\`/api/todos/\${id}\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).then(r => r.json()),
  deleteTodo: (id: string) =>
    fetch(\`/api/todos/\${id}\`, { method: 'DELETE' }),
};

function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    loading: false,
    error: null,
  });

  // Fetch todos on mount
  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    api.getTodos()
      .then(todos => dispatch({ type: 'FETCH_SUCCESS', payload: todos }))
      .catch(err => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
  }, []);

  return state;
}` },

    { type: 'heading', level: 2, text: 'Add Todo (Create)', id: 'create' },
    { type: 'code', language: 'tsx', code: `function AddTodoForm({ onAdd }: { onAdd: (todo: Todo) => void }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const newTodo = await api.createTodo(title);
      onAdd(newTodo);
      setTitle(''); // Clear input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        disabled={loading}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}` },

    { type: 'heading', level: 2, text: 'Todo Item Component', id: 'item' },
    { type: 'code', language: 'tsx', code: `function TodoItem({ todo, onToggle, onDelete, onUpdate }: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  async function handleSave() {
    if (!title.trim()) return;
    try {
      await api.updateTodo(todo.id, { title });
      onUpdate(todo.id, { ...todo, title });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteTodo(todo.id);
      onDelete(todo.id);
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:shadow-md transition">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded"
      />
      
      {isEditing ? (
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={\`flex-1 cursor-pointer \${todo.completed ? 'line-through text-gray-400' : ''}\`}
        >
          {todo.title}
        </span>
      )}

      {todo.dueDate && (
        <span className="text-xs text-gray-500">
          {new Date(todo.dueDate).toLocaleDateString()}
        </span>
      )}

      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Main App Component', id: 'app' },
    { type: 'code', language: 'tsx', code: `function TodoApp() {
  const { todos, loading, error } = useTodos();
  const [state, dispatch] = useReducer(todoReducer, { todos: [], loading: false, error: null });

  const handleAdd = (todo: Todo) => {
    dispatch({ type: 'ADD_TODO', payload: todo });
  };

  const handleToggle = async (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
    const todo = state.todos.find(t => t.id === id);
    if (todo) {
      try {
        await api.updateTodo(id, { completed: !todo.completed });
      } catch (err) {
        // Rollback on error
        dispatch({ type: 'TOGGLE_TODO', payload: id });
      }
    }
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const handleUpdate = (id: string, updates: Partial<Todo>) => {
    dispatch({ type: 'UPDATE_TODO', payload: { ...state.todos.find(t => t.id === id)!, ...updates } });
  };

  const completedCount = state.todos.filter(t => t.completed).length;
  const totalCount = state.todos.length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">My Todos</h1>
      <p className="text-gray-600 mb-4">
        {completedCount} of {totalCount} completed
      </p>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <AddTodoForm onAdd={handleAdd} />

      <div className="space-y-2">
        {state.todos.length === 0 ? (
          <p className="text-gray-400">No todos yet. Add one to get started!</p>
        ) : (
          state.todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Always show loading and error states to the user',
      'Disable buttons while requests are in flight',
      'Use optimistic updates for better UX, then rollback on error',
      'Clear form inputs after successful submission',
      'Handle network errors gracefully — don\'t crash the app',
      'Validate input on both client and server',
      'Use unique IDs (UUID) for items so you can reliably identify them',
    ] },
    { type: 'callout', variant: 'tip', title: 'Optimistic Updates', text: 'Update the UI immediately when the user takes an action, then sync with the server. If the server call fails, roll back the UI change. This feels snappier to users even on slow networks.' },
  ],
};
