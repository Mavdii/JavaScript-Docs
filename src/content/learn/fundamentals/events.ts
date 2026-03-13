import type { LessonContent } from '@/types/content';

export const eventsLesson: LessonContent = {
  id: 'events',
  title: 'Events',
  description: 'Handle user interactions with event listeners, delegation, and the event object.',
  slug: 'learn/fundamentals/events',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['events', 'listeners', 'delegation', 'bubbling'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'Events let you respond to user actions like clicks, key presses, and form submissions. Understanding event propagation and delegation is key to efficient event handling.',
  relatedTopics: ['dom', 'debouncing'],
  order: 9,
  updatedAt: '2024-03-01',
  readingTime: 25,
  featured: false,
  keywords: ['addEventListener', 'event', 'click', 'bubbling', 'capturing', 'delegation', 'preventDefault', 'CustomEvent', 'AbortController'],
  prerequisites: ['DOM Basics', 'Functions'],
  learningGoals: [
    'Add and remove event listeners',
    'Use the event object to get details about user actions',
    'Understand bubbling, capturing, and event delegation',
    'Prevent default browser behavior',
    'Create and dispatch custom events',
    'Manage event listeners with AbortController',
    'Handle keyboard, mouse, and touch events',
  ],
  exercises: [
    'Build a keyboard shortcut handler that responds to Ctrl+S.',
    'Implement event delegation for a dynamic list of buttons.',
    'Create a drag-and-drop interface using mouse events.',
    'Build a custom event system for a pub/sub pattern.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Adding Event Listeners', id: 'adding-listeners' },
    { type: 'paragraph', text: '`addEventListener` attaches a function to run when an event occurs. It is the modern, preferred way to handle events.' },
    {
      type: 'code', language: 'javascript', filename: 'listeners.js',
      code: `const button = document.querySelector('#myBtn');

// Named function (can be removed later)
function handleClick(event) {
  console.log('Clicked!', event.target);
}
button.addEventListener('click', handleClick);

// Arrow function (cannot be removed individually)
button.addEventListener('click', (e) => {
  console.log('Also clicked!');
});

// With options
button.addEventListener('click', handleClick, {
  once: true,    // Remove after first trigger
  passive: true, // Won’t call preventDefault (scroll perf)
  capture: true, // Listen during capture phase
});

// Remove listener (must use same function reference)
button.removeEventListener('click', handleClick);

// Old way (avoid — only one handler per event)
button.onclick = function() { console.log('old way'); };
button.onclick = null; // Remove`,
    },

    { type: 'heading', level: 2, text: 'The Event Object', id: 'event-object' },
    { type: 'paragraph', text: 'Every event handler receives an event object with details about what happened. Different event types have different properties.' },
    {
      type: 'code', language: 'javascript', filename: 'event-object.js',
      code: `document.addEventListener('click', (e) => {
  // Common properties (all events)
  e.type          // "click"
  e.target        // Element that was ACTUALLY clicked
  e.currentTarget // Element the listener is attached to
  e.timeStamp     // When the event occurred
  e.isTrusted     // true if user-initiated, false if script-triggered

  // Mouse event properties
  e.clientX       // X position relative to viewport
  e.clientY       // Y position relative to viewport
  e.pageX         // X position relative to document
  e.pageY         // Y position relative to document
  e.offsetX       // X position relative to target element
  e.offsetY       // Y position relative to target element
  e.button        // 0 = left, 1 = middle, 2 = right
  e.buttons       // Bitmask of currently pressed buttons
  e.altKey        // true if Alt was held
  e.ctrlKey       // true if Ctrl was held
  e.shiftKey      // true if Shift was held
  e.metaKey       // true if Cmd (Mac) / Win (Windows) was held

  // Control propagation
  e.preventDefault()  // Stop default browser action
  e.stopPropagation() // Stop event from bubbling
  e.stopImmediatePropagation() // Stop all remaining handlers
});`,
    },

    { type: 'heading', level: 2, text: 'Mouse Events', id: 'mouse-events' },
    {
      type: 'code', language: 'javascript', filename: 'mouse.js',
      code: `const el = document.querySelector('.interactive');

// Click events
el.addEventListener('click', (e) => {
  console.log('Single click at', e.clientX, e.clientY);
});

el.addEventListener('dblclick', (e) => {
  console.log('Double clicked!');
});

el.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Prevent default right-click menu
  showCustomMenu(e.clientX, e.clientY);
});

// Hover events
el.addEventListener('mouseenter', () => {
  el.classList.add('hovered'); // Fires once when mouse enters
});

el.addEventListener('mouseleave', () => {
  el.classList.remove('hovered'); // Fires once when mouse leaves
});

// mouseover/mouseout vs mouseenter/mouseleave
// mouseenter/leave → does NOT bubble, fires only on the target
// mouseover/out    → DOES bubble, fires when entering/leaving children too

// Mouse movement (for tracking cursor, drag, etc.)
el.addEventListener('mousemove', (e) => {
  tooltip.style.left = e.pageX + 10 + 'px';
  tooltip.style.top = e.pageY + 10 + 'px';
});

// Mouse button down/up (for drag start/end)
el.addEventListener('mousedown', (e) => {
  if (e.button === 0) startDrag(e); // Left button only
});

document.addEventListener('mouseup', () => {
  stopDrag();
});`,
    },

    { type: 'heading', level: 2, text: 'Keyboard Events', id: 'keyboard-events' },
    {
      type: 'code', language: 'javascript', filename: 'keyboard.js',
      code: `// keydown — fires when key is pressed (repeats if held)
document.addEventListener('keydown', (e) => {
  console.log('Key:', e.key);     // "a", "Enter", "ArrowUp", " "
  console.log('Code:', e.code);   // "KeyA", "Enter", "ArrowUp", "Space"
  // key = character produced, code = physical key position

  // Modifier checks
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault(); // Prevent browser save dialog
    saveDocument();
  }

  if (e.key === 'Escape') {
    closeModal();
  }
});

// keyup — fires when key is released (does not repeat)
document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') {
    console.log('Shift released');
  }
});

// Keyboard shortcuts handler
const shortcuts = {
  'ctrl+s': () => save(),
  'ctrl+z': () => undo(),
  'ctrl+shift+z': () => redo(),
  'Escape': () => closeModal(),
};

document.addEventListener('keydown', (e) => {
  const combo = [
    e.ctrlKey && 'ctrl',
    e.shiftKey && 'shift',
    e.altKey && 'alt',
    e.key.toLowerCase(),
  ].filter(Boolean).join('+');

  const handler = shortcuts[combo] || shortcuts[e.key];
  if (handler) {
    e.preventDefault();
    handler();
  }
});

// Input events (for text fields — better than keydown for text)
const input = document.querySelector('input');
input.addEventListener('input', (e) => {
  console.log('Current value:', e.target.value);
  filterResults(e.target.value);
});`,
    },

    { type: 'heading', level: 2, text: 'Form Events', id: 'form-events' },
    {
      type: 'code', language: 'javascript', filename: 'form-events.js',
      code: `const form = document.querySelector('form');

// Submit
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload
  const data = new FormData(form);
  const values = Object.fromEntries(data);
  console.log('Submitted:', values);
});

// Change — fires when value changes AND element loses focus
const select = document.querySelector('select');
select.addEventListener('change', (e) => {
  console.log('Selected:', e.target.value);
});

// Input — fires on EVERY change (real-time)
const textInput = document.querySelector('input[type="text"]');
textInput.addEventListener('input', (e) => {
  validateField(e.target);
});

// Focus / blur
textInput.addEventListener('focus', () => {
  textInput.classList.add('focused');
});

textInput.addEventListener('blur', () => {
  textInput.classList.remove('focused');
  validateField(textInput);
});

// focusin / focusout (same as focus/blur but they bubble!)
form.addEventListener('focusin', (e) => {
  e.target.closest('.field')?.classList.add('active');
});

form.addEventListener('focusout', (e) => {
  e.target.closest('.field')?.classList.remove('active');
});

// Reset
form.addEventListener('reset', () => {
  console.log('Form was reset');
});`,
    },

    { type: 'heading', level: 2, text: 'Event Bubbling', id: 'bubbling' },
    { type: 'paragraph', text: 'Events bubble up from the target element through its ancestors to the document. A click on a nested element fires handlers on all ancestors.' },
    {
      type: 'code', language: 'javascript', filename: 'bubbling.js',
      code: `// HTML: <div id="parent"><button id="child">Click</button></div>

document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked');
});

document.getElementById('child').addEventListener('click', (e) => {
  console.log('Child clicked');
  // e.stopPropagation(); // Uncomment to prevent parent handler
});

// Clicking button logs:
// 1. "Child clicked" (target element first)
// 2. "Parent clicked" (bubbles up to parent)

// event.target vs event.currentTarget
document.querySelector('.container').addEventListener('click', (e) => {
  console.log('target:', e.target);        // What was ACTUALLY clicked
  console.log('currentTarget:', e.currentTarget); // Where the listener lives
});

// Stop propagation
child.addEventListener('click', (e) => {
  e.stopPropagation();  // Parent handler won’t fire
});

// stopImmediatePropagation — also stops OTHER handlers on same element
child.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('First handler');
});
child.addEventListener('click', () => {
  console.log('Second handler — never runs!');
});`,
    },

    { type: 'heading', level: 2, text: 'Event Capturing', id: 'capturing' },
    { type: 'paragraph', text: 'Events have three phases: capturing (top-down), target, and bubbling (bottom-up). By default, listeners fire during the bubbling phase. Use `capture: true` to listen during capturing.' },
    {
      type: 'code', language: 'javascript', filename: 'capturing.js',
      code: `// Event phases:
// 1. CAPTURING: document → html → body → ... → parent → target
// 2. TARGET: the element that was clicked
// 3. BUBBLING: target → parent → ... → body → html → document

const parent = document.getElementById('parent');
const child = document.getElementById('child');

// Capture phase listener (fires FIRST, top-down)
parent.addEventListener('click', () => {
  console.log('Parent (capture)');
}, true); // or { capture: true }

// Bubble phase listener (default, fires LAST, bottom-up)
parent.addEventListener('click', () => {
  console.log('Parent (bubble)');
});

child.addEventListener('click', () => {
  console.log('Child');
});

// Clicking child logs:
// 1. "Parent (capture)"  — capturing phase
// 2. "Child"             — target phase
// 3. "Parent (bubble)"   — bubbling phase

// event.eventPhase
// 1 = CAPTURING_PHASE
// 2 = AT_TARGET
// 3 = BUBBLING_PHASE`,
    },

    { type: 'heading', level: 2, text: 'Event Delegation', id: 'delegation' },
    { type: 'paragraph', text: 'Instead of adding listeners to each child, add one listener to the parent and check `event.target`. This is memory-efficient and works automatically with dynamically added elements.' },
    {
      type: 'code', language: 'javascript', filename: 'delegation.js',
      code: `// Without delegation — bad for many elements
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('li').remove();
  });
});
// Problems: many listeners, doesn’t work for new elements

// With delegation — one listener handles all
const list = document.querySelector('#todo-list');

list.addEventListener('click', (e) => {
  // Check if clicked element matches
  if (e.target.matches('.delete-btn')) {
    e.target.closest('li').remove();
  }

  if (e.target.matches('.edit-btn')) {
    const li = e.target.closest('li');
    editItem(li.dataset.id);
  }

  if (e.target.matches('.toggle-btn')) {
    e.target.closest('li').classList.toggle('completed');
  }
});

// closest() — finds nearest ancestor (or self) matching selector
// matches() — checks if element matches selector

// Advanced delegation helper
function delegate(parent, eventType, selector, handler) {
  parent.addEventListener(eventType, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e);
    }
  });
}

// Usage
delegate(list, 'click', '.delete-btn', function(e) {
  this.closest('li').remove(); // 'this' is the matched element
});`,
    },
    { type: 'callout', variant: 'tip', title: 'Performance', text: 'Event delegation reduces memory usage and works automatically with dynamically added elements. Use it for lists, tables, and repeated UI patterns. One listener on a parent is always better than N listeners on children.' },

    { type: 'heading', level: 2, text: 'preventDefault', id: 'prevent-default' },
    { type: 'paragraph', text: '`preventDefault()` stops the browser\'s default behavior for an event. Common uses: prevent form submission, prevent link navigation, prevent text selection.' },
    {
      type: 'code', language: 'javascript', filename: 'prevent-default.js',
      code: `// Prevent form submission (handle with JS instead)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitViaAjax(new FormData(form));
});

// Prevent link navigation
link.addEventListener('click', (e) => {
  e.preventDefault();
  router.navigate(link.href);
});

// Prevent default keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault(); // Don’t open browser save dialog
    saveDocument();
  }
});

// Prevent text selection on double-click
element.addEventListener('mousedown', (e) => {
  if (e.detail > 1) {
    e.preventDefault(); // Prevent text selection
  }
});

// Prevent context menu
element.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showCustomContextMenu(e.clientX, e.clientY);
});

// Check if default was prevented
element.addEventListener('click', (e) => {
  if (e.defaultPrevented) return; // Another handler already prevented
  // ... your logic
});`,
    },

    { type: 'heading', level: 2, text: 'Custom Events', id: 'custom-events' },
    { type: 'paragraph', text: 'Custom events let you create your own event types for component communication. They follow the same bubbling/capturing rules as native events.' },
    {
      type: 'code', language: 'javascript', filename: 'custom-events.js',
      code: `// Create and dispatch a custom event
const event = new CustomEvent('user:login', {
  detail: { userId: 42, username: 'Alice' },
  bubbles: true,     // Allow bubbling
  cancelable: true,  // Allow preventDefault
});

document.dispatchEvent(event);

// Listen for custom events
document.addEventListener('user:login', (e) => {
  console.log('User logged in:', e.detail.username);
});

// Component communication pattern
class CartWidget {
  constructor(el) {
    this.el = el;
  }

  addItem(item) {
    this.items.push(item);
    this.el.dispatchEvent(new CustomEvent('cart:updated', {
      detail: { items: this.items, total: this.getTotal() },
      bubbles: true,
    }));
  }
}

// Parent listens for updates
document.addEventListener('cart:updated', (e) => {
  updateCartBadge(e.detail.items.length);
  updateTotalDisplay(e.detail.total);
});

// Check if event was cancelled
const beforeNav = new CustomEvent('navigate', {
  detail: { to: '/page' },
  cancelable: true,
  bubbles: true,
});

const wasNotPrevented = element.dispatchEvent(beforeNav);
if (wasNotPrevented) {
  // No handler called preventDefault — proceed
  navigateTo('/page');
}`,
    },

    { type: 'heading', level: 2, text: 'AbortController for Events', id: 'abort-controller' },
    { type: 'paragraph', text: '`AbortController` provides a clean way to remove multiple event listeners at once. Pass the `signal` option to `addEventListener` and call `abort()` when done.' },
    {
      type: 'code', language: 'javascript', filename: 'abort.js',
      code: `// Create controller
const controller = new AbortController();
const { signal } = controller;

// Add multiple listeners with the same signal
element.addEventListener('click', handleClick, { signal });
element.addEventListener('mousemove', handleMove, { signal });
document.addEventListener('keydown', handleKey, { signal });
window.addEventListener('resize', handleResize, { signal });

// Remove ALL listeners at once
controller.abort();

// Practical: cleanup on component unmount
class Component {
  constructor(el) {
    this.el = el;
    this.controller = new AbortController();
    this.init();
  }

  init() {
    const { signal } = this.controller;
    this.el.addEventListener('click', this.onClick, { signal });
    window.addEventListener('scroll', this.onScroll, { signal });
    document.addEventListener('keydown', this.onKey, { signal });
  }

  destroy() {
    this.controller.abort(); // Clean up everything
  }
}

// React equivalent
useEffect(() => {
  const controller = new AbortController();
  window.addEventListener('resize', handleResize, {
    signal: controller.signal,
  });
  return () => controller.abort();
}, []);`,
    },

    { type: 'heading', level: 2, text: 'Touch Events', id: 'touch-events' },
    {
      type: 'code', language: 'javascript', filename: 'touch.js',
      code: `// Touch events (mobile)
element.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  console.log('Touch start:', touch.clientX, touch.clientY);
});

element.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  moveElement(touch.clientX, touch.clientY);
}, { passive: false }); // passive: false needed for preventDefault

element.addEventListener('touchend', (e) => {
  console.log('Touch ended');
});

// Pointer events (unified mouse + touch + pen)
element.addEventListener('pointerdown', (e) => {
  console.log('Pointer type:', e.pointerType); // "mouse", "touch", "pen"
  console.log('Position:', e.clientX, e.clientY);
  console.log('Pressure:', e.pressure); // 0 to 1
});

// Pointer events are recommended over separate mouse/touch handling
element.addEventListener('pointermove', handleMove);
element.addEventListener('pointerup', handleUp);
element.addEventListener('pointercancel', handleCancel);`,
    },

    { type: 'heading', level: 2, text: 'Scroll & Resize Events', id: 'scroll-resize' },
    {
      type: 'code', language: 'javascript', filename: 'scroll-resize.js',
      code: `// Scroll event (fires very frequently!)
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.width = scrollPercent * 100 + '%';
}, { passive: true }); // Always use passive for scroll

// Debounced scroll (better performance)
let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    console.log('Scroll ended at:', window.scrollY);
  }, 100);
}, { passive: true });

// Resize event
window.addEventListener('resize', () => {
  console.log('Window size:', window.innerWidth, window.innerHeight);
});

// ResizeObserver (for element size changes — better than window resize)
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(\`Element resized: \${width}x\${height}\`);
  }
});
observer.observe(element);
observer.disconnect(); // Cleanup`,
    },

    { type: 'heading', level: 2, text: 'Common Events Reference', id: 'common-events' },
    {
      type: 'table',
      headers: ['Event', 'Fires When', 'Bubbles?'],
      rows: [
        ['click', 'Element is clicked', 'Yes'],
        ['dblclick', 'Element is double-clicked', 'Yes'],
        ['contextmenu', 'Right-click / long press', 'Yes'],
        ['mouseenter / mouseleave', 'Cursor enters / leaves element', 'No'],
        ['mouseover / mouseout', 'Cursor enters / leaves (with children)', 'Yes'],
        ['input', 'Input value changes', 'Yes'],
        ['change', 'Input value changes + loses focus', 'Yes'],
        ['submit', 'Form is submitted', 'Yes'],
        ['keydown / keyup', 'Key is pressed / released', 'Yes'],
        ['focus / blur', 'Element gains / loses focus', 'No'],
        ['focusin / focusout', 'Like focus/blur but bubbles', 'Yes'],
        ['scroll', 'Element is scrolled', 'No (window) / Yes'],
        ['resize', 'Window size changes', 'No'],
        ['DOMContentLoaded', 'HTML is fully parsed', 'No'],
        ['load', 'Page + all resources loaded', 'No'],
        ['beforeunload', 'User is about to leave page', 'No'],
        ['copy / paste / cut', 'Clipboard operations', 'Yes'],
        ['drag / drop', 'Drag-and-drop operations', 'Yes'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Using arrow function with removeEventListener
const btn = document.querySelector('button');
btn.addEventListener('click', () => console.log('click'));
btn.removeEventListener('click', () => console.log('click')); // Doesn’t work!
// Fix: Use a named function reference

// 2. Calling the function instead of passing it
btn.addEventListener('click', handleClick()); // WRONG: calls immediately!
btn.addEventListener('click', handleClick);   // Correct: passes reference

// 3. Not using passive for scroll/touch
window.addEventListener('scroll', handler);           // Blocks scrolling!
window.addEventListener('scroll', handler, { passive: true }); // Correct

// 4. Memory leaks from event listeners
function initWidget() {
  window.addEventListener('resize', handleResize); // Never cleaned up!
}
// Fix: Return cleanup function or use AbortController

// 5. Using onclick attribute (overrides previous handler)
el.onclick = handler1;
el.onclick = handler2; // handler1 is LOST!
// Fix: Use addEventListener (supports multiple handlers)

// 6. Stopping propagation unnecessarily
child.addEventListener('click', (e) => {
  e.stopPropagation(); // Breaks delegation on ancestors!
});
// Only use stopPropagation when you truly need it`,
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use `addEventListener` — never `onclick` attributes',
        'Use event delegation for lists, tables, and dynamic content',
        'Use named functions for handlers you need to remove',
        'Use `AbortController` to manage groups of event listeners',
        'Always use `{ passive: true }` for scroll and touch event listeners',
        'Use `{ once: true }` for one-time event handlers',
        'Debounce or throttle high-frequency events (scroll, resize, mousemove)',
        'Use `e.target.closest(selector)` with delegation for reliable matching',
        'Clean up listeners when components unmount to prevent memory leaks',
        'Use Pointer Events instead of separate mouse and touch event handling',
        'Use custom events for loose component communication',
      ],
    },
  ],
};
