import { describe, expect, it } from 'vitest';
import { groupResultsByType, searchEntries } from '@/lib/search';
import type { ContentSummary } from '@/types/content';

function createEntry(overrides: Partial<ContentSummary>): ContentSummary {
  return {
    id: 'id',
    title: 'Title',
    description: 'Description',
    slug: 'learn/test',
    pillar: 'learn',
    category: 'fundamentals',
    tags: [],
    difficulty: 'beginner',
    contentType: 'lesson',
    summary: 'Summary',
    relatedTopics: [],
    order: 1,
    updatedAt: '2025-01-01',
    readingTime: 5,
    featured: false,
    keywords: [],
    aliases: [],
    ...overrides,
  };
}

describe('search ranking', () => {
  it('prefers exact title matches over keyword matches', () => {
    const entries = [
      createEntry({ id: '1', title: 'Replace', slug: 'reference/string/replace' }),
      createEntry({ id: '2', title: 'String Patterns', slug: 'reference/string/patterns', keywords: ['replace'] }),
    ];

    const results = searchEntries(entries, 'replace');
    expect(results[0]?.entry.id).toBe('1');
  });

  it('uses aliases as searchable signals', () => {
    const entries = [
      createEntry({ id: '1', title: 'replace', slug: 'reference/string/replace', aliases: ['replaceAll'] }),
      createEntry({ id: '2', title: 'split', slug: 'reference/string/split' }),
    ];

    const results = searchEntries(entries, 'replaceall');
    expect(results[0]?.entry.id).toBe('1');
  });

  it('groups results by content type', () => {
    const entries = [
      createEntry({ id: '1', slug: 'reference/string/replace', contentType: 'reference' }),
      createEntry({ id: '2', slug: 'recipes/search-ui', contentType: 'recipe', pillar: 'recipes' }),
    ];

    const grouped = groupResultsByType(searchEntries(entries, 'title'));
    expect(Object.keys(grouped)).toEqual(expect.arrayContaining(['reference', 'recipe']));
  });
});
