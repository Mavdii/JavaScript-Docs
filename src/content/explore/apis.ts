import type { ExploreContent } from '@/types/content';

export const apisExplore: ExploreContent = {
  id: 'explore-apis',
  title: 'Public APIs Directory',
  description: 'A curated list of free and public APIs for practice and projects.',
  slug: 'explore/apis',
  pillar: 'explore',
  category: 'directories',
  tags: ['APIs', 'public', 'free', 'practice'],
  difficulty: 'beginner',
  contentType: 'library',
  summary: 'Find free public APIs perfect for learning, prototyping, and building portfolio projects. Organized by category with examples and rate limit info.',
  relatedTopics: ['integration-rest-apis', 'explore-libraries'],
  order: 2,
  updatedAt: '2025-06-01',
  readingTime: 16,
  featured: false,
  keywords: ['public APIs', 'free APIs', 'REST APIs'],
  sections: [
    { type: 'heading', level: 2, text: 'Data & Content APIs', id: 'data-content' },
    { type: 'paragraph', text: 'Need realistic data for your app? These APIs give you real-world data or fake data that looks real. Perfect for learning without setting up a whole backend.' },
    { type: 'code', language: 'javascript', code: `// JSONPlaceholder — instant fake REST API (no auth needed)
const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json());
// Returns 100 fake posts with userId, id, title, body

// Create (POST)
const newPost = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Hello', body: 'World', userId: 1 }),
}).then(r => r.json());
// { id: 101, title: 'Hello', body: 'World', userId: 1 }

// Filter & paginate
const filtered = await fetch(
  'https://jsonplaceholder.typicode.com/posts?userId=1&_page=1&_limit=5'
).then(r => r.json());

// REST Countries — no API key
const countries = await fetch('https://restcountries.com/v3.1/name/japan').then(r => r.json());
// [{ name: { common: "Japan" }, population: 125836021, capital: ["Tokyo"], ... }]

// Filter fields to reduce payload
const slim = await fetch(
  'https://restcountries.com/v3.1/all?fields=name,capital,population,flags'
).then(r => r.json());` },

    { type: 'heading', level: 2, text: 'Weather APIs', id: 'weather' },
    { type: 'code', language: 'javascript', code: `// OpenWeatherMap — free tier: 60 calls/min
const API_KEY = 'your_key_here';

// Current weather
const weather = await fetch(
  \`https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=\${API_KEY}\`
).then(r => r.json());
// { main: { temp: 15.2, humidity: 72 }, weather: [{ description: "light rain" }] }

// 5-day forecast (3-hour intervals)
const forecast = await fetch(
  \`https://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=\${API_KEY}\`
).then(r => r.json());

// Open-Meteo — completely free, no API key needed!
const meteo = await fetch(
  'https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Tokyo'
).then(r => r.json());
// { current_weather: { temperature: 22.3, windspeed: 12.5 } }` },

    { type: 'heading', level: 2, text: 'Media & Entertainment', id: 'media' },
    { type: 'paragraph', text: 'Movies, TV, music, images — build portfolio projects with real entertainment data.' },
    { type: 'code', language: 'javascript', code: `// TMDB (The Movie Database) — free API key required
const TMDB_KEY = 'your_key';

// Trending movies
const trending = await fetch(
  \`https://api.themoviedb.org/3/trending/movie/week?api_key=\${TMDB_KEY}\`
).then(r => r.json());

// Search with pagination
const search = await fetch(
  \`https://api.themoviedb.org/3/search/movie?api_key=\${TMDB_KEY}&query=inception&page=1\`
).then(r => r.json());
// { results: [...], total_pages: 1, total_results: 3 }

// Image URLs: https://image.tmdb.org/t/p/w500{poster_path}

// PokeAPI — no auth, excellent for learning
const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu').then(r => r.json());
// { name: "pikachu", types: [...], stats: [...], sprites: { front_default: "url" } }

// Paginated list
const list = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20').then(r => r.json());
// { count: 1302, next: "...?offset=20&limit=20", results: [...] }` },

    { type: 'heading', level: 2, text: 'Images & Placeholders', id: 'images' },
    { type: 'code', language: 'javascript', code: `// Unsplash API — high-quality photos (50 req/hour free)
const UNSPLASH_KEY = 'your_access_key';
const photos = await fetch(
  \`https://api.unsplash.com/search/photos?query=nature&per_page=10\`,
  { headers: { Authorization: \`Client-ID \${UNSPLASH_KEY}\` } }
).then(r => r.json());
// photo.urls.small, photo.urls.regular, photo.urls.full

// Lorem Picsum — random placeholder images (no auth)
// <img src="https://picsum.photos/400/300" />           — random
// <img src="https://picsum.photos/seed/hello/400/300" /> — seeded (consistent)
// <img src="https://picsum.photos/400/300?grayscale" />  — grayscale
// <img src="https://picsum.photos/400/300?blur=2" />     — blurred

// Random User Generator — fake user profiles
const users = await fetch('https://randomuser.me/api/?results=10&nat=us').then(r => r.json());
// { results: [{ name: { first, last }, email, picture: { thumbnail } }] }` },

    { type: 'heading', level: 2, text: 'Finance & Crypto', id: 'finance' },
    { type: 'code', language: 'javascript', code: `// CoinGecko — crypto data (free, no auth for basic endpoints)
const bitcoin = await fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
).then(r => r.json());
// { bitcoin: { usd: 67432, usd_24h_change: 2.34 } }

// Historical data
const history = await fetch(
  'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30'
).then(r => r.json());
// { prices: [[timestamp, price], ...] } — perfect for charts

// Exchange Rates API — currency conversion (free)
const rates = await fetch('https://open.er-api.com/v6/latest/USD').then(r => r.json());
// { rates: { EUR: 0.92, GBP: 0.79, JPY: 149.5, ... } }` },

    { type: 'heading', level: 2, text: 'News & Knowledge', id: 'news' },
    { type: 'code', language: 'javascript', code: `// Hacker News — no auth needed
const topStories = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(r => r.json());
const story = await fetch(\`https://hacker-news.firebaseio.com/v0/item/\${topStories[0]}.json\`).then(r => r.json());
// { title: "...", url: "...", score: 342, by: "user", descendants: 128 }

// Wikipedia API — free, no auth
const wiki = await fetch(
  'https://en.wikipedia.org/api/rest_v1/page/summary/JavaScript'
).then(r => r.json());
// { title, extract, thumbnail: { source: "url" }, content_urls }

// Search Wikipedia
const search = await fetch(
  'https://en.wikipedia.org/w/api.php?action=opensearch&search=javascript&limit=5&format=json'
).then(r => r.json());` },

    { type: 'heading', level: 2, text: 'API Integration Best Practices', id: 'best-practices' },
    { type: 'code', language: 'javascript', code: `// 1. Always handle errors gracefully
async function fetchAPI(url) {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limit exceeded — try again later');
    if (res.status === 404) throw new Error('Resource not found');
    throw new Error(\`API error: \${res.status}\`);
  }
  return res.json();
}

// 2. Cache responses to avoid unnecessary requests
const cache = new Map();
async function cachedFetch(url, ttl = 60000) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.time < ttl) return cached.data;
  const data = await fetchAPI(url);
  cache.set(url, { data, time: Date.now() });
  return data;
}

// 3. Respect rate limits — use a request queue
class RateLimiter {
  constructor(maxPerSecond) {
    this.interval = 1000 / maxPerSecond;
    this.lastCall = 0;
  }
  async throttle() {
    const now = Date.now();
    const wait = Math.max(0, this.interval - (now - this.lastCall));
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    this.lastCall = Date.now();
  }
}

// 4. Never expose API keys in frontend code
// Use a backend proxy or Edge Function to add keys server-side` },
    { type: 'callout', variant: 'warning', title: 'API Key Security', text: 'Never commit API keys to source code or expose them in frontend JavaScript. Use environment variables and a server-side proxy. Free-tier APIs often have low rate limits — always implement caching and error handling.' },
    { type: 'callout', variant: 'tip', title: 'No-Auth APIs for Quick Prototyping', text: 'JSONPlaceholder, PokeAPI, REST Countries, Open-Meteo, and Lorem Picsum require no API key at all — perfect for learning and hackathons.' },
  ],
  items: [
    { name: 'JSONPlaceholder', description: 'Fake online REST API for testing and prototyping', url: 'https://jsonplaceholder.typicode.com' },
    { name: 'OpenWeatherMap', description: 'Weather data API with free tier', url: 'https://openweathermap.org/api' },
    { name: 'Open-Meteo', description: 'Free weather API — no API key required', url: 'https://open-meteo.com' },
    { name: 'PokeAPI', description: 'RESTful API for Pokémon data', url: 'https://pokeapi.co' },
    { name: 'The Movie Database', description: 'Movie and TV show data API', url: 'https://www.themoviedb.org/documentation/api' },
    { name: 'REST Countries', description: 'Information about countries via a RESTful API', url: 'https://restcountries.com' },
    { name: 'Unsplash', description: 'High-quality free photos API', url: 'https://unsplash.com/developers' },
    { name: 'CoinGecko', description: 'Free cryptocurrency data API', url: 'https://www.coingecko.com/en/api' },
    { name: 'Hacker News', description: 'Tech news stories and comments API', url: 'https://github.com/HackerNews/API' },
    { name: 'Random User', description: 'Random user profile generator API', url: 'https://randomuser.me' },
  ],
};
