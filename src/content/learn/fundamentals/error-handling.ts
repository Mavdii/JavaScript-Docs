import type { LessonContent } from '@/types/content';

export const errorHandlingLesson: LessonContent = {
  id: 'error-handling',
  title: 'Error Handling',
  description: 'Handle errors gracefully with try/catch, custom errors, and error boundaries.',
  slug: 'learn/fundamentals/error-handling',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['errors', 'try-catch', 'debugging', 'exceptions'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Error handling prevents your application from crashing. Use try/catch for synchronous errors, .catch() for promises, and custom error classes for domain-specific failures.',
  relatedTopics: ['promises', 'async-await'],
  order: 11,
  updatedAt: '2024-03-01',
  readingTime: 25,
  featured: false,
  keywords: ['try', 'catch', 'finally', 'throw', 'Error', 'TypeError', 'custom error', 'error boundary', 'global error handler'],
  prerequisites: ['Functions'],
  learningGoals: [
    'Use try/catch/finally for error handling',
    'Throw and create custom errors',
    'Handle errors in async code',
    'Know common error types',
    'Implement global error handlers',
    'Build retry logic with error handling',
    'Use error boundaries in React',
  ],
  exercises: [
    'Create a custom ValidationError class with a field name property.',
    'Write an async function with proper error handling for a fetch call.',
    'Build a retry wrapper that attempts a function N times with exponential backoff.',
    'Implement a global error handler that logs errors to a remote service.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'try / catch / finally', id: 'try-catch' },
    { type: 'paragraph', text: '`try/catch` is the primary mechanism for handling runtime errors. The `finally` block always executes, whether an error occurred or not — useful for cleanup.' },
    {
      type: 'code', language: 'javascript', filename: 'try-catch.js',
      code: `try {
  const data = JSON.parse(invalidJson);
  processData(data);
} catch (error) {
  console.error('Parse failed:', error.message);
} finally {
  // Always runs — cleanup here
  closeConnection();
  console.log('Done');
}

// catch without binding (ES2019)
try {
  doSomething();
} catch {
  // Don’t need the error object
  fallback();
}

// Nested try/catch
try {
  try {
    riskyOperation();
  } catch (innerError) {
    // Handle or re-throw
    if (innerError instanceof NetworkError) {
      retry();
    } else {
      throw innerError; // Re-throw to outer catch
    }
  }
} catch (outerError) {
  console.error('Unrecoverable:', outerError);
}

// Only catch what you can handle
try {
  const data = loadData();
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    return defaultData;
  }
  throw error; // Re-throw unexpected errors
}`,
    },

    { type: 'heading', level: 2, text: 'The Error Object', id: 'error-object' },
    { type: 'paragraph', text: 'Error objects have a `message`, `name`, and `stack` trace. The stack trace shows where the error originated, which is invaluable for debugging.' },
    {
      type: 'code', language: 'javascript', filename: 'error-object.js',
      code: `const error = new Error('Something went wrong');

error.message  // "Something went wrong"
error.name     // "Error"
error.stack    // Stack trace string

// Stack trace example:
// Error: Something went wrong
//     at processData (app.js:42)
//     at handleSubmit (form.js:15)
//     at HTMLButtonElement.<anonymous> (index.js:8)

// Error with cause (ES2022 — error chaining)
try {
  const data = JSON.parse(rawData);
} catch (parseError) {
  throw new Error('Failed to load config', { cause: parseError });
}

// Access the original error
try {
  loadConfig();
} catch (error) {
  console.error('Config error:', error.message);
  console.error('Caused by:', error.cause?.message);
}

// Check error type
try {
  riskyOperation();
} catch (error) {
  if (error instanceof TypeError) {
    console.error('Type error:', error.message);
  } else if (error instanceof RangeError) {
    console.error('Range error:', error.message);
  } else {
    throw error; // Unknown error — re-throw
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Throwing Errors', id: 'throwing' },
    { type: 'paragraph', text: 'Use `throw` to create errors when your code encounters invalid states. Always throw Error objects (not strings) to preserve stack traces.' },
    {
      type: 'code', language: 'javascript', filename: 'throwing.js',
      code: `function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (e) {
  console.error(e.message); // "Division by zero"
}

// Guard clauses with throws
function getUser(id) {
  if (!id) throw new Error('User ID is required');
  if (typeof id !== 'string') throw new TypeError('User ID must be a string');
  return database.findUser(id);
}

// Don’t throw strings (loses stack trace)
// BAD:
throw 'Something went wrong';        // No stack trace!
throw 42;                             // No message!

// GOOD:
throw new Error('Something went wrong'); // Has stack trace
throw new TypeError('Expected string');  // Specific type

// Conditional throw patterns
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(items.length > 0, 'Items array cannot be empty');
assert(typeof name === 'string', 'Name must be a string');`,
    },

    { type: 'heading', level: 2, text: 'Built-in Error Types', id: 'error-types' },
    {
      type: 'table',
      headers: ['Type', 'When It Occurs', 'Example'],
      rows: [
        ['Error', 'Generic error', 'throw new Error("oops")'],
        ['TypeError', 'Wrong type operation', 'null.property, (42)()'],
        ['ReferenceError', 'Undeclared variable access', 'console.log(undeclared)'],
        ['SyntaxError', 'Invalid syntax', 'JSON.parse("{bad}")'],
        ['RangeError', 'Value out of range', 'new Array(-1)'],
        ['URIError', 'Malformed URI', 'decodeURI("%")'],
        ['EvalError', 'eval() error (rare)', 'Legacy — rarely seen'],
        ['AggregateError', 'Multiple errors', 'Promise.any() all rejected'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'error-types.js',
      code: `// TypeError — most common in everyday code
const obj = null;
obj.property;        // TypeError: Cannot read properties of null
const notFn = 42;
notFn();             // TypeError: notFn is not a function

// ReferenceError
console.log(x);      // ReferenceError: x is not defined

// SyntaxError (usually at parse time)
JSON.parse('invalid'); // SyntaxError: Unexpected token i

// RangeError
new Array(-1);        // RangeError: Invalid array length
(42).toFixed(200);    // RangeError: toFixed() digits argument must be between 0 and 100

// AggregateError (ES2021)
try {
  await Promise.any([
    Promise.reject(new Error('A failed')),
    Promise.reject(new Error('B failed')),
  ]);
} catch (error) {
  console.log(error instanceof AggregateError); // true
  console.log(error.errors); // [Error: A failed, Error: B failed]
}`,
    },

    { type: 'heading', level: 2, text: 'Custom Error Classes', id: 'custom-errors' },
    { type: 'paragraph', text: 'Custom error classes let you create domain-specific errors with additional context. This makes error handling more precise and informative.' },
    {
      type: 'code', language: 'javascript', filename: 'custom-errors.js',
      code: `// Basic custom error
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(\`\${resource} with id "\${id}" not found\`);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
    this.statusCode = 404;
  }
}

class AuthError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

// Usage
function validateUser(data) {
  if (!data.name) throw new ValidationError('name', 'Name is required');
  if (data.age < 0) throw new ValidationError('age', 'Age must be positive');
  if (data.age > 150) throw new ValidationError('age', 'Age seems invalid');
}

// Specific error handling
try {
  const user = await getUser(id);
  validateUser(user);
} catch (error) {
  if (error instanceof ValidationError) {
    showFieldError(error.field, error.message);
  } else if (error instanceof NotFoundError) {
    show404Page();
  } else if (error instanceof AuthError) {
    redirectToLogin();
  } else {
    throw error; // Unexpected — re-throw
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Error Hierarchy Pattern', id: 'error-hierarchy' },
    {
      type: 'code', language: 'javascript', filename: 'hierarchy.js',
      code: `// Base application error
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Distinguishes from programmer errors
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400, 'BAD_REQUEST');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(\`\${resource} not found\`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

// Usage in API handler
async function handleRequest(req) {
  try {
    const result = await processRequest(req);
    return { status: 200, body: result };
  } catch (error) {
    if (error instanceof AppError) {
      return { status: error.statusCode, body: error.toJSON() };
    }
    // Unexpected error
    console.error('Unexpected error:', error);
    return { status: 500, body: { error: 'Internal server error' } };
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Async Error Handling', id: 'async-errors' },
    {
      type: 'code', language: 'javascript', filename: 'async-errors.js',
      code: `// Promise .catch()
fetch('/api/data')
  .then(res => {
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json();
  })
  .then(data => processData(data))
  .catch(err => console.error('Fetch failed:', err));

// async/await with try/catch (preferred)
async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
      return null;
    }
    console.error('Failed to load:', error);
    throw error; // Re-throw if you can’t handle it
  }
}

// Handling multiple async operations
async function loadAll() {
  try {
    const [users, posts] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
    ]);
    return { users, posts };
  } catch (error) {
    // Any single failure reaches here
    console.error('Failed to load data:', error);
    return { users: [], posts: [] };
  }
}

