import type { ReferenceContent } from '@/types/content';

export const typedArraysReference: ReferenceContent = {
  id: 'reference-typed-arrays',
  title: 'Typed Arrays',
  description: 'Work with fixed-size, fixed-type arrays for binary data and high-performance operations.',
  slug: 'reference/array/typed-arrays',
  pillar: 'reference',
  category: 'array-methods',
  tags: ['typed-array', 'binary', 'buffer', 'performance', 'webgl', 'es5'],
  difficulty: 'advanced',
  contentType: 'reference',
  summary: 'Typed Arrays provide fixed-size, fixed-type arrays for efficient handling of binary data. Essential for WebGL, Web Audio, and file processing.',
  relatedTopics: ['array-methods', 'buffer', 'blob'],
  order: 11,
  updatedAt: '2025-06-01',
  readingTime: 12,
  featured: false,
  keywords: ['typed array', 'buffer', 'binary', 'performance', 'webgl', 'uint8array'],
  signature: 'new TypedArray(length) or new TypedArray(buffer, byteOffset?, length?)',
  parameters: [
    { name: 'TypedArray', type: 'constructor', description: 'One of: Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array, BigUint64Array, BigInt64Array' },
    { name: 'length', type: 'number', description: 'Number of elements in the array.' },
    { name: 'buffer', type: 'ArrayBuffer', description: 'The buffer to view.' },
    { name: 'byteOffset', type: 'number', description: 'Offset in bytes from the start of the buffer.', optional: true },
  ],
  returnValue: { type: 'TypedArray', description: 'A new typed array view or instance.' },
  compatibility: 'ES5 (ES2015 standardized) — All modern browsers, Node.js 0.10+',
  sections: [
    { type: 'heading', level: 2, text: 'What Are Typed Arrays?', id: 'what-are' },
    { type: 'paragraph', text: 'Typed Arrays are array-like objects that provide a mechanism to access raw binary data. Unlike regular JavaScript arrays which can hold any type of value, typed arrays hold a single numeric type (integers or floats) in a contiguous block of memory. This makes them perfect for high-performance operations and interop with low-level APIs.' },
    { type: 'callout', variant: 'info', title: 'Fixed Size and Type', text: 'Once created, a typed array cannot grow or shrink. It always contains the same numeric type. This constraint enables optimizations that regular arrays cannot have.' },

    { type: 'heading', level: 2, text: 'Typed Array Types', id: 'types' },
    { type: 'table', headers: ['Type', 'Bytes', 'Range', 'Use Case'], rows: [
      ['Uint8Array', '1', '0 to 255', 'Images, audio, raw binary'],
      ['Int8Array', '1', '-128 to 127', 'Signed byte data'],
      ['Uint16Array', '2', '0 to 65,535', 'Audio samples, colors'],
      ['Int16Array', '2', '-32,768 to 32,767', 'Signed 16-bit data'],
      ['Uint32Array', '4', '0 to 4,294,967,295', 'Large unsigned integers'],
      ['Int32Array', '4', '-2.1B to 2.1B', 'Large signed integers'],
      ['Float32Array', '4', '±1.2e-38 to ±3.4e+38', 'Graphics, WebGL, precision'],
      ['Float64Array', '8', '±5e-324 to ±1.8e+308', 'Double-precision floats'],
      ['BigUint64Array', '8', '0 to 2^64-1', 'Very large integers'],
      ['BigInt64Array', '8', '-2^63 to 2^63-1', 'Very large signed integers'],
    ]},

    { type: 'heading', level: 2, text: 'Creating Typed Arrays', id: 'creating' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-create.js', code: `// Method 1: Specify length
const uint8 = new Uint8Array(5);
console.log(uint8); // Uint8Array(5) [ 0, 0, 0, 0, 0 ]

const float32 = new Float32Array(3);
console.log(float32); // Float32Array(3) [ 0, 0, 0 ]

// Method 2: From iterable (array-like or array)
const data = new Uint8Array([255, 128, 64, 32, 16]);
console.log(data); // Uint8Array(5) [ 255, 128, 64, 32, 16 ]

const fromArray = new Int16Array([100, -100, 500, -500]);
console.log(fromArray); // Int16Array(4) [ 100, -100, 500, -500 ]

// Method 3: From existing typed array (copies data)
const original = new Uint8Array([1, 2, 3]);
const copy = new Uint8Array(original);
copy[0] = 99;
console.log(original[0]); // 1 — different arrays!

// Method 4: From ArrayBuffer with offset/length
const buffer = new ArrayBuffer(16); // 16 bytes
const view1 = new Uint8Array(buffer);        // All 16 bytes
const view2 = new Uint8Array(buffer, 4);     // From byte 4 onwards
const view3 = new Uint8Array(buffer, 4, 8);  // 8 bytes starting at offset 4` },

    { type: 'heading', level: 2, text: 'Accessing and Modifying Elements', id: 'access-modify' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-access.js', code: `const bytes = new Uint8Array([10, 20, 30, 40]);

// Read values (zero-indexed like regular arrays)
console.log(bytes[0]); // 10
console.log(bytes[2]); // 30

// Write values
bytes[0] = 99;
bytes[3] = 200;
console.log(bytes); // Uint8Array(4) [ 99, 20, 30, 200 ]

// Values are clamped to the type's range
const uint8 = new Uint8Array(1);
uint8[0] = 256;  // Clamped to 255
console.log(uint8[0]); // 255

uint8[0] = -1;   // Wraps to 255
console.log(uint8[0]); // 255

// Signed integers wrap around
const int8 = new Int8Array(1);
int8[0] = 128;   // Out of range, wraps
console.log(int8[0]); // -128` },

    { type: 'heading', level: 2, text: 'Working with ArrayBuffer', id: 'arraybuffer' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-buffer.js', code: `// ArrayBuffer is the raw memory
const buffer = new ArrayBuffer(8); // 8 bytes
console.log(buffer.byteLength); // 8

// Create different views of the same buffer
const uint8View = new Uint8Array(buffer);
const uint16View = new Uint16Array(buffer);
const float32View = new Float32Array(buffer);

// Write through one view
uint8View[0] = 0xFF;
uint8View[1] = 0x00;
uint8View[2] = 0xFF;
uint8View[3] = 0x00;

// Read through another view (same memory!)
console.log(uint16View[0]); // 0x00FF = 255 (little-endian)
console.log(uint16View[1]); // 0x00FF = 255

// Get the buffer from a typed array
const data = new Uint8Array([1, 2, 3, 4]);
const sameBuffer = data.buffer;
const otherView = new Uint16Array(sameBuffer);
console.log(otherView); // Can read as 16-bit integers` },

    { type: 'heading', level: 2, text: 'Array Methods on Typed Arrays', id: 'methods' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-methods.js', code: `const nums = new Int32Array([10, 20, 30, 40, 50]);

// Array-like methods work (mostly)
console.log(nums.length); // 5

// Iteration
for (const value of nums) {
  console.log(value); // 10, 20, 30, 40, 50
}

// forEach works
nums.forEach((value, index) => {
  console.log(\`[\${index}] = \${value}\`);
});

// map, filter, reduce work but return TypedArray (same type)
const doubled = nums.map(x => x * 2);
console.log(doubled); // Int32Array(5) [ 20, 40, 60, 80, 100 ]

// find, findIndex, some, every work
const found = nums.find(x => x > 25);
console.log(found); // 30

// slice returns a copy
const slice = nums.slice(1, 4);
console.log(slice); // Int32Array(3) [ 20, 30, 40 ]

// set() copies values from another array
const dest = new Uint8Array(10);
dest.set([1, 2, 3], 5);
console.log(dest); // [0, 0, 0, 0, 0, 1, 2, 3, 0, 0]` },

    { type: 'heading', level: 2, text: 'Image Processing Example', id: 'image-processing' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-image.js', code: `// Simulate image data (RGBA format)
const width = 2;
const height = 2;
const imageData = new Uint8ClampedArray(width * height * 4);

// Pixels: Red, Green, Blue, Alpha
// Pixel 0: Red (255, 0, 0, 255)
imageData[0] = 255;  // R
imageData[1] = 0;    // G
imageData[2] = 0;    // B
imageData[3] = 255;  // A

// Pixel 1: Green (0, 255, 0, 255)
imageData[4] = 0;
imageData[5] = 255;
imageData[6] = 0;
imageData[7] = 255;

// Helper function to set pixel color
function setPixel(data, x, y, width, r, g, b, a = 255) {
  const index = (y * width + x) * 4;
  data[index + 0] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = a;
}

// Helper to get pixel color
function getPixel(data, x, y, width) {
  const index = (y * width + x) * 4;
  return {
    r: data[index + 0],
    g: data[index + 1],
    b: data[index + 2],
    a: data[index + 3]
  };
}

// Grayscale conversion
function toGrayscale(imageData) {
  for (let i = 0; i < imageData.length; i += 4) {
    const gray = (imageData[i] + imageData[i+1] + imageData[i+2]) / 3;
    imageData[i] = gray;
    imageData[i+1] = gray;
    imageData[i+2] = gray;
  }
}` },

    { type: 'heading', level: 2, text: 'Audio Processing Example', id: 'audio-processing' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-audio.js', code: `// Web Audio API uses Float32Array for PCM audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create audio buffer (stereo, 44.1kHz, 2 seconds)
const audioBuffer = audioContext.createBuffer(
  2,                              // channels
  audioContext.sampleRate * 2,   // duration in samples
  audioContext.sampleRate         // sample rate
);

// Get channel data
const leftChannel = audioBuffer.getChannelData(0);
const rightChannel = audioBuffer.getChannelData(1);

console.log(leftChannel instanceof Float32Array); // true

// Generate sine wave
function generateSineWave(frequency, duration, sampleRate) {
  const samples = duration * sampleRate;
  const buffer = new Float32Array(samples);
  
  for (let i = 0; i < samples; i++) {
    buffer[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
  }
  
  return buffer;
}

// Generate 440 Hz (A note) for 2 seconds
const sine = generateSineWave(440, 2, audioContext.sampleRate);

// Copy to audio buffer
leftChannel.set(sine);
rightChannel.set(sine);` },

    { type: 'heading', level: 2, text: 'File and Binary Data Handling', id: 'file-binary' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-file.js', code: `// Reading file as binary
async function readFileAsBytes(file) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  return bytes;
}

// File type detection (magic bytes)
function detectFileType(bytes) {
  if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'JPEG';
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'PNG';
  if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'GIF';
  if (bytes[0] === 0x25 && bytes[1] === 0x50) return 'PDF';
  return 'Unknown';
}

// Create binary data for transmission
function createNetworkPacket(type, data) {
  const buffer = new ArrayBuffer(1 + data.length);
  const view = new Uint8Array(buffer);
  
  view[0] = type;  // First byte: packet type
  view.set(data, 1); // Rest: data payload
  
  return buffer;
}

// Hex dump utility
function hexDump(bytes, width = 16) {
  for (let i = 0; i < bytes.length; i += width) {
    const chunk = bytes.slice(i, i + width);
    const hex = Array.from(chunk)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
    const ascii = Array.from(chunk)
      .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
      .join('');
    console.log(\`\${i.toString(16).padStart(8, '0')} \${hex.padEnd(width * 3, ' ')} \${ascii}\`);
  }
}` },

    { type: 'heading', level: 2, text: 'Endianness Considerations', id: 'endianness' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-endian.js', code: `// JavaScript uses little-endian by default (on most systems)
const buffer = new ArrayBuffer(4);
const uint32 = new Uint32Array(buffer);
const uint8 = new Uint8Array(buffer);

uint32[0] = 0x12345678; // One 32-bit value

// How it's stored (little-endian)
console.log(uint8[0]); // 0x78 (least significant byte first)
console.log(uint8[1]); // 0x56
console.log(uint8[2]); // 0x34
console.log(uint8[3]); // 0x12 (most significant byte last)

// Check system endianness
function getEndianness() {
  const buffer = new ArrayBuffer(2);
  new Uint8Array(buffer)[0] = 0x01;
  return new Uint16Array(buffer)[0] === 0x0100 ? 'big-endian' : 'little-endian';
}

console.log(getEndianness()); // 'little-endian' on most systems

// DataView for explicit endianness control
const dv = new DataView(buffer);
console.log(dv.getUint32(0, true));   // Little-endian
console.log(dv.getUint32(0, false));  // Big-endian (read as different value)` },

    { type: 'heading', level: 2, text: 'Performance Comparison', id: 'performance' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-perf.js', code: `// Regular array
const regularArray = new Array(1000000);
for (let i = 0; i < regularArray.length; i++) {
  regularArray[i] = Math.random() * 255;
}

// Typed array
const typedArray = new Float32Array(1000000);
for (let i = 0; i < typedArray.length; i++) {
  typedArray[i] = Math.random() * 255;
}

console.log(\`Regular array size: \${JSON.stringify(regularArray).length} bytes\`);
console.log(\`Typed array size: \${typedArray.byteLength} bytes\`);
// Typed array is much smaller!

// Sum operation (typed array usually faster)
function sumRegular(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function sumTyped(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Benchmark
const iterations = 1000;
const start1 = performance.now();
for (let i = 0; i < iterations; i++) {
  sumRegular(regularArray);
}
const time1 = performance.now() - start1;

const start2 = performance.now();
for (let i = 0; i < iterations; i++) {
  sumTyped(typedArray);
}
const time2 = performance.now() - start2;

console.log(\`Regular array: \${time1.toFixed(2)}ms\`);
console.log(\`Typed array: \${time2.toFixed(2)}ms\`);` },

    { type: 'heading', level: 2, text: 'Common Pitfalls', id: 'pitfalls' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-pitfalls.js', code: `// ❌ Mistake 1: Forgetting typed arrays have fixed size
const arr = new Uint8Array(5);
arr.length = 10; // Silently fails!
console.log(arr.length); // Still 5

// ✅ Create new array if you need different size
const newArr = new Uint8Array(10);

// ❌ Mistake 2: Expecting push/pop/shift/unshift to work
const typed = new Uint8Array([1, 2, 3]);
typed.push(4); // TypeError: push is not a function

// ✅ Use set() or slice() instead
const copy = new Uint8Array([...typed, 4]); // or use spread operator

// ❌ Mistake 3: Forgetting values are clamped
const uint8 = new Uint8Array(1);
uint8[0] = 1000;
console.log(uint8[0]); // 255, not 1000!

// ❌ Mistake 4: Confusion about buffer sharing
const buffer = new ArrayBuffer(4);
const view1 = new Uint8Array(buffer);
const view2 = new Uint8Array(buffer);
view1[0] = 99;
console.log(view2[0]); // 99 — same buffer!

// ❌ Mistake 5: Type coercion issues with BigInt types
const bigUint = new BigUint64Array(1);
bigUint[0] = 123n;
console.log(bigUint[0]); // 123n (must use BigInt literals)
// bigUint[0] = 123; // WARNING: loses precision!` },

    { type: 'heading', level: 2, text: 'When to Use Typed Arrays', id: 'when-to-use' },
    { type: 'list', items: [
      'Working with binary data (files, network packets, images)',
      'WebGL and 3D graphics (buffer data, textures)',
      'Web Audio API (PCM audio samples)',
      'Canvas operations (image manipulation)',
      'Compression/decompression algorithms',
      'Cryptography and hashing',
      'Machine learning (numerical computations)',
      'High-performance numerical algorithms',
      'Interop with native code via WebAssembly'
    ]},

    { type: 'heading', level: 2, text: 'Real-World WebGL Example', id: 'webgl-example' },
    { type: 'code', language: 'javascript', filename: 'typed-arrays-webgl.js', code: `// WebGL requires typed arrays for GPU data
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

// Vertex positions (3D coordinates)
const vertices = new Float32Array([
  -1.0, -1.0, 0.0,  // Vertex 1
   1.0, -1.0, 0.0,  // Vertex 2
   0.0,  1.0, 0.0   // Vertex 3
]);

// Create vertex buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Vertex colors (RGBA)
const colors = new Float32Array([
  1.0, 0.0, 0.0, 1.0,  // Red
  0.0, 1.0, 0.0, 1.0,  // Green
  0.0, 0.0, 1.0, 1.0   // Blue
]);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

// Indices (which vertices form triangles)
const indices = new Uint16Array([
  0, 1, 2  // One triangle using vertices 0, 1, 2
]);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);` },
  ],
};
