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
import type { ErrorGuideContent } from '@/types/content';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ErrorPageView() {
  const { slug } = useParams();
  const fullSlug = `errors/${slug}`;
  const meta = getContentMetaBySlug(fullSlug);
  const { data: content, isLoading } = useContentEntry<ErrorGuideContent>(fullSlug, Boolean(meta));
  const progress = useContentPageTracking(fullSlug, Boolean(meta));

  if (!meta) {
    return (
      <>
        <Seo title="Error Guide Not Found" description="The requested error guide is not available yet." path={fullSlug} />
        <MissingContentState
          pillar="errors"
          title="Error guide not found"
          message="This troubleshooting guide is not available yet. Try another debugging topic."
        />
      </>
    );
  }

  const headings = content ? extractHeadings(content.sections) : [];
  const { prev, next } = getPrevNextNavigation(fullSlug);

  return (
    <DocsLayout pillar="errors" headings={headings}>
      <Seo title={meta.title} description={meta.description} path={`/${meta.slug}`} />
      <Breadcrumbs items={[{ label: 'Errors', href: '/errors' }, { label: meta.title }]} />

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

      {content.errorType && (
        <div className="mb-8 rounded-lg border bg-destructive/5 p-4">
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Error Type
          </h4>
          <Badge variant="outline" className="text-xs">{content.errorType}</Badge>
        </div>
      )}

      <ContentRenderer blocks={content.sections} />

      {content.solutions.length > 0 && (
        <div className="mt-8 rounded-lg border bg-accent-reference/5 p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent-reference" />
            Solutions Summary
          </h3>
          <ol className="space-y-2 list-decimal pl-5">
            {content.solutions.map((s, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">{s}</li>
            ))}
          </ol>
        </div>
      )}

      <RelatedTopics contentId={content.id} />
      <PrevNextNav prev={prev} next={next} />
        </>
      )}
    </DocsLayout>
  );
}
