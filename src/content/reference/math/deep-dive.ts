import type { ReferenceContent } from '@/types/content';

export const mathDeepDiveReference: ReferenceContent = {
  id: 'reference-math-deep-dive',
  title: 'Math API Deep Dive',
  description: 'Master mathematical operations, constants, and algorithms with JavaScript\'s Math object.',
  slug: 'reference/math/deep-dive',
  pillar: 'reference',
  category: 'math',
  tags: ['math', 'constants', 'trigonometry', 'random', 'algorithms'],
  difficulty: 'intermediate',
  contentType: 'reference',
  summary: 'The Math object provides constants and methods for advanced mathematical operations. From basic rounding to complex trigonometry and random number generation.',
  relatedTopics: ['bitwise-operations', 'typed-arrays'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 14,
  featured: false,
  keywords: ['math', 'trigonometry', 'random', 'rounding', 'algorithms'],
  signature: 'Math.method(arguments)',
  parameters: [
    { name: 'x', type: 'number', description: 'Input value for mathematical operations.' }
  ],
  returnValue: { type: 'number', description: 'The result of the mathematical operation.' },
  compatibility: 'All browsers — Math is a global object',
  sections: [
    { type: 'heading', level: 2, text: 'Math Constants', id: 'constants' },
    { type: 'paragraph', text: 'The Math object provides important mathematical constants that are read-only.' },
    { type: 'code', language: 'javascript', filename: 'math-constants.js', code: `// Fundamental constants
console.log(Math.PI);         // 3.141592653589793 (π)
console.log(Math.E);          // 2.718281828459045 (Euler's number)
console.log(Math.LN2);        // 0.6931471805599453 (Natural log of 2)
console.log(Math.LN10);       // 2.302585092994046 (Natural log of 10)
console.log(Math.LOG2E);      // 1.4426950408889634 (Log base 2 of E)
console.log(Math.LOG10E);     // 0.4342944819032518 (Log base 10 of E)
console.log(Math.SQRT1_2);    // 0.7071067811865476 (√0.5)
console.log(Math.SQRT2);      // 1.4142135623730951 (√2)

// Useful combinations
const circumference = 2 * Math.PI * radius;
const exponentialGrowth = Math.E ** time;
const decibels = 20 * Math.LOG10E * linearValue;` },

    { type: 'heading', level: 2, text: 'Rounding Methods', id: 'rounding' },
    { type: 'paragraph', text: 'Different rounding behaviors for different use cases.' },
    { type: 'code', language: 'javascript', filename: 'math-rounding.js', code: `const num = 4.7;
const neg = -4.3;

// Round to nearest integer
console.log(Math.round(4.5));   // 5
console.log(Math.round(4.4));   // 4
console.log(Math.round(-4.5));  // -4 (rounds to nearest even)

// Always round down (floor)
console.log(Math.floor(4.9));   // 4
console.log(Math.floor(-4.1));  // -5 (rounds down!)

// Always round up (ceiling)
console.log(Math.ceil(4.1));    // 5
console.log(Math.ceil(-4.9));   // -4

// Truncate (remove decimal, towards zero)
console.log(Math.trunc(4.9));   // 4
console.log(Math.trunc(-4.9));  // -4 (towards zero!)

// Round to N decimal places
function roundTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

console.log(roundTo(3.14159, 2)); // 3.14
console.log(roundTo(100.456, 1)); // 100.5` },

    { type: 'heading', level: 2, text: 'Absolute Value and Sign', id: 'abs-sign' },
    { type: 'code', language: 'javascript', filename: 'math-abs-sign.js', code: `// Absolute value (magnitude)
console.log(Math.abs(5));        // 5
console.log(Math.abs(-5));       // 5
console.log(Math.abs(-3.14));    // 3.14

// Get sign of number (-1, 0, or 1)
console.log(Math.sign(10));      // 1 (positive)
console.log(Math.sign(-10));     // -1 (negative)
console.log(Math.sign(0));       // 0
console.log(Math.sign(-0));      // -0
console.log(Math.sign(NaN));     // NaN

// Distance between two numbers
function distance(a, b) {
  return Math.abs(a - b);
}
console.log(distance(10, 3));    // 7

// Clamp value between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
console.log(clamp(5, 0, 10));    // 5
console.log(clamp(-5, 0, 10));   // 0 (clamped to min)
console.log(clamp(15, 0, 10));   // 10 (clamped to max)` },

    { type: 'heading', level: 2, text: 'Power and Root Operations', id: 'power-root' },
    { type: 'code', language: 'javascript', filename: 'math-power-root.js', code: `// Powers and exponents
console.log(Math.pow(2, 3));     // 8 (2³)
console.log(Math.pow(5, 2));     // 25 (5²)
console.log(Math.pow(10, -1));   // 0.1 (10⁻¹)
console.log(2 ** 8);             // 256 (exponential operator)

// Square root
console.log(Math.sqrt(16));      // 4
console.log(Math.sqrt(2));       // 1.414... (√2)
console.log(Math.sqrt(-1));      // NaN (no real square root)

// Cube root
function cbrt(x) {
  return x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3);
}
console.log(cbrt(8));            // 2
console.log(cbrt(-8));           // -2

// Nth root
function nthRoot(x, n) {
  return Math.pow(x, 1 / n);
}
console.log(nthRoot(16, 4));     // 2 (⁴√16)
console.log(nthRoot(27, 3));     // 3 (³√27)

// Hypoteneuse (Pythagorean theorem)
function hypotenuse(a, b) {
  return Math.hypot(a, b);
}
console.log(Math.hypot(3, 4));   // 5 (√(3² + 4²))
console.log(Math.hypot(5, 12));  // 13` },

    { type: 'heading', level: 2, text: 'Trigonometric Functions', id: 'trigonometry' },
    { type: 'code', language: 'javascript', filename: 'math-trig.js', code: `// All trig functions work with radians, not degrees!
// Convert degrees to radians: degrees * (π / 180)
// Convert radians to degrees: radians * (180 / π)

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Sine, Cosine, Tangent
console.log(Math.sin(toRadians(90)));   // 1 (sin 90°)
console.log(Math.cos(toRadians(0)));    // 1 (cos 0°)
console.log(Math.tan(toRadians(45)));   // 1 (tan 45°)

// Inverse trigonometric (returns radians)
console.log(Math.asin(1));              // 1.5708... (π/2 radians = 90°)
console.log(Math.acos(0));              // 1.5708... (π/2)
console.log(Math.atan(1));              // 0.7854... (π/4 radians = 45°)
console.log(Math.atan2(1, 1));          // 0.7854... (angle from origin)

// Rotating a point around origin
function rotatePoint(x, y, angleDegrees) {
  const angle = toRadians(angleDegrees);
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  };
}

const rotated = rotatePoint(1, 0, 90);
console.log(rotated); // { x: ~0, y: 1 } (rotated 90°)` },

    { type: 'heading', level: 2, text: 'Logarithmic Functions', id: 'logarithms' },
    { type: 'code', language: 'javascript', filename: 'math-logarithms.js', code: `// Natural logarithm (base e)
console.log(Math.log(Math.E));   // 1 (log of e is 1)
console.log(Math.log(1));        // 0 (log of 1 is always 0)
console.log(Math.log(10));       // 2.302... (natural log of 10)

// Logarithm base 10
console.log(Math.log10(1));      // 0
console.log(Math.log10(10));     // 1
console.log(Math.log10(100));    // 2 (10² = 100)
console.log(Math.log10(1000));   // 3

// Logarithm base 2
console.log(Math.log2(1));       // 0
console.log(Math.log2(2));       // 1
console.log(Math.log2(8));       // 3 (2³ = 8)
console.log(Math.log2(1024));    // 10 (2¹⁰)

// Custom base logarithm
function logBase(x, base) {
  return Math.log(x) / Math.log(base);
}
console.log(logBase(125, 5));    // 3 (5³ = 125)

// Exponential functions
console.log(Math.exp(0));        // 1 (e⁰)
console.log(Math.exp(1));        // 2.718... (e¹)
console.log(Math.exp(2));        // 7.389... (e²)

// Decibel calculations (audio/signal processing)
function amplitudeToDecibels(amplitude) {
  return 20 * Math.log10(Math.abs(amplitude));
}
console.log(amplitudeToDecibels(1));    // 0 dB (reference)
console.log(amplitudeToDecibels(0.1));  // -20 dB` },

    { type: 'heading', level: 2, text: 'Min and Max', id: 'min-max' },
    { type: 'code', language: 'javascript', filename: 'math-min-max.js', code: `// Find minimum
console.log(Math.min(5, 2, 8, 1));    // 1
console.log(Math.min(5));              // 5
console.log(Math.min());               // Infinity (no args = Infinity)

// Find maximum
console.log(Math.max(5, 2, 8, 1));    // 8
console.log(Math.max(-5, -2, -8));    // -2

// With arrays (use spread operator)
const numbers = [5, 2, 8, 1, 9];
console.log(Math.min(...numbers));    // 1
console.log(Math.max(...numbers));    // 9

// Handle NaN
console.log(Math.min(5, NaN, 3));    // NaN (NaN propagates)

// Find range of values
function range(arr) {
  return Math.max(...arr) - Math.min(...arr);
}
console.log(range([10, 20, 30, 5, 15])); // 25

// Practical: Find value closest to target
function closest(arr, target) {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}
console.log(closest([10, 20, 25, 30], 23)); // 25` },

    { type: 'heading', level: 2, text: 'Random Number Generation', id: 'random' },
    { type: 'code', language: 'javascript', filename: 'math-random.js', code: `// Generate random decimal 0 (inclusive) to 1 (exclusive)
console.log(Math.random()); // 0.123... (different each time)

// Random integer between 0 and 9
function randomInt(max) {
  return Math.floor(Math.random() * max);
}
console.log(randomInt(10)); // 0-9

// Random integer in range [min, max]
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(randomRange(5, 10));  // 5-10 inclusive

// Random float in range [min, max)
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
console.log(randomFloat(0, 100)); // 0-100 (exclusive of 100)

// Pick random item from array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
const colors = ['red', 'blue', 'green'];
console.log(randomItem(colors));

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
console.log(shuffle([1, 2, 3, 4, 5]));

// Weighted random selection
function weightedRandom(items, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
}

const results = ['win', 'lose'];
const weights = [70, 30]; // 70% chance to win
console.log(weightedRandom(results, weights));` },

    { type: 'heading', level: 2, text: 'Special Values and Edge Cases', id: 'special-values' },
    { type: 'code', language: 'javascript', filename: 'math-special.js', code: `// Infinity
console.log(Math.max());        // -Infinity
console.log(Math.min());        // Infinity
console.log(1 / 0);             // Infinity
console.log(-1 / 0);            // -Infinity

// Not a Number (NaN)
console.log(Math.sqrt(-1));     // NaN
console.log(0 / 0);             // NaN
console.log(Math.asin(2));      // NaN (outside domain)

// Check for special values
console.log(isNaN(NaN));        // true
console.log(isFinite(100));     // true
console.log(isFinite(Infinity)); // false

// Safe number checks
function isSafeInteger(n) {
  return Number.isInteger(n) && 
         Math.abs(n) <= Number.MAX_SAFE_INTEGER;
}
console.log(isSafeInteger(100));        // true
console.log(isSafeInteger(Math.PI));    // false
console.log(isSafeInteger(2 ** 53));    // false

// Floating point precision
console.log(0.1 + 0.2);         // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false!

// Fix floating point comparison
function almostEqual(a, b, epsilon = 1e-10) {
  return Math.abs(a - b) < epsilon;
}
console.log(almostEqual(0.1 + 0.2, 0.3)); // true` },

    { type: 'heading', level: 2, text: 'Geometry and Physics Formulas', id: 'geometry' },
    { type: 'code', language: 'javascript', filename: 'math-geometry.js', code: `// Circle calculations
function circleArea(radius) {
  return Math.PI * radius ** 2;
}

function circleCircumference(radius) {
  return 2 * Math.PI * radius;
}

console.log(circleArea(5));        // 78.54...
console.log(circleCircumference(5)); // 31.42...

// Sphere calculations
function sphereVolume(radius) {
  return (4 / 3) * Math.PI * radius ** 3;
}

function sphereSurfaceArea(radius) {
  return 4 * Math.PI * radius ** 2;
}

// Distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
console.log(distance(0, 0, 3, 4)); // 5

// Distance in 3D
function distance3D(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}

// Angle between two lines
function angle(slope1, slope2) {
  return Math.atan(Math.abs((slope1 - slope2) / (1 + slope1 * slope2)));
}

// Great circle distance (Earth: haversine formula)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}` },

    { type: 'heading', level: 2, text: 'Practical Algorithms', id: 'algorithms' },
    { type: 'code', language: 'javascript', filename: 'math-algorithms.js', code: `// Linear interpolation (lerp)
function lerp(a, b, t) {
  return a + (b - a) * t;
}
console.log(lerp(0, 100, 0.5)); // 50 (halfway)

// Easing functions (animation)
function easeInQuad(t) {
  return t * t;
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Percentage/ratio calculations
function percentage(part, whole) {
  return (part / whole) * 100;
}
console.log(percentage(25, 100)); // 25

function percentOf(value, percent) {
  return (value * percent) / 100;
}
console.log(percentOf(100, 25)); // 25

// Calculate mean, median, mode
function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Standard deviation
function stdDev(arr) {
  const avg = mean(arr);
  const squareDiffs = arr.map(x => Math.pow(x - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

// Normal distribution (Box-Muller)
function randomNormal() {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0;
}` },

    { type: 'heading', level: 2, text: 'Performance Notes', id: 'performance' },
    { type: 'code', language: 'javascript', filename: 'math-performance.js', code: `// Math.pow is slower than exponential operator
const iterations = 1000000;

// Test 1: Math.pow
console.time('Math.pow');
for (let i = 0; i < iterations; i++) {
  Math.pow(2, 8);
}
console.timeEnd('Math.pow');

// Test 2: Exponential operator
console.time('**');
for (let i = 0; i < iterations; i++) {
  2 ** 8;
}
console.timeEnd('**');
// ** is usually faster

// Math.sqrt vs ** 0.5
console.time('Math.sqrt');
for (let i = 0; i < iterations; i++) {
  Math.sqrt(100);
}
console.timeEnd('Math.sqrt');

console.time('** 0.5');
for (let i = 0; i < iterations; i++) {
  100 ** 0.5;
}
console.timeEnd('** 0.5');
// Math.sqrt is usually faster

// Cache Math constants in hot loops
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;
for (let i = 0; i < 1000000; i++) {
  const angle = (i / 1000000) * TWO_PI;
  // Use PI and TWO_PI instead of recalculating
}` },

    { type: 'heading', level: 2, text: 'Common Patterns and Gotchas', id: 'patterns' },
    { type: 'code', language: 'javascript', filename: 'math-patterns.js', code: `// ❌ Gotcha: Math.round on negative numbers
console.log(Math.round(-4.5));  // -4 (rounds to nearest even!)
console.log(Math.round(4.5));   // 4 (also rounds to nearest even!)

// ✅ Use custom rounding if you need different behavior
function roundHalfUp(n) {
  return Math.sign(n) * Math.floor(Math.abs(n) + 0.5);
}
console.log(roundHalfUp(-4.5));  // -5
console.log(roundHalfUp(4.5));   // 5

// ❌ Gotcha: Trig functions use radians, not degrees
Math.sin(90);  // 0.893... NOT 1
Math.sin(Math.PI / 2); // 1 ✓

// ❌ Gotcha: parseInt vs Math.floor
parseInt('5.9');      // 5 (string parsing)
Math.floor(5.9);      // 5 (numeric)
parseInt('5.9xyz');   // 5 (still works!)
Math.floor('5.9xyz'); // NaN

// ❌ Gotcha: Division by zero
console.log(1 / 0);   // Infinity (not an error!)
console.log(0 / 0);   // NaN

// ✅ Safe division
function safeDivide(a, b) {
  return b === 0 ? null : a / b;
}` },
  ],
};
