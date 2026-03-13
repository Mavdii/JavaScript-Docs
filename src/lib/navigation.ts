import {
  sidebarConfig,
  topNavigation,
  type ResolvedNavSection,
  type ResolvedSidebarGroup,
} from '@/config/navigation';
import { getContentMetaByPillar, getContentMetaBySlug, getPrevNextForSlug } from '@/lib/content';
import type { ContentSummary, Pillar } from '@/types/content';

const staticRoutes = new Set([
  '/learn',
  '/reference',
  '/integrations',
  '/recipes',
  '/projects',
  '/explore',
  '/errors',
]);

function resolveEntryFromHref(href: string) {
  return getContentMetaBySlug(href.replace(/^\//, ''));
}

function resolveStatus(href: string) {
  return staticRoutes.has(href) || resolveEntryFromHref(href) ? 'available' : 'coming-soon';
}

export function resolveTopNavigation(): ResolvedNavSection[] {
  return topNavigation.map((section) => ({
    ...section,
    groups: section.groups.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        const entry = resolveEntryFromHref(item.href);
        return {
          ...item,
          status: entry ? 'available' : 'coming-soon',
          entry,
        };
      }),
    })),
  }));
}

export function resolveSidebarGroups(pillar: Pillar): ResolvedSidebarGroup[] {
  return (sidebarConfig[pillar] || []).map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const entry = resolveEntryFromHref(item.href);
      return {
        ...item,
        status: entry ? 'available' : 'coming-soon',
        entry,
      };
    }),
  }));
}

export function getPrevNextNavigation(slug: string) {
  const { prev, next } = getPrevNextForSlug(slug);
  return {
    prev: prev ? { label: prev.title, href: `/${prev.slug}` } : undefined,
    next: next ? { label: next.title, href: `/${next.slug}` } : undefined,
  };
}

export function getSuggestedContentForPillar(pillar: Pillar, limit = 3): ContentSummary[] {
  return getContentMetaByPillar(pillar).slice(0, limit);
}

export function isContentRouteAvailable(href: string) {
  return resolveStatus(href) === 'available';
}
