import type { IntegrationContent } from '@/types/content';

export const oauthIntegration: IntegrationContent = {
  id: 'integration-oauth',
  title: 'OAuth 2.0',
  description: 'Implement OAuth 2.0 authentication flows in JavaScript applications.',
  slug: 'integrations/oauth',
  pillar: 'integrations',
  category: 'auth-payments',
  tags: ['OAuth', 'authentication', 'security', 'tokens'],
  difficulty: 'advanced',
  contentType: 'integration',
  summary: 'Understand the OAuth 2.0 authorization framework — from authorization code flow to PKCE for single-page apps.',
  relatedTopics: ['integration-auth-flows'],
  order: 4,
  updatedAt: '2025-06-01',
  readingTime: 18,
  featured: true,
  keywords: ['OAuth 2.0', 'authorization code', 'PKCE', 'tokens'],
  requiredLibraries: ['fetch (built-in)'],
  setupSteps: ['Register your app with the OAuth provider', 'Configure redirect URIs', 'Store client ID securely'],
  authNotes: 'Never expose client secrets in frontend code. Use PKCE flow for SPAs.',
  sections: [
    { type: 'heading', level: 2, text: 'OAuth 2.0 Flows Overview', id: 'flows-overview' },
    { type: 'paragraph', text: 'OAuth 2.0 is an authorization framework that lets applications get limited access to user accounts on an HTTP service. It delegates user authentication to the service that hosts the user account and authorizes third-party applications to access that user account.' },
    { type: 'table', headers: ['Flow', 'Use Case', 'Security Level', 'Client Secret Required'], rows: [
      ['Authorization Code + PKCE', 'SPAs, mobile apps, native apps', 'Highest', 'No'],
      ['Authorization Code', 'Server-side web apps', 'High', 'Yes'],
      ['Client Credentials', 'Machine-to-machine (M2M)', 'High', 'Yes (server only)'],
      ['Device Code', 'Input-constrained devices (TVs, CLIs)', 'Medium', 'No'],
      ['Implicit (deprecated)', 'Legacy SPAs', 'Low — tokens in URL', 'No'],
    ]},
    { type: 'callout', variant: 'danger', title: 'Implicit Flow is Deprecated', text: 'The Implicit flow exposes access tokens in the URL fragment. OAuth 2.1 removes it entirely. Always use Authorization Code + PKCE for browser-based apps.' },

    { type: 'heading', level: 2, text: 'PKCE Flow for SPAs', id: 'pkce-flow' },
    { type: 'paragraph', text: 'PKCE (Proof Key for Code Exchange, pronounced "pixy") protects the authorization code grant by using a dynamically generated cryptographic challenge. This prevents authorization code interception attacks — even without a client secret.' },
    { type: 'code', language: 'typescript', code: `// Step 1: Generate PKCE code verifier and challenge
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

function base64UrlEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/, '');
}` },

    { type: 'heading', level: 3, text: 'Starting the Authorization Flow', id: 'start-auth' },
    { type: 'code', language: 'typescript', code: `interface OAuthConfig {
  clientId: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  redirectUri: string;
  scopes: string[];
}

async function startOAuthFlow(config: OAuthConfig): Promise<void> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store verifier for later exchange — sessionStorage is OK here
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);

  // Generate a random state to prevent CSRF
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href =
    \`\${config.authorizationEndpoint}?\${params.toString()}\`;
}` },

    { type: 'heading', level: 3, text: 'Handling the Callback', id: 'callback' },
    { type: 'code', language: 'typescript', code: `async function handleOAuthCallback(
  config: OAuthConfig
): Promise<TokenResponse> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');

  // Check for error response
  if (error) {
    const description = params.get('error_description') || 'Unknown error';
    throw new OAuthError(error, description);
  }

  // Validate state to prevent CSRF attacks
  const savedState = sessionStorage.getItem('oauth_state');
  if (state !== savedState) {
    throw new OAuthError('invalid_state', 'State mismatch — possible CSRF attack');
  }

  if (!code) {
    throw new OAuthError('missing_code', 'No authorization code received');
  }

  const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
  if (!codeVerifier) {
    throw new OAuthError('missing_verifier', 'PKCE verifier not found');
  }

  // Exchange code for tokens
  const tokenResponse = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.json();
    throw new OAuthError(err.error, err.error_description);
  }

  // Clean up
  sessionStorage.removeItem('pkce_code_verifier');
  sessionStorage.removeItem('oauth_state');

  return tokenResponse.json();
}` },

    { type: 'heading', level: 2, text: 'Token Management', id: 'token-management' },
    { type: 'paragraph', text: 'Proper token management is critical for security. Access tokens should be short-lived and stored in memory. Refresh tokens should be used to obtain new access tokens without user interaction.' },
    { type: 'code', language: 'typescript', code: `interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private refreshPromise: Promise<void> | null = null;

  setTokens(tokens: TokenResponse): void {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token ?? null;
    // Refresh 60 seconds before expiry
    this.expiresAt = Date.now() + (tokens.expires_in - 60) * 1000;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    // Deduplicate concurrent refresh calls
    if (!this.refreshPromise) {
      this.refreshPromise = this.refresh();
    }

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }

    return this.accessToken!;
  }

  private async refresh(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token — user must re-authenticate');
    }

    const res = await fetch('/api/oauth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });

    if (!res.ok) throw new Error('Token refresh failed');
    const tokens: TokenResponse = await res.json();
    this.setTokens(tokens);
  }

  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
  }
}` },

    { type: 'heading', level: 2, text: 'Authenticated Fetch Wrapper', id: 'auth-fetch' },
    { type: 'code', language: 'typescript', code: `const tokenManager = new TokenManager();

async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await tokenManager.getAccessToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: \`Bearer \${token}\`,
    },
  });

  // If 401, try refreshing once
  if (res.status === 401) {
    tokenManager.clear();
    const newToken = await tokenManager.getAccessToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: \`Bearer \${newToken}\`,
      },
    });
  }

  return res;
}` },

    { type: 'heading', level: 2, text: 'Custom OAuthError Class', id: 'oauth-error' },
    { type: 'code', language: 'typescript', code: `class OAuthError extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly errorDescription: string,
  ) {
    super(\`OAuth Error [\${errorCode}]: \${errorDescription}\`);
    this.name = 'OAuthError';
  }

  get isAccessDenied(): boolean {
    return this.errorCode === 'access_denied';
  }

  get isExpiredToken(): boolean {
    return this.errorCode === 'invalid_grant';
  }
}` },

    { type: 'heading', level: 2, text: 'Security Best Practices', id: 'security' },
    { type: 'list', items: [
      'Use PKCE for ALL browser-based flows — never use Implicit Grant',
      'Store access tokens in memory only — never in localStorage or cookies accessible to JS',
      'Always validate the state parameter to prevent CSRF attacks',
      'Use short-lived access tokens (5-15 minutes) with refresh tokens',
      'Register exact redirect URIs — never use wildcard patterns',
      'Use the principle of least privilege — request only needed scopes',
      'Implement token revocation on logout',
      'Never log tokens or include them in error reports',
    ] },
    { type: 'callout', variant: 'warning', title: 'Token Storage', text: 'Storing tokens in localStorage makes them accessible to XSS attacks. Store access tokens in a JavaScript closure (memory) and refresh tokens in httpOnly cookies set by your backend.' },

    { type: 'heading', level: 2, text: 'Provider-Specific Setup', id: 'providers' },
    { type: 'table', headers: ['Provider', 'Auth Endpoint', 'Token Endpoint', 'Notes'], rows: [
      ['Google', 'accounts.google.com/o/oauth2/v2/auth', 'oauth2.googleapis.com/token', 'Supports PKCE, OpenID Connect'],
      ['GitHub', 'github.com/login/oauth/authorize', 'github.com/login/oauth/access_token', 'No PKCE — use backend proxy'],
      ['Microsoft', 'login.microsoftonline.com/{tenant}/oauth2/v2/authorize', 'login.microsoftonline.com/{tenant}/oauth2/v2/token', 'Supports PKCE, MSAL SDK available'],
      ['Discord', 'discord.com/api/oauth2/authorize', 'discord.com/api/oauth2/token', 'Supports PKCE since 2023'],
    ]},

    { type: 'heading', level: 2, text: 'OpenID Connect (OIDC)', id: 'oidc' },
    { type: 'paragraph', text: 'OpenID Connect is an identity layer on top of OAuth 2.0. While OAuth handles authorization (what can I access?), OIDC adds authentication (who is the user?). It introduces the ID Token — a JWT containing user identity claims.' },
    { type: 'code', language: 'typescript', code: `// Decode an ID Token (JWT) without verification
// WARNING: Always verify the signature server-side!
function decodeIdToken(idToken: string): {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
} {
  const [headerB64, payloadB64] = idToken.split('.');
  return {
    header: JSON.parse(atob(headerB64)),
    payload: JSON.parse(atob(payloadB64)),
  };
}

// Standard OIDC claims in the ID Token:
// sub     — unique user identifier
// email   â user’s email address
// name    — full name
// picture — profile picture URL
// iss     — token issuer
// aud     — intended audience (your client_id)
// exp     — expiration timestamp
// iat     — issued-at timestamp` },

    { type: 'heading', level: 2, text: 'Common Pitfalls', id: 'pitfalls' },
    { type: 'list', items: [
      'Forgetting to validate the state parameter → CSRF vulnerability',
      'Using the Implicit flow in production → tokens exposed in URL history',
      'Not checking token expiry before making API calls → unnecessary 401 errors',
      'Hardcoding client secrets in frontend code → they are public!',
      'Not handling the "access_denied" error when user cancels consent',
      'Using different redirect URIs in development vs production without updating provider settings',
      'Not implementing proper logout — revoking tokens and clearing state',
    ] },
  ],
};
