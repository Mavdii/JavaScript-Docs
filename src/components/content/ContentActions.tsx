import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toggleBookmark } from '@/lib/user-library';
import { useUserLibrary } from '@/hooks/use-user-library';

interface ContentActionsProps {
  slug: string;
  progress: number;
  completed: boolean;
}

export function ContentActions({ slug, progress, completed }: ContentActionsProps) {
  const library = useUserLibrary();
  const bookmarked = library.bookmarks.includes(slug);

  return (
    <div className="mb-8 rounded-xl border bg-muted/30 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{completed ? 'Completed' : 'Reading progress'}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Button
          type="button"
          variant={bookmarked ? 'default' : 'outline'}
          className="shrink-0 gap-2"
          onClick={() => toggleBookmark(slug)}
        >
          <Bookmark className="h-4 w-4" />
          {bookmarked ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
