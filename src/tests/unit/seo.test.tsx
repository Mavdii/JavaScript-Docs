import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import { Seo } from '@/components/seo/Seo';

describe('Seo', () => {
  it('updates title and meta tags', async () => {
    render(
      <HelmetProvider>
        <Seo title="Search UI" description="Search docs quickly." path="/recipes/search-ui" />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toContain('Search UI');
    });

    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Search docs quickly.');
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toContain('/recipes/search-ui');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toContain('/recipes/search-ui');
  });
});
