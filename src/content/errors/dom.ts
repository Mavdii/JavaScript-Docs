import type { ErrorGuideContent } from '@/types/content';

export const domErrorsGuide: ErrorGuideContent = {
  id: 'error-dom',
  title: 'DOM & React Errors',
  description: 'Common mistakes when working with the DOM and React.',
  slug: 'errors/dom',
  pillar: 'errors',
  category: 'error-types',
  tags: ['DOM', 'React', 'refs', 'state'],
  difficulty: 'intermediate',
  contentType: 'error-guide',
  summary: 'Debug common DOM manipulation and React errors — null elements, stale references, missing keys, and lifecycle issues with practical solutions.',
  relatedTopics: ['error-debugging', 'error-common'],
  order: 3,
  updatedAt: '2025-06-01',
  readingTime: 16,
  featured: false,
  keywords: ['DOM errors', 'React errors', 'null element', 'missing key'],
  errorType: 'DOM & React Errors',
  solutions: [
    'Check if DOM element exists before accessing it',
    'Add keys to lists to help React track elements',
    'Don\'t mutate state directly — use setState',
    'Keep refs for imperative operations only',
    'Clean up effects and listeners on unmount',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Cannot Read Property of Null (DOM)', id: 'dom-null' },
    { type: 'paragraph', text: 'The DOM element doesn\'t exist when you try to access it. Common when loading scripts before HTML is parsed or selecting non-existent elements.' },
    { type: 'code', language: 'javascript', code: `// ❌ Script runs before HTML loads
<script>
  const button = document.querySelector('.submit-btn');
  button.addEventListener('click', handleClick); // Error: button is null
</script>
<body>
  <button class="submit-btn">Submit</button>
</body>

// â Selecting element that doesn’t exist
const element = document.querySelector('.nonexistent');
element.textContent = 'Hello'; // TypeError: Cannot read property 'textContent' of null

// ✅ Solution 1: Load script at end of body
<body>
  <button class="submit-btn">Submit</button>
  <script>
    const button = document.querySelector('.submit-btn'); // ✅ Element exists
    button.addEventListener('click', handleClick);
  </script>
</body>

// ✅ Solution 2: Check if element exists
const button = document.querySelector('.submit-btn');
if (button) {
  button.addEventListener('click', handleClick);
}

// ✅ Solution 3: Use DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.submit-btn');
  if (button) {
    button.addEventListener('click', handleClick);
  }
});

// ✅ Solution 4: Use defer on script tag
<script src="script.js" defer></script>
// Script runs after HTML is parsed

// ✅ Solution 5: Add optional chaining
const button = document.querySelector('.submit-btn');
button?.addEventListener('click', handleClick);` },

    { type: 'heading', level: 2, text: 'Missing Keys in Lists', id: 'missing-keys' },
    { type: 'paragraph', text: 'React uses keys to identify which items have changed. Without keys, React can\'t properly update lists, leading to bugs and performance issues.' },
    { type: 'code', language: 'jsx', code: `// ❌ Using array index as key (BAD)
{items.map((item, index) => (
  <div key={index}>{item.name}</div> // Don’t do this!
))}

// Why it’s bad:
// - If list order changes, keys don’t match items
// - Reordering causes state to get mixed up
// - Performance suffers with large lists

// Example of the bug:
// Initial: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
// Keys: [0, 1]
// 
// After reordering: [{ id: 2, name: 'Bob' }, { id: 1, name: 'Alice' }]
// Keys still: [0, 1] but now 0 points to Bob, 1 points to Alice ❌

// ❌ Using non-unique values as key
{items.map(item => (
  <div key={item.name}>{item.name}</div> // If name repeats, keys collide!
))}

// ✅ Use unique, stable ID from data
{items.map(item => (
  <div key={item.id}>{item.name}</div> // ✅ Correct
))}

// ✅ If no ID, use crypto.randomUUID() at creation
const items = data.map(item => ({
  ...item,
  _id: crypto.randomUUID(), // Unique, stable
}));

// ✅ For simple lists without data, array index is OK
{['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
  <li key={index}>{item}</li> // ✅ Fixed list, index is fine
))}` },

    { type: 'heading', level: 2, text: 'Mutating State Directly', id: 'mutating-state' },
    { type: 'paragraph', text: 'React tracks state changes by comparing references. If you mutate state directly, React doesn\'t know to re-render.' },
    { type: 'code', language: 'jsx', code: `// ❌ Mutating array directly
function TodoList() {
  const [todos, setTodos] = useState([{ id: 1, text: 'Learn React' }]);

  function addTodo(text) {
    todos.push({ id: 2, text }); // ❌ Mutating directly
    setTodos(todos); // React doesn’t know it changed!
  }

  return (
    <div>
      {todos.map(todo => <div key={todo.id}>{todo.text}</div>)}
      <button onClick={() => addTodo('New todo')}>Add</button>
    </div>
  );
}

// ❌ Mutating object directly
function Profile() {
  const [user, setUser] = useState({ name: 'Alice', age: 30 });

  function updateName(name) {
    user.name = name; // ❌ Mutating directly
    setUser(user); // React doesn’t re-render
  }

  return <input onChange={e => updateName(e.target.value)} />;
}

// ✅ Create new array with spread operator
function addTodo(text) {
  const newTodo = { id: todos.length + 1, text };
  setTodos([...todos, newTodo]); // ✅ New array
}

// ✅ Create new object with spread operator
function updateName(name) {
  setUser({ ...user, name }); // ✅ New object
}

// ✅ For nested updates, use immer or copy at each level
function updateCity(city) {
  setUser({
    ...user,
    address: {
      ...user.address,
      city, // ✅ New address object
    },
  });
}

// ✅ Array operations that create new arrays
setTodos(todos.filter(t => t.id !== toDelete)); // Remove
setTodos(todos.map(t => t.id === id ? {...t, completed: !t.completed} : t)); // Update
setTodos([newTodo, ...todos]); // Add at start
setTodos(todos.concat(newTodo)); // Add at end` },

    { type: 'heading', level: 2, text: 'Incorrect useEffect Dependencies', id: 'useeffect-deps' },
    { type: 'paragraph', text: 'Missing or incorrect dependencies in useEffect cause infinite loops or stale data.' },
    { type: 'code', language: 'jsx', code: `// ❌ Missing dependencies — infinite loop
function FetchUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setUser);
    // No dependency array! Effect runs after every render → infinite fetch loop
  });

  return <div>{user?.name}</div>;
}

// ❌ Incomplete dependencies
function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(\`/api/search?q=\${query}\`)
      .then(r => r.json())
      .then(setResults);
  }, []); // ❌ Missing 'query' dependency!
  // Effect only runs once, but query changes are ignored

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {results.map(r => <div key={r.id}>{r.name}</div>)}
    </>
  );
}

// ✅ Add empty dependency array for "run once"
useEffect(() => {
  // Runs once on mount
}, []);

// ✅ Add dependencies
useEffect(() => {
  // Runs when 'query' changes
  fetch(\`/api/search?q=\${query}\`)
    .then(r => r.json())
    .then(setResults);
}, [query]); // ✅ Include query

// ✅ Cleanup function
useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
    .then(r => r.json())
    .then(setResults);

  return () => controller.abort(); // Cleanup on unmount or re-run
}, [query]);` },

    { type: 'heading', level: 2, text: 'Ref Misuse', id: 'ref-misuse' },
    { type: 'paragraph', text: 'Refs should be for imperative operations only. Using refs for data that should be in state causes bugs.' },
    { type: 'code', language: 'jsx', code: `// ❌ Using ref for count (should be state)
function Counter() {
  const countRef = useRef(0);

  function increment() {
    countRef.current++;
    console.log(countRef.current); // Logs correctly
    // But component doesn’t re-render!
  }

  return (
    <>
      <p>Count: {countRef.current}</p> {/* Always shows 0 */}
      <button onClick={increment}>Increment</button>
    </>
  );
}

// ✅ Use state for data that affects rendering
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p> {/* Updates on screen */}
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}

// ✅ Use ref for DOM access or keeping mutable values
function Stopwatch() {
  const [time, setTime] = useState(0);
  const timerIdRef = useRef(null); // Store timer ID

  function start() {
    timerIdRef.current = setInterval(
      () => setTime(t => t + 1),
      1000
    );
  }

  function stop() {
    clearInterval(timerIdRef.current);
  }

  return (
    <>
      <p>{time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}

// ✅ Use ref to access DOM elements
function TextInput() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}` },

    { type: 'heading', level: 2, text: 'Event Listener Leaks', id: 'event-leaks' },
    { type: 'code', language: 'jsx', code: `// ❌ Missing cleanup — listener accumulates
function Component() {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Every mount adds a new listener, old ones aren’t removed
  }, []);

  return <div>Content</div>;
}

// ✅ Add cleanup function
function Component() {
  useEffect(() => {
    const handleResize = () => {
      console.log('Resized');
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // ✅ Cleanup
    };
  }, []);

  return <div>Content</div>;
}

// ✅ Or use a library hook
function Component() {
  useWindowResize(() => {
    console.log('Resized');
  });

  return <div>Content</div>;
}` },

    { type: 'heading', level: 2, text: 'React Key Warnings', id: 'react-key-warnings' },
    { type: 'paragraph', text: 'React warns when you don\'t have keys or have duplicate keys. Fix them — they indicate real bugs.' },
    { type: 'code', language: 'jsx', code: `// Warning: Each child in a list should have a unique "key" prop.

// ❌ No keys
{items.map(item => (
  <div>{item.name}</div> // React warning
))}

// ❌ Duplicate keys
{items.map((item, index) => (
  <div key={index % 2}>{item.name}</div> // Only 2 keys for many items!
))}

// ✅ Add unique keys
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ✅ If no ID exists, create one
{items.map((item, index) => (
  <div key={\`\${item.name}-\${index}\`}>{item.name}</div>
))}` },

    { type: 'callout', variant: 'warning', title: 'Rule: Always Use Keys for Lists', text: 'If you\'re rendering a list from an array, you must add a key prop. Use a unique, stable ID from your data. Never use array index as a key unless the list is fixed and doesn\'t sort.' },
  ],
};
