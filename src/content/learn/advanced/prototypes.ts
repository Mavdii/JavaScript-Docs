import type { LessonContent } from '@/types/content';

export const prototypesLesson: LessonContent = {
  id: 'prototypes',
  title: 'Prototypes',
  description: 'Understand prototypal inheritance, the prototype chain, and how JavaScript objects inherit behavior.',
  slug: 'learn/advanced/prototypes',
  pillar: 'learn',
  category: 'advanced',
  tags: ['prototypes', 'inheritance', 'prototype-chain', 'OOP'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'JavaScript uses prototypal inheritance. Every object has a prototype, and property lookups follow the prototype chain until they reach null.',
  relatedTopics: ['objects', 'this-keyword'],
  order: 2,
  updatedAt: '2024-03-01',
  readingTime: 20,
  featured: false,
  keywords: ['prototype', '__proto__', 'Object.create', 'prototype chain', 'inheritance'],
  prerequisites: ['Objects', 'Functions'],
  learningGoals: [
    'Master the prototype chain',
    'Use Object.create for inheritance',
    'Know __proto__ vs .prototype',
    'Use classes as prototype sugar',
    'Use mixins and multiple inheritance',
    'Use Symbol.hasInstance and Symbol.species',
  ],
  exercises: [
    'Create an inheritance chain using Object.create and verify property lookup.',
    'Rewrite a class hierarchy using only prototypes and constructor functions.',
    'Implement a mixin pattern that adds serialization to any class.',
    'Build a custom instanceof check using Symbol.hasInstance.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'What is a Prototype?', id: 'what-is-prototype' },
    { type: 'paragraph', text: 'Every JavaScript object has an internal link to another object called its prototype. When you access a property that doesn\'t exist on the object, JavaScript looks up the prototype chain. This is the foundation of inheritance in JavaScript — objects delegate behavior to their prototypes rather than copying it.' },
    {
      type: 'code', language: 'javascript', filename: 'prototype-basics.js',
      code: `const animal = {
  speak() {
    return \`\${this.name} makes a sound.\`;
  }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // "Rex makes a sound."

// dog doesn’t have speak() â it’s found on animal (the prototype)
Object.getPrototypeOf(dog) === animal; // true`,
    },

    { type: 'heading', level: 2, text: 'The Prototype Chain', id: 'prototype-chain' },
    { type: 'paragraph', text: 'Property lookup traverses the chain: object → prototype → prototype\'s prototype → ... → null. This chain is how all objects ultimately inherit from Object.prototype, which provides methods like toString(), valueOf(), and hasOwnProperty().' },
    {
      type: 'code', language: 'javascript', filename: 'chain.js',
      code: `const base = { type: 'base' };
const mid = Object.create(base);
mid.level = 'mid';
const top = Object.create(mid);

top.level    // "mid" (from mid)
top.type     // "base" (from base)
top.toString // function (from Object.prototype)

// Visualize the chain
// top → mid → base → Object.prototype → null

// Check each level
Object.getPrototypeOf(top) === mid;            // true
Object.getPrototypeOf(mid) === base;           // true
Object.getPrototypeOf(base) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype);       // null`,
    },

    { type: 'heading', level: 2, text: '__proto__ vs .prototype', id: 'proto-vs-prototype' },
    { type: 'paragraph', text: 'These get confused. `__proto__` is the actual link. `.prototype` is a property on constructors that becomes the `__proto__` of instances made with `new`.' },
    {
      type: 'code', language: 'javascript', filename: 'proto-vs-prototype.js',
      code: `function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return \`Hi, I’m \${this.name}\`;
};

const alice = new Person('Alice');

// alice.__proto__ === Person.prototype   ✅
// Person.__proto__ === Function.prototype ✅
// Person.prototype.__proto__ === Object.prototype ✅

// Modern API — use these instead of __proto__
Object.getPrototypeOf(alice) === Person.prototype; // true
Object.setPrototypeOf(obj, newProto); // Set prototype (avoid in production — slow)`,
    },
    {
      type: 'table',
      headers: ['Property', 'What it is', 'Found on'],
      rows: [
        ['__proto__', 'Link to the object\'s prototype', 'Every object'],
        ['.prototype', 'Object that becomes __proto__ of instances', 'Constructor functions only'],
        ['Object.getPrototypeOf()', 'Modern way to read __proto__', 'API method'],
      ],
    },
    { type: 'callout', variant: 'warning', title: 'Avoid __proto__', text: 'Use Object.getPrototypeOf() and Object.setPrototypeOf() instead of `__proto__`. Better yet, use Object.create() to set up prototypes upfront.' },

    { type: 'heading', level: 2, text: 'Constructor Functions', id: 'constructors' },
    { type: 'paragraph', text: 'Before classes, constructor functions were how you made objects with shared behavior. `new` creates an object, sets its prototype, calls the constructor, and returns it.' },
    {
      type: 'code', language: 'javascript', filename: 'constructor.js',
      code: `function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return \`Hi, I’m \${this.name}\`;
};

Person.prototype.isAdult = function() {
  return this.age >= 18;
};

const alice = new Person('Alice', 30);
alice.greet();   // "Hi, I’m Alice"
alice.isAdult(); // true
alice instanceof Person; // true

// What 'new' does under the hood:
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // 1. Create with prototype
  const result = Constructor.apply(obj, args);       // 2. Call constructor
  return result instanceof Object ? result : obj;    // 3. Return object
}`,
    },

    { type: 'heading', level: 2, text: 'Prototypal Inheritance', id: 'prototypal-inheritance' },
    { type: 'paragraph', text: 'To create a child constructor that inherits from a parent, you set the child\'s prototype to an object created from the parent\'s prototype, then fix the constructor reference.' },
    {
      type: 'code', language: 'javascript', filename: 'inheritance.js',
      code: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return \`\${this.name} makes a sound.\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix constructor reference

Dog.prototype.bark = function() {
  return \`\${this.name} barks!\`;
};

const rex = new Dog('Rex', 'Shepherd');
rex.speak(); // "Rex makes a sound." (inherited)
rex.bark();  // "Rex barks!" (own method)
rex instanceof Dog;    // true
rex instanceof Animal; // true`,
    },

    { type: 'heading', level: 2, text: 'ES6 Classes (Sugar)', id: 'classes' },
    { type: 'paragraph', text: 'Classes are sugar over prototypes. Same mechanism underneath. They’re just cleaner syntax and enforce using `new`.' },
    {
      type: 'code', language: 'javascript', filename: 'classes.js',
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a sound.\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Must call super() before using 'this'
    this.breed = breed;
  }
  speak() {
    return \`\${this.name} barks.\`;
  }
  parentSpeak() {
    return super.speak(); // Call parent method
  }
}

const rex = new Dog('Rex', 'Shepherd');
rex.speak();       // "Rex barks."
rex.parentSpeak(); // "Rex makes a sound."
rex instanceof Animal; // true

// Proof it’s still prototypes
typeof Dog; // "function"
Dog.prototype.speak === rex.speak; // true (shared via prototype)`,
    },
    { type: 'callout', variant: 'info', title: 'Under the Hood', text: 'Classes are just constructor functions + prototype methods. `extends` sets up the prototype chain exactly like doing it manually.' },

    { type: 'heading', level: 2, text: 'Static Methods & Properties', id: 'static-members' },
    { type: 'paragraph', text: 'Static members belong to the constructor/class itself, not to instances. They\'re useful for utility functions and factory methods.' },
    {
      type: 'code', language: 'javascript', filename: 'static.js',
      code: `class User {
  static count = 0;

  constructor(name) {
    this.name = name;
    User.count++;
  }

  static fromJSON(json) {
    const data = JSON.parse(json);
    return new User(data.name);
  }

  static compareByName(a, b) {
    return a.name.localeCompare(b.name);
  }
}

const user = User.fromJSON('{"name":"Alice"}');
User.count; // 1

// Static methods are NOT on instances
// user.fromJSON(...) // TypeError!`,
    },

    { type: 'heading', level: 2, text: 'Private Fields & Methods', id: 'private-fields' },
    {
      type: 'code', language: 'javascript', filename: 'private.js',
      code: `class BankAccount {
  #balance = 0; // Private field
  #owner;

  constructor(owner, initial) {
    this.#owner = owner;
    this.#balance = initial;
  }

  deposit(amount) {
    this.#validateAmount(amount);
    this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }

  #validateAmount(amount) { // Private method
    if (amount <= 0) throw new Error('Invalid amount');
  }
}

const account = new BankAccount('Alice', 100);
account.deposit(50);
account.balance;    // 150
// account.#balance // SyntaxError: Private field`,
    },

    { type: 'heading', level: 2, text: 'Getters & Setters', id: 'getters-setters' },
    {
      type: 'code', language: 'javascript', filename: 'accessors.js',
      code: `class Temperature {
  #celsius;

  constructor(celsius) {
    this.#celsius = celsius;
  }

  get fahrenheit() {
    return this.#celsius * 9 / 5 + 32;
  }

  set fahrenheit(f) {
    this.#celsius = (f - 32) * 5 / 9;
  }

  get celsius() {
    return this.#celsius;
  }

  set celsius(c) {
    if (c < -273.15) throw new Error('Below absolute zero');
    this.#celsius = c;
  }
}

const temp = new Temperature(100);
temp.fahrenheit; // 212
temp.fahrenheit = 32;
temp.celsius;    // 0`,
    },

    { type: 'heading', level: 2, text: 'Mixins Pattern', id: 'mixins' },
    { type: 'paragraph', text: 'JavaScript doesn\'t support multiple inheritance, but mixins let you compose behavior from multiple sources. A mixin is a function that takes a superclass and returns a subclass with added functionality.' },
    {
      type: 'code', language: 'javascript', filename: 'mixins.js',
      code: `// Mixin as a function that extends a base class
const Serializable = (Base) => class extends Base {
  toJSON() {
    return JSON.stringify(this);
  }
  static fromJSON(json) {
    return Object.assign(new this(), JSON.parse(json));
  }
};

const Validatable = (Base) => class extends Base {
  validate() {
    for (const [key, value] of Object.entries(this)) {
      if (value === null || value === undefined) {
        throw new Error(\`\${key} is required\`);
      }
    }
    return true;
  }
};

// Compose mixins
class User extends Serializable(Validatable(class {})) {
  constructor(name, email) {
    super();
    this.name = name;
    this.email = email;
  }
}

const user = new User('Alice', 'alice@example.com');
user.validate(); // true
user.toJSON();   // '{"name":"Alice","email":"alice@example.com"}'`,
    },

    { type: 'heading', level: 2, text: 'Property Descriptors', id: 'property-descriptors' },
    { type: 'paragraph', text: 'Every property has hidden attributes (descriptors) that control whether it\'s writable, enumerable, and configurable. Understanding descriptors explains why some properties behave differently.' },
    {
      type: 'code', language: 'javascript', filename: 'descriptors.js',
      code: `const obj = {};

Object.defineProperty(obj, 'id', {
  value: 42,
  writable: false,      // Can’t change value
  enumerable: false,     // Won’t show in for...in or Object.keys
  configurable: false,   // Can’t delete or reconfigure
});

obj.id;          // 42
obj.id = 100;    // Silently fails (throws in strict mode)
Object.keys(obj); // [] — id is not enumerable

// Define multiple properties
Object.defineProperties(obj, {
  name: { value: 'Alice', writable: true, enumerable: true, configurable: true },
  age:  { value: 30, writable: true, enumerable: true, configurable: true },
});

// Read descriptor
Object.getOwnPropertyDescriptor(obj, 'id');
// { value: 42, writable: false, enumerable: false, configurable: false }`,
    },

    { type: 'heading', level: 2, text: 'hasOwnProperty vs in', id: 'hasown-vs-in' },
    {
      type: 'code', language: 'javascript', filename: 'own-vs-inherited.js',
      code: `const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

// 'in' checks the entire prototype chain
'own' in child;       // true
'inherited' in child; // true
'toString' in child;  // true (from Object.prototype)

// hasOwnProperty checks only the object itself
child.hasOwnProperty('own');       // true
child.hasOwnProperty('inherited'); // false

// Modern alternative — Object.hasOwn (ES2022)
Object.hasOwn(child, 'own');       // true
Object.hasOwn(child, 'inherited'); // false`,
    },

    { type: 'heading', level: 2, text: 'instanceof & Symbol.hasInstance', id: 'instanceof' },
    {
      type: 'code', language: 'javascript', filename: 'instanceof.js',
      code: `class Animal {}
class Dog extends Animal {}

const rex = new Dog();
rex instanceof Dog;    // true
rex instanceof Animal; // true
rex instanceof Object; // true

// How instanceof works:
// Walks the prototype chain of rex checking if
// Dog.prototype appears anywhere in the chain

// Custom instanceof behavior
class Even {
  static [Symbol.hasInstance](num) {
    return typeof num === 'number' && num % 2 === 0;
  }
}

2 instanceof Even;  // true
3 instanceof Even;  // false`,
    },

    { type: 'heading', level: 2, text: 'Performance Considerations', id: 'performance' },
    {
      type: 'list',
      items: [
        'Long chains = slow lookups. Keep them short.',
        'Own properties are faster than inherited',
        'V8 uses hidden classes — add properties in consistent order',
        'Object.setPrototypeOf() is slow. Avoid in hot code.',
        'Object.create(null) has no prototype — good for dictionaries',
        'Prototype property access is cached, but first access is slower',
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Forgetting to call super() in constructor
class Child extends Parent {
  constructor() {
    // this.x = 1; // ReferenceError! Must call super() first
    super();
    this.x = 1; // ✅
  }
}

// â Mistake 2: Arrow functions on prototype (don’t work for 'this')
Person.prototype.greet = () => {
  return this.name; // 'this' is NOT the instance!
};

// ✅ Use regular functions for prototype methods
Person.prototype.greet = function() {
  return this.name;
};

// ❌ Mistake 3: Modifying built-in prototypes
Array.prototype.first = function() { return this[0]; };
// Never do this! Can break other code.

// ❌ Mistake 4: Shared mutable state on prototype
function Team() {}
Team.prototype.members = []; // Shared across ALL instances!
const a = new Team();
const b = new Team();
a.members.push('Alice');
b.members; // ['Alice'] — oops!

// ✅ Initialize in constructor
function Team() {
  this.members = []; // Each instance gets its own array
}`,
    },

    { type: 'heading', level: 2, text: 'Prototypes vs Classes Comparison', id: 'comparison' },
    {
      type: 'table',
      headers: ['Feature', 'Prototypes', 'Classes'],
      rows: [
        ['Syntax', 'Verbose, manual setup', 'Clean, declarative'],
        ['Inheritance', 'Object.create + call()', 'extends + super()'],
        ['Private fields', 'Closures or naming convention', '#privateField'],
        ['Static methods', 'Attach to constructor', 'static keyword'],
        ['Enforce new', 'Manual check needed', 'Automatic (throws without new)'],
        ['Hoisting', 'Functions are hoisted', 'Classes are NOT hoisted'],
        ['Under the hood', 'Direct prototype manipulation', 'Same prototype mechanism'],
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      ordered: true,
      items: [
        'What is the prototype chain? How does property lookup work?',
        'What is the difference between __proto__ and .prototype?',
        'How does `new` work under the hood?',
        'Are ES6 classes different from constructor functions?',
        'How would you implement multiple inheritance in JavaScript?',
        'What is Object.create(null) and when would you use it?',
        'Why should you never modify built-in prototypes?',
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Key Takeaway', text: 'Prototypes are the foundation of JavaScript\'s object system. Classes are syntactic sugar, but understanding prototypes is essential for debugging, performance optimization, and mastering the language.' },
  ],
};