// Promise.allSettled — handle mixed success/failure
const results = await Promise.allSettled([
  fetch('/api/a').then(r => r.json()),
  fetch('/api/b').then(r => r.json()),
  fetch('/api/c').then(r => r.json()),
]);

const successes = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);

const failures = results
  .filter(r => r.status === 'rejected')
  .map(r => r.reason);`,
    },
    { type: 'callout', variant: 'warning', title: 'Unhandled Rejections', text: 'Always handle promise rejections. Unhandled rejections crash Node.js processes and show warnings in browsers. Every `await` should be in a try/catch, and every promise chain should end with `.catch()`.' },

    { type: 'heading', level: 2, text: 'Global Error Handlers', id: 'global-handlers' },
    { type: 'paragraph', text: 'Global handlers catch errors that escape your try/catch blocks. They\'re your last line of defense and should log errors to a monitoring service.' },
    {
      type: 'code', language: 'javascript', filename: 'global-handlers.js',
      code: `// Browser: uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  logToService({
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    col: event.colno,
    stack: event.error?.stack,
  });
  // event.preventDefault(); // Suppress console error
});

// Browser: unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  logToService({
    type: 'unhandled_rejection',
    reason: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
  });
  event.preventDefault(); // Suppress console warning
});

// Node.js: uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  logToService(error);
  process.exit(1); // Always exit — state may be corrupted
});

