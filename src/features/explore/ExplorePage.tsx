import { useParams } from 'react-router-dom';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { ContentActions } from '@/components/content/ContentActions';
import { ContentPageSkeleton } from '@/components/content/ContentPageSkeleton';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { ContentMeta } from '@/components/content/ContentMeta';
import { MissingContentState } from '@/components/content/MissingContentState';
import { RelatedTopics } from '@/components/content/RelatedTopics';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PrevNextNav } from '@/components/navigation/PrevNextNav';
import { Seo } from '@/components/seo/Seo';
import { extractHeadings, getContentMetaBySlug } from '@/lib/content';
import { getPrevNextNavigation } from '@/lib/navigation';
import { useContentEntry, useContentPageTracking } from '@/hooks/use-content-page';
import type { ExploreContent } from '@/types/content';

export default function ExplorePageView() {
  const { slug } = useParams();
  const fullSlug = `explore/${slug}`;
  const meta = getContentMetaBySlug(fullSlug);
  const { data: content, isLoading } = useContentEntry<ExploreContent>(fullSlug, Boolean(meta));
  const progress = useContentPageTracking(fullSlug, Boolean(meta));

  if (!meta) {
    return (
      <>
        <Seo title="Explore Page Not Found" description="The requested explore page is not available yet." path={fullSlug} />
        <MissingContentState
          pillar="explore"
          title="Explore page not found"
          message="This explore page is not available yet. Try another discovery topic."
        />
      </>
    );
  }

  const headings = content ? extractHeadings(content.sections) : [];
  const { prev, next } = getPrevNextNavigation(fullSlug);

  return (
    <DocsLayout pillar="explore" headings={headings}>
      <Seo title={meta.title} description={meta.description} path={`/${meta.slug}`} />
      <Breadcrumbs items={[{ label: 'Explore', href: '/explore' }, { label: meta.title }]} />

      {isLoading || !content ? (
        <ContentPageSkeleton />
      ) : (
        <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{content.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{content.summary}</p>
        <div className="mt-4">
          <ContentMeta difficulty={content.difficulty} readingTime={content.readingTime} tags={content.tags} />
        </div>
      </div>

      <ContentActions slug={content.slug} progress={progress.percent} completed={progress.completed} />

      <ContentRenderer blocks={content.sections} />

      {content.items.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-semibold">Directory</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.items.map((item) => (
              <div key={item.name} className="rounded-lg border bg-card p-4">
                <h4 className="font-medium">{item.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTopics contentId={content.id} />
      <PrevNextNav prev={prev} next={next} />
        </>
      )}
    </DocsLayout>
  );
}
