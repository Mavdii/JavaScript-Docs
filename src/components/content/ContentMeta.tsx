import { Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Difficulty } from '@/types/content';
import { cn } from '@/lib/utils';

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'bg-accent-reference/10 text-accent-reference border-accent-reference/20',
  intermediate: 'bg-accent-learn/10 text-accent-learn border-accent-learn/20',
  advanced: 'bg-accent-recipes/10 text-accent-recipes border-accent-recipes/20',
};

interface ContentMetaProps {
  difficulty: Difficulty;
  readingTime: number;
  tags: string[];
}

export function ContentMeta({ difficulty, readingTime, tags }: ContentMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Badge variant="outline" className={cn('capitalize', difficultyColors[difficulty])}>
        <BookOpen className="mr-1 h-3 w-3" />
        {difficulty}
      </Badge>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        {readingTime} min read
      </span>
      <div className="flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs font-normal">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
