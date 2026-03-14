import type { ContentProgress, RecentView, UserLibraryState } from '@/types/content';

const STORAGE_KEY = 'jsphere-user-library';
const CHANGE_EVENT = 'jsphere:user-library-change';
const MAX_RECENT_SEARCHES = 8;
const MAX_RECENTLY_VIEWED = 12;

const defaultState: UserLibraryState = {
  bookmarks: [],
  recentlyViewed: [],
  recentSearches: [],
  progressBySlug: {},
};

let cachedRawState: string | null = null;
let cachedState: UserLibraryState = defaultState;

function isBrowser() {
  return typeof window !== 'undefined';
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Sanitizes user input to prevent XSS attacks.
 * Removes HTML tags and limits length.
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .slice(0, 100)
    .trim();
}

function sanitizeProgress(value: unknown): ContentProgress | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as ContentProgress;
  const percent = clampPercent(Number(candidate.percent ?? 0));
  return {
    percent,
    completed: Boolean(candidate.completed || percent >= 90),
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString(),
  };
}

function sanitizeRecentViews(value: unknown): RecentView[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: RecentView[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const slug = typeof item.slug === 'string' ? item.slug : '';
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    result.push({
      slug,
      viewedAt: typeof item.viewedAt === 'string' ? item.viewedAt : new Date().toISOString(),
    });
  }

  return result.slice(0, MAX_RECENTLY_VIEWED);
}

function sanitizeState(value: unknown): UserLibraryState {
  if (!value || typeof value !== 'object') return defaultState;
  const candidate = value as Partial<UserLibraryState>;
  const progressBySlug = Object.fromEntries(
    Object.entries(candidate.progressBySlug ?? {}).flatMap(([slug, progress]) => {
      const sanitized = sanitizeProgress(progress);
      return sanitized ? [[slug, sanitized]] : [];
    })
  );

  return {
    bookmarks: Array.isArray(candidate.bookmarks)
      ? [...new Set(candidate.bookmarks.filter((item): item is string => typeof item === 'string'))]
      : [],
    recentlyViewed: sanitizeRecentViews(candidate.recentlyViewed),
    recentSearches: Array.isArray(candidate.recentSearches)
      ? [...new Set(candidate.recentSearches.filter((item): item is string => typeof item === 'string'))].slice(
          0,
          MAX_RECENT_SEARCHES
        )
      : [],
    progressBySlug,
  };
}

function emitChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function updateCache(raw: string | null, state: UserLibraryState) {
  cachedRawState = raw;
  cachedState = state;
  return cachedState;
}

export function getUserLibraryState(): UserLibraryState {
  if (!isBrowser()) return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRawState) return cachedState;
    if (!raw) return updateCache(null, defaultState);
    return updateCache(raw, sanitizeState(JSON.parse(raw)));
  } catch {
    return updateCache(null, defaultState);
  }
}

function writeUserLibraryState(updater: (state: UserLibraryState) => UserLibraryState) {
  if (!isBrowser()) return defaultState;
  const nextState = sanitizeState(updater(getUserLibraryState()));
  const serialized = JSON.stringify(nextState);
  window.localStorage.setItem(STORAGE_KEY, serialized);
  updateCache(serialized, nextState);
  emitChange();
  return nextState;
}

export function subscribeToUserLibrary(onChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const handler = () => onChange();
  window.addEventListener('storage', handler);
  window.addEventListener(CHANGE_EVENT, handler);

  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(CHANGE_EVENT, handler);
  };
}

export function toggleBookmark(slug: string) {
  return writeUserLibraryState((state) => {
    const bookmarked = state.bookmarks.includes(slug);
    return {
      ...state,
      bookmarks: bookmarked
        ? state.bookmarks.filter((item) => item !== slug)
        : [slug, ...state.bookmarks.filter((item) => item !== slug)],
    };
  });
}

export function recordRecentView(slug: string) {
  return writeUserLibraryState((state) => ({
    ...state,
    recentlyViewed: [{ slug, viewedAt: new Date().toISOString() }, ...state.recentlyViewed.filter((item) => item.slug !== slug)].slice(
      0,
      MAX_RECENTLY_VIEWED
    ),
  }));
}

export function addRecentSearch(query: string) {
  const normalized = sanitizeInput(query);
  if (!normalized) return getUserLibraryState();
  return writeUserLibraryState((state) => ({
    ...state,
    recentSearches: [normalized, ...state.recentSearches.filter((item) => item !== normalized)].slice(
      0,
      MAX_RECENT_SEARCHES
    ),
  }));
}

export function setContentProgress(slug: string, percent: number) {
  const nextProgress = sanitizeProgress({
    percent,
    completed: percent >= 90,
    updatedAt: new Date().toISOString(),
  });

  if (!nextProgress) return getUserLibraryState();

  return writeUserLibraryState((state) => {
    const current = state.progressBySlug[slug];
    if (current && current.percent >= nextProgress.percent) {
      return {
        ...state,
        progressBySlug: {
          ...state.progressBySlug,
          [slug]: {
            ...current,
            completed: current.completed || nextProgress.completed,
          },
        },
      };
    }

    return {
      ...state,
      progressBySlug: {
        ...state.progressBySlug,
        [slug]: nextProgress,
      },
    };
  });
}

export function getBookmarkStatus(slug: string) {
  return getUserLibraryState().bookmarks.includes(slug);
}

export function getProgressForSlug(slug: string) {
  return getUserLibraryState().progressBySlug[slug];
}
