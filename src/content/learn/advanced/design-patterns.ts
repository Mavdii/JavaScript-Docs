import type { LessonContent } from '@/types/content';

export const designPatternsLesson: LessonContent = {
  id: 'design-patterns-001',
  title: 'JavaScript Design Patterns',
  description: 'Master common design patterns in JavaScript including creational, structural, and behavioral patterns with practical examples.',
  slug: 'learn/advanced/design-patterns',
  pillar: 'learn',
  category: 'advanced',
  tags: ['design-patterns', 'architecture', 'creational', 'structural', 'behavioral', 'best-practices'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn essential design patterns for JavaScript including Singleton, Factory, Observer, Decorator, Strategy, and more. Understand when and how to apply each pattern.',
  relatedTopics: ['oop', 'classes', 'closures', 'composition'],
  order: 9,
  updatedAt: '2024-01-15T12:00:00Z',
  readingTime: 26,
  featured: true,
  keywords: ['design patterns', 'singleton', 'factory', 'observer', 'decorator', 'strategy', 'module pattern', 'mixin'],
  prerequisites: ['classes', 'prototypes', 'closures'],
  learningGoals: [
    'Understand the most important JavaScript design patterns',
    'Learn creational patterns: Singleton, Factory, Builder',
    'Master structural patterns: Adapter, Decorator, Facade',
    'Understand behavioral patterns: Observer, Strategy, State',
    'Know when and why to use each pattern',
    'Apply patterns to solve real architectural problems'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'What are Design Patterns?',
      id: 'what-are-design-patterns'
    },
    {
      type: 'paragraph',
      text: 'Design patterns are reusable solutions to common programming problems. They represent best practices and can speed up development by providing proven solutions. Patterns are categorized as creational (object creation), structural (object composition), and behavioral (object interaction).'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Creational Patterns',
      id: 'creational-patterns'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Singleton Pattern',
      id: 'singleton-pattern'
    },
    {
      type: 'paragraph',
      text: 'The Singleton pattern ensures a class has only one instance and provides a global point of access to it. Useful for managing shared resources like database connections or configuration managers.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Singleton using closure
const Database = (() => {
  let instance;

  function createInstance() {
    return {
      connect: () => console.log('Connected to database'),
      query: (sql) => console.log(\`Executing: \${sql}\`),
      disconnect: () => console.log('Disconnected from database')
    };
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true (same instance)

db1.connect();
db2.query('SELECT * FROM users');

// Singleton using class
class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logs = [];
    Logger.instance = this;
  }

  log(message) {
    this.logs.push({
      message,
      timestamp: new Date()
    });
    console.log(\`[LOG] \${message}\`);
  }

  getLogs() {
    return this.logs;
  }
}

const logger1 = new Logger();
const logger2 = new Logger();

console.log(logger1 === logger2); // true
logger1.log('First message');
logger2.log('Second message');
console.log(logger1.getLogs().length); // 2`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Factory Pattern',
      id: 'factory-pattern'
    },
    {
      type: 'paragraph',
      text: 'The Factory pattern creates objects without specifying their exact classes. It provides an interface for creating objects, letting subclasses decide which class to instantiate.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Simple Factory
class AnimalFactory {
  static createAnimal(type) {
    switch(type) {
      case 'dog':
        return new Dog();
      case 'cat':
        return new Cat();
      case 'bird':
        return new Bird();
      default:
        throw new Error(\`Unknown animal type: \${type}\`);
    }
  }
}

class Dog {
  speak() { return 'Woof!'; }
}

class Cat {
  speak() { return 'Meow!'; }
}

class Bird {
  speak() { return 'Tweet!'; }
}

const dog = AnimalFactory.createAnimal('dog');
console.log(dog.speak()); // "Woof!"

// Factory function approach (more flexible)
function createUser(type) {
  if (type === 'admin') {
    return {
      name: 'Admin',
      permissions: ['read', 'write', 'delete'],
      canModerate: true
    };
  }

  if (type === 'moderator') {
    return {
      name: 'Moderator',
      permissions: ['read', 'write'],
      canModerate: true
    };
  }

  return {
    name: 'User',
    permissions: ['read'],
    canModerate: false
  };
}

const admin = createUser('admin');
const user = createUser('user');

console.log(admin.permissions); // ['read', 'write', 'delete']
console.log(user.permissions); // ['read']

// Abstract Factory for related objects
class UIFactory {
  createButton() { throw new Error('Must be implemented'); }
  createInput() { throw new Error('Must be implemented'); }
}

class WindowsFactory extends UIFactory {
  createButton() { return new WindowsButton(); }
  createInput() { return new WindowsInput(); }
}

class MacFactory extends UIFactory {
  createButton() { return new MacButton(); }
  createInput() { return new MacInput(); }
}

class WindowsButton {
  render() { return 'Windows button'; }
}

class MacButton {
  render() { return 'Mac button'; }
}`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Builder Pattern',
      id: 'builder-pattern'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Builder pattern for complex object construction
class Car {
  constructor(builder) {
    this.brand = builder.brand;
    this.model = builder.model;
    this.color = builder.color;
    this.wheels = builder.wheels;
    this.engine = builder.engine;
  }

  toString() {
    return \`\${this.brand} \${this.model} (\${this.color})\`;
  }
}

class CarBuilder {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
    this.color = 'black';
    this.wheels = 4;
    this.engine = '2.0L';
  }

  setColor(color) {
    this.color = color;
    return this; // Enable chaining
  }

  setWheels(wheels) {
    this.wheels = wheels;
    return this;
  }

  setEngine(engine) {
    this.engine = engine;
    return this;
  }

  build() {
    return new Car(this);
  }
}

// Usage
const car = new CarBuilder('Toyota', 'Camry')
  .setColor('blue')
  .setEngine('3.0L')
  .build();

console.log(car.toString()); // "Toyota Camry (blue)"

// Builder for configuration objects
class RequestBuilder {
  constructor(url) {
    this.url = url;
    this.method = 'GET';
    this.headers = {};
    this.body = null;
    this.timeout = 5000;
  }

  setMethod(method) {
    this.method = method;
    return this;
  }

  addHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  setTimeout(timeout) {
    this.timeout = timeout;
    return this;
  }

  build() {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body,
      timeout: this.timeout
    };
  }
}

const request = new RequestBuilder('https://api.example.com/users')
  .setMethod('POST')
  .addHeader('Content-Type', 'application/json')
  .setBody({ name: 'John' })
  .build();

console.log(request);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Structural Patterns',
      id: 'structural-patterns'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Adapter Pattern',
      id: 'adapter-pattern'
    },
    {
      type: 'paragraph',
      text: 'The Adapter pattern converts the interface of a class into another interface clients expect, allowing incompatible objects to work together.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Adapter pattern - making incompatible interfaces compatible
class OldPaymentSystem {
  processPayment(amount) {
    console.log(\`Old system processing: \${amount}\`);
    return { success: true, id: 'old-' + Date.now() };
  }
}

class NewPaymentSystem {
  execute(data) {
    console.log(\`New system executing payment: \${data.value}\`);
    return { transactionId: 'new-' + Date.now() };
  }
}

// Expected interface
class PaymentAdapter {
  constructor(paymentSystem) {
    this.paymentSystem = paymentSystem;
  }

  pay(amount) {
    if (this.paymentSystem instanceof OldPaymentSystem) {
      return this.paymentSystem.processPayment(amount);
    }

    if (this.paymentSystem instanceof NewPaymentSystem) {
      return this.paymentSystem.execute({ value: amount });
    }
  }
}

const oldAdapter = new PaymentAdapter(new OldPaymentSystem());
const newAdapter = new PaymentAdapter(new NewPaymentSystem());

oldAdapter.pay(100); // Works with old system
newAdapter.pay(100); // Works with new system

// Practical example: API response adapter
class LegacyAPI {
  getUser(id) {
    return {
      user_id: id,
      user_name: 'John Doe',
      user_email: 'john@example.com'
    };
  }
}

class ModernAPI {
  getUser(id) {
    return {
      id: id,
      name: 'John Doe',
      email: 'john@example.com'
    };
  }
}

class UserAdapter {
  constructor(api) {
    this.api = api;
  }

  getUser(id) {
    let data = this.api.getUser(id);

    // Normalize response format
    if ('user_id' in data) {
      return {
        id: data.user_id,
        name: data.user_name,
        email: data.user_email
      };
    }

    return data;
  }
}

const legacyAdapter = new UserAdapter(new LegacyAPI());
const modernAdapter = new UserAdapter(new ModernAPI());

console.log(legacyAdapter.getUser(1));
console.log(modernAdapter.getUser(1));`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Decorator Pattern',
      id: 'decorator-pattern'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Decorator pattern - adding functionality dynamically
class Pizza {
  cost() {
    return 10;
  }

  getDescription() {
    return 'Plain Pizza';
  }
}

class PizzaDecorator {
  constructor(pizza) {
    this.pizza = pizza;
  }

  cost() {
    return this.pizza.cost();
  }

  getDescription() {
    return this.pizza.getDescription();
  }
}

class CheeseDecorator extends PizzaDecorator {
  cost() {
    return this.pizza.cost() + 2;
  }

  getDescription() {
    return this.pizza.getDescription() + ', Cheese';
  }
}

class PepperoniDecorator extends PizzaDecorator {
  cost() {
    return this.pizza.cost() + 2.5;
  }

  getDescription() {
    return this.pizza.getDescription() + ', Pepperoni';
  }
}

class MushroomDecorator extends PizzaDecorator {
  cost() {
    return this.pizza.cost() + 1.5;
  }

  getDescription() {
    return this.pizza.getDescription() + ', Mushroom';
  }
}

// Usage
let pizza = new Pizza();
console.log(pizza.getDescription(), pizza.cost()); // "Plain Pizza" 10

pizza = new CheeseDecorator(pizza);
console.log(pizza.getDescription(), pizza.cost()); // "Plain Pizza, Cheese" 12

pizza = new PepperoniDecorator(pizza);
console.log(pizza.getDescription(), pizza.cost()); // "Plain Pizza, Cheese, Pepperoni" 14.5

// Function decorator using higher-order functions
function logger(fn) {
  return function(...args) {
    console.log(\`Calling \${fn.name} with args: \${JSON.stringify(args)}\`);
    const result = fn.apply(this, args);
    console.log(\`Result: \${result}\`);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = logger(add);
loggedAdd(5, 3); // Logs function call and result

// Decorator for performance measurement
function measurePerformance(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(\`\${fn.name} took \${(end - start).toFixed(2)}ms\`);
    return result;
  };
}

function slowOperation() {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
}

const measuredOperation = measurePerformance(slowOperation);
measuredOperation();`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Behavioral Patterns',
      id: 'behavioral-patterns'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Observer Pattern',
      id: 'observer-pattern'
    },
    {
      type: 'paragraph',
      text: 'The Observer pattern defines a one-to-many dependency where when one object changes state, all dependents are notified automatically.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Observer pattern
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data) {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

class Observer {
  update(data) {
    throw new Error('Update method must be implemented');
  }
}

class StockPriceFeed extends Subject {
  constructor(symbol) {
    super();
    this.symbol = symbol;
    this.price = 0;
  }

  setPrice(newPrice) {
    this.price = newPrice;
    this.notify({
      symbol: this.symbol,
      price: newPrice
    });
  }
}

class StockViewer extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }

  update(data) {
    console.log(\`\${this.name}: \${data.symbol} is now $\${data.price}\`);
  }
}

// Usage
const feed = new StockPriceFeed('AAPL');

const viewer1 = new StockViewer('Viewer 1');
const viewer2 = new StockViewer('Viewer 2');

feed.subscribe(viewer1);
feed.subscribe(viewer2);

feed.setPrice(150); // Both viewers notified

feed.unsubscribe(viewer1);
feed.setPrice(151); // Only viewer2 notified

// Event emitter implementation
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });
  }
}

const emitter = new EventEmitter();

emitter.on('user:login', (user) => {
  console.log(\`User \${user.name} logged in\`);
});

emitter.emit('user:login', { name: 'Alice' });`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Strategy Pattern',
      id: 'strategy-pattern'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Strategy pattern - encapsulating algorithms
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  process(amount) {
    return this.strategy.pay(amount);
  }
}

// Different payment strategies
class CreditCardStrategy {
  pay(amount) {
    console.log(\`Processing $\${amount} via credit card\`);
    return { method: 'credit-card', amount, success: true };
  }
}

class PayPalStrategy {
  pay(amount) {
    console.log(\`Processing $\${amount} via PayPal\`);
    return { method: 'paypal', amount, success: true };
  }
}

class CryptoCurrencyStrategy {
  pay(amount) {
    console.log(\`Processing $\${amount} via Bitcoin\`);
    return { method: 'crypto', amount, success: true };
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardStrategy());
processor.process(100);

processor.setStrategy(new PayPalStrategy());
processor.process(50);

processor.setStrategy(new CryptoCurrencyStrategy());
processor.process(25);

// Sorting strategy example
class SortingContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    return this.strategy.sort(data);
  }
}

class QuickSort {
  sort(data) {
    console.log('Sorting using QuickSort');
    return data.sort((a, b) => a - b);
  }
}

class MergeSort {
  sort(data) {
    console.log('Sorting using MergeSort');
    return data.sort((a, b) => a - b);
  }
}

const sorter = new SortingContext(new QuickSort());
console.log(sorter.sort([3, 1, 4, 1, 5, 9]));`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'State Pattern',
      id: 'state-pattern'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// State pattern - managing object state transitions
class TrafficLight {
  constructor() {
    this.state = new RedState();
  }

  setState(state) {
    this.state = state;
  }

  change() {
    this.state.change(this);
  }

  getLight() {
    return this.state.getLight();
  }
}

class State {
  change(context) {
    throw new Error('Change method must be implemented');
  }

  getLight() {
    throw new Error('GetLight method must be implemented');
  }
}

class RedState extends State {
  change(context) {
    console.log('Red -> Green');
    context.setState(new GreenState());
  }

  getLight() {
    return 'Red';
  }
}

class GreenState extends State {
  change(context) {
    console.log('Green -> Yellow');
    context.setState(new YellowState());
  }

  getLight() {
    return 'Green';
  }
}

class YellowState extends State {
  change(context) {
    console.log('Yellow -> Red');
    context.setState(new RedState());
  }

  getLight() {
    return 'Yellow';
  }
}

// Usage
const light = new TrafficLight();
console.log(light.getLight()); // "Red"
light.change(); // "Red -> Green"
console.log(light.getLight()); // "Green"
light.change(); // "Green -> Yellow"
console.log(light.getLight()); // "Yellow"

// Document state example
class Document {
  constructor() {
    this.state = new DraftState();
  }

  setState(state) {
    this.state = state;
  }

  publish() {
    this.state.publish(this);
  }

  review() {
    this.state.review(this);
  }

  getState() {
    return this.state.constructor.name;
  }
}

class DraftState {
  publish(doc) {
    console.log('Moving to review');
    doc.setState(new ReviewState());
  }

  review(doc) {
    console.log('Cannot review in draft state');
  }
}

class ReviewState {
  publish(doc) {
    console.log('Publishing document');
    doc.setState(new PublishedState());
  }

  review(doc) {
    console.log('Already in review');
  }
}

class PublishedState {
  publish(doc) {
    console.log('Already published');
  }

  review(doc) {
    console.log('Cannot review published document');
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Architectural Patterns',
      id: 'architectural-patterns'
    },
    {
      type: 'heading',
      level: 3,
      text: 'Module Pattern',
      id: 'module-pattern'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Module pattern - encapsulation with closures
const Calculator = (() => {
  // Private variables
  let history = [];

  // Private function
  function logOperation(a, b, operation, result) {
    history.push({ a, b, operation, result, timestamp: new Date() });
  }

  // Public interface
  return {
    add(a, b) {
      const result = a + b;
      logOperation(a, b, 'add', result);
      return result;
    },

    subtract(a, b) {
      const result = a - b;
      logOperation(a, b, 'subtract', result);
      return result;
    },

    multiply(a, b) {
      const result = a * b;
      logOperation(a, b, 'multiply', result);
      return result;
    },

    getHistory() {
      return [...history]; // Return copy to prevent modification
    },

    clearHistory() {
      history = [];
    }
  };
})();

// Usage
console.log(Calculator.add(5, 3)); // 8
console.log(Calculator.multiply(4, 2)); // 8
console.log(Calculator.getHistory()); // Shows all operations
console.log(Calculator.history); // undefined (private);`,
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
      text: 'Design patterns are proven solutions to common problems. Creational patterns control object creation (Singleton, Factory, Builder). Structural patterns deal with object composition (Adapter, Decorator). Behavioral patterns focus on communication between objects (Observer, Strategy, State). Choose patterns based on your specific needs - overuse leads to unnecessary complexity. Combine patterns to solve complex architectural challenges.'
    }
  ],
  exercises: [
    'Implement a Singleton logger and verify only one instance exists',
    'Create a Factory pattern for different database connections',
    'Build a shopping cart using Decorator pattern for add-ons and modifications',
    'Implement an Observer pattern for a real-time notification system',
    'Create a payment processor using Strategy pattern supporting multiple payment methods',
    'Build a document workflow using State pattern for different document states'
  ]
};
