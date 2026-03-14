import type { IntegrationContent } from '@/types/content';

export const firebaseIntegration: IntegrationContent = {
  id: 'integration-firebase',
  title: 'Firebase & BaaS',
  description: 'Build backend-free applications using Firebase for authentication, database, storage, and hosting.',
  slug: 'integrations/firebase',
  pillar: 'integrations',
  category: 'backend',
  tags: ['firebase', 'firestore', 'authentication', 'realtime', 'baas'],
  difficulty: 'beginner',
  contentType: 'integration',
  summary: 'Learn Firebase fundamentals — Firestore CRUD operations, real-time listeners, authentication, file storage, security rules, and offline persistence.',
  relatedTopics: ['integration-rest-apis'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 24,
  featured: true,
  keywords: ['Firebase', 'Firestore', 'Realtime Database', 'Auth', 'Storage', 'security rules'],
  requiredLibraries: ['firebase', 'react-firebase-hooks (optional)'],
  setupSteps: ['Create Firebase project', 'Get config from console', 'Initialize Firebase in app', 'Enable services (Auth, Firestore, Storage)'],
  authNotes: 'Use Firebase Auth for secure user management. Security rules enforce access control at database level.',
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Firebase Setup & Initialization',
      id: 'setup',
    },
    {
      type: 'paragraph',
      text: 'Firebase is a platform that provides backend services without needing to manage servers. Start by creating a project in Firebase Console and initializing the SDK.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config from console
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'myproject.firebaseapp.com',
  projectId: 'myproject',
  storageBucket: 'myproject.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open
    console.log('Multiple tabs, offline disabled');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support
    console.log("Browser doesn't support offline");
  }
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Firebase Authentication',
      id: 'authentication',
    },
    {
      type: 'paragraph',
      text: 'Firebase Auth handles user signup, login, password reset, and multi-factor authentication. It supports email/password, Google, Facebook, and many other providers.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

// Sign up with email/password
async function signup(email: string, password: string): Promise<string> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user.uid;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already registered');
    }
    throw new Error(error.message);
  }
}

// Sign in
async function login(email: string, password: string): Promise<string> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user.uid;
}

// Sign in with Google
async function signInWithGoogle(): Promise<string> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  return credential.user.uid;
}

// Sign out
async function logout(): Promise<void> {
  await signOut(auth);
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.uid, user.email);
  } else {
    console.log('User logged out');
  }
});

// Reset password
async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Firestore CRUD Operations',
      id: 'firestore-crud',
    },
    {
      type: 'paragraph',
      text: 'Firestore is a NoSQL cloud database. Documents are organized in collections. Each document is a JSON object with fields.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Create (Add to collection)
async function createUser(userData: Omit<User, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'users'), {
    ...userData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Create with specific ID (Set)
async function createUserWithId(userId: string, userData: Omit<User, 'id'>): Promise<void> {
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: Timestamp.now(),
  });
}

// Read single document
async function getUser(userId: string): Promise<User | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  }
  return null;
}

// Read multiple documents (Query)
async function getActiveUsers(): Promise<User[]> {
  const q = query(
    collection(db, 'users'),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];
}

// Update
async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, updates);
}

// Delete
async function deleteUser(userId: string): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await deleteDoc(docRef);
}

// Batch operations
import { writeBatch } from 'firebase/firestore';

async function batchUpdateUsers(updates: Record<string, Partial<User>>): Promise<void> {
  const batch = writeBatch(db);

  Object.entries(updates).forEach(([userId, data]) => {
    const docRef = doc(db, 'users', userId);
    batch.update(docRef, data);
  });

  await batch.commit();
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Real-time Listeners',
      id: 'listeners',
    },
    {
      type: 'paragraph',
      text: 'Real-time listeners automatically update your app when data changes in Firestore. Perfect for collaborative features and live feeds.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { onSnapshot } from 'firebase/firestore';

// Listen to single document
function subscribeToUser(userId: string): () => void {
  const docRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const user = { id: docSnap.id, ...docSnap.data() };
      console.log('User updated:', user);
      // Update UI here
    }
  }, (error) => {
    console.error('Listen failed:', error);
  });

  // Return unsubscribe function to stop listening
  return unsubscribe;
}

// Listen to query results
function subscribeToPosts(userId: string): () => void {
  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts: any[] = [];

    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    console.log('Posts updated:', posts);
    // Update UI with posts

    // Get changes since last snapshot
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        console.log('New post:', change.doc.data());
      } else if (change.type === 'modified') {
        console.log('Modified post:', change.doc.data());
      } else if (change.type === 'removed') {
        console.log('Removed post:', change.doc.data());
      }
    });
  });

  return unsubscribe;
}

