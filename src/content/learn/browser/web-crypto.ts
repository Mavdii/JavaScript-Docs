import type { LessonContent } from '@/types/content';

export const webCryptoLesson: LessonContent = {
  id: 'web-crypto-001',
  title: 'Web Crypto API: Cryptography in JavaScript',
  description: 'Master the Web Crypto API for hashing, encryption, signing, and key generation without external libraries.',
  slug: 'learn/browser/web-crypto',
  pillar: 'learn',
  category: 'browser',
  tags: ['cryptography', 'web-crypto', 'encryption', 'hashing', 'security', 'keys'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn to use the Web Crypto API for secure cryptographic operations. Understand hashing, encryption, signing, and key management.',
  relatedTopics: ['security', 'async-await', 'promises'],
  order: 12,
  updatedAt: '2024-01-15T13:45:00Z',
  readingTime: 23,
  featured: false,
  keywords: ['Web Crypto', 'encryption', 'hashing', 'RSA', 'AES', 'HMAC', 'signatures', 'cryptography'],
  prerequisites: ['promises', 'async-await', 'typed-arrays'],
  learningGoals: [
    'Understand cryptographic fundamentals and algorithms',
    'Use hashing for data integrity verification',
    'Encrypt and decrypt data with symmetric encryption',
    'Implement digital signatures for authentication',
    'Generate and manage cryptographic keys',
    'Apply cryptography to real-world scenarios'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Web Crypto API Fundamentals',
      id: 'web-crypto-fundamentals'
    },
    {
      type: 'paragraph',
      text: 'The Web Crypto API provides native cryptographic functions in the browser without requiring external libraries. It supports hashing, encryption, signing, and key generation with industry-standard algorithms like SHA-256, AES, and RSA.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Basic Web Crypto API usage
const crypto = window.crypto.subtle;

// 1. Hashing - compute digests
async function hashData(data) {
  const encoded = new TextEncoder().encode(data);
  const hashBuffer = await crypto.digest('SHA-256', encoded);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// 2. Generate encryption keys
async function generateSymmetricKey() {
  return await crypto.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

// 3. Encrypt data
async function encryptData(plaintext, key) {
  const encoded = new TextEncoder().encode(plaintext);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const encrypted = await crypto.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  return { encrypted, iv };
}

// 4. Decrypt data
async function decryptData(encrypted, iv, key) {
  const decrypted = await crypto.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

// Usage
async function example() {
  // Hash
  const hash = await hashData('password123');
  console.log('Hash:', hash);

  // Encrypt/Decrypt
  const key = await generateSymmetricKey();
  const { encrypted, iv } = await encryptData('Secret message', key);
  const decrypted = await decryptData(encrypted, iv, key);
  console.log('Decrypted:', decrypted);
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Hashing and Message Authentication',
      id: 'hashing-and-authentication'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Hashing different algorithms
async function demonstrateHashing() {
  const data = 'Hello, World!';
  const encoded = new TextEncoder().encode(data);

  // SHA-1 (legacy, not recommended)
  const sha1 = await crypto.subtle.digest('SHA-1', encoded);

  // SHA-256 (recommended)
  const sha256 = await crypto.subtle.digest('SHA-256', encoded);

  // SHA-384
  const sha384 = await crypto.subtle.digest('SHA-384', encoded);

  // SHA-512
  const sha512 = await crypto.subtle.digest('SHA-512', encoded);

  console.log('SHA-256:', bufferToHex(sha256));
}

// Helper to convert buffer to hex
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// HMAC - Hash-based Message Authentication Code
async function hmacExample() {
  const key = await crypto.subtle.generateKey(
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );

  const data = new TextEncoder().encode('message');
  
  // Create signature
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    data
  );

  // Verify signature
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    data
  );

  console.log('Signature valid:', isValid);
}

// Password hashing with PBKDF2
async function hashPassword(password, salt = null) {
  if (!salt) {
    // Generate random salt
    salt = crypto.getRandomValues(new Uint8Array(16));
  }

  const passwordBuffer = new TextEncoder().encode(password);
  
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey']),
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return { derivedKey, salt };
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Encryption and Decryption',
      id: 'encryption-decryption'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// AES-GCM encryption (recommended)
class EncryptionManager {
  constructor() {
    this.key = null;
  }

  async init() {
    this.key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(plaintext) {
    const encoded = new TextEncoder().encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encoded
    );

    // Return IV + ciphertext combined
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return combined;
  }

  async decrypt(data) {
    // Extract IV and ciphertext
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.key,
      ciphertext
    );

    return new TextDecoder().decode(plaintext);
  }

  // Export key for storage
  async exportKey() {
    return await crypto.subtle.exportKey('jwk', this.key);
  }

  // Import key from storage
  async importKey(jwk) {
    this.key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }
}

// RSA encryption (asymmetric)
async function rsaExample() {
  // Generate RSA key pair
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKey = keyPair.publicKey;
  const privateKey = keyPair.privateKey;

  // Encrypt with public key
  const message = new TextEncoder().encode('Secret message');
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    message
  );

  // Decrypt with private key
  const decrypted = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encrypted
  );

  console.log('Decrypted:', new TextDecoder().decode(decrypted));
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Digital Signatures',
      id: 'digital-signatures'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// RSA digital signatures
async function signatureExample() {
  // Generate RSA key pair for signing
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );

  const message = new TextEncoder().encode('Document to sign');

  // Sign with private key
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    keyPair.privateKey,
    message
  );

  // Verify with public key
  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    keyPair.publicKey,
    signature,
    message
  );

  console.log('Signature valid:', isValid);
}

// ECDSA signatures (more efficient)
async function ecdsaExample() {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );

  const message = new TextEncoder().encode('Sign me');

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    keyPair.privateKey,
    message
  );

  const isValid = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    keyPair.publicKey,
    signature,
    message
  );

  console.log('ECDSA valid:', isValid);
}

