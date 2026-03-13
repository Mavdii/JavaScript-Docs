import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bug,
  ChefHat,
  Code2,
  Compass,
  FileCode,
  Plug,
  Rocket,
  Search,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pillarConfig, getPillarConfig } from '@/config/categories';
import {
  getAllContentMeta,
  getContentCountsByPillar,
  getContentMetaBySlug,
  getFeaturedContentMeta,
} from '@/lib/content';
import { Seo } from '@/components/seo/Seo';
import { useUserLibrary } from '@/hooks/use-user-library';
import { cn } from '@/lib/utils';
import type { ContentSummary } from '@/types/content';

const iconMap: Record<string, ElementType> = {
  BookOpen,
  FileCode,
  Plug,
  ChefHat,
  Rocket,
  Compass,
  Bug,
};

interface HomeProps {
  onOpenSearch: () => void;
}

function ContentCard({ entry }: { entry: ContentSummary }) {
  const pillar = getPillarConfig(entry.pillar);
  const Icon = iconMap[pillar?.icon ?? 'BookOpen'] || BookOpen;

  return (
    <Link
      to={`/${entry.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={cn('h-1 w-full', pillar?.accentBgClass?.replace('/10', ''))}
        style={{ background: `hsl(var(--accent-${entry.pillar}))` }}
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
              pillar?.accentClass
            )}
          >
            <Icon className="h-3 w-3" />
            {pillar?.label}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
            {entry.difficulty}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-primary">
          {entry.title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{entry.description}</p>

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>{entry.readingTime} min read</span>
          <ArrowRight className="h-4 w-4 text-primary transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function EmptyLibraryState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
      <Button variant="outline" asChild className="mt-4 rounded-full">
        <Link to={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

function PersonalizedSection({
  title,
  description,
  entries,
  emptyState,
}: {
  title: string;
  description: string;
  entries: ContentSummary[];
  emptyState: {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
  };
}) {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      </div>

      {entries.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <ContentCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <EmptyLibraryState {...emptyState} />
      )}
    </section>
  );
}

export default function Home({ onOpenSearch }: HomeProps) {
  const featured = getFeaturedContentMeta();
  const allContent = getAllContentMeta();
  const counts = getContentCountsByPillar();
  const library = useUserLibrary();

  const bookmarks = library.bookmarks
    .map((slug) => getContentMetaBySlug(slug))
    .filter((entry): entry is ContentSummary => Boolean(entry))
    .slice(0, 6);

  const recentlyViewed = library.recentlyViewed
    .map((view) => ({
      entry: getContentMetaBySlug(view.slug),
      viewedAt: view.viewedAt,
    }))
    .filter((item): item is { entry: ContentSummary; viewedAt: string } => Boolean(item.entry))
    .sort((a, b) => b.viewedAt.localeCompare(a.viewedAt))
    .map((item) => item.entry)
    .slice(0, 6);

  const continueReading = Object.entries(library.progressBySlug)
    .map(([slug, progress]) => ({
      entry: getContentMetaBySlug(slug),
      progress,
    }))
    .filter(
      (item): item is { entry: ContentSummary; progress: NonNullable<typeof item.progress> } =>
        Boolean(item.entry) && item.progress.percent > 0 && !item.progress.completed
    )
    .sort((a, b) => b.progress.updatedAt.localeCompare(a.progress.updatedAt))
    .map((item) => item.entry)
    .slice(0, 6);

  return (
    <div className="flex flex-col">
      <Seo title="JavaScript Engineering Knowledge Platform" description="Learn, reference, integrate, and build with JavaScript through a single structured knowledge system." />

      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-accent-learn/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-accent-recipes/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-reference/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-screen-2xl px-4 py-24 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent-learn" />
              Open JavaScript Knowledge Platform
            </div>

            <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              The JavaScript{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-accent-learn via-blue-400 to-accent-recipes bg-clip-text text-transparent">
                  Engineering
                </span>
              </span>
              <br />
              Knowledge System
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Learn, reference, integrate, and build with JavaScript. A premium documentation
              platform designed for real-world developers who ship.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="w-full gap-2 rounded-full px-8 shadow-lg shadow-primary/20 sm:w-auto" asChild>
                <Link to="/learn">
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 rounded-full px-8 sm:w-auto"
                onClick={onOpenSearch}
              >
                <Search className="h-4 w-4" />
                Search docs...
                <kbd className="ml-2 hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
                  ⌘K
                </kbd>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 text-center">
            {[
              { icon: BookOpen, value: String(counts.learn), label: 'Lessons' },
              { icon: Code2, value: String(counts.recipes), label: 'Recipes' },
              { icon: Zap, value: String(allContent.length), label: 'Total Topics' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="mb-1 h-5 w-5 text-muted-foreground" />
                <span className="text-3xl font-extrabold tracking-tight">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore the Platform</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Seven knowledge pillars, covering everything you need to build with JavaScript.
          </p>
        </div>

        <div className="auto-rows-fr grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillarConfig.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] || BookOpen;
            const isWide = index === 0 || index === 1;
            const count = counts[pillar.key];

            return (
              <Link
                key={pillar.key}
                to={pillar.href}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-xl',
                  isWide && 'lg:col-span-2'
                )}
              >
                <div
                  className={cn(
                    'absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-60',
                    pillar.accentBgClass
                  )}
                />

                <div className={cn('mb-4 flex h-11 w-11 items-center justify-center rounded-xl', pillar.accentBgClass)}>
                  <Icon className={cn('h-5 w-5', pillar.accentClass)} />
                </div>

                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">{pillar.label}</h3>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {count} topics
                  </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>

                <div className={cn('mt-5 flex items-center gap-1.5 text-sm font-semibold', pillar.accentClass)}>
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <PersonalizedSection
        title="Continue Reading"
        description="Pick up where you left off with topics already in progress."
        entries={continueReading}
        emptyState={{
          title: 'Nothing in progress yet',
          description: 'Start reading any lesson, reference, or recipe and it will appear here with progress.',
          actionLabel: 'Browse lessons',
          actionHref: '/learn',
        }}
      />

      <PersonalizedSection
        title="Recently Viewed"
        description="Quick access to the content you opened most recently."
        entries={recentlyViewed}
        emptyState={{
          title: 'No recent activity',
          description: 'Open a few topics and your recent history will show up here for quick return.',
          actionLabel: 'Explore reference',
          actionHref: '/reference',
        }}
      />

      <PersonalizedSection
        title="Bookmarks"
        description="Saved topics stay here so you can build your own learning queue."
        entries={bookmarks}
        emptyState={{
          title: 'No saved topics yet',
          description: 'Use the Save button inside any content page to build a personal reading list.',
          actionLabel: 'See recipes',
          actionHref: '/recipes',
        }}
      />

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-screen-2xl px-4 py-20 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Content</h2>
              <p className="mt-2 text-lg text-muted-foreground">Hand-picked topics to get you started.</p>
            </div>
            <Button variant="outline" asChild className="shrink-0 rounded-full">
              <Link to="/learn">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((entry) => (
              <ContentCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Path</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Different entry points based on what you need right now.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              title: 'Start Learning',
              desc: 'From variables to advanced patterns — follow a structured path built for real developers.',
              href: '/learn',
              accentClass: 'text-accent-learn',
              accentBg: 'bg-accent-learn/10',
              icon: BookOpen,
              cta: 'Begin the journey',
            },
            {
              title: 'Find a Method',
              desc: 'Search array, string, and object methods instantly with syntax, examples, and browser support.',
              href: '/reference',
              accentClass: 'text-accent-reference',
              accentBg: 'bg-accent-reference/10',
              icon: FileCode,
              cta: 'Browse reference',
            },
            {
              title: 'Solve a Pattern',
              desc: 'Debouncing, pagination, form validation — production-ready recipes you can copy and ship.',
              href: '/recipes',
              accentClass: 'text-accent-recipes',
              accentBg: 'bg-accent-recipes/10',
              icon: ChefHat,
              cta: 'See recipes',
            },
          ].map((path) => (
            <Link
              key={path.title}
              to={path.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={cn('mb-5 flex h-12 w-12 items-center justify-center rounded-xl', path.accentBg)}>
                <path.icon className={cn('h-6 w-6', path.accentClass)} />
              </div>

              <h3 className={cn('mb-3 text-xl font-bold', path.accentClass)}>{path.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{path.desc}</p>

              <div className={cn('mt-6 flex items-center gap-1.5 text-sm font-semibold', path.accentClass)}>
                {path.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-screen-2xl px-4 py-16 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border bg-card px-8 py-14 text-center shadow-sm">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-accent-learn/10 blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-accent-recipes/10 blur-[80px]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
                <Users className="h-3.5 w-3.5" />
                Built for JavaScript developers
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to level up your JavaScript?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
                Dive into structured lessons, quick references, and real-world projects — all in one place.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20" asChild>
                  <Link to="/learn">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8" onClick={onOpenSearch}>
                  <Search className="mr-2 h-4 w-4" /> Search the docs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
