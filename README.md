<div align="center">

<img src="public/favicon.svg" alt="JSphere Logo" width="90" height="90" />

<h1>JSphere</h1>

<p><strong>The JavaScript Engineering Knowledge System</strong></p>

<p>A premium, structured knowledge platform built for real-world JavaScript engineers.<br/>
Learn, reference, build, integrate, and debug — all in one place.</p>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

[🌐 Live Site](https://jsphere.dev) &nbsp;·&nbsp; [📚 Content Pillars](#-content-pillars) &nbsp;·&nbsp; [🚀 Getting Started](#-getting-started) &nbsp;·&nbsp; [🐛 Report Bug](#) &nbsp;·&nbsp; [✨ Request Feature](#)

<br/>

> _"Built for builders. Engineered for clarity."_

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Content Pillars](#-content-pillars)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🚀 Overview

**JSphere** is a modern, full-featured JavaScript engineering knowledge platform designed for developers who want more than just documentation. It's a curated ecosystem of:

- 📘 **Structured learning paths** — from beginner fundamentals to advanced patterns
- 📄 **API references** — instantly searchable method signatures with examples
- 🍳 **Production-ready recipes** — real code patterns you can drop into any project
- 🔌 **Integration guides** — connect JavaScript with real-world services
- 🚀 **Project walkthroughs** — build complete apps from scratch
- 🧭 **Discovery tools** — explore libraries, glossaries, and comparisons
- 🐛 **Debugging playbooks** — break down errors and fix them fast

All wrapped in a beautiful, fast, accessible, and fully responsive UI — with dark mode, smart search, bookmarks, and reading progress tracking built in.

Whether you're a beginner learning closures or a senior engineer wiring up OAuth flows, JSphere meets you exactly where you are.

---

## 📚 Content Pillars

JSphere organizes all knowledge into **7 focused pillars**, each designed for a specific engineering need:

| Pillar | Description | Topics Covered |
|--------|-------------|----------------|
| 📘 **Learn** | Structured lessons from basics to advanced | Fundamentals, Async, Advanced Patterns, Browser APIs |
| 📄 **Reference** | Fast, searchable method-level documentation | Array, String & Object methods with signatures & examples |
| 🍳 **Recipes** | Production-ready implementation patterns | Debouncing, Pagination, File Upload, Infinite Scroll & more |
| 🔌 **Integrations** | Guides for external services & APIs | REST APIs, OAuth, Payments, Telegram, YouTube & more |
| 🚀 **Projects** | Full app walkthroughs from idea to code | CRUD App, Chat App, Notes, Analytics Dashboard & more |
| 🧭 **Explore** | Curated directories and discovery tools | Libraries, Tooling, Glossary, Comparisons |
| 🐛 **Errors** | Debugging guides and error breakdowns | Common Errors, API Errors, Async Bugs, DOM Issues |

---

## ✨ Features

### 🔍 Smart Search
- Full-text search with fuzzy matching and token-based relevance ranking
- Weighted scoring across titles, aliases, keywords, tags, and descriptions
- Results intelligently grouped by content type and ordered by relevance
- Keyboard shortcut: `⌘K` / `Ctrl+K` for instant access anywhere

### 📖 Rich Content Renderer
- Block-based content system: paragraphs, headings, code, lists, callouts, and tables
- Syntax-highlighted code blocks with language detection and line-level highlights
- Function signature tables, parameter docs, and return type info for Reference pages
- Prerequisites, learning goals, and practice exercises for Learn pages

### 🗺️ Smart Navigation
- Breadcrumb trails for full context awareness at every level
- Previous / Next navigation to move through pillar content sequentially
- Auto-generated Table of Contents from page headings
- Responsive collapsible sidebar with section grouping

### 👤 Personalization & User Library
- **Bookmarks** — save any piece of content for later
- **Recently Viewed** — instantly revisit your reading history
- **Continue Reading** — resume exactly where you left off
- **Search History** — bring back any past search with one click

### 🎨 Polished Design System
- HSL-based design tokens with unique accent colors per pillar
- Fully responsive layout optimized for mobile, tablet, and desktop
- Dark / Light mode with automatic system preference detection
- Custom typography: **Inter** for UI + **JetBrains Mono / Fira Code** for code

### ⚡ Performance First
- Vite + SWC for sub-second builds and instant Hot Module Replacement
- Route-based code splitting via React Router lazy loading
- Metadata-driven content with auto-generated loaders for lean bundles
- Skeleton loading states for a smooth perceived performance experience

### 🔎 SEO Ready
- Dynamic `<meta>` tags per page via React Helmet Async
- Structured content metadata: difficulty level, reading time, and related topics
- Clean, semantic URL structure: `/{pillar}/{category}/{slug}`

---

## 🛠 Tech Stack

JSphere is built on a modern, production-grade stack chosen for speed, scalability, and developer experience:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [React 18](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org) | UI & type safety |
| **Build Tool** | [Vite 5](https://vitejs.dev) + SWC | Ultra-fast builds & HMR |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling with custom tokens |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) | Accessible, composable primitives |
| **Routing** | [React Router v6](https://reactrouter.com) | Client-side routing with lazy loading |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) | Async state management |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Form handling & schema validation |
| **Code Highlighting** | [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) | Syntax-highlighted code blocks |
| **Charts** | [Recharts](https://recharts.org) | Data visualization |
| **Icons** | [Lucide React](https://lucide.dev) | Consistent icon system |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light mode |
| **Unit Testing** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) | Fast unit & integration tests |
| **E2E Testing** | [Playwright](https://playwright.dev) | End-to-end browser testing |
| **Linting** | [ESLint 9](https://eslint.org) | Code quality enforcement |

---

## 🗂 Project Structure

```
jsphere/
├── public/                      # Static assets (favicon, robots.txt)
├── scripts/
│   └── generate-content.mjs     # Auto-generates content loaders & metadata
├── src/
│   ├── components/
│   │   ├── cards/               # Category & content card components
│   │   ├── code/                # Syntax-highlighted code block
│   │   ├── content/             # Content renderers, callouts, meta, skeletons
│   │   ├── layout/              # DocsLayout — the main page shell
│   │   ├── navigation/          # Navbar, Sidebar, Breadcrumbs, TOC, Prev/Next
│   │   ├── search/              # Search modal with fuzzy matching
│   │   ├── seo/                 # SEO & Open Graph meta tag components
│   │   ├── shared/              # ThemeToggle, NavLink & shared utilities
│   │   └── ui/                  # shadcn/ui component primitives
│   ├── config/
│   │   ├── categories.ts        # Pillar definitions & accent colors
│   │   ├── navigation.ts        # Sidebar navigation tree
│   │   └── site.ts              # Global site metadata
│   ├── content/
│   │   ├── learn/               # Lesson content (fundamentals, async, advanced, browser)
│   │   ├── reference/           # API reference docs (array, string, object)
│   │   ├── recipes/             # Code recipes & production patterns
│   │   ├── integrations/        # External service integration guides
│   │   ├── projects/            # Full project walkthroughs
│   │   ├── explore/             # Libraries, glossary, tooling, comparisons
│   │   ├── errors/              # Debugging guides & error breakdowns
│   │   ├── generated/           # Auto-generated loaders & metadata (do not edit)
│   │   └── registry.ts          # Central content registry
│   ├── features/                # Feature-level page components per pillar
│   ├── hooks/                   # Custom React hooks (search, reading progress, library)
│   ├── lib/                     # Core utilities (content, search, navigation)
│   ├── pages/                   # Route-level page entry points
│   ├── tests/                   # Unit tests (Vitest + Testing Library)
│   ├── types/                   # Shared TypeScript type definitions
│   └── main.tsx                 # Application entry point
├── tests/                       # Playwright E2E test specs
├── vite.config.ts
├── tailwind.config.ts
├── playwright.config.ts
└── vitest.config.ts
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed before you begin:

- [Node.js](https://nodejs.org) **v18 or higher**
- [Bun](https://bun.sh) *(recommended for speed)* **or** npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/jsphere.git
cd jsphere

# 2. Install dependencies
bun install
# or: npm install

# 3. Start the development server
# (content metadata is auto-generated before dev starts)
bun run dev
# or: npm run dev
```

> The app will be running at **[http://localhost:8080](http://localhost:8080)** 🚀

### Manual Content Generation

Content metadata is automatically generated before `dev`, `build`, and `test` commands. To run it manually:

```bash
bun run generate:content
# or: npm run generate:content
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the local dev server on port `8080` with HMR |
| `bun run build` | Build the app for production |
| `bun run build:dev` | Build in development mode (unminified) |
| `bun run preview` | Preview the production build locally |
| `bun run generate:content` | Generate content metadata & dynamic loaders |
| `bun run lint` | Run ESLint across the entire codebase |
| `bun run test` | Run all unit tests with Vitest |
| `bun run test:watch` | Run unit tests in watch mode (great for TDD) |
| `bun run test:e2e` | Run end-to-end tests with Playwright |

> All `bun run` commands can be replaced with `npm run` if you prefer npm.

---

## 🧪 Testing

JSphere has a comprehensive three-layer testing strategy to ensure correctness and reliability.

### Unit & Integration Tests — Vitest

```bash
bun run test
```

Covers:
- ✅ **Content integrity** — validates all content entries are well-formed
- ✅ **Search logic** — fuzzy matching, ranking, and filtering correctness
- ✅ **SEO** — ensures meta tags render correctly per page
- ✅ **User library** — bookmarks, history, and reading state management

### Watch Mode

```bash
bun run test:watch
```

Ideal for active development — tests re-run automatically on every file change.

### End-to-End Tests — Playwright

```bash
bun run test:e2e
```

Smoke tests for critical user journeys:
- App loads and renders correctly
- Navigation between pillars works
- Search modal opens and returns results
- Content pages render without errors

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get involved:

1. **Fork** this repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make** your changes and ensure tests pass:
   ```bash
   bun run test && bun run lint
   ```
4. **Commit** using conventional commit format:
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push** to your branch:
   ```bash
   git push origin feat/your-feature-name
   ```
6. **Open** a Pull Request and describe what you've changed

### Guidelines
- Follow the existing code style (TypeScript, ESLint rules enforced)
- All new content entries must be registered in `src/content/registry.ts`
- Keep components small, focused, and well-typed
- Write tests for any new logic in `src/lib/` or `src/hooks/`

---

## 👨‍💻 Author

Built with passion and precision by **Umar** — a developer who believes that great documentation and clean code are the foundation of great software.

<div align="center">

| Platform | Handle |
|----------|--------|
| 📱 Telegram | [@Winnr0](https://t.me/Winnr0) |
| 📸 Instagram | [@winnr.9](https://instagram.com/winnr.9) |

</div>

---

<div align="center">

**JSphere** — _Engineered for clarity. Built for builders._

<br/>

⭐ **If JSphere helps you, please consider giving it a star — it means a lot!**

<br/>

[![React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Written%20in-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

</div>
