import type { ExploreContent } from '@/types/content';

export const toolingExplore: ExploreContent = {
  id: 'explore-tooling',
  title: 'Developer Tooling',
  description: 'Essential developer tools for JavaScript development.',
  slug: 'explore/tooling',
  pillar: 'explore',
  category: 'directories',
  tags: ['tooling', 'build tools', 'linting', 'testing'],
  difficulty: 'beginner',
  contentType: 'library',
  summary: 'Master the JavaScript developer toolchain — build tools, linters, formatters, testing frameworks, package managers, and development environments.',
  relatedTopics: ['explore-libraries'],
  order: 3,
  updatedAt: '2025-06-01',
  readingTime: 18,
  featured: false,
  keywords: ['developer tools', 'build tools', 'Vite', 'ESLint'],
  sections: [
    { type: 'heading', level: 2, text: 'Build Tools', id: 'build-tools' },
    { type: 'paragraph', text: 'Modern build tools that bundle, transform, and optimize JavaScript code. The ecosystem has shifted from slow Webpack configs to fast, zero-config tools powered by native languages (Go, Rust).' },
    { type: 'table', headers: ['Tool', 'Language', 'HMR Speed', 'Config Complexity', 'Best For'], rows: [
      ['Vite', 'Go (esbuild) + Rust (Rollup)', '< 50ms', 'Minimal', 'Most projects (recommended)'],
      ['esbuild', 'Go', 'N/A (bundler)', 'Low', 'Library bundling, scripts'],
      ['Webpack', 'JavaScript', '200-2000ms', 'High', 'Legacy/complex setups'],
      ['Turbopack', 'Rust', '< 30ms', 'Minimal', 'Next.js projects'],
      ['Rollup', 'JavaScript', 'N/A', 'Medium', 'Library publishing'],
      ['Parcel', 'Rust', '< 100ms', 'Zero config', 'Quick prototyping'],
    ]},
    { type: 'code', language: 'javascript', code: `// vite.config.ts — typical React setup
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    sourcemap: true,
  },
});` },

    { type: 'heading', level: 2, text: 'Package Managers', id: 'package-managers' },
    { type: 'table', headers: ['Manager', 'Speed', 'Disk Usage', 'Monorepo Support', 'Key Feature'], rows: [
      ['npm', 'Moderate', 'High (flat node_modules)', 'Workspaces', 'Universal default'],
      ['pnpm', 'Fast', 'Low (content-addressable)', 'Excellent', 'Hard links, strict isolation'],
      ['Yarn Berry', 'Fast', 'Lowest (PnP)', 'Excellent', 'Plug\'n\'Play, zero-installs'],
      ['Bun', 'Fastest', 'Moderate', 'Basic', 'All-in-one runtime + PM'],
    ]},
    { type: 'code', language: 'bash', code: `# pnpm — recommended for most projects
pnpm add react react-dom          # install dependencies
pnpm add -D typescript @types/react  # dev dependencies
pnpm dlx create-vite my-app       # run package without installing

# Bun — blazing fast alternative
bun add react react-dom
bun run dev                        # runs scripts from package.json
bunx --bun vite                    # like npx but faster` },

    { type: 'heading', level: 2, text: 'Code Quality', id: 'code-quality' },
    { type: 'paragraph', text: 'Tools for maintaining consistent, high-quality code across teams. Linters catch bugs, formatters enforce style, and type checkers prevent entire categories of errors.' },
    { type: 'code', language: 'javascript', code: `// eslint.config.js — Flat config (ESLint v9+)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
);

// .prettierrc — Opinionated formatter config
// {
//   "semi": true,
//   "singleQuote": true,
//   "tabWidth": 2,
//   "trailingComma": "all",
//   "printWidth": 100
// }` },

    { type: 'callout', variant: 'tip', title: 'ESLint + Prettier', text: 'Use eslint-config-prettier to disable ESLint rules that conflict with Prettier. Let ESLint handle logic errors and Prettier handle formatting — never mix concerns.' },

    { type: 'heading', level: 2, text: 'TypeScript', id: 'typescript' },
    { type: 'paragraph', text: 'TypeScript adds static type checking to JavaScript, catching errors at compile time rather than runtime. It\'s become the industry standard for professional JavaScript development.' },
    { type: 'code', language: 'typescript', code: `// tsconfig.json — recommended strict config
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,                    // enables all strict checks
    "noUncheckedIndexedAccess": true,   // array[0] is T | undefined
    "exactOptionalPropertyTypes": true, // distinguish undefined from missing
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}

// Key TypeScript patterns
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function safeParse<T>(json: string): Result<T> {
  try {
    return { ok: true, data: JSON.parse(json) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// Discriminated unions — the most powerful TS pattern
type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload }; // payload is User
    case 'LOGOUT': return { ...state, user: null };
    case 'SET_ERROR': return { ...state, error: action.payload }; // payload is string
  }
}` },

    { type: 'heading', level: 2, text: 'Testing Frameworks', id: 'testing' },
    { type: 'paragraph', text: 'Testing tools for different levels: unit tests (individual functions), integration tests (component interactions), and end-to-end tests (full user flows).' },
    { type: 'table', headers: ['Tool', 'Level', 'Speed', 'Best For'], rows: [
      ['Vitest', 'Unit/Integration', 'Fastest', 'Vite projects, modern setup'],
      ['Jest', 'Unit/Integration', 'Fast', 'Mature ecosystem, mocking'],
      ['Playwright', 'E2E', 'Moderate', 'Cross-browser, reliable'],
      ['Cypress', 'E2E + Component', 'Moderate', 'Visual debugging, DX'],
      ['Testing Library', 'Component', 'Fast', 'User-centric DOM testing'],
    ]},
    { type: 'code', language: 'typescript', code: `// Vitest — fast, Vite-native testing
import { describe, it, expect, vi } from 'vitest';

describe('calculateTotal', () => {
  it('applies discount correctly', () => {
    expect(calculateTotal(100, 0.1)).toBe(90);
  });

  it('handles edge cases', () => {
    expect(calculateTotal(0, 0.5)).toBe(0);
    expect(calculateTotal(100, 0)).toBe(100);
    expect(calculateTotal(100, 1)).toBe(0);
  });

  it('mocks API calls', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ data: [1, 2, 3] });
    const result = await fetchData(fetchSpy);
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(result).toEqual([1, 2, 3]);
  });
});

// Playwright — E2E testing
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('#email', 'user@example.com');
  await page.click('button:has-text("Pay Now")');
  await expect(page.locator('.success')).toBeVisible();
});` },

    { type: 'heading', level: 2, text: 'Git Hooks & CI/CD', id: 'git-ci' },
    { type: 'paragraph', text: 'Automate code quality checks before commits and in CI pipelines to catch issues early.' },
    { type: 'code', language: 'json', code: `// package.json — lint-staged + husky setup
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "ci": "pnpm lint && pnpm typecheck && pnpm test"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}` },
    { type: 'callout', variant: 'warning', title: 'CI Pipeline Order', text: 'Run checks from fastest to slowest: lint → typecheck → unit tests → build → E2E tests. This gives the fastest feedback on failures.' },

    { type: 'heading', level: 2, text: 'Browser DevTools', id: 'devtools' },
    { type: 'paragraph', text: 'Built-in browser tools that every developer should master. Beyond console.log, DevTools offers powerful debugging, profiling, and network inspection capabilities.' },
    { type: 'code', language: 'javascript', code: `// Console power tools
console.table(users);                    // tabular display
console.group('API Call');               // collapsible group
console.time('fetch'); /* ... */ console.timeEnd('fetch'); // timing
console.assert(x > 0, 'x must be positive');  // conditional log
console.trace('Call stack here');         // stack trace

// Useful DevTools shortcuts
// Ctrl+Shift+P → Command menu (like VS Code)
// $0 → last inspected element in Console
// $_ → result of last console expression
// copy(obj) → copy object to clipboard as JSON
// monitor(fn) → log every call to a function
// monitorEvents(el, 'click') → log events on an element

// Performance: identify slow code
console.profile('MyOperation');
expensiveOperation();
console.profileEnd('MyOperation');` },
  ],
  items: [
    { name: 'Vite', description: 'Next-generation frontend build tool with instant HMR', url: 'https://vitejs.dev' },
    { name: 'esbuild', description: 'Extremely fast JavaScript/TypeScript bundler written in Go', url: 'https://esbuild.github.io' },
    { name: 'ESLint', description: 'Pluggable linting utility for JavaScript and TypeScript', url: 'https://eslint.org' },
    { name: 'Prettier', description: 'Opinionated code formatter', url: 'https://prettier.io' },
    { name: 'TypeScript', description: 'Typed superset of JavaScript that compiles to plain JavaScript', url: 'https://www.typescriptlang.org' },
    { name: 'Vitest', description: 'Vite-native unit testing framework', url: 'https://vitest.dev' },
    { name: 'Playwright', description: 'End-to-end testing for modern web apps', url: 'https://playwright.dev' },
    { name: 'pnpm', description: 'Fast, disk-efficient package manager with strict isolation', url: 'https://pnpm.io' },
    { name: 'Husky', description: 'Git hooks made easy for pre-commit quality checks', url: 'https://typicode.github.io/husky' },
    { name: 'lint-staged', description: 'Run linters on staged files only for fast pre-commit checks', url: 'https://github.com/lint-staged/lint-staged' },
  ],
};