// React hook for listeners
import { useState, useEffect } from 'react';

function useRealtimeData<T>(path: string, queryConstraints: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const q = query(collection(db, path), ...queryConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [path]);

  return { data, loading, error };
}

// Usage in component
function PostsList() {
  const { data: posts, loading } = useRealtimeData('posts', [
    orderBy('createdAt', 'desc'),
    limit(20),
  ]);

  return (
    <div>
      {loading ? 'Loading...' : posts.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'File Storage',
      id: 'storage',
    },
    {
      type: 'paragraph',
      text: 'Cloud Storage lets you store images, videos, and files. Upload with progress tracking, delete, and generate download URLs.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

// Simple upload
async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

// Upload with progress tracking
async function uploadWithProgress(
  file: File,
  path: string,
  onProgress: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// Upload profile picture
async function uploadProfilePicture(userId: string, file: File): Promise<void> {
  const path = \`users/\${userId}/profile.jpg\`;
  const url = await uploadFile(file, path);

  // Save URL to Firestore
  await updateDoc(doc(db, 'users', userId), { photoURL: url });
}

// Delete file
async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Security Rules',
      id: 'security-rules',
    },
    {
      type: 'paragraph',
      text: 'Security rules control who can read/write data. They execute server-side so users can\'t bypass them. Always write rules before going to production.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Firestore rules example
\`\`\`
// Allow public read, only owner can write
match /posts/{document=**} {
  allow read: if true;
  allow write: if request.auth.uid == resource.data.authorId;
}

// Only authenticated users can access
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Admins can do anything
match /{document=**} {
  allow read, write: if request.auth.token.role == 'admin';
}

// Public data can be read, only owner can write
match /profiles/{userId} {
  allow read: if true;
  allow write: if request.auth.uid == userId;
}

// Check field values
match /posts/{postId} {
  allow create: if request.resource.data.authorId == request.auth.uid &&
                   request.resource.data.content.size() <= 5000;
  allow update: if resource.data.authorId == request.auth.uid;
  allow delete: if resource.data.authorId == request.auth.uid;
}
\`\`\`

// Storage security rules
\`\`\`
// Allow users to upload to their own folder
match /b/{bucket}/o {
  match /users/{userId}/{allPaths=**} {
    allow read: if true;
    allow write: if request.auth.uid == userId &&
                    request.resource.size < 5 * 1024 * 1024; // 5MB limit
  }
}
\`\`\``,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Offline Support',
      id: 'offline',
    },
    {
      type: 'paragraph',
      text: 'Firestore\'s offline persistence automatically syncs changes when the connection returns. Data is stored locally in IndexedDB.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { enableIndexedDbPersistence, disableNetwork, enableNetwork } from 'firebase/firestore';

// Enable offline persistence (done at initialization)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.log("Browser doesn't support");
  }
});

// Detect offline/online
window.addEventListener('online', async () => {
  console.log('Back online');
  await enableNetwork(db);
});

window.addEventListener('offline', async () => {
  console.log('Offline');
  await disableNetwork(db);
});

// Check connection state
import { getConnectivityState } from 'firebase/firestore';

const state = await getConnectivityState(db);
if (state === 'Online') {
  console.log('Connected to Firestore');
} else {
  console.log('Using offline cache');
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Error Handling & Best Practices',
      id: 'error-handling',
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Always Have Security Rules',
      text: 'By default, Firestore denies all access. Start with restrictive rules and open up only what your app needs.',
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Index Your Queries',
      text: 'Complex queries need indexes. Firebase creates them automatically on first run, but you can create them manually in the console.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Error handling
async function safeUpdate(userId: string, data: any): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    return true;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Access denied');
    } else if (error.code === 'not-found') {
      console.error('Document not found');
    } else if (error.code === 'unavailable') {
      console.error('Service temporarily unavailable');
    }
    return false;
  }
}

// Validate before write
async function createPost(authorId: string, content: string): Promise<string | null> {
  if (!content || content.length === 0) {
    throw new Error('Content is required');
  }

  if (content.length > 5000) {
    throw new Error('Content too long');
  }

  if (!authorId) {
    throw new Error('Must be authenticated');
  }

  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      authorId,
      content,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Failed to create post:', error);
    return null;
  }
}`,
    },
    {
      type: 'table',
      headers: ['Feature', 'Firebase', 'When to Use'],
      rows: [
        ['Firestore', 'NoSQL document DB', 'Real-time apps, flexible schema'],
        ['Realtime DB', 'JSON tree DB', 'Simple chat, leaderboards'],
        ['Cloud Functions', 'Serverless code', 'Validation, notifications'],
        ['Cloud Storage', 'File storage', 'Images, videos, user uploads'],
      ],
    },
  ],
};
