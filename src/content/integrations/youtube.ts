import type { IntegrationContent } from '@/types/content';

export const youtubeIntegration: IntegrationContent = {
  id: 'integration-youtube',
  title: 'YouTube API',
  description: 'Build apps that interact with YouTube using the YouTube Data API.',
  slug: 'integrations/youtube',
  pillar: 'integrations',
  category: 'apis-services',
  tags: ['YouTube', 'API', 'video', 'search'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'Learn to build YouTube integrations — search videos, get metadata, manage playlists, and handle authentication. We\'ll build a type-safe client and show you common patterns.',
  relatedTopics: ['integration-rest-apis'],
  order: 3,
  updatedAt: '2025-06-01',
  readingTime: 14,
  featured: false,
  keywords: ['YouTube API', 'video search', 'metadata'],
  requiredLibraries: ['@google-cloud/youtube (optional)'],
  setupSteps: ['Create a Google Cloud project', 'Enable YouTube Data API v3', 'Create an API key and OAuth credentials', 'Set up authentication'],
  authNotes: 'Public operations use API keys. User-specific operations require OAuth 2.0 authentication.',
  sections: [
    { type: 'heading', level: 2, text: 'API Setup & Authentication', id: 'setup' },
    { type: 'paragraph', text: 'YouTube API requires a Google Cloud project. For public data (search, metadata) you can use an API key. For user-specific operations (uploading, managing playlists) you need OAuth 2.0. Let\'s build a client that handles both.' },
    { type: 'code', language: 'typescript', code: `interface YouTubeConfig {
  apiKey?: string;           // For public operations
  accessToken?: string;      // For authenticated operations
}

class YouTubeClient {
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private config: YouTubeConfig) {}

  private async request<T>(
    endpoint: string,
    params: Record<string, string | number | boolean>
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    // Add authentication
    if (this.config.accessToken) {
      url.searchParams.set('access_token', this.config.accessToken);
    } else if (this.config.apiKey) {
      url.searchParams.set('key', this.config.apiKey);
    } else {
      throw new Error('No API key or access token provided');
    }

    // Add parameters
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }

    const res = await fetch(url.toString());
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(\`YouTube API error: \${error.error.message}\`);
    }

    return res.json();
  }

  search(query: string, maxResults = 10) {
    return this.request('/search', {
      q: query,
      part: 'snippet',
      maxResults,
      type: 'video',
    });
  }

  getVideoDetails(videoId: string) {
    return this.request('/videos', {
      id: videoId,
      part: 'snippet,statistics,contentDetails',
    });
  }

  getPlaylist(playlistId: string, maxResults = 10) {
    return this.request('/playlistItems', {
      playlistId,
      part: 'snippet,contentDetails',
      maxResults,
    });
  }
}` },

    { type: 'heading', level: 2, text: 'Search Videos', id: 'search' },
    { type: 'code', language: 'typescript', code: `interface SearchResult {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    liveBroadcastContent: 'none' | 'upcoming' | 'live';
  };
}

interface SearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: SearchResult[];
}

async function searchYouTube(query: string, pageToken?: string) {
  const client = new YouTubeClient({ apiKey: process.env.YOUTUBE_API_KEY });
  
  const response = await client.request<SearchResponse>('/search', {
    q: query,
    part: 'snippet',
    maxResults: 20,
    type: 'video',
    order: 'relevance',
    ...(pageToken && { pageToken }),
  });

  return {
    results: response.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    })),
    nextPageToken: response.nextPageToken,
    totalResults: response.pageInfo.totalResults,
  };
}` },

    { type: 'heading', level: 2, text: 'Get Video Metadata', id: 'metadata' },
    { type: 'code', language: 'typescript', code: `interface VideoDetails {
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    channelId: string;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails: {
    duration: string; // ISO 8601 format
    dimension: string;
    definition: string;
  };
}

async function getVideoInfo(videoId: string) {
  const client = new YouTubeClient({ apiKey: process.env.YOUTUBE_API_KEY });
  
  const response = await client.request<{ items: VideoDetails[] }>('/videos', {
    id: videoId,
    part: 'snippet,statistics,contentDetails',
  });

  if (response.items.length === 0) {
    throw new Error('Video not found');
  }

  const video = response.items[0];
  
  return {
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    duration: parseDuration(video.contentDetails.duration),
    viewCount: parseInt(video.statistics.viewCount),
    likeCount: video.statistics.likeCount ? parseInt(video.statistics.likeCount) : null,
    thumbnail: video.snippet.thumbnails.high.url,
    channelTitle: video.snippet.channelTitle,
  };
}

function parseDuration(iso8601: string): number {
  // PT1H2M30S → seconds
  const match = iso8601.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}` },

    { type: 'heading', level: 2, text: 'OAuth 2.0 Authentication', id: 'oauth' },
    { type: 'code', language: 'typescript', code: `// Redirect user to Google OAuth consent screen
function getOAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: 'http://localhost:3000/auth/callback',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    access_type: 'offline', // to get refresh token
  });

  return \`https://accounts.google.com/o/oauth2/v2/auth?\${params}\`;
}

// Exchange authorization code for access token
async function getAccessToken(code: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/auth/callback',
    }).toString(),
  });

  const data = await res.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

// Refresh access token when expired
async function refreshAccessToken(refreshToken: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  const data = await res.json();
  return data.access_token;
}` },

    { type: 'heading', level: 2, text: 'Get User\'s Uploads Playlist', id: 'uploads' },
    { type: 'code', language: 'typescript', code: `async function getUserUploads(accessToken: string) {
  const client = new YouTubeClient({ accessToken });

  // Get current user’s channel
  const channels = await client.request('/channels', {
    part: 'contentDetails',
    mine: true,
  });

  const uploadsPlaylistId = channels.items[0].contentDetails.relatedPlaylists.uploads;

  // Get videos from uploads playlist
  const playlist = await client.request('/playlistItems', {
    playlistId: uploadsPlaylistId,
    part: 'snippet',
    maxResults: 50,
  });

  return playlist.items.map(item => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt,
  }));
}` },

    { type: 'heading', level: 2, text: 'React Hook for Video Search', id: 'react-hook' },
    { type: 'code', language: 'typescript', code: `function useYouTubeSearch(query: string, maxResults = 10) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(\`/api/youtube/search?q=\${encodeURIComponent(query)}&maxResults=\${maxResults}\`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timer = setTimeout(searchVideos, 300);
    return () => clearTimeout(timer);
  }, [query, maxResults]);

  return { results, loading, error };
}

// Usage
function YouTubeSearchApp() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useYouTubeSearch(query);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search YouTube..."
        className="w-full px-4 py-2 border rounded"
      />
      
      {loading && <p>Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {results.map(video => (
          <a key={video.videoId} href={'https://youtu.be/' + video.videoId} target="_blank" rel="noopener noreferrer" className="group">
            <img src={video.thumbnail} alt={video.title} className="w-full rounded group-hover:opacity-75" />
            <h3 className="font-semibold mt-2 text-sm line-clamp-2">{video.title}</h3>
            <p className="text-xs text-gray-500">{video.channelTitle}</p>
          </a>
        ))}
      </div>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Never expose your API key or OAuth secrets in frontend code',
      'Cache search results with a TTL to respect rate limits (quota is limited)',
      'Implement debouncing on search input to avoid excessive API calls',
      'Handle quota errors (403) gracefully and notify users',
      'Store refresh tokens securely (encrypted in database)',
      'Implement pagination for large result sets',
      'Use appropriate part parameters to minimize response size',
    ] },
    { type: 'callout', variant: 'warning', title: 'Rate Limits', text: 'YouTube API has a daily quota of 10,000 units. Each operation costs units (search = 100, video.get = 1). Cache aggressively and warn users when quota is running low.' },
  ],
};
