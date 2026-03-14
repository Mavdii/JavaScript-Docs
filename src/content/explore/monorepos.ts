import type { ExploreContent } from '@/types/content';

export const monoreposExplore: ExploreContent = {
  id: 'explore-monorepos',
  title: 'Monorepos for JavaScript',
  description: 'Understand how JavaScript monorepos work, when to use them, and which tools help teams scale shared code.',
  slug: 'explore/monorepos',
  pillar: 'explore',
  category: 'directories',
  tags: ['monorepo', 'turborepo', 'nx', 'workspaces', 'build systems'],
  difficulty: 'intermediate',
  contentType: 'library',
  summary:
    'Learn the practical side of JavaScript monorepos: workspace structure, shared packages, task orchestration, caching, versioning, and the main tool choices.',
  relatedTopics: ['explore-tooling', 'explore-ci-cd'],
  order: 4,
  updatedAt: '2025-06-01',
  readingTime: 18,
  featured: true,
  keywords: ['monorepo', 'workspace', 'turborepo', 'nx', 'shared packages'],
  items: [
    {
      name: 'Turborepo',
      description: 'Fast task orchestration and caching for JavaScript monorepos.',
      url: 'https://turbo.build/repo',
    },
    {
      name: 'Nx',
      description: 'Monorepo tooling with generators, graph insights, and task execution.',
      url: 'https://nx.dev',
    },
    {
      name: 'pnpm Workspaces',
      description: 'Strict dependency management and efficient package linking.',
      url: 'https://pnpm.io/workspaces',
    },
    {
      name: 'Rush',
      description: 'Enterprise-focused monorepo management from Microsoft.',
      url: 'https://rushjs.io',
    },
    {
      name: 'Lerna',
      description: 'Classic package publishing and workspace coordination tooling.',
      url: 'https://lerna.js.org',
    },
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'What a Monorepo Solves',
      id: 'what-it-solves',
    },
    {
      type: 'paragraph',
      text: 'A monorepo keeps multiple apps and shared packages in one repository. This makes it easier to share code, enforce standards, run one CI pipeline, and coordinate changes that affect more than one project.',
    },
    {
      type: 'table',
      headers: ['Problem', 'Separate repos', 'Monorepo'],
      rows: [
        ['Shared UI package updates', 'Requires manual version publishing', 'Change app and package together'],
        ['Consistent tooling', 'Repeated setup per repo', 'One root config for lint/test/build'],
        ['Cross-project refactors', 'Hard to coordinate', 'Single pull request'],
        ['CI visibility', 'Split pipelines and logs', 'Centralized task graph'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Typical Folder Structure',
      id: 'folder-structure',
    },
    {
      type: 'code',
      language: 'text',
      code: `repo/
  apps/
    web/
    docs/
    admin/
  packages/
    ui/
    config/
    utils/
    api-client/
  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json`,
    },
    {
      type: 'paragraph',
      text: 'A common split is apps in one folder and reusable packages in another. Shared TypeScript config, ESLint config, and design tokens usually live in packages so every app imports the same source of truth.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Workspaces and Local Packages',
      id: 'workspaces',
    },
    {
      type: 'code',
      language: 'yaml',
      code: `# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"`,
    },
    {
      type: 'code',
      language: 'json',
      code: `{
  "name": "@acme/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}`,
    },
    {
      type: 'paragraph',
      text: 'Workspace-aware package managers wire local packages together automatically. Instead of publishing every internal package, your apps consume them directly from the repo during development.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Task Running and Caching',
      id: 'task-running',
    },
    {
      type: 'code',
      language: 'json',
      code: `{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}`,
    },
    {
      type: 'paragraph',
      text: 'Tools like Turborepo and Nx understand dependency graphs. If only one shared package changes, they can rebuild and retest only the affected apps instead of rerunning the whole workspace.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'When a Monorepo Is Worth It',
      id: 'when-to-use',
    },
    {
      type: 'list',
      items: [
        'You maintain more than one app that shares UI, utilities, or API clients.',
        'Your team wants one standard for linting, testing, TypeScript, and release automation.',
        'You often refactor code that spans apps and internal packages.',
        'Your CI costs are growing and affected-task execution would save time.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Common Failure Modes',
      id: 'failure-modes',
    },
    {
      type: 'code',
      language: 'text',
      code: `1. Turning everything into a shared package too early.
2. Weak ownership: nobody knows which team owns which package.
3. Hidden dependency leaks between apps and packages.
4. Slow CI because caching and task boundaries are not configured.
5. Publishing internal packages when workspaces alone would be enough.`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Monorepo Does Not Mean Better by Default',
      text: 'A monorepo helps when projects truly share code and release concerns. If your apps are unrelated, the extra tooling and coordination can become overhead rather than a benefit.',
    },
  ],
};
