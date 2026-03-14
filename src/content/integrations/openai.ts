import type { IntegrationContent } from '@/types/content';

export const openaiIntegration: IntegrationContent = {
  id: 'integration-openai',
  title: 'OpenAI / AI APIs',
  description: 'Integrate OpenAI GPT models and other AI APIs into JavaScript applications for chat, completions, embeddings, and advanced AI features.',
  slug: 'integrations/openai',
  pillar: 'integrations',
  category: 'ai',
  tags: ['openai', 'gpt', 'chat', 'embeddings', 'ai', 'llm'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'Master OpenAI API integration — from chat completions and streaming responses to function calling, embeddings, token management, and cost optimization.',
  relatedTopics: ['integration-rest-apis'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 28,
  featured: true,
  keywords: ['OpenAI', 'GPT', 'chat completions', 'embeddings', 'streaming', 'function calling'],
  requiredLibraries: ['openai'],
  setupSteps: ['Get API key from OpenAI platform', 'Store in environment variables', 'Install openai package', 'Initialize client'],
  authNotes: 'Never expose API keys in frontend code. Always proxy requests through your backend. Use environment variables for credentials.',
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Setting Up OpenAI Client',
      id: 'setup',
    },
    {
      type: 'paragraph',
      text: 'The OpenAI SDK for JavaScript provides a simple interface to GPT models. Always use the client on your backend to protect your API key.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Backend setup (Node.js + Express)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Or use default from environment
const client = new OpenAI(); // reads OPENAI_API_KEY automatically`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Chat Completions',
      id: 'chat-completions',
    },
    {
      type: 'paragraph',
      text: 'Chat Completions is the core API for conversational AI. Messages flow in a specific format with role, content, and optional name/function_call fields.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
}

async function chatWithGPT(messages: Message[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo', // or 'gpt-3.5-turbo' for faster/cheaper
    messages,
    max_tokens: 1000,
    temperature: 0.7, // 0=deterministic, 2=creative
    top_p: 0.9, // nucleus sampling
  });

  return response.choices[0].message.content || '';
}

// Example conversation
const conversationHistory: Message[] = [];

async function chat(userMessage: string): Promise<string> {
  conversationHistory.push({
    role: 'user',
    content: userMessage,
  });

  const response = await chatWithGPT([
    {
      role: 'system',
      content: 'You are a helpful JavaScript assistant.',
    },
    ...conversationHistory,
  ]);

  conversationHistory.push({
    role: 'assistant',
    content: response,
  });

  return response;
}

// Usage
const reply1 = await chat('What is closure in JavaScript?');
const reply2 = await chat('Can you give me an example?');`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Streaming Responses',
      id: 'streaming',
    },
    {
      type: 'paragraph',
      text: 'Streaming lets you display token-by-token as they arrive, dramatically improving perceived performance for long responses.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Backend endpoint for streaming
app.post('/api/chat/stream', async (req, res) => {
  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      stream: true, // Enable streaming
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0].delta?.content || '';
      if (delta) {
        // Send as Server-Sent Events
        res.write(\`data: \${JSON.stringify({ content: delta })}\n\n\`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(\`data: \${JSON.stringify({ error: (error as Error).message })}\n\n\`);
    res.end();
  }
});

// Frontend streaming
async function streamChat(userMessage: string): Promise<void> {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: conversationHistory }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let assistantMessage = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.content) {
          assistantMessage += data.content;
          // Update UI in real-time
          updateChatDisplay(assistantMessage);
        }
      }
    }
  }

  conversationHistory.push({
    role: 'assistant',
    content: assistantMessage,
  });
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Function Calling',
      id: 'function-calling',
    },
    {
      type: 'paragraph',
      text: 'Function calling lets GPT request actions from your code. Define what functions the model can "call" and have it suggest when to use them.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Define tools/functions
const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object' as const,
        properties: {
          city: { type: 'string', description: 'City name' },
          units: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature units',
          },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_web',
      description: 'Search the web for information',
      parameters: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
    },
  },
];

// Implement the actual functions
async function getWeather(city: string, units: string = 'celsius'): Promise<string> {
  const response = await fetch(
    \`https://api.weather.gov/points/\${city}\`
  );
  const data = await response.json();
  return JSON.stringify(data);
}

async function searchWeb(query: string): Promise<string> {
  // Implement web search
  return 'Search results...';
}

// Handle tool calls from GPT
async function handleToolCall(
  toolName: string,
  args: Record<string, any>
): Promise<string> {
  if (toolName === 'get_weather') {
    return await getWeather(args.city, args.units);
  } else if (toolName === 'search_web') {
    return await searchWeb(args.query);
  }
  throw new Error(\`Unknown tool: \${toolName}\`);
}

// Main loop with function calling
async function chatWithTools(userMessage: string): Promise<string> {
  let messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'user', content: userMessage },
  ];

  while (true) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      tools,
    });

    const message = response.choices[0].message;
    messages.push(message as OpenAI.Chat.ChatCompletionMessageParam);

    // Check if model wants to call a function
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        console.log(\`Calling: \${toolCall.function.name}\`);
        const args = JSON.parse(toolCall.function.arguments);
        const result = await handleToolCall(toolCall.function.name, args);

        // Feed result back to model
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result,
        });
      }
    } else {
      // Model returned final answer
      return message.content || 'No response';
    }
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Embeddings for Semantic Search',
      id: 'embeddings',
    },
    {
      type: 'paragraph',
      text: 'Embeddings convert text into numerical vectors that capture semantic meaning. Use them for similarity search, clustering, and recommendation.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

// Build a vector database from documents
interface Document {
  id: string;
  content: string;
  embedding?: number[];
}

async function indexDocuments(docs: Document[]): Promise<void> {
  for (const doc of docs) {
    doc.embedding = await getEmbedding(doc.content);
    // Store in vector DB (Pinecone, Milvus, etc.)
    await vectorDb.upsert({
      id: doc.id,
      values: doc.embedding,
      metadata: { content: doc.content },
    });
  }
}

// Semantic search using cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function semanticSearch(query: string, topK = 5): Promise<Document[]> {
  const queryEmbedding = await getEmbedding(query);

  // Search vector DB
  const results = await vectorDb.query({
    vector: queryEmbedding,
    topK,
  });

  return results.map((r: any) => ({
    id: r.id,
    content: r.metadata.content,
    similarity: r.score,
  }));
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Token Management & Cost Optimization',
      id: 'token-management',
    },
    {
      type: 'paragraph',
      text: 'Tokens are the building blocks of text for LLMs. Count tokens to estimate costs and avoid exceeding limits. GPT-4 is expensive, GPT-3.5-turbo is cheap.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { encoding_for_model } from 'js-tiktoken';

// Estimate tokens for a message
function estimateTokens(text: string, model: string = 'gpt-4'): number {
  const encoding = encoding_for_model(model);
  const tokens = encoding.encode(text);
  return tokens.length;
}

// Calculate cost
const PRICING = {
  'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
};

function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: 'gpt-4' | 'gpt-3.5-turbo' = 'gpt-3.5-turbo'
): number {
  const inputCost = (inputTokens / 1000) * PRICING[model].input;
  const outputCost = (outputTokens / 1000) * PRICING[model].output;
  return inputCost + outputCost;
}

// Cost-aware API wrapper
async function cheaperChat(
  messages: OpenAI.Chat.ChatCompletionMessageParam[]
): Promise<string> {
  const inputTokens = messages.reduce(
    (sum, msg) => sum + estimateTokens(msg.content as string),
    0
  );

  // Switch model based on complexity
  const model = inputTokens > 2000 ? 'gpt-3.5-turbo' : 'gpt-4';

  console.log(\`Using \${model} - estimated input tokens: \${inputTokens}\`);

  const response = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 500, // Limit output tokens
  });

  const outputTokens = response.usage?.completion_tokens || 0;
  const cost = estimateCost(inputTokens, outputTokens, model as any);
  console.log(\`Cost estimate: $\${cost.toFixed(4)}\`);

  return response.choices[0].message.content || '';
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Rate Limiting & Error Handling',
      id: 'rate-limiting',
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'API Rate Limits',
      text: 'OpenAI enforces rate limits (requests per minute, tokens per minute). Implement exponential backoff and queue requests during limits.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerMinute: number;

  constructor(rpm: number = 60) {
    this.requestsPerMinute = rpm;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const delayBetweenRequests = (60 * 1000) / this.requestsPerMinute;

    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;

      try {
        await fn();
      } catch (error) {
        console.error('Error processing request:', error);
      }

      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }

    this.processing = false;
  }
}

// Usage with retries
const limiter = new RateLimiter(60); // 60 requests per minute

async function robustChat(messages: any[]): Promise<string> {
  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      return await limiter.execute(async () => {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages,
        });
        return response.choices[0].message.content || '';
      });
    } catch (error: any) {
      attempt++;

      // Check for rate limit error
      if (error.status === 429) {
        const retryAfter = parseInt(error.headers['retry-after'] || '60');
        console.log(\`Rate limited. Retrying in \${retryAfter}s...\`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}`,
    },
    {
      type: 'table',
      headers: ['Model', 'Speed', 'Cost', 'Context Window', 'Best For'],
      rows: [
        ['gpt-4-turbo', 'Medium', 'High', '128K', 'Complex reasoning, long docs'],
        ['gpt-3.5-turbo', 'Fast', 'Low', '4K', 'General chat, simple tasks'],
        ['text-embedding-3-small', 'Very Fast', 'Very Low', 'N/A', 'Embeddings, search'],
      ],
    },
  ],
};
