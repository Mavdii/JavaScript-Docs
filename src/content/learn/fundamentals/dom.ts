import type { LessonContent } from '@/types/content';

export const domLesson: LessonContent = {
  id: 'dom',
  title: 'DOM Basics',
  description: 'Learn to select, create, modify, and remove DOM elements with JavaScript.',
  slug: 'learn/fundamentals/dom',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['dom', 'document', 'elements', 'browser'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'The DOM (Document Object Model) is a tree representation of an HTML page. JavaScript can read and modify it to create dynamic, interactive web pages.',
  relatedTopics: ['events'],
  order: 8,
  updatedAt: '2024-03-01',
  readingTime: 25,
  featured: false,
  keywords: ['DOM', 'querySelector', 'createElement', 'innerHTML', 'classList', 'dataset', 'fragment', 'MutationObserver'],
  prerequisites: ['Variables & Types', 'Functions'],
  learningGoals: [
    'Select elements using querySelector and getElementById',
    'Create and insert new DOM elements',
    'Modify content, attributes, and styles',
    'Remove elements from the DOM',
    'Traverse the DOM tree',
    'Use DocumentFragment for batch operations',
    'Understand performance implications of DOM manipulation',
  ],
  exercises: [
    'Build a to-do list that adds and removes items dynamically.',
    'Create a function that highlights all paragraphs containing a search term.',
    'Build a table generator that creates an HTML table from a 2D array.',
    'Implement a DOM-based accordion component without any framework.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What is the DOM?', id: 'what-is-dom' },
    { type: 'paragraph', text: 'The DOM is a tree-structured representation of an HTML document. Every HTML element becomes a node in the tree. JavaScript can access and modify this tree to change what users see and interact with.' },
    {
      type: 'code', language: 'html', filename: 'example.html',
      code: `<!-- This HTML... -->
<div id="app">
  <h1 class="title">Hello</h1>
  <p>Welcome to <strong>my site</strong></p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>

<!-- ...becomes this tree:
document
  └── html
      ├── head
      └── body
          └── div#app
              ├── h1.title "Hello"
              ├── p
              │   ├── "Welcome to "
              │   └── strong "my site"
              └── ul
                  ├── li "Item 1"
                  └── li "Item 2"
-->`,
    },

    { type: 'heading', level: 2, text: 'Selecting Elements', id: 'selecting' },
    { type: 'paragraph', text: 'The most common way to access DOM elements is with `querySelector` (CSS selector syntax) and `getElementById`. Always prefer `querySelector` for its flexibility.' },
    {
      type: 'code', language: 'javascript', filename: 'selecting.js',
      code: `// querySelector — returns first match (or null)
const header = document.querySelector('h1');
const byId = document.querySelector('#app');
const byClass = document.querySelector('.card');
const nested = document.querySelector('#app .card:first-child');
const byAttr = document.querySelector('[data-role="admin"]');

// getElementById — fast, but limited to IDs
const app = document.getElementById('app');

// querySelectorAll — returns ALL matches (NodeList)
const items = document.querySelectorAll('.list-item');
const allLinks = document.querySelectorAll('a[href^="https"]');

// NodeList → iterate with forEach
items.forEach(item => console.log(item.textContent));

// NodeList → convert to array for full array methods
const itemArray = Array.from(items);
const filtered = itemArray.filter(el => el.classList.contains('active'));

// Older methods (still work but less flexible)
const byTag = document.getElementsByTagName('div');     // HTMLCollection
const byClassName = document.getElementsByClassName('card'); // HTMLCollection
// NOTE: These return LIVE collections that update automatically`,
    },
    { type: 'callout', variant: 'tip', title: 'querySelector vs getElement*', text: '`querySelector`/`querySelectorAll` return static snapshots. `getElementsBy*` return live collections that update when the DOM changes. Prefer querySelector for predictability.' },

    { type: 'heading', level: 2, text: 'Modifying Content', id: 'content' },
    {
      type: 'code', language: 'javascript', filename: 'content.js',
      code: `const el = document.querySelector('.card');

// textContent — plain text (safe, fast)
el.textContent = 'Hello, World!';
console.log(el.textContent); // Gets all text, including hidden elements

// innerText — visible text only (slower, layout-aware)
el.innerText = 'Hello, World!';
console.log(el.innerText); // Only visible text

// innerHTML — HTML string (⚠️ XSS risk with user input)
el.innerHTML = '<strong>Bold</strong> and <em>italic</em>';
el.innerHTML = ''; // Clear all children

// outerHTML — replaces the element itself
el.outerHTML = '<div class="new">Replaced!</div>';

// When to use which:
// textContent → setting/reading plain text (SAFE)
// innerText   → reading visible text only
// innerHTML   → setting HTML from trusted sources only`,
    },
    { type: 'callout', variant: 'warning', title: 'XSS Risk', text: 'Never use `innerHTML` with user-provided content. Use `textContent` for plain text to prevent cross-site scripting attacks. If you must insert HTML, sanitize it first with a library like DOMPurify.' },

    { type: 'heading', level: 2, text: 'Modifying Attributes', id: 'attributes' },
    {
      type: 'code', language: 'javascript', filename: 'attributes.js',
      code: `const img = document.querySelector('img');

// getAttribute / setAttribute
img.getAttribute('src');             // Get
img.setAttribute('src', 'new.jpg');  // Set
img.setAttribute('alt', 'A photo');

// removeAttribute
img.removeAttribute('title');

// hasAttribute
img.hasAttribute('alt');  // true

// Direct property access (for standard attributes)
img.src = 'new.jpg';     // Same as setAttribute
img.alt = 'A photo';
img.id = 'hero-image';

// data-* attributes (dataset)
const card = document.querySelector('.card');
card.dataset.userId = '42';      // Sets data-user-id="42"
card.dataset.role = 'admin';     // Sets data-role="admin"
console.log(card.dataset.userId); // "42"

// Boolean attributes
const input = document.querySelector('input');
input.disabled = true;    // <input disabled>
input.disabled = false;   // <input>
input.required = true;    // <input required>

// Custom attributes with setAttribute
card.setAttribute('aria-label', 'User card');
card.setAttribute('role', 'button');`,
    },

    { type: 'heading', level: 2, text: 'Modifying Classes', id: 'classes' },
    {
      type: 'code', language: 'javascript', filename: 'classes.js',
      code: `const el = document.querySelector('.card');

// classList methods
el.classList.add('active');           // Add class
el.classList.add('big', 'primary');   // Add multiple
el.classList.remove('hidden');        // Remove class
el.classList.toggle('selected');      // Toggle on/off
el.classList.toggle('dark', isDarkMode); // Force on/off based on condition
el.classList.contains('active');      // Check: true/false
el.classList.replace('old', 'new');   // Replace class

// className — full class string (replaces all classes!)
el.className = 'card active big';  // Overwrites everything
el.className += ' extra';          // Append (ugly)

// Practical patterns
function setLoading(button, isLoading) {
  button.classList.toggle('loading', isLoading);
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Loading...' : 'Submit';
}

// Conditional classes
function updateStatus(el, status) {
  el.classList.remove('success', 'error', 'warning');
  el.classList.add(status);
}`,
    },

    { type: 'heading', level: 2, text: 'Modifying Styles', id: 'styles' },
    {
      type: 'code', language: 'javascript', filename: 'styles.js',
      code: `const el = document.querySelector('.box');

// Inline styles (camelCase property names)
el.style.color = 'blue';
el.style.fontSize = '18px';
el.style.backgroundColor = '#f0f0f0';
el.style.marginTop = '20px';

// Remove inline style
el.style.color = '';  // Removes the inline style

// Set multiple styles at once
Object.assign(el.style, {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
});

// CSS custom properties (CSS variables)
el.style.setProperty('--primary-color', '#3b82f6');
el.style.getPropertyValue('--primary-color'); // "#3b82f6"

// Read computed styles (actual rendered values)
const computed = getComputedStyle(el);
computed.width;           // "300px"
computed.color;           // "rgb(0, 0, 255)"
computed.fontSize;        // "18px"

// BEST PRACTICE: Use CSS classes instead of inline styles
// Bad:
el.style.color = 'red';
el.style.fontWeight = 'bold';

// Good:
el.classList.add('error-text');
// .error-text { color: red; font-weight: bold; }`,
    },
    { type: 'callout', variant: 'tip', title: 'Prefer Classes', text: 'Avoid inline styles. Use `classList` to toggle CSS classes instead — it is more maintainable, cacheable, and supports media queries and pseudo-elements.' },

    { type: 'heading', level: 2, text: 'Creating & Inserting Elements', id: 'creating' },
    {
      type: 'code', language: 'javascript', filename: 'creating.js',
      code: `// Create element
const li = document.createElement('li');
li.textContent = 'New item';
li.classList.add('item');
li.dataset.id = '42';

// Create with HTML (text node, comment, etc.)
const text = document.createTextNode('Hello');
const comment = document.createComment('TODO: fix this');

// Insert methods
const list = document.querySelector('ul');

// Append to end
list.appendChild(li);           // Returns the node
list.append(li, 'text', li2);   // Can append multiple, including text

// Prepend to start
list.prepend(li);

// Insert relative to other elements
const ref = list.querySelector('.reference');
list.insertBefore(li, ref);      // Before reference element

// Modern positioning with insertAdjacentHTML/Element
list.insertAdjacentHTML('beforeend', '<li>Via HTML</li>');
list.insertAdjacentElement('afterbegin', li);

// Positions:
// 'beforebegin' — before the element itself
// 'afterbegin'  — inside, before first child
// 'beforeend'   — inside, after last child
// 'afterend'    — after the element itself

// Clone element
const clone = li.cloneNode(true);  // true = deep clone (with children)
list.appendChild(clone);`,
    },

    { type: 'heading', level: 2, text: 'Removing Elements', id: 'removing' },
    {
      type: 'code', language: 'javascript', filename: 'removing.js',
      code: `const el = document.querySelector('.old');

// Modern — remove itself
el.remove();

// Legacy — remove via parent
el.parentNode.removeChild(el);

// Remove all children
const container = document.querySelector('#container');

// Method 1: innerHTML (fast but loses event listeners)
container.innerHTML = '';

// Method 2: Loop (preserves references if needed)
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Method 3: replaceChildren (modern, clean)
container.replaceChildren(); // Remove all
container.replaceChildren(newChild1, newChild2); // Replace with new

// Replace element
const oldEl = document.querySelector('.old');
const newEl = document.createElement('div');
newEl.textContent = 'New content';
oldEl.replaceWith(newEl);`,
    },

    { type: 'heading', level: 2, text: 'DOM Traversal', id: 'traversal' },
    { type: 'paragraph', text: 'You can navigate the DOM tree using parent, child, and sibling relationships. This is useful when you need to find related elements.' },
    {
      type: 'code', language: 'javascript', filename: 'traversal.js',
      code: `const el = document.querySelector('.card');

// Parent
el.parentNode        // Direct parent (any node)
el.parentElement     // Direct parent (element only)
el.closest('.container') // Nearest ancestor matching selector

// Children
el.children          // HTMLCollection of child elements
el.childNodes        // NodeList (includes text nodes!)
el.firstElementChild // First child element
el.lastElementChild  // Last child element
el.childElementCount // Number of child elements

// Siblings
el.nextElementSibling     // Next sibling element
el.previousElementSibling // Previous sibling element

// Practical: walk up the tree
function findAncestor(el, selector) {
  return el.closest(selector);
}

// Practical: get all siblings
function getSiblings(el) {
  return [...el.parentElement.children].filter(child => child !== el);
}

// Practical: find next element matching selector
function findNext(el, selector) {
  let sibling = el.nextElementSibling;
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }
  return null;
}`,
    },

    { type: 'heading', level: 2, text: 'DocumentFragment', id: 'fragment' },
    { type: 'paragraph', text: 'A `DocumentFragment` is a lightweight container for DOM nodes. Use it to batch multiple DOM insertions into a single operation, avoiding repeated reflows.' },
    {
      type: 'code', language: 'javascript', filename: 'fragment.js',
      code: `// Without fragment — each appendChild triggers reflow
const list = document.querySelector('ul');
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = \`Item \${i}\`;
  list.appendChild(li); // 1000 reflows!
}

// With fragment — single reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = \`Item \${i}\`;
  fragment.appendChild(li); // Appends to fragment (off-screen)
}
list.appendChild(fragment); // Single reflow!

// Template element alternative
const template = document.querySelector('#card-template');
const clone = template.content.cloneNode(true);
clone.querySelector('.title').textContent = 'New Card';
document.body.appendChild(clone);`,
    },

    { type: 'heading', level: 2, text: 'MutationObserver', id: 'mutation-observer' },
    { type: 'paragraph', text: '`MutationObserver` watches for changes to the DOM tree. It is useful for reacting to dynamic content changes from third-party scripts or frameworks.' },
    {
      type: 'code', language: 'javascript', filename: 'observer.js',
      code: `// Watch for DOM changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      console.log('Children changed:', mutation.addedNodes, mutation.removedNodes);
    }
    if (mutation.type === 'attributes') {
      console.log('Attribute changed:', mutation.attributeName);
    }
  }
});

// Start observing
const target = document.querySelector('#dynamic-content');
observer.observe(target, {
  childList: true,      // Watch for added/removed children
  attributes: true,     // Watch for attribute changes
  subtree: true,        // Watch entire subtree
  characterData: true,  // Watch text content changes
});

// Stop observing
observer.disconnect();

// Practical: wait for element to appear
function waitForElement(selector) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

const element = await waitForElement('.lazy-loaded');`,
    },

    { type: 'heading', level: 2, text: 'Working with Forms', id: 'forms' },
    {
      type: 'code', language: 'javascript', filename: 'forms.js',
      code: `// Access form elements
const form = document.querySelector('#myForm');
const nameInput = form.elements.username;  // By name attribute
const emailInput = form.elements['email']; // Bracket notation

// Get/set values
nameInput.value;                // Get current value
nameInput.value = 'Alice';     // Set value

// Checkboxes and radios
const checkbox = form.elements.agree;
checkbox.checked;               // true/false
checkbox.checked = true;

// Select dropdowns
const select = form.elements.country;
select.value;                   // Selected value
select.selectedIndex;           // Selected index
select.options[0].text;         // Option text

// Form data (modern)
const formData = new FormData(form);
const data = Object.fromEntries(formData);
// { username: "Alice", email: "alice@example.com", ... }

// Prevent default submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  console.log('Form data:', data);
});`,
    },

    { type: 'heading', level: 2, text: 'Performance Tips', id: 'performance' },
    {
      type: 'list',
      items: [
        'Use `DocumentFragment` or `innerHTML` for batch insertions — avoid individual `appendChild` in loops',
        'Cache DOM references — call `querySelector` once, not in loops',
        'Use `requestAnimationFrame` for visual changes to avoid layout thrashing',
        'Batch reads and writes — reading layout properties (offsetHeight, getBoundingClientRect) between writes forces reflow',
        'Use event delegation instead of adding listeners to many elements',
        'Use `display: none` before making many changes, then show again — one reflow instead of many',
        'Prefer `textContent` over `innerHTML` for text — it is faster and safer',
        'Use `classList` methods instead of `className` string manipulation',
        'Detach elements from DOM for complex operations, then reattach',
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'layout-thrashing.js',
      code: `// BAD: Layout thrashing (read-write-read-write)
elements.forEach(el => {
  const height = el.offsetHeight; // Forces layout (READ)
  el.style.height = height + 10 + 'px'; // Invalidates layout (WRITE)
});
// Each iteration forces a reflow!

// GOOD: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // All reads first
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // All writes after
});

// BEST: Use requestAnimationFrame
requestAnimationFrame(() => {
  // All DOM writes happen in the same frame
  elements.forEach(el => {
    el.style.transform = \`translateY(\${offset}px)\`;
  });
});`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. querySelector returns null if not found
const el = document.querySelector('.missing');
el.textContent = 'hello'; // TypeError: Cannot set properties of null
// Fix: Check first
const el2 = document.querySelector('.missing');
if (el2) el2.textContent = 'hello';

// 2. NodeList is not an Array
const items = document.querySelectorAll('.item');
items.map(i => i.textContent); // Error! NodeList has no .map
// Fix: Array.from(items).map(...)

// 3. Live vs static collections
const live = document.getElementsByClassName('item'); // LIVE
const static_ = document.querySelectorAll('.item');   // STATIC
// Adding a .item element updates 'live' but NOT 'static_'

// 4. innerHTML XSS vulnerability
const userInput = '<img src=x onerror="alert(1)">';
el.innerHTML = userInput; // XSS attack!
// Fix: el.textContent = userInput;

// 5. Setting styles without units
el.style.width = 100;     // Won’t work!
el.style.width = '100px'; // Correct

// 6. Forgetting to wait for DOM load
// Script in <head> can’t find <body> elements
document.addEventListener('DOMContentLoaded', () => {
  // DOM is ready — safe to query elements
});
// Or place <script> at end of <body>`,
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use `querySelector`/`querySelectorAll` with CSS selectors — most flexible and readable',
        'Always check for `null` before using `querySelector` results',
        'Use `textContent` for text, never `innerHTML` with user input',
        'Prefer `classList` methods over `className` string manipulation',
        'Use CSS classes for styling, not inline `style` properties',
        'Use `DocumentFragment` for batch DOM insertions',
        'Use event delegation for dynamic element lists',
        'Cache DOM references outside of loops and event handlers',
        'Use `data-*` attributes for storing custom data on elements',
        'Use `requestAnimationFrame` for smooth visual updates',
        'Consider using a framework (React, Vue) for complex DOM-heavy applications',
      ],
    },
  ],
};
