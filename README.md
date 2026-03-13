<div align="center">

<img src="public/favicon.svg" alt="JSphere Logo" width="80" height="80" />

# JSphere

### The JavaScript Engineering Knowledge System

**A premium, structured knowledge platform built for real-world JavaScript engineers.**  
Learn, reference, build, and debug — all in one place.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🌐 Live Site](https://jsphere.dev) · [📚 Documentation](#-content-pillars) · [🐛 Report Bug](#) · [✨ Request Feature](#)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Content Pillars](#-content-pillars)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🚀 Overview

**JSphere** is a modern, full-featured JavaScript engineering knowledge platform designed for developers who want more than just documentation. It's a curated ecosystem of structured learning paths, API references, real-world recipes, integration guides, and debugging resources — all wrapped in a beautiful, fast, and accessible UI.

Whether you're a beginner learning closures or a senior engineer wiring up OAuth flows, JSphere has the depth and breadth to meet you where you are.

> _"Built for builders. Engineered for clarity."_

---

## 📚 Content Pillars

JSphere organizes all knowledge into **7 focused pillars**, each designed for a specific engineering need:

| Pillar | Purpose |
|---|---|
| 📘 **Learn** | Structured lessons on fundamentals, advanced patterns, async, browser APIs |
| 📄 **Reference** | Searchable, signature-level docs for JS array, string & object methods |
| 🍳 **Recipes** | Production-ready code patterns — debouncing, pagination, file upload, and more |
| 🔌 **Integrations** | Step-by-step guides for REST APIs, OAuth, payments, Telegram, YouTube & more |
| 🚀 **Projects** | Full project walkthroughs — build real apps from scratch |
| 🧭 **Explore** | Curated libraries, tooling directories, glossaries, and comparisons |
| 🐛 **Errors** | Debugging guides, error breakdowns, and troubleshooting playbooks |

---

## 🛠 Tech Stack

JSphere is built on a modern, production-grade stack:

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org) |
| **Build Tool** | [Vite 5](https://vitejs.dev) with SWC for ultra-fast builds |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) with custom design tokens |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) built on [Radix UI](https://www.radix-ui.com) primitives |
| **Routing** | [React Router v6](https://reactrouter.com) |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) validation |
| **Code Highlighting** | [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) |
| **Charts** | [Recharts](https://recharts.org) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) (dark/light mode) |
| **Unit Testing** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| **E2E Testing** | [Playwright](https://playwright.dev) |
| **Linting** | [ESLint 9](https://eslint.org) |

---

## ✨ Features

### 🔍 Smart Search
- Full-text search with fuzzy matching and token-based ranking
- Weighted scoring across titles, aliases, keywords, tags, and descriptions
- Results grouped by content type and ordered by relevance
- Keyboard shortcut: `⌘K` / `Ctrl+K`

### 📖 Rich Content System
- Block-based content renderer supporting paragraphs, headings, code, lists, callouts, and tables
- Syntax-highlighted code blocks with language detection and line-level highlights
- Function signature tables, parameter docs, and return type info (for Reference pages)
- Prerequisites, learning goals, and practice exercises (for Learn pages)

### 🗺️ Smart Navigation
- Breadcrumb trails for full context awareness
- Previous / Next navigation within pillars
- Auto-generated Table of Contents from page headings
- Responsive sidebar with collapsible sections

### 👤 Personalization
- **Bookmarks** — save content for later
- **Recently Viewed** — quick access to your history
- **Continue Reading** — resume content with progress tracking
- **Search History** — revisit past searches instantly

### 🎨 Design System
- HSL-based design tokens with per-pillar accent colors
- Fully responsive layout for mobile, tablet, and desktop
- Dark / Light mode with system preference detection
- Custom fonts: **Inter** (UI) + **JetBrains Mono / Fira Code** (code)

### ⚡ Performance
- Vite + SWC for sub-second builds and instant HMR
- Code-splitting via React Router lazy loading
- Metadata-driven content with generated loaders for optimal bundle size
- Skeleton loading states for perceived performance

### 🔎 SEO Ready
- Dynamic `<meta>` tags via React Helmet
- Structured content metadata (difficulty, reading time, topics)
- Clean, descriptive URL structure: `/[pillar]/[category]/[slug]`

---

## 🗂 Project Structure

```
jsphere/
├── public/                  # Static assets
├── scripts/                 # Code generation scripts
│   └── generate-content.mjs
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── cards/           # Category & content cards
│   │   ├── code/            # Code block with syntax highlighting
│   │   ├── content/         # Content renderers, callouts, meta
│   │   ├── layout/          # Page layout (DocsLayout)
│   │   ├── navigation/      # Sidebar, Navbar, Breadcrumbs, TOC
│   │   ├── search/          # Search modal
│   │   ├── seo/             # SEO & meta tag components
│   │   ├── shared/          # Shared utilities (ThemeToggle, etc.)
│   │   └── ui/              # shadcn/ui primitives
│   ├── config/              # Site, navigation & category config
│   ├── content/             # All knowledge content
│   │   ├── learn/           # Lessons (fundamentals, async, advanced, browser)
│   │   ├── reference/       # API references (array, string, object)
│   │   ├── recipes/         # Code recipes & patterns
│   │   ├── integrations/    # External service guides
│   │   ├── projects/        # Project walkthroughs
│   │   ├── explore/         # Libraries, glossary, tooling
│   │   ├── errors/          # Debugging & error guides
│   │   ├── generated/       # Auto-generated content loaders & metadata
│   │   └── registry.ts      # Central content registry
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Core utilities (search, content, navigation)
│   ├── pages/               # Route-level page components
│   ├── test/                # Unit & integration tests
│   ├── types/               # TypeScript type definitions
│   └── main.tsx             # App entry point
├── tests/                   # Playwright E2E tests
├── vite.config.ts
├── tailwind.config.ts
├── playwright.config.ts
└── vitest.config.ts
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org) `>= 18.x`
- [Bun](https://bun.sh) *(recommended)* or npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/jsphere.git
cd jsphere

# 2. Install dependencies
bun install
# or
npm install

# 3. Generate content metadata
bun run generate:content
# or
npm run generate:content

# 4. Start the development server
bun run dev
# or
npm run dev
```

The app will be running at **[http://localhost:8080](http://localhost:8080)** 🚀

---

## 📜 Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start local dev server on port `8080` |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in dev mode |
| `bun run preview` | Preview the production build locally |
| `bun run generate:content` | Generate content metadata & loaders |
| `bun run lint` | Run ESLint across the codebase |
| `bun run test` | Run unit tests with Vitest |
| `bun run test:watch` | Run unit tests in watch mode |
| `bun run test:e2e` | Run end-to-end tests with Playwright |

---

## 🧪 Testing

JSphere has a robust testing setup with three layers:

### Unit & Integration Tests (Vitest)
```bash
bun run test
```
Covers content integrity, search logic, SEO, and user library state.

### Watch Mode
```bash
bun run test:watch
```
Ideal for active development with live test feedback.

### End-to-End Tests (Playwright)
```bash
bun run test:e2e
```
Smoke tests for critical user journeys across the entire app.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feat/your-feature-name`
5. **Open** a Pull Request

Please make sure your changes pass all tests and follow the existing code style before submitting.

---

## 👨‍💻 Author

Built with passion by **Umar** — a developer who believes great documentation and clean code are the foundation of great software.

<div align="center">

| Platform | Link |
|---|---|
| 📱 Telegram | [@Winnr0](https://t.me/Winnr0) |
| 📸 Instagram | [@winnr.9](https://instagram.com/winnr.9) |

</div>

---

<div align="center">

**JSphere** — _Engineered for clarity. Built for builders._

⭐ If you find this project useful, please consider giving it a star!

</div>
