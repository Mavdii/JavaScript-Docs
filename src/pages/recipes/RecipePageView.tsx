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
import type { RecipeContent } from '@/types/content';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export default function RecipePageView() {
  const { slug } = useParams();
  const fullSlug = `recipes/${slug}`;
  const meta = getContentMetaBySlug(fullSlug);
  const { data: content, isLoading } = useContentEntry<RecipeContent>(fullSlug, Boolean(meta));
  const progress = useContentPageTracking(fullSlug, Boolean(meta));

  if (!meta) {
    return (
      <>
        <Seo title="Recipe Not Found" description="The requested recipe is not available yet." path={fullSlug} />
        <MissingContentState
          pillar="recipes"
          title="Recipe not found"
          message="This recipe is not available yet. Try another production pattern."
        />
      </>
    );
  }

  const headings = content ? extractHeadings(content.sections) : [];
  const { prev, next } = getPrevNextNavigation(fullSlug);

  return (
    <DocsLayout pillar="recipes" headings={headings}>
      <Seo title={meta.title} description={meta.description} path={`/${meta.slug}`} />
      <Breadcrumbs
        items={[
          { label: 'Recipes', href: '/recipes' },
          { label: meta.category, href: '/recipes' },
          { label: meta.title },
        ]}
      />

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

      {/* Problem Statement */}
      <div className="mb-8 rounded-lg border-l-4 border-accent-recipes bg-accent-recipes/5 p-4">
        <h4 className="mb-1 text-sm font-semibold">The Problem</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{content.problem}</p>
      </div>

      {/* Content */}
      <ContentRenderer blocks={content.sections} />

      {/* Pitfalls */}
      {content.pitfalls.length > 0 && (
        <div className="mt-12 rounded-lg border bg-accent-integrations/5 p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent-integrations" />
            Common Pitfalls
          </h3>
          <ul className="space-y-2">
            {content.pitfalls.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-integrations shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Variations */}
      {content.variations.length > 0 && (
        <div className="mt-6 rounded-lg border bg-accent-learn/5 p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent-learn" />
            Variations
          </h3>
          <ul className="space-y-2">
            {content.variations.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-learn shrink-0" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      <RelatedTopics contentId={content.id} />
      <PrevNextNav prev={prev} next={next} />
        </>
      )}
    </DocsLayout>
  );
}
