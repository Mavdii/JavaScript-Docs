import type { LessonContent } from '@/types/content';

export const indexeddbLesson: LessonContent = {
  id: 'indexeddb-001',
  title: 'IndexedDB: Client-Side Database',
  description: 'Master IndexedDB for storing and querying large amounts of structured data on the client side with full ACID compliance.',
  slug: 'learn/browser/indexeddb',
  pillar: 'learn',
  category: 'browser',
  tags: ['indexeddb', 'database', 'storage', 'client-side', 'idb', 'structured-data'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn to use IndexedDB for powerful client-side data storage. Understand object stores, indexes, transactions, and querying patterns.',
  relatedTopics: ['local-storage', 'offline-storage', 'service-workers'],
  order: 11,
  updatedAt: '2024-01-15T13:30:00Z',
  readingTime: 25,
  featured: false,
  keywords: ['IndexedDB', 'IDB', 'database', 'transaction', 'object store', 'index', 'query', 'nosql'],
  prerequisites: ['promises', 'async-await', 'objects'],
  learningGoals: [
    'Understand IndexedDB concepts and architecture',
    'Create and manage databases, object stores, and indexes',
    'Perform CRUD operations with transactions',
    'Query data using indexes and key ranges',
    'Handle versioning and migrations',
    'Optimize queries and manage large datasets'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Introduction to IndexedDB',
      id: 'introduction-to-indexeddb'
    },
    {
      type: 'paragraph',
      text: 'IndexedDB is a browser API for storing large amounts of structured data on the client side. Unlike LocalStorage (limited to 5-10MB of strings), IndexedDB supports gigabytes of data, complex queries, and ACID transactions. It\'s a NoSQL database that stores JavaScript objects.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Basic IndexedDB workflow
class Database {
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  // Open or create database
  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      // Upgrade database (create object stores)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains('users')) {
          const store = db.createObjectStore('users', { keyPath: 'id' });
          // Create indexes
          store.createIndex('email', 'email', { unique: true });
          store.createIndex('name', 'name');
        }
      };
    });
  }

  // Add data
  async add(storeName, data) {
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Get data by key
  async get(storeName, key) {
    const tx = this.db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Close database
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Usage
const db = new Database('MyApp', 1);
await db.open();

// Add user
await db.add('users', {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

// Get user
const user = await db.get('users', 1);
console.log(user); // { id: 1, name: 'Alice', email: 'alice@example.com' }

db.close();`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Transactions and ACID Properties',
      id: 'transactions-and-acid'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Transactions ensure data consistency
class TransactionalDB {
  async transfer(fromId, toId, amount) {
    const tx = this.db.transaction(['accounts'], 'readwrite');
    const store = tx.objectStore('accounts');

    return new Promise((resolve, reject) => {
      // Get both accounts
      const getFrom = store.get(fromId);
      let fromAccount, toAccount;

      getFrom.onsuccess = () => {
        fromAccount = getFrom.result;

        const getTo = store.get(toId);
        getTo.onsuccess = () => {
          toAccount = getTo.result;

          // Check balance
          if (fromAccount.balance < amount) {
            tx.abort();
            reject(new Error('Insufficient funds'));
            return;
          }

          // Update balances
          fromAccount.balance -= amount;
          toAccount.balance += amount;

          // Write changes
          const putFrom = store.put(fromAccount);
          const putTo = store.put(toAccount);
        };
      };

      // Transaction completes
      tx.oncomplete = () => resolve('Transfer complete');
      tx.onerror = () => reject(tx.error);
    });
  }

  // Multiple object stores transaction
  async moveUserData(userId, fromStore, toStore) {
    const tx = this.db.transaction([fromStore, toStore], 'readwrite');
    
    return new Promise((resolve, reject) => {
      const source = tx.objectStore(fromStore);
      const destination = tx.objectStore(toStore);

      const getData = source.get(userId);
      getData.onsuccess = () => {
        const data = getData.result;
        destination.add(data);
        source.delete(userId);
      };

      tx.oncomplete = () => resolve('Data moved');
      tx.onerror = () => reject(tx.error);
    });
  }
}

// ACID guarantee example
async function demonstrateACID() {
  const db = new TransactionalDB();

  try {
    // Either both succeed or both fail (Atomicity)
    await db.transfer(1, 2, 50);
    console.log('Transfer succeeded');
  } catch (error) {
    console.log('Transfer failed:', error.message);
    // No partial updates
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Indexes and Querying',
      id: 'indexes-and-querying'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Creating and using indexes
class IndexedDatabase {
  async setupStore(dbName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore('products', { keyPath: 'id' });

        // Create indexes for different queries
        store.createIndex('category', 'category'); // Non-unique
        store.createIndex('price', 'price');
        store.createIndex('name', 'name');
        store.createIndex('sku', 'sku', { unique: true }); // Unique index
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Query by index
  async queryByCategory(db, category) {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const index = store.index('category');

    const results = [];
    const range = IDBKeyRange.only(category);

    return new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Range queries
  async queryPriceRange(db, minPrice, maxPrice) {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const index = store.index('price');

    return new Promise((resolve, reject) => {
      const range = IDBKeyRange.bound(minPrice, maxPrice);
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Cursor for iteration
  async filterProducts(db, predicate) {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');

    const results = [];

    return new Promise((resolve, reject) => {
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (predicate(cursor.value)) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}

// IDBKeyRange examples
// Match exact value
IDBKeyRange.only(5);

// Range: min to max
IDBKeyRange.bound(10, 100);

// Open range (min, no max)
IDBKeyRange.lowerBound(50);

// Open range (max, no min)
IDBKeyRange.upperBound(100);

// Starts with (for strings)
IDBKeyRange.bound('A', 'B');`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Database Versioning and Migrations',
      id: 'versioning-and-migrations'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Handling database schema migrations
class MigratingDatabase {
  async open(dbName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 3); // Version 3

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;
        const newVersion = event.newVersion;

        console.log(\`Upgrading from v\${oldVersion} to v\${newVersion}\`);

        // Migration path: v1 -> v2
        if (oldVersion < 2) {
          const store = db.createObjectStore('users', { keyPath: 'id' });
          store.createIndex('email', 'email', { unique: true });
        }

        // Migration path: v2 -> v3
        if (oldVersion < 3) {
          const tx = event.target.transaction;
          const store = tx.objectStore('users');
          store.createIndex('createdAt', 'createdAt');
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Data migration between stores
  async migrateData(db, fromStore, toStore, transform) {
    const tx = db.transaction([fromStore, toStore], 'readwrite');
    const source = tx.objectStore(fromStore);
    const destination = tx.objectStore(toStore);

    return new Promise((resolve, reject) => {
      const request = source.openCursor();
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const transformed = transform(cursor.value);
          destination.add(transformed);
          cursor.continue();
          count++;
        } else {
          resolve(count);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Practical Patterns',
      id: 'practical-patterns'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Pattern 1: Promise wrapper for cleaner API
class IDBHelper {
  constructor(dbName, version) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        // Setup stores
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async add(store, data) {
    const tx = this.db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).add(data);
    return this.promisify(req);
  }

  async get(store, key) {
    const tx = this.db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    return this.promisify(req);
  }

  async getAll(store) {
    const tx = this.db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    return this.promisify(req);
  }

  async update(store, data) {
    const tx = this.db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(data);
    return this.promisify(req);
  }

  async delete(store, key) {
    const tx = this.db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(key);
    return this.promisify(req);
  }

  async clear(store) {
    const tx = this.db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).clear();
    return this.promisify(req);
  }

  promisify(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Pattern 2: Caching layer with IndexedDB
class CacheManager {
  constructor(dbName = 'cache') {
    this.db = new IDBHelper(dbName, 1);
  }

  async init() {
    await this.db.init();
  }

  async set(key, value, ttl = null) {
    const item = {
      key,
      value,
      timestamp: Date.now(),
      ttl
    };

    await this.db.add('cache', item);
  }

  async get(key) {
    const item = await this.db.get('cache', key);

    if (!item) return null;

    // Check TTL
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      await this.db.delete('cache', key);
      return null;
    }

    return item.value;
  }

  async cleanup() {
    const items = await this.db.getAll('cache');
    const now = Date.now();

    for (const item of items) {
      if (item.ttl && now - item.timestamp > item.ttl) {
        await this.db.delete('cache', item.key);
      }
    }
  }
}

// Pattern 3: Offline data sync
class OfflineSync {
  constructor(dbName = 'offline') {
    this.db = new IDBHelper(dbName, 1);
    this.queue = [];
  }

  async init() {
    await this.db.init();
    await this.loadQueue();
  }

  async queueAction(action, data) {
    const item = {
      id: Date.now(),
      action,
      data,
      timestamp: Date.now(),
      synced: false
    };

    await this.db.add('queue', item);
    this.queue.push(item);
  }

  async sync() {
    const unsynced = await this.db.getAll('queue');

    for (const item of unsynced) {
      try {
        await this.sendToServer(item);
        await this.db.update('queue', { ...item, synced: true });
      } catch (error) {
        console.error('Sync failed for', item.id, error);
      }
    }
  }

  async sendToServer(item) {
    const response = await fetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      throw new Error(\`Sync failed: \${response.statusText}\`);
    }
  }

  async loadQueue() {
    this.queue = await this.db.getAll('queue');
  }
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
      text: 'IndexedDB is a powerful NoSQL database for the browser supporting gigabytes of data. Use transactions for ACID compliance. Create indexes for efficient querying. Use IDBKeyRange for range queries. Handle database versioning in onupgradeneeded. Wrap IndexedDB API in Promises for cleaner code. Use for offline storage, caching, and large datasets.'
    }
  ],
  exercises: [
    'Create a database with multiple object stores and indexes',
    'Implement CRUD operations with proper error handling',
    'Build a query system using indexes and key ranges',
    'Create a migration system for schema updates',
    'Implement an offline sync system with queue management',
    'Build a cache manager with TTL support'
  ]
};