import type { ExploreContent } from '@/types/content';

export const testingExplore: ExploreContent = {
  id: 'explore-testing',
  title: 'Testing Ecosystem',
  description: 'Explore JavaScript testing frameworks, strategies, and best practices for unit, integration, and end-to-end testing.',
  slug: 'explore/testing',
  pillar: 'explore',
  category: 'tooling',
  tags: ['testing', 'vitest', 'jest', 'playwright', 'testing library'],
  difficulty: 'intermediate',
  contentType: 'library',
  summary: 'Comprehensive guide to the JavaScript testing ecosystem — comparing Vitest, Jest, Testing Library, Playwright, and Cypress. Learn unit/integration/e2e testing pyramid and mocking strategies.',
  relatedTopics: [],
  order: 6,
  updatedAt: '2025-06-01',
  readingTime: 20,
  featured: true,
  keywords: ['testing', 'unit tests', 'integration tests', 'e2e tests', 'mocking'],
  items: [
    {
      name: 'Vitest',
      description: 'Lightning-fast unit test framework with Vite integration',
      url: 'https://vitest.dev',
    },
    {
      name: 'Jest',
      description: 'Popular zero-config testing framework',
      url: 'https://jestjs.io',
    },
    {
      name: 'Testing Library',
      description: 'Testing utilities for DOM and React components',
      url: 'https://testing-library.com',
    },
    {
      name: 'Playwright',
      description: 'Modern cross-browser automation and testing',
      url: 'https://playwright.dev',
    },
    {
      name: 'Cypress',
      description: 'JavaScript E2E testing framework',
      url: 'https://cypress.io',
    },
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'The Testing Pyramid',
      id: 'testing-pyramid',
    },
    {
      type: 'paragraph',
      text: 'The testing pyramid illustrates the ideal distribution of tests. Unit tests form the large base (fast, cheap), integration tests in the middle, and E2E tests at the top (slow, expensive).',
    },
    {
      type: 'table',
      headers: ['Layer', 'Count', 'Speed', 'Cost', 'Tools', 'Focus'],
      rows: [
        ['Unit', '70%', 'Very Fast', 'Low', 'Vitest, Jest', 'Individual functions'],
        ['Integration', '20%', 'Medium', 'Medium', 'Vitest, Jest', 'Component interactions'],
        ['E2E', '10%', 'Slow', 'High', 'Playwright, Cypress', 'Complete user flows'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Unit Testing with Vitest',
      id: 'unit-testing',
    },
    {
      type: 'paragraph',
      text: 'Vitest is a modern unit test framework optimized for speed. It uses Vite\'s transform pipeline and supports ES modules natively.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// math.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { add, multiply, fibonacci } from './math';

describe('Math functions', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-2, 3)).toBe(1);
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(0, 100)).toBe(0);
    });
  });

  describe('fibonacci', () => {
    it('should compute fibonacci sequence', () => {
      expect(fibonacci(5)).toBe(5);
      expect(fibonacci(10)).toBe(55);
    });

    it('should handle edge cases', () => {
      expect(fibonacci(0)).toBe(0);
      expect(fibonacci(1)).toBe(1);
    });
  });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Testing React Components with Testing Library',
      id: 'component-testing',
    },
    {
      type: 'paragraph',
      text: 'Testing Library encourages testing components as users interact with them, not implementation details.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Counter from './Counter';

describe('Counter component', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments count when increment button is clicked', () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });

    fireEvent.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });

  it('decrements count when decrement button is clicked', () => {
    render(<Counter />);
    const decrementBtn = screen.getByRole('button', { name: /decrement/i });

    fireEvent.click(decrementBtn);
    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });

  it('disables reset when count is 0', () => {
    render(<Counter />);
    const resetBtn = screen.getByRole('button', { name: /reset/i });

    expect(resetBtn).toBeDisabled();

    // Click increment to enable reset
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(resetBtn).toBeEnabled();
  });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Mocking & Spying',
      id: 'mocking',
    },
    {
      type: 'paragraph',
      text: 'Mocks allow you to isolate units by replacing external dependencies. Vitest provides vi.mock() and vi.spyOn() for this purpose.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// api.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUser, fetchUserWithCache } from './api';

// Mock the fetch API
global.fetch = vi.fn();

describe('API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUser', () => {
    it('should fetch user data', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@example.com' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const user = await fetchUser(1);

      expect(user).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchUser(1)).rejects.toThrow('Network error');
    });
  });

  describe('fetchUserWithCache', () => {
    it('should cache results and not fetch twice', async () => {
      const mockUser = { id: 1, name: 'Jane' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      // First call
      const user1 = await fetchUserWithCache(1);
      expect(user1).toEqual(mockUser);

      // Second call (should use cache)
      const user2 = await fetchUserWithCache(1);
      expect(user2).toEqual(mockUser);

      // Verify fetch was only called once
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

// Spy on module functions
import * as math from './math';

describe('Spying on functions', () => {
  it('should track function calls', () => {
    const addSpy = vi.spyOn(math, 'add');

    math.add(2, 3);
    math.add(5, 5);

    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenNthCalledWith(1, 2, 3);
    expect(addSpy).toHaveBeenNthCalledWith(2, 5, 5);

    addSpy.mockRestore();
  });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Integration Testing',
      id: 'integration-testing',
    },
    {
      type: 'paragraph',
      text: 'Integration tests verify multiple components work together correctly. Test user interactions across multiple components without mocking them.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// LoginForm.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';
import * as authService from './authService';

vi.mock('./authService');

describe('LoginForm Integration', () => {
  it('should submit form with credentials and show success', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      token: 'auth-token',
      user: { id: 1, email: 'user@example.com' },
    });

    render(<LoginForm onSuccess={() => {}} />);

    // User fills form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Verify loading state
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText(/logged in successfully/i)).toBeInTheDocument();
    });

    // Verify API was called
    expect(authService.login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('should show error on failed login', async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    render(<LoginForm onSuccess={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'E2E Testing with Playwright',
      id: 'e2e-testing',
    },
    {
      type: 'paragraph',
      text: 'Playwright tests run against a real browser and test complete user journeys. Perfect for testing authentication flows, multi-page interactions, and cross-browser compatibility.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should sign up, log in, and access dashboard', async ({ page }) => {
    // Navigate to sign up
    await page.goto('http://localhost:3000/signup');

    // Fill sign up form
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!');

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to login
    await expect(page).toHaveURL('http://localhost:3000/login');

    // Log in
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Login")');

    // Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should persist session across page reloads', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    expect(page.locator('.user-name')).toContainText('User');
  });

  test('should handle logout', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');

    // Click logout
    await page.click('button:has-text("Logout")');

    // Should be on login page
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('should work across multiple browsers', async ({ browserName, page }) => {
    console.log('Testing on', browserName);

    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toBeVisible();

    // Browser-specific assertions
    if (browserName === 'webkit') {
      // Safari-specific checks
    }
  });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Test Organization Best Practices',
      id: 'best-practices',
    },
    {
      type: 'list',
      items: [
        'Group related tests with describe() blocks',
        'Use descriptive test names that explain the behavior',
        'Follow Arrange-Act-Assert pattern',
        'Keep tests focused on one thing',
        'Mock external dependencies (APIs, third-party services)',
        'Use beforeEach/afterEach for setup/cleanup',
        'Test user behavior, not implementation',
        'Avoid testing internal state when possible',
        'Keep E2E tests for critical user flows only',
        'Run unit tests frequently (pre-commit)',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Coverage Goals',
      id: 'coverage',
    },
    {
      type: 'table',
      headers: ['Metric', 'Good Target', 'Notes'],
      rows: [
        ['Statements', '80%+', 'Measure of code execution'],
        ['Branches', '75%+', 'Hard to test all branches'],
        ['Functions', '80%+', 'Most functions should be tested'],
        ['Lines', '80%+', 'Similar to statements'],
      ],
    },
  ],
};
