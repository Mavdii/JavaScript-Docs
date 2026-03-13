import type { LessonContent } from '@/types/content';

export const closuresLesson: LessonContent = {
  id: 'closures',
  title: 'JavaScript Closures',
  description:
    'Understanding closures — one of the most powerful and commonly misunderstood concepts in JavaScript.',
  slug: 'learn/advanced/closures',
  pillar: 'learn',
  category: 'advanced',
  subcategory: 'core-concepts',
  tags: ['closures', 'scope', 'functions', 'advanced'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary:
    'Closures allow functions to access variables from their outer scope even after the outer function has returned. They are fundamental to patterns like data privacy, currying, and event handlers.',
  relatedTopics: ['array-map', 'debouncing'],
  order: 1,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: true,
  keywords: ['closure', 'lexical scope', 'function scope', 'data privacy', 'currying'],
  prerequisites: ['Functions', 'Scope', 'Variables'],
  learningGoals: [
    'Understand what closures are and how they work',
    'Recognize closure patterns in real code',
    'Use closures for data privacy and encapsulation',
    'Avoid common closure pitfalls like loop variable capture',
    'Apply closures in practical scenarios',
  ],
  exercises: [
    'Create a function `createMultiplier(factor)` that returns a function which multiplies any given number by `factor`.',
    'Build a `once(fn)` function that ensures `fn` is only called once, returning the cached result on subsequent calls.',
    'Implement a simple event emitter using closures for subscriber storage.',
    'Fix a broken loop that uses `var` and `setTimeout` to print numbers 1 through 5.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What is a Closure?', id: 'what-is-a-closure' },
    {
      type: 'paragraph',
      text: 'A closure is a function that remembers its lexical scope even after the outer function returns. It "remembers" variables from where it was defined.',
    },
    {
      type: 'paragraph',
      text: 'Every function creates a closure. They’re powerful when you return an inner function that carries its scope with it.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'closures-basic.js',
      code: `function createGreeter(greeting) {
  // 'greeting' is captured by the inner function
  return function(name) {
    return greeting + ', ' + name + '!';
  };
}

const sayHello = createGreeter('Hello');
const sayHi = createGreeter('Hi');

console.log(sayHello('Alice')); // "Hello, Alice!"
console.log(sayHi('Bob'));      // "Hi, Bob!"`,
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Key Insight',
      text: 'The inner function has access to `greeting` even after `createGreeter` has finished executing. This is the essence of a closure.',
    },

    { type: 'heading', level: 2, text: 'How Closures Work', id: 'how-closures-work' },
    {
      type: 'paragraph',
      text: 'When a function is created, JavaScript attaches a reference to its surrounding lexical environment with all the in-scope variables.',
    },
    {
      type: 'paragraph',
      text: 'When the outer function returns, its context leaves the stack. But the variables stay alive because the inner function still needs them.',
    },
    {
      type: 'list',
      items: [
        'A closure exists every time a function is created',
        'Closures capture by reference, not by value',
        'Captured variables stay alive as long as the closure does',
        'Multiple closures can share outer variables',
      ],
    },

    { type: 'heading', level: 2, text: 'Practical Use: Data Privacy', id: 'data-privacy' },
    {
      type: 'paragraph',
      text: 'Closures are how you create privacy in JavaScript. Variables inside a function scope are private — unreachable from outside.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'counter.js',
      code: `function createCounter() {
  let count = 0; // Private variable

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getCount()); // 1
console.log(counter.count);      // undefined — private!`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Pattern',
      text: 'This is the classic module pattern — how you made private state before classes.',
    },

    { type: 'heading', level: 2, text: 'Closures in Loops', id: 'closures-in-loops' },
    {
      type: 'paragraph',
      text: 'A classic gotcha: closures in loops capture by reference. All closures in a loop share the same variable.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'loop-closure.js',
      code: `// Common mistake — all callbacks share 'i'
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (not 0, 1, 2)

// Fix 1: Use let (creates block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

// Fix 2: Use an IIFE to capture each value
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Output: 0, 1, 2`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Watch Out',
      text: 'Using `var` in a loop with async callbacks is a classic interview question. Always prefer `let` or `const` in modern JavaScript.',
    },

    { type: 'heading', level: 2, text: 'Currying with Closures', id: 'currying' },
    {
      type: 'paragraph',
      text: 'Currying is a functional programming technique where a function with multiple arguments is transformed into a sequence of functions, each taking a single argument. Closures make this possible.',
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'currying.js',
      code: `function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiply(2);
const triple = multiply(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Arrow function version
const add = a => b => a + b;
const add10 = add(10);
console.log(add10(5));   // 15`,
    },

    { type: 'heading', level: 2, text: 'Real-World Examples', id: 'real-world' },
    {
      type: 'paragraph',
      text: 'Closures appear everywhere in real JavaScript code. Here are some practical applications you encounter daily.',
    },
    { type: 'heading', level: 3, text: 'Event Handlers', id: 'event-handlers' },
    {
      type: 'code',
      language: 'javascript',
      filename: 'event-handlers.js',
      code: `function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId);
  // The click handler closes over 'message'
  button.addEventListener('click', () => {
    alert(message);
  });
}

setupButton('btn-save', 'Document saved!');
setupButton('btn-delete', 'Item deleted!');`,
    },
    { type: 'heading', level: 3, text: 'Memoization', id: 'memoization' },
    {
      type: 'code',
      language: 'javascript',
      filename: 'memoize.js',
      code: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

expensiveCalc(4); // "Computing..." → 16
expensiveCalc(4); // 16 (cached, no log)`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Assuming closures capture values instead of references',
        'Using var in loops with async callbacks',
        'Creating unnecessary closures in performance-critical loops',
        'Not understanding that closures keep outer variables alive (potential memory leaks)',
        'Forgetting that all inner functions share the same closure scope',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use closures intentionally for data privacy and encapsulation',
        'Prefer let and const over var to avoid scope issues',
        'Be mindful of memory — closures keep references alive',
        'Use closures for configuration and partial application',
        'Document closure-heavy code for clarity',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Performance Note', text: 'Closures have a small memory overhead because they retain references to their outer scope. In most applications this is negligible, but avoid creating closures in tight loops with millions of iterations.' },

    { type: 'heading', level: 2, text: 'IIFE — Immediately Invoked Function Expressions', id: 'iife' },
    { type: 'paragraph', text: 'An IIFE creates a closure instantly and runs it. It was the gold standard for module isolation before ES6 modules.' },
    {
      type: 'code', language: 'javascript', filename: 'iife.js',
      code: `// Classic IIFE — creates private scope
(function() {
  const secret = 42; // not accessible outside
  console.log('IIFE runs once immediately');
})();

// Capturing global in IIFE
(function($, window, document) {
  // Safe alias inside the IIFE
  console.log($.version);
})(jQuery, window, document);

// Modern alternative: block scope with let/const
{
  const secret = 42; // block-scoped, not global
}

// IIFE returning a value
const result = (function() {
  const a = 10, b = 20;
  return a + b;
})();
console.log(result); // 30`,
    },

    { type: 'heading', level: 2, text: 'Partial Application', id: 'partial-application' },
    { type: 'paragraph', text: 'Partial application is the technique of pre-filling some arguments of a function. Closures make it trivial to implement.' },
    {
      type: 'code', language: 'javascript', filename: 'partial.js',
      code: `// Generic partial application
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function greet(greeting, title, name) {
  return \`\${greeting}, \${title} \${name}!\`;
}

const sayHello = partial(greet, 'Hello');
const sayHelloDoc = partial(greet, 'Hello', 'Dr.');

sayHello('Mr.', 'Smith'); // "Hello, Mr. Smith!"
sayHelloDoc('House');     // "Hello, Dr. House!"

// Practical: partial with fetch
const apiGet = partial(fetch, 'https://api.example.com');
apiGet('/users').then(r => r.json());
apiGet('/posts').then(r => r.json());`,
    },

    { type: 'heading', level: 2, text: 'Factory Functions', id: 'factory-functions' },
    { type: 'paragraph', text: 'Factory functions use closures to produce objects with shared behavior but independent private state. They are a powerful alternative to classes.' },
    {
      type: 'code', language: 'javascript', filename: 'factory.js',
      code: `// Factory function — each call creates an independent instance
function createUser(name, role = 'user') {
  // Private state
  let loginCount = 0;
  const createdAt = new Date();

  // Public interface
  return {
    getName: () => name,
    getRole: () => role,
    getLoginCount: () => loginCount,
    login() {
      loginCount++;
      console.log(\`\${name} logged in (\${loginCount} times)\`);
    },
    promote(newRole) {
      role = newRole;
      console.log(\`\${name} is now \${role}\`);
    },
    toString() {
      return \`User(\${name}, \${role}), since \${createdAt.toLocaleDateString()}\`;
    }
  };
}

const alice = createUser('Alice', 'admin');
const bob = createUser('Bob');

alice.login();         // "Alice logged in (1 times)"
alice.login();         // "Alice logged in (2 times)"
bob.login();           // "Bob logged in (1 times)"

// Each user has completely independent loginCount
console.log(alice.getLoginCount()); // 2
console.log(bob.getLoginCount());   // 1`,
    },

    { type: 'heading', level: 2, text: 'The Module Pattern', id: 'module-pattern' },
    { type: 'paragraph', text: 'The reveal module pattern uses closures to expose only _selected_ properties as public. Everything else stays private inside the closure scope.' },
    {
      type: 'code', language: 'javascript', filename: 'module.js',
      code: `const CartModule = (function() {
  // Private state — not directly accessible
  let items = [];
  let discount = 0;

  // Private helper
  function calculateTotal() {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return subtotal * (1 - discount);
  }

  // Public API — revealed
  return {
    addItem(product, qty = 1) {
      const existing = items.find(i => i.id === product.id);
      if (existing) existing.qty += qty;
      else items.push({ ...product, qty });
    },
    removeItem(productId) {
      items = items.filter(i => i.id !== productId);
    },
    applyDiscount(pct) {
      discount = pct / 100;
    },
    getTotal() {
      return calculateTotal(); // private method — not directly exposed
    },
    getItems() {
      return [...items]; // return copy, not reference
    }
  };
})();

CartModule.addItem({ id: 1, name: 'Keyboard', price: 99 });
CartModule.applyDiscount(10); // 10% off
console.log(CartModule.getTotal()); // 89.1
// CartModule.items — undefined (private!)
// CartModule.calculateTotal — undefined (private!)`,
    },

    { type: 'heading', level: 2, text: 'Closures & Memory — WeakRef', id: 'memory' },
    { type: 'paragraph', text: 'Because closures hold references to outer variables, they can cause memory leaks if not managed carefully. `WeakRef` (ES2021) allows tracking objects without preventing garbage collection.' },
    {
      type: 'code', language: 'javascript', filename: 'memory.js',
      code: `// Memory leak example — the closure keeps a big object alive
function process(data) {
  const largeArray = new Array(1_000_000).fill('data');

  return function process() {
    // The inner function closes over largeArray
    // largeArray is kept alive as long as process() reference exists
    return largeArray.length;
  };
}

// Fix: nullify after use
let fn = process(someData);
fn();    // use it
fn = null; // allow largeArray to be garbage collected

// Modern approach: WeakRef
let cache = new WeakRef({ largeData: new Array(100_000) });

function processLazy() {
  const obj = cache.deref(); // returns undefined if GC’d
  if (!obj) {
    console.log('Object was garbage collected');
    return null;
  }
  return obj.largeData.length;
}`,
    },
    { type: 'callout', variant: 'warning', title: 'Memory Leaks via Closures', text: 'Long-lived closures (event handlers, timers, global caches) can keep large objects alive indefinitely. Always remove event listeners and cancel timers when no longer needed.' },

    { type: 'heading', level: 2, text: 'Closures in React Hooks', id: 'react-hooks' },
    { type: 'paragraph', text: 'React hooks rely entirely on closures. The `useCallback` and `useMemo` hooks are literally factory functions that preserve values across renders using closure scopes.' },
    {
      type: 'code', language: 'javascript', filename: 'hooks.js',
      code: `// useState is backed by closures
function useState(initialValue) {
  let state = initialValue;

  function getState() {
    return state;
  }

  function setState(newValue) {
    state = typeof newValue === 'function' ? newValue(state) : newValue;
    render(); // trigger re-render
  }

  return [getState, setState];
}

// The "stale closure" bug in React
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ Stale closure — count is 0 forever
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // always reads initial count = 0
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps — closes over initial count = 0

  // ✅ Fix: functional update avoids stale closure
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1); // always uses latest value
    }, 1000);
    return () => clearInterval(id);
  }, []);
}`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    { type: 'paragraph', text: 'Closures are among the most tested JavaScript concepts. Be ready to answer these:' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What is a closure and how does it work internally?',
        'What is the difference between capturing by value and by reference?',
        'How do you fix the classic `for` loop + `setTimeout` problem?',
        'What is the module pattern and why was it used?',
        'How does memoization use closures?',
        'What are "stale closures" in React and how do you avoid them?',
        'Can closures cause memory leaks? Give an example and how to fix it.',
        'What is currying and how is it different from partial application?',
      ],
    },
  ],
};

