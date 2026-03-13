import { useParams } from 'react-router-dom';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { ContentMeta } from '@/components/content/ContentMeta';
import { ContentActions } from '@/components/content/ContentActions';
import { ContentPageSkeleton } from '@/components/content/ContentPageSkeleton';
import { MissingContentState } from '@/components/content/MissingContentState';
import { RelatedTopics } from '@/components/content/RelatedTopics';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PrevNextNav } from '@/components/navigation/PrevNextNav';
import { Seo } from '@/components/seo/Seo';
import { extractHeadings, getContentMetaBySlug } from '@/lib/content';
import { getPrevNextNavigation } from '@/lib/navigation';
import { useContentEntry, useContentPageTracking } from '@/hooks/use-content-page';
import type { LessonContent } from '@/types/content';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target } from 'lucide-react';

export default function LessonPageView() {
  const { category, slug } = useParams();
  const fullSlug = `learn/${category}/${slug}`;
  const meta = getContentMetaBySlug(fullSlug);
  const { data: content, isLoading } = useContentEntry<LessonContent>(fullSlug, Boolean(meta));
  const progress = useContentPageTracking(fullSlug, Boolean(meta));

  if (!meta) {
    return (
      <>
        <Seo title="Lesson Not Found" description="The requested lesson is not available yet." path={fullSlug} />
        <MissingContentState
          pillar="learn"
          title="Lesson not found"
          message="This lesson is not available yet. Try another topic from the learning pillar."
        />
      </>
    );
  }

  const headings = content ? extractHeadings(content.sections) : [];
  const { prev, next } = getPrevNextNavigation(fullSlug);

  return (
    <DocsLayout pillar="learn" headings={headings}>
      <Seo title={meta.title} description={meta.description} path={`/${meta.slug}`} />
      <Breadcrumbs
        items={[
          { label: 'Learn', href: '/learn' },
          { label: meta.category, href: '/learn' },
          { label: meta.title },
        ]}
      />

      {isLoading || !content ? (
        <ContentPageSkeleton />
      ) : (
        <>
      {/* Title area */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{content.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{content.summary}</p>
        <div className="mt-4">
          <ContentMeta difficulty={content.difficulty} readingTime={content.readingTime} tags={content.tags} />
        </div>
      </div>

      <ContentActions slug={content.slug} progress={progress.percent} completed={progress.completed} />

      {/* Prerequisites */}
      {content.prerequisites.length > 0 && (
        <div className="mb-8 rounded-lg border bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent-reference" />
            Prerequisites
          </h4>
          <div className="flex flex-wrap gap-2">
            {content.prerequisites.map((p) => (
              <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Learning Goals */}
      {content.learningGoals.length > 0 && (
        <div className="mb-8 rounded-lg border bg-accent-learn/5 p-4">
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-accent-learn" />
            What you'll learn
          </h4>
          <ul className="space-y-1">
            {content.learningGoals.map((goal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-learn shrink-0" />
                {goal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <ContentRenderer blocks={content.sections} />

      {/* Exercises */}
      {content.exercises.length > 0 && (
        <div className="mt-12 rounded-lg border bg-accent-recipes/5 p-6">
          <h3 className="mb-4 text-lg font-semibold">Practice Exercises</h3>
          <ol className="space-y-3 list-decimal pl-5">
            {content.exercises.map((ex, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">{ex}</li>
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