// Node.js: unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
  logToService(reason);
});`,
    },

    { type: 'heading', level: 2, text: 'Retry Pattern', id: 'retry' },
    {
      type: 'code', language: 'javascript', filename: 'retry.js',
      code: `// Simple retry
async function retry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.warn(\`Attempt \${attempt} failed, retrying...\`);
    }
  }
}

// Retry with exponential backoff
async function retryWithBackoff(fn, options = {}) {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = () => true,
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const delay = Math.min(
        baseDelay * 2 ** (attempt - 1) + Math.random() * 1000,
        maxDelay
      );
      console.warn(\`Attempt \${attempt} failed. Retrying in \${delay}ms...\`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Usage
const data = await retryWithBackoff(
  () => fetch('/api/data').then(r => r.json()),
  {
    maxAttempts: 5,
    shouldRetry: (error) => {
      // Only retry network errors, not 4xx
      return !error.message.includes('HTTP 4');
    },
  }
);`,
    },

    { type: 'heading', level: 2, text: 'Safe Function Wrappers', id: 'safe-wrappers' },
    {
      type: 'code', language: 'javascript', filename: 'wrappers.js',
      code: `// Tuple pattern [error, result] (Go-style)
async function safeAsync(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

// Usage — no try/catch needed
const [error, data] = await safeAsync(fetch('/api/data').then(r => r.json()));
if (error) {
  console.error('Failed:', error);
  return;
}
processData(data);

// Safe JSON parse
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

const config = safeJsonParse(localStorage.getItem('config'), {});

// Fallback wrapper
function withFallback(fn, fallbackValue) {
  try {
    return fn();
  } catch {
    return fallbackValue;
  }
}

const port = withFallback(() => parseInt(env.PORT), 3000);`,
    },

    { type: 'heading', level: 2, text: 'React Error Boundaries', id: 'error-boundaries' },
    {
      type: 'code', language: 'tsx', filename: 'ErrorBoundary.tsx',
      code: `// React Error Boundary (class component — required)
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    logErrorToService(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}

// Error boundaries do NOT catch:
// - Event handlers (use try/catch)
// - Async code (use .catch())
// - Server-side rendering
// - Errors in the boundary itself`,
    },

    { type: 'heading', level: 2, text: 'Error Logging & Monitoring', id: 'logging' },
    {
      type: 'code', language: 'javascript', filename: 'logging.js',
      code: `// Structured error logging
function logError(error, context = {}) {
  const payload = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', payload);
    return;
  }

  // Send to monitoring service in production
  navigator.sendBeacon('/api/errors', JSON.stringify(payload));
}

// Usage throughout app
try {
  await updateUser(data);
} catch (error) {
  logError(error, {
    action: 'updateUser',
    userId: user.id,
    input: data,
  });
  showErrorToast('Failed to update profile');
}`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Swallowing errors (empty catch)
try {
  riskyOperation();
} catch (error) {
  // Silent fail — debugging nightmare!
}
// Fix: At minimum, log the error
// catch (error) { console.error(error); }

// 2. Catching too broadly
try {
  // 100 lines of code...
} catch (error) {
  showGenericError(); // Which line failed? Can’t tell.
}
// Fix: Wrap only the risky operation

// 3. Throwing strings instead of Error objects
throw 'Something failed';  // No stack trace!
throw new Error('Something failed'); // Has stack trace ✓

// 4. Not re-throwing unknown errors
try {
  getData();
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    return defaultData;
  }
  // All other errors silently swallowed!
}
// Fix: Add throw error; for the else case

// 5. Using try/catch for flow control
try {
  const user = users.find(u => u.id === id);
  user.name; // Throws if not found
} catch {
  console.log('User not found');
}
// Fix: Use conditional checks instead
const user = users.find(u => u.id === id);
if (!user) { console.log('User not found'); }

// 6. Forgetting await in try/catch
try {
  fetch('/api/data'); // Missing await! Error won’t be caught
} catch (error) {
  console.error(error); // Never reaches here
}`,
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use try/catch sparingly — only around code that can actually fail',
        'Always throw Error objects, not strings or numbers',
        'Create custom error classes for domain-specific failures',
        'Re-throw errors you cannot handle — do not swallow them',
        'Use `error.cause` (ES2022) to chain related errors',
        'Handle async errors with try/catch around await, or .catch() on promises',
        'Set up global error handlers as a safety net',
        'Log errors with context (user ID, action, input data)',
        'Use error boundaries in React to prevent full-page crashes',
        'Implement retry logic with exponential backoff for network operations',
        'Use `Promise.allSettled` when you need results from all promises, even failed ones',
        'In production, report errors to a monitoring service (Sentry, LogRocket, etc.)',
      ],
    },
  ],
};
