import type { RecipeContent } from '@/types/content';

export const dragAndDropRecipe: RecipeContent = {
  id: 'recipe-drag-and-drop',
  title: 'Drag & Drop Interfaces',
  description: 'Implement drag and drop functionality with HTML5 Drag and Drop API or pointer events.',
  slug: 'recipes/drag-and-drop',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['drag-drop', 'ui', 'events', 'interaction', 'html5'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Build intuitive drag-and-drop interactions using the HTML5 Drag and Drop API or modern pointer events.',
  relatedTopics: ['events', 'dom-manipulation'],
  order: 6,
  updatedAt: '2025-06-01',
  readingTime: 11,
  featured: false,
  keywords: ['drag', 'drop', 'dnd', 'interaction', 'ui pattern'],
  problem: 'Users expect drag-and-drop functionality for rearranging items, file uploads, and complex interactions. Implementing this correctly across browsers is tricky.',
  pitfalls: [
    'Not preventing default dragover behavior (drops won\'t work)',
    'Forgetting to set dragImage for custom drag visual feedback',
    'Not handling file drops properly (need to check dataTransfer.files)',
    'Mixing Drag and Drop API with Pointer Events (they work together)',
    'Not providing visual feedback during dragging'
  ],
  variations: ['File upload', 'List reordering', 'Pointer events based', 'Touch-friendly drag'],
  sections: [
    { type: 'heading', level: 2, text: 'Basic Drag and Drop API', id: 'basic-drag-drop' },
    { type: 'code', language: 'html', filename: 'drag-drop-basic.html', code: `<!-- Make elements draggable -->
<div id="draggable" draggable="true" style="padding: 20px; background: blue; color: white;">
  Drag me
</div>

<div id="dropzone" style="padding: 40px; background: lightgray; min-height: 100px;">
  Drop here
</div>

<script>
  const draggable = document.getElementById('draggable');
  const dropzone = document.getElementById('dropzone');

  // dragstart: element starts being dragged
  draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'draggable-element');
    draggable.style.opacity = '0.5';
  });

  // dragend: dragging stops (success or cancel)
  draggable.addEventListener('dragend', (e) => {
    draggable.style.opacity = '1';
  });

  // dragover: something is being dragged over the zone
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault(); // MUST prevent default to allow drop
    e.dataTransfer.dropEffect = 'move';
    dropzone.style.background = 'lightblue';
  });

  // dragleave: left the drop zone
  dropzone.addEventListener('dragleave', (e) => {
    dropzone.style.background = 'lightgray';
  });

  // drop: released over the zone
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    console.log('Dropped:', data);
    dropzone.appendChild(draggable);
    dropzone.style.background = 'lightgray';
  });
</script>` },

    { type: 'heading', level: 2, text: 'File Upload with Drag and Drop', id: 'file-upload' },
    { type: 'code', language: 'javascript', filename: 'drag-drop-files.js', code: `// File upload dropzone
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight on drag
['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, () => {
    dropzone.classList.add('highlight');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, () => {
    dropzone.classList.remove('highlight');
  }, false);
});

// Handle dropped files
dropzone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}, false);

// Handle files from input
fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  // Filter for specific types
  const imageFiles = Array.from(files).filter(file =>
    file.type.startsWith('image/')
  );

  // Process files
  imageFiles.forEach(file => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '200px';
      dropzone.appendChild(img);
    };
    
    reader.readAsDataURL(file);
  });

  // Upload files
  uploadFiles(imageFiles);
}

async function uploadFiles(files) {
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        console.log(\`Uploaded: \${file.name}\`);
      }
    } catch (error) {
      console.error(\`Failed to upload \${file.name}:\`, error);
    }
  }
}` },

    { type: 'heading', level: 2, text: 'Reorderable List with Drag and Drop', id: 'reorderable-list' },
    { type: 'code', language: 'javascript', filename: 'drag-drop-reorder.js', code: `// Make list items draggable and droppable
const list = document.getElementById('sortableList');
let draggedElement = null;

list.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'LI') {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
  }
});

list.addEventListener('dragend', (e) => {
  if (e.target.tagName === 'LI') {
    e.target.style.opacity = '1';
    draggedElement = null;
  }
});

list.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const afterElement = getDragAfterElement(list, e.clientY);
  if (afterElement == null) {
    list.appendChild(draggedElement);
  } else {
    list.insertBefore(draggedElement, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll('li:not(.dragging)')
  ];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// With data persistence
function saveListOrder() {
  const order = Array.from(list.querySelectorAll('li')).map(li => li.textContent);
  localStorage.setItem('listOrder', JSON.stringify(order));
}

list.addEventListener('drop', saveListOrder);` },

    { type: 'heading', level: 2, text: 'Custom Drag Visual Feedback', id: 'custom-feedback' },
    { type: 'code', language: 'javascript', filename: 'drag-drop-custom.js', code: `const draggable = document.getElementById('draggable');

draggable.addEventListener('dragstart', (e) => {
  // Create custom drag image
  const dragImage = document.createElement('div');
  dragImage.textContent = 'Moving...';
  dragImage.style.background = 'rgba(0, 0, 0, 0.8)';
  dragImage.style.color = 'white';
  dragImage.style.padding = '10px';
  dragImage.style.borderRadius = '5px';
  dragImage.style.position = 'absolute';
  dragImage.style.top = '-1000px'; // Off-screen
  document.body.appendChild(dragImage);

  // Set custom drag image
  e.dataTransfer.setDragImage(dragImage, 0, 0);

  // Cleanup
  setTimeout(() => dragImage.remove(), 0);

  e.dataTransfer.effectAllowed = 'move';
});

// Visual feedback during drag
document.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('draggable')) {
    e.target.classList.add('dragging');
  }
});

document.addEventListener('dragend', (e) => {
  document.querySelectorAll('.dragging').forEach(el => {
    el.classList.remove('dragging');
  });
});

// Drop zone feedback
const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('drag-over');
  e.dataTransfer.dropEffect = 'copy';
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
});

// CSS
const style = document.createElement('style');
style.textContent = \`
  .dragging {
    opacity: 0.5;
    border: 2px dashed #999;
  }

  .drag-over {
    background: #e3f2fd !important;
    border: 2px dashed #2196f3;
  }
\`;
document.head.appendChild(style);` },

    { type: 'heading', level: 2, text: 'Pointer Events Alternative (Touch-Friendly)', id: 'pointer-events' },
    { type: 'code', language: 'javascript', filename: 'drag-drop-pointer.js', code: `// More modern and touch-friendly approach
class DragHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    
    this.init();
  }

  init() {
    this.element.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    document.addEventListener('pointermove', this.handlePointerMove.bind(this));
    document.addEventListener('pointerup', this.handlePointerUp.bind(this));
  }

  handlePointerDown(e) {
    this.isDragging = true;
    const rect = this.element.getBoundingClientRect();
    this.offset.x = e.clientX - rect.left;
    this.offset.y = e.clientY - rect.top;
    
    this.element.style.cursor = 'grabbing';
    this.element.classList.add('dragging');

    if (this.options.onDragStart) {
      this.options.onDragStart(e);
    }
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.offset.x;
    const y = e.clientY - this.offset.y;

    this.element.style.transform = \`translate(\${x}px, \${y}px)\`;

    if (this.options.onDrag) {
      this.options.onDrag({ x, y });
    }
  }

  handlePointerUp(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.element.style.cursor = 'grab';
    this.element.classList.remove('dragging');

    if (this.options.onDragEnd) {
      this.options.onDragEnd(e);
    }
  }
}

// Usage
const draggable = document.getElementById('draggable');
new DragHandler(draggable, {
  onDragStart: () => console.log('Started'),
  onDrag: (pos) => console.log('Position:', pos),
  onDragEnd: () => console.log('Ended')
});` },

    { type: 'heading', level: 2, text: 'Practical: Kanban Board', id: 'kanban-board' },
    { type: 'code', language: 'javascript', filename: 'drag-drop-kanban.js', code: `class KanbanBoard {
  constructor(selector) {
    this.board = document.querySelector(selector);
    this.draggedCard = null;
    this.init();
  }

  init() {
    this.board.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.board.addEventListener('dragend', this.handleDragEnd.bind(this));
    this.board.addEventListener('dragover', this.handleDragOver.bind(this));
    this.board.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragStart(e) {
    if (!e.target.classList.contains('card')) return;
    
    this.draggedCard = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
  }

  handleDragEnd(e) {
    if (this.draggedCard) {
      this.draggedCard.style.opacity = '1';
    }
    document.querySelectorAll('.column.drag-over').forEach(col => {
      col.classList.remove('drag-over');
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const column = e.target.closest('.column');
    if (column && column !== this.draggedCard.closest('.column')) {
      column.classList.add('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    
    if (column && this.draggedCard) {
      const cardList = column.querySelector('.cards');
      cardList.appendChild(this.draggedCard);
      this.saveState();
    }
  }

  saveState() {
    const state = {};
    this.board.querySelectorAll('.column').forEach(col => {
      const title = col.querySelector('.column-title').textContent;
      const cards = Array.from(col.querySelectorAll('.card')).map(c => c.textContent);
      state[title] = cards;
    });
    localStorage.setItem('kanbanBoard', JSON.stringify(state));
  }
}

// Initialize
new KanbanBoard('.kanban-board');` },

    { type: 'heading', level: 2, text: 'Handling Different Drop Effects', id: 'drop-effects' },
    { type: 'code', language: 'javascript', filename: 'drag-drop-effects.js', code: `// Different visual feedback based on dropEffect
const draggable = document.getElementById('draggable');
const copyZone = document.getElementById('copyZone');
const moveZone = document.getElementById('moveZone');
const linkZone = document.getElementById('linkZone');

draggable.addEventListener('dragstart', (e) => {
  e.dataTransfer.effectAllowed = 'all';
  e.dataTransfer.setData('text/plain', e.target.id);
});

// Copy effect
copyZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  copyZone.style.background = '#fff3cd';
});

copyZone.addEventListener('dragleave', () => {
  copyZone.style.background = '';
});

copyZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const original = document.getElementById(id);
  const copy = original.cloneNode(true);
  copy.id = id + '-copy-' + Date.now();
  copyZone.appendChild(copy);
  copyZone.style.background = '';
});

// Move effect
moveZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  moveZone.style.background = '#cfe9f3';
});

moveZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const element = document.getElementById(id);
  moveZone.appendChild(element);
  moveZone.style.background = '';
});

// Link effect (open in new tab)
linkZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'link';
  linkZone.style.background = '#d4edda';
});

linkZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const url = e.dataTransfer.getData('text/uri-list');
  if (url) window.open(url);
  linkZone.style.background = '';
});` },
  ],
};
