import type { ProjectContent } from '@/types/content';

export const youtubeSearchProject: ProjectContent = {
  id: 'project-youtube-search',
  title: 'YouTube Search App',
  description: 'Build a YouTube search interface with the YouTube API.',
  slug: 'projects/youtube-search',
  pillar: 'projects',
  category: 'applications',
  tags: ['YouTube', 'API', 'search', 'React'],
  difficulty: 'intermediate',
  contentType: 'project',
  summary: 'Search YouTube videos, display results with thumbnails, watch them embedded in your app. Learn API integration, pagination, and building a production-quality UI.',
  relatedTopics: ['integration-youtube', 'integration-rest-apis'],
  order: 7,
  updatedAt: '2025-06-01',
  readingTime: 18,
  featured: false,
  keywords: ['YouTube search', 'API', 'video results'],
  techStack: ['React', 'TypeScript', 'YouTube API', 'Tailwind CSS'],
  learningGoals: ['Integrate third-party APIs', 'Handle pagination', 'Build search UX', 'Manage loading states'],
  features: ['Video search', 'Pagination', 'Watch embedded', 'Filter by type', 'Save favorites'],
  sections: [
    { type: 'heading', level: 2, text: 'Project Overview', id: 'overview' },
    { type: 'paragraph', text: 'We\'ll build a YouTube search app. Users type a query, we search the YouTube API, display results with thumbnails and metadata, and let them watch videos. We\'ll handle pagination and show loading/error states.' },

    { type: 'heading', level: 2, text: 'API Setup', id: 'api-setup' },
    { type: 'code', language: 'typescript', code: `// Backend proxy endpoint (so we don’t expose API key on frontend)
app.get('/api/youtube/search', async (req, res) => {
  const { q, pageToken, maxResults = 20 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query required' });
  }

  try {
    const params = new URLSearchParams({
      q: q as string,
      part: 'snippet',
      maxResults: String(maxResults),
      type: 'video',
      key: process.env.YOUTUBE_API_KEY!,
      ...(pageToken && { pageToken: pageToken as string }),
    });

    const response = await fetch(\`https://www.googleapis.com/youtube/v3/search?\${params}\`);
    
    if (!response.ok) {
      throw new Error(\`YouTube API error: \${response.statusText}\`);
    }

    const data = await response.json();

    res.json({
      items: data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      })),
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo.totalResults,
    });
  } catch (err) {
    console.error('YouTube API error:', err);
    res.status(500).json({ error: 'Failed to search YouTube' });
  }
});` },

    { type: 'heading', level: 2, text: 'Search Hook', id: 'hook' },
    { type: 'code', language: 'typescript', code: `interface VideoResult {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

interface SearchState {
  results: VideoResult[];
  loading: boolean;
  error: string | null;
  nextPageToken?: string;
  totalResults: number;
}

function useYouTubeSearch() {
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    totalResults: 0,
  });

  const search = useCallback(async (query: string, pageToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const params = new URLSearchParams({
        q: query,
        ...(pageToken && { pageToken }),
        maxResults: '20',
      });

      const res = await fetch(\`/api/youtube/search?\${params}\`);
      
      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();

      setState(prev => ({
        ...prev,
        results: pageToken ? [...prev.results, ...data.items] : data.items,
        nextPageToken: data.nextPageToken,
        totalResults: data.totalResults,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
      }));
    }
  }, []);

  const nextPage = useCallback(() => {
    if (state.nextPageToken) {
      // Would need to track the current query to search the next page
      // This is why you might want to use a library like TanStack Query
    }
  }, [state.nextPageToken]);

  return { ...state, search, nextPage };
}` },

    { type: 'heading', level: 2, text: 'Search Bar', id: 'search-bar' },
    { type: 'code', language: 'tsx', code: `function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedSearch = useCallback((q: string) => {
    clearTimeout(searchTimeoutRef.current);
    
    if (q.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(q);
      }, 300);
    }
  }, [onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search YouTube..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}` },

    { type: 'heading', level: 2, text: 'Video Results', id: 'results' },
    { type: 'code', language: 'tsx', code: `function VideoResult({ video, onSelect }: {
  video: VideoResult;
  onSelect: (videoId: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(video.videoId)}
      className="text-left hover:opacity-80 transition group"
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-auto group-hover:scale-105 transition"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            ▶
          </div>
        </div>
      </div>
      
      <h3 className="font-semibold mt-2 text-sm line-clamp-2">
        {video.title}
      </h3>
      
      <p className="text-xs text-gray-500 mt-1">
        {video.channelTitle}
      </p>
      
      <p className="text-xs text-gray-400 mt-0.5">
        {new Date(video.publishedAt).toLocaleDateString()}
      </p>
    </button>
  );
}

function ResultsGrid({ videos, onSelectVideo, loading }: {
  videos: VideoResult[];
  onSelectVideo: (videoId: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No videos found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map(video => (
        <VideoResult
          key={video.videoId}
          video={video}
          onSelect={onSelectVideo}
        />
      ))}
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Video Player', id: 'player' },
    { type: 'code', language: 'tsx', code: `function VideoPlayer({ videoId }: { videoId: string | null }) {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => {/* close */}}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>

        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={\`https://www.youtube.com/embed/\${videoId}?autoplay=1\`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Main App', id: 'app' },
    { type: 'code', language: 'tsx', code: `function YouTubeSearchApp() {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { results, loading, error, search, nextPageToken } = useYouTubeSearch();

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-red-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">YouTube Search</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar onSearch={search} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <ResultsGrid
          videos={results}
          onSelectVideo={setSelectedVideoId}
          loading={loading}
        />

        {nextPageToken && (
          <div className="mt-8 text-center">
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => {/* implement pagination */}}
            >
              Load More
            </button>
          </div>
        )}
      </main>

      <VideoPlayer videoId={selectedVideoId} />
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Always proxy API requests through your backend to protect your API key',
      'Debounce search input to avoid making too many API calls',
      'Show skeleton loaders instead of spinners for better UX',
      'Handle errors gracefully and show helpful messages',
      'Lazy load video thumbnails for performance',
      'Implement pagination to handle large result sets',
      'Cache search results to reduce API calls',
    ] },
    { type: 'callout', variant: 'warning', title: 'API Quota', text: 'YouTube API has daily quotas. Each search request costs 100 units. Cache results aggressively and warn users if quota is running low.' },
  ],
};
