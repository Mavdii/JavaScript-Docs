import type { LessonContent } from '@/types/content';

export const mapsSetsLesson: LessonContent = {
  id: 'maps-sets-001',
  title: 'Maps and Sets in JavaScript',
  description: 'Master Map and Set collections for efficient data storage and manipulation, understanding their advantages over plain objects and arrays.',
  slug: 'learn/fundamentals/maps-sets',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['collections', 'maps', 'sets', 'data-structures', 'objects', 'arrays'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'Learn how to use Map and Set collections for superior performance and functionality compared to objects and arrays. Understand iteration, weak variants, and practical use cases.',
  relatedTopics: ['objects', 'arrays', 'iterables', 'data-types'],
  order: 13,
  updatedAt: '2024-01-15T10:45:00Z',
  readingTime: 20,
  featured: false,
  keywords: ['Map', 'Set', 'WeakMap', 'WeakSet', 'collections', 'key-value pairs', 'unique values'],
  prerequisites: ['objects', 'arrays', 'iteration'],
  learningGoals: [
    'Understand the difference between Map/Set and objects/arrays',
    'Master Map for key-value storage with any type of key',
    'Use Set for storing unique values efficiently',
    'Learn about WeakMap and WeakSet and their garbage collection benefits',
    'Apply Maps and Sets to solve real-world problems'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Introduction to Map',
      id: 'introduction-to-map'
    },
    {
      type: 'paragraph',
      text: 'A Map is a collection of key-value pairs where keys can be any type of value, unlike plain JavaScript objects where keys are always strings or Symbols. Maps are designed for efficient lookups and maintain insertion order.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Creating Maps
const emptyMap = new Map();

// Map with initial values
const map = new Map([
  ['name', 'Alice'],
  ['age', 30],
  [1, 'numeric key'],
  [{}, 'object key']
]);

// Adding and accessing values
map.set('city', 'New York');
console.log(map.get('name')); // "Alice"
console.log(map.get(1)); // "numeric key"

// Check if key exists
console.log(map.has('age')); // true
console.log(map.has('email')); // false

// Delete and clear
map.delete('age');
console.log(map.size); // 3 (one less than before)
map.clear();
console.log(map.size); // 0`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Map vs Object',
      id: 'map-vs-object'
    },
    {
      type: 'paragraph',
      text: 'While objects can store key-value pairs, Maps offer several advantages including any type of key, built-in size property, better performance for frequent additions/deletions, and predictable iteration order.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `const obj = {};
const map = new Map();

// Objects: Keys are always coerced to strings
obj[1] = 'number key';
obj['1'] = 'string key';
console.log(obj[1]); // "string key" (overwrites the number key)

// Maps: Different key types are kept separate
map.set(1, 'number key');
map.set('1', 'string key');
console.log(map.get(1)); // "number key"
console.log(map.get('1')); // "string key"

// Objects: Can't efficiently check size
const objKeys = Object.keys(obj);
const objSize = objKeys.length;

// Maps: Built-in size property
const mapSize = map.size;

// Performance: Adding/deleting from objects is slower
const largeObj = {};
const largeMap = new Map();

console.time('Object add');
for (let i = 0; i < 100000; i++) {
  largeObj[i] = i;
}
console.timeEnd('Object add');

console.time('Map add');
for (let i = 0; i < 100000; i++) {
  largeMap.set(i, i);
}
console.timeEnd('Map add');`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Iterating Over Maps',
      id: 'iterating-maps'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

// for...of loop (iterates entries)
for (const [key, value] of map) {
  console.log(\`\${key}: \${value}\`);
}

// entries() method
for (const [key, value] of map.entries()) {
  console.log(\`\${key}: \${value}\`);
}

// keys() method
for (const key of map.keys()) {
  console.log(key);
}

// values() method
for (const value of map.values()) {
  console.log(value);
}

// forEach() method
map.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`);
});

