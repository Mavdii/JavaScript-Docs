import { useEffect, useState } from 'react';
import { setContentProgress } from '@/lib/user-library';
import { useUserLibrary } from '@/hooks/use-user-library';

function calculateProgress() {
  const scrollTop = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;
  return Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));
}

export function useReadingProgress(slug: string, enabled = true) {
  const library = useUserLibrary();
  const storedProgress = library.progressBySlug[slug];
  const [progress, setProgress] = useState(storedProgress?.percent ?? 0);

  useEffect(() => {
    setProgress(storedProgress?.percent ?? 0);
  }, [storedProgress?.percent]);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const update = () => {
      const next = calculateProgress();
      setProgress((current) => (next > current ? next : current));
      setContentProgress(slug, next);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled, slug]);

  return storedProgress ?? {
    percent: Math.round(progress),
    completed: progress >= 90,
    updatedAt: new Date().toISOString(),
  };
}
