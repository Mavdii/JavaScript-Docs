import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Bookmark, Clock3, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Seo } from '@/components/seo/Seo';
import { getFeaturedContentMeta, getContentMetaBySlug } from '@/lib/content';
import { useUserLibrary } from '@/hooks/use-user-library';

const NotFound = () => {
  const location = useLocation();
  const featured = getFeaturedContentMeta().slice(0, 3);
  const library = useUserLibrary();
  const bookmarked = library.bookmarks
    .map((slug) => getContentMetaBySlug(slug))
    .filter(Boolean)
    .slice(0, 3);
  const recent = library.recentlyViewed
    .map((item) => getContentMetaBySlug(item.slug))
    .filter(Boolean)
    .slice(0, 3);

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-16 lg:px-8">
      <Seo
        title="Page Not Found"
        description="The page you requested does not exist. Explore the JavaScript knowledge base instead."
        path={location.pathname}
      />

      <div className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 shadow-sm lg:p-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">404</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The route <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{location.pathname}</code> is not
            available. Jump back into the published content instead of hitting a dead end.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/learn">
              <Search className="mr-2 h-4 w-4" />
              Browse Learning
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Recently Viewed</h2>
            </div>
            <div className="space-y-3">
              {recent.length > 0 ? (
                recent.map((entry) => (
                  <Link key={entry!.id} to={`/${entry!.slug}`} className="block rounded-lg border p-3 hover:bg-muted/40">
                    <p className="font-medium">{entry!.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{entry!.description}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Your recent pages will show up here after you browse.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="mb-3 flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Bookmarks</h2>
            </div>
            <div className="space-y-3">
              {bookmarked.length > 0 ? (
                bookmarked.map((entry) => (
                  <Link key={entry!.id} to={`/${entry!.slug}`} className="block rounded-lg border p-3 hover:bg-muted/40">
                    <p className="font-medium">{entry!.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{entry!.description}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Saved topics will appear here for quick recovery.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Featured</h2>
            </div>
            <div className="space-y-3">
              {featured.map((entry) => (
                <Link key={entry.id} to={`/${entry.slug}`} className="block rounded-lg border p-3 hover:bg-muted/40">
                  <p className="font-medium">{entry.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
