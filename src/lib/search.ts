import { contentSummaries } from '@/content/generated/metadata';
import type { ContentSummary } from '@/types/content';

export interface SearchResult {
  entry: ContentSummary;
  score: number;
}

const typeOrder: Record<ContentSummary['contentType'], number> = {
  lesson: 1,
  reference: 2,
  recipe: 3,
  integration: 4,
  project: 5,
  'error-guide': 6,
  library: 7,
  glossary: 8,
  comparison: 9,
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s/-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(value: string) {
  return normalize(value).split(' ').filter(Boolean);
}

function fuzzySubsequenceScore(query: string, target: string) {
  if (!query || !target) return 0;
  let qIndex = 0;
  let lastMatch = -1;
  let score = 0;

  for (let i = 0; i < target.length && qIndex < query.length; i += 1) {
    if (target[i] === query[qIndex]) {
      score += lastMatch === i - 1 ? 4 : 2;
      lastMatch = i;
      qIndex += 1;
    }
  }

  if (qIndex !== query.length) return 0;
  return Math.max(0, score - Math.max(0, target.length - query.length));
}

function scoreText(query: string, value: string, exactWeight: number, prefixWeight: number, includeWeight: number) {
  const normalizedValue = normalize(value);
  if (!normalizedValue) return 0;
  if (normalizedValue === query) return exactWeight;
  if (normalizedValue.startsWith(query)) return prefixWeight;
  if (normalizedValue.includes(query)) return includeWeight;
  return 0;
}

function scoreTokens(queryTokens: string[], tokens: string[], weight: number) {
  if (queryTokens.length === 0 || tokens.length === 0) return 0;
  const matches = queryTokens.filter((token) => tokens.some((target) => target.startsWith(token))).length;
  return matches === queryTokens.length ? weight + matches * 10 : matches * 10;
}

function scoreEntry(query: string, queryTokens: string[], entry: ContentSummary) {
  const titleScore = scoreText(query, entry.title, 1200, 950, 760);
  const aliasScore = Math.max(0, ...entry.aliases.map((alias) => scoreText(query, alias, 900, 720, 560)));
  const summaryScore = scoreText(query, entry.summary, 0, 0, 180);
  const descriptionScore = scoreText(query, entry.description, 0, 0, 220);
  const keywordScore = Math.max(0, ...entry.keywords.map((keyword) => scoreText(query, keyword, 520, 420, 320)));
  const tagScore = Math.max(0, ...entry.tags.map((tag) => scoreText(query, tag, 480, 380, 260)));
  const categoryScore = scoreText(query, entry.category, 220, 180, 140) + scoreText(query, entry.pillar, 180, 160, 120);
  const titleTokenScore = scoreTokens(queryTokens, tokenize(entry.title), 260);
  const aliasTokenScore = Math.max(0, ...entry.aliases.map((alias) => scoreTokens(queryTokens, tokenize(alias), 220)));

  const fuzzyTarget = normalize([entry.title, entry.summary, ...entry.aliases].join(' '));
  const fuzzyScore = fuzzySubsequenceScore(query, fuzzyTarget);

  return (
    titleScore +
    aliasScore +
    summaryScore +
    descriptionScore +
    keywordScore +
    tagScore +
    categoryScore +
    titleTokenScore +
    aliasTokenScore +
    fuzzyScore
  );
}

export function searchEntries(entries: ContentSummary[], query: string): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const queryTokens = tokenize(normalizedQuery);

  return entries
    .map((entry) => ({
      entry,
      score: scoreEntry(normalizedQuery, queryTokens, entry),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (typeOrder[a.entry.contentType] !== typeOrder[b.entry.contentType]) {
        return typeOrder[a.entry.contentType] - typeOrder[b.entry.contentType];
        }
      return a.entry.title.localeCompare(b.entry.title);
    });
}

export function searchContent(query: string): SearchResult[] {
  return searchEntries(contentSummaries, query);
}

export function getSearchSuggestions(): ContentSummary[] {
  return contentSummaries.filter((entry) => entry.featured).slice(0, 6);
}

export function groupResultsByType(results: SearchResult[]) {
  return results.reduce<Record<string, SearchResult[]>>((groups, result) => {
    const key = result.entry.contentType;
    if (!groups[key]) groups[key] = [];
    groups[key].push(result);
    return groups;
  }, {});
}
