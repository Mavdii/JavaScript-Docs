import type { LessonContent } from '@/types/content';

export const generatorsLesson: LessonContent = {
  id: 'generators-001',
  title: 'JavaScript Generators and Iterators',
  description: 'Master generator functions and iterators for creating lazy sequences, controlling execution flow, and building powerful iteration patterns.',
  slug: 'learn/fundamentals/generators',
  pillar: 'learn',
  category: 'fundamentals',
  tags: ['generators', 'iterators', 'lazy-evaluation', 'yield', 'control-flow', 'sequences'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn how to create and use generator functions with the yield keyword, implement custom iterators, and leverage generators for lazy evaluation and elegant control flow patterns.',
  relatedTopics: ['functions', 'iteration', 'async-await'],
  order: 15,
  updatedAt: '2024-01-15T11:15:00Z',
  readingTime: 21,
  featured: false,
  keywords: ['generators', 'function*', 'yield', 'iterators', 'Symbol.iterator', 'lazy evaluation', 'next()'],
  prerequisites: ['functions', 'arrays', 'loops'],
  learningGoals: [
    'Understand generator functions and the yield keyword',
    'Learn how generators pause and resume execution',
    'Implement custom iterators using generator functions',
    'Use generators for lazy evaluation and memory efficiency',
    'Master generator delegation with yield*',
    'Apply generators to solve real-world problems'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'What are Generators?',
      id: 'what-are-generators'
    },
    {
      type: 'paragraph',
      text: 'A generator is a special function that can pause its execution and resume later. Generator functions are defined using the function* syntax and use the yield keyword to pause execution and return values. When called, they return a generator object that implements the Iterator protocol.'
    },
    {
      type: 'paragraph',
      text: 'Generators are incredibly useful for creating sequences of values lazily, managing asynchronous code, and implementing powerful iteration patterns without storing entire collections in memory.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Basic Generator Syntax',
      id: 'basic-generator-syntax'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Define a generator function
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

// Call the generator - returns a generator object, doesn't execute the function
const gen = simpleGenerator();

// Use next() to get values
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Or use for...of loop
function* countToThree() {
  yield 1;
  yield 2;
  yield 3;
}

for (const value of countToThree()) {
  console.log(value); // 1, 2, 3
}

// Spread operator works too
const values = [...simpleGenerator()];
console.log(values); // [1, 2, 3]`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Understanding the Iterator Protocol',
      id: 'iterator-protocol'
    },
    {
      type: 'paragraph',
      text: 'The Iterator protocol defines how to produce a sequence of values. Any object that implements the next() method returning {value, done} is an iterator. Generator functions automatically return iterators.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Generator creates an iterator automatically
function* numberGenerator() {
  yield 10;
  yield 20;
  yield 30;
}

const iter = numberGenerator();

// The iterator protocol: call next() repeatedly
let result = iter.next();
console.log(result); // { value: 10, done: false }

result = iter.next();
console.log(result); // { value: 20, done: false }

result = iter.next();
console.log(result); // { value: 30, done: false }

result = iter.next();
console.log(result); // { value: undefined, done: true }

// Manual iterator implementation (without generator)
const manualIterator = {
  [Symbol.iterator]() {
    let count = 0;
    return {
      next: () => {
        count++;
        if (count <= 3) {
          return { value: count * 10, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

// Use both the same way
for (const num of manualIterator) {
  console.log(num); // 10, 20, 30
}`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Yield: Pausing and Resuming Execution',
      id: 'yield-pause-resume'
    },
    {
      type: 'paragraph',
      text: 'The yield keyword pauses generator execution and returns a value. When next() is called again, execution resumes from where it paused. You can also send values back into generators using next(value).'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Yield pauses execution
function* countdown() {
  console.log('Starting countdown');
  yield 3;
  console.log('After first yield');
  yield 2;
  console.log('After second yield');
  yield 1;
  console.log('After third yield');
}

const gen = countdown();
console.log('Created generator');
console.log(gen.next()); // Logs: "Starting countdown", Returns: { value: 3, done: false }
console.log(gen.next()); // Logs: "After first yield", Returns: { value: 2, done: false }
console.log(gen.next()); // Logs: "After second yield", Returns: { value: 1, done: false }
console.log(gen.next()); // Logs: "After third yield", Returns: { value: undefined, done: true }

// Sending values back into generator
function* receiver() {
  const x = yield 'What is your name?';
  console.log('Name received:', x);
  
  const y = yield 'What is your age?';
  console.log('Age received:', y);
  
  return 'Done!';
}

const g = receiver();
console.log(g.next()); // { value: 'What is your name?', done: false }
console.log(g.next('Alice')); // Logs: "Name received: Alice", { value: 'What is your age?', done: false }
console.log(g.next(30)); // Logs: "Age received: 30", { value: 'Done!', done: true }`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Practical Generator Patterns',
      id: 'practical-patterns'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Pattern 1: Infinite Sequences',
      id: 'infinite-sequences'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Infinite number generator
function* infiniteNumbers() {
  let num = 0;
  while (true) {
    yield num++;
  }
}

// Take only first 5 numbers
const gen = infiniteNumbers();
for (let i = 0; i < 5; i++) {
  console.log(gen.next().value); // 0, 1, 2, 3, 4
}

// Fibonacci sequence
function* fibonacci() {
  let prev = 0, curr = 1;
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

// Get first 10 Fibonacci numbers
const fib = fibonacci();
const firstTen = [];
for (let i = 0; i < 10; i++) {
  firstTen.push(fib.next().value);
}
console.log(firstTen); // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

// Unique ID generator
function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}

const getId = idGenerator();
console.log(getId.next().value); // 1
console.log(getId.next().value); // 2
console.log(getId.next().value); // 3`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Pattern 2: Lazy Evaluation',
      id: 'lazy-evaluation'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Lazy range - only generates numbers as needed
function* range(start, end) {
  console.log('Starting range');
  for (let i = start; i < end; i++) {
    console.log(\`Yielding \${i}\`);
    yield i;
  }
}

// Numbers aren't generated until we iterate
const rangeGen = range(1, 5);

// Only first number is generated until we call next()
console.log(rangeGen.next()); // Logs: "Starting range", "Yielding 1", { value: 1, done: false }
console.log(rangeGen.next()); // Logs: "Yielding 2", { value: 2, done: false }

// Lazy filter
function* lazyFilter(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

// Lazy map
function* lazyMap(iterable, transform) {
  for (const item of iterable) {
    yield transform(item);
  }
}

// Combine lazy operations - only processes needed items
const numbers = range(1, 1000000);
const evens = lazyFilter(numbers, n => n % 2 === 0);
const doubled = lazyMap(evens, n => n * 2);

// Get only first 3 doubled even numbers
const result = [];
for (const num of doubled) {
  result.push(num);
  if (result.length === 3) break;
}
console.log(result); // [2, 4, 6] - only computed 3 items despite large range`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Pattern 3: Generator Delegation with yield*',
      id: 'generator-delegation'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// yield* delegates to another generator
function* inner() {
  yield 1;
  yield 2;
  yield 3;
}

function* outer() {
  yield 'a';
  yield* inner();
  yield 'b';
}

for (const value of outer()) {
  console.log(value); // 'a', 1, 2, 3, 'b'
}

// Recursive generator with yield*
function* tree(node) {
  yield node.value;
  if (node.left) {
    yield* tree(node.left);
  }
  if (node.right) {
    yield* tree(node.right);
  }
}

const binaryTree = {
  value: 1,
  left: { value: 2, left: null, right: null },
  right: { value: 3, left: null, right: null }
};

for (const val of tree(binaryTree)) {
  console.log(val); // 1, 2, 3
}

// Flatten nested arrays
function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}

const nested = [1, [2, 3], [4, [5, 6]]];
console.log([...flatten(nested)]); // [1, 2, 3, 4, 5, 6]`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Generators vs Arrays: Memory Efficiency',
      id: 'memory-efficiency'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Array approach - stores all values in memory
function rangeArray(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// Generator approach - computes on demand
function* rangeGenerator(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

// Creating a large range with array uses lots of memory
const arrayRange = rangeArray(1, 1000000); // Stores 1 million numbers

// Creating a large range with generator uses minimal memory
const genRange = rangeGenerator(1, 1000000); // Stores just the generator state

// Get first 10 numbers from each
const arrayFirst10 = arrayRange.slice(0, 10);
let genFirst10 = [];
for (const num of genRange) {
  genFirst10.push(num);
  if (genFirst10.length === 10) break;
}

console.log(arrayFirst10); // [1, 2, ..., 10]
console.log(genFirst10); // [1, 2, ..., 10]

// Generator composition for complex transformations
function* processLargeFile(lines) {
  for (const line of lines) {
    const data = JSON.parse(line);
    yield data;
  }
}

function* filterByType(data, type) {
  for (const item of data) {
    if (item.type === type) {
      yield item;
    }
  }
}

function* limit(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count++ < n) {
      yield item;
    } else {
      break;
    }
  }
}

// Process large file without loading all into memory
const fileLines = ['{"type":"A","value":1}', '{"type":"B","value":2}'];
const result = limit(
  filterByType(processLargeFile(fileLines), 'A'),
  10
);

for (const item of result) {
  console.log(item);
}`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Creating Custom Iterables',
      id: 'custom-iterables'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Creating an iterable class using generator
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i < this.end; i++) {
      yield i;
    }
  }
}

const range = new Range(1, 5);
console.log([...range]); // [1, 2, 3, 4]

for (const num of range) {
  console.log(num);
}

// Custom iterable for linked list
class LinkedList {
  constructor(...values) {
    this.head = null;
    for (const value of values) {
      this.add(value);
    }
  }

  add(value) {
    const node = { value, next: null };
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
  }

  *[Symbol.iterator]() {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

const list = new LinkedList(10, 20, 30, 40);
for (const value of list) {
  console.log(value); // 10, 20, 30, 40
}`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Advanced: Generators with Error Handling',
      id: 'error-handling'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Generator with error handling using throw()
function* errorHandler() {
  try {
    const x = yield 'Ready for a number';
    console.log('Received:', x);
    const y = yield 'Ready for another';
    console.log('Received:', y);
  } catch (err) {
    console.error('Caught error:', err.message);
  }
}

const gen = errorHandler();
console.log(gen.next()); // { value: 'Ready for a number', done: false }
console.log(gen.next(42)); // Logs: "Received: 42", { value: 'Ready for another', done: false }
console.log(gen.throw(new Error('Something went wrong'))); // Logs: "Caught error: Something went wrong"

// Generator with return value
function* withReturn() {
  yield 1;
  yield 2;
  return 'finished';
}

const g = withReturn();
console.log(g.next()); // { value: 1, done: false }
console.log(g.next()); // { value: 2, done: false }
console.log(g.next()); // { value: 'finished', done: true }

// Early termination with return()
function* earlyExit() {
  yield 1;
  yield 2;
  yield 3;
}

const ge = earlyExit();
console.log(ge.next()); // { value: 1, done: false }
console.log(ge.return('stopped early')); // { value: 'stopped early', done: true }
console.log(ge.next()); // { value: undefined, done: true }`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Real-World Examples',
      id: 'real-world-examples'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Example 1: Pagination with Generators',
      id: 'pagination-example'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// API paginator
function* paginate(url, pageSize = 10) {
  let page = 1;
  while (true) {
    const response = yield fetch(\`\${url}?page=\${page}&size=\${pageSize}\`);
    const data = yield response.json();
    
    for (const item of data.items) {
      yield item;
    }
    
    if (!data.hasNextPage) {
      break;
    }
    page++;
  }
}

// Usage
async function processAllPages() {
  const paginator = paginate('https://api.example.com/users');
  
  for await (const user of paginator) {
    console.log(user);
  }
}

// Async generator version (cleaner)
async function* asyncPaginate(url, pageSize = 10) {
  let page = 1;
  while (true) {
    const response = await fetch(\`\${url}?page=\${page}&size=\${pageSize}\`);
    const data = await response.json();
    
    for (const item of data.items) {
      yield item;
    }
    
    if (!data.hasNextPage) {
      break;
    }
    page++;
  }
}

async function processPages() {
  for await (const user of asyncPaginate('https://api.example.com/users')) {
    console.log(user);
  }
}`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Example 2: State Machine with Generators',
      id: 'state-machine-example'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Traffic light state machine
function* trafficLight() {
  while (true) {
    yield 'red';
    console.log('STOP');
    yield 'yellow';
    console.log('CAUTION');
    yield 'green';
    console.log('GO');
  }
}

const light = trafficLight();
for (let i = 0; i < 6; i++) {
  const color = light.next().value;
  console.log('Light is', color);
}

// Stateful generator for input handling
function* commandProcessor() {
  let isAuthenticated = false;
  
  while (true) {
    const command = yield;
    
    if (command === 'login') {
      isAuthenticated = true;
      console.log('Logged in');
    } else if (command === 'logout') {
      isAuthenticated = false;
      console.log('Logged out');
    } else if (isAuthenticated && command === 'getData') {
      console.log('Retrieving data...');
    } else {
      console.log('Not authenticated or unknown command');
    }
  }
}

const processor = commandProcessor();
processor.next(); // Start the generator
processor.next('getData'); // "Not authenticated or unknown command"
processor.next('login'); // "Logged in"
processor.next('getData'); // "Retrieving data..."
processor.next('logout'); // "Logged out"`,
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
      text: 'Generators are functions that can pause and resume using yield. They implement the Iterator protocol with next(). Generators are lazy - values are computed on-demand, saving memory. yield* delegates to another generator or iterable. Use generators for infinite sequences, lazy evaluation, and memory-efficient processing. Generators are more readable than manually implementing iterators.'
    }
  ],
  exercises: [
    'Create a generator that produces the Fibonacci sequence and extract the first 20 numbers',
    'Implement a range generator and use it with lazy filtering and mapping',
    'Build a custom iterable class that uses a generator in Symbol.iterator',
    'Create an infinite ID generator and use it with a limiting function',
    'Implement a file reader generator that processes lines lazily',
    'Build a state machine using generators for a complex workflow'
  ]
};
