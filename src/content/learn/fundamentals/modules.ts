import type { LessonContent } from '@/types/content';

export const modulesLesson: LessonContent = {
  id: 'modules',
  title: 'Modules',
  description: 'Organize code with ES modules — import, export, default exports, and dynamic imports.',
  slug: 'learn/fundamentals/modules',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['modules', 'import', 'export', 'esm'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'ES modules let you split code into reusable files with explicit imports and exports. They provide encapsulation, tree-shaking, and clear dependency graphs.',
  relatedTopics: ['functions', 'scope'],
  order: 10,
  updatedAt: '2024-03-01',
  readingTime: 22,
  featured: false,
  keywords: ['import', 'export', 'default export', 'named export', 'dynamic import', 'ESM', 'CommonJS', 'tree-shaking', 'barrel file'],
  prerequisites: ['Functions', 'Scope'],
  learningGoals: [
    'Use named and default exports',
    'Import modules with various syntaxes',
    'Understand dynamic imports for code splitting',
    'Know the difference between ESM and CommonJS',
    'Organize code with barrel files',
    'Understand module loading and circular dependencies',
  ],
  exercises: [
    'Refactor a single-file script into multiple modules.',
    'Use dynamic import to lazy-load a module on button click.',
    'Create a utility library with a barrel file that re-exports from multiple modules.',
    'Set up a project with both ESM and CommonJS modules and handle interop.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Why Modules?', id: 'why-modules' },
    { type: 'paragraph', text: 'Before modules, all JavaScript shared a single global scope. This caused naming conflicts, made dependencies unclear, and made code hard to maintain. Modules solve these problems by providing encapsulation, explicit dependencies, and reusability.' },
    {
      type: 'code', language: 'javascript', filename: 'old-way.js',
      code: `// Without modules — everything is global
// file1.js
var utils = {
  formatDate: function(d) { /* ... */ }
};

// file2.js
var utils = { // Overwrites file1's utils!
  formatCurrency: function(n) { /* ... */ }
};

// With modules — explicit, isolated
// utils/date.js
export function formatDate(d) { /* ... */ }

// utils/currency.js
export function formatCurrency(n) { /* ... */ }

// app.js — no conflicts!
import { formatDate } from './utils/date.js';
import { formatCurrency } from './utils/currency.js';`,
    },

    { type: 'heading', level: 2, text: 'Named Exports', id: 'named-exports' },
    { type: 'paragraph', text: 'Named exports allow multiple values to be exported from a single module. They must be imported using the exact same name (or renamed with `as`).' },
    {
      type: 'code', language: 'javascript', filename: 'math.js',
      code: `// Export individually (inline)
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) { return a + b; }

export function subtract(a, b) { return a - b; }

// Or export at the end (export list)
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
export { multiply, divide };

// Export with renaming
function internalHelper() { /* ... */ }
export { internalHelper as helper };

// Export class
export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Default Exports', id: 'default-exports' },
    { type: 'paragraph', text: 'Each module can have one default export. It can be imported with any name. Default exports are common for the "main" thing a module provides.' },
    {
      type: 'code', language: 'javascript', filename: 'Logger.js',
      code: `// Default export — one per module
export default class Logger {
  constructor(prefix = '') {
    this.prefix = prefix;
  }
  log(msg) { console.log(\`[\${this.prefix}] \${msg}\`); }
  error(msg) { console.error(\`[\${this.prefix}] \${msg}\`); }
  warn(msg) { console.warn(\`[\${this.prefix}] \${msg}\`); }
}

// Can also be a function
export default function createApp(config) {
  return { /* ... */ };
}

// Or an object
export default {
  version: '1.0.0',
  name: 'MyLib',
};

// Mix default and named exports
export default class User { /* ... */ }
export function createUser(data) { return new User(data); }
export const ROLES = ['admin', 'user', 'guest'];`,
    },

    { type: 'heading', level: 2, text: 'Importing', id: 'importing' },
    {
      type: 'code', language: 'javascript', filename: 'app.js',
      code: `// Named imports (curly braces required)
import { add, PI } from './math.js';

// Default import (no curly braces, any name works)
import Logger from './Logger.js';
import MyLogger from './Logger.js'; // Same thing, different name

// Both default and named
import Logger, { createUser, ROLES } from './User.js';

// Rename imports (avoid naming conflicts)
import { add as sum } from './math.js';
import { add as vectorAdd } from './vector.js';

// Import everything as namespace object
import * as MathUtils from './math.js';
MathUtils.add(1, 2);
MathUtils.PI;
MathUtils.multiply(3, 4);

// Side-effect import (runs code, no bindings)
import './polyfills.js';   // Executes the module
import './styles.css';     // Common in bundlers

// Import JSON (with assertion — browser support varies)
// import data from './config.json' with { type: 'json' };`,
    },

    { type: 'heading', level: 2, text: 'Dynamic Imports', id: 'dynamic-imports' },
    { type: 'paragraph', text: 'Dynamic `import()` returns a Promise, enabling lazy loading and code splitting. This is crucial for performance in large applications.' },
    {
      type: 'code', language: 'javascript', filename: 'dynamic.js',
      code: `// Basic dynamic import
const module = await import('./heavy-library.js');
module.doSomething();

// With destructuring
const { add, multiply } = await import('./math.js');

// Load module on demand (button click)
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');
  new Chart(canvas).render(data);
});

// Conditional loading
async function loadLocale(lang) {
  const translations = await import(\`./locales/\${lang}.js\`);
  return translations.default;
}

// Error handling
try {
  const module = await import('./optional-feature.js');
  module.init();
} catch (err) {
  console.warn('Feature not available:', err.message);
}

// React lazy loading
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
// Renders with <Suspense fallback={<Spinner />}>

// Route-based code splitting (React Router)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));`,
    },
    { type: 'callout', variant: 'tip', title: 'Code Splitting', text: 'Dynamic imports are the foundation of code splitting in bundlers like Vite and Webpack. Use them for heavy libraries, rarely-used features, and route-based loading. The bundler automatically creates separate chunks.' },

    { type: 'heading', level: 2, text: 'Re-exporting (Barrel Files)', id: 're-exporting' },
    { type: 'paragraph', text: 'Barrel files use re-exports to create a single entry point for multiple modules. This simplifies imports for consumers of your library.' },
    {
      type: 'code', language: 'javascript', filename: 'utils/index.js',
      code: `// Barrel file — re-export from multiple modules
export { add, multiply, divide } from './math.js';
export { formatDate, parseDate } from './date.js';
export { default as Logger } from './Logger.js';

// Re-export everything
export * from './validators.js';

// Re-export with rename
export { default as Http } from './HttpClient.js';
export { fetch as fetchData } from './api.js';

// Consumer gets clean imports
import { add, formatDate, Logger } from './utils/index.js';
// Or with bundler:
import { add, formatDate, Logger } from './utils';`,
    },
    { type: 'callout', variant: 'warning', title: 'Barrel File Performance', text: 'Large barrel files can hurt tree-shaking. If you import one function from a barrel that re-exports 100 things, the bundler may include everything. Use specific imports for large libraries: `import add from "lodash/add"` instead of `import { add } from "lodash"`.' },

    { type: 'heading', level: 2, text: 'ESM vs CommonJS', id: 'esm-vs-cjs' },
    { type: 'paragraph', text: 'ESM (ES Modules) is the modern standard. CommonJS (CJS) is the Node.js legacy format. Understanding both is important because many npm packages still use CommonJS.' },
    {
      type: 'table',
      headers: ['Feature', 'ESM (import/export)', 'CommonJS (require/module.exports)'],
      rows: [
        ['Syntax', 'import/export', 'require()/module.exports'],
        ['Loading', 'Static (parsed at compile time)', 'Dynamic (loaded at runtime)'],
        ['Top-level await', 'Yes', 'No'],
        ['Tree-shaking', 'Yes', 'Limited'],
        ['this at top level', 'undefined', 'module.exports'],
        ['File extension', '.mjs or type:"module"', '.cjs or default in Node'],
        ['Browser support', 'Yes (native)', 'No (needs bundler)'],
        ['Strict mode', 'Always', 'Optional'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'cjs-vs-esm.js',
      code: `// CommonJS (Node.js legacy)
const fs = require('fs');
const { readFile } = require('fs');

module.exports = { myFunction };
module.exports = myFunction; // default-like export

// ESM equivalent
import fs from 'fs';
import { readFile } from 'fs';

export { myFunction };
export default myFunction;

// In package.json — set module type
// { "type": "module" } → .js files are ESM
// { "type": "commonjs" } → .js files are CJS (default)

// File extensions override package.json
// .mjs → always ESM
// .cjs → always CommonJS`,
    },

    { type: 'heading', level: 2, text: 'Module Loading Behavior', id: 'loading' },
    { type: 'paragraph', text: 'Modules have specific loading behaviors that differ from regular scripts. Understanding these prevents common confusion.' },
    {
      type: 'code', language: 'javascript', filename: 'loading.js',
      code: `// 1. Modules are executed ONCE (cached/singleton)
// counter.js
let count = 0;
export const increment = () => ++count;
export const getCount = () => count;

// app.js — both imports share the same state
import { increment, getCount } from './counter.js';
import { increment as inc2 } from './counter.js'; // Same module!

increment(); // count = 1
inc2();       // count = 2 (same count!)
getCount();   // 2

// 2. Modules have their own scope (no globals)
// This does NOT pollute the global scope:
const secret = 42;
// In non-module script: window.secret exists
// In module: window.secret does NOT exist

// 3. Modules are deferred by default in HTML
// <script type="module" src="app.js"></script>
// Equivalent to <script defer src="app.js"></script>
// DOM is ready when module executes

// 4. Import bindings are live (read-only references)
// counter.js
export let count = 0;
export function increment() { count++; }

// app.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1 (binding updated!)
// count = 5; // TypeError — imports are read-only!`,
    },

    { type: 'heading', level: 2, text: 'Circular Dependencies', id: 'circular' },
    { type: 'paragraph', text: 'Circular dependencies occur when module A imports from module B, and module B imports from module A. ESM handles them partially, but they can cause subtle bugs.' },
    {
      type: 'code', language: 'javascript', filename: 'circular.js',
      code: `// a.js
import { b } from './b.js';
export const a = 'A';
console.log('a.js:', b); // Might be undefined!

// b.js
import { a } from './a.js';
export const b = 'B';
console.log('b.js:', a); // Might be undefined!

// The problem: one module executes first, so the other’s
// exports haven’t been initialized yet.

// Solutions:

// 1. Restructure — move shared code to a third module
// shared.js
export const a = 'A';
export const b = 'B';

// 2. Use functions (defer access to after initialization)
// a.js
import { getB } from './b.js';
export const getA = () => 'A';
// Access b LATER, not at import time
setTimeout(() => console.log(getB()), 0);

// 3. Move imports to where they’re actually used
export function processA() {
  const { b } = await import('./b.js'); // Lazy import
  return b;
}`,
    },
    { type: 'callout', variant: 'warning', title: 'Avoid Circular Imports', text: 'Circular dependencies are a code smell. If you find them, restructure your modules. Move shared logic to a separate file or use dependency injection.' },

    { type: 'heading', level: 2, text: 'Module Patterns', id: 'patterns' },
    {
      type: 'code', language: 'javascript', filename: 'patterns.js',
      code: `// Singleton pattern
// config.js — module is only executed once
class Config {
  constructor() {
    this.settings = {};
  }
  set(key, value) { this.settings[key] = value; }
  get(key) { return this.settings[key]; }
}
export default new Config(); // Same instance everywhere

// Factory pattern
// logger.js
export function createLogger(prefix) {
  return {
    log: (msg) => console.log(\`[\${prefix}] \${msg}\`),
    error: (msg) => console.error(\`[\${prefix}] \${msg}\`),
  };
}

// Constants file
// constants.js
export const API_BASE = 'https://api.example.com';
export const MAX_RETRIES = 3;
export const TIMEOUT = 5000;

// Feature flags
// features.js
export const FEATURES = {
  darkMode: true,
  newDashboard: process.env.NODE_ENV !== 'production',
  analytics: true,
};
export const isEnabled = (feature) => FEATURES[feature] ?? false;

// Plugin / middleware pattern
// middleware.js
const middlewares = [];
export const use = (fn) => middlewares.push(fn);
export const run = async (ctx) => {
  for (const fn of middlewares) {
    await fn(ctx);
  }
};`,
    },

    { type: 'heading', level: 2, text: 'Tree Shaking', id: 'tree-shaking' },
    { type: 'paragraph', text: 'Tree shaking removes unused exports from the final bundle. It only works with ESM static imports, not CommonJS `require()`.' },
    {
      type: 'code', language: 'javascript', filename: 'tree-shaking.js',
      code: `// utils.js — all exported
export function used() { return 'I will be in the bundle'; }
export function unused() { return 'I will be removed'; }

// app.js
import { used } from './utils.js';
used(); // Only 'used' is included in the final bundle

// What PREVENTS tree shaking:

// 1. Side effects in module scope
let cache = {}; // Side effect â module can’t be safely removed
export function getData() { return cache; }

// 2. Dynamic property access
import * as utils from './utils.js';
const method = 'used';
utils[method](); // Bundler can’t know which exports are used

// 3. CommonJS
const utils = require('./utils'); // Can’t tree-shake require

// Tell bundler about side effects in package.json:
// "sideEffects": false        — all files are side-effect free
// "sideEffects": ["*.css"]    — only CSS files have side effects`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// 1. Forgetting curly braces for named imports
import add from './math.js';    // WRONG — imports default export
import { add } from './math.js'; // Correct — imports named export

// 2. Circular dependencies causing undefined values
// See circular dependencies section above

// 3. Modifying imported bindings
import { count } from './counter.js';
count = 5; // TypeError! Imports are read-only

// 4. import not at top level
function loadMath() {
  import { add } from './math.js'; // SyntaxError!
  // Static imports must be at top level
}
// Fix: Use dynamic import()
async function loadMath() {
  const { add } = await import('./math.js'); // OK!
}

// 5. Default export naming confusion
// Button.js
export default function Button() { /* ... */ }

// app.js
import Btn from './Button.js';    // Works (any name)
import { Button } from './Button.js'; // ERROR — no named export 'Button'
import { default as Button } from './Button.js'; // Works but ugly

// 6. Missing file extension in browsers
import { add } from './math';    // Fails in browser!
import { add } from './math.js'; // Works
// Bundlers (Vite, Webpack) add extensions automatically`,
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use ESM (`import`/`export`) — it is the modern standard with tree-shaking support',
        'Prefer named exports over default exports for better refactoring and auto-import support',
        'Use dynamic `import()` for code splitting — lazy-load heavy features and routes',
        'One module = one responsibility — keep modules focused and small',
        'Avoid circular dependencies — restructure code if they appear',
        'Use barrel files (index.js) sparingly — large barrels can hurt tree-shaking',
        'Import specific functions, not entire namespaces: `import { map } from "lodash-es"`',
        'Put side-effect-free imports first, side-effect imports last',
        'Set `"type": "module"` in package.json for modern Node.js projects',
        'Use `"sideEffects": false` in package.json to improve tree-shaking',
      ],
    },
  ],
};
