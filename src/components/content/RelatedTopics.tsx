import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRelatedContent } from '@/lib/content';
import type { ContentSummary } from '@/types/content';
import { getPillarConfig } from '@/config/categories';
import { cn } from '@/lib/utils';

interface RelatedTopicsProps {
  contentId: string;
}

export function RelatedTopics({ contentId }: RelatedTopicsProps) {
  const related = getRelatedContent(contentId);
  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="mb-4 text-lg font-semibold">Related Topics</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((entry: ContentSummary) => {
          const pillar = getPillarConfig(entry.pillar);
          return (
            <Link
              key={entry.id}
              to={`/${entry.slug}`}
              className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium group-hover:text-primary">{entry.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className={cn(pillar?.accentClass)}>{pillar?.label}</span> · {entry.readingTime} min
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
