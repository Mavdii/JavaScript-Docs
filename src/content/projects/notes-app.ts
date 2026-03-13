import type { ProjectContent } from '@/types/content';

export const notesAppProject: ProjectContent = {
  id: 'project-notes-app',
  title: 'Notes App with Local Storage',
  description: 'Build a note-taking app with persistent local storage and markdown support.',
  slug: 'projects/notes-app',
  pillar: 'projects',
  category: 'applications',
  tags: ['notes', 'localStorage', 'React', 'markdown'],
  difficulty: 'beginner',
  contentType: 'project',
  summary: 'Learn state management and persistence by building a note app. Features include creating notes, editing with markdown, searching, and auto-saving to localStorage.',
  relatedTopics: ['local-storage', 'debouncing'],
  order: 2,
  updatedAt: '2025-06-01',
  readingTime: 20,
  featured: false,
  keywords: ['notes app', 'localStorage', 'markdown'],
  techStack: ['React', 'TypeScript', 'Tailwind CSS', 'localStorage'],
  learningGoals: ['Understand component state', 'Persist data with localStorage', 'Implement search/filter', 'Handle unsaved changes'],
  features: ['Create/edit notes', 'Markdown preview', 'Search notes', 'Auto-save', 'Dark mode'],
  sections: [
    { type: 'heading', level: 2, text: 'localStorage Basics', id: 'localstorage' },
    { type: 'paragraph', text: 'localStorage is your browser\'s built-in key-value store. Data persists across page reloads and browser sessions. Perfect for notes, preferences, and anything you don\'t need a server for.' },
    { type: 'code', language: 'typescript', code: `// Save to localStorage
localStorage.setItem('key', JSON.stringify(value));

// Read from localStorage
const value = JSON.parse(localStorage.getItem('key') ?? '{}');

// Delete
localStorage.removeItem('key');

// Listen for changes (other tabs)
window.addEventListener('storage', (e) => {
  if (e.key === 'notes') {
    console.log('Notes changed in another tab!');
  }
});` },

    { type: 'heading', level: 2, text: 'Note Type & Custom Hook', id: 'types-hook' },
    { type: 'code', language: 'typescript', code: `interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
}

function useNotes(storageKey = 'notes') {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Auto-save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  const addNote = (title: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title || 'Untitled',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    updateNote(id, { pinned: !notes.find(n => n.id === id)?.pinned });
  };

  return { notes, addNote, updateNote, deleteNote, togglePin };
}` },

    { type: 'heading', level: 2, text: 'Note Editor', id: 'editor' },
    { type: 'paragraph', text: 'The editor is where users type. We\'ll auto-save as they type, with a debounce to avoid hammering localStorage too often.' },
    { type: 'code', language: 'tsx', code: `function NoteEditor({ note, onUpdate }: {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaved, setIsSaved] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced save
  const debouncedSave = useCallback((newTitle: string, newContent: string) => {
    clearTimeout(saveTimeoutRef.current);
    setIsSaved(false);

    saveTimeoutRef.current = setTimeout(() => {
      onUpdate({ title: newTitle, content: newContent });
      setIsSaved(true);
    }, 1000);
  }, [onUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedSave(e.target.value, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    debouncedSave(title, e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b p-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="flex-1 text-2xl font-bold focus:outline-none bg-transparent"
        />
        <span className="text-xs text-gray-400">
          {isSaved ? 'Saved' : 'Saving...'}
        </span>
      </div>

      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Write something..."
        className="flex-1 p-4 resize-none focus:outline-none bg-transparent"
      />
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Markdown Preview', id: 'preview' },
    { type: 'code', language: 'tsx', code: `import { marked } from 'marked';

function NotePreview({ content }: { content: string }) {
  const html = marked(content);

  return (
    <div
      className="prose prose-sm max-w-none p-4 overflow-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function NoteSplitView({ note, onUpdate }: {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <NoteEditor note={note} onUpdate={onUpdate} />
      <NotePreview content={note.content} />
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Search & Filter', id: 'search' },
    { type: 'code', language: 'tsx', code: `function useNoteSearch(notes: Note[], query: string) {
  return useMemo(() => {
    if (!query.trim()) return notes;

    const q = query.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  }, [notes, query]);
}

function NotesApp() {
  const { notes, addNote, updateNote, deleteNote, togglePin } = useNotes();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filteredNotes = useNoteSearch(notes, search);

  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned);
  const displayNotes = [...pinnedNotes, ...unpinnedNotes];

  const selectedNote = displayNotes.find(n => n.id === selectedId);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <button
            onClick={() => {
              const note = addNote('New Note');
              setSelectedId(note.id);
            }}
            className="w-full px-3 py-2 bg-primary text-white rounded-lg"
          >
            + New Note
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="mx-2 mt-2 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {displayNotes.map(note => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={\`w-full text-left p-2 rounded \${
                selectedId === note.id ? 'bg-primary/10' : 'hover:bg-gray-100'
              }\`}
            >
              <div className="font-semibold text-sm truncate">
                {note.pinned ? '📌 ' : ''}{note.title}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area */}
      {selectedNote ? (
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4 flex gap-2">
            <button
              onClick={() => togglePin(selectedNote.id)}
              className="text-lg"
            >
              {selectedNote.pinned ? '📌' : '📍'}
            </button>
            <button
              onClick={() => {
                deleteNote(selectedNote.id);
                setSelectedId(displayNotes[0]?.id ?? null);
              }}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
          <NoteSplitView note={selectedNote} onUpdate={updates => updateNote(selectedNote.id, updates)} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a note to view or create a new one
        </div>
      )}
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Always wrap localStorage access in try/catch — it can throw if quota is exceeded',
      'Use JSON.stringify/parse for complex data types',
      'Debounce saves to avoid hammering storage on rapid changes',
      'Show a visual indicator when saving (e.g., "Saved" vs "Saving...")',
      'Use useMemo for filtering to avoid recalculating on every render',
      'Provide an export/import feature so users can backup their data',
      'Warn users before deleting notes — it\'s permanent',
    ] },
    { type: 'callout', variant: 'warning', title: 'localStorage Limits', text: 'Most browsers limit localStorage to 5-10MB per origin. For a notes app, that\'s plenty, but be aware. If you hit the limit, you\'ll get a QuotaExceededError.' },
  ],
};
