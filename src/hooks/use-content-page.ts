import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadContentBySlug } from '@/lib/content';
import { recordRecentView } from '@/lib/user-library';
import { useReadingProgress } from '@/hooks/use-reading-progress';

export function useContentEntry<T>(slug: string, enabled = true) {
  return useQuery({
    queryKey: ['content-entry', slug],
    queryFn: async () => {
      try {
        const content = await loadContentBySlug(slug);
        return content as T | undefined;
      } catch (error) {
        console.error(`Failed to load content for slug: ${slug}`, error);
        throw new Error(`Failed to load content: ${slug}`);
      }
    },
    enabled: enabled && Boolean(slug),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useContentPageTracking(slug: string, enabled = true) {
  const progress = useReadingProgress(slug, enabled);

  useEffect(() => {
    if (!enabled) return;
    recordRecentView(slug);
  }, [enabled, slug]);

  return progress;
}
