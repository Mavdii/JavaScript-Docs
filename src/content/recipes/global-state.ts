import type { RecipeContent } from '@/types/content';

export const globalStateRecipe: RecipeContent = {
  id: 'recipe-global-state',
  title: 'Global State Management',
  description: 'Manage global application state without a framework using observables and event emitters.',
  slug: 'recipes/global-state',
  pillar: 'recipes',
  category: 'performance',
  tags: ['state', 'global', 'observer', 'event', 'reactive'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Implement lightweight global state management using the Observer pattern, perfect for vanilla JavaScript applications.',
  relatedTopics: ['event-emitter', 'closures', 'functional-patterns'],
  order: 4,
  updatedAt: '2025-06-01',
  readingTime: 10,
  featured: false,
  keywords: ['state management', 'observable', 'global state', 'observer pattern'],
  problem: 'Managing state across components leads to prop drilling and spaghetti code. Need simple state management without heavy dependencies.',
  pitfalls: [
    'Direct mutations causing undetectable changes',
    'Subscribers not being cleaned up (memory leaks)',
    'Missing initial state for subscribers',
    'No way to debug state changes',
    'Race conditions with async updates'
  ],
  variations: ['Event emitter', 'Observable', 'Reducer pattern', 'Proxy-based'],
  sections: [
    { type: 'heading', level: 2, text: 'Simple Event Emitter Store', id: 'event-emitter' },
    { type: 'code', language: 'javascript', filename: 'state-event-emitter.js', code: `class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
    this.history = [initialState];
  }

  // Get current state
  getState() {
    return { ...this.state };
  }

  // Update state (shallow merge)
  setState(updates) {
    const oldState = this.state;
    this.state = { ...this.state, ...updates };

    // Track history
    this.history.push(this.state);

    // Notify all listeners
    this.listeners.forEach(listener => {
      listener(this.state, oldState);
    });
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Subscribe to specific field changes
  subscribe(listener, selector = (state) => state) {
    let prevValue = selector(this.state);

    const unsubscribe = this.subscribe((newState) => {
      const newValue = selector(newState);
      if (prevValue !== newValue) {
        prevValue = newValue;
        listener(newValue);
      }
    });

    return unsubscribe;
  }

  // Undo last change
  undo() {
    if (this.history.length > 1) {
      this.history.pop();
      const previousState = this.history[this.history.length - 1];
      this.state = previousState;
      this.listeners.forEach(listener => listener(this.state));
    }
  }
}

// Usage
const store = new Store({
  user: null,
  todos: [],
  theme: 'light'
});

// Subscribe to all changes
const unsubscribe = store.subscribe((newState, oldState) => {
  console.log('State changed:', newState);
});

// Subscribe to specific field
store.subscribe(
  (todos) => console.log('Todos updated:', todos),
  (state) => state.todos
);

// Update state
store.setState({ user: { id: 1, name: 'John' } });

// Cleanup
unsubscribe();` },

    { type: 'heading', level: 2, text: 'Reducer-Based State Management', id: 'reducer-pattern' },
    { type: 'code', language: 'javascript', filename: 'state-reducer.js', code: `class ReducerStore {
  constructor(initialState, reducer) {
    this.state = initialState;
    this.reducer = reducer;
    this.listeners = new Set();
    this.middleware = [];
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    // Apply middleware
    const finalAction = this.middleware.reduce(
      (act, middlewareFn) => middlewareFn(act),
      action
    );

    const oldState = this.state;
    this.state = this.reducer(this.state, finalAction);

    this.listeners.forEach(listener => {
      listener(this.state, oldState);
    });

    return action;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }
}

// Define reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload)
      };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

const store = new ReducerStore(
  { user: null, todos: [], theme: 'light' },
  appReducer
);

// Logging middleware
store.use(action => {
  console.log('Action:', action);
  return action;
});

// Usage
store.subscribe((newState) => {
  console.log('State updated:', newState);
});

store.dispatch({ type: 'SET_USER', payload: { id: 1, name: 'John' } });
store.dispatch({ type: 'ADD_TODO', payload: { id: 1, text: 'Learn JS' } });
store.dispatch({ type: 'SET_THEME', payload: 'dark' });` },

    { type: 'heading', level: 2, text: 'Observable State with Proxy', id: 'proxy-observable' },
    { type: 'code', language: 'javascript', filename: 'state-proxy.js', code: `class ReactiveStore {
  constructor(initialState = {}) {
    this.listeners = new Map();
    this.state = this.createReactiveProxy(initialState);
  }

  createReactiveProxy(target, path = '') {
    return new Proxy(target, {
      set: (obj, property, value) => {
        const fullPath = path ? \`\${path}.\${property}\` : property;

        // Prevent unnecessary updates
        if (obj[property] === value) {
          return true;
        }

        const oldValue = obj[property];
        obj[property] = value;

        // Notify listeners
        this.notify(fullPath, value, oldValue);

        return true;
      },

      get: (obj, property) => {
        if (typeof obj[property] === 'object' && obj[property] !== null) {
          const fullPath = path ? \`\${path}.\${property}\` : property;
          return this.createReactiveProxy(obj[property], fullPath);
        }
        return obj[property];
      }
    });
  }

  on(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path).add(callback);

    // Return unsubscribe
    return () => this.listeners.get(path).delete(callback);
  }

  notify(path, newValue, oldValue) {
    // Notify exact path listeners
    if (this.listeners.has(path)) {
      this.listeners.get(path).forEach(callback => {
        callback(newValue, oldValue);
      });
    }

    // Notify parent path listeners
    const parentPath = path.substring(0, path.lastIndexOf('.'));
    if (parentPath && this.listeners.has(parentPath)) {
      this.listeners.get(parentPath).forEach(callback => {
        callback(this.getValueAtPath(parentPath));
      });
    }
  }

  getValueAtPath(path) {
    return path.split('.').reduce((obj, prop) => obj[prop], this.state);
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }
}

// Usage
const store = new ReactiveStore({
  user: { name: 'John', age: 30 },
  todos: []
});

// Watch specific properties
store.on('user.name', (newName, oldName) => {
  console.log(\`Name changed from \${oldName} to \${newName}\`);
});

store.on('todos', (todos) => {
  console.log('Todos updated:', todos);
});

// Update state directly
store.state.user.name = 'Jane'; // Triggers listener
store.state.todos.push({ id: 1, text: 'Task' }); // Triggers listener` },

    { type: 'heading', level: 2, text: 'Async Actions and Middleware', id: 'async-actions' },
    { type: 'code', language: 'javascript', filename: 'state-async.js', code: `class AsyncStore {
  constructor(initialState, reducer) {
    this.state = initialState;
    this.reducer = reducer;
    this.listeners = new Set();
    this.middleware = [];
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    return Promise.resolve(action)
      .then(act => {
        // Apply middleware
        return this.middleware.reduce(
          (chain, mw) => chain.then(a => mw(a, this.getState)),
          Promise.resolve(act)
        );
      })
      .then(finalAction => {
        if (typeof finalAction === 'function') {
          // Thunk: async action
          return finalAction((act) => this.dispatch(act));
        }
        return finalAction;
      })
      .then(finalAction => {
        this.state = this.reducer(this.state, finalAction);
        this.listeners.forEach(l => l(this.state));
        return this.state;
      });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }
}

// Reducer
function appReducer(state, action) {
  if (action.type === 'SET_USER') {
    return { ...state, user: action.payload, loading: false };
  }
  if (action.type === 'SET_LOADING') {
    return { ...state, loading: action.payload };
  }
  return state;
}

const store = new AsyncStore({ user: null, loading: false }, appReducer);

// Logging middleware
store.use((action) => {
  console.log('Dispatching:', action);
  return action;
});

// Async thunk action
const fetchUser = (userId) => async (dispatch) => {
  dispatch({ type: 'SET_LOADING', payload: true });

  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const user = await response.json();
    dispatch({ type: 'SET_USER', payload: user });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

// Usage
store.subscribe((state) => console.log('State:', state));
store.dispatch(fetchUser(1));` },

    { type: 'heading', level: 2, text: 'Devtools and Debugging', id: 'devtools' },
    { type: 'code', language: 'javascript', filename: 'state-devtools.js', code: `class DevStore {
  constructor(initialState, reducer, enableDevtools = true) {
    this.state = initialState;
    this.reducer = reducer;
    this.listeners = new Set();
    this.history = [{ action: 'INIT', state: initialState }];
    this.currentHistoryIndex = 0;

    if (enableDevtools && window.__REDUX_DEVTOOLS_EXTENSION__) {
      this.devtools = window.__REDUX_DEVTOOLS_EXTENSION__.connect();
      this.devtools.init(initialState);
    }
  }

  dispatch(action) {
    const oldState = this.state;
    this.state = this.reducer(this.state, action);

    this.history.push({ action, state: this.state });
    this.currentHistoryIndex = this.history.length - 1;

    if (this.devtools) {
      this.devtools.send(action, this.state);
    }

    this.listeners.forEach(l => l(this.state, oldState, action));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Time travel debugging
  timeTravel(steps) {
    this.currentHistoryIndex += steps;
    this.currentHistoryIndex = Math.max(0, Math.min(
      this.currentHistoryIndex,
      this.history.length - 1
    ));

    this.state = this.history[this.currentHistoryIndex].state;
    this.listeners.forEach(l => l(this.state));
  }

  // Get action history
  getHistory() {
    return this.history.map((h, i) => ({
      ...h,
      isCurrent: i === this.currentHistoryIndex
    }));
  }
}` },

    { type: 'heading', level: 2, text: 'Real-World Example: Todo App', id: 'todo-example' },
    { type: 'code', language: 'javascript', filename: 'state-todo-app.js', code: `// Store setup
const todoStore = new ReducerStore(
  { todos: [], filter: 'all', editingId: null },
  (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return {
          ...state,
          todos: [...state.todos, {
            id: Date.now(),
            text: action.payload,
            completed: false
          }]
        };
      case 'REMOVE_TODO':
        return {
          ...state,
          todos: state.todos.filter(t => t.id !== action.payload)
        };
      case 'TOGGLE_TODO':
        return {
          ...state,
          todos: state.todos.map(t =>
            t.id === action.payload ? { ...t, completed: !t.completed } : t
          )
        };
      case 'SET_FILTER':
        return { ...state, filter: action.payload };
      default:
        return state;
    }
  }
);

// Selectors
function selectVisibleTodos(state) {
  const { todos, filter } = state;
  if (filter === 'completed') return todos.filter(t => t.completed);
  if (filter === 'active') return todos.filter(t => !t.completed);
  return todos;
}

function selectTodoCount(state) {
  return {
    total: state.todos.length,
    completed: state.todos.filter(t => t.completed).length,
    active: state.todos.filter(t => !t.completed).length
  };
}

// UI bindings
function renderTodos() {
  const state = todoStore.getState();
  const visibleTodos = selectVisibleTodos(state);

  document.getElementById('todoList').innerHTML = visibleTodos
    .map(todo => \`
      <li class="\${todo.completed ? 'completed' : ''}">
        <input
          type="checkbox"
          checked="\${todo.completed}"
          onchange="todoStore.dispatch({type:'TOGGLE_TODO', payload:\${todo.id}})"
        />
        \${todo.text}
        <button onclick="todoStore.dispatch({type:'REMOVE_TODO', payload:\${todo.id}})">
          Delete
        </button>
      </li>
    \`)
    .join('');

  const counts = selectTodoCount(state);
  document.getElementById('stats').innerHTML = \`
    Total: \${counts.total} | Active: \${counts.active} | Done: \${counts.completed}
  \`;
}

// Subscribe to changes
todoStore.subscribe(renderTodos);

// Input handler
document.getElementById('input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.value) {
    todoStore.dispatch({ type: 'ADD_TODO', payload: e.target.value });
    e.target.value = '';
  }
});

// Filter buttons
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', (e) => {
    todoStore.dispatch({ type: 'SET_FILTER', payload: e.target.dataset.filter });
  });
});

// Initial render
renderTodos();` },
  ],
};