// Convert to array
const entries = [...map];
const keys = [...map.keys()];
const values = [...map.values()];`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Introduction to Set',
      id: 'introduction-to-set'
    },
    {
      type: 'paragraph',
      text: 'A Set is a collection of unique values. Unlike arrays, Sets automatically prevent duplicates and offer efficient membership testing through the has() method.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Creating Sets
const emptySet = new Set();

// Set with initial values
const set = new Set([1, 2, 3, 2, 1]);
console.log(set.size); // 3 (duplicates removed)

// Adding values
set.add(4);
set.add(2); // Duplicate, has no effect
console.log(set.size); // 4

// Check membership
console.log(set.has(3)); // true
console.log(set.has(5)); // false

// Remove values
set.delete(2);
console.log(set.size); // 3

// Clear all
set.clear();
console.log(set.size); // 0`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Set vs Array for Uniqueness',
      id: 'set-vs-array'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Remove duplicates from array using Set
const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4]

// Using array indexOf (slow O(n) lookup)
function hasDuplicateArray(arr) {
  for (const item of arr) {
    if (arr.indexOf(item) !== arr.lastIndexOf(item)) {
      return true;
    }
  }
  return false;
}

// Using Set (fast O(1) lookup)
function hasDuplicateSet(arr) {
  return new Set(arr).size !== arr.length;
}

// Performance comparison
const largeArray = Array.from({ length: 10000 }, (_, i) => i);
largeArray.push(5000); // Add duplicate

console.time('Array duplicate check');
hasDuplicateArray(largeArray);
console.timeEnd('Array duplicate check');

console.time('Set duplicate check');
hasDuplicateSet(largeArray);
console.timeEnd('Set duplicate check');

// Set with object values maintains uniqueness by reference
const obj1 = { id: 1 };
const obj2 = { id: 1 };
const setOfObjects = new Set();
setOfObjects.add(obj1);
setOfObjects.add(obj2);
console.log(setOfObjects.size); // 2 (different objects)`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Iterating Over Sets',
      id: 'iterating-sets'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `const set = new Set(['apple', 'banana', 'cherry']);

// for...of loop
for (const value of set) {
  console.log(value);
}

// values() method (same as for...of)
for (const value of set.values()) {
  console.log(value);
}

// keys() method (same as values() for Sets)
for (const value of set.keys()) {
  console.log(value);
}

// entries() method (returns [value, value] pairs)
for (const [value, valueAgain] of set.entries()) {
  console.log(value, valueAgain);
}

// forEach() method
set.forEach((value) => {
  console.log(value);
});

// Convert to array
const array = [...set];
const filtered = [...set].filter(item => item.length > 5);
console.log(filtered); // ['banana', 'cherry']`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'WeakMap and WeakSet',
      id: 'weakmap-and-weakset'
    },
    {
      type: 'paragraph',
      text: 'WeakMap and WeakSet are variants that hold weak references to their contents, allowing garbage collection when the referenced objects are no longer used elsewhere. This is useful for metadata and private data.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// WeakMap: Keys must be objects, references are weak
const weakMap = new WeakMap();
const user = { id: 1, name: 'Alice' };
weakMap.set(user, { permissions: ['read', 'write'] });
console.log(weakMap.get(user)); // { permissions: ['read', 'write'] }

// If user is garbage collected, the entry is removed
// Note: WeakMap doesn't have size property or iteration methods

// Practical use: Private data for objects
const UserClass = (() => {
  const privateData = new WeakMap();

  class User {
    constructor(name) {
      this.name = name;
      privateData.set(this, { password: 'secret' });
    }

    getPrivateData() {
      return privateData.get(this);
    }
  }

  return User;
})();

const user1 = new UserClass('Bob');
console.log(user1.getPrivateData()); // { password: 'secret' }
console.log(user1.password); // undefined (not accessible directly)

// WeakSet: Values must be objects, references are weak
const weakSet = new WeakSet();
const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);
console.log(weakSet.has(obj1)); // true