// JWT-like signing
class JWTSigner {
  constructor() {
    this.keyPair = null;
  }

  async init() {
    this.keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['sign', 'verify']
    );
  }

  async sign(payload) {
    // Encode payload
    const encoded = new TextEncoder().encode(JSON.stringify(payload));

    // Sign
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      this.keyPair.privateKey,
      encoded
    );

    // Return as base64
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  async verify(payload, signatureB64) {
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));

    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      this.keyPair.publicKey,
      signature,
      encoded
    );
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Key Management',
      id: 'key-management'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Exporting and importing keys
async function keyManagement() {
  // Generate key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // Must be true to export
    ['encrypt', 'decrypt']
  );

  // Export as JWK (JSON Web Key)
  const jwk = await crypto.subtle.exportKey('jwk', key);
  console.log('JWK:', JSON.stringify(jwk));

  // Save to localStorage or send to server
  localStorage.setItem('my-key', JSON.stringify(jwk));

  // Later, import the key back
  const stored = JSON.parse(localStorage.getItem('my-key'));
  const importedKey = await crypto.subtle.importKey(
    'jwk',
    stored,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );

  // Keys are now equivalent
  console.log('Key imported successfully');
}

// Key derivation for passwords
async function deriveKeyFromPassword(password, salt) {
  const passwordBuffer = new TextEncoder().encode(password);
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

// Secure random values
function generateSecureRandom(length = 32) {
  return crypto.getRandomValues(new Uint8Array(length));
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Summary',
      id: 'summary'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Key Takeaways',
      text: 'Web Crypto API provides native cryptographic functions without external libraries. Use SHA-256 for hashing, AES-GCM for encryption, and RSA/ECDSA for signatures. Always use secure random values with crypto.getRandomValues(). Export keys as JWK for storage. Handle encrypted data carefully - include IV with ciphertext. Use PBKDF2 for password-based key derivation.'
    }
  ],
  exercises: [
    'Create a hash verification system to detect data tampering',
    'Build an encryption manager for storing sensitive data',
    'Implement a digital signature system for document authentication',
    'Create a password-based encryption system using PBKDF2',
    'Build a key management system with import/export functionality',
    'Implement end-to-end encryption for messages'
  ]
};
