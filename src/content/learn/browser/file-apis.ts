import type { LessonContent } from '@/types/content';

export const fileApisLesson: LessonContent = {
  id: 'file-apis',
  title: 'File APIs',
  description: 'Read, preview, and process files uploaded by users — no server needed.',
  slug: 'learn/browser/file-apis',
  pillar: 'learn',
  category: 'browser',
  tags: ['file', 'FileReader', 'upload', 'blob'],
  difficulty: 'intermediate',
  contentType: 'lesson',
  summary: 'The File APIs let you read user files, show previews, and process data on the client before uploading anywhere.',
  relatedTopics: ['fetch', 'events'],
  order: 10,
  updatedAt: '2024-03-01',
  readingTime: 16,
  featured: false,
  keywords: ['File', 'FileReader', 'Blob', 'FileList', 'readAsText', 'readAsDataURL', 'drag and drop', 'File System Access', 'showOpenFilePicker'],
  prerequisites: ['Events', 'Promises'],
  learningGoals: [
    'Read file contents with FileReader',
    'Preview images before upload',
    'Process CSV/text files client-side',
    'Implement drag-and-drop file upload',
    'Validate file size and type',
    'Use the modern File System Access API',
    'Create and download files programmatically',
  ],
  exercises: [
    'Build a drag-and-drop file uploader with image preview.',
    'Create a CSV parser that reads and displays tabular data.',
    'Implement a multi-file uploader with progress indicators.',
    'Build an image editor that crops and resizes before upload.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'File Objects', id: 'file-objects' },
    { type: 'paragraph', text: 'The `File` object represents a file selected by the user (from `<input type="file">` or drag-and-drop). It extends `Blob` and contains metadata like name, size, type, and last modified date. You never create File objects directly — the browser provides them.' },
    {
      type: 'code', language: 'javascript', filename: 'file-object.js',
      code: `// Get files from an input
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
  const files = e.target.files; // FileList (array-like)

  for (const file of files) {
    console.log('Name:', file.name);          // "photo.jpg"
    console.log('Size:', file.size);          // bytes
    console.log('Type:', file.type);          // "image/jpeg"
    console.log('Last Modified:', file.lastModified); // timestamp
    console.log('Size (human):', formatBytes(file.size)); // "2.4 MB"
  }
});

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}`,
    },

    { type: 'heading', level: 2, text: 'Reading Files with FileReader', id: 'reading' },
    {
      type: 'code', language: 'javascript', filename: 'file-reader.js',
      code: `// FileReader reads file contents asynchronously
const reader = new FileReader();

reader.onload = () => {
  console.log('Contents:', reader.result);
};

reader.onerror = () => {
  console.error('Read error:', reader.error);
};

reader.onprogress = (event) => {
  if (event.lengthComputable) {
    const percent = Math.round((event.loaded / event.total) * 100);
    console.log(\`Reading: \${percent}%\`);
  }
};

// Different read methods
reader.readAsText(file);         // String (for text, CSV, JSON)
reader.readAsDataURL(file);      // Base64 data URL (for image preview)
reader.readAsArrayBuffer(file);  // ArrayBuffer (for binary processing)

// Cancel reading
reader.abort();`,
    },

    { type: 'heading', level: 2, text: 'FileReader Methods', id: 'methods' },
    {
      type: 'table',
      headers: ['Method', 'Result Type', 'Use Case'],
      rows: [
        ['readAsText(file, encoding?)', 'String', 'Text files, CSV, JSON, HTML'],
        ['readAsDataURL(file)', 'Base64 data URL', 'Image preview in <img> tags'],
        ['readAsArrayBuffer(file)', 'ArrayBuffer', 'Binary processing, hashing'],
        ['readAsBinaryString(file)', 'Binary string', 'Legacy — prefer ArrayBuffer'],
      ],
    },

    { type: 'heading', level: 2, text: 'Promise-Based FileReader', id: 'promise-reader' },
    {
      type: 'code', language: 'typescript', filename: 'read-file.ts',
      code: `function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Modern alternative: file.text() and file.arrayBuffer()
// (File extends Blob, which has these built-in methods)
const text = await file.text();           // Same as readAsText
const buffer = await file.arrayBuffer();  // Same as readAsArrayBuffer
const stream = file.stream();             // ReadableStream`,
    },
    { type: 'callout', variant: 'tip', title: 'Modern Blob Methods', text: 'Since `File` extends `Blob`, you can use `file.text()` and `file.arrayBuffer()` directly — no FileReader needed! These return Promises and are much simpler.' },

    { type: 'heading', level: 2, text: 'Image Preview', id: 'image-preview' },
    {
      type: 'code', language: 'javascript', filename: 'preview.js',
      code: `// Method 1: URL.createObjectURL (recommended — faster, less memory)
function previewImage(file) {
  const url = URL.createObjectURL(file);
  const img = document.createElement('img');
  img.src = url;
  img.onload = () => URL.revokeObjectURL(url); // Free memory!
  return img;
}

// Method 2: FileReader.readAsDataURL (creates base64 string)
async function previewImageBase64(file) {
  const dataUrl = await readFileAsDataURL(file);
  const img = document.createElement('img');
  img.src = dataUrl;
  return img;
}

// Method 3: Get image dimensions before upload
async function getImageDimensions(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

// Usage
const file = input.files[0];
const dims = await getImageDimensions(file);
console.log(\`Image: \${dims.width}x\${dims.height}\`);`,
    },
    { type: 'callout', variant: 'warning', title: 'Memory Leak', text: 'Always call `URL.revokeObjectURL(url)` after the image loads. Each `createObjectURL` allocates memory that isn\'t garbage collected until the page unloads or the URL is revoked.' },

    { type: 'heading', level: 2, text: 'File Validation', id: 'validation' },
    {
      type: 'code', language: 'typescript', filename: 'validation.ts',
      code: `interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): ValidationResult {
  const errors: string[] = [];

  // Size check
  if (options.maxSizeMB) {
    const maxBytes = options.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      errors.push(\`File too large: \${formatBytes(file.size)} (max \${options.maxSizeMB}MB)\`);
    }
  }

  // Type check
  if (options.allowedTypes) {
    const allowed = options.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    if (!allowed) {
      errors.push(\`Invalid file type: \${file.type}. Allowed: \${options.allowedTypes.join(', ')}\`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// Usage
const result = validateFile(file, {
  maxSizeMB: 5,
  allowedTypes: ['image/*', 'application/pdf'],
});

if (!result.valid) {
  result.errors.forEach(err => showError(err));
}

// HTML attribute validation (first line of defense)
// <input type="file" accept="image/*,.pdf" multiple>`,
    },

    { type: 'heading', level: 2, text: 'Drag & Drop', id: 'drag-drop' },
    {
      type: 'code', language: 'javascript', filename: 'drag-drop.js',
      code: `const dropZone = document.getElementById('drop-zone');

// Prevent default to allow drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('drag-active');

  // Show feedback based on data types
  e.dataTransfer.dropEffect = 'copy';
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-active');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('drag-active');

  const files = Array.from(e.dataTransfer.files);

  // Filter valid files
  const validFiles = files.filter(f =>
    f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
  );

  if (validFiles.length < files.length) {
    showWarning(\`\${files.length - validFiles.length} files were rejected\`);
  }

  validFiles.forEach(processFile);
});

// Prevent page from opening dropped files
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());`,
    },

    { type: 'heading', level: 2, text: 'React Drag & Drop Component', id: 'react-drag-drop' },
    {
      type: 'code', language: 'tsx', filename: 'FileDropZone.tsx',
      code: `import { useState, useCallback, useRef } from 'react';

interface FileDropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
}

function FileDropZone({ onFiles, accept, maxFiles = 10, maxSizeMB = 5 }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items.length > 0) setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxFiles);
    const valid = fileArray.filter(f => f.size <= maxSizeMB * 1024 * 1024);
    if (valid.length > 0) onFiles(valid);
  }, [onFiles, maxFiles, maxSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  return (
    <div
      onDragOver={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={\`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        \${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}\`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
      <p>{isDragging ? 'Drop files here' : 'Drag files here or click to browse'}</p>
      <p className="text-sm text-gray-500">Max {maxSizeMB}MB per file</p>
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Creating & Downloading Files', id: 'creating-files' },
    {
      type: 'code', language: 'javascript', filename: 'create-download.js',
      code: `// Create a file from text
function downloadText(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Download JSON
downloadText(
  JSON.stringify(data, null, 2),
  'export.json',
  'application/json'
);

// Download CSV
function downloadCSV(headers, rows, filename) {
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell =>
      \`"\${String(cell).replace(/"/g, '""')}"\`
    ).join(','))
  ].join('\\n');

  downloadText(csv, filename, 'text/csv');
}

downloadCSV(
  ['Name', 'Email', 'Role'],
  [['Alice', 'alice@example.com', 'Admin'], ['Bob', 'bob@example.com', 'User']],
  'users.csv'
);

// Create a canvas image and download
function downloadCanvasImage(canvas, filename = 'image.png') {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}`,
    },

    { type: 'heading', level: 2, text: 'File System Access API', id: 'file-system-access' },
    { type: 'paragraph', text: 'The File System Access API (Chrome 86+) provides direct read/write access to the user\'s file system. It replaces the download trick and enables real "Open/Save" workflows:' },
    {
      type: 'code', language: 'javascript', filename: 'file-system-access.js',
      code: `// Open a file picker
async function openFile() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [{
      description: 'Text Files',
      accept: { 'text/plain': ['.txt', '.md'] },
    }],
    multiple: false,
  });

  const file = await fileHandle.getFile();
  const text = await file.text();
  return { text, fileHandle };
}

// Save to a file
async function saveFile(content, existingHandle = null) {
  const handle = existingHandle || await window.showSaveFilePicker({
    suggestedName: 'document.txt',
    types: [{
      description: 'Text File',
      accept: { 'text/plain': ['.txt'] },
    }],
  });

  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
  return handle;
}

// Open a directory
async function openDirectory() {
  const dirHandle = await window.showDirectoryPicker();

  for await (const entry of dirHandle.values()) {
    console.log(entry.kind, entry.name);
    // entry.kind: 'file' or 'directory'
  }
}`,
    },
    { type: 'callout', variant: 'info', title: 'Browser Support', text: 'File System Access API is Chromium-only (Chrome, Edge). Firefox and Safari don\'t support it. Always provide a fallback with traditional file input and download.' },

    { type: 'heading', level: 2, text: 'Processing Large Files', id: 'large-files' },
    {
      type: 'code', language: 'javascript', filename: 'large-files.js',
      code: `// Use streaming for large files to avoid loading everything into memory
async function processLargeFile(file) {
  const stream = file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let lineBuffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    lineBuffer += decoder.decode(value, { stream: true });
    const lines = lineBuffer.split('\\n');
    lineBuffer = lines.pop(); // Keep incomplete last line

    for (const line of lines) {
      processLine(line); // Process each line individually
    }
  }

  // Process remaining buffer
  if (lineBuffer) processLine(lineBuffer);
}

// Slice large files for chunked upload
async function uploadInChunks(file, chunkSizeMB = 5) {
  const chunkSize = chunkSizeMB * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await uploadChunk(chunk, i, totalChunks);
    updateProgress((i + 1) / totalChunks);
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Not revoking object URLs
const urls = [];
files.forEach(file => {
  urls.push(URL.createObjectURL(file)); // Memory leak!
});
// ✅ Fix: Revoke when no longer needed
img.onload = () => URL.revokeObjectURL(img.src);

// ❌ Mistake 2: readAsDataURL for large files
reader.readAsDataURL(largeVideoFile); // Base64 is 33% larger!
// ✅ Fix: Use createObjectURL for previews, streams for processing

// ❌ Mistake 3: Trusting file.type alone
// Users can rename .exe to .jpg — the type is based on extension
if (file.type === 'image/jpeg') { /* might not actually be JPEG */ }
// ✅ Fix: Check magic bytes for critical validation
async function isRealImage(file) {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  // JPEG starts with FF D8, PNG starts with 89 50 4E 47
  return (bytes[0] === 0xFF && bytes[1] === 0xD8) ||
         (bytes[0] === 0x89 && bytes[1] === 0x50);
}

// ❌ Mistake 4: Not handling the empty FileList
input.addEventListener('change', (e) => {
  const file = e.target.files[0]; // undefined if user cancels!
  file.name; // TypeError!
});
// ✅ Fix: Always check
const file = e.target.files?.[0];
if (!file) return;`,
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What is the difference between File, Blob, and ArrayBuffer?',
        'Why is URL.createObjectURL preferred over readAsDataURL for previews?',
        'How do you validate file type on the client side? Can it be trusted?',
        'How would you upload a large file in chunks?',
        'What is the File System Access API and what are its limitations?',
        'How do you implement drag-and-drop file upload?',
        'How can you process a large CSV file without loading it all into memory?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Use `URL.createObjectURL()` for previews — it\'s faster and uses less memory than base64',
        'Always revoke object URLs when done to prevent memory leaks',
        'Validate file size and type on both client and server',
        'Use `file.text()` and `file.arrayBuffer()` instead of FileReader when possible',
        'For large files, use streams or chunked processing',
        'Always prevent default on dragover and drop events',
        'Set the `accept` attribute on file inputs as a first filter',
        'Handle the cancel case (empty FileList) gracefully',
        'Check magic bytes for security-critical file type validation',
        'Provide both drag-and-drop and click-to-browse interfaces',
      ],
    },
  ],
};
