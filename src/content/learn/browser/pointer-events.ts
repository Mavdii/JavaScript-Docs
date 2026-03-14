import type { LessonContent } from '@/types/content';

export const pointerEventsLesson: LessonContent = {
  id: 'pointer-events-001',
  title: 'Pointer Events: Advanced Input Handling',
  description: 'Master Pointer Events for unified handling of mouse, touch, pen, and other input devices with advanced gesture support.',
  slug: 'learn/browser/pointer-events',
  pillar: 'learn',
  category: 'browser',
  tags: ['pointer-events', 'input', 'touch', 'gestures', 'mouse', 'pen', 'interaction'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn Pointer Events API for handling diverse input types uniformly. Understand pointer states, multi-touch, and gesture recognition.',
  relatedTopics: ['event-listeners', 'mouse-events', 'touch-events'],
  order: 13,
  updatedAt: '2024-01-15T14:00:00Z',
  readingTime: 22,
  featured: false,
  keywords: ['Pointer Events', 'pointerdown', 'pointerup', 'pointermove', 'multi-touch', 'gestures', 'pointer capture'],
  prerequisites: ['event-listeners', 'dom-manipulation'],
  learningGoals: [
    'Understand Pointer Events API and advantages over mouse/touch events',
    'Handle different pointer types (mouse, touch, pen)',
    'Implement multi-touch gestures',
    'Master pointer capture for drag operations',
    'Create custom gesture recognition',
    'Build responsive input handlers'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Introduction to Pointer Events',
      id: 'introduction-to-pointer-events'
    },
    {
      type: 'paragraph',
      text: 'Pointer Events is a modern API that unifies handling of different input devices (mouse, touch, pen) under a single event model. Instead of writing separate code for mousedown/touchstart, you can handle them with a single pointerdown event.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Basic Pointer Events
const element = document.getElementById('interactive');

// Pointer down - any device
element.addEventListener('pointerdown', (event) => {
  console.log('Pointer down:', event.pointerId, event.pointerType);
  
  // event.pointerType: 'mouse' | 'touch' | 'pen'
  // event.isPrimary: true if primary pointer
  // event.pointerId: unique identifier for this pointer
  
  if (event.pointerType === 'touch') {
    console.log('Touch input');
  } else if (event.pointerType === 'mouse') {
    console.log('Mouse input');
  } else if (event.pointerType === 'pen') {
    console.log('Pen input');
  }
});

// Pointer move
element.addEventListener('pointermove', (event) => {
  console.log('Position:', event.clientX, event.clientY);
  console.log('Pressure:', event.pressure); // 0.0 to 1.0
  console.log('Tilt:', event.tiltX, event.tiltY); // For pen devices
});

// Pointer up
element.addEventListener('pointerup', (event) => {
  console.log('Pointer released');
});

// Pointer cancel - interrupted
element.addEventListener('pointercancel', (event) => {
  console.log('Pointer cancelled - likely by browser');
});

// Compare with old approach
/*
// OLD: Separate mouse and touch handlers
element.addEventListener('mousedown', handleMouseDown);
element.addEventListener('touchstart', handleTouchStart);

function handleMouseDown(e) { ... }
function handleTouchStart(e) { ... }

// NEW: Single pointer handler
element.addEventListener('pointerdown', handlePointerDown);

function handlePointerDown(e) {
  // Works for all input types
}
*/`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Pointer Properties and State',
      id: 'pointer-properties'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Comprehensive pointer properties
element.addEventListener('pointermove', (event) => {
  // Identification
  console.log(event.pointerId);      // Unique ID for this pointer
  console.log(event.pointerType);    // 'mouse', 'touch', 'pen'
  console.log(event.isPrimary);      // Is this the primary pointer?

  // Position
  console.log(event.clientX, event.clientY);     // Viewport coordinates
  console.log(event.pageX, event.pageY);         // Page coordinates
  console.log(event.screenX, event.screenY);     // Screen coordinates

  // Button state
  console.log(event.buttons);        // Bitmask of pressed buttons
  console.log(event.button);         // Which button changed (0-4)

  // Pressure and tilt (for pen/stylus)
  console.log(event.pressure);       // 0.0 to 1.0
  console.log(event.tangentialPressure); // Barrel pressure
  console.log(event.tiltX, event.tiltY); // Tilt angles
  console.log(event.twist);          // Rotation angle

  // Dimensions (touch width/height)
  console.log(event.width, event.height);

  // Modifiers
  console.log(event.altKey);
  console.log(event.ctrlKey);
  console.log(event.shiftKey);
  console.log(event.metaKey);
});

// Button states
const BUTTON_PRIMARY = 0;
const BUTTON_SECONDARY = 2;
const BUTTON_WHEEL = 1;
const BUTTON_BROWSER_BACK = 3;
const BUTTON_BROWSER_FORWARD = 4;

element.addEventListener('pointerdown', (event) => {
  switch(event.button) {
    case BUTTON_PRIMARY:
      console.log('Left click');
      break;
    case BUTTON_SECONDARY:
      console.log('Right click');
      break;
    case BUTTON_WHEEL:
      console.log('Middle click');
      break;
  }
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Pointer Capture and Drag Operations',
      id: 'pointer-capture'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Pointer capture for drag operations
class DraggableElement {
  constructor(element) {
    this.element = element;
    this.isDragging = false;
    this.activePointerIds = new Set();
    this.offset = { x: 0, y: 0 };

    this.setupListeners();
  }

  setupListeners() {
    this.element.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    document.addEventListener('pointermove', (e) => this.onPointerMove(e));
    document.addEventListener('pointerup', (e) => this.onPointerUp(e));
  }

  onPointerDown(event) {
    if (!event.isPrimary) return;

    // Capture pointer to receive events even outside element
    this.element.setPointerCapture(event.pointerId);
    this.activePointerIds.add(event.pointerId);

    this.isDragging = true;
    const rect = this.element.getBoundingClientRect();

    // Calculate offset between pointer and element
    this.offset.x = event.clientX - rect.left;
    this.offset.y = event.clientY - rect.top;

    this.element.style.opacity = '0.8';
  }

  onPointerMove(event) {
    if (!this.isDragging || !this.activePointerIds.has(event.pointerId)) {
      return;
    }

    // Move element to follow pointer
    const newX = event.clientX - this.offset.x;
    const newY = event.clientY - this.offset.y;

    this.element.style.transform = \`translate(\${newX}px, \${newY}px)\`;
  }

  onPointerUp(event) {
    if (!this.activePointerIds.has(event.pointerId)) return;

    this.activePointerIds.delete(event.pointerId);

    // Release pointer capture
    this.element.releasePointerCapture(event.pointerId);

    if (this.activePointerIds.size === 0) {
      this.isDragging = false;
      this.element.style.opacity = '1';
    }
  }

  destroy() {
    // Clean up listeners
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }
}

// Usage
const draggable = document.getElementById('draggable');
new DraggableElement(draggable);

// Checking pointer capture
element.addEventListener('gotpointercapture', () => {
  console.log('Got pointer capture');
});

element.addEventListener('lostpointercapture', () => {
  console.log('Lost pointer capture');
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Multi-Touch Gestures',
      id: 'multi-touch-gestures'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Handling multi-touch interactions
class MultiTouchHandler {
  constructor(element) {
    this.element = element;
    this.pointers = new Map();

    this.element.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    document.addEventListener('pointermove', (e) => this.onPointerMove(e));
    document.addEventListener('pointerup', (e) => this.onPointerUp(e));
    document.addEventListener('pointercancel', (e) => this.onPointerCancel(e));
  }

  onPointerDown(event) {
    // Track all pointers
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    });

    console.log(\`Pointers down: \${this.pointers.size}\`);

    if (this.pointers.size === 1) {
      this.onSingleTap(event);
    } else if (this.pointers.size === 2) {
      this.onTwoFingers(event);
    } else if (this.pointers.size > 2) {
      this.onMultiTouch(event);
    }
  }

  onPointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;

    const previous = this.pointers.get(event.pointerId);
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    });

    if (this.pointers.size === 1) {
      this.onSingleDrag(event, previous);
    } else if (this.pointers.size === 2) {
      this.onPinch(event);
    }
  }

  onPointerUp(event) {
    this.pointers.delete(event.pointerId);
    console.log(\`Pointers remaining: \${this.pointers.size}\`);
  }

  onPointerCancel(event) {
    this.pointers.delete(event.pointerId);
    console.log('Pointer cancelled');
  }

  onSingleTap(event) {
    console.log('Single tap/click');
  }

  onSingleDrag(event, previous) {
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    console.log(\`Dragging: \${dx}, \${dy}\`);
  }

  onTwoFingers(event) {
    console.log('Two fingers detected');
  }

  onPinch(event) {
    const pointers = Array.from(this.pointers.values());
    if (pointers.length !== 2) return;

    const [p1, p2] = pointers;
    const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    console.log(\`Pinch distance: \${distance.toFixed(2)}\`);
  }

  onMultiTouch(event) {
    console.log(\`Multi-touch with \${this.pointers.size} pointers\`);
  }
}

// Usage
new MultiTouchHandler(document.getElementById('canvas'));`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Gesture Recognition',
      id: 'gesture-recognition'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Custom gesture recognizer
class GestureRecognizer {
  constructor(element, options = {}) {
    this.element = element;
    this.pointers = new Map();
    this.touchStartTime = 0;
    this.gestureCallbacks = {};

    // Configuration
    this.tapDuration = options.tapDuration || 200;
    this.doubleTapDelay = options.doubleTapDelay || 300;
    this.swipeDistance = options.swipeDistance || 50;
    this.pinchThreshold = options.pinchThreshold || 10;

    this.setupListeners();
  }

  setupListeners() {
    this.element.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    document.addEventListener('pointermove', (e) => this.onPointerMove(e));
    document.addEventListener('pointerup', (e) => this.onPointerUp(e));
  }

  onPointerDown(event) {
    if (!event.isPrimary) return;

    this.touchStartTime = Date.now();
    this.pointers.set(event.pointerId, {
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY
    });
  }

  onPointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;

    const pointer = this.pointers.get(event.pointerId);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }

  onPointerUp(event) {
    if (!this.pointers.has(event.pointerId)) return;

    const pointer = this.pointers.get(event.pointerId);
    const duration = Date.now() - this.touchStartTime;

    // Analyze gesture
    const dx = pointer.x - pointer.startX;
    const dy = pointer.y - pointer.startY;
    const distance = Math.hypot(dx, dy);

    // Tap detection
    if (duration < this.tapDuration && distance < 10) {
      this.emit('tap', { x: pointer.startX, y: pointer.startY });
    }

    // Swipe detection
    if (distance > this.swipeDistance) {
      const angle = Math.atan2(dy, dx);
      const direction = this.getSwipeDirection(angle);
      this.emit('swipe', { direction, dx, dy });
    }

    // Long press detection
    if (duration > 500 && distance < 10) {
      this.emit('longpress', { x: pointer.startX, y: pointer.startY });
    }

    this.pointers.delete(event.pointerId);
  }

  getSwipeDirection(angle) {
    const degrees = (angle * 180) / Math.PI;
    if (degrees > -45 && degrees <= 45) return 'right';
    if (degrees > 45 && degrees <= 135) return 'down';
    if (degrees > -135 && degrees <= -45) return 'up';
    return 'left';
  }

  on(gesture, callback) {
    this.gestureCallbacks[gesture] = callback;
  }

  emit(gesture, data) {
    if (this.gestureCallbacks[gesture]) {
      this.gestureCallbacks[gesture](data);
    }
  }
}

// Usage
const recognizer = new GestureRecognizer(document.body);

recognizer.on('tap', (data) => {
  console.log('Tap at:', data);
});

recognizer.on('swipe', (data) => {
  console.log(\`Swiped \${data.direction}\`);
});

recognizer.on('longpress', (data) => {
  console.log('Long press at:', data);
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Drawing Applications',
      id: 'drawing-applications'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Simple drawing application
class DrawingApp {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    // Set canvas size
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.setupListeners();
  }

  setupListeners() {
    this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
    this.canvas.addEventListener('pointerout', (e) => this.onPointerOut(e));

    // Prevent scrolling on touch
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
  }

  onPointerDown(event) {
    if (!event.isPrimary) return;

    this.isDrawing = true;
    this.lastX = event.clientX - this.canvas.getBoundingClientRect().left;
    this.lastY = event.clientY - this.canvas.getBoundingClientRect().top;

    // Adjust line width based on pressure
    const lineWidth = 1 + (event.pressure || 1) * 5;
    this.ctx.lineWidth = lineWidth;
  }

  onPointerMove(event) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Draw line
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.lastX = x;
    this.lastY = y;
  }

  onPointerUp(event) {
    this.isDrawing = false;
  }

  onPointerOut(event) {
    this.isDrawing = false;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Usage
const drawing = new DrawingApp('canvas');`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Browser Support and Fallbacks',
      id: 'browser-support'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Feature detection and fallbacks
const supportsPointerEvents = () => {
  return 'PointerEvent' in window;
};

// Unified input handler with fallback
class UnifiedInputHandler {
  constructor(element) {
    this.element = element;

    if (supportsPointerEvents()) {
      this.setupPointerEvents();
    } else {
      this.setupFallback();
    }
  }

  setupPointerEvents() {
    this.element.addEventListener('pointerdown', (e) => this.handleDown(e));
    document.addEventListener('pointermove', (e) => this.handleMove(e));
    document.addEventListener('pointerup', (e) => this.handleUp(e));
  }

  setupFallback() {
    // Mouse events
    this.element.addEventListener('mousedown', (e) => {
      this.handleDown({ clientX: e.clientX, clientY: e.clientY, pointerType: 'mouse' });
    });

    document.addEventListener('mousemove', (e) => {
      this.handleMove({ clientX: e.clientX, clientY: e.clientY });
    });

    document.addEventListener('mouseup', (e) => {
      this.handleUp({ clientX: e.clientX, clientY: e.clientY });
    });

    // Touch events
    this.element.addEventListener('touchstart', (e) => {
      for (const touch of e.touches) {
        this.handleDown({
          clientX: touch.clientX,
          clientY: touch.clientY,
          pointerType: 'touch'
        });
      }
    });

    document.addEventListener('touchmove', (e) => {
      for (const touch of e.touches) {
        this.handleMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    });

    document.addEventListener('touchend', (e) => {
      for (const touch of e.changedTouches) {
        this.handleUp({ clientX: touch.clientX, clientY: touch.clientY });
      }
    });
  }

  handleDown(event) {
    console.log(\`Input down: \${event.pointerType}\`);
  }

  handleMove(event) {
    console.log('Input move:', event.clientX, event.clientY);
  }

  handleUp(event) {
    console.log('Input up');
  }
}

// Usage
new UnifiedInputHandler(document.body);`,
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
      text: 'Pointer Events unify mouse, touch, and pen input into a single API. Use pointerdown, pointermove, pointerup for all input types. Pointer capture (setPointerCapture) allows tracking outside element bounds. Multi-touch gestures require tracking multiple pointer IDs. Implement fallbacks for older browsers using mouse/touch events. Pointer pressure and tilt enable advanced drawing applications.'
    }
  ],
  exercises: [
    'Create a draggable element using pointer capture',
    'Build a multi-touch gesture recognizer',
    'Implement a simple drawing application',
    'Create a pinch-zoom interaction',
    'Build a gesture-based UI (tap, swipe, long-press)',
    'Create a unified input handler with fallbacks'
  ]
};