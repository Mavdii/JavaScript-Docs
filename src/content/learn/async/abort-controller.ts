import type { LessonContent } from '@/types/content';

export const abortControllerLesson: LessonContent = {
  id: 'abort-controller-001',
  title: 'AbortController: Cancelling Async Operations',
  description: 'Master AbortController for cancelling fetch requests, event listeners, and other async operations gracefully.',
  slug: 'learn/async/abort-controller',
  pillar: 'learn',
  category: 'async',
  tags: ['abort-controller', 'cancellation', 'fetch', 'timeout', 'signal', 'cleanup'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'Learn to use AbortController to cancel fetch requests, abort event listeners, and manage async operation timeouts.',
  relatedTopics: ['fetch-api', 'promises', 'event-listeners'],
  order: 9,
  updatedAt: '2024-01-15T13:15:00Z',
  readingTime: 18,
  featured: false,
  keywords: ['AbortController', 'AbortSignal', 'fetch cancellation', 'timeout', 'cleanup', 'resource management'],
  prerequisites: ['fetch-api', 'promises', 'event-listeners'],
  learningGoals: [
    'Understand AbortController and AbortSignal',
    'Cancel fetch requests in progress',
    'Implement request timeouts',
    'Clean up event listeners with abort signals',
    'Handle abort errors properly',
    'Manage resource lifecycle with abort signals'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Introduction to AbortController',
      id: 'introduction-to-abort-controller'
    },
    {
      type: 'paragraph',
      text: 'AbortController provides a way to abort one or more async operations. It consists of two parts: the AbortController (which has the abort() method) and the AbortSignal (which is passed to async operations and listened to for abort events).'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Basic AbortController usage
const controller = new AbortController();
const signal = controller.signal;

// Pass signal to async operation
fetch('/api/data', { signal });

// Later, abort the operation
controller.abort();

// Check if aborted
console.log(signal.aborted); // true

// Listen for abort event
signal.addEventListener('abort', () => {
  console.log('Operation aborted');
});

// Simple fetch with abort
async function fetchWithAbort() {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch('/api/data', { signal });
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch was cancelled');
    } else {
      console.error('Fetch error:', error);
    }
  }
}

// Abort from elsewhere
const fetchPromise = fetchWithAbort();
setTimeout(() => {
  // Note: can't abort from here since we don't have controller
  // This is why you typically wrap it
}, 1000);

// Better pattern
async function fetchWithAbortControl() {
  const controller = new AbortController();
  const signal = controller.signal;

  // Expose controller for external abort
  return {
    promise: fetch('/api/data', { signal }),
    abort: () => controller.abort()
  };
}

const { promise, abort } = fetchWithAbortControl();
setTimeout(abort, 5000); // Abort after 5 seconds`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cancelling Fetch Requests',
      id: 'cancelling-fetch'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Cancelling fetch requests
class FetchManager {
  constructor() {
    this.activeRequests = new Map();
  }

  async fetch(url, options = {}) {
    // Create abort controller for this request
    const controller = new AbortController();
    const signal = controller.signal;

    // Store controller for later cancellation
    this.activeRequests.set(url, controller);

    try {
      const response = await fetch(url, {
        ...options,
        signal
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(\`Request to \${url} was cancelled\`);
      } else {
        throw error;
      }
    } finally {
      // Clean up
      this.activeRequests.delete(url);
    }
  }

  // Cancel a specific request
  cancel(url) {
    const controller = this.activeRequests.get(url);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(url);
      console.log(\`Cancelled request to \${url}\`);
    }
  }

  // Cancel all requests
  cancelAll() {
    for (const [url, controller] of this.activeRequests) {
      controller.abort();
      console.log(\`Cancelled request to \${url}\`);
    }
    this.activeRequests.clear();
  }
}

// Usage
const manager = new FetchManager();

// Start multiple requests
Promise.all([
  manager.fetch('/api/users'),
  manager.fetch('/api/posts'),
  manager.fetch('/api/comments')
]).catch(error => {
  if (error.name !== 'AbortError') {
    console.error(error);
  }
});

// Cancel specific request
setTimeout(() => {
  manager.cancel('/api/posts');
}, 1000);

// Cancel all
setTimeout(() => {
  manager.cancelAll();
}, 2000);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Implementing Timeouts',
      id: 'implementing-timeouts'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Timeout implementation with AbortController
function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const signal = controller.signal;

  // Set up timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return fetch(url, { ...options, signal })
    .then((response) => {
      clearTimeout(timeoutId); // Request completed, clear timeout
      return response;
    })
    .catch((error) => {
      clearTimeout(timeoutId); // Error occurred, clear timeout
      if (error.name === 'AbortError') {
        throw new Error(\`Request to \${url} timed out after \${timeoutMs}ms\`);
      }
      throw error;
    });
}

// Usage
fetchWithTimeout('/api/slow-endpoint', {}, 3000)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Advanced: Timeout with race condition handling
class TimeoutController {
  constructor(timeoutMs = 5000) {
    this.controller = new AbortController();
    this.timeoutMs = timeoutMs;
    this.timeoutId = null;
  }

  getSignal() {
    return this.controller.signal;
  }

  start() {
    this.timeoutId = setTimeout(() => {
      this.controller.abort();
    }, this.timeoutMs);
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  abort() {
    this.clear();
    this.controller.abort();
  }
}

// Usage
const timeoutController = new TimeoutController(5000);
timeoutController.start();

fetch('/api/data', { signal: timeoutController.getSignal() })
  .then(response => {
    timeoutController.clear(); // Clear timeout on success
    return response.json();
  })
  .catch(error => {
    timeoutController.clear(); // Clear timeout on error
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error(error);
    }
  });`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'AbortSignal with Event Listeners',
      id: 'abort-signal-events'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Using AbortSignal with event listeners
class EventManager {
  constructor() {
    this.listeners = [];
  }

  addEventListener(element, event, handler, options = {}) {
    const controller = new AbortController();
    const signal = controller.signal;

    // Add listener with signal
    element.addEventListener(event, handler, {
      ...options,
      signal
    });

    // Store controller for cleanup
    this.listeners.push({
      element,
      event,
      handler,
      controller
    });

    // Return abort function
    return () => {
      controller.abort();
      // Listener is automatically removed when signal is aborted
    };
  }

  // Remove all listeners
  removeAll() {
    for (const listener of this.listeners) {
      listener.controller.abort();
    }
    this.listeners = [];
  }

  // Remove listeners for specific element
  removeForElement(element) {
    this.listeners
      .filter(l => l.element === element)
      .forEach(l => l.controller.abort());

    this.listeners = this.listeners.filter(l => l.element !== element);
  }
}

// Usage
const manager = new EventManager();

const button = document.querySelector('button');
const handleClick = () => console.log('Clicked');

const removeListener = manager.addEventListener(button, 'click', handleClick);

// Later, remove the listener
setTimeout(removeListener, 5000);

// Or remove all listeners
setTimeout(() => manager.removeAll(), 10000);

// Cleanup in React components
function useAbortSignal() {
  const controllerRef = React.useRef(new AbortController());

  React.useEffect(() => {
    return () => {
      // Abort all operations when component unmounts
      controllerRef.current.abort();
    };
  }, []);

  return controllerRef.current.signal;
}

function MyComponent() {
  const signal = useAbortSignal();

  React.useEffect(() => {
    fetch('/api/data', { signal })
      .then(r => r.json())
      .then(data => {
        // Update state with data
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });
  }, [signal]);

  return <div>Component</div>;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Advanced Patterns',
      id: 'advanced-patterns'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Pattern 1: Combining multiple signals
function combinedAbort(...signals) {
  const controller = new AbortController();

  const abortHandler = () => {
    controller.abort();
  };

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      return controller.signal;
    }
    signal.addEventListener('abort', abortHandler);
  }

  return controller.signal;
}

// Usage
const timeoutSignal = AbortSignal.timeout(5000);
const userCancelSignal = new AbortController().signal;

const combinedSignal = combinedAbort(timeoutSignal, userCancelSignal);
fetch('/api/data', { signal: combinedSignal });

// Pattern 2: Request priority with abort
class PriorityFetchManager {
  constructor() {
    this.requests = [];
  }

  async fetch(url, priority = 0) {
    const controller = new AbortController();
    const request = {
      url,
      priority,
      controller,
      timestamp: Date.now()
    };

    this.requests.push(request);

    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      this.requests = this.requests.filter(r => r !== request);
    }
  }

  // Abort lower priority requests
  prioritizeNewRequest(priority) {
    for (const request of this.requests) {
      if (request.priority < priority) {
        request.controller.abort();
      }
    }
  }
}

// Pattern 3: Debounced fetch with abort
class DebouncedFetcher {
  constructor(delay = 300) {
    this.delay = delay;
    this.controller = null;
    this.timeoutId = null;
  }

  fetch(url) {
    // Abort previous request
    if (this.controller) {
      this.controller.abort();
    }

    // Clear previous timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Return a promise that resolves after debounce delay
    return new Promise((resolve, reject) => {
      this.timeoutId = setTimeout(() => {
        this.controller = new AbortController();
        
        fetch(url, { signal: this.controller.signal })
          .then(r => r.json())
          .then(resolve)
          .catch(reject);
      }, this.delay);
    });
  }
}

// Usage in search input
const fetcher = new DebouncedFetcher(300);

document.querySelector('#search').addEventListener('input', (e) => {
  fetcher.fetch(\`/api/search?q=\${e.target.value}\`)
    .then(results => {
      console.log('Search results:', results);
    })
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Error Handling',
      id: 'error-handling'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Proper abort error handling
async function handleAbortGracefully() {
  const controller = new AbortController();

  try {
    const response = await fetch('/api/data', { signal: controller.signal });
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      // Handle abort separately from other errors
      console.log('Operation was aborted');
      return null; // Or default value
    } else if (error instanceof TypeError) {
      // Network error
      console.error('Network error:', error);
      throw error;
    } else {
      // Other errors
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}

// Checking abort status before operations
async function safeOperation(signal) {
  if (signal?.aborted) {
    throw new DOMException('Already aborted', 'AbortError');
  }

  // Do work
}

// Using AbortSignal.timeout for easy timeout handling
async function requestWithTimeout(url, timeoutMs = 5000) {
  try {
    // AbortSignal.timeout is modern and clean
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs)
    });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(\`Request timed out after \${timeoutMs}ms\`);
    } else {
      console.error(error);
    }
  }
}

// Listener cleanup
function setupWithCleanup() {
  const controller = new AbortController();
  const signal = controller.signal;

  const cleanup = () => {
    console.log('Cleaning up resources');
    controller.abort();
  };

  // Listeners automatically removed when signal aborts
  document.addEventListener('click', () => {
    console.log('Clicked');
  }, { signal });

  return cleanup;
}

const cleanup = setupWithCleanup();
// Later
cleanup();`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Summary',
      id: 'summary'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Key Takeaways',
      text: 'AbortController provides a standard way to cancel async operations. Pass AbortSignal to fetch, event listeners, and other async APIs. Use AbortError handling to distinguish between cancellation and other errors. Implement timeouts by calling abort() after a delay. Clean up event listeners by aborting their signals on component unmount. AbortSignal.timeout() provides a modern, convenient timeout implementation.'
    }
  ],
  exercises: [
    'Create a fetch manager that cancels requests on demand',
    'Implement a request timeout using AbortController',
    'Build a component that aborts pending requests on unmount',
    'Create a debounced search with automatic abort of previous requests',
    'Implement priority-based request cancellation',
    'Build a request cancellation UI with visible abort buttons'
  ]
};
