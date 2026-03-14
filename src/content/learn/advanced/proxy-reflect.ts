import type { LessonContent } from '@/types/content';

export const proxyReflectLesson: LessonContent = {
  id: 'proxy-reflect-001',
  title: 'Proxy and Reflect API',
  description: 'Master metaprogramming with Proxy and Reflect to intercept and customize fundamental object operations.',
  slug: 'learn/advanced/proxy-reflect',
  pillar: 'learn',
  category: 'advanced',
  tags: ['proxy', 'reflect', 'metaprogramming', 'interception', 'object-operations'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn to use Proxy to intercept object operations and Reflect for metaprogramming. Understand traps, handlers, and practical applications for validation, caching, and more.',
  relatedTopics: ['objects', 'properties', 'descriptors'],
  order: 8,
  updatedAt: '2024-01-15T11:45:00Z',
  readingTime: 23,
  featured: false,
  keywords: ['Proxy', 'Reflect', 'metaprogramming', 'traps', 'handlers', 'interception', 'object operations'],
  prerequisites: ['objects', 'getters-setters', 'symbol'],
  learningGoals: [
    'Understand Proxy and what problems it solves',
    'Master all Proxy traps and handlers',
    'Learn the Reflect API and its symmetry with Proxy',
    'Implement validation and type checking with Proxy',
    'Create caching layers and lazy loading with Proxy',
    'Apply Proxy to real-world scenarios'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Introduction to Proxy',
      id: 'introduction-to-proxy'
    },
    {
      type: 'paragraph',
      text: 'A Proxy is a special object that lets you intercept and customize fundamental operations on another object. It acts as a middleman between code and the actual object, allowing you to add custom behavior to basic operations like reading, writing, and deleting properties.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Basic Proxy syntax
const target = { name: 'Alice', age: 30 };

const handler = {
  get(target, property) {
    console.log(\`Getting property: \${property}\`);
    return target[property];
  },

  set(target, property, value) {
    console.log(\`Setting \${property} to \${value}\`);
    target[property] = value;
    return true; // Indicates success
  }
};

const proxy = new Proxy(target, handler);

// All operations go through the handler
console.log(proxy.name); // Logs: "Getting property: name", returns "Alice"
proxy.age = 31; // Logs: "Setting age to 31"

// The target object is modified
console.log(target.age); // 31

// The proxy and target are different
console.log(proxy === target); // false`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Proxy Traps: Fundamental Operations',
      id: 'proxy-traps'
    },
    {
      type: 'paragraph',
      text: 'Proxy handlers define "traps" for different operations. Each trap intercepts a specific type of operation and allows you to customize its behavior.'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Property Access Traps',
      id: 'property-access-traps'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// get trap: intercept property reading
const user = { firstName: 'John', lastName: 'Doe' };

const getUserProxy = new Proxy(user, {
  get(target, property) {
    if (property === 'fullName') {
      return \`\${target.firstName} \${target.lastName}\`;
    }
    return target[property];
  }
});

console.log(getUserProxy.fullName); // "John Doe" (computed)
console.log(getUserProxy.firstName); // "John" (direct)

// set trap: intercept property assignment
const strictProxy = new Proxy({}, {
  set(target, property, value) {
    if (typeof value !== 'string') {
      throw new TypeError(\`\${property} must be a string\`);
    }
    target[property] = value;
    return true;
  }
});

strictProxy.name = 'Alice'; // Works
console.log(strictProxy.name); // "Alice"

try {
  strictProxy.age = 30; // Throws TypeError
} catch (error) {
  console.error(error.message); // "age must be a string"
}

// has trap: intercept 'in' operator
const privateProxy = new Proxy({ public: 'data', _private: 'secret' }, {
  has(target, property) {
    return !property.startsWith('_') && property in target;
  }
});

console.log('public' in privateProxy); // true
console.log('_private' in privateProxy); // false (even though it exists)

// deleteProperty trap: intercept delete operator
const protectedProxy = new Proxy({ permanent: 'value', removable: 'value' }, {
  deleteProperty(target, property) {
    if (property === 'permanent') {
      console.log('Cannot delete permanent property');
      return false; // Deletion failed
    }
    delete target[property];
    return true;
  }
});

delete protectedProxy.removable; // Succeeds
console.log('removable' in protectedProxy); // false

delete protectedProxy.permanent; // Logs warning
console.log('permanent' in protectedProxy); // true (still there)`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Property Descriptor Traps',
      id: 'descriptor-traps'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// getOwnPropertyDescriptor trap
const obj = { x: 10 };

const descriptorProxy = new Proxy(obj, {
  getOwnPropertyDescriptor(target, property) {
    console.log(\`Getting descriptor for \${property}\`);
    const descriptor = Object.getOwnPropertyDescriptor(target, property);
    if (descriptor && descriptor.value % 2 === 0) {
      descriptor.enumerable = false; // Hide even numbers
    }
    return descriptor;
  }
});

const desc = Object.getOwnPropertyDescriptor(descriptorProxy, 'x');
console.log(desc); // { value: 10, enumerable: false, ... }

// defineProperty trap: prevent certain properties
const strictSchema = new Proxy({}, {
  defineProperty(target, property, descriptor) {
    const allowedProperties = ['name', 'age', 'email'];

    if (!allowedProperties.includes(property)) {
      throw new Error(\`Property \${property} not allowed\`);
    }

    return Reflect.defineProperty(target, property, descriptor);
  }
});

Object.defineProperty(strictSchema, 'name', { value: 'Alice' }); // Works
console.log(strictSchema.name); // "Alice"

try {
  Object.defineProperty(strictSchema, 'salary', { value: 50000 }); // Throws
} catch (error) {
  console.error(error.message); // "Property salary not allowed"
}`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Object Introspection Traps',
      id: 'introspection-traps'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// ownKeys trap: intercept Object.keys(), Object.entries(), etc.
const hiddenProxy = new Proxy(
  { public: 1, _private: 2, __internal: 3 },
  {
    ownKeys(target) {
      return Object.keys(target).filter(key => !key.startsWith('_'));
    },

    getOwnPropertyDescriptor(target, property) {
      if (property.startsWith('_')) {
        return undefined;
      }
      return Object.getOwnPropertyDescriptor(target, property);
    }
  }
);

console.log(Object.keys(hiddenProxy)); // ["public"]
console.log(Object.entries(hiddenProxy)); // [["public", 1]]

// getPrototypeOf and setPrototypeOf traps
const protoProxy = new Proxy(Object.create(null), {
  getPrototypeOf(target) {
    console.log('Getting prototype');
    return Array.prototype; // Pretend to inherit from Array
  },

  setPrototypeOf(target, proto) {
    console.log('Attempted to set prototype');
    return false; // Prevent prototype changes
  }
});

console.log(Object.getPrototypeOf(protoProxy) === Array.prototype); // true
Object.setPrototypeOf(protoProxy, Object.prototype); // Logs, doesn't actually change`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Function Call Traps',
      id: 'function-call-traps'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// apply trap: intercept function calls
function originalAdd(a, b) {
  return a + b;
}

const addProxy = new Proxy(originalAdd, {
  apply(target, thisArg, args) {
    console.log(\`Function called with args: \${args.join(', ')}\`);
    
    // Validate arguments
    if (args.some(arg => typeof arg !== 'number')) {
      throw new TypeError('All arguments must be numbers');
    }

    return target.apply(thisArg, args);
  }
});

console.log(addProxy(5, 3)); // Logs: "Function called with args: 5, 3", returns 8

try {
  addProxy(5, 'three'); // Throws TypeError
} catch (error) {
  console.error(error.message);
}

// construct trap: intercept new operator
class User {
  constructor(name) {
    this.name = name;
  }
}

const UserProxy = new Proxy(User, {
  construct(target, args) {
    console.log(\`Creating new instance with args: \${args.join(', ')}\`);
    
    if (!args[0]) {
      throw new Error('Name is required');
    }

    return Reflect.construct(target, args);
  }
});

const user = new UserProxy('Alice'); // Logs message
console.log(user.name); // "Alice"

try {
  new UserProxy(); // Throws error
} catch (error) {
  console.error(error.message); // "Name is required"
}`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Reflect API',
      id: 'reflect-api'
    },
    {
      type: 'paragraph',
      text: 'The Reflect API provides methods that correspond to Proxy traps, offering a programmatic way to inspect and manipulate objects. Reflect methods mirror Proxy traps 1:1, making them perfect partners.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Reflect mirrors Proxy traps
const obj = { x: 10, y: 20 };

// Property operations
Reflect.get(obj, 'x'); // 10
Reflect.set(obj, 'z', 30); // true
Reflect.has(obj, 'x'); // true
Reflect.deleteProperty(obj, 'y'); // true

// Object inspection
Reflect.ownKeys(obj); // ['x', 'z']
Reflect.getOwnPropertyDescriptor(obj, 'x'); // { value: 10, writable: true, ... }
Reflect.defineProperty(obj, 'a', { value: 1 }); // true

// Prototype operations
Reflect.getPrototypeOf(obj); // Object.prototype
Reflect.setPrototypeOf(obj, Array.prototype); // true

// Function operations
function add(a, b) {
  return a + b;
}

Reflect.apply(add, null, [5, 3]); // 8

class User {
  constructor(name) {
    this.name = name;
  }
}

Reflect.construct(User, ['Alice']); // new User('Alice')

// Using Reflect in Proxy handlers (best practice)
const validatedProxy = new Proxy({}, {
  set(target, property, value) {
    console.log(\`Setting \${property}\`);
    // Use Reflect for actual operation
    return Reflect.set(target, property, value);
  },

  get(target, property) {
    console.log(\`Getting \${property}\`);
    // Use Reflect for actual operation
    return Reflect.get(target, property);
  }
});

validatedProxy.name = 'Bob';
console.log(validatedProxy.name);`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Practical Applications',
      id: 'practical-applications'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Application 1: Validation and Type Checking',
      id: 'validation-application'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Strict schema validation with Proxy
function createValidatedObject(schema) {
  return new Proxy({}, {
    set(target, property, value) {
      if (!(property in schema)) {
        throw new Error(\`Unknown property: \${property}\`);
      }

      const { type, required, validate } = schema[property];

      if (typeof value !== type) {
        throw new TypeError(
          \`Property \${property} must be of type \${type}\`
        );
      }

      if (validate && !validate(value)) {
        throw new Error(
          \`Property \${property} failed validation\`
        );
      }

      return Reflect.set(target, property, value);
    },

    get(target, property) {
      if (property in schema && schema[property].required && !(property in target)) {
        throw new Error(\`Required property \${property} not set\`);
      }
      return Reflect.get(target, property);
    }
  });
}

// Define schema
const userSchema = {
  name: {
    type: 'string',
    required: true,
    validate: (v) => v.length > 0
  },
  age: {
    type: 'number',
    required: false,
    validate: (v) => v > 0 && v < 150
  },
  email: {
    type: 'string',
    required: true,
    validate: (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)
  }
};

const user = createValidatedObject(userSchema);

user.name = 'Alice'; // OK
user.age = 30; // OK
user.email = 'alice@example.com'; // OK

try {
  user.age = 200; // Throws: validation error
} catch (error) {
  console.error(error.message);
}

try {
  user.phone = '123-456-7890'; // Throws: unknown property
} catch (error) {
  console.error(error.message);
}`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Application 2: Caching and Memoization',
      id: 'caching-application'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Cache proxy for functions
function createCachedFunction(fn) {
  const cache = new Map();

  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        console.log('Cache hit for', key);
        return cache.get(key);
      }

      console.log('Cache miss for', key);
      const result = Reflect.apply(target, thisArg, args);
      cache.set(key, result);
      return result;
    }
  });
}

// Expensive function
function fibonacci(n) {
  console.log(\`Computing fib(\${n})\`);
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const cachedFib = createCachedFunction(fibonacci);

console.log(cachedFib(5)); // Logs computation
console.log(cachedFib(5)); // Logs "Cache hit"

// Property access caching
function createPropertyCache(target, ttl = 5000) {
  const cache = new Map();

  return new Proxy(target, {
    get(target, property) {
      const now = Date.now();

      if (cache.has(property)) {
        const { value, timestamp } = cache.get(property);
        if (now - timestamp < ttl) {
          console.log(\`Cache hit: \${property}\`);
          return value;
        }
        cache.delete(property);
      }

      console.log(\`Computing: \${property}\`);
      const value = Reflect.get(target, property);
      cache.set(property, { value, timestamp: now });
      return value;
    }
  });
}

const expensiveObject = {
  data: () => new Array(1000000).fill(0), // Simulate expensive operation
};

const cached = createPropertyCache(expensiveObject);
console.log(cached.data.length); // "Computing: data"
console.log(cached.data.length); // "Cache hit: data"
console.log(cached.data.length); // "Cache hit: data"`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Application 3: Lazy Loading and Computed Properties',
      id: 'lazy-loading-application'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Lazy loading with Proxy
function createLazyLoader(loaders) {
  const loaded = {};

  return new Proxy(loaders, {
    get(target, property) {
      if (!(property in loaded)) {
        console.log(\`Loading \${property}...\`);
        loaded[property] = target[property]();
      }
      return loaded[property];
    }
  });
}

// Define lazy-loaded modules
const modules = createLazyLoader({
  database: () => {
    console.log('Initializing database connection...');
    return { query: (sql) => 'result' };
  },

  cache: () => {
    console.log('Initializing cache...');
    return new Map();
  },

  logger: () => {
    console.log('Initializing logger...');
    return {
      log: (msg) => console.log(msg),
      error: (err) => console.error(err)
    };
  }
});

// Modules only load when accessed
console.log('App started');
modules.logger.log('App initialized'); // Loads logger
modules.cache.set('key', 'value'); // Loads cache
modules.database.query('SELECT *'); // Loads database

// Computed properties with Proxy
const person = new Proxy(
  { firstName: 'John', lastName: 'Doe' },
  {
    get(target, property) {
      if (property === 'fullName') {
        return \`\${target.firstName} \${target.lastName}\`;
      }
      if (property === 'initials') {
        return target.firstName[0] + target.lastName[0];
      }
      return Reflect.get(target, property);
    }
  }
);

console.log(person.fullName); // "John Doe" (computed)
console.log(person.initials); // "JD" (computed)`,
},
    {
      type: 'heading',
      level: 3,
      text: 'Application 4: Logging and Debugging',
      id: 'logging-application'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Comprehensive logging proxy
function createLoggingProxy(obj, name = 'Object') {
  return new Proxy(obj, {
    get(target, property) {
      console.log(\`[GET] \${name}.\${String(property)}\`);
      const value = Reflect.get(target, property);
      if (typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    },

    set(target, property, value) {
      console.log(\`[SET] \${name}.\${String(property)} = \${value}\`);
      return Reflect.set(target, property, value);
    },

    deleteProperty(target, property) {
      console.log(\`[DELETE] \${name}.\${String(property)}\`);
      return Reflect.deleteProperty(target, property);
    },

    has(target, property) {
      console.log(\`[HAS] \${name}.\${String(property)}\`);
      return Reflect.has(target, property);
    }
  });
}

const api = createLoggingProxy(
  {
    fetchUser: (id) => ({ id, name: 'User' }),
    saveUser: (user) => true
  },
  'API'
);

api.fetchUser(1); // Logs GET and function call
api.newMethod = () => {}; // Logs SET`,
},
    {
      type: 'heading',
      level: 2,
      text: 'Advanced Patterns',
      id: 'advanced-patterns'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Pattern 1: Chaining/Fluent interface with Proxy
function createFluentAPI(target = {}) {
  return new Proxy(target, {
    get(target, property) {
      const value = Reflect.get(target, property);

      if (typeof value === 'function') {
        return function(...args) {
          const result = value.apply(target, args);
          // Return proxy for chaining if result is object
          return result === target ? arguments.callee.proxy : result;
        };
      }

      return value;
    }
  });
}

// Pattern 2: Virtual properties
function createVirtualObject() {
  const virtualProperties = new Map();

  return new Proxy({}, {
    get(target, property) {
      if (virtualProperties.has(property)) {
        const getter = virtualProperties.get(property).get;
        return getter();
      }
      return Reflect.get(target, property);
    },

    set(target, property, value) {
      if (virtualProperties.has(property)) {
        const setter = virtualProperties.get(property).set;
        setter(value);
        return true;
      }
      return Reflect.set(target, property, value);
    },

    defineProperty(target, property, descriptor) {
      if (descriptor.get || descriptor.set) {
        virtualProperties.set(property, {
          get: descriptor.get,
          set: descriptor.set
        });
        return true;
      }
      return Reflect.defineProperty(target, property, descriptor);
    }
  });
}

const vobj = createVirtualObject();
Object.defineProperty(vobj, 'now', {
  get: () => new Date().toISOString()
});

console.log(vobj.now); // Current timestamp
// Pattern 3: Revocable proxy (can be turned off)
const target = { secret: 'password' };
const { proxy, revoke } = Proxy.revocable(target, {
  get(target, property) {
    return Reflect.get(target, property);
  }
});

console.log(proxy.secret); // "password"
revoke(); // Disable the proxy

try {
  console.log(proxy.secret); // Throws TypeError
} catch (error) {
  console.error('Proxy revoked');
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
      text: 'Proxy intercepts object operations through traps, enabling validation, logging, caching, and lazy loading. Reflect provides methods matching each Proxy trap, offering a clean metaprogramming API. Use Proxy and Reflect together for powerful abstraction layers. Common applications: validation, caching, logging, lazy loading, and computed properties. Be mindful of performance - Proxy overhead matters in hot code paths.'
    }
  ],
  exercises: [
    'Create a validated user object using Proxy with custom schema validation',
    'Implement a caching proxy for expensive function calls',
    'Build a lazy loader for modules that only initializes when accessed',
    'Create a logging proxy that tracks all property access and modifications',
    'Implement computed properties with Proxy (e.g., fullName from firstName + lastName)',
    'Build a revocable proxy pattern with proper cleanup'
  ]
};
