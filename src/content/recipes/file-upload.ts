import type { RecipeContent } from '@/types/content';

export const fileUploadRecipe: RecipeContent = {
  id: 'file-upload',
  title: 'File Upload',
  description: 'Build drag-and-drop file upload with progress and preview.',
  slug: 'recipes/file-upload',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['upload', 'files', 'drag-drop'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Implement file upload with drag-and-drop, preview, progress tracking, and validation.',
  relatedTopics: ['form-validation'],
  order: 3,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['upload', 'drag', 'drop', 'file', 'progress', 'preview'],
  problem: 'File uploads need visual feedback, validation, and error handling for a good UX.',
  pitfalls: [
    'No file size limits (users can upload entire disks)',
    'Missing file type validation',
    'No upload progress indicator (feels frozen)',
    'Not handling network failures during upload',
    'Memory leaks from object URLs (they never get freed)',
  ],
  variations: ['Single file upload', 'Multi-file with queue', 'Chunked upload for large files', 'Direct-to-S3 upload'],
  sections: [
    { type: 'heading', level: 2, text: 'File Validation', id: 'validation' },
    { type: 'code', language: 'typescript', filename: 'validateFile.ts', code: `interface FileValidationOptions {\\n  maxSize?: number; // bytes\\n  allowedTypes?: string[];\\n  maxFiles?: number;\\n}\\n\\nconst DEFAULT_OPTIONS: FileValidationOptions = {\\n  maxSize: 5 * 1024 * 1024, // 5MB\\n  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],\\n  maxFiles: 10,\\n};\\n\\nfunction validateFile(file: File, options = DEFAULT_OPTIONS): string | null {\\n  if (options.maxSize && file.size > options.maxSize) {\\n    return \\\`File too large — max \\\${(options.maxSize / 1024 / 1024).toFixed(1)}MB\\\`;\\n  }\\n  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {\\n    return \\\`File type not allowed — try: \\\${options.allowedTypes.join(', ')}\\\`;\\n  }\\n  return null;\\n}` },

    { type: 'heading', level: 2, text: 'Upload with Progress (XHR)', id: 'upload-progress' },
    { type: 'code', language: 'typescript', filename: 'upload.ts', code: `interface UploadProgress {\\n  loaded: number;\\n  total: number;\\n  percentage: number;\\n}\\n\\nfunction uploadFile(\\n  file: File,\\n  url: string,\\n  onProgress?: (progress: UploadProgress) => void\\n): Promise<any> {\\n  return new Promise((resolve, reject) => {\\n    const xhr = new XMLHttpRequest();\\n    const formData = new FormData();\\n    formData.append('file', file);\\n\\n    xhr.upload.addEventListener('progress', (e) => {\\n      if (e.lengthComputable && onProgress) {\\n        onProgress({\\n          loaded: e.loaded,\\n          total: e.total,\\n          percentage: (e.loaded / e.total) * 100,\\n        });\\n      }\\n    });\\n\\n    xhr.addEventListener('load', () => {\\n      if (xhr.status === 200) {\\n        resolve(JSON.parse(xhr.responseText));\\n      } else {\\n        reject(new Error(\\\`Upload failed: \\\${xhr.status}\\\`));\\n      }\\n    });\\n\\n    xhr.addEventListener('error', () => reject(new Error('Network error')));\\n    xhr.open('POST', url);\\n    xhr.send(formData);\\n  });\\n}` },

    { type: 'heading', level: 2, text: 'Upload with Fetch + Streams', id: 'fetch-upload' },
    { type: 'paragraph', text: 'For modern browsers, you can track upload progress using ReadableStream. Note: not all browsers support request body streaming yet.' },
    { type: 'code', language: 'typescript', filename: 'fetchUpload.ts', code: `async function uploadWithFetch(file: File, url: string): Promise<Response> {\\n  const formData = new FormData();\\n  formData.append('file', file);\\n\\n  const response = await fetch(url, {\\n    method: 'POST',\\n    body: formData,\\n    // Note: Don’t set Content-Type â browser sets it with boundary\\n  });\\n\\n  if (!response.ok) {\\n    throw new Error(\\\`Upload failed: \\\${response.status} \\\${response.statusText}\\\`);\\n  }\\n\\n  return response;\\n}` },

    { type: 'heading', level: 2, text: 'Drag & Drop Zone', id: 'drag-drop' },
    { type: 'code', language: 'tsx', filename: 'DropZone.tsx', code: `function DropZone({\\n  onFiles,\\n  accept = 'image/*,.pdf',\\n  multiple = true,\\n}: {\\n  onFiles: (files: File[]) => void;\\n  accept?: string;\\n  multiple?: boolean;\\n}) {\\n  const [isDragging, setIsDragging] = useState(false);\\n  const inputRef = useRef<HTMLInputElement>(null);\\n\\n  const handleDrag = (e: React.DragEvent) => {\\n    e.preventDefault();\\n    e.stopPropagation();\\n  };\\n\\n  const handleDragIn = (e: React.DragEvent) => {\\n    e.preventDefault();\\n    if (e.dataTransfer.items?.length > 0) {\\n      setIsDragging(true);\\n    }\\n  };\\n\\n  const handleDragOut = (e: React.DragEvent) => {\\n    if (e.currentTarget === e.target) {\\n      setIsDragging(false);\\n    }\\n  };\\n\\n  const handleDrop = (e: React.DragEvent) => {\\n    e.preventDefault();\\n    setIsDragging(false);\\n    const files = Array.from(e.dataTransfer.files);\\n    onFiles(files);\\n  };\\n\\n  return (\\n    <div\\n      onDrag={handleDrag}\\n      onDragIn={handleDragIn}\\n      onDragOut={handleDragOut}\\n      onDrop={handleDrop}\\n      className={\\\`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors \\\${\\n        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'\\n      }\\\`}\\n    >\\n      <input\\n        ref={inputRef}\\n        type="file"\\n        multiple={multiple}\\n        accept={accept}\\n        onChange={e => onFiles(Array.from(e.currentTarget.files || []))}\\n        className="hidden"\\n      />\\n      <div className="space-y-2">\\n        <p className="text-lg font-semibold">Drop files here</p>\\n        <p className="text-sm text-muted-foreground">or click to browse</p>\\n        <button\\n          onClick={() => inputRef.current?.click()}\\n          className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"\\n        >\\n          Browse Files\\n        </button>\\n      </div>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Image Preview', id: 'image-preview' },
    { type: 'code', language: 'tsx', filename: 'ImagePreview.tsx', code: `function useImagePreview(file: File | null) {\\n  const [preview, setPreview] = useState<string | null>(null);\\n\\n  useEffect(() => {\\n    if (!file || !file.type.startsWith('image/')) {\\n      setPreview(null);\\n      return;\\n    }\\n\\n    const url = URL.createObjectURL(file);\\n    setPreview(url);\\n\\n    // IMPORTANT: Revoke to prevent memory leak\\n    return () => URL.revokeObjectURL(url);\\n  }, [file]);\\n\\n  return preview;\\n}\\n\\nfunction ImagePreviewComponent({ file }: { file: File | null }) {\\n  const preview = useImagePreview(file);\\n  if (!preview) return null;\\n\\n  return (\\n    <div className="rounded-lg overflow-hidden">\\n      <img src={preview} alt="preview" className="max-w-sm max-h-48 object-cover" />\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Multi-File Upload Manager', id: 'multi-upload' },
    { type: 'code', language: 'typescript', filename: 'useFileUpload.ts', code: `type FileStatus = 'pending' | 'uploading' | 'success' | 'error';\\n\\ninterface FileEntry {\\n  id: string;\\n  file: File;\\n  status: FileStatus;\\n  progress: number;\\n  error?: string;\\n  url?: string;\\n}\\n\\nfunction useFileUpload(uploadUrl: string) {\\n  const [files, setFiles] = useState<FileEntry[]>([]);\\n\\n  const addFiles = (newFiles: File[]) => {\\n    const entries: FileEntry[] = newFiles.map(file => ({\\n      id: crypto.randomUUID(),\\n      file,\\n      status: 'pending',\\n      progress: 0,\\n    }));\\n    setFiles(prev => [...prev, ...entries]);\\n    entries.forEach(entry => uploadOne(entry.id));\\n  };\\n\\n  const uploadOne = async (id: string) => {\\n    const entry = files.find(f => f.id === id);\\n    if (!entry) return;\\n\\n    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading' } : f));\\n\\n    try {\\n      const response = await uploadFile(entry.file, uploadUrl, (progress) => {\\n        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: progress.percentage } : f));\\n      });\\n\\n      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'success', url: response.url } : f));\\n    } catch (err) {\\n      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: (err as Error).message } : f));\\n    }\\n  };\\n\\n  return { files, addFiles, retry: uploadOne };\\n}` },

    { type: 'heading', level: 2, text: 'Chunked Upload for Large Files', id: 'chunked-upload' },
    { type: 'code', language: 'typescript', filename: 'chunkedUpload.ts', code: `const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks\\n\\nasync function uploadChunked(\\n  file: File,\\n  url: string,\\n  onProgress?: (percentage: number) => void\\n) {\\n  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);\\n  const uploadId = crypto.randomUUID();\\n\\n  for (let i = 0; i < totalChunks; i++) {\\n    const start = i * CHUNK_SIZE;\\n    const end = Math.min(start + CHUNK_SIZE, file.size);\\n    const chunk = file.slice(start, end);\\n\\n    const formData = new FormData();\\n    formData.append('file', chunk);\\n    formData.append('uploadId', uploadId);\\n    formData.append('chunkIndex', String(i));\\n    formData.append('totalChunks', String(totalChunks));\\n\\n    const res = await fetch(url, { method: 'POST', body: formData });\\n    if (!res.ok) throw new Error('Chunk ' + i + ' upload failed');\\n\\n    const progress = ((i + 1) / totalChunks) * 100;\\n    onProgress?.(progress);\\n  }\\n}` },

    { type: 'heading', level: 2, text: 'Accessibility', id: 'accessibility' },
    { type: 'list', items: [
      'Make the drop zone keyboard-accessible (focusable, Enter to open file picker)',
      'Announce upload progress to screen readers with aria-live',
      'Provide descriptive labels for remove buttons',
      'Show file type and size alongside file names',
      'Don\'t rely only on drag-and-drop — always include a browse button',
    ]},

    { type: 'callout', variant: 'warning', title: 'Memory Leaks', text: 'Always call URL.revokeObjectURL() when cleaning up image previews. Each createObjectURL() allocates memory that won\'t be freed until the page unloads or you explicitly revoke it.' },
  ],
};
