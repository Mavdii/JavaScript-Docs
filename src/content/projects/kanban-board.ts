import type { ProjectContent } from '@/types/content';

export const kanbanBoardProject: ProjectContent = {
  id: 'project-kanban-board',
  title: 'Kanban Board App',
  description: 'Build an interactive kanban board with drag-and-drop, CRUD operations, local persistence, and keyboard accessibility.',
  slug: 'projects/kanban-board',
  pillar: 'projects',
  category: 'applications',
  tags: ['kanban', 'drag-drop', 'state management', 'local storage', 'accessibility'],
  difficulty: 'intermediate',
  contentType: 'project',
  summary: 'Create a fully functional kanban board application with draggable cards across columns, real-time CRUD operations, localStorage persistence, filtering, and keyboard navigation for accessibility.',
  relatedTopics: ['recipe-drag-and-drop', 'recipe-global-state'],
  order: 8,
  updatedAt: '2025-06-01',
  readingTime: 28,
  featured: true,
  keywords: ['kanban', 'drag and drop', 'react', 'state management', 'localStorage'],
  techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand or Context'],
  learningGoals: [
    'Implement drag-and-drop with React',
    'Manage complex state with multiple columns',
    'Persist data to localStorage',
    'Handle keyboard navigation',
    'Build accessible UI components',
  ],
  features: [
    'Drag cards between columns',
    'Add/edit/delete cards and columns',
    'Filter cards by text',
    'Sort cards within column',
    'Keyboard shortcuts',
    'Dark mode support',
    'Auto-save to localStorage',
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Data Structure & State Management',
      id: 'data-structure',
    },
    {
      type: 'paragraph',
      text: 'Start with a clear data structure. Each column contains cards, and we\'ll use Zustand for state management (simpler than Redux for this project).',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Card {
  id: string;
  columnId: string;
  title: string;
  description: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface Column {
  id: string;
  title: string;
  color: string;
  cards: Card[];
  order: number;
}

interface KanbanStore {
  columns: Column[];
  selectedCardId: string | null;
  filterText: string;

  // Actions
  addColumn: (title: string, color: string) => void;
  deleteColumn: (id: string) => void;
  addCard: (columnId: string, title: string, description: string, priority: Card['priority']) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, toColumnId: string, position: number) => void;
  setFilterText: (text: string) => void;
  setSelectedCard: (id: string | null) => void;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
}

export const useKanbanStore = create<KanbanStore>()(
  devtools(
    persist(
      (set, get) => ({
        columns: [
          {
            id: 'todo',
            title: 'To Do',
            color: 'bg-blue-500',
            cards: [],
            order: 0,
          },
          {
            id: 'in-progress',
            title: 'In Progress',
            color: 'bg-yellow-500',
            cards: [],
            order: 1,
          },
          {
            id: 'done',
            title: 'Done',
            color: 'bg-green-500',
            cards: [],
            order: 2,
          },
        ],
        selectedCardId: null,
        filterText: '',

        addColumn: (title, color) =>
          set((state) => ({
            columns: [
              ...state.columns,
              {
                id: \`col-\${Date.now()}\`,
                title,
                color,
                cards: [],
                order: state.columns.length,
              },
            ],
          })),

        deleteColumn: (id) =>
          set((state) => ({
            columns: state.columns.filter((col) => col.id !== id),
          })),

        addCard: (columnId, title, description, priority) =>
          set((state) => ({
            columns: state.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    cards: [
                      ...col.cards,
                      {
                        id: \`card-\${Date.now()}\`,
                        columnId,
                        title,
                        description,
                        priority,
                        createdAt: new Date(),
                      },
                    ],
                  }
                : col
            ),
          })),

        updateCard: (cardId, updates) =>
          set((state) => ({
            columns: state.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            })),
          })),

        deleteCard: (cardId) =>
          set((state) => ({
            columns: state.columns.map((col) => ({
              ...col,
              cards: col.cards.filter((card) => card.id !== cardId),
            })),
          })),

        moveCard: (cardId, toColumnId, position) =>
          set((state) => {
            // Find and remove card from source column
            let card: Card | null = null;
            const updated = state.columns.map((col) => {
              const cardIndex = col.cards.findIndex((c) => c.id === cardId);
              if (cardIndex !== -1) {
                card = col.cards[cardIndex];
                return {
                  ...col,
                  cards: col.cards.filter((c) => c.id !== cardId),
                };
              }
              return col;
            });

            if (!card) return state;

            // Add card to target column at position
            return {
              columns: updated.map((col) =>
                col.id === toColumnId
                  ? {
                      ...col,
                      cards: [
                        ...col.cards.slice(0, position),
                        { ...card, columnId: toColumnId },
                        ...col.cards.slice(position),
                      ],
                    }
                  : col
              ),
            };
          }),

        setFilterText: (text) => set({ filterText: text }),
        setSelectedCard: (id) => set({ selectedCardId: id }),

        reorderColumns: (fromIndex, toIndex) =>
          set((state) => {
            const cols = [...state.columns];
            const [removed] = cols.splice(fromIndex, 1);
            cols.splice(toIndex, 0, removed);
            return { columns: cols };
          }),
      }),
      {
        name: 'kanban-storage',
        version: 1,
      }
    )
  )
);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Drag & Drop Implementation',
      id: 'drag-drop',
    },
    {
      type: 'paragraph',
      text: 'Use the HTML5 drag-and-drop API or a library like React Beautiful DnD. We\'ll implement with native API for learning.',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `interface CardProps {
  card: Card;
  columnId: string;
}

function CardComponent({ card, columnId }: CardProps) {
  const deleteCard = useKanbanStore((s) => s.deleteCard);
  const setSelectedCard = useKanbanStore((s) => s.setSelectedCard);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.setData('sourceColumnId', columnId);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedCard(card.id)}
      className="bg-white p-4 rounded shadow cursor-move hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-800">{card.title}</h3>
      {card.description && <p className="text-sm text-gray-600 mt-2">{card.description}</p>}

      <div className="flex items-center justify-between mt-3">
        <span
          className={\`
            text-xs px-2 py-1 rounded-full font-semibold
            \${card.priority === 'high'
              ? 'bg-red-100 text-red-800'
              : card.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'}
          \`}
        >
          {card.priority}
        </span>
        <button
          onClick={() => deleteCard(card.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface ColumnProps {
  column: Column;
  index: number;
}

function ColumnComponent({ column, index }: ColumnProps) {
  const moveCard = useKanbanStore((s) => s.moveCard);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      moveCard(cardId, column.id, column.cards.length);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={\`
        bg-gray-100 rounded-lg p-4 flex-1 min-w-80
        \${dragOver ? 'bg-blue-50 border-2 border-blue-500' : ''}
        transition-colors
      \`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={\`w-4 h-4 rounded \${column.color}\`} />
        <h2 className="font-bold text-gray-800">{column.title}</h2>
        <span className="text-xs bg-gray-300 px-2 py-1 rounded-full">
          {column.cards.length}
        </span>
      </div>

      <div className="space-y-3">
        {column.cards.map((card) => (
          <CardComponent key={card.id} card={card} columnId={column.id} />
        ))}
      </div>

      <AddCardForm columnId={column.id} />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Add Card Form Component',
      id: 'add-card-form',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `interface AddCardFormProps {
  columnId: string;
}

function AddCardForm({ columnId }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addCard = useKanbanStore((s) => s.addCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCard(columnId, title, description, priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-gray-600 hover:text-gray-800 py-2 rounded hover:bg-gray-200 transition-colors"
      >
        + Add Card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-white p-3 rounded shadow">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
        autoFocus
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-2 focus:outline-none focus:border-blue-500"
        rows={2}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as any)}
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-2 focus:outline-none focus:border-blue-500"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white rounded py-1 hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 bg-gray-300 text-gray-800 rounded py-1 hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Search & Filter',
      id: 'search-filter',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function KanbanBoard() {
  const columns = useKanbanStore((s) => s.columns);
  const filterText = useKanbanStore((s) => s.filterText);
  const setFilterText = useKanbanStore((s) => s.setFilterText);

  // Filter cards
  const filteredColumns = columns.map((col) => ({
    ...col,
    cards: col.cards.filter(
      (card) =>
        card.title.toLowerCase().includes(filterText.toLowerCase()) ||
        card.description.toLowerCase().includes(filterText.toLowerCase())
    ),
  }));

  return (
    <div className="h-screen bg-white flex flex-col">
      <header className="border-b p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Kanban Board</h1>

        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search cards..."
          className="w-full max-w-sm border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </header>

      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-6">
          {filteredColumns.map((column, idx) => (
            <ColumnComponent key={column.id} column={column} index={idx} />
          ))}
        </div>
      </main>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Keyboard Accessibility',
      id: 'accessibility',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Add keyboard navigation
function useCardKeyboardNavigation() {
  const selectedCardId = useKanbanStore((s) => s.selectedCardId);
  const setSelectedCard = useKanbanStore((s) => s.setSelectedCard);
  const columns = useKanbanStore((s) => s.columns);
  const deleteCard = useKanbanStore((s) => s.deleteCard);
  const moveCard = useKanbanStore((s) => s.moveCard);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCardId) return;

      // Find current card and column
      let currentCard: Card | null = null;
      let currentColumnIndex = -1;
      let cardIndex = -1;

      for (let i = 0; i < columns.length; i++) {
        cardIndex = columns[i].cards.findIndex((c) => c.id === selectedCardId);
        if (cardIndex !== -1) {
          currentCard = columns[i].cards[cardIndex];
          currentColumnIndex = i;
          break;
        }
      }

      if (!currentCard) return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          deleteCard(selectedCardId);
          setSelectedCard(null);
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (cardIndex > 0) {
            const prevCard = columns[currentColumnIndex].cards[cardIndex - 1];
            setSelectedCard(prevCard.id);
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (cardIndex < columns[currentColumnIndex].cards.length - 1) {
            const nextCard = columns[currentColumnIndex].cards[cardIndex + 1];
            setSelectedCard(nextCard.id);
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (currentColumnIndex > 0) {
            moveCard(selectedCardId, columns[currentColumnIndex - 1].id, 0);
            setSelectedCard(selectedCardId);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (currentColumnIndex < columns.length - 1) {
            moveCard(selectedCardId, columns[currentColumnIndex + 1].id, 0);
            setSelectedCard(selectedCardId);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCardId, columns]);
}

// Use in board component
function KanbanBoard() {
  useCardKeyboardNavigation();
  // ... rest of component
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Tips & Enhancements',
      id: 'enhancements',
    },
    {
      type: 'list',
      items: [
        'Add due dates and assign cards to team members',
        'Implement labels/tags for better organization',
        'Add card details modal for rich editing',
        'Create board templates for common workflows',
        'Add undo/redo functionality',
        'Share boards with team members (requires backend)',
        'Mobile-friendly view with stacked columns',
      ],
    },
  ],
};