// Practical use: Tracking objects without affecting garbage collection
const visitedObjects = new WeakSet();

function processObject(obj) {
  if (visitedObjects.has(obj)) {
    return 'Already processed';
  }
  visitedObjects.add(obj);
  return 'Processed for first time';
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Practical Use Cases and Examples',
      id: 'practical-use-cases'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Use Case 1: Caching with Map',
      id: 'caching-with-map'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Simple cache implementation using Map
class Cache {
  constructor(maxSize = 100) {
    this.map = new Map();
    this.maxSize = maxSize;
  }

  set(key, value) {
    // If key exists, delete it first to move it to the end
    if (this.map.has(key)) {
      this.map.delete(key);
    }

    this.map.set(key, value);

    // Remove oldest entry if size exceeded
    if (this.map.size > this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
  }

  get(key) {
    return this.map.get(key);
  }

  has(key) {
    return this.map.has(key);
  }
}

// Usage
const cache = new Cache(3);
cache.set('user:1', { name: 'Alice' });
cache.set('user:2', { name: 'Bob' });
cache.set('user:3', { name: 'Charlie' });
cache.set('user:4', { name: 'David' }); // Removes user:1

console.log(cache.has('user:1')); // false
console.log(cache.has('user:2')); // true`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Use Case 2: Frequency Counter with Map',
      id: 'frequency-counter'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Count frequency of words in text
function countWords(text) {
  const wordMap = new Map();
  const words = text.toLowerCase().match(/\\b\\w+\\b/g) || [];

  for (const word of words) {
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
  }

  return wordMap;
}

const text = 'the quick brown fox jumps over the lazy dog';
const frequencies = countWords(text);

// Sort by frequency
const sorted = [...frequencies]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

console.log(sorted);
// [['the', 2], ['quick', 1], ['brown', 1], ['fox', 1], ['jumps', 1]]`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Use Case 3: Finding Unique Items with Set',
      id: 'unique-items-with-set'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Find common elements between arrays
function findIntersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter(item => set2.has(item));
}

console.log(findIntersection([1, 2, 3, 4], [3, 4, 5, 6])); // [3, 4]

// Union of arrays
function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}

console.log(union([1, 2, 3], [3, 4, 5])); // [1, 2, 3, 4, 5]

// Difference between arrays
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(item => !set2.has(item));
}

console.log(difference([1, 2, 3, 4], [3, 4])); // [1, 2]`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Use Case 4: Event Listener Management with Set',
      id: 'event-listener-management'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Manage unique event listeners
class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        callback(data);
      }
    }
  }
}

// Usage
const emitter = new EventEmitter();

const handleClick = (data) => console.log('Click:', data);
const handleHover = (data) => console.log('Hover:', data);

emitter.on('click', handleClick);
emitter.on('click', handleHover);

emitter.emit('click', { x: 10, y: 20 });
// Output: Click: { x: 10, y: 20 }
// Output: Hover: { x: 10, y: 20 }

emitter.off('click', handleHover);
emitter.emit('click', { x: 30, y: 40 });
// Output: Click: { x: 30, y: 40 }`,
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
      text: 'Use Map for key-value storage when you need non-string keys or frequent additions/deletions. Use Set to maintain unique values and for efficient membership testing. Maps and Sets preserve insertion order and offer better performance than objects/arrays for certain operations. WeakMap and WeakSet allow garbage collection and are perfect for metadata storage. Choose the right data structure based on your use case for cleaner, more efficient code.'
    }
  ],
  exercises: [
    'Create a Map-based student grade tracker with add, remove, and query functionality',
    'Implement a Set-based solution to find all unique characters in a string',
    'Build a cache system using Map with a maximum size limit (LRU cache)',
    'Compare the performance of Set.has() vs Array.includes() with large datasets',
    'Create an event emitter class using Map and Set for managing listeners',
    'Solve set operations (union, intersection, difference) using Set data structure'
  ]
};
