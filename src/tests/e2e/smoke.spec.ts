import { test, expect } from '@playwright/test';

test('home page shows dynamic sections and empty personal states', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/JavaScript Engineering Knowledge Platform \| JSphere/i);
  await expect(page.getByRole('heading', { name: 'Continue Reading' })).toBeVisible();
  await expect(page.getByText('Nothing in progress yet')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recently Viewed' })).toBeVisible();
  await expect(page.getByText('No recent activity')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bookmarks' })).toBeVisible();
  await expect(page.getByText('No saved topics yet')).toBeVisible();
});

test('search modal opens with keyboard shortcut and navigates to a reference result', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Control+K');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  const input = page.getByPlaceholder('Search documentation...');
  await input.fill('replace');
  await dialog.getByText('String replace() / replaceAll()').click();

  await expect(page).toHaveURL(/\/reference\/string\/replace$/);
  await expect(page.getByRole('heading', { name: 'String replace() / replaceAll()' })).toBeVisible();
});

test('reference page updates SEO and exposes bookmark and progress controls', async ({ page }) => {
  await page.goto('/reference/string/replace');

  await expect(page).toHaveTitle(/String replace\(\) \/ replaceAll\(\) \| JSphere/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Replace parts of a string with new text.'
  );
  await expect(page.getByRole('heading', { name: 'String replace() / replaceAll()' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(page.getByText(/Reading progress|Completed/)).toBeVisible();
});

test('recipe page keeps bookmark state after reload', async ({ page }) => {
  await page.goto('/recipes/search-ui');

  const saveButton = page.getByRole('button', { name: 'Save' });
  await expect(saveButton).toBeVisible();
  await saveButton.click();

  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Search UI' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();
});

test('coming-soon navigation items do not trigger route changes', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Integrations' }).click();
  const currentUrl = page.url();

  const pendingItem = page.locator('li').filter({ hasText: 'OpenAI SDK' });
  await expect(pendingItem).toBeVisible();
  await expect(pendingItem.getByText('Coming Soon')).toBeVisible();
  await pendingItem.getByText('OpenAI SDK').click();

  await expect(page).toHaveURL(currentUrl);
});

test('404 page shows recovery actions and suggested content', async ({ page }) => {
  await page.goto('/definitely-not-a-real-page');

  await expect(page).toHaveTitle(/Page Not Found \| JSphere/i);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return Home' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured' })).toBeVisible();
});
