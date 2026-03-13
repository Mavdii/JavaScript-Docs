import { contentSummaries } from '@/content/generated/metadata';
import { contentLoaders } from '@/content/generated/loaders';
import type {
  ContentBlock,
  ContentEntry,
  ContentSummary,
  ContentType,
  HeadingInfo,
  Pillar,
} from '@/types/content';

const summariesBySlug = new Map(contentSummaries.map((entry) => [entry.slug, entry] as const));
const summariesById = new Map(contentSummaries.map((entry) => [entry.id, entry] as const));

function sortContent(entries: ContentSummary[]) {
  return [...entries].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export function getAllContentMeta(): ContentSummary[] {
  return contentSummaries;
}

export function getAllContent(): ContentSummary[] {
  return getAllContentMeta();
}

export function getContentMetaBySlug(slug: string): ContentSummary | undefined {
  return summariesBySlug.get(slug);
}

export function getContentMetaById(id: string): ContentSummary | undefined {
  return summariesById.get(id);
}

export async function loadContentBySlug(slug: string): Promise<ContentEntry | undefined> {
  const loader = contentLoaders[slug];
  if (!loader) return undefined;
  return loader();
}

export function getContentMetaByPillar(pillar: Pillar): ContentSummary[] {
  return sortContent(contentSummaries.filter((entry) => entry.pillar === pillar));
}

export function getContentByPillar(pillar: Pillar): ContentSummary[] {
  return getContentMetaByPillar(pillar);
}

export function getContentMetaByType(type: ContentType): ContentSummary[] {
  return sortContent(contentSummaries.filter((entry) => entry.contentType === type));
}

export function getContentByType(type: ContentType): ContentSummary[] {
  return getContentMetaByType(type);
}

export function getContentMetaByCategory(pillar: Pillar, category: string): ContentSummary[] {
  return sortContent(
    contentSummaries.filter((entry) => entry.pillar === pillar && entry.category === category)
  );
}

export function getContentByCategory(pillar: Pillar, category: string): ContentSummary[] {
  return getContentMetaByCategory(pillar, category);
}

export function getFeaturedContentMeta(): ContentSummary[] {
  return sortContent(contentSummaries.filter((entry) => entry.featured));
}

export function getFeaturedContent(): ContentSummary[] {
  return getFeaturedContentMeta();
}

export function getRelatedContentMeta(contentId: string): ContentSummary[] {
  const entry = summariesById.get(contentId);
  if (!entry) return [];

  return entry.relatedTopics
    .map((relatedId) => summariesById.get(relatedId))
    .filter((related): related is ContentSummary => Boolean(related));
}

export function getRelatedContent(contentId: string): ContentSummary[] {
  return getRelatedContentMeta(contentId);
}

export function getPrevNextForSlug(slug: string) {
  const current = getContentMetaBySlug(slug);
  if (!current) return { prev: undefined, next: undefined };

  const entries = getContentMetaByPillar(current.pillar);
  const index = entries.findIndex((entry) => entry.slug === slug);
  return {
    prev: index > 0 ? entries[index - 1] : undefined,
    next: index >= 0 && index < entries.length - 1 ? entries[index + 1] : undefined,
  };
}

export function getContentCountsByPillar() {
  return contentSummaries.reduce<Record<Pillar, number>>(
    (acc, entry) => {
      acc[entry.pillar] += 1;
      return acc;
    },
    {
      learn: 0,
      reference: 0,
      integrations: 0,
      recipes: 0,
      projects: 0,
      explore: 0,
      errors: 0,
    }
  );
}

export function extractHeadings(sections: ContentBlock[]): HeadingInfo[] {
  return sections
    .filter((block): block is Extract<ContentBlock, { type: 'heading' }> => block.type === 'heading')
    .map((heading) => ({ id: heading.id, text: heading.text, level: heading.level }));
}
