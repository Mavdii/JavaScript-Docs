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
import type { IntegrationContent } from '@/types/content';
import { Badge } from '@/components/ui/badge';
import { Package, Shield } from 'lucide-react';

export default function IntegrationPageView() {
  const { slug } = useParams();
  const fullSlug = `integrations/${slug}`;
  const meta = getContentMetaBySlug(fullSlug);
  const { data: content, isLoading } = useContentEntry<IntegrationContent>(fullSlug, Boolean(meta));
  const progress = useContentPageTracking(fullSlug, Boolean(meta));

  if (!meta) {
    return (
      <>
        <Seo title="Integration Not Found" description="The requested integration guide is not available yet." path={fullSlug} />
        <MissingContentState
          pillar="integrations"
          title="Integration guide not found"
          message="This integration guide is not available yet. Try another service integration."
        />
      </>
    );
  }

  const headings = content ? extractHeadings(content.sections) : [];
  const { prev, next } = getPrevNextNavigation(fullSlug);

  return (
    <DocsLayout pillar="integrations" headings={headings}>
      <Seo title={meta.title} description={meta.description} path={`/${meta.slug}`} />
      <Breadcrumbs items={[{ label: 'Integrations', href: '/integrations' }, { label: meta.title }]} />

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

      {content.requiredLibraries.length > 0 && (
        <div className="mb-8 rounded-lg border bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4 text-accent-learn" />
            Required Libraries
          </h4>
          <div className="flex flex-wrap gap-2">
            {content.requiredLibraries.map((lib) => (
              <Badge key={lib} variant="secondary" className="text-xs">{lib}</Badge>
            ))}
          </div>
        </div>
      )}

      {content.authNotes && (
        <div className="mb-8 rounded-lg border bg-accent-recipes/5 p-4">
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent-recipes" />
            Authentication Notes
          </h4>
          <p className="text-sm text-muted-foreground">{content.authNotes}</p>
        </div>
      )}

      <ContentRenderer blocks={content.sections} />
      <RelatedTopics contentId={content.id} />
      <PrevNextNav prev={prev} next={next} />
        </>
      )}
    </DocsLayout>
  );
}
