import { useParams } from 'react-router-dom';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { ContentActions } from '@/components/content/ContentActions';
import { ContentMeta } from '@/components/content/ContentMeta';
import { ContentPageSkeleton } from '@/components/content/ContentPageSkeleton';
import { MissingContentState } from '@/components/content/MissingContentState';
import { RelatedTopics } from '@/components/content/RelatedTopics';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PrevNextNav } from '@/components/navigation/PrevNextNav';
import { Seo } from '@/components/seo/Seo';
import { extractHeadings, getContentMetaBySlug } from '@/lib/content';
import { getPrevNextNavigation } from '@/lib/navigation';
import { useContentEntry, useContentPageTracking } from '@/hooks/use-content-page';
import type { ReferenceContent } from '@/types/content';
import { CodeBlock } from '@/components/code/CodeBlock';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export default function ReferencePageView() {
  const { category, slug } = useParams();
  const fullSlug = `reference/${category}/${slug}`;
  const meta = getContentMetaBySlug(fullSlug);
  const { data: content, isLoading } = useContentEntry<ReferenceContent>(fullSlug, Boolean(meta));
  const progress = useContentPageTracking(fullSlug, Boolean(meta));

  if (!meta) {
    return (
      <>
        <Seo title="Reference Not Found" description="The requested reference page is not available yet." path={fullSlug} />
        <MissingContentState
          pillar="reference"
          title="Reference page not found"
          message="This reference entry is not available yet. Try another reference topic."
        />
      </>
    );
  }

  const headings = content
    ? [
    { id: 'signature', text: 'Signature', level: 2 },
    { id: 'parameters', text: 'Parameters', level: 2 },
    { id: 'return-value', text: 'Return Value', level: 2 },
    ...extractHeadings(content.sections),
  ]
    : [];
  const { prev, next } = getPrevNextNavigation(fullSlug);

  return (
    <DocsLayout pillar="reference" headings={headings}>
      <Seo title={meta.title} description={meta.description} path={`/${meta.slug}`} />
      <Breadcrumbs
        items={[
          { label: 'Reference', href: '/reference' },
          { label: meta.category, href: '/reference' },
          { label: meta.title },
        ]}
      />

      {isLoading || !content ? (
        <ContentPageSkeleton />
      ) : (
        <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight font-mono sm:text-4xl">{content.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{content.summary}</p>
        <div className="mt-4">
          <ContentMeta difficulty={content.difficulty} readingTime={content.readingTime} tags={content.tags} />
        </div>
      </div>

      <ContentActions slug={content.slug} progress={progress.percent} completed={progress.completed} />

      {/* Signature */}
      <div id="signature" className="scroll-mt-20">
        <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight">Signature</h2>
        <CodeBlock code={content.signature} language="javascript" />
      </div>

      {/* Parameters */}
      <div id="parameters" className="scroll-mt-20">
        <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight">Parameters</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {content.parameters.map((p) => (
                <tr key={p.name} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{p.name}</code>
                    {p.optional && <Badge variant="secondary" className="ml-2 text-[10px]">optional</Badge>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Value */}
      <div id="return-value" className="scroll-mt-20">
        <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight">Return Value</h2>
        <div className="rounded-lg border bg-muted/30 p-4 flex items-start gap-3">
          <Zap className="h-5 w-5 text-accent-reference shrink-0 mt-0.5" />
          <div>
            <code className="text-sm font-mono font-medium">{content.returnValue.type}</code>
            <p className="mt-1 text-sm text-muted-foreground">{content.returnValue.description}</p>
          </div>
        </div>
      </div>

      {/* Compatibility */}
      <div className="mt-6 rounded-lg border p-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Browser Support: </span>
        {content.compatibility}
      </div>

      {/* Content Sections */}
      <ContentRenderer blocks={content.sections} />

      <RelatedTopics contentId={content.id} />
      <PrevNextNav prev={prev} next={next} />
        </>
      )}
    </DocsLayout>
  );
}
