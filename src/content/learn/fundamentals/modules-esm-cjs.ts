import type { LessonContent } from '@/types/content';

export const modulesEsmCjsLesson: LessonContent = {
  id: 'modules-esm-cjs-001',
  title: 'JavaScript Modules: ESM and CommonJS',
  description: 'Master both ES Module (ESM) and CommonJS (CJS) module systems, understanding their differences, advantages, and how to work with both in modern JavaScript projects.',
  slug: 'learn/fundamentals/modules-esm-cjs',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['modules', 'esm', 'commonjs', 'cjs', 'imports', 'exports', 'bundling'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'Learn the two dominant JavaScript module systems: CommonJS (CJS) for Node.js and ES Modules (ESM) for the browser and modern Node.js. Understand their syntax, differences, and how to migrate between them.',
  relatedTopics: ['scope', 'namespacing', 'file-structure'],
  order: 14,
  updatedAt: '2024-01-15T11:00:00Z',
  readingTime: 22,
  featured: false,
  keywords: ['ES modules', 'ESM', 'CommonJS', 'CJS', 'import', 'export', 'require', 'module system', 'bundling'],
  prerequisites: ['variables', 'functions', 'objects'],
  learningGoals: [
    'Understand the CommonJS module system and its syntax',
    'Master ES Module (ESM) syntax and features',
    'Learn the key differences between ESM and CJS',
    'Work with default and named exports',
    'Handle module interoperability between ESM and CJS',
    'Optimize module imports for performance'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Understanding Module Systems',
      id: 'understanding-module-systems'
    },
    {
      type: 'paragraph',
      text: 'A module system provides a way to organize code into reusable, self-contained units. JavaScript historically relied on CommonJS (CJS) for server-side code, but ES Modules (ESM) is now the standard for both browsers and Node.js. Understanding both systems is essential for modern JavaScript development.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'CommonJS (CJS)',
      id: 'commonjs'
    },
    {
      type: 'paragraph',
      text: 'CommonJS is a synchronous module system primarily used in Node.js. Files are loaded and parsed synchronously, making it suitable for server-side applications where all modules are available locally.'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Basic CJS Syntax',
      id: 'basic-cjs-syntax'
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'math.js',
      code: `// Exporting from a module
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

// Single export
module.exports = {
  add,
  subtract,
  multiply
};

// Or export specific functions
module.exports.add = add;
module.exports.subtract = subtract;

// Or use exports shorthand (equivalent to module.exports)
exports.divide = (a, b) => a / b;`,
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'app.js',
      code: `// Importing CommonJS modules
const math = require('./math');

console.log(math.add(5, 3)); // 8
console.log(math.subtract(10, 4)); // 6
console.log(math.multiply(3, 7)); // 21

// Destructuring imports
const { add, subtract } = require('./math');
console.log(add(2, 8)); // 10

// Importing with different name
const mathModule = require('./math');

// Importing built-in modules
const fs = require('fs');
const path = require('path');
const { readFileSync } = require('fs');

// require() is synchronous
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'CJS Advanced Features',
      id: 'cjs-advanced-features'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Module.exports vs exports
// IMPORTANT: These are different!

// ❌ This doesn't work - exports is just a reference to module.exports
exports = { foo: 'bar' };

// ✅ This works - modifying module.exports directly
module.exports = { foo: 'bar' };

// Exporting a function as default
module.exports = function greeting(name) {
  return \`Hello, \${name}!\`;
};

// Or as a class
module.exports = class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
};

// Using in another file
const User = require('./user');
const user = new User('Alice');

// Conditional exports
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/optimized');
} else {
  module.exports = require('./src/dev');
}

// Circular dependencies (careful!)
// file-a.js
module.exports.a = 'A';
const b = require('./file-b');
module.exports.b = b;

// file-b.js
module.exports.b = 'B';
const a = require('./file-a');
module.exports.a = a; // Will be partial at this point`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'ES Modules (ESM)',
      id: 'es-modules'
    },
    {
      type: 'paragraph',
      text: 'ES Modules (ESM) is the standardized module system introduced in ES2015. It\'s now the standard for JavaScript in both browsers and modern Node.js. ESM is asynchronous and static, allowing for better optimization and tree-shaking.'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Basic ESM Syntax',
      id: 'basic-esm-syntax'
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'math.mjs',
      code: `// Named exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// Export after definition
function multiply(a, b) {
  return a * b;
}

export { multiply };

// Rename on export
function divide(a, b) {
  return a / b;
}

export { divide as divideNumbers };

// Default export (only one per module)
export default function power(base, exponent) {
  return Math.pow(base, exponent);
}`,
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'app.mjs',
      code: `// Importing named exports
import { add, subtract } from './math.mjs';

console.log(add(5, 3)); // 8

// Importing default export
import power from './math.mjs';
console.log(power(2, 3)); // 8

// Importing both default and named
import power, { add, PI } from './math.mjs';

// Importing with alias
import { add as addition, subtract as subtraction } from './math.mjs';
console.log(addition(10, 5)); // 15

// Import everything as namespace
import * as math from './math.mjs';
console.log(math.add(2, 3)); // 5
console.log(math.PI); // 3.14159
console.log(math.default(2, 3)); // 8 (default export)

// Dynamic imports (returns a Promise)
const utils = await import('./utils.mjs');
console.log(utils.someFunction());`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'ESM Advanced Features',
      id: 'esm-advanced-features'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Re-exporting
// lib.mjs
export { add, subtract } from './math.mjs';
export { greeting } from './text.mjs';
export { default as User } from './user.mjs';

// Exporting everything from another module
export * from './utils.mjs';

// Dynamic imports
async function loadModule() {
  const module = await import('./heavy-module.mjs');
  return module;
}

// Import with error handling
try {
  const { feature } = await import('./feature.mjs');
  feature();
} catch (error) {
  console.error('Failed to load feature:', error);
}

// Conditional imports (not recommended but possible)
let database;
if (process.env.NODE_ENV === 'production') {
  database = await import('./db-prod.mjs');
} else {
  database = await import('./db-dev.mjs');
}

// Import metadata
import.meta.url; // Current module URL
import.meta.resolve('./file.txt'); // Resolve module path

// Top-level await (in modules)
const data = await fetch('/api/data').then(r => r.json());
export { data };`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'ESM vs CommonJS: Key Differences',
      id: 'esm-vs-cjs-differences'
    },
    {
      type: 'table',
      headers: ['Feature', 'CommonJS', 'ES Modules'],
      rows: [
        ['Synchronous/Async', 'Synchronous', 'Asynchronous'],
        ['Load timing', 'Runtime', 'Parse time (static)'],
        ['Tree-shaking', 'Not supported', 'Supported'],
        ['Module binding', 'Dynamic', 'Static'],
        ['Default behavior', 'Server-side', 'Browser & modern Node.js'],
        ['Circular deps', 'Partially supported', 'Better handling'],
        ['Top-level await', 'Not available', 'Available'],
        ['Import syntax', 'require()', 'import/export']
      ]
    },
    {
      type: 'heading',
      level: 3,
      text: 'Performance and Optimization',
      id: 'performance-and-optimization'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// CommonJS: All exports are evaluated
// math.js
console.log('Loading math module');
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  heavyComputation: () => { /* expensive */ }
};

// app.js
const { add } = require('./math'); // Logs "Loading math module"
// heavyComputation code is still loaded even if unused


// ESM: Tree-shaking removes unused exports
// math.mjs
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function heavyComputation() { /* expensive */ }

// app.mjs
import { add } from './math.mjs';
// With bundlers like webpack/rollup, unused exports are removed


// CommonJS: Synchronous loading can block
// Slow for many modules
const a = require('./a');
const b = require('./b');
const c = require('./c');
// All loaded sequentially


// ESM: Parallel loading
import a from './a.mjs';
import b from './b.mjs';
import c from './c.mjs';
// Can be loaded in parallel`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Interoperability: Using ESM and CJS Together',
      id: 'interoperability'
    },
    {
      type: 'paragraph',
      text: 'Modern Node.js supports both module systems, but they have different characteristics. Using them together requires understanding compatibility rules.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Using CommonJS in Node.js (always works)
const express = require('express');
const { Router } = require('express');

// Using ESM in Node.js
// Add "type": "module" in package.json or use .mjs extension

// ✅ ESM can import CommonJS modules
import fs from 'fs'; // Built-in CJS module
import path from 'path';
import express from 'express'; // CJS npm package

// But named exports won't be available for CJS modules in ESM
import { readFileSync } from 'fs'; // ✅ Works (re-exported by fs)
import { something } from './cjs-file.js'; // ❌ Won't work

// Instead, import default and destructure
import cjsModule from './cjs-file.js';
const { something } = cjsModule;

// ❌ CommonJS cannot directly import ESM
const esModule = require('./esm-file.mjs'); // Error!

// ✅ But can use dynamic import
const esModule = await import('./esm-file.mjs');

// Hybrid approach: Create wrapper
// wrapper.mjs (ESM wrapper for CJS)
import cjsModule from './cjs-file.js';
export const { add, subtract } = cjsModule;
export default cjsModule;

// Then other modules can import the ESM wrapper
import mathUtils from './wrapper.mjs';`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Practical Examples and Best Practices',
      id: 'practical-examples'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Example 1: Organizing a Large Project with ESM',
      id: 'organizing-large-project'
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'src/utils/index.mjs',
      code: `// Re-export organized utilities
export { add, subtract, multiply } from './math.mjs';
export { formatDate, parseDate } from './date.mjs';
export { validateEmail, validatePassword } from './validation.mjs';
export { default as logger } from './logger.mjs';`,
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'src/app.mjs',
      code: `// Import all utilities cleanly
import * as utils from './utils/index.mjs';

const result = utils.add(5, 3);
const formatted = utils.formatDate(new Date());
utils.logger.info('App started');`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Example 2: Configuration Management',
      id: 'configuration-management'
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'config.mjs',
      code: `const env = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    database: 'mongodb://localhost:27017/dev',
    apiUrl: 'http://localhost:3000',
    debug: true
  },
  production: {
    database: process.env.DATABASE_URL,
    apiUrl: 'https://api.example.com',
    debug: false
  }
};

export default configs[env];
export { configs };`,
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'app.mjs',
      code: `import config from './config.mjs';

console.log('Database:', config.database);
console.log('API URL:', config.apiUrl);
console.log('Debug mode:', config.debug);`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Example 3: Plugin System with Dynamic Imports',
      id: 'plugin-system'
    },
    {
      type: 'code',
      language: 'javascript',
      filename: 'plugin-loader.mjs',
      code: `import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadPlugins(pluginDir) {
  const pluginsPath = path.join(__dirname, pluginDir);
  const files = await fs.readdir(pluginsPath);
  
  const plugins = [];
  
  for (const file of files) {
    if (file.endsWith('.mjs')) {
      try {
        const pluginPath = path.join(pluginsPath, file);
        const plugin = await import(\`file://\${pluginPath}\`);
        
        if (plugin.default && plugin.default.name) {
          plugins.push(plugin.default);
          console.log(\`Loaded plugin: \${plugin.default.name}\`);
        }
      } catch (error) {
        console.error(\`Failed to load plugin \${file}:\`, error.message);
      }
    }
  }
  
  return plugins;
}

// Usage
const plugins = await loadPlugins('./plugins');
for (const plugin of plugins) {
  plugin.init();
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Migration Guide: From CommonJS to ESM',
      id: 'migration-guide'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Step 1: Update package.json
// "type": "module" to enable ESM by default
// Or use .mjs file extension for individual files

// Step 2: Replace require() with import
// BEFORE (CommonJS)
const express = require('express');
const { Router } = require('express');

// AFTER (ESM)
import express from 'express';
import { Router } from 'express';


// Step 3: Replace module.exports with export
// BEFORE
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// AFTER
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }


// Step 4: Handle __dirname and __filename
// BEFORE
const path = require('path');
const fileName = __filename;
const dirName = __dirname;

// AFTER
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Step 5: Use dynamic imports for circular dependencies
// Create-a.mjs
export function createA() { return { type: 'A' }; }

// Create-b.mjs
export async function createB() {
  const { createA } = await import('./create-a.mjs');
  return { type: 'B', a: createA() };
}`,
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
      text: 'CommonJS (require/module.exports) is the traditional Node.js module system; ES Modules (import/export) is the modern JavaScript standard. ESM is asynchronous and static, enabling better optimization and tree-shaking. Modern Node.js supports both; use .mjs extension or "type": "module" in package.json for ESM. Dynamic imports with await import() allow asynchronous loading. Prefer ESM for new projects, but understand CommonJS for legacy code and npm packages.'
    }
  ],
  exercises: [
    'Convert a CommonJS module structure to ESM with proper exports and imports',
    'Create a module system with circular dependencies and resolve them using dynamic imports',
    'Build a plugin loader system using dynamic imports that discovers and loads plugins',
    'Implement a configuration management system that exports different configs based on environment',
    'Create wrapper modules to make CommonJS packages work well in ESM projects',
    'Optimize module bundling by identifying unused exports that could be tree-shaken'
  ]
};
