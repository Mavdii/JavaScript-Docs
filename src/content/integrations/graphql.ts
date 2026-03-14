import type { IntegrationContent } from '@/types/content';

export const graphqlIntegration: IntegrationContent = {
  id: 'integration-graphql',
  title: 'GraphQL APIs',
  description: 'Build efficient applications using GraphQL with Apollo Client, featuring queries, mutations, subscriptions, and intelligent caching.',
  slug: 'integrations/graphql',
  pillar: 'integrations',
  category: 'apis',
  tags: ['graphql', 'apollo', 'queries', 'mutations', 'subscriptions', 'caching'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'Master GraphQL integration with Apollo Client — from writing queries and mutations to managing cache, implementing subscriptions, optimistic updates, and code generation.',
  relatedTopics: ['integration-rest-apis'],
  order: 4,
  updatedAt: '2025-06-01',
  readingTime: 25,
  featured: true,
  keywords: ['GraphQL', 'Apollo Client', 'queries', 'mutations', 'subscriptions', 'caching'],
  requiredLibraries: ['@apollo/client', 'graphql'],
  setupSteps: ['Install Apollo Client', 'Configure ApolloClient with endpoint', 'Set up cache strategy', 'Define queries and mutations'],
  authNotes: 'Include authentication token in request headers using setContext middleware or custom headers configuration.',
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Setting Up Apollo Client',
      id: 'apollo-setup',
    },
    {
      type: 'paragraph',
      text: 'Apollo Client is a comprehensive state management library for GraphQL. It handles caching, synchronization, and server updates automatically.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://api.example.com/graphql',
  credentials: 'include', // Include cookies
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

// Use in React
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Writing and Executing Queries',
      id: 'queries',
    },
    {
      type: 'paragraph',
      text: 'GraphQL queries are statically defined and only request the fields you need. They\'re strongly typed and provide excellent IDE autocomplete when using code generation.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { gql, useQuery } from '@apollo/client';

const GET_USER_PROFILE = gql\`
  query GetUserProfile($id: ID!) {
    user(id: $id) {
      id
      name
      email
      avatar
      bio
      followerCount
      isFollowing
    }
  }
\`;

interface GetUserProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    followerCount: number;
    isFollowing: boolean;
  };
}

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error, refetch } = useQuery<GetUserProfileData>(
    GET_USER_PROFILE,
    {
      variables: { id: userId },
      fetchPolicy: 'cache-first', // Use cache, fetch if missing
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const user = data?.user;

  return (
    <div className="profile-card">
      <img src={user?.avatar} alt={user?.name} />
      <h1>{user?.name}</h1>
      <p>{user?.bio}</p>
      <p>Followers: {user?.followerCount}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Mutations and Updates',
      id: 'mutations',
    },
    {
      type: 'paragraph',
      text: 'Mutations modify server state. They return updated data that Apollo automatically merges into the cache. You can also manually update the cache for immediate UI feedback.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { gql, useMutation } from '@apollo/client';

const UPDATE_USER_BIO = gql\`
  mutation UpdateUserBio($id: ID!, $bio: String!) {
    updateUser(id: $id, input: { bio: $bio }) {
      id
      bio
      updatedAt
    }
  }
\`;

const CREATE_POST = gql\`
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      id
      title
      content
      author {
        id
        name
      }
      createdAt
    }
  }
\`;

function UpdateBioForm({ userId }: { userId: string }) {
  const [newBio, setNewBio] = useState('');
  const [updateBio, { loading, error }] = useMutation(UPDATE_USER_BIO);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateBio({
        variables: { id: userId, bio: newBio },
        // Optimistically update cache before server response
        optimisticResponse: {
          updateUser: {
            __typename: 'User',
            id: userId,
            bio: newBio,
            updatedAt: new Date().toISOString(),
          },
        },
      });

      console.log('Bio updated:', data.updateUser);
      setNewBio('');
    } catch (err) {
      console.error('Failed to update bio:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        placeholder="Write your bio..."
      />
      <button disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Real-time Updates with Subscriptions',
      id: 'subscriptions',
    },
    {
      type: 'paragraph',
      text: 'GraphQL subscriptions enable real-time updates via WebSocket. Apollo Client automatically manages the connection and merges subscription data into the cache.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { gql, useSubscription, WebSocketLink } from '@apollo/client';

// Set up WebSocket link (in addition to HttpLink)
const wsLink = new WebSocketLink({
  uri: 'wss://api.example.com/graphql',
  options: {
    reconnect: true,
  },
});

// Combine links with split
import { split, getMainDefinition } from '@apollo/client';

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Subscribe to messages
const MESSAGES_SUBSCRIPTION = gql\`
  subscription OnMessageAdded($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      id
      content
      author {
        id
        name
        avatar
      }
      createdAt
    }
  }
\`;

function ChatRoom({ roomId }: { roomId: string }) {
  const { data, loading, error } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { roomId },
  });

  const messages = data?.messageAdded ? [data.messageAdded] : [];

  return (
    <div className="chat">
      {loading && <p>Connecting...</p>}
      {error && <p>Connection error: {error.message}</p>}
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.author.name}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cache Management & Normalization',
      id: 'caching',
    },
    {
      type: 'paragraph',
      text: 'Apollo\'s InMemoryCache automatically normalizes GraphQL data, deduplicates objects, and updates all references. You can also manually manage the cache for fine-grained control.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Custom cache behavior for paginated lists
        posts: {
          keyArgs: false, // Use full variables, not just first arg
          merge(existing = [], incoming, { args }) {
            const offset = args?.offset ?? 0;
            const merged = existing.slice(0);
            for (let i = 0; i < incoming.length; i++) {
              merged[offset + i] = incoming[i];
            }
            return merged;
          },
        },
      },
    },
    User: {
      // Cache user by ID
      keyFields: ['id'],
    },
  },
});

// Manually update cache after mutation
const [createPost] = useMutation(CREATE_POST, {
  update(cache, { data: { createPost } }) {
    // Read existing posts from cache
    const existingPosts = cache.readQuery({ query: GET_POSTS });

    // Update cache with new post
    cache.writeQuery({
      query: GET_POSTS,
      data: {
        posts: [createPost, ...existingPosts.posts],
      },
    });
  },
});

// Clear entire cache
client.cache.reset();

// Clear specific query
client.cache.evict({
  id: cache.identify({ __typename: 'User', id: 'user-1' }),
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Optimistic UI Updates',
      id: 'optimistic',
    },
    {
      type: 'paragraph',
      text: 'Optimistic updates predict the server response and update the UI immediately, making apps feel instant. If the server response differs, Apollo automatically reconciles.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const [toggleLike] = useMutation(TOGGLE_POST_LIKE);

function PostCard({ post }: { post: Post }) {
  const handleLike = async () => {
    await toggleLike({
      variables: { postId: post.id },
      // Predict what server will return
      optimisticResponse: {
        toggleLike: {
          __typename: 'Post',
          id: post.id,
          liked: !post.liked, // Flip the boolean
          likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
        },
      },
    });
  };

  return (
    <div className="post">
      <p>{post.content}</p>
      <button onClick={handleLike} className={post.liked ? 'liked' : ''}>
        ♥ {post.likeCount}
      </button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Code Generation with GraphQL Codegen',
      id: 'code-generation',
    },
    {
      type: 'paragraph',
      text: 'Use GraphQL Code Generator to create TypeScript types from your schema and queries. This eliminates manual type definitions and ensures type safety.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// codegen.ts configuration
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://api.example.com/graphql',
  documents: 'src/**/*.graphql.ts',
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withMutationFn: true,
      },
    },
  },
};

export default config;

// Then use generated hooks automatically
import { useGetUserProfileQuery, useUpdateUserBioMutation } from '@/generated/graphql';

function MyComponent() {
  const { data, loading } = useGetUserProfileQuery({ variables: { id: '123' } });
  const [updateBio] = useUpdateUserBioMutation();

  // data and variables are fully typed!
  return <div>{data?.user?.name}</div>;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Error Handling & Network Management',
      id: 'error-handling',
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Network Errors vs GraphQL Errors',
      text: 'Network errors (no connection, 500) appear in the error object. GraphQL errors (invalid query, auth) appear in data.errors and successful responses. Check both!',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { ApolloLink, onError } from '@apollo/client';

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error(\`[GraphQL error]: \${err.message}\`);

      // Handle auth errors
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        // Refresh token or redirect to login
        window.location.href = '/login';
      }

      // Handle rate limiting
      if (err.extensions?.code === 'RATE_LIMITED') {
        console.warn('Rate limited, retry in', err.extensions.retryAfter);
      }
    }
  }

  if (networkError) {
    console.error(\`[Network error]: \${networkError.message}\`);

    // Retry logic for network errors
    if (networkError.statusCode === 429) {
      // Too many requests
      return forward(operation);
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache,
});`,
    },
    {
      type: 'table',
      headers: ['Feature', 'Purpose', 'When to Use'],
      rows: [
        ['cache-first', 'Return cache if available, fetch if not', 'Stable data, user profiles'],
        ['cache-and-network', 'Return cache immediately, refetch in background', 'Real-time data, feed'],
        ['network-only', 'Always fetch from server', 'Critical data, one-time queries'],
        ['no-cache', 'Bypass cache entirely', 'Search results, temporary data'],
      ],
    },
  ],
};
