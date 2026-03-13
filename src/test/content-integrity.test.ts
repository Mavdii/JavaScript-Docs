import { describe, expect, it } from 'vitest';
import { contentSummaries } from '@/content/generated/metadata';
import { loadContentBySlug } from '@/lib/content';
import { getPrevNextNavigation, resolveSidebarGroups, resolveTopNavigation } from '@/lib/navigation';

describe('content integrity', () => {
  it('keeps pillar and content type values inside the allowed sets', () => {
    const allowedPillars = new Set(['learn', 'reference', 'integrations', 'recipes', 'projects', 'explore', 'errors']);
    const allowedTypes = new Set([
      'lesson',
      'reference',
      'recipe',
      'integration',
      'project',
      'error-guide',
      'library',
      'glossary',
      'comparison',
    ]);

    for (const entry of contentSummaries) {
      expect(allowedPillars.has(entry.pillar)).toBe(true);
      expect(allowedTypes.has(entry.contentType)).toBe(true);
    }
  });

  it('keeps ids and slugs unique', () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const entry of contentSummaries) {
      expect(ids.has(entry.id)).toBe(false);
      expect(slugs.has(entry.slug)).toBe(false);
      ids.add(entry.id);
      slugs.add(entry.slug);
    }
  });

  it('only references existing related topics', () => {
    const ids = new Set(contentSummaries.map((entry) => entry.id));

    for (const entry of contentSummaries) {
      for (const relatedId of entry.relatedTopics) {
        expect(ids.has(relatedId)).toBe(true);
      }
    }
  });

  it('loads full content that matches generated metadata', async () => {
    for (const meta of contentSummaries) {
      const entry = await loadContentBySlug(meta.slug);
      expect(entry).toBeDefined();
      expect(entry?.id).toBe(meta.id);
      expect(entry?.slug).toBe(meta.slug);
      expect(entry?.contentType).toBe(meta.contentType);
    }
  });

  it('keeps every code block as a non-empty string', async () => {
    for (const meta of contentSummaries) {
      const entry = await loadContentBySlug(meta.slug);
      expect(entry).toBeDefined();
      const sections = entry?.sections ?? [];
      const codeBlocks = sections.filter((block) => block.type === 'code');

      for (const block of codeBlocks) {
        expect(typeof block.code).toBe('string');
        expect(block.code.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('marks available navigation items correctly', () => {
    const availableRoutes = new Set(contentSummaries.map((entry) => `/${entry.slug}`));

    for (const section of resolveTopNavigation()) {
      for (const group of section.groups) {
        for (const item of group.items) {
          if (availableRoutes.has(item.href)) {
            expect(item.status).toBe('available');
          }
        }
      }
    }

    for (const pillar of ['learn', 'reference', 'integrations', 'recipes', 'projects', 'explore', 'errors'] as const) {
      for (const group of resolveSidebarGroups(pillar)) {
        for (const item of group.items) {
          if (availableRoutes.has(item.href)) {
            expect(item.status).toBe('available');
          }
        }
      }
    }
  });

  it('only points prev/next navigation at existing content', () => {
    const availableRoutes = new Set(contentSummaries.map((entry) => `/${entry.slug}`));

    for (const entry of contentSummaries) {
      const { prev, next } = getPrevNextNavigation(entry.slug);
      if (prev) expect(availableRoutes.has(prev.href)).toBe(true);
      if (next) expect(availableRoutes.has(next.href)).toBe(true);
    }
  });
});
