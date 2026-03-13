import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadContentBySlug } from '@/lib/content';
import { recordRecentView } from '@/lib/user-library';
import { useReadingProgress } from '@/hooks/use-reading-progress';

export function useContentEntry<T>(slug: string, enabled = true) {
  return useQuery({
    queryKey: ['content-entry', slug],
    queryFn: async () => (await loadContentBySlug(slug)) as T | undefined,
    enabled: enabled && Boolean(slug),
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
