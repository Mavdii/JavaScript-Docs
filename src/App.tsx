import { Suspense, lazy, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
const SearchModal = lazy(() =>
  import('@/components/search/SearchModal').then((module) => ({ default: module.SearchModal }))
);
const Home = lazy(() => import('@/pages/Home'));
const PillarLanding = lazy(() => import('@/pages/PillarLanding'));
const LessonPageView = lazy(() => import('@/pages/learn/LessonPageView'));
const ReferencePageView = lazy(() => import('@/pages/reference/ReferencePageView'));
const RecipePageView = lazy(() => import('@/pages/recipes/RecipePageView'));
const IntegrationPageView = lazy(() => import('@/pages/integrations/IntegrationPageView'));
const ProjectPageView = lazy(() => import('@/pages/projects/ProjectPageView'));
const ExplorePageView = lazy(() => import('@/pages/explore/ExplorePageView'));
const ErrorPageView = lazy(() => import('@/pages/errors/ErrorPageView'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-8">
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-5 w-full rounded bg-muted" />
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-48 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}

const App = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <Navbar onOpenSearch={() => setSearchOpen(true)} />
              {searchOpen ? (
                <Suspense fallback={null}>
                  <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
                </Suspense>
              ) : null}
              <div className="flex-1">
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<Home onOpenSearch={() => setSearchOpen(true)} />} />
                    <Route path="/learn" element={<PillarLanding pillar="learn" />} />
                    <Route path="/learn/:category/:slug" element={<LessonPageView />} />
                    <Route path="/reference" element={<PillarLanding pillar="reference" />} />
                    <Route path="/reference/:category/:slug" element={<ReferencePageView />} />
                    <Route path="/recipes" element={<PillarLanding pillar="recipes" />} />
                    <Route path="/recipes/:slug" element={<RecipePageView />} />
                    <Route path="/integrations" element={<PillarLanding pillar="integrations" />} />
                    <Route path="/integrations/:slug" element={<IntegrationPageView />} />
                    <Route path="/projects" element={<PillarLanding pillar="projects" />} />
                    <Route path="/projects/:slug" element={<ProjectPageView />} />
                    <Route path="/explore" element={<PillarLanding pillar="explore" />} />
                    <Route path="/explore/:slug" element={<ExplorePageView />} />
                    <Route path="/errors" element={<PillarLanding pillar="errors" />} />
                    <Route path="/errors/:slug" element={<ErrorPageView />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
