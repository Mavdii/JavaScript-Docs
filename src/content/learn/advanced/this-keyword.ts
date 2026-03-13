import type { LessonContent } from '@/types/content';

export const thisKeywordLesson: LessonContent = {
  id: 'this-keyword',
  title: 'The this Keyword',
  description: 'Understand how `this` is determined in different contexts: methods, constructors, arrow functions, and event handlers.',
  slug: 'learn/advanced/this-keyword',
  pillar: 'learn',
  category: 'advanced',
  tags: ['this', 'context', 'bind', 'call', 'apply'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'The value of `this` depends on how a function is called, not where it is defined. Understanding the four binding rules is essential for writing correct JavaScript.',
  relatedTopics: ['closures', 'prototypes'],
  order: 3,
  updatedAt: '2024-03-01',
  readingTime: 35,
  featured: false,
  keywords: ['this', 'bind', 'call', 'apply', 'arrow function', 'context', 'globalThis', 'explicit binding', 'new binding', 'class fields'],
  prerequisites: ['Functions', 'Objects'],
  learningGoals: [
    'Know the four this-binding rules and their priority',
    'Use bind, call, and apply correctly',
    'Understand why arrow functions solve common this issues',
    'Debug lost-context bugs in real-world code',
    'Understand this in classes, event handlers, and callbacks',
    'Implement a polyfill for bind() from scratch',
    'Understand globalThis and cross-environment this behavior',
    'Use class field syntax to automatically bind methods',
  ],
  exercises: [
    'Create an object method and show how extracting it loses `this` context.',
    'Fix a broken event handler that loses `this` using three different approaches.',
    'Implement a custom bind function from scratch.',
    'Predict the output of 10 different `this` scenarios.',
    'Create a class-based timer with arrow class fields and verify it works when the method is extracted.',
    'Build a mixin that preserves `this` when applied to any object.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'The Four Rules', id: 'four-rules' },
    { type: 'paragraph', text: 'The value of `this` depends on HOW a function is called, not where it’s defined. There are four rules, in order of priority.' },
    {
      type: 'table',
      headers: ['Rule', 'Context', 'this Value', 'Priority'],
      rows: [
        ['Default', 'Standalone function call', 'undefined (strict) / window', '4 (lowest)'],
        ['Implicit', 'Called as object method', 'The object before the dot', '3'],
        ['Explicit', 'call() / apply() / bind()', 'The specified object', '2'],
        ['new', 'Constructor with new', 'The new object', '1 (highest)'],
      ],
    },

    { type: 'heading', level: 2, text: 'Default Binding', id: 'default' },
    { type: 'paragraph', text: 'When a function runs standalone, `this` is undefined (strict) or the global object (not strict).' },
    {
      type: 'code', language: 'javascript', filename: 'default.js',
      code: `function showThis() {
  console.log(this);
}

showThis(); // window (sloppy mode) or undefined (strict mode)

// In strict mode (and all ES modules are strict):
'use strict';
function showThisStrict() {
  console.log(this); // undefined
}

// Common gotcha: callbacks lose context
const obj = {
  name: 'Alice',
  greet() { console.log(this.name); }
};

setTimeout(obj.greet, 100); // undefined — default binding applies!`,
    },

    { type: 'heading', level: 2, text: 'Implicit Binding', id: 'implicit' },
    { type: 'paragraph', text: 'When you call a method with a dot, `this` is the object before the dot. Only the immediate object matters.' },
    {
      type: 'code', language: 'javascript', filename: 'implicit.js',
      code: `const user = {
  name: 'Alice',
  greet() {
    return \`Hi, I’m \${this.name}\`;
  },
  address: {
    city: 'NYC',
    getCity() {
      return this.city; // 'this' is address, not user!
    }
  }
};

user.greet();           // "Hi, I’m Alice" â this = user
user.address.getCity(); // "NYC" — this = address (not user!)

// Lost context — the most common bug!
const greet = user.greet;
greet(); // "Hi, I’m undefined" â implicit binding is lost

// Also lost in callbacks:
[1, 2, 3].forEach(user.greet); // this = undefined in each call`,
    },
    { type: 'callout', variant: 'warning', title: 'Implicit Binding Loss', text: 'Assigning a method to a variable or passing it as a callback loses `this`. This is THE most common `this` bug.' },

    { type: 'heading', level: 2, text: 'Explicit Binding: call, apply, bind', id: 'explicit' },
    { type: 'paragraph', text: 'call(), apply(), and bind() let you explicitly set `this`. call and apply run immediately. bind returns a new function.' },
    {
      type: 'code', language: 'javascript', filename: 'explicit.js',
      code: `function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

const user = { name: 'Alice' };

// call — invoke with this + individual args
greet.call(user, 'Hello', '!');   // "Hello, Alice!"

// apply — invoke with this + args array
greet.apply(user, ['Hi', '?']);   // "Hi, Alice?"

// bind — return new function with fixed this
const boundGreet = greet.bind(user);
boundGreet('Hey', '.');           // "Hey, Alice."

// bind with partial application
const sayHello = greet.bind(user, 'Hello');
sayHello('!');                     // "Hello, Alice!"
sayHello('?');                     // "Hello, Alice?"`,
    },

    { type: 'heading', level: 2, text: 'call vs apply vs bind', id: 'call-apply-bind' },
    {
      type: 'table',
      headers: ['Method', 'Invokes immediately?', 'Arguments', 'Returns'],
      rows: [
        ['call(thisArg, a, b)', 'Yes', 'Individual args', 'Function result'],
        ['apply(thisArg, [a, b])', 'Yes', 'Array of args', 'Function result'],
        ['bind(thisArg, a)', 'No', 'Optional partial args', 'New bound function'],
      ],
    },

    { type: 'heading', level: 2, text: 'new Binding', id: 'new-binding' },
    { type: 'paragraph', text: 'When you use `new`, `this` is the new object. This is highest priority — even bind loses to it.' },
    {
      type: 'code', language: 'javascript', filename: 'new-binding.js',
      code: `function Person(name) {
  this.name = name;
  // 'this' is the new object being created
}

const alice = new Person('Alice');
alice.name; // "Alice"

// new overrides bind!
const BoundPerson = Person.bind({ name: 'Ignored' });
const bob = new BoundPerson('Bob');
bob.name; // "Bob" — new wins over bind`,
    },

    { type: 'heading', level: 2, text: 'Arrow Functions & this', id: 'arrow-this' },
    { type: 'paragraph', text: 'Arrow functions do NOT have their own `this`. They permanently capture `this` from the enclosing lexical scope at the time they are defined. You cannot change an arrow function\'s `this` with call, apply, or bind.' },
    {
      type: 'code', language: 'javascript', filename: 'arrow-this.js',
      code: `const timer = {
  seconds: 0,
  start() {
    // Arrow function captures 'this' from start()
    setInterval(() => {
      this.seconds++; // 'this' is timer
      console.log(this.seconds);
    }, 1000);
  }
};

timer.start(); // Works! this = timer

// Arrow functions IGNORE explicit binding
const arrowFn = () => this;
arrowFn.call({ name: 'Alice' }); // Still the outer 'this', not { name: 'Alice' }
arrowFn.bind({ name: 'Bob' })(); // Still the outer 'this'

// Comparison with regular function
const obj = {
  regular() { return this; },      // this = obj (implicit binding)
  arrow: () => { return this; },   // this = outer scope (NOT obj)
};

obj.regular(); // obj
obj.arrow();   // window/undefined (outer scope)`,
    },

    { type: 'heading', level: 2, text: 'this in Classes', id: 'this-in-classes' },
    {
      type: 'code', language: 'javascript', filename: 'class-this.js',
      code: `class Counter {
  count = 0;

  // Regular method â 'this' depends on how it’s called
  increment() {
    this.count++;
  }

  // Arrow method — 'this' is always the instance
  decrement = () => {
    this.count--;
  };
}

const counter = new Counter();

// Works fine — called as method
counter.increment();

// Extract methods:
const inc = counter.increment;
const dec = counter.decrement;

// inc(); // TypeError — lost 'this' (regular method)
dec();    // Works! Arrow method keeps 'this' = counter

// This is why React class components used arrow methods:
class MyComponent extends React.Component {
  handleClick = () => {
    this.setState({ clicked: true }); // 'this' is always the component
  };
}`,
    },

    { type: 'heading', level: 2, text: 'this in Event Handlers', id: 'event-handlers' },
    {
      type: 'code', language: 'javascript', filename: 'events.js',
      code: `class Dropdown {
  constructor(el) {
    this.el = el;
    this.isOpen = false;

    // ❌ Problem: 'this' will be the DOM element, not the Dropdown
    // el.addEventListener('click', this.toggle);

    // ✅ Fix 1: bind
    el.addEventListener('click', this.toggle.bind(this));

    // ✅ Fix 2: arrow function wrapper
    el.addEventListener('click', (e) => this.toggle(e));

    // ✅ Fix 3: arrow class method
    // Define toggle as: toggle = () => { ... }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.el.classList.toggle('open', this.isOpen);
  }
}`,
    },

    { type: 'heading', level: 2, text: 'this in setTimeout & setInterval', id: 'timers' },
    {
      type: 'code', language: 'javascript', filename: 'timers.js',
      code: `const countdown = {
  count: 5,

  // ❌ Regular function — 'this' is lost
  startBroken() {
    setInterval(function() {
      console.log(this.count); // undefined!
      this.count--;
    }, 1000);
  },

  // ✅ Arrow function — captures 'this'
  startFixed() {
    setInterval(() => {
      console.log(this.count); // works!
      this.count--;
    }, 1000);
  },

  // ✅ Alternative: save reference
  startAlt() {
    const self = this;
    setInterval(function() {
      console.log(self.count); // works via closure
      self.count--;
    }, 1000);
  }
};`,
    },

    { type: 'heading', level: 2, text: 'Implementing Custom bind', id: 'custom-bind' },
    {
      type: 'code', language: 'javascript', filename: 'custom-bind.js',
      code: `// Simplified bind implementation
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this;
  return function(...callArgs) {
    return fn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};

function greet(greeting) {
  return \`\${greeting}, \${this.name}\`;
}

const bound = greet.myBind({ name: 'Alice' }, 'Hello');
bound(); // "Hello, Alice"`,
    },

    { type: 'heading', level: 2, text: 'globalThis — Cross-Environment this', id: 'globalthis' },
    { type: 'paragraph', text: 'Different environments have different globals. globalThis works everywhere.' },
    {
      type: 'code', language: 'javascript', filename: 'globalthis.js',
      code: `// In a browser:
console.log(this === window); // true (at module level: false)

// In Node.js:
// At module top-level, 'this' = module.exports, not global

// globalThis — works everywhere
console.log(globalThis); // window in browser, global in Node.js

// Checking the environment
function getEnvironment() {
  if (typeof window !== 'undefined') return 'browser';
  if (typeof process !== 'undefined') return 'node';
  if (typeof WorkerGlobalScope !== 'undefined') return 'worker';
  return 'unknown';
}

// Polyfilling a global safely
if (typeof globalThis.myLib === 'undefined') {
  globalThis.myLib = { version: '1.0.0' };
}`,
    },
    { type: 'callout', variant: 'tip', title: 'Use globalThis', text: 'Use `globalThis` instead of `window` or `global` when writing universal/isomorphic code that needs to run in both browser and Node.js environments. It was standardized in ES2020.' },

    { type: 'heading', level: 2, text: 'Advanced: Mixin Pattern with this', id: 'mixins' },
    { type: 'paragraph', text: 'Mixins use `this` dynamically to work on any object. Since `this` is determined at call time, the same mixin works everywhere.' },
    {
      type: 'code', language: 'javascript', filename: 'mixins.js',
      code: `// Observable mixin
const ObservableMixin = {
  on(event, callback) {
    this._listeners = this._listeners || {};
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(callback);
    return this;
  },
  emit(event, data) {
    (this._listeners?.[event] || []).forEach(cb => cb(data));
    return this;
  },
  off(event, callback) {
    if (this._listeners?.[event]) {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }
};

// Apply to any class
class UserStore {
  constructor() {
    Object.assign(this, ObservableMixin);
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
    this.emit('userAdded', user); // this = UserStore instance
  }
}

const store = new UserStore();
store.on('userAdded', (user) => console.log(\`Added: \${user.name}\`));
store.addUser({ name: 'Alice' }); // "Added: Alice"`,
    },

    { type: 'heading', level: 2, text: 'this in Promise Chains & async/await', id: 'this-promises' },
    { type: 'paragraph', text: 'Promises can lose `this` too. Arrow functions in .then() are the fix.' },
    {
      type: 'code', language: 'javascript', filename: 'this-promises.js',
      code: `class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  // ❌ Regular function loses 'this' in .then()
  fetchUserBroken(id) {
    return fetch(\`\${this.baseUrl}/users/\${id}\`)
      .then(function(response) {
        // this.baseUrl is undefined here!
        console.log(this.baseUrl); // undefined
        return response.json();
      });
  }

  // ✅ Arrow function preserves 'this'
  fetchUser(id) {
    return fetch(\`\${this.baseUrl}/users/\${id}\`)
      .then(response => response.json()) // arrow — 'this' is ApiClient
      .then(data => {
        console.log(\`\${this.baseUrl}/users: loaded \${data.name}\`);
        return data;
      });
  }

  // ✅ async/await — 'this' is always available
  async getUser(id) {
    const res = await fetch(\`\${this.baseUrl}/users/\${id}\`);
    const data = await res.json();
    console.log(\`Fetched from \${this.baseUrl}\`);
    return data;
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Using arrow functions as methods
const obj = {
  name: 'Alice',
  greet: () => \`Hi, \${this.name}\` // 'this' is NOT obj!
};
obj.greet(); // "Hi, undefined"

// ❌ Mistake 2: Destructuring methods
const { greet } = user; // Loses 'this' binding
greet(); // undefined

// ❌ Mistake 3: Passing method as callback without binding
button.addEventListener('click', obj.handleClick); // 'this' = button, not obj

// ❌ Mistake 4: Using 'this' in a nested regular function
const counter = {
  count: 0,
  start() {
    function helper() {
      this.count++; // 'this' is NOT counter!
    }
    helper();
  }
};

// ✅ Fix: use arrow function for the nested function
const counterFixed = {
  count: 0,
  start() {
    const helper = () => {
      this.count++; // 'this' IS counter (lexical)
    };
    helper();
  }
};`,
    },

    { type: 'heading', level: 2, text: 'Priority Rules Summary', id: 'priority' },
    { type: 'paragraph', text: 'When multiple rules could apply, use this priority order:' },
    {
      type: 'list',
      ordered: true,
      items: [
        '`new` binding (highest priority) — this = new object',
        'Explicit binding (call/apply/bind) — this = specified object',
        'Implicit binding (method call) — this = object before dot',
        'Default binding (lowest priority) — this = undefined/global',
        'Arrow functions — ignore all rules above, use lexical this',
      ],
    },

    { type: 'heading', level: 2, text: 'Quick Reference Cheat Sheet', id: 'cheat-sheet' },
    {
      type: 'table',
      headers: ['Call Style', 'this =', 'Example'],
      rows: [
        ['obj.method()', 'obj', 'user.greet()'],
        ['func()', 'undefined / window', 'greet()'],
        ['func.call(obj)', 'obj', 'greet.call(user)'],
        ['func.bind(obj)()', 'obj', 'greet.bind(user)()'],
        ['new Func()', 'new object', 'new Person()'],
        ['() => {}', 'enclosing this', 'setInterval(() => this.x, 1000)'],
        ['addEventListener', 'DOM element', 'el.addEventListener("click", fn)'],
        ['globalThis', 'Global object', 'globalThis.window / globalThis.global'],
        ['class field arrow', 'Class instance always', 'handleClick = () => this.setState()'],
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What are the four this-binding rules and their priority?',
        'How does `this` differ in arrow functions vs regular functions?',
        'What does bind() return and can you call bind() on the result again?',
        'Why does `setTimeout(obj.method, 0)` lose context?',
        'How would you implement Function.prototype.bind from scratch?',
        'What is `this` inside a static method?',
        'What is the difference between `this` in strict and sloppy mode?',
        'Why can\'t you use an arrow function as a constructor?',
        'What is `globalThis` and when would you use it?',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Rule of Thumb', text: 'Use arrow functions for callbacks. Use regular functions for methods. When stuck, console.log(this) to debug.' },
  ],
};
