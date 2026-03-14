import type { ExploreContent } from '@/types/content';

export const ciCdExplore: ExploreContent = {
  id: 'explore-ci-cd',
  title: 'CI/CD for JavaScript',
  description: 'Learn continuous integration and deployment strategies for JavaScript applications using GitHub Actions and other platforms.',
  slug: 'explore/ci-cd',
  pillar: 'explore',
  category: 'tooling',
  tags: ['ci/cd', 'github actions', 'automation', 'deployment', 'testing'],
  difficulty: 'intermediate',
  contentType: 'library',
  summary: 'Complete guide to CI/CD pipelines for JavaScript — GitHub Actions workflows, automated testing, build automation, deployment strategies, and environment management.',
  relatedTopics: [],
  order: 7,
  updatedAt: '2025-06-01',
  readingTime: 18,
  featured: true,
  keywords: ['CI/CD', 'GitHub Actions', 'deployment', 'automation', 'testing pipeline'],
  items: [
    {
      name: 'GitHub Actions',
      description: 'Native CI/CD platform for GitHub repositories',
      url: 'https://github.com/features/actions',
    },
    {
      name: 'GitLab CI',
      description: 'GitLab\'s integrated CI/CD platform',
      url: 'https://docs.gitlab.com/ee/ci/',
    },
    {
      name: 'CircleCI',
      description: 'Cloud-based CI/CD service',
      url: 'https://circleci.com',
    },
    {
      name: 'Jenkins',
      description: 'Open-source automation server',
      url: 'https://www.jenkins.io',
    },
    {
      name: 'Vercel',
      description: 'Deploy platform optimized for Next.js',
      url: 'https://vercel.com',
    },
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'GitHub Actions Fundamentals',
      id: 'github-actions',
    },
    {
      type: 'paragraph',
      text: 'GitHub Actions allows you to automate tasks directly in your GitHub repository. Workflows run on events like push, pull request, or schedule.',
    },
    {
      type: 'code',
      language: 'yaml',
      code: `# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Build & Deployment Workflow',
      id: 'build-deploy',
    },
    {
      type: 'paragraph',
      text: 'Automate building your application and deploying to production. This example builds on success and deploys to a server.',
    },
    {
      type: 'code',
      language: 'yaml',
      code: `# .github/workflows/deploy.yml
name: Build & Deploy

on:
  push:
    branches: [main]
  workflow_run:
    workflows: ["Tests"]
    types: [completed]
    branches: [main]

env:
  REGISTRY: ghcr.io

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          REACT_APP_API_URL: \${{ secrets.PRODUCTION_API_URL }}

      - name: Generate artifact
        run: |
          zip -r app.zip dist/
          du -h app.zip

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: build-artifact
          path: dist/
          retention-days: 5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: success()

    steps:
      - uses: actions/checkout@v4

      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: build-artifact
          path: dist/

      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USER }}
          key: \${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/app
            rm -rf dist/
            mkdir -p dist/
            echo "Ready for artifact upload"

      - name: Upload files
        uses: appleboy/scp-action@master
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USER }}
          key: \${{ secrets.SERVER_SSH_KEY }}
          source: "dist/*"
          target: "/var/www/app/"

      - name: Restart service
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USER }}
          key: \${{ secrets.SERVER_SSH_KEY }}
          script: |
            sudo systemctl restart myapp
            sudo systemctl status myapp

      - name: Notify deployment
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          text: "Deployment \${{ job.status }}"
          webhook_url: \${{ secrets.SLACK_WEBHOOK }}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Pull Request Checks',
      id: 'pr-checks',
    },
    {
      type: 'paragraph',
      text: 'Require status checks on pull requests to ensure quality gates are met before merging.',
    },
    {
      type: 'code',
      language: 'yaml',
      code: `# .github/workflows/pr-checks.yml
name: PR Checks

on:
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check code style
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Type check
        run: npm run type-check

      - name: Run tests
        run: npm test -- --coverage

      - name: Check bundle size
        run: npm run analyze:bundle

      - name: Comment PR
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const summary = fs.readFileSync('test-summary.txt', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: \`## Test Results\n\n\${summary}\`,
            });`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Environment Management',
      id: 'environment-management',
    },
    {
      type: 'paragraph',
      text: 'Use GitHub Secrets and Environments to manage different configurations for staging and production.',
    },
    {
      type: 'code',
      language: 'yaml',
      code: `# .github/workflows/multi-env.yml
name: Build & Deploy

on:
  push:
    branches: [main, staging]

env:
  REGISTRY: ghcr.io

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    environment:
      name: \${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      url: \${{ github.ref == 'refs/heads/main' && 'https://app.example.com' || 'https://staging.example.com' }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: \${{ github.ref == 'refs/heads/main' && 'production' || 'development' }}
          REACT_APP_API_URL: \${{ secrets.API_URL }}
          REACT_APP_ANALYTICS_KEY: \${{ secrets.ANALYTICS_KEY }}

      - name: Deploy to \${{ github.ref == 'refs/heads/main' && 'Production' || 'Staging' }}
        run: |
          echo "Deploying to \${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}"
          # Deploy script here

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          TEST_URL: \${{ github.ref == 'refs/heads/main' && 'https://app.example.com' || 'https://staging.example.com' }}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Scheduled Tasks & Maintenance',
      id: 'scheduled-tasks',
    },
    {
      type: 'paragraph',
      text: 'Use cron schedules to run automated tasks like dependency updates, security audits, and performance tests.',
    },
    {
      type: 'code',
      language: 'yaml',
      code: `# .github/workflows/scheduled.yml
name: Scheduled Tasks

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  security-audit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x

      - name: Audit dependencies
        run: npm audit --audit-level=moderate

      - name: Check for outdated packages
        run: npm outdated

  performance-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run performance tests
        run: npm run test:performance

      - name: Compare with baseline
        run: npm run perf:compare

      - name: Alert if degradation
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: \${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Performance degradation detected!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Performance Alert*\\nPerformance metrics have degraded. Check the run."
                  }
                }
              ]
            }`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Deployment Strategies',
      id: 'deployment-strategies',
    },
    {
      type: 'table',
      headers: ['Strategy', 'Risk', 'Rollback', 'Best For'],
      rows: [
        ['Blue-Green', 'Low', 'Instant', 'Critical services'],
        ['Canary', 'Low', 'Fast', 'General deployments'],
        ['Rolling', 'Medium', 'Slow', 'Stateless services'],
        ['Shadow', 'Very Low', 'N/A', 'Testing changes'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'GitHub Secrets Best Practices',
      id: 'secrets',
    },
    {
      type: 'list',
      items: [
        'Never commit secrets to version control',
        'Rotate secrets regularly',
        'Use environment-specific secrets',
        'Limit secret access to required workflows',
        'Use OIDC tokens instead of secrets when possible',
        'Audit secret access logs',
        'Revoke compromised secrets immediately',
      ],
    },
  ],
};
