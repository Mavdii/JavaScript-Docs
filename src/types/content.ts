export type Pillar = 'learn' | 'reference' | 'integrations' | 'recipes' | 'projects' | 'explore' | 'errors';

export type ContentType =
  | 'lesson'
  | 'reference'
  | 'recipe'
  | 'integration'
  | 'project'
  | 'error-guide'
  | 'library'
  | 'glossary'
  | 'comparison';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type CalloutVariant = 'info' | 'warning' | 'tip' | 'danger';

// ─── Content Blocks ──────────────────────────────────────────────

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3 | 4; text: string; id: string }
  | { type: 'code'; language: string; code: string; filename?: string; highlights?: number[] }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'callout'; variant: CalloutVariant; title?: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

// ─── Base Metadata ───────────────────────────────────────────────

export interface ContentMeta {
  id: string;
  title: string;
  description: string;
  slug: string;
  pillar: Pillar;
  category: string;
  subcategory?: string;
  tags: string[];
  difficulty: Difficulty;
  contentType: ContentType;
  summary: string;
  relatedTopics: string[];
  order: number;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  keywords: string[];
  aliases?: string[];
}

export interface ContentSummary {
  id: string;
  title: string;
  description: string;
  slug: string;
  pillar: Pillar;
  category: string;
  subcategory?: string;
  tags: string[];
  difficulty: Difficulty;
  contentType: ContentType;
  summary: string;
  relatedTopics: string[];
  order: number;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  keywords: string[];
  aliases: string[];
}

// ─── Content Type: Lesson ────────────────────────────────────────

export interface LessonContent extends ContentMeta {
  contentType: 'lesson';
  prerequisites: string[];
  learningGoals: string[];
  sections: ContentBlock[];
  exercises: string[];
}

// ─── Content Type: Reference ─────────────────────────────────────

export interface ReferenceContent extends ContentMeta {
  contentType: 'reference';
  signature: string;
  parameters: { name: string; type: string; description: string; optional?: boolean }[];
  returnValue: { type: string; description: string };
  sections: ContentBlock[];
  compatibility: string;
}

// ─── Content Type: Recipe ────────────────────────────────────────

export interface RecipeContent extends ContentMeta {
  contentType: 'recipe';
  problem: string;
  sections: ContentBlock[];
  pitfalls: string[];
  variations: string[];
}

// ─── Content Type: Integration ───────────────────────────────────

export interface IntegrationContent extends ContentMeta {
  contentType: 'integration';
  requiredLibraries: string[];
  setupSteps: string[];
  authNotes: string;
  sections: ContentBlock[];
}

// ─── Content Type: Project ───────────────────────────────────────

export interface ProjectContent extends ContentMeta {
  contentType: 'project';
  techStack: string[];
  learningGoals: string[];
  features: string[];
  sections: ContentBlock[];
}

// ─── Content Type: Error Guide ───────────────────────────────────

export interface ErrorGuideContent extends ContentMeta {
  contentType: 'error-guide';
  errorType: string;
  solutions: string[];
  sections: ContentBlock[];
}

// ─── Content Type: Explore ───────────────────────────────────────

export interface ExploreContent extends ContentMeta {
  contentType: 'library' | 'glossary' | 'comparison';
  sections: ContentBlock[];
  items: { name: string; description: string; url?: string }[];
}

// ─── Union Type ──────────────────────────────────────────────────

export type ContentEntry = LessonContent | ReferenceContent | RecipeContent | IntegrationContent | ProjectContent | ErrorGuideContent | ExploreContent;

// ─── Heading Info (for TOC) ──────────────────────────────────────

export interface HeadingInfo {
  id: string;
  text: string;
  level: number;
}

export interface ContentProgress {
  percent: number;
  completed: boolean;
  updatedAt: string;
}

export interface RecentView {
  slug: string;
  viewedAt: string;
}

export interface UserLibraryState {
  bookmarks: string[];
  recentlyViewed: RecentView[];
  recentSearches: string[];
  progressBySlug: Record<string, ContentProgress>;
}
