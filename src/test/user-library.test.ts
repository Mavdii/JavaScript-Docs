import { describe, expect, it } from 'vitest';
import {
  addRecentSearch,
  getProgressForSlug,
  getUserLibraryState,
  setContentProgress,
  toggleBookmark,
} from '@/lib/user-library';

describe('user library storage', () => {
  it('toggles bookmarks on and off', () => {
    toggleBookmark('learn/fundamentals/variables');
    expect(getUserLibraryState().bookmarks).toContain('learn/fundamentals/variables');

    toggleBookmark('learn/fundamentals/variables');
    expect(getUserLibraryState().bookmarks).not.toContain('learn/fundamentals/variables');
  });

  it('deduplicates recent searches and keeps latest first', () => {
    addRecentSearch('replace');
    addRecentSearch('pagination');
    addRecentSearch('replace');

    expect(getUserLibraryState().recentSearches).toEqual(['replace', 'pagination']);
  });

  it('keeps the highest reading progress', () => {
    setContentProgress('recipes/search-ui', 25);
    setContentProgress('recipes/search-ui', 10);
    setContentProgress('recipes/search-ui', 95);

    expect(getProgressForSlug('recipes/search-ui')?.percent).toBe(95);
    expect(getProgressForSlug('recipes/search-ui')?.completed).toBe(true);
  });

  it('falls back safely when storage is invalid', () => {
    window.localStorage.setItem('jsphere-user-library', '{bad json');
    expect(getUserLibraryState()).toEqual({
      bookmarks: [],
      recentlyViewed: [],
      recentSearches: [],
      progressBySlug: {},
    });
  });
});
