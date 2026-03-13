import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserLibrary } from '@/hooks/use-user-library';
import { getContentMetaBySlug } from '@/lib/content';
import { getSuggestedContentForPillar } from '@/lib/navigation';
import type { Pillar } from '@/types/content';

interface MissingContentStateProps {
  pillar: Pillar;
  title: string;
  message: string;
}

export function MissingContentState({ pillar, title, message }: MissingContentStateProps) {
  const suggestions = getSuggestedContentForPillar(pillar, 3);
  const library = useUserLibrary();
  const recent = library.recentlyViewed
    .map((item) => getContentMetaBySlug(item.slug))
    .filter((entry) => Boolean(entry))
    .slice(0, 3);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Compass className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-muted-foreground">{message}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to={`/${pillar}`}>
              <Search className="mr-2 h-4 w-4" />
              Explore {pillar}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-8 border-t pt-6 text-left">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested content
            </h2>
            <div className="grid gap-3">
              {suggestions.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/${entry.slug}`}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/40"
                >
                  <p className="font-medium">{entry.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div className="mt-8 border-t pt-6 text-left">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recently viewed
            </h2>
            <div className="grid gap-3">
              {recent.map((entry) => (
                <Link
                  key={entry!.id}
                  to={`/${entry!.slug}`}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/40"
                >
                  <p className="font-medium">{entry!.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{entry!.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
